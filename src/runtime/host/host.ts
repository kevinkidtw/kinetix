import { createCompiler } from '../core/compiler';
import type {
  CompiledExpr,
  Diagnostic,
  EngineSnapshot,
  PerfStats,
  RtModel,
  RtViewElement,
  SampleChannel,
  VarBag,
} from '../core/types';
import { createControlsManager } from './controls';
import { createDashboard, type Dashboard } from './dashboard';
import { setupDragHandler } from './drag';
import {
  type EngineProxy,
  InlineEngineProxy,
  createWorkerProxyWithTimeout,
} from './engineProxy';
import {
  type DrawingPanelState,
  clearAndDrawGrid,
  createDrawingPanel,
  getDrawingHelpers,
} from './render/drawingPanel';
import {
  type PlotDataBuffer,
  type PlottingPanelState,
  appendPlotDelta,
  createPlotDataBuffer,
  createPlottingPanel,
  renderPlot,
} from './render/plot';
import {
  createVectorFieldRenderer,
  drawArrow2D,
  drawShape2D,
  drawSpring2D,
  drawTrail2D,
} from './render/shapes';

declare global {
  interface Window {
    __EJSS_MODEL__?: RtModel;
    __EJSS_OPTIONS__?: { mode?: 'preview' | 'export'; description?: string };
    simPlay?: () => void;
    simPause?: () => void;
    simStep?: () => void;
    simReset?: () => void;
    simExportCSV?: () => void;
    simSetSpeed?: (s: number) => void;
    _simRender?: () => void;
    _simSetVars?: (patch: Record<string, unknown>) => void;
  }
}

export async function startHost(): Promise<void> {
  const model = window.__EJSS_MODEL__;
  if (!model) {
    console.warn('[EjsS Host] No __EJSS_MODEL__ found on window.');
    return;
  }

  // 1. Initial Bag
  const viewVars: VarBag = Object.create(null);
  viewVars.t = 0;
  viewVars.dt = 0.05;
  viewVars._isPaused = true;
  viewVars._isLocked = model.isLocked ?? false;

  model.variables.forEach((v) => {
    if (v.type === 'boolean') {
      viewVars[v.name] = v.value === 'true';
    } else if (v.type === 'int') {
      viewVars[v.name] = parseInt(v.value, 10) || 0;
    } else if (v.type === 'String') {
      viewVars[v.name] = (v.value || '').replace(/^"|"$/g, '');
    } else {
      viewVars[v.name] = parseFloat(v.value) || 0;
    }
  });

  // 2. Compile view expressions
  const varNames = model.variables.map((v) => v.name);
  const compiler = createCompiler(varNames);
  const compiledExprs = new Map<string, CompiledExpr>();
  const initialDiagnostics: Diagnostic[] = [];

  const compileExprSafe = (key: string, src: string | undefined, elId: string, item: string) => {
    if (!src || !src.trim()) return;
    const res = compiler.expr(src.trim(), { block: 'view', pageId: elId, item });
    if (typeof res === 'function') {
      compiledExprs.set(key, res);
    } else {
      initialDiagnostics.push(res);
    }
  };

  model.viewElements.forEach((el) => {
    const p = el.properties;
    if (el.type === 'Elements.Shape2D') {
      compileExprSafe(`el:${el.id}:X`, p.X, el.id, 'X');
      compileExprSafe(`el:${el.id}:Y`, p.Y, el.id, 'Y');
      compileExprSafe(`el:${el.id}:SizeX`, p.SizeX, el.id, 'SizeX');
      compileExprSafe(`el:${el.id}:SizeY`, p.SizeY, el.id, 'SizeY');
      compileExprSafe(`el:${el.id}:Visible`, p.Visible, el.id, 'Visible');
      compileExprSafe(`el:${el.id}:Draggable`, p.Draggable, el.id, 'Draggable');
      compileExprSafe(`el:${el.id}:Transformation`, p.Transformation, el.id, 'Transformation');
    } else if (el.type === 'Elements.Spring2D') {
      compileExprSafe(`el:${el.id}:X`, p.X, el.id, 'X');
      compileExprSafe(`el:${el.id}:Y`, p.Y, el.id, 'Y');
      compileExprSafe(`el:${el.id}:SizeX`, p.SizeX, el.id, 'SizeX');
      compileExprSafe(`el:${el.id}:SizeY`, p.SizeY, el.id, 'SizeY');
      compileExprSafe(`el:${el.id}:Visible`, p.Visible, el.id, 'Visible');
    } else if (el.type === 'Elements.Arrow2D') {
      compileExprSafe(`el:${el.id}:X`, p.X, el.id, 'X');
      compileExprSafe(`el:${el.id}:Y`, p.Y, el.id, 'Y');
      compileExprSafe(`el:${el.id}:SizeX`, p.SizeX, el.id, 'SizeX');
      compileExprSafe(`el:${el.id}:SizeY`, p.SizeY, el.id, 'SizeY');
      compileExprSafe(`el:${el.id}:Visible`, p.Visible, el.id, 'Visible');
      compileExprSafe(`el:${el.id}:Draggable`, p.Draggable, el.id, 'Draggable');
    } else if (el.type === 'Elements.Trail2D') {
      compileExprSafe(`el:${el.id}:X`, p.X, el.id, 'X');
      compileExprSafe(`el:${el.id}:Y`, p.Y, el.id, 'Y');
      compileExprSafe(`el:${el.id}:Visible`, p.Visible, el.id, 'Visible');
    } else if (el.type === 'Elements.ParsedField') {
      compileExprSafe(`pf:${el.id}`, p.Value, el.id, 'Value');
    } else if (el.type === 'Elements.Readout') {
      compileExprSafe(`ro:${el.id}`, p.Value, el.id, 'Value');
    } else if (el.type === 'Elements.Label' && p.Text && p.Text.trim()) {
      // Plain (non-expression) label text is valid too, so no diagnostic here.
      const res = compiler.expr(p.Text.trim(), { block: 'view', pageId: el.id, item: 'Text' });
      if (typeof res === 'function') compiledExprs.set(`lbl:${el.id}`, res);
    }
  });

  // 3. Setup Sample Channels
  const channels: SampleChannel[] = [];
  const trailBuffers = new Map<string, [number, number][]>();
  const plotBuffers = new Map<string, PlotDataBuffer>();
  const trailCapacities = new Map<string, number>();

  model.viewElements.forEach((el) => {
    const p = el.properties;
    if (el.type === 'Elements.Trail2D') {
      const cap = parseInt(p.MaximumPoints ?? '1000', 10) || 1000;
      channels.push({
        id: `trail:${el.id}`,
        exprs: [p.X?.trim() || '0', p.Y?.trim() || '0'],
        capacity: cap,
      });
      trailBuffers.set(el.id, []);
      trailCapacities.set(el.id, cap);
    } else if (el.type === 'Elements.PlottingPanel') {
      const axisX = (p.AxisX ?? '').replace(/^"|"$/g, '').trim() || 't';
      const axisYRaw = (p.AxisY ?? '').replace(/^"|"$/g, '').trim();
      const axisYList = axisYRaw
        ? axisYRaw.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      channels.push({
        id: `plot:${el.id}`,
        exprs: [axisX, ...axisYList],
        capacity: 1000,
      });
      plotBuffers.set(el.id, createPlotDataBuffer(axisYList));
    }
  });

  // 4. Setup Engine Proxy (Worker or Main-thread)
  const reqMode = model.runtime?.mode ?? 'auto';
  let proxy: EngineProxy;

  if (reqMode === 'main') {
    proxy = new InlineEngineProxy();
  } else {
    try {
      proxy = await createWorkerProxyWithTimeout(2000);
    } catch (err) {
      console.warn('[EjsS Host] Worker fallback to main thread:', err);
      proxy = new InlineEngineProxy();
    }
  }

  // 5. Load model into Engine
  const { diagnostics: loadDiagnostics, snapshot: initialSnapshot } = await proxy.load(
    model,
    channels
  );
  const allInitialDiagnostics = [...initialDiagnostics, ...loadDiagnostics];
  if (allInitialDiagnostics.length > 0) {
    window.parent.postMessage(
      { type: 'ejss:diagnostics', diagnostics: allInitialDiagnostics },
      '*'
    );
  }

  // Apply initial snapshot
  Object.assign(viewVars, initialSnapshot.vars);

  // 6. Setup Panels & CustomDraw functions
  const drawingPanels: DrawingPanelState[] = [];
  const plottingPanels: PlottingPanelState[] = [];
  const customDrawFns = new Map<
    string,
    (
      ctx: CanvasRenderingContext2D,
      vars: VarBag,
      toPixX: (x: number) => number,
      toPixY: (y: number) => number,
      toPixLen: (l: number) => number,
      W: number,
      H: number,
      drawVF: unknown,
      setVars: (patch: Record<string, unknown>) => void
    ) => void
  >();

  model.viewElements.forEach((el) => {
    if (el.type === 'Elements.DrawingPanel') {
      const c = document.getElementById(`dp_${el.id}`) as HTMLCanvasElement | null;
      if (c) {
        drawingPanels.push(createDrawingPanel(c, el.id, el.name, el.properties));
      }
    } else if (el.type === 'Elements.PlottingPanel') {
      const c = document.getElementById(`pp_${el.id}`) as HTMLCanvasElement | null;
      if (c) {
        plottingPanels.push(createPlottingPanel(c, el.id, el.name, el.properties));
      }
    } else if (el.type === 'Elements.CustomDraw') {
      try {
        const fn = new Function(
          'ctx',
          'vars',
          'toPixX',
          'toPixY',
          'toPixLen',
          'W',
          'H',
          'drawVectorField',
          'setVars',
          el.properties.Code || ''
        ) as (
          ctx: CanvasRenderingContext2D,
          vars: VarBag,
          toPixX: (x: number) => number,
          toPixY: (y: number) => number,
          toPixLen: (l: number) => number,
          W: number,
          H: number,
          drawVF: unknown,
          setVars: (patch: Record<string, unknown>) => void
        ) => void;
        customDrawFns.set(el.id, fn);
      } catch (err) {
        console.warn(`[EjsS Host] CustomDraw error on ${el.name}:`, err);
      }
    }
  });

  function getPanelForEl(parentName?: string): DrawingPanelState | undefined {
    if (!drawingPanels.length) return undefined;
    if (!parentName) return drawingPanels[0];
    return (
      drawingPanels.find((p) => p.id === parentName || p.name === parentName) ??
      drawingPanels[0]
    );
  }

  const CANVAS_SHAPE_TYPES = new Set([
    'Elements.Shape2D',
    'Elements.Spring2D',
    'Elements.Arrow2D',
    'Elements.Trail2D',
  ]);

  // Element selected in the editor's element list (preview only). DOM-based
  // elements get an outline; shapes drawn on a canvas get a dashed box.
  let highlightId: string | null = null;
  let highlightFallback: HTMLElement | null = null;

  function drawHighlightBox(
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    name: string,
    hover = false
  ) {
    const pad = 7;
    const l = Math.min(x0, x1) - pad;
    const t = Math.min(y0, y1) - pad;
    const w = Math.abs(x1 - x0) + 2 * pad;
    const h = Math.abs(y1 - y0) + 2 * pad;
    const color = hover ? '#2F6FB0' : '#E9A23B';
    ctx.save();
    ctx.fillStyle = hover ? 'rgba(47,111,176,0.10)' : 'rgba(233,162,59,0.14)';
    ctx.fillRect(l, t, w, h);
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.strokeRect(l, t, w, h);
    ctx.setLineDash([]);
    ctx.font = '600 12px system-ui, sans-serif';
    const tw = ctx.measureText(name).width + 10;
    const ty = t - 20 < 0 ? t + h + 2 : t - 20;
    ctx.fillStyle = color;
    ctx.fillRect(l, ty, tw, 18);
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, l + 5, ty + 9);
    ctx.restore();
  }

  /** Pixel box of a canvas-drawn element, or null when nothing is drawn. */
  function highlightBoxOf(
    el: RtViewElement,
    helpers: ReturnType<typeof getDrawingHelpers>
  ): [number, number, number, number] | null {
    const num = (key: string, dflt: number) =>
      Number(compiledExprs.get(`el:${el.id}:${key}`)?.(viewVars) ?? dflt);
    const { toPixX, toPixY, toPixLen } = helpers;
    if (el.type === 'Elements.Shape2D') {
      const px = toPixX(num('X', 0));
      const py = toPixY(num('Y', 0));
      const sx = toPixLen(num('SizeX', 0.3) || 0.3);
      const sy = toPixLen(num('SizeY', 0.3) || 0.3);
      return [px - sx, py - sy, px + sx, py + sy];
    }
    if (el.type === 'Elements.Spring2D' || el.type === 'Elements.Arrow2D') {
      const x = num('X', 0);
      const y = num('Y', 0);
      const dx = num('SizeX', el.type === 'Elements.Spring2D' ? 2 : 1);
      const dy = num('SizeY', 0);
      return [toPixX(x), toPixY(y), toPixX(x + dx), toPixY(y + dy)];
    }
    if (el.type === 'Elements.Trail2D') {
      const pts = trailBuffers.get(el.id) ?? [];
      if (!pts.length) return null;
      let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
      for (const [x, y] of pts) {
        const px = toPixX(x);
        const py = toPixY(y);
        x0 = Math.min(x0, px);
        y0 = Math.min(y0, py);
        x1 = Math.max(x1, px);
        y1 = Math.max(y1, py);
      }
      return [x0, y0, x1, y1];
    }
    return null;
  }

  function setHighlightFallback(target: HTMLElement | null) {
    if (highlightFallback === target) return;
    highlightFallback?.classList.remove('sim-hl');
    highlightFallback = target;
    target?.classList.add('sim-hl');
  }

  function applyHighlight(id: string | null) {
    highlightId = id;
    document.querySelectorAll('.sim-hl').forEach((n) => n.classList.remove('sim-hl'));
    highlightFallback = null;
    const el = id ? model!.viewElements.find((e) => e.id === id) : undefined;
    let target: HTMLElement | null = null;
    if (el) {
      target = document.querySelector<HTMLElement>(`[data-el="${CSS.escape(el.id)}"]`);
      if (target) {
        target.classList.add('sim-hl');
      } else {
        // Drawn on a drawing panel: point at that panel.
        target = getPanelForEl(el.parent)?.canvas ?? null;
        if (el.type === 'Elements.CustomDraw') setHighlightFallback(target);
      }
    }
    if (target && window.parent !== window) {
      const r = target.getBoundingClientRect();
      window.parent.postMessage({ type: 'ejss:highlightRect', top: r.top, bottom: r.bottom }, '*');
    }
    requestRender();
  }

  // ── Pick mode: click an element in the preview to select it in the editor ──
  // While it is on, clicks never reach controls or drag handlers; hovering
  // outlines the element a click would pick.
  let pickMode = false;
  let hoverId: string | null = null;
  let hoverEl: HTMLElement | null = null;

  function distToSegment(px: number, py: number, x0: number, y0: number, x1: number, y1: number) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len2 = dx * dx + dy * dy;
    const u = len2 ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / len2)) : 0;
    return Math.hypot(px - (x0 + u * dx), py - (y0 + u * dy));
  }

  /** Topmost element drawn on `panel` at canvas pixel (px, py). */
  function pickOnPanel(panel: DrawingPanelState, px: number, py: number): string {
    const helpers = getDrawingHelpers(panel);
    const els = model!.viewElements.filter((el) => getPanelForEl(el.parent) === panel);
    for (let i = els.length - 1; i >= 0; i--) {
      const el = els[i];
      if (!CANVAS_SHAPE_TYPES.has(el.type)) continue;
      const visible = compiledExprs.get(`el:${el.id}:Visible`);
      try {
        if (visible && !visible(viewVars)) continue;
      } catch {
        // drawn as visible when the expression fails, so pickable too
      }
      const b = highlightBoxOf(el, helpers);
      if (!b) continue;
      const [x0, y0, x1, y1] = b;
      if (el.type === 'Elements.Shape2D') {
        if (px >= Math.min(x0, x1) - 4 && px <= Math.max(x0, x1) + 4 && py >= Math.min(y0, y1) - 4 && py <= Math.max(y0, y1) + 4) return el.id;
      } else if (el.type === 'Elements.Trail2D') {
        const pts = trailBuffers.get(el.id) ?? [];
        for (let k = 1; k < pts.length; k++) {
          const d = distToSegment(
            px, py,
            helpers.toPixX(pts[k - 1][0]), helpers.toPixY(pts[k - 1][1]),
            helpers.toPixX(pts[k][0]), helpers.toPixY(pts[k][1])
          );
          if (d <= 6) return el.id;
        }
      } else if (distToSegment(px, py, x0, y0, x1, y1) <= 8) {
        return el.id;
      }
    }
    // Nothing specific under the pointer: custom drawing on this panel, else the panel.
    const custom = els.filter((el) => el.type === 'Elements.CustomDraw').at(-1);
    return custom?.id ?? panel.id;
  }

  function pickAt(e: MouseEvent): string | null {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return null;
    const panel = drawingPanels.find((p) => p.canvas === target);
    if (panel) {
      const r = panel.canvas.getBoundingClientRect();
      const px = ((e.clientX - r.left) * panel.logicalW) / (r.width || 1);
      const py = ((e.clientY - r.top) * panel.logicalH) / (r.height || 1);
      return pickOnPanel(panel, px, py);
    }
    return target.closest<HTMLElement>('[data-el]')?.dataset.el ?? null;
  }

  function setHover(id: string | null) {
    if (id === hoverId) return;
    hoverId = id;
    hoverEl?.classList.remove('sim-hover');
    hoverEl = null;
    const el = id ? model!.viewElements.find((v) => v.id === id) : undefined;
    // Shapes drawn on a canvas get their hover box in renderAll instead.
    if (el && !CANVAS_SHAPE_TYPES.has(el.type)) {
      hoverEl =
        document.querySelector<HTMLElement>(`[data-el="${CSS.escape(el.id)}"]`) ??
        getPanelForEl(el.parent)?.canvas ??
        null;
      hoverEl?.classList.add('sim-hover');
    }
    requestRender();
  }

  function setPickMode(on: boolean) {
    pickMode = on;
    document.body.classList.toggle('sim-picking', on);
    if (!on) setHover(null);
  }

  const swallow = (e: Event) => {
    if (!pickMode) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  for (const type of ['mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend', 'wheel']) {
    window.addEventListener(type, swallow, { capture: true, passive: false });
  }
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (!pickMode) return;
      swallow(e);
      const id = pickAt(e);
      if (id && window.parent !== window) window.parent.postMessage({ type: 'ejss:pick', id }, '*');
    },
    { capture: true }
  );
  window.addEventListener(
    'pointermove',
    (e) => {
      if (!pickMode) return;
      e.stopImmediatePropagation();
      setHover(pickAt(e));
    },
    { capture: true }
  );
  document.documentElement.addEventListener('mouseleave', () => setHover(null));
  window.addEventListener('keydown', (e) => {
    if (pickMode && e.key === 'Escape' && window.parent !== window) {
      window.parent.postMessage({ type: 'ejss:pickExit' }, '*');
    }
  });

  // 7. Render function
  function renderAll() {
    let hlDrawn = false;
    let hlPanel: DrawingPanelState | null = null;
    // 7.1 Drawing panels
    drawingPanels.forEach((panel) => {
      clearAndDrawGrid(panel);
      const helpers = getDrawingHelpers(panel);

      model!.viewElements.forEach((el) => {
        const p = el.properties;
        const targetPanel = getPanelForEl(el.parent);
        if (targetPanel && targetPanel !== panel) return;

        const isVisible = p.Visible
          ? Boolean(compiledExprs.get(`el:${el.id}:Visible`)?.(viewVars) ?? true)
          : true;
        if (!isVisible) return;

        if (el.type === 'Elements.Shape2D') {
          const x = Number(compiledExprs.get(`el:${el.id}:X`)?.(viewVars) ?? 0);
          const y = Number(compiledExprs.get(`el:${el.id}:Y`)?.(viewVars) ?? 0);
          const sizeX = Number(compiledExprs.get(`el:${el.id}:SizeX`)?.(viewVars) ?? 0.3);
          const sizeY = Number(compiledExprs.get(`el:${el.id}:SizeY`)?.(viewVars) ?? 0.3);
          const transformation = Number(
            compiledExprs.get(`el:${el.id}:Transformation`)?.(viewVars) ?? 0
          );

          drawShape2D(panel.ctx, helpers, {
            x,
            y,
            sizeX,
            sizeY,
            fillColor: p.FillColor,
            lineColor: p.LineColor,
            transformation,
            shapeType: p.ShapeType,
          });
        } else if (el.type === 'Elements.Spring2D') {
          const x = Number(compiledExprs.get(`el:${el.id}:X`)?.(viewVars) ?? 0);
          const y = Number(compiledExprs.get(`el:${el.id}:Y`)?.(viewVars) ?? 0);
          const sizeX = Number(compiledExprs.get(`el:${el.id}:SizeX`)?.(viewVars) ?? 2);
          const sizeY = Number(compiledExprs.get(`el:${el.id}:SizeY`)?.(viewVars) ?? 0);

          drawSpring2D(panel.ctx, helpers, {
            x,
            y,
            sizeX,
            sizeY,
            lineColor: p.LineColor,
          });
        } else if (el.type === 'Elements.Arrow2D') {
          const x = Number(compiledExprs.get(`el:${el.id}:X`)?.(viewVars) ?? 0);
          const y = Number(compiledExprs.get(`el:${el.id}:Y`)?.(viewVars) ?? 0);
          const sizeX = Number(compiledExprs.get(`el:${el.id}:SizeX`)?.(viewVars) ?? 1);
          const sizeY = Number(compiledExprs.get(`el:${el.id}:SizeY`)?.(viewVars) ?? 0);

          drawArrow2D(panel.ctx, helpers, {
            x,
            y,
            sizeX,
            sizeY,
            fillColor: p.FillColor,
            lineColor: p.LineColor,
          });
        } else if (el.type === 'Elements.Trail2D') {
          const pts = trailBuffers.get(el.id) ?? [];
          drawTrail2D(panel.ctx, helpers, pts, p.LineColor);
        }
        if (el.id === hoverId && el.id !== highlightId && CANVAS_SHAPE_TYPES.has(el.type)) {
          const b = highlightBoxOf(el, helpers);
          if (b) drawHighlightBox(panel.ctx, b[0], b[1], b[2], b[3], el.name, true);
        }
        if (el.id === highlightId && CANVAS_SHAPE_TYPES.has(el.type)) {
          hlPanel = panel;
          const b = highlightBoxOf(el, helpers);
          if (b) {
            drawHighlightBox(panel.ctx, b[0], b[1], b[2], b[3], el.name);
            hlDrawn = true;
          }
        }
        if (el.type === 'Elements.CustomDraw') {
          const fn = customDrawFns.get(el.id);
          if (fn) {
            try {
              const vf = createVectorFieldRenderer(panel.ctx, helpers);
              fn(
                panel.ctx,
                viewVars,
                helpers.toPixX,
                helpers.toPixY,
                helpers.toPixLen,
                helpers.W,
                helpers.H,
                vf,
                setViewVars
              );
            } catch (err) {
              console.warn(`[EjsS Host] CustomDraw error:`, err);
            }
          }
        }
      });
    });

    // A selected shape that is hidden or not drawn yet: outline its panel.
    if (hlPanel) setHighlightFallback(hlDrawn ? null : (hlPanel as DrawingPanelState).canvas);

    // 7.2 Plotting panels
    plottingPanels.forEach((pp) => {
      const buffer = plotBuffers.get(pp.id);
      if (buffer) {
        renderPlot(pp, buffer, viewVars);
      }
    });

    // 7.3 Controls update
    controlsManager.update(viewVars);
    dashboard?.update(viewVars);

    // Frame counter for FPS
    frameCount++;
  }

  // 8. Snapshot processing
  function processSnapshot(snapshot: EngineSnapshot) {
    Object.assign(viewVars, snapshot.vars);
    if (viewPatchInFlight) {
      Object.assign(viewVars, viewPatchInFlight);
      viewPatchInFlight = null;
    }

    // Process sample deltas
    for (const [channelId, delta] of Object.entries(snapshot.samples)) {
      if (channelId.startsWith('trail:')) {
        const elId = channelId.slice(6);
        const pts = trailBuffers.get(elId);
        const cap = trailCapacities.get(elId) ?? 1000;
        if (pts && delta.length >= 2) {
          for (let i = 0; i < delta.length; i += 2) {
            pts.push([delta[i], delta[i + 1]]);
          }
          if (pts.length > cap) {
            pts.splice(0, pts.length - cap);
          }
        }
      } else if (channelId.startsWith('plot:')) {
        const elId = channelId.slice(5);
        const buffer = plotBuffers.get(elId);
        const pp = plottingPanels.find((p) => p.id === elId);
        if (buffer && pp && delta.length > 0) {
          appendPlotDelta(buffer, delta, pp.axisYList, 1000);
        }
      }
    }

    // Diagnostics forwarding
    if (snapshot.diagnostics.length > 0) {
      window.parent.postMessage(
        { type: 'ejss:diagnostics', diagnostics: snapshot.diagnostics },
        '*'
      );
    }
  }

  // 9. Controls manager, data dashboard & drag handlers
  const controlsManager = createControlsManager(compiledExprs);
  const dashboard: Dashboard | null = createDashboard(
    document.getElementById('sim-dashboard'),
    model.viewElements,
    compiledExprs,
    model.info.title
  );

  const controlActions = {
    onPlay: () => doPlay(),
    onPause: () => doPause(),
    onReset: () => doReset(),
    onStep: () => doStep(),
    onRender: () => renderAll(),
    onSetVars: (patch: Record<string, unknown>) => setViewVars(patch),
    onExec: (code: string) => {
      proxy.exec(code);
      refreshWhilePaused();
    },
  };

  controlsManager.bind(model.viewElements, controlActions);

  drawingPanels.forEach((panel) => {
    setupDragHandler({
      panel,
      elements: model!.viewElements,
      viewVars,
      compiledExprs,
      setVars: (patch) => setViewVars(patch),
    });
  });

  // 10. Simulation Loop with Backpressure
  let running = false;
  let rafId: number | null = null;
  let lastTs: number | null = null;
  let pendingDt = 0;
  let isAdvanceInFlight = false;
  let frameCount = 0;
  let lastFpsTs = performance.now();
  let currentFps = 60;
  let lastPerf: Pick<PerfStats, 'stepsPerSec' | 'realtimeRatio'> = {
    stepsPerSec: 0,
    realtimeRatio: 1,
  };

  // Variables changed from the view side (mouse drag, sliders, CustomDraw
  // interaction). The engine owns the authoritative copy, so every patch must
  // reach it; otherwise the next snapshot silently overwrites the change. A
  // snapshot from an advance() already in flight was taken before the engine
  // saw the patch, so the patch is kept and re-applied on top of it.
  let viewPatchInFlight: Record<string, unknown> | null = null;
  let renderQueued = false;
  let isRefreshInFlight = false;

  function requestRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      renderAll();
    });
  }

  function setViewVars(patch: Record<string, unknown>) {
    Object.assign(viewVars, patch);
    proxy.setVars(patch);
    if (isAdvanceInFlight || isRefreshInFlight) {
      viewPatchInFlight = Object.assign(viewPatchInFlight ?? {}, patch);
    }
    requestRender();
    refreshWhilePaused();
  }

  // While paused nothing pulls snapshots, so values the engine derives from a
  // patch (constraint pages, button actions) would stay stale until the next
  // play. Pull one snapshot; repeat if more patches arrived meanwhile.
  function refreshWhilePaused() {
    if (running || isRefreshInFlight) return;
    isRefreshInFlight = true;
    proxy
      .snapshot()
      .then((snapshot) => {
        isRefreshInFlight = false;
        if (running) return;
        const hadLatePatch = viewPatchInFlight !== null;
        processSnapshot(snapshot);
        requestRender();
        if (hadLatePatch) refreshWhilePaused();
      })
      .catch((err) => {
        isRefreshInFlight = false;
        console.error('[EjsS Host] snapshot error:', err);
      });
  }

  function loop(ts: number) {
    if (lastTs === null) lastTs = ts;
    const realDt = Math.min((ts - lastTs) / 1000, 0.25);
    lastTs = ts;

    if (running) {
      pendingDt += realDt;
      if (!isAdvanceInFlight && pendingDt > 0) {
        isAdvanceInFlight = true;
        const sendDt = pendingDt;
        pendingDt = 0;

        proxy
          .advance(sendDt)
          .then((snapshot) => {
            isAdvanceInFlight = false;
            lastPerf = snapshot.perf;
            processSnapshot(snapshot);
            renderAll();
          })
          .catch((err) => {
            isAdvanceInFlight = false;
            console.error('[EjsS Host] advance error:', err);
          });
      }
    }

    if (running) {
      rafId = requestAnimationFrame(loop);
    }
  }

  function doPlay() {
    if (!running) {
      running = true;
      viewVars._isPaused = false;
      lastTs = null;
      pendingDt = 0;
      rafId = requestAnimationFrame(loop);
    }
  }

  function doPause() {
    running = false;
    viewVars._isPaused = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    renderAll();
  }

  async function doStep() {
    const snapshot = await proxy.step();
    lastPerf = snapshot.perf;
    processSnapshot(snapshot);
    renderAll();
  }

  async function doReset() {
    doPause();
    trailBuffers.forEach((pts) => {
      pts.length = 0;
    });
    plotBuffers.forEach((buf) => {
      buf.xs.length = 0;
      for (const key of Object.keys(buf.series)) {
        buf.series[key] = [];
      }
    });

    viewPatchInFlight = null;
    const snapshot = await proxy.reset();
    processSnapshot(snapshot);
    renderAll();
  }

  // 11. Status heartbeat (every 500ms)
  setInterval(() => {
    const now = performance.now();
    const elapsed = (now - lastFpsTs) / 1000;
    if (elapsed >= 0.5) {
      currentFps = Math.round(frameCount / elapsed);
      frameCount = 0;
      lastFpsTs = now;
    }

    const perf: PerfStats = {
      stepsPerSec: lastPerf.stepsPerSec,
      realtimeRatio: lastPerf.realtimeRatio,
      fps: currentFps,
    };

    window.parent.postMessage(
      {
        type: 'ejss:status',
        running,
        t: viewVars.t,
        perf,
        mode: proxy.mode,
      },
      '*'
    );
  }, 500);

  // 12. Message listener for parent / editor control
  window.addEventListener('message', async (e: MessageEvent) => {
    const data = e.data;
    if (data === 'play') doPlay();
    else if (data === 'pause') doPause();
    else if (data === 'step') doStep();
    else if (data === 'reset') doReset();
    else if (data === 'exportCSV') {
      const csv = await proxy.exportCSV();
      window.parent.postMessage(
        { type: 'csvData', csv, title: model.info.title || 'simulation' },
        '*'
      );
    } else if (data && typeof data === 'object') {
      if (data.type === 'ejss:setSpeed') {
        proxy.setSpeed(data.speed);
      } else if (data.type === 'ejss:setVars') {
        setViewVars(data.patch);
      } else if (data.type === 'ejss:highlight') {
        applyHighlight(typeof data.id === 'string' ? data.id : null);
      } else if (data.type === 'ejss:pickMode') {
        setPickMode(Boolean(data.on));
      }
    }
  });
  // Let the editor re-send settings (speed, selection) to this fresh page.
  if (window.parent !== window) window.parent.postMessage({ type: 'ejss:ready' }, '*');

  // 13. Expose functions to window (for standalone export HTML UI)
  window.simPlay = doPlay;
  window.simPause = doPause;
  window.simStep = doStep;
  window.simReset = doReset;
  window.simSetSpeed = (s: number) => proxy.setSpeed(s);
  window.simExportCSV = async () => {
    const csv = await proxy.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.info.title || 'simulation'}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  window._simRender = renderAll;
  window._simSetVars = setViewVars;

  // 14. Responsive layout.
  // Wide containers: the whole simulation is scaled uniformly to fit.
  // Narrow containers (phones): panels are scaled to the container width and
  // the controls are re-flowed into full-size rows so they stay readable and
  // tappable. The resulting height is applied to the container (export page)
  // or reported to the embedding editor, which sizes the iframe to match.
  const NARROW_MAX_W = 480;
  const NARROW_ROW_H = 52;
  let reportedHeight: number | null | undefined;
  let simContentH = 0;

  // Tell the embedding editor how tall the iframe content is (null = let it
  // use the simulation's aspect ratio).
  function reportHeight() {
    const dashEl = dashboard?.el;
    const inBodyDash = dashEl !== undefined && dashEl.parentElement === document.body;
    if (inBodyDash) dashEl.style.top = `${simContentH}px`;
    const narrowNow = document.getElementById('sim-root')?.classList.contains('narrow') ?? false;
    const report =
      narrowNow || inBodyDash ? Math.ceil(simContentH + (inBodyDash ? dashEl.offsetHeight : 0)) : null;
    if (report !== reportedHeight) {
      reportedHeight = report;
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'ejss:contentHeight', height: report }, '*');
      }
    }
  }

  function reflowControls(panel: HTMLElement, width: number): number {
    const items = Array.from(panel.children).filter(
      (c): c is HTMLElement => c instanceof HTMLElement && c.hasAttribute('data-w')
    );
    if (!items.length) return 0;
    const pad = 8;
    const gap = 6;
    const cols = width < 360 ? 1 : 2;
    const colW = (width - 2 * pad - gap * (cols - 1)) / cols;
    items.forEach((el, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      el.style.left = `${pad + col * (colW + gap)}px`;
      el.style.top = `${pad + row * (NARROW_ROW_H + gap)}px`;
      el.style.width = `${colW}px`;
      el.style.height = `${NARROW_ROW_H}px`;
      const fs = el.getAttribute('data-fs');
      if (fs) el.style.fontSize = `${Math.max(14, parseFloat(fs))}px`;
    });
    const rows = Math.ceil(items.length / cols);
    return 2 * pad + rows * NARROW_ROW_H + (rows - 1) * gap;
  }

  function resizeAll() {
    const root = document.getElementById('sim-root');
    if (!root) return;

    const bbwAttr = parseFloat(root.getAttribute('data-w') || '400') || 400;
    const bbhAttr = parseFloat(root.getAttribute('data-h') || '400') || 400;

    // Measure the element the simulation lives in: the iframe body in the
    // editor preview, the stage wrapper in an exported page.
    const container = root.parentElement ?? document.body;
    const inBody = container === document.body;
    const w = inBody
      ? window.innerWidth || document.documentElement.clientWidth || 0
      : container.clientWidth;
    if (!w) return;
    const narrow = w < NARROW_MAX_W;
    // In the editor preview the dashboard sits below the simulation inside
    // the same iframe, so the iframe height follows the content: fit width.
    const bodyDashboard = inBody && dashboard !== null;
    const widthOnly = narrow || bodyDashboard;
    if (!narrow && !inBody) container.style.height = '';
    const h = inBody
      ? window.innerHeight || document.documentElement.clientHeight || 0
      : container.clientHeight;
    if (!widthOnly && !h) return;

    let s = widthOnly ? w / bbwAttr : Math.min(w / bbwAttr, h / bbhAttr);
    if (!s || s < 0.05 || !Number.isFinite(s)) s = 1;

    const ctrlPanel = document.getElementById('ctrl-panel');
    const chartPanel = document.getElementById('chart-panel');
    const mainPanel = document.getElementById('main-panel');

    // Scale absolute sizes & positions
    const els = document.querySelectorAll<HTMLElement>('#sim-root, #sim-root [data-w]');
    root.classList.toggle('narrow', narrow);
    els.forEach((el) => {
      if (narrow && ctrlPanel && ctrlPanel.contains(el)) return;
      const ox = parseFloat(el.getAttribute('data-x') || '0');
      const oy = parseFloat(el.getAttribute('data-y') || '0');
      const ow = parseFloat(el.getAttribute('data-w') || '0');
      const oh = parseFloat(el.getAttribute('data-h') || '0');
      el.style.left = `${ox * s}px`;
      el.style.top = `${oy * s}px`;
      el.style.width = `${ow * s}px`;
      el.style.height = `${oh * s}px`;

      const fs = el.getAttribute('data-fs');
      if (fs) {
        el.style.fontSize = `${parseFloat(fs) * s}px`;
      }
    });

    // Text inside controls (slider label & value) carries data-fs only.
    document.querySelectorAll<HTMLElement>('#sim-root [data-fs]:not([data-w])').forEach((el) => {
      const fs = parseFloat(el.getAttribute('data-fs') || '0');
      const inCtrl = narrow && ctrlPanel?.contains(el);
      el.style.fontSize = `${inCtrl ? Math.max(13, fs) : fs * s}px`;
    });

    let contentH = bbhAttr * s;
    if (narrow) {
      const mainH = parseFloat(mainPanel?.getAttribute('data-h') || '0') * s;
      let ctrlH = 0;
      if (ctrlPanel) {
        ctrlH = reflowControls(ctrlPanel, w);
        ctrlPanel.style.left = '0px';
        ctrlPanel.style.top = `${mainH}px`;
        ctrlPanel.style.width = `${w}px`;
        ctrlPanel.style.height = `${ctrlH}px`;
      }
      const chartH = parseFloat(chartPanel?.getAttribute('data-h') || '0') * s;
      if (chartPanel) chartPanel.style.top = `${mainH + ctrlH}px`;
      contentH = mainH + ctrlH + chartH;
      root.style.height = `${contentH}px`;
      if (!inBody) container.style.height = `${Math.ceil(contentH)}px`;
    }

    simContentH = contentH;
    reportHeight();

    // Resize canvas buffers
    const dpr = window.devicePixelRatio || 1;

    // Canvases keep their design size as the drawing coordinate system and
    // are scaled as a whole, so text and pixel-positioned drawings in
    // CustomDraw code keep their layout at any screen size.
    [...drawingPanels, ...plottingPanels].forEach((panel) => {
      const c = panel.canvas;
      const ow = parseFloat(c.getAttribute('data-w') || '0');
      const oh = parseFloat(c.getAttribute('data-h') || '0');
      if (ow > 0 && oh > 0) {
        c.width = Math.round(ow * s * dpr);
        c.height = Math.round(oh * s * dpr);
        panel.logicalW = ow;
        panel.logicalH = oh;
        const ctx = c.getContext('2d')!;
        ctx.setTransform(dpr * s, 0, 0, dpr * s, 0, 0);
      }
    });

    renderAll();
  }

  let resizeQueued = false;
  function queueResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      resizeAll();
    });
  }

  window.addEventListener('resize', queueResize);
  const simRoot = document.getElementById('sim-root');
  if (simRoot?.parentElement && simRoot.parentElement !== document.body && 'ResizeObserver' in window) {
    // The exported page sizes the stage with CSS, which can change without a
    // window resize (e.g. the layout switching between one and two columns).
    let lastW = -1;
    new ResizeObserver((entries) => {
      const cw = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(cw - lastW) < 0.5) return;
      lastW = cw;
      queueResize();
    }).observe(simRoot.parentElement);
  }
  if (dashboard && 'ResizeObserver' in window) {
    // Recording rows or re-flowing cards changes the dashboard height.
    new ResizeObserver(() => reportHeight()).observe(dashboard.el);
  }
  resizeAll();
  setTimeout(resizeAll, 50);
  setTimeout(resizeAll, 150);
  setTimeout(resizeAll, 400);

  // Initial render
  renderAll();
}

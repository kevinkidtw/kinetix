import RUNTIME_SRC from '../runtime-dist/ejss-runtime.js?raw';
import type { RtModel, SolverMethod } from '../runtime/core/types';
import {
  type ElLayout,
  computePanelLayout,
  computeSimBBox,
} from '../runtime/host/layout';
import type { SimulationState } from '../types/simulation';
import { serializeToEjssXML } from './ejssParser';

export { computeSimBBox };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function stateToRtModel(state: SimulationState): RtModel {
  return {
    info: {
      title: state.info.title || '',
      author: state.info.author,
      keywords: state.info.keywords,
      abstract: state.info.abstract,
    },
    variables: state.variables.map((v) => ({
      name: v.name,
      value: v.value,
      type: v.type,
      scope: v.scope,
    })),
    odePages: state.odePages.map((p) => ({
      id: p.id,
      name: p.name,
      rates: p.rates.map((r) => ({ state: r.state, expression: r.expression })),
      method: p.method as SolverMethod,
      increment: p.increment,
    })),
    constraintPages: state.constraintPages.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
    })),
    initPages: state.initPages.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
    })),
    viewElements: state.viewElements.map((el) => ({
      id: el.id,
      type: el.type,
      name: el.name,
      parent: el.parent,
      properties: { ...el.properties },
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
    })),
    isLocked: state.isLocked,
  };
}

function renderLayoutItem({ el, x, y, w, h }: ElLayout): string {
  const pos = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  const p = el.properties;

  switch (el.type) {
    case 'Elements.DrawingPanel':
      return `<canvas id="dp_${el.id}" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" style="${pos}" width="${w}" height="${h}"></canvas>`;
    case 'Elements.PlottingPanel':
      return `<canvas id="pp_${el.id}" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" style="${pos}" width="${w}" height="${h}"></canvas>`;
    case 'Elements.Button': {
      const txt = (p.Text || '"按鈕"').replace(/^"|"$/g, '');
      return `<button id="btn_${el.id}" class="sim-btn" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" data-fs="14" style="${pos}">${escapeHtml(txt)}</button>`;
    }
    case 'Elements.TwoStateButton':
      return `<button id="tsb_${el.id}" class="sim-btn tsb-btn" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" data-fs="14" style="${pos}">▶ 播放</button>`;
    case 'Elements.Label': {
      const txt = (p.Text || '""').replace(/^"|"$/g, '');
      return `<div id="lbl_${el.id}" class="sim-label" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" data-fs="15" style="${pos}">${escapeHtml(txt)}</div>`;
    }
    case 'Elements.ParsedField':
      return `<div id="pf_${el.id}" class="sim-field" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" data-fs="14" style="${pos}">0</div>`;
    case 'Elements.Slider': {
      const vn = p.Variable || '';
      if (!vn) return '';
      const lbl = p.Label || vn;
      return (
        `<div id="sl_${el.id}" class="sim-slider" data-x="${x}" data-y="${y}" data-w="${w}" data-h="${h}" data-fs="13" style="${pos}">` +
        `<div class="sl-header"><span class="sl-lbl" data-fs="13">${escapeHtml(lbl)}</span><span id="slv_${el.id}" class="sl-val" data-fs="12">0</span></div>` +
        `<input type="range" id="slr_${el.id}" min="${p.Minimum || '0'}" max="${p.Maximum || '10'}" step="${p.Step || '0.1'}" data-var="${vn}" class="sl-inp">` +
        `</div>`
      );
    }
    default:
      return '';
  }
}

function renderPanels(layout: ReturnType<typeof computePanelLayout>): string {
  const { bbW, bbH, mainH, ctrlH, chartH, mainItems, ctrlItems, chartItems } = layout;
  const mainHTML = mainItems.map(renderLayoutItem).join('\n');
  const ctrlHTML = ctrlItems.map(renderLayoutItem).join('\n');
  const chartHTML = chartItems.map(renderLayoutItem).join('\n');

  const mainPanelHTML =
    mainH > 0
      ? `<div id="main-panel" data-x="0" data-y="0" data-w="${bbW}" data-h="${mainH}" style="position:absolute;top:0;left:0;width:${bbW}px;height:${mainH}px;">\n${mainHTML}\n</div>`
      : '';
  const ctrlPanelHTML =
    ctrlH > 0
      ? `<div id="ctrl-panel" data-x="0" data-y="${mainH}" data-w="${bbW}" data-h="${ctrlH}" style="position:absolute;top:${mainH}px;left:0;width:${bbW}px;height:${ctrlH}px;background:#FAF8F3;border-top:1px solid #E5E1D8;">\n${ctrlHTML}\n</div>`
      : '';
  const chartPanelHTML =
    chartH > 0
      ? `<div id="chart-panel" data-x="0" data-y="${mainH + ctrlH}" data-w="${bbW}" data-h="${chartH}" style="position:absolute;top:${mainH + ctrlH}px;left:0;width:${bbW}px;height:${chartH}px;background:#FFFFFF;border-top:1px solid #E5E1D8;">\n${chartHTML}\n</div>`
      : '';

  return `<div id="sim-root" data-x="0" data-y="0" data-w="${bbW}" data-h="${bbH}">
${mainPanelHTML}
${ctrlPanelHTML}
${chartPanelHTML}
</div>`;
}

const COMMON_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #FAF8F3; color: #2B2D31; font-family: 'Noto Sans TC', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  #sim-root { position: absolute; top: 0; left: 0; transform-origin: top left; }
  .sim-btn {
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid #E5E1D8;
    border-radius: 10px;
    background: #2F6FB0;
    color: #FFFFFF;
    padding: 3px 12px;
    transition: background 0.15s ease, transform 0.05s ease;
  }
  .sim-btn:hover { background: #275D94; }
  .sim-btn:active { transform: scale(0.98); }
  .tsb-btn { background: #2A9D8F; }
  .sim-label {
    font-size: 15px;
    font-family: inherit;
    color: #2B2D31;
    display: flex;
    align-items: center;
  }
  .sim-field {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 14px;
    background: #FFFFFF;
    border: 1px solid #E5E1D8;
    border-radius: 6px;
    color: #2B2D31;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sim-slider {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    font-size: 13px;
    font-family: inherit;
    padding: 2px 4px;
  }
  .sl-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }
  .sl-lbl {
    color: #2B2D31;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sl-inp {
    width: 100%;
    height: 16px;
    margin: 0;
    cursor: pointer;
    accent-color: #2A9D8F;
  }
  /* Phone layout (set by the runtime): full-size rows, bigger touch target */
  #sim-root.narrow .sl-inp { height: 26px; }

  /* ── 實驗數據儀表板（Elements.Readout）── */
  body > #sim-dashboard { position: absolute; left: 0; right: 0; top: 0; }
  .dash { padding: 12px 12px 14px; background: #FAF8F3; border-top: 1px solid #E5E1D8; color: #2B2D31; }
  .dash-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; margin-bottom: 4px; }
  .dash-title { font-weight: 700; font-size: 13px; margin-right: auto; }
  .dash-t { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; color: #6B6F76; }
  .dash-btn { font: inherit; font-size: 12px; padding: 4px 10px; min-height: 30px; border-radius: 8px; border: 1px solid #E5E1D8; background: #FFFFFF; color: #2B2D31; cursor: pointer; }
  .dash-btn:hover:not(:disabled) { border-color: #2F6FB0; color: #2F6FB0; }
  .dash-btn.primary { background: #2F6FB0; border-color: #2F6FB0; color: #FFFFFF; }
  .dash-btn.primary:hover { background: #275D94; color: #FFFFFF; }
  .dash-btn:disabled { opacity: 0.45; cursor: default; }
  .dash-gtitle { font-size: 11px; font-weight: 700; color: #6B6F76; letter-spacing: 0.06em; margin: 10px 2px 6px; }
  .dash-group:first-of-type .dash-gtitle { margin-top: 6px; }
  .dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 8px; margin-top: 6px; }
  .dash-card { background: #FFFFFF; border: 1px solid #E5E1D8; border-left: 4px solid var(--c, #2F6FB0); border-radius: 10px; padding: 7px 10px 8px; min-width: 0; }
  .dash-lbl { font-size: 11.5px; color: #6B6F76; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dash-val { margin-top: 2px; font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 17px; font-weight: 600; color: var(--c, #2F6FB0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
  .dash-val small { margin-left: 4px; font-size: 11px; font-weight: 500; color: #6B6F76; }
  .dash-table-wrap { margin-top: 10px; max-height: 220px; overflow: auto; border: 1px solid #E5E1D8; border-radius: 10px; background: #FFFFFF; }
  .dash-table { width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .dash-table th { position: sticky; top: 0; background: #FAF8F3; font-family: inherit; font-weight: 600; color: #2B2D31; }
  .dash-table th, .dash-table td { padding: 5px 9px; border-bottom: 1px solid #F0ECE3; text-align: right; white-space: nowrap; }
  @media (pointer: coarse) { .dash-btn { min-height: 38px; padding: 6px 12px; font-size: 13px; } }
  .sl-val {
    flex-shrink: 0;
    color: #2A9D8F;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 600;
    font-size: 12px;
  }
`;

export function buildPreviewHTML(state: SimulationState): string {
  const model = stateToRtModel(state);
  const layout = computePanelLayout(model.viewElements);
  const panelsHTML = renderPanels(layout);

  const safeModelJson = JSON.stringify(model).replace(/</g, '\\u003c');
  const safeOptionsJson = JSON.stringify({ mode: 'preview' }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${COMMON_CSS}
</style>
</head>
<body>
${panelsHTML}
<div id="sim-dashboard"></div>
<script>
window.__EJSS_MODEL__ = ${safeModelJson};
window.__EJSS_OPTIONS__ = ${safeOptionsJson};
</script>
<script id="ejss-runtime">${RUNTIME_SRC}</script>
</body>
</html>`;
}

export function buildSimulationHTML(state: SimulationState): string {
  const model = stateToRtModel(state);
  const layout = computePanelLayout(model.viewElements);
  const panelsHTML = renderPanels(layout);
  const { bbW, bbH } = layout;

  const safeModelJson = JSON.stringify(model).replace(/</g, '\\u003c');
  const safeOptionsJson = JSON.stringify({
    mode: 'export',
    description: state.description,
  }).replace(/</g, '\\u003c');

  const titleEsc = escapeHtml(state.info.title || '模擬');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titleEsc}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
<style>
  ${COMMON_CSS}
  .app-container { display: flex; width: 100%; height: 100%; overflow: hidden; }
  .desc-panel { flex: 1; overflow-y: auto; padding: 28px 32px; background: #FFFFFF; border-right: 1px solid #E5E1D8; }
  .sim-panel { width: clamp(440px, 46vw, ${bbW + 48}px); flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding: 24px 20px; gap: 14px; overflow-y: auto; background: #FAF8F3; border-left: 1px solid #E5E1D8; }

  /* Markdown & KaTeX styling */
  .desc-panel h1, .desc-panel h2, .desc-panel h3 { color: #2B2D31; margin-top: 24px; margin-bottom: 12px; font-weight: 700; }
  .desc-panel h1 { font-size: 1.8em; border-bottom: 1px solid #E5E1D8; padding-bottom: 8px; color: #2F6FB0; }
  .desc-panel h2 { font-size: 1.35em; border-bottom: 1px solid #E5E1D8; padding-bottom: 6px; color: #2A9D8F; }
  .desc-panel h3 { font-size: 1.15em; color: #E9A23B; }
  .desc-panel p { line-height: 1.65; margin: 10px 0; color: #2B2D31; }
  .desc-panel code { font-family: 'JetBrains Mono', ui-monospace, monospace; background: #FAF8F3; padding: 2px 5px; border-radius: 4px; color: #D1495B; font-size: 0.9em; border: 1px solid #E5E1D8; }
  .desc-panel pre { background: #FAF8F3; padding: 14px; border-radius: 8px; overflow-x: auto; border: 1px solid #E5E1D8; }
  .desc-panel pre code { background: none; border: none; padding: 0; color: #2B2D31; }
  .desc-panel blockquote { border-left: 4px solid #2F6FB0; padding-left: 12px; margin: 12px 0; color: #6B6F76; }
  .desc-panel ul, .desc-panel ol { padding-left: 22px; margin: 8px 0; line-height: 1.6; }
  .desc-panel table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 14px 0; font-size: 0.95em; }
  .desc-panel th, .desc-panel td { border: 1px solid #E5E1D8; padding: 6px 10px; text-align: left; }
  .desc-panel th { background: #FAF8F3; }
  .desc-panel .katex-display { overflow-x: auto; overflow-y: hidden; padding: 4px 0; }

  /* Sim controls bar */
  .sim-title { margin: 0; font-size: 16px; color: #2B2D31; font-weight: 700; text-align: center; }
  .controls-bar { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; width: 100%; align-items: center; }
  .bar-btn {
    padding: 7px 14px;
    border-radius: 10px;
    border: 1px solid #E5E1D8;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    font-family: inherit;
    color: white;
    transition: background 0.15s ease, transform 0.05s ease;
  }
  .bar-btn:active { transform: scale(0.98); }
  .bar-btn.play  { background: #E9A23B; }
  .bar-btn.play:hover { background: #D58F28; }
  .bar-btn.pause { background: #6B6F76; }
  .bar-btn.pause:hover { background: #565A60; }
  .bar-btn.step  { background: #2F6FB0; }
  .bar-btn.step:hover { background: #275D94; }
  .bar-btn.reset { background: #2B2D31; }
  .bar-btn.reset:hover { background: #1C1E22; }
  .bar-btn.csv   { background: #2A9D8F; }
  .bar-btn.csv:hover { background: #228478; }

  .speed-select {
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid #E5E1D8;
    background: #FFFFFF;
    color: #2B2D31;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    font-weight: 500;
  }

  .stage-wrapper {
    position: relative;
    width: 100%;
    max-width: ${bbW}px;
    aspect-ratio: ${bbW} / ${bbH};
    background: #FFFFFF;
    border: 1px solid #E5E1D8;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(43,45,49,0.04);
  }

  /* Tablets and phones: one scrolling column, simulation first */
  .export-dashboard { width: 100%; max-width: ${bbW}px; }
  .export-dashboard:empty { display: none; }
  .export-dashboard .dash { border: 1px solid #E5E1D8; border-radius: 12px; background: #FFFFFF; }
  .export-dashboard .dash-card { background: #FAF8F3; }

  @media (max-width: 960px) {
    html, body { height: auto; overflow: auto; }
    .app-container { flex-direction: column; height: auto; overflow: visible; }
    .sim-panel { order: -1; width: 100%; border-left: none; border-bottom: 1px solid #E5E1D8; padding: 14px 10px 18px; overflow: visible; }
    .desc-panel { border-right: none; overflow: visible; padding: 20px 16px calc(28px + env(safe-area-inset-bottom)); }
    .desc-panel h1 { font-size: 1.45em; }
  }
  @media (pointer: coarse) {
    .bar-btn { padding: 10px 14px; font-size: 14px; }
    .speed-select { padding: 9px 8px; font-size: 14px; }
  }
</style>
</head>
<body>
<div class="app-container">
  <div class="desc-panel" id="desc-panel">
    <div id="description-content"></div>
  </div>

  <div class="sim-panel" id="sim-panel">
    <h3 class="sim-title">${titleEsc}</h3>
    <div class="controls-bar">
      <button class="bar-btn play"  onclick="simPlay()">▶ 播放</button>
      <button class="bar-btn pause" onclick="simPause()">⏸ 暫停</button>
      <button class="bar-btn step"  onclick="simStep()">⏭ 步進</button>
      <button class="bar-btn reset" onclick="simReset()">↺ 重置</button>
      <button class="bar-btn csv"   onclick="simExportCSV()">📊 導出 CSV</button>
      <select class="speed-select" onchange="simSetSpeed(parseFloat(this.value))">
        <option value="0.25">0.25×</option>
        <option value="0.5">0.5×</option>
        <option value="1" selected>1.0×</option>
        <option value="2">2.0×</option>
        <option value="4">4.0×</option>
      </select>
    </div>
    <div class="stage-wrapper">
      ${panelsHTML}
    </div>
    <div id="sim-dashboard" class="export-dashboard"></div>
  </div>
</div>

<script>
window.__EJSS_MODEL__ = ${safeModelJson};
window.__EJSS_OPTIONS__ = ${safeOptionsJson};
</script>
<script id="ejss-runtime">${RUNTIME_SRC}</script>
<script>
(function(){
  function renderMath() {
    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\\\(', right: '\\\\)', display: false},
            {left: '\\\\[', right: '\\\\]', display: true}
          ],
          throwOnError: false
        });
      } catch(err) {
        console.warn('KaTeX rendering error:', err);
      }
    }
  }

  try {
    var rawDesc = ${JSON.stringify(state.description || '').replace(/</g, '\\u003c')};
    if (rawDesc && rawDesc.trim().length > 0) {
      var descEl = document.getElementById('description-content');
      if (descEl) {
        if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
          descEl.innerHTML = marked.parse(rawDesc);
        } else {
          descEl.textContent = rawDesc;
        }
      }
      renderMath();
      window.addEventListener('load', renderMath);
    } else {
      var dPanel = document.getElementById('desc-panel');
      if (dPanel) dPanel.style.display = 'none';
      var sPanel = document.getElementById('sim-panel');
      if (sPanel) {
        sPanel.style.width = '100%';
        sPanel.style.maxWidth = '800px';
        sPanel.style.margin = '0 auto';
        sPanel.style.borderLeft = 'none';
      }
    }
  } catch(e) {
    console.error('Description render error:', e);
  }
})();
</script>
</body>
</html>`;
}

export function downloadEjssFile(state: SimulationState): void {
  const xml = serializeToEjssXML(state);
  const bytes = new TextEncoder().encode('\uFEFF' + xml);
  const blob = new Blob([bytes], { type: 'text/xml;charset=UTF-16' });
  triggerDownload(blob, `${state.info.title || 'simulation'}.ejss`);
}

export function exportStandaloneHTML(state: SimulationState): void {
  const html = buildSimulationHTML(state);
  const blob = new Blob([html], { type: 'text/html;charset=UTF-8' });
  triggerDownload(blob, `${state.info.title || 'simulation'}.html`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

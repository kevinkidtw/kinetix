import type { CompiledExpr, RtViewElement, VarBag } from '../core/types';

export interface ControlActions {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onRender: () => void;
  onSetVars: (patch: Record<string, unknown>) => void;
  onExec: (code: string) => void;
}

export interface ControlsManager {
  bind(viewElements: RtViewElement[], actions: ControlActions): void;
  update(viewVars: VarBag): void;
}

/** Decimal places that resolve a slider's step (0.005 → 3, 0.1 → 1, 5 → 0). */
function sliderDecimals(step: string | undefined): number {
  const s = parseFloat(step ?? '');
  if (!(s > 0)) return 2;
  return Math.min(4, Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)));
}

export function createControlsManager(
  compiledExprs: Map<string, CompiledExpr>
): ControlsManager {
  let boundElements: RtViewElement[] = [];

  function execAction(action: string | undefined, actions: ControlActions) {
    if (!action) return;
    const a = action.replace(/%/g, '').trim();
    if (a === '_play' || a === '_resume') {
      actions.onPlay();
    } else if (a === '_pause') {
      actions.onPause();
    } else if (a === '_reset' || a === '_initialize') {
      actions.onReset();
    } else if (a === '_step') {
      actions.onStep();
    } else {
      actions.onExec(a);
    }
  }

  return {
    bind(viewElements: RtViewElement[], actions: ControlActions) {
      boundElements = viewElements;

      viewElements.forEach((el) => {
        const p = el.properties;

        if (el.type === 'Elements.Slider') {
          const vn = p.Variable || '';
          if (!vn) return;
          const inp = document.getElementById(`slr_${el.id}`) as HTMLInputElement | null;
          const valEl = document.getElementById(`slv_${el.id}`);
          if (!inp) return;

          inp.addEventListener('input', () => {
            const num = parseFloat(inp.value);
            if (valEl) {
              valEl.textContent = num.toFixed(sliderDecimals(p.Step));
            }
            actions.onSetVars({ [vn]: num });
          });
        } else if (el.type === 'Elements.Button') {
          const btn = document.getElementById(`btn_${el.id}`);
          if (!btn) return;
          btn.addEventListener('click', () => {
            execAction(p.OnClick, actions);
          });
        } else if (el.type === 'Elements.TwoStateButton') {
          const btn = document.getElementById(`tsb_${el.id}`);
          if (!btn) return;
          btn.addEventListener('click', () => {
            const stateVar = p.State || '_isPaused';
            const isOn = btn.dataset.state === 'true';
            actions.onSetVars({ [stateVar]: !isOn });
            execAction(isOn ? p.OnClick : p.OffClick, actions);
          });
        }
      });
    },

    update(viewVars: VarBag) {
      boundElements.forEach((el) => {
        const p = el.properties;

        if (el.type === 'Elements.TwoStateButton') {
          const btn = document.getElementById(`tsb_${el.id}`);
          if (!btn) return;
          const stateVar = p.State || '_isPaused';
          const isOn = Boolean(viewVars[stateVar]);
          btn.dataset.state = String(isOn);
          btn.textContent = isOn ? '▶ 播放' : '⏸ 暫停';
          btn.style.background = isOn ? '#2A9D8F' : '#E9A23B';
        } else if (el.type === 'Elements.ParsedField') {
          const fld = document.getElementById(`pf_${el.id}`);
          if (!fld) return;
          const exprFn = compiledExprs.get(`pf:${el.id}`);
          if (exprFn) {
            try {
              const val = exprFn(viewVars);
              fld.textContent = typeof val === 'number' ? val.toFixed(2) : String(val ?? '');
            } catch {
              // ignore eval error
            }
          }
        } else if (el.type === 'Elements.Slider') {
          const vn = p.Variable || '';
          if (!vn) return;
          const inp = document.getElementById(`slr_${el.id}`) as HTMLInputElement | null;
          const valEl = document.getElementById(`slv_${el.id}`);
          if (!inp) return;
          // Only update if not currently focused by user
          if (document.activeElement !== inp && viewVars[vn] !== undefined) {
            const currentVal = Number(viewVars[vn]);
            inp.value = String(currentVal);
            if (valEl) {
              valEl.textContent = currentVal.toFixed(sliderDecimals(p.Step));
            }
          }
        }
      });
    },
  };
}

import type { CompiledExpr, RtViewElement, VarBag } from '../core/types';

/**
 * 實驗數據儀表板：把 Elements.Readout（數據卡）渲染在模擬畫面下方，
 * 並提供「記錄一列」數據表與 CSV 匯出，對應講義中的數據記錄表格。
 */
export interface Dashboard {
  readonly el: HTMLElement;
  update(vars: VarBag): void;
}

interface Card {
  label: string;
  unit: string;
  digits: number | null;
  fn: CompiledExpr | undefined;
  valueEl: HTMLElement;
  unitEl: HTMLElement | null;
}

const UPDATE_INTERVAL_MS = 100;

function unquote(s: string | undefined): string {
  return (s ?? '').trim().replace(/^"|"$/g, '');
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Readable number: fixed digits when given, otherwise 4 significant digits or scientific notation. */
export function formatReadout(v: unknown, digits: number | null): string {
  if (typeof v === 'boolean') return v ? '是' : '否';
  if (typeof v === 'string') return v;
  if (typeof v !== 'number' || Number.isNaN(v)) return '—';
  if (!Number.isFinite(v)) return v > 0 ? '∞' : '−∞';
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e5 || a < 1e-3)) return v.toExponential(digits ?? 3);
  if (digits !== null) return v.toFixed(digits);
  return a >= 1000 ? v.toFixed(0) : Number(v.toPrecision(4)).toString();
}

function evalCard(card: Card, vars: VarBag): unknown {
  if (!card.fn) return undefined;
  try {
    return card.fn(vars);
  } catch {
    return undefined;
  }
}

export function createDashboard(
  host: HTMLElement | null,
  elements: RtViewElement[],
  compiledExprs: Map<string, CompiledExpr>,
  title: string
): Dashboard | null {
  const readouts = elements.filter((e) => e.type === 'Elements.Readout');
  if (!host || readouts.length === 0) return null;

  // Group cards by their Group property, in first-appearance order.
  const groups = new Map<string, RtViewElement[]>();
  readouts.forEach((el) => {
    const g = unquote(el.properties.Group);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(el);
  });

  host.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'dash';
  root.innerHTML =
    '<div class="dash-head">' +
    '<span class="dash-title">📊 實驗數據儀表板</span>' +
    '<span class="dash-t">t = 0.000 s</span>' +
    '<button type="button" class="dash-btn primary" data-act="rec">＋ 記錄一列</button>' +
    '<button type="button" class="dash-btn" data-act="csv" disabled>匯出表格 CSV</button>' +
    '<button type="button" class="dash-btn" data-act="clr" disabled>清除</button>' +
    '</div>';
  host.appendChild(root);

  const cards: Card[] = [];
  groups.forEach((els, name) => {
    const section = document.createElement('div');
    section.className = 'dash-group';
    if (name) section.innerHTML = `<div class="dash-gtitle">${escapeHtml(name)}</div>`;
    const grid = document.createElement('div');
    grid.className = 'dash-grid';
    els.forEach((el) => {
      const p = el.properties;
      const label = unquote(p.Label) || el.name;
      const unit = unquote(p.Unit);
      const color = unquote(p.Color) || '#2F6FB0';
      const d = parseInt(unquote(p.Digits), 10);
      const card = document.createElement('div');
      card.className = 'dash-card';
      card.style.setProperty('--c', color);
      card.innerHTML =
        `<div class="dash-lbl" title="${escapeHtml(label)}">${escapeHtml(label)}</div>` +
        `<div class="dash-val"><span>—</span>${unit ? `<small>${escapeHtml(unit)}</small>` : ''}</div>`;
      grid.appendChild(card);
      cards.push({
        label,
        unit,
        digits: Number.isFinite(d) ? Math.max(0, Math.min(8, d)) : null,
        fn: compiledExprs.get(`ro:${el.id}`),
        valueEl: card.querySelector('.dash-val span') as HTMLElement,
        unitEl: card.querySelector('.dash-val small'),
      });
    });
    section.appendChild(grid);
    root.appendChild(section);
  });

  // ── 數據記錄表 ──
  const tableWrap = document.createElement('div');
  tableWrap.className = 'dash-table-wrap';
  tableWrap.hidden = true;
  const head = ['#', 't (s)', ...cards.map((c) => (c.unit ? `${c.label} (${c.unit})` : c.label))];
  tableWrap.innerHTML =
    '<table class="dash-table"><thead><tr>' +
    head.map((h) => `<th>${escapeHtml(h)}</th>`).join('') +
    '</tr></thead><tbody></tbody></table>';
  root.appendChild(tableWrap);
  const tbody = tableWrap.querySelector('tbody')!;
  const tEl = root.querySelector('.dash-t') as HTMLElement;
  const csvBtn = root.querySelector('[data-act="csv"]') as HTMLButtonElement;
  const clrBtn = root.querySelector('[data-act="clr"]') as HTMLButtonElement;
  const rows: unknown[][] = [];
  let latest: VarBag | null = null;

  function record() {
    if (!latest) return;
    const vars = latest;
    const row = [Number(vars.t) || 0, ...cards.map((c) => evalCard(c, vars))];
    rows.push(row);
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td>${rows.length}</td><td>${formatReadout(row[0], 3)}</td>` +
      cards.map((c, i) => `<td>${escapeHtml(formatReadout(row[i + 1], c.digits))}</td>`).join('');
    tbody.appendChild(tr);
    tableWrap.hidden = false;
    tableWrap.scrollTop = tableWrap.scrollHeight;
    csvBtn.disabled = false;
    clrBtn.disabled = false;
  }

  function exportCSV() {
    const cell = (v: unknown) => {
      const s = typeof v === 'number' ? String(v) : formatReadout(v, null);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv =
      '﻿' + [head.slice(1).map(cell).join(','), ...rows.map((r) => r.map(cell).join(','))].join('\n');
    const name = `${title || 'simulation'}_數據表`;
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'csvData', csv, title: name }, '*');
      return;
    }
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  root.addEventListener('click', (e) => {
    const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'rec') record();
    else if (act === 'csv') exportCSV();
    else if (act === 'clr') {
      rows.length = 0;
      tbody.innerHTML = '';
      tableWrap.hidden = true;
      csvBtn.disabled = true;
      clrBtn.disabled = true;
    }
  });

  // Text updates are throttled; a trailing update keeps the last frame exact.
  let lastPaint = 0;
  let trailing: ReturnType<typeof setTimeout> | null = null;
  function paint() {
    lastPaint = performance.now();
    if (!latest) return;
    const vars = latest;
    tEl.textContent = `t = ${(Number(vars.t) || 0).toFixed(3)} s`;
    cards.forEach((c) => {
      const v = evalCard(c, vars);
      const text = formatReadout(v, c.digits);
      if (c.valueEl.textContent !== text) c.valueEl.textContent = text;
      // Text values ("（已隱藏）", "欠阻尼") carry no unit.
      if (c.unitEl) c.unitEl.hidden = typeof v === 'string';
    });
  }

  return {
    el: host,
    update(vars: VarBag) {
      latest = vars;
      const wait = UPDATE_INTERVAL_MS - (performance.now() - lastPaint);
      if (wait <= 0) {
        if (trailing) clearTimeout(trailing);
        trailing = null;
        paint();
      } else if (!trailing) {
        trailing = setTimeout(() => {
          trailing = null;
          paint();
        }, wait);
      }
    },
  };
}

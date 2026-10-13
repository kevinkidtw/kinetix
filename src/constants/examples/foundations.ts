import { C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import { HANDOUTS } from './handouts/classic';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 基礎力學與振動：原有範例的升級版（滑桿、即時圖表、數據儀表板）
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 1. 簡諧運動
// ─────────────────────────────────────────────
const shm: ExampleDef = {
  id: 'shm',
  category: '振動與波動',
  difficulty: '入門',
  listDescription: '彈簧振子的位置、速度、彈力與能量即時連動：拉動滑桿改變 k、m 與振幅，同步觀察 x–t 圖、相空間圖與能量長條，驗證 T = 2π√(m/k)。',
  description: HANDOUTS.shm,
  info: { title: '簡諧運動', author: '', keywords: '', abstract: '' },
  variables: doubles('shm', [
    ['x', '2', '質點位置（m）'],
    ['vx', '0', '質點速度（m/s）'],
    ['k', '8', '彈簧常數（N/m）'],
    ['m', '1', '質量（kg）'],
    ['A', '2', '釋放時的振幅（m）'],
    ['F', '0', '彈力（N）'],
    ['K', '0', '動能（J）'],
    ['U', '0', '彈性位能（J）'],
    ['E', '0', '總力學能（J）'],
    ['Tm', '0', '實測週期（s）'],
  ]),
  odePages: [{
    id: 'shm-ode', name: '運動方程', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'vx', expression: '-k * x / m' },
    ],
  }],
  constraintPages: [{
    id: 'shm-con', name: '釋放、量週期與能量', comment: '參數改變時從 x = A 靜止釋放；x 由負轉正時記錄週期',
    code: String.raw`var sig = k + '|' + m + '|' + A;
if (_v._sig !== sig) {
  _v._sig = sig;
  x = A; vx = 0; t = 0; Tm = 0; _v._tc = -1; _v._xp = x;
}
if (_v._xp < 0 && x >= 0 && vx > 0) {
  var tc = t - x / vx;              // 線性內插的穿越時刻
  if (_v._tc >= 0) Tm = tc - _v._tc;
  _v._tc = tc;
}
_v._xp = x;
F = -k * x;
K = 0.5 * m * vx * vx;
U = 0.5 * k * x * x;
E = K + U;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('shm-dp', 620, 400, [0, 10, 0, 10]),
    slider('shm-s-k', 'k', 1, 20, 0.5, '彈簧常數 k (N/m)'),
    slider('shm-s-m', 'm', 0.2, 5, 0.1, '質量 m (kg)'),
    slider('shm-s-A', 'A', 0.5, 3, 0.1, '振幅 A (m)'),
    readout('shm-r-Tth', '理論週期 2π√(m/k)', '2 * Math.PI * Math.sqrt(m / k)', { unit: 's', digits: 3, color: C.muted, group: '週期' }),
    readout('shm-r-Tm', '實測週期', 'Tm > 0 ? Tm : "量測中…"', { unit: 's', digits: 3, color: C.blue, group: '週期' }),
    readout('shm-r-w', '角頻率 ω = √(k/m)', 'Math.sqrt(k / m)', { unit: 'rad/s', digits: 3, color: C.ink, group: '週期' }),
    readout('shm-r-x', '位置 x', 'x', { unit: 'm', digits: 3, color: C.blue, group: '運動' }),
    readout('shm-r-v', '速度 v', 'vx', { unit: 'm/s', digits: 3, color: C.red, group: '運動' }),
    readout('shm-r-vmax', '最大速率 Aω', 'A * Math.sqrt(k / m)', { unit: 'm/s', digits: 3, color: C.muted, group: '運動' }),
    readout('shm-r-F', '彈力 F = −kx', 'F', { unit: 'N', digits: 2, color: C.red, group: '運動' }),
    readout('shm-r-K', '動能 K', 'K', { unit: 'J', digits: 3, color: C.amber, group: '能量' }),
    readout('shm-r-U', '位能 U', 'U', { unit: 'J', digits: 3, color: C.blue, group: '能量' }),
    readout('shm-r-E', '總能量 E', 'E', { unit: 'J', digits: 4, color: C.teal, group: '能量' }),
    readout('shm-r-E0', '理論 ½kA²', '0.5 * k * A * A', { unit: 'J', digits: 4, color: C.muted, group: '能量' }),
    customDraw('shm-draw', '彈簧振子與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var x = vars.x, vx = vars.vx, A = vars.A, k = vars.k, m = vars.m, w = Math.sqrt(k / m);
// ── 彈簧振子 ──
var eq = 330, sc = 75, my = 72, xp = eq + x * sc;
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(14, my - 42, 12, 84);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, my + 26); ctx.lineTo(W - 14, my + 26); ctx.stroke();
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2; ctx.beginPath();
for (var i = 0; i <= 80; i++) {
  var s = i / 80, px = 26 + s * (xp - 24 - 26), py = my + (i > 3 && i < 77 ? Math.sin(s * 20 * Math.PI) * 10 : 0);
  if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
}
ctx.stroke();
ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
ctx.strokeStyle = "#B8B4AA"; ctx.beginPath(); ctx.moveTo(eq, my - 50); ctx.lineTo(eq, my + 26); ctx.stroke();
ctx.strokeStyle = "rgba(233,162,59,0.8)";
[-A, A].forEach(function (a) { ctx.beginPath(); ctx.moveTo(eq + a * sc, my - 50); ctx.lineTo(eq + a * sc, my + 26); ctx.stroke(); });
ctx.setLineDash([]);
ctx.fillStyle = "#B97A1E"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
ctx.fillText("−A", eq - A * sc, my - 54); ctx.fillText("+A", eq + A * sc, my - 54); ctx.fillStyle = "#6B6F76"; ctx.fillText("平衡點", eq, my - 54);
ctx.fillStyle = "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.fillRect(xp - 24, my - 24, 48, 48); ctx.strokeRect(xp - 24, my - 24, 48, 48);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.fillText("m", xp, my + 4);
var Fn = vars.F / (k * A), Vn = vx / (A * w);
if (Math.abs(Fn) > 0.01) { arrow(xp, my - 32, xp + Fn * 70, my - 32, "#D1495B", 2.5); ctx.fillStyle = "#D1495B"; ctx.fillText("F", xp + Fn * 70 + (Fn > 0 ? 8 : -8), my - 28); }
if (Math.abs(Vn) > 0.01) { arrow(xp, my + 40, xp + Vn * 70, my + 40, "#2F6FB0", 2.5); ctx.fillStyle = "#2F6FB0"; ctx.fillText("v", xp + Vn * 70 + (Vn > 0 ? 8 : -8), my + 44); }
// ── x(t) 與 v/ω ──
var T = 2 * Math.PI / w, win = Math.min(30, Math.max(6, 3 * T));
var h = track("_shmH", [vars.t, x, vx / w], 4000);
var t1 = Math.max(vars.t, win), t0 = t1 - win, vis = h.filter(function (p) { return p[0] >= t0; });
miniPlot({ x: 6, y: 146, w: 296, h: 248 }, [
  { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "x" },
  { pts: vis.map(function (p) { return [p[0], p[2]]; }), color: "#D1495B", label: "v/ω", dash: [5, 3] },
], { title: "位置與速度（m）", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -A * 1.15, ymax: A * 1.15 });
// ── 相空間 ──
var ph = h.slice(-Math.min(h.length, 600));
miniPlot({ x: 308, y: 146, w: 158, h: 248 }, [
  { pts: ph.map(function (p) { return [p[1], p[2]]; }), color: "#533177", label: "" },
  { pts: [], dots: [[x, vx / w]], color: "#533177" },
], { title: "相空間 v/ω–x", xlabel: "x", xmin: -A * 1.2, xmax: A * 1.2, ymin: -A * 1.2, ymax: A * 1.2 });
// ── 能量長條 ──
var E0 = 0.5 * k * A * A, bx = 476, bw = 136, top = 170, bh = 200;
ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx - 4, 146, bw + 6, 248); ctx.strokeStyle = "#E5E1D8"; ctx.strokeRect(bx - 4.5, 146.5, bw + 6, 247);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("能量（J）", bx + 2, 160);
[["K", vars.K, "#E9A23B"], ["U", vars.U, "#2F6FB0"], ["E", vars.E, "#2A9D8F"]].forEach(function (b, j) {
  var hh = Math.max(0, Math.min(1.05, b[1] / E0)) * bh, x0 = bx + 10 + j * 42;
  ctx.fillStyle = b[2]; ctx.fillRect(x0, top + bh - hh, 30, hh);
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(b[0], x0 + 15, top + bh + 14);
});
ctx.strokeStyle = "#B8B4AA"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(bx + 4, top); ctx.lineTo(bx + bw - 4, top); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace"; ctx.textAlign = "right"; ctx.fillText("½kA²", bx + bw - 4, top - 3);
`),
  ],
};

// ─────────────────────────────────────────────
// 2. 單擺
// ─────────────────────────────────────────────
const pendulum: ExampleDef = {
  id: 'pendulum',
  category: '振動與波動',
  difficulty: '入門',
  listDescription: '大角度單擺：以滑桿設定擺角、擺長與重力，同時比較實測週期、小角度公式與橢圓積分精確解，並畫出 T/T₀ 隨擺角變化的曲線。',
  description: HANDOUTS.pendulum,
  info: { title: '單擺', author: '', keywords: '', abstract: '' },
  variables: doubles('pen', [
    ['theta', '1.2', '擺角（rad）'],
    ['omega', '0', '角速度（rad/s）'],
    ['th0', '69', '釋放擺角（度）'],
    ['L', '2.5', '擺長（m）'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['T0', '0', '小角度週期 2π√(L/g)（s）'],
    ['Tex', '0', '精確週期（橢圓積分，s）'],
    ['Tser', '0', '級數近似週期（s）'],
    ['Tm', '0', '實測週期（s）'],
  ]),
  odePages: [{
    id: 'pen-ode', name: '擺動方程', method: 'RungeKutta', increment: '0.002', comment: '',
    rates: [
      { state: 'theta', expression: 'omega' },
      { state: 'omega', expression: '-(g / L) * Math.sin(theta)' },
    ],
  }],
  constraintPages: [{
    id: 'pen-con', name: '釋放與週期計算', comment: '精確週期 T = 4√(L/g)·K(sin(θ₀/2))，K 以算術–幾何平均（AGM）計算',
    code: String.raw`var sig = th0 + '|' + L + '|' + g;
if (_v._sig !== sig) {
  _v._sig = sig;
  theta = th0 * Math.PI / 180; omega = 0; t = 0; Tm = 0; _v._tc = -1; _v._tp = theta;
  var a0 = Math.abs(theta);
  T0 = 2 * Math.PI * Math.sqrt(L / g);
  // 第一類完全橢圓積分 K(k) = π / (2·AGM(1, √(1−k²)))
  var kk = Math.sin(a0 / 2), ag = 1, bg = Math.sqrt(1 - kk * kk);
  for (var it = 0; it < 40; it++) { var an = (ag + bg) / 2; bg = Math.sqrt(ag * bg); ag = an; }
  Tex = 4 * Math.sqrt(L / g) * Math.PI / (2 * ag);
  Tser = T0 * (1 + a0 * a0 / 16 + 11 * Math.pow(a0, 4) / 3072);
}
if (_v._tp < 0 && theta >= 0 && omega > 0) {
  var tc = t - theta / omega;
  if (_v._tc >= 0) Tm = tc - _v._tc;
  _v._tc = tc;
}
_v._tp = theta;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('pen-dp', 620, 400, [0, 10, 0, 10]),
    slider('pen-s-th', 'th0', 5, 175, 1, '釋放擺角 θ₀ (°)'),
    slider('pen-s-L', 'L', 0.5, 5, 0.1, '擺長 L (m)'),
    slider('pen-s-g', 'g', 1.6, 25, 0.1, '重力 g (m/s²)'),
    readout('pen-r-T0', '小角度公式 T₀', 'T0', { unit: 's', digits: 3, color: C.muted, group: '週期' }),
    readout('pen-r-Tser', '級數修正 T', 'Tser', { unit: 's', digits: 3, color: C.purple, group: '週期' }),
    readout('pen-r-Tex', '精確解 T（橢圓積分）', 'Tex', { unit: 's', digits: 3, color: C.teal, group: '週期' }),
    readout('pen-r-Tm', '實測週期', 'Tm > 0 ? Tm : "量測中…"', { unit: 's', digits: 3, color: C.blue, group: '週期' }),
    readout('pen-r-ratio', '實測 T / T₀', 'Tm > 0 ? Tm / T0 : "…"', { digits: 4, color: C.blue, group: '週期' }),
    readout('pen-r-th', '目前擺角 θ', 'theta * 180 / Math.PI', { unit: '°', digits: 1, color: C.amber, group: '擺動' }),
    readout('pen-r-w', '角速度 ω', 'omega', { unit: 'rad/s', digits: 3, color: C.red, group: '擺動' }),
    readout('pen-r-vmax', '最低點速率', 'Math.sqrt(2 * g * L * (1 - Math.cos(th0 * Math.PI / 180)))', { unit: 'm/s', digits: 3, color: C.muted, group: '擺動' }),
    customDraw('pen-draw', '單擺與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var th = vars.theta, th0 = vars.th0 * Math.PI / 180, L = vars.L, g = vars.g;
// ── 單擺（左）──
var px = 125, py = 46, Lp = 70 + 220 * (L / 5);
ctx.fillStyle = "#6B6F76"; ctx.fillRect(px - 50, py - 10, 100, 8);
ctx.strokeStyle = "rgba(233,162,59,0.7)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
ctx.beginPath(); ctx.arc(px, py, Lp, Math.PI / 2 - th0, Math.PI / 2 + th0); ctx.stroke();
ctx.strokeStyle = "#E5E1D8"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + Lp + 16); ctx.stroke(); ctx.setLineDash([]);
var bx = px + Lp * Math.sin(th), by = py + Lp * Math.cos(th);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(bx, by, 13, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
ctx.font = "12px monospace"; ctx.textAlign = "center"; ctx.fillStyle = "#B97A1E";
ctx.fillText("θ = " + (th * 180 / Math.PI).toFixed(1) + "°", px, H - 14);
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.fillText("L = " + L.toFixed(1) + " m", px + 60, py + 14);
// ── θ(t)：與小角度解比較（右上）──
var w0 = Math.sqrt(g / L), Tx = vars.Tex || 2 * Math.PI / w0, win = Math.min(40, Math.max(8, 3 * Tx));
var h = track("_penH", [vars.t, th * 180 / Math.PI, vars.th0 * Math.cos(w0 * vars.t)], 4000);
var t1 = Math.max(vars.t, win), t0 = t1 - win, vis = h.filter(function (p) { return p[0] >= t0; });
miniPlot({ x: 256, y: 6, w: 358, h: 200 }, [
  { pts: vis.map(function (p) { return [p[0], p[2]]; }), color: "#9AA0A6", dash: [5, 4], label: "小角度解 θ₀cos(ω₀t)" },
  { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#B97A1E", label: "實際 θ" },
], { title: "擺角 θ（°）", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -vars.th0 * 1.15, ymax: vars.th0 * 1.15 });
// ── T/T₀ 對擺角（右下）──
function ratio(a) {
  var kk = Math.sin(a / 2), ag = 1, bg = Math.sqrt(1 - kk * kk);
  for (var i = 0; i < 30; i++) { var an = (ag + bg) / 2; bg = Math.sqrt(ag * bg); ag = an; }
  return 1 / ag;
}
var ex = [], se = [];
for (var d = 1; d <= 176; d += 2) { var a = d * Math.PI / 180; ex.push([d, ratio(a)]); se.push([d, 1 + a * a / 16 + 11 * Math.pow(a, 4) / 3072]); }
var dots = [[vars.th0, vars.Tex / vars.T0]];
var gp = miniPlot({ x: 256, y: 212, w: 358, h: 182 }, [
  { pts: se, color: "#533177", dash: [4, 3], label: "級數近似" },
  { pts: ex, color: "#2A9D8F", label: "精確解", dots: dots },
], { title: "週期比 T / T₀ 對釋放擺角", xlabel: "θ₀(°)", xmin: 0, xmax: 180, ymin: 1, ymax: 3 });
if (vars.Tm > 0) { ctx.fillStyle = "#2F6FB0"; ctx.beginPath(); ctx.arc(gp.px(vars.th0), gp.py(Math.min(3, vars.Tm / vars.T0)), 5, 0, 2 * Math.PI); ctx.lineWidth = 2; ctx.strokeStyle = "#2F6FB0"; ctx.stroke(); }
`),
  ],
};

// ─────────────────────────────────────────────
// 3. 拋體運動
// ─────────────────────────────────────────────
const projectile: ExampleDef = {
  id: 'projectile',
  category: '力學',
  difficulty: '入門',
  listDescription: '從平台斜拋的球落地後反彈：拉動滑桿改變初速、仰角、高度與恢復係數，畫面同步顯示速度分量、x–t 與 vᵧ–t 圖，驗證反彈高度比 = e²。',
  description: HANDOUTS.projectile,
  info: { title: '拋體運動', author: '', keywords: '', abstract: '' },
  variables: doubles('pro', [
    ['x', '0', '水平位置（m）'], ['y', '2', '高度（m）'],
    ['vx', '0', '水平速度（m/s）'], ['vy', '0', '鉛直速度（m/s）'],
    ['v0', '7', '初速（m/s）'],
    ['angle', '50', '仰角（度）'],
    ['h0', '2', '發射高度（m）'],
    ['e', '0.7', '地面恢復係數'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['nb', '0', '反彈次數'],
    ['hLast', '0', '最近一次的最高點高度（m）'],
    ['hPrev', '0', '前一次的最高點高度（m）'],
    ['hRatio', '0', '連續兩次最高點高度比'],
    ['h1', '0', '第一次落地前的最高點（m）'],
    ['h2', '0', '第一次反彈後的最高點（m）'],
    ['tLand1', '0', '第一次落地時間（s）'],
    ['xLand1', '0', '第一次落地水平距離（m）'],
    ['ymax', '2', '最大高度（m）'],
  ]),
  odePages: [{
    id: 'pro-ode', name: '拋體方程', method: 'RungeKutta', increment: '0.002', comment: '',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'vx', expression: '0' },
      { state: 'vy', expression: '-g' },
    ],
  }],
  constraintPages: [{
    id: 'pro-con', name: '發射與地面反彈', comment: '落地時以線性內插求時刻，vᵧ 反向並乘上恢復係數 e',
    code: String.raw`var sig = v0 + '|' + angle + '|' + h0 + '|' + e + '|' + g;
if (_v._sig !== sig) {
  _v._sig = sig;
  var a = angle * Math.PI / 180;
  x = 0; y = h0; vx = v0 * Math.cos(a); vy = v0 * Math.sin(a); t = 0;
  nb = 0; hLast = 0; hPrev = 0; hRatio = 0; h1 = 0; h2 = 0; tLand1 = 0; xLand1 = 0; ymax = h0;
  _v._apex = h0; _v._rest = 0;
}
if (y > _v._apex) _v._apex = y;
if (y > ymax) ymax = y;
if (y < 0 && vy < 0 && !_v._rest) {
  if (nb === 0) { tLand1 = t - y / vy; xLand1 = x - y * vx / vy; }
  nb = nb + 1;
  hPrev = hLast; hLast = _v._apex;
  if (nb === 1) h1 = hLast;
  if (nb === 2) h2 = hLast;
  // 毫米級的小彈跳受時間步長影響大，不列入高度比
  if (nb >= 2 && hPrev > 0 && hLast > 0.02) hRatio = hLast / hPrev;
  y = -y * e; vy = -e * vy; _v._apex = 0;
  if (Math.abs(vy) < 0.3) _v._rest = 1;
}
if (_v._rest) { y = 0; vy = 0; }
if (x > 24) vx = 0;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('pro-dp', 620, 420, [0, 10, 0, 10]),
    slider('pro-s-v0', 'v0', 1, 10, 0.1, '初速 v₀ (m/s)'),
    slider('pro-s-a', 'angle', 0, 90, 1, '仰角 θ (°)'),
    slider('pro-s-h', 'h0', 0, 4, 0.1, '發射高度 h₀ (m)'),
    slider('pro-s-e', 'e', 0, 1, 0.05, '恢復係數 e'),
    readout('pro-r-tth', '理論落地時間', '(v0 * Math.sin(angle * Math.PI / 180) + Math.sqrt(Math.pow(v0 * Math.sin(angle * Math.PI / 180), 2) + 2 * g * h0)) / g', { unit: 's', digits: 3, color: C.muted, group: '第一次落地' }),
    readout('pro-r-tm', '實測落地時間', 'nb > 0 ? tLand1 : "飛行中…"', { unit: 's', digits: 3, color: C.blue, group: '第一次落地' }),
    readout('pro-r-xth', '理論水平射程', 'v0 * Math.cos(angle * Math.PI / 180) * (v0 * Math.sin(angle * Math.PI / 180) + Math.sqrt(Math.pow(v0 * Math.sin(angle * Math.PI / 180), 2) + 2 * g * h0)) / g', { unit: 'm', digits: 3, color: C.muted, group: '第一次落地' }),
    readout('pro-r-xm', '實測水平射程', 'nb > 0 ? xLand1 : "飛行中…"', { unit: 'm', digits: 3, color: C.blue, group: '第一次落地' }),
    readout('pro-r-Hth', '理論最大高度', 'h0 + Math.pow(Math.max(0, v0 * Math.sin(angle * Math.PI / 180)), 2) / (2 * g)', { unit: 'm', digits: 3, color: C.muted, group: '第一次落地' }),
    readout('pro-r-n', '反彈次數', 'nb', { digits: 0, color: C.ink, group: '反彈' }),
    readout('pro-r-h', '最近一次最高點 hₙ', 'nb > 0 ? hLast : "—"', { unit: 'm', digits: 3, color: C.amber, group: '反彈' }),
    readout('pro-r-h12', '高度比 h₂ / h₁', 'h2 > 0 ? h2 / h1 : "—"', { digits: 4, color: C.amber, group: '反彈' }),
    readout('pro-r-hr', '最近高度比 hₙ / hₙ₋₁', 'hRatio > 0 ? hRatio : "—"', { digits: 4, color: C.amber, group: '反彈' }),
    readout('pro-r-e2', '理論 e²', 'e * e', { digits: 4, color: C.muted, group: '反彈' }),
    readout('pro-r-vx', '水平速度 vₓ', 'vx', { unit: 'm/s', digits: 3, color: C.blue, group: '速度分量' }),
    readout('pro-r-vy', '鉛直速度 vᵧ', 'vy', { unit: 'm/s', digits: 3, color: C.red, group: '速度分量' }),
    customDraw('pro-draw', '拋體繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var g = vars.g, a = vars.angle * Math.PI / 180, vy0 = vars.v0 * Math.sin(a), h0 = vars.h0;
var Yr = Math.max(5, (h0 + Math.max(0, vy0) * Math.max(0, vy0) / (2 * g)) * 1.15), Xr = 24;
var L = 40, B = 250, sc = Math.min((W - L - 12) / Xr, (B - 14) / Yr);
function X(x) { return L + x * sc; }
function Y(y) { return B - y * sc; }
// 格線
ctx.font = "10px monospace"; ctx.fillStyle = "#6B6F76"; ctx.strokeStyle = "rgba(43,45,49,0.06)"; ctx.lineWidth = 1;
for (var gx = 0; gx <= Xr; gx += 2) { ctx.beginPath(); ctx.moveTo(X(gx), Y(0)); ctx.lineTo(X(gx), 8); ctx.stroke(); ctx.textAlign = "center"; ctx.fillText(gx, X(gx), B + 12); }
for (var gy = 1; Y(gy) > 10; gy += 1) { ctx.beginPath(); ctx.moveTo(L, Y(gy)); ctx.lineTo(W - 10, Y(gy)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(gy, L - 4, Y(gy) + 3); }
ctx.fillStyle = "#EFE9DC"; ctx.fillRect(0, B, W, 22); ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, B); ctx.lineTo(W, B); ctx.stroke();
// 發射平台
if (h0 > 0) { ctx.fillStyle = "#D9D3C4"; ctx.fillRect(X(-0.5), Y(h0), X(0) - X(-0.5) + 2, B - Y(h0)); }
// 歷次最高點
var ap = track("_proAp", [vars.t, vars.nb, vars.hLast], 50);
ctx.setLineDash([3, 3]); ctx.strokeStyle = "rgba(233,162,59,0.55)"; ctx.lineWidth = 1;
var seen = {};
ap.forEach(function (p) { if (p[1] > 0 && p[1] <= 5 && p[2] > 0.05 && !seen[p[1]]) { seen[p[1]] = 1; ctx.beginPath(); ctx.moveTo(L, Y(p[2])); ctx.lineTo(W - 10, Y(p[2])); ctx.stroke(); ctx.fillStyle = "#B97A1E"; ctx.textAlign = "left"; ctx.fillText("h" + p[1] + " = " + p[2].toFixed(2), W - 84, Y(p[2]) - 3); } });
ctx.setLineDash([]);
// 軌跡
var tr = track("_proT", [vars.t, vars.x, vars.y, vars.vx, vars.vy], 6000);
ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 2; ctx.beginPath();
tr.forEach(function (p, i) { if (i) ctx.lineTo(X(p[1]), Y(p[2])); else ctx.moveTo(X(p[1]), Y(p[2])); });
ctx.stroke();
// 球與速度分量
var bx = X(vars.x), by = Y(vars.y), vs = 9;
if (Math.abs(vars.vx) > 0.01) arrow(bx, by, bx + vars.vx * vs, by, "#2F6FB0", 2);
if (Math.abs(vars.vy) > 0.01) arrow(bx, by, bx, by - vars.vy * vs, "#D1495B", 2);
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(bx, by, 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
// x–t 與 vy–t
var t1 = Math.max(vars.t, 3);
miniPlot({ x: 6, y: 280, w: W / 2 - 9, h: 134 }, [
  { pts: tr.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "x（等速 → 直線）" },
], { title: "水平位置 x (m)", xlabel: "t(s)", xmin: 0, xmax: t1, ymin: 0 });
miniPlot({ x: W / 2 + 3, y: 280, w: W / 2 - 9, h: 134 }, [
  { pts: tr.map(function (p) { return [p[0], p[4]]; }), color: "#D1495B", label: "vᵧ（斜率 = −g）" },
], { title: "鉛直速度 vᵧ (m/s)", xlabel: "t(s)", xmin: 0, xmax: t1, ymin: -12, ymax: 12 });
`),
  ],
};

// ─────────────────────────────────────────────
// 4. 阻尼振盪
// ─────────────────────────────────────────────
const damped: ExampleDef = {
  id: 'damped',
  category: '振動與波動',
  difficulty: '基礎',
  listDescription: '附阻尼器的彈簧振子：拉動阻尼係數 b 由欠阻尼經臨界阻尼到過阻尼，x–t 圖附理論包絡線，並自動量測對數衰減率與品質因子。',
  description: HANDOUTS.damped,
  info: { title: '阻尼振盪', author: '', keywords: '', abstract: '' },
  variables: doubles('dmp', [
    ['x', '3', '質點位置（m）'],
    ['vx', '0', '質點速度（m/s）'],
    ['k', '5', '彈簧常數（N/m）'],
    ['m', '1', '質量（kg）'],
    ['b', '0.8', '阻尼係數（kg/s）'],
    ['x0', '3', '釋放位置（m）'],
    ['E', '0', '力學能（J）'],
    ['delta', '0', '實測對數衰減率'],
    ['Tdm', '0', '實測阻尼週期（s）'],
  ]),
  odePages: [{
    id: 'dmp-ode', name: '阻尼方程', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'vx', expression: '(-k * x - b * vx) / m' },
    ],
  }],
  constraintPages: [{
    id: 'dmp-con', name: '釋放與峰值量測', comment: '速度由正轉負時為正向峰值，相鄰峰值比的對數即對數衰減率',
    code: String.raw`var sig = k + '|' + m + '|' + b + '|' + x0;
if (_v._sig !== sig) {
  _v._sig = sig;
  x = x0; vx = 0; t = 0; delta = 0; Tdm = 0;
  _v._pk = x0; _v._tpk = 0; _v._vp = 0;
}
if (_v._vp > 0 && vx <= 0 && x > 1e-4) {
  if (_v._pk > 0) { delta = Math.log(_v._pk / x); Tdm = t - _v._tpk; }
  _v._pk = x; _v._tpk = t;
}
_v._vp = vx;
E = 0.5 * m * vx * vx + 0.5 * k * x * x;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('dmp-dp', 620, 400, [0, 10, 0, 10]),
    slider('dmp-s-b', 'b', 0, 10, 0.05, '阻尼係數 b (kg/s)'),
    slider('dmp-s-k', 'k', 1, 20, 0.5, '彈簧常數 k (N/m)'),
    slider('dmp-s-m', 'm', 0.2, 5, 0.1, '質量 m (kg)'),
    readout('dmp-r-type', '阻尼類型', 'b < 1e-9 ? "無阻尼" : Math.abs(b - 2 * Math.sqrt(k * m)) < 0.03 ? "臨界阻尼" : b < 2 * Math.sqrt(k * m) ? "欠阻尼" : "過阻尼"', { color: C.purple, group: '參數' }),
    readout('dmp-r-bc', '臨界阻尼 b_c = 2√(km)', '2 * Math.sqrt(k * m)', { unit: 'kg/s', digits: 3, color: C.muted, group: '參數' }),
    readout('dmp-r-bbc', 'b / b_c', 'b / (2 * Math.sqrt(k * m))', { digits: 3, color: C.purple, group: '參數' }),
    readout('dmp-r-g', '衰減常數 γ = b/2m', 'b / (2 * m)', { unit: '1/s', digits: 3, color: C.ink, group: '參數' }),
    readout('dmp-r-w0', '自然頻率 ω₀', 'Math.sqrt(k / m)', { unit: 'rad/s', digits: 3, color: C.ink, group: '參數' }),
    readout('dmp-r-Q', '品質因子 Q', 'b > 0 ? Math.sqrt(k * m) / b : "∞"', { digits: 2, color: C.ink, group: '參數' }),
    readout('dmp-r-Td', '理論阻尼週期 T_d', 'b < 2 * Math.sqrt(k * m) ? 2 * Math.PI / Math.sqrt(k / m - Math.pow(b / (2 * m), 2)) : "不振盪"', { unit: 's', digits: 3, color: C.muted, group: '欠阻尼量測' }),
    readout('dmp-r-Tdm', '實測阻尼週期', 'Tdm > 0 ? Tdm : "—"', { unit: 's', digits: 3, color: C.blue, group: '欠阻尼量測' }),
    readout('dmp-r-dth', '理論對數衰減率 γT_d', 'b < 2 * Math.sqrt(k * m) ? (b / (2 * m)) * 2 * Math.PI / Math.sqrt(k / m - Math.pow(b / (2 * m), 2)) : "—"', { digits: 4, color: C.muted, group: '欠阻尼量測' }),
    readout('dmp-r-d', '實測對數衰減率 δ', 'delta > 0 ? delta : "—"', { digits: 4, color: C.blue, group: '欠阻尼量測' }),
    readout('dmp-r-E', '力學能 E', 'E', { unit: 'J', digits: 4, color: C.teal, group: '能量' }),
    readout('dmp-r-Er', 'E / E₀', 'E / (0.5 * k * x0 * x0)', { digits: 4, color: C.teal, group: '能量' }),
    customDraw('dmp-draw', '阻尼振子與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var x = vars.x, x0 = vars.x0, k = vars.k, m = vars.m, b = vars.b, gam = b / (2 * m), w0 = Math.sqrt(k / m);
// ── 振子：彈簧（上）與阻尼器（下）並聯 ──
var eq = 330, sc = 70, my = 66, xp = eq + x * sc, wall = 26;
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(14, my - 46, 12, 92);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, my + 40); ctx.lineTo(W - 14, my + 40); ctx.stroke();
var sy = my - 14, dy = my + 16, xe = xp - 26;
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2; ctx.beginPath();
for (var i = 0; i <= 70; i++) { var s = i / 70, px = wall + s * (xe - wall), py = sy + (i > 3 && i < 67 ? Math.sin(s * 18 * Math.PI) * 7 : 0); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
ctx.stroke();
// 阻尼器：缸體固定在牆上、活塞連在質點上
var cyl0 = wall, cylL = 150;
ctx.strokeStyle = "#2A9D8F"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(cyl0, dy); ctx.lineTo(cyl0 + 20, dy); ctx.stroke();
ctx.strokeRect(cyl0 + 20, dy - 9, cylL, 18);
ctx.fillStyle = "rgba(42,157,143," + (0.08 + 0.4 * Math.min(1, b / 6)).toFixed(2) + ")"; ctx.fillRect(cyl0 + 21, dy - 8, cylL - 2, 16);
var pist = Math.max(cyl0 + 26, Math.min(cyl0 + 20 + cylL - 6, xe - 120));
ctx.beginPath(); ctx.moveTo(pist, dy - 8); ctx.lineTo(pist, dy + 8); ctx.moveTo(pist, dy); ctx.lineTo(xe, dy); ctx.stroke();
ctx.fillStyle = "#2A9D8F"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("阻尼器 b", cyl0 + 20 + cylL / 2, dy + 22);
ctx.setLineDash([4, 4]); ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(eq, my - 50); ctx.lineTo(eq, my + 40); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.fillRect(xp - 26, my - 30, 52, 60); ctx.strokeRect(xp - 26, my - 30, 52, 60);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.fillText("m", xp, my + 4);
// ── x(t) 與包絡線 ──
var h = track("_dmpH", [vars.t, x, vars.E], 6000);
var win = 20, t1 = Math.max(vars.t, win), t0 = t1 - win, vis = h.filter(function (p) { return p[0] >= t0; });
var env1 = [], env2 = [];
if (gam > 0 && gam < w0) for (var j = 0; j <= 100; j++) { var tt = t0 + j * win / 100, ev = x0 * Math.exp(-gam * tt) / Math.cos(Math.atan(gam / Math.sqrt(w0 * w0 - gam * gam))); env1.push([tt, ev]); env2.push([tt, -ev]); }
miniPlot({ x: 6, y: 128, w: 400, h: 266 }, [
  { pts: env1, color: "#9AA0A6", dash: [5, 4], label: "包絡 ±Ae^(−γt)" },
  { pts: env2, color: "#9AA0A6", dash: [5, 4] },
  { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "x(t)" },
], { title: "位置 x (m)", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -x0 * 1.15, ymax: x0 * 1.15 });
// ── 能量 ──
var E0 = 0.5 * k * x0 * x0;
miniPlot({ x: 412, y: 128, w: 202, h: 266 }, [
  { pts: vis.map(function (p) { return [p[0], p[2] / E0]; }), color: "#2A9D8F", label: "E/E₀" },
], { title: "力學能比例", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: 0, ymax: 1.05 });
`),
  ],
};

// ─────────────────────────────────────────────
// 5. 行星軌道
// ─────────────────────────────────────────────
const orbit: ExampleDef = {
  id: 'orbit',
  category: '力學',
  difficulty: '進階',
  listDescription: '行星繞太陽運行：拉動初速得到圓、橢圓或逃逸軌道，畫面以交替色塊呈現等時間掃過的等面積扇形，儀表板即時計算半長軸、離心率與 T²/a³。',
  description: HANDOUTS.orbit,
  info: { title: '行星軌道', author: '', keywords: '', abstract: '' },
  variables: doubles('orb', [
    ['x', '2', '行星 x 位置'], ['y', '0', '行星 y 位置'],
    ['vx', '0', '行星 x 速度'], ['vy', '0.8', '行星 y 速度'],
    ['GM', '1', '重力常數 × 太陽質量'],
    ['r0', '2', '出發距離'],
    ['v0', '0.8', '出發速率（垂直於半徑）'],
    ['r', '2', '行星與太陽距離'],
    ['v', '0.8', '行星速率'],
    ['En', '0', '比能量 v²/2 − GM/r'],
    ['Lz', '0', '比角動量 x·vy − y·vx'],
    ['rmin', '2', '近日距'], ['rmax', '2', '遠日距'],
    ['Tm', '0', '實測週期'],
  ]),
  odePages: [{
    id: 'orb-ode', name: '重力方程', method: 'Yoshida4', increment: '0.002', comment: '辛積分器：長時間不會出現能量漂移',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'vx', expression: '-GM * x / Math.pow(x*x + y*y, 1.5)' },
      { state: 'vy', expression: '-GM * y / Math.pow(x*x + y*y, 1.5)' },
    ],
  }],
  constraintPages: [{
    id: 'orb-con', name: '出發與軌道量測', comment: '',
    code: String.raw`var sig = v0 + '|' + r0 + '|' + GM;
if (_v._sig !== sig) {
  _v._sig = sig;
  x = r0; y = 0; vx = 0; vy = v0; t = 0; Tm = 0; rmin = r0; rmax = r0; _v._yp = 0; _v._tc = 0;
}
r = Math.sqrt(x * x + y * y); v = Math.sqrt(vx * vx + vy * vy);
En = 0.5 * v * v - GM / r;
Lz = x * vy - y * vx;
if (r < rmin) rmin = r;
if (r > rmax) rmax = r;
// 由下往上穿過正 x 軸 → 繞完一圈
if (_v._yp < 0 && y >= 0 && x > 0) { var tc = t - y / vy; Tm = tc - _v._tc; _v._tc = tc; }
_v._yp = y;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('orb-dp', 620, 420, [0, 10, 0, 10]),
    slider('orb-s-v', 'v0', 0.4, 1.3, 0.01, '出發速率 v₀'),
    slider('orb-s-r', 'r0', 1, 3, 0.1, '出發距離 r₀'),
    readout('orb-r-type', '軌道形狀', 'En < -1e-6 ? (Math.abs(rmax - rmin) / (rmax + rmin) < 0.01 ? "近圓" : "橢圓") : En > 1e-6 ? "雙曲線（逃逸）" : "拋物線（剛好逃逸）"', { color: C.purple, group: '軌道要素' }),
    readout('orb-r-a', '半長軸 a = −GM/2E', 'En < 0 ? -GM / (2 * En) : "—"', { digits: 3, color: C.blue, group: '軌道要素' }),
    readout('orb-r-e', '離心率 e', 'En < 0 ? (rmax - rmin) / (rmax + rmin) : "≥ 1"', { digits: 3, color: C.blue, group: '軌道要素' }),
    readout('orb-r-Tth', '理論週期 2π√(a³/GM)', 'En < 0 ? 2 * Math.PI * Math.sqrt(Math.pow(-GM / (2 * En), 3) / GM) : "—"', { digits: 3, color: C.muted, group: '克卜勒第三定律' }),
    readout('orb-r-Tm', '實測週期', 'Tm > 0 ? Tm : "量測中…"', { digits: 3, color: C.blue, group: '克卜勒第三定律' }),
    readout('orb-r-k3', '實測 T² / a³', 'Tm > 0 && En < 0 ? Tm * Tm / Math.pow(-GM / (2 * En), 3) : "…"', { digits: 3, color: C.teal, group: '克卜勒第三定律' }),
    readout('orb-r-k3th', '理論 4π²/GM', '4 * Math.PI * Math.PI / GM', { digits: 3, color: C.muted, group: '克卜勒第三定律' }),
    readout('orb-r-En', '比能量 E', 'En', { digits: 4, color: C.teal, group: '守恆量' }),
    readout('orb-r-L', '角動量 L', 'Lz', { digits: 4, color: C.teal, group: '守恆量' }),
    readout('orb-r-dA', '面積速率 dA/dt = L/2', 'Lz / 2', { digits: 4, color: C.amber, group: '守恆量' }),
    readout('orb-r-r', '距離 r', 'r', { digits: 3, color: C.ink, group: '即時' }),
    readout('orb-r-v', '速率 v', 'v', { digits: 3, color: C.red, group: '即時' }),
    readout('orb-r-vc', '此處圓軌道速率 √(GM/r₀)', 'Math.sqrt(GM / r0)', { digits: 3, color: C.muted, group: '參考速率' }),
    readout('orb-r-ve', '此處脫離速率 √(2GM/r₀)', 'Math.sqrt(2 * GM / r0)', { digits: 3, color: C.muted, group: '參考速率' }),
    customDraw('orb-draw', '軌道與等面積扇形', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var GM = vars.GM, r0 = vars.r0, v0 = vars.v0, En0 = 0.5 * v0 * v0 - GM / r0;
var bound = En0 < 0, a = bound ? -GM / (2 * En0) : 0, T = bound ? 2 * Math.PI * Math.sqrt(a * a * a / GM) : 0;
var Rv = bound ? Math.min(9, Math.max(2.5, 1.12 * Math.max(r0, 2 * a - r0))) : 6;
var S = 420, cx = S / 2, cy = H / 2, sc = (S / 2 - 10) / Rv;
function X(x) { return cx + x * sc; }
function Y(y) { return cy - y * sc; }
ctx.strokeStyle = "rgba(43,45,49,0.06)"; ctx.lineWidth = 1;
for (var gr = 1; gr <= Rv; gr++) { ctx.beginPath(); ctx.arc(cx, cy, gr * sc, 0, 2 * Math.PI); ctx.stroke(); }
// 軌跡（含時間）
var tr = track("_orbT", [vars.t, vars.x, vars.y], 12000);
// 等面積扇形：每 T/12 一塊，交替著色（只畫最近 12 塊）
if (bound && T > 0) {
  var dtA = T / 12, kNow = Math.floor(vars.t / dtA);
  for (var kk = Math.max(0, kNow - 12); kk < kNow; kk++) {
    var seg = tr.filter(function (p) { return p[0] >= kk * dtA && p[0] <= (kk + 1) * dtA; });
    if (seg.length < 2) continue;
    ctx.fillStyle = kk % 2 ? "rgba(47,111,176,0.16)" : "rgba(233,162,59,0.22)";
    ctx.beginPath(); ctx.moveTo(cx, cy);
    seg.forEach(function (p) { ctx.lineTo(X(p[1]), Y(p[2])); });
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
  ctx.fillText("每一色塊為 T/12 時間內掃過的面積（面積皆相同）", 8, H - 10);
}
ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5; ctx.beginPath();
tr.forEach(function (p, i) { if (i) ctx.lineTo(X(p[1]), Y(p[2])); else ctx.moveTo(X(p[1]), Y(p[2])); });
ctx.stroke();
// 太陽、行星與速度
var sun = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
sun.addColorStop(0, "#FFF4C7"); sun.addColorStop(1, "#E9A23B");
ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, 2 * Math.PI); ctx.fill();
var px = X(vars.x), py = Y(vars.y);
ctx.strokeStyle = "rgba(107,111,118,0.6)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
arrow(px, py, px + vars.vx * 40, py - vars.vy * 40, "#D1495B", 2);
ctx.fillStyle = "#2F6FB0"; ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * Math.PI); ctx.fill();
// r(t) 與 v(t)
var t1 = Math.max(vars.t, bound ? Math.min(2 * T, 60) : 20), t0 = Math.max(0, t1 - (bound ? Math.min(2 * T, 60) : 20));
var vis = tr.filter(function (p) { return p[0] >= t0; });
miniPlot({ x: 426, y: 6, w: 188, h: 200 }, [
  { pts: vis.map(function (p) { return [p[0], Math.sqrt(p[1] * p[1] + p[2] * p[2])]; }), color: "#2F6FB0", label: "r" },
], { title: "距離 r", xlabel: "t", xmin: t0, xmax: t1, ymin: 0 });
var hv = track("_orbV", [vars.t, vars.v], 12000).filter(function (p) { return p[0] >= t0; });
miniPlot({ x: 426, y: 212, w: 188, h: 202 }, [
  { pts: hv, color: "#D1495B", label: "v" },
], { title: "速率 v（近日點最快）", xlabel: "t", xmin: t0, xmax: t1, ymin: 0 });
`),
  ],
};

// ─────────────────────────────────────────────
// 6. 三體問題（8 字形軌道）
// ─────────────────────────────────────────────
const TB_ACC = (i: number, ax: 'x' | 'y') =>
  [1, 2, 3]
    .filter((j) => j !== i)
    .map((j) => `m*(${ax}${j}-${ax}${i})/Math.pow(Math.hypot(x${j}-x${i},y${j}-y${i}),3)`)
    .join(' + ');

const threebody: ExampleDef = {
  id: 'threebody',
  category: '力學',
  difficulty: '進階',
  listDescription: '三顆等質量星體沿同一條 8 字形軌道追逐（Chenciner–Montgomery 解）。以擾動滑桿測試穩定性，儀表板監看總能量誤差、總動量與實測週期。',
  description: HANDOUTS.threebody,
  info: { title: '三體問題（8字形軌道）', author: '', keywords: '', abstract: '' },
  variables: doubles('tb', [
    ['x1', '0.97000436', '星體1 x'], ['y1', '-0.24308753', '星體1 y'], ['vx1', '0.46620368', '星體1 vx'], ['vy1', '0.43236573', '星體1 vy'],
    ['x2', '-0.97000436', '星體2 x'], ['y2', '0.24308753', '星體2 y'], ['vx2', '0.46620368', '星體2 vx'], ['vy2', '0.43236573', '星體2 vy'],
    ['x3', '0', '星體3 x'], ['y3', '0', '星體3 y'], ['vx3', '-0.93240737', '星體3 vx'], ['vy3', '-0.86473146', '星體3 vy'],
    ['m', '1', '星體質量（G = 1）'],
    ['pert', '0', '擾動 Δ（加在星體3 的 vx 上）'],
    ['E', '0', '總能量'], ['E0', '0', '初始總能量'], ['dE', '0', '相對能量誤差 |ΔE/E₀|'],
    ['Px', '0', '總動量 x'], ['Py', '0', '總動量 y'], ['Lz', '0', '總角動量'],
    ['Tm', '0', '實測週期'],
  ]),
  odePages: [{
    id: 'tb-ode', name: '三體重力方程', method: 'RungeKutta', increment: '0.001', comment: '',
    rates: [1, 2, 3].flatMap((i) => [
      { state: `x${i}`, expression: `vx${i}` },
      { state: `y${i}`, expression: `vy${i}` },
      { state: `vx${i}`, expression: TB_ACC(i, 'x') },
      { state: `vy${i}`, expression: TB_ACC(i, 'y') },
    ]),
  }],
  constraintPages: [{
    id: 'tb-con', name: '初始條件與守恆量', comment: '擾動加在星體3，星體1、2 各分擔一半以維持總動量為零',
    code: String.raw`var sig = pert + '';
if (_v._sig !== sig) {
  _v._sig = sig;
  x1 = 0.97000436; y1 = -0.24308753; x2 = -x1; y2 = -y1; x3 = 0; y3 = 0;
  vx3 = -0.93240737 + pert; vy3 = -0.86473146;
  vx1 = -vx3 / 2; vx2 = -vx3 / 2; vy1 = -vy3 / 2; vy2 = -vy3 / 2;
  t = 0; Tm = 0; _v._d1 = 0; _v._d2 = 0; _v._tc = 0; _v._E0 = 0;
}
var r12 = Math.hypot(x2 - x1, y2 - y1), r13 = Math.hypot(x3 - x1, y3 - y1), r23 = Math.hypot(x3 - x2, y3 - y2);
E = 0.5 * m * (vx1 * vx1 + vy1 * vy1 + vx2 * vx2 + vy2 * vy2 + vx3 * vx3 + vy3 * vy3) - m * m * (1 / r12 + 1 / r13 + 1 / r23);
if (!_v._E0) _v._E0 = E;
E0 = _v._E0; dE = Math.abs((E - E0) / E0);
Px = m * (vx1 + vx2 + vx3); Py = m * (vy1 + vy2 + vy3);
Lz = m * (x1 * vy1 - y1 * vx1 + x2 * vy2 - y2 * vx2 + x3 * vy3 - y3 * vx3);
// 週期：星體3 再次以相同方向（vx、vy < 0）通過原點附近
// （約束頁每步前後各執行一次，只在時間前進時更新歷史）
var d3 = Math.hypot(x3, y3);
if (t !== _v._tl) {
  _v._tl = t;
  if (_v._d1 < _v._d2 && _v._d1 <= d3 && _v._d1 < 0.1 && vx3 < 0 && vy3 < 0 && t > 1) { Tm = t - _v._tc; _v._tc = t; }
  _v._d2 = _v._d1; _v._d1 = d3;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('tb-dp', 620, 420, [0, 10, 0, 10]),
    slider('tb-s-p', 'pert', 0, 0.2, 0.005, '擾動 Δ（星體3 的 vₓ）'),
    readout('tb-r-Tth', '理論週期', '6.32591398', { digits: 4, color: C.muted, group: '週期' }),
    readout('tb-r-Tm', '實測週期', 'Tm > 0 ? Tm : "量測中…"', { digits: 4, color: C.blue, group: '週期' }),
    readout('tb-r-E', '總能量 E', 'E', { digits: 6, color: C.teal, group: '守恆量' }),
    readout('tb-r-dE', '相對能量誤差 |ΔE/E₀|', 'dE', { color: C.red, group: '守恆量' }),
    readout('tb-r-P', '總動量 |P|', 'Math.hypot(Px, Py)', { color: C.ink, group: '守恆量' }),
    readout('tb-r-L', '總角動量 L', 'Lz', { color: C.ink, group: '守恆量' }),
    readout('tb-r-r12', '星體 1–2 距離', 'Math.hypot(x2 - x1, y2 - y1)', { digits: 3, color: C.purple, group: '幾何' }),
    readout('tb-r-d3', '星體3 與中心距離', 'Math.hypot(x3, y3)', { digits: 3, color: C.purple, group: '幾何' }),
    customDraw('tb-draw', '軌道與守恆量圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var sc = 185, cx = W / 2, cy = 130;
function X(x) { return cx + x * sc; }
function Y(y) { return cy - y * sc; }
ctx.strokeStyle = "rgba(43,45,49,0.08)"; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 6); ctx.lineTo(cx, 254); ctx.stroke();
var cols = [["#F9E3E6", "#D1495B"], ["#E3F2EF", "#2A9D8F"], ["#E6EEF7", "#2F6FB0"]];
for (var b = 1; b <= 3; b++) {
  var tr = track("_tbT" + b, [vars.t, vars["x" + b], vars["y" + b]], 2500);
  ctx.strokeStyle = cols[b - 1][1]; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.6; ctx.beginPath();
  tr.forEach(function (p, i) { if (i) ctx.lineTo(X(p[1]), Y(p[2])); else ctx.moveTo(X(p[1]), Y(p[2])); });
  ctx.stroke(); ctx.globalAlpha = 1;
}
for (var b2 = 1; b2 <= 3; b2++) {
  ctx.fillStyle = cols[b2 - 1][0]; ctx.strokeStyle = cols[b2 - 1][1]; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(X(vars["x" + b2]), Y(vars["y" + b2]), 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
}
var cmx = (vars.x1 + vars.x2 + vars.x3) / 3, cmy = (vars.y1 + vars.y2 + vars.y3) / 3;
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(cmx) - 6, Y(cmy)); ctx.lineTo(X(cmx) + 6, Y(cmy)); ctx.moveTo(X(cmx), Y(cmy) - 6); ctx.lineTo(X(cmx), Y(cmy) + 6); ctx.stroke();
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("＋ 質心", 8, 16);
if (vars.pert > 0) { ctx.fillStyle = "#D1495B"; ctx.fillText("已加入擾動 Δ = " + vars.pert.toFixed(3), 8, 32); }
// 能量誤差（對數）與星體 1–2 距離
var h = track("_tbH", [vars.t, Math.log10(Math.max(1e-16, vars.dE)), Math.hypot(vars.x2 - vars.x1, vars.y2 - vars.y1)], 4000);
var t1 = Math.max(vars.t, 20);
miniPlot({ x: 6, y: 262, w: W / 2 - 9, h: 152 }, [
  { pts: h.map(function (p) { return [p[0], p[1]]; }), color: "#D1495B", label: "log₁₀|ΔE/E₀|" },
], { title: "能量誤差（對數）", xlabel: "t", xmin: 0, xmax: t1, ymin: -16, ymax: 0 });
miniPlot({ x: W / 2 + 3, y: 262, w: W / 2 - 9, h: 152 }, [
  { pts: h.map(function (p) { return [p[0], p[2]]; }), color: "#533177", label: "r₁₂" },
], { title: "星體 1–2 距離（週期性）", xlabel: "t", xmin: Math.max(0, t1 - 25), xmax: t1, ymin: 0 });
`),
  ],
};

// ─────────────────────────────────────────────
// 7. 雙擺（含影子雙擺）
// ─────────────────────────────────────────────
/** 雙擺角加速度（Lagrangian），a/b 為兩擺角、p/q 為兩角速度的變數名稱。 */
function dpAcc(which: 1 | 2, a: string, b: string, p: string, q: string): string {
  const den = `(2*m1+m2-m2*Math.cos(2*${a}-2*${b}))`;
  return which === 1
    ? `(-g*(2*m1+m2)*Math.sin(${a}) - m2*g*Math.sin(${a}-2*${b}) - 2*Math.sin(${a}-${b})*m2*(${q}*${q}*L2+${p}*${p}*L1*Math.cos(${a}-${b}))) / (L1*${den})`
    : `(2*Math.sin(${a}-${b})*(${p}*${p}*L1*(m1+m2)+g*(m1+m2)*Math.cos(${a})+${q}*${q}*L2*m2*Math.cos(${a}-${b}))) / (L2*${den})`;
}

const doublepend: ExampleDef = {
  id: 'doublepend',
  category: '力學',
  difficulty: '進階',
  listDescription: '雙擺與它的「影子」：兩個初始角度只差 δ 的雙擺同時擺動，即時畫出分離量的對數成長並擬合李雅普諾夫指數，親眼看見混沌的蝴蝶效應。',
  description: HANDOUTS.doublepend,
  info: { title: '雙擺', author: '', keywords: '', abstract: '' },
  variables: doubles('dpp', [
    ['theta1', '1.5708', '擺1角度（rad）'], ['theta2', '2.0944', '擺2角度（rad）'],
    ['omega1', '0', '擺1角速度'], ['omega2', '0', '擺2角速度'],
    ['s1', '1.5708', '影子擺1角度'], ['s2', '2.0954', '影子擺2角度'],
    ['w1', '0', '影子擺1角速度'], ['w2', '0', '影子擺2角速度'],
    ['a1', '90', '擺1初始角度（度）'], ['a2', '120', '擺2初始角度（度）'],
    ['dlt', '0.001', '影子雙擺擺2 的初始角度差 δ（rad）'],
    ['L1', '1.5', '擺1長度（m）'], ['L2', '1.2', '擺2長度（m）'],
    ['m1', '1', '擺1質量（kg）'], ['m2', '1', '擺2質量（kg）'],
    ['g', '9.8', '重力加速度'],
    ['sep', '0', '兩雙擺在角度空間的距離（rad）'],
    ['lam', '0', '擬合的李雅普諾夫指數（1/s）'],
    ['tdiv', '0', '分離量超過 0.5 rad 的時刻（s）'],
    ['E', '0', '總能量（J）'], ['E0', '0', '初始總能量（J）'],
  ]),
  odePages: [{
    id: 'dpp-ode', name: '雙擺與影子雙擺（Lagrangian）', method: 'RungeKutta', increment: '0.002', comment: '',
    rates: [
      { state: 'theta1', expression: 'omega1' },
      { state: 'theta2', expression: 'omega2' },
      { state: 'omega1', expression: dpAcc(1, 'theta1', 'theta2', 'omega1', 'omega2') },
      { state: 'omega2', expression: dpAcc(2, 'theta1', 'theta2', 'omega1', 'omega2') },
      { state: 's1', expression: 'w1' },
      { state: 's2', expression: 'w2' },
      { state: 'w1', expression: dpAcc(1, 's1', 's2', 'w1', 'w2') },
      { state: 'w2', expression: dpAcc(2, 's1', 's2', 'w1', 'w2') },
    ],
  }],
  constraintPages: [{
    id: 'dpp-con', name: '初始條件、分離量與 λ 擬合', comment: '分離量在 10⁻⁹ 到 0.1 rad 之間時，以最小平方法擬合 ln(sep) 對 t 的斜率',
    code: String.raw`var sig = a1 + '|' + a2 + '|' + dlt + '|' + L1 + '|' + L2 + '|' + m1 + '|' + m2;
if (_v._sig !== sig) {
  _v._sig = sig;
  theta1 = a1 * Math.PI / 180; theta2 = a2 * Math.PI / 180; omega1 = 0; omega2 = 0;
  s1 = theta1; s2 = theta2 + dlt; w1 = 0; w2 = 0;
  t = 0; lam = 0; tdiv = 0;
  _v._n = 0; _v._st = 0; _v._sy = 0; _v._stt = 0; _v._sty = 0; _v._E0 = 0;
}
function wrap(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }
var d1 = wrap(theta1 - s1), d2 = wrap(theta2 - s2);
sep = Math.sqrt(d1 * d1 + d2 * d2);
if (sep > 1e-9 && sep < 0.1 && t > 0.2) {
  var ly = Math.log(sep);
  _v._n++; _v._st += t; _v._sy += ly; _v._stt += t * t; _v._sty += t * ly;
  var den = _v._n * _v._stt - _v._st * _v._st;
  if (_v._n > 50 && den > 0) lam = (_v._n * _v._sty - _v._st * _v._sy) / den;
}
if (!tdiv && sep > 0.5) tdiv = t;
E = 0.5 * (m1 + m2) * L1 * L1 * omega1 * omega1 + 0.5 * m2 * L2 * L2 * omega2 * omega2
  + m2 * L1 * L2 * omega1 * omega2 * Math.cos(theta1 - theta2)
  - (m1 + m2) * g * L1 * Math.cos(theta1) - m2 * g * L2 * Math.cos(theta2);
if (!_v._E0) _v._E0 = E;
E0 = _v._E0;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('dpp-dp', 620, 420, [0, 10, 0, 10]),
    slider('dpp-s-a1', 'a1', -180, 180, 1, '擺1初始角 (°)'),
    slider('dpp-s-a2', 'a2', -180, 180, 1, '擺2初始角 (°)'),
    slider('dpp-s-d', 'dlt', 0.0001, 0.01, 0.0001, '影子差異 δ (rad)'),
    readout('dpp-r-sep', '目前分離量', 'sep', { unit: 'rad', color: C.red, group: '混沌（對初始條件的敏感性）' }),
    readout('dpp-r-lam', '擬合李雅普諾夫指數 λ', 'lam > 0 ? lam : "擬合中…"', { unit: '1/s', digits: 3, color: C.purple, group: '混沌（對初始條件的敏感性）' }),
    readout('dpp-r-tdiv', '分離 > 0.5 rad 的時刻', 'tdiv > 0 ? tdiv : "尚未分離"', { unit: 's', digits: 2, color: C.red, group: '混沌（對初始條件的敏感性）' }),
    readout('dpp-r-tp', '可預測時間估計 ln(0.5/δ)/λ', 'lam > 0 ? Math.log(0.5 / dlt) / lam : "…"', { unit: 's', digits: 2, color: C.purple, group: '混沌（對初始條件的敏感性）' }),
    readout('dpp-r-E', '總能量 E', 'E', { unit: 'J', digits: 4, color: C.teal, group: '能量守恆' }),
    readout('dpp-r-dE', '相對能量誤差', 'E0 !== 0 ? Math.abs((E - E0) / E0) : 0', { color: C.teal, group: '能量守恆' }),
    customDraw('dpp-draw', '雙擺與分離量圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var L1 = vars.L1, L2 = vars.L2, sc = 190 / (L1 + L2), px = 180, py = 210;
function bobs(a, b) {
  var x1 = px + L1 * sc * Math.sin(a), y1 = py + L1 * sc * Math.cos(a);
  return [x1, y1, x1 + L2 * sc * Math.sin(b), y1 + L2 * sc * Math.cos(b)];
}
var P = bobs(vars.theta1, vars.theta2), Q = bobs(vars.s1, vars.s2);
// 擺2 軌跡
var tr = track("_dppT", [vars.t, P[2], P[3], Q[2], Q[3]], 900);
ctx.lineWidth = 1;
ctx.strokeStyle = "rgba(42,157,143,0.5)"; ctx.beginPath(); tr.forEach(function (p, i) { if (i) ctx.lineTo(p[1], p[2]); else ctx.moveTo(p[1], p[2]); }); ctx.stroke();
ctx.strokeStyle = "rgba(209,73,91,0.35)"; ctx.beginPath(); tr.forEach(function (p, i) { if (i) ctx.lineTo(p[3], p[4]); else ctx.moveTo(p[3], p[4]); }); ctx.stroke();
// 影子雙擺（半透明紅）
ctx.globalAlpha = 0.45; ctx.strokeStyle = "#D1495B"; ctx.lineWidth = 2.5;
ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(Q[0], Q[1]); ctx.lineTo(Q[2], Q[3]); ctx.stroke();
ctx.fillStyle = "#D1495B"; [[Q[0], Q[1]], [Q[2], Q[3]]].forEach(function (c) { ctx.beginPath(); ctx.arc(c[0], c[1], 10, 0, 2 * Math.PI); ctx.fill(); });
ctx.globalAlpha = 1;
// 主雙擺
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2.5;
ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(P[0], P[1]); ctx.lineTo(P[2], P[3]); ctx.stroke();
ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(P[0], P[1], 10, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#2A9D8F"; ctx.beginPath(); ctx.arc(P[2], P[3], 10, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fill();
ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillStyle = "#2B2D31"; ctx.fillText("● 雙擺", 8, 16); ctx.fillStyle = "#D1495B"; ctx.fillText("● 影子雙擺（擺2 多 δ）", 8, 32);
// 右側圖表
var h = track("_dppH", [vars.t, vars.theta2 * 180 / Math.PI, vars.s2 * 180 / Math.PI, Math.log10(Math.max(1e-12, vars.sep))], 6000);
var t1 = Math.max(vars.t, 15);
miniPlot({ x: 366, y: 6, w: 248, h: 196 }, [
  { pts: h.map(function (p) { return [p[0], Math.atan2(Math.sin(p[1] * Math.PI / 180), Math.cos(p[1] * Math.PI / 180)) * 180 / Math.PI]; }), color: "#2A9D8F", label: "θ₂" },
  { pts: h.map(function (p) { return [p[0], Math.atan2(Math.sin(p[2] * Math.PI / 180), Math.cos(p[2] * Math.PI / 180)) * 180 / Math.PI]; }), color: "#D1495B", label: "影子 θ₂", dash: [4, 3] },
], { title: "擺2 角度（°）", xlabel: "t(s)", xmin: Math.max(0, t1 - 15), xmax: t1, ymin: -180, ymax: 180 });
var fit = [];
if (vars.lam > 0) fit = [[0, Math.log10(vars.dlt)], [t1, Math.log10(vars.dlt) + vars.lam * t1 / Math.LN10]];
miniPlot({ x: 366, y: 208, w: 248, h: 206 }, [
  { pts: fit, color: "#533177", dash: [5, 4], label: "擬合斜率 λ" },
  { pts: h.map(function (p) { return [p[0], p[3]]; }), color: "#D1495B", label: "log₁₀ 分離量" },
], { title: "分離量（對數）指數成長", xlabel: "t(s)", xmin: 0, xmax: t1, ymin: -5, ymax: 1 });
`),
  ],
};

/** The upgraded foundational examples (shm, pendulum, projectile, damped, orbit, threebody, doublepend). */
const FOUNDATION_EXAMPLES: ExampleDef[] = [shm, pendulum, projectile, damped, orbit, threebody, doublepend];

export default FOUNDATION_EXAMPLES;

import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：力學（二）
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 阿特午機
// ─────────────────────────────────────────────
const atwoodHandout = String.raw`# ⚖️ 阿特午機：牛頓第二定律實驗講義

> 1784 年，英國劍橋的阿特午（George Atwood）把兩個幾乎等重的物體掛在一個輕巧的滑輪兩側。兩邊重量只差一點點，系統就會「慢動作」地加速——讓當時只有擺鐘可以計時的人們，第一次能仔細量測等加速度運動，驗證牛頓第二定律。

## 一、實驗目的

1. 量測阿特午機的加速度，驗證牛頓第二定律 $F_{net} = ma$ 應用於「多物體系統」的結果。
2. 比較「忽略滑輪」與「考慮滑輪轉動慣量」兩種理論，理解滑輪的等效質量 $I/r^2$。
3. 觀察滑輪有轉動慣量或軸承摩擦時，兩側繩張力 $T_1$ 與 $T_2$ 不再相等。
4. 以「固定總質量、改變質量差」的線性作圖法，同時求出 $g$、滑輪等效質量與摩擦力。

## 二、課前預報

1. 分別畫出 $m_1$、$m_2$ 與滑輪的力圖（自由體圖），標出所有作用力。
2. 若滑輪無質量、無摩擦，證明加速度 $a = \dfrac{(m_1 - m_2)g}{m_1 + m_2}$，且兩側張力相等 $T = \dfrac{2m_1 m_2 g}{m_1 + m_2}$。
3. 滑輪是半徑 $r$、質量 $M$ 的均勻圓盤，其轉動慣量 $I = \frac12 Mr^2$。它的「等效質量」$I/r^2$ 是多少？
4. 取 $m_1 = 0.60$ kg、$m_2 = 0.40$ kg、$I/r^2 = 0.10$ kg、$g = 9.8\ \text{m/s}^2$，計算 $a$、$T_1$、$T_2$。
5. 為什麼兩物體質量越接近，加速度越小？這對 18 世紀的計時有什麼好處？

## 三、實驗原理

### 1. 三個物體的運動方程
取 $m_1$ 向下、$m_2$ 向上為正方向，繩不可伸長且不在滑輪上打滑，所以兩物體加速度大小相同，滑輪角加速度 $\alpha = a/r$：
$$ m_1 g - T_1 = m_1 a, \qquad T_2 - m_2 g = m_2 a, \qquad (T_1 - T_2)r - \tau_f = I\alpha $$
其中 $\tau_f$ 是軸承的摩擦力矩。定義等效摩擦力 $f = \tau_f/r$，三式相加得
$$ a = \frac{(m_1 - m_2)g - f}{m_1 + m_2 + I/r^2} $$

### 2. 兩側張力不同
$$ T_1 = m_1(g - a), \qquad T_2 = m_2(g + a), \qquad T_1 - T_2 = \frac{I}{r^2}a + f $$
滑輪要「被轉動起來」需要一個淨力矩，所以重物那一側的張力必須比較大。只有在 $I = 0$ 且 $f = 0$ 時兩側張力才相等。

### 3. 靜摩擦：拉不動的情況
若 $\lvert m_1 - m_2 \rvert g \le f$，摩擦力矩足以抵抗重量差，系統保持靜止。（本模擬假設軸承的最大靜摩擦力矩等於動摩擦力矩。）

### 4. 線性化作圖法
令總質量 $M = m_1 + m_2$ 固定、質量差 $\Delta m = m_1 - m_2$ 改變，則
$$ a = \frac{g}{M + I/r^2}\Delta m - \frac{f}{M + I/r^2} $$
$a$ 對 $\Delta m$ 作圖是一條直線：斜率 $= g/(M + I/r^2)$，橫軸截距 $= f/g$。

### 5. 本模擬如何「量測」加速度
- **v–t 斜率**：如同實驗室的「智慧滑輪」光電閘，每一個時間步記錄 $m_1$ 的速度，以最小平方法擬合 $v = at + v_0$ 的斜率。
- **落下距離法**：由靜止落下距離 $D$ 所需時間 $t$，$a = 2D/t^2$。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 質量 m₁ | 0.05 至 2 kg | 左側物體 |
| 質量 m₂ | 0.05 至 2 kg | 右側物體 |
| 滑輪等效質量 I/r² | 0 至 1 kg | 0 代表理想的無質量滑輪 |
| 軸承摩擦 f = τ/r | 0 至 1 N | 換算到滑輪邊緣的等效摩擦力 |
| **重新釋放** | 按鈕 | 讓兩物體回到起點、由靜止重新釋放 |

- 左側：滑輪與兩個物體，青色箭頭為繩張力、紅色箭頭為重力（同一比例尺）。滑輪輪輻的轉動對應繩子移動的距離。下降的物體落下 $D = 1.0$ m 碰到地面即停止。
- 右上：$m_1$ 的速度–時間圖（向下為正），藍色為實測，綠色虛線為最小平方擬合，灰色點線為「忽略滑輪」的理論預測。
- 右下：$m_1 g$、$T_1$、$T_2$、$m_2 g$ 的大小比較長條。
- 改變任一滑桿，系統即重新由靜止釋放。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：理想滑輪（I/r² = 0、f = 0）
固定 $m_2 = 0.50$ kg，改變 $m_1$，每次等物體落地後記錄：

| $m_1$ (kg) | 實測 a（v–t 斜率） | 實測 $2D/t^2$ | 理論 $(m_1 - m_2)g/(m_1 + m_2)$ | 誤差 (%) |
|---|---|---|---|---|
| 0.55 | | | | |
| 0.60 | | | | |
| 0.80 | | | | |
| 1.00 | | | | |
| 1.50 | | | | |

此時 $T_1$ 與 $T_2$ 是否相等？

### 步驟 B：固定總質量，改變質量差（I/r² = 0.20 kg、f = 0.30 N）
令 $m_1 + m_2 = 1.00$ kg：

| $m_1$ (kg) | $m_2$ (kg) | $\Delta m$ (kg) | 實測 a (m/s²) |
|---|---|---|---|
| 0.52 | 0.48 | | |
| 0.55 | 0.45 | | |
| 0.60 | 0.40 | | |
| 0.65 | 0.35 | | |
| 0.70 | 0.30 | | |

以 $a$ 對 $\Delta m$ 作圖、做線性擬合。由斜率與截距求出 $g$（假設 $I/r^2$ 已知）或 $I/r^2$（假設 $g$ 已知），以及 $f$。$\Delta m$ 小到多少時系統拉不動？

### 步驟 C：滑輪轉動慣量與張力差（m₁ = 0.60 kg、m₂ = 0.40 kg、f = 0）

| I/r² (kg) | 實測 a | $T_1$ (N) | $T_2$ (N) | $T_1 - T_2$ | $(I/r^2)a$ |
|---|---|---|---|---|---|
| 0 | | | | | |
| 0.10 | | | | | |
| 0.30 | | | | | |
| 0.60 | | | | | |
| 1.00 | | | | | |

驗證 $T_1 - T_2 = (I/r^2)a$。

## 六、實驗探究問題

1. 步驟 A 中，若一位同學用「忽略滑輪」的公式分析一個 $I/r^2 = 0.1$ kg 的真實滑輪，他算出的 $g$ 會偏大還是偏小？偏差多少百分比？
2. 為什麼 $m_1 \gt m_2$ 時，$T_1$ 一定小於 $m_1 g$、$T_2$ 一定大於 $m_2 g$？用「物體在加速」來解釋。
3. 當 $m_1 \to \infty$ 時，$a$ 與 $T_2$ 趨近於多少？這個極限合理嗎？
4. 從能量的角度：$m_1$ 落下 $D$ 時，系統損失的重力位能 $(m_1 - m_2)gD$ 分配到哪些地方？寫出 $m_1$、$m_2$、滑輪的動能與摩擦生熱，並用實測的落地速度驗證。
5. 阿特午機如何讓人以較低精度的計時器「放慢」重力的效果來量測 $g$？與伽利略的斜面實驗有何異曲同工之處？

## 七、誤差來源與模型限制

- 假設繩子無質量、不可伸長且在滑輪上不打滑；真實的繩子有質量，物體移動時兩側繩重會改變，使加速度不再恆定。
- 軸承摩擦以「與速率無關的等效摩擦力 $f$」描述；真實軸承還有與速率有關的黏滯阻力，空氣阻力也被忽略。
- 本模擬的速度數據沒有量測雜訊；真實的光電閘有時間解析度限制，且釋放瞬間可能給物體額外初速。
- 實驗室常用的「智慧滑輪」本身有轉動慣量，若沒有扣除，就是步驟 A 的系統誤差來源。

## 八、延伸挑戰

1. 在模型中加入繩子的線密度 $\lambda$：兩側繩重隨位置改變，寫出新的運動方程，觀察 v–t 圖是否仍是直線。
2. 把摩擦改成黏滯型 $f = bv$，系統會達到終端速度嗎？求出終端速度的表示式。
3. 設計「複式阿特午機」：其中一側再掛一個小阿特午機，計算各物體的加速度。

## 九、延伸閱讀

- G. Atwood, *A Treatise on the Rectilinear Motion and Rotation of Bodies*, Cambridge (1784)
- T. B. Greenslade Jr., "Atwood's machine", *The Physics Teacher* 23, 24 (1985)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Force and Motion I〉與〈Rotation〉章
- H. D. Young, R. A. Freedman, *University Physics*,〈Applying Newton's Laws〉與〈Dynamics of Rotational Motion〉章
- D. Kleppner, R. Kolenkow, *An Introduction to Mechanics*, Ch. 2〈Newton's Laws〉
`;

const atwood: ExampleDef = {
  id: 'atwood',
  category: '力學',
  difficulty: '入門',
  listDescription: '阿特午機：兩物體掛在有轉動慣量與軸承摩擦的滑輪兩側。由 v–t 圖量測加速度，與 a = (m₁−m₂)g/(m₁+m₂+I/r²) 比較，並觀察兩側張力 T₁ ≠ T₂。',
  description: atwoodHandout,
  info: { title: '阿特午機（牛頓第二定律）', author: '', keywords: '', abstract: '' },
  variables: doubles('atw', [
    ['m1', '0.6', '左側物體質量（kg）'],
    ['m2', '0.4', '右側物體質量（kg）'],
    ['Ieq', '0.1', '滑輪等效質量 I/r²（kg）'],
    ['fr', '0', '軸承摩擦等效力 τ/r（N）'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['D', '1', '下降物體到地面的距離（m）'],
    ['x', '0', 'm₁ 向下的位移（m）'],
    ['v', '0', 'm₁ 向下的速度（m/s）'],
    ['run', '0', '運動中（1 = 是）'],
    ['dir', '0', '運動方向（+1：m₁ 下降）'],
    ['aTh', '0', '理論加速度（m₁ 向下為正）'],
    ['aNaive', '0', '忽略滑輪與摩擦的理論加速度'],
    ['aFit', '0', '實測加速度：v–t 最小平方斜率'],
    ['aD', '0', '實測加速度：2D/t²'],
    ['tEnd', '0', '落下 D 所需時間（s）'],
    ['T1', '0', '左側繩張力（N）'],
    ['T2', '0', '右側繩張力（N）'],
    ['rel', '0', '重新釋放計數（按鈕用）'],
  ]),
  odePages: [{
    id: 'atw-ode', name: '運動方程', method: 'RungeKutta', increment: '0.005', comment: '(m₁+m₂+I/r²)a = (m₁−m₂)g − f',
    rates: [
      { state: 'x', expression: 'v' },
      { state: 'v', expression: 'run > 0.5 ? aTh : 0' },
    ],
  }],
  constraintPages: [{
    id: 'atw-con', name: '釋放、落地與加速度擬合', comment: '每一步記錄 (t, v)，以最小平方法求 v–t 斜率',
    code: String.raw`var sig = m1 + '|' + m2 + '|' + Ieq + '|' + fr + '|' + rel;
if (_v._sig !== sig) {
  _v._sig = sig;
  t = 0; x = 0; v = 0; aFit = 0; aD = 0; tEnd = 0;
  _v._S = [0, 0, 0, 0, 0]; _v._tl = -1;
  var drive = (m1 - m2) * g;
  if (Math.abs(drive) > fr) { dir = drive > 0 ? 1 : -1; run = 1; } else { dir = 0; run = 0; }
}
aNaive = (m1 - m2) * g / (m1 + m2);
aTh = dir !== 0 ? ((m1 - m2) * g - fr * dir) / (m1 + m2 + Ieq) : 0;
if (run > 0.5) { T1 = m1 * (g - aTh); T2 = m2 * (g + aTh); }
else if (tEnd === 0) { T1 = m1 * g; T2 = m2 * g; }
// 落地：線性內插求時間，然後停住
if (run > 0.5 && Math.abs(x) >= D) {
  tEnd = t - (Math.abs(x) - D) / Math.max(1e-9, Math.abs(v));
  aD = dir * 2 * D / (tEnd * tEnd);
  x = dir * D; v = 0; run = 0;
}
// 最小平方擬合 v = a t + b（每個時間步只記錄一次）
if (run > 0.5 && t !== _v._tl) {
  _v._tl = t;
  var S = _v._S;
  S[0] += 1; S[1] += t; S[2] += v; S[3] += t * t; S[4] += t * v;
  var den = S[0] * S[3] - S[1] * S[1];
  if (S[0] > 5 && den > 0) aFit = (S[0] * S[4] - S[1] * S[2]) / den;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('atw-dp', 640, 450, [0, 10, 0, 10]),
    slider('atw-s-m1', 'm1', 0.05, 2, 0.01, '質量 m₁ (kg)'),
    slider('atw-s-m2', 'm2', 0.05, 2, 0.01, '質量 m₂ (kg)'),
    slider('atw-s-I', 'Ieq', 0, 1, 0.01, '滑輪等效質量 I/r² (kg)'),
    slider('atw-s-f', 'fr', 0, 1, 0.01, '軸承摩擦 f (N)'),
    button('atw-b-rel', '重新釋放', 'rel = rel + 1;'),
    readout('atw-r-afit', '實測 a（v–t 斜率）', 'aFit !== 0 ? aFit : (run > 0.5 ? "量測中…" : "靜止")', { unit: 'm/s²', digits: 4, color: C.blue, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-aD', '實測 a = 2D/t²', 'tEnd > 0 ? aD : "落地後計算"', { unit: 'm/s²', digits: 4, color: C.blue, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-ath', '理論 a（含滑輪、摩擦）', 'aTh', { unit: 'm/s²', digits: 4, color: C.teal, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-anv', '忽略滑輪 (m₁−m₂)g/(m₁+m₂)', 'aNaive', { unit: 'm/s²', digits: 4, color: C.muted, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-err', '實測與理論差', 'aFit !== 0 && aTh !== 0 ? Number((100 * (aFit - aTh) / aTh).toFixed(4)) : "…"', { unit: '%', digits: 3, color: C.ink, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-errN', '「忽略滑輪」公式的誤差', 'aFit !== 0 ? Number((100 * (aNaive - aFit) / aFit).toFixed(3)) : "…"', { unit: '%', digits: 2, color: C.muted, group: '加速度（m₁ 向下為正）' }),
    readout('atw-r-T1', '張力 T₁', 'T1', { unit: 'N', digits: 4, color: C.teal, group: '張力' }),
    readout('atw-r-T2', '張力 T₂', 'T2', { unit: 'N', digits: 4, color: C.teal, group: '張力' }),
    readout('atw-r-dT', 'T₁ − T₂', 'T1 - T2', { unit: 'N', digits: 4, color: C.amber, group: '張力' }),
    readout('atw-r-dTth', '(I/r²)a + f', 'run > 0.5 || tEnd > 0 ? Ieq * aTh + fr * dir : "靜止時由靜摩擦平衡"', { unit: 'N', digits: 4, color: C.muted, group: '張力' }),
    readout('atw-r-t', '落下 1 m 所需時間', 'tEnd > 0 ? tEnd : "…"', { unit: 's', digits: 4, color: C.red, group: '運動' }),
    readout('atw-r-v', 'm₁ 速度', 'v', { unit: 'm/s', digits: 3, color: C.red, group: '運動' }),
    customDraw('atw-draw', '阿特午機與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var m1 = vars.m1, m2 = vars.m2, x = vars.x, D = vars.D, g = vars.g, Ieq = vars.Ieq;
var sc = 160, floorY = H - 16, yb0 = floorY - D * sc, pcx = 150, pcy = 44, pr = 26;
// ── 天花板與支架 ──
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(70, 0, 160, 8);
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pcx, 8); ctx.lineTo(pcx, pcy); ctx.stroke();
// ── 地面 ──
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, floorY, 300, H - floorY);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(300, floorY); ctx.stroke();
// ── 物體與繩 ──
function boxH(mm) { return 16 + 24 * Math.sqrt(Math.min(mm, 2) / 2); }
var h1 = boxH(m1), h2 = boxH(m2), lx = pcx - pr, rx = pcx + pr;
var b1 = yb0 + x * sc, b2 = yb0 - x * sc;
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(lx, pcy); ctx.lineTo(lx, b1 - h1); ctx.moveTo(rx, pcy); ctx.lineTo(rx, b2 - h2); ctx.stroke();
// ── 滑輪（輪輻隨繩轉動；顏色深淺代表轉動慣量）──
var ang = -x * sc / pr, shade = Math.min(1, Ieq);
ctx.fillStyle = "rgba(107,111,118," + (0.15 + 0.6 * shade).toFixed(2) + ")"; ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.lineWidth = 1.5;
for (var k = 0; k < 3; k++) {
  var a1 = ang + k * Math.PI / 3;
  ctx.beginPath(); ctx.moveTo(pcx - pr * 0.85 * Math.cos(a1), pcy - pr * 0.85 * Math.sin(a1)); ctx.lineTo(pcx + pr * 0.85 * Math.cos(a1), pcy + pr * 0.85 * Math.sin(a1)); ctx.stroke();
}
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(pcx, pcy, 3.5, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillText("I/r² = " + Ieq.toFixed(2) + " kg", pcx + pr + 8, pcy - 8);
if (vars.fr > 0) ctx.fillText("軸承摩擦 f", pcx + pr + 8, pcy + 8);
function drawBox(cx, bot, hh, lab) {
  ctx.fillStyle = "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 20, bot - hh, 40, hh); ctx.strokeRect(cx - 20, bot - hh, 40, hh);
  ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText(lab, cx, bot - hh / 2 + 4);
}
drawBox(lx, b1, h1, "m₁"); drawBox(rx, b2, h2, "m₂");
// ── 力的箭頭（同一比例尺）──
var landed = vars.tEnd > 0, kF = 62 / (Math.max(m1, m2) * g);
if (!landed) {
  var ax1 = lx - 30, ay1 = b1 - h1 / 2, ax2 = rx + 30, ay2 = b2 - h2 / 2;
  arrow(ax1, ay1, ax1, ay1 - vars.T1 * kF, "#2A9D8F", 2.5); arrow(ax1, ay1, ax1, ay1 + m1 * g * kF, "#D1495B", 2.5);
  arrow(ax2, ay2, ax2, ay2 - vars.T2 * kF, "#2A9D8F", 2.5); arrow(ax2, ay2, ax2, ay2 + m2 * g * kF, "#D1495B", 2.5);
  ctx.font = "11px sans-serif"; ctx.textAlign = "right";
  ctx.fillStyle = "#2A9D8F"; ctx.fillText("T₁", ax1 - 5, ay1 - vars.T1 * kF + 10);
  ctx.fillStyle = "#D1495B"; ctx.fillText("m₁g", ax1 - 5, ay1 + m1 * g * kF - 2);
  ctx.textAlign = "left";
  ctx.fillStyle = "#2A9D8F"; ctx.fillText("T₂", ax2 + 5, ay2 - vars.T2 * kF + 10);
  ctx.fillStyle = "#D1495B"; ctx.fillText("m₂g", ax2 + 5, ay2 + m2 * g * kF - 2);
}
// ── 刻度尺：D = 1 m ──
var rlx = 272;
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rlx, yb0); ctx.lineTo(rlx, floorY); ctx.stroke();
ctx.font = "10px monospace"; ctx.fillStyle = "#6B6F76"; ctx.textAlign = "right";
for (var j = 0; j <= 10; j++) {
  var yy = yb0 + j * 0.1 * sc;
  ctx.beginPath(); ctx.moveTo(rlx - (j % 5 === 0 ? 8 : 4), yy); ctx.lineTo(rlx, yy); ctx.stroke();
  if (j % 5 === 0) ctx.fillText((j / 10).toFixed(1), rlx - 10, yy + 3);
}
ctx.textAlign = "center"; ctx.fillText("D (m)", rlx - 6, yb0 - 8);
if (landed) { ctx.fillStyle = "#D1495B"; ctx.font = "bold 12px sans-serif"; ctx.fillText("落地！按「重新釋放」再做一次", 150, floorY + 12); }
else if (vars.run < 0.5) { ctx.fillStyle = "#B97A1E"; ctx.font = "bold 12px sans-serif"; ctx.fillText("摩擦力矩大於重量差：靜止", 150, floorY + 12); }
// ── v–t 圖 ──
var aTh = vars.aTh, tTh = Math.abs(aTh) > 1e-9 ? Math.sqrt(2 * D / Math.abs(aTh)) : 99;
var hist = track("_atwH", [vars.t, vars.v], 4000);
var xmax = tTh < 12 ? tTh * 1.12 : Math.max(12, vars.t);
var xmin = tTh < 12 ? 0 : xmax - 12;
var vmax = Math.max(0.2, Math.sqrt(2 * D * Math.max(Math.abs(aTh), Math.abs(vars.aNaive))) * 1.1);
var neg = vars.dir < 0;
var tFitEnd = vars.tEnd > 0 ? vars.tEnd : vars.t;
miniPlot({ x: 308, y: 6, w: 326, h: 240 }, [
  { pts: [[0, 0], [xmax, vars.aNaive * xmax]], color: "#9AA0A6", dash: [2, 3], label: "忽略滑輪" },
  { pts: hist.filter(function (p) { return p[0] >= xmin; }), color: "#2F6FB0", width: 3, label: "實測 v" },
  { pts: vars.aFit !== 0 ? [[0, 0], [tFitEnd, vars.aFit * tFitEnd]] : [], color: "#2A9D8F", dash: [6, 4], width: 1.6, label: "擬合" },
], { title: "m₁ 的速度 v（m/s）", xlabel: "t(s)", xmin: xmin, xmax: xmax, ymin: neg ? -vmax : 0, ymax: neg ? 0 : vmax });
// ── 力的長條圖 ──
var bx = 308, by = 254, bw = 326, bh = H - by - 6;
ctx.fillStyle = "rgba(255,255,255,0.93)"; ctx.fillRect(bx, by, bw, bh);
ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("繩張力與重力（同一比例）", bx + 6, by + 14);
var bars = [["m₁g", m1 * g, "#D1495B"], ["T₁", vars.T1, "#2A9D8F"], ["T₂", vars.T2, "#2A9D8F"], ["m₂g", m2 * g, "#D1495B"]];
var fmax = Math.max(m1, m2) * g * 1.08, base = by + bh - 22, top = by + 26, colW = (bw - 40) / 4;
ctx.strokeStyle = "#B8B4AA"; ctx.beginPath(); ctx.moveTo(bx + 20, base); ctx.lineTo(bx + bw - 12, base); ctx.stroke();
var tops = [];
bars.forEach(function (b, i) {
  var hh = Math.max(0, b[1]) / fmax * (base - top), x0 = bx + 26 + i * colW + colW * 0.2;
  ctx.fillStyle = b[2]; ctx.globalAlpha = i === 1 || i === 2 ? 0.85 : 0.55; ctx.fillRect(x0, base - hh, colW * 0.6, hh); ctx.globalAlpha = 1;
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(b[0], x0 + colW * 0.3, base + 14);
  tops.push([x0, base - hh]);
});
ctx.strokeStyle = "#B97A1E"; ctx.setLineDash([3, 3]);
ctx.beginPath(); ctx.moveTo(tops[1][0], tops[1][1]); ctx.lineTo(tops[2][0] + colW * 0.6, tops[1][1]); ctx.stroke(); ctx.setLineDash([]);
`),
  ],
};

// ─────────────────────────────────────────────
// 斜面與摩擦力
// ─────────────────────────────────────────────
const inclineHandout = String.raw`# 🧱 斜面與摩擦力：靜摩擦與動摩擦實驗講義

> 把書放在桌上，慢慢抬起桌面的一端：一開始書紋風不動，到了某個角度卻「突然」滑下去，而且一滑就停不下來。這個簡單的現象藏著兩個摩擦係數——讓物體開始動的靜摩擦係數 $\mu_s$，以及滑動時的動摩擦係數 $\mu_k$。

## 一、實驗目的

1. 以「慢慢抬高斜面」的方法量測臨界角（摩擦角）$\theta_c$，驗證 $\tan\theta_c = \mu_s$。
2. 量測木塊沿斜面下滑的加速度，驗證 $a = g(\sin\theta - \mu_k\cos\theta)$，並由加速度反推 $\mu_k$。
3. 畫出摩擦力對傾角的關係圖，理解靜摩擦力是「被動的、可調整的」，而動摩擦力近似為定值 $\mu_k N$。
4. 練習把重力分解成平行與垂直斜面的分量，畫出依比例的力圖。

## 二、課前預報

1. 畫出靜止在傾角 $\theta$ 斜面上的木塊之力圖，並把重力分解成沿斜面與垂直斜面兩個分量。
2. 木塊靜止時，靜摩擦力的大小是多少？它一定等於 $\mu_s N$ 嗎？
3. 證明木塊開始滑動的臨界角滿足 $\tan\theta_c = \mu_s$，且與木塊質量無關。
4. 若 $\mu_s = 0.50$、$\mu_k = 0.35$，計算 $\theta_c$，以及斜面剛好在 $\theta_c$ 時木塊開始滑動的加速度。
5. 為什麼通常 $\mu_k \lt \mu_s$？舉出一個生活中的例子。

## 三、實驗原理

### 1. 力的分解
取 $x$ 軸沿斜面向下、$y$ 軸垂直斜面向外。木塊受重力 $mg$、正向力 $N$、摩擦力 $f$（沿斜面向上）：
$$ N = mg\cos\theta, \qquad mg\sin\theta - f = ma $$

### 2. 靜摩擦：需要多少給多少
木塊靜止時 $a = 0$，靜摩擦力恰好等於下滑分力：
$$ f_s = mg\sin\theta \le \mu_s N = \mu_s mg\cos\theta $$
因此只要 $\tan\theta \le \mu_s$ 木塊就不會動。斜面抬到
$$ \theta_c = \tan^{-1}\mu_s $$
時，所需的靜摩擦力達到最大值，木塊開始滑動。$\theta_c$ 稱為**摩擦角**，砂堆的「休止角」也是同一個概念。

### 3. 動摩擦：滑動時近似為定值
一旦滑動，摩擦力變成 $f_k = \mu_k N$，加速度為
$$ a = g(\sin\theta - \mu_k\cos\theta) $$
反過來，由量得的加速度可以求動摩擦係數：
$$ \mu_k = \tan\theta - \frac{a}{g\cos\theta} $$

### 4. 摩擦力對傾角的圖
$$ f(\theta) = mg\sin\theta \quad (\theta \le \theta_c), \qquad f(\theta) = \mu_k mg\cos\theta \quad (\theta \gt \theta_c) $$
在 $\theta_c$ 處摩擦力突然下降 $(\mu_s - \mu_k)mg\cos\theta_c$，所以木塊一開始滑動就有不為零的加速度 $g\cos\theta_c(\mu_s - \mu_k)$——這就是「一滑就停不下來」的原因。

### 5. 本模擬的設定
- 木塊質量 $m = 1$ kg、斜面長 1.5 m、$g = 9.8\ \text{m/s}^2$。
- 自動抬升模式下，傾角從 0° 以每秒 2° 的速率上升，木塊一開始滑動就停止抬升並記錄此刻的角度。
- 物理上 $\mu_k \le \mu_s$；若滑桿設成 $\mu_k \gt \mu_s$，模型會以 $\mu_s$ 代替 $\mu_k$。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 傾角 θ | 0° 至 60° | 手動模式下的斜面傾角 |
| 靜摩擦係數 μs | 0.05 至 1 | 決定臨界角 |
| 動摩擦係數 μk | 0 至 1 | 決定滑動時的加速度 |
| 自動抬升 | 0 或 1 | 1：從 0° 緩慢抬高斜面直到木塊滑動；0：直接使用「傾角 θ」滑桿 |

- 左側：斜面與木塊，箭頭依同一比例畫出重力 $mg$（紅）、其兩個分量（紅色虛線）、正向力 $N$（藍）與摩擦力 $f$（橘）。下方的量尺比較 $\tan\theta$ 與 $\mu_s$、$\mu_k$。
- 右上：摩擦力對傾角的圖。綠線為理論 $f(\theta)$，灰色點線為最大靜摩擦 $\mu_s N$，橘色為實際走過的數據點。
- 右下：木塊開始滑動後的速度–時間圖，綠色虛線為理論斜率。
- 改變任一滑桿，木塊即回到斜面頂端重新開始。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：量測臨界角（自動抬升 = 1）
改變 $\mu_s$，每次等木塊滑下後記錄：

| $\mu_s$ | 實測 $\theta_c$ (°) | $\tan\theta_c$ | 理論 $\tan^{-1}\mu_s$ (°) |
|---|---|---|---|
| 0.20 | | | |
| 0.35 | | | |
| 0.50 | | | |
| 0.70 | | | |
| 1.00 | | | |

以 $\tan\theta_c$ 對 $\mu_s$ 作圖，斜率應為 1。

### 步驟 B：下滑加速度與動摩擦係數（自動抬升 = 0、μs = 0.30、μk = 0.20）

| θ (°) | 實測 a (m/s²) | 理論 $g(\sin\theta - \mu_k\cos\theta)$ | 反推 $\mu_k$ |
|---|---|---|---|
| 20 | | | |
| 30 | | | |
| 40 | | | |
| 50 | | | |
| 60 | | | |

以 $a/(g\cos\theta)$ 對 $\tan\theta$ 作圖，應得到斜率 1、縱軸截距 $-\mu_k$ 的直線。θ = 15° 時發生什麼事？為什麼？

### 步驟 C：摩擦力對傾角（自動抬升 = 0、μs = 0.60、μk = 0.40）

| θ (°) | 狀態（靜止／滑動） | 實測 f (N) | $mg\sin\theta$ (N) | $\mu_s N$ (N) | $\mu_k N$ (N) |
|---|---|---|---|---|---|
| 10 | | | | | |
| 20 | | | | | |
| 30 | | | | | |
| 35 | | | | | |
| 40 | | | | | |
| 50 | | | | | |

把數據畫成 f 對 θ 的圖，標出臨界角與摩擦力的「跳降」。

## 六、實驗探究問題

1. 為何臨界角與木塊質量無關？如果在木塊上再疊一塊相同的木塊，$\theta_c$ 會改變嗎？
2. 木塊靜止時，摩擦力隨傾角增加而增加；開始滑動後，摩擦力反而隨傾角增加而減少。請用公式解釋。
3. 步驟 B 中若 $\theta \lt \theta_c$，木塊不會滑。若用手推它一下讓它開始滑動，且 $\tan\theta \gt \mu_k$，它會怎樣？若 $\tan\theta \lt \mu_k$ 呢？
4. 從微觀角度（接觸面的凹凸與「冷焊」接點）說明為何 $\mu_s$ 通常大於 $\mu_k$。
5. 地震的「黏滑」（stick-slip）模型與本實驗有什麼關聯？小提琴的弓與弦為何能發聲？

## 七、誤差來源與模型限制

- 採用庫侖摩擦模型：$\mu_s$、$\mu_k$ 與速度、接觸面積、接觸時間都無關。真實材料的 $\mu_k$ 會隨速度略微變化，$\mu_s$ 也會隨靜置時間增加。
- 把木塊視為質點，忽略木塊可能翻倒（高而窄的木塊在大傾角時會先翻倒而不是滑動）。
- 真實實驗中抬升斜面時的振動，會讓木塊在略小於 $\theta_c$ 時就提早滑動，使量得的 $\mu_s$ 偏小。
- 忽略空氣阻力；自動抬升模式的角度以每時間步 0.01° 增加，臨界角的解析度約為 0.01°。

## 八、延伸挑戰

1. 在木塊上加一個沿斜面向上的推力 $F$，求木塊「不下滑」與「不上滑」的 $F$ 範圍。
2. 讓斜面抬到 $\theta_c$ 後再緩慢放低：木塊在什麼角度停止？畫出抬升與放低的「遲滯」曲線。
3. 加入與速度有關的動摩擦 $\mu_k(v)$（例如速度弱化），觀察 v–t 圖是否仍是直線。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Force and Motion II〉章：摩擦力
- H. D. Young, R. A. Freedman, *University Physics*,〈Applying Newton's Laws〉章：Frictional Forces
- F. P. Bowden, D. Tabor, *The Friction and Lubrication of Solids*, Oxford University Press (1950)
- B. N. J. Persson, *Sliding Friction: Physical Principles and Applications*, Springer (2000)
- J. Krim, "Friction at the atomic scale", *Scientific American* 275(4), 74 (1996)
`;

const incline: ExampleDef = {
  id: 'incline-friction',
  category: '力學',
  difficulty: '基礎',
  listDescription: '慢慢抬高斜面直到木塊滑動：量測臨界角驗證 tanθc = μs，再量下滑加速度 a = g(sinθ − μk cosθ)，並畫出摩擦力對傾角的「先升後跳降」圖。',
  description: inclineHandout,
  info: { title: '斜面與摩擦力（靜摩擦與動摩擦）', author: '', keywords: '', abstract: '' },
  variables: doubles('inc', [
    ['thSet', '30', '手動模式的傾角（°）'],
    ['mus', '0.5', '靜摩擦係數 μs'],
    ['muk', '0.35', '動摩擦係數 μk'],
    ['auto', '1', '自動抬升（1 = 開）'],
    ['m', '1', '木塊質量（kg）'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['Lr', '1.5', '斜面可滑行長度（m）'],
    ['rate', '2', '自動抬升速率（°/s）'],
    ['th', '0', '目前傾角（°）'],
    ['s', '0', '沿斜面向下的位移（m）'],
    ['v', '0', '沿斜面向下的速度（m/s）'],
    ['phase', '0', '0 靜止、1 滑動、2 到底'],
    ['fric', '0', '摩擦力大小（N，沿斜面向上）'],
    ['Nf', '0', '正向力（N）'],
    ['thc', '0', '實測臨界角（°）'],
    ['tS', '0', '開始滑動的時刻（s）'],
    ['aFit', '0', '實測加速度（v–t 最小平方斜率）'],
    ['aTh', '0', '理論加速度 g(sinθ − μk cosθ)'],
    ['tEnd', '0', '滑到底的時刻（s）'],
  ]),
  odePages: [{
    id: 'inc-ode', name: '抬升與下滑', method: 'RungeKutta', increment: '0.005', comment: '靜止時 v 不變；滑動時 a = g(sinθ − μk cosθ)',
    rates: [
      { state: 'th', expression: 'auto > 0.5 && phase < 0.5 && th < 60 ? rate : 0' },
      { state: 's', expression: 'v' },
      { state: 'v', expression: 'phase > 0.5 && phase < 1.5 ? g * (Math.sin(th * Math.PI / 180) - Math.min(muk, mus) * Math.cos(th * Math.PI / 180)) : 0' },
    ],
  }],
  constraintPages: [{
    id: 'inc-con', name: '靜摩擦判斷與加速度擬合', comment: '所需靜摩擦 mg sinθ 超過 μs N 時開始滑動',
    code: String.raw`var sig = thSet + '|' + mus + '|' + muk + '|' + auto;
if (_v._sig !== sig) {
  _v._sig = sig;
  t = 0; s = 0; v = 0; phase = 0; thc = 0; tS = 0; aFit = 0; tEnd = 0;
  th = auto > 0.5 ? 0 : thSet;
  _v._S = [0, 0, 0, 0, 0]; _v._tl = -1;
}
if (auto < 0.5) th = thSet;
var rad = th * Math.PI / 180, mkEff = Math.min(muk, mus);
Nf = m * g * Math.cos(rad);
var fDown = m * g * Math.sin(rad);
aTh = g * (Math.sin(rad) - mkEff * Math.cos(rad));
if (phase < 0.5) {
  if (fDown > mus * Nf) { phase = 1; tS = t; if (auto > 0.5) thc = th; }
  else { fric = fDown; v = 0; }
}
if (phase > 0.5) fric = mkEff * Nf;
if (phase > 0.5 && phase < 1.5 && s >= Lr) {
  tEnd = t - (s - Lr) / Math.max(1e-9, v);
  s = Lr; v = 0; phase = 2;
}
// 滑動期間：最小平方擬合 v = a (t − tS) + b
if (phase > 0.5 && phase < 1.5 && t !== _v._tl) {
  _v._tl = t;
  var S = _v._S, tt = t - tS;
  S[0] += 1; S[1] += tt; S[2] += v; S[3] += tt * tt; S[4] += tt * v;
  var den = S[0] * S[3] - S[1] * S[1];
  if (S[0] > 5 && den > 0) aFit = (S[0] * S[4] - S[1] * S[2]) / den;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('inc-dp', 640, 460, [0, 10, 0, 10]),
    slider('inc-s-th', 'thSet', 0, 60, 0.5, '傾角 θ (°)'),
    slider('inc-s-mus', 'mus', 0.05, 1, 0.01, '靜摩擦係數 μs'),
    slider('inc-s-muk', 'muk', 0, 1, 0.01, '動摩擦係數 μk'),
    slider('inc-s-auto', 'auto', 0, 1, 1, '自動抬升（1 = 開）'),
    readout('inc-r-th', '目前傾角 θ', 'th', { unit: '°', digits: 2, color: C.ink, group: '斜面與臨界角' }),
    readout('inc-r-st', '木塊狀態', 'phase < 0.5 ? "靜止" : (phase < 1.5 ? "滑動中" : "已滑到底")', { color: C.ink, group: '斜面與臨界角' }),
    readout('inc-r-thc', '實測臨界角 θc', 'auto > 0.5 ? (thc > 0 ? thc : "抬升中…") : "（僅自動模式）"', { unit: '°', digits: 2, color: C.blue, group: '斜面與臨界角' }),
    readout('inc-r-thcth', '理論 tan⁻¹μs', 'Math.atan(mus) * 180 / Math.PI', { unit: '°', digits: 2, color: C.muted, group: '斜面與臨界角' }),
    readout('inc-r-N', '正向力 N = mg cosθ', 'Nf', { unit: 'N', digits: 3, color: C.blue, group: '力（N）' }),
    readout('inc-r-fd', '下滑分力 mg sinθ', 'm * g * Math.sin(th * Math.PI / 180)', { unit: 'N', digits: 3, color: C.red, group: '力（N）' }),
    readout('inc-r-f', '摩擦力 f', 'fric', { unit: 'N', digits: 3, color: C.amber, group: '力（N）' }),
    readout('inc-r-fmax', '最大靜摩擦 μs N', 'mus * Nf', { unit: 'N', digits: 3, color: C.muted, group: '力（N）' }),
    readout('inc-r-afit', '實測加速度 a（v–t 斜率）', 'aFit !== 0 ? aFit : (phase < 0.5 ? "靜止" : "量測中…")', { unit: 'm/s²', digits: 4, color: C.teal, group: '下滑加速度' }),
    readout('inc-r-ath', '理論 g(sinθ − μk cosθ)', 'phase > 0.5 ? aTh : "尚未滑動"', { unit: 'm/s²', digits: 4, color: C.muted, group: '下滑加速度' }),
    readout('inc-r-mukm', '由 a 反推 μk', 'aFit !== 0 ? Math.tan(th * Math.PI / 180) - aFit / (g * Math.cos(th * Math.PI / 180)) : "…"', { digits: 4, color: C.teal, group: '下滑加速度' }),
    customDraw('inc-draw', '斜面、力圖與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var th = vars.th * Math.PI / 180, m = vars.m, g = vars.g, mus = vars.mus, mk = Math.min(vars.muk, mus);
var cs = Math.cos(th), sn = Math.sin(th);
var hx = 372, hy = 300, Lp = 300;
var tx = hx - Lp * cs, ty = hy - Lp * sn;     // 斜面頂端
var dx = cs, dy = sn, nx = sn, ny = -cs;       // d：沿斜面向下；n：垂直斜面向外
// ── 地面、支架、斜面 ──
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, hy + 6, 384, 30);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, hy + 6); ctx.lineTo(384, hy + 6); ctx.stroke();
ctx.strokeStyle = "#9AA0A6"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tx + 10 * cs, ty + 10 * sn + 6); ctx.lineTo(tx + 10 * cs, hy + 6); ctx.stroke();
ctx.fillStyle = "#E4D6BC"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.2;
ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.lineTo(hx - 9 * nx, hy - 9 * ny); ctx.lineTo(tx - 9 * nx, ty - 9 * ny); ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#6B6F76"; ctx.fillRect(hx - 3 + 6 * nx - 3 * dx, hy + 6 * ny - 3 * dy - 6, 6, 12);
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(hx, hy, 4, 0, 2 * Math.PI); ctx.fill();
// 傾角弧
ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(hx, hy, 46, Math.PI, Math.PI + th); ctx.stroke();
ctx.fillStyle = "#B97A1E"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
ctx.fillText("θ", hx - 60 * Math.cos(th / 2), hy - 60 * Math.sin(th / 2) + 4);
// ── 木塊 ──
var bw = 46, bh = 28, u = 30 + bw / 2 + (vars.s / vars.Lr) * (Lp - 30 - bw - 12);
var px = tx + dx * u, py = ty + dy * u, cx = px + nx * bh / 2, cy = py + ny * bh / 2;
ctx.save(); ctx.translate(cx, cy); ctx.rotate(th);
ctx.fillStyle = vars.phase > 0.5 && vars.phase < 1.5 ? "#F9E3E6" : "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.fillRect(-bw / 2, -bh / 2, bw, bh); ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("m", 0, 4);
ctx.restore();
// ── 力圖（同一比例）──
var kF = 105 / (m * g), mg = m * g, fx0 = px - dx * (bw / 2 + 2) + nx * 3, fy0 = py - dy * (bw / 2 + 2) + ny * 3;
ctx.setLineDash([4, 3]);
arrow(cx, cy, cx + dx * mg * sn * kF, cy + dy * mg * sn * kF, "rgba(209,73,91,0.65)", 1.5);
arrow(cx, cy, cx - nx * mg * cs * kF, cy - ny * mg * cs * kF, "rgba(209,73,91,0.65)", 1.5);
ctx.setLineDash([]);
arrow(cx, cy, cx, cy + mg * kF, "#D1495B", 2.5);
arrow(cx, cy, cx + nx * vars.Nf * kF, cy + ny * vars.Nf * kF, "#2F6FB0", 2.5);
if (vars.fric > 1e-6) arrow(fx0, fy0, fx0 - dx * vars.fric * kF, fy0 - dy * vars.fric * kF, "#E9A23B", 3);
ctx.font = "11px sans-serif"; ctx.textAlign = "center";
ctx.fillStyle = "#D1495B"; ctx.fillText("mg", cx + 14, cy + mg * kF + 4);
ctx.fillStyle = "#2F6FB0"; ctx.fillText("N", cx + nx * (vars.Nf * kF + 10), cy + ny * (vars.Nf * kF + 10) + 4);
if (vars.fric > 1e-6) { ctx.fillStyle = "#B97A1E"; ctx.font = "bold 12px sans-serif"; ctx.fillText("f", fx0 - dx * (vars.fric * kF + 10) + nx * 8, fy0 - dy * (vars.fric * kF + 10) + ny * 8 + 4); ctx.font = "11px sans-serif"; }
ctx.fillStyle = "rgba(209,73,91,0.85)"; ctx.font = "10px sans-serif";
if (sn > 0.05) ctx.fillText("mg sinθ", cx + dx * (mg * sn * kF + 26), cy + dy * (mg * sn * kF + 26) + 4);
ctx.textAlign = "right"; ctx.fillText("mg cosθ", cx - nx * mg * cs * kF - 4, cy - ny * mg * cs * kF + 12); ctx.textAlign = "center";
// ── tanθ 對 μ 的量尺 ──
var gx0 = 30, gx1 = 360, gy = 372, tmax = 1.2;
function GX(val) { return gx0 + Math.min(1, val / tmax) * (gx1 - gx0); }
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("tan θ 與摩擦係數", gx0, gy - 30);
ctx.fillStyle = "#EFE9DC"; ctx.fillRect(gx0, gy - 8, gx1 - gx0, 16);
ctx.fillStyle = Math.tan(th) > mus ? "#D1495B" : "#2F6FB0"; ctx.fillRect(gx0, gy - 8, GX(Math.tan(th)) - gx0, 16);
ctx.font = "10px monospace"; ctx.fillStyle = "#6B6F76"; ctx.textAlign = "center";
for (var q = 0; q <= 6; q++) { var vq = q * 0.2; ctx.fillText(vq.toFixed(1), GX(vq), gy + 22); }
[[mus, "#D1495B", "μs"], [mk, "#B97A1E", "μk"]].forEach(function (mkr, i) {
  var xx = GX(mkr[0]);
  ctx.strokeStyle = mkr[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xx, gy - 12); ctx.lineTo(xx, gy + 12); ctx.stroke();
  ctx.fillStyle = mkr[1]; ctx.font = "bold 11px sans-serif"; ctx.fillText(mkr[2], xx + (i === 0 ? 10 : -10), gy - 13);
});
ctx.font = "11px sans-serif"; ctx.textAlign = "left";
var stTxt = vars.phase < 0.5 ? (vars.auto > 0.5 ? "靜止：斜面緩慢抬升中" : "靜止：tanθ ≤ μs") : (vars.phase < 1.5 ? "tanθ > μs：開始滑動！" : "已滑到底");
ctx.fillStyle = vars.phase < 0.5 ? "#2F6FB0" : "#D1495B"; ctx.fillText(stTxt, gx0, gy + 46);
ctx.fillStyle = "#6B6F76"; ctx.fillText("箭頭：紅 mg（虛線為分量）、藍 N、橘 f", gx0, gy + 66);
// ── 摩擦力對傾角 ──
var thcD = Math.atan(mus) * 180 / Math.PI, fth = [], fmaxS = [];
for (var d = 0; d <= 60.001; d += 0.5) {
  var r = d * Math.PI / 180;
  fth.push([d, d <= thcD ? mg * Math.sin(r) : mk * mg * Math.cos(r)]);
  fmaxS.push([d, mus * mg * Math.cos(r)]);
}
fth.splice(Math.floor(thcD / 0.5) + 1, 0, [thcD, mg * Math.sin(thcD * Math.PI / 180)], [thcD, mk * mg * Math.cos(thcD * Math.PI / 180)]);
var hf = track("_incF", [vars.t, vars.th, vars.fric], 6000);
miniPlot({ x: 392, y: 6, w: 242, h: 240 }, [
  { pts: fmaxS, color: "#9AA0A6", dash: [2, 3], label: "μsN" },
  { pts: fth, color: "#2A9D8F", label: "理論 f" },
  { pts: hf.map(function (p) { return [p[1], p[2]]; }), color: "#E9A23B", width: 2.5, dots: [[vars.th, vars.fric]], label: "實測" },
], { title: "摩擦力 f（N）對傾角", xlabel: "θ(°)", xmin: 0, xmax: 60, ymin: 0, ymax: mg * Math.min(1.05, Math.max(0.3, mus * 1.12)) });
// ── 滑動後的 v–t ──
var hv = track("_incV", [vars.t, vars.v], 4000), tS = vars.tS, sliding = vars.phase > 0.5;
var aTh = vars.aTh, tSl = aTh > 1e-6 ? Math.sqrt(2 * vars.Lr / aTh) : 5;
var vis = sliding ? hv.filter(function (p) { return p[0] >= tS - 1e-9; }).map(function (p) { return [p[0] - tS, p[1]]; }) : [];
var xm = Math.min(20, tSl * 1.2);
miniPlot({ x: 392, y: 254, w: 242, h: 200 }, [
  { pts: vis, color: "#2F6FB0", width: 3, label: "實測 v" },
  { pts: sliding ? [[0, 0], [xm, aTh * xm]] : [], color: "#2A9D8F", dash: [6, 4], label: "理論" },
], { title: sliding ? "開始滑動後的 v（m/s）" : "v–t（木塊尚未滑動）", xlabel: "t−t₀(s)", xmin: 0, xmax: xm, ymin: 0, ymax: Math.max(0.5, Math.sqrt(2 * vars.Lr * Math.max(aTh, 0.01)) * 1.1) });
`),
  ],
};

// ─────────────────────────────────────────────
// 圓錐擺
// ─────────────────────────────────────────────
const conicalHandout = String.raw`# 🎡 圓錐擺與向心力實驗講義

> 遊樂園的旋轉鞦韆越轉越快，座椅就被「甩」得越來越高。其實沒有任何向外的力在甩它——是繩子張力的水平分量提供了向心力。這個看似簡單的裝置，週期竟然只取決於圓錐的「高度」。

## 一、實驗目的

1. 分析圓錐擺的受力：張力的鉛直分量平衡重力、水平分量提供向心力。
2. 驗證圓錐擺週期 $T = 2\pi\sqrt{L\cos\theta/g}$，以及張力 $F_T = mg/\cos\theta$、向心加速度 $a_c = g\tan\theta$。
3. 觀察發射速率不等於「圓周速率」時，擺錘做的是三維球面擺運動：半頂角在兩個值之間振盪，俯視軌跡成為會進動的花瓣形。

## 二、課前預報

1. 畫出做水平圓周運動的擺錘之力圖。為什麼「向心力」不應該再畫成一個獨立的力？
2. 由 $F_T\cos\theta = mg$ 與 $F_T\sin\theta = m\omega^2 r$（$r = L\sin\theta$）推導 $\omega$ 與週期 $T$。
3. 證明週期可以寫成 $T = 2\pi\sqrt{h/g}$，其中 $h = L\cos\theta$ 是懸點到圓周平面的高度。
4. $L = 1.0$ m、$\theta = 30°$、$g = 9.8\ \text{m/s}^2$ 時，計算週期、擺錘速率、張力與重力的比值。
5. 當 $\theta \to 0$ 時，圓錐擺的週期趨近什麼？和單擺的小角度週期有何關係？

## 三、實驗原理

### 1. 圓周運動的條件
擺錘只受重力 $mg$ 與繩張力 $F_T$。在水平圓周上等速率運動時，鉛直方向沒有加速度、水平方向的加速度指向圓心：
$$ F_T\cos\theta = mg, \qquad F_T\sin\theta = m\omega^2 L\sin\theta $$
由此得
$$ F_T = \frac{mg}{\cos\theta} = m\omega^2 L, \qquad \omega = \sqrt{\frac{g}{L\cos\theta}}, \qquad T = 2\pi\sqrt{\frac{L\cos\theta}{g}} $$
向心加速度與所需的速率為
$$ a_c = g\tan\theta, \qquad v_c = \sqrt{gL\sin\theta\tan\theta} $$

### 2. 一般情況：球面擺
若發射速率 $v_0 \ne v_c$，擺錘不會維持在同一個水平圓上。以懸點為原點、$z$ 軸向上，繩長固定為 $L$，運動方程為
$$ \ddot{\vec r} = -\frac{F_T}{mL}\vec r - g\hat z, \qquad F_T = \frac{m\left(v^2 - gz\right)}{L} $$
（張力由「擺錘必須留在半徑 $L$ 的球面上」這個條件決定。）本模擬直接對這組三維方程做數值積分，兩個守恆量為：
- 能量 $E = \frac12 mv^2 + mgz$
- 鉛直軸方向的角動量 $L_z = m(xv_y - yv_x)$

### 3. 偏離圓周時的振盪
發射速率稍微偏離 $v_c$ 時，半頂角 $\theta$ 會在圓周值附近小幅振盪，振盪的角頻率為
$$ \Omega = \omega\sqrt{1 + 3\cos^2\theta_0} $$
因為 $\Omega/\omega$ 一般不是整數，每轉一圈振盪的相位都錯開一些，俯視軌跡就成為不斷進動的花瓣形。（$\theta_0 \to 0$ 時 $\Omega \to 2\omega$，即二維簡諧運動的橢圓軌道。）

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 擺長 L | 0.3 至 2 m | |
| 半頂角 θ | 5° 至 75° | 圓錐的半頂角（繩與鉛直線的夾角） |
| 重力 g | 1.6 至 25 m/s² | 月球約 1.6、地球 9.8 |
| 發射速率倍數 | 0.5 至 1.5 | 1 代表以圓周速率 $v_c$ 水平發射 |

- 左側：斜視的立體圖。橘色虛線為理論圓周，藍線為最近的軌跡；箭頭為張力（青）、重力（紅）與兩者的合力（橘，水平指向軸心），三者同一比例尺。
- 右上：俯視圖。右下：半頂角 $\theta$ 隨時間的變化，橘色虛線為設定的 $\theta$。
- 改變任一滑桿，擺錘即從 $x$ 軸方向以新的條件重新發射（逆時針轉動，由上往下看）。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：週期與半頂角（L = 1.0 m、g = 9.8、速率倍數 = 1）

| θ (°) | 實測週期 (s) | 理論 $2\pi\sqrt{L\cos\theta/g}$ | 實測張力 / mg | $1/\cos\theta$ |
|---|---|---|---|---|
| 10 | | | | |
| 30 | | | | |
| 45 | | | | |
| 60 | | | | |
| 75 | | | | |

以 $T^2$ 對 $\cos\theta$ 作圖，斜率應為 $4\pi^2L/g$，由斜率求 $g$。

### 步驟 B：週期只與高度 h 有關（速率倍數 = 1）
選三組不同的 $(L,\theta)$，使 $h = L\cos\theta$ 都接近 0.50 m（θ 取最接近的整數度）：

| L (m) | θ (°) | $h = L\cos\theta$ (m) | 實測週期 (s) | 理論 $2\pi\sqrt{h/g}$ (s) |
|---|---|---|---|---|
| 0.60 | 34 | | | |
| 1.00 | 60 | | | |
| 1.50 | 71 | | | |

### 步驟 C：偏離圓周速率（L = 1.0 m、θ = 30°）

| 速率倍數 | θ 的最小值 (°) | θ 的最大值 (°) | 實測 θ 振盪週期 (s) | 理論 $2\pi/\Omega$ |
|---|---|---|---|---|
| 0.90 | | | | |
| 0.95 | | | | |
| 1.05 | | | | |
| 1.20 | | | | |

觀察俯視軌跡的形狀。偏離越大，實測振盪週期與小振幅理論的差距如何變化？

## 六、實驗探究問題

1. 圓錐擺能不能做到 $\theta = 90°$（擺錘在懸點的水平面上轉）？需要多大的張力與速率？
2. 在同一個地點，兩個擺長不同的圓錐擺若懸點等高、轉動平面也等高，它們的週期有何關係？
3. 為什麼速率倍數大於 1 時，擺錘會「往上飄」到較大的半頂角？用能量與角動量守恆說明。
4. 汽車在傾斜彎道上行駛時，不需要摩擦力的「設計速率」為 $v^2 = gR\tan\theta$。它和圓錐擺有什麼相同的力學結構？
5. 飛機以傾角 $\phi$ 做協調轉彎時，乘客感受到的「視重」是正常體重的幾倍？與本實驗的哪一個量對應？

## 七、誤差來源與模型限制

- 假設繩子不可伸長、無質量，且始終拉緊（模型中繩長以投影方式維持為 $L$，相當於輕桿）；若張力算出為負，真實的繩子會鬆弛，本模型沒有處理這種情況。
- 忽略空氣阻力；真實的圓錐擺會慢慢降低半頂角，需要持續補充能量。
- 實測週期取自擺錘相鄰兩次通過 $+x$ 半平面的時間，交會時刻以線性內插求得，誤差遠小於一個時間步（0.002 s）。
- 實驗室中以手讓擺錘「起轉」時，很難剛好給出圓周速率與水平方向，因此真實軌跡通常帶有步驟 C 的振盪。

## 八、延伸挑戰

1. 加入與速度成正比的空氣阻力，觀察半頂角與週期隨時間的變化，並與 $T = 2\pi\sqrt{L\cos\theta/g}$ 逐點比較。
2. 給擺錘一個帶有鉛直分量的初速度，研究軌跡的進動角與 $\theta$ 振幅的關係。
3. 由守恆的能量與角動量寫出有效位能 $U_{eff}(\theta)$，畫出它的圖形，並由曲線求出步驟 C 中 $\theta$ 的轉折點。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Force and Motion II〉章：Uniform Circular Motion
- H. D. Young, R. A. Freedman, *University Physics*,〈Applying Newton's Laws〉章：Dynamics of Circular Motion
- J. R. Taylor, *Classical Mechanics*, Ch. 7〈Lagrange's Equations〉：球面擺
- D. Kleppner, R. Kolenkow, *An Introduction to Mechanics*, Ch. 2 與 Ch. 7（圓周運動與角動量）
- L. D. Landau, E. M. Lifshitz, *Mechanics*, §14（球面擺的有效位能）
`;

const conical: ExampleDef = {
  id: 'conical-pendulum',
  category: '力學',
  difficulty: '基礎',
  listDescription: '圓錐擺：擺錘在水平圓上轉動，斜視立體圖加俯視圖。驗證 T = 2π√(L cosθ/g)、張力 mg/cosθ 與向心加速度 g tanθ；改變發射速率則變成三維球面擺的花瓣軌跡。',
  description: conicalHandout,
  info: { title: '圓錐擺與向心力', author: '', keywords: '', abstract: '' },
  variables: doubles('cp', [
    ['L', '1', '擺長（m）'],
    ['thDeg', '30', '半頂角（°）'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['kv', '1', '發射速率 / 圓周速率'],
    ['m', '0.2', '擺錘質量（kg）'],
    ['x', '0', '擺錘 x（m，懸點為原點）'],
    ['y', '0', '擺錘 y（m）'],
    ['z', '0', '擺錘 z（m，向上為正）'],
    ['vx', '0', '速度 x 分量'],
    ['vy', '0', '速度 y 分量'],
    ['vz', '0', '速度 z 分量'],
    ['Ten', '0', '實測張力（N）'],
    ['aC', '0', '實測水平（向心）加速度（m/s²）'],
    ['thNow', '0', '目前半頂角（°）'],
    ['Tm', '0', '實測週期：方位角繞一圈（s）'],
    ['Tosc', '0', '實測 θ 振盪週期（s）'],
    ['thMin', '0', 'θ 的最小值（°）'],
    ['thMax', '0', 'θ 的最大值（°）'],
  ]),
  odePages: [{
    id: 'cp-ode', name: '三維球面擺方程', method: 'RungeKutta', increment: '0.002', comment: 'r¨ = −(v² − gz)/r² · r − g ẑ（張力由繩長固定的條件決定）',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'z', expression: 'vz' },
      { state: 'vx', expression: '-(vx * vx + vy * vy + vz * vz - g * z) / (x * x + y * y + z * z) * x' },
      { state: 'vy', expression: '-(vx * vx + vy * vy + vz * vz - g * z) / (x * x + y * y + z * z) * y' },
      { state: 'vz', expression: '-(vx * vx + vy * vy + vz * vz - g * z) / (x * x + y * y + z * z) * z - g' },
    ],
  }],
  constraintPages: [{
    id: 'cp-con', name: '發射、繩長修正與量測', comment: '每步把擺錘投影回半徑 L 的球面；以 +x 半平面的穿越時間量週期',
    code: String.raw`var sig = L + '|' + thDeg + '|' + g + '|' + kv;
if (_v._sig !== sig) {
  _v._sig = sig;
  var th0 = thDeg * Math.PI / 180, vc = Math.sqrt(g * L * Math.sin(th0) * Math.tan(th0));
  x = L * Math.sin(th0); y = 0; z = -L * Math.cos(th0);
  vx = 0; vy = kv * vc; vz = 0; t = 0;
  Tm = 0; Tosc = 0; thMin = thDeg; thMax = thDeg;
  _v._tl = 0; _v._py = 0; _v._tc = 0; _v._rd = 0; _v._tm = -1;
}
// 數值修正：維持繩長 L、速度垂直於繩
var rr = Math.sqrt(x * x + y * y + z * z);
x = x * L / rr; y = y * L / rr; z = z * L / rr;
var vr = (x * vx + y * vy + z * vz) / L;
vx -= vr * x / L; vy -= vr * y / L; vz -= vr * z / L;
var v2 = vx * vx + vy * vy + vz * vz, lam = (v2 - g * z) / (L * L), rho = Math.sqrt(x * x + y * y);
Ten = m * lam * L;
aC = lam * rho;
thNow = Math.acos(Math.max(-1, Math.min(1, -z / L))) * 180 / Math.PI;
if (t !== _v._tl) {
  var dtc = t - _v._tl; _v._tl = t;
  if (thNow < thMin) thMin = thNow;
  if (thNow > thMax) thMax = thNow;
  // 週期：y 由負轉正且 x > 0
  if (_v._py < 0 && y >= 0 && x > 0) {
    var tc = t - y / vy;
    Tm = tc - _v._tc; _v._tc = tc;
  }
  _v._py = y;
  // θ 振盪：水平徑向速度由負轉正（θ 的極小值）
  var rd = (x * vx + y * vy) / Math.max(1e-9, rho);
  if (Math.abs(kv - 1) > 0.004 && _v._rd < 0 && rd >= 0) {
    var tmn = t - dtc * rd / (rd - _v._rd);
    if (_v._tm >= 0) Tosc = tmn - _v._tm;
    _v._tm = tmn;
  }
  _v._rd = rd;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('cp-dp', 640, 460, [0, 10, 0, 10]),
    slider('cp-s-L', 'L', 0.3, 2, 0.05, '擺長 L (m)'),
    slider('cp-s-th', 'thDeg', 5, 75, 1, '半頂角 θ (°)'),
    slider('cp-s-g', 'g', 1.6, 25, 0.1, '重力 g (m/s²)'),
    slider('cp-s-kv', 'kv', 0.5, 1.5, 0.01, '發射速率倍數 v₀/v_c'),
    readout('cp-r-Tm', '實測週期（繞一圈）', 'Tm > 0 ? Tm : "量測中…"', { unit: 's', digits: 4, color: C.blue, group: '週期' }),
    readout('cp-r-Tth', '理論 2π√(L cosθ/g)', '2 * Math.PI * Math.sqrt(L * Math.cos(thDeg * Math.PI / 180) / g)', { unit: 's', digits: 4, color: C.muted, group: '週期' }),
    readout('cp-r-T0', '單擺小角度 2π√(L/g)', '2 * Math.PI * Math.sqrt(L / g)', { unit: 's', digits: 4, color: C.muted, group: '週期' }),
    readout('cp-r-Ten', '實測張力 F_T', 'Ten', { unit: 'N', digits: 4, color: C.teal, group: '力與加速度（m = 0.2 kg）' }),
    readout('cp-r-Tenth', '理論 mg/cosθ', 'm * g / Math.cos(thDeg * Math.PI / 180)', { unit: 'N', digits: 4, color: C.muted, group: '力與加速度（m = 0.2 kg）' }),
    readout('cp-r-aC', '實測向心加速度', 'aC', { unit: 'm/s²', digits: 4, color: C.amber, group: '力與加速度（m = 0.2 kg）' }),
    readout('cp-r-aCth', '理論 g tanθ', 'g * Math.tan(thDeg * Math.PI / 180)', { unit: 'm/s²', digits: 4, color: C.muted, group: '力與加速度（m = 0.2 kg）' }),
    readout('cp-r-th', '目前半頂角 θ', 'thNow', { unit: '°', digits: 3, color: C.red, group: '軌道' }),
    readout('cp-r-thmin', 'θ 最小值', 'thMin', { unit: '°', digits: 2, color: C.red, group: '軌道' }),
    readout('cp-r-thmax', 'θ 最大值', 'thMax', { unit: '°', digits: 2, color: C.red, group: '軌道' }),
    readout('cp-r-osc', '實測 θ 振盪週期', 'Math.abs(kv - 1) <= 0.004 ? "圓周運動，無振盪" : (Tosc > 0 ? Tosc : "量測中…")', { unit: 's', digits: 4, color: C.purple, group: '軌道' }),
    readout('cp-r-oscth', '小振幅理論 2π/Ω', '2 * Math.PI / (Math.sqrt(g / (L * Math.cos(thDeg * Math.PI / 180))) * Math.sqrt(1 + 3 * Math.pow(Math.cos(thDeg * Math.PI / 180), 2)))', { unit: 's', digits: 4, color: C.muted, group: '軌道' }),
    customDraw('cp-draw', '圓錐擺立體圖與俯視圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var L = vars.L, th0 = vars.thDeg * Math.PI / 180, x = vars.x, y = vars.y, z = vars.z, m = vars.m, g = vars.g;
var el = 0.36, ce = Math.cos(el), se = Math.sin(el);
var R0 = L * Math.sin(th0), zc = -L * Math.cos(th0);
var S = Math.min(372 / (L * Math.cos(th0) + R0 * se + 0.05 * L), 178 / Math.max(R0, 0.15 * L));
var ox = 192, oy = 40;
function PX(px, py) { return ox + S * px; }
function PY(py, pz) { return oy - S * (pz * ce + py * se); }
var hist = track("_cpH", [vars.t, x, y, z, vars.thNow], 8000);
// ── 天花板與鉛直軸 ──
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(ox - 70, oy - 12, 140, 8);
ctx.strokeStyle = "#B8B4AA"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, PY(0, zc) + 30); ctx.stroke();
// 理論圓周（橘）與圓錐輪廓
ctx.strokeStyle = "rgba(233,162,59,0.9)"; ctx.lineWidth = 1.5; ctx.beginPath();
for (var k = 0; k <= 72; k++) { var a = k * Math.PI / 36, X1 = PX(R0 * Math.cos(a)), Y1 = PY(R0 * Math.sin(a), zc); if (k) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
ctx.stroke(); ctx.setLineDash([]);
ctx.strokeStyle = "rgba(233,162,59,0.35)"; ctx.beginPath();
ctx.moveTo(ox, oy); ctx.lineTo(PX(R0), PY(0, zc)); ctx.moveTo(ox, oy); ctx.lineTo(PX(-R0), PY(0, zc)); ctx.stroke();
ctx.fillStyle = "#B8B4AA"; ctx.beginPath(); ctx.arc(ox, PY(0, zc), 2.5, 0, 2 * Math.PI); ctx.fill();
// 軌跡（最近 3 秒）
var tNow = vars.t, rec = hist.filter(function (p) { return p[0] >= tNow - 3; });
ctx.strokeStyle = "rgba(47,111,176,0.55)"; ctx.lineWidth = 1.4; ctx.beginPath();
rec.forEach(function (p, i) { var X1 = PX(p[1]), Y1 = PY(p[2], p[3]); if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
ctx.stroke();
// 繩與擺錘
var bxp = PX(x), byp = PY(y, z);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(bxp, byp); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(ox, oy, 4, 0, 2 * Math.PI); ctx.fill();
var br = 11 * (1 - 0.18 * y / L);
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bxp, byp, br, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
// 力的箭頭：張力、重力、合力（同一比例）
var kF = 78 / (m * g), lam = vars.Ten / (m * L);
var Fx = -lam * m * x, Fy = -lam * m * y, Fz = -lam * m * z;
function vec(fx, fy, fz, col, w) { arrow(bxp, byp, bxp + kF * fx, byp - kF * (fz * ce + fy * se), col, w); }
vec(Fx, Fy, Fz, "#2A9D8F", 2.5);
vec(0, 0, -m * g, "#D1495B", 2.5);
ctx.setLineDash([5, 3]); vec(Fx, Fy, 0, "#B97A1E", 2.2); ctx.setLineDash([]);
ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillStyle = "#2A9D8F"; ctx.fillText("張力", bxp + kF * Fx * 0.6 + 6, byp - kF * (Fz * ce + Fy * se) * 0.6);
ctx.fillStyle = "#D1495B"; ctx.fillText("mg", bxp + 6, byp + kF * m * g);
var hxL = kF * Fx, hyL = -kF * Fy * se;
if (Math.sqrt(hxL * hxL + hyL * hyL) > 28) { ctx.fillStyle = "#B97A1E"; ctx.textAlign = "center"; ctx.fillText("合力", bxp + hxL * 1.25, byp + hyL * 1.25 + (hyL > 0 ? 12 : -4)); }
// θ 標示
ctx.strokeStyle = "#D1495B"; ctx.lineWidth = 1.2;
var thA = Math.atan2(bxp - ox, byp - oy);
ctx.beginPath(); ctx.arc(ox, oy, 36, Math.PI / 2 - thA, Math.PI / 2, thA < 0); ctx.stroke();
ctx.fillStyle = "#D1495B"; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("θ", ox + 46 * Math.sin(thA / 2), oy + 50 * Math.cos(thA / 2));
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillText("斜視圖  L = " + L.toFixed(2) + " m", 10, H - 12);
// ── 俯視圖 ──
var bx = 392, by = 6, bw = 242, bh = 228, cxp = bx + bw / 2, cyp = by + bh / 2 + 8;
ctx.fillStyle = "rgba(255,255,255,0.93)"; ctx.fillRect(bx, by, bw, bh);
ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("俯視圖（由上往下看）", bx + 6, by + 14);
var st = 84 / Math.max(R0, 0.02 * L);
ctx.save(); ctx.beginPath(); ctx.rect(bx + 1, by + 20, bw - 2, bh - 21); ctx.clip();
ctx.strokeStyle = "#EFE9DC"; ctx.beginPath(); ctx.moveTo(bx, cyp); ctx.lineTo(bx + bw, cyp); ctx.moveTo(cxp, by + 20); ctx.lineTo(cxp, by + bh); ctx.stroke();
ctx.strokeStyle = "rgba(233,162,59,0.9)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(cxp, cyp, R0 * st, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
var recT = hist.filter(function (p) { return p[0] >= tNow - 12; });
ctx.strokeStyle = "rgba(47,111,176,0.7)"; ctx.lineWidth = 1.3; ctx.beginPath();
recT.forEach(function (p, i) { var X1 = cxp + p[1] * st, Y1 = cyp - p[2] * st; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(cxp, cyp, 2.5, 0, 2 * Math.PI); ctx.fill();
ctx.strokeStyle = "rgba(43,45,49,0.5)"; ctx.beginPath(); ctx.moveTo(cxp, cyp); ctx.lineTo(cxp + x * st, cyp - y * st); ctx.stroke();
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.beginPath(); ctx.arc(cxp + x * st, cyp - y * st, 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.restore();
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "right"; ctx.fillText("+x", bx + bw - 6, cyp - 4); ctx.textAlign = "left"; ctx.fillText("+y", cxp + 4, by + 30);
// ── θ(t) ──
var win = 10, t1 = Math.max(tNow, win), t0 = t1 - win;
var vis = hist.filter(function (p) { return p[0] >= t0; });
var lo = vars.thDeg, hi = vars.thDeg;
vis.forEach(function (p) { if (p[4] < lo) lo = p[4]; if (p[4] > hi) hi = p[4]; });
var pad = Math.max(1, (hi - lo) * 0.15);
miniPlot({ x: 392, y: 242, w: 242, h: 212 }, [
  { pts: [[t0, vars.thDeg], [t1, vars.thDeg]], color: "#E9A23B", dash: [5, 4], label: "設定 θ" },
  { pts: vis.map(function (p) { return [p[0], p[4]]; }), color: "#D1495B", label: "實際 θ" },
], { title: "半頂角 θ（°）", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: Math.max(0, lo - pad), ymax: Math.min(180, hi + pad) });
`),
  ],
};

const EXAMPLES: ExampleDef[] = [atwood, incline, conical];

export default EXAMPLES;

import { customDraw, doubles, drawingPanel, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：力學
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 空氣阻力與終端速度
// ─────────────────────────────────────────────
const airdragHandout = String.raw`# 🌬️ 空氣阻力：拋體運動與終端速度實驗講義

> 真空中的拋體軌跡是對稱的拋物線，但真實的棒球、羽毛球、跳傘者都受到空氣阻力。阻力讓軌跡變得「前高後陡」，也讓落體最終達到**終端速度**。

## 一、實驗目的

1. 比較有、無空氣阻力時拋體的射程、最大高度與飛行時間。
2. 驗證二次空氣阻力下的終端速度 $v_t = \sqrt{g/k}$。
3. 找出有空氣阻力時射程最大的拋射角，並與真空中的 45° 比較。
4. 體會無解析解的運動方程如何以數值方法求解。

## 二、課前預報

1. 空氣阻力常寫成 $F_D = \frac12 C_D\rho A v^2$。說明 $C_D$、$\rho$、$A$ 各代表什麼，並估算棒球（直徑 7.3 cm、質量 145 g、$C_D \approx 0.35$）的 $k = F_D/(mv^2)$。
2. 什麼情況下阻力與 $v$ 成正比（線性阻力），什麼情況下與 $v^2$ 成正比？（提示：雷諾數）
3. 一物體垂直落下，寫出 $m\dot v = mg - kmv^2$，並說明為什麼速度最後會趨近定值。
4. 預設 $k = 0.006\ \text{m}^{-1}$，計算終端速度。
5. 猜猜看：有空氣阻力時，最佳拋射角會大於還是小於 45°？

## 三、實驗原理

### 1. 運動方程
以 $k = \dfrac{C_D\rho A}{2m}$ 表示阻力參數，阻力方向與速度相反：
$$ \frac{d\vec v}{dt} = -g\hat y - k\lvert\vec v\rvert\vec v $$
寫成分量：
$$ \dot v_x = -k v\ v_x, \qquad \dot v_y = -g - k v\ v_y, \qquad v = \sqrt{v_x^2 + v_y^2} $$
因為 $v$ 同時出現在兩個方程中，水平與鉛直運動**不再獨立**，一般沒有解析解，必須數值積分（本模擬使用 RK4）。

### 2. 終端速度
垂直下落達穩定時 $g = kv_t^2$，故
$$ v_t = \sqrt{\frac{g}{k}} $$
垂直落下的速度解析解為 $v(t) = v_t\tanh(gt/v_t)$，約經過 $2v_t/g$ 即達到 $0.96\ v_t$。

### 3. 軌跡的不對稱性
上升段同時受重力與向下的阻力分量，減速較快；下降段阻力向上，加速較慢。因此最高點偏向終點，下降段比上升段陡。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 初速 v₀ | 0 至 60 m/s | 發射速率 |
| 仰角 θ | −90° 至 90° | 負值代表向下拋射 |
| 阻力參數 k | 0 至 0.03 m⁻¹ | $k = C_D\rho A/(2m)$ |
| 發射高度 h₀ | 0 至 300 m | 從高處落下可觀察終端速度 |

- **橘色球**：有空氣阻力；**灰色虛線與空心球**：同條件的真空軌跡。
- 改變任一滑桿即重新發射；右上角小圖為速率 $v$ 隨時間的變化，紅色虛線為終端速度。

## 五、實驗步驟與數據記錄

### 步驟 A：有無阻力的比較（$v_0 = 30$、$\theta = 45°$、$h_0 = 0$）
| $k$ (m⁻¹) | 射程 $R$ (m) | 最大高度 $H$ (m) | 飛行時間 (s) | $R/R_{真空}$ |
|---|---|---|---|---|
| 0 | | | | 1 |
| 0.002 | | | | |
| 0.006 | | | | |
| 0.012 | | | | |
| 0.025 | | | | |

### 步驟 B：最佳拋射角（$v_0 = 40$、$k = 0.006$）
| $\theta$ | 30° | 35° | 38° | 40° | 42° | 45° | 50° |
|---|---|---|---|---|---|---|---|
| $R$ (m) | | | | | | | |

### 步驟 C：終端速度
設 $\theta = -90°$、$v_0 = 0$、$h_0 = 300$ m，記錄落地前的速率，並對不同 $k$ 驗證 $v_t = \sqrt{g/k}$：

| $k$ (m⁻¹) | 實測 $v_t$ (m/s) | 理論 $\sqrt{g/k}$ | 達到 95% $v_t$ 的時間 |
|---|---|---|---|
| 0.002 | | | |
| 0.006 | | | |
| 0.02 | | | |

再設 $v_0 = 60$ 向下拋（大於 $v_t$），觀察速率如何變化。

## 六、實驗探究問題

1. 為何有阻力時最佳拋射角小於 45°？以「上升時間越長，損失越多」的角度解釋。
2. 從高處以大於終端速度的速率向下拋，物體會加速還是減速？畫出 $v$–$t$ 圖。
3. 跳傘者張開降落傘時，$k$ 突然變大約 30 倍，終端速度變為原來的幾倍？
4. 兩顆同材質、半徑相差一倍的鐵球，誰的終端速度較大？與伽利略的比薩斜塔傳說有何關係？
5. 真實的棒球旋轉時還受馬格努斯力。查閱「全壘打的最佳角度」相關研究。

## 七、誤差來源與模型限制

- 假設 $C_D$ 為常數；實際上 $C_D$ 隨雷諾數變化，棒球在約 40 m/s 附近會出現「阻力危機」。
- 忽略風、空氣密度隨高度的變化與球的旋轉。
- 落地時刻以線性內插估計，誤差約為一個時間步長內的移動距離。

## 八、延伸挑戰

1. 把阻力改為線性 $-b\vec v$，比較兩種阻力模型的軌跡差異（線性阻力有解析解，可用來驗證程式）。
2. 加入水平風速 $w$：把相對速度 $\vec v - w\hat x$ 代入阻力。
3. 加入馬格努斯力 $\vec F_M \propto \vec\omega\times\vec v$，模擬上旋球與下旋球。

## 九、延伸閱讀

- J. R. Taylor, *Classical Mechanics*, Ch. 2〈Projectiles and Charged Particles〉
- N. Giordano, H. Nakanishi, *Computational Physics*（2nd ed.），Ch. 2：拋體運動與空氣阻力（棒球軌跡）
- R. K. Adair, *The Physics of Baseball*（3rd ed.），HarperCollins
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Force and Motion II〉章：阻力與終端速度
- NASA Glenn Research Center〈Drag Equation〉：www.grc.nasa.gov
`;

const airdrag: ExampleDef = {
  id: 'airdrag',
  category: '力學',
  difficulty: '基礎',
  listDescription: '比較真空與二次空氣阻力下的拋體軌跡：射程縮短、軌跡不對稱、最佳仰角小於 45°，從高空落下可驗證終端速度 √(g/k)。',
  description: airdragHandout,
  info: { title: '空氣阻力與終端速度', author: '', keywords: '', abstract: '' },
  variables: doubles('ad', [
    ['v0', '30', '初速（m/s）'],
    ['angle', '45', '仰角（度）'],
    ['k', '0.006', '阻力參數 k = CDρA/(2m)（1/m）'],
    ['h0', '0', '發射高度（m）'],
    ['g', '9.8', '重力加速度（m/s²）'],
    ['x', '0', '有阻力：x 位置（m）'], ['y', '0', '有阻力：y 位置（m）'],
    ['vx', '0', '有阻力：x 速度（m/s）'], ['vy', '0', '有阻力：y 速度（m/s）'],
    ['xi', '0', '真空：x 位置（m）'], ['yi', '0', '真空：y 位置（m）'],
    ['vxi', '0', '真空：x 速度（m/s）'], ['vyi', '0', '真空：y 速度（m/s）'],
    ['v', '0', '有阻力：速率（m/s）'],
    ['R', '0', '有阻力：射程（m）'], ['Ri', '0', '真空：射程（m）'],
    ['tf', '0', '有阻力：飛行時間（s）'], ['tfi', '0', '真空：飛行時間（s）'],
    ['hmax', '0', '有阻力：最大高度（m）'], ['hmaxi', '0', '真空：最大高度（m）'],
    ['landed', '0', '有阻力球已落地（1 = 是）'], ['landedI', '0', '真空球已落地（1 = 是）'],
  ]),
  odePages: [{
    id: 'ad-ode', name: '運動方程（含二次阻力）', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'vx', expression: '-k * Math.sqrt(vx*vx + vy*vy) * vx' },
      { state: 'vy', expression: '-g - k * Math.sqrt(vx*vx + vy*vy) * vy' },
      { state: 'xi', expression: 'vxi' },
      { state: 'yi', expression: 'vyi' },
      { state: 'vxi', expression: '0' },
      { state: 'vyi', expression: '-g' },
    ],
  }],
  constraintPages: [{
    id: 'ad-con', name: '發射與落地', comment: '參數改變時重新發射；落地時以線性內插求射程',
    code: String.raw`// 參數一改變就重新發射（_v._sig 記住上一次的參數組合）
var sig = v0 + '|' + angle + '|' + k + '|' + h0;
if (_v._sig !== sig) {
  _v._sig = sig;
  var a = angle * Math.PI / 180;
  x = 0; y = h0; vx = v0 * Math.cos(a); vy = v0 * Math.sin(a);
  xi = 0; yi = h0; vxi = vx; vyi = vy;
  landed = 0; landedI = 0; R = 0; Ri = 0; tf = 0; tfi = 0;
  hmax = h0; hmaxi = h0;
  t = 0;
}
// 有阻力的球
if (!landed) {
  if (y > hmax) hmax = y;
  if (y < 0 && vy < 0) { R = x - y * vx / vy; tf = t - y / vy; landed = 1; }
}
if (landed) { x = R; y = 0; vx = 0; vy = 0; }
// 真空中的球
if (!landedI) {
  if (yi > hmaxi) hmaxi = yi;
  if (yi < 0 && vyi < 0) { Ri = xi - yi * vxi / vyi; tfi = t - yi / vyi; landedI = 1; }
}
if (landedI) { xi = Ri; yi = 0; vxi = 0; vyi = 0; }
v = Math.sqrt(vx * vx + vy * vy);`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('ad-dp', 560, 360, [0, 10, 0, 10]),
    slider('ad-s-v0', 'v0', 0, 60, 1, '初速 v₀ (m/s)'),
    slider('ad-s-ang', 'angle', -90, 90, 1, '仰角 θ (°)'),
    slider('ad-s-k', 'k', 0, 0.03, 0.001, '阻力參數 k'),
    slider('ad-s-h0', 'h0', 0, 300, 5, '發射高度 h₀ (m)'),
    customDraw('ad-draw', '拋體繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var g = vars.g, v0 = vars.v0, h0 = vars.h0, k = vars.k;
var a = vars.angle * Math.PI / 180, vx0 = v0 * Math.cos(a), vy0 = v0 * Math.sin(a);
// 依真空軌跡自動決定比例尺
var tfiA = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
var Rid = Math.abs(vx0 * tfiA), Hid = h0 + (vy0 > 0 ? vy0 * vy0 / (2 * g) : 0);
var Xmax = Math.max(10, Rid * 1.08), Ymax = Math.max(5, Hid * 1.12);
var L = 48, B = H - 30, S = Math.min((W - 16 - L) / Xmax, (B - 20) / Ymax);
function X(x) { return L + x * S; }
function Y(y) { return B - y * S; }
function niceStep(span) {
  var s = Math.pow(10, Math.floor(Math.log10(span / 5)));
  if (span / s > 20) s *= 5; else if (span / s > 10) s *= 2;
  return s;
}
// 座標格線
var st = niceStep(Math.max(Xmax, Ymax));
ctx.font = "10px monospace"; ctx.lineWidth = 1;
for (var gx = 0; X(gx) < W - 10; gx += st) {
  ctx.strokeStyle = "rgba(43,45,49,0.06)"; ctx.beginPath(); ctx.moveTo(X(gx), Y(0)); ctx.lineTo(X(gx), 10); ctx.stroke();
  ctx.fillStyle = "#6B6F76"; ctx.textAlign = "center"; ctx.fillText(gx.toFixed(0), X(gx), B + 13);
}
for (var gy = st; Y(gy) > 10; gy += st) {
  ctx.strokeStyle = "rgba(43,45,49,0.06)"; ctx.beginPath(); ctx.moveTo(X(0), Y(gy)); ctx.lineTo(W - 10, Y(gy)); ctx.stroke();
  ctx.fillStyle = "#6B6F76"; ctx.textAlign = "right"; ctx.fillText(gy.toFixed(0), L - 4, Y(gy) + 3);
}
ctx.textAlign = "left"; ctx.fillText("m", W - 22, B + 13);
// 地面
ctx.fillStyle = "#EFE9DC"; ctx.fillRect(0, B, W, H - B);
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(0, B); ctx.lineTo(W, B); ctx.stroke();
// 真空理論軌跡（虛線）
ctx.strokeStyle = "rgba(107,111,118,0.7)"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
ctx.beginPath();
for (var i = 0; i <= 120; i++) {
  var tt = tfiA * i / 120;
  var px = X(vx0 * tt), py = Y(h0 + vy0 * tt - 0.5 * g * tt * tt);
  if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
}
ctx.stroke(); ctx.setLineDash([]);
// 有阻力的軌跡
var tr = track("_trD", [vars.t, vars.x, vars.y], 6000);
ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 2.2; ctx.beginPath();
tr.forEach(function (p, j) { if (j) ctx.lineTo(X(p[1]), Y(p[2])); else ctx.moveTo(X(p[1]), Y(p[2])); });
ctx.stroke();
// 球與速度向量
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(X(vars.xi), Y(vars.yi), 6, 0, 2 * Math.PI); ctx.stroke();
if (!vars.landed) arrow(X(vars.x), Y(vars.y), X(vars.x) + vars.vx * 1.6, Y(vars.y) - vars.vy * 1.6, "#2F6FB0", 2);
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E";
ctx.beginPath(); ctx.arc(X(vars.x), Y(vars.y), 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
// 讀數
var vt = k > 0 ? Math.sqrt(g / k) : Infinity;
infoBox(L + 6, 10, [
  ["● 有阻力  " + (vars.landed ? "射程 R = " + vars.R.toFixed(2) + " m" : "飛行中…"), "#B97A1E"],
  ["          H = " + vars.hmax.toFixed(2) + " m   t = " + (vars.landed ? vars.tf : vars.t).toFixed(2) + " s", "#B97A1E"],
  ["○ 真空    射程 = " + Rid.toFixed(2) + " m", "#6B6F76"],
  ["          H = " + Hid.toFixed(2) + " m   t = " + tfiA.toFixed(2) + " s", "#6B6F76"],
  "速率 v = " + vars.v.toFixed(2) + " m/s",
  ["終端速度 vt = √(g/k) = " + (isFinite(vt) ? vt.toFixed(2) + " m/s" : "∞"), "#D1495B"],
  (vars.landed && Rid > 0 ? "R / R真空 = " + (vars.R / Rid).toFixed(3) : " "),
], { font: "11px monospace", lh: 15 });
// 速率–時間小圖
var hv = track("_vt", [vars.t, vars.v], 3000);
var vmax = Math.max(v0, isFinite(vt) ? vt : 0, 1) * 1.1;
var ser = [{ pts: hv, color: "#E9A23B", label: "v(t)" }];
if (isFinite(vt) && vt < vmax * 1.5) ser.push({ pts: [[0, vt], [Math.max(vars.t, 1), vt]], color: "#D1495B", dash: [4, 3], label: "vt" });
miniPlot({ x: W - 214, y: 10, w: 204, h: 112 }, ser, { title: "速率 v (m/s)", xlabel: "t(s)", xmin: 0, xmax: Math.max(vars.t, 1), ymin: 0, ymax: vmax });
`),
  ],
};

// ─────────────────────────────────────────────
// 一維碰撞（氣墊軌道）
// ─────────────────────────────────────────────
const collisionHandout = String.raw`# 🚃 一維碰撞與動量守恆：氣墊軌道實驗講義

> 氣墊軌道用噴出的空氣托起滑車，幾乎消除了摩擦，是大學普物實驗驗證動量守恆的經典裝置。本模擬重現兩台滑車在軌道上的正向碰撞。

## 一、實驗目的

1. 驗證碰撞前後系統總動量守恆。
2. 比較彈性、非彈性與完全非彈性碰撞的動能損失。
3. 由碰撞前後速度求出**恢復係數** $e$。
4. 觀察質心速度在碰撞前後保持不變。

## 二、課前預報

1. 寫出動量守恆的條件。氣墊軌道上的兩台滑車，為何可視為不受外力（水平方向）？
2. 推導一維彈性碰撞後的速度公式（同時使用動量守恆與動能守恆）。
3. 質量相同的滑車 A 以 0.6 m/s 撞向靜止的滑車 B：(a) 完全彈性；(b) 完全非彈性（黏在一起），碰撞後兩者速度各為多少？動能損失多少百分比？
4. 若 $m_A \ll m_B$ 或 $m_A \gg m_B$，彈性碰撞後的結果各像什麼日常現象？

## 三、實驗原理

### 1. 動量守恆
$$ m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2 $$

### 2. 恢復係數
$$ e = -\frac{v_2 - v_1}{u_2 - u_1} = \frac{\text{分離速度}}{\text{接近速度}} $$
$e = 1$ 為完全彈性，$0 \lt e \lt 1$ 為非彈性，$e = 0$ 為完全非彈性。

### 3. 碰撞後速度（任意 $e$）
$$ v_1 = \frac{m_1u_1 + m_2u_2 + m_2e(u_2 - u_1)}{m_1 + m_2}, \qquad v_2 = \frac{m_1u_1 + m_2u_2 + m_1e(u_1 - u_2)}{m_1 + m_2} $$

### 4. 動能損失與質心系
以質心速度 $V_{cm} = \dfrac{m_1u_1 + m_2u_2}{m_1 + m_2}$ 觀察，碰撞只是把相對速度乘上 $-e$。動能損失為
$$ \Delta K = \frac12\mu(1 - e^2)(u_1 - u_2)^2, \qquad \mu = \frac{m_1m_2}{m_1 + m_2} $$

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 質量 m₁、m₂ | 0.2 至 5 kg | 兩台滑車質量 |
| 初速 u₁ | 0 至 1.5 m/s | 滑車 1 向右的初速 |
| 恢復係數 e | 0 至 1 | 1 = 彈性、0 = 黏在一起 |

- 滑車 2 的初速 u2 預設為 0，可在變數積木中修改。
- 軌道下方的 ▲ 為質心位置；底部長條圖比較碰撞前（淺色）與目前（深色）的動量與動能。
- 改變任一滑桿即重新開始。

## 五、實驗步驟與數據記錄

### 步驟 A：等質量碰撞（$m_1 = m_2 = 1$、$u_1 = 0.6$）
| $e$ | $v_1$ | $v_2$ | $p$ 前 | $p$ 後 | $K$ 前 | $K$ 後 | $K_後/K_前$ |
|---|---|---|---|---|---|---|---|
| 1.0 | | | | | | | |
| 0.7 | | | | | | | |
| 0.3 | | | | | | | |
| 0.0 | | | | | | | |

以 $K_後/K_前$ 對 $e^2$ 作圖，驗證 $K_後/K_前 = (1 + e^2)/2$（此條件下）。

### 步驟 B：不同質量比的彈性碰撞（$e = 1$、$u_1 = 0.6$、$m_2 = 1$）
| $m_1/m_2$ | 0.2 | 0.5 | 1 | 2 | 5 |
|---|---|---|---|---|---|
| $v_1$ | | | | | |
| $v_2$ | | | | | |
| 理論 $v_1$ | | | | | |
| 理論 $v_2$ | | | | | |

### 步驟 C：質心速度
任選一組參數，記錄碰撞前後 $V_{cm}$，確認不變。

## 六、實驗探究問題

1. 完全非彈性碰撞時，損失的動能比例只與質量比有關，請推導並解釋為何 $m_2 \gg m_1$ 時幾乎損失全部動能。
2. 為什麼在質心座標系中，完全非彈性碰撞後兩車都靜止？
3. 牛頓擺（Newton's cradle）為何總是「打出去幾顆就彈起幾顆」？用動量與動能同時守恆說明。
4. 實際的氣墊軌道實驗中，碰撞前後的動量總和常有 2–5% 的差異，可能的原因有哪些？
5. 汽車撞擊測試中，「潰縮區」的設計與恢復係數、碰撞時間有何關係？

## 七、誤差來源與模型限制

- 模擬把碰撞視為瞬間完成，真實碰撞有一段接觸時間（彈簧緩衝或磁鐵）。
- 未考慮軌道殘餘摩擦與空氣阻力，真實實驗中滑車會慢慢減速。
- 碰撞偵測以時間步長為單位，重疊部分以質心不變的方式修正。

## 八、延伸挑戰

1. 在軌道兩端加入彈性牆，觀察多次碰撞，並比較總動量與總動能的長期行為。
2. 把碰撞改為兩車之間的彈簧（$F = -k\ \Delta x$，僅在接觸時作用），觀察碰撞時間與力–時間圖，驗證衝量等於動量變化。
3. 推廣到三台滑車的連續碰撞。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Center of Mass and Linear Momentum〉章
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 10〈Conservation of Momentum〉
- H. D. Young, R. A. Freedman, *University Physics*,〈Momentum, Impulse, and Collisions〉章
- PhET 互動模擬〈Collision Lab〉：phet.colorado.edu
`;

const collision1d: ExampleDef = {
  id: 'collision1d',
  category: '力學',
  difficulty: '入門',
  listDescription: '氣墊軌道上兩台滑車正向碰撞：調整質量與恢復係數 e，即時比較碰撞前後的動量與動能長條圖，並觀察質心等速運動。',
  description: collisionHandout,
  info: { title: '一維碰撞與動量守恆（氣墊軌道）', author: '', keywords: '', abstract: '' },
  variables: doubles('co', [
    ['m1', '1', '滑車 1 質量（kg）'],
    ['m2', '1', '滑車 2 質量（kg）'],
    ['u1', '0.6', '滑車 1 初速（m/s）'],
    ['u2', '0', '滑車 2 初速（m/s）'],
    ['e', '1', '恢復係數'],
    ['x1', '-3', '滑車 1 位置（m）'], ['v1', '0', '滑車 1 速度（m/s）'],
    ['x2', '0.5', '滑車 2 位置（m）'], ['v2', '0', '滑車 2 速度（m/s）'],
    ['p', '0', '總動量（kg·m/s）'], ['K', '0', '總動能（J）'],
    ['p0', '0', '碰撞前總動量'], ['K0', '0', '碰撞前總動能'],
    ['vcm', '0', '質心速度（m/s）'], ['hits', '0', '碰撞次數'],
  ]),
  odePages: [{
    id: 'co-ode', name: '等速運動', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x1', expression: 'v1' },
      { state: 'v1', expression: '0' },
      { state: 'x2', expression: 'v2' },
      { state: 'v2', expression: '0' },
    ],
  }],
  constraintPages: [{
    id: 'co-con', name: '碰撞規則', comment: '',
    code: String.raw`var sig = m1 + '|' + m2 + '|' + u1 + '|' + u2 + '|' + e;
if (_v._sig !== sig) {
  _v._sig = sig;
  x1 = -3; x2 = 0.5; v1 = u1; v2 = u2; hits = 0; t = 0;
  p0 = m1 * u1 + m2 * u2;
  K0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
}
var w = 0.35;                       // 滑車半寬（m）
if (x2 - x1 < 2 * w && v1 > v2) {   // 接觸且互相接近 → 碰撞
  var M = m1 + m2, P = m1 * v1 + m2 * v2;
  var n1 = (P + m2 * e * (v2 - v1)) / M;
  var n2 = (P + m1 * e * (v1 - v2)) / M;
  v1 = n1; v2 = n2; hits = hits + 1;
  var ov = 2 * w - (x2 - x1);       // 消除重疊，保持質心不動
  x1 -= ov * m2 / M; x2 += ov * m1 / M;
}
p = m1 * v1 + m2 * v2;
K = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
vcm = p / (m1 + m2);`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('co-dp', 560, 330, [-6, 6, -4.2, 2]),
    slider('co-s-m1', 'm1', 0.2, 5, 0.1, '質量 m₁ (kg)'),
    slider('co-s-m2', 'm2', 0.2, 5, 0.1, '質量 m₂ (kg)'),
    slider('co-s-u1', 'u1', 0, 1.5, 0.05, '初速 u₁ (m/s)'),
    slider('co-s-e', 'e', 0, 1, 0.05, '恢復係數 e'),
    customDraw('co-draw', '氣墊軌道繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var m1 = vars.m1, m2 = vars.m2, w = 0.35;
// 軌道
var ry = toPixY(0);
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(toPixX(-6), ry, toPixX(6) - toPixX(-6), 10);
ctx.fillStyle = "#B8B4AA";
for (var hx = -5.8; hx < 6; hx += 0.3) { ctx.beginPath(); ctx.arc(toPixX(hx), ry + 3, 1.2, 0, 2 * Math.PI); ctx.fill(); }
// 滑車（高度隨質量變化）
function cart(x, m, fill, edge, label, v) {
  var hh = 0.35 + 0.18 * Math.sqrt(m);
  var x0 = toPixX(x - w), x1p = toPixX(x + w), y0 = toPixY(hh);
  ctx.fillStyle = fill; ctx.strokeStyle = edge; ctx.lineWidth = 1.5;
  ctx.fillRect(x0, y0, x1p - x0, ry - y0); ctx.strokeRect(x0, y0, x1p - x0, ry - y0);
  ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(label, toPixX(x), (y0 + ry) / 2 + 4);
  ctx.font = "10px monospace"; ctx.fillText(m.toFixed(1) + " kg", toPixX(x), y0 - 4);
  var top = toPixY(hh + 0.45);
  if (Math.abs(v) > 0.005) arrow(toPixX(x), top, toPixX(x) + v * 60, top, edge, 2.2);
  ctx.fillStyle = edge; ctx.fillText("v=" + v.toFixed(3), toPixX(x), top - 8);
}
cart(vars.x1, m1, "#E6EEF7", "#2F6FB0", "1", vars.v1);
cart(vars.x2, m2, "#F9E3E6", "#D1495B", "2", vars.v2);
// 質心
var xcm = (m1 * vars.x1 + m2 * vars.x2) / (m1 + m2);
ctx.fillStyle = "#2A9D8F"; ctx.beginPath();
ctx.moveTo(toPixX(xcm), ry + 12); ctx.lineTo(toPixX(xcm) - 7, ry + 24); ctx.lineTo(toPixX(xcm) + 7, ry + 24); ctx.closePath(); ctx.fill();
ctx.font = "10px monospace"; ctx.textAlign = "center"; ctx.fillText("質心", toPixX(xcm), ry + 36);
// 長條圖：碰撞前（淺）與目前（深）
function bars(x0, title, before, now, unit, color, light) {
  var top = ry + 52, bh = H - top - 26, maxV = Math.max(Math.abs(before), Math.abs(now), 1e-6) * 1.15;
  ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText(title, x0, top - 4);
  var base = top + bh;
  [[before, light, "前"], [now, color, "後"]].forEach(function (b, i) {
    var hpx = Math.abs(b[0]) / maxV * (bh - 12);
    ctx.fillStyle = b[1]; ctx.fillRect(x0 + 10 + i * 46, base - hpx, 34, hpx);
    ctx.fillStyle = "#2B2D31"; ctx.font = "10px monospace"; ctx.textAlign = "center";
    ctx.fillText(b[0].toFixed(3), x0 + 27 + i * 46, base - hpx - 3);
    ctx.fillText(b[2], x0 + 27 + i * 46, base + 12);
  });
  ctx.textAlign = "left"; ctx.fillStyle = "#6B6F76"; ctx.fillText(unit, x0 + 104, base);
}
bars(30, "總動量 p", vars.p0, vars.p, "kg·m/s", "#2F6FB0", "#C9DAEE");
bars(200, "總動能 K", vars.K0, vars.K, "J", "#E9A23B", "#F5DDB5");
var du = vars.u2 - vars.u1, eMeas = vars.hits > 0 && Math.abs(du) > 1e-9 ? -(vars.v2 - vars.v1) / du : NaN;
infoBox(W - 12, ry + 44, [
  "碰撞次數 = " + vars.hits,
  "質心速度 Vcm = " + vars.vcm.toFixed(4) + " m/s",
  "K後/K前 = " + (vars.K0 > 0 ? (vars.K / vars.K0).toFixed(4) : "—"),
  "實測 e = " + (isFinite(eMeas) ? eMeas.toFixed(3) : "（尚未碰撞）"),
], { right: true, font: "11px monospace", lh: 15 });
`),
  ],
};

// ─────────────────────────────────────────────
// 斜面滾動與轉動慣量
// ─────────────────────────────────────────────
const rollingHandout = String.raw`# 🛞 斜面滾動競賽：轉動慣量與純滾動條件實驗講義

> 把實心球、實心圓柱、圓環同時從斜面頂端放下，誰先到底？答案與質量、半徑都無關，只取決於**質量分布**——也就是轉動慣量。

## 一、實驗目的

1. 比較實心球、實心圓柱、圓環與無摩擦滑塊沿斜面下滑的加速度。
2. 驗證純滾動時的加速度 $a = \dfrac{g\sin\theta}{1 + I/(mR^2)}$，並反推轉動慣量係數。
3. 探討靜摩擦係數不足時出現的「又滾又滑」運動，求出純滾動所需的最小摩擦係數。

## 二、課前預報

1. 寫出實心球、實心圓柱、薄圓環對中心軸的轉動慣量。定義 $\beta = I/(mR^2)$，三者的 $\beta$ 各是多少？
2. 純滾動條件 $v = \omega R$ 的物理意義是什麼？此時接觸點的速度為何？
3. 以能量守恆證明：從高度 $h$ 滾下後 $v = \sqrt{2gh/(1 + \beta)}$。
4. 預測四個物體到達底部的順序，並計算斜面長 3 m、傾角 20° 時各自的到達時間。
5. 純滾動時摩擦力做功嗎？為什麼？

## 三、實驗原理

### 1. 純滾動的動力學
沿斜面方向：$mg\sin\theta - f = ma$；對質心轉動：$fR = I\alpha = I a/R$。聯立得
$$ a = \frac{g\sin\theta}{1 + \beta}, \qquad f = \frac{\beta}{1 + \beta}mg\sin\theta $$

| 物體 | $\beta = I/(mR^2)$ | $a/(g\sin\theta)$ |
|---|---|---|
| 無摩擦滑塊 | 0（不轉動） | 1 |
| 實心球 | 2/5 | 5/7 ≈ 0.714 |
| 實心圓柱 | 1/2 | 2/3 ≈ 0.667 |
| 薄圓環 | 1 | 1/2 |

### 2. 純滾動所需的最小摩擦係數
所需靜摩擦 $f \le \mu_s N = \mu_s mg\cos\theta$，故
$$ \mu_s \ge \mu_{min} = \frac{\beta}{1 + \beta}\tan\theta $$

### 3. 又滾又滑
若 $\mu \lt \mu_{min}$，物體會打滑，摩擦力為動摩擦 $\mu mg\cos\theta$：
$$ a = g(\sin\theta - \mu\cos\theta), \qquad \alpha R = \frac{\mu g\cos\theta}{\beta} $$
此時邊緣速度 $\omega R$ 永遠追不上 $v$，一路打滑到底。（本模擬假設動、靜摩擦係數相同。）

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 傾角 θ | 5° 至 60° | 斜面傾角 |
| 摩擦係數 μ | 0 至 1 | 物體與斜面之間（滑塊恆為無摩擦） |

- 四條跑道由上而下為：實心球、實心圓柱、圓環、無摩擦滑塊。輪輻的轉動可看出是否打滑。
- 右側顯示每個物體的狀態（滾動／打滑）、$\mu_{min}$、實測到達時間與理論值。
- 改變滑桿即重新開始；斜面長度 Lr 可在變數積木中修改。

## 五、實驗步驟與數據記錄

### 步驟 A：純滾動（$\mu = 0.8$）
| 傾角 θ | 球 $T$ (s) | 圓柱 $T$ (s) | 圓環 $T$ (s) | 滑塊 $T$ (s) |
|---|---|---|---|---|
| 10° | | | | |
| 20° | | | | |
| 30° | | | | |

由 $T$ 求 $a = 2L/T^2$，再由 $\beta = g\sin\theta/a - 1$ 反推轉動慣量係數，與理論值比較。

### 步驟 B：找出打滑的臨界摩擦係數（θ = 30°）
從 $\mu = 0.5$ 慢慢調低，記錄各物體由「滾動」變為「打滑」時的 $\mu$：

| 物體 | 實測臨界 μ | 理論 $\mu_{min}$ |
|---|---|---|
| 實心球 | | |
| 實心圓柱 | | |
| 圓環 | | |

### 步驟 C：打滑時的到達時間
固定 θ = 40°、μ = 0.1，記錄到達時間，與「純滾動」及「無摩擦」比較。

## 六、實驗探究問題

1. 為何到達時間與物體的質量、半徑都無關？
2. 若圓環與實心球同時從同一高度滾下，到達底部時誰的總動能較大？誰的平動動能較大？
3. 打滑時，摩擦力做的功去了哪裡？以能量的角度比較純滾動與打滑。
4. 一顆空心球（薄球殼，$\beta = 2/3$）會排在哪個位置？請預測後修改模型驗證。
5. 汽車的 ABS 防鎖死煞車為何能縮短煞車距離？與本實驗的「滾動 vs 打滑」有何關聯？

## 七、誤差來源與模型限制

- 忽略滾動阻力（形變造成的能量損失）與空氣阻力。
- 假設動摩擦係數等於靜摩擦係數；實際上 $\mu_k$ 通常略小於 $\mu_s$。
- 真實的實驗中，圓柱若不是完全對稱，或斜面不平整，會造成側向偏移。

## 八、延伸挑戰

1. 新增一條跑道放入薄球殼（$\beta = 2/3$）。
2. 讓物體從打滑開始（給一個初速但 $\omega = 0$），觀察它在水平面上如何過渡到純滾動（保齡球問題）。
3. 加入滾動阻力係數 $c_{rr}$，比較不同材質的差異。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Rolling, Torque, and Angular Momentum〉章
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 18〈Rotation in Two Dimensions〉與 Ch. 19〈Center of Mass; Moment of Inertia〉
- H. D. Young, R. A. Freedman, *University Physics*,〈Dynamics of Rotational Motion〉章
- HyperPhysics〈Rolling Race〉
`;

const ROLL_BETAS = [0.4, 0.5, 1, 0];

const rolling: ExampleDef = {
  id: 'rolling',
  category: '力學',
  difficulty: '基礎',
  listDescription: '實心球、實心圓柱、圓環與無摩擦滑塊同時沿斜面滑下：驗證 a = g sinθ/(1+I/mR²)，並調低摩擦係數觀察「又滾又滑」。',
  description: rollingHandout,
  info: { title: '斜面滾動與轉動慣量', author: '', keywords: '', abstract: '' },
  variables: [
    ...doubles('rl', [
      ['theta', '20', '斜面傾角（度）'],
      ['mu', '0.8', '摩擦係數（動、靜相同）'],
      ['Lr', '3', '斜面長度（m）'],
      ['g', '9.8', '重力加速度'],
      ['th', '0', '傾角（弧度，約束頁計算）'],
    ]),
    ...[1, 2, 3, 4].flatMap((i) =>
      doubles('rl', [
        [`b${i}`, String(ROLL_BETAS[i - 1]), `物體 ${i} 的 β = I/(mR²)`],
        [`s${i}`, '0', `物體 ${i} 沿斜面位移（m）`],
        [`u${i}`, '0', `物體 ${i} 質心速度（m/s）`],
        [`q${i}`, '0', `物體 ${i} 邊緣速度 ωR（m/s）`],
        [`r${i}`, '0', `物體 ${i} 累積轉動弧長（m，畫輪輻用）`],
        [`T${i}`, '0', `物體 ${i} 到達時間（s）`],
      ])
    ),
  ],
  odePages: [{
    id: 'rl-ode', name: '滾動／打滑方程', method: 'RungeKutta', increment: '0.002', comment: '',
    rates: [1, 2, 3, 4].flatMap((i) => {
      const rollOK = i === 4 ? 'true' : `mu >= b${i} * Math.tan(th) / (1 + b${i})`;
      const accel = i === 4
        ? 'g * Math.sin(th)'
        : `(${rollOK}) ? g * Math.sin(th) / (1 + b${i}) : g * (Math.sin(th) - mu * Math.cos(th))`;
      const spin = i === 4 ? '0' : `(${rollOK}) ? g * Math.sin(th) / (1 + b${i}) : mu * g * Math.cos(th) / b${i}`;
      return [
        { state: `s${i}`, expression: `u${i}` },
        { state: `u${i}`, expression: accel },
        { state: `q${i}`, expression: spin },
        { state: `r${i}`, expression: `q${i}` },
      ];
    }),
  }],
  constraintPages: [{
    id: 'rl-con', name: '起跑與終點', comment: '',
    code: String.raw`th = theta * Math.PI / 180;
var sig = theta + '|' + mu + '|' + Lr;
if (_v._sig !== sig) {
  _v._sig = sig;
  s1 = s2 = s3 = s4 = 0; u1 = u2 = u3 = u4 = 0;
  q1 = q2 = q3 = q4 = 0; r1 = r2 = r3 = r4 = 0;
  T1 = T2 = T3 = T4 = 0; t = 0;
}
// 到達終點：記錄時間（線性內插）並停住
if (s1 >= Lr) { if (!T1) T1 = t - (s1 - Lr) / u1; s1 = Lr; u1 = 0; q1 = 0; }
if (s2 >= Lr) { if (!T2) T2 = t - (s2 - Lr) / u2; s2 = Lr; u2 = 0; q2 = 0; }
if (s3 >= Lr) { if (!T3) T3 = t - (s3 - Lr) / u3; s3 = Lr; u3 = 0; q3 = 0; }
if (s4 >= Lr) { if (!T4) T4 = t - (s4 - Lr) / u4; s4 = Lr; u4 = 0; q4 = 0; }`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rl-dp', 580, 400, [0, 10, 0, 10]),
    slider('rl-s-th', 'theta', 5, 60, 1, '傾角 θ (°)'),
    slider('rl-s-mu', 'mu', 0, 1, 0.01, '摩擦係數 μ'),
    customDraw('rl-draw', '斜面跑道繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var th = vars.theta * Math.PI / 180, g = vars.g, mu = vars.mu, Lr = vars.Lr;
var names = ["實心球", "實心圓柱", "圓環", "無摩擦滑塊"];
var cols = [["#F9E3E6", "#D1495B"], ["#E6EEF7", "#2F6FB0"], ["#FBEBD0", "#D68C26"], ["#E3F2EF", "#2A9D8F"]];
var laneH = (H - 24) / 4, boxW = W - 250, rpx = 11;
ctx.textAlign = "left";
for (var i = 1; i <= 4; i++) {
  var top = 8 + (i - 1) * laneH, b = vars["b" + i];
  var Lp = Math.min((boxW - 30) / Math.cos(th), (laneH - 2 * rpx - 14) / Math.sin(th));
  var sx = 20, sy = top + 2 * rpx + 6, ex = sx + Lp * Math.cos(th), ey = sy + Lp * Math.sin(th);
  // 斜面
  ctx.fillStyle = "#EFE9DC"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(sx, ey); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.strokeStyle = "#D1495B"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, ey - 2.4 * rpx); ctx.stroke(); ctx.setLineDash([]);
  // 物體
  var f = vars["s" + i] / Lr, cx = sx + f * Lp * Math.cos(th), cy = sy + f * Lp * Math.sin(th);
  var nx = Math.sin(th), ny = -Math.cos(th);
  var R = rpx * Lr / Lp, ang = vars["r" + i] / R;
  ctx.save();
  if (i === 4) {
    ctx.translate(cx + nx * rpx, cy + ny * rpx); ctx.rotate(th);
    ctx.fillStyle = cols[3][0]; ctx.strokeStyle = cols[3][1]; ctx.lineWidth = 1.5;
    ctx.fillRect(-rpx, -rpx, 2 * rpx, 2 * rpx); ctx.strokeRect(-rpx, -rpx, 2 * rpx, 2 * rpx);
  } else {
    ctx.translate(cx + nx * rpx, cy + ny * rpx); ctx.rotate(ang);
    ctx.strokeStyle = cols[i - 1][1]; ctx.fillStyle = cols[i - 1][0];
    if (i === 3) {
      ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, rpx - 2, 0, 2 * Math.PI); ctx.stroke();
      ctx.lineWidth = 1;
    } else {
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, rpx, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-rpx, 0); ctx.lineTo(rpx, 0); ctx.moveTo(0, -rpx); ctx.lineTo(0, rpx); ctx.stroke();
  }
  ctx.restore();
  // 右側讀數
  var rollOK = i === 4 || mu >= b * Math.tan(th) / (1 + b);
  var aTh = i === 4 ? g * Math.sin(th) : (rollOK ? g * Math.sin(th) / (1 + b) : g * (Math.sin(th) - mu * Math.cos(th)));
  var Tth = Math.sqrt(2 * Lr / aTh), Tm = vars["T" + i];
  var lx = W - 228;
  ctx.fillStyle = cols[i - 1][1]; ctx.font = "bold 12px sans-serif";
  ctx.fillText(names[i - 1] + "  β = " + b, lx, top + 16);
  ctx.font = "11px monospace"; ctx.fillStyle = "#2B2D31";
  var st = i === 4 ? "無摩擦滑動" : (rollOK ? "純滾動" : "又滾又滑！");
  ctx.fillText("狀態：" + st + (i === 4 ? "" : "  μmin=" + (b * Math.tan(th) / (1 + b)).toFixed(3)), lx, top + 32);
  ctx.fillText("到達 T = " + (Tm ? Tm.toFixed(3) : "…") + " s  理論 " + Tth.toFixed(3), lx, top + 48);
  ctx.fillText("v = " + vars["u" + i].toFixed(2) + "  ωR = " + vars["q" + i].toFixed(2) + " m/s", lx, top + 64);
  ctx.strokeStyle = "#E5E1D8"; ctx.beginPath(); ctx.moveTo(0, top + laneH); ctx.lineTo(W, top + laneH); ctx.stroke();
}
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif";
ctx.fillText("t = " + vars.t.toFixed(2) + " s    斜面長 " + Lr + " m", 20, H - 6);
`),
  ],
};

// ─────────────────────────────────────────────
// 傅科擺
// ─────────────────────────────────────────────
const foucaultHandout = String.raw`# 🧭 傅科擺：在地面上看見地球自轉實驗講義

> 1851 年，傅科（Léon Foucault）在巴黎萬神殿懸掛一個 67 公尺長的擺。擺動平面緩緩轉動，第一次讓人不必仰望星空，就「看見」地球在自轉。

## 一、實驗目的

1. 觀察旋轉參考系中科氏力對單擺運動的影響。
2. 驗證擺動平面的進動角速度 $\Omega_p = \Omega\sin\lambda$ 與緯度的關係。
3. 理解在南、北半球與赤道上進動方向與速率的差異。

## 二、課前預報

1. 寫出科氏力 $\vec F_C = -2m\vec\Omega\times\vec v$。在北半球，水平向東運動的物體受到的水平科氏力指向哪裡？
2. 地球自轉角速度 $\Omega = 2\pi/(23.934\ \text{h}) \approx 7.29\times10^{-5}\ \text{rad/s}$。為何用恆星日而不是 24 小時？
3. 計算巴黎（北緯 48.85°）與臺北（北緯 25.0°）傅科擺的進動週期。
4. 在赤道上傅科擺會不會進動？在南極呢？
5. 擺長 20 m 的單擺週期是多少？

## 三、實驗原理

### 1. 旋轉座標系中的小角度擺
取 $x$ 向東、$y$ 向北，只考慮科氏力的水平分量（垂直分量遠小於重力）：
$$ \ddot x = -\omega_0^2 x + 2\Omega\sin\lambda\ \dot y, \qquad \ddot y = -\omega_0^2 y - 2\Omega\sin\lambda\ \dot x $$
其中 $\omega_0 = \sqrt{g/L}$。

### 2. 擺動平面的進動
把位置寫成複數 $z = x + iy$，方程變為 $\ddot z + 2i\Omega_z\dot z + \omega_0^2 z = 0$（$\Omega_z = \Omega\sin\lambda$）。當 $\Omega_z \ll \omega_0$ 時，
$$ z(t) \approx e^{-i\Omega_z t}\left(A\cos\omega_0 t\right) $$
擺動平面以角速度 $\Omega_z$ **順時針**（由上往下看，北半球）旋轉，進動週期
$$ T_p = \frac{2\pi}{\Omega\sin\lambda} = \frac{1\ \text{恆星日}}{\sin\lambda} $$

### 3. 為何本模擬要「加快」地球自轉
真實的 $\Omega$ 太小，擺要擺上萬次才看得出進動。模擬中 $\Omega$ 可放大到 0.1 rad/s 左右，進動仍滿足相同的公式。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 自轉角速度 Ω | 0 至 0.12 rad/s | 放大後的「地球」自轉速率 |
| 緯度 λ | −90° 至 90° | 正值為北半球 |

- 畫面為由上往下俯視，上方為北、右方為東。藍色曲線是擺錘的軌跡（玫瑰線）。
- **灰色虛線**：理論擺動平面；**紅色實線**：最近一次擺到最遠點時的實測方位。
- 改變滑桿即從東側最遠點靜止釋放（在旋轉座標系中靜止）。

## 五、實驗步驟與數據記錄

### 步驟 A：觀察進動方向
設 Ω = 0.05、λ = 45°，觀察擺動平面是順時針還是逆時針轉？再設 λ = −45° 比較。

### 步驟 B：進動速率與緯度的關係（Ω = 0.06）
擺動平面轉過 90° 所需的時間 $t_{90}$，進動角速度 $\Omega_p = (\pi/2)/t_{90}$：

| λ | $t_{90}$ (s) | 實測 $\Omega_p$ | $\Omega\sin\lambda$ | 誤差 |
|---|---|---|---|---|
| 15° | | | | |
| 30° | | | | |
| 45° | | | | |
| 60° | | | | |
| 90° | | | | |

以 $\Omega_p$ 對 $\sin\lambda$ 作圖，斜率應為 Ω。

### 步驟 C：換算真實地球
用你測得的關係，計算臺北、東京（35.7°N）、雪梨（33.9°S）真實傅科擺的進動週期（小時）。

## 六、實驗探究問題

1. 在北極，擺動平面其實「固定不動」，是地球在它下方轉動。為何在其他緯度進動得比較慢？
2. 從東側最遠點「靜止」釋放時，軌跡是有尖點的玫瑰線；若改從平衡點以初速推出，軌跡形狀會如何不同？
3. 傅科擺的懸掛點若有微小的不對稱，擺錘會走出橢圓軌跡並產生假的進動。真實的傅科擺用什麼方法減少這個誤差？
4. 颱風在北半球為何逆時針旋轉？與傅科擺順時針進動是否矛盾？
5. 科氏力是「真實的力」嗎？從慣性系與旋轉系兩種觀點討論。

## 七、誤差來源與模型限制

- 採用小角度近似與只保留科氏力水平分量；忽略離心力（併入有效重力）。
- 放大的 Ω 不滿足 $\Omega \ll \omega_0$ 時，進動公式會出現可察覺的偏差。
- 實測方位取自最近一次最遠點，有半個擺動週期的時間解析度。

## 八、延伸挑戰

1. 在方程中加入空氣阻尼，觀察振幅衰減時進動速率是否改變。
2. 改用完整的三維球面擺方程（不做小角度近似），研究大振幅時的額外進動。
3. 模擬「靜止參考系」：把軌跡座標旋轉回慣性系，確認擺動平面固定。

## 九、延伸閱讀

- L. Foucault, "Démonstration physique du mouvement de rotation de la terre au moyen du pendule", *Comptes rendus de l'Académie des Sciences* 32, 135 (1851)
- J. R. Taylor, *Classical Mechanics*, Ch. 9〈Mechanics in Noninertial Frames〉
- A. D. Aczel, *Pendulum: Léon Foucault and the Triumph of Science*, Atria Books (2003)
- D. Kleppner, R. Kolenkow, *An Introduction to Mechanics*, Ch. 9〈Noninertial Systems and Fictitious Forces〉
`;

const foucault: ExampleDef = {
  id: 'foucault',
  category: '力學',
  difficulty: '進階',
  listDescription: '俯視旋轉地球上的單擺：科氏力讓擺動平面以 Ω sinλ 進動，調整緯度與（放大的）自轉速率，比較南北半球與赤道的差異。',
  description: foucaultHandout,
  info: { title: '傅科擺（科氏力）', author: '', keywords: '', abstract: '' },
  variables: doubles('fc', [
    ['Om', '0.05', '自轉角速度 Ω（rad/s，已放大）'],
    ['lat', '25', '緯度 λ（度，北為正）'],
    ['Lp', '20', '擺長（m）'],
    ['g', '9.8', '重力加速度'],
    ['A', '1', '釋放時的振幅（m）'],
    ['x', '1', '擺錘 x（東，m）'], ['y', '0', '擺錘 y（北，m）'],
    ['vx', '0', '速度 x'], ['vy', '0', '速度 y'],
    ['phiMeas', '0', '最近一次最遠點的方位角（rad）'],
  ]),
  odePages: [{
    id: 'fc-ode', name: '旋轉座標系中的擺', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'vx', expression: '-(g / Lp) * x + 2 * Om * Math.sin(lat * Math.PI / 180) * vy' },
      { state: 'vy', expression: '-(g / Lp) * y - 2 * Om * Math.sin(lat * Math.PI / 180) * vx' },
    ],
  }],
  constraintPages: [{
    id: 'fc-con', name: '釋放與方位量測', comment: '',
    code: String.raw`var sig = Om + '|' + lat + '|' + Lp + '|' + A;
if (_v._sig !== sig) {
  _v._sig = sig;
  x = A; y = 0; vx = 0; vy = 0; t = 0; phiMeas = 0; _v._rv = 0;
}
// r·v 由正轉負 → 剛經過最遠點，記錄擺動平面方位
var rv = x * vx + y * vy;
if (_v._rv > 0 && rv <= 0) phiMeas = Math.atan2(y, x);
_v._rv = rv;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('fc-dp', 440, 440, [-1.45, 1.45, -1.45, 1.45], true),
    slider('fc-s-om', 'Om', 0, 0.12, 0.005, '自轉角速度 Ω (rad/s)'),
    slider('fc-s-lat', 'lat', -90, 90, 1, '緯度 λ (°)'),
    customDraw('fc-draw', '俯視圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var A = vars.A, cx = toPixX(0), cy = toPixY(0), Rp = toPixLen(A);
// 刻度圓與方位
ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.arc(cx, cy, Rp, 0, 2 * Math.PI); ctx.stroke();
for (var d = 0; d < 360; d += 15) {
  var r = d * Math.PI / 180, l = d % 45 === 0 ? 12 : 6;
  ctx.beginPath(); ctx.moveTo(cx + Rp * Math.cos(r), cy - Rp * Math.sin(r));
  ctx.lineTo(cx + (Rp + l) * Math.cos(r), cy - (Rp + l) * Math.sin(r)); ctx.stroke();
}
ctx.fillStyle = "#6B6F76"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
ctx.fillText("北 N", cx, cy - Rp - 18); ctx.fillText("南 S", cx, cy + Rp + 28);
ctx.fillText("東 E", cx + Rp + 30, cy + 4); ctx.fillText("西 W", cx - Rp - 30, cy + 4);
// 軌跡（每 0.04 s 取樣一次）
var h = vars._fcTrail;
if (!h || vars.t < h.lastT) { h = vars._fcTrail = []; h.lastT = -1; }
if (vars.t - h.lastT >= 0.04) { h.push([vars.x, vars.y]); h.lastT = vars.t; if (h.length > 9000) h.shift(); }
ctx.strokeStyle = "rgba(47,111,176,0.55)"; ctx.lineWidth = 1; ctx.beginPath();
h.forEach(function (p, i) { if (i) ctx.lineTo(toPixX(p[0]), toPixY(p[1])); else ctx.moveTo(toPixX(p[0]), toPixY(p[1])); });
ctx.stroke();
// 理論擺動平面：以 -Ω sinλ 轉動
var Oz = vars.Om * Math.sin(vars.lat * Math.PI / 180), phT = -Oz * vars.t;
ctx.strokeStyle = "rgba(43,45,49,0.6)"; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(cx - Rp * 1.1 * Math.cos(phT), cy + Rp * 1.1 * Math.sin(phT));
ctx.lineTo(cx + Rp * 1.1 * Math.cos(phT), cy - Rp * 1.1 * Math.sin(phT)); ctx.stroke(); ctx.setLineDash([]);
// 實測方位
var pm = vars.phiMeas;
ctx.strokeStyle = "#D1495B"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(cx - Rp * Math.cos(pm), cy + Rp * Math.sin(pm)); ctx.lineTo(cx + Rp * Math.cos(pm), cy - Rp * Math.sin(pm)); ctx.stroke();
// 擺錘
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E";
ctx.beginPath(); ctx.arc(toPixX(vars.x), toPixY(vars.y), 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 2 * Math.PI); ctx.fill();
// 讀數
var T0 = 2 * Math.PI * Math.sqrt(vars.Lp / vars.g);
var sl = Math.sin(vars.lat * Math.PI / 180);
var turned = (Math.abs(Oz) * vars.t * 180 / Math.PI);
infoBox(8, 8, [
  "擺動週期 T0 = " + T0.toFixed(2) + " s",
  "Ω sinλ = " + Oz.toFixed(4) + " rad/s",
  "模擬進動週期 = " + (Math.abs(Oz) > 1e-9 ? (2 * Math.PI / Math.abs(Oz)).toFixed(0) + " s" : "∞"),
  "理論已轉 " + turned.toFixed(1) + "°（" + (Oz > 0 ? "順時針" : Oz < 0 ? "逆時針" : "不轉") + "）",
  ["實測方位 = " + (pm * 180 / Math.PI).toFixed(1) + "°", "#D1495B"],
  ["真實地球：Tp = " + (Math.abs(sl) > 1e-6 ? (23.934 / Math.abs(sl)).toFixed(1) + " h" : "∞"), "#2A9D8F"],
], { font: "11px monospace", lh: 15 });
ctx.fillStyle = "#6B6F76"; ctx.font = "11px monospace"; ctx.textAlign = "right";
ctx.fillText("t = " + vars.t.toFixed(1) + " s", W - 8, H - 8);
`),
  ],
};

const MECHANICS_EXAMPLES: ExampleDef[] = [airdrag, collision1d, rolling, foucault];

export default MECHANICS_EXAMPLES;

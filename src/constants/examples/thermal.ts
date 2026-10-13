import { customDraw, doubles, drawingPanel, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：熱學與統計物理
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 布朗運動與擴散
// ─────────────────────────────────────────────
const brownianHandout = String.raw`# 🔬 布朗運動與擴散：測量亞佛加厥數實驗講義

> 1827 年植物學家布朗在顯微鏡下看見花粉中的微粒不停地亂跳。1905 年愛因斯坦指出這是水分子撞擊的結果，並預測位移平方與時間成正比；1908 年佩蘭（Jean Perrin）據此量出亞佛加厥數，終結了「原子是否真實存在」的爭論。

## 一、實驗目的

1. 觀察懸浮微粒的隨機運動，理解擴散的統計本質。
2. 驗證均方位移與時間成正比：$\langle r^2\rangle = 4Dt$（二維）。
3. 由斯托克斯–愛因斯坦關係 $D = \dfrac{k_BT}{6\pi\eta r}$，以量得的 $D$ 反推波茲曼常數與亞佛加厥數。
4. 觀察粒子位移的分布趨近高斯分布。

## 二、課前預報

1. 何謂「隨機漫步」？一維隨機漫步走 $N$ 步後，平均位移與均方位移各為何？
2. 計算半徑 0.5 μm 的球在 20°C 水中（$\eta = 1.0\ \text{mPa·s}$）的擴散係數 $D$（單位 μm²/s）。
3. 依上題，經過 60 s 後的方均根位移 $\sqrt{\langle r^2\rangle}$ 約為多少 μm？
4. 溫度升高、黏滯係數增加、粒子變大，各會使 $D$ 如何變化？
5. 為什麼布朗運動中「平均速度」不是一個有意義的量？

## 三、實驗原理

### 1. 愛因斯坦關係
微粒受到大量分子隨機撞擊，在時間尺度遠大於碰撞時間時，其位移為高斯隨機變數。二維中
$$ \langle x^2\rangle = \langle y^2\rangle = 2Dt, \qquad \langle r^2\rangle = 4Dt $$

### 2. 斯托克斯–愛因斯坦公式
微粒在黏滯流體中的阻力係數 $\gamma = 6\pi\eta r$（斯托克斯定律），漲落–耗散定理給出
$$ D = \frac{k_BT}{6\pi\eta r} $$

### 3. 測量亞佛加厥數
由 $k_B = R/N_A$：
$$ N_A = \frac{RT}{6\pi\eta r D} $$
其中 $R = 8.314\ \text{J/(mol·K)}$。佩蘭正是用這個方法，得到 $N_A$ 約為 $6 \times 10^{23}$ 的結果。

### 4. 數值方法
每個時間步長 $\Delta t$，每個粒子的 $x$、$y$ 位移各加上一個平均 0、標準差 $\sqrt{2D\Delta t}$ 的高斯亂數（以 Box–Muller 方法產生）。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 溫度 T | 273 至 373 K | 水溫 |
| 黏滯係數 η | 0.3 至 5 mPa·s | 水在 20°C 約 1.0 |
| 粒子半徑 r | 0.1 至 2 μm | 懸浮微粒大小 |

- 200 個粒子都從原點出發；其中三個以彩色軌跡顯示。改變滑桿即重新開始。
- 右上：均方位移 $\langle r^2\rangle$ 對時間（藍）與理論 $4Dt$（灰虛線），並顯示最小平方法擬合的 $D$。
- 右下：所有粒子 $x$ 位移的直方圖與理論高斯分布。
- 時間以真實秒計，建議把速度選單調到 4×。

## 五、實驗步驟與數據記錄

### 步驟 A：驗證 $\langle r^2\rangle \propto t$
以預設值執行 60 秒，從圖上讀取：

| t (s) | 10 | 20 | 30 | 40 | 50 | 60 |
|---|---|---|---|---|---|---|
| $\langle r^2\rangle$ (μm²) | | | | | | |

以 $\langle r^2\rangle$ 對 t 作圖，由斜率 $4D$ 求出 D。

### 步驟 B：D 與參數的關係
| T (K) | η (mPa·s) | r (μm) | 擬合 D (μm²/s) | 理論 D | 推得 $N_A$ |
|---|---|---|---|---|---|
| 293 | 1.0 | 0.5 | | | |
| 293 | 1.0 | 1.0 | | | |
| 293 | 2.0 | 0.5 | | | |
| 353 | 0.35 | 0.5 | | | |

### 步驟 C：分布的形狀
在 t = 10 s 與 t = 40 s 時暫停，比較直方圖的寬度，驗證標準差 $\propto \sqrt t$。

## 六、實驗探究問題

1. 只追蹤一個粒子量 $D$，結果的不確定度大約多少？200 個粒子平均後呢？（提示：統計誤差 $\propto 1/\sqrt N$）
2. 為何粒子越小，布朗運動越明顯？這對奈米藥物在體內的傳輸有什麼意義？
3. 方均根位移隨 $\sqrt t$ 成長，意味著「擴散擴得越來越慢」。一滴墨水在靜止的水中擴散 1 cm 需要多久？為何日常生活中混合比這快得多？
4. 若改看極短時間（小於 $m/\gamma$ 的慣性時間），位移與時間的關係會變為什麼？（彈道運動 vs 擴散運動）
5. 查閱佩蘭的實驗方法，他如何量測微粒的半徑？

## 七、誤差來源與模型限制

- 模型為「過阻尼」朗之萬方程，忽略了微粒慣性（約 $10^{-7}$ s 的時間尺度）。
- 粒子之間不互相作用，也沒有容器壁。
- 有限的粒子數造成擬合 $D$ 約有數個百分比的統計漲落；每次執行結果略有不同是正常的。

## 八、延伸挑戰

1. 加入一個固定方向的外力（如重力沉降），觀察漂移與擴散的競爭（佩蘭的沉降平衡實驗）。
2. 在 $x = \pm L$ 加入反射牆，觀察長時間後的均勻分布。
3. 改為一維隨機漫步並以固定步長行走，比較與高斯步長的差異（中央極限定理）。

## 九、延伸閱讀

- A. Einstein, "Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen", *Annalen der Physik* 17, 549 (1905)
- J. Perrin, *Les Atomes* (1913)；英譯本 *Atoms*。以及 1926 年諾貝爾物理獎演講〈Discontinuous Structure of Matter〉
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 41〈The Brownian Movement〉
- F. Reif, *Fundamentals of Statistical and Thermal Physics*, Ch. 15〈Irreversible Processes and Fluctuations〉
- R. Newburgh, J. Peidle, W. Rueckner, "Einstein, Perrin, and the reality of atoms: 1905 revisited", *American Journal of Physics* 74, 478 (2006)
`;

const brownian: ExampleDef = {
  id: 'brownian',
  category: '熱學與統計',
  difficulty: '進階',
  listDescription: '200 個懸浮微粒的隨機漫步：驗證均方位移 ⟨r²⟩ = 4Dt 與斯托克斯–愛因斯坦公式，並由擬合的擴散係數反推亞佛加厥數。',
  description: brownianHandout,
  info: { title: '布朗運動與擴散', author: '', keywords: '', abstract: '' },
  variables: doubles('bw', [
    ['Tk', '293', '溫度（K）'],
    ['eta', '1.0', '黏滯係數 η（mPa·s）'],
    ['rad', '0.5', '粒子半徑 r（μm）'],
    ['D', '0', '理論擴散係數（μm²/s）'],
    ['msd', '0', '均方位移 ⟨r²⟩（μm²）'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'bw-ode', name: '時間推進', method: 'Euler', increment: '0.05', comment: '粒子位移在約束頁以隨機數產生',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'bw-con', name: '隨機漫步（過阻尼朗之萬方程）', comment: '',
    code: String.raw`var N = 200;
D = 1.380649e-23 * Tk / (6 * Math.PI * eta * 1e-3 * rad * 1e-6) * 1e12;   // μm²/s
var sig = Tk + '|' + eta + '|' + rad;
if (!_v._bx || _v._sig !== sig) {
  _v._sig = sig;
  _v._bx = new Float64Array(N); _v._by = new Float64Array(N);
  t = 0; _v._lt = 0; msd = 0;
}
if (t > _v._lt) {
  var dtp = t - _v._lt; _v._lt = t;
  var sd = Math.sqrt(2 * D * dtp), sum = 0;
  for (var i = 0; i < N; i++) {
    var u1 = Math.random() || 1e-12, u2 = Math.random();
    var gr = Math.sqrt(-2 * Math.log(u1));
    _v._bx[i] += sd * gr * Math.cos(2 * Math.PI * u2);
    _v._by[i] += sd * gr * Math.sin(2 * Math.PI * u2);
    sum += _v._bx[i] * _v._bx[i] + _v._by[i] * _v._by[i];
  }
  msd = sum / N;
} else if (t < _v._lt) {
  _v._lt = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('bw-dp', 620, 420, [0, 10, 0, 10]),
    slider('bw-s-T', 'Tk', 273, 373, 1, '溫度 T (K)'),
    slider('bw-s-eta', 'eta', 0.3, 5, 0.05, '黏滯係數 η (mPa·s)'),
    slider('bw-s-r', 'rad', 0.1, 2, 0.05, '粒子半徑 r (μm)'),
    customDraw('bw-draw', '顯微鏡視野與統計圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var bx = vars._bx, by = vars._by, D = vars.D, t = vars.t;
// ── 顯微鏡視野（左上）──
var S0 = 300, cx = 8 + S0 / 2, cy = 8 + S0 / 2;
var half = Math.max(6, 3.2 * Math.sqrt(4 * D * Math.max(t, 1)));
var sc = (S0 / 2) / half;
ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, S0 / 2, 0, 2 * Math.PI); ctx.clip();
ctx.fillStyle = "#1F2A33"; ctx.fillRect(8, 8, S0, S0);
ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.arc(cx, cy, Math.sqrt(4 * D * t) * sc, 0, 2 * Math.PI); ctx.stroke();
var hl = ["#E9A23B", "#2A9D8F", "#D1495B"];
for (var k = 0; k < 3 && bx; k++) {
  var tr = track("_bwT" + k, [t, bx[k], by[k]], 4000);
  ctx.strokeStyle = hl[k]; ctx.globalAlpha = 0.85; ctx.beginPath();
  tr.forEach(function (p, i) { if (i) ctx.lineTo(cx + p[1] * sc, cy - p[2] * sc); else ctx.moveTo(cx + p[1] * sc, cy - p[2] * sc); });
  ctx.stroke(); ctx.globalAlpha = 1;
}
if (bx) {
  var pr = Math.max(1.5, Math.min(5, vars.rad * sc));
  for (var i = 0; i < bx.length; i++) {
    ctx.fillStyle = i < 3 ? hl[i] : "rgba(220,230,240,0.8)";
    ctx.beginPath(); ctx.arc(cx + bx[i] * sc, cy - by[i] * sc, i < 3 ? pr + 1.5 : pr, 0, 2 * Math.PI); ctx.fill();
  }
}
// 比例尺
var bar = Math.pow(10, Math.floor(Math.log10(half / 2)));
if (half / bar > 6) bar *= 2;
ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - bar * sc / 2, cy + S0 / 2 - 24); ctx.lineTo(cx + bar * sc / 2, cy + S0 / 2 - 24); ctx.stroke();
ctx.fillStyle = "#FFFFFF"; ctx.font = "11px monospace"; ctx.textAlign = "center"; ctx.fillText(bar + " μm", cx, cy + S0 / 2 - 30);
ctx.restore();
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, S0 / 2, 0, 2 * Math.PI); ctx.stroke();
// ── MSD 圖（右上）──
var hm = track("_bwM", [t, vars.msd], 3000);
var sxy = 0, sxx = 0;
hm.forEach(function (p) { sxy += p[0] * p[1]; sxx += p[0] * p[0]; });
var Dfit = sxx > 0 ? sxy / sxx / 4 : NaN;
var tm = Math.max(t, 5);
var gp = miniPlot({ x: 320, y: 6, w: W - 326, h: 204 }, [
  { pts: [[0, 0], [tm, 4 * D * tm]], color: "#9AA0A6", dash: [5, 4], label: "理論 4Dt" },
  { pts: hm.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "⟨r²⟩" },
], { title: "均方位移 ⟨r²⟩ (μm²)", xlabel: "t(s)", xmin: 0, xmax: tm, ymin: 0, ymax: Math.max(4 * D * tm, vars.msd) * 1.1 });
// ── x 位移直方圖（右下）──
var nb = 25, sig = Math.sqrt(2 * D * Math.max(t, 1e-6)), xr = 4 * sig, hist = [];
for (var b = 0; b < nb; b++) hist.push(0);
if (bx && t > 0) for (var j = 0; j < bx.length; j++) { var bi = Math.floor((bx[j] + xr) / (2 * xr) * nb); if (bi >= 0 && bi < nb) hist[bi]++; }
var bw = 2 * xr / nb, N = bx ? bx.length : 200, gauss = [];
for (var q = 0; q <= 80; q++) { var xx = -xr + q * 2 * xr / 80; gauss.push([xx, N * bw * Math.exp(-xx * xx / (2 * sig * sig)) / (Math.sqrt(2 * Math.PI) * sig)]); }
var hy = Math.max(N * bw / (Math.sqrt(2 * Math.PI) * sig), Math.max.apply(null, hist)) * 1.15;
var g2 = miniPlot({ x: 320, y: 216, w: W - 326, h: 198 }, [
  { pts: gauss, color: "#D1495B", label: "高斯 σ²=2Dt" },
], { title: "x 位移分布（粒子數）", xlabel: "x(μm)", xmin: -xr, xmax: xr, ymin: 0, ymax: hy });
ctx.fillStyle = "rgba(47,111,176,0.45)";
hist.forEach(function (c, i) { var x0 = g2.px(-xr + i * bw), x1 = g2.px(-xr + (i + 1) * bw); ctx.fillRect(x0 + 0.5, g2.py(c), x1 - x0 - 1, g2.py(0) - g2.py(c)); });
// ── 讀數（左下）──
var NA = isFinite(Dfit) && Dfit > 0 ? 8.314 * vars.Tk / (6 * Math.PI * vars.eta * 1e-3 * vars.rad * 1e-6 * Dfit * 1e-12) : NaN;
infoBox(8, 316, [
  "t = " + t.toFixed(1) + " s",
  "理論 D = kT/(6πηr) = " + D.toFixed(4) + " μm²/s",
  ["擬合 D = " + (isFinite(Dfit) ? Dfit.toFixed(4) : "…") + " μm²/s", "#2F6FB0"],
  ["推得 NA = " + (isFinite(NA) ? NA.toExponential(3) : "…") + " /mol", "#2A9D8F"],
  "（真值 6.022e+23 /mol）",
], { font: "11px monospace", lh: 17, w: 300 });
`),
  ],
};

// ─────────────────────────────────────────────
// 一維熱傳導
// ─────────────────────────────────────────────
const heatHandout = String.raw`# 🔥 一維熱傳導：金屬棒的溫度分布實驗講義

> 把金屬棒一端插入沸水、另一端放進冰水，棒上的溫度會怎樣演變？傅立葉在 1822 年的《熱的解析理論》中寫下熱方程，並為了解它發明了傅立葉級數。

## 一、實驗目的

1. 觀察金屬棒由初始溫度演變到穩態的過程。
2. 驗證穩態時溫度沿棒呈線性分布，並以傅立葉定律計算熱流。
3. 比較不同材料（銅、鋁、鐵、玻璃）的熱擴散係數，量測達到穩態的特徵時間 $\tau \sim L^2/\alpha$。
4. 比較「兩端固定溫度」與「一端絕熱」的邊界條件。

## 二、課前預報

1. 寫出傅立葉熱傳導定律 $q = -k\ dT/dx$，說明各量的單位與負號意義。
2. 由能量守恆推導一維熱方程 $\partial T/\partial t = \alpha\ \partial^2T/\partial x^2$，並說明 $\alpha = k/(\rho c)$ 的意義。
3. 依下表計算銅與玻璃的熱擴散係數 α。
4. 長 0.2 m 的銅棒與玻璃棒，達到穩態所需的時間大約相差幾倍？
5. 穩態時，若兩端分別為 100°C 與 0°C，銅棒中的熱流密度是多少 W/m²？

| 材料 | 熱導率 k (W/m·K) | 密度 ρ (kg/m³) | 比熱 c (J/kg·K) |
|---|---|---|---|
| 銅 | 401 | 8960 | 385 |
| 鋁 | 237 | 2700 | 897 |
| 鐵 | 80 | 7870 | 449 |
| 玻璃 | 1.0 | 2500 | 840 |

## 三、實驗原理

### 1. 熱方程
$$ \frac{\partial T}{\partial t} = \alpha\frac{\partial^2 T}{\partial x^2}, \qquad \alpha = \frac{k}{\rho c} $$

### 2. 穩態解
$\partial T/\partial t = 0$ 時 $d^2T/dx^2 = 0$，溫度為線性分布：
$$ T(x) = T_h + (T_c - T_h)\frac{x}{L}, \qquad q = k\frac{T_h - T_c}{L} $$
若右端絕熱（$dT/dx = 0$），穩態時整根棒都等於 $T_h$。

### 3. 趨近穩態的時間
與穩態的差距可展開為正弦級數，最慢衰減的模態時間常數為
$$ \tau_1 = \frac{L^2}{\pi^2\alpha} \quad(\text{兩端固定}), \qquad \tau_1 = \frac{4L^2}{\pi^2\alpha} \quad(\text{一端絕熱}) $$

### 4. 數值方法（顯式差分）
把棒分成 40 格：
$$ T_i^{n+1} = T_i^n + \frac{\alpha\Delta t}{\Delta x^2}\left(T_{i+1}^n - 2T_i^n + T_{i-1}^n\right) $$
穩定條件 $\alpha\Delta t/\Delta x^2 \le 1/2$；模擬會自動切分子步長以滿足它。

## 四、模擬器操作說明

| 控制項 | 說明 |
|---|---|
| 材料 | 1 = 銅、2 = 鋁、3 = 鐵、4 = 玻璃 |
| 時間倍率 | 每 1 秒實際時間模擬多少秒（1 至 2000） |
| 右端邊界 | 0 = 接冰水（固定 0°C）、1 = 絕熱 |

- 上方為棒的溫度色圖（紅熱藍冷）；左下為溫度分布 $T(x)$，虛線為穩態解；右下為棒中點溫度隨（物理）時間的變化。
- 改變材料或邊界條件即重新開始；改變時間倍率不會重新開始。

## 五、實驗步驟與數據記錄

### 步驟 A：銅棒的穩態
以銅、固定兩端執行到穩態，讀取各位置的溫度：

| x (cm) | 0 | 4 | 8 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|
| T (°C) | | | | | | |

驗證線性分布並計算熱流密度 $q$。

### 步驟 B：達到穩態的時間
記錄中點溫度達到穩態值（50°C）的 90%（即升至 47°C）所需時間：

| 材料 | α (m²/s) | $t_{90}$ (s) | $L^2/\alpha$ (s) | $t_{90}\alpha/L^2$ |
|---|---|---|---|---|
| 銅 | | | | |
| 鋁 | | | | |
| 鐵 | | | | |
| 玻璃 | | | | |

最後一欄是否近似為常數？說明其意義。

### 步驟 C：絕熱邊界
把右端改為絕熱，觀察溫度分布的演變與最終穩態，並與步驟 A 比較所需時間。

## 六、實驗探究問題

1. 為什麼冬天摸金屬欄杆比摸木頭冷，即使兩者溫度相同？（提示：熱滲透率 $\sqrt{k\rho c}$）
2. 熱擴散是「擴散」的一種，請比較熱方程與布朗運動的擴散方程。$\alpha$ 對應什麼？
3. 若棒長加倍，達到穩態的時間變為幾倍？這對建築隔熱有何意義？
4. 散熱片為什麼多用鋁而不是銅？請從成本、重量與 $k$、$\alpha$ 討論。
5. 本模擬忽略了棒的側面散熱。若加入側面對流（$-h(T - T_{air})$ 項），穩態分布會變成什麼形狀？

## 七、誤差來源與模型限制

- 假設材料性質不隨溫度變化，且棒側面完全絕熱。
- 空間只分 40 格，初期（端點溫度突變時）的陡峭梯度解析度有限。
- 兩端溫度被理想地固定，實際的熱庫與棒之間有接觸熱阻。

## 八、延伸挑戰

1. 加入側面散熱項，模擬「散熱鰭片」，觀察穩態溫度呈指數衰減。
2. 讓左端溫度隨時間週期變化（如晝夜溫差），觀察溫度波在棒中的衰減與相位延遲。
3. 改用隱式（Crank–Nicolson）方法，比較在大時間步長下的穩定性。

## 九、延伸閱讀

- J. Fourier, *Théorie analytique de la chaleur* (1822)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Temperature, Heat, and the First Law of Thermodynamics〉章：熱傳導
- H. D. Young, R. A. Freedman, *University Physics*,〈Temperature and Heat〉章
- N. Giordano, H. Nakanishi, *Computational Physics*（2nd ed.）：偏微分方程的數值解
- W. H. Press et al., *Numerical Recipes*, Ch. 20〈Partial Differential Equations〉
`;

const heatconduction: ExampleDef = {
  id: 'heatconduction',
  category: '熱學與統計',
  difficulty: '基礎',
  listDescription: '金屬棒一端接沸水、一端接冰水，以有限差分法解熱方程：比較銅、鋁、鐵、玻璃趨近線性穩態的速度，並切換絕熱邊界。',
  description: heatHandout,
  info: { title: '一維熱傳導', author: '', keywords: '', abstract: '' },
  variables: doubles('ht', [
    ['mat', '1', '材料：1 銅、2 鋁、3 鐵、4 玻璃'],
    ['speed', '5', '時間倍率（模擬秒 / 每秒）'],
    ['rightBC', '0', '右端邊界：0 = 固定 Tc、1 = 絕熱'],
    ['Th', '100', '左端溫度（°C）'],
    ['Tc', '0', '右端溫度（°C）'],
    ['T0', '20', '初始溫度（°C）'],
    ['Lrod', '0.2', '棒長（m）'],
    ['tp', '0', '物理時間（s）'],
    ['alpha', '0', '熱擴散係數（m²/s）'],
    ['kc', '0', '熱導率（W/m·K）'],
    ['Tmid', '20', '中點溫度（°C）'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'ht-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '熱方程在約束頁以有限差分求解',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'ht-con', name: '熱方程（顯式差分）', comment: '',
    code: String.raw`var N = 40;
var mi = Math.max(1, Math.min(4, Math.round(mat)));
var K = [401, 237, 80, 1.0][mi - 1], RHO = [8960, 2700, 7870, 2500][mi - 1], CP = [385, 897, 449, 840][mi - 1];
kc = K; alpha = K / (RHO * CP);
var sig = mi + '|' + rightBC + '|' + Th + '|' + Tc + '|' + T0 + '|' + Lrod;
if (!_v._T || _v._sig !== sig) {
  _v._sig = sig;
  _v._T = new Float64Array(N + 1);
  for (var i = 0; i <= N; i++) _v._T[i] = T0;
  _v._T[0] = Th; if (rightBC < 0.5) _v._T[N] = Tc;
  tp = 0; _v._lt = t;
}
if (t > _v._lt) {
  var dts = (t - _v._lt) * speed; _v._lt = t;
  var dx = Lrod / N, dmax = 0.4 * dx * dx / alpha;
  var ns = Math.max(1, Math.ceil(dts / dmax)), hh = dts / ns, r = alpha * hh / (dx * dx);
  var T = _v._T, nw = new Float64Array(N + 1);
  for (var s = 0; s < ns; s++) {
    for (var j = 1; j < N; j++) nw[j] = T[j] + r * (T[j + 1] - 2 * T[j] + T[j - 1]);
    nw[0] = Th;
    nw[N] = rightBC < 0.5 ? Tc : nw[N - 1];
    for (var q = 0; q <= N; q++) T[q] = nw[q];
  }
  tp += dts;
} else if (t < _v._lt) {
  _v._lt = t;
}
Tmid = _v._T[N / 2];`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('ht-dp', 620, 400, [0, 10, 0, 10]),
    slider('ht-s-m', 'mat', 1, 4, 1, '材料（1銅 2鋁 3鐵 4玻璃）'),
    slider('ht-s-sp', 'speed', 1, 2000, 1, '時間倍率'),
    slider('ht-s-bc', 'rightBC', 0, 1, 1, '右端（0冰水 1絕熱）'),
    customDraw('ht-draw', '棒與溫度圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var T = vars._T, N = T ? T.length - 1 : 40, Th = vars.Th, Tc = vars.Tc, L = vars.Lrod;
var names = ["銅", "鋁", "鐵", "玻璃"], mi = Math.max(1, Math.min(4, Math.round(vars.mat)));
function heat(v) {
  var lo = Math.min(Tc, vars.T0), f = Math.max(0, Math.min(1, (v - lo) / ((Th - lo) || 1)));
  var c0 = [47, 111, 176], c1 = [233, 162, 59], c2 = [209, 73, 91];
  var a = f < 0.5 ? c0 : c1, b = f < 0.5 ? c1 : c2, u = f < 0.5 ? f * 2 : (f - 0.5) * 2;
  return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * u); }).join(",") + ")";
}
// 熱庫
var x0 = 90, x1 = W - 90, ry = 40, rh = 34;
ctx.fillStyle = "#F9E3E6"; ctx.fillRect(10, ry - 18, 70, rh + 36);
ctx.fillStyle = "#D1495B"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
ctx.fillText("沸水", 45, ry + 14); ctx.fillText(Th + "°C", 45, ry + 30);
if (vars.rightBC < 0.5) {
  ctx.fillStyle = "#E6EEF7"; ctx.fillRect(W - 80, ry - 18, 70, rh + 36);
  ctx.fillStyle = "#2F6FB0"; ctx.fillText("冰水", W - 45, ry + 14); ctx.fillText(Tc + "°C", W - 45, ry + 30);
} else {
  ctx.fillStyle = "#EFE9DC"; ctx.fillRect(W - 80, ry - 18, 70, rh + 36);
  ctx.fillStyle = "#6B6F76"; ctx.fillText("絕熱", W - 45, ry + 22);
}
// 棒
if (T) for (var i = 0; i <= N; i++) { ctx.fillStyle = heat(T[i]); ctx.fillRect(x0 + (i - 0.5) * (x1 - x0) / N, ry, (x1 - x0) / N + 1, rh); }
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5; ctx.strokeRect(x0, ry, x1 - x0, rh);
ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif";
ctx.fillText(names[mi - 1] + "棒  L = " + (L * 100).toFixed(0) + " cm", W / 2, ry - 8);
// 溫度分布
var prof = [], ss = [];
if (T) for (var j = 0; j <= N; j++) prof.push([j / N * L * 100, T[j]]);
for (var k = 0; k <= 20; k++) { var xx = k / 20; ss.push([xx * L * 100, vars.rightBC < 0.5 ? Th + (Tc - Th) * xx : Th]); }
var lo = Math.min(Tc, vars.T0) - 5, hi = Th + 5;
miniPlot({ x: 6, y: 112, w: W / 2 - 9, h: 282 }, [
  { pts: ss, color: "#9AA0A6", dash: [5, 4], label: "穩態" },
  { pts: prof, color: "#D1495B", label: "T(x)" },
], { title: "溫度分布 T (°C)", xlabel: "x(cm)", xmin: 0, xmax: L * 100, ymin: lo, ymax: hi });
// 中點溫度–時間
var hm = track("_htM", [vars.tp, vars.Tmid], 3000);
var tmax = Math.max(vars.tp, 10);
var Tss = vars.rightBC < 0.5 ? (Th + Tc) / 2 : Th;
miniPlot({ x: W / 2 + 3, y: 112, w: W / 2 - 9, h: 200 }, [
  { pts: [[0, Tss], [tmax, Tss]], color: "#9AA0A6", dash: [5, 4], label: "穩態值" },
  { pts: hm, color: "#2F6FB0", label: "T中點" },
], { title: "中點溫度 (°C)", xlabel: "t(s)", xmin: 0, xmax: tmax, ymin: lo, ymax: hi });
var q = T ? vars.kc * (T[0] - T[1]) / (L / N) : 0;
var tau1 = (vars.rightBC < 0.5 ? 1 : 4) * L * L / (Math.PI * Math.PI * vars.alpha);
infoBox(W / 2 + 3, 318, [
  "物理時間 t = " + vars.tp.toFixed(1) + " s",
  "α = " + vars.alpha.toExponential(3) + " m²/s",
  "τ1 = L²/(π²α)" + (vars.rightBC < 0.5 ? "" : "×4") + " = " + tau1.toFixed(1) + " s",
  ["左端熱流 q = " + q.toFixed(0) + " W/m²", "#D1495B"],
], { font: "11px monospace", lh: 16, w: W / 2 - 9 });
`),
  ],
};

const THERMAL_EXAMPLES: ExampleDef[] = [brownian, heatconduction];

export default THERMAL_EXAMPLES;

import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';
import type { ViewElement } from '../../types/simulation';

// ═════════════════════════════════════════════════════════════
// 大學普物：電磁學
// ═════════════════════════════════════════════════════════════

/** Invisible draggable hit target; the CustomDraw layer paints what the user sees. */
function dragHandle(id: string, name: string, xVar: string, yVar: string, size = 0.3): ViewElement {
  return {
    id,
    type: 'Elements.Shape2D',
    name,
    parent: 'DrawingPanel1',
    properties: {
      X: xVar, Y: yVar, SizeX: String(size), SizeY: String(size), ShapeType: 'ELLIPSE',
      FillColor: '"rgba(0,0,0,0)"', LineColor: '"rgba(0,0,0,0)"', Visible: 'true', Draggable: 'true',
    },
  };
}

// ─────────────────────────────────────────────
// RC 電路充放電
// ─────────────────────────────────────────────
const rcHandout = String.raw`# 🔋 RC 電路：電容器的充電與放電實驗講義

> 相機閃光燈、心臟除顫器、電腦記憶體的更新、類比濾波器……RC 電路的指數充放電是電子學中最常見的時間尺度來源。

## 一、實驗目的

1. 以方波電源反覆對電容器充電與放電，觀察電容電壓 $V_C$ 與電阻電壓 $V_R$ 的波形。
2. 量測時間常數 $\tau$，驗證 $\tau = RC$。
3. 理解方波週期與時間常數的相對大小如何決定輸出波形（積分電路與微分電路）。

## 二、課前預報

1. 寫出 RC 串聯電路接上直流電動勢 $\varepsilon$ 時的克希荷夫電壓方程，並解出 $V_C(t)$。
2. 時間常數 $\tau = RC$ 的單位為何是秒？$R = 10\ \text{k}\Omega$、$C = 100\ \mu\text{F}$ 時 $\tau$ 是多少？
3. 充電時經過 $\tau$、$2\tau$、$5\tau$ 後，$V_C$ 分別達到電源電壓的幾 %？
4. 充電過程中，電源提供的能量有多少比例儲存在電容器中？其餘去了哪裡？
5. 放電時電流方向與充電時相同還是相反？

## 三、實驗原理

### 1. 電路方程
方波電源電壓 $V_s(t)$ 在 $V_0$ 與 0 之間切換：
$$ V_s = IR + V_C, \qquad I = C\frac{dV_C}{dt} \quad\Longrightarrow\quad \frac{dV_C}{dt} = \frac{V_s - V_C}{RC} $$

### 2. 充電與放電
充電（$V_s = V_0$，從 $V_C = 0$ 開始）：
$$ V_C = V_0\left(1 - e^{-t/\tau}\right), \qquad I = \frac{V_0}{R}e^{-t/\tau} $$
放電（$V_s = 0$，從 $V_C = V_0$ 開始）：
$$ V_C = V_0 e^{-t/\tau}, \qquad I = -\frac{V_0}{R}e^{-t/\tau} $$

### 3. 時間常數的量測
經過一個 $\tau$，$V_C$ 完成從起始值到最終值變化量的 $1 - e^{-1} \approx 63.2\%$。也可由半衰期 $t_{1/2} = \tau\ln 2$ 量測。

### 4. 能量
充電完成時電容器儲能 $\frac12 CV_0^2$，電阻上消耗的焦耳熱也是 $\frac12 CV_0^2$——與 R 的大小無關！

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 電阻 R | 1 至 100 kΩ | |
| 電容 C | 10 至 470 μF | |
| 方波週期 T | 1 至 30 s | 前半週期 $V_s = 5$ V，後半週期 0 V |

- 上方為電路示意圖，電容極板上的電荷符號多寡代表 $V_C$；導線上的箭頭為電流方向。
- 下方示波器：琥珀色 $V_s$、藍色 $V_C$、紅色 $V_R = IR$。
- 儀表板中的「實測 τ」為每次切換後 $V_C$ 完成 63.2% 變化所需的時間。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：量測時間常數（T = 20 s）
| R (kΩ) | C (μF) | 實測 τ (s) | RC (s) | 誤差 |
|---|---|---|---|---|
| 10 | 100 | | | |
| 20 | 100 | | | |
| 10 | 220 | | | |
| 47 | 47 | | | |
| 100 | 10 | | | |

以實測 τ 對 RC 作圖，斜率應為 1。

### 步驟 B：方波週期的影響（R = 10 kΩ、C = 100 μF）
分別設 T = 1、3、10、30 s，描述 $V_C$ 與 $V_R$ 的波形：

| T / τ | $V_C$ 波形 | $V_R$ 波形 |
|---|---|---|
| 1 | | |
| 3 | | |
| 10 | | |
| 30 | | |

### 步驟 C：半對數作圖
在放電階段讀取 5 組 $(t, V_C)$，以 $\ln V_C$ 對 $t$ 作圖，由斜率 $-1/\tau$ 求 τ。

## 六、實驗探究問題

1. 當 $T \ll \tau$ 時，$V_C$ 近似三角波，這稱為「積分電路」，為什麼？
2. 當 $T \gg \tau$ 時，$V_R$ 只在切換瞬間出現尖峰，這稱為「微分電路」，為什麼？
3. $V_C$ 可以瞬間跳變嗎？$V_R$ 呢？從能量的角度說明。
4. 心臟除顫器需要在數毫秒內釋放約 200 J 能量，如何選擇 C 與充電電壓？
5. 若在電容兩端並聯一個電阻（模擬漏電），穩態的 $V_C$ 會變成多少？

## 七、誤差來源與模型限制

- 理想元件：忽略電源內阻、電容漏電與導線電阻。
- 真實實驗中的電解電容誤差常達 ±20%，這是實測 τ 與標示 RC 不符的主要原因。
- 方波切換被視為瞬間完成。

## 八、延伸挑戰

1. 把方波換成正弦波 $V_0\sin\omega t$，量測 $V_C$ 振幅與相位隨頻率的變化，畫出低通濾波器的波德圖。
2. 加入電感 L，模擬 RLC 串聯電路，與「受迫振動與共振」範例比較。
3. 串接兩級 RC 電路，觀察更平滑的濾波效果。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Circuits〉章：RC 電路
- H. D. Young, R. A. Freedman, *University Physics*,〈Direct-Current Circuits〉章
- P. Horowitz, W. Hill, *The Art of Electronics*（3rd ed.），Ch. 1：RC 電路與濾波器
- PhET 互動模擬〈Circuit Construction Kit: AC〉：phet.colorado.edu
`;

const rccircuit: ExampleDef = {
  id: 'rccircuit',
  category: '電磁學',
  difficulty: '入門',
  listDescription: '方波電源反覆對電容充放電，示波器同時顯示 Vs、Vc、VR；自動量測時間常數並驗證 τ = RC，觀察積分與微分電路波形。',
  description: rcHandout,
  info: { title: 'RC 電路充放電', author: '', keywords: '', abstract: '' },
  variables: doubles('rc', [
    ['R', '10', '電阻（kΩ）'],
    ['C', '100', '電容（μF）'],
    ['V0', '5', '方波高電位（V）'],
    ['Tsq', '10', '方波週期（s）'],
    ['Vc', '0', '電容電壓（V）'],
    ['Vs', '5', '電源電壓（V）'],
    ['I', '0', '電流（mA）'],
    ['tauRC', '1', '時間常數 RC（s）'],
    ['t63', '0', '實測時間常數（s）'],
  ]),
  odePages: [{
    id: 'rc-ode', name: '電路方程', method: 'RungeKutta', increment: '0.002', comment: 'R(kΩ)×C(μF) = ms，因此乘 1e-3 換成秒',
    rates: [{ state: 'Vc', expression: '(Vs - Vc) / (R * C * 1e-3)' }],
  }],
  constraintPages: [{
    id: 'rc-con', name: '方波電源與 τ 量測', comment: '',
    code: String.raw`tauRC = R * C * 1e-3;
var vsNew = (t % Tsq) < Tsq / 2 ? V0 : 0;
if (_v._vsPrev === undefined || vsNew !== _v._vsPrev) {
  // 剛切換：記下時間與「完成 63.2% 變化」的目標電壓
  _v._vsPrev = vsNew; _v._tE = t; _v._done = 0;
  _v._tgt = Vc + (1 - Math.exp(-1)) * (vsNew - Vc);
  _v._dir = vsNew > Vc ? 1 : -1;
}
Vs = vsNew;
if (!_v._done && (_v._dir > 0 ? Vc >= _v._tgt : Vc <= _v._tgt)) { t63 = t - _v._tE; _v._done = 1; }
I = (Vs - Vc) / R;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rc-dp', 620, 420, [0, 10, 0, 10]),
    slider('rc-s-R', 'R', 1, 100, 1, '電阻 R (kΩ)'),
    slider('rc-s-C', 'C', 10, 470, 10, '電容 C (μF)'),
    slider('rc-s-T', 'Tsq', 1, 30, 0.5, '方波週期 T (s)'),
    readout('rc-r-tau', '理論 τ = RC', 'tauRC', { unit: 's', digits: 3, color: C.muted, group: '時間常數' }),
    readout('rc-r-t63', '實測 τ（63.2%）', 't63 > 0 ? t63 : "量測中…"', { unit: 's', digits: 3, color: C.blue, group: '時間常數' }),
    readout('rc-r-ratio', '方波週期 / τ', 'Tsq / tauRC', { digits: 2, color: C.ink, group: '時間常數' }),
    readout('rc-r-vs', '電源 Vs', 'Vs', { unit: 'V', digits: 2, color: C.amber, group: '即時量測' }),
    readout('rc-r-vc', '電容電壓 Vc', 'Vc', { unit: 'V', digits: 3, color: C.blue, group: '即時量測' }),
    readout('rc-r-vr', '電阻電壓 VR', 'Vs - Vc', { unit: 'V', digits: 3, color: C.red, group: '即時量測' }),
    readout('rc-r-i', '電流 I', 'I', { unit: 'mA', digits: 4, color: C.red, group: '即時量測' }),
    readout('rc-r-u', '電容儲能', '0.5 * C * 1e-6 * Vc * Vc * 1000', { unit: 'mJ', digits: 3, color: C.teal, group: '即時量測' }),
    customDraw('rc-draw', '電路與示波器', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var V0 = vars.V0, Vs = vars.Vs, Vc = vars.Vc, I = vars.I;
// ── 電路圖 ──
var L = 60, R = 330, T = 40, B = 190;
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(L, T + 30); ctx.lineTo(L, T); ctx.lineTo(150, T); ctx.moveTo(240, T); ctx.lineTo(R, T); ctx.lineTo(R, 100);
ctx.moveTo(R, 128); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.lineTo(L, T + 90); ctx.stroke();
// 電阻
ctx.beginPath(); ctx.moveTo(150, T);
for (var i = 1; i <= 8; i++) ctx.lineTo(150 + i * 11.25 - 5.6, T + (i % 2 ? -9 : 9));
ctx.lineTo(240, T); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("R = " + vars.R + " kΩ", 195, T - 14);
// 方波電源
ctx.fillStyle = Vs > 0 ? "#FBEBD0" : "#F1EFEA"; ctx.beginPath(); ctx.arc(L, T + 60, 28, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.beginPath(); ctx.moveTo(L - 14, T + 68); ctx.lineTo(L - 14, T + 52); ctx.lineTo(L, T + 52); ctx.lineTo(L, T + 68); ctx.lineTo(L + 14, T + 68); ctx.lineTo(L + 14, T + 52); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.fillText("Vs = " + Vs.toFixed(1) + " V", L, B + 18);
// 電容
ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(R - 26, 100); ctx.lineTo(R + 26, 100); ctx.moveTo(R - 26, 128); ctx.lineTo(R + 26, 128); ctx.stroke();
var nq = Math.round(Math.abs(Vc) / V0 * 6);
ctx.font = "bold 12px monospace";
for (var k = 0; k < nq; k++) {
  ctx.fillStyle = Vc >= 0 ? "#D1495B" : "#2F6FB0"; ctx.fillText(Vc >= 0 ? "+" : "−", R - 22 + k * 8.5, 95);
  ctx.fillStyle = Vc >= 0 ? "#2F6FB0" : "#D1495B"; ctx.fillText(Vc >= 0 ? "−" : "+", R - 22 + k * 8.5, 143);
}
ctx.fillStyle = "#2B2D31"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
ctx.fillText("C = " + vars.C + " μF", R + 34, 110); ctx.fillText("Vc = " + Vc.toFixed(3) + " V", R + 34, 126);
// 電流箭頭（順時針為正：電源 → 電阻 → 電容）
var mag = Math.min(1, Math.abs(I) / (V0 / vars.R));
if (mag > 0.01) {
  var dir = I > 0 ? 1 : -1, wpx = 1.5 + 3 * mag, ic = "rgba(209,73,91," + (0.3 + 0.7 * mag).toFixed(2) + ")";
  arrow(110 - dir * 18, T + 14, 110 + dir * 18, T + 14, ic, wpx);
  arrow(R - 14, B - 30 - dir * 18, R - 14, B - 30 + dir * 18, ic, wpx);
  arrow(200 + dir * 18, B - 14, 200 - dir * 18, B - 14, ic, wpx);
}
ctx.fillStyle = "#D1495B"; ctx.font = "12px monospace"; ctx.fillText("I = " + I.toFixed(3) + " mA", 160, B - 26);
// 儀表：Vc 與電流（相對最大值）
function meter(x, label, frac, color, text) {
  var top = 40, hgt = 150, f = Math.max(-1, Math.min(1, frac));
  ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.strokeRect(x, top, 34, hgt);
  ctx.fillStyle = color;
  if (f >= 0) ctx.fillRect(x + 1, top + hgt * (1 - f), 32, hgt * f);
  else ctx.fillRect(x + 1, top, 32, -hgt * f);
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(label, x + 17, top + hgt + 16);
  ctx.font = "10px monospace"; ctx.fillStyle = "#6B6F76"; ctx.fillText(text, x + 17, top - 6);
}
meter(480, "Vc / V0", Vc / V0, "rgba(47,111,176,0.75)", (100 * Vc / V0).toFixed(0) + "%");
meter(548, "|I| / I0", Math.abs(I) / (V0 / vars.R), "rgba(209,73,91,0.7)", (100 * Math.abs(I) / (V0 / vars.R)).toFixed(0) + "%");
// ── 示波器 ──
var h = track("_rcS", [vars.t, Vs, Vc, Vs - Vc], 5000);
var win = 2 * vars.Tsq, t1 = Math.max(vars.t, win), t0 = t1 - win;
var vis = h.filter(function (p) { return p[0] >= t0; });
function col(j) { return vis.map(function (p) { return [p[0], p[j]]; }); }
miniPlot({ x: 6, y: 228, w: W - 12, h: 186 }, [
  { pts: col(1), color: "#E9A23B", label: "Vs", width: 1.4 },
  { pts: col(2), color: "#2F6FB0", label: "Vc", width: 2 },
  { pts: col(3), color: "#D1495B", label: "VR", width: 1.4 },
], { title: "示波器（V）", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -V0 * 1.1, ymax: V0 * 1.1 });
`),
  ],
};

// ─────────────────────────────────────────────
// 電場描繪：電力線與等位線
// ─────────────────────────────────────────────
const efieldHandout = String.raw`# ⚡ 電場描繪：電力線與等位線實驗講義

> 普物實驗中，我們在導電紙上用檢流計找出等位點，再畫出與之垂直的電力線。這個模擬讓你直接拖動電荷，即時看見電場與電位的整體結構。

## 一、實驗目的

1. 觀察點電荷組合（電偶極、同號電荷、三電荷）的電力線與等位線分布。
2. 驗證電力線處處與等位線垂直，且電場指向電位下降最快的方向。
3. 以探針量測各點的電位與電場，驗證 $E = -dV/dr$ 與疊加原理。

## 二、課前預報

1. 寫出點電荷的電場與電位公式，以及多個電荷時的疊加原理。
2. 為何電力線不會相交？為何電力線與等位線必定垂直？
3. 畫出電偶極（+q 與 −q）的電力線與等位線草圖，並標出 $V = 0$ 的等位線位置。
4. 兩個等量同號電荷連線中點的電場與電位各為何？
5. 在本模擬的單位制中 $k = 1$。電荷 $+2$ 在距離 2 處產生的電位與電場大小是多少？

## 三、實驗原理

### 1. 電場與電位的疊加
$$ \vec E(\vec r) = \sum_i \frac{kq_i(\vec r - \vec r_i)}{\lvert\vec r - \vec r_i\rvert^3}, \qquad V(\vec r) = \sum_i \frac{kq_i}{\lvert\vec r - \vec r_i\rvert} $$

### 2. 電場是電位的負梯度
$$ \vec E = -\nabla V $$
因此電場垂直於等位線，指向電位降低的方向；等位線越密，電場越強。

### 3. 電力線的畫法
從正電荷出發，沿著電場方向一步一步前進（每步長度固定、方向取當地 $\vec E$ 的單位向量），直到抵達負電荷或離開畫面。每個電荷畫出的電力線數目正比於 $\lvert q\rvert$，因此線的密度代表場強。

### 4. 等位線的畫法（行進方格法）
在網格上計算每點電位，再於每個方格的邊上以線性內插找出 $V = V_{level}$ 的位置並連線（marching squares 演算法）。

## 四、模擬器操作說明

| 操作 | 說明 |
|---|---|
| 拖曳電荷 | 三個電荷都可以用滑鼠拖動 |
| 電荷滑桿 q₁、q₂、q₃ | −3 至 3；設為 0 即移除該電荷 |
| 拖曳探針（十字） | 下方儀表板即時顯示該點的 V 與 E |

- 紅色等位線為正電位、藍色為負電位；灰色箭頭線為電力線。
- 不需按播放，拖曳即可更新。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：電偶極的等位線
保持 $q_1 = +2$、$q_2 = -2$、$q_3 = 0$。沿兩電荷的中垂線移動探針，記錄電位；再沿連線移動探針：

| 探針位置 (x, y) | V | $\lvert E\rvert$ | E 的方向 |
|---|---|---|---|
| (0, 0) | | | |
| (0, 1.5) | | | |
| (0, 3) | | | |
| (−1, 0) | | | |
| (1, 0) | | | |

### 步驟 B：驗證 $E = -\Delta V/\Delta r$
在某點附近沿電場方向移動探針 0.2 單位，記錄電位差，計算 $\Delta V/\Delta r$ 並與探針顯示的 $\lvert E\rvert$ 比較。

### 步驟 C：同號電荷與零場點
設 $q_1 = q_2 = +2$，找出電場為零的位置（探針 $\lvert E\rvert \approx 0$）。再設 $q_1 = +3$、$q_2 = +1$，零場點如何移動？以公式驗證。

### 步驟 D：遠場行為
設 $q_1 = +2$、$q_2 = -2$，把探針移到遠處，比較電偶極場（$\propto 1/r^3$）與單一電荷場（$\propto 1/r^2$）衰減的快慢。

## 六、實驗探究問題

1. 電力線的「密度」為什麼能代表電場強度？在二維圖上這個對應是否嚴格成立？
2. 為何導體表面一定是等位面？若把導體放進電場中，電力線會如何分布？
3. 電荷總和不為零時（例如 +3 與 −1），遠處的電力線看起來像什麼？
4. 實驗室用導電紙描繪電場，為何量到的是「電流場」卻能代表靜電場？（提示：兩者都滿足拉普拉斯方程）
5. 電位能夠在某點有極大值嗎？（恩紹定理：靜電場中不存在穩定平衡點）

## 七、誤差來源與模型限制

- 二維圖是三維點電荷場在平面上的切面；真正的「二維電荷」（無限長線電荷）場會以 $1/r$ 衰減。
- 電力線以固定步長數值追蹤，在電荷附近或零場點附近會有誤差。
- 等位線由有限網格內插，網格越細越平滑。

## 八、延伸挑戰

1. 加入第四個電荷，或排成四極矩（+ − + −）。
2. 加入一顆可自由移動的試驗電荷，用 ODE 模擬它在場中的運動（記得加阻尼）。
3. 改成線電荷（二維中 $V \propto -\ln r$），比較等位線的形狀。

## 九、延伸閱讀

- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. II, Ch. 4〈Electrostatics〉與 Ch. 6〈The Electric Field in Various Circumstances〉
- D. J. Griffiths, *Introduction to Electrodynamics*, Ch. 2〈Electrostatics〉
- E. M. Purcell, D. J. Morin, *Electricity and Magnetism*（3rd ed.），Ch. 2
- PhET 互動模擬〈Charges and Fields〉：phet.colorado.edu
`;

const efield: ExampleDef = {
  id: 'efield',
  category: '電磁學',
  difficulty: '基礎',
  listDescription: '用滑鼠拖曳三個點電荷，即時重算電力線（數值追蹤）與等位線（行進方格法），並以探針量測任一點的電位與電場。',
  description: efieldHandout,
  info: { title: '電場描繪：電力線與等位線', author: '', keywords: '', abstract: '' },
  variables: doubles('ef', [
    ['q1', '2', '電荷 1（k = 1 單位）'], ['x1', '-2', '電荷 1 x'], ['y1', '0', '電荷 1 y'],
    ['q2', '-2', '電荷 2'], ['x2', '2', '電荷 2 x'], ['y2', '0', '電荷 2 y'],
    ['q3', '0', '電荷 3'], ['x3', '0', '電荷 3 x'], ['y3', '2.5', '電荷 3 y'],
    ['px', '0', '探針 x'], ['py', '-2.5', '探針 y'],
    ['Vp', '0', '探針處電位'], ['Ex', '0', '探針處電場 x 分量'], ['Ey', '0', '探針處電場 y 分量'],
    ['Emag', '0', '探針處電場大小'], ['Edir', '0', '探針處電場方向（度）'],
  ]),
  odePages: [],
  constraintPages: [{
    id: 'ef-con', name: '探針量測（疊加原理）', comment: '拖曳電荷或探針時即時重算',
    code: String.raw`var Q = [[q1, x1, y1], [q2, x2, y2], [q3, x3, y3]];
Vp = 0; Ex = 0; Ey = 0;
for (var i = 0; i < 3; i++) {
  var dx = px - Q[i][1], dy = py - Q[i][2], r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2);
  Ex += Q[i][0] * dx / (r2 * r); Ey += Q[i][0] * dy / (r2 * r); Vp += Q[i][0] / r;
}
Emag = Math.sqrt(Ex * Ex + Ey * Ey);
Edir = Math.atan2(Ey, Ex) * 180 / Math.PI;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('ef-dp', 600, 400, [-6, 6, -4, 4], true),
    slider('ef-s-q1', 'q1', -3, 3, 0.5, '電荷 q₁'),
    slider('ef-s-q2', 'q2', -3, 3, 0.5, '電荷 q₂'),
    slider('ef-s-q3', 'q3', -3, 3, 0.5, '電荷 q₃'),
    readout('ef-r-p', '探針位置', '"(" + px.toFixed(2) + ", " + py.toFixed(2) + ")"', { color: C.ink, group: '探針（十字，可拖曳）' }),
    readout('ef-r-V', '電位 V', 'Vp', { digits: 3, color: C.red, group: '探針（十字，可拖曳）' }),
    readout('ef-r-E', '電場大小 |E|', 'Emag', { digits: 3, color: C.amber, group: '探針（十字，可拖曳）' }),
    readout('ef-r-dir', '電場方向', 'Edir', { unit: '°', digits: 1, color: C.amber, group: '探針（十字，可拖曳）' }),
    readout('ef-r-Ex', 'Eₓ', 'Ex', { digits: 3, color: C.muted, group: '分量' }),
    readout('ef-r-Ey', 'E_y', 'Ey', { digits: 3, color: C.muted, group: '分量' }),
    readout('ef-r-net', '總電荷 Σq', 'q1 + q2 + q3', { digits: 1, color: C.purple, group: '分量' }),
    customDraw('ef-draw', '電場繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var Q = [[vars.q1, vars.x1, vars.y1], [vars.q2, vars.x2, vars.y2], [vars.q3, vars.x3, vars.y3]];
function field(x, y) {
  var ex = 0, ey = 0, v = 0;
  for (var i = 0; i < 3; i++) {
    if (!Q[i][0]) continue;
    var dx = x - Q[i][1], dy = y - Q[i][2], r2 = dx * dx + dy * dy + 1e-6, r = Math.sqrt(r2);
    ex += Q[i][0] * dx / (r2 * r); ey += Q[i][0] * dy / (r2 * r); v += Q[i][0] / r;
  }
  return [ex, ey, v];
}
// ── 等位線（marching squares）──
var nx = 96, ny = 64, X0 = -6, X1 = 6, Y0 = -4, Y1 = 4, gx = (X1 - X0) / nx, gy = (Y1 - Y0) / ny;
var Vg = [];
for (var j = 0; j <= ny; j++) for (var i2 = 0; i2 <= nx; i2++) Vg.push(field(X0 + i2 * gx, Y0 + j * gy)[2]);
var levels = [-4, -2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2, 4];
ctx.lineWidth = 1.2;
levels.forEach(function (lv) {
  ctx.strokeStyle = lv > 0 ? "rgba(209,73,91,0.55)" : "rgba(47,111,176,0.55)";
  ctx.beginPath();
  for (var j2 = 0; j2 < ny; j2++) for (var i3 = 0; i3 < nx; i3++) {
    var a = Vg[j2 * (nx + 1) + i3], b = Vg[j2 * (nx + 1) + i3 + 1], c = Vg[(j2 + 1) * (nx + 1) + i3 + 1], d = Vg[(j2 + 1) * (nx + 1) + i3];
    var xa = X0 + i3 * gx, ya = Y0 + j2 * gy, pts = [];
    if ((a - lv) * (b - lv) < 0) pts.push([xa + gx * (lv - a) / (b - a), ya]);
    if ((b - lv) * (c - lv) < 0) pts.push([xa + gx, ya + gy * (lv - b) / (c - b)]);
    if ((c - lv) * (d - lv) < 0) pts.push([xa + gx * (lv - d) / (c - d), ya + gy]);
    if ((d - lv) * (a - lv) < 0) pts.push([xa, ya + gy * (lv - a) / (d - a)]);
    for (var p = 0; p + 1 < pts.length; p += 2) { ctx.moveTo(toPixX(pts[p][0]), toPixY(pts[p][1])); ctx.lineTo(toPixX(pts[p + 1][0]), toPixY(pts[p + 1][1])); }
  }
  ctx.stroke();
});
// ── 電力線 ──
var pos = 0, neg = 0;
Q.forEach(function (q) { if (q[0] > 0) pos += q[0]; else neg -= q[0]; });
var sgn = pos >= neg ? 1 : -1;
ctx.strokeStyle = "rgba(43,45,49,0.55)"; ctx.fillStyle = "rgba(43,45,49,0.7)"; ctx.lineWidth = 1;
Q.forEach(function (q) {
  if (!q[0] || q[0] * sgn <= 0) return;
  var n = Math.max(4, Math.round(6 * Math.abs(q[0])));
  for (var k = 0; k < n; k++) {
    var ang = 2 * Math.PI * (k + 0.5) / n, x = q[1] + 0.2 * Math.cos(ang), y = q[2] + 0.2 * Math.sin(ang);
    ctx.beginPath(); ctx.moveTo(toPixX(x), toPixY(y));
    var mark = null;
    for (var s = 0; s < 900; s++) {
      var f1 = field(x, y), m1 = Math.hypot(f1[0], f1[1]) || 1;
      var xm = x + sgn * 0.02 * f1[0] / m1, ym = y + sgn * 0.02 * f1[1] / m1;
      var f2 = field(xm, ym), m2 = Math.hypot(f2[0], f2[1]) || 1;
      x += sgn * 0.04 * f2[0] / m2; y += sgn * 0.04 * f2[1] / m2;
      ctx.lineTo(toPixX(x), toPixY(y));
      if (s === 40) mark = [x, y, f2[0] / m2, f2[1] / m2];
      if (x < -6.5 || x > 6.5 || y < -4.5 || y > 4.5) break;
      var hit = false;
      for (var i4 = 0; i4 < 3; i4++) if (Q[i4][0] && Math.hypot(x - Q[i4][1], y - Q[i4][2]) < 0.15) hit = true;
      if (hit && s > 5) break;
    }
    ctx.stroke();
    if (mark) {
      var axp = toPixX(mark[0]), ayp = toPixY(mark[1]), ux = mark[2], uy = -mark[3];
      ctx.beginPath(); ctx.moveTo(axp + ux * 5, ayp + uy * 5);
      ctx.lineTo(axp - ux * 4 - uy * 4, ayp - uy * 4 + ux * 4); ctx.lineTo(axp - ux * 4 + uy * 4, ayp - uy * 4 - ux * 4); ctx.closePath(); ctx.fill();
    }
  }
});
// ── 電荷 ──
Q.forEach(function (q, i) {
  var cx = toPixX(q[1]), cy = toPixY(q[2]), r = toPixLen(0.28);
  ctx.lineWidth = 1.5;
  if (!q[0]) { ctx.strokeStyle = "#B8B4AA"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]); }
  else { ctx.fillStyle = q[0] > 0 ? "#D1495B" : "#2F6FB0"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill(); }
  ctx.fillStyle = q[0] ? "#FFFFFF" : "#6B6F76"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(q[0] > 0 ? "+" : q[0] < 0 ? "−" : "0", cx, cy + 5);
  ctx.fillStyle = "#2B2D31"; ctx.font = "10px monospace"; ctx.fillText("q" + (i + 1) + "=" + q[0], cx, cy - r - 4);
});
// ── 探針 ──
var pf = field(vars.px, vars.py), Em = Math.hypot(pf[0], pf[1]);
var ppx = toPixX(vars.px), ppy = toPixY(vars.py);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(ppx - 8, ppy); ctx.lineTo(ppx + 8, ppy); ctx.moveTo(ppx, ppy - 8); ctx.lineTo(ppx, ppy + 8); ctx.stroke();
if (Em > 1e-6) { var Lp = Math.min(70, 28 * Math.sqrt(Em)); arrow(ppx, ppy, ppx + Lp * pf[0] / Em, ppy - Lp * pf[1] / Em, "#E9A23B", 2.5); }
`),
    dragHandle('ef-h1', '電荷1把手', 'x1', 'y1'),
    dragHandle('ef-h2', '電荷2把手', 'x2', 'y2'),
    dragHandle('ef-h3', '電荷3把手', 'x3', 'y3'),
    dragHandle('ef-hp', '探針把手', 'px', 'py', 0.25),
  ],
};

// ─────────────────────────────────────────────
// 電子荷質比 e/m
// ─────────────────────────────────────────────
const emHandout = String.raw`# 🧲 電子荷質比 e/m：亥姆霍茲線圈實驗講義

> 在充有稀薄氣體的玻璃球中，被加速的電子沿途激發氣體發出藍綠色輝光，讓電子的圓形軌跡清楚可見。量出圓的直徑，就能算出電子的荷質比——這是大學普物實驗最經典的近代物理實驗之一。

## 一、實驗目的

1. 觀察電子在均勻磁場中的圓周運動。
2. 改變加速電壓與線圈電流，量測電子軌跡半徑。
3. 以作圖法求出電子的荷質比 $e/m$，並與公認值 $1.759 \times 10^{11}$ C/kg 比較。

## 二、課前預報

1. 電子經電壓 $V$ 加速後的速率為何？200 V 時約為多少 m/s？是否需要考慮相對論效應？
2. 推導電子在均勻磁場 $B$ 中的圓周運動半徑 $r = \dfrac{mv}{eB}$，並結合上題得到 $r^2 = \dfrac{2m}{e}\dfrac{V}{B^2}$。
3. 亥姆霍茲線圈的特點是什麼？為何兩個線圈的間距要等於半徑？
4. 線圈 $N = 130$ 匝、半徑 $R = 0.15$ m，電流 1.5 A 時中心磁場是多少 mT？
5. 在 200 V、1.5 A 時，預估電子軌跡的直徑。

## 三、實驗原理

### 1. 加速
$$ eV = \frac12 mv^2 \quad\Longrightarrow\quad v = \sqrt{\frac{2eV}{m}} $$

### 2. 圓周運動
磁力提供向心力 $evB = mv^2/r$：
$$ r = \frac{mv}{eB} = \frac{1}{B}\sqrt{\frac{2mV}{e}} \quad\Longrightarrow\quad \frac{e}{m} = \frac{2V}{B^2r^2} $$

### 3. 亥姆霍茲線圈的磁場
兩個相同線圈相距 $R$ 時，中心附近的磁場相當均勻：
$$ B = \left(\frac45\right)^{3/2}\frac{\mu_0 NI}{R} $$

### 4. 作圖法
固定 $I$ 改變 $V$，以 $r^2$ 對 $V$ 作圖，斜率 $= \dfrac{2m}{eB^2}$；或固定 $V$ 改變 $I$，以 $1/r$ 對 $I$ 作圖。作圖能平均掉單次讀數的誤差。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 加速電壓 V | 100 至 300 V | 電子槍電壓 |
| 線圈電流 I | 0.5 至 3 A | 亥姆霍茲線圈電流 |
| 顯示理論值 | 0 或 1 | 1 時顯示理論半徑與 e/m（建議先自行量測） |

- 電子槍位於下方，電子向右射出後逆時針繞行。中央的垂直刻度尺從電子槍算起，單位為 cm，讀取軌跡最高點即為**直徑**。
- 若軌跡太大撞到玻璃，電子會停止。
- 時間已大幅放慢（實際繞一圈只需約 30 奈秒）。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：固定電流（I = 1.5 A），改變電壓
| V (V) | 直徑 d (cm) | r (m) | $r^2$ (m²) |
|---|---|---|---|
| 150 | | | |
| 180 | | | |
| 210 | | | |
| 240 | | | |
| 270 | | | |
| 300 | | | |

以 $r^2$ 對 $V$ 作圖，由斜率求 $e/m$。

### 步驟 B：固定電壓（V = 200 V），改變電流
| I (A) | B (mT) | 直徑 d (cm) | 1/r (m⁻¹) |
|---|---|---|---|
| 1.0 | | | |
| 1.5 | | | |
| 2.0 | | | |
| 2.5 | | | |

以 $1/r$ 對 $B$ 作圖，斜率為 $\sqrt{e/(2mV)}$，求 $e/m$。

### 步驟 C：結果比較
兩種方法得到的 $e/m$ 與公認值的百分誤差各為多少？哪種方法較準？

## 六、實驗探究問題

1. 為何軌跡是圓而不是螺旋？若電子初速有一個平行於磁場的分量會怎樣？
2. 真實實驗中地磁場（約 0.05 mT）會造成什麼誤差？如何設計實驗消除它？
3. 若把電子換成質子，在相同電壓與磁場下半徑變為幾倍？
4. 玻璃球中的氣體壓力為何必須很低？
5. 真實實驗量得的直徑常偏小，可能是因為我們看到的是發光的「內緣」。這會使 e/m 偏大還是偏小？

## 七、誤差來源與模型限制

- 模擬假設磁場完全均勻且無地磁場；真實亥姆霍茲線圈的場在遠離中心處會略減弱。
- 忽略電子與氣體分子碰撞造成的能量損失，以及電子束的寬度。
- 非相對論近似：300 V 時 $v/c \approx 0.034$，相對論修正約 0.06%，可忽略。

## 八、延伸挑戰

1. 在磁場中加入一個水平的地磁分量，觀察軌跡如何偏離圓形。
2. 給電子一個沿磁場方向（垂直螢幕）的速度分量，在 3D 中畫出螺旋線。
3. 與「陰極射線管」範例的 Thomson 方法比較，討論兩種測量 e/m 方法的異同。

## 九、延伸閱讀

- J. J. Thomson, "Cathode Rays", *Philosophical Magazine* 44, 293 (1897)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Magnetic Fields〉與〈Magnetic Fields Due to Currents〉章
- H. D. Young, R. A. Freedman, *University Physics*,〈Magnetic Field and Magnetic Forces〉章：帶電粒子的運動
- CODATA 2018 公認值：電子荷質比 $e/m_e = 1.75882001076 \times 10^{11}$ C/kg（physics.nist.gov/constants）
`;

const emratio: ExampleDef = {
  id: 'emratio',
  category: '電磁學',
  difficulty: '基礎',
  listDescription: '亥姆霍茲線圈中的電子束做圓周運動：改變加速電壓與線圈電流，以刻度尺讀取軌跡直徑，作圖求出電子荷質比 e/m。',
  description: emHandout,
  info: { title: '電子荷質比 e/m（亥姆霍茲線圈）', author: '', keywords: '', abstract: '' },
  variables: doubles('em', [
    ['Va', '200', '加速電壓（V）'],
    ['Ic', '1.5', '線圈電流（A）'],
    ['show', '0', '顯示理論值（1 = 是）'],
    ['Nc', '130', '線圈匝數'],
    ['Rc', '0.15', '線圈半徑（m）'],
    ['qm', '1.75882e11', '電子荷質比（C/kg）'],
    ['S', '1e-8', '時間放慢因子（每單位模擬時間 = 10 ns）'],
    ['B', '0', '線圈中心磁場（T）'],
    ['x', '0', '電子 x（m）'], ['y', '-0.07', '電子 y（m）'],
    ['vx', '0', '電子 vx（m/s）'], ['vy', '0', '電子 vy（m/s）'],
    ['hit', '0', '撞到玻璃（1 = 是）'],
  ]),
  odePages: [{
    id: 'em-ode', name: '勞侖茲力（電子）', method: 'RungeKutta', increment: '0.01', comment: '時間以 S 縮放',
    rates: [
      { state: 'x', expression: 'S * vx' },
      { state: 'y', expression: 'S * vy' },
      { state: 'vx', expression: '-S * qm * B * vy' },
      { state: 'vy', expression: 'S * qm * B * vx' },
    ],
  }],
  constraintPages: [{
    id: 'em-con', name: '線圈磁場與發射', comment: '',
    code: String.raw`B = Math.pow(0.8, 1.5) * 4e-7 * Math.PI * Nc * Ic / Rc;
var sig = Va + '|' + Ic;
if (_v._sig !== sig) {
  _v._sig = sig;
  x = 0; y = -0.07; vx = Math.sqrt(2 * qm * Va); vy = 0; hit = 0; t = 0;
}
if (!hit && x * x + y * y > 0.085 * 0.085) { hit = 1; }
if (hit) { vx = 0; vy = 0; }`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('em-dp', 460, 460, [-0.1, 0.1, -0.1, 0.1], true),
    slider('em-s-V', 'Va', 100, 300, 5, '加速電壓 V'),
    slider('em-s-I', 'Ic', 0.5, 3, 0.05, '線圈電流 I (A)'),
    slider('em-s-sh', 'show', 0, 1, 1, '顯示理論值'),
    readout('em-r-V', '加速電壓 V', 'Va', { unit: 'V', digits: 0, color: C.ink, group: '設定值' }),
    readout('em-r-I', '線圈電流 I', 'Ic', { unit: 'A', digits: 2, color: C.ink, group: '設定值' }),
    readout('em-r-B', '中心磁場 B', 'B * 1000', { unit: 'mT', digits: 3, color: C.blue, group: '設定值' }),
    readout('em-r-v', '電子速率 v', 'Math.sqrt(2 * qm * Va)', { unit: 'm/s', color: C.blue, group: '設定值' }),
    readout('em-r-d', '理論直徑 d', 'show >= 0.5 ? 2 * Math.sqrt(2 * qm * Va) / (qm * B) * 100 : "（已隱藏）"', { unit: 'cm', digits: 2, color: C.teal, group: '答案（「顯示理論值」設為 1）' }),
    readout('em-r-qm', '電子荷質比 e/m', 'show >= 0.5 ? qm : "（已隱藏）"', { unit: 'C/kg', color: C.teal, group: '答案（「顯示理論值」設為 1）' }),
    customDraw('em-draw', '電子束繪圖', String.raw`
ctx.fillStyle = "#F4F1EA"; ctx.fillRect(0, 0, W, H);
var cx = toPixX(0), cy = toPixY(0);
// 線圈（後方）
ctx.strokeStyle = "#C47F3A"; ctx.lineWidth = 10;
ctx.beginPath(); ctx.arc(cx, cy, toPixLen(0.096), 0, 2 * Math.PI); ctx.stroke();
// 玻璃球
var g = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, toPixLen(0.085));
g.addColorStop(0, "#2A3644"); g.addColorStop(1, "#0D141C");
ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, toPixLen(0.085), 0, 2 * Math.PI); ctx.fill();
// 刻度尺（自電子槍向上，單位 cm）
var gy0 = -0.07;
ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 1; ctx.font = "9px monospace"; ctx.textAlign = "left";
ctx.beginPath(); ctx.moveTo(cx, toPixY(gy0)); ctx.lineTo(cx, toPixY(0.08)); ctx.stroke();
for (var mm = 0; mm <= 150; mm++) {
  var yy = toPixY(gy0 + mm / 1000), len = mm % 10 === 0 ? 8 : mm % 5 === 0 ? 5 : 2.5;
  ctx.beginPath(); ctx.moveTo(cx, yy); ctx.lineTo(cx + len, yy); ctx.stroke();
  if (mm % 10 === 0 && mm > 0) ctx.fillText(String(mm / 10), cx + 10, yy + 3);
}
ctx.fillText("cm", cx + 10, toPixY(0.08) - 2);
// 電子槍
ctx.fillStyle = "#8C939B"; ctx.fillRect(toPixX(-0.022), toPixY(gy0) - 6, toPixX(0) - toPixX(-0.022), 12);
// 電子束（輝光）
var h = track("_emB", [vars.t, vars.x, vars.y], 2500);
ctx.save(); ctx.shadowColor = "rgba(90,255,200,0.9)"; ctx.shadowBlur = 10;
ctx.strokeStyle = "rgba(120,255,210,0.85)"; ctx.lineWidth = 3; ctx.beginPath();
h.forEach(function (p, i) { if (i) ctx.lineTo(toPixX(p[1]), toPixY(p[2])); else ctx.moveTo(toPixX(p[1]), toPixY(p[2])); });
ctx.stroke(); ctx.restore();
ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(toPixX(vars.x), toPixY(vars.y), 3, 0, 2 * Math.PI); ctx.fill();
if (vars.hit) { ctx.fillStyle = "#E9A23B"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("電子撞到玻璃！請調大電流或降低電壓", cx, toPixY(-0.09)); }
`),
  ],
};

// ─────────────────────────────────────────────
// 導體棒切割磁力線：電磁感應
// ─────────────────────────────────────────────
const inductionHandout = String.raw`# 🔌 電磁感應：導體棒切割磁力線實驗講義

> 法拉第在 1831 年發現：只要穿過迴路的磁通量改變，迴路中就會產生電動勢。發電機、變壓器、電磁煞車，全都源自這個發現。

## 一、實驗目的

1. 觀察導體棒在均勻磁場中的平行軌道上運動時產生的感應電動勢與電流。
2. 驗證動生電動勢 $\varepsilon = B\ell v$ 與冷次定律。
3. 在固定外力下觀察導體棒達到終端速度，驗證 $v_t = \dfrac{FR}{B^2\ell^2}$。
4. 驗證能量守恆：終端速度時外力的功率全部轉為焦耳熱。

## 二、課前預報

1. 寫出法拉第定律 $\varepsilon = -d\Phi_B/dt$，並由它推導 $\varepsilon = B\ell v$。
2. 磁場垂直穿入螢幕（×），導體棒向右運動時，迴路中的感應電流是順時針還是逆時針？用冷次定律說明。
3. 推導導體棒所受的磁力 $F_B = B^2\ell^2v/R$，並說明其方向。
4. 寫出導體棒的運動方程，解出 $v(t)$，並求時間常數 $\tau = mR/(B^2\ell^2)$。
5. 預設 $F = 0.5$ N、$B = 0.8$ T、$R = 1\ \Omega$、$\ell = 0.5$ m、$m = 0.1$ kg，計算終端速度與時間常數。

## 三、實驗原理

### 1. 動生電動勢
迴路面積 $A = \ell x$，磁通量 $\Phi = B\ell x$：
$$ \varepsilon = \frac{d\Phi}{dt} = B\ell v, \qquad I = \frac{B\ell v}{R} $$

### 2. 電磁阻力（冷次定律）
電流在磁場中受力 $\vec F_B = I\vec\ell\times\vec B$，方向與運動相反：
$$ F_B = BI\ell = \frac{B^2\ell^2}{R}v $$
這就是渦電流煞車的原理。

### 3. 運動方程與終端速度
$$ m\frac{dv}{dt} = F - \frac{B^2\ell^2}{R}v \quad\Longrightarrow\quad v(t) = v_t\left(1 - e^{-t/\tau}\right) $$
$$ v_t = \frac{FR}{B^2\ell^2}, \qquad \tau = \frac{mR}{B^2\ell^2} $$

### 4. 能量守恆
終端速度時 $Fv_t = I^2R$：外力做功的功率全部變成電阻上的焦耳熱。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 外力 F | 0 至 2 N | 持續向右拉動導體棒 |
| 磁場 B | 0 至 1.5 T | 垂直穿入螢幕 |
| 電阻 R | 0.2 至 5 Ω | 軌道左端的電阻 |
| **重新開始** | | 棒回到起點並靜止 |
| **推一下（F = 0）** | | 外力設為 0、給棒 2 m/s 的初速，觀察電磁煞車 |

- 紅色箭頭標示感應電流方向；琥珀色箭頭為外力、深紅色箭頭為磁力。
- 下方左圖為速度（虛線為終端速度），右圖比較外力功率 $Fv$ 與焦耳熱功率 $I^2R$。
- 參數可在播放中調整，棒的速度會自然趨向新的終端速度。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：終端速度
| F (N) | B (T) | R (Ω) | 實測 $v_t$ (m/s) | 理論 $FR/(B^2\ell^2)$ | 時間常數 τ (s) |
|---|---|---|---|---|---|
| 0.5 | 0.8 | 1 | | | |
| 1.0 | 0.8 | 1 | | | |
| 0.5 | 1.2 | 1 | | | |
| 0.5 | 0.8 | 3 | | | |

### 步驟 B：能量守恆
在終端速度時記錄 $Fv$ 與 $I^2R$，確認兩者相等。在加速階段兩者的差距去了哪裡？

### 步驟 C：電磁煞車
按「推一下」，由 v(t) 曲線量測速度降到初速 $1/e$ 所需的時間，與 $mR/(B^2\ell^2)$ 比較；並計算棒最終滑行的總距離（理論值 $v_0\tau$）。

## 六、實驗探究問題

1. 若電阻 $R \to 0$（超導迴路），終端速度會如何？此時拉動導體棒會有什麼感覺？
2. 冷次定律為何必須有負號？若感應電流方向相反，會違反哪個定律？
3. 雲霄飛車的磁力煞車與本實驗有什麼關係？為何它不需要接觸也不會磨損？
4. 電磁煞車的阻力與速度成正比，因此「無法讓車完全停下」嗎？請用 $v(t)$ 的形式討論。
5. 把外力改為重力（軌道傾斜放置），終端速度的公式如何改變？

## 七、誤差來源與模型限制

- 忽略導體棒與軌道的電阻、摩擦，以及迴路自感（自感會讓電流變化稍有延遲）。
- 假設磁場在軌道範圍內完全均勻。

## 八、延伸挑戰

1. 加入迴路自感 L，寫出 $L\ dI/dt = B\ell v - IR$，與運動方程聯立。
2. 把外力改為週期性往返推動，觀察交流電動勢的產生（發電機原理）。
3. 讓軌道傾斜，以重力分量取代外力，模擬磁力煞車的滑梯。

## 九、延伸閱讀

- M. Faraday, *Experimental Researches in Electricity*, Series I (1831)
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. II, Ch. 17〈The Laws of Induction〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Induction and Inductance〉章
- D. J. Griffiths, *Introduction to Electrodynamics*, Ch. 7〈Electrodynamics〉
`;

const induction: ExampleDef = {
  id: 'induction',
  category: '電磁學',
  difficulty: '基礎',
  listDescription: '導體棒在磁場中沿平行軌道滑動：觀察動生電動勢 Bℓv、冷次定律的電磁阻力與終端速度 FR/(B²ℓ²)，並驗證外力功率等於焦耳熱。',
  description: inductionHandout,
  info: { title: '電磁感應：導體棒切割磁力線', author: '', keywords: '', abstract: '' },
  variables: doubles('in', [
    ['Fa', '0.5', '外力 F（N）'],
    ['Bf', '0.8', '磁場 B（T，穿入螢幕）'],
    ['Rr', '1', '電阻 R（Ω）'],
    ['mr', '0.1', '導體棒質量（kg）'],
    ['lr', '0.5', '軌道間距 ℓ（m）'],
    ['x', '0', '導體棒位置（m）'],
    ['v', '0', '導體棒速度（m/s）'],
    ['emf', '0', '感應電動勢（V）'],
    ['I', '0', '感應電流（A）'],
    ['vt', '0', '理論終端速度（m/s）'],
  ]),
  odePages: [{
    id: 'in-ode', name: '導體棒運動', method: 'RungeKutta', increment: '0.002', comment: '',
    rates: [
      { state: 'x', expression: 'v' },
      { state: 'v', expression: '(Fa - Bf * Bf * lr * lr * v / Rr) / mr' },
    ],
  }],
  constraintPages: [{
    id: 'in-con', name: '電動勢與電流', comment: '',
    code: String.raw`emf = Bf * lr * v;
I = emf / Rr;
vt = Bf > 0 ? Fa * Rr / (Bf * Bf * lr * lr) : 0;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('in-dp', 620, 420, [0, 10, 0, 10]),
    slider('in-s-F', 'Fa', 0, 2, 0.05, '外力 F (N)'),
    slider('in-s-B', 'Bf', 0, 1.5, 0.05, '磁場 B (T)'),
    slider('in-s-R', 'Rr', 0.2, 5, 0.1, '電阻 R (Ω)'),
    button('in-b-reset', '重新開始', 'x = 0; v = 0; t = 0;'),
    button('in-b-push', '推一下（F = 0）', 'Fa = 0; v = 2; t = 0;'),
    readout('in-r-v', '速度 v', 'v', { unit: 'm/s', digits: 3, color: C.amber, group: '導體棒' }),
    readout('in-r-x', '位置 x', 'x', { unit: 'm', digits: 2, color: C.amber, group: '導體棒' }),
    readout('in-r-vt', '終端速度 FR/(B²ℓ²)', 'Bf > 0 ? vt : "∞"', { unit: 'm/s', digits: 3, color: C.teal, group: '導體棒' }),
    readout('in-r-tau', '時間常數 mR/(B²ℓ²)', 'Bf > 0 ? mr * Rr / (Bf * Bf * lr * lr) : "∞"', { unit: 's', digits: 3, color: C.teal, group: '導體棒' }),
    readout('in-r-emf', '感應電動勢 ε = Bℓv', 'emf', { unit: 'V', digits: 3, color: C.red, group: '電路' }),
    readout('in-r-I', '感應電流 I', 'I', { unit: 'A', digits: 3, color: C.red, group: '電路' }),
    readout('in-r-FB', '磁力 BIℓ', 'Bf * I * lr', { unit: 'N', digits: 3, color: C.red, group: '電路' }),
    readout('in-r-phi', '磁通量 Φ = Bℓx', 'Bf * lr * x', { unit: 'Wb', digits: 3, color: C.blue, group: '電路' }),
    readout('in-r-Pm', '外力功率 Fv', 'Fa * v', { unit: 'W', digits: 3, color: C.amber, group: '能量' }),
    readout('in-r-Pj', '焦耳熱功率 I²R', 'I * I * Rr', { unit: 'W', digits: 3, color: C.red, group: '能量' }),
    customDraw('in-draw', '軌道與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var ppm = 200, x = vars.x, camX = Math.max(0, x - 0.95), top = 50, bot = top + vars.lr * ppm;
function X(wx) { return 70 + (wx - camX) * ppm; }
// 磁場區與迴路面積
ctx.fillStyle = "rgba(47,111,176,0.05)"; ctx.fillRect(0, top - 30, W, bot - top + 60);
ctx.fillStyle = "rgba(233,162,59,0.12)"; ctx.fillRect(Math.max(0, X(0)), top, X(x) - Math.max(0, X(0)), bot - top);
ctx.fillStyle = "rgba(47,111,176," + (0.15 + 0.35 * Math.min(1, vars.Bf / 1.5)).toFixed(2) + ")"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
if (vars.Bf > 0) for (var gx = Math.floor(camX / 0.25) * 0.25; X(gx) < W + 10; gx += 0.25) for (var gy = top - 15; gy < bot + 30; gy += 40) ctx.fillText("×", X(gx), gy + 20);
// 軌道與電阻
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 4;
ctx.beginPath(); ctx.moveTo(Math.max(0, X(0)), top); ctx.lineTo(W, top); ctx.moveTo(Math.max(0, X(0)), bot); ctx.lineTo(W, bot); ctx.stroke();
if (X(0) > 0) {
  ctx.lineWidth = 2; ctx.strokeStyle = "#2B2D31"; ctx.beginPath(); ctx.moveTo(X(0), top); ctx.lineTo(X(0), top + 25);
  for (var i = 1; i <= 8; i++) ctx.lineTo(X(0) + (i % 2 ? -8 : 8), top + 25 + i * ((bot - top - 50) / 8) - (bot - top - 50) / 16);
  ctx.lineTo(X(0), bot - 25); ctx.lineTo(X(0), bot); ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "right"; ctx.fillText("R", X(0) - 12, (top + bot) / 2 + 4);
} else {
  ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("← R 在 x = 0", 6, (top + bot) / 2);
}
// 導體棒
ctx.fillStyle = "#B97A1E"; ctx.fillRect(X(x) - 5, top - 10, 10, bot - top + 20);
// 感應電流（逆時針：棒上向上）
var I = vars.I;
if (Math.abs(I) > 1e-3) {
  var s = I > 0 ? 1 : -1, w = 1.5 + Math.min(3, Math.abs(I));
  arrow(X(x) + 16, (top + bot) / 2 + s * 30, X(x) + 16, (top + bot) / 2 - s * 30, "#D1495B", w);
  var mx = (Math.max(0, X(0)) + X(x)) / 2;
  arrow(mx + s * 30, top + 12, mx - s * 30, top + 12, "#D1495B", w);
  arrow(mx - s * 30, bot - 12, mx + s * 30, bot - 12, "#D1495B", w);
}
// 力
var FB = vars.Bf * I * vars.lr;
if (vars.Fa > 0) arrow(X(x) + 8, bot + 22, X(x) + 8 + vars.Fa * 60, bot + 22, "#E9A23B", 3);
if (Math.abs(FB) > 1e-3) arrow(X(x) - 8, bot + 22, X(x) - 8 - FB * 60, bot + 22, "#8B1E2D", 3);
ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#B97A1E"; ctx.fillText("F", X(x) + 12 + vars.Fa * 60, bot + 26);
ctx.fillStyle = "#8B1E2D"; ctx.textAlign = "right"; ctx.fillText("FB", X(x) - 12 - FB * 60, bot + 26);
// 圖表
var h = track("_inH", [vars.t, vars.v, vars.Fa * vars.v, I * I * vars.Rr], 4000);
var t1 = Math.max(vars.t, 5);
var vmax = Math.max(vars.vt, h.reduce(function (a, p) { return Math.max(a, p[1]); }, 0), 0.5) * 1.15;
var ser = [{ pts: h.map(function (p) { return [p[0], p[1]]; }), color: "#B97A1E", label: "v" }];
if (vars.Bf > 0 && vars.vt < vmax * 2) ser.unshift({ pts: [[0, vars.vt], [t1, vars.vt]], color: "#2A9D8F", dash: [5, 4], label: "vt" });
miniPlot({ x: 6, y: 236, w: W / 2 - 9, h: 178 }, ser, { title: "速度 v (m/s)", xlabel: "t(s)", xmin: 0, xmax: t1, ymin: 0, ymax: vmax });
var pmax = Math.max(0.1, h.reduce(function (a, p) { return Math.max(a, p[2], p[3]); }, 0)) * 1.15;
miniPlot({ x: W / 2 + 3, y: 236, w: W / 2 - 9, h: 178 }, [
  { pts: h.map(function (p) { return [p[0], p[2]]; }), color: "#E9A23B", label: "Fv" },
  { pts: h.map(function (p) { return [p[0], p[3]]; }), color: "#D1495B", label: "I²R", dash: [4, 3] },
], { title: "功率 (W)", xlabel: "t(s)", xmin: 0, xmax: t1, ymin: 0, ymax: pmax });
`),
  ],
};

const EM_EXAMPLES: ExampleDef[] = [rccircuit, efield, emratio, induction];

export default EM_EXAMPLES;

import { button, customDraw, doubles, drawingPanel, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：振動、波動與光學
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 受迫振動與共振
// ─────────────────────────────────────────────
const resonanceHandout = String.raw`# 📈 受迫振動與共振：共振曲線與相位實驗講義

> 1940 年塔科馬海峽吊橋在風中劇烈扭動而崩塌；而收音機選台、核磁共振造影、雷射腔，卻都依賴共振。共振是同一個物理，帶來截然不同的後果。

## 一、實驗目的

1. 觀察受週期外力驅動的阻尼振子，區分暫態與穩態運動。
2. 改變驅動頻率，逐點量測穩態振幅，描繪**共振曲線**並找出共振頻率。
3. 量測位移與驅動力之間的相位差，驗證它在共振時為 90°。
4. 由共振峰的寬度求出品質因子 $Q$，並與阻尼係數比較。

## 二、課前預報

1. 寫出受迫阻尼振子的運動方程，並說明通解為何是「暫態解 + 穩態解」。
2. 預設 $m = 1$、$k = 4$、$b = 0.2$、$F_0 = 1$，計算自然頻率 $\omega_0$、品質因子 $Q$，以及暫態衰減的時間常數 $2m/b$。
3. 推導穩態振幅 $A(\omega)$ 的公式，並計算 $\omega = \omega_0$ 時的振幅。
4. 驅動頻率很低（$\omega \to 0$）與很高（$\omega \to \infty$）時，振幅各趨近什麼？相位差呢？
5. 為何量測穩態振幅前必須「等一下」？大約要等多久？

## 三、實驗原理

### 1. 運動方程
$$ m\ddot x + b\dot x + kx = F_0\cos\omega t $$

### 2. 穩態解
穩態時 $x(t) = A\cos(\omega t - \delta)$，其中
$$ A(\omega) = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + (b\omega/m)^2}}, \qquad \tan\delta = \frac{b\omega/m}{\omega_0^2 - \omega^2} $$
$\delta$ 是位移落後驅動力的相角，介於 0 與 $\pi$ 之間。

### 3. 共振頻率與品質因子
振幅最大發生在 $\omega_r = \sqrt{\omega_0^2 - b^2/(2m^2)}$，阻尼小時 $\omega_r \approx \omega_0$。品質因子
$$ Q = \frac{m\omega_0}{b} \approx \frac{\omega_0}{\Delta\omega} $$
其中 $\Delta\omega$ 為功率共振曲線的半高全寬（振幅曲線降到峰值 $1/\sqrt2$ 處的寬度）。

### 4. 相位的三個區域
| 驅動頻率 | 相位差 δ | 物理圖像 |
|---|---|---|
| $\omega \ll \omega_0$ | ≈ 0 | 彈力主導，質點跟著力走 |
| $\omega = \omega_0$ | 90° | 力與速度同相，持續做正功 |
| $\omega \gg \omega_0$ | ≈ 180° | 慣性主導，質點與力反向 |

## 四、模擬器操作說明

| 控制項 | 說明 |
|---|---|
| 驅動角頻率 ω | 0.2 至 4 rad/s |
| 阻尼係數 b | 0.05 至 2 kg/s |
| **記錄此點** | 把目前的 (ω, 實測振幅) 加到共振曲線圖上 |
| **清除紀錄** | 清除所有記錄點 |

- 左上：彈簧振子，紅色箭頭為驅動力。左下：位移 $x$ 與 $F/k$（力換算成等效位移）的時間圖。
- 右上：理論共振曲線（灰線）與你記錄的點；右下：相位差曲線與目前實測相位。
- 「實測振幅」每經過一個驅動週期更新一次。改變 ω 後請等待暫態消失（約 $3 \times 2m/b$）再記錄。

## 五、實驗步驟與數據記錄

### 步驟 A：觀察暫態
設 ω = 1.0，從靜止開始，觀察 x(t) 波形何時變成單一頻率的穩定振盪。

### 步驟 B：共振曲線（b = 0.2）
| ω (rad/s) | 0.5 | 1.0 | 1.5 | 1.8 | 1.9 | 2.0 | 2.1 | 2.2 | 2.5 | 3.0 | 3.5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 實測 A (m) | | | | | | | | | | | |
| 實測 δ (°) | | | | | | | | | | | |

由曲線找出共振頻率與半高寬，計算 $Q = \omega_0/\Delta\omega$，與 $m\omega_0/b$ 比較。

### 步驟 C：阻尼對共振的影響
| b | 共振峰振幅 | 半高寬 Δω | Q |
|---|---|---|---|
| 0.1 | | | |
| 0.2 | | | |
| 0.5 | | | |
| 1.0 | | | |

## 六、實驗探究問題

1. 為何共振時相位差恰為 90°？從「力對質點做功的功率 $F\cdot v$」的觀點解釋。
2. 若阻尼趨近零，共振振幅會如何？真實系統中有什麼因素限制了振幅？
3. 收音機的調諧電路希望 $Q$ 大還是小？汽車避震系統呢？
4. 軍隊過橋時為何要求「便步走」？
5. 共振曲線在 $\omega \to 0$ 時趨近 $F_0/k$，請從物理上解釋。

## 七、誤差來源與模型限制

- 實測振幅取每個驅動週期內的最大 $\lvert x\rvert$，若暫態未消失會高估或低估。
- 線性彈簧與線性阻尼為理想化；大振幅時真實彈簧的非線性會讓共振曲線傾斜（Duffing 效應）。

## 八、延伸挑戰

1. 改為驅動彈簧的另一端（位移驅動），比較共振曲線的形狀差異。
2. 加入非線性項 $-\beta x^3$，觀察共振曲線的「跳躍」與遲滯現象。
3. 對照「RLC 串聯電路」：寫出 $L$、$R$、$C$、電動勢與 $m$、$b$、$k$、$F$ 的對應關係。

## 九、延伸閱讀

- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 23〈Resonance〉
- J. R. Taylor, *Classical Mechanics*, Ch. 5〈Oscillations〉5.5–5.7 節
- A. P. French, *Vibrations and Waves*, Ch. 4〈Forced Vibrations and Resonance〉
- K. Y. Billah, R. H. Scanlan, "Resonance, Tacoma Narrows bridge failure, and undergraduate physics textbooks", *American Journal of Physics* 59, 118 (1991)
`;

const resonance: ExampleDef = {
  id: 'resonance',
  category: '振動與波動',
  difficulty: '基礎',
  listDescription: '以週期外力驅動阻尼振子，逐點記錄穩態振幅畫出共振曲線，同時量測位移落後驅動力的相位差，在共振時恰為 90°。',
  description: resonanceHandout,
  info: { title: '受迫振動與共振', author: '', keywords: '', abstract: '' },
  variables: doubles('rs', [
    ['m', '1', '質量（kg）'],
    ['k', '4', '彈簧常數（N/m）'],
    ['b', '0.2', '阻尼係數（kg/s）'],
    ['F0', '1', '驅動力振幅（N）'],
    ['wd', '1.5', '驅動角頻率 ω（rad/s）'],
    ['x', '0', '位移（m）'],
    ['v', '0', '速度（m/s）'],
    ['Ameas', '0', '實測穩態振幅（m，每週期更新）'],
    ['dMeas', '0', '實測相位差 δ（rad）'],
  ]),
  odePages: [{
    id: 'rs-ode', name: '受迫阻尼振子', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x', expression: 'v' },
      { state: 'v', expression: '(-k * x - b * v + F0 * Math.cos(wd * t)) / m' },
    ],
  }],
  constraintPages: [{
    id: 'rs-con', name: '量測振幅與相位', comment: '每個驅動週期取最大位移；位移達極大時量相位',
    code: String.raw`if (!_v._pts) _v._pts = [];
var cyc = Math.floor(t * wd / (2 * Math.PI));
if (_v._cyc === undefined) { _v._cyc = cyc; _v._mx = 0; _v._vp = 0; }
if (cyc !== _v._cyc) { Ameas = _v._mx; _v._mx = 0; _v._cyc = cyc; }
if (Math.abs(x) > _v._mx) _v._mx = Math.abs(x);
// 速度由正變負 → 位移極大；與驅動力極大（ωt = 2πn）的相位差
if (_v._vp > 0 && v <= 0 && x > 0) {
  var ph = (wd * t) % (2 * Math.PI);
  dMeas = ph;
}
_v._vp = v;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rs-dp', 620, 420, [0, 10, 0, 10]),
    slider('rs-s-w', 'wd', 0.2, 4, 0.02, '驅動角頻率 ω (rad/s)'),
    slider('rs-s-b', 'b', 0.05, 2, 0.05, '阻尼係數 b'),
    button('rs-b-rec', '記錄此點', '_v._pts = (_v._pts || []).concat([[wd, Ameas, dMeas]]);'),
    button('rs-b-clr', '清除紀錄', '_v._pts = [];'),
    customDraw('rs-draw', '共振實驗繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var m = vars.m, k = vars.k, b = vars.b, F0 = vars.F0, wd = vars.wd;
var w0 = Math.sqrt(k / m);
function Ath(w) { return (F0 / m) / Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(b * w / m, 2)); }
function dth(w) { return Math.atan2(b * w / m, w0 * w0 - w * w); }
var Apk = Ath(Math.sqrt(Math.max(w0 * w0 - b * b / (2 * m * m), 0.01)));
// ── 左上：彈簧振子 ──
var LW = 300, eq = 170, sc = Math.min(45, 110 / Math.max(Apk, 0.5)), my = 95;
var xp = eq + vars.x * sc;
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(10, my - 40, 10, 80);
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2; ctx.beginPath();
for (var i = 0; i <= 60; i++) { var s = i / 60, px = 20 + s * (xp - 20 - 18), py = my + (i > 2 && i < 58 ? Math.sin(s * 16 * Math.PI) * 9 : 0); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
ctx.stroke();
ctx.strokeStyle = "#E5E1D8"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(eq, my - 45); ctx.lineTo(eq, my + 45); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.fillRect(xp - 18, my - 18, 36, 36); ctx.strokeRect(xp - 18, my - 18, 36, 36);
var F = F0 * Math.cos(wd * vars.t);
arrow(xp, my - 28, xp + F * 40, my - 28, "#D1495B", 2.5);
ctx.fillStyle = "#D1495B"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("F(t)", xp + F * 40 + 4, my - 32);
var Q = m * w0 / b;
infoBox(8, 150, [
  "ω0 = " + w0.toFixed(3) + "   Q = " + Q.toFixed(1),
  "ω/ω0 = " + (wd / w0).toFixed(3),
  ["實測 A = " + vars.Ameas.toFixed(3) + " m", "#2F6FB0"],
  ["理論 A = " + Ath(wd).toFixed(3) + " m", "#6B6F76"],
  ["實測 δ = " + (vars.dMeas * 180 / Math.PI).toFixed(1) + "°  理論 " + (dth(wd) * 180 / Math.PI).toFixed(1) + "°", "#2A9D8F"],
  "暫態時間常數 2m/b = " + (2 * m / b).toFixed(1) + " s",
], { font: "11px monospace", lh: 15, w: 284 });
// ── 左下：x(t) 與 F/k ──
var hx = track("_rsx", [vars.t, vars.x, F / k], 1500);
var t1 = Math.max(vars.t, 20), t0 = t1 - 20;
var vis = hx.filter(function (p) { return p[0] >= t0; });
var yl = Math.max(Apk, F0 / k) * 1.15;
miniPlot({ x: 6, y: 262, w: LW - 6, h: 152 }, [
  { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "x" },
  { pts: vis.map(function (p) { return [p[0], p[2]]; }), color: "#D1495B", label: "F/k", width: 1.2 },
], { title: "位移與驅動力", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -yl, ymax: yl });
// ── 右上：共振曲線 ──
var pts = vars._pts || [];
var curve = [], ph = [];
for (var j = 0; j <= 160; j++) { var w = 0.05 + j * 3.95 / 160; curve.push([w, Ath(w)]); ph.push([w, dth(w) * 180 / Math.PI]); }
var g1 = miniPlot({ x: LW + 6, y: 6, w: W - LW - 12, h: 236 }, [
  { pts: curve, color: "#9AA0A6", label: "理論 A(ω)" },
  { pts: [], dots: pts.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "記錄點" },
], { title: "共振曲線：振幅 A (m)", xlabel: "ω", xmin: 0, xmax: 4, ymin: 0, ymax: Apk * 1.15 });
ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
ctx.beginPath(); ctx.moveTo(g1.px(wd), 26); ctx.lineTo(g1.px(wd), 224); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g1.px(wd), g1.py(Math.min(vars.Ameas, Apk * 1.15)), 4, 0, 2 * Math.PI); ctx.fill();
// ── 右下：相位曲線 ──
var g2 = miniPlot({ x: LW + 6, y: 248, w: W - LW - 12, h: 166 }, [
  { pts: ph, color: "#9AA0A6", label: "理論 δ(ω)" },
  { pts: [], dots: pts.map(function (p) { return [p[0], p[2] * 180 / Math.PI]; }), color: "#2A9D8F", label: "記錄點" },
], { title: "相位差 δ (°)", xlabel: "ω", xmin: 0, xmax: 4, ymin: 0, ymax: 180 });
ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g2.px(wd), g2.py(vars.dMeas * 180 / Math.PI), 4, 0, 2 * Math.PI); ctx.fill();
`),
  ],
};

// ─────────────────────────────────────────────
// 耦合擺：正規模態與拍
// ─────────────────────────────────────────────
const coupledHandout = String.raw`# 🔗 耦合擺：正規模態與能量交換（拍）實驗講義

> 兩個用彈簧連接的單擺，只拉動其中一個，能量會在兩擺之間來回傳遞。這個簡單的系統是分子振動、晶格聲子、甚至微中子振盪的共同數學模型。

## 一、實驗目的

1. 找出耦合擺的兩個**正規模態**（同相與反相），量測其頻率。
2. 觀察只拉一擺時的**拍**現象與能量交換，驗證拍頻 $\omega_2 - \omega_1$。
3. 探討耦合強度對模態頻率與能量交換週期的影響。

## 二、課前預報

1. 寫出兩擺的運動方程（小角度、以水平位移 $x_1$、$x_2$ 表示）。
2. 定義 $q_\pm = x_1 \pm x_2$，證明 $q_+$、$q_-$ 各自做簡諧運動，並求出它們的角頻率。
3. 預設 $L = 1$ m、$m = 1$ kg、$\kappa = 0.5$ N/m，計算 $\omega_1$、$\omega_2$ 與能量完全轉移所需時間 $\pi/(\omega_2 - \omega_1)$。
4. 三角恆等式 $\cos A + \cos B = 2\cos\frac{A - B}{2}\cos\frac{A + B}{2}$ 與拍有什麼關係？

## 三、實驗原理

### 1. 運動方程
$$ m\ddot x_1 = -\frac{mg}{L}x_1 - \kappa(x_1 - x_2), \qquad m\ddot x_2 = -\frac{mg}{L}x_2 - \kappa(x_2 - x_1) $$

### 2. 正規模態
| 模態 | 運動方式 | 角頻率 |
|---|---|---|
| 同相 $q_+ = x_1 + x_2$ | 兩擺一起擺，彈簧不伸縮 | $\omega_1 = \sqrt{g/L}$ |
| 反相 $q_- = x_1 - x_2$ | 兩擺相向擺，彈簧伸縮 | $\omega_2 = \sqrt{g/L + 2\kappa/m}$ |

任何運動都是兩個正規模態的疊加。

### 3. 拍與能量交換
初始 $x_1 = A$、$x_2 = 0$ 時：
$$ x_1 = A\cos\frac{(\omega_2 - \omega_1)t}{2}\cos\frac{(\omega_2 + \omega_1)t}{2}, \qquad x_2 = A\sin\frac{(\omega_2 - \omega_1)t}{2}\sin\frac{(\omega_2 + \omega_1)t}{2} $$
振幅包絡以 $(\omega_2 - \omega_1)/2$ 緩慢變化，能量在 $\Delta t = \pi/(\omega_2 - \omega_1)$ 內由擺 1 完全轉移到擺 2。

## 四、模擬器操作說明

| 控制項 | 說明 |
|---|---|
| 耦合強度 κ | 彈簧常數 0.05 至 3 N/m |
| **只拉擺 1** | $x_1 = 0.15$、$x_2 = 0$ 釋放，觀察拍 |
| **同相模態** | $x_1 = x_2 = 0.15$ |
| **反相模態** | $x_1 = 0.15$、$x_2 = -0.15$ |

下方左圖為 $x_1$、$x_2$ 對時間；右圖為兩擺各自的能量 $E_i = \frac12 mv_i^2 + \frac12\frac{mg}{L}x_i^2$。

## 五、實驗步驟與數據記錄

### 步驟 A：正規模態頻率
分別按「同相模態」與「反相模態」，量 10 個週期的時間：

| κ (N/m) | 同相 $T_1$ (s) | 反相 $T_2$ (s) | 理論 $T_1$ | 理論 $T_2$ |
|---|---|---|---|---|
| 0.2 | | | | |
| 0.5 | | | | |
| 1.0 | | | | |
| 2.0 | | | | |

### 步驟 B：能量交換週期
按「只拉擺 1」，量測能量從擺 1 完全轉移到擺 2 所需時間 $\Delta t$：

| κ (N/m) | 實測 $\Delta t$ (s) | 理論 $\pi/(\omega_2 - \omega_1)$ | 誤差 |
|---|---|---|---|
| 0.2 | | | |
| 0.5 | | | |
| 1.0 | | | |

以 $1/\Delta t$ 對 κ 作圖，在弱耦合時應近似線性，請說明原因。

## 六、實驗探究問題

1. 同相模態的頻率為何與 κ 無關？
2. 弱耦合時 $\omega_2 - \omega_1 \approx \kappa/(m\omega_1)$，請推導。這說明為何弱耦合時能量交換很慢。
3. 若兩擺長度不同（「失諧」），能量還能完全轉移嗎？請修改模型驗證。
4. 二氧化碳分子 O=C=O 有哪些振動模態？與本實驗有何相似之處？
5. 把 N 個擺串起來會得到什麼？它與弦上的波有何關聯？

## 七、誤差來源與模型限制

- 小角度近似：擺幅大時頻率會略降，且兩個模態會彼此耦合。
- 假設彈簧水平且只在水平方向施力；真實裝置中彈簧連接點的高度會影響等效耦合強度。

## 八、延伸挑戰

1. 讓擺 2 的長度可調，研究失諧對能量交換比例的影響（與量子力學的拉比振盪類比）。
2. 擴充為三個耦合擺，找出三個正規模態。
3. 加入微小阻尼，觀察拍的包絡如何衰減。

## 九、延伸閱讀

- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 49〈Modes〉
- J. R. Taylor, *Classical Mechanics*, Ch. 11〈Coupled Oscillators and Normal Modes〉
- A. P. French, *Vibrations and Waves*, Ch. 5〈Coupled Oscillators and Normal Modes〉
- H. J. Pain, *The Physics of Vibrations and Waves*, Ch. 4〈Coupled Oscillations〉
`;

const coupled: ExampleDef = {
  id: 'coupled',
  category: '振動與波動',
  difficulty: '進階',
  listDescription: '兩個以彈簧耦合的單擺：一鍵切換同相、反相正規模態或只拉一擺，觀察拍現象與能量在兩擺之間來回轉移。',
  description: coupledHandout,
  info: { title: '耦合擺：正規模態與拍', author: '', keywords: '', abstract: '' },
  variables: doubles('cp', [
    ['g', '9.8', '重力加速度'],
    ['Lc', '1', '擺長（m）'],
    ['m', '1', '擺錘質量（kg）'],
    ['kc', '0.5', '耦合彈簧常數 κ（N/m）'],
    ['x1', '0.15', '擺 1 水平位移（m）'], ['v1', '0', '擺 1 速度'],
    ['x2', '0', '擺 2 水平位移（m）'], ['v2', '0', '擺 2 速度'],
  ]),
  odePages: [{
    id: 'cp-ode', name: '耦合擺方程（小角度）', method: 'RungeKutta', increment: '0.005', comment: '',
    rates: [
      { state: 'x1', expression: 'v1' },
      { state: 'v1', expression: '-(g / Lc) * x1 - (kc / m) * (x1 - x2)' },
      { state: 'x2', expression: 'v2' },
      { state: 'v2', expression: '-(g / Lc) * x2 - (kc / m) * (x2 - x1)' },
    ],
  }],
  constraintPages: [],
  initPages: [],
  viewElements: [
    drawingPanel('cp-dp', 600, 440, [0, 10, 0, 10]),
    slider('cp-s-k', 'kc', 0.05, 3, 0.05, '耦合強度 κ (N/m)'),
    button('cp-b-beat', '只拉擺 1（拍）', 'x1 = 0.15; x2 = 0; v1 = 0; v2 = 0; t = 0;'),
    button('cp-b-in', '同相模態', 'x1 = 0.15; x2 = 0.15; v1 = 0; v2 = 0; t = 0;'),
    button('cp-b-out', '反相模態', 'x1 = 0.15; x2 = -0.15; v1 = 0; v2 = 0; t = 0;'),
    customDraw('cp-draw', '耦合擺繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var g = vars.g, Lc = vars.Lc, m = vars.m, kc = vars.kc;
var Lpx = 150, sep = 150, cx = W / 2 - 60, topY = 30;
var p1x = cx - sep / 2, p2x = cx + sep / 2;
var a1 = Math.asin(Math.max(-1, Math.min(1, vars.x1 / Lc))), a2 = Math.asin(Math.max(-1, Math.min(1, vars.x2 / Lc)));
var b1x = p1x + Lpx * Math.sin(a1) * 2.5, b1y = topY + Lpx * Math.cos(a1);
var b2x = p2x + Lpx * Math.sin(a2) * 2.5, b2y = topY + Lpx * Math.cos(a2);
ctx.fillStyle = "#6B6F76"; ctx.fillRect(p1x - 40, topY - 8, sep + 80, 8);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(p1x, topY); ctx.lineTo(b1x, b1y); ctx.moveTo(p2x, topY); ctx.lineTo(b2x, b2y); ctx.stroke();
// 耦合彈簧（連接兩擺擺錘）
ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 1.8; ctx.beginPath();
var sx0 = b1x + 14, sx1 = b2x - 14, sy0 = b1y, sy1 = b2y;
for (var i = 0; i <= 80; i++) {
  var s = i / 80, px = sx0 + s * (sx1 - sx0), py = sy0 + s * (sy1 - sy0) + (i > 4 && i < 76 ? Math.sin(s * 22 * Math.PI) * 7 : 0);
  if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
}
ctx.stroke();
function bob(x, y, f, e, label) {
  ctx.fillStyle = f; ctx.strokeStyle = e; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 14, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, x, y + 4);
}
bob(b1x, b1y, "#E6EEF7", "#2F6FB0", "1");
bob(b2x, b2y, "#F9E3E6", "#D1495B", "2");
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("（水平位移放大 2.5 倍顯示）", cx, b1y + 34);
var w1 = Math.sqrt(g / Lc), w2 = Math.sqrt(g / Lc + 2 * kc / m);
infoBox(W - 8, 8, [
  "同相 ω1 = " + w1.toFixed(4) + " rad/s",
  "反相 ω2 = " + w2.toFixed(4) + " rad/s",
  "T1 = " + (2 * Math.PI / w1).toFixed(3) + " s   T2 = " + (2 * Math.PI / w2).toFixed(3) + " s",
  ["能量完全轉移 π/(ω2-ω1) = " + (Math.PI / (w2 - w1)).toFixed(2) + " s", "#2A9D8F"],
  "t = " + vars.t.toFixed(2) + " s",
], { right: true, font: "11px monospace", lh: 15 });
// 歷史數據
var E1 = 0.5 * m * vars.v1 * vars.v1 + 0.5 * m * (g / Lc) * vars.x1 * vars.x1;
var E2 = 0.5 * m * vars.v2 * vars.v2 + 0.5 * m * (g / Lc) * vars.x2 * vars.x2;
var h = track("_cph", [vars.t, vars.x1, vars.x2, E1, E2], 2400);
var tw = Math.max(20, Math.min(60, 2.2 * Math.PI / (w2 - w1)));
var t1 = Math.max(vars.t, tw), t0 = t1 - tw;
var vis = h.filter(function (p) { return p[0] >= t0; });
var col = function (j) { return vis.map(function (p) { return [p[0], p[j]]; }); };
miniPlot({ x: 6, y: 236, w: W / 2 - 9, h: 198 }, [
  { pts: col(1), color: "#2F6FB0", label: "x1", width: 1.2 },
  { pts: col(2), color: "#D1495B", label: "x2", width: 1.2 },
], { title: "位移 x (m)", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: -0.18, ymax: 0.18 });
var Emax = 0.5 * m * (g / Lc) * 0.15 * 0.15 * 2.2;
miniPlot({ x: W / 2 + 3, y: 236, w: W / 2 - 9, h: 198 }, [
  { pts: col(3), color: "#2F6FB0", label: "E1" },
  { pts: col(4), color: "#D1495B", label: "E2" },
], { title: "各擺能量 E (J)", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: 0, ymax: Emax });
`),
  ],
};

// ─────────────────────────────────────────────
// 弦上駐波（Melde 實驗）
// ─────────────────────────────────────────────
const standingHandout = String.raw`# 🎸 弦上駐波：Melde 實驗講義

> 1859 年 Franz Melde 把細線一端接在音叉上、另一端繞過滑輪掛上砝碼，觀察到穩定的駐波圖樣。改變砝碼或頻率，弦上「段數」就會改變——這是測量波速與驗證 $v = \sqrt{T/\mu}$ 的經典實驗。

## 一、實驗目的

1. 觀察由振盪器驅動、另一端固定的弦上形成的駐波，辨認波節與波腹。
2. 找出各個共振頻率 $f_n$，驗證 $f_n = n\ v/(2L)$。
3. 改變張力，驗證弦波速度 $v = \sqrt{T/\mu}$。

## 二、課前預報

1. 寫出兩列振幅相同、方向相反的行進波疊加的結果，說明為何會出現固定不動的波節。
2. 兩端固定、長 $L$ 的弦，可容許的波長有哪些？對應頻率為何？
3. 本模擬中 $L = 1$ m、線密度 $\mu = 0.1$ kg/m。若張力 $T = 0.4$ N，求波速與前三個共振頻率。
4. 若要讓第 3 諧振頻率變為原來的 2 倍，張力應變為幾倍？
5. 為何驅動端的振幅很小，弦中央卻能振得很大？

## 三、實驗原理

### 1. 波動方程與波速
弦的小振幅橫波滿足
$$ \frac{\partial^2 y}{\partial t^2} = v^2\frac{\partial^2 y}{\partial x^2}, \qquad v = \sqrt{\frac{T}{\mu}} $$

### 2. 駐波與共振條件
入射波與反射波疊加：
$$ y = 2A\sin kx\cos\omega t $$
相鄰波節距離為 $\lambda/2$。兩端（近似）固定時 $L = n\lambda/2$，共振頻率
$$ f_n = \frac{n v}{2L} = \frac{n}{2L}\sqrt{\frac{T}{\mu}}, \qquad n = 1, 2, 3, \ldots $$

### 3. 數值方法
模擬把弦分成 80 段，以有限差分法（leapfrog）求解波動方程：
$$ y_i^{n+1} = 2y_i^n - y_i^{n-1} + r^2\left(y_{i+1}^n - 2y_i^n + y_{i-1}^n\right), \qquad r = \frac{v\ \Delta t}{\Delta x} $$
穩定條件為 $r \le 1$（CFL 條件）。另加入小阻尼 γ 模擬空氣阻力，讓振幅能達到穩態。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 驅動頻率 f | 0.2 至 6 Hz | 左端振盪器頻率 |
| 張力 T | 0.1 至 1.6 N | 右端掛重提供（$T = Mg$） |
| **記錄此點** | | 把 (f, 最大振幅) 記錄到下方圖表 |
| **清除紀錄** | | |

- 灰色陰影為最近約 1.5 秒的振幅包絡，可清楚看出波節與波腹。
- 下方圖表的紅色虛線為理論共振頻率 $f_n$。

## 五、實驗步驟與數據記錄

### 步驟 A：尋找共振頻率（T = 0.4 N）
緩慢調整 f，記錄振幅出現極大時的頻率與段數：

| 段數 n | 實測 $f_n$ (Hz) | 理論 $f_n$ (Hz) | 相鄰波節距離 (m) | 推得 $v = 2Lf_n/n$ |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

### 步驟 B：張力與波速
固定在第 2 諧振（n = 2），改變張力並重新尋找共振頻率：

| T (N) | $f_2$ (Hz) | $v = Lf_2$ (m/s) | $v^2$ | $\sqrt{T/\mu}$ |
|---|---|---|---|---|
| 0.2 | | | | |
| 0.4 | | | | |
| 0.8 | | | | |
| 1.6 | | | | |

以 $v^2$ 對 $T$ 作圖，由斜率求出 $\mu$。

### 步驟 C：共振曲線
在第 1 與第 2 諧振附近每隔 0.05 Hz 按「記錄此點」，畫出振幅對頻率的共振峰。

## 六、實驗探究問題

1. 在非共振頻率時，弦上是否仍有波？為何振幅很小？
2. 吉他弦按住琴格會改變哪個物理量？調音鈕又改變哪個？
3. 驅動端其實並非真正的波節，這對共振頻率有什麼微小影響？
4. 為什麼共振峰會有寬度？阻尼增加時寬度如何變化？
5. Melde 實驗中若振盪器振動方向改為沿著弦（縱向驅動），弦振動的頻率會變為驅動頻率的一半，請查閱原因。

## 七、誤差來源與模型限制

- 分段數有限（80 段），高諧振（n 大）時每個波長的取樣點變少，數值色散會使頻率略為偏低。
- 假設小振幅、張力均勻、弦完全柔軟；真實的弦有剛性，高頻時會出現非諧和泛音。

## 八、延伸挑戰

1. 把右端改為「自由端」（$y_N = y_{N-1}$），觀察共振條件變為 $L = (2n - 1)\lambda/4$。
2. 讓左半段與右半段的線密度不同，觀察界面處的反射與透射。
3. 以「撥弦」初始條件（三角形）取代驅動，觀察各諧波的疊加並做傅立葉分析。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Waves—I〉章：駐波與共振
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 49〈Modes〉
- N. Giordano, H. Nakanishi, *Computational Physics*（2nd ed.），Ch. 6〈Waves〉
- PhET 互動模擬〈Wave on a String〉：phet.colorado.edu
`;

const standingwave: ExampleDef = {
  id: 'standingwave',
  category: '振動與波動',
  difficulty: '基礎',
  listDescription: '以有限差分法解弦的波動方程：左端振盪器驅動、右端繞過滑輪掛重。調整頻率與張力找出 fₙ = n√(T/μ)/2L 的駐波共振。',
  description: standingHandout,
  info: { title: '弦上駐波（Melde 實驗）', author: '', keywords: '', abstract: '' },
  variables: doubles('sw', [
    ['f', '1.0', '驅動頻率（Hz）'],
    ['Ten', '0.4', '張力 T（N）'],
    ['mu', '0.1', '線密度 μ（kg/m）'],
    ['Ls', '1', '弦長（m）'],
    ['Ad', '0.004', '驅動端振幅（m）'],
    ['gam', '0.4', '阻尼係數 γ（1/s）'],
    ['tau', '0', '計時用（無物理意義）'],
    ['cw', '0', '波速 √(T/μ)（m/s）'],
    ['Amax', '0', '弦上最大振幅（m）'],
  ]),
  odePages: [{
    id: 'sw-ode', name: '時間推進', method: 'Euler', increment: '0.002', comment: '弦的運動在約束頁以有限差分法求解',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'sw-con', name: '波動方程（有限差分）', comment: '',
    code: String.raw`var N = 80;
if (!_v._pts) _v._pts = [];
if (!_v._y || _v._y.length !== N + 1) {
  _v._y = new Float64Array(N + 1); _v._yo = new Float64Array(N + 1); _v._env = new Float64Array(N + 1);
  _v._lt = t;
}
cw = Math.sqrt(Ten / mu);
// 約束頁在每步前後各執行一次，只在時間前進時推進
if (t > _v._lt) {
  var dtp = t - _v._lt;
  _v._lt = t;
  var dx = Ls / N;
  var nsub = Math.max(1, Math.ceil(cw * dtp / dx / 0.9)), hh = dtp / nsub;
  var r2 = (cw * hh / dx) * (cw * hh / dx);
  var y = _v._y, yo = _v._yo, nw = new Float64Array(N + 1);
  for (var s = 0; s < nsub; s++) {
    var ts = t - dtp + (s + 1) * hh;
    for (var i = 1; i < N; i++) {
      nw[i] = 2 * y[i] - yo[i] + r2 * (y[i + 1] - 2 * y[i] + y[i - 1]) - gam * hh * (y[i] - yo[i]);
    }
    nw[0] = Ad * Math.sin(2 * Math.PI * f * ts);
    nw[N] = 0;
    for (var j = 0; j <= N; j++) { yo[j] = y[j]; y[j] = nw[j]; }
  }
  var env = _v._env, dec = Math.exp(-dtp / 1.5), mx = 0;
  for (var q = 0; q <= N; q++) {
    env[q] = Math.max(Math.abs(y[q]), env[q] * dec);
    if (env[q] > mx) mx = env[q];
  }
  Amax = mx;
} else if (t < _v._lt) {
  _v._lt = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('sw-dp', 620, 420, [0, 10, 0, 10]),
    slider('sw-s-f', 'f', 0.2, 6, 0.01, '驅動頻率 f (Hz)'),
    slider('sw-s-T', 'Ten', 0.1, 1.6, 0.05, '張力 T (N)'),
    button('sw-b-rec', '記錄此點', '_v._pts = (_v._pts || []).concat([[f, Amax]]);'),
    button('sw-b-clr', '清除紀錄', '_v._pts = [];'),
    customDraw('sw-draw', '弦與共振圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var y = vars._y, env = vars._env, N = y ? y.length - 1 : 80;
var x0 = 70, x1 = W - 90, cy = 120;
var Ls = vars.Ls, cw = Math.sqrt(vars.Ten / vars.mu);
// 自動縮放（平滑）
var target = Math.max(0.01, vars.Amax * 1.15);
vars._swS = vars._swS ? vars._swS + (target - vars._swS) * 0.05 : target;
var ys = 85 / vars._swS;
function X(i) { return x0 + (i / N) * (x1 - x0); }
// 振盪器
ctx.fillStyle = "#6B6F76"; ctx.fillRect(16, cy - 30, 40, 60);
ctx.fillStyle = "#FFFDF8"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("振盪器", 36, cy + 4);
// 滑輪與掛重
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(x1 + 14, cy + 14, 14, 0, 2 * Math.PI); ctx.stroke();
ctx.beginPath(); ctx.moveTo(x1 + 28, cy + 14); ctx.lineTo(x1 + 28, cy + 70); ctx.stroke();
var Mg = vars.Ten / 9.8;
ctx.fillStyle = "#E9A23B"; ctx.fillRect(x1 + 14, cy + 70, 28, 26);
ctx.fillStyle = "#2B2D31"; ctx.font = "10px monospace"; ctx.fillText((Mg * 1000).toFixed(0) + " g", x1 + 28, cy + 110);
// 包絡
if (env) {
  ctx.fillStyle = "rgba(47,111,176,0.12)"; ctx.beginPath();
  for (var i = 0; i <= N; i++) { if (i) ctx.lineTo(X(i), cy - env[i] * ys); else ctx.moveTo(X(i), cy - env[i] * ys); }
  for (var j = N; j >= 0; j--) ctx.lineTo(X(j), cy + env[j] * ys);
  ctx.closePath(); ctx.fill();
}
ctx.strokeStyle = "#E5E1D8"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke(); ctx.setLineDash([]);
// 弦
if (y) {
  ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 2.2; ctx.beginPath();
  for (var k = 0; k <= N; k++) { if (k) ctx.lineTo(X(k), cy - y[k] * ys); else ctx.moveTo(X(k), cy - y[k] * ys); }
  ctx.stroke();
}
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(X(N), cy, 3, 0, 2 * Math.PI); ctx.fill();
// 讀數
var fn = vars.f * 2 * Ls / cw;
infoBox(x0, 6, [
  "v = √(T/μ) = " + cw.toFixed(3) + " m/s   λ = v/f = " + (cw / vars.f).toFixed(3) + " m",
  "2Lf/v = " + fn.toFixed(2) + "（整數時共振）   最大振幅 " + (vars.Amax * 100).toFixed(2) + " cm",
], { font: "11px monospace", lh: 15 });
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillText("縱向放大顯示（滿刻度 ≈ " + (vars._swS * 100).toFixed(1) + " cm）", x0, cy + 104);
// 共振紀錄圖
var pts = vars._pts || [];
var amax = Math.max(0.02, pts.reduce(function (a, p) { return Math.max(a, p[1]); }, 0) * 1.15, vars.Amax * 1.15);
var g1 = miniPlot({ x: 8, y: 236, w: W - 16, h: 178 }, [
  { pts: [], dots: pts, color: "#2F6FB0", label: "記錄點 (f, 最大振幅)" },
], { title: "共振紀錄：最大振幅 (m) 對頻率", xlabel: "f(Hz)", xmin: 0, xmax: 6, ymin: 0, ymax: amax });
ctx.save(); ctx.strokeStyle = "rgba(209,73,91,0.6)"; ctx.setLineDash([4, 4]); ctx.fillStyle = "#D1495B"; ctx.font = "10px monospace"; ctx.textAlign = "center";
for (var n = 1; n * cw / (2 * Ls) <= 6; n++) {
  var fx = g1.px(n * cw / (2 * Ls));
  ctx.beginPath(); ctx.moveTo(fx, 256); ctx.lineTo(fx, 396); ctx.stroke(); ctx.fillText("f" + n, fx, 254);
}
ctx.restore();
ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g1.px(vars.f), g1.py(Math.min(vars.Amax, amax)), 4, 0, 2 * Math.PI); ctx.fill();
`),
  ],
};

// ─────────────────────────────────────────────
// 都卜勒效應與震波
// ─────────────────────────────────────────────
const dopplerHandout = String.raw`# 🚑 都卜勒效應與震波實驗講義

> 救護車迎面而來時警笛聲變尖、遠去時變沉——1842 年都卜勒（Christian Doppler）提出這個效應，三年後白貝羅（Buys Ballot）請樂手站在行駛的火車上吹奏，證實了它。

## 一、實驗目的

1. 以波前圖觀察移動波源造成的波長壓縮與拉長。
2. 量測不同位置觀察者聽到的頻率，驗證都卜勒公式。
3. 觀察波源速度超過波速時形成的**馬赫錐**（震波），驗證 $\sin\alpha = 1/M$。

## 二、課前預報

1. 波源以速度 $v_s$ 朝靜止觀察者前進，推導觀察者聽到的頻率 $f' = f_0\dfrac{v}{v - v_s}$。
2. 波源遠離時公式如何改變？若是觀察者移動、波源靜止，公式是否相同？
3. 本模擬波速 $v = 2$、頻率 $f_0 = 1$（任意單位）。若馬赫數 $M = v_s/v = 0.5$，前方與後方觀察者聽到的頻率各是多少？
4. 戰鬥機以 1.5 馬赫飛行，馬赫錐半頂角是多少？

## 三、實驗原理

### 1. 波長的改變
波源每隔 $T_0 = 1/f_0$ 發出一個波前，期間自身前進 $v_sT_0$。因此前方波前間距（波長）為
$$ \lambda_{前} = (v - v_s)T_0, \qquad \lambda_{後} = (v + v_s)T_0 $$

### 2. 都卜勒公式（觀察者靜止）
$$ f' = \frac{f_0}{1 - M\cos\theta} $$
$\theta$ 為「發出波前時」波源速度方向與波源→觀察者連線的夾角。正前方 $\theta = 0$、正後方 $\theta = 180°$。

### 3. 震波與馬赫錐
當 $M \gt 1$，波源跑在自己發出的波前之前，所有波前的包絡形成圓錐（二維中為兩條直線）：
$$ \sin\alpha = \frac{v}{v_s} = \frac{1}{M} $$
觀察者被錐面掃過的瞬間會在極短時間內接收到大量波前，形成「音爆」。

## 四、模擬器操作說明

| 控制項 | 說明 |
|---|---|
| 馬赫數 M | 波源速度 ÷ 波速，0 至 2 |
| 發聲頻率 f₀ | 0.5 至 2 |
| **綠色觀察者** | 可用滑鼠拖曳到任意位置 |

- 波源由左往右移動，到達右側後重新出發。
- 觀察者旁顯示「實測頻率」：以最近兩個抵達的波前時間間隔計算；同時顯示公式預測值。
- $M \gt 1$ 時，紅色虛線為理論馬赫錐。

## 五、實驗步驟與數據記錄

### 步驟 A：前方與後方（f₀ = 1）
把觀察者分別放在波源路徑的正前方與正後方：

| M | 前方實測 f' | 前方理論 | 後方實測 f' | 後方理論 |
|---|---|---|---|---|
| 0.2 | | | | |
| 0.4 | | | | |
| 0.6 | | | | |
| 0.8 | | | | |

### 步驟 B：側向觀察
固定 M = 0.5，把觀察者放在路徑上方，觀察波源從左邊經過到右邊的過程中，聽到的頻率如何由高變低。記錄最接近時的頻率，並解釋為何接近 $f_0$。

### 步驟 C：馬赫錐
| M | 量得半頂角 α | 理論 $\sin^{-1}(1/M)$ |
|---|---|---|
| 1.2 | | |
| 1.5 | | |
| 2.0 | | |

## 六、實驗探究問題

1. 為什麼波源移動與觀察者移動的都卜勒公式不同？在光的情況下（狹義相對論）又如何？
2. 天文學家如何利用都卜勒效應測量恆星的徑向速度或發現系外行星？
3. 醫學超音波如何測量血流速度？
4. M = 1 時前方的波前會發生什麼事？這與「音障」有何關係？
5. 船在水面航行留下的 V 字形尾跡，其角度為何幾乎與船速無關（約 39°）？查閱「Kelvin 尾跡」。

## 七、誤差來源與模型限制

- 波前以離散時間點發出，實測頻率是兩個波前之間的平均值，在頻率快速變化時有延遲。
- 二維模擬中的圓形波前對應水波或柱面波；聲音在三維空間中為球面波，但都卜勒公式相同。

## 八、延伸挑戰

1. 讓觀察者也能移動，驗證一般公式 $f' = f_0(v + v_o)/(v - v_s)$。
2. 讓波源做圓周運動，觀察頻率週期性變化（類比雙星光譜的週期性位移）。
3. 加入風（介質整體流動），探討風對都卜勒頻移的影響。

## 九、延伸閱讀

- C. Doppler, "Über das farbige Licht der Doppelsterne und einiger anderer Gestirne des Himmels" (1842)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Waves—II〉章：都卜勒效應與超音速
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 34〈Relativistic Effects in Radiation〉
- HyperPhysics〈Doppler Effect〉與〈Shock Waves〉
`;

const doppler: ExampleDef = {
  id: 'doppler',
  category: '振動與波動',
  difficulty: '入門',
  listDescription: '移動波源發出的圓形波前在前方擠壓、後方拉長；拖曳觀察者即時量測聽到的頻率，超過波速時形成馬赫錐（音爆）。',
  description: dopplerHandout,
  info: { title: '都卜勒效應與震波', author: '', keywords: '', abstract: '' },
  variables: doubles('dp', [
    ['M', '0.5', '馬赫數 vs/v'],
    ['f0', '1', '波源頻率'],
    ['c', '2', '波速'],
    ['xs', '-9', '波源位置'],
    ['xo', '6', '觀察者 x（可拖曳）'],
    ['yo', '0', '觀察者 y（可拖曳）'],
  ]),
  odePages: [{
    id: 'dp-ode', name: '波源運動', method: 'Euler', increment: '0.01', comment: '',
    rates: [{ state: 'xs', expression: 'M * c' }],
  }],
  constraintPages: [{
    id: 'dp-con', name: '發出波前', comment: '每隔 1/f0 記錄一個波前的發出位置與時間',
    code: String.raw`var sig = M + '|' + f0 + '|' + c;
if (!_v._fr || _v._sig !== sig) { _v._sig = sig; _v._fr = []; _v._ne = t; xs = -9; }
if (xs > 10) { xs = -9; _v._fr = []; _v._ne = t; }
while (t >= _v._ne) {
  _v._fr.push([xs - M * c * (t - _v._ne), _v._ne]);
  _v._ne += 1 / f0;
}
if (_v._fr.length > 80) _v._fr.splice(0, _v._fr.length - 80);`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('dp-dp', 600, 400, [-10, 10, -6.667, 6.667], true),
    slider('dp-s-M', 'M', 0, 2, 0.05, '馬赫數 M'),
    slider('dp-s-f', 'f0', 0.5, 2, 0.05, '發聲頻率 f₀'),
    customDraw('dp-draw', '波前繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var fr = vars._fr || [], t = vars.t, c = vars.c, M = vars.M, f0 = vars.f0, xs = vars.xs;
ctx.strokeStyle = "#E5E1D8"; ctx.beginPath(); ctx.moveTo(toPixX(-10), toPixY(0)); ctx.lineTo(toPixX(10), toPixY(0)); ctx.stroke();
// 波前
fr.forEach(function (w) {
  var r = c * (t - w[1]);
  if (r <= 0 || r > 30) return;
  var age = Math.min(1, r / 14);
  ctx.strokeStyle = "rgba(47,111,176," + (0.85 - 0.65 * age).toFixed(3) + ")"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(toPixX(w[0]), toPixY(0), toPixLen(r), 0, 2 * Math.PI); ctx.stroke();
});
// 馬赫錐
if (M > 1) {
  var al = Math.asin(1 / M), Lc = 25;
  ctx.strokeStyle = "rgba(209,73,91,0.8)"; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(toPixX(xs), toPixY(0)); ctx.lineTo(toPixX(xs - Lc * Math.cos(al)), toPixY(Lc * Math.sin(al)));
  ctx.moveTo(toPixX(xs), toPixY(0)); ctx.lineTo(toPixX(xs - Lc * Math.cos(al)), toPixY(-Lc * Math.sin(al)));
  ctx.stroke(); ctx.setLineDash([]);
}
// 波源
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(toPixX(xs), toPixY(0), 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
if (M > 0) arrow(toPixX(xs) + 10, toPixY(0), toPixX(xs) + 10 + 18 * Math.min(M, 2), toPixY(0), "#B97A1E", 2);
// 觀察者實測頻率：最近兩個抵達波前的時間差
var xo = vars.xo, yo = vars.yo, arr = [];
fr.forEach(function (w) { var ta = w[1] + Math.sqrt((xo - w[0]) * (xo - w[0]) + yo * yo) / c; if (ta <= t) arr.push(ta); });
arr.sort(function (a, b) { return a - b; });
var fm = arr.length >= 2 ? 1 / Math.max(1e-6, arr[arr.length - 1] - arr[arr.length - 2]) : NaN;
// 理論值：使用「最近抵達的波前」發出時的幾何
var ft = NaN;
if (fr.length) {
  var best = null;
  fr.forEach(function (w) { var ta = w[1] + Math.sqrt((xo - w[0]) * (xo - w[0]) + yo * yo) / c; if (ta <= t && (!best || ta > best.ta)) best = { ta: ta, x: w[0] }; });
  if (best) { var dx = xo - best.x, d = Math.sqrt(dx * dx + yo * yo); ft = d > 1e-6 ? f0 / (1 - M * dx / d) : NaN; }
}
ctx.fillStyle = "#2A9D8F"; ctx.font = "bold 11px monospace"; ctx.textAlign = "left";
var lx = Math.min(toPixX(xo) + 14, W - 150), ly = Math.max(toPixY(yo) - 12, 16);
ctx.fillText("實測 f' = " + (isFinite(fm) ? fm.toFixed(3) : "…"), lx, ly);
ctx.fillStyle = "#6B6F76"; ctx.font = "11px monospace";
ctx.fillText("公式 f' = " + (isFinite(ft) && ft > 0 ? ft.toFixed(3) : "—"), lx, ly + 14);
infoBox(8, 8, [
  "波速 v = " + c + "   f0 = " + f0.toFixed(2) + "   λ0 = " + (c / f0).toFixed(2),
  "前方 λ = (v−vs)/f0 = " + ((c - M * c) / f0).toFixed(2) + "   f' = " + (M < 1 ? (f0 / (1 - M)).toFixed(3) : "—"),
  "後方 λ = (v+vs)/f0 = " + ((c + M * c) / f0).toFixed(2) + "   f' = " + (f0 / (1 + M)).toFixed(3),
  (M > 1 ? ["馬赫錐半角 α = " + (Math.asin(1 / M) * 180 / Math.PI).toFixed(1) + "°", "#D1495B"] : (M === 1 ? ["M = 1：音障", "#D1495B"] : " ")),
], { font: "11px monospace", lh: 15 });
`),
    {
      id: 'dp-obs', type: 'Elements.Shape2D', name: '觀察者', parent: 'DrawingPanel1',
      properties: { X: 'xo', Y: 'yo', SizeX: '0.35', SizeY: '0.35', ShapeType: 'ELLIPSE', FillColor: '"#2A9D8F"', LineColor: '"#1A5B52"', Visible: 'true', Draggable: 'true' },
    },
  ],
};

// ─────────────────────────────────────────────
// 雙狹縫干涉與單狹縫繞射
// ─────────────────────────────────────────────
const doubleslitHandout = String.raw`# 🌈 雙狹縫干涉與單狹縫繞射實驗講義

> 1801 年前後，托馬斯．楊讓陽光通過兩道細縫，在屏幕上得到明暗相間的條紋，為光的波動說提供了決定性證據。一百多年後，同樣的實驗用單一電子做，成了量子力學最核心的謎題。

## 一、實驗目的

1. 觀察雙狹縫干涉條紋，驗證條紋間距 $\Delta y = \lambda D/d$。
2. 觀察單狹縫繞射的中央亮帶寬度 $2\lambda D/a$，理解繞射包絡對干涉條紋的調制。
3. 觀察「缺級」現象，以及增加狹縫數（光柵）時主極大變細、次極大出現的規律。
4. 由條紋間距反推光的波長。

## 二、課前預報

1. 寫出雙狹縫亮紋的條件 $d\sin\theta = m\lambda$，以及小角度時屏上亮紋位置 $y_m$。
2. 寫出單狹縫暗紋的條件 $a\sin\theta = m\lambda$（$m \neq 0$）。為何 $m = 0$ 不是暗紋？
3. 以預設值 $\lambda = 550$ nm、$d = 0.25$ mm、$a = 0.05$ mm、$D = 1$ m，計算條紋間距與中央亮帶寬度，以及中央亮帶內有幾條亮紋。
4. 當 $d/a = 3$ 時，哪些干涉級數會「缺級」？
5. 紅光與藍光哪個的條紋間距較大？

## 三、實驗原理

### 1. N 狹縫夫朗和斐繞射的強度分布
相鄰狹縫的相位差 $\phi = \dfrac{2\pi d\sin\theta}{\lambda}$，單縫的半相位 $\beta = \dfrac{\pi a\sin\theta}{\lambda}$：
$$ I(\theta) = I_0\left(\frac{\sin\beta}{\beta}\right)^2\left(\frac{\sin(N\phi/2)}{N\sin(\phi/2)}\right)^2 $$
第一個因子為**單縫繞射包絡**，第二個為**多縫干涉因子**。$N = 2$ 時干涉因子化簡為 $\cos^2(\phi/2)$。

### 2. 屏幕上的位置
小角度時 $y = D\tan\theta \approx D\theta$：
$$ \text{條紋間距 } \Delta y = \frac{\lambda D}{d}, \qquad \text{中央亮帶寬 } = \frac{2\lambda D}{a} $$

### 3. 缺級
當干涉亮紋 $d\sin\theta = m\lambda$ 恰好落在繞射暗紋 $a\sin\theta = m'\lambda$ 上，即 $m = (d/a)m'$ 時，該亮紋消失。

### 4. 光柵
N 增加時，主極大位置不變但寬度 $\propto 1/N$，相鄰主極大之間出現 $N - 2$ 個微弱的次極大。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 波長 λ | 380 至 750 nm | 顏色會跟著改變 |
| 縫距 d | 0.05 至 1 mm | 相鄰狹縫中心距離 |
| 縫寬 a | 0.01 至 0.2 mm | 每條狹縫的寬度（不可大於 d） |
| 狹縫數 N | 1 至 8 | N = 1 為單狹縫，N ≥ 3 為光柵 |

- 上方為示意圖（不按比例），中間為屏幕上看到的條紋，下方為強度分布：實線為總強度，虛線為單縫繞射包絡。
- 屏幕距離 D = 1 m，可在變數積木中修改。

## 五、實驗步驟與數據記錄

### 步驟 A：條紋間距與縫距
固定 λ = 550 nm、a = 0.04 mm、N = 2：

| d (mm) | 量得 10 條紋總寬 (mm) | $\Delta y$ (mm) | 理論 $\lambda D/d$ | $1/d$ (mm⁻¹) |
|---|---|---|---|---|
| 0.15 | | | | |
| 0.25 | | | | |
| 0.40 | | | | |
| 0.60 | | | | |

以 $\Delta y$ 對 $1/d$ 作圖，由斜率求出 λ。

### 步驟 B：條紋間距與波長
固定 d = 0.25 mm，λ 取 400、500、600、700 nm，驗證 $\Delta y \propto \lambda$。

### 步驟 C：單狹縫
設 N = 1，改變 a，量測中央亮帶寬度並驗證 $\propto 1/a$。

### 步驟 D：缺級與光柵
1. 設 d = 0.15 mm、a = 0.05 mm（d/a = 3），找出消失的級數。
2. 固定 d、a，N 由 2 增加到 8，記錄主極大寬度與次極大個數。

## 六、實驗探究問題

1. 如果遮住其中一條狹縫，屏上的圖樣會變成什麼？為何兩條狹縫的圖樣不是兩個單縫圖樣的簡單相加？
2. 用白光做雙狹縫實驗，中央亮紋是什麼顏色？兩側的條紋顏色如何排列？
3. 光柵光譜儀為什麼要用很多條狹縫？N 越大對分辨兩條相近譜線有什麼好處？
4. 若讓電子一顆一顆通過雙狹縫，長時間累積後會看到什麼？這對「粒子」概念有什麼挑戰？
5. 本模擬使用夫朗和斐（遠場）近似，在什麼條件下必須改用菲涅耳（近場）繞射？（提示：菲涅耳數 $a^2/(\lambda D)$）

## 七、誤差來源與模型限制

- 使用遠場與小角度近似，屏幕位置以 $y = D\tan\theta$ 計算。
- 假設入射光為單色平面波、完全相干；真實光源有有限的相干長度與寬度，會降低條紋對比。
- 未考慮偏振與狹縫邊緣的材料效應。

## 八、延伸挑戰

1. 把光源改為兩個波長（如鈉黃光 589.0 與 589.6 nm），以光柵觀察它們何時能被分辨（瑞利判據）。
2. 加入白光：把多個波長的強度以對應顏色疊加，模擬白光干涉條紋。
3. 推廣到圓孔繞射（艾里斑），討論望遠鏡的解析度。

## 九、延伸閱讀

- T. Young, "The Bakerian Lecture: Experiments and calculations relative to physical optics", *Philosophical Transactions of the Royal Society* 94, 1 (1804)
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 29〈Interference〉、Ch. 30〈Diffraction〉；Vol. III, Ch. 1〈Quantum Behavior〉
- E. Hecht, *Optics*, Ch. 9〈Interference〉與 Ch. 10〈Diffraction〉
- A. Tonomura et al., "Demonstration of single-electron buildup of an interference pattern", *American Journal of Physics* 57, 117 (1989)
`;

const doubleslit: ExampleDef = {
  id: 'doubleslit',
  category: '光學',
  difficulty: '基礎',
  listDescription: '夫朗和斐繞射的完整強度公式：調整波長、縫距、縫寬與狹縫數，觀察干涉條紋、單縫繞射包絡、缺級與光柵主極大。',
  description: doubleslitHandout,
  info: { title: '雙狹縫干涉與單狹縫繞射', author: '', keywords: '', abstract: '' },
  variables: doubles('ds', [
    ['lam', '550', '波長 λ（nm）'],
    ['d', '0.25', '縫距 d（mm）'],
    ['a', '0.05', '縫寬 a（mm）'],
    ['Ns', '2', '狹縫數 N'],
    ['D', '1', '屏幕距離 D（m）'],
    ['ph', '0', '動畫相位（無物理意義）'],
  ]),
  odePages: [{
    id: 'ds-ode', name: '動畫時間', method: 'Euler', increment: '0.02', comment: '',
    rates: [{ state: 'ph', expression: '1' }],
  }],
  constraintPages: [{
    id: 'ds-con', name: '參數限制', comment: '縫寬不可超過縫距；N 取整數',
    code: String.raw`Ns = Math.max(1, Math.round(Ns));
if (Ns > 1 && a > d) a = d;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('ds-dp', 620, 440, [0, 10, 0, 10]),
    slider('ds-s-l', 'lam', 380, 750, 5, '波長 λ (nm)'),
    slider('ds-s-d', 'd', 0.05, 1, 0.01, '縫距 d (mm)'),
    slider('ds-s-a', 'a', 0.01, 0.2, 0.005, '縫寬 a (mm)'),
    slider('ds-s-N', 'Ns', 1, 8, 1, '狹縫數 N'),
    customDraw('ds-draw', '干涉繞射繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var lam = vars.lam * 1e-9, d = vars.d * 1e-3, a = Math.min(vars.a, vars.Ns > 1 ? vars.d : 1e9) * 1e-3, N = Math.max(1, Math.round(vars.Ns)), D = vars.D;
function rgb(nm) {
  var r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else { r = 1; }
  var f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
  return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
}
var col = rgb(vars.lam), cs = "rgb(" + col.join(",") + ")";
function inten(y) {
  var th = Math.atan(y / D), s = Math.sin(th);
  var be = Math.PI * a * s / lam, ph = 2 * Math.PI * d * s / lam;
  var env = Math.abs(be) < 1e-9 ? 1 : Math.pow(Math.sin(be) / be, 2);
  var den = N * Math.sin(ph / 2), it = 1;
  if (N > 1) it = Math.abs(den) < 1e-9 ? 1 : Math.pow(Math.sin(N * ph / 2) / den, 2);
  return [env * it, env];
}
var Ymax = Math.min(60e-3, Math.max(6e-3, 2.6 * lam * D / a));
// ── 示意圖 ──
var sy = 22, sh = 140, bx = 90;
ctx.fillStyle = cs; ctx.globalAlpha = 0.25; ctx.fillRect(10, sy, bx - 14, sh); ctx.globalAlpha = 1;
ctx.strokeStyle = cs; ctx.lineWidth = 1.5;
for (var k = 0; k < 6; k++) { var xx = 14 + ((k * 14 + vars.ph * 40) % 76); ctx.beginPath(); ctx.moveTo(xx, sy + 4); ctx.lineTo(xx, sy + sh - 4); ctx.stroke(); }
ctx.fillStyle = "#2B2D31"; ctx.fillRect(bx - 3, sy, 6, sh);
var slitPx = 10, gap = Math.min(22, 110 / Math.max(N, 1)), cyS = sy + sh / 2;
var centers = [];
for (var i = 0; i < N; i++) centers.push(cyS + (i - (N - 1) / 2) * gap);
ctx.fillStyle = "#FFFDF8";
centers.forEach(function (c) { ctx.fillRect(bx - 3, c - Math.max(2, slitPx * Math.min(1, vars.a / 0.1) / 2), 6, Math.max(4, slitPx * Math.min(1, vars.a / 0.1))); });
ctx.save(); ctx.beginPath(); ctx.rect(bx + 3, sy, W - bx - 60, sh); ctx.clip();
ctx.strokeStyle = cs; ctx.lineWidth = 1; ctx.globalAlpha = 0.45;
centers.forEach(function (c) {
  for (var r = (vars.ph * 40) % 18; r < 600; r += 18) { ctx.beginPath(); ctx.arc(bx, c, r, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
});
ctx.restore(); ctx.globalAlpha = 1;
ctx.fillStyle = "#6B6F76"; ctx.fillRect(W - 54, sy, 8, sh);
ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("屏幕", W - 50, sy + sh + 12);
ctx.fillText("示意圖（不按比例）  D = " + D.toFixed(2) + " m", W / 2, sy - 6);
// ── 屏幕上的條紋 ──
var py0 = 186, ph0 = 46, L = 40, R = W - 12;
for (var px = L; px <= R; px++) {
  var y = -Ymax + (px - L) / (R - L) * 2 * Ymax, I = inten(y)[0];
  ctx.fillStyle = "rgb(" + Math.round(col[0] * I) + "," + Math.round(col[1] * I) + "," + Math.round(col[2] * I) + ")";
  ctx.fillRect(px, py0, 1.5, ph0);
}
ctx.strokeStyle = "#B8B4AA"; ctx.strokeRect(L, py0, R - L, ph0);
// ── 強度分布 ──
var Ipts = [], Epts = [];
for (var j = 0; j <= 900; j++) { var yy = -Ymax + j * 2 * Ymax / 900, v = inten(yy); Ipts.push([yy * 1000, v[0]]); Epts.push([yy * 1000, v[1]]); }
miniPlot({ x: 6, y: 240, w: W - 12, h: 194 }, [
  { pts: Epts, color: "#9AA0A6", dash: [5, 4], label: "單縫包絡", width: 1.2 },
  { pts: Ipts, color: cs === "rgb(0,0,0)" ? "#2F6FB0" : cs, label: "總強度 I/I0" },
], { title: "屏幕上的強度分布", xlabel: "y(mm)", xmin: -Ymax * 1000, xmax: Ymax * 1000, ymin: 0, ymax: 1.08 });
var dy = lam * D / d * 1000, cw = 2 * lam * D / a * 1000;
infoBox(W - 10, 242 + 18, [
  "條紋間距 λD/d = " + (N > 1 ? dy.toFixed(3) + " mm" : "—"),
  "中央亮帶寬 2λD/a = " + cw.toFixed(2) + " mm",
  "d/a = " + (N > 1 ? (d / a).toFixed(2) : "—"),
], { right: true, font: "11px monospace", lh: 15 });
`),
  ],
};

const WAVE_EXAMPLES: ExampleDef[] = [resonance, coupled, standingwave, doppler, doubleslit];

export default WAVE_EXAMPLES;

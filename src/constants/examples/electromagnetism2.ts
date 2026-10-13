import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：電磁學（二）
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// RLC 串聯電路：LC 振盪與共振
// ─────────────────────────────────────────────
const rlcHandout = String.raw`# 🔔 RLC 串聯電路：LC 振盪與共振實驗講義

> 收音機轉動旋鈕「選台」，其實是在改變一個 LC 電路的電容，讓它的自然頻率對準某個電台的載波頻率。電容與電感之間來回交換能量的電磁振盪，和彈簧上的質點振動遵守同一條方程式。

## 一、實驗目的

1. 觀察充電電容經電感（與電阻）放電時，電能與磁能來回交換的 LC 振盪。
2. 量測振盪週期並與 $T = 2\pi\sqrt{LC}$ 比較；量測對數衰減率，驗證阻尼係數 $\gamma = R/2L$。
3. 以交流電源驅動 RLC 串聯電路，量測穩態電流振幅與相位隨頻率的變化，找出共振頻率 $f_0 = 1/(2\pi\sqrt{LC})$ 與品質因子 $Q$。
4. 比較 RLC 電路與阻尼／受迫彈簧振子的對應關係。

## 二、課前預報

1. 由克希荷夫電壓定律寫出 RLC 串聯電路的微分方程 $L\ddot q + R\dot q + q/C = \mathcal{E}(t)$，並指出它與彈簧–質點–阻尼器方程的對應（$L$ ↔ ?、$R$ ↔ ?、$1/C$ ↔ ?）。
2. $L = 40$ mH、$C = 2.5$ μF 時，$f_0$ 與 $T_0$ 各為多少？
3. 電容初始電壓 10 V，無電阻時電流的最大值是多少？此時電容與電感各儲存多少能量？
4. 寫出感抗 $X_L = \omega L$、容抗 $X_C = 1/(\omega C)$ 與阻抗 $Z$ 的公式。在什麼頻率 $Z$ 最小？
5. 電阻多大時電路不再振盪（臨界阻尼）？

## 三、實驗原理

### 1. LC 振盪（無電阻）
$$ L\frac{d^2q}{dt^2} + \frac qC = 0 \quad\Rightarrow\quad q = q_0\cos\omega_0 t, \qquad \omega_0 = \frac{1}{\sqrt{LC}} $$
電容的電能 $U_C = q^2/2C$ 與電感的磁能 $U_L = Li^2/2$ 以兩倍頻率來回交換，總和保持 $q_0^2/2C$。

### 2. 阻尼振盪（有電阻）
$$ L\ddot q + R\dot q + \frac qC = 0 $$
令 $\gamma = R/2L$。當 $\gamma \lt \omega_0$（欠阻尼）：
$$ q(t) = q_0 e^{-\gamma t}\left(\cos\omega_d t + \frac{\gamma}{\omega_d}\sin\omega_d t\right), \qquad \omega_d = \sqrt{\omega_0^2 - \gamma^2} $$
相鄰兩個正峰值的比值固定，對數衰減率
$$ \delta = \ln\frac{q_n}{q_{n+1}} = \gamma T_d = \frac{R}{2L}T_d $$
當 $R \ge R_c = 2\sqrt{L/C}$ 時電路不再振盪（臨界阻尼與過阻尼）。電阻消耗的焦耳熱 $\int Ri^2 dt$ 正好等於儲存能量的減少。

### 3. 受迫振盪與共振
接上交流電源 $\mathcal{E} = V_0\sin\omega t$，暫態以 $e^{-\gamma t}$ 衰減後，電流成為同頻率的穩態振盪 $i = I_0\sin(\omega t - \phi)$：
$$ I_0 = \frac{V_0}{\sqrt{R^2 + (X_L - X_C)^2}}, \qquad \tan\phi = \frac{X_L - X_C}{R} $$
- $\omega = \omega_0$ 時 $X_L = X_C$，阻抗最小（$Z = R$），電流最大 $I_0 = V_0/R$，且與電源同相。
- $\omega \lt \omega_0$ 電容性，電流超前電壓（$\phi \lt 0$）；$\omega \gt \omega_0$ 電感性，電流落後電壓（$\phi \gt 0$）。
- 品質因子 $Q = \dfrac{\omega_0 L}{R} = \dfrac1R\sqrt{\dfrac LC}$；半功率頻寬（$I_0$ 降為峰值的 $1/\sqrt2$）為 $\Delta f = f_0/Q$。

### 4. 本模擬
- 單位：$L$ 用 mH、$C$ 用 μF、$R$ 用 Ω、電荷 μC、電流 mA、能量 μJ。
- **時間以毫秒（ms）計**：模擬時鐘走 1 單位代表電路中的 1 ms，也就是「慢動作 1000 倍」。儀表板上方的 t 讀數請讀作 ms。
- 電路方程以四階 Runge–Kutta 法積分，步長 0.002 ms。
- 模式 A：電容先充電到 $V_0 = 10$ V 再接通電感放電。模式 B：電源振幅 $V_0 = 10$ V，從 $q = 0$、$i = 0$ 開始。
- 模式 B 中，改變頻率後經過約 $5/\gamma$ 的時間、且連續三個週期的振幅變化小於 1% 時，判定為穩態，記錄一個「實測點」到共振曲線上。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 電阻 R | 0 至 300 Ω | 改變後重新開始 |
| 電感 L | 10 至 100 mH | 改變後重新開始 |
| 電容 C | 1 至 10 μF | 改變後重新開始 |
| 頻率 f | 50 至 2000 Hz | 只在模式 B 有作用；改變時不重新開始 |
| **模式 A 放電** | 按鈕 | 電容充電後放電，觀察阻尼振盪 |
| **模式 B 交流** | 按鈕 | 接上交流電源，觀察受迫振盪與共振 |

- 左上：電路圖。黃色小點代表電荷載子，前後移動的距離正比於流過的電荷量；電容極板上的 ＋／－ 表示電容所帶電荷。
- 右上：能量長條：電容電能 $U_C$、電感磁能 $U_L$、兩者總和，以及電阻累積的焦耳熱。
- 左下：正規化波形。模式 A 顯示 $q/q_0$、$i/(\omega_0 q_0)$ 與包絡線 $\pm e^{-\gamma t}$；模式 B 顯示 $\mathcal{E}/V_0$ 與 $i/I_{0}$。
- 右下：模式 A 為能量對時間；模式 B 為共振曲線（理論曲線與實測點）。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：LC 振盪週期（模式 A、R = 0、L = 40 mH）
| C (μF) | 實測週期 (ms) | $2\pi\sqrt{LC}$ (ms) | 相對誤差 |
|---|---|---|---|
| 1 | | | |
| 2.5 | | | |
| 5 | | | |
| 10 | | | |

以 $T^2$ 對 $C$ 作圖，由斜率求 $L$。觀察能量長條：$U_C + U_L$ 是否守恆？

### 步驟 B：阻尼與對數衰減（模式 A、L = 40 mH、C = 2.5 μF）
| R (Ω) | 實測 $T_d$ (ms) | 實測 $\delta$ | 實測 $\delta/T_d$ (1/s) | 理論 $R/2L$ (1/s) |
|---|---|---|---|---|
| 10 | | | | |
| 30 | | | | |
| 60 | | | | |
| 100 | | | | |

把 R 逐漸調大，找出電路不再振盪的電阻值，與 $R_c = 2\sqrt{L/C}$ 比較。

### 步驟 C：共振曲線（模式 B、R = 30 Ω、L = 40 mH、C = 2.5 μF，建議速度 4×）
每改一次頻率，等待儀表板顯示「穩態」後記錄：

| f (Hz) | 實測 $I_0$ (mA) | 理論 $I_0$ (mA) | 實測相位 φ (°) | 理論相位 φ (°) |
|---|---|---|---|---|
| 200 | | | | |
| 350 | | | | |
| 450 | | | | |
| 500 | | | | |
| 550 | | | | |
| 650 | | | | |
| 900 | | | | |

作 $I_0$–$f$ 圖，讀出共振頻率與半功率頻寬 $\Delta f$，計算 $Q = f_0/\Delta f$ 並與 $\frac1R\sqrt{L/C}$ 比較。

### 步驟 D：品質因子
固定 L、C，比較 R = 15 Ω 與 R = 60 Ω 的共振曲線尖銳程度與達到穩態所需的時間，說明兩者的關係。

## 六、實驗探究問題

1. 在 LC 振盪中，電流最大的瞬間電容的電荷是多少？能量在哪裡？
2. 為什麼 $U_C$ 與 $U_L$ 變化的頻率是電荷振盪頻率的兩倍？
3. 品質因子大的電路，共振曲線較尖銳，但達到穩態也較慢。用 $\gamma$ 與頻寬的關係解釋這個「魚與熊掌」。
4. 收音機調諧電路的 $L = 0.25$ mH，要收聽 AM 1000 kHz 的電台，電容應調到多少？若 $Q = 50$，頻寬多大？能否分開相鄰 10 kHz 的兩個電台？
5. 共振時電容兩端的電壓振幅可以遠大於電源電壓 $V_0$。試證明其比值為 $Q$，並說明高壓電路設計時為何要小心。

## 七、誤差來源與模型限制

- 實測週期由相鄰峰值的時間求得，峰值以步長 0.002 ms 的取樣內插，誤差遠小於 0.1%。
- 理想元件：忽略導線電阻、電感線圈本身的電阻與寄生電容、電容的漏電與介電損耗，以及電源內阻。
- 實際的高 Q 電路中，電感線圈的電阻常是主要的損耗來源；高頻時還有集膚效應與輻射損失。
- 模式 B 的穩態判定有一定容許值；Q 值很高時暫態衰減極慢，需要等更久。

## 八、延伸挑戰

1. 改成 RLC 並聯電路，比較其「反共振」（阻抗最大）的行為。
2. 以方波驅動 RLC 電路，觀察其奇次諧波何時會激起共振（傅立葉分析的直觀例子）。
3. 讓兩個 LC 電路以互感耦合，觀察能量在兩電路間的拍頻轉移（與耦合擺相同）。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Electromagnetic Oscillations and Alternating Current〉章
- H. D. Young, R. A. Freedman, *University Physics*,〈Inductance〉與〈Alternating Current〉章
- E. M. Purcell, D. J. Morin, *Electricity and Magnetism*（3rd ed.），Ch. 8〈Alternating-Current Circuits〉
- P. Horowitz, W. Hill, *The Art of Electronics*（3rd ed.），Ch. 1：LC 電路與共振
- A. P. French, *Vibrations and Waves*, Ch. 4〈Forced Vibrations and Resonance〉
`;

const rlc: ExampleDef = {
  id: 'rlc',
  category: '電磁學',
  difficulty: '進階',
  listDescription: '模式 A：充電電容經電感放電，能量在 C 與 L 間來回交換，量測週期 2π√(LC) 與對數衰減 R/2L；模式 B：交流驅動掃頻，量出共振曲線、品質因子與相位。',
  description: rlcHandout,
  info: { title: 'RLC 串聯電路：LC 振盪與共振', author: '', keywords: '', abstract: '' },
  variables: doubles('rl', [
    ['R', '15', '電阻（Ω）'],
    ['L', '40', '電感（mH）'],
    ['C', '2.5', '電容（μF）'],
    ['f', '500', '驅動頻率（Hz，模式 B）'],
    ['mode', '0', '模式：0 = 電容放電、1 = 交流驅動'],
    ['runN', '0', '重新開始計數（按鈕用）'],
    ['V0', '10', '電容初始電壓／電源振幅（V）'],
    ['q', '25', '電容電荷（μC）'],
    ['i', '0', '電流（mA），順時針為正'],
    ['Uheat', '0', '電阻累積焦耳熱（μJ）'],
    ['Vs', '0', '電源電動勢（V）'],
    ['UC', '0', '電容電能（μJ）'],
    ['UL', '0', '電感磁能（μJ）'],
    ['w0', '1', '自然角頻率 1/√(LC)（rad/ms）'],
    ['gam', '0', '阻尼係數 R/2L（1/ms）'],
    ['f0', '0', '共振頻率（Hz）'],
    ['T0', '0', '2π√(LC)（ms）'],
    ['Tdth', '0', '理論阻尼週期（ms）'],
    ['Rcrit', '0', '臨界電阻 2√(L/C)（Ω）'],
    ['Qf', '0', '品質因子'],
    ['Tmeas', '0', '實測週期（ms）'],
    ['dlt', '0', '實測對數衰減率 δ'],
    ['I0th', '0', '理論穩態電流振幅（mA）'],
    ['phTh', '0', '理論相位（°，電流落後為正）'],
    ['Imeas', '0', '實測穩態電流振幅（mA）'],
    ['phMeas', '0', '實測相位（°）'],
    ['stdy', '0', '是否已達穩態'],
  ]),
  odePages: [{
    id: 'rl-ode', name: '電路方程（時間單位 ms）', method: 'RungeKutta', increment: '0.002', comment: 'L(mH)·di/dt(mA/ms) 的單位為 mV，因此電壓項乘 1000',
    rates: [
      { state: 'q', expression: 'i' },
      { state: 'i', expression: '(1000 * ((mode > 0.5 ? V0 * Math.sin(2 * Math.PI * f * t / 1000) : 0) - q / C) - R * i) / L' },
      { state: 'Uheat', expression: 'R * i * i / 1000' },
    ],
  }],
  constraintPages: [{
    id: 'rl-con', name: '理論值、週期與共振量測', comment: '模式 A：q 的正峰值（i 由正變負）求週期與對數衰減；模式 B：逐週期量電流振幅與相位',
    code: String.raw`w0 = Math.sqrt(1000 / (L * C));
gam = R / (2 * L);
f0 = 1000 * w0 / (2 * Math.PI);
T0 = 2 * Math.PI / w0;
Tdth = gam < w0 ? 2 * Math.PI / Math.sqrt(w0 * w0 - gam * gam) : 0;
Rcrit = 2 * Math.sqrt(1000 * L / C);
Qf = R > 0 ? Math.sqrt(1000 * L / C) / R : Infinity;
var wd = 2 * Math.PI * f;
var XL = wd * L * 1e-3, XC = 1 / (wd * C * 1e-6);
I0th = 1000 * V0 / Math.sqrt(R * R + (XL - XC) * (XL - XC));
phTh = Math.atan2(XL - XC, R) * 180 / Math.PI;
var sig = R + '|' + L + '|' + C + '|' + mode + '|' + runN;
if (_v._sig !== sig) {
  _v._sig = sig;
  t = 0; q = mode > 0.5 ? 0 : C * V0; i = 0; Uheat = 0;
  _v._tl = 0; _v._ip = 0; _v._pk = { t: 0, q: q }; Tmeas = 0; dlt = 0;
  _v._f = f; _v._fset = 0; _v._cyc = 0; _v._amax = 0; _v._amps = []; _v._tiz = -1;
  Imeas = 0; phMeas = 0; stdy = 0; _v._pts = [];
}
Vs = mode > 0.5 ? V0 * Math.sin(2 * Math.PI * f * t / 1000) : 0;
UC = q * q / (2 * C);
UL = L * i * i / 2000;
if (_v._f !== f) { _v._f = f; _v._fset = t; _v._amps = []; _v._amax = 0; stdy = 0; _v._cyc = Math.floor(f * t / 1000); _v._tiz = -1; }
if (t > _v._tl) {
  var dtp = t - _v._tl, ip = _v._ip;
  if (mode < 0.5) {
    if (ip > 0 && i <= 0) {
      var tpk = t - dtp * i / (i - ip);
      if (_v._pk.q > 0 && q > 0) { Tmeas = tpk - _v._pk.t; dlt = Math.log(_v._pk.q / q); }
      _v._pk = { t: tpk, q: q };
    }
  } else {
    if (Math.abs(i) > _v._amax) _v._amax = Math.abs(i);
    if (ip < 0 && i >= 0) _v._tiz = t - dtp * i / (i - ip);
    var cyc = Math.floor(f * t / 1000);
    if (cyc !== _v._cyc) {
      _v._cyc = cyc;
      var tv = cyc * 1000 / f;
      if (_v._tiz >= 0) {
        var frac = ((_v._tiz - (tv - 1000 / f)) * f / 1000) % 1;
        if (frac < 0) frac += 1;
        if (frac > 0.5) frac -= 1;
        _v._phNow = frac * 360;
      }
      _v._amps.push(_v._amax); _v._amax = 0;
      if (_v._amps.length > 3) _v._amps.shift();
      var am = _v._amps;
      if (am.length === 3 && gam > 0 && t - _v._fset > 5 / gam) {
        var amx = Math.max(am[0], am[1], am[2]), amn = Math.min(am[0], am[1], am[2]);
        if (amx > 0 && (amx - amn) / amx < 0.01) {
          if (!stdy) {
            stdy = 1;
            var pts = _v._pts.filter(function (p) { return Math.abs(p[0] - f) > 0.5; });
            pts.push([f, am[2]]); _v._pts = pts;
          }
          Imeas = am[2]; phMeas = _v._phNow;
        }
      }
    }
  }
  _v._tl = t; _v._ip = i;
} else if (t < _v._tl) {
  _v._tl = t; _v._ip = i;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rl-dp', 640, 470, [0, 10, 0, 10]),
    slider('rl-s-R', 'R', 0, 300, 1, '電阻 R (Ω)'),
    slider('rl-s-L', 'L', 10, 100, 1, '電感 L (mH)'),
    slider('rl-s-C', 'C', 1, 10, 0.1, '電容 C (μF)'),
    slider('rl-s-f', 'f', 50, 2000, 5, '頻率 f (Hz)'),
    button('rl-b-a', '模式 A 放電', 'mode = 0; runN = runN + 1;'),
    button('rl-b-b', '模式 B 交流', 'mode = 1; runN = runN + 1;'),
    readout('rl-r-f0', '共振頻率 f₀ = 1/(2π√LC)', 'f0', { unit: 'Hz', digits: 1, color: C.muted, group: '電路參數（理論）' }),
    readout('rl-r-T0', '2π√(LC)', 'T0', { unit: 'ms', digits: 4, color: C.muted, group: '電路參數（理論）' }),
    readout('rl-r-Q', '品質因子 Q = √(L/C)/R', 'Qf', { digits: 2, color: C.muted, group: '電路參數（理論）' }),
    readout('rl-r-Rc', '臨界電阻 2√(L/C)', 'Rcrit', { unit: 'Ω', digits: 1, color: C.muted, group: '電路參數（理論）' }),
    readout('rl-r-Tm', '實測週期', 'mode > 0.5 ? "（模式 B）" : (gam >= w0 ? "不振盪（臨界／過阻尼）" : (Tmeas > 0 ? Tmeas : "量測中…"))', { unit: 'ms', digits: 4, color: C.blue, group: '模式 A：放電振盪' }),
    readout('rl-r-Td', '理論阻尼週期 2π/ω_d', 'Tdth > 0 ? Tdth : "—"', { unit: 'ms', digits: 4, color: C.muted, group: '模式 A：放電振盪' }),
    readout('rl-r-dl', '實測對數衰減 δ', 'mode < 0.5 && Tmeas > 0 ? dlt : "…"', { digits: 4, color: C.blue, group: '模式 A：放電振盪' }),
    readout('rl-r-dT', '實測 δ / T_d', 'mode < 0.5 && Tmeas > 0 ? 1000 * dlt / Tmeas : "…"', { unit: '1/s', digits: 1, color: C.blue, group: '模式 A：放電振盪' }),
    readout('rl-r-g', '理論 R / 2L', '1000 * gam', { unit: '1/s', digits: 1, color: C.muted, group: '模式 A：放電振盪' }),
    readout('rl-r-st', '狀態', 'mode < 0.5 ? "（模式 A）" : (stdy ? "穩態" : (gam > 0 ? "暫態中，請等待…" : "R = 0 時無法達到穩態"))', { color: C.ink, group: '模式 B：交流驅動' }),
    readout('rl-r-ff', 'f / f₀', 'f / f0', { digits: 3, color: C.ink, group: '模式 B：交流驅動' }),
    readout('rl-r-Im', '實測電流振幅 I₀', 'mode > 0.5 && stdy ? Imeas : "…"', { unit: 'mA', digits: 2, color: C.red, group: '模式 B：交流驅動' }),
    readout('rl-r-It', '理論 I₀ = V₀/Z', 'I0th', { unit: 'mA', digits: 2, color: C.muted, group: '模式 B：交流驅動' }),
    readout('rl-r-pm', '實測相位（電流落後）', 'mode > 0.5 && stdy ? phMeas : "…"', { unit: '°', digits: 1, color: C.red, group: '模式 B：交流驅動' }),
    readout('rl-r-pt', '理論 tan⁻¹((X_L−X_C)/R)', 'phTh', { unit: '°', digits: 1, color: C.muted, group: '模式 B：交流驅動' }),
    readout('rl-r-U', '儲存能量 U_C + U_L', 'UC + UL', { unit: 'μJ', digits: 2, color: C.teal, group: '能量' }),
    readout('rl-r-H', '電阻累積焦耳熱', 'Uheat', { unit: 'μJ', digits: 2, color: C.amber, group: '能量' }),
    readout('rl-r-UH', '儲存能量＋焦耳熱', 'UC + UL + Uheat', { unit: 'μJ', digits: 2, color: C.ink, group: '能量' }),
    customDraw('rl-draw', '電路、能量與波形', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var modeB = vars.mode > 0.5, q = vars.q, ii = vars.i, C = vars.C, L = vars.L, R = vars.R, V0 = vars.V0;
var w0 = vars.w0, gam = vars.gam, q0 = C * V0;
var wdr = 2 * Math.PI * vars.f / 1000;
var qref = modeB ? Math.max(1e-6, vars.I0th / wdr) : q0;
// ── 電路圖 ──
var xl = 40, xr = 300, yt = 40, yb = 196;
var segs = [[xl, yb, xl, yt], [xl, yt, xr, yt], [xr, yt, xr, yb], [xr, yb, xl, yb]];
var per = 2 * (xr - xl) + 2 * (yb - yt);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(xl, yb); ctx.lineTo(xl, yt); ctx.lineTo(xr, yt); ctx.lineTo(xr, yb); ctx.closePath(); ctx.stroke();
// 電阻
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(84, yt - 12, 72, 24);
ctx.beginPath(); ctx.moveTo(84, yt);
for (var z = 1; z <= 8; z++) ctx.lineTo(84 + z * 9 - 4.5, yt + (z % 2 ? -9 : 9));
ctx.lineTo(156, yt); ctx.stroke();
// 電感
ctx.fillRect(184, yt - 14, 76, 28);
ctx.beginPath(); ctx.moveTo(184, yt);
for (var c = 0; c < 5; c++) ctx.arc(191.6 + c * 15.2, yt, 7.6, Math.PI, 0, false);
ctx.lineTo(260, yt); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
ctx.fillText("R", 120, yt - 16); ctx.fillText("L", 222, yt - 20);
// 電容（右側）
var cy0 = (yt + yb) / 2;
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(xr - 30, cy0 - 12, 60, 24);
ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xr - 26, cy0 - 9); ctx.lineTo(xr + 26, cy0 - 9); ctx.moveTo(xr - 26, cy0 + 9); ctx.lineTo(xr + 26, cy0 + 9); ctx.stroke();
var nq = Math.min(6, Math.round(Math.abs(q) / qref * 6));
ctx.font = "bold 12px monospace"; ctx.textAlign = "center";
for (var k = 0; k < nq; k++) {
  var xx = xr - 21 + k * 8.4;
  ctx.fillStyle = q >= 0 ? "#D1495B" : "#2F6FB0"; ctx.fillText(q >= 0 ? "+" : "−", xx, cy0 - 13);
  ctx.fillStyle = q >= 0 ? "#2F6FB0" : "#D1495B"; ctx.fillText(q >= 0 ? "−" : "+", xx, cy0 + 22);
}
ctx.fillStyle = "#2B2D31"; ctx.font = "12px sans-serif"; ctx.textAlign = "left"; ctx.fillText("C", xr + 32, cy0 + 4);
// 電源或開關（左側）
ctx.lineWidth = 2;
if (modeB) {
  var amp = vars.Vs / V0;
  ctx.fillStyle = "rgba(233,162,59," + (0.15 + 0.35 * Math.abs(amp)).toFixed(2) + ")";
  ctx.beginPath(); ctx.arc(xl, cy0, 22, 0, 2 * Math.PI); ctx.fill(); ctx.strokeStyle = "#2B2D31"; ctx.stroke();
  ctx.beginPath();
  for (var s = 0; s <= 20; s++) { var sx = xl - 12 + s * 1.2, sy = cy0 - 7 * Math.sin(s / 20 * 2 * Math.PI); if (s) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy); }
  ctx.stroke();
  ctx.fillStyle = "#B97A1E"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("交流電源", xl + 28, cy0 + 4);
} else {
  ctx.fillStyle = "#FFFDF8"; ctx.fillRect(xl - 6, cy0 - 16, 12, 32);
  ctx.beginPath(); ctx.moveTo(xl, cy0 + 16); ctx.lineTo(xl, cy0 + 10); ctx.moveTo(xl, cy0 - 16); ctx.lineTo(xl, cy0 - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xl, cy0 + 10); ctx.lineTo(xl + 2, cy0 - 10); ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(xl, cy0 + 10, 2.5, 0, 2 * Math.PI); ctx.arc(xl, cy0 - 10, 2.5, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("開關已接通", xl + 10, cy0 + 4);
}
// 電荷載子（位移正比於流過的電荷 q）
var shift = 34 * q / qref, nDots = 26, sp = per / nDots;
function posAt(d) {
  d = ((d % per) + per) % per;
  for (var j = 0; j < 4; j++) {
    var g = segs[j], len = Math.abs(g[2] - g[0]) + Math.abs(g[3] - g[1]);
    if (d <= len) return [g[0] + (g[2] - g[0]) * d / len, g[1] + (g[3] - g[1]) * d / len];
    d -= len;
  }
  return [xl, yb];
}
ctx.fillStyle = "#E9A23B";
for (var n = 0; n < nDots; n++) {
  var pp = posAt(n * sp + shift);
  if (Math.abs(pp[0] - xr) < 2 && Math.abs(pp[1] - cy0) < 9) continue;
  ctx.beginPath(); ctx.arc(pp[0], pp[1], 3.2, 0, 2 * Math.PI); ctx.fill();
}
var imax = modeB ? Math.max(1e-6, vars.I0th) : q0 * w0;
var mag = Math.min(1, Math.abs(ii) / imax);
if (mag > 0.03) {
  var dir = ii > 0 ? 1 : -1, ic = "rgba(209,73,91," + (0.35 + 0.65 * mag).toFixed(2) + ")";
  arrow(170 - dir * 16, yt + 18, 170 + dir * 16, yt + 18, ic, 1.5 + 3 * mag);
  arrow(170 + dir * 16, yb - 14, 170 - dir * 16, yb - 14, ic, 1.5 + 3 * mag);
}
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "left";
ctx.fillText(modeB ? "模式 B：交流驅動" : "模式 A：電容放電", 8, 16);
// ── 能量長條 ──
var Uref = modeB ? Math.max(1e-9, 0.5 * L * vars.I0th * vars.I0th / 1000) : 0.5 * C * V0 * V0;
var bars = [["U_C", vars.UC, "#2F6FB0"], ["U_L", vars.UL, "#D1495B"], ["U_C+U_L", vars.UC + vars.UL, "#2A9D8F"], ["焦耳熱", vars.Uheat, "#E9A23B"]];
var bx = 370, bt = 30, bhh = 150, bw = 46;
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left";
ctx.fillText(modeB ? "能量（以 ½LI₀² 為 1）" : "能量（以電容初始電能為 1）", bx - 6, 16);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(bx - 6, bt + bhh); ctx.lineTo(bx + 4 * (bw + 16), bt + bhh); ctx.stroke();
ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(bx - 6, bt + bhh * 0.2); ctx.lineTo(bx + 4 * (bw + 16), bt + bhh * 0.2); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace"; ctx.textAlign = "right"; ctx.fillText("1", bx - 9, bt + bhh * 0.2 + 3);
bars.forEach(function (b, j) {
  var fr = Math.max(0, b[1] / Uref), hh = Math.min(1.25, fr) * bhh * 0.8, x0 = bx + j * (bw + 16);
  if (modeB && j === 3) return;
  ctx.fillStyle = b[2]; ctx.globalAlpha = 0.8; ctx.fillRect(x0, bt + bhh - hh, bw, hh); ctx.globalAlpha = 1;
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(b[0], x0 + bw / 2, bt + bhh + 14);
});
// ── 波形（左下）──
var tt = vars.t;
if (modeB) {
  var Tdr = 1000 / vars.f, winB = 4 * Tdr, I0 = Math.max(1e-6, vars.I0th);
  var hB = track("_rlB", [tt, vars.Vs / V0, ii / I0], 6000);
  var t1 = Math.max(tt, winB), t0 = t1 - winB, vis = hB.filter(function (p) { return p[0] >= t0; });
  miniPlot({ x: 6, y: 214, w: 308, h: 250 }, [
    { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#E9A23B", label: "ℰ/V₀" },
    { pts: vis.map(function (p) { return [p[0], p[2]]; }), color: "#D1495B", width: 2, label: "i/I₀(理論)" },
  ], { title: "正規化波形", xlabel: "t(ms)", xmin: t0, xmax: t1, ymin: -1.6, ymax: 1.6 });
} else {
  var winA = Math.min(12 * vars.T0, Math.max(5 * vars.T0, gam > 0 ? 4 / gam : 0));
  var hA = track("_rlA", [tt, q / q0, ii / (q0 * w0), Math.exp(-gam * tt), vars.UC, vars.UL, vars.Uheat], 6000);
  var ta1 = Math.max(tt, winA), ta0 = ta1 - winA, visA = hA.filter(function (p) { return p[0] >= ta0; });
  function colA(j) { return visA.map(function (p) { return [p[0], p[j]]; }); }
  miniPlot({ x: 6, y: 214, w: 308, h: 250 }, [
    { pts: colA(3), color: "#B8B4AA", dash: [4, 3], width: 1 },
    { pts: visA.map(function (p) { return [p[0], -p[3]]; }), color: "#B8B4AA", dash: [4, 3], width: 1, label: "±e^(−γt)" },
    { pts: colA(2), color: "#D1495B", width: 1.6, label: "i/(ω₀q₀)" },
    { pts: colA(1), color: "#2F6FB0", width: 2, label: "q/q₀" },
  ], { title: "正規化波形", xlabel: "t(ms)", xmin: ta0, xmax: ta1, ymin: -1.15, ymax: 1.15 });
}
// ── 右下：共振曲線或能量對時間 ──
if (modeB) {
  var f0 = vars.f0, fmax = Math.max(2.2 * f0, vars.f * 1.1), curveI = [];
  for (var u = 1; u <= 160; u++) {
    var fq = fmax * u / 160, wq = 2 * Math.PI * fq, Xd = wq * L * 1e-3 - 1 / (wq * C * 1e-6);
    curveI.push([fq, 1000 * V0 / Math.sqrt(R * R + Xd * Xd)]);
  }
  var Ipk = R > 0 ? 1000 * V0 / R : 1e9, ytop = Math.min(Ipk, 20 * vars.I0th + 1) * 1.15;
  (vars._pts || []).forEach(function (p) { if (p[1] * 1.1 > ytop) ytop = p[1] * 1.1; });
  var gR = miniPlot({ x: 320, y: 214, w: 314, h: 250 }, [
    { pts: curveI, color: "#9AA0A6", width: 1.6, label: "理論 I₀(f)" },
    { pts: [], color: "#D1495B", dots: vars._pts || [], label: "● 實測" },
  ], { title: "共振曲線（mA）", xlabel: "f(Hz)", xmin: 0, xmax: fmax, ymin: 0, ymax: ytop });
  ctx.strokeStyle = "rgba(233,162,59,0.9)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(gR.px(vars.f), gR.py(0)); ctx.lineTo(gR.px(vars.f), gR.py(ytop)); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(43,45,49,0.25)"; ctx.beginPath(); ctx.moveTo(gR.px(f0), gR.py(0)); ctx.lineTo(gR.px(f0), gR.py(ytop)); ctx.stroke();
  ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("f₀", gR.px(f0) + 3, gR.py(ytop) + 10);
  ctx.fillStyle = "#B97A1E"; ctx.fillText("目前 f", gR.px(vars.f) + 3, gR.py(ytop) + 22);
} else {
  var hE = hA.filter(function (p) { return p[0] >= Math.max(0, tt - Math.max(8 * vars.T0, 4)); });
  var U0 = 0.5 * C * V0 * V0;
  miniPlot({ x: 320, y: 214, w: 314, h: 250 }, [
    { pts: hE.map(function (p) { return [p[0], p[4] / U0]; }), color: "#2F6FB0", label: "U_C" },
    { pts: hE.map(function (p) { return [p[0], p[5] / U0]; }), color: "#D1495B", label: "U_L" },
    { pts: hE.map(function (p) { return [p[0], (p[4] + p[5]) / U0]; }), color: "#2A9D8F", width: 2, label: "U_C+U_L" },
    { pts: hE.map(function (p) { return [p[0], p[6] / U0]; }), color: "#E9A23B", dash: [4, 3], label: "焦耳熱" },
  ], { title: "能量 / 初始電能", xlabel: "t(ms)", ymin: 0, ymax: 1.1 });
}
`),
  ],
};

// ─────────────────────────────────────────────
// 迴旋加速器
// ─────────────────────────────────────────────
const cyclotronHandout = String.raw`# 🌀 迴旋加速器實驗講義

> 1931 年，勞倫斯（Ernest Lawrence）與研究生李文斯頓用一個直徑只有 11 cm 的黃銅盒子，把質子加速到 80 keV。他的關鍵洞見是：在均勻磁場中，帶電粒子繞一圈的時間與速率無關，所以只要一個固定頻率的交流電壓，就能讓粒子每半圈被推一次、越轉越快。勞倫斯因此獲得 1939 年諾貝爾物理獎。

## 一、實驗目的

1. 觀察質子在兩個 D 形電極之間被交流電壓反覆加速、在磁場中沿螺旋線向外運動的過程。
2. 量測軌道頻率，驗證迴旋頻率 $f_c = qB/(2\pi m)$ 與粒子速率無關。
3. 驗證每圈動能增加 $2qV$、軌道半徑 $r = \sqrt{2mK}/(qB)$ 正比於 $\sqrt K$，以及引出動能 $K_{max} = (qBR)^2/2m$。
4. 改變交流電壓頻率使其與迴旋頻率不匹配，觀察粒子失去同步的現象，並以相位滑移的概念定量解釋。

## 二、課前預報

1. 由 $qvB = mv^2/r$ 推導軌道半徑 $r$ 與週期 $T$，說明為何 $T$ 與速率無關。
2. 質子（$q/m = 9.58 \times 10^{7}$ C/kg）在 $B = 1.0$ T 中的迴旋頻率是多少 MHz？
3. D 形盒半徑 $R = 0.30$ m、$B = 1.0$ T 時，質子能被加速到的最大動能是多少 MeV？速度約是光速的幾分之幾？
4. 若兩 D 間的電壓振幅為 100 kV，質子大約要轉幾圈才能達到最大動能？在加速器中總共走了多遠？
5. 最大動能與加速電壓 $V$ 有關嗎？$V$ 的大小會影響什麼？

## 三、實驗原理

### 1. 迴旋頻率
在均勻磁場中，羅倫茲力提供向心力：
$$ qvB = \frac{mv^2}{r} \quad\Rightarrow\quad r = \frac{mv}{qB}, \qquad T = \frac{2\pi r}{v} = \frac{2\pi m}{qB} $$
週期與速率、半徑都無關，因此迴旋頻率 $f_c = qB/(2\pi m)$ 是固定的。

### 2. 共振加速
兩個 D 形盒之間加上頻率為 $f_c$ 的交流電壓 $V\cos(2\pi f_c t)$。粒子在 D 盒內部（導體屏蔽，電場為零）只受磁力，走半圈需時 $T/2$；這時電壓正好反向，粒子穿越間隙時又被加速一次。每圈穿越兩次，若都在電壓峰值附近：
$$ \Delta K_{turn} = 2qV $$

### 3. 半徑與動能
$$ r = \frac{\sqrt{2mK}}{qB} \propto \sqrt K $$
動能等量增加時，相鄰軌道的間距越往外越小。粒子到達 D 盒邊緣 $R$ 時被引出，最大動能
$$ K_{max} = \frac{(qBR)^2}{2m} $$
與加速電壓無關；電壓只決定要轉幾圈：$N \approx K_{max}/(2qV)$。

### 4. 頻率不匹配與失步
若交流頻率為 $f_{rf} = f_c(1 + \epsilon)$，每半圈 RF 相位就多走 $\pi\epsilon$。第 $n$ 次穿越時相位偏離峰值約 $n\pi\epsilon$，獲得的能量為 $qV\cos(n\pi\epsilon)$。相位偏離超過 90° 後粒子反而被減速。把各次增益加總，可估計失步時能達到的最高動能
$$ K_{peak} \approx \frac{qV}{\pi\lvert\epsilon\rvert} $$
因此要把粒子加速到 $K_{max}$，頻率誤差必須小於約 $qV/(\pi K_{max})$。這個估計忽略了粒子離開離子源時已有的初始動能與加總的離散效應，實測的最高動能通常比它高約 10%–30%（頻率誤差越大，偏高越多）。

### 5. 相對論極限
當動能接近 $mc^2$ 的百分之幾時，$m$ 須換成 $\gamma m$，迴旋頻率隨能量下降，粒子會逐漸與固定頻率的 RF 失步。這就是傳統迴旋加速器只能把質子加速到約 20 MeV 的原因；更高能量需要同步迴旋加速器（降低 RF 頻率）或等時性迴旋加速器（讓 $B$ 隨半徑增加）。

### 6. 本模擬
- 粒子：質子；D 形盒半徑 $R = 0.30$ m；磁場 $B$ 垂直紙面向外，質子順時針旋轉。
- 間隙中的電場取平滑的高斯分布（寬約 2.4 cm），其線積分等於兩 D 間的電壓 $V\cos(2\pi f_{rf}t)$。
- 運動方程（非相對論）以四階 Runge–Kutta 法積分。物理時間以 ns 計，畫面「慢動作」播放：模擬時鐘 1 s 對應 50 ns。
- 每次注入時，程式先試算第一個半圈並自動調整 RF 的初始相位，使粒子（在 ε = 0 時）每次穿越間隙都恰好遇到電壓峰值。離子源略為偏離中心（約第一圈半徑的 0.39 倍），讓螺旋軌道的中心落在 D 盒中心，引出半徑才會等於 $R$。
- 每次穿越間隙中線時量測：穿越時刻、RF 相位、該半圈的直徑（得半徑）與 D 盒內的動能。同方向相鄰兩次穿越的時間差即實測軌道週期。
- 粒子半徑超過 $R$ 時被引出，稍停後重新從中心的離子源注入；若動能已從最高值下降 35% 以上，判定為「失去同步」，同樣重新注入。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 磁場 B | 0.5 至 1.5 T | 決定迴旋頻率與最大動能 |
| 間隙電壓 V | 20 至 200 kV | 每次穿越最多獲得 $qV$ |
| 頻率偏差 ε | −3% 至 +3% | RF 頻率 = $f_c(1 + \epsilon)$ |
| **重新注入** | 按鈕 | 從離子源重新開始 |

- 左方：兩個 D 形盒（俯視圖）。紅色代表目前電位較高的 D、藍色較低，顏色深淺表示電壓大小；淡灰色點表示磁場（⊙ 向外）。藍綠色曲線為粒子軌跡。
- 右上：動能 $K$ 對時間，虛線為完全同步時的理想值 $2qV \times$ 圈數。
- 右中：每半圈量得的半徑 $r$ 對 $\sqrt K$，直線為理論 $\sqrt{2mK}/(qB)$。
- 右下：每次穿越間隙時 RF 相位偏離峰值的角度；超過 ±90° 粒子便被減速。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：迴旋頻率與速率無關（B = 1.0 T、V = 100 kV、ε = 0）
在加速過程中的不同時刻按「＋ 記錄一列」：

| 圈數 | 動能 $K$ (MeV) | 速率 $v/c$ | 實測軌道頻率 (MHz) | 理論 $qB/2\pi m$ (MHz) |
|---|---|---|---|---|
| 2 | | | | |
| 8 | | | | |
| 15 | | | | |
| 20 | | | | |

### 步驟 B：每圈增益與引出能量
| B (T) | V (kV) | 實測每圈 $\Delta K$ (keV) | $2qV$ (keV) | 實測引出動能 (MeV) | $(qBR)^2/2m$ (MeV) | 實測圈數 | $K_{max}/2qV$ |
|---|---|---|---|---|---|---|---|
| 1.0 | 100 | | | | | | |
| 1.0 | 50 | | | | | | |
| 0.6 | 100 | | | | | | |
| 1.4 | 100 | | | | | | |

以引出動能對 $B^2$ 作圖，應為過原點的直線。

### 步驟 C：半徑與動能
由右中圖或數據表取 6 組（$K$, $r$），以 $r$ 對 $\sqrt K$ 作圖並求斜率，與 $\sqrt{2m}/(qB)$ 比較。

### 步驟 D：失去同步（B = 1.0 T、V = 100 kV）
| ε | 本次最高動能 (MeV) | 理論 $qV/(\pi\lvert\epsilon\rvert)$ (MeV) | 能否引出 |
|---|---|---|---|
| 0.3% | | | |
| 0.6% | | | |
| 1.0% | | | |
| 2.0% | | | |
| −1.0% | | | |

## 六、實驗探究問題

1. 為什麼 D 形盒內部沒有電場？如果沒有這個屏蔽，粒子會怎樣？
2. 加倍間隙電壓，引出動能會改變嗎？什麼會改變？那為什麼實際的迴旋加速器還是希望電壓高一點？（提示：圈數越多，與殘餘氣體碰撞與失步的機會越多。）
3. 步驟 D 中，ε 為正或負時，相位往不同方向漂移，但最高動能相同。為什麼？
4. 要用同一台迴旋加速器加速 α 粒子（$q = 2e$、$m \approx 4m_p$），RF 頻率要如何調整？引出動能是質子的幾倍？
5. 若要把質子加速到 500 MeV（約 $0.5mc^2$），迴旋頻率會下降多少百分比？為何台灣的質子治療中心使用等時性迴旋加速器或同步加速器？

## 七、誤差來源與模型限制

- 非相對論模型：本模擬中最大動能約 10 MeV 以下，相對論修正約 1%，已予忽略（第三節第 5 點）。
- 粒子穿越間隙需要時間，電壓在這段時間內持續變化（渡越時間效應），因此實際每次增益略小於 $qV$，尤其在最初幾圈速度很慢時。
- 實測半徑取「半圈直徑的一半」，各半圈的圓心不完全在原點，因此半徑與 $\sqrt K$ 的關係在小半徑處略有偏差。
- 真實的迴旋加速器需要讓磁場隨半徑略為減弱以提供垂直方向的聚焦（弱聚焦），並使用偏轉電極把粒子束引出；本模擬只考慮平面運動。

## 八、延伸挑戰

1. 加入相對論質量 $\gamma m$，觀察高能時軌道頻率下降而失步；再讓 RF 頻率隨時間下降（同步迴旋加速器），重新達成同步。
2. 同時注入多個在不同 RF 相位出發的粒子，觀察相位穩定區與「束團」的形成。
3. 讓磁場隨半徑增加 $B(r) = B_0\gamma(r)$，模擬等時性迴旋加速器。

## 九、延伸閱讀

- E. O. Lawrence, M. S. Livingston, "The production of high speed light ions without the use of high voltages", *Physical Review* 40, 19 (1932)
- E. O. Lawrence, Nobel Lecture "The evolution of the cyclotron" (1951)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Magnetic Fields〉章：迴旋加速器與同步加速器
- H. D. Young, R. A. Freedman, *University Physics*,〈Magnetic Field and Magnetic Forces〉章
- S. Y. Lee, *Accelerator Physics*（4th ed.），Ch. 2：迴旋加速器與相位穩定
`;

const cyclotron: ExampleDef = {
  id: 'cyclotron',
  category: '電磁學',
  difficulty: '進階',
  listDescription: '質子在兩個 D 形盒間被交流電壓反覆加速、在均勻磁場中螺旋向外：量測與速率無關的迴旋頻率 qB/2πm、每圈增益 2qV、r ∝ √K 與引出動能 (qBR)²/2m，並調整頻率偏差觀察失步。',
  description: cyclotronHandout,
  info: { title: '迴旋加速器', author: '', keywords: '', abstract: '' },
  variables: doubles('cy', [
    ['B', '1.0', '磁場（T），垂直紙面向外'],
    ['Vg', '100', '間隙電壓振幅（kV）'],
    ['dmis', '0', 'RF 頻率偏差 ε（%）'],
    ['runN', '0', '重新注入計數（按鈕用）'],
    ['qm', '9.5788332e7', '質子荷質比 q/m（C/kg）'],
    ['Rd', '0.3', 'D 形盒半徑（m）'],
    ['ag', '0.012', '間隙電場高斯分布寬度參數（m）'],
    ['SM', '50', '慢動作倍率：模擬時鐘 1 s = SM ns'],
    ['x', '0', '位置 x（m）'],
    ['y', '0', '位置 y（m）'],
    ['vx', '0', '速度 vx（m/ns）'],
    ['vy', '0', '速度 vy（m/ns）'],
    ['tau', '0', '物理時間（ns）'],
    ['wrf', '0', 'RF 角頻率（rad/ns）'],
    ['phi0', '0', 'RF 初始相位（rad，注入時自動校準）'],
    ['fc', '0', '理論迴旋頻率 qB/2πm（MHz）'],
    ['frf', '0', 'RF 頻率（MHz）'],
    ['KE', '0', '動能（MeV）'],
    ['beam', '0', '狀態：0 加速中、1 已引出、2 失去同步'],
    ['fmeas', '0', '實測軌道頻率（MHz）'],
    ['dKturn', '0', '實測上一圈的動能增益（keV）'],
    ['phase', '0', '上次穿越間隙時 RF 相位偏離峰值（°）'],
    ['rMeas', '0', '實測半圈半徑（m）'],
    ['KD', '0', '該半圈在 D 盒內的動能（MeV）'],
    ['nTurn', '0', '本次已轉圈數'],
    ['Kpeak', '0', '本次最高動能（MeV）'],
    ['Kexit', '0', '實測引出動能（MeV）'],
    ['nExit', '0', '引出時的圈數'],
    ['Kexth', '0', '理論引出動能 (qBR)²/2m（MeV）'],
  ]),
  odePages: [{
    id: 'cy-ode', name: '羅倫茲力（物理時間 ns，乘 SM 慢動作）', method: 'RungeKutta', increment: '0.001', comment: 'a = (q/m)(E + v×B)；v 以 m/ns 計，故磁力項乘 1e-9、電力項乘 1e-18',
    rates: [
      { state: 'x', expression: 'SM * vx' },
      { state: 'y', expression: 'SM * vy' },
      { state: 'vx', expression: 'SM * qm * (1e-18 * (beam < 0.5 ? Vg * 1000 * Math.cos(wrf * tau + phi0) * Math.exp(-x * x / (ag * ag)) / (ag * Math.sqrt(Math.PI)) : 0) + 1e-9 * B * vy)' },
      { state: 'vy', expression: '-SM * qm * 1e-9 * B * vx' },
      { state: 'tau', expression: 'SM' },
    ],
  }],
  constraintPages: [{
    id: 'cy-con', name: '注入、穿越間隙量測與引出', comment: '每次穿越 x = 0 時記錄時間、RF 相位與半圈直徑；r > R 時引出',
    code: String.raw`fc = qm * B / (2 * Math.PI) / 1e6;
frf = fc * (1 + dmis / 100);
wrf = 2 * Math.PI * frf * 1e-3;
Kexth = qm * B * B * Rd * Rd / 2 / 1e6;
KE = 0.5e12 * (vx * vx + vy * vy) / qm;
// 校準 RF 初始相位：先試算第一個半圈，使粒子第一次回到間隙中線時恰好遇到電壓峰值
function calib() {
  var p0 = 0, nrm = 1e-15 * Vg / (ag * Math.sqrt(Math.PI));
  function ax(px, pvy, pt) { return qm * (nrm * Math.cos(wrf * pt + p0) * Math.exp(-px * px / (ag * ag)) + 1e-9 * B * pvy); }
  function ay(pvx) { return -qm * 1e-9 * B * pvx; }
  for (var it = 0; it < 4; it++) {
    var sx = 0, svx = 0, svy = 0, st = 0, hh = 0.02, went = false, tcr = -1;
    for (var s = 0; s < 40000; s++) {
      var k1x = svx, k1u = ax(sx, svy, st), k1v = ay(svx);
      var k2x = svx + 0.5 * hh * k1u, k2u = ax(sx + 0.5 * hh * k1x, svy + 0.5 * hh * k1v, st + 0.5 * hh), k2v = ay(svx + 0.5 * hh * k1u);
      var k3x = svx + 0.5 * hh * k2u, k3u = ax(sx + 0.5 * hh * k2x, svy + 0.5 * hh * k2v, st + 0.5 * hh), k3v = ay(svx + 0.5 * hh * k2u);
      var k4x = svx + hh * k3u, k4u = ax(sx + hh * k3x, svy + hh * k3v, st + hh), k4v = ay(svx + hh * k3u);
      var nx = sx + hh / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
      svx += hh / 6 * (k1u + 2 * k2u + 2 * k3u + k4u); svy += hh / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
      if (sx > 3 * ag) went = true;
      if (went && nx < 0) { tcr = st + hh * sx / (sx - nx); break; }
      sx = nx; st += hh;
    }
    if (tcr < 0) break;
    var er = wrf * tcr + p0 - Math.PI;
    er -= 2 * Math.PI * Math.round(er / (2 * Math.PI));
    p0 -= er;
  }
  return p0;
}
function inject() {
  phi0 = calib();
  x = 0; y = 0.39 * Math.sqrt(2 * Vg * 1000 / qm) / B; vx = 0; vy = 0; tau = 0; beam = 0; nTurn = 0; Kpeak = 0;
  _v._path = [[x, y]]; _v._kt = [[0, 0]]; _v._rk = []; _v._ph = [];
  _v._last = null; _v._yc = undefined; _v._tR = undefined; _v._kd = 0; _v._kdL = undefined; _v._nh = 0; _v._cnt = 0;
}
var sig = B + '|' + Vg + '|' + dmis + '|' + runN;
if (_v._sig !== sig) {
  _v._sig = sig; t = 0; _v._tl = 0;
  inject();
  fmeas = 0; dKturn = 0; phase = 0; rMeas = 0; KD = 0; Kexit = 0; nExit = 0;
}
if (t > _v._tl) {
  _v._tl = t;
  if (beam > 0.5) {
    x = _v._park[0]; y = _v._park[1]; vx = 0; vy = 0; KE = 0;
    if (t - _v._tw > 2) inject();
  } else {
    var lp = _v._last;
    if (Math.abs(x) > 3 * ag) _v._kd = KE;
    if (KE > Kpeak) Kpeak = KE;
    if (lp && lp.x !== 0 && (lp.x < 0) !== (x < 0)) {
      var fr = -lp.x / (x - lp.x), tcx = lp.tau + fr * (tau - lp.tau), ycx = lp.y + fr * (y - lp.y);
      var dir = x > lp.x ? 1 : -1;
      var ph = wrf * tcx + phi0 - (dir > 0 ? 0 : Math.PI);
      ph = ph - 2 * Math.PI * Math.round(ph / (2 * Math.PI));
      phase = ph * 180 / Math.PI;
      _v._nh = _v._nh + 1; _v._ph.push([_v._nh, phase]);
      if (_v._yc !== undefined && _v._kd > 0) {
        rMeas = Math.abs(ycx - _v._yc) / 2; KD = _v._kd;
        _v._rk.push([Math.sqrt(KD), rMeas]);
      }
      _v._yc = ycx;
      if (dir > 0) {
        if (_v._tR !== undefined) fmeas = 1000 / (tcx - _v._tR);
        _v._tR = tcx;
        nTurn = nTurn + 1;
        if (_v._kdL !== undefined) dKturn = 1000 * (_v._kd - _v._kdL);
        _v._kdL = _v._kd;
      }
    }
    _v._last = { x: x, y: y, tau: tau };
    _v._cnt = _v._cnt + 1;
    var lastP = _v._path[_v._path.length - 1];
    if ((x - lastP[0]) * (x - lastP[0]) + (y - lastP[1]) * (y - lastP[1]) > 4e-6) _v._path.push([x, y]);
    if (_v._path.length > 9000) _v._path.splice(0, _v._path.length - 9000);
    if (_v._cnt % 20 === 0) _v._kt.push([tau, KE]);
    if (x * x + y * y > Rd * Rd) {
      beam = 1; Kexit = KE; nExit = nTurn; _v._tw = t; _v._park = [x, y]; _v._exitV = [vx, vy];
      _v._kt.push([tau, KE]);
    } else if (_v._nh > 4 && Kpeak - KE > 0.35 * Kpeak) {
      beam = 2; _v._tw = t; _v._park = [x, y]; _v._exitV = null;
    }
  }
} else if (t < _v._tl) {
  _v._tl = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('cy-dp', 640, 470, [0, 10, 0, 10]),
    slider('cy-s-B', 'B', 0.5, 1.5, 0.05, '磁場 B (T)'),
    slider('cy-s-V', 'Vg', 20, 200, 5, '間隙電壓 V (kV)'),
    slider('cy-s-d', 'dmis', -3, 3, 0.1, '頻率偏差 ε (%)'),
    button('cy-b-re', '重新注入', 'runN = runN + 1;'),
    readout('cy-r-st', '狀態', '["加速中", "已引出（稍後重新注入）", "失去同步（稍後重新注入）"][Math.round(beam)]', { color: C.ink, group: '粒子' }),
    readout('cy-r-K', '目前動能 K', 'beam > 0.5 ? "—" : KE', { unit: 'MeV', digits: 3, color: C.red, group: '粒子' }),
    readout('cy-r-n', '本次圈數', 'nTurn', { digits: 0, color: C.ink, group: '粒子' }),
    readout('cy-r-fm', '實測軌道頻率', 'fmeas > 0 ? fmeas : "量測中…"', { unit: 'MHz', digits: 3, color: C.blue, group: '頻率' }),
    readout('cy-r-fc', '理論 qB/2πm', 'fc', { unit: 'MHz', digits: 3, color: C.muted, group: '頻率' }),
    readout('cy-r-frf', 'RF 頻率 f_c(1+ε)', 'frf', { unit: 'MHz', digits: 3, color: C.amber, group: '頻率' }),
    readout('cy-r-dK', '實測上一圈增益 ΔK', 'nTurn > 1 || Kexit > 0 ? dKturn : "…"', { unit: 'keV', digits: 1, color: C.red, group: '每圈能量增益' }),
    readout('cy-r-dKt', '理論最大 2qV', '2 * Vg', { unit: 'keV', digits: 1, color: C.muted, group: '每圈能量增益' }),
    readout('cy-r-ph', '穿越間隙 RF 相位', 'phase', { unit: '°', digits: 1, color: C.amber, group: '每圈能量增益' }),
    readout('cy-r-r', '實測半圈半徑 r', 'rMeas > 0 ? rMeas : "…"', { unit: 'm', digits: 4, color: C.teal, group: '半徑與動能' }),
    readout('cy-r-rt', '理論 √(2mK)/qB', 'KD > 0 ? Math.sqrt(2 * KD * 1e6 / qm) / B : "…"', { unit: 'm', digits: 4, color: C.muted, group: '半徑與動能' }),
    readout('cy-r-KD', '該半圈動能 K', 'KD', { unit: 'MeV', digits: 3, color: C.teal, group: '半徑與動能' }),
    readout('cy-r-Ke', '實測引出動能', 'Kexit > 0 ? Kexit : "尚未引出"', { unit: 'MeV', digits: 3, color: C.red, group: '引出' }),
    readout('cy-r-Kt', '理論 (qBR)²/2m', 'Kexth', { unit: 'MeV', digits: 3, color: C.muted, group: '引出' }),
    readout('cy-r-ne', '實測引出圈數', 'Kexit > 0 ? nExit : "…"', { digits: 0, color: C.blue, group: '引出' }),
    readout('cy-r-nt', '理論圈數 K_max/2qV', 'Kexth * 1000 / (2 * Vg)', { digits: 1, color: C.muted, group: '引出' }),
    readout('cy-r-Kp', '本次最高動能', 'Kpeak', { unit: 'MeV', digits: 3, color: C.purple, group: '同步' }),
    readout('cy-r-Kpt', '失步理論 qV/(π|ε|)', 'Math.abs(dmis) > 0.001 ? Vg / 1000 / (Math.PI * Math.abs(dmis) / 100) : "∞（完全同步）"', { unit: 'MeV', digits: 3, color: C.muted, group: '同步' }),
    customDraw('cy-draw', 'D 形盒、軌跡與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var cx = 226, cy = 238, Rp = 210, Rd = vars.Rd, sc = Rp / Rd, ag = vars.ag, gp = ag * sc;
var cph = Math.cos(vars.wrf * vars.tau + vars.phi0), Vg = vars.Vg, run = vars.beam < 0.5;
if (!run) cph = 0;
function X(v) { return cx + v * sc; }
function Y(v) { return cy - v * sc; }
// D 形盒
function dee(side, val) {
  var a = Math.max(0, Math.min(1, Math.abs(val)));
  var col = val >= 0 ? "209,73,91" : "47,111,176";
  ctx.fillStyle = "rgba(" + col + "," + (0.06 + 0.22 * a).toFixed(3) + ")";
  ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2;
  ctx.beginPath();
  if (side < 0) { ctx.moveTo(cx - gp, cy - Rp); ctx.arc(cx - gp, cy, Rp, -Math.PI / 2, Math.PI / 2, true); }
  else { ctx.moveTo(cx + gp, cy - Rp); ctx.arc(cx + gp, cy, Rp, -Math.PI / 2, Math.PI / 2, false); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(" + col + "," + (0.3 + 0.7 * a).toFixed(2) + ")"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(a < 0.05 ? "" : (val >= 0 ? "+" : "−"), cx + side * (Rp * 0.78), cy - Rp * 0.6);
}
dee(-1, cph); dee(1, -cph);
ctx.fillStyle = "rgba(43,45,49,0.12)";
for (var gx = -Rp + 15; gx < Rp; gx += 30) for (var gy = -Rp + 15; gy < Rp; gy += 30) {
  if (gx * gx + gy * gy < (Rp - 8) * (Rp - 8)) { ctx.beginPath(); ctx.arc(cx + gx, cy + gy, 1.6, 0, 2 * Math.PI); ctx.fill(); }
}
ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
ctx.fillText("D₁", cx - Rp * 0.78, cy + Rp * 0.75); ctx.fillText("D₂", cx + Rp * 0.78, cy + Rp * 0.75);
ctx.textAlign = "left"; ctx.fillText("B ⊙（向外）", 8, 16);
// 間隙電場箭頭
if (run && Math.abs(cph) > 0.1) {
  var ec = "rgba(185,122,30," + (0.3 + 0.6 * Math.abs(cph)).toFixed(2) + ")";
  for (var ey = -150; ey <= 150; ey += 75) arrow(cx - 10 * Math.sign(cph), cy + ey, cx + 10 * Math.sign(cph), cy + ey, ec, 2);
}
// 軌跡
var path = vars._path || [];
ctx.strokeStyle = "rgba(42,157,143,0.85)"; ctx.lineWidth = 1.3; ctx.beginPath();
path.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); });
if (run) ctx.lineTo(X(vars.x), Y(vars.y));
ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("離子源", cx + 5, cy + 14);
var pxp = run ? X(vars.x) : X((vars._park || [0, 0])[0]), pyp = run ? Y(vars.y) : Y((vars._park || [0, 0])[1]);
var glow = ctx.createRadialGradient(pxp, pyp, 0, pxp, pyp, 9);
glow.addColorStop(0, "rgba(209,73,91,1)"); glow.addColorStop(1, "rgba(209,73,91,0)");
ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(pxp, pyp, 9, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#D1495B"; ctx.beginPath(); ctx.arc(pxp, pyp, 3.5, 0, 2 * Math.PI); ctx.fill();
if (vars.beam > 0.5 && vars.beam < 1.5 && vars._exitV) {
  var ev = vars._exitV, el = Math.sqrt(ev[0] * ev[0] + ev[1] * ev[1]) || 1;
  arrow(pxp, pyp, pxp + 46 * ev[0] / el, pyp - 46 * ev[1] / el, "#D1495B", 2.5);
  ctx.fillStyle = "#D1495B"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("引出！", pxp + 30 * ev[0] / el, pyp - 30 * ev[1] / el - 10);
} else if (vars.beam > 1.5) {
  ctx.fillStyle = "#D1495B"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("失去同步", cx, cy - 22);
}
// ── 右側圖表 ──
var K = vars.Kexth, Tc = 1000 / Math.max(1e-9, vars.fc);
var kt = vars._kt || [], tauEnd = Math.max(Tc * K * 1000 / (2 * Vg) * 1.1, vars.tau, 1);
miniPlot({ x: 450, y: 4, w: 186, h: 150 }, [
  { pts: [[0, 0], [Tc * K * 1000 / (2 * Vg), K]], color: "#9AA0A6", dash: [4, 3], width: 1.2, label: "理想" },
  { pts: kt, color: "#D1495B", width: 1.8, label: "實測" },
], { title: "動能 K (MeV)", xlabel: "ns", xmin: 0, xmax: tauEnd, ymin: 0, ymax: K * 1.12 });
var rk = vars._rk || [], sK = Math.sqrt(K), lineR = [[0, 0], [sK, Math.sqrt(2 * K * 1e6 / vars.qm) / vars.B]];
miniPlot({ x: 450, y: 160, w: 186, h: 150 }, [
  { pts: lineR, color: "#9AA0A6", width: 1.2, label: "理論" },
  { pts: [], color: "#2A9D8F", dots: rk.slice(-60), label: "● 實測" },
], { title: "r (m) 對 √K", xlabel: "√MeV", xmin: 0, xmax: sK * 1.08, ymin: 0, ymax: Rd * 1.08 });
var phs = vars._ph || [], nmax = Math.max(10, phs.length ? phs[phs.length - 1][0] : 0);
var gP = miniPlot({ x: 450, y: 316, w: 186, h: 150 }, [
  { pts: [[0, 90], [nmax, 90]], color: "#B8B4AA", dash: [3, 3], width: 1 },
  { pts: [[0, -90], [nmax, -90]], color: "#B8B4AA", dash: [3, 3], width: 1 },
  { pts: [], color: "#B97A1E", dots: phs.slice(-120), label: "● 實測" },
], { title: "穿越時 RF 相位 (°)", xlabel: "次", xmin: 0, xmax: nmax, ymin: -180, ymax: 180 });
ctx.fillStyle = "#6B6F76"; ctx.font = "9px sans-serif"; ctx.textAlign = "left";
ctx.fillText("減速區", gP.px(0) + 3, gP.py(135) + 3); ctx.fillText("減速區", gP.px(0) + 3, gP.py(-135) + 3);
`),
  ],
};

const ELECTROMAGNETISM2_EXAMPLES: ExampleDef[] = [rlc, cyclotron];

export default ELECTROMAGNETISM2_EXAMPLES;

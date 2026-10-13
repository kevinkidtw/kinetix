import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：熱學與統計（二）
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 卡諾循環與熱機效率
// ─────────────────────────────────────────────
const carnotHandout = String.raw`# 🔥 卡諾循環與熱機效率實驗講義

> 1824 年，28 歲的法國工程師薩迪・卡諾（Sadi Carnot）在《論火的動力》中提出一個驚人的結論：熱機能把多少熱轉成功，上限只取決於兩個熱庫的溫度，與使用蒸汽、空氣或任何工作物質都無關。這個想法後來成為熱力學第二定律與「熵」概念的起點。

## 一、實驗目的

1. 觀察理想氣體卡諾循環的四個準靜態過程（等溫膨脹、絕熱膨脹、等溫壓縮、絕熱壓縮）中 $P$、$V$、$T$ 的變化，並在 $P$–$V$ 圖上辨認等溫線與絕熱線。
2. 以數值積分 $W = \oint P\ dV$ 求出每循環的淨功，驗證卡諾效率 $\eta = W/Q_H = 1 - T_C/T_H$。
3. 驗證 $Q_C/Q_H = T_C/T_H$，並由 $\int dQ/T$ 理解熵是狀態函數：繞一圈 $\Delta S = 0$。
4. 探討壓縮比與比熱比 $\gamma$ 如何影響每循環的功，並理解為何它們不影響效率。

## 二、課前預報

1. 證明理想氣體等溫過程中 $Q = W = nRT\ln(V_f/V_i)$，並說明為何內能不變。
2. 由 $dU = nC_V dT = -P\ dV$ 推導絕熱過程 $TV^{\gamma-1} = $ 常數，再改寫成 $PV^{\gamma} = $ 常數。單原子氣體 $\gamma = 5/3$，雙原子氣體（室溫）$\gamma = 7/5$。
3. 對卡諾循環的兩條絕熱線使用 $TV^{\gamma-1} = $ 常數，證明 $V_3/V_2 = V_4/V_1$，因此兩段等溫過程的體積比相同。
4. 取 $T_H = 600$ K、$T_C = 300$ K，卡諾效率是多少？若 $n = 0.1$ mol、$V_2/V_1 = 3$，每循環吸熱 $Q_H$ 與淨功 $W$ 各為多少焦耳？
5. 為什麼 $P$–$V$ 圖上封閉曲線圍出的面積就是淨功？在 $T$–$S$ 圖上卡諾循環會是什麼形狀？

## 三、實驗原理

### 1. 四個準靜態過程
以狀態 1（體積最小、溫度 $T_H$）為起點：

| 過程 | 條件 | 功 $W$（氣體對外） | 吸熱 $Q$ |
|---|---|---|---|
| ① 1→2 等溫膨脹 | $T = T_H$ | $nRT_H\ln(V_2/V_1)$ | $Q_H = W_{12}$ |
| ② 2→3 絕熱膨脹 | $TV^{\gamma-1}$ 不變 | $nC_V(T_H - T_C)$ | 0 |
| ③ 3→4 等溫壓縮 | $T = T_C$ | $-nRT_C\ln(V_3/V_4)$ | $-Q_C$ |
| ④ 4→1 絕熱壓縮 | $TV^{\gamma-1}$ 不變 | $-nC_V(T_H - T_C)$ | 0 |

兩段絕熱過程的功大小相等、正負相反，互相抵消。

### 2. 卡諾效率
因為 $V_2/V_1 = V_3/V_4$，
$$ \frac{Q_C}{Q_H} = \frac{T_C}{T_H}, \qquad \eta = \frac{W}{Q_H} = 1 - \frac{Q_C}{Q_H} = 1 - \frac{T_C}{T_H} $$
效率只和兩個熱庫的溫度有關：與氣體種類（$\gamma$）、氣體量、壓縮比都無關。卡諾定理進一步指出：在相同兩熱庫之間運作的任何熱機，效率都不可能超過它。

### 3. 熵是狀態函數
熵的定義 $dS = dQ_{rev}/T$。對理想氣體
$$ S = nC_V\ln T + nR\ln V + \text{常數} $$
- 等溫膨脹：$\Delta S_1 = Q_H/T_H = nR\ln(V_2/V_1) \gt 0$
- 絕熱過程：$dQ = 0$，故 $\Delta S = 0$（「等熵」過程）
- 等溫壓縮：$\Delta S_3 = -Q_C/T_C$

繞一圈 $\oint dQ/T = 0$，這正是 $Q_C/Q_H = T_C/T_H$ 的另一種說法。在 $T$–$S$ 圖上卡諾循環是一個矩形，面積 $(T_H - T_C)\Delta S_1$ 同樣等於淨功。

### 4. 壓縮比的限制
定義壓縮比 $r = V_{max}/V_{min} = V_3/V_1$。兩段絕熱過程本身就需要
$$ r_{min} = \left(\frac{T_H}{T_C}\right)^{1/(\gamma-1)} $$
的體積比，剩下的才留給等溫段：$V_2/V_1 = r/r_{min}$。因此在固定壓縮比下，溫差越大，效率越高，但等溫段越短、每循環的功可能反而變小。若 $r \le r_{min}$，卡諾循環根本無法完成；本模擬此時會自動把等溫膨脹比提高到 1.25，並在儀表板顯示實際使用的壓縮比。

### 5. 本模擬
- 工作物質：$n = 0.1$ mol 理想氣體，$V_1 = 1.00$ L。壓力單位 kPa、體積單位 L，而 1 kPa·L = 1 J。
- 每個過程花 3 s，活塞平滑地加速、減速；過程被視為準靜態（每一瞬間氣體都處於平衡態）。
- 每一個時間步以梯形法累加：$\Delta W = \bar P\ \Delta V$、$\Delta Q = nC_V\Delta T + \bar P\ \Delta V$、$\Delta S = \Delta Q/\bar T$。儀表板顯示的 $Q_H$、$Q_C$、$W$、$\Delta S$ 都是這樣「量」出來的，再與公式比較。
- 汽缸中的小點代表氣體分子，運動速率正比於 $\sqrt T$。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 高溫熱庫 T_H | 500 至 1000 K | 等溫膨脹時氣體接觸的熱庫 |
| 低溫熱庫 T_C | 200 至 450 K | 等溫壓縮時氣體接觸的熱庫 |
| 壓縮比 r | 3 至 30 | $V_{max}/V_{min}$ |
| 自由度 f | 3 或 5 | 3 = 單原子（γ = 5/3），5 = 雙原子（γ = 7/5） |

- 左方：汽缸與活塞。底座為紅色（高溫熱庫）、藍色（低溫熱庫）或灰色（絕熱墊）；箭頭表示熱流方向。下方列出四個過程，目前的過程以底色標示。
- 右上：$P$–$V$ 圖。灰色虛線為理論循環，彩色線為本循環已走過的路徑（紅 ①、橘 ②、藍 ③、綠 ④），淡橘色區域即淨功。
- 右下：$T$–$S$ 圖，卡諾循環呈矩形。
- 改變任何滑桿會從狀態 1 重新開始。每完成一整圈，儀表板的「上一循環」數值才會更新。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：一個完整循環（T_H = 600 K、T_C = 300 K、r = 10、f = 3）
讓循環跑完至少一圈（12 s），記錄儀表板數值：

| 過程 | 實測 $Q$ (J) | 理論 $Q$ (J) | 實測 $\Delta S$ (J/K) | 理論 $\Delta S$ (J/K) |
|---|---|---|---|---|
| ① 等溫膨脹 | | | | |
| ② 絕熱膨脹 | | 0 | | 0 |
| ③ 等溫壓縮 | | | | |
| ④ 絕熱壓縮 | | 0 | | 0 |
| 整個循環 | $W$ = | | $\sum\Delta S$ = | 0 |

### 步驟 B：效率與溫度（T_H = 800 K、r = 30、f = 3）
| $T_C$ (K) | $Q_H$ (J) | $Q_C$ (J) | $W$ (J) | 實測 $\eta$ | $1 - T_C/T_H$ | $Q_C/Q_H$ |
|---|---|---|---|---|---|---|
| 200 | | | | | | |
| 250 | | | | | | |
| 300 | | | | | | |
| 350 | | | | | | |
| 400 | | | | | | |

以 $\eta$ 對 $T_C/T_H$ 作圖，應得斜率 $-1$、截距 1 的直線。

### 步驟 C：壓縮比與氣體種類（T_H = 600 K、T_C = 300 K）
| f | r | $r_{min}$ | $V_2/V_1$ | $W$ (J) | 實測 $\eta$ |
|---|---|---|---|---|---|
| 3 | 5 | | | | |
| 3 | 10 | | | | |
| 3 | 20 | | | | |
| 5 | 10 | | | | |
| 5 | 20 | | | | |

效率是否改變？每循環的功如何改變？找出 f = 5 時循環剛好無法完成的壓縮比。

## 六、實驗探究問題

1. 步驟 C 中，雙原子氣體在相同壓縮比下做的功比單原子氣體少。請用 $r_{min}$ 的公式解釋原因。
2. 若要提高卡諾熱機的效率，提高 $T_H$ 100 K 與降低 $T_C$ 100 K 哪一個效果較大？為什麼？
3. 卡諾熱機每一段都是準靜態的，因此「無限慢」，功率為零。真實熱機必須在有限時間內傳熱，這會讓效率變高還是變低？
4. 把循環反向運轉（逆時針）就成為冷氣機或熱泵。寫出卡諾冷氣機的性能係數 $K = Q_C/W$，並說明為何室外越熱，冷氣越耗電。
5. 為什麼兩段絕熱過程的功正好抵消？若工作物質不是理想氣體，這個結論還成立嗎？卡諾效率還成立嗎？

## 七、誤差來源與模型限制

- 數值積分採梯形法，時間步長 0.01 s，絕熱段的 $\sum\Delta S$ 理論上為 0，實測值的大小（通常小於 $10^{-5}$ J/K）反映了積分誤差。
- 假設過程完全準靜態、活塞無摩擦、汽缸壁完全絕熱，並忽略熱庫溫度在傳熱時的變化。
- 理想氣體模型：忽略分子間作用力與分子體積；雙原子氣體的 $\gamma$ 取室溫值 7/5，未考慮高溫時振動自由度被激發。
- 真實熱機（汽油引擎、蒸汽渦輪）的循環並非卡諾循環，效率遠低於卡諾極限。

## 八、延伸挑戰

1. 改寫模擬為奧圖循環（兩段絕熱加兩段等容），比較相同壓縮比下的效率 $1 - r^{1-\gamma}$ 與卡諾效率。
2. 讓等溫段的傳熱需要溫差：氣體溫度略低於 $T_H$（或略高於 $T_C$），計算熱庫與氣體的總熵變，驗證不可逆過程使宇宙熵增加。
3. 研究庫松–阿爾伯恩（Curzon–Ahlborn）效率 $\eta = 1 - \sqrt{T_C/T_H}$：它是在「最大輸出功率」下的效率，與真實發電廠的效率相當接近。

## 九、延伸閱讀

- S. Carnot, *Réflexions sur la puissance motrice du feu et sur les machines propres à développer cette puissance* (1824)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Entropy and the Second Law of Thermodynamics〉章
- H. D. Young, R. A. Freedman, *University Physics*,〈The Second Law of Thermodynamics〉章
- D. V. Schroeder, *An Introduction to Thermal Physics*, Ch. 4〈Engines and Refrigerators〉
- M. W. Zemansky, R. H. Dittman, *Heat and Thermodynamics*（7th ed.），Ch. 6–8
- F. L. Curzon, B. Ahlborn, "Efficiency of a Carnot engine at maximum power output", *American Journal of Physics* 43, 22 (1975)
`;

const carnot: ExampleDef = {
  id: 'carnot',
  category: '熱學與統計',
  difficulty: '基礎',
  listDescription: '理想氣體活塞依序經過等溫膨脹、絕熱膨脹、等溫壓縮、絕熱壓縮：即時描出 P–V 與 T–S 圖，以 ∮P dV 量出淨功，驗證 η = 1 − T_C/T_H 與循環熵變為零。',
  description: carnotHandout,
  info: { title: '卡諾循環與熱機效率', author: '', keywords: '', abstract: '' },
  variables: doubles('cn', [
    ['TH', '600', '高溫熱庫溫度（K）'],
    ['TC', '300', '低溫熱庫溫度（K）'],
    ['rc', '10', '壓縮比設定 V_max/V_min'],
    ['fdof', '3', '自由度 f（3 = 單原子、5 = 雙原子）'],
    ['gam', '1.6667', '比熱比 γ = (f+2)/f'],
    ['V', '1', '氣體體積（L）'],
    ['P', '0', '氣體壓力（kPa）'],
    ['T', '600', '氣體溫度（K）'],
    ['S', '0', '氣體熵（相對狀態 1，J/K）'],
    ['stage', '0', '目前過程（0–3）'],
    ['rMin', '1', '兩段絕熱所需的最小壓縮比'],
    ['rEff', '1', '實際使用的壓縮比'],
    ['QHth', '0', '理論 Q_H（J）'],
    ['QCth', '0', '理論 Q_C（J）'],
    ['dSth', '0', '理論等溫膨脹熵變 nR ln(V2/V1)（J/K）'],
    ['effC', '0', '卡諾效率 1 − T_C/T_H'],
    ['ncyc', '0', '已完成的循環數'],
    ['QH', '0', '上一循環實測吸熱 Q_H（J）'],
    ['QC', '0', '上一循環實測放熱 Q_C（J）'],
    ['Wnet', '0', '上一循環實測淨功 ∮P dV（J）'],
    ['eff', '0', '上一循環實測效率 W/Q_H'],
    ['dS1', '0', '過程 ① 實測 ∫dQ/T（J/K）'],
    ['dS2', '0', '過程 ② 實測 ∫dQ/T（J/K）'],
    ['dS3', '0', '過程 ③ 實測 ∫dQ/T（J/K）'],
    ['dS4', '0', '過程 ④ 實測 ∫dQ/T（J/K）'],
    ['dSsum', '0', '整個循環的 ∮dQ/T（J/K）'],
    ['Wcur', '0', '本循環目前累積的功（J）'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'cn-ode', name: '時間推進', method: 'Euler', increment: '0.01', comment: '循環的狀態由約束頁依時間決定（準靜態過程）',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'cn-con', name: '卡諾循環狀態與 ∮P dV 積分', comment: '每段 3 s；以梯形法累加 ΔW = P̄ΔV、ΔQ = nC_VΔT + P̄ΔV、ΔS = ΔQ/T̄',
    code: String.raw`var nmol = 0.1, Rg = 8.314, V1 = 1.0, Tst = 3;
gam = (fdof + 2) / fdof;
var Cvm = fdof / 2 * Rg;
var sig = TH + '|' + TC + '|' + rc + '|' + fdof;
if (_v._sig !== sig || !_v._Va) {
  _v._sig = sig;
  t = 0; _v._tl = -1; _v._prev = null; _v._cyc = 0; _v._cnt = 0; ncyc = 0;
  rMin = Math.pow(TH / TC, 1 / (gam - 1));
  var iso = Math.max(1.25, rc / rMin);
  rEff = rMin * iso;
  _v._Va = [V1, V1 * iso, V1 * rEff, V1 * rMin];
  _v._Ta = [TH, TH, TC, TC];
  QHth = nmol * Rg * TH * Math.log(iso);
  QCth = nmol * Rg * TC * Math.log(iso);
  dSth = nmol * Rg * Math.log(iso);
  effC = 1 - TC / TH;
  _v._acc = { W: 0, Q: [0, 0, 0, 0], S: [0, 0, 0, 0] };
  _v._pv = [];
  QH = 0; QC = 0; Wnet = 0; eff = 0; dS1 = 0; dS2 = 0; dS3 = 0; dS4 = 0; dSsum = 0; Wcur = 0;
}
var Va = _v._Va, Ta = _v._Ta;
var ph = t / Tst, kst = Math.floor(ph) % 4, sfr = ph - Math.floor(ph);
var ease = sfr * sfr * (3 - 2 * sfr);
var Vbeg = Va[kst], Vend = Va[(kst + 1) % 4];
V = Vbeg * Math.pow(Vend / Vbeg, ease);
T = (kst === 0 || kst === 2) ? Ta[kst] : Ta[kst] * Math.pow(Vbeg / V, gam - 1);
P = nmol * Rg * T / V;
S = nmol * Cvm * Math.log(T / TH) + nmol * Rg * Math.log(V / V1);
stage = kst;
var cyc = Math.floor(t / (4 * Tst));
if (t !== _v._tl) {
  var pv = _v._prev;
  if (pv && t > _v._tl) {
    if (cyc !== _v._cyc) {
      var A = _v._acc;
      QH = A.Q[0]; QC = -A.Q[2]; Wnet = A.W; eff = QH > 0 ? Wnet / QH : 0;
      dS1 = A.S[0]; dS2 = A.S[1]; dS3 = A.S[2]; dS4 = A.S[3]; dSsum = dS1 + dS2 + dS3 + dS4;
      ncyc = ncyc + 1;
      _v._acc = { W: 0, Q: [0, 0, 0, 0], S: [0, 0, 0, 0] };
      _v._pv = [];
      _v._cyc = cyc;
    }
    var dW = 0.5 * (pv.P + P) * (V - pv.V);
    var dQ = nmol * Cvm * (T - pv.T) + dW;
    _v._acc.W += dW; _v._acc.Q[kst] += dQ; _v._acc.S[kst] += dQ / (0.5 * (T + pv.T));
    Wcur = _v._acc.W;
  }
  _v._tl = t; _v._prev = { V: V, P: P, T: T };
  _v._cnt = (_v._cnt || 0) + 1;
  if (_v._cnt % 3 === 0 || _v._pv.length === 0) _v._pv.push([V, P, kst, S, T]);
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('cn-dp', 640, 460, [0, 10, 0, 10]),
    slider('cn-s-TH', 'TH', 500, 1000, 10, '高溫熱庫 T_H (K)'),
    slider('cn-s-TC', 'TC', 200, 450, 10, '低溫熱庫 T_C (K)'),
    slider('cn-s-r', 'rc', 3, 30, 0.5, '壓縮比 r'),
    slider('cn-s-f', 'fdof', 3, 5, 2, '自由度 f（3 或 5）'),
    readout('cn-r-st', '目前過程', '["① 等溫膨脹", "② 絕熱膨脹", "③ 等溫壓縮", "④ 絕熱壓縮"][stage]', { color: C.ink, group: '目前狀態' }),
    readout('cn-r-T', '氣體溫度 T', 'T', { unit: 'K', digits: 1, color: C.red, group: '目前狀態' }),
    readout('cn-r-r', '實際壓縮比 V_max/V_min', 'rEff', { digits: 2, color: C.ink, group: '目前狀態' }),
    readout('cn-r-rmin', '絕熱段所需最小壓縮比', 'rMin', { digits: 2, color: C.muted, group: '目前狀態' }),
    readout('cn-r-QH', '實測吸熱 Q_H', 'ncyc > 0 ? QH : "第一圈進行中…"', { unit: 'J', digits: 2, color: C.red, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-QHt', '理論 nRT_H ln(V₂/V₁)', 'QHth', { unit: 'J', digits: 2, color: C.muted, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-QC', '實測放熱 Q_C', 'ncyc > 0 ? QC : "…"', { unit: 'J', digits: 2, color: C.blue, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-W', '淨功 W = ∮P dV', 'ncyc > 0 ? Wnet : "…"', { unit: 'J', digits: 2, color: C.amber, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-eff', '實測效率 W/Q_H', 'ncyc > 0 ? 100 * eff : "…"', { unit: '%', digits: 2, color: C.amber, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-effC', '卡諾效率 1 − T_C/T_H', '100 * effC', { unit: '%', digits: 2, color: C.muted, group: '上一個完整循環（實測 vs 理論）' }),
    readout('cn-r-S1', 'ΔS ① 等溫膨脹', 'ncyc > 0 ? dS1 : "…"', { unit: 'J/K', digits: 4, color: C.red, group: '熵變 ∫dQ/T（實測）' }),
    readout('cn-r-S3', 'ΔS ③ 等溫壓縮', 'ncyc > 0 ? dS3 : "…"', { unit: 'J/K', digits: 4, color: C.blue, group: '熵變 ∫dQ/T（實測）' }),
    readout('cn-r-S24', 'ΔS ②＋④ 兩段絕熱', 'ncyc > 0 ? dS2 + dS4 : "…"', { unit: 'J/K', digits: 2, color: C.teal, group: '熵變 ∫dQ/T（實測）' }),
    readout('cn-r-Ssum', '整圈 ∮dQ/T', 'ncyc > 0 ? dSsum : "…"', { unit: 'J/K', digits: 2, color: C.ink, group: '熵變 ∫dQ/T（實測）' }),
    readout('cn-r-Sth', '理論 nR ln(V₂/V₁)', 'dSth', { unit: 'J/K', digits: 4, color: C.muted, group: '熵變 ∫dQ/T（實測）' }),
    customDraw('cn-draw', '汽缸、P–V 圖與 T–S 圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var Va = vars._Va || [1, 2, 4, 2], TH = vars.TH, TC = vars.TC, gam = vars.gam, k = vars.stage;
var Vmax = Va[2], Vg = vars.V, Tg = vars.T;
var stCol = ["#D1495B", "#E9A23B", "#2F6FB0", "#2A9D8F"];
var stName = ["① 等溫膨脹", "② 絕熱膨脹", "③ 等溫壓縮", "④ 絕熱壓縮"];
var stNote = ["接觸高溫熱庫，吸熱 Q_H", "絕熱，溫度下降", "接觸低溫熱庫，放熱 Q_C", "絕熱，溫度上升"];
// ── 汽缸與活塞（左）──
var cx0 = 50, cw = 118, base = 296, hmax = 232;
var hg = Math.max(8, hmax * Vg / Vmax), ptop = base - hg;
var fr = Math.max(0, Math.min(1, (Tg - TC) / Math.max(1, TH - TC)));
ctx.fillStyle = "rgba(" + Math.round(47 + 162 * fr) + "," + Math.round(111 - 38 * fr) + "," + Math.round(176 - 85 * fr) + ",0.16)";
ctx.fillRect(cx0, ptop, cw, hg);
// 氣體分子（畫面端動畫，速率正比於 √T）
if (!vars._gp) { vars._gp = []; for (var i = 0; i < 34; i++) { var a = Math.random() * 2 * Math.PI; vars._gp.push([Math.random(), Math.random(), Math.cos(a), Math.sin(a)]); } }
var dtv = vars.t - (vars._gpt || 0); vars._gpt = vars.t; if (!(dtv > 0) || dtv > 0.06) dtv = 0;
var spd = 70 * Math.sqrt(Tg / 300);
ctx.fillStyle = "#2B2D31";
vars._gp.forEach(function (m) {
  m[0] += m[2] * spd * dtv / (cw - 8); m[1] += m[3] * spd * dtv / Math.max(hg - 8, 6);
  if (m[0] < 0) { m[0] = -m[0]; m[2] = -m[2]; } if (m[0] > 1) { m[0] = 2 - m[0]; m[2] = -m[2]; }
  if (m[1] < 0) { m[1] = -m[1]; m[3] = -m[3]; } if (m[1] > 1) { m[1] = 2 - m[1]; m[3] = -m[3]; }
  m[0] = Math.max(0, Math.min(1, m[0])); m[1] = Math.max(0, Math.min(1, m[1]));
  ctx.beginPath(); ctx.arc(cx0 + 4 + m[0] * (cw - 8), base - 4 - m[1] * (hg - 8), 2.2, 0, 2 * Math.PI); ctx.fill();
});
// 活塞與連桿
ctx.fillStyle = "#8C9096"; ctx.fillRect(cx0 + 1, ptop - 14, cw - 2, 14);
ctx.fillStyle = "#6B6F76"; ctx.fillRect(cx0 + cw / 2 - 4, 30, 8, Math.max(0, ptop - 44));
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 4;
ctx.beginPath(); ctx.moveTo(cx0 - 2, base - hmax - 30); ctx.lineTo(cx0 - 2, base + 2); ctx.lineTo(cx0 + cw + 2, base + 2); ctx.lineTo(cx0 + cw + 2, base - hmax - 30); ctx.stroke();
var up = k < 2;
arrow(cx0 + cw + 22, up ? ptop + 8 : ptop - 30, cx0 + cw + 22, up ? ptop - 30 : ptop + 8, stCol[k], 2.5);
ctx.fillStyle = stCol[k]; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillText(up ? "對外作功" : "外界作功", cx0 + cw + 10, up ? ptop + 24 : ptop - 36);
// 熱庫底座
var resCol = k === 0 ? "#D1495B" : (k === 2 ? "#2F6FB0" : "#B8B4AA");
ctx.fillStyle = resCol; ctx.fillRect(cx0 - 22, base + 6, cw + 44, 34);
ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
ctx.fillText(k === 0 ? "高溫熱庫 " + TH + " K" : (k === 2 ? "低溫熱庫 " + TC + " K" : "絕熱墊"), cx0 + cw / 2, base + 28);
if (k === 0) arrow(cx0 - 16, base + 4, cx0 - 16, base - 34, "#D1495B", 3);
if (k === 2) arrow(cx0 - 16, base - 34, cx0 - 16, base + 4, "#2F6FB0", 3);
if (k === 0 || k === 2) {
  ctx.fillStyle = stCol[k]; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(k === 0 ? "Q_H" : "Q_C", cx0 - 18, base - 42);
}
// 過程清單
ctx.textAlign = "left";
for (var j = 0; j < 4; j++) {
  var yy = 356 + j * 25;
  if (j === k) { ctx.fillStyle = "rgba(233,162,59,0.16)"; ctx.fillRect(6, yy - 15, 214, 22); }
  ctx.fillStyle = stCol[j]; ctx.beginPath(); ctx.arc(16, yy - 4, 5, 0, 2 * Math.PI); ctx.fill();
  ctx.fillStyle = j === k ? "#2B2D31" : "#6B6F76"; ctx.font = (j === k ? "bold " : "") + "12px sans-serif";
  ctx.fillText(stName[j], 26, yy);
  ctx.font = "10px sans-serif"; ctx.fillStyle = "#6B6F76"; ctx.fillText(stNote[j], 104, yy);
}
var sfr = (vars.t / 3) % 1;
ctx.fillStyle = "#E5E1D8"; ctx.fillRect(6, 452, 214, 4); ctx.fillStyle = stCol[k]; ctx.fillRect(6, 452, 214 * sfr, 4);
// ── 理論循環曲線 ──
function curve(a) {
  var out = [], Vb = Va[a], Ve = Va[(a + 1) % 4];
  for (var s = 0; s <= 40; s++) {
    var vv = Vb * Math.pow(Ve / Vb, s / 40);
    var tt = (a === 0 || a === 2) ? (a === 0 ? TH : TC) : (a === 1 ? TH : TC) * Math.pow(Vb / vv, gam - 1);
    out.push([vv, 0.1 * 8.314 * tt / vv]);
  }
  return out;
}
var loop = [].concat(curve(0), curve(1), curve(2), curve(3));
var pv = vars._pv || [];
function seg(a, ix, iy) { return pv.filter(function (p) { return p[2] === a; }).map(function (p) { return [p[ix], p[iy]]; }); }
var Pmax = 0.1 * 8.314 * TH / Va[0];
var g1 = miniPlot({ x: 230, y: 6, w: 404, h: 276 }, [
  { pts: loop, color: "#9AA0A6", dash: [5, 4], width: 1.2, label: "理論循環" },
  { pts: seg(0, 0, 1), color: stCol[0], width: 2.4 }, { pts: seg(1, 0, 1), color: stCol[1], width: 2.4 },
  { pts: seg(2, 0, 1), color: stCol[2], width: 2.4 }, { pts: seg(3, 0, 1), color: stCol[3], width: 2.4 },
], { title: "P–V 圖（P: kPa，V: L）", xlabel: "V", xmin: 0, xmax: Vmax * 1.06, ymin: 0, ymax: Pmax * 1.1 });
ctx.fillStyle = "rgba(233,162,59,0.2)"; ctx.beginPath();
loop.forEach(function (p, i) { if (i) ctx.lineTo(g1.px(p[0]), g1.py(p[1])); else ctx.moveTo(g1.px(p[0]), g1.py(p[1])); });
ctx.closePath(); ctx.fill();
ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#2B2D31"; ctx.textAlign = "center";
var cornerOff = [[-8, -6], [6, -8], [6, 14], [-6, 14]];
for (var c = 0; c < 4; c++) {
  var Pc = 0.1 * 8.314 * (c < 2 ? TH : TC) / Va[c];
  ctx.fillText(String(c + 1), g1.px(Va[c]) + cornerOff[c][0], g1.py(Pc) + cornerOff[c][1]);
}
ctx.fillStyle = "#B97A1E"; ctx.font = "11px sans-serif";
ctx.fillText("面積 = 淨功 W", g1.px(Math.sqrt(Va[1] * Va[3])), g1.py(0.5 * (0.1 * 8.314 * TH / Va[1] + 0.1 * 8.314 * TC / Va[3])) + 4);
ctx.fillStyle = stCol[k]; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(g1.px(Vg), g1.py(vars.P), 5.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
// ── T–S 圖 ──
var dS = vars.dSth || 0.1;
var rect = [[0, TH], [dS, TH], [dS, TC], [0, TC], [0, TH]];
var g2 = miniPlot({ x: 230, y: 288, w: 404, h: 166 }, [
  { pts: rect, color: "#9AA0A6", dash: [5, 4], width: 1.2, label: "理論（矩形）" },
  { pts: seg(0, 3, 4), color: stCol[0], width: 2.4 }, { pts: seg(1, 3, 4), color: stCol[1], width: 2.4 },
  { pts: seg(2, 3, 4), color: stCol[2], width: 2.4 }, { pts: seg(3, 3, 4), color: stCol[3], width: 2.4 },
], { title: "T–S 圖（T: K，S: J/K）", xlabel: "S", xmin: -0.12 * dS, xmax: 1.25 * dS, ymin: 0, ymax: TH * 1.15 });
ctx.fillStyle = "rgba(233,162,59,0.2)"; ctx.fillRect(g2.px(0), g2.py(TH), g2.px(dS) - g2.px(0), g2.py(TC) - g2.py(TH));
ctx.fillStyle = "rgba(47,111,176,0.08)"; ctx.fillRect(g2.px(0), g2.py(TC), g2.px(dS) - g2.px(0), g2.py(0) - g2.py(TC));
ctx.fillStyle = "#2F6FB0"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("面積 = Q_C", g2.px(dS / 2), g2.py(TC / 2) + 3);
ctx.fillStyle = "#B97A1E"; ctx.fillText("面積 = W", g2.px(dS / 2), g2.py((TH + TC) / 2) + 3);
ctx.fillStyle = stCol[k]; ctx.strokeStyle = "#FFFFFF";
ctx.beginPath(); ctx.arc(g2.px(vars.S), g2.py(Tg), 5.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
// 標題
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left";
ctx.fillText(stName[k], 8, 18);
`),
  ],
};

// ─────────────────────────────────────────────
// 自由膨脹與熵增（統計詮釋）
// ─────────────────────────────────────────────
const freeExpansionHandout = String.raw`# 🎲 自由膨脹與熵增：統計詮釋實驗講義

> 維也納中央公墓裡，波茲曼（Ludwig Boltzmann）的墓碑上只刻著一行公式：$S = k\log W$。打開隔板，氣體衝向真空——這件事為什麼從來不會倒過來發生？答案不是「物理定律禁止」，而是「機率小到宇宙的年齡都等不到」。

## 一、實驗目的

1. 觀察 N 個分子在移除隔板後由左半邊擴散到整個容器的不可逆過程。
2. 統計左側分子數 $n_L$ 的分布，與二項分布 $P(n_L) = \binom{N}{n_L}/2^N$ 比較，並驗證漲落 $\sigma = \sqrt N/2$。
3. 以波茲曼熵 $S = k\ln\Omega$ 計算熵的增加，並與熱力學結果 $\Delta S = Nk\ln 2$ 比較。
4. 計算並（在小 N 時）實際量測「所有分子自發回到左側」的機率 $2^{-N}$，理解熱力學第二定律的統計本質。

## 二、課前預報

1. N = 4 個可區分的分子分布在左、右兩半，共有幾種微觀狀態？列出 $n_L = 0, 1, 2, 3, 4$ 各有幾種，哪一種宏觀狀態最可能？
2. 理想氣體自由膨脹到兩倍體積：$Q$、$W$、$\Delta U$、$\Delta T$ 各為多少？雖然 $Q = 0$，為何熵仍然增加？（提示：熵是狀態函數，可改走一條可逆的等溫路徑來計算。）
3. 證明可逆等溫膨脹到兩倍體積時 $\Delta S = nR\ln 2 = Nk\ln 2$。
4. 二項分布 $p = 1/2$ 時的平均值與標準差各為何？N = 100 時，$n_L$ 落在 45 到 55 之間的機率大約多少？
5. 利用斯特林公式 $\ln N! \approx N\ln N - N$ 證明 $\ln\binom{N}{N/2} \approx N\ln 2$。

## 三、實驗原理

### 1. 熱力學觀點
理想氣體向真空自由膨脹：不推動任何東西（$W = 0$），容器絕熱（$Q = 0$），故 $\Delta U = 0$，溫度不變。熵是狀態函數，用連接相同初、末狀態的可逆等溫過程計算：
$$ \Delta S = \int\frac{dQ_{rev}}{T} = nR\ln\frac{V_f}{V_i} = Nk\ln 2 $$

### 2. 統計觀點：微觀狀態與宏觀狀態
只看每個分子在左或右，共有 $2^N$ 個等機率的微觀狀態。宏觀狀態「左側有 $n_L$ 個」對應
$$ \Omega(n_L) = \binom{N}{n_L} = \frac{N!}{n_L!\ (N - n_L)!} $$
個微觀狀態，因此 $P(n_L) = \Omega(n_L)/2^N$，平均 $N/2$，標準差 $\sigma = \sqrt N/2$，相對漲落 $\sigma/(N/2) = 1/\sqrt N$。

### 3. 波茲曼熵
$$ S = k\ln\Omega $$
隔板移除前所有分子都在左側，$\Omega = 1$、$S = 0$（以此為基準）。平衡後最可能的宏觀狀態 $n_L = N/2$：
$$ \frac{S_{max}}{k} = \ln\binom{N}{N/2} \approx N\ln 2 - \frac12\ln\frac{\pi N}{2} $$
修正項只隨 $\ln N$ 成長，N 越大，統計結果與熱力學的 $Nk\ln 2$ 越一致。（「分子在左或右」只是把空間粗分成兩格；每個分子可用的體積加倍，位置的狀態數就多了 2 倍，$N$ 個分子共多 $2^N$ 倍，這正是 $Nk\ln 2$ 的來源。）

### 4. 自發回到左側的機率
任一瞬間所有分子都在左側的機率為 $2^{-N}$。N = 10 時約千分之一，可以等得到；N = 100 時約 $10^{-30}$；一莫耳氣體則是 $2^{-6\times 10^{23}}$。微觀定律（牛頓力學）對時間反演是對稱的，「不可逆」來自初始狀態的特殊性與巨大的狀態數比例。

### 5. 本模擬
- 容器 2 × 0.8（任意單位），隔板在正中央。分子為點粒子，在牆上做彈性反射。
- 分子間的碰撞以隨機方式模擬：每個分子平均每 0.5 s 重新抽取一次速度（二維馬克士威分布，方均根速率正比於 $\sqrt T$）。這讓系統很快「忘記」初始狀態，但不改變平衡分布。
- 隔板移除後，等 $n_L$ 第一次降到 $N/2$ 以下（已混合）才開始取樣，每 0.05 s 取樣一次 $n_L$，累積直方圖與平均、標準差。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 分子數 N | 4 至 400 | 改變後全部分子回到左側重新開始 |
| 溫度 T | 50 至 1000 K | 只改變分子速率，不改變平衡分布 |
| **移除隔板** | 按鈕 | 讓分子進入右半邊（真空） |
| **重新開始** | 按鈕 | 放回隔板，所有分子回到左側，清除統計 |

- 上方：容器，左側分子為藍色、右側為橘色。
- 左下：$n_L$ 的取樣直方圖（藍色長條）與二項分布理論值（橘點）。
- 右下：波茲曼熵 $S/k = \ln\Omega$ 隨時間的變化；虛線為 $N\ln 2$，點線為 $\ln\binom{N}{N/2}$。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：擴散與熵的增加（N = 100）
按「移除隔板」，每隔約 1 s 按「＋ 記錄一列」，記錄 $n_L$ 與 $S/k$：

| 時間 (s) | 0 | 1 | 2 | 3 | 5 | 8 | 15 |
|---|---|---|---|---|---|---|---|
| $n_L$ | 100 | | | | | | |
| $S/k$ | 0 | | | | | | |

$S/k$ 最後在什麼值附近漲落？與 $N\ln 2$ 相差多少？

### 步驟 B：漲落與二項分布（每個 N 取樣 ≥ 1000 次）
| N | 實測 $\langle n_L\rangle$ | 理論 $N/2$ | 實測 $\sigma$ | 理論 $\sqrt N/2$ | 相對漲落 $\sigma/\langle n_L\rangle$ | $1/\sqrt N$ |
|---|---|---|---|---|---|---|
| 10 | | | | | | |
| 50 | | | | | | |
| 200 | | | | | | |
| 400 | | | | | | |

以 $\log\sigma$ 對 $\log N$ 作圖，斜率應為多少？

### 步驟 C：自發回到左側（小 N，速度調到 4×，取樣 ≥ 3000 次）
| N | 實測「全在左側」比例 | 理論 $2^{-N}$ |
|---|---|---|
| 4 | | |
| 6 | | |
| 8 | | |
| 10 | | |

### 步驟 D：統計熵與熱力學熵
| N | $\ln\binom{N}{N/2}$ | $N\ln 2$ | 比值 |
|---|---|---|---|
| 10 | | | |
| 100 | | | |
| 400 | | | |

## 六、實驗探究問題

1. 步驟 C 中，若每 0.05 s 取樣一次且 N = 20，平均要等多久才會看到一次「全在左側」？N = 100 呢？與宇宙年齡（約 $4\times 10^{17}$ s）比較。
2. 牛頓運動定律在時間反演下不變。如果在某一瞬間把所有分子的速度反向，氣體會「縮回」左側嗎？為什麼現實中看不到？（洛施密特悖論）
3. 改變溫度會改變平衡後的直方圖嗎？會改變什麼？
4. 相鄰兩次取樣並不獨立（分子來不及移動太遠）。這會讓步驟 B 量到的 $\sigma$ 有偏差嗎？還是只會讓它收斂得比較慢？
5. 從資訊的角度：隔板移除後，要描述「每個分子在哪一半」需要多少位元的資訊？這與 $\Delta S = Nk\ln 2$ 有何關係？（提示：$k\ln 2$ 對應 1 位元。）

## 七、誤差來源與模型限制

- 有限的取樣次數造成直方圖的統計漲落；相鄰取樣具相關性，有效樣本數比取樣次數少。
- 只把空間粗分成左、右兩格，$\ln\Omega$ 只是位置熵的一部分；分子速度分布在膨脹前後不變，對熵差沒有貢獻。
- 點粒子之間沒有真正的碰撞，以隨機重新抽取速度代替；二維模型與真實的三維氣體在定量上不同，但統計結論相同。
- 小 N 時「熵」的漲落很大，熱力學第二定律只在 N 很大時才成為近乎確定的定律。

## 八、延伸挑戰

1. 讓隔板不在正中央（左邊佔 1/4 體積），平衡分布變成 $p = 3/4$ 的二項分布，熵增為 $Nk\ln 4$。
2. 加入一扇「馬克士威妖」小門：只讓右往左的分子通過，觀察熵如何減少，並思考妖本身付出的代價（蘭道爾原理）。
3. 實作艾倫費斯特（Ehrenfest）罐子模型：每一步隨機挑一個分子換邊，比較其弛豫過程與本模擬。

## 九、延伸閱讀

- D. V. Schroeder, *An Introduction to Thermal Physics*, Ch. 2〈The Second Law〉與 Ch. 3〈Interactions and Implications〉
- F. Reif, *Fundamentals of Statistical and Thermal Physics*, Ch. 1〈Introduction to Statistical Methods〉
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 44〈The Laws of Thermodynamics〉與 Ch. 46〈Ratchet and Pawl〉
- P. Ehrenfest, T. Ehrenfest, "Über zwei bekannte Einwände gegen das Boltzmannsche H-Theorem", *Physikalische Zeitschrift* 8, 311 (1907)
- J. L. Lebowitz, "Boltzmann's entropy and time's arrow", *Physics Today* 46(9), 32 (1993)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Entropy and the Second Law of Thermodynamics〉章：自由膨脹與統計觀點
`;

const freeExpansion: ExampleDef = {
  id: 'free-expansion',
  category: '熱學與統計',
  difficulty: '基礎',
  listDescription: '移除隔板讓 N 個分子衝向真空：計數左右分子數，比較 n_L 的直方圖與二項分布，觀察波茲曼熵 k ln Ω 增加到約 Nk ln 2，並量測全部回到左側的機率 2⁻ᴺ。',
  description: freeExpansionHandout,
  info: { title: '自由膨脹與熵增（統計詮釋）', author: '', keywords: '', abstract: '' },
  variables: doubles('fe', [
    ['N', '100', '分子數'],
    ['Tk', '300', '溫度（K），決定分子速率'],
    ['removed', '0', '隔板已移除（1 = 是）'],
    ['runId', '0', '重新開始的計數（按鈕用）'],
    ['nL', '100', '左側分子數'],
    ['nR', '0', '右側分子數'],
    ['SkNow', '0', '波茲曼熵 S/k = ln C(N, n_L)'],
    ['Smax', '0', 'ln C(N, N/2)'],
    ['nSamp', '0', '取樣次數'],
    ['meanL', '0', '實測 ⟨n_L⟩'],
    ['sdL', '0', '實測 n_L 標準差'],
    ['nAll', '0', '取樣中全部在左側的次數'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'fe-ode', name: '時間推進', method: 'Euler', increment: '0.01', comment: '分子運動在約束頁計算',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'fe-con', name: '分子運動、計數與取樣', comment: '點粒子＋牆面反射；以隨機重新抽取速度模擬分子碰撞（平均自由時間 0.5 s）',
    code: String.raw`var Lx = 2, Ly = 0.8, tauC = 0.5;
var Nn = Math.max(2, Math.round(N));
var sv = 0.7 * Math.sqrt(Tk / 300);
function gauss() { var u1 = Math.random() || 1e-12, u2 = Math.random(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
var sig = Nn + '|' + runId;
if (_v._sig !== sig || !_v._px) {
  _v._sig = sig; t = 0; _v._tl = 0; _v._Tk = Tk;
  _v._px = new Float64Array(Nn); _v._py = new Float64Array(Nn);
  _v._vx = new Float64Array(Nn); _v._vy = new Float64Array(Nn);
  for (var i = 0; i < Nn; i++) {
    _v._px[i] = 0.02 + 0.96 * Math.random(); _v._py[i] = Ly * Math.random();
    _v._vx[i] = sv * gauss(); _v._vy[i] = sv * gauss();
  }
  var lf = [0];
  for (var j = 1; j <= Nn; j++) lf.push(lf[j - 1] + Math.log(j));
  _v._lnF = lf;
  _v._hist = []; for (var h = 0; h <= Nn; h++) _v._hist.push(0);
  _v._s1 = 0; _v._s2 = 0; _v._mixed = 0; _v._ns = 0;
  removed = 0; nL = Nn; nR = 0; SkNow = 0; nSamp = 0; meanL = 0; sdL = 0; nAll = 0;
  Smax = lf[Nn] - lf[Math.floor(Nn / 2)] - lf[Nn - Math.floor(Nn / 2)];
}
if (_v._Tk !== Tk) {
  var fac = Math.sqrt(Tk / _v._Tk); _v._Tk = Tk;
  for (var q = 0; q < Nn; q++) { _v._vx[q] *= fac; _v._vy[q] *= fac; }
}
if (t > _v._tl) {
  var dtp = t - _v._tl; _v._tl = t;
  var xw = removed > 0.5 ? Lx : 1, pc = 1 - Math.exp(-dtp / tauC), cnt = 0;
  var X = _v._px, Yp = _v._py, VX = _v._vx, VY = _v._vy;
  for (var k = 0; k < Nn; k++) {
    if (Math.random() < pc) { VX[k] = sv * gauss(); VY[k] = sv * gauss(); }
    X[k] += VX[k] * dtp; Yp[k] += VY[k] * dtp;
    if (X[k] < 0) { X[k] = -X[k]; VX[k] = Math.abs(VX[k]); }
    if (X[k] > xw) { X[k] = 2 * xw - X[k]; VX[k] = -Math.abs(VX[k]); }
    if (Yp[k] < 0) { Yp[k] = -Yp[k]; VY[k] = Math.abs(VY[k]); }
    if (Yp[k] > Ly) { Yp[k] = 2 * Ly - Yp[k]; VY[k] = -Math.abs(VY[k]); }
    if (X[k] < 1) cnt++;
  }
  nL = cnt; nR = Nn - cnt;
  SkNow = _v._lnF[Nn] - _v._lnF[cnt] - _v._lnF[Nn - cnt];
  if (removed > 0.5) {
    if (!_v._mixed && cnt <= Nn / 2) { _v._mixed = 1; _v._ns = t; }
    if (_v._mixed && t >= _v._ns) {
      _v._ns = t + 0.05;
      _v._hist[cnt]++; nSamp = nSamp + 1; _v._s1 += cnt; _v._s2 += cnt * cnt;
      if (cnt === Nn) nAll = nAll + 1;
      meanL = _v._s1 / nSamp; sdL = Math.sqrt(Math.max(0, _v._s2 / nSamp - meanL * meanL));
    }
  }
} else if (t < _v._tl) {
  _v._tl = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('fe-dp', 640, 460, [0, 10, 0, 10]),
    slider('fe-s-N', 'N', 4, 400, 2, '分子數 N'),
    slider('fe-s-T', 'Tk', 50, 1000, 10, '溫度 T (K)'),
    button('fe-b-rm', '移除隔板', 'removed = 1;'),
    button('fe-b-re', '重新開始', 'runId = runId + 1; removed = 0;'),
    readout('fe-r-nL', '左側分子數 n_L', 'nL', { digits: 0, color: C.blue, group: '分子計數' }),
    readout('fe-r-nR', '右側分子數 n_R', 'nR', { digits: 0, color: C.amber, group: '分子計數' }),
    readout('fe-r-ns', '取樣次數', 'removed > 0.5 ? nSamp : "隔板尚未移除"', { digits: 0, color: C.ink, group: '漲落統計（混合後每 0.05 s 取樣）' }),
    readout('fe-r-mean', '實測 ⟨n_L⟩', 'nSamp > 0 ? meanL : "…"', { digits: 2, color: C.blue, group: '漲落統計（混合後每 0.05 s 取樣）' }),
    readout('fe-r-sd', '實測標準差 σ', 'nSamp > 1 ? sdL : "…"', { digits: 3, color: C.blue, group: '漲落統計（混合後每 0.05 s 取樣）' }),
    readout('fe-r-sdth', '理論 σ = √N / 2', 'Math.sqrt(Math.round(N)) / 2', { digits: 3, color: C.muted, group: '漲落統計（混合後每 0.05 s 取樣）' }),
    readout('fe-r-S', '波茲曼熵 S/k = ln Ω', 'SkNow', { digits: 2, color: C.teal, group: '熵（以全部在左側為 0）' }),
    readout('fe-r-Smax', '平衡值 ln C(N, N/2)', 'Smax', { digits: 2, color: C.teal, group: '熵（以全部在左側為 0）' }),
    readout('fe-r-Nln2', '熱力學 ΔS/k = N ln 2', 'Math.round(N) * Math.LN2', { digits: 2, color: C.muted, group: '熵（以全部在左側為 0）' }),
    readout('fe-r-ratio', 'ln C(N, N/2) ÷ N ln 2', 'Smax / (Math.round(N) * Math.LN2)', { digits: 4, color: C.muted, group: '熵（以全部在左側為 0）' }),
    readout('fe-r-fa', '實測「全在左側」比例', 'nSamp > 0 ? nAll / nSamp : "…"', { digits: 5, color: C.red, group: '自發回到左側' }),
    readout('fe-r-pa', '理論機率 2⁻ᴺ', 'Math.pow(2, -Math.round(N))', { digits: 5, color: C.muted, group: '自發回到左側' }),
    customDraw('fe-draw', '容器、直方圖與熵', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var Nn = Math.max(2, Math.round(vars.N)), px = vars._px, py = vars._py, rem = vars.removed > 0.5;
var bx0 = 20, by0 = 28, bw = 600, bh = 228, sx = bw / 2, sy = bh / 0.8;
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(bx0, by0, bw, bh);
if (!rem) {
  ctx.fillStyle = "rgba(43,45,49,0.05)"; ctx.fillRect(bx0 + bw / 2, by0, bw / 2, bh);
  ctx.fillStyle = "#9AA0A6"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("真空", bx0 + 3 * bw / 4, by0 + bh / 2 + 5);
}
var rr = Nn > 200 ? 2.6 : (Nn > 60 ? 3.4 : 5);
if (px) {
  for (var i = 0; i < px.length; i++) {
    ctx.fillStyle = px[i] < 1 ? "#2F6FB0" : "#E9A23B";
    ctx.beginPath(); ctx.arc(bx0 + 3 + px[i] * (sx - 3), by0 + bh - 3 - py[i] * (sy - 3.75), rr, 0, 2 * Math.PI); ctx.fill();
  }
}
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 3; ctx.strokeRect(bx0, by0, bw, bh);
if (!rem) {
  ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(bx0 + bw / 2, by0); ctx.lineTo(bx0 + bw / 2, by0 + bh); ctx.stroke();
} else {
  ctx.strokeStyle = "rgba(43,45,49,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
  ctx.beginPath(); ctx.moveTo(bx0 + bw / 2, by0); ctx.lineTo(bx0 + bw / 2, by0 + bh); ctx.stroke(); ctx.setLineDash([]);
}
ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#2F6FB0";
ctx.fillText("左側 n_L = " + vars.nL, bx0, by0 - 9);
ctx.textAlign = "right"; ctx.fillStyle = "#B97A1E";
ctx.fillText("右側 n_R = " + vars.nR, bx0 + bw, by0 - 9);
ctx.textAlign = "center"; ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif";
ctx.fillText(rem ? "隔板已移除" : "按「移除隔板」開始", bx0 + bw / 2, by0 - 9);
// ── 直方圖 vs 二項分布 ──
var lf = vars._lnF || [0], hist = vars._hist || [], ns = vars.nSamp;
var sdT = Math.sqrt(Nn) / 2, lo = 0, hi = Nn;
if (Nn > 40) { lo = Math.max(0, Math.floor(Nn / 2 - Math.max(4.5 * sdT, 6))); hi = Math.min(Nn, Math.ceil(Nn / 2 + Math.max(4.5 * sdT, 6))); }
var binom = [], peak = 0;
for (var n = lo; n <= hi; n++) {
  var pb = lf.length > Nn ? Math.exp(lf[Nn] - lf[n] - lf[Nn - n] - Nn * Math.LN2) : 0;
  binom.push([n, pb]); if (pb > peak) peak = pb;
}
var hmax = 0;
for (var m = lo; m <= hi; m++) if (ns > 0 && (hist[m] || 0) / ns > hmax) hmax = (hist[m] || 0) / ns;
var gH = miniPlot({ x: 6, y: 266, w: 312, h: 188 }, [
  { pts: binom, color: "#E9A23B", dash: [3, 3], width: 1, label: "● 二項分布" },
], { title: "n_L 直方圖", xlabel: "n_L", xmin: lo - 0.5, xmax: hi + 0.5, ymin: 0, ymax: Math.max(peak, hmax) * 1.15 });
if (ns > 0) {
  ctx.fillStyle = "rgba(47,111,176,0.55)";
  for (var b = lo; b <= hi; b++) {
    var fr = (hist[b] || 0) / ns; if (fr <= 0) continue;
    var xa = gH.px(b - 0.5), xb = gH.px(b + 0.5), gap = (xb - xa) > 4 ? 1 : 0;
    ctx.fillRect(xa + gap, gH.py(fr), xb - xa - 2 * gap, gH.py(0) - gH.py(fr));
  }
} else {
  ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(rem ? "等待混合…" : "移除隔板後開始取樣", 162, 350);
}
ctx.fillStyle = "#E9A23B";
binom.forEach(function (p) { ctx.beginPath(); ctx.arc(gH.px(p[0]), gH.py(p[1]), Nn > 120 ? 2 : 3, 0, 2 * Math.PI); ctx.fill(); });
ctx.fillStyle = "rgba(47,111,176,0.8)"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillText("■ 實測", 100, 279);
// ── 熵 S/k 隨時間 ──
var hS = track("_feS", [vars.t, vars.SkNow], 4000);
var tmax = Math.max(10, vars.t * 1.05), nl2 = Nn * Math.LN2;
miniPlot({ x: 324, y: 266, w: 310, h: 188 }, [
  { pts: [[0, nl2], [tmax, nl2]], color: "#6B6F76", dash: [6, 4], width: 1.2, label: "N ln2" },
  { pts: [[0, vars.Smax], [tmax, vars.Smax]], color: "#2A9D8F", dash: [2, 3], width: 1.2, label: "ln C(N,N/2)" },
  { pts: hS.map(function (p) { return [p[0], p[1]]; }), color: "#2A9D8F", width: 2, label: "S/k" },
], { title: "波茲曼熵 S/k = ln Ω", xlabel: "t(s)", xmin: 0, xmax: tmax, ymin: 0, ymax: nl2 * 1.15 });
`),
  ],
};

const THERMAL2_EXAMPLES: ExampleDef[] = [carnot, freeExpansion];

export default THERMAL2_EXAMPLES;

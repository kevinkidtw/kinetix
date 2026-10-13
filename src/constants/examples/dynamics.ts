import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：力學（角動量守恆、變質量系統、軌道力學）
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 角動量守恆：旋轉平台與收縮手臂
// ─────────────────────────────────────────────
const angMomHandout = String.raw`# 🌀 角動量守恆：旋轉平台與收縮手臂實驗講義

> 花式滑冰選手張開雙臂慢慢旋轉，接著把手臂收向身體，轉速瞬間暴增成一團殘影；物理課常見的「旋轉椅＋啞鈴」示範也是同一件事。沒有外力矩時，角動量 $L = I\omega$ 保持不變——但轉動動能卻增加了。多出來的能量是誰給的？

## 一、實驗目的

1. 驗證外力矩為零時，系統的角動量 $L = I\omega$ 守恆。
2. 量測角速度 $\omega$ 與轉動慣量 $I$ 的關係，驗證 $\omega \propto 1/I$。
3. 發現收縮手臂時動能並不守恆，並以「拉力對質點作的功」定量解釋動能的增加量。
4. 由質點在旋轉導軌上的運動方程（含科氏項），理解平台為什麼會加速或減速。

## 二、課前預報

1. 寫出平台（轉動慣量 $I_0$）加上兩個距轉軸 $r$、質量 $m$ 的質點時，系統的總轉動慣量。
2. 拉繩穿過轉軸中心，對質點的拉力沿徑向指向轉軸。說明這個力對轉軸的力矩為何是零。
3. 設 $I_0 = 0.5$ kg·m²、$m = 1$ kg、起始 $r = 0.8$ m、$\omega = 2$ rad/s。把兩質點拉到 $r = 0.2$ m 後，$\omega$ 變為多少？
4. 承上題，計算拉入前後的轉動動能。動能增加了多少焦耳？
5. 證明轉動動能可寫成 $K = \dfrac{L^2}{2I}$。在 $L$ 固定時，$I$ 變小代表 $K$ 如何變化？

## 三、實驗原理

### 1. 角動量守恆
對固定轉軸，$\tau_{\text{ext}} = \dfrac{dL}{dt}$。本系統的轉軸無摩擦，拉繩的力又通過轉軸，故外力矩為零：
$$ L = \left(I_0 + 2mr^2\right)\omega = \text{常數} $$
因此任一時刻
$$ \omega = \frac{L_{\text{i}}}{I} = \frac{I_{\text{i}}\ \omega_{\text{i}}}{I_0 + 2mr^2} $$
角速度與轉動慣量成反比：$\omega$ 對 $1/I$ 作圖應為通過原點、斜率為 $L$ 的直線。

### 2. 從牛頓定律看：導軌的切向力
質點沿著隨平台轉動的徑向導軌移動。在極座標中，它的切向加速度為 $r\dot\omega + 2\dot r\omega$，第二項就是科氏項。導軌必須提供的切向力為
$$ F_\theta = m\left(r\dot\omega + 2\dot r\omega\right) $$
依牛頓第三定律，質點以 $-F_\theta$ 推回導軌，對平台產生力矩 $-rF_\theta$（兩個質點各一份）：
$$ I_0\dot\omega = -2rF_\theta $$
兩式消去 $F_\theta$ 得
$$ \left(I_0 + 2mr^2\right)\dot\omega = -4mr\dot r\omega $$
這正是 $\dfrac{d}{dt}\left[\left(I_0 + 2mr^2\right)\omega\right] = 0$。收手臂時 $\dot r \lt 0$，右邊為正，平台被「推著」加速。模擬器積分的就是這條運動方程，所以儀表板上的「實測 ω」是由牛頓定律一步步算出來的，而「理論 ω」直接由守恆律給出。

### 3. 動能與拉力作功
每個質點的徑向方程為 $m\left(\ddot r - r\omega^2\right) = -T$，其中 $T$ 為繩子張力（向內）。拉力對兩個質點的總功率為 $-2T\dot r$；收手臂時 $\dot r \lt 0$，拉力作正功。系統的總動能
$$ K = \frac12 I\omega^2 + m\dot r^2 $$
滿足功能定理 $\dfrac{dK}{dt} = -2T\dot r$（導軌切向力對質點與對平台作的功恰好抵消）。若質點在起點與終點都沒有徑向速度，則
$$ W_{\text{拉}} = \Delta K = \frac{L^2}{2}\left(\frac{1}{I_{\text{f}}} - \frac{1}{I_{\text{i}}}\right) $$
這個結果只與起末狀態有關，與拉的快慢無關。反過來，放鬆繩子讓質點外移時，繩子作負功，轉動動能減少。

### 4. 本模擬
- 每次重新開始時，兩質點位於 $r = 0.9$ m（手臂伸直），平台角速度為 $\omega_{\text{i}} = 2$ rad/s，接著質點立即移向目標半徑 $r_T$（預設 0.15 m，也就是一開始就「收手臂」）。
- 質點的徑向速度以約 0.03 s 的時間常數趨近 $v_p\tanh\left((r_T - r)/0.1\right)$：遠離目標時約以速率 $v_p$ 等速移動，接近目標時減速停下。起動與停下都是平滑的，因此拉力作功能被完整計入。
- 以四階 Runge–Kutta 法同時積分 $\omega$、$r$ 與拉力作功 $W = \int -2T\dot r\ dt$，步長 0.005 s。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 目標半徑 r_T | 0.1 至 1.0 m | 拖動即開始收（放）手臂，不會重新開始 |
| 收放速率 v_p | 0.1 至 2 m/s | 質點沿導軌移動的速率 |
| 平台轉動慣量 I₀ | 0.1 至 2 kg·m² | 改變後重新開始 |
| 質點質量 m | 0.2 至 3 kg | 每個質點的質量，改變後重新開始 |
| **重新開始** | 按鈕 | 質點回到 0.9 m、ω = 2 rad/s，再移向目前的 r_T |

- **左上（俯視圖）**：米色圓盤為平台，灰色橫桿為徑向導軌，藍色圓球為兩個質點，黑線為穿過轉軸的拉繩；紅色箭頭為質點的切向速度，橘色箭頭為徑向速度；淡橘虛線圓為目標半徑。
- **左下（對數長條）**：$L$、$I$、$\omega$、$K$ 相對於起始值的倍率。$L$ 的長條始終停在「×1」，$I$ 與 $\omega$ 則一左一右對稱地變化。
- **右上**：角速度 $\omega(t)$，藍線為實測（牛頓定律積分），灰色虛線為守恆律預測 $L_{\text{i}}/I$。
- **右下**：總動能 $K(t)$（綠線）與「起始動能＋拉力作功」$K_{\text{i}} + W$（橘色虛線），兩者重合即驗證功能定理。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：角動量守恆（I₀ = 0.5 kg·m²、m = 1 kg、v_p = 0.5 m/s）
1. 先把 $r_T$ 調到 0.9 m，再按「重新開始」：質點停在 0.9 m，平台以 2 rad/s 轉動。
2. 依序把 $r_T$ 調到下表的值，等質點停穩（徑向速率 ≈ 0）後記錄。

| r_T (m) | I (kg·m²) | 實測 ω (rad/s) | 理論 ω = L/I (rad/s) | L = Iω (kg·m²/s) |
|---|---|---|---|---|
| 0.9 | | | | |
| 0.7 | | | | |
| 0.5 | | | | |
| 0.3 | | | | |
| 0.15 | | | | |

以 $\omega$ 對 $1/I$ 作圖，求斜率並與 $L$ 比較。

### 步驟 B：動能與拉力作功
1. 把 $r_T$ 設為 0.15 m 後按「重新開始」，質點由 0.9 m 一次拉到 0.15 m，記錄動能變化與拉力作功。
2. 再把 $r_T$ 放回 0.9 m，記錄同樣的量（儀表板的 ΔK 與 W 都是從重新開始起累計，這一段請取前後兩次讀數之差）。
3. 改用不同收放速率重複第 1 步。

| 過程 | v_p (m/s) | K_i (J) | K_f (J) | ΔK (J) | 拉力作功 W (J) | 理論 L²/2·(1/I_f − 1/I_i) (J) |
|---|---|---|---|---|---|---|
| 0.9 → 0.15 | 0.5 | | | | | |
| 0.15 → 0.9 | 0.5 | | | | | |
| 0.9 → 0.15 | 0.2 | | | | | |
| 0.9 → 0.15 | 2.0 | | | | | |

拉的快慢會影響拉力作的總功嗎？拉的快慢影響的是什麼？（觀察張力 T 的最大值。）

### 步驟 C：平台轉動慣量的影響（m = 1 kg、r_T = 0.15 m，每次改變 I₀ 都會自動由 0.9 m 重新開始）

| I₀ (kg·m²) | 實測 ω_f / ω_i | 理論 (I₀ + 2m·0.81)/(I₀ + 2m·0.0225) |
|---|---|---|
| 0.1 | | |
| 0.5 | | |
| 1.0 | | |
| 2.0 | | |

平台越「重」，收手臂的效果越明顯還是越不明顯？為什麼花式滑冰選手要盡量把手臂、腿都貼近身體？

## 六、實驗探究問題

1. 收手臂時 $\omega$ 增加，是什麼力讓平台加速？它的方向如何？（提示：在平台上看，向內移動的質點受到科氏力。）
2. 若繩子突然斷掉，質點會沿什麼方向飛出？斷掉後平台的角速度會改變嗎？
3. 為什麼收手臂需要用力、而且越收越吃力？由 $T = m r\omega^2$ 與 $\omega \propto 1/I$ 估計 $T$ 與 $r$ 的關係（設 $I_0 \ll 2mr^2$）。
4. 恆星塌縮成中子星時，半徑由約 $10^6$ km 縮為約 10 km。若角動量守恆並視為均勻球體，自轉週期縮短多少倍？這如何解釋脈衝星的毫秒級自轉？
5. 全球暖化使極地冰雪融化、海水往赤道附近分布。這會讓一天的長度變長還是變短？

## 七、誤差來源與模型限制

- 質點視為點質量，忽略其自身繞質心的轉動慣量；導軌與繩子的質量也被忽略。
- 假設轉軸完全無摩擦；真實的旋轉椅有軸承摩擦力矩，$L$ 會緩慢減少。
- 總動能包含徑向動能 $m\dot r^2$，因此質點移動中「½Iω²」與 $L^2/2I$ 相同，但總動能 $K$ 略大；比較 $\Delta K$ 與 $W$ 時，應在質點停穩後讀數。
- 數值積分誤差：以 RK4、步長 0.005 s，$L/L_{\text{i}}$ 的偏差小於 $10^{-6}$。

## 八、延伸挑戰

1. 在平台加上軸承摩擦力矩 $\tau_f = -b\omega$，觀察 $L$ 如何衰減，並與收放手臂造成的變化比較時間尺度。
2. 把拉繩改為彈簧（質點受 $-k(r - r_0)$ 的回復力），平台與質點會出現什麼樣的耦合振盪？
3. 讓質點「自由滑動」（不拉繩、無摩擦），由 $\ddot r = r\omega^2$ 與角動量守恆推導 $r(t)$，並在模擬器中實作。

## 九、延伸閱讀

- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Rolling, Torque, and Angular Momentum〉章：角動量守恆
- H. D. Young, R. A. Freedman, *University Physics*,〈Dynamics of Rotational Motion〉章：Conservation of Angular Momentum
- D. Kleppner, R. Kolenkow, *An Introduction to Mechanics*, 2nd ed., Ch. 7〈Angular Momentum and Fixed Axis Rotation〉
- J. R. Taylor, *Classical Mechanics*, Ch. 9〈Mechanics in Noninertial Frames〉：科氏力
- K. Laws, *Physics and the Art of Dance: Understanding Movement* (Oxford University Press, 2002)：舞者與滑冰選手的旋轉
`;

// 徑向速度 ṙ 以時間常數 0.03 s 趨近 v_p·tanh((r_T − r)/0.1)：r̈ 有限，拉力作功可完整積分
const AM_RDD = '((vp * Math.tanh((rT - r) / 0.1) - rd) / 0.03)';

const angularMomentum: ExampleDef = {
  id: 'angular-momentum',
  category: '力學',
  difficulty: '基礎',
  listDescription: '旋轉平台上的兩個質點被拉繩收進或放出：角速度隨轉動慣量反比變化、角動量守恆，轉動動能卻增加——儀表板以拉力作功定量解釋多出來的能量。',
  description: angMomHandout,
  info: { title: '角動量守恆：旋轉平台與收縮手臂', author: '', keywords: '', abstract: '' },
  variables: doubles('am', [
    ['phi', '0', '平台轉角（rad）'],
    ['w', '2', '平台角速度（rad/s）'],
    ['r', '0.9', '質點與轉軸的距離（m）'],
    ['rd', '0', '徑向速度 ṙ（m/s）'],
    ['Wp', '0', '拉力累積作功（J）'],
    ['I0', '0.5', '平台轉動慣量（kg·m²）'],
    ['m', '1', '每個質點的質量（kg）'],
    ['w0', '2', '起始角速度（rad/s）'],
    ['rT', '0.15', '目標半徑（m）'],
    ['rS', '0.9', '重新開始時質點的半徑（m，手臂伸直）'],
    ['rst', '0', '重新開始指令（按鈕設為 1）'],
    ['vp', '0.5', '收放速率（m/s）'],
    ['Itot', '2.12', '總轉動慣量 I₀ + 2mr²'],
    ['Lm', '0', '實測角動量 Iω'],
    ['L0', '0', '起始角動量'],
    ['Ii', '0', '起始轉動慣量'],
    ['wth', '0', '守恆律預測的角速度 L₀/I'],
    ['Krot', '0', '轉動動能 ½Iω²'],
    ['KE', '0', '總動能（含徑向動能）'],
    ['KE0', '0', '起始動能'],
    ['Ten', '0', '每條繩的張力（N）'],
  ]),
  odePages: [{
    id: 'am-ode', name: '平台與質點的運動方程', method: 'RungeKutta', increment: '0.005',
    comment: '(I₀+2mr²)ω̇ = −4mrṙω 由導軌切向力（科氏項）推得；拉力功率 = −2Tṙ，T = m(rω² − r̈)',
    rates: [
      { state: 'phi', expression: 'w' },
      { state: 'r', expression: 'rd' },
      { state: 'rd', expression: AM_RDD },
      { state: 'w', expression: '-4 * m * r * rd * w / (I0 + 2 * m * r * r)' },
      { state: 'Wp', expression: `-2 * m * (r * w * w - ${AM_RDD}) * rd` },
    ],
  }],
  constraintPages: [{
    id: 'am-con', name: '重新開始與守恆量', comment: '改變 I₀、m 或按「重新開始」時，質點回到 r = 0.9 m、ω = 2 rad/s',
    code: String.raw`var sig = I0 + '|' + m + '|' + w0;
if (_v._sig !== sig || rst > 0.5) {
  _v._sig = sig; rst = 0;
  t = 0; phi = 0; r = rS; rd = 0; w = w0; Wp = 0;
  Ii = I0 + 2 * m * r * r;
  L0 = Ii * w0;
  KE0 = 0.5 * Ii * w0 * w0;
}
Itot = I0 + 2 * m * r * r;
Lm = Itot * w;
wth = L0 / Itot;
var rddot = (vp * Math.tanh((rT - r) / 0.1) - rd) / 0.03;
Ten = m * (r * w * w - rddot);
Krot = 0.5 * Itot * w * w;
KE = Krot + m * rd * rd;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('am-dp', 620, 440, [0, 10, 0, 10]),
    slider('am-s-rT', 'rT', 0.1, 1, 0.05, '目標半徑 r_T'),
    slider('am-s-vp', 'vp', 0.1, 2, 0.1, '收放速率 v_p'),
    slider('am-s-I0', 'I0', 0.1, 2, 0.1, '平台 I₀'),
    slider('am-s-m', 'm', 0.2, 3, 0.1, '質量 m'),
    button('am-b-rst', '重新開始', 'rst = 1;'),
    readout('am-r-L', '實測角動量 L = Iω', 'Lm', { unit: 'kg·m²/s', digits: 4, color: C.blue, group: '角動量' }),
    readout('am-r-L0', '起始角動量 L_i', 'L0', { unit: 'kg·m²/s', digits: 4, color: C.muted, group: '角動量' }),
    readout('am-r-LL', 'L / L_i', 'L0 > 0 ? Lm / L0 : "…"', { digits: 6, color: C.teal, group: '角動量' }),
    readout('am-r-I', '轉動慣量 I = I₀ + 2mr²', 'Itot', { unit: 'kg·m²', digits: 4, color: C.ink, group: '轉動' }),
    readout('am-r-r', '質點半徑 r', 'r', { unit: 'm', digits: 3, color: C.ink, group: '轉動' }),
    readout('am-r-w', '實測角速度 ω', 'w', { unit: 'rad/s', digits: 4, color: C.blue, group: '轉動' }),
    readout('am-r-wth', '理論 ω = I_i ω_i / I', 'wth', { unit: 'rad/s', digits: 4, color: C.muted, group: '轉動' }),
    readout('am-r-rd', '徑向速度 ṙ', 'Math.abs(rd) < 1e-4 ? 0 : rd', { unit: 'm/s', digits: 3, color: C.amber, group: '轉動' }),
    readout('am-r-Kr', '轉動動能 ½Iω²', 'Krot', { unit: 'J', digits: 4, color: C.teal, group: '能量' }),
    readout('am-r-Kth', '理論 L_i² / 2I', 'L0 * L0 / (2 * Itot)', { unit: 'J', digits: 4, color: C.muted, group: '能量' }),
    readout('am-r-dK', '總動能變化 ΔK', 'KE - KE0', { unit: 'J', digits: 4, color: C.teal, group: '能量' }),
    readout('am-r-W', '拉力累積作功 W', 'Wp', { unit: 'J', digits: 4, color: C.amber, group: '能量' }),
    readout('am-r-T', '每條繩的張力 T', 'Ten', { unit: 'N', digits: 3, color: C.red, group: '能量' }),
    customDraw('am-draw', '旋轉平台與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var phi = vars.phi, rr = vars.r, om = vars.w, mm = vars.m;
var cx = 160, cy = 160, sc = 128;
// ── 平台（俯視）──
ctx.fillStyle = "#F3EDE0"; ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(cx, cy, 1.08 * sc, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.strokeStyle = "rgba(43,45,49,0.08)"; ctx.lineWidth = 1;
for (var k = 0; k < 12; k++) {
  var ak = phi + k * Math.PI / 6;
  ctx.beginPath(); ctx.moveTo(cx + 0.2 * sc * Math.cos(ak), cy - 0.2 * sc * Math.sin(ak)); ctx.lineTo(cx + 1.06 * sc * Math.cos(ak), cy - 1.06 * sc * Math.sin(ak)); ctx.stroke();
}
// 平台上的參考記號（看得出轉速）
var am = phi + Math.PI / 2;
ctx.fillStyle = "#D1495B"; ctx.beginPath(); ctx.arc(cx + 0.98 * sc * Math.cos(am), cy - 0.98 * sc * Math.sin(am), 5, 0, 2 * Math.PI); ctx.fill();
// 目標半徑
ctx.strokeStyle = "rgba(233,162,59,0.75)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
ctx.beginPath(); ctx.arc(cx, cy, vars.rT * sc, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
// 導軌
var ca = Math.cos(phi), sa = Math.sin(phi);
ctx.strokeStyle = "rgba(107,111,118,0.55)"; ctx.lineWidth = 7; ctx.lineCap = "round";
ctx.beginPath(); ctx.moveTo(cx - 1.02 * sc * ca, cy + 1.02 * sc * sa); ctx.lineTo(cx + 1.02 * sc * ca, cy - 1.02 * sc * sa); ctx.stroke();
ctx.lineCap = "butt";
// 兩個質點、拉繩與速度
var rad = 7 + 4 * Math.sqrt(mm);
[1, -1].forEach(function (s) {
  var qx = cx + s * rr * sc * ca, qy = cy - s * rr * sc * sa;
  ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(qx, qy); ctx.stroke();
  var vt = Math.min(80, om * rr * 16);
  arrow(qx, qy, qx - s * sa * vt, qy - s * ca * vt, "#D1495B", 2.2);
  if (Math.abs(vars.rd) > 0.01) { var vr = Math.max(-40, Math.min(40, vars.rd * 40)); arrow(qx, qy, qx + s * ca * vr, qy - s * sa * vr, "#E9A23B", 2.2); }
  ctx.fillStyle = "#2F6FB0"; ctx.strokeStyle = "#1F4F82"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(qx, qy, rad, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
});
ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill();
// 旋轉方向
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 1.18 * sc, -0.95, -0.35); ctx.stroke();
var ex = cx + 1.18 * sc * Math.cos(-0.95), ey = cy + 1.18 * sc * Math.sin(-0.95);
arrow(ex + 8, ey + 7, ex, ey, "#6B6F76", 1.5);
ctx.fillStyle = "#6B6F76"; ctx.font = "12px sans-serif"; ctx.textAlign = "left"; ctx.fillText("ω", cx + 1.2 * sc * Math.cos(-0.6) + 4, cy + 1.2 * sc * Math.sin(-0.6));
ctx.font = "10px sans-serif"; ctx.fillStyle = "#B97A1E"; ctx.fillText("r_T", cx + vars.rT * sc * 0.72 + 3, cy + vars.rT * sc * 0.72 + 10);
// ── 相對起始值的倍率（對數刻度）──
var by = 318, bL = 44, bR = 300, bc = (bL + bR) / 2, per = (bR - bL) / 2 / 3;
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left";
ctx.fillText("相對起始值的倍率（對數刻度）", 12, by - 6);
ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.font = "9px monospace"; ctx.fillStyle = "#6B6F76"; ctx.textAlign = "center";
[["×⅛", -3], ["×¼", -2], ["×½", -1], ["×1", 0], ["×2", 1], ["×4", 2], ["×8", 3]].forEach(function (tk) {
  var tx = bc + tk[1] * per; ctx.beginPath(); ctx.moveTo(tx, by); ctx.lineTo(tx, by + 92); ctx.stroke(); ctx.fillText(tk[0], tx, by + 104);
});
var Ii = vars.Ii || 1, Kini = vars.KE0 || 1, L0 = vars.L0 || 1;
var rows = [["L", vars.Lm / L0, "#2F6FB0"], ["I", vars.Itot / Ii, "#2B2D31"], ["ω", om / (vars.w0 || 1), "#D1495B"], ["K", vars.KE / Kini, "#2A9D8F"]];
rows.forEach(function (rw, i) {
  var yy = by + 6 + i * 22, lg = Math.log(Math.max(1e-6, rw[1])) / Math.LN2, len = Math.max(-3, Math.min(3, lg)) * per;
  ctx.fillStyle = rw[2]; ctx.globalAlpha = 0.75;
  ctx.fillRect(Math.min(bc, bc + len), yy, Math.max(2, Math.abs(len)), 14);
  ctx.globalAlpha = 1;
  ctx.font = "bold 11px sans-serif"; ctx.textAlign = "right"; ctx.fillText(rw[0], bL - 8, yy + 11);
});
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bc, by); ctx.lineTo(bc, by + 92); ctx.stroke();
// ── 圖表 ──
var hh = track("_amH", [vars.t, om, vars.wth, vars.KE, vars.KE0 + vars.Wp], 6000);
var win = 20, t1 = Math.max(vars.t, win), t0 = t1 - win, vis = hh.filter(function (p) { return p[0] >= t0; });
miniPlot({ x: 326, y: 6, w: 288, h: 212 }, [
  { pts: vis.map(function (p) { return [p[0], p[2]]; }), color: "#9AA0A6", dash: [5, 4], width: 2.4, label: "理論 L/I" },
  { pts: vis.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "實測 ω" },
], { title: "角速度 ω (rad/s)", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: 0 });
miniPlot({ x: 326, y: 224, w: 288, h: 210 }, [
  { pts: vis.map(function (p) { return [p[0], p[4]]; }), color: "#E9A23B", dash: [5, 4], width: 2.4, label: "K_i + W" },
  { pts: vis.map(function (p) { return [p[0], p[3]]; }), color: "#2A9D8F", label: "動能 K" },
], { title: "動能 K (J)", xlabel: "t(s)", xmin: t0, xmax: t1, ymin: 0 });
`),
  ],
};

// ─────────────────────────────────────────────
// 火箭方程式（變質量系統）
// ─────────────────────────────────────────────
const rocketHandout = String.raw`# 🚀 火箭方程式：變質量系統實驗講義

> 1903 年，俄國中學老師齊奧爾科夫斯基（Konstantin Tsiolkovsky）寫下一條簡單的方程式：火箭能獲得的速度變化只取決於噴氣速率與「起飛質量／燃盡質量」的比值。這條方程式告訴我們，為什麼一枚把幾公噸衛星送上軌道的火箭，起飛時九成以上的質量都是推進劑。

## 一、實驗目的

1. 由動量守恆推導變質量系統的運動方程 $m\dfrac{dv}{dt} = u\dot m - mg - D$。
2. 在無重力、無空氣的環境中驗證齊奧爾科夫斯基火箭方程式 $\Delta v = u\ln(m_0/m_f)$。
3. 在均勻重力場中量測「重力損失」，驗證燃盡速度 $v_b = u\ln(m_0/m_f) - gt_b$。
4. 加入空氣阻力，觀察燃燒時間如何在重力損失與阻力損失之間取捨。

## 二、課前預報

1. 一枚火箭在 $dt$ 內以相對速率 $u$ 向後噴出質量 $dm_e$。寫出噴氣前後（火箭＋噴出氣體）的總動量，並推導 $m\ dv = u\ dm_e$。
2. 為什麼不能直接把牛頓第二定律寫成 $F = \dfrac{d(mv)}{dt}$ 來處理火箭？（提示：噴出的氣體帶走了多少動量？）
3. 噴氣速率 $u = 3000$ m/s、質量比 $m_0/m_f = 4$。在無重力的太空中，火箭的速度變化是多少？
4. 承上題，若在地表附近垂直發射、燃燒 60 s，重力損失是多少？燃盡速度是多少？
5. 進入近地軌道大約需要 9.4 km/s 的總速度變化（含各種損失）。若 $u = 3000$ m/s，單節火箭的質量比至少要多少？這說明了什麼？

## 三、實驗原理

### 1. 變質量系統的動量守恆
時刻 $t$ 火箭質量 $m$、速度 $v$。在 $dt$ 內噴出質量 $dm_e$，其相對火箭的速度為 $u$ 向後，對地速度為 $v - u$。若無外力，系統動量守恆：
$$ mv = \left(m - dm_e\right)\left(v + dv\right) + dm_e\left(v - u\right) $$
略去二階小量得 $m\ dv = u\ dm_e$。令 $\dot m = dm_e/dt$ 為每秒噴出的質量（燃燒率），$F = u\dot m$ 稱為推力。加上重力與空氣阻力 $D$：
$$ m\frac{dv}{dt} = u\dot m - mg - D $$

### 2. 齊奧爾科夫斯基火箭方程式
無外力時，火箭質量的減少量就是噴出的質量，$dv = -u\ dm/m$，積分得
$$ \Delta v = u\ln\frac{m_0}{m_f} $$
速度變化只與噴氣速率 $u$ 與質量比 $R = m_0/m_f$ 有關，與燃燒的快慢無關。工程上常用比衝 $I_{sp} = u/g_0$（單位：秒）描述推進劑的性能。

### 3. 重力損失
垂直上升、$g$ 為常數、燃燒率固定（燃燒時間 $t_b$）時，重力在整個燃燒期間持續「扣掉」速度：
$$ v_b = u\ln R - gt_b $$
燃盡高度為
$$ h_b = ut_b\left(1 - \frac{\ln R}{R - 1}\right) - \frac12 gt_b^2 $$
燃盡後火箭做鉛直上拋，最高點
$$ h_{\max} = h_b + \frac{v_b^2}{2g} $$
燃燒越快，重力損失 $gt_b$ 越小——但加速度越大，結構與乘員負荷越重，在稠密大氣中的阻力也越大。

### 4. 推重比
點火瞬間推力必須大於重量，火箭才能離開發射台：
$$ \text{推重比} = \frac{u\dot m}{m_0 g} \gt 1 $$
推重比小於 1 時，火箭會先「站在」發射台上空燒推進劑，直到質量降到 $u\dot m/g$ 以下才升空，此時實際的 $v_b$ 會比上式更小。

### 5. 空氣阻力
$D = \frac12\rho C_dAv^2$，大氣密度隨高度近似指數遞減：$\rho = \rho_0 e^{-h/H}$，$\rho_0 = 1.225$ kg/m³，標高 $H = 8.5$ km。阻力損失沒有簡單的解析式，需數值積分。

### 6. 本模擬
- 起飛質量 $m_0 = 20$ 公噸，$C_dA = 1.0$ m²，$g = 9.8$ m/s²（不隨高度變化）。
- **時間加速 10 倍**：模擬器每經過 1 秒，火箭飛行 10 秒。儀表板與圖表上的時間 $\tau$ 都是火箭的飛行時間。
- 以四階 Runge–Kutta 法積分，飛行時間步長 0.02 s；燃燒時間是步長的整數倍，熄火恰好發生在 $\tau = t_b$。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 噴氣速率 u | 1000 至 4500 m/s | 固體燃料約 2500 m/s，液氫液氧約 4400 m/s |
| 質量比 R | 1.2 至 10 | R = m₀/m_f，起飛質量 ÷ 燃盡質量 |
| 燃燒時間 t_b | 10 至 150 s | 燃燒率 = 推進劑質量 ÷ t_b |
| 環境 | 0、1、2 | 0 = 無重力無空氣；1 = 均勻重力；2 = 重力＋空氣阻力 |

- 改變任一滑桿即重新發射。
- **左側**：高度標尺（自動縮放）上的火箭；燃燒時尾端有火焰，右側小槽為剩餘推進劑。天空顏色隨高度變暗。
- **右上**：速度 $v(\tau)$。藍線為實測，灰色虛線為無阻力的解析解，紫色點線為齊奧爾科夫斯基 $u\ln R$。
- **右下**：質量 $m(\tau)$，燃燒期間線性下降，熄火後維持 $m_f$。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：齊奧爾科夫斯基方程式（環境 0、u = 3000 m/s、t_b = 60 s）
改變質量比，記錄熄火時的速度：

| m₀/m_f | ln(m₀/m_f) | 實測燃盡速度 v_b (m/s) | 理論 u ln(m₀/m_f) (m/s) | 相對誤差 |
|---|---|---|---|---|
| 1.5 | | | | |
| 2 | | | | |
| 4 | | | | |
| 7 | | | | |
| 10 | | | | |

以 $v_b$ 對 $\ln(m_0/m_f)$ 作圖，斜率應等於 $u$。再固定質量比、改變 $t_b$，確認 $v_b$ 與燃燒時間無關。

### 步驟 B：重力損失（環境 1、u = 3000 m/s、m₀/m_f = 4）

| t_b (s) | 推重比 | 實測 v_b (m/s) | 理論 u ln R − g t_b (m/s) | 重力損失 u ln R − v_b (m/s) | 實測最高點 (km) |
|---|---|---|---|---|---|
| 20 | | | | | |
| 60 | | | | | |
| 100 | | | | | |
| 150 | | | | | |

哪一個燃燒時間的推重比小於 1？此時實測值與理論公式差多少？為什麼？

### 步驟 C：阻力損失（環境 2，其餘同步驟 B）

| t_b (s) | 實測 v_b (m/s) | 無阻力理論 v_b (m/s) | 阻力損失 (m/s) | 重力損失 g t_b (m/s) | 總損失 (m/s) |
|---|---|---|---|---|---|
| 10 | | | | | |
| 20 | | | | | |
| 40 | | | | | |
| 60 | | | | | |
| 100 | | | | | |

總損失在哪個燃燒時間附近最小？用一句話說明重力損失與阻力損失的取捨。

## 六、實驗探究問題

1. 齊奧爾科夫斯基方程式中，$u$ 加倍與質量比平方，對 $\Delta v$ 的效果相同。工程上哪一個比較容易做到？
2. 兩節式火箭：第一節燃盡後拋掉空殼再點燃第二節。說明為什麼分節能大幅提高總 $\Delta v$。
3. 實際的運載火箭不會一直垂直上升，而是逐漸轉向水平（重力轉彎）。這對重力損失有什麼影響？
4. 火箭在太空中「推」的是什麼？為什麼真空中反而推得比在大氣中更有效率？
5. 在步驟 B 中，若把重力改為隨高度變化 $g = g_0 R_E^2/(R_E + h)^2$，模擬的最高點會變高還是變低？

## 七、誤差來源與模型限制

- 噴氣速率視為定值；真實噴嘴的有效噴氣速率隨外界氣壓改變（海平面較低、真空較高）。
- 重力加速度不隨高度變化，因此數百公里高的最高點只是示意，會低估真實高度。
- 一維垂直運動，忽略地球自轉、曲率、重力轉彎與風。
- 阻力係數 $C_d$ 視為常數；真實火箭的 $C_d$ 在穿音速時明顯增大。
- 數值積分：步長 0.02 s 的 RK4，在環境 0、1 時與解析解的差距小於 0.01 m/s。

## 八、延伸挑戰

1. 實作兩節式火箭（新增第二節的質量比與噴氣速率），比較同樣總質量下單節與兩節的燃盡速度。
2. 讓燃燒率隨時間改變（例如保持加速度不超過 4g 的節流），計算重力損失與加速度的關係。
3. 改用隨高度變化的重力，計算達到逃逸速度所需的最小質量比。

## 九、延伸閱讀

- K. E. Tsiolkovsky,〈利用反作用裝置探索宇宙空間〉（Исследование мировых пространств реактивными приборами），*Научное обозрение*（1903）
- D. Kleppner, R. Kolenkow, *An Introduction to Mechanics*, 2nd ed., Ch. 4〈Momentum〉：火箭運動
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Center of Mass and Linear Momentum〉章：Systems with Varying Mass: A Rocket
- G. P. Sutton, O. Biblarz, *Rocket Propulsion Elements*, 9th ed. (Wiley, 2017)
- H. D. Curtis, *Orbital Mechanics for Engineering Students*, Ch. 11〈Rocket Vehicle Dynamics〉：重力損失與分節火箭
`;

// m(τ)、有效重力、空氣阻力與加速度（飛行時間 τ = tf）
const RK_M = 'Math.max(m0 / R, m0 - mdot * tf)';
const RK_G = '(env >= 0.5 ? g0 : 0)';
const RK_D = '(env >= 1.5 ? 0.6125 * Math.exp(-h / 8500) * CdA * v * Math.abs(v) : 0)';
const RK_ACC = `((burn * u * mdot - ${RK_M} * ${RK_G} - ${RK_D}) / ${RK_M})`;

const rocket: ExampleDef = {
  id: 'rocket',
  category: '力學',
  difficulty: '進階',
  listDescription: '垂直發射的火箭邊噴氣邊減少質量：改變噴氣速率、質量比與燃燒時間，比較燃盡速度與齊奧爾科夫斯基方程式 u ln(m₀/m_f)，並量測重力損失 g·t_b 與空氣阻力損失。',
  description: rocketHandout,
  info: { title: '火箭方程式（變質量系統）', author: '', keywords: '', abstract: '' },
  variables: doubles('rk', [
    ['h', '0', '高度（m）'],
    ['v', '0', '速度（m/s，向上為正）'],
    ['tf', '0', '飛行時間 τ（s）'],
    ['u', '3000', '噴氣速率（m/s）'],
    ['R', '4', '質量比 m₀/m_f'],
    ['tb', '60', '燃燒時間（s）'],
    ['env', '1', '環境：0 無重力、1 重力、2 重力＋空氣阻力'],
    ['m0', '20000', '起飛質量（kg）'],
    ['CdA', '1', '阻力係數 × 截面積（m²）'],
    ['g0', '9.8', '重力加速度（m/s²）'],
    ['ks', '10', '時間加速倍率（每 1 s 模擬時間 = ks 秒飛行時間）'],
    ['mf', '5000', '燃盡質量（kg）'],
    ['mdot', '250', '燃燒率（kg/s）'],
    ['burn', '1', '是否燃燒中（1/0）'],
    ['mass', '20000', '目前質量（kg）'],
    ['Fth', '0', '推力（N）'],
    ['Dr', '0', '空氣阻力（N）'],
    ['vbo', '0', '實測燃盡速度（m/s）'],
    ['hbo', '0', '實測燃盡高度（m）'],
    ['hmax', '0', '實測最高點（m）'],
    ['done', '0', '已熄火（1/0）'],
  ]),
  odePages: [{
    id: 'rk-ode', name: '火箭運動方程', method: 'RungeKutta', increment: '0.002',
    comment: 'm dv/dτ = u·ṁ − mg − D；時間加速 ks 倍，所以每個變化率都乘上 ks',
    rates: [
      { state: 'h', expression: 'ks * v' },
      { state: 'v', expression: `ks * ((h <= 0 && v <= 0 && ${RK_ACC} < 0) ? 0 : ${RK_ACC})` },
      { state: 'tf', expression: 'ks' },
    ],
  }],
  constraintPages: [{
    id: 'rk-con', name: '發射、熄火與地面', comment: '燃燒旗標在每步開始時決定，熄火恰好落在步長邊界',
    code: String.raw`var sig = u + '|' + R + '|' + tb + '|' + env + '|' + m0;
if (_v._sig !== sig) {
  _v._sig = sig;
  t = 0; tf = 0; h = 0; v = 0; vbo = 0; hbo = 0; hmax = 0; done = 0;
}
mf = m0 / R;
mdot = (m0 - mf) / tb;
burn = tf < tb - 1e-6 ? 1 : 0;
mass = Math.max(mf, m0 - mdot * tf);
if (h < 0) { h = 0; if (v < 0) v = 0; }
Fth = burn * u * mdot;
Dr = env >= 1.5 ? 0.6125 * Math.exp(-h / 8500) * CdA * v * Math.abs(v) : 0;
if (done < 0.5 && tf >= tb - 1e-6) { done = 1; vbo = v; hbo = h; }
if (h > hmax) hmax = h;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rk-dp', 640, 460, [0, 10, 0, 10]),
    slider('rk-s-u', 'u', 1000, 4500, 50, '噴氣速率 u (m/s)'),
    slider('rk-s-R', 'R', 1.2, 10, 0.1, '質量比 R'),
    slider('rk-s-tb', 'tb', 10, 150, 5, '燃燒時間 t_b (s)'),
    slider('rk-s-env', 'env', 0, 2, 1, '環境 0／1／2'),
    readout('rk-r-twr', '推重比 u·ṁ / m₀g', 'u * mdot / (m0 * g0)', { digits: 2, color: C.purple, group: '設定' }),
    readout('rk-r-isp', '比衝 I_sp = u / g', 'u / g0', { unit: 's', digits: 0, color: C.muted, group: '設定' }),
    readout('rk-r-dv', '理想 Δv = u ln R', 'u * Math.log(R)', { unit: 'm/s', digits: 1, color: C.muted, group: '燃盡速度' }),
    readout('rk-r-gl', '重力損失 g·t_b', 'env >= 0.5 ? g0 * tb : 0', { unit: 'm/s', digits: 1, color: C.muted, group: '燃盡速度' }),
    readout('rk-r-vth', '理論 v_b（無阻力）', 'u * Math.log(R) - (env >= 0.5 ? g0 * tb : 0)', { unit: 'm/s', digits: 1, color: C.muted, group: '燃盡速度' }),
    readout('rk-r-vbo', '實測燃盡速度 v_b', 'done > 0.5 ? vbo : "燃燒中…"', { unit: 'm/s', digits: 1, color: C.blue, group: '燃盡速度' }),
    readout('rk-r-dl', '阻力損失', 'env < 1.5 ? "（無空氣）" : done > 0.5 ? u * Math.log(R) - g0 * tb - vbo : "燃燒中…"', { unit: 'm/s', digits: 1, color: C.red, group: '燃盡速度' }),
    readout('rk-r-hth', '理論燃盡高度（無阻力）', '(u * tb * (1 - Math.log(R) / (R - 1)) - (env >= 0.5 ? 0.5 * g0 * tb * tb : 0)) / 1000', { unit: 'km', digits: 3, color: C.muted, group: '高度' }),
    readout('rk-r-hbo', '實測燃盡高度', 'done > 0.5 ? hbo / 1000 : "燃燒中…"', { unit: 'km', digits: 3, color: C.blue, group: '高度' }),
    readout('rk-r-apth', '理論最高點（無阻力）', 'env < 0.5 ? "∞（無重力）" : (u * tb * (1 - Math.log(R) / (R - 1)) - 0.5 * g0 * tb * tb + Math.pow(Math.max(0, u * Math.log(R) - g0 * tb), 2) / (2 * g0)) / 1000', { unit: 'km', digits: 2, color: C.muted, group: '高度' }),
    readout('rk-r-hmax', '實測最高點', 'env < 0.5 ? "持續上升" : (done > 0.5 && v < 0) ? hmax / 1000 : "上升中…"', { unit: 'km', digits: 2, color: C.blue, group: '高度' }),
    readout('rk-r-tf', '飛行時間 τ', 'tf', { unit: 's', digits: 1, color: C.ink, group: '即時' }),
    readout('rk-r-m', '目前質量 m', 'mass', { unit: 'kg', digits: 0, color: C.amber, group: '即時' }),
    readout('rk-r-v', '速度 v', 'v', { unit: 'm/s', digits: 1, color: C.blue, group: '即時' }),
    readout('rk-r-h', '高度 h', 'h / 1000', { unit: 'km', digits: 3, color: C.teal, group: '即時' }),
    readout('rk-r-F', '推力 F = u·ṁ', 'Fth / 1000', { unit: 'kN', digits: 1, color: C.red, group: '即時' }),
    customDraw('rk-draw', '火箭與圖表', String.raw`
var hgt = vars.h, vel = vars.v, tau = vars.tf, uu = vars.u, RR = vars.R, tb = vars.tb, env = vars.env;
var gE = env >= 0.5 ? vars.g0 : 0, burning = vars.burn > 0.5;
// ── 天空與地面 ──
var SW = 250, G = H - 34, Tp = 36;
var f = Math.min(1, hgt / 60000);
function mix(a, b) { return Math.round(a + (b - a) * f); }
var sky = ctx.createLinearGradient(0, 0, 0, G);
sky.addColorStop(0, "rgb(" + mix(170, 18) + "," + mix(205, 24) + "," + mix(235, 46) + ")");
sky.addColorStop(1, "rgb(" + mix(232, 40) + "," + mix(242, 52) + "," + mix(248, 84) + ")");
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
ctx.fillStyle = sky; ctx.fillRect(0, 0, SW, G);
ctx.fillStyle = "#D9D3C4"; ctx.fillRect(0, G, SW, H - G);
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, G); ctx.lineTo(SW, G); ctx.stroke();
// ── 高度標尺（自動縮放）──
function niceUp(x) { var p = Math.pow(10, Math.floor(Math.log10(x))), n = x / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
var Hs = niceUp(Math.max(1000, vars.hmax * 1.15, hgt * 1.15));
function Y(z) { return G - z / Hs * (G - Tp); }
var lightTxt = f > 0.45;
ctx.strokeStyle = lightTxt ? "rgba(255,255,255,0.35)" : "rgba(43,45,49,0.25)"; ctx.fillStyle = lightTxt ? "#E8ECF2" : "#2B2D31";
ctx.font = "10px monospace"; ctx.textAlign = "right"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(48, G); ctx.lineTo(48, Tp); ctx.stroke();
for (var k = 0; k <= 5; k++) {
  var zz = Hs * k / 5, yk = Y(zz);
  ctx.beginPath(); ctx.moveTo(44, yk); ctx.lineTo(52, yk); ctx.stroke();
  ctx.fillText(Hs >= 5000 ? (zz / 1000).toFixed(zz / 1000 < 10 && Hs < 10000 ? 1 : 0) + " km" : zz.toFixed(0) + " m", 42, yk + 3);
}
ctx.textAlign = "left"; ctx.font = "11px sans-serif"; ctx.fillText("高度 h", 8, 16);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.fillText("時間加速 ×10", 8, H - 10);
// 最高點標記
if (vars.hmax > 0) { ctx.strokeStyle = "rgba(233,162,59,0.8)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(52, Y(vars.hmax)); ctx.lineTo(SW - 6, Y(vars.hmax)); ctx.stroke(); ctx.setLineDash([]); }
// ── 火箭 ──
var rx = 140, base = Y(hgt), bodyH = 54, bw = 16;
if (burning && hgt > 0) {
  var sm = ctx.createLinearGradient(0, base, 0, G);
  sm.addColorStop(0, "rgba(220,220,220,0.75)"); sm.addColorStop(1, "rgba(220,220,220,0.05)");
  ctx.fillStyle = sm; ctx.fillRect(rx - 7, base, 14, Math.max(0, G - base));
}
if (burning) {
  var fl = 18 + 10 * Math.min(3, vars.Fth / (vars.m0 * 9.8)) + 6 * Math.random();
  var fg = ctx.createLinearGradient(0, base, 0, base + fl);
  fg.addColorStop(0, "rgba(255,240,180,1)"); fg.addColorStop(0.4, "rgba(233,162,59,0.95)"); fg.addColorStop(1, "rgba(209,73,91,0)");
  ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(rx - 7, base); ctx.lineTo(rx + 7, base); ctx.lineTo(rx, base + fl); ctx.closePath(); ctx.fill();
}
ctx.fillStyle = "#2F6FB0";
ctx.beginPath(); ctx.moveTo(rx - bw / 2, base - 4); ctx.lineTo(rx - bw / 2 - 9, base + 2); ctx.lineTo(rx - bw / 2, base - 18); ctx.closePath(); ctx.fill();
ctx.beginPath(); ctx.moveTo(rx + bw / 2, base - 4); ctx.lineTo(rx + bw / 2 + 9, base + 2); ctx.lineTo(rx + bw / 2, base - 18); ctx.closePath(); ctx.fill();
ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.2;
ctx.fillRect(rx - bw / 2, base - bodyH, bw, bodyH); ctx.strokeRect(rx - bw / 2, base - bodyH, bw, bodyH);
ctx.fillStyle = "#D1495B"; ctx.beginPath(); ctx.moveTo(rx - bw / 2, base - bodyH); ctx.lineTo(rx + bw / 2, base - bodyH); ctx.lineTo(rx, base - bodyH - 18); ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.fillRect(rx - bw / 2 + 2, base - 2, bw - 4, 3);
// 推進劑槽（右側）
var gx = 208, gy = 70, gh = 130, frac = Math.max(0, (vars.mass - vars.mf) / (vars.m0 - vars.mf));
ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(gx, gy, 16, gh);
ctx.fillStyle = "#E9A23B"; ctx.fillRect(gx, gy + gh * (1 - frac), 16, gh * frac);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1; ctx.strokeRect(gx + 0.5, gy + 0.5, 15, gh);
ctx.fillStyle = lightTxt ? "#E8ECF2" : "#2B2D31"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("推進劑", gx + 8, gy - 6);
ctx.fillText(burning ? "點火中" : (hgt <= 0 && vars.done > 0.5 ? "已落地" : "熄火滑行"), gx + 8, gy + gh + 16);
// ── 圖表 ──
var hist = track("_rkH", [vars.t, tau, vel, vars.mass / 1000], 8000);
var tmax = Math.max(1.3 * tb, tau);
var a = (1 - 1 / RR) / tb, th = [];
var vbt = uu * Math.log(RR) - gE * tb;
for (var i = 0; i <= 160; i++) {
  var tt = tmax * i / 160;
  th.push([tt, tt < tb ? -uu * Math.log(1 - a * tt) - gE * tt : vbt - gE * (tt - tb)]);
}
var dvI = uu * Math.log(RR);
miniPlot({ x: 258, y: 6, w: 376, h: 222 }, [
  { pts: [[0, dvI], [tmax, dvI]], color: "#533177", dash: [2, 3], label: "u ln R" },
  { pts: th, color: "#9AA0A6", dash: [5, 4], width: 2.4, label: "無阻力解析解" },
  { pts: hist.map(function (p) { return [p[1], p[2]]; }), color: "#2F6FB0", label: "實測 v" },
], { title: "速度 v (m/s)", xlabel: "τ(s)", xmin: 0, xmax: tmax, ymax: Math.max(dvI, 1) * 1.12 });
miniPlot({ x: 258, y: 234, w: 376, h: 220 }, [
  { pts: [[0, vars.mf / 1000], [tmax, vars.mf / 1000]], color: "#9AA0A6", dash: [4, 3], label: "m_f" },
  { pts: hist.map(function (p) { return [p[1], p[3]]; }), color: "#B97A1E", label: "m(τ)" },
], { title: "質量 m（公噸）", xlabel: "τ(s)", xmin: 0, xmax: tmax, ymin: 0, ymax: vars.m0 / 1000 * 1.08 });
`),
  ],
};

// ─────────────────────────────────────────────
// 霍曼轉移軌道（衛星變軌）
// ─────────────────────────────────────────────
const hohmannHandout = String.raw`# 🛰️ 霍曼轉移軌道：衛星變軌實驗講義

> 1925 年，德國工程師霍曼（Walter Hohmann）在《天體的可達性》一書中指出：要在兩個共面的圓軌道之間移動，最省燃料的方法是沿著一個同時與兩圓相切的橢圓「滑行」半圈。一百年後，通訊衛星進入地球同步軌道、探測器飛往火星，用的仍是這個想法。

## 一、實驗目的

1. 以活力方程式（vis-viva）計算圓軌道與橢圓軌道上的速率，求出霍曼轉移所需的兩次速度增量 $\Delta v_1$、$\Delta v_2$。
2. 實際操作兩次點火，量測轉移軌道的遠拱點距離與轉移時間，與理論值 $r_2$、$\pi\sqrt{a^3/GM}$ 比較。
3. 追蹤每次點火前後的比能量 $\varepsilon$ 與比角動量 $h$，理解「加速兩次、最後反而變慢」的道理。
4. 體驗點火時機錯誤的後果，理解為什麼第二次點火必須在遠拱點進行。

## 二、課前預報

1. 由萬有引力提供向心力，推導半徑 $r$ 的圓軌道速率 $v_c = \sqrt{GM/r}$ 與週期。
2. 寫出活力方程式 $v^2 = GM\left(\dfrac{2}{r} - \dfrac{1}{a}\right)$，並說明它來自哪兩個守恆律。
3. 本模擬中 $GM = 1$、$r_1 = 1$。若 $r_2 = 3$，計算轉移橢圓的半長軸、$\Delta v_1$、$\Delta v_2$ 與轉移時間。
4. 承上題，最終圓軌道的速率比起始圓軌道快還是慢？比能量是增加還是減少？
5. 地球低軌道（$r_1 = 6678$ km）到地球同步軌道（$r_2 = 42164$ km），$GM_E = 3.986 \times 10^5$ km³/s²。估算總 $\Delta v$ 與轉移所需時間。

## 三、實驗原理

### 1. 克卜勒軌道的守恆量
在中心力場中，比能量（每單位質量的力學能）與比角動量守恆：
$$ \varepsilon = \frac{v^2}{2} - \frac{GM}{r} = -\frac{GM}{2a}, \qquad h = rv_\perp = \sqrt{GMa\left(1 - e^2\right)} $$
由第一式即得活力方程式
$$ v^2 = GM\left(\frac{2}{r} - \frac{1}{a}\right) $$
圓軌道 $a = r$，速率 $v_c = \sqrt{GM/r}$：軌道越高，速率越慢。

### 2. 霍曼轉移橢圓
轉移橢圓的近拱點在 $r_1$、遠拱點在 $r_2$：
$$ a_t = \frac{r_1 + r_2}{2}, \qquad e_t = \frac{r_2 - r_1}{r_2 + r_1} $$
在近拱點順著運動方向點火（順行點火），速率由 $\sqrt{GM/r_1}$ 增加到活力方程式給出的近拱點速率：
$$ \Delta v_1 = \sqrt{\frac{GM}{r_1}}\left(\sqrt{\frac{2r_2}{r_1 + r_2}} - 1\right) $$
滑行半圈到遠拱點，速率降為 $v_a = \sqrt{GM\left(\frac{2}{r_2} - \frac{1}{a_t}\right)}$，再順行點火一次把軌道圓化：
$$ \Delta v_2 = \sqrt{\frac{GM}{r_2}}\left(1 - \sqrt{\frac{2r_1}{r_1 + r_2}}\right) $$
轉移時間為轉移橢圓週期的一半（克卜勒第三定律）：
$$ t_H = \pi\sqrt{\frac{a_t^3}{GM}} $$

### 3. 為什麼點火要在近拱點與遠拱點
在拱點上速度垂直於半徑，順行點火只改變速率而不改變方向，新軌道仍以這一點為拱點。若在轉移橢圓的其他位置點火，速度有徑向分量，要變成圓軌道就必須同時抵消徑向速度，所需的 $\Delta v$ 更大，而且最後的圓軌道半徑也不是 $r_2$。

### 4. 本模擬
- 單位制：$GM = 1$、$r_1 = 1$，因此停泊軌道速率為 1、週期為 $2\pi$。
- 以四階 Runge–Kutta 法積分 $\ddot{\vec r} = -GM\vec r/r^3$，步長 0.002；點火視為瞬間完成（脈衝式點火）。
- **第一次點火**：沿速度方向把速率調為活力方程式算出的轉移速率 $\sqrt{GM\left(\frac{2}{r} - \frac{2}{r + r_2}\right)}$。
- **第二次點火**：把速度改為該處的圓軌道速度（垂直於半徑、大小 $\sqrt{GM/r}$）；儀表板顯示實際所需的速度增量。
- 遠拱點以「徑向速度由正轉負」偵測，並以線性內插求出通過時刻。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 軌道半徑比 r₂/r₁ | 1.5 至 6 | 目標圓軌道的半徑，改變後重新開始 |
| 自動模式 | 0 或 1 | 1 = 自動（繞停泊軌道一圈後點火、到遠拱點自動圓化）；0 = 手動 |
| **第一次點火** | 按鈕 | 手動模式下，在停泊軌道上任何位置都可點火 |
| **第二次點火** | 按鈕 | 手動模式下，請等衛星到達遠拱點再按 |
| **重新開始** | 按鈕 | 回到停泊軌道起點 |

- **左側軌道圖**：綠色虛線圓為停泊軌道 $r_1$，橘色虛線圓為目標軌道 $r_2$，藍色虛線為理論轉移橢圓（點火前顯示預定的橢圓）。軌跡顏色依階段區分：綠＝停泊、藍＝轉移、橘＝最終軌道。紅色箭頭為衛星速度，兩個星形記號為點火位置，旁邊的箭頭為點火後的速度方向。
- **右上**：衛星與行星的距離 $r(t)$，虛線為 $r_1$ 與 $r_2$。
- **右下**：比能量 $\varepsilon(t)$，虛線為三個階段的理論值 $-GM/2r_1$、$-GM/2a_t$、$-GM/2r_2$。每次點火都是一次階梯。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：一次完整的霍曼轉移（自動模式、r₂/r₁ = 3）

| 物理量 | 理論值 | 實測值 | 相對誤差 |
|---|---|---|---|
| 停泊軌道速率 | | | |
| Δv₁ | | | |
| 遠拱點距離 | | | |
| 遠拱點速率 | | | |
| 轉移時間 | | | |
| Δv₂ | | | |
| 最終軌道離心率 | 0 | | |

另外記錄三個階段的比能量 $\varepsilon$ 與比角動量 $h$：

| 階段 | 理論 ε | 實測 ε | 理論 h | 實測 h |
|---|---|---|---|---|
| 停泊軌道 | | | | |
| 轉移軌道 | | | | |
| 最終軌道 | | | | |

### 步驟 B：目標高度與燃料成本（自動模式）

| r₂/r₁ | 實測 Δv₁ | 實測 Δv₂ | 總 Δv | 實測轉移時間 | 理論轉移時間 |
|---|---|---|---|---|---|
| 1.5 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 6 | | | | | |

以總 $\Delta v$ 對 $r_2/r_1$ 作圖。總 $\Delta v$ 會一直增加嗎？（計算 $r_2/r_1 = 15.58$ 與 $r_2/r_1 \to \infty$ 時的理論值。）

### 步驟 C：點火時機錯了會怎樣？（手動模式、r₂/r₁ = 3）
1. 按「第一次點火」，在衛星**還沒到**遠拱點時（例如轉移時間過一半）就按「第二次點火」。
2. 記錄最終圓軌道半徑與實際所需的 $\Delta v_2$，與正確時機比較。

| 第二次點火時機 | 點火時的 r | 實測 Δv₂ | 理論 Δv₂（霍曼） | 多花的 Δv |
|---|---|---|---|---|
| 遠拱點 | | | | |
| 轉移時間的 50% | | | | |
| 轉移時間的 75% | | | | |

## 六、實驗探究問題

1. 兩次點火都讓衛星加速，為什麼最終圓軌道的速率反而比停泊軌道慢？速度的減少發生在哪一段？能量轉到哪裡去了？
2. 為什麼第一次點火可以在停泊軌道的任何位置進行，第二次卻必須在遠拱點？
3. 若要從高軌道降到低軌道，應該如何點火？兩次點火的方向與大小各是什麼？
4. 太空站在軌道前方 1 km 處，太空梭若直接朝它「往前加速」，會發生什麼事？（提示：加速使軌道變高、週期變長。）
5. 地球到火星的霍曼轉移約需 259 天。用 $r_1 = 1$ AU、$r_2 = 1.524$ AU 驗證這個數字，並說明為什麼發射窗口約每 26 個月才出現一次。

## 七、誤差來源與模型限制

- 點火視為瞬間完成。真實火箭引擎推力有限，點火要持續數分鐘，會損失部分效率（有限燃燒損失）。
- 行星視為點質量，忽略扁率（J₂ 項）、大氣阻力、其他天體（如月球、太陽）的擾動。
- 遠拱點與點火時機以離散時間步偵測，造成約 $10^{-6}$ 量級的偏差；最終軌道的離心率因此不會精確為 0。
- 只考慮共面軌道；真實的地球同步轉移還要同時改變軌道傾角，所需 $\Delta v$ 更大。

## 八、延伸挑戰

1. 實作雙橢圓轉移（bi-elliptic transfer）：先升到比 $r_2$ 更高的 $r_b$，再降回 $r_2$。驗證當 $r_2/r_1 \gt 11.94$ 時它比霍曼轉移更省 $\Delta v$。
2. 加入第二顆在 $r_2$ 圓軌道上運行的目標衛星，計算交會所需的相位角 $\theta = \pi\left(1 - \left(\frac{r_1 + r_2}{2r_2}\right)^{3/2}\right)$，並實際完成交會。
3. 以有限推力取代脈衝點火（點火期間持續施加切向加速度），比較所需的總 $\Delta v$。

## 九、延伸閱讀

- W. Hohmann, *Die Erreichbarkeit der Himmelskörper* (Oldenbourg, 1925)；英譯本 NASA Technical Translation F-44 (1960)
- H. D. Curtis, *Orbital Mechanics for Engineering Students*, Ch. 6〈Orbital Maneuvers〉
- R. R. Bate, D. D. Mueller, J. E. White, *Fundamentals of Astrodynamics* (Dover, 1971), Ch. 3
- J. R. Taylor, *Classical Mechanics*, Ch. 8〈Two-Body Central-Force Problems〉：Changes of Orbit
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Gravitation〉章：Satellites: Orbits and Energy
`;

const hohmann: ExampleDef = {
  id: 'hohmann',
  category: '力學',
  difficulty: '進階',
  listDescription: '衛星從低圓軌道出發，順行點火進入轉移橢圓、在遠拱點再點火圓化：儀表板以活力方程式比較 Δv₁、Δv₂、遠拱點與轉移時間 π√(a³/GM)，並追蹤比能量與角動量的階梯變化。',
  description: hohmannHandout,
  info: { title: '霍曼轉移軌道（衛星變軌）', author: '', keywords: '', abstract: '' },
  variables: doubles('hm', [
    ['x', '1', '衛星 x 位置'], ['y', '0', '衛星 y 位置'],
    ['vx', '0', '衛星 x 速度'], ['vy', '1', '衛星 y 速度'],
    ['GM', '1', '重力常數 × 行星質量'],
    ['r1', '1', '停泊軌道半徑'],
    ['k2', '3', '目標軌道半徑比 r₂/r₁'],
    ['r2', '3', '目標軌道半徑'],
    ['auto', '1', '模式：1 自動、0 手動'],
    ['cmd', '0', '按鈕指令：1 第一次點火、2 第二次點火、9 重新開始'],
    ['phase', '0', '階段：0 停泊、1 轉移、2 最終軌道'],
    ['rr', '1', '目前距離 r'],
    ['vv', '1', '目前速率 v'],
    ['eps', '-0.5', '比能量 v²/2 − GM/r'],
    ['hz', '1', '比角動量 x·vy − y·vx'],
    ['ecc', '0', '目前軌道離心率'],
    ['dv1', '0', '第一次點火速度增量'],
    ['dv2', '0', '第二次點火速度增量'],
    ['tB1', '0', '第一次點火時刻'],
    ['tTr', '0', '實測轉移時間（點火到遠拱點）'],
    ['rApo', '0', '轉移軌道上量到的最大距離'],
    ['vApo', '0', '遠拱點速率'],
    ['nApo', '0', '已通過遠拱點（1/0）'],
    ['rB2', '0', '第二次點火時的距離'],
  ]),
  odePages: [{
    id: 'hm-ode', name: '重力方程', method: 'RungeKutta', increment: '0.002', comment: '點火為瞬間速度改變，在約束頁處理',
    rates: [
      { state: 'x', expression: 'vx' },
      { state: 'y', expression: 'vy' },
      { state: 'vx', expression: '-GM * x / Math.pow(x * x + y * y, 1.5)' },
      { state: 'vy', expression: '-GM * y / Math.pow(x * x + y * y, 1.5)' },
    ],
  }],
  constraintPages: [{
    id: 'hm-con', name: '點火、遠拱點偵測與軌道量測', comment: '遠拱點：徑向速度 r·v 由正轉負，以 d(r·v)/dt = v² − GM/r 內插通過時刻',
    code: String.raw`r2 = k2 * r1;
var sig = k2 + '|' + auto + '|' + r1 + '|' + GM;
if (_v._sig !== sig || cmd > 8) {
  _v._sig = sig; cmd = 0; t = 0;
  x = r1; y = 0; vx = 0; vy = Math.sqrt(GM / r1);
  phase = 0; dv1 = 0; dv2 = 0; tB1 = 0; tTr = 0; rApo = 0; vApo = 0; nApo = 0; rB2 = 0;
  _v._yp = 0; _v._rvp = 0; _v._b1 = null; _v._b2 = null;
}
rr = Math.sqrt(x * x + y * y); vv = Math.sqrt(vx * vx + vy * vy);
var rv = x * vx + y * vy, fire2 = false;
// 第一次點火：沿速度方向把速率調為轉移橢圓在此處的速率
if (phase < 0.5 && (cmd === 1 || (auto >= 0.5 && _v._yp < 0 && y >= 0 && x > 0))) {
  var vNew = Math.sqrt(GM * (2 / rr - 2 / (rr + r2)));
  var ux = vx / vv, uy = vy / vv;
  dv1 = vNew - vv;
  vx = vNew * ux; vy = vNew * uy;
  phase = 1; tB1 = t; rApo = rr; _v._rvp = 0;
  _v._b1 = { x: x, y: y, ux: ux, uy: uy };
  vv = vNew; rv = x * vx + y * vy;
}
// 轉移軌道：量最大距離、偵測遠拱點
if (phase > 0.5 && phase < 1.5) {
  if (rr > rApo) rApo = rr;
  if (_v._rvp > 0 && rv <= 0 && nApo < 0.5) {
    nApo = 1;
    tTr = t - rv / (vv * vv - GM / rr) - tB1;
    vApo = vv;
    if (auto >= 0.5) fire2 = true;
  }
  _v._rvp = rv;
}
// 第二次點火：改為此處的圓軌道速度（垂直於半徑）
if (phase > 0.5 && phase < 1.5 && (cmd === 2 || fire2)) {
  var sgn = (x * vy - y * vx) >= 0 ? 1 : -1, vcir = Math.sqrt(GM / rr);
  var nvx = -sgn * y / rr * vcir, nvy = sgn * x / rr * vcir;
  dv2 = Math.sqrt((nvx - vx) * (nvx - vx) + (nvy - vy) * (nvy - vy));
  vx = nvx; vy = nvy; phase = 2; rB2 = rr;
  _v._b2 = { x: x, y: y, ux: nvx / vcir, uy: nvy / vcir };
}
if (cmd > 0) cmd = 0;
vv = Math.sqrt(vx * vx + vy * vy);
eps = 0.5 * vv * vv - GM / rr;
hz = x * vy - y * vx;
ecc = Math.sqrt(Math.max(0, 1 + 2 * eps * hz * hz / (GM * GM)));
_v._yp = y;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('hm-dp', 640, 460, [0, 10, 0, 10]),
    slider('hm-s-k', 'k2', 1.5, 6, 0.1, '半徑比 r₂/r₁'),
    slider('hm-s-auto', 'auto', 0, 1, 1, '自動模式'),
    button('hm-b-1', '第一次點火', 'cmd = 1;'),
    button('hm-b-2', '第二次點火', 'cmd = 2;'),
    button('hm-b-r', '重新開始', 'cmd = 9;'),
    readout('hm-r-ph', '目前階段', 'phase < 0.5 ? "停泊軌道 r₁" : phase < 1.5 ? (nApo > 0.5 ? "轉移軌道（已過遠拱點）" : "轉移軌道") : "最終圓軌道"', { color: C.purple, group: '點火' }),
    readout('hm-r-dv1t', '理論 Δv₁（活力方程式）', 'Math.sqrt(GM / r1) * (Math.sqrt(2 * r2 / (r1 + r2)) - 1)', { digits: 4, color: C.muted, group: '點火' }),
    readout('hm-r-dv1', '實施 Δv₁', 'phase > 0.5 ? dv1 : "尚未點火"', { digits: 4, color: C.blue, group: '點火' }),
    readout('hm-r-dv2t', '理論 Δv₂', 'Math.sqrt(GM / r2) * (1 - Math.sqrt(2 * r1 / (r1 + r2)))', { digits: 4, color: C.muted, group: '點火' }),
    readout('hm-r-dv2', '實施 Δv₂', 'phase > 1.5 ? dv2 : "尚未點火"', { digits: 4, color: C.blue, group: '點火' }),
    readout('hm-r-rb2', '第二次點火時的距離 r', 'phase > 1.5 ? rB2 : "—"', { digits: 4, color: C.ink, group: '點火' }),
    readout('hm-r-dvt', '理論總 Δv', 'Math.sqrt(GM / r1) * (Math.sqrt(2 * r2 / (r1 + r2)) - 1) + Math.sqrt(GM / r2) * (1 - Math.sqrt(2 * r1 / (r1 + r2)))', { digits: 4, color: C.muted, group: '點火' }),
    readout('hm-r-dvm', '實施總 Δv', 'phase > 1.5 ? dv1 + dv2 : "…"', { digits: 4, color: C.blue, group: '點火' }),
    readout('hm-r-r2', '目標半徑 r₂', 'r2', { digits: 4, color: C.muted, group: '轉移軌道' }),
    readout('hm-r-rapo', '實測遠拱點距離', 'nApo > 0.5 ? rApo : phase > 0.5 ? "轉移中…" : "—"', { digits: 4, color: C.blue, group: '轉移軌道' }),
    readout('hm-r-tth', '理論轉移時間 π√(a³/GM)', 'Math.PI * Math.sqrt(Math.pow((r1 + r2) / 2, 3) / GM)', { digits: 4, color: C.muted, group: '轉移軌道' }),
    readout('hm-r-ttr', '實測轉移時間', 'nApo > 0.5 ? tTr : phase > 0.5 ? t - tB1 : "—"', { digits: 4, color: C.blue, group: '轉移軌道' }),
    readout('hm-r-vat', '理論遠拱點速率 √(GM(2/r₂ − 1/a))', 'Math.sqrt(GM * (2 / r2 - 2 / (r1 + r2)))', { digits: 4, color: C.muted, group: '轉移軌道' }),
    readout('hm-r-va', '實測遠拱點速率', 'nApo > 0.5 ? vApo : "—"', { digits: 4, color: C.blue, group: '轉移軌道' }),
    readout('hm-r-eps', '比能量 ε（實測）', 'eps', { digits: 5, color: C.teal, group: '目前軌道' }),
    readout('hm-r-epst', '理論 ε = −GM/2a', 'phase < 0.5 ? -GM / (2 * r1) : phase < 1.5 ? -GM / (r1 + r2) : -GM / (2 * r2)', { digits: 5, color: C.muted, group: '目前軌道' }),
    readout('hm-r-h', '比角動量 h（實測）', 'hz', { digits: 5, color: C.teal, group: '目前軌道' }),
    readout('hm-r-ht', '理論 h = √(GMa(1−e²))', 'phase < 0.5 ? Math.sqrt(GM * r1) : phase < 1.5 ? Math.sqrt(2 * GM * r1 * r2 / (r1 + r2)) : Math.sqrt(GM * r2)', { digits: 5, color: C.muted, group: '目前軌道' }),
    readout('hm-r-e', '離心率 e（實測）', 'ecc', { digits: 5, color: C.amber, group: '目前軌道' }),
    readout('hm-r-et', '理論 e', 'phase > 0.5 && phase < 1.5 ? (r2 - r1) / (r2 + r1) : 0', { digits: 5, color: C.muted, group: '目前軌道' }),
    readout('hm-r-v', '目前速率 v', 'vv', { digits: 4, color: C.red, group: '目前軌道' }),
    customDraw('hm-draw', '軌道圖與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var GM = vars.GM, r1 = vars.r1, r2 = vars.r2, ph = vars.phase;
var cx = 222, cy = 228, sc = 206 / (r2 * 1.05);
function X(px) { return cx + px * sc; }
function Y(py) { return cy - py * sc; }
ctx.strokeStyle = "rgba(43,45,49,0.05)"; ctx.lineWidth = 1;
for (var gr = 1; gr <= r2 * 1.05; gr++) { ctx.beginPath(); ctx.arc(cx, cy, gr * sc, 0, 2 * Math.PI); ctx.stroke(); }
// 停泊與目標軌道
ctx.setLineDash([5, 5]); ctx.lineWidth = 1.4;
ctx.strokeStyle = "rgba(42,157,143,0.8)"; ctx.beginPath(); ctx.arc(cx, cy, r1 * sc, 0, 2 * Math.PI); ctx.stroke();
ctx.strokeStyle = "rgba(233,162,59,0.85)"; ctx.beginPath(); ctx.arc(cx, cy, r2 * sc, 0, 2 * Math.PI); ctx.stroke();
ctx.setLineDash([]);
// 理論轉移橢圓（近拱點在第一次點火處）
var b1 = vars._b1, b2 = vars._b2;
var thp = b1 ? Math.atan2(b1.y, b1.x) : (vars.auto >= 0.5 ? 0 : Math.atan2(vars.y, vars.x));
var aT = (r1 + r2) / 2, eT = (r2 - r1) / (r2 + r1), pT = aT * (1 - eT * eT);
ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]);
[[0, Math.PI, "rgba(47,111,176,0.75)"], [Math.PI, 2 * Math.PI, "rgba(47,111,176,0.22)"]].forEach(function (seg) {
  ctx.strokeStyle = seg[2]; ctx.beginPath();
  for (var j = 0; j <= 90; j++) {
    var th = seg[0] + (seg[1] - seg[0]) * j / 90, re = pT / (1 + eT * Math.cos(th));
    var qx = X(re * Math.cos(th + thp)), qy = Y(re * Math.sin(th + thp));
    if (j) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy);
  }
  ctx.stroke();
});
ctx.setLineDash([]);
// 拱點標示
ctx.fillStyle = "#2F6FB0"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
var apx = X(r2 * Math.cos(thp + Math.PI)), apy = Y(r2 * Math.sin(thp + Math.PI));
ctx.beginPath(); ctx.arc(apx, apy, 3, 0, 2 * Math.PI); ctx.fill();
var apR = Math.cos(thp + Math.PI) > 0;
ctx.textAlign = apR ? "right" : "left"; ctx.fillText("遠拱點", apx + (apR ? -6 : 6), apy + 15);
// 軌跡（依階段著色）
var tr = track("_hmT", [vars.t, vars.x, vars.y, ph], 9000);
var cols = ["#2A9D8F", "#2F6FB0", "#E9A23B"];
ctx.lineWidth = 2;
for (var i = 1; i < tr.length; i++) {
  ctx.strokeStyle = cols[Math.round(tr[i][3])] || "#2F6FB0";
  ctx.beginPath(); ctx.moveTo(X(tr[i - 1][1]), Y(tr[i - 1][2])); ctx.lineTo(X(tr[i][1]), Y(tr[i][2])); ctx.stroke();
}
// 行星
var pr = Math.max(9, 0.3 * sc), pg = ctx.createRadialGradient(cx - pr * 0.3, cy - pr * 0.3, 1, cx, cy, pr);
pg.addColorStop(0, "#9FD3C7"); pg.addColorStop(1, "#2F6FB0");
ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, pr, 0, 2 * Math.PI); ctx.fill();
// 點火記號
function burst(bb, label) {
  var bx = X(bb.x), by = Y(bb.y);
  ctx.save(); ctx.translate(bx, by); ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1;
  ctx.beginPath();
  for (var s = 0; s < 10; s++) { var ra = s % 2 ? 4 : 10, an = s * Math.PI / 5; if (s) ctx.lineTo(ra * Math.cos(an), ra * Math.sin(an)); else ctx.moveTo(ra, 0); }
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  arrow(bx, by, bx + bb.ux * 36, by - bb.uy * 36, "#B97A1E", 2);
  ctx.fillStyle = "#B97A1E"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(label, bx - bb.ux * 22, by + bb.uy * 22 + 4);
}
if (b1) burst(b1, "Δv₁");
if (b2) burst(b2, "Δv₂");
// 衛星與速度
var sx = X(vars.x), sy = Y(vars.y);
arrow(sx, sy, sx + vars.vx * 46, sy - vars.vy * 46, "#D1495B", 2.2);
ctx.fillStyle = "#2B2D31"; ctx.fillRect(sx - 4, sy - 4, 8, 8);
ctx.fillStyle = "#2F6FB0"; ctx.fillRect(sx - 12, sy - 2, 7, 4); ctx.fillRect(sx + 5, sy - 2, 7, 4);
// 標籤
ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillStyle = "#2A9D8F"; ctx.fillText("r₁ 停泊軌道", X(r1 * 0.72) + 4, Y(r1 * 0.72) - 4);
ctx.fillStyle = "#B97A1E"; ctx.fillText("r₂ 目標軌道", X(r2 * 0.66) + 4, Y(r2 * 0.75) - 2);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif";
ctx.fillText(vars.auto >= 0.5 ? "自動模式" : (ph < 0.5 ? "手動：按「第一次點火」" : ph < 1.5 ? "手動：到遠拱點再按「第二次點火」" : "手動模式：完成"), 8, H - 10);
// ── 圖表 ──
var hh = track("_hmR", [vars.t, vars.rr, vars.eps], 9000);
var t1 = Math.max(vars.t, 20);
miniPlot({ x: 448, y: 6, w: 186, h: 222 }, [
  { pts: [[0, r1], [t1, r1]], color: "#2A9D8F", dash: [4, 3] },
  { pts: [[0, r2], [t1, r2]], color: "#E9A23B", dash: [4, 3] },
  { pts: hh.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "r(t)" },
], { title: "距離 r", xlabel: "t", xmin: 0, xmax: t1, ymin: 0, ymax: r2 * 1.12 });
var e1 = -GM / (2 * r1), eT2 = -GM / (r1 + r2), e2 = -GM / (2 * r2);
miniPlot({ x: 448, y: 234, w: 186, h: 220 }, [
  { pts: [[0, e1], [t1, e1]], color: "#2A9D8F", dash: [4, 3] },
  { pts: [[0, eT2], [t1, eT2]], color: "#2F6FB0", dash: [4, 3] },
  { pts: [[0, e2], [t1, e2]], color: "#E9A23B", dash: [4, 3] },
  { pts: hh.map(function (p) { return [p[0], p[2]]; }), color: "#2B2D31", label: "ε(t)" },
], { title: "比能量 ε", xlabel: "t", xmin: 0, xmax: t1, ymin: e1 * 1.1, ymax: 0 });
`),
  ],
};

const DYNAMICS_EXAMPLES: ExampleDef[] = [angularMomentum, rocket, hohmann];

export default DYNAMICS_EXAMPLES;

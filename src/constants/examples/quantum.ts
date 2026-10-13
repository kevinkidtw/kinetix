import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：近代物理（量子）
// ═════════════════════════════════════════════════════════════

// 光波長 → 顯示顏色（CustomDraw 內共用的小函式，以原始碼字串嵌入）
const SPEC_RGB = String.raw`
function specRGB(l, al) {
  if (l < 380) return "rgba(123,94,167," + al + ")";
  if (l > 780) return "rgba(140,52,52," + al + ")";
  var r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; }
  else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = (645 - l) / 65; }
  else { r = 1; }
  var fa = l < 420 ? 0.4 + 0.6 * (l - 380) / 40 : (l > 700 ? 0.4 + 0.6 * (780 - l) / 80 : 1);
  return "rgba(" + Math.round(235 * r * fa) + "," + Math.round(215 * g * fa) + "," + Math.round(235 * b * fa) + "," + al + ")";
}
`;

// ─────────────────────────────────────────────
// 光電效應與普朗克常數
// ─────────────────────────────────────────────
const photoelectricHandout = String.raw`# 💡 光電效應與普朗克常數實驗講義

> 1905 年，愛因斯坦提出「光是由一顆顆能量 $hf$ 的光量子組成」來解釋光電效應。密立根原本不相信這個想法，花了十年做最仔細的實驗想推翻它，結果在 1916 年反而精確證實了截止電壓與頻率的直線關係，並由斜率量出普朗克常數。愛因斯坦因「光電效應定律」獲得 1921 年諾貝爾物理獎。

## 一、實驗目的

1. 觀察光電流如何隨入射光的頻率、強度與外加電壓改變。
2. 由 I–V 曲線找出截止電壓 $V_s$，並確認它與光強度無關。
3. 驗證愛因斯坦光電方程式 $eV_s = hf - \phi$：以 $V_s$ 對 $f$ 作圖，由斜率求 $h/e$ 與普朗克常數 $h$，由截距求閾頻 $f_0$ 與功函數 $\phi$。
4. 比較不同金屬的 $V_s$–$f$ 直線，理解「斜率相同、截距不同」的物理意義。

## 二、課前預報

1. 寫出愛因斯坦光電方程式，並說明 $h$、$f$、$\phi$、$K_{max}$ 各代表什麼。
2. 鈉的功函數約 2.36 eV，計算它的閾頻 $f_0$ 與閾波長 $\lambda_0$。用紅光（650 nm）照射鈉能否打出電子？
3. 頻率 $7.5 \times 10^{14}$ Hz 的紫光照在鈉上，光子能量、光電子最大動能與截止電壓各是多少？（提示：$h/e = 4.136 \times 10^{-15}$ V·s）
4. 依古典電磁波理論，增加光強度應使光電子的動能如何變化？實驗結果為何與之不符？
5. 為什麼外加電壓 $V \gt 0$ 時光電流會趨於「飽和」？飽和電流由什麼決定？

## 三、實驗原理

### 1. 光量子與光電方程式
頻率 $f$ 的光由能量 $E = hf$ 的光子組成。一個光子把全部能量交給金屬中的一個電子；電子要掙脫金屬至少需要能量 $\phi$（功函數），剩下的成為動能。最靠近表面、束縛最弱的電子得到最大動能：
$$ K_{max} = hf - \phi $$
因此只有 $f \gt f_0 = \phi/h$ 時才有光電子，不論光多強；而且只要 $f \gt f_0$，再弱的光也會「立刻」打出電子。

### 2. 截止電壓
在陰極（金屬板）與集電極之間加反向電壓（集電極電位較低），電子要「爬坡」才能到達集電極。當反向電壓大到連動能最大的電子也被擋回時，光電流恰好為零，此電壓稱為截止電壓 $V_s$：
$$ eV_s = K_{max} = hf - \phi \quad\Rightarrow\quad V_s = \frac{h}{e}f - \frac{\phi}{e} $$
$V_s$ 對 $f$ 是一條直線：**斜率 $h/e$ 與金屬種類無關**，橫軸截距是閾頻 $f_0$，縱軸截距是 $-\phi/e$。

### 3. I–V 曲線
- $V \gt 0$（加速）：所有逸出的電子都被收集，電流趨於飽和值 $I_{sat}$。$I_{sat}$ 正比於每秒入射的光子數，也就是光強度。
- $V \lt 0$（減速）：只有動能大於 $e\lvert V\rvert$ 的電子能到達集電極，電流隨 $\lvert V\rvert$ 增加而下降，在 $V = -V_s$ 時歸零。
- 光強度只改變電流的大小，不改變 $V_s$；頻率改變 $V_s$。

### 4. 最小平方法求斜率
對同一金屬記錄 $n$ 組 $(f_i, V_i)$，最佳直線 $V = mf + b$ 的斜率與截距為
$$ m = \frac{n\sum f_iV_i - \sum f_i\sum V_i}{n\sum f_i^2 - \left(\sum f_i\right)^2}, \qquad b = \frac{\sum V_i - m\sum f_i}{n} $$
於是 $h = me$、$f_0 = -b/m$、$\phi = -eb$。

### 5. 本模擬的模型
- $h = 6.626 \times 10^{-34}$ J·s，$e = 1.602 \times 10^{-19}$ C，所以 $hf$（eV）$= 0.4136 \times f$（$f$ 以 $10^{14}$ Hz 為單位）。
- 光電子的初動能在 0 到 $K_{max}$ 之間均勻分布；集電極幾何近似同心球，因此反向電壓擋住的是總動能。在 $-V_s \lt V \lt 0$ 範圍內 $I = 0.6I_{sat}(1 - \lvert V\rvert/V_s)$；$V \gt 0$ 時收集效率由 60% 逐漸增加到 100%。
- 安培計解析度 0.005 nA；「實測 $V_s$」取 I–V 數據中「電流剛好歸零」與「仍有電流」兩點的中點（兩點相差須在 0.1 V 以內）。

| 金屬 | 功函數 φ (eV) | 閾頻 f₀ (10¹⁴ Hz) | 閾波長 λ₀ (nm) |
|---|---|---|---|
| 1 鈉 Na | 2.36 | 5.71 | 525 |
| 2 鈣 Ca | 2.87 | 6.94 | 432 |
| 3 鋅 Zn | 4.33 | 10.47 | 286 |
| 4 銅 Cu | 4.65 | 11.24 | 267 |

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 頻率 f | 4 至 15（×10¹⁴ Hz） | 光束顏色即光的顏色；f 大於 7.5 為紫外線（以紫灰色表示） |
| 光強度 | 0 至 100 % | 每秒入射的光子數（相對值） |
| 電壓 V | −4 至 +3 V | 集電極相對於金屬板的電位；負值為反向（減速）電壓 |
| 金屬 | 1 至 4 | 1 鈉、2 鈣、3 鋅、4 銅 |
| **掃描 I–V** | | 電壓由 +3 V 以 0.8 V/s 降到 −4 V，自動畫出整條 I–V 曲線 |
| **記錄 V_s** | | 把目前的頻率與「實測截止電壓」存入右下圖 |
| **清除** | | 清除所有記錄點與舊曲線 |

- 上方：光源、真空光電管（左為金屬板、右為集電極）、外加電源與安培計。藍點為光電子，被反向電壓擋回的電子會掉頭。
- 右上能量條：光子能量 $hf$ 分成「功函數 φ」與「最大動能 $K_{max}$」兩段。
- 左下：I–V 曲線（橘點為目前的電壓與電流，紅色虛線為實測截止電壓）。按「掃描 I–V」會從頭重畫目前的曲線；改變頻率、光強度或金屬時，目前的曲線變成灰色保留（最多 4 條），方便比較，進行中的掃描也會停止。
- 右下：$V_s$ 對 $f$ 的記錄點；同一金屬有兩個以上頻率時自動畫出最小平方直線。
- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：光強度與 I–V 曲線（鈉，f = 8×10¹⁴ Hz）
依序把光強度設為 100 %、50 %、25 %，每次按「掃描 I–V」，記錄飽和電流（V = +3 V 時）與實測截止電壓。

| 光強度 | 飽和電流 (nA) | 實測 V_s (V) |
|---|---|---|
| 100 % | | |
| 50 % | | |
| 25 % | | |

飽和電流與光強度成什麼關係？$V_s$ 是否改變？

### 步驟 B：截止電壓與頻率（鈉）
光強度 60 %。每個頻率按「掃描 I–V」（或手動細調 V 到電流剛好歸零），再按「記錄 V_s」。

| f (×10¹⁴ Hz) | λ (nm) | hf (eV) | 實測 V_s (V) |
|---|---|---|---|
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 10 | | | |
| 12 | | | |
| 14 | | | |

用試算表畫 $V_s$–$f$ 圖，求斜率、截距，計算 $h$、$f_0$、$\phi$，並與儀表板的擬合值和理論值比較，計算百分誤差。

### 步驟 C：換一種金屬（鋅或銅）
重複步驟 B（注意 f 必須大於閾頻才有光電流）。

| 金屬 | 斜率 h/e (V·s) | 由斜率得 h (J·s) | f₀ (×10¹⁴ Hz) | φ (eV) |
|---|---|---|---|---|
| 鈉 | | | | |
| 鋅 | | | | |
| 銅 | | | | |

兩條直線是否平行？截距相差多少？

### 步驟 D：低於閾頻
選銅、f = 10×10¹⁴ Hz，把光強度調到 100 %、電壓調到 +3 V，觀察有沒有光電流。再把 f 調到 12，比較結果。

## 六、實驗探究問題

1. 為什麼「光強度再大也打不出電子，頻率稍高即使很弱也立刻有電流」是支持光量子的關鍵證據？古典理論預測需要多久的「累積時間」？
2. 不同金屬的 $V_s$–$f$ 直線為何彼此平行？這說明 $h$ 是什麼樣的常數？
3. 若改成「固定光的功率」而非「固定光子數」，提高頻率時飽和電流會變大還是變小？為什麼？
4. 真實光電管中陰極與集電極是不同金屬，兩者間有「接觸電位差」。它會使 $V_s$–$f$ 直線的斜率還是截距改變？用它量 $h$ 會受影響嗎？
5. 為什麼 $V \lt 0$ 的區域電流是逐漸下降而不是在 $V = -V_s$ 突然降為零？這告訴我們光電子動能的分布是怎樣的？

## 七、誤差來源與模型限制

- 模型假設光電子動能在 0 到 $K_{max}$ 之間均勻分布、且反向電壓作用於總動能；真實光電管的電流在截止點附近有拖尾，使 $V_s$ 不易判定，常用「切線外插」或「反向電流轉折點」判定。
- 未考慮陰極與集電極的接觸電位差、集電極被散射光照到產生的反向電流、暗電流及熱電子發射。
- 實際功函數與表面狀態（氧化、汙染）有關，表列數值只是代表值。
- 數據點太少或頻率範圍太窄時，擬合斜率的不確定度會變大。

## 八、延伸挑戰

1. 在模型中加入 0.5 V 的接觸電位差，重做步驟 B，驗證斜率不變、截距改變。
2. 加入集電極反向電流（約為飽和電流的 2%），練習用「轉折點法」判定 $V_s$。
3. 把光強度改成「固定功率」，畫出飽和電流對頻率的關係。
4. 把記錄點匯出，用試算表計算斜率的標準誤差，報告 $h$ 的不確定度。

## 九、延伸閱讀

- A. Einstein, "Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt", *Annalen der Physik* 17, 132 (1905)
- R. A. Millikan, "A direct photoelectric determination of Planck's h", *Physical Review* 7, 355 (1916)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Photons and Matter Waves〉章：光電效應
- R. A. Serway, C. J. Moses, C. A. Moyer, *Modern Physics*, Ch. 3〈The Quantum Theory of Light〉
- CODATA：自 2019 年起 $h = 6.62607015 \times 10^{-34}$ J·s 為定義值
`;

const photoelectric: ExampleDef = {
  id: 'photoelectric',
  category: '近代物理',
  difficulty: '基礎',
  listDescription: '以不同頻率與強度的光照射金屬，掃描光電管的 I–V 曲線找出截止電壓；記錄多個頻率畫出 V_s–f 直線，由斜率求普朗克常數、由截距求閾頻。',
  description: photoelectricHandout,
  info: { title: '光電效應與普朗克常數', author: '', keywords: '', abstract: '' },
  variables: doubles('pe', [
    ['f', '8', '入射光頻率（×10¹⁴ Hz）'],
    ['Inten', '60', '光強度（每秒光子數，相對值 %）'],
    ['V', '0', '集電極相對於金屬板的電壓（V），負值為反向電壓'],
    ['metal', '1', '金屬：1 鈉、2 鈣、3 鋅、4 銅'],
    ['phi', '2.36', '功函數（eV）'],
    ['hf', '0', '光子能量（eV）'],
    ['Vs', '0', '理論截止電壓（V）'],
    ['I', '0', '光電流（nA）'],
    ['Vsm', '0', '由 I–V 數據判定的截止電壓（V），0 表示尚未判定'],
    ['scan', '0', '自動掃描中（1 = 是）'],
    ['hfit', '0', '擬合普朗克常數（×10⁻³⁴ J·s），0 表示點數不足'],
    ['f0fit', '0', '擬合閾頻（×10¹⁴ Hz）'],
    ['npts', '0', '目前金屬的記錄點數'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'pe-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '光電子運動與量測在約束頁計算',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'pe-con', name: '光電流、I–V 曲線與直線擬合', comment: 'K_max = hf − φ；反向電壓下只有動能大於 e|V| 的電子到達集電極',
    code: String.raw`var PHIS = [2.36, 2.87, 4.33, 4.65];
var mi = Math.min(4, Math.max(1, Math.round(metal)));
phi = PHIS[mi - 1];
hf = 0.4135667 * f;                 // h/e = 4.135667e-15 V·s，f 以 1e14 Hz 為單位
Vs = Math.max(0, hf - phi);
if (!_v._pts) _v._pts = [];
if (!_v._old) _v._old = [];
if (_v._lt === undefined || t < _v._lt) _v._lt = t;
// 換頻率、強度或金屬：目前的 I–V 曲線存為灰色舊曲線，重新開始
var sig = f + '|' + mi + '|' + Inten;
if (_v._sig !== sig) {
  if (_v._iv && _v._iv.length > 4) { _v._old.push({ pts: _v._iv, m: mi }); if (_v._old.length > 4) _v._old.shift(); }
  _v._sig = sig; _v._iv = []; _v._el = []; Vsm = 0; scan = 0; _v._scanning = 0;
}
var dtp = 0;
if (t > _v._lt) { dtp = t - _v._lt; _v._lt = t; }
// 自動掃描：電壓由 +3 V 以 0.8 V/s 下降到 −4 V
if (scan > 0 && dtp > 0) {
  if (_v._scanning !== 1) { _v._scanning = 1; V = 3; _v._iv = []; }
  else V = V - 0.8 * dtp;
  if (V <= -4) { V = -4; scan = 0; _v._scanning = 0; }
} else if (scan <= 0) { _v._scanning = 0; }
// 光電流（nA）
var Isat = hf > phi ? 50 * Inten / 100 : 0;
if (V >= 0) I = Isat * (1 - 0.4 * Math.exp(-V / 0.6));
else I = Vs > 0 ? Isat * 0.6 * Math.max(0, 1 - (-V) / Vs) : 0;
if (I < 0.005) I = 0;              // 安培計解析度
// I–V 數據（每 0.01 V 一點）
var iv = _v._iv, vk = Math.round(V * 100) / 100, found = false;
for (var j = 0; j < iv.length; j++) if (Math.abs(iv[j][0] - vk) < 0.004) { iv[j][1] = I; found = true; break; }
if (!found) { iv.push([vk, I]); iv.sort(function (p, q) { return p[0] - q[0]; }); }
// 由數據判定截止電壓：電流歸零的最高電壓與仍有電流的最低電壓之中點
var vz = -1e9, vp = 1e9;
for (var k = 0; k < iv.length; k++) if (iv[k][0] < 0 && iv[k][1] <= 0 && iv[k][0] > vz) vz = iv[k][0];
for (var k2 = 0; k2 < iv.length; k2++) if (iv[k2][1] > 0 && iv[k2][0] > vz && iv[k2][0] < vp) vp = iv[k2][0];
Vsm = (vz > -1e8 && vp < 1e8 && vp - vz <= 0.1001) ? -(vz + vp) / 2 : 0;
// 目前金屬的 V_s–f 直線擬合
var sx = 0, sy = 0, sxx = 0, sxy = 0, nn = 0;
_v._pts.forEach(function (p) { if (p[2] === mi) { nn++; sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; } });
npts = nn;
var den = nn * sxx - sx * sx;
if (nn >= 2 && den > 1e-6) {
  var sl = (nn * sxy - sx * sy) / den, ic = (sy - sl * sx) / nn;
  hfit = sl * 16.02176634;          // h = 斜率 × 1e-14 × e，以 1e-34 J·s 為單位
  f0fit = sl > 0 ? -ic / sl : 0;
} else { hfit = 0; f0fit = 0; }
// 光電子動畫：v² ∝ (初動能 + eV·x)，x 為在兩極間走過的比例
if (dtp > 0) {
  var el = _v._el, kq = 0.64, keep = [];
  if (Vs > 0 && Inten > 0) {
    _v._acc = (_v._acc || 0) + dtp * 24 * Inten / 100;
    while (_v._acc >= 1) {
      _v._acc -= 1;
      var ke0 = Vs * Math.random();
      el.push({ x: 0, y: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 0.25, v: Math.sqrt(kq * ke0) });
    }
  }
  for (var i = 0; i < el.length; i++) {
    var pe = el[i];
    pe.v += 0.5 * kq * V * dtp; pe.x += pe.v * dtp; pe.y += pe.vy * dtp;
    if (pe.y > 0.95 || pe.y < -0.95) pe.vy = -pe.vy;
    if (pe.x >= 1 || (pe.x <= 0 && pe.v <= 0)) continue;
    keep.push(pe);
  }
  if (keep.length > 160) keep.splice(0, keep.length - 160);
  _v._el = keep;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('pe-dp', 640, 460, [0, 10, 0, 10]),
    slider('pe-s-f', 'f', 4, 15, 0.05, '頻率 f'),
    slider('pe-s-I', 'Inten', 0, 100, 1, '光強度 %'),
    slider('pe-s-V', 'V', -4, 3, 0.01, '電壓 V'),
    slider('pe-s-m', 'metal', 1, 4, 1, '金屬'),
    button('pe-b-scan', '掃描 I–V', 'scan = 1;'),
    button('pe-b-rec', '記錄 V_s', 'if (Vsm > 0) { _v._pts = (_v._pts || []).concat([[f, Vsm, Math.min(4, Math.max(1, Math.round(metal)))]]); }'),
    button('pe-b-clr', '清除', '_v._pts = []; _v._old = [];'),
    readout('pe-r-lam', '入射光波長 λ', '2997.92458 / f', { unit: 'nm', digits: 1, color: C.purple, group: '光源與金屬' }),
    readout('pe-r-hf', '光子能量 hf', 'hf', { unit: 'eV', digits: 3, color: C.purple, group: '光源與金屬' }),
    readout('pe-r-phi', '金屬與功函數 φ', '["鈉 Na", "鈣 Ca", "鋅 Zn", "銅 Cu"][Math.min(4, Math.max(1, Math.round(metal))) - 1] + "  " + phi.toFixed(2)', { unit: 'eV', color: C.ink, group: '光源與金屬' }),
    readout('pe-r-I', '光電流 I', 'I', { unit: 'nA', digits: 3, color: C.blue, group: '量測' }),
    readout('pe-r-Vsm', '實測截止電壓 V_s', 'hf <= phi ? "無光電子" : (Vsm > 0 ? Vsm : "…（請掃描）")', { unit: 'V', digits: 3, color: C.red, group: '量測' }),
    readout('pe-r-Vs', '理論 V_s = (hf − φ)/e', 'Vs', { unit: 'V', digits: 3, color: C.muted, group: '量測' }),
    readout('pe-r-h', '擬合 h（理論 6.626）', 'hfit > 0 ? hfit : "需 ≥ 2 個頻率"', { unit: '×10⁻³⁴ J·s', digits: 3, color: C.teal, group: '直線擬合（目前金屬）' }),
    readout('pe-r-f0', '擬合閾頻 f₀', 'hfit > 0 ? f0fit : "…"', { unit: '×10¹⁴ Hz', digits: 3, color: C.teal, group: '直線擬合（目前金屬）' }),
    readout('pe-r-f0t', '理論閾頻 f₀ = φ/h', 'phi / 0.4135667', { unit: '×10¹⁴ Hz', digits: 3, color: C.muted, group: '直線擬合（目前金屬）' }),
    readout('pe-r-n', '已記錄點數', 'npts', { digits: 0, color: C.ink, group: '直線擬合（目前金屬）' }),
    customDraw('pe-draw', '光電管與圖表', SPEC_RGB + String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var fq = vars.f, lam = 2997.92458 / fq, Vv = vars.V, inten = vars.Inten;
var mi = Math.min(4, Math.max(1, Math.round(vars.metal)));
var MN = ["Na", "Ca", "Zn", "Cu"], MC = ["#2F6FB0", "#2A9D8F", "#B97A1E", "#D1495B"];
var hfv = vars.hf, phv = vars.phi, kmax = Math.max(0, hfv - phv);
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, 0, W, 236);
// 真空管
var xc = 200, xa = 420, ym = 112;
ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(190, 46); ctx.lineTo(450, 46); ctx.arc(450, 112, 66, -Math.PI / 2, Math.PI / 2); ctx.lineTo(190, 178); ctx.arc(190, 112, 66, Math.PI / 2, 1.5 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
// 光源與光束
var al = 0.08 + 0.32 * inten / 100;
ctx.fillStyle = specRGB(lam, al);
ctx.beginPath(); ctx.moveTo(318, 34); ctx.lineTo(342, 34); ctx.lineTo(205, 160); ctx.lineTo(205, 66); ctx.closePath(); ctx.fill();
ctx.fillStyle = "#6B6F76"; ctx.fillRect(310, 8, 40, 24);
ctx.fillStyle = specRGB(lam, 1); ctx.fillRect(316, 28, 28, 6);
ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
ctx.fillText(lam < 380 ? "光源（紫外線）" : "光源", 356, 24);
// 光子（沿光束移動的小波包）
var nph = Math.round(3 + 9 * inten / 100);
if (inten > 0) for (var q = 0; q < nph; q++) {
  var s = ((vars.t * 0.9 + q / nph) % 1), yy0 = 66 + ((q * 37) % 94);
  var px0 = 330 + (205 - 330) * s, py0 = 34 + (yy0 - 34) * s;
  ctx.strokeStyle = specRGB(lam, 0.95); ctx.lineWidth = 1.6; ctx.beginPath();
  for (var u = 0; u <= 12; u++) { var ux = px0 + u * 0.9 * (-0.7), uy = py0 + u * 0.9 * 0.7; var off = 2.6 * Math.sin(u * 1.4 + lam / 40); if (u) ctx.lineTo(ux + off * 0.7, uy + off * 0.7); else ctx.moveTo(ux, uy); }
  ctx.stroke();
}
// 電極
ctx.fillStyle = "#8A8D93"; ctx.fillRect(xc - 6, 62, 8, 100);
ctx.fillStyle = "#4A4D52"; ctx.fillRect(xa - 2, 62, 8, 100);
ctx.fillStyle = "#2B2D31"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("金屬板（" + MN[mi - 1] + "）", xc - 2, 58); ctx.fillText("集電極", xa + 2, 58);
// 光電子
(vars._el || []).forEach(function (pe) {
  var ex = xc + 4 + pe.x * (xa - xc - 6), ey = ym + pe.y * 46;
  ctx.fillStyle = pe.v < 0 ? "#D1495B" : "#2F6FB0";
  ctx.beginPath(); ctx.arc(ex, ey, 2.6, 0, 2 * Math.PI); ctx.fill();
});
if (kmax <= 0) {
  ctx.fillStyle = "#D1495B"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("hf < φ：沒有光電子", (xc + xa) / 2, ym + 4);
}
ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillStyle = "#2F6FB0"; ctx.fillText("● 光電子", 14, 196); ctx.fillStyle = "#D1495B"; ctx.fillText("● 被反向電壓擋回", 14, 210);
// 外電路：電源與安培計
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(xc - 2, 162); ctx.lineTo(xc - 2, 212); ctx.lineTo(282, 212); ctx.moveTo(296, 212); ctx.lineTo(352, 212); ctx.moveTo(378, 212); ctx.lineTo(xa + 2, 212); ctx.lineTo(xa + 2, 162); ctx.stroke();
var pos = Vv >= 0;   // 正：集電極接電源正極
ctx.lineWidth = 2.5; ctx.beginPath();
ctx.moveTo(282, pos ? 205 : 198); ctx.lineTo(282, pos ? 219 : 226);
ctx.moveTo(296, pos ? 198 : 205); ctx.lineTo(296, pos ? 226 : 219); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
ctx.fillText(pos ? "−  +" : "+  −", 289, 194);
ctx.fillText(Math.abs(Vv) < 0.005 ? "V = 0" : (pos ? "加速電壓" : "反向電壓"), 289, 232);
ctx.fillStyle = "#FFFDF8"; ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.arc(365, 212, 13, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
var na = -2.3 + 1.6 * Math.min(1, vars.I / 50);
ctx.strokeStyle = "#D1495B"; ctx.beginPath(); ctx.moveTo(365, 220); ctx.lineTo(365 + 11 * Math.cos(na), 220 + 11 * Math.sin(na)); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 9px sans-serif"; ctx.fillText("A", 365, 211);
// 能量條
var e0y = 214, sc = 25;
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("能量（eV）", 530, 22);
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(526, e0y - 7 * sc); ctx.lineTo(526, e0y); ctx.lineTo(632, e0y); ctx.stroke();
ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace"; ctx.textAlign = "right";
for (var ev = 0; ev <= 6; ev += 2) { ctx.fillText(String(ev), 522, e0y - ev * sc + 3); }
ctx.fillStyle = specRGB(lam, 0.85); ctx.fillRect(540, e0y - hfv * sc, 30, hfv * sc);
ctx.fillStyle = "rgba(107,111,118,0.55)"; ctx.fillRect(590, e0y - Math.min(phv, 7) * sc, 30, Math.min(phv, 7) * sc);
if (kmax > 0) { ctx.fillStyle = "rgba(42,157,143,0.8)"; ctx.fillRect(590, e0y - hfv * sc, 30, kmax * sc); }
ctx.strokeStyle = "#D1495B"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(536, e0y - phv * sc); ctx.lineTo(626, e0y - phv * sc); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#2B2D31"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("hf", 555, e0y + 12); ctx.fillText("φ + K", 605, e0y + 12);
ctx.fillStyle = "#FFFDF8"; ctx.fillText("φ", 605, e0y - Math.min(phv, 7) * sc / 2 + 4);
if (kmax > 0.25) { ctx.fillText("K", 605, e0y - phv * sc - kmax * sc / 2 + 4); }
// I–V 曲線
var curves = [], ymaxI = 5;
(vars._old || []).forEach(function (o) {
  curves.push({ pts: o.pts, color: "rgba(107,111,118,0.45)", width: 1.2 });
  o.pts.forEach(function (p) { if (p[1] > ymaxI) ymaxI = p[1]; });
});
var iv = vars._iv || [];
iv.forEach(function (p) { if (p[1] > ymaxI) ymaxI = p[1]; });
curves.push({ pts: iv, color: "#2F6FB0", width: 2, label: "目前曲線" });
var g1 = miniPlot({ x: 8, y: 244, w: 312, h: 210 }, curves, { title: "I–V 曲線（I：nA）", xlabel: "V(V)", xmin: -4, xmax: 3, ymin: 0, ymax: ymaxI * 1.12 });
ctx.save();
ctx.strokeStyle = "rgba(107,111,118,0.4)"; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(g1.px(0), 264); ctx.lineTo(g1.px(0), 436); ctx.stroke();
if (vars.Vsm > 0) {
  ctx.strokeStyle = "#D1495B"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(g1.px(-vars.Vsm), 264); ctx.lineTo(g1.px(-vars.Vsm), 436); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = "#D1495B"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("−V_s", g1.px(-vars.Vsm), 274);
}
ctx.setLineDash([]); ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g1.px(Vv), g1.py(vars.I), 4, 0, 2 * Math.PI); ctx.fill();
ctx.restore();
// V_s–f 圖
var pts = vars._pts || [], ser = [];
for (var m = 1; m <= 4; m++) {
  var mp = pts.filter(function (p) { return p[2] === m; });
  if (!mp.length) continue;
  var sx = 0, sy = 0, sxx = 0, sxy = 0, nn = mp.length;
  mp.forEach(function (p) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
  var den = nn * sxx - sx * sx, line = [];
  if (nn >= 2 && den > 1e-6) {
    var sl = (nn * sxy - sx * sy) / den, ic = (sy - sl * sx) / nn;
    if (sl > 0) line = [[-ic / sl, 0], [15, sl * 15 + ic]];
  }
  ser.push({ pts: line, dots: mp, color: MC[m - 1], label: MN[m - 1] });
}
var g2 = miniPlot({ x: 326, y: 244, w: 306, h: 210 }, ser, { title: "V_s 對 f", xlabel: "f(10¹⁴Hz)", xmin: 4, xmax: 15, ymin: 0, ymax: 4.2 });
ctx.save(); ctx.strokeStyle = "rgba(233,162,59,0.8)"; ctx.setLineDash([4, 3]);
ctx.beginPath(); ctx.moveTo(g2.px(fq), 264); ctx.lineTo(g2.px(fq), 436); ctx.stroke(); ctx.restore();
if (!pts.length) { ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("按「記錄 V_s」加入數據點", 479, 350); }
`),
  ],
};

// ─────────────────────────────────────────────
// 放射性衰變與半衰期（蒙地卡羅）
// ─────────────────────────────────────────────
const decayHandout = String.raw`# ☢️ 放射性衰變與半衰期（蒙地卡羅模擬）實驗講義

> 1896 年貝克勒發現鈾鹽會自己發出輻射；1902 年拉塞福與索迪發現放射性物質的強度隨時間「按固定比例」減少。每一顆原子核何時衰變完全無法預測，但一大群原子核卻遵守精確的指數律——這是物理學中「個別隨機、整體規律」最漂亮的例子。

## 一、實驗目的

1. 理解「每顆原子核在單位時間內有固定的衰變機率 λ」如何導出指數衰變律。
2. 以蒙地卡羅模擬觀察 $N(t)$，量測半衰期並與 $T_{1/2} = \ln 2/\lambda$ 比較。
3. 由半對數圖 $\ln N$ 對 $t$ 的斜率求衰變常數 λ。
4. 觀察計數的統計漲落，與卜瓦松分布比較，體會「計數 $n$ 的不確定度約為 $\sqrt n$」。
5. （選做）觀察衰變鏈 A → B → C 中子核數量的升降，與貝特曼（Bateman）方程式比較。

## 二、課前預報

1. 每顆原子核每秒的衰變機率為 λ。在很短的時間 $\Delta t$ 內，$N$ 顆中預期衰變幾顆？由此寫出 $dN/dt$ 並解出 $N(t)$。
2. 證明半衰期 $T_{1/2} = \ln 2/\lambda \approx 0.693/\lambda$，平均壽命 $\tau = 1/\lambda$。
3. 碳-14 的半衰期為 5730 年。樣品中的碳-14 剩下原來的 1/8 需要多久？
4. 擲骰子模擬：1000 顆骰子每輪拿掉擲出 6 點的，平均幾輪後剩下約一半？（提示：$(5/6)^n = 1/2$）
5. 某計數器平均每 10 秒測到 100 次。下一個 10 秒的計數大約落在什麼範圍？（提示：卜瓦松分布的標準差為 $\sqrt\mu$）

## 三、實驗原理

### 1. 指數衰變律
每顆原子核在 $\Delta t$ 內衰變的機率為 $\lambda\Delta t$，而且與它「已經存在多久」無關（無記憶性）。$N$ 顆原子核中預期衰變 $\lambda N\Delta t$ 顆：
$$ \frac{dN}{dt} = -\lambda N \quad\Rightarrow\quad N(t) = N_0 e^{-\lambda t} $$
半衰期與活度（每秒衰變次數，單位貝克 Bq）：
$$ T_{1/2} = \frac{\ln 2}{\lambda}, \qquad A = -\frac{dN}{dt} = \lambda N $$

### 2. 半對數圖
取自然對數：$\ln N = \ln N_0 - \lambda t$。以 $\ln N$ 對 $t$ 作圖得一直線，斜率為 $-\lambda$。$N$ 很小時 $\ln N$ 的漲落變大，因此擬合只使用 $N \ge 20$ 的數據。

### 3. 蒙地卡羅方法
每個時間步（$\Delta t = 0.02$ s），對每一顆尚未衰變的原子核抽一個 0 到 1 的亂數 $u$，若 $u \lt p = 1 - e^{-\lambda\Delta t}$ 就讓它衰變。這完全模仿「每顆核獨立、機率固定」的物理假設；指數律是統計的結果，並沒有寫進程式。

### 4. 計數的統計漲落：卜瓦松分布
把時間切成長度 $\Delta$ 的計數區間。若區間開始時有 $N$ 顆母核，區間內計數 $n$ 的期望值 $\mu = N(1 - e^{-\lambda\Delta}) \approx \lambda N\Delta$，且 $n$ 服從卜瓦松分布
$$ P(n) = \frac{\mu^n e^{-\mu}}{n!}, \qquad \sigma = \sqrt\mu $$
因為 $N$ 隨時間減少，每個區間的 $\mu$ 都不同，所以本模擬的理論直方圖是「把每個區間各自的卜瓦松分布加總」。另外計算漲落指標
$$ F = \frac{\sum (n_k - \mu_k)^2}{\sum \mu_k} $$
若計數真的是卜瓦松型的隨機事件，$F \approx 1$。（只統計 $\mu \ge 1$ 的區間；區間長度 $\Delta$ 會自動選擇，使一開始 $\mu \approx 6$。）

### 5. 衰變鏈 A → B → C
母核 A 衰變成同樣具放射性的子核 B，B 再衰變成穩定的 C：
$$ \frac{dN_A}{dt} = -\lambda_A N_A, \qquad \frac{dN_B}{dt} = \lambda_A N_A - \lambda_B N_B $$
解為（貝特曼方程式）
$$ N_B(t) = N_0\frac{\lambda_A}{\lambda_B - \lambda_A}\left(e^{-\lambda_A t} - e^{-\lambda_B t}\right) $$
$N_B$ 先增後減，在 $t_m = \dfrac{\ln(\lambda_B/\lambda_A)}{\lambda_B - \lambda_A}$ 時最多。若 B 的半衰期比 A 短，經過一段時間後 B 與 A 的數量比趨於定值（暫時平衡）。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 初始核數 N₀ | 100 至 1600 | 方格中每一點代表一顆原子核 |
| 母核半衰期 T½ | 1 至 20 s | 決定 $\lambda_A = \ln 2/T_{1/2}$ |
| 衰變鏈 | 0 或 1 | 1 時母核先變成放射性子核 B，再變成穩定的 C |
| 子核半衰期 T½(B) | 1 至 20 s | 只在衰變鏈開啟時有作用 |

- 左上方格：藍色為母核 A、橘色為子核 B、灰色為穩定核；剛衰變的核會閃紅光。
- 左下：每區間計數的直方圖（藍色長條）與卜瓦松期望值（橘點）。
- 右上：$N(t)$ 實測（實線）與理論（虛線）。右下：$\ln N_A$ 對 $t$，藍線為實測、灰虛線為理論、綠線為最小平方擬合。
- 改變任何滑桿都會重新開始一次新的實驗（新的亂數）。按「重設」可以用同樣的參數重做，比較每次結果的差異。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：衰變曲線與半衰期（N₀ = 400，T½ = 5 s，衰變鏈 0）
每隔 5 s 按一次「＋ 記錄一列」，填入下表：

| t (s) | 實測 N | 理論 $N_0e^{-\lambda t}$ | 實測 / 理論 |
|---|---|---|---|
| 0 | | | |
| 5 | | | |
| 10 | | | |
| 15 | | | |
| 20 | | | |

記錄實測半衰期（N 第一次降到 200 的時刻）與擬合的 λ，計算百分誤差。

### 步驟 B：樣本大小與漲落
在 T½ = 5 s 下，對 N₀ = 100、400、1600 各重做 4 次（按「重設」），記錄實測半衰期：

| N₀ | 第 1 次 | 第 2 次 | 第 3 次 | 第 4 次 | 平均 | 標準差 |
|---|---|---|---|---|---|---|
| 100 | | | | | | |
| 400 | | | | | | |
| 1600 | | | | | | |

標準差與 $1/\sqrt{N_0}$ 是否成正比？

### 步驟 C：計數統計
N₀ = 1600、T½ = 10 s，跑到直方圖不再變化（約 30 s）。記錄計數區間長度 Δ、每區間平均計數、漲落指標 F，並描述直方圖與卜瓦松期望值的吻合程度。

| 區間長 Δ (s) | 區間數 | 平均計數 | 平均期望 μ | 漲落指標 F |
|---|---|---|---|---|
| | | | | |

### 步驟 D：衰變鏈（衰變鏈 1，N₀ = 1600）
| T½(A) | T½(B) | 實測 $N_B$ 最大的時刻 | 理論 $t_m$ | 最大 $N_B$ 實測 | 最大 $N_B$ 理論 |
|---|---|---|---|---|---|
| 10 | 2 | | | | |
| 4 | 10 | | | | |

## 六、實驗探究問題

1. 程式中從未寫入「指數函數」，為何 $N(t)$ 會自動呈現指數衰減？如果改成「每秒固定衰變 10 顆」，曲線會變成什麼形狀？
2. 為什麼 $N$ 很小時，實測曲線與理論的相對偏差特別大？這和放射性定年法所需的樣品量有什麼關係？
3. 一顆原子核已經存在了 3 個半衰期，它在下一個半衰期內衰變的機率是多少？為什麼？
4. 用蓋格計數器量測放射源 1 分鐘得到 400 次，計數的相對不確定度約為多少？要把相對不確定度降到 1%，需要多少計數？
5. 在衰變鏈中，若 $T_{1/2}(B) \ll T_{1/2}(A)$（例如鐳-226 → 氡-222），長時間後 $\lambda_A N_A$ 與 $\lambda_B N_B$ 有什麼關係？這稱為長期平衡。

## 七、誤差來源與模型限制

- 有限的樣本數造成統計漲落，相對大小約為 $1/\sqrt N$；這不是「誤差」，而是放射性衰變本身的性質。
- 「實測半衰期」取 $N$ 第一次降到 $N_0/2$ 的時刻，受漲落影響；用全部數據擬合 λ 較穩定。
- 活度以最近 1 秒的計數估計，理論值取同一時間窗中點的 $\lambda N$，在半衰期很短時仍有少許差異。
- 真實的偵測器有效率、無感時間與背景輻射；模擬假設每一次衰變都被計數到，且沒有背景。

## 八、延伸挑戰

1. 加入 5% 的偵測效率與每秒 2 次的背景計數，討論如何由測得的計數率扣除背景來求半衰期。
2. 模擬兩種不同半衰期的同位素混合，觀察 $\ln N$ 對 $t$ 不再是直線，嘗試把兩個成分分離出來。
3. 讓 B 的半衰期遠小於 A，驗證長期平衡 $\lambda_A N_A \approx \lambda_B N_B$。
4. 用擲骰子或擲硬幣在課堂上做同樣的實驗，與模擬結果比較。

## 九、延伸閱讀

- E. Rutherford, F. Soddy, "The cause and nature of radioactivity", *Philosophical Magazine* 4, 370 (1902)
- H. Bateman, "Solution of a system of differential equations occurring in the theory of radioactive transformations", *Proc. Cambridge Philos. Soc.* 15, 423 (1910)
- K. S. Krane, *Introductory Nuclear Physics*, Ch. 6〈Radioactive Decay〉
- J. R. Taylor, *An Introduction to Error Analysis*, Ch. 11〈The Poisson Distribution〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Nuclear Physics〉章：放射性衰變
`;

const radioactiveDecay: ExampleDef = {
  id: 'radioactive-decay',
  category: '近代物理',
  difficulty: '入門',
  listDescription: '方格中每顆原子核以固定機率隨機衰變：觀察 N(t) 的指數衰減、量測半衰期、由 ln N 斜率求 λ，並把每區間的計數與卜瓦松分布比較；可開啟 A → B → C 衰變鏈。',
  description: decayHandout,
  info: { title: '放射性衰變與半衰期（蒙地卡羅）', author: '', keywords: '', abstract: '' },
  variables: doubles('rd', [
    ['N0', '400', '初始母核數'],
    ['Th', '5', '母核 A 半衰期（s）'],
    ['chain', '0', '衰變鏈 A → B → C（1 = 開啟）'],
    ['ThB', '2', '子核 B 半衰期（s）'],
    ['NA', '400', '母核 A 數量'],
    ['NB', '0', '子核 B 數量'],
    ['NC', '0', '穩定核數量'],
    ['Nth', '400', '理論 N_A = N₀e^(−λt)'],
    ['NBth', '0', '理論 N_B（貝特曼方程式）'],
    ['cnt', '0', '總計數（衰變次數）'],
    ['act', '0', '實測活度（最近 1 s 的計數，Bq）'],
    ['actTh', '0', '理論活度（Bq）'],
    ['Thm', '0', '實測半衰期（N_A 首次 ≤ N₀/2 的時刻），0 = 尚未'],
    ['lamFit', '0', 'ln N 對 t 擬合的衰變常數（1/s）'],
    ['dI', '0.1', '計數區間長度（s）'],
    ['nI', '0', '已統計區間數'],
    ['mobs', '0', '每區間平均計數'],
    ['mexp', '0', '每區間平均期望值'],
    ['fano', '0', '漲落指標 Σ(n−μ)²/Σμ'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'rd-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '每一步對每顆原子核抽亂數決定是否衰變（在約束頁）',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'rd-con', name: '蒙地卡羅衰變與計數統計', comment: '每顆核在 Δt 內衰變機率 p = 1 − e^(−λΔt)，彼此獨立',
    code: String.raw`var n0 = Math.max(10, Math.round(N0)), ch = chain > 0.5;
var lamA = Math.LN2 / Th, lamB = Math.LN2 / ThB;
var lbb = Math.abs(lamB - lamA) < 1e-9 ? lamA * 1.000001 : lamB;   // 避免 λ_A = λ_B 時除以零
function expMu(na, nb) {          // 區間 dI 內的期望計數（含 A→B→C 在同一區間內連續衰變）
  var eA = Math.exp(-lamA * dI);
  if (!ch) return na * (1 - eA);
  var eB = Math.exp(-lbb * dI), bLeft = na * lamA / (lbb - lamA) * (eA - eB);
  return na * (1 - eA) + (na * (1 - eA) - bLeft) + nb * (1 - eB);
}
function batB(tt) { return ch ? n0 * lamA / (lbb - lamA) * (Math.exp(-lamA * tt) - Math.exp(-lbb * tt)) : 0; }
var sig = n0 + '|' + Th + '|' + (ch ? 1 : 0) + '|' + (ch ? ThB : 0);
if (!_v._g || _v._sig !== sig) {
  _v._sig = sig;
  _v._g = new Uint8Array(n0); _v._fl = new Float32Array(n0);
  for (var z = 0; z < n0; z++) _v._fl[z] = -99;
  t = 0; _v._lt = 0; NA = n0; NB = 0; NC = 0; cnt = 0; Thm = 0; act = 0; lamFit = 0;
  dI = Math.min(2, Math.max(0.02, Math.round(6 / (n0 * lamA) / 0.02) * 0.02));
  _v._ist = 0; _v._icnt = 0; _v._imu = expMu(n0, 0);
  _v._hobs = new Float64Array(30); _v._hexp = new Float64Array(30);
  _v._sN = 0; _v._sMu = 0; _v._sD2 = 0; nI = 0; mobs = 0; mexp = 0; fano = 0;
  _v._win = []; _v._hN = [[0, n0, 0, 0]]; _v._fit = [0, 0, 0, 0, 0];
}
if (t > _v._lt + 1e-12) {
  var dtp = t - _v._lt; _v._lt = t;
  var pA = 1 - Math.exp(-lamA * dtp), pB = 1 - Math.exp(-lamB * dtp);
  var g = _v._g, fl = _v._fl, nd = 0, ca = 0, cb = 0, cc = 0;
  for (var i = 0; i < g.length; i++) {
    if (g[i] === 0) { if (Math.random() < pA) { g[i] = ch ? 1 : 2; fl[i] = t; nd++; } }
    else if (g[i] === 1) { if (Math.random() < pB) { g[i] = 2; fl[i] = t; nd++; } }
    if (g[i] === 0) ca++; else if (g[i] === 1) cb++; else cc++;
  }
  NA = ca; NB = cb; NC = cc; cnt = cnt + nd;
  // 活度：最近 1 s 的計數
  _v._win.push([t, nd]);
  while (_v._win.length && _v._win[0][0] <= t - 1 + 1e-9) _v._win.shift();
  var ws = 0;
  for (var w = 0; w < _v._win.length; w++) ws += _v._win[w][1];
  act = ws / Math.min(1, t);
  // 計數區間
  _v._icnt += nd;
  if (t - _v._ist >= dI - 1e-9) {
    var mu0 = _v._imu, nk = _v._icnt;
    if (mu0 >= 1) {
      _v._hobs[Math.min(29, nk)] += 1;
      var pk = Math.exp(-mu0);
      for (var kk = 0; kk < 30; kk++) { _v._hexp[kk] += pk; pk = pk * mu0 / (kk + 1); }
      _v._sN += nk; _v._sMu += mu0; _v._sD2 += (nk - mu0) * (nk - mu0); nI = nI + 1;
      mobs = _v._sN / nI; mexp = _v._sMu / nI; fano = _v._sD2 / _v._sMu;
    }
    _v._ist = t; _v._icnt = 0; _v._imu = expMu(NA, NB);
  }
  // 歷史（每 0.1 s）與 ln N 擬合（只用 N ≥ 20）
  var hl = _v._hN[_v._hN.length - 1];
  if (t - hl[0] >= 0.1 - 1e-9) {
    _v._hN.push([t, NA, NB, NC]);
    if (_v._hN.length > 2000) _v._hN.splice(1, 1);
    if (NA >= 20) {
      var F = _v._fit, ly = Math.log(NA);
      F[0] += 1; F[1] += t; F[2] += ly; F[3] += t * t; F[4] += t * ly;
      var dn = F[0] * F[3] - F[1] * F[1];
      if (F[0] >= 3 && dn > 1e-9) lamFit = -(F[0] * F[4] - F[1] * F[2]) / dn;
    }
  }
  if (Thm === 0 && NA <= n0 / 2) Thm = t;
}
Nth = n0 * Math.exp(-lamA * t);
NBth = batB(t);
var tw = t - Math.min(1, t) / 2;
actTh = lamA * n0 * Math.exp(-lamA * tw) + (ch ? lamB * batB(tw) : 0);`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rd-dp', 640, 460, [0, 10, 0, 10]),
    slider('rd-s-N', 'N0', 100, 1600, 100, '初始核數 N₀'),
    slider('rd-s-T', 'Th', 1, 20, 0.5, '半衰期 T½'),
    slider('rd-s-c', 'chain', 0, 1, 1, '衰變鏈'),
    slider('rd-s-TB', 'ThB', 1, 20, 0.5, 'T½(B)'),
    readout('rd-r-NA', '剩餘母核 N_A', 'NA', { digits: 0, color: C.blue, group: '核數' }),
    readout('rd-r-Nth', '理論 N₀e^(−λt)', 'Nth', { digits: 1, color: C.muted, group: '核數' }),
    readout('rd-r-NB', '子核 N_B 實測 ／ 理論', 'chain > 0.5 ? NB + " ／ " + NBth.toFixed(1) : "（衰變鏈未開啟）"', { color: C.amber, group: '核數' }),
    readout('rd-r-Thm', '實測半衰期（N 降到一半）', 'Thm > 0 ? Thm : "…"', { unit: 's', digits: 2, color: C.red, group: '半衰期與衰變常數' }),
    readout('rd-r-lf', '擬合 λ（ln N 斜率）', 'lamFit > 0 ? lamFit : "…"', { unit: '1/s', digits: 4, color: C.teal, group: '半衰期與衰變常數' }),
    readout('rd-r-lt', '理論 λ = ln2 / T½', 'Math.LN2 / Th', { unit: '1/s', digits: 4, color: C.muted, group: '半衰期與衰變常數' }),
    readout('rd-r-Tf', '由擬合 λ 得 T½', 'lamFit > 0 ? Math.LN2 / lamFit : "…"', { unit: 's', digits: 2, color: C.teal, group: '半衰期與衰變常數' }),
    readout('rd-r-act', '實測活度（最近 1 s）', 'act', { unit: 'Bq', digits: 0, color: C.blue, group: '計數' }),
    readout('rd-r-actT', '理論活度 λN', 'actTh', { unit: 'Bq', digits: 1, color: C.muted, group: '計數' }),
    readout('rd-r-cnt', '總計數', 'cnt', { digits: 0, color: C.ink, group: '計數' }),
    readout('rd-r-mu', '每區間平均計數 ／ 期望 μ', 'nI > 0 ? mobs.toFixed(2) + " ／ " + mexp.toFixed(2) : "…"', { color: C.purple, group: '計數' }),
    readout('rd-r-F', '漲落指標 F（卜瓦松 ≈ 1）', 'nI > 4 ? fano : "…"', { digits: 3, color: C.purple, group: '計數' }),
    customDraw('rd-draw', '原子核方格與圖表', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var g = vars._g, fl = vars._fl, n = g ? g.length : 0, tt = vars.t, ch = vars.chain > 0.5;
var lamA = Math.LN2 / vars.Th, lamB = Math.LN2 / vars.ThB, n0 = n || 1;
var lbb = Math.abs(lamB - lamA) < 1e-9 ? lamA * 1.000001 : lamB;
// 原子核方格
var gx = 10, gy = 28, gw = 300, gh = 232;
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(gx - 4, gy - 4, gw + 8, gh + 8);
var cols = Math.max(1, Math.ceil(Math.sqrt(n * gw / gh))), rows = Math.max(1, Math.ceil(n / cols));
var cs = Math.min(gw / cols, gh / rows), ox = gx + (gw - cols * cs) / 2, oy = gy + (gh - rows * cs) / 2;
var rr = Math.max(1, cs * 0.36), COL = ["#2F6FB0", "#E9A23B", "#CFCABF"];
for (var i = 0; i < n; i++) {
  var cx = ox + (i % cols + 0.5) * cs, cy = oy + (Math.floor(i / cols) + 0.5) * cs, age = tt - fl[i];
  ctx.fillStyle = COL[g[i]];
  ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 2 * Math.PI); ctx.fill();
  if (age >= 0 && age < 0.4) {
    ctx.strokeStyle = "rgba(209,73,91," + (1 - age / 0.4).toFixed(2) + ")"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, rr + 1 + 5 * age, 0, 2 * Math.PI); ctx.stroke();
  }
}
ctx.font = "11px sans-serif"; ctx.textAlign = "left";
var lg = ch ? [["● 母核 A", COL[0]], ["● 子核 B", "#B97A1E"], ["● 穩定核 C", "#9A958A"], ["○ 剛衰變", "#D1495B"]] : [["● 母核", COL[0]], ["● 穩定子核", "#9A958A"], ["○ 剛衰變", "#D1495B"]];
var lx = 10;
lg.forEach(function (it) { ctx.fillStyle = it[1]; ctx.fillText(it[0], lx, 14); lx += ctx.measureText(it[0]).width + 12; });
// 計數直方圖
var ho = vars._hobs || [], he = vars._hexp || [], kmax = 4, hmax = 1;
for (var k = 0; k < 30; k++) { if ((ho[k] || 0) > 0 || (he[k] || 0) > 0.3) kmax = Math.max(kmax, k); hmax = Math.max(hmax, ho[k] || 0, he[k] || 0); }
var bars = [], expd = [];
for (var k2 = 0; k2 <= kmax; k2++) expd.push([k2, he[k2] || 0]);
var hp = miniPlot({ x: 6, y: 272, w: 310, h: 184 }, [{ pts: [], color: "#2F6FB0", label: "■ 實測" }, { pts: [], dots: expd, color: "#E9A23B", label: "卜瓦松期望" }],
  { title: "每區間計數 n（Δ = " + vars.dI.toFixed(2) + " s）", xlabel: "n", xmin: -0.5, xmax: kmax + 0.5, ymin: 0, ymax: hmax * 1.15 });
ctx.fillStyle = "rgba(47,111,176,0.55)";
for (var k3 = 0; k3 <= kmax; k3++) { var c = ho[k3] || 0; if (c > 0) ctx.fillRect(hp.px(k3 - 0.4), hp.py(c), hp.px(k3 + 0.4) - hp.px(k3 - 0.4), hp.py(0) - hp.py(c)); }
expd.forEach(function (p) { if (p[1] > 0.02) { ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(hp.px(p[0]), hp.py(p[1]), 3.5, 0, 2 * Math.PI); ctx.fill(); } });
if (!(vars.nI > 0)) { ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("累積中…", 161, 370); }
// N(t) 與 ln N
var hN = vars._hN || [], xmax = Math.max(5 * vars.Th, ch ? 5 * vars.ThB : 0, tt, 1);
var mA = [], mB = [], lA = [], thA = [], thB = [], thL = [];
hN.forEach(function (r) { mA.push([r[0], r[1]]); if (ch) mB.push([r[0], r[2]]); if (r[1] > 0) lA.push([r[0], Math.log(r[1])]); });
for (var s = 0; s <= 120; s++) {
  var ts = xmax * s / 120;
  thA.push([ts, n0 * Math.exp(-lamA * ts)]);
  if (ch) thB.push([ts, n0 * lamA / (lbb - lamA) * (Math.exp(-lamA * ts) - Math.exp(-lbb * ts))]);
  thL.push([ts, Math.log(n0) - lamA * ts]);
}
var serN = [{ pts: thA, color: "#6B6F76", dash: [5, 4], width: 1.3 }, { pts: mA, color: "#2F6FB0", label: "N_A" }];
if (ch) { serN.push({ pts: thB, color: "#B97A1E", dash: [5, 4], width: 1.3 }); serN.push({ pts: mB, color: "#E9A23B", label: "N_B" }); }
serN.push({ pts: [], color: "#6B6F76", label: "--- 理論" });
miniPlot({ x: 322, y: 6, w: 312, h: 224 }, serN, { title: "N(t)", xlabel: "t(s)", xmin: 0, xmax: xmax, ymin: 0, ymax: n0 * 1.05 });
var serL = [{ pts: thL, color: "#6B6F76", dash: [5, 4], width: 1.3, label: "理論" }, { pts: lA, color: "#2F6FB0", label: "實測" }];
if (vars.lamFit > 0 && hN.length > 3) {
  // 擬合直線：以數據的平均點與擬合斜率畫出
  var sx = 0, sy = 0, nn = 0;
  hN.forEach(function (r) { if (r[1] >= 20) { sx += r[0]; sy += Math.log(r[1]); nn++; } });
  if (nn > 0) { var b0 = sy / nn + vars.lamFit * sx / nn; serL.push({ pts: [[0, b0], [xmax, b0 - vars.lamFit * xmax]], color: "#2A9D8F", width: 1.6, label: "擬合" }); }
}
miniPlot({ x: 322, y: 236, w: 312, h: 220 }, serL, { title: "ln N_A 對 t", xlabel: "t(s)", xmin: 0, xmax: xmax, ymin: 0, ymax: Math.log(n0) * 1.08 });
`),
  ],
};

// ─────────────────────────────────────────────
// 波耳氫原子與光譜
// ─────────────────────────────────────────────
const bohrHandout = String.raw`# ⚛️ 波耳氫原子與光譜實驗講義

> 1885 年，瑞士中學教師巴耳末只憑氫的四條可見光譜線的波長，猜出了一個簡單得驚人的公式。二十八年後，波耳把普朗克與愛因斯坦的量子概念放進拉塞福的原子模型，第一次「算」出了這個公式——並預測了紫外區與紅外區還有其他譜線系，很快就被來曼與帕申觀測到。

## 一、實驗目的

1. 認識波耳模型的能階 $E_n = -13.6Z^2/n^2$ eV 與軌道半徑 $r_n = n^2a_0/Z$。
2. 觀察電子在能階間躍遷時放出光子，驗證 $hf = E_i - E_f$。
3. 累積光譜，辨認來曼系、巴耳末系、帕申系，並以芮得柏公式驗證譜線波長。
4. 比較類氫離子（He⁺、Li²⁺）的光譜，理解 $Z^2$ 的縮放關係。

## 二、課前預報

1. 寫出波耳的兩個假設（角動量量子化、躍遷放出光子）。由 $mvr = n\hbar$ 與庫侖力提供向心力，推導 $r_n$ 與 $E_n$。
2. 計算氫原子 $n = 3 \to 2$ 躍遷放出的光子能量與波長。這是什麼顏色的光？
3. 來曼系的最長與最短波長各是多少？為什麼人眼看不到？
4. 為何巴耳末系中只有四條譜線在可見光區，而且越往短波長譜線越密？
5. He⁺（Z = 2）的 $n = 4 \to 3$ 躍遷波長是多少？與氫的哪一條譜線接近？

## 三、實驗原理

### 1. 波耳模型
電子在半徑 $r$ 的圓軌道上運動，由庫侖力提供向心力；波耳假設角動量只能是 $\hbar$ 的整數倍：
$$ \frac{kZe^2}{r^2} = \frac{mv^2}{r}, \qquad mvr = n\hbar \quad (n = 1, 2, 3, \dots) $$
解得
$$ r_n = \frac{n^2}{Z}a_0, \qquad E_n = -\frac{13.6\ \text{eV}\cdot Z^2}{n^2} $$
其中波耳半徑 $a_0 = 0.0529$ nm。$n = 1$ 為基態；$E = 0$ 對應電子剛好脫離原子（游離）。

### 2. 躍遷與光子
電子由 $n_i$ 跳到較低的 $n_f$ 時放出一個光子：
$$ hf = \frac{hc}{\lambda} = E_{n_i} - E_{n_f}, \qquad \lambda = \frac{hc}{\Delta E} = \frac{1239.84\ \text{eV·nm}}{\Delta E} $$

### 3. 芮得柏公式
$$ \frac{1}{\lambda} = R_M Z^2\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right) $$
$R_\infty = 1.0973731568 \times 10^7$ m⁻¹。考慮原子核的有限質量 $M$（約化質量修正），$R_M = R_\infty/(1 + m_e/M)$，氫的 $R_H = 1.09678 \times 10^7$ m⁻¹。儀表板把「以 13.6 eV 能階計算的 λ」與「以實驗 $R_M$ 計算的 λ」並列，兩者相差約萬分之一到萬分之三，來自 13.6 eV 的四捨五入與約化質量修正。

### 4. 譜線系（氫，Z = 1）
| 譜線系 | 終態 n_f | 波長範圍 (nm) | 區域 |
|---|---|---|---|
| 來曼系 Lyman | 1 | 91.2 至 121.6 | 紫外 |
| 巴耳末系 Balmer | 2 | 364.6 至 656.3 | 可見光與近紫外 |
| 帕申系 Paschen | 3 | 820.4 至 1875 | 紅外 |
| 布拉克系 Brackett | 4 | 1458 至 4051 | 紅外 |
| 蒲芬德系 Pfund | 5 | 2279 至 7458 | 紅外 |

類氫離子的所有波長都縮小為 $1/Z^2$。

### 5. 本模擬的模型
- 「自動」模式下，基態電子每隔一段隨機時間被碰撞激發到 $n = 2$ 到「激發上限」之間的某一能階（灰色虛線箭頭），然後一階或數階地往下躍遷，每次放出一個光子。
- 每次躍遷的終態在所有較低能階中**等機率**選取。真實原子的躍遷機率（愛因斯坦 A 係數）各不相同，所以譜線的相對亮度不代表真實光譜。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 激發上限 n | 2 至 7 | 電子最多被激發到的能階 |
| 原子序 Z | 1 至 3 | 1 氫 H、2 氦離子 He⁺、3 鋰離子 Li²⁺ |
| **激發到上限** | | 立刻把電子激發到「激發上限」能階 |
| **自動 開／關** | | 切換是否自動、反覆地激發 |
| **清除光譜** | | 清除累積的譜線 |

- 左上：原子模型，圓為允許的軌道（半徑比例 $r \propto n^2$ 正確），藍點為電子，彩色波紋為放出的光子。
- 右上：能階圖。彩色箭頭為放光躍遷（顏色即光的顏色；紫灰色為紫外、暗紅色為紅外），越新越鮮明。
- 下方：累積光譜。上條為對數刻度的全波段（10 至 5000 nm），下條為可見光區放大；譜線越亮表示出現次數越多。
- 改變原子序會清除光譜。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：能階與軌道（Z = 1）
把「激發上限」設為 2、3、4…，按「激發到上限」，在電子停在各能階時記錄：

| n | $E_n$ (eV) | $r_n$ (nm) | $r_n/r_1$ | $E_n/E_1$ |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

驗證 $r_n \propto n^2$、$E_n \propto 1/n^2$。

### 步驟 B：巴耳末系（Z = 1，激發上限 6，自動）
累積光譜直到可見光區出現 4 條譜線。每次儀表板顯示巴耳末系躍遷時按「＋ 記錄一列」：

| 躍遷 | ΔE (eV) | λ（能階計算） | λ（芮得柏公式） | 顏色 |
|---|---|---|---|---|
| 3 → 2 | | | | |
| 4 → 2 | | | | |
| 5 → 2 | | | | |
| 6 → 2 | | | | |

以 $1/\lambda$ 對 $1/n_i^2$ 作圖，由斜率求芮得柏常數。

### 步驟 C：三個譜線系
找出來曼系與帕申系各兩條譜線的波長，判斷它們落在電磁波譜的哪個區域。

| 譜線系 | 躍遷 | λ (nm) | 區域 |
|---|---|---|---|
| 來曼 | 2 → 1 | | |
| 來曼 | 3 → 1 | | |
| 帕申 | 4 → 3 | | |
| 帕申 | 5 → 3 | | |

### 步驟 D：類氫離子
Z = 2 與 Z = 3，各記錄 $n = 3 \to 2$ 與 $n = 4 \to 3$ 的波長，驗證 $\lambda \propto 1/Z^2$。

| Z | λ(3 → 2) | λ(4 → 3) | λ(3 → 2) × Z² |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 六、實驗探究問題

1. 為什麼氫原子光譜是一條條分立的譜線，而不是連續光譜？這對古典的「電子繞核運動」模型造成什麼困難？
2. 巴耳末系的譜線往短波長方向越來越密，最後收斂到「系限」364.6 nm。系限對應什麼樣的躍遷？
3. 若讓氫原子吸收一個 10.2 eV 的光子會發生什麼事？吸收 11 eV 的光子呢？吸收 14 eV 的光子呢？
4. 天文學家看到恆星光譜中的 468.6 nm 譜線時，可以推論出什麼？
5. 波耳模型能成功解釋氫光譜，卻無法解釋氦原子（兩個電子）的光譜。它還有哪些不足？量子力學如何取代它？

## 七、誤差來源與模型限制

- 波耳模型只適用於單電子原子或離子；它無法說明譜線的相對強度、精細結構（自旋–軌道耦合）與塞曼效應。
- 本模擬的躍遷終態以等機率選取，譜線亮度只代表出現次數，不代表真實強度。
- 13.6 eV 是四捨五入的值，且未考慮約化質量，因此能階計算的波長與芮得柏公式略有差異（約萬分之一至萬分之三）。
- 表列的「實驗」波長為真空波長；在空氣中量到的波長約小 0.03%（例如 Hα 在空氣中為 656.28 nm）。

## 八、延伸挑戰

1. 加入吸收：用連續光譜照射基態氫原子，模擬出吸收光譜的暗線，並與放射光譜比較。
2. 把等機率躍遷改成依照真實的愛因斯坦 A 係數（可查 NIST 原子光譜資料庫），比較譜線亮度。
3. 用「緲子氫」（緲子質量約為電子的 207 倍）計算軌道半徑與 2 → 1 的光子能量，它落在什麼波段？

## 九、延伸閱讀

- N. Bohr, "On the constitution of atoms and molecules", *Philosophical Magazine* 26, 1 (1913)
- J. J. Balmer, "Notiz über die Spectrallinien des Wasserstoffs", *Annalen der Physik* 261, 80 (1885)
- R. Eisberg, R. Resnick, *Quantum Physics of Atoms, Molecules, Solids, Nuclei, and Particles*, Ch. 4〈Bohr's Model of the Atom〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈All About Atoms〉章：氫原子
- NIST Atomic Spectra Database：氫與類氫離子的譜線波長與躍遷機率
`;

const bohrHydrogen: ExampleDef = {
  id: 'bohr-hydrogen',
  category: '近代物理',
  difficulty: '基礎',
  listDescription: '波耳模型的氫原子：電子在 r ∝ n² 的軌道與 E = −13.6/n² eV 的能階間躍遷，放出對應顏色的光子；累積光譜辨認來曼、巴耳末、帕申系並以芮得柏公式驗證，也可換成 He⁺、Li²⁺。',
  description: bohrHandout,
  info: { title: '波耳氫原子與光譜', author: '', keywords: '', abstract: '' },
  variables: doubles('bh', [
    ['nexc', '5', '激發上限能階'],
    ['Z', '1', '原子序（1 H、2 He⁺、3 Li²⁺）'],
    ['auto', '1', '自動激發（1 = 開）'],
    ['kick', '0', '按鈕要求：激發到上限'],
    ['ncur', '1', '電子目前所在能階'],
    ['ni', '0', '最近一次躍遷的初能階'],
    ['nf', '0', '最近一次躍遷的末能階'],
    ['dE', '0', '光子能量（eV）'],
    ['lamE', '0', '由能階差計算的波長（nm）'],
    ['lamR', '0', '由芮得柏公式計算的波長（nm）'],
    ['nph', '0', '已放出的光子數'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'bh-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '激發與躍遷事件在約束頁以隨機時間產生',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'bh-con', name: '激發與躍遷', comment: 'ΔE = 13.6 Z²(1/n_f² − 1/n_i²) eV；λ = hc/ΔE；芮得柏公式含約化質量修正',
    code: String.raw`var Zi = Math.max(1, Math.min(3, Math.round(Z))), nx = Math.max(2, Math.min(7, Math.round(nexc)));
var sig = String(Zi);
if (!_v._lines || _v._sig !== sig) {
  _v._sig = sig; _v._lines = {}; _v._ph = []; _v._tr = [];
  nph = 0; ncur = 1; ni = 0; nf = 0; dE = 0; lamE = 0; lamR = 0; _v._tn = t + 0.4; _v._lt = t;
}
if (t < _v._lt) { _v._lt = t; _v._tn = t + 0.4; }
if (t > _v._lt) {
  _v._lt = t;
  if (kick > 0) {
    kick = 0;
    if (nx > ncur) { _v._tr.push({ up: 1, a: ncur, b: nx, t: t }); ncur = nx; _v._tn = t + 0.5 + 0.5 * Math.random(); }
  } else if (t >= _v._tn) {
    if (ncur <= 1) {
      if (auto > 0.5) {
        var up = 2 + Math.floor(Math.random() * (nx - 1));
        _v._tr.push({ up: 1, a: 1, b: up, t: t }); ncur = up; _v._tn = t + 0.3 + 0.5 * Math.random();
      } else _v._tn = t + 0.2;
    } else {
      var lo = 1 + Math.floor(Math.random() * (ncur - 1));   // 等機率躍遷到任一較低能階
      var dd = 1 / (lo * lo) - 1 / (ncur * ncur);
      ni = ncur; nf = lo;
      dE = 13.6 * Zi * Zi * dd;
      lamE = 1239.84 / dE;
      var MNUC = [1.007276467, 4.001506179, 7.014357];          // 原子核質量（u）
      var RM = 1.0973731568e7 / (1 + 5.48579909e-4 / MNUC[Zi - 1]);
      lamR = 1e9 / (RM * Zi * Zi * dd);
      nph = nph + 1;
      var key = ncur + '-' + lo;
      if (!_v._lines[key]) _v._lines[key] = { ni: ncur, nf: lo, lam: lamE, c: 0 };
      _v._lines[key].c += 1;
      _v._ph.push({ t0: t, ang: Math.random() * 2 * Math.PI, lam: lamE, r0: ncur });
      _v._tr.push({ up: 0, a: ncur, b: lo, t: t, lam: lamE });
      ncur = lo;
      _v._tn = t + (lo === 1 ? 0.4 : 0.2) + 0.45 * Math.random();
    }
  }
  _v._ph = _v._ph.filter(function (p) { return t - p.t0 < 2.5; });
  if (_v._tr.length > 10) _v._tr.splice(0, _v._tr.length - 10);
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('bh-dp', 640, 460, [0, 10, 0, 10]),
    slider('bh-s-n', 'nexc', 2, 7, 1, '激發上限 n'),
    slider('bh-s-Z', 'Z', 1, 3, 1, '原子序 Z'),
    button('bh-b-kick', '激發到上限', 'kick = 1;'),
    button('bh-b-auto', '自動 開／關', 'auto = auto > 0.5 ? 0 : 1;'),
    button('bh-b-clr', '清除光譜', '_v._lines = {}; nph = 0;'),
    readout('bh-r-n', '目前能階 n', 'ncur', { digits: 0, color: C.blue, group: '電子狀態' }),
    readout('bh-r-En', '能量 E_n = −13.6Z²/n²', '-13.6 * Z * Z / (ncur * ncur)', { unit: 'eV', digits: 3, color: C.blue, group: '電子狀態' }),
    readout('bh-r-rn', '軌道半徑 r_n = n²a₀/Z', 'ncur * ncur * 0.0529177 / Z', { unit: 'nm', digits: 4, color: C.blue, group: '電子狀態' }),
    readout('bh-r-tr', '最近躍遷 n_i → n_f', 'nf > 0 ? ni + " → " + nf : "…"', { color: C.ink, group: '最近一次躍遷' }),
    readout('bh-r-dE', '光子能量 ΔE', 'nf > 0 ? dE : "…"', { unit: 'eV', digits: 4, color: C.purple, group: '最近一次躍遷' }),
    readout('bh-r-lE', '波長 λ = hc/ΔE', 'nf > 0 ? lamE : "…"', { unit: 'nm', digits: 2, color: C.red, group: '最近一次躍遷' }),
    readout('bh-r-lR', '芮得柏公式 λ', 'nf > 0 ? lamR : "…"', { unit: 'nm', digits: 2, color: C.muted, group: '最近一次躍遷' }),
    readout('bh-r-ser', '譜線系', 'nf > 0 ? ["來曼系", "巴耳末系", "帕申系", "布拉克系", "蒲芬德系", "韓福瑞系"][nf - 1] + "（" + (lamE < 380 ? "紫外" : (lamE <= 750 ? "可見光" : "紅外")) + "）" : "…"', { color: C.teal, group: '最近一次躍遷' }),
    readout('bh-r-nph', '累計光子數', 'nph', { digits: 0, color: C.ink, group: '最近一次躍遷' }),
    customDraw('bh-draw', '原子、能階與光譜', SPEC_RGB + String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var Zi = Math.max(1, Math.min(3, Math.round(vars.Z))), nx = Math.max(2, Math.min(7, Math.round(vars.nexc)));
var nc = Math.max(1, Math.round(vars.ncur)), tt = vars.t, Z2 = Zi * Zi;
var trs = vars._tr || [], phs = vars._ph || [], lines = vars._lines || {};
var nTop = Math.max(nx, nc);
// ── 原子模型 ──
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, 0, 300, 296);
var ax = 150, ay = 156, Rm = 124;
function rpx(n) { return Rm * n * n / (nTop * nTop); }
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 300, 296); ctx.clip();
phs.forEach(function (p) {
  var d0 = rpx(p.r0) + (tt - p.t0) * 120, ca = Math.cos(p.ang), sa = Math.sin(p.ang);
  ctx.strokeStyle = specRGB(p.lam, Math.max(0, 1 - (tt - p.t0) / 2.5)); ctx.lineWidth = 2; ctx.beginPath();
  for (var u = 0; u <= 30; u++) {
    var rr = d0 + u, wv = 4 * Math.sin(u * (p.lam < 380 ? 1.3 : p.lam > 750 ? 0.45 : 0.8));
    var px = ax + rr * ca - wv * sa, py = ay + rr * sa + wv * ca;
    if (u) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.stroke();
});
for (var n = 1; n <= nTop; n++) {
  ctx.strokeStyle = n === nc ? "#2F6FB0" : "rgba(107,111,118,0.45)"; ctx.lineWidth = n === nc ? 1.8 : 1;
  ctx.beginPath(); ctx.arc(ax, ay, rpx(n), 0, 2 * Math.PI); ctx.stroke();
  if (rpx(n) > 16) { ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("n=" + n, ax + rpx(n) * 0.71 + 2, ay - rpx(n) * 0.71 - 2); }
}
ctx.fillStyle = "#D1495B"; ctx.beginPath(); ctx.arc(ax, ay, 4 + Zi, 0, 2 * Math.PI); ctx.fill();
var om = 6 / (nc * nc * nc), ang = tt * om * 2 + nc;
ctx.fillStyle = "#2F6FB0"; ctx.beginPath(); ctx.arc(ax + rpx(nc) * Math.cos(ang), ay + rpx(nc) * Math.sin(ang), 4.5, 0, 2 * Math.PI); ctx.fill();
ctx.restore();
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left";
ctx.fillText(["氫 H", "氦離子 He⁺", "鋰離子 Li²⁺"][Zi - 1] + "（軌道比例 r ∝ n²）", 8, 16);
var lastUp = null;
trs.forEach(function (r) { if (r.up && tt - r.t < 0.5) lastUp = r; });
if (lastUp) { ctx.fillStyle = "#6B6F76"; ctx.font = "11px sans-serif"; ctx.fillText("碰撞激發 ↑", 8, 288); }
// ── 能階圖 ──
var ex0 = 352, ex1 = 630, eyT = 40, eyB = 262, E1 = -13.6 * Z2;
function EY(n) { var en = E1 / (n * n); return eyB - (en - E1) / (-E1) * (eyB - eyT); }
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("能階圖", 312, 16);
ctx.strokeStyle = "rgba(107,111,118,0.5)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ex0, eyT); ctx.lineTo(ex1, eyT); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "right"; ctx.fillText("游離 E = 0", ex1, eyT - 4); ctx.textAlign = "left";
for (var m = 1; m <= 7; m++) {
  ctx.strokeStyle = m === nc ? "#2F6FB0" : (m <= nx ? "#2B2D31" : "rgba(107,111,118,0.35)"); ctx.lineWidth = m === nc ? 2.5 : 1;
  ctx.beginPath(); ctx.moveTo(ex0, EY(m)); ctx.lineTo(ex1, EY(m)); ctx.stroke();
  if (m <= 3) {
    ctx.fillStyle = "#2B2D31"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("n=" + m, 314, EY(m) + 4);
    ctx.fillStyle = "#6B6F76"; ctx.textAlign = "right"; ctx.fillText((E1 / (m * m)).toFixed(2) + " eV", ex1, EY(m) - 3);
  }
}
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("n=4…7", 314, EY(5) + 2);
var SX = [0, 374, 440, 500, 548, 584, 610];
trs.forEach(function (r, idx) {
  var age = tt - r.t, al = Math.max(0.25, 1 - age / 8);
  if (r.up) {
    if (age > 1.5) return;
    ctx.save(); ctx.globalAlpha = Math.max(0, 1 - age / 1.5); ctx.setLineDash([3, 3]);
    arrow(358, EY(r.a), 358, EY(r.b), "#6B6F76", 1.5); ctx.restore(); return;
  }
  var xx = SX[Math.min(6, r.b)] + (r.a - r.b - 1) * 8;
  arrow(xx, EY(r.a), xx, EY(r.b), specRGB(r.lam, al), idx === trs.length - 1 ? 2.6 : 1.6);
});
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("來曼", SX[1] + 18, 280); ctx.fillText("巴耳末", SX[2] + 16, 280); ctx.fillText("帕申", SX[3] + 12, 280); ctx.fillText("其他", 596, 280);
// ── 光譜 ──
function stripCol(l, al) { if (l < 380) return "rgba(190,160,255," + al + ")"; if (l > 750) return "rgba(255,130,110," + al + ")"; return specRGB(l, al); }
var sx0 = 44, sx1 = 626, lmin = Math.log(10), lmax = Math.log(5000);
function LX(l) { return sx0 + (Math.log(l) - lmin) / (lmax - lmin) * (sx1 - sx0); }
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("累積光譜（對數刻度）", 8, 312);
ctx.fillStyle = "#1E2228"; ctx.fillRect(sx0, 318, sx1 - sx0, 30);
var grd = ctx.createLinearGradient(LX(380), 0, LX(750), 0);
[380, 440, 490, 530, 580, 640, 700, 750].forEach(function (l) { grd.addColorStop((l - 380) / 370, specRGB(l, 0.25)); });
ctx.fillStyle = grd; ctx.fillRect(LX(380), 318, LX(750) - LX(380), 30);
var keys = Object.keys(lines);
keys.forEach(function (k) {
  var ln = lines[k]; if (ln.lam < 10 || ln.lam > 5000) return;
  ctx.strokeStyle = stripCol(ln.lam, Math.min(1, 0.35 + 0.13 * ln.c)); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(LX(ln.lam), 319); ctx.lineTo(LX(ln.lam), 347); ctx.stroke();
});
ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace"; ctx.textAlign = "center";
[10, 30, 100, 300, 1000, 3000].forEach(function (l) { ctx.fillText(String(l), LX(l), 360); });
ctx.textAlign = "left"; ctx.fillText("nm", sx1 - 14, 360);
// 譜線系範圍
var SN = ["來曼", "巴耳末", "帕申", "布拉克"], SC = ["#7B5EA7", "#2A9D8F", "#B97A1E", "#D1495B"];
for (var s = 1; s <= 4; s++) {
  var la = 91.1753 * s * s / Z2, lb = la / (1 - (s * s) / ((s + 1) * (s + 1)));
  var xa = LX(la), xb = Math.min(sx1, LX(lb));
  if (xa > sx1) continue;
  var yb = s === 4 ? 372 : 367;
  ctx.strokeStyle = SC[s - 1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xa, yb); ctx.lineTo(xb, yb); ctx.stroke();
  ctx.fillStyle = SC[s - 1]; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText(SN[s - 1], Math.min((xa + xb) / 2, sx1 - 14), 383);
}
// 可見光區放大
var vx0 = 44, vx1 = 626;
function VX(l) { return vx0 + (l - 380) / 370 * (vx1 - vx0); }
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("可見光區放大（380–750 nm）", 8, 396);
ctx.fillStyle = "#1E2228"; ctx.fillRect(vx0, 402, vx1 - vx0, 30);
var grd2 = ctx.createLinearGradient(vx0, 0, vx1, 0);
[380, 440, 490, 530, 580, 640, 700, 750].forEach(function (l) { grd2.addColorStop((l - 380) / 370, specRGB(l, 0.22)); });
ctx.fillStyle = grd2; ctx.fillRect(vx0, 402, vx1 - vx0, 30);
keys.forEach(function (k) {
  var ln = lines[k]; if (ln.lam < 380 || ln.lam > 750) return;
  ctx.strokeStyle = specRGB(ln.lam, Math.min(1, 0.45 + 0.13 * ln.c)); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(VX(ln.lam), 403); ctx.lineTo(VX(ln.lam), 431); ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.font = "9px monospace"; ctx.textAlign = "center"; ctx.fillText(ln.ni + "→" + ln.nf, VX(ln.lam), 442);
});
ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace"; ctx.textAlign = "center";
[400, 500, 600, 700].forEach(function (l) { ctx.fillText(String(l), VX(l), 455); });
`),
  ],
};

// ─────────────────────────────────────────────
// 量子穿隧（波包與位能障）
// ─────────────────────────────────────────────
const tunnelingHandout = String.raw`# 🌊 量子穿隧：波包撞擊位能障實驗講義

> 一顆能量不足以翻越山丘的球，在古典力學中一定會被彈回。但在量子世界裡，粒子的波函數會「滲進」障礙之中，有一定機率出現在另一側。1928 年伽莫夫用穿隧效應解釋了 α 衰變；今天的掃描穿隧顯微鏡（1986 年諾貝爾獎）、快閃記憶體與穿隧二極體（江崎玲於奈，1973 年諾貝爾獎）都直接依賴這個效應。

## 一、實驗目的

1. 以數值方法解一維含時薛丁格方程式，觀察高斯波包撞擊矩形位能障後分裂成反射波與穿透波。
2. 量測穿透機率 $T$，與平面波的解析公式 $T(E)$ 以及「對波包動量分布平均」的理論值比較。
3. 探討 $T$ 如何隨障壁寬度 $a$ 與高度 $V_0$ 呈指數變化。
4. 觀察 $E \gt V_0$ 時並非完全穿透，以及 $k'a = n\pi$ 時的共振穿透。

## 二、課前預報

1. 寫出一維含時薛丁格方程式。本模擬使用 $\hbar = m = 1$ 的單位，方程式變成什麼形式？
2. 在 $E \lt V_0$ 的障壁內，定態方程式的解為 $e^{\pm\kappa x}$。求 $\kappa$ 的表示式（在 $\hbar = m = 1$ 單位下）。
3. 用厚障壁近似 $T \approx 16\dfrac{E}{V_0}\left(1 - \dfrac{E}{V_0}\right)e^{-2\kappa a}$，估計 $E = 1$、$V_0 = 2$、$a = 2$ 時的穿透機率。障壁寬度加倍時 $T$ 約變為幾倍？
4. 古典力學中，$E \lt V_0$ 與 $E \gt V_0$ 的穿透機率各是多少？
5. 高斯波包的位置寬度為 $\sigma$，其動量（波數）分布寬度為 $\sigma_k = 1/(2\sigma)$。$\sigma = 4$、$E_0 = 1$ 時，能量分布寬度 $\Delta E \approx k_0\sigma_k$ 約為多少？

## 三、實驗原理

### 1. 薛丁格方程式（$\hbar = m = 1$）
$$ i\frac{\partial\psi}{\partial t} = -\frac12\frac{\partial^2\psi}{\partial x^2} + V(x)\psi $$
平面波 $e^{ikx}$ 的能量 $E = k^2/2$，群速度 $v = k$。位能障 $V(x) = V_0$（$0 \lt x \lt a$），其餘為 0。

### 2. 矩形位能障的穿透係數（平面波）
當 $E \lt V_0$，令 $\kappa = \sqrt{2(V_0 - E)}$：
$$ T = \left[1 + \frac{V_0^2\sinh^2(\kappa a)}{4E(V_0 - E)}\right]^{-1} \approx 16\frac{E}{V_0}\left(1 - \frac{E}{V_0}\right)e^{-2\kappa a} $$
當 $E \gt V_0$，令 $k' = \sqrt{2(E - V_0)}$：
$$ T = \left[1 + \frac{V_0^2\sin^2(k'a)}{4E(E - V_0)}\right]^{-1} $$
$k'a = n\pi$ 時 $T = 1$（共振穿透），這是障壁兩側反射波相消干涉的結果。障壁內波函數衰減的特徵長度為 $1/\kappa$。

### 3. 波包與平均穿透機率
初始波包
$$ \psi(x,0) = \left(2\pi\sigma^2\right)^{-1/4}\exp\left[-\frac{(x - x_0)^2}{4\sigma^2} + ik_0x\right] $$
中心能量 $E_0 = k_0^2/2$。它是許多平面波的疊加，波數分布為以 $k_0$ 為中心、標準差 $\sigma_k = 1/(2\sigma)$ 的高斯分布。每個平面波成分各自以 $T(k^2/2)$ 穿透，所以波包的穿透機率是平均值
$$ \langle T\rangle = \int T\left(\frac{k^2}{2}\right)P(k)\ dk $$
$T(E)$ 在穿隧區變化很陡，因此 $\langle T\rangle$ 可能明顯大於 $T(E_0)$；把 $\sigma$ 加大（波包更寬、動量更集中），兩者就會趨於一致。

### 4. 數值方法：分裂算符法（split-operator）
把一個時間步分成三段：
$$ \psi(t + \Delta t) \approx e^{-iV\Delta t/2}\ \mathcal{F}^{-1}\left[e^{-ik^2\Delta t/2}\ \mathcal{F}\left[e^{-iV\Delta t/2}\psi(t)\right]\right] $$
位能部分在位置空間是簡單的相位乘法，動能部分在動量空間（以快速傅立葉轉換 $\mathcal{F}$ 切換）也是相位乘法。每一步都是么正（unitary）運算，所以總機率守恆；動能項完全準確，沒有有限差分的色散誤差。

本模擬：2048 個格點、$\Delta x = 0.1$（範圍 $-102.4 \le x \lt 102.4$）、$\Delta t = 0.015$，每個模擬步進 6 次（物理時間每步前進 0.09）。兩端各有一段平滑的吸收區，被吸收的機率仍計入左側或右側，因此「總機率」維持為 1。初始位置 $x_0 = -(5\sigma + 4)$。

### 5. 量測方法
$$ R = \int_{x \lt 0}\lvert\psi\rvert^2dx, \qquad T = \int_{x \gt a}\lvert\psi\rvert^2dx $$
當障壁附近（$-6 \lt x \lt a + 6$）的機率降到 0.3% 以下，表示波包已完全分離，此時記錄 $T_{\text{實測}} = T/(R + T)$。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 障壁高度 V₀ | 0 至 3 | 能量單位 $\hbar^2/(mL^2)$ |
| 障壁寬度 a | 0.1 至 3 | 長度單位 L |
| 波包能量 E₀ | 0.3 至 3 | $E_0 = k_0^2/2$ |
| 波包寬度 σ | 2 至 6 | 位置分布的標準差 |

- 上方：橘色矩形為位能障（高度代表 $V_0$），紅色虛線為波包中心能量 $E_0$（與 $V_0$ 用同一能量刻度）；綠色填色為機率密度 $\lvert\psi\rvert^2$，藍線為 $\mathrm{Re}\ \psi$。
- 左下：穿透機率對能量。藍線為平面波公式，綠色虛線為對目前 σ 的動量分布平均，紅點為各次實測值（只要不改變 V₀、a、σ，改變 E₀ 時紅點會保留，可以描出整條曲線）。
- 右下：左側機率 R（紅）與右側機率 T（藍）隨時間的變化。
- 改變任何滑桿都會重新發射波包；波包被兩端吸收後會自動以相同參數再發射一次。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：觀察穿隧（V₀ = 1.5、a = 1.5、σ = 4）
令 E₀ = 1，觀察波包撞上障壁、在障壁內呈指數衰減、分裂成兩個波包的過程。記錄：

| 量 | 數值 |
|---|---|
| 實測 T | |
| 平面波 T(E₀) | |
| 波包平均 ⟨T⟩ | |
| 總機率 | |

### 步驟 B：T 對 E 曲線
固定 V₀ = 1.5、a = 1.5、σ = 4，把 E₀ 由 0.4 到 3 每隔 0.2 各跑一次：

| E₀ | E₀/V₀ | 實測 T | ⟨T⟩ | T(E₀) |
|---|---|---|---|---|
| 0.4 | | | | |
| 0.8 | | | | |
| 1.2 | | | | |
| 1.6 | | | | |
| 2.0 | | | | |
| 2.4 | | | | |
| 2.8 | | | | |

找出 $E \gt V_0$ 時 T 最接近 1 的能量，與共振條件 $k'a = \pi$ 預測的能量 $E = V_0 + \pi^2/(2a^2)$ 比較。

### 步驟 C：障壁寬度與指數衰減
V₀ = 2、E₀ = 1、σ = 6，改變 a：

| a | 實測 T | ln T | ⟨T⟩ |
|---|---|---|---|
| 0.5 | | | |
| 1.0 | | | |
| 1.5 | | | |
| 2.0 | | | |

以 $\ln T$ 對 $a$ 作圖，斜率是否接近 $-2\kappa = -2\sqrt{2(V_0 - E)}$？

### 步驟 D：波包寬度的影響
V₀ = 1.5、a = 1.5、E₀ = 1，σ = 2、4、6 各跑一次，比較實測 T、⟨T⟩ 與 T(E₀)。

## 六、實驗探究問題

1. 為什麼 $E \lt V_0$ 時穿透機率不為零？在障壁內「找到」粒子的機率又代表什麼？
2. 為什麼 $E \gt V_0$ 時穿透機率會小於 1？這種「越過障壁仍被反射」在古典力學中有對應嗎？
3. 波包的穿透機率為何與平面波的 $T(E_0)$ 不同？在什麼條件下兩者相等？
4. 掃描穿隧顯微鏡的針尖與樣品距離改變 0.1 nm，穿隧電流約改變一個數量級。請用 $T \propto e^{-2\kappa a}$ 解釋，並估計所需的 $\kappa$。
5. 如果把一顆電子換成一顆質子，在相同的能量與障壁下，穿透機率會如何改變？為什麼巨觀物體不會穿牆？

## 七、誤差來源與模型限制

- 有限的格點使障壁寬度只能是 $\Delta x = 0.1$ 的整數倍；理論值使用同樣的離散寬度。
- 分裂算符法每步的誤差為 $O(\Delta t^3)$，來自位能與動能算符不對易，在障壁邊緣這類位能突變處最明顯。以本模擬的 $\Delta t$，實測 T 與 ⟨T⟩ 一般相差 0.5% 以內；深穿隧（T 只有約 1%）時相對誤差可達 1% 至 2%。
- 「波包已分離」的判斷門檻為 0.3%，能量很低或接近共振時，有少量機率滯留在障壁附近很久，會造成微小偏差。
- 兩端的吸收邊界會產生極少量的反射；若波包在量測完成前碰到邊界，結果會受影響。
- 一維模型忽略了真實三維系統的橫向運動，也忽略了電子之間的交互作用。

## 八、延伸挑戰

1. 改成兩個相同的位能障（雙障壁），尋找共振穿隧的能量——這就是共振穿隧二極體的原理。
2. 把位能障換成位能井（$V_0 \lt 0$），觀察「越過位能井也會反射」的量子效應。
3. 以 WKB 近似 $T \approx \exp\left(-2\int\kappa(x)dx\right)$ 處理三角形位能障，比較數值結果（場發射的福勒–諾德海姆模型）。
4. 改用 Crank–Nicolson 法解同一問題，比較兩種方法在相同 $\Delta x$ 下的精確度。

## 九、延伸閱讀

- D. J. Griffiths, D. F. Schroeter, *Introduction to Quantum Mechanics* (3rd ed.), §2.6〈The Finite Square Well〉與 Problem 2.33（矩形位能障）
- G. Gamow, "Zur Quantentheorie des Atomkernes", *Zeitschrift für Physik* 51, 204 (1928)
- A. Goldberg, H. M. Schey, J. L. Schwartz, "Computer-generated motion pictures of one-dimensional quantum-mechanical transmission and reflection phenomena", *American Journal of Physics* 35, 177 (1967)
- M. D. Feit, J. A. Fleck, A. Steiger, "Solution of the Schrödinger equation by a spectral method", *Journal of Computational Physics* 47, 412 (1982)
- G. Binnig, H. Rohrer, Nobel Lecture "Scanning tunneling microscopy—from birth to adolescence" (1986)
`;

const quantumTunneling: ExampleDef = {
  id: 'quantum-tunneling',
  category: '近代物理',
  difficulty: '進階',
  listDescription: '以分裂算符 FFT 法解一維含時薛丁格方程式：高斯波包撞擊矩形位能障分裂為反射與穿透兩部分，量測穿透機率並與平面波公式及動量分布平均的理論值比較。',
  description: tunnelingHandout,
  info: { title: '量子穿隧（波包與位能障）', author: '', keywords: '', abstract: '' },
  variables: doubles('qt', [
    ['V0', '1.5', '位能障高度（ħ = m = 1 單位）'],
    ['aw', '1.5', '位能障寬度'],
    ['E0', '1', '波包中心能量 k₀²/2'],
    ['sg', '4', '波包位置寬度 σ'],
    ['tq', '0', '物理時間（ħ = m = 1 單位）'],
    ['PL', '0', '左側（反射）機率，含被左端吸收者'],
    ['PR', '0', '右側（穿透）機率，含被右端吸收者'],
    ['Pb', '0', '位能障內的機率'],
    ['Ptot', '1', '總機率（守恆檢查）'],
    ['Tm', '-1', '實測穿透機率（−1 = 尚未分離）'],
    ['Tpw', '0', '平面波理論 T(E₀)'],
    ['Tavg', '0', '對波包動量分布平均的理論 ⟨T⟩'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'qt-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '波函數在約束頁以分裂算符 FFT 法推進（每步 6 個 Δt = 0.015）',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'qt-con', name: '分裂算符法解薛丁格方程式', comment: 'ψ ← e^(−iVΔt/2) · F⁻¹[e^(−ik²Δt/2) · F[e^(−iVΔt/2) ψ]]，么正、機率守恆',
    code: String.raw`var NQ = 2048, DX = 0.1, XL = -102.4, DTQ = 0.015, NSUB = 6, J0 = 1024;
var na = Math.max(1, Math.round(aw / DX)), aEff = na * DX, k0 = Math.sqrt(2 * E0), sk = 1 / (2 * sg);
function Tbar(en) {                // 矩形位能障的平面波穿透係數（ħ = m = 1）
  if (en <= 0) return 0;
  if (V0 <= 1e-9) return 1;
  var dd = en - V0;
  if (Math.abs(dd) < 1e-9) return 1 / (1 + V0 * aEff * aEff / 2);
  if (dd < 0) { var kp = Math.sqrt(-2 * dd), sh = Math.sinh(kp * aEff); return 1 / (1 + V0 * V0 * sh * sh / (4 * en * (-dd))); }
  var kq = Math.sqrt(2 * dd), sn = Math.sin(kq * aEff); return 1 / (1 + V0 * V0 * sn * sn / (4 * en * dd));
}
function launch(Q) {               // 高斯波包，x₀ = −(5σ + 4)
  var x0 = -(5 * sg + 4), nrm = 0;
  for (var j = 0; j < NQ; j++) {
    var xx = XL + j * DX, env = Math.exp(-(xx - x0) * (xx - x0) / (4 * sg * sg));
    Q.re[j] = env * Math.cos(k0 * xx); Q.im[j] = env * Math.sin(k0 * xx); nrm += env * env * DX;
  }
  var scl = 1 / Math.sqrt(nrm);
  for (var j2 = 0; j2 < NQ; j2++) { Q.re[j2] *= scl; Q.im[j2] *= scl; }
  Q.lostL = 0; Q.lostR = 0; Q.pinMax = 0; Q.done = 0; tq = 0;
}
function fftQ(Q, inv) {            // 原地基數 2 FFT；反轉換的 1/N 已併入動能相位
  var re = Q.re, im = Q.im, rev = Q.rev, wc = Q.wc, ws = Q.ws, i, jj, tmp;
  for (i = 0; i < NQ; i++) { jj = rev[i]; if (i < jj) { tmp = re[i]; re[i] = re[jj]; re[jj] = tmp; tmp = im[i]; im[i] = im[jj]; im[jj] = tmp; } }
  for (var len = 2; len <= NQ; len <<= 1) {
    var half = len >> 1, stp = NQ / len;
    for (i = 0; i < NQ; i += len) {
      for (var k = 0, w = 0; k < half; k++, w += stp) {
        var wr = wc[w], wi = inv ? ws[w] : -ws[w], ia = i + k, ib = ia + half;
        var xr = re[ib] * wr - im[ib] * wi, xi = re[ib] * wi + im[ib] * wr;
        re[ib] = re[ia] - xr; im[ib] = im[ia] - xi; re[ia] += xr; im[ia] += xi;
      }
    }
  }
}
function halfV(Q) {                // 位能半步相位 + 邊界吸收（記錄被吸收的機率）
  var re = Q.re, im = Q.im, hc = Q.hc, hs = Q.hs, ab = Q.ab;
  for (var j = 0; j < NQ; j++) {
    var r0 = re[j], i0 = im[j];
    if (ab[j] < 1) { var lost = (r0 * r0 + i0 * i0) * (1 - ab[j] * ab[j]) * DX; if (j < J0) Q.lostL += lost; else Q.lostR += lost; }
    re[j] = r0 * hc[j] - i0 * hs[j]; im[j] = r0 * hs[j] + i0 * hc[j];
  }
}
var sig = V0 + '|' + aw + '|' + E0 + '|' + sg, sigB = V0 + '|' + aw + '|' + sg;
if (!_v._Q || _v._sig !== sig) {
  if (_v._sigB !== sigB || !_v._meas) _v._meas = [];
  _v._sig = sig; _v._sigB = sigB;
  var Q = function () {};          // 以函式物件存放大型陣列：快照不會把它複製到繪圖端
  Q.re = new Float64Array(NQ); Q.im = new Float64Array(NQ);
  Q.hc = new Float64Array(NQ); Q.hs = new Float64Array(NQ); Q.ab = new Float64Array(NQ);
  Q.kc = new Float64Array(NQ); Q.ks = new Float64Array(NQ);
  Q.wc = new Float64Array(NQ / 2); Q.ws = new Float64Array(NQ / 2); Q.rev = new Int32Array(NQ);
  for (var j = 0; j < NQ; j++) {
    var xx = XL + j * DX, vj = (j >= J0 && j < J0 + na) ? V0 : 0;
    var ex = Math.abs(xx) - 88, gam = ex > 0 ? 1.0 * (ex / 14.4) * (ex / 14.4) : 0;
    var amp = Math.exp(-gam * DTQ / 2);
    Q.ab[j] = amp; Q.hc[j] = amp * Math.cos(vj * DTQ / 2); Q.hs[j] = -amp * Math.sin(vj * DTQ / 2);
    var kk = 2 * Math.PI / (NQ * DX) * (j < NQ / 2 ? j : j - NQ);
    Q.kc[j] = Math.cos(kk * kk / 2 * DTQ) / NQ; Q.ks[j] = -Math.sin(kk * kk / 2 * DTQ) / NQ;
    var rb = 0;
    for (var bt = 0, v = j; bt < 11; bt++) { rb = (rb << 1) | (v & 1); v >>= 1; }
    Q.rev[j] = rb;
  }
  for (var q = 0; q < NQ / 2; q++) { Q.wc[q] = Math.cos(2 * Math.PI * q / NQ); Q.ws[q] = Math.sin(2 * Math.PI * q / NQ); }
  _v._Q = Q; launch(Q);
  _v._rho = new Float32Array(640); _v._rp = new Float32Array(640);
  Tm = -1; _v._lt = t;
}
// 理論值
Tpw = Tbar(E0);
var swt = 0, stt = 0;
for (var zz = -4; zz <= 4.0001; zz += 0.05) { var kz = k0 + sk * zz, wz = Math.exp(-zz * zz / 2); swt += wz; if (kz > 0) stt += wz * Tbar(kz * kz / 2); }
Tavg = stt / swt;
if (t < _v._lt) _v._lt = t;
if (t > _v._lt) {
  _v._lt = t;
  var QQ = _v._Q, re = QQ.re, im = QQ.im, kc = QQ.kc, ks = QQ.ks;
  for (var s = 0; s < NSUB; s++) {
    halfV(QQ); fftQ(QQ, false);
    for (var m = 0; m < NQ; m++) { var a1 = re[m], b1 = im[m]; re[m] = a1 * kc[m] - b1 * ks[m]; im[m] = a1 * ks[m] + b1 * kc[m]; }
    fftQ(QQ, true); halfV(QQ);
  }
  tq = tq + NSUB * DTQ;
  // 量測：左側、障壁內、右側機率；障壁附近窗口 [−6, a + 6]
  var pl = 0, pr = 0, pb = 0, pw = 0, wl = J0 - 60, wrr = J0 + na + 60;
  for (var n = 0; n < NQ; n++) {
    var pp = (re[n] * re[n] + im[n] * im[n]) * DX;
    if (n < J0) pl += pp; else if (n >= J0 + na) pr += pp; else pb += pp;
    if (n >= wl && n < wrr) pw += pp;
  }
  PL = pl + QQ.lostL; PR = pr + QQ.lostR; Pb = pb; Ptot = PL + PR + Pb;
  if (pw > QQ.pinMax) QQ.pinMax = pw;
  if (!QQ.done && QQ.pinMax > 0.05 && pw < 0.003) {
    QQ.done = 1; Tm = PR / (PL + PR);
    var dup = _v._meas.some(function (p) { return Math.abs(p[0] - E0) < 1e-9; });
    if (!dup) _v._meas = _v._meas.concat([[E0, Tm]]);
  }
  if (QQ.done && pl + pr + pb < 0.01) launch(QQ);   // 波包被吸收後以相同參數重新發射
  for (var d = 0; d < 640; d++) { var jd = 384 + 2 * d; _v._rho[d] = re[jd] * re[jd] + im[jd] * im[jd]; _v._rp[d] = re[jd]; }
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('qt-dp', 640, 460, [0, 10, 0, 10]),
    slider('qt-s-V', 'V0', 0, 3, 0.05, '障壁高度 V₀'),
    slider('qt-s-a', 'aw', 0.1, 3, 0.1, '障壁寬度 a'),
    slider('qt-s-E', 'E0', 0.3, 3, 0.05, '波包能量 E₀'),
    slider('qt-s-s', 'sg', 2, 6, 0.5, '波包寬度 σ'),
    readout('qt-r-ratio', '能量比 E₀ / V₀', 'V0 > 0 ? E0 / V0 : "（無障壁）"', { digits: 3, color: C.ink, group: '參數' }),
    readout('qt-r-dE', '能量分布寬度 ΔE', 'Math.sqrt(2 * E0) / (2 * sg)', { digits: 3, color: C.ink, group: '參數' }),
    readout('qt-r-kap', '障壁內衰減長度 1/κ', 'E0 < V0 ? 1 / Math.sqrt(2 * (V0 - E0)) : "不衰減"', { digits: 3, color: C.ink, group: '參數' }),
    readout('qt-r-Tm', '實測穿透機率 T', 'Tm >= 0 ? Tm : "等待分離…"', { digits: 4, color: C.red, group: '穿透與反射' }),
    readout('qt-r-Rm', '實測反射機率 R', 'Tm >= 0 ? 1 - Tm : "…"', { digits: 4, color: C.red, group: '穿透與反射' }),
    readout('qt-r-Tavg', '波包平均理論 ⟨T⟩', 'Tavg', { digits: 4, color: C.teal, group: '穿透與反射' }),
    readout('qt-r-Tpw', '平面波理論 T(E₀)', 'Tpw', { digits: 4, color: C.blue, group: '穿透與反射' }),
    readout('qt-r-PR', '目前右側機率', 'PR', { digits: 4, color: C.muted, group: '數值檢查' }),
    readout('qt-r-Pt', '總機率（守恆檢查）', 'Ptot', { digits: 6, color: C.muted, group: '數值檢查' }),
    customDraw('qt-draw', '波包與穿透圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var rho = vars._rho, rp = vars._rp, V0 = vars.V0, E0 = vars.E0, sg = vars.sg;
var na = Math.max(1, Math.round(vars.aw / 0.1)), aEff = na * 0.1;
var xl = 14, xr = 626, XMIN = -64, XMAX = 64, yb = 200, sE = 40;
function PX(x) { return xl + (x - XMIN) / (XMAX - XMIN) * (xr - xl); }
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, 0, W, 266);
ctx.save(); ctx.beginPath(); ctx.rect(0, 22, W, 230); ctx.clip();
// 位能障
var bx0 = PX(0), bx1 = Math.max(PX(aEff), bx0 + 2);
ctx.fillStyle = "rgba(233,162,59,0.4)"; ctx.fillRect(bx0, yb - V0 * sE, bx1 - bx0, V0 * sE);
ctx.strokeStyle = "#B97A1E"; ctx.lineWidth = 1.5; ctx.strokeRect(bx0, yb - V0 * sE, bx1 - bx0, V0 * sE);
// 基線與能量線
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xl, yb); ctx.lineTo(xr, yb); ctx.stroke();
ctx.strokeStyle = "#D1495B"; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(xl, yb - E0 * sE); ctx.lineTo(xr, yb - E0 * sE); ctx.stroke(); ctx.setLineDash([]);
// |ψ|² 與 Re ψ
var peak = 1 / (Math.sqrt(2 * Math.PI) * sg), sR = 105 / peak, sRe = 40 / Math.sqrt(peak);
if (rho && rho.length) {
  ctx.fillStyle = "rgba(42,157,143,0.35)"; ctx.strokeStyle = "#2A9D8F"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PX(XMIN), yb);
  for (var i = 0; i < rho.length; i++) ctx.lineTo(PX(XMIN + 0.2 * i), yb - rho[i] * sR);
  ctx.lineTo(PX(XMIN + 0.2 * (rho.length - 1)), yb); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "rgba(47,111,176,0.75)"; ctx.lineWidth = 1; ctx.beginPath();
  for (var i2 = 0; i2 < rp.length; i2++) { var yy = yb - rp[i2] * sRe; if (i2) ctx.lineTo(PX(XMIN + 0.2 * i2), yy); else ctx.moveTo(PX(XMIN), yy); }
  ctx.stroke();
}
ctx.restore();
// 標示
ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillStyle = "#B97A1E"; ctx.fillText("V₀", bx1 + 4, yb - V0 * sE + 10);
ctx.fillStyle = "#D1495B"; ctx.fillText("E₀", xr - 16, yb - E0 * sE - 4);
ctx.fillStyle = "#6B6F76"; ctx.textAlign = "center";
for (var xt = -60; xt <= 60; xt += 20) ctx.fillText(String(xt), PX(xt), 262);
ctx.fillText("← 反射區 x < 0", PX(-32), 248); ctx.fillText("穿透區 x > a →", PX(32), 248);
ctx.textAlign = "left"; ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#2B2D31"; ctx.fillText("一維波包撞擊位能障（ħ = m = 1）", 8, 15);
ctx.font = "10px sans-serif"; ctx.textAlign = "right"; var lx = W - 8;
[["Re ψ", "#2F6FB0"], ["|ψ|²", "#2A9D8F"], ["E₀", "#D1495B"], ["位能障", "#B97A1E"]].forEach(function (it) { ctx.fillStyle = it[1]; ctx.fillText("■ " + it[0], lx, 15); lx -= ctx.measureText("■ " + it[0]).width + 10; });
// T(E) 曲線
function Tbar(en) {
  if (en <= 0) return 0; if (V0 <= 1e-9) return 1;
  var dd = en - V0;
  if (Math.abs(dd) < 1e-9) return 1 / (1 + V0 * aEff * aEff / 2);
  if (dd < 0) { var sh = Math.sinh(Math.sqrt(-2 * dd) * aEff); return 1 / (1 + V0 * V0 * sh * sh / (4 * en * (-dd))); }
  var sn = Math.sin(Math.sqrt(2 * dd) * aEff); return 1 / (1 + V0 * V0 * sn * sn / (4 * en * dd));
}
var tpw = [], tav = [], sk = 1 / (2 * sg);
for (var e = 0.02; e <= 3.6; e += 0.02) {
  tpw.push([e, Tbar(e)]);
  var k0 = Math.sqrt(2 * e), sw = 0, st = 0;
  for (var z = -4; z <= 4.0001; z += 0.2) { var kz = k0 + sk * z, wz = Math.exp(-z * z / 2); sw += wz; if (kz > 0) st += wz * Tbar(kz * kz / 2); }
  tav.push([e, st / sw]);
}
var gT = miniPlot({ x: 8, y: 272, w: 404, h: 184 }, [
  { pts: tpw, color: "#2F6FB0", label: "平面波 T(E)" },
  { pts: tav, color: "#2A9D8F", dash: [5, 3], label: "波包平均" },
  { pts: [], dots: vars._meas || [], color: "#D1495B", label: "實測" },
], { title: "穿透機率 T 對 E", xlabel: "E", xmin: 0, xmax: 3.6, ymin: 0, ymax: 1.05 });
ctx.save(); ctx.setLineDash([4, 3]);
ctx.strokeStyle = "rgba(209,73,91,0.6)"; ctx.beginPath(); ctx.moveTo(gT.px(E0), 292); ctx.lineTo(gT.px(E0), 438); ctx.stroke();
if (V0 > 0 && V0 < 3.6) { ctx.strokeStyle = "rgba(185,122,30,0.7)"; ctx.beginPath(); ctx.moveTo(gT.px(V0), 292); ctx.lineTo(gT.px(V0), 438); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#B97A1E"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("V₀", gT.px(V0) + 3, 302); }
ctx.restore();
// 機率隨時間
var hist = track("_qtP", [vars.tq, vars.PL, vars.PR], 1500);
var hR = [], hT = [];
hist.forEach(function (r) { hR.push([r[0], r[1]]); hT.push([r[0], r[2]]); });
miniPlot({ x: 418, y: 272, w: 214, h: 184 }, [
  { pts: hR, color: "#D1495B", label: "R" }, { pts: hT, color: "#2F6FB0", label: "T" },
], { title: "機率對時間", xlabel: "t", xmin: 0, ymin: 0, ymax: 1.05 });
`),
  ],
};

const QUANTUM_EXAMPLES: ExampleDef[] = [photoelectric, radioactiveDecay, bohrHydrogen, quantumTunneling];

export default QUANTUM_EXAMPLES;

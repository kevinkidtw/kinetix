import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：光學（幾何光學、薄膜干涉、偏振）與弦波的反射透射
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 薄透鏡成像（光線追跡）
// ─────────────────────────────────────────────
const thinLensHandout = String.raw`# 🔍 薄透鏡成像：光線追跡實驗講義

> 放大鏡、眼鏡、相機、投影機與顯微鏡，核心都是一片（或幾片）透鏡。只要掌握「平行光過焦點、過光心不偏折」這幾條規則，就能用一把直尺畫出像的位置——再用一條簡潔的公式 $1/d_o + 1/d_i = 1/f$ 把它算出來。

## 一、實驗目的

1. 以三條主要光線作圖，找出凸透鏡與凹透鏡所成的像，辨別實像與虛像、正立與倒立。
2. 由光線交點量測像距與像高，驗證薄透鏡成像公式 $\dfrac{1}{d_o} + \dfrac{1}{d_i} = \dfrac{1}{f}$ 與橫向放大率 $m = -\dfrac{d_i}{d_o}$。
3. 讓物體由遠處慢慢移向透鏡，觀察像的移動與性質變化，整理「物距—成像性質」關係表。
4. 以 $1/d_i$ 對 $1/d_o$ 作圖的線性化方法求出焦距。

## 二、課前預報

1. 分別寫出凸透鏡的三條主要光線：(a) 平行主軸入射、(b) 通過光心、(c) 通過物方焦點入射，經透鏡後各往哪裡走？凹透鏡的對應規則又是什麼？
2. 焦距 $f = 10$ cm 的凸透鏡，物距 $d_o$ = 30、20、15、10、5 cm 時，分別以公式算出像距 $d_i$ 與放大率 $m$，並判斷成像性質。
3. 本講義採用「實正虛負」符號規約：實像的 $d_i \gt 0$、虛像的 $d_i \lt 0$；凹透鏡的 $f \lt 0$。依此規約，凹透鏡的像距一定是正還是負？
4. 為何物體恰好放在焦點上時「不成像」（或說像在無窮遠）？
5. 照相機拍遠景與拍近物時，鏡頭與底片（感光元件）的距離應如何調整？

## 三、實驗原理

### 1. 近軸光線與薄透鏡
若透鏡厚度遠小於物距、像距與焦距，且光線與主軸夾角很小（近軸近似），則透鏡對光線的作用可以濃縮成一條規則：在透鏡處高度為 $h$ 的光線，斜率由 $s$ 變為
$$ s' = s - \frac{h}{f} $$
由此立即得到三條主要光線：
- 平行主軸（$s = 0$）入射 → 出射斜率 $-h/f$，通過像方焦點 $F'$（$x = f$）；
- 通過光心（$h = 0$）→ 斜率不變，直線穿過；
- 由物方焦點 $F$（$x = -f$）入射 → 出射斜率為 $0$，平行主軸。

凹透鏡 $f \lt 0$，同一條規則讓平行光「好像從 $F'$ 發散出來」。

### 2. 成像公式
物體頂端（高 $h_o$、距透鏡 $d_o$）發出的光線①與②出射後交於一點，該點就是像。由兩組相似三角形可得
$$ \frac{1}{d_o} + \frac{1}{d_i} = \frac{1}{f}, \qquad m = \frac{h_i}{h_o} = -\frac{d_i}{d_o} $$
$m \lt 0$ 表示倒立，$\lvert m \rvert \gt 1$ 表示放大。若出射光線彼此發散，它們的「反向延長線」交在透鏡同側，形成虛像（$d_i \lt 0$），此時 $m \gt 0$ 為正立。

### 3. 牛頓式
若從焦點量起，$x_o = d_o - f$、$x_i = d_i - f$，成像公式化為簡潔的
$$ x_o x_i = f^2 $$
這說明物體越靠近焦點，像跑得越遠。

### 4. 凸透鏡成像性質一覽

| 物距 | 像距 | 性質 |
|---|---|---|
| $d_o \gt 2f$ | $f \lt d_i \lt 2f$ | 實像、倒立、縮小 |
| $d_o = 2f$ | $d_i = 2f$ | 實像、倒立、等大 |
| $f \lt d_o \lt 2f$ | $d_i \gt 2f$ | 實像、倒立、放大 |
| $d_o = f$ | 無窮遠 | 不成像 |
| $d_o \lt f$ | $d_i \lt 0$ | 虛像、正立、放大（放大鏡） |

凹透鏡：任何物距都成**正立、縮小的虛像**，且像落在 $F'$ 與透鏡之間。

### 5. 本模擬如何「量測」像
程式按照上面的偏折規則追跡三條光線，再以光線①、②出射直線的交點求出 $d_i$ 與 $h_i$（虛像則用反向延長線的交點）；儀表板把這個「作圖結果」與公式計算值並列。光線③也會通過同一點，你可以在畫面上確認三線共點。為了看清楚，畫面縱向比例放大約 3 倍（直線與交點不受影響）。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 物距 d_o | 2 至 60 cm | 物體（橘色箭頭）到透鏡的距離 |
| 焦距 f | −30 至 30 cm | 正值為凸透鏡、負值為凹透鏡（絕對值小於 2 cm 會自動限制） |
| 物高 h_o | 1 至 8 cm | |
| 物體移動速率 | 0 至 4 cm/s | 大於 0 時物體自動向透鏡移動，到 2 cm 後回到 60 cm |

- 上方光路圖：紅色為光線①（平行入射）、綠色為光線②（過光心）、紫色為光線③（過焦點入射）；虛線為反向延長線。藍色箭頭為像（實線為實像，虛線為虛像）。F、F′ 為焦點，下方刻度單位為 cm。
- 左下圖：$d_i$ 對 $d_o$，灰色虛線為公式曲線，藍點為物體移動或你拖動滑桿時記錄到的交點像距；改變焦距會清除紀錄。
- 右下圖：$1/d_i$ 對 $1/d_o$，理論上是斜率 $-1$、截距 $1/f$ 的直線。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：凸透鏡成像（f = 10 cm、h_o = 4 cm）
依序設定物距，每次按「＋ 記錄一列」，並把結果填入下表：

| $d_o$ (cm) | 交點 $d_i$ (cm) | 公式 $d_i$ (cm) | 量測 $m$ | $-d_i/d_o$ | 成像性質 |
|---|---|---|---|---|---|
| 40 | | | | | |
| 30 | | | | | |
| 20 | | | | | |
| 15 | | | | | |
| 12 | | | | | |
| 8 | | | | | |
| 5 | | | | | |

### 步驟 B：線性化求焦距
把步驟 A（只取實像）的數據換算成倒數：

| $1/d_o$ (1/cm) | $1/d_i$ (1/cm) | $1/d_o + 1/d_i$ |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

以 $1/d_i$ 對 $1/d_o$ 作圖，求斜率與截距；由截距求出 $f$，與設定值比較。

### 步驟 C：凹透鏡與像的移動
1. 把焦距改為 $f = -15$ cm，重複步驟 A 的前四列，確認像永遠是正立縮小的虛像。
2. 把焦距改回 $f = 10$ cm、物體移動速率設為 2 cm/s。觀察物體從 60 cm 移到 2 cm 的過程：像在何處移動得最快？像的性質在哪兩個位置發生改變？

| 物距範圍 | 像的位置變化 | 像的性質 |
|---|---|---|
| 60 → 20 cm | | |
| 20 → 10 cm | | |
| 10 → 2 cm | | |

## 六、實驗探究問題

1. 光線③在 $d_o \lt f$ 時是從哪個方向「瞄準」焦點入射的？為什麼 $d_o = f$ 時無法畫出光線③？
2. 物體以等速靠近凸透鏡，像的移動速率是否也固定？由 $x_o x_i = f^2$ 推導像速與物速的關係。
3. 放大鏡為何要把物體放在焦點以內？若要得到最大放大率，眼睛應如何擺放？
4. 用一個屏幕在實驗室找實像時，屏幕在一段範圍內看起來都「差不多清楚」，這個範圍（景深）與透鏡口徑有什麼關係？
5. 把凸透鏡的下半部遮住，像會少一半嗎？用光線追跡的觀點解釋。

## 七、誤差來源與模型限制

- **近軸近似**：真實球面透鏡對遠離主軸的光線偏折較強（球面像差），像會模糊；本模擬的三條光線一律使用近軸規則。
- **薄透鏡近似**：忽略透鏡厚度，主平面合為一個平面。厚透鏡需要區分兩個主平面。
- **色差**：玻璃折射率隨波長改變，不同顏色的焦距不同；模擬中只有單一焦距。
- 實驗室中以屏幕找像時，判斷「最清楚」的位置有主觀誤差，尤其在像距很大（物體接近焦點）時誤差最大。本模擬的交點是精確幾何解，不含這項誤差。

## 八、延伸挑戰

1. 在凸透鏡後方再放一片透鏡，組成克卜勒望遠鏡或複式顯微鏡，追跡兩次成像。
2. 加入一個可移動的屏幕，以光錐在屏幕上的模糊圈大小判斷成像位置，體會「景深」。
3. 利用造鏡者公式 $\dfrac{1}{f} = (n - 1)\left(\dfrac{1}{R_1} - \dfrac{1}{R_2}\right)$，讓焦距隨折射率與曲率半徑改變，模擬色差。

## 九、延伸閱讀

- E. Hecht, *Optics*（5th ed.），Ch. 5〈Geometrical Optics〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Images〉章：薄透鏡
- F. L. Pedrotti, L. M. Pedrotti, L. S. Pedrotti, *Introduction to Optics*（3rd ed.），Ch. 2〈Geometrical Optics〉
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 27〈Geometrical Optics〉
`;

const thinLens: ExampleDef = {
  id: 'thin-lens',
  category: '光學',
  difficulty: '入門',
  listDescription: '以三條主要光線追跡凸透鏡與凹透鏡的成像：拖動物距與焦距，由光線交點量測像距與放大率，驗證 1/dₒ + 1/dᵢ = 1/f，並觀察物體移動時像的變化。',
  description: thinLensHandout,
  info: { title: '薄透鏡成像（光線追跡）', author: '', keywords: '', abstract: '' },
  variables: doubles('tl', [
    ['dob', '30', '物距 d_o（cm）'],
    ['f', '10', '焦距 f（cm），負值為凹透鏡'],
    ['ho', '4', '物高 h_o（cm）'],
    ['vm', '0', '物體移動速率（cm/s，向透鏡移動）'],
    ['di', '15', '像距（光線①②交點，cm）'],
    ['hi', '-2', '像高（光線交點，cm）'],
    ['mag', '-0.5', '量測放大率 h_i/h_o'],
    ['diTh', '15', '公式像距 (1/f − 1/d_o)⁻¹（cm）'],
    ['magTh', '-0.5', '公式放大率 −d_i/d_o'],
    ['kind', '1', '成像類型：0 無窮遠、1 實像、2 虛像'],
    ['sumInv', '0', '1/d_o + 1/d_i（1/cm）'],
  ]),
  odePages: [{
    id: 'tl-ode', name: '物體移動', method: 'Euler', increment: '0.02', comment: '物體以 vm 向透鏡移動',
    rates: [{ state: 'dob', expression: '-vm' }],
  }],
  constraintPages: [{
    id: 'tl-con', name: '光線追跡與交點', comment: '以薄透鏡偏折規則 s′ = s − h/f 追跡光線，求光線①②出射線的交點',
    code: String.raw`if (Math.abs(f) < 2) f = f < 0 ? -2 : 2;
if (dob < 2) dob = vm > 0 ? 60 : 2;
if (dob > 60) dob = 60;
// 光線①：平行入射，在透鏡高度 ho，出射斜率 -ho/f → y = ho + s1 x
// 光線②：過光心，斜率 -ho/dob → y = s2 x
var s1 = -ho / f, s2 = -ho / dob, inv = 1 / f - 1 / dob;
if (Math.abs(inv) < 1e-5) {
  kind = 0; di = 0; hi = 0; mag = 0; diTh = 0; magTh = 0; sumInv = 1 / dob;
} else {
  di = ho / (s2 - s1);          // 兩出射直線的交點（虛像時為反向延長線交點）
  hi = s2 * di;
  mag = hi / ho;
  kind = di > 0 ? 1 : 2;
  diTh = 1 / inv;
  magTh = -diTh / dob;
  sumInv = 1 / dob + 1 / di;
}
// 記錄 (d_o, d_i) 供作圖；焦距改變時清除
var sig = String(f);
if (_v._sig !== sig || !_v._pts) { _v._sig = sig; _v._pts = []; }
var lastP = _v._pts[_v._pts.length - 1];
if (kind > 0 && (!lastP || Math.abs(lastP[0] - dob) > 0.95)) {
  _v._pts.push([dob, di]);
  if (_v._pts.length > 240) _v._pts.shift();
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('tl-dp', 640, 460, [0, 10, 0, 10]),
    slider('tl-s-do', 'dob', 2, 60, 0.5, '物距 d_o (cm)'),
    slider('tl-s-f', 'f', -30, 30, 0.5, '焦距 f (cm)'),
    slider('tl-s-h', 'ho', 1, 8, 0.5, '物高 h_o (cm)'),
    slider('tl-s-v', 'vm', 0, 4, 0.5, '物體移動速率 (cm/s)'),
    readout('tl-r-do', '物距 d_o', 'dob', { unit: 'cm', digits: 1, color: C.amber, group: '物與像' }),
    readout('tl-r-di', '像距 d_i（光線交點）', 'kind > 0.5 ? di : "∞（不成像）"', { unit: 'cm', digits: 2, color: C.blue, group: '物與像' }),
    readout('tl-r-dith', '公式 d_i = (1/f − 1/d_o)⁻¹', 'kind > 0.5 ? diTh : "∞"', { unit: 'cm', digits: 2, color: C.muted, group: '物與像' }),
    readout('tl-r-kind', '成像性質', 'kind < 0.5 ? "像在無窮遠（不成像）" : (kind < 1.5 ? "實像、倒立、" : "虛像、正立、") + (Math.abs(mag) > 1.005 ? "放大" : (Math.abs(mag) < 0.995 ? "縮小" : "等大"))', { color: C.red, group: '物與像' }),
    readout('tl-r-sum', '1/d_o + 1/d_i（量測）', 'sumInv', { unit: '1/cm', digits: 4, color: C.teal, group: '成像公式' }),
    readout('tl-r-invf', '1/f', '1 / f', { unit: '1/cm', digits: 4, color: C.muted, group: '成像公式' }),
    readout('tl-r-newton', '牛頓式 (d_o − f)(d_i − f)', 'kind > 0.5 ? (dob - f) * (di - f) : "∞"', { unit: 'cm²', digits: 2, color: C.teal, group: '成像公式' }),
    readout('tl-r-f2', 'f²', 'f * f', { unit: 'cm²', digits: 2, color: C.muted, group: '成像公式' }),
    readout('tl-r-hi', '像高 h_i（交點）', 'kind > 0.5 ? hi : "∞"', { unit: 'cm', digits: 2, color: C.blue, group: '放大率' }),
    readout('tl-r-m', '量測放大率 h_i/h_o', 'kind > 0.5 ? mag : "∞"', { digits: 3, color: C.purple, group: '放大率' }),
    readout('tl-r-mth', '公式 −d_i/d_o', 'kind > 0.5 ? magTh : "∞"', { digits: 3, color: C.muted, group: '放大率' }),
    customDraw('tl-draw', '光路圖與成像曲線', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var dob = vars.dob, f = vars.f, ho = vars.ho, kind = vars.kind, di = vars.di, hi = vars.hi;
var top = 6, bot = 270, ay = 132, lx = W / 2, sx = 4.75, sy = 14.5;
function X(x) { return lx + x * sx; }
function Y(y) { return ay - y * sy; }
var xL = -lx / sx, xR = (W - lx) / sx;
ctx.fillStyle = "#F7F2E7"; ctx.fillRect(0, top, W, bot - top);
ctx.save(); ctx.beginPath(); ctx.rect(0, top, W, bot - top); ctx.clip();
// 主軸與刻度尺
ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();
ctx.fillStyle = "#6B6F76"; ctx.font = "9px monospace"; ctx.textAlign = "center";
for (var c = -60; c <= 60; c += 5) {
  ctx.beginPath(); ctx.moveTo(X(c), bot - 14); ctx.lineTo(X(c), bot - (c % 10 === 0 ? 20 : 17)); ctx.stroke();
  if (c % 20 === 0) ctx.fillText(String(c), X(c), bot - 4);
}
ctx.beginPath(); ctx.moveTo(0, bot - 14); ctx.lineTo(W, bot - 14); ctx.stroke();
ctx.textAlign = "right"; ctx.fillText("cm", W - 4, bot - 4);
// 焦點 F、F′ 與 2F
function mark(x, label, col) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(x), ay, 3.5, 0, 2 * Math.PI); ctx.fill();
  ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, X(x), ay + 16);
}
mark(f, "F′", "#2B2D31"); mark(-f, "F", "#2B2D31");
mark(2 * f, "2F′", "#9AA0A6"); mark(-2 * f, "2F", "#9AA0A6");
// 透鏡
var LH = 122;
ctx.fillStyle = "rgba(47,111,176,0.14)"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.beginPath();
if (f > 0) {
  ctx.moveTo(lx, ay - LH); ctx.quadraticCurveTo(lx + 22, ay, lx, ay + LH); ctx.quadraticCurveTo(lx - 22, ay, lx, ay - LH);
} else {
  ctx.moveTo(lx - 11, ay - LH); ctx.lineTo(lx + 11, ay - LH); ctx.quadraticCurveTo(lx - 3, ay, lx + 11, ay + LH);
  ctx.lineTo(lx - 11, ay + LH); ctx.quadraticCurveTo(lx + 3, ay, lx - 11, ay - LH);
}
ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.strokeStyle = "rgba(47,111,176,0.5)"; ctx.setLineDash([2, 3]);
ctx.beginPath(); ctx.moveTo(lx, ay - LH); ctx.lineTo(lx, ay + LH); ctx.stroke(); ctx.setLineDash([]);
// 光線追跡：入射斜率 sIn，透鏡處高度 h，出射斜率 sIn - h/f
function ray(sIn, col) {
  var h = ho + sIn * dob, sOut = sIn - h / f;
  ctx.strokeStyle = col; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(X(-dob), Y(ho)); ctx.lineTo(X(0), Y(h)); ctx.lineTo(X(xR), Y(h + sOut * xR)); ctx.stroke();
  if (kind > 1.5) {
    var xe = Math.max(xL, di - 6);
    ctx.globalAlpha = 0.6; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(X(0), Y(h)); ctx.lineTo(X(xe), Y(h + sOut * xe)); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
}
ray(0, "#D1495B");
ray(-ho / dob, "#2A9D8F");
if (Math.abs(f - dob) > 0.3) ray(ho / (f - dob), "#533177");
// 物體
arrow(X(-dob), ay, X(-dob), Y(ho), "#E9A23B", 3.5);
ctx.fillStyle = "#B97A1E"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
ctx.fillText("物", X(-dob), Y(ho) - 8);
// 像
if (kind > 0.5) {
  var xi = X(di), inView = xi > 4 && xi < W - 4 && Math.abs(hi * sy) < 122;
  if (inView) {
    if (kind > 1.5) { ctx.setLineDash([4, 3]); ctx.globalAlpha = 0.75; }
    arrow(xi, ay, xi, Y(hi), "#2F6FB0", 3.5);
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = "#2F6FB0"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = kind > 1.5 ? "right" : "left";
    ctx.fillText(kind > 1.5 ? "虛像" : "實像", kind > 1.5 ? xi - 7 : xi + 7, Y(hi) + (hi > 0 ? 2 : 10));
    ctx.fillStyle = "#2F6FB0"; ctx.beginPath(); ctx.arc(xi, Y(hi), 3, 0, 2 * Math.PI); ctx.fill();
  } else {
    ctx.fillStyle = "#2F6FB0"; ctx.font = "bold 12px sans-serif";
    ctx.textAlign = di > 0 ? "right" : "left";
    ctx.fillText(di > 0 ? "像在畫面外 →" : "← 像在畫面外", di > 0 ? W - 8 : 8, top + 18);
  }
} else {
  ctx.fillStyle = "#2F6FB0"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "right";
  ctx.fillText("出射光平行：像在無窮遠", W - 8, top + 18);
}
ctx.restore();
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillText(f > 0 ? "凸透鏡" : "凹透鏡", lx + 22, top + 14);
infoBox(6, bot - 92, ["縱向放大 " + (sy / sx).toFixed(1) + " 倍", ["① 平行入射", "#D1495B"], ["② 過光心", "#2A9D8F"], ["③ 過焦點入射", "#533177"]], { font: "10px sans-serif", lh: 14 });
// ── 下方圖表 ──
var br1 = [], br2 = [], inv1 = [], u;
for (u = 0.5; u <= 60; u += 0.25) {
  var den = 1 / f - 1 / u;
  if (Math.abs(den) < 1e-4) continue;
  (f > 0 && u < f ? br1 : br2).push([u, Math.max(-300, Math.min(300, 1 / den))]);
}
for (u = 0; u <= 0.5; u += 0.01) inv1.push([u, 1 / f - u]);
var pts = vars._pts || [];
var cur = kind > 0.5 ? [[dob, di]] : [];
var g1 = miniPlot({ x: 6, y: 280, w: 312, h: 174 }, [
  { pts: br1, color: "#9AA0A6", dash: [5, 4], width: 1.3 },
  { pts: br2, color: "#9AA0A6", dash: [5, 4], width: 1.3, label: "公式" },
  { pts: [], dots: pts, color: "#2F6FB0", label: "交點" },
], { title: "像距 d_i 對物距 d_o（cm）", xlabel: "d_o", xmin: 0, xmax: 60, ymin: -80, ymax: 80 });
if (cur.length && Math.abs(di) < 80) { ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g1.px(dob), g1.py(di), 5, 0, 2 * Math.PI); ctx.fill(); }
var ipts = pts.map(function (p) { return [1 / p[0], 1 / p[1]]; });
var g2 = miniPlot({ x: 324, y: 280, w: 310, h: 174 }, [
  { pts: inv1, color: "#9AA0A6", dash: [5, 4], width: 1.3, label: "1/f − 1/d_o" },
  { pts: [], dots: ipts, color: "#2A9D8F", label: "交點" },
], { title: "1/d_i 對 1/d_o（1/cm）", xlabel: "1/d_o", xmin: 0, xmax: 0.5, ymin: -0.6, ymax: 0.6 });
if (kind > 0.5) { ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(g2.px(1 / dob), g2.py(Math.max(-0.6, Math.min(0.6, 1 / di))), 5, 0, 2 * Math.PI); ctx.fill(); }
`),
  ],
};

// ─────────────────────────────────────────────
// 牛頓環與薄膜干涉
// ─────────────────────────────────────────────
const newtonHandout = String.raw`# 🌈 牛頓環與薄膜干涉實驗講義

> 1675 年牛頓把一片曲率很小的凸透鏡壓在平板玻璃上，看見中心一圈圈明暗相間的同心圓環。諷刺的是，堅持光是粒子的牛頓雖然仔細量了環的大小，卻無法解釋它——直到 1801 年楊氏用「光的干涉」才說清楚。今天光學工廠仍用牛頓環檢查鏡面的平整度。

## 一、實驗目的

1. 觀察平凸透鏡與平板玻璃之間空氣薄膜所產生的等厚干涉條紋（牛頓環）。
2. 理解反射時的半波損失如何使中心成為暗點。
3. 量測各暗環半徑 $r_k$，以 $r_k^2$ 對環序 $k$ 作圖，由斜率求出透鏡的曲率半徑 $R$。
4. 探討接觸點有灰塵（間隙 $d_0$）時，為什麼必須用斜率而不能只用單一暗環計算 $R$。

## 二、課前預報

1. 光由光疏介質射向光密介質而反射時，相位改變多少？由光密到光疏呢？
2. 曲率半徑 $R$ 的球面放在平面上，證明距接觸點 $r$ 處的間隙 $d \approx \dfrac{r^2}{2R}$（$r \ll R$）。
3. 寫出反射光的暗紋條件，並推導第 $m$ 暗環半徑 $r_m = \sqrt{m\lambda R/n}$。
4. $R = 1.5$ m、$\lambda = 550$ nm、空氣膜（$n = 1$），第 1 與第 10 暗環的半徑各是多少 mm？相鄰暗環的間距隨 $r$ 增大而如何變化？
5. 若在透鏡與玻璃間滴入水（$n = 1.33$），環會變大還是變小？

## 三、實驗原理

### 1. 空氣薄膜的厚度
平凸透鏡的球面（半徑 $R$）與平板相切於中心。由幾何關係 $R^2 = r^2 + (R - d)^2$，忽略 $d^2$ 得
$$ d = \frac{r^2}{2R} $$
若接觸點夾有灰塵，整體再抬高 $d_0$：$d = r^2/(2R) + d_0$。

### 2. 干涉條件（反射光）
近乎垂直入射的光，一部分在透鏡下表面反射（玻璃→薄膜，無相位改變），一部分穿過薄膜在平板上表面反射（薄膜→玻璃，相位改變 $\pi$，相當於多走半個波長）。兩道反射光的光程差為
$$ \Delta = 2nd + \frac{\lambda}{2} $$
兩道光振幅幾乎相等，反射光強度
$$ I(r) = I_{max}\sin^2\left(\frac{2\pi n d}{\lambda}\right) $$
- 暗環：$2nd = m\lambda$（$m = 0, 1, 2, \ldots$）。$d_0 = 0$ 時中心 $m = 0$ 為暗點。
- 第 $m$ 暗環半徑：
$$ r_m^2 = \frac{m\lambda R}{n} - 2Rd_0 $$

### 3. 用斜率求 R
實驗上很難確定接觸點是否真的「零間隙」，也不容易確認哪一環是第幾級。把找到的暗環由內往外編號 $k = 1, 2, 3, \ldots$，則
$$ r_k^2 = \frac{\lambda R}{n}k + C $$
常數 $C$ 吸收了灰塵間隙與起始級數的不確定性，但**斜率** $\lambda R/n$ 不受影響。因此
$$ R = \frac{n}{\lambda}\cdot\frac{\Delta(r_k^2)}{\Delta k} $$
傳統實驗常用「逐差法」$R = n(r_{k+j}^2 - r_k^2)/(j\lambda)$，原理相同。

### 4. 本模擬的「行進顯微鏡」
程式以 $I(r)$ 的精細取樣（0.5 μm 解析度）尋找強度極小值當作暗環中心，再依行進顯微鏡的最小刻度把讀數取到 0.01 mm（這是本實驗主要的讀數誤差）。十字線由中心往外掃描（0.4 mm/s），每經過一個暗環就記下 $r_k$，並即時以最小平方法擬合 $r_k^2$ 對 $k$ 的直線。視野半徑為 3 mm。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 波長 λ | 380 至 750 nm | 單色光，環的顏色隨之改變 |
| 曲率半徑 R | 0.5 至 4 m | 平凸透鏡球面的半徑 |
| 間隙介質折射率 n | 1.00 至 1.50 | 1.00 為空氣、1.33 為水（須小於玻璃的 1.52） |
| 接觸點間隙 d₀ | 0 至 400 nm | 模擬接觸點夾有灰塵 |

- 左上：從正上方看到的反射干涉圖樣，橘色十字線為行進顯微鏡，橘色刻痕標出已找到的暗環（數字為 $k$）。
- 左下：沿半徑方向的強度分布 $I(r)$。
- 右上：側視剖面示意（間隙已大幅放大）。
- 右下：$r_k^2$ 對 $k$，藍點為量測、綠線為擬合、灰色虛線為理論。
- 改變任何參數會讓顯微鏡從中心重新掃描。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：量測暗環半徑（λ = 550 nm、R = 1.5 m、n = 1、d₀ = 0）
等掃描結束後，由「r² 對 k」圖或匯出的數據讀出前 8 個暗環：

| k | $r_k$ (mm) | $r_k^2$ (mm²) | 理論 $\sqrt{k\lambda R/n}$ (mm) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |

以 $r_k^2$ 對 $k$ 作圖，由斜率求 $R$，與設定值比較。相鄰暗環的間距 $r_{k+1} - r_k$ 是否固定？

### 步驟 B：波長與介質
固定 R = 1.5 m，記錄擬合斜率：

| λ (nm) | n | 擬合斜率 (mm²) | 理論 $\lambda R/n$ (mm²) | 推得 R (m) |
|---|---|---|---|---|
| 450 | 1.00 | | | |
| 550 | 1.00 | | | |
| 650 | 1.00 | | | |
| 550 | 1.33 | | | |

### 步驟 C：灰塵間隙的影響
固定 λ = 550 nm、R = 1.5 m、n = 1，改變 d₀：

| d₀ (nm) | 中心亮或暗 | 擬合截距 (mm²) | 斜率推得 R (m) | 只用第一暗環估 R (m) |
|---|---|---|---|---|
| 0 | | | | |
| 100 | | | | |
| 200 | | | | |
| 300 | | | | |

哪一種方法不受灰塵影響？截距與 $d_0$ 有什麼關係？

## 六、實驗探究問題

1. 為何牛頓環愈往外愈密？由 $r_m \propto \sqrt m$ 推導相鄰暗環間距與 $r$ 的關係。
2. 若從**下方**看透射光，中心是亮還是暗？透射圖樣與反射圖樣有何關係？
3. 用白光照射時只能看到少數幾圈彩色環，為什麼？
4. 若透鏡球面不完美（局部凹陷），環會怎麼變形？光學工廠如何利用這個現象檢驗鏡面？
5. 肥皂泡與油膜上的彩色條紋和牛頓環有什麼相同與不同？

## 七、誤差來源與模型限制

- 只考慮兩道反射光，忽略薄膜內的多重反射；玻璃—空氣界面反射率只有約 4%，此近似很好。
- 假設垂直入射；斜射時光程差變為 $2nd\cos\theta_t$，環會略為變大。
- 假設光源完全單色且同調長度足夠；真實光源的譜線寬度使外圈條紋的對比逐漸消失。
- 讀數取到 0.01 mm：內圈半徑小，相對誤差大，因此只用一個環計算 $R$ 的誤差較大，用多環擬合斜率可平均掉讀數誤差。
- 環很密（R 小、λ 短）時，螢幕像素不足以顯示外圈，但量測程式仍以 0.5 μm 解析度尋找暗環。
- 真實實驗中顯微鏡十字線的對準誤差約數 μm，可用「左右兩側直徑」取平均降低誤差。

## 八、延伸挑戰

1. 改為觀察透射光，比較強度分布與條紋對比。
2. 用兩個靠得很近的波長（如鈉的 589.0 nm 與 589.6 nm）同時照射，觀察條紋對比週期性消失。
3. 改成楔形空氣膜（兩片平板玻璃一端夾紙片），量測等間距條紋並求紙片厚度。

## 九、延伸閱讀

- I. Newton, *Opticks*（1704），Book II, Part I：關於薄膜顏色的觀察
- E. Hecht, *Optics*（5th ed.），Ch. 9〈Interference〉：Newton's rings 與等厚條紋
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Interference〉章：薄膜干涉
- F. L. Pedrotti, L. M. Pedrotti, L. S. Pedrotti, *Introduction to Optics*（3rd ed.），Ch. 8〈Interference of Light〉
`;

const RGB_FN = String.raw`function rgbOf(nm) {
  var r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else { r = 1; }
  var fa = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
  return [Math.round(255 * r * fa), Math.round(255 * g * fa), Math.round(255 * b * fa)];
}
`;

const newtonRings: ExampleDef = {
  id: 'newton-rings',
  category: '光學',
  difficulty: '基礎',
  listDescription: '平凸透鏡壓在平板玻璃上形成牛頓環：調整波長、曲率半徑、介質與灰塵間隙，以行進顯微鏡自動量測暗環半徑，由 r² 對環序的斜率求出曲率半徑 R。',
  description: newtonHandout,
  info: { title: '牛頓環與薄膜干涉', author: '', keywords: '', abstract: '' },
  variables: doubles('nr', [
    ['lam', '550', '波長 λ（nm）'],
    ['Rl', '1.5', '透鏡曲率半徑 R（m）'],
    ['nf', '1', '間隙介質折射率 n'],
    ['d0', '0', '接觸點間隙 d₀（nm）'],
    ['scan', '0', '顯微鏡十字線位置（mm）'],
    ['nTot', '0', '視野內暗環數'],
    ['nFit', '0', '已量到的暗環數'],
    ['r1', '0', '第 1 暗環半徑（mm）'],
    ['slope', '0', 'r² 對 k 擬合斜率（mm²）'],
    ['icpt', '0', 'r² 對 k 擬合截距（mm²）'],
    ['Rfit', '0', '由斜率推得的 R（m）'],
    ['errR', '0', 'R 的相對誤差（%）'],
  ]),
  odePages: [{
    id: 'nr-ode', name: '顯微鏡掃描', method: 'Euler', increment: '0.02', comment: '十字線以 0.4 mm/s 由中心往外移動',
    rates: [{ state: 'scan', expression: '0.4' }],
  }],
  constraintPages: [{
    id: 'nr-con', name: '尋找暗環與擬合', comment: '參數改變時重新計算強度分布、找出所有暗環；掃描過的暗環以最小平方法擬合 r² = slope·k + icpt',
    code: String.raw`var rv = 3.0;
var sig = lam + '|' + Rl + '|' + nf + '|' + d0;
if (_v._sig !== sig || !_v._rings) {
  _v._sig = sig; scan = 0;
  var Rmm = Rl * 1000, lmm = lam * 1e-6, gmm = d0 * 1e-6, Ns = 6000, prof = [], rings = [];
  for (var i = 0; i <= Ns; i++) {
    var rr = rv * i / Ns, gap = rr * rr / (2 * Rmm) + gmm, sv = Math.sin(2 * Math.PI * nf * gap / lmm);
    prof.push(sv * sv);
  }
  for (var j = 1; j < Ns; j++) {
    if (prof[j] <= prof[j - 1] && prof[j] < prof[j + 1] && prof[j] < 0.05) {
      var pa = prof[j - 1], pb = prof[j], pc = prof[j + 1], den = pa - 2 * pb + pc;
      var off = den > 0 ? 0.5 * (pa - pc) / den : 0;
      rings.push(Math.round(rv * (j + off) / Ns * 100) / 100);   // 行進顯微鏡最小刻度 0.01 mm
    }
  }
  _v._rings = rings;
}
if (scan > rv) scan = rv;
var R = _v._rings, K = 0, sk = 0, sr = 0, skk = 0, skr = 0;
for (var q = 0; q < R.length && R[q] <= scan; q++) {
  var kk = q + 1, y2 = R[q] * R[q];
  K++; sk += kk; sr += y2; skk += kk * kk; skr += kk * y2;
}
nTot = R.length; nFit = K;
r1 = K > 0 ? R[0] : 0;
if (K >= 2) {
  slope = (K * skr - sk * sr) / (K * skk - sk * sk);
  icpt = (sr - slope * sk) / K;
  Rfit = slope * nf / (lam * 1e-6) / 1000;
  errR = 100 * (Rfit - Rl) / Rl;
} else {
  slope = 0; icpt = 0; Rfit = 0; errR = 0;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('nr-dp', 640, 460, [0, 10, 0, 10]),
    slider('nr-s-l', 'lam', 380, 750, 5, '波長 λ (nm)'),
    slider('nr-s-R', 'Rl', 0.5, 4, 0.1, '曲率半徑 R (m)'),
    slider('nr-s-n', 'nf', 1, 1.5, 0.01, '間隙介質折射率 n'),
    slider('nr-s-d', 'd0', 0, 400, 10, '接觸點間隙 d₀ (nm)'),
    readout('nr-r-lm', '介質中波長 λ/n', 'lam / nf', { unit: 'nm', digits: 1, color: C.ink, group: '光與薄膜' }),
    readout('nr-r-n', '視野內暗環總數', 'nTot', { digits: 0, color: C.ink, group: '光與薄膜' }),
    readout('nr-r-k', '已量到的暗環數 k', 'nFit', { digits: 0, color: C.amber, group: '行進顯微鏡量測' }),
    readout('nr-r-r1', '第 1 暗環半徑 r₁', 'nFit > 0 ? r1 : "掃描中…"', { unit: 'mm', digits: 4, color: C.amber, group: '行進顯微鏡量測' }),
    readout('nr-r-sl', '擬合斜率 Δ(r²)/Δk', 'nFit >= 2 ? slope : "需 ≥ 2 環"', { unit: 'mm²', digits: 4, color: C.teal, group: '行進顯微鏡量測' }),
    readout('nr-r-slth', '理論斜率 λR/n', 'lam * 1e-6 * Rl * 1000 / nf', { unit: 'mm²', digits: 4, color: C.muted, group: '行進顯微鏡量測' }),
    readout('nr-r-ic', '擬合截距', 'nFit >= 2 ? icpt : "…"', { unit: 'mm²', digits: 4, color: C.teal, group: '行進顯微鏡量測' }),
    readout('nr-r-Rf', '由斜率推得 R', 'nFit >= 2 ? Rfit : "…"', { unit: 'm', digits: 4, color: C.blue, group: '曲率半徑' }),
    readout('nr-r-Rs', '設定 R', 'Rl', { unit: 'm', digits: 4, color: C.muted, group: '曲率半徑' }),
    readout('nr-r-err', '相對誤差', 'nFit >= 2 ? errR : "…"', { unit: '%', digits: 3, color: C.blue, group: '曲率半徑' }),
    readout('nr-r-R1', '只用第一暗環估 R = r₁²n/λ', 'nFit > 0 ? r1 * r1 * nf / (lam * 1e-6) / 1000 : "…"', { unit: 'm', digits: 4, color: C.red, group: '曲率半徑' }),
    customDraw('nr-draw', '牛頓環圖樣', RGB_FN + String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var lam = vars.lam, Rl = vars.Rl, nf = vars.nf, d0 = vars.d0, rv = 3.0, scan = vars.scan;
var col = rgbOf(lam);
function inten(r) { var gap = r * r / (2 * Rl * 1000) + d0 * 1e-6, sv = Math.sin(2 * Math.PI * nf * gap / (lam * 1e-6)); return sv * sv; }
// ── 干涉圖樣（俯視） ──
var cx = 172, cy = 172, Rp = 158, ppm = Rp / rv;
var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rp);
for (var i = 0; i <= 800; i++) {
  var I = inten(rv * i / 800);
  grad.addColorStop(i / 800, "rgb(" + Math.round(col[0] * I) + "," + Math.round(col[1] * I) + "," + Math.round(col[2] * I) + ")");
}
ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, Rp, 0, 2 * Math.PI); ctx.fill();
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, Rp + 1.5, 0, 2 * Math.PI); ctx.stroke();
// 十字線與已量到的暗環
var rings = vars._rings || [];
ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rp, 0, 2 * Math.PI); ctx.clip();
ctx.strokeStyle = "rgba(233,162,59,0.55)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
ctx.beginPath(); ctx.moveTo(cx - Rp, cy); ctx.lineTo(cx + Rp, cy); ctx.stroke(); ctx.setLineDash([]);
var sxp = cx + scan * ppm;
ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(sxp, cy - Rp); ctx.lineTo(sxp, cy + Rp); ctx.stroke();
ctx.font = "10px sans-serif"; ctx.textAlign = "center";
for (var k = 0; k < rings.length && rings[k] <= scan; k++) {
  var rxp = cx + rings[k] * ppm;
  ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(rxp, cy - 7); ctx.lineTo(rxp, cy + 7); ctx.stroke();
  var gapPx = k > 0 ? (rings[k] - rings[k - 1]) * ppm : rings[0] * ppm;
  if (k < 5 && gapPx > 11) { ctx.fillStyle = "#FFE6B0"; ctx.fillText(String(k + 1), rxp, cy - 11); }
}
ctx.restore();
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left";
ctx.fillText("反射光干涉圖樣（俯視）", 8, 14);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(338 - ppm, 26); ctx.lineTo(338, 26); ctx.stroke();
ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("1 mm", 338 - ppm / 2, 20);
// ── 沿半徑的強度 ──
var prof = [];
for (var p = 0; p <= 600; p++) { var rp = rv * p / 600; prof.push([rp, inten(rp)]); }
var lc = "rgb(" + Math.round(col[0] * 0.8) + "," + Math.round(col[1] * 0.8) + "," + Math.round(col[2] * 0.8) + ")";
var g0 = miniPlot({ x: 6, y: 340, w: 334, h: 114 }, [
  { pts: prof, color: lc, width: 1.2, label: "I/I_max" },
], { title: "沿半徑的反射光強度", xlabel: "r(mm)", xmin: 0, xmax: rv, ymin: 0, ymax: 1.05 });
ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g0.px(scan), 360); ctx.lineTo(g0.px(scan), 436); ctx.stroke();
// ── 側視剖面（示意） ──
var bx = 350, by = 6, bw = W - bx - 6, bh = 186, mx = bx + bw / 2, yPl = by + 150;
ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("側視剖面（間隙已放大）", bx + 6, by + 14);
var half = 118, Rpx = 300 * Rl / 1.5 + 60, d0px = d0 / 400 * 8;
function lensY(x) { return yPl - (x * x / (2 * Rpx)) - d0px; }
// 間隙介質
ctx.fillStyle = nf > 1.005 ? "rgba(42,157,143," + (0.15 + (nf - 1) * 0.7).toFixed(2) + ")" : "rgba(233,162,59,0.12)";
ctx.beginPath(); ctx.moveTo(mx - half, yPl);
for (var a = -half; a <= half; a += 4) ctx.lineTo(mx + a, lensY(a));
ctx.lineTo(mx + half, yPl); ctx.closePath(); ctx.fill();
// 平板
ctx.fillStyle = "#DCE6EF"; ctx.fillRect(mx - half - 8, yPl, 2 * half + 16, 20);
ctx.strokeStyle = "#6B6F76"; ctx.strokeRect(mx - half - 8 + 0.5, yPl + 0.5, 2 * half + 15, 19);
// 平凸透鏡
ctx.fillStyle = "#E6EEF7"; ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(mx - half, yPl - 80);
ctx.lineTo(mx + half, yPl - 80);
for (var b2 = half; b2 >= -half; b2 -= 4) ctx.lineTo(mx + b2, lensY(b2));
ctx.closePath(); ctx.fill(); ctx.stroke();
// 入射與反射光
var cs = "rgb(" + col.join(",") + ")";
[-70, 90].forEach(function (dxr) {
  var xa = mx + dxr, yl = lensY(dxr);
  ctx.strokeStyle = cs; ctx.lineWidth = 1.6;
  arrow(xa, by + 24, xa, yl - 2, cs, 1.6);
  ctx.globalAlpha = 0.8;
  arrow(xa + 6, yl, xa + 6, by + 30, cs, 1.2);
  arrow(xa + 12, yPl, xa + 12, by + 36, cs, 1.2);
  ctx.globalAlpha = 1;
});
// 標示 r 與 d
ctx.strokeStyle = "#D1495B"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(mx + 90 - 4, lensY(90)); ctx.lineTo(mx + 90 - 4, yPl); ctx.stroke();
ctx.fillStyle = "#D1495B"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "right"; ctx.fillText("d", mx + 90 - 7, yPl - 3);
ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(mx, yPl + 28); ctx.lineTo(mx + 90, yPl + 28); ctx.stroke();
ctx.beginPath(); ctx.moveTo(mx, yPl + 24); ctx.lineTo(mx, yPl + 32); ctx.moveTo(mx + 90, yPl + 24); ctx.lineTo(mx + 90, yPl + 32); ctx.stroke();
ctx.fillStyle = "#2B2D31"; ctx.textAlign = "left"; ctx.font = "11px sans-serif"; ctx.fillText("r", mx + 96, yPl + 32);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
ctx.fillText("平凸透鏡", mx - half + 4, yPl - 66); ctx.fillText("平板玻璃", mx - half + 2, yPl + 14);
// ── r² 對 k ──
var used = [], k2;
for (k2 = 0; k2 < rings.length && rings[k2] <= scan; k2++) used.push([k2 + 1, rings[k2] * rings[k2]]);
var kmax = Math.max(5, rings.length + 1);
var m0 = Math.floor(2 * nf * d0 / lam + 1e-9) + 1;
var thL = [[0, Rl * 1000 * ((m0 - 1) * lam * 1e-6 / nf - 2 * d0 * 1e-6)], [kmax, Rl * 1000 * ((m0 - 1 + kmax) * lam * 1e-6 / nf - 2 * d0 * 1e-6)]];
var fitL = vars.nFit >= 2 ? [[0, vars.icpt], [kmax, vars.icpt + vars.slope * kmax]] : [];
var ymin = Math.min(0, thL[0][1] * 1.2);
miniPlot({ x: bx, y: 200, w: bw, h: 254 }, [
  { pts: thL, color: "#9AA0A6", dash: [5, 4], width: 1.3, label: "理論" },
  { pts: fitL, color: "#2A9D8F", width: 1.6, label: "擬合" },
  { pts: [], dots: used, color: "#2F6FB0", label: "量測" },
], { title: "r² (mm²) 對暗環序 k", xlabel: "k", xmin: 0, xmax: kmax, ymin: ymin, ymax: rv * rv * 1.05 });
`),
  ],
};

// ─────────────────────────────────────────────
// 偏振與馬呂斯定律
// ─────────────────────────────────────────────
const malusHandout = String.raw`# 🕶️ 偏振與馬呂斯定律實驗講義

> 兩片偏振片正交時一片漆黑；在它們中間再插入第三片，光竟然又透出來了！「多加一道關卡反而讓更多光通過」看似矛盾，其實正是光作為橫波、偏振片只取「投影」的直接結果。1808 年馬呂斯（Étienne-Louis Malus）透過方解石觀察窗戶反射的夕陽，發現了反射光的偏振與這條強度定律。

## 一、實驗目的

1. 理解自然光（非偏振光）通過偏振片後成為線偏振光，強度減半。
2. 旋轉檢偏片，量測透射強度與夾角 $\theta$ 的關係，驗證馬呂斯定律 $I = I_1\cos^2\theta$。
3. 探討「三片偏振片」問題：在兩片正交偏振片之間插入第三片，透射強度 $I = \dfrac{I_0}{8}\sin^2 2\varphi$。
4. 以「光子逐一通過」的統計觀點理解強度定律與量測的隨機誤差。

## 二、課前預報

1. 什麼是橫波？為什麼只有橫波才有偏振現象？聲波（空氣中）能被「偏振」嗎？
2. 線偏振光的電場振幅為 $E_0$，通過透射軸與偏振方向夾 $\theta$ 的偏振片後，電場振幅與強度各是多少？
3. 為什麼理想偏振片讓非偏振光的強度剛好減半？（提示：$\cos^2$ 對所有角度的平均值）
4. 兩片偏振片夾角 60°，自然光強度 $I_0$ 通過後剩下多少？
5. 在兩片正交偏振片之間插入一片與它們都夾 45° 的偏振片，最後的強度是多少？若插入角度是 30° 呢？

## 三、實驗原理

### 1. 偏振片只讓「投影」通過
理想偏振片只讓電場平行於透射軸的分量通過。入射電場 $E_0$ 與透射軸夾 $\theta$ 時，透射振幅 $E_0\cos\theta$，強度正比於振幅平方：
$$ I = I_1\cos^2\theta \qquad(\text{馬呂斯定律}) $$

### 2. 非偏振光
自然光的偏振方向隨機且快速變化，對所有方向平均：
$$ I_1 = I_0\langle\cos^2\alpha\rangle = \frac{I_0}{2} $$
因此兩片偏振片（起偏片與檢偏片夾 $\theta$）的總透射為
$$ I = \frac{I_0}{2}\cos^2\theta $$

### 3. 三片偏振片
起偏片 $P_1$ 透射軸 0°、中間片 $P_2$ 在 $\varphi$、檢偏片 $A$ 在 $\theta$：
$$ I = \frac{I_0}{2}\cos^2\varphi\cos^2(\theta - \varphi) $$
當 $P_1$ 與 $A$ 正交（$\theta = 90°$）：
$$ I = \frac{I_0}{2}\cos^2\varphi\sin^2\varphi = \frac{I_0}{8}\sin^2 2\varphi $$
$\varphi = 45°$ 時達到最大 $I_0/8$。中間片「轉動」了偏振方向，而不只是擋光。

### 4. 光子的觀點與本模擬
單一光子通過透射軸夾 $\theta$ 的偏振片的**機率**為 $\cos^2\theta$，通過後偏振方向變為透射軸方向。本模擬每 0.02 s 發射 2000 個偏振方向隨機的光子，逐一以機率判斷是否通過各片偏振片，再以「通過數 ÷ 發射數」作為量測強度。因此量測值會有約 $1/\sqrt N$ 的統計漲落，累積越多光子越接近理論值。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 檢偏片角度 θ | 0 至 180° | 相對於起偏片透射軸（鉛直）的角度 |
| 自動旋轉速率 | 0 至 30 °/s | 大於 0 時檢偏片持續旋轉，自動掃出強度曲線 |
| 中間偏振片 | 0 或 1 | 1 表示插入中間片 $P_2$ |
| 中間片角度 φ | 0 至 180° | |

- 上方：光由左向右通過起偏片 $P_1$、中間片 $P_2$（未插入時為虛線輪廓）與檢偏片 $A$。偏振片上的細線表示透射軸方向（橘色粗線）。各段光束上的雙箭頭為電場振動方向，長度正比於振幅；最左邊的放射狀箭頭代表非偏振光。
- 左下：$I/I_0$ 對 $\theta$。綠線為理論曲線，藍點為各 5° 區間累積的光子計數量測值；插入中間片時，灰色虛線為兩片時的 $\tfrac12\cos^2\theta$ 供比較。改變中間片設定會清除量測點。
- 右下：各階段的強度長條（實心為量測、橫線為理論）。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：非偏振光通過一片偏振片
中間片設為 0。觀察「起偏片後 $I_1/I_0$」的量測值，等累計光子數超過 10⁵ 後記錄。它與 0.5 相差多少？與 $1/\sqrt N$ 的估計是否一致？

### 步驟 B：驗證馬呂斯定律
自動旋轉設為 0，依序設定 θ，每個角度停留數秒讓光子數累積後記錄：

| θ (°) | 量測 $I/I_0$ | 理論 $\tfrac12\cos^2\theta$ | $\cos^2\theta$ | 量測 $I/I_1$ |
|---|---|---|---|---|
| 0 | | | | |
| 15 | | | | |
| 30 | | | | |
| 45 | | | | |
| 60 | | | | |
| 75 | | | | |
| 90 | | | | |

以 $I/I_0$ 對 $\cos^2\theta$ 作圖，應為斜率 0.5、通過原點的直線。也可把自動旋轉設為 10 °/s，讓圖上自動掃出完整曲線。

### 步驟 C：三片偏振片
θ = 90°、中間片設為 1，改變 φ：

| φ (°) | 中間片後 $I_2/I_0$ | 量測 $I/I_0$ | 理論 $\tfrac18\sin^2 2\varphi$ |
|---|---|---|---|
| 0 | | | |
| 15 | | | |
| 30 | | | |
| 45 | | | |
| 60 | | | |
| 90 | | | |

## 六、實驗探究問題

1. 為什麼插入第三片偏振片「增加」了透射光？這與「偏振片只會吸收光」矛盾嗎？
2. 若在兩片正交偏振片之間插入 $N$ 片偏振片，每片依序轉 $90°/N$，總透射率為 $\tfrac12\cos^{2N}(\pi/2N)$。$N \to \infty$ 時趨近多少？這和「量子芝諾效應」有什麼關係？
3. 偏光太陽眼鏡的透射軸是鉛直還是水平？為什麼能減少水面反光？（提示：布魯斯特角）
4. 液晶螢幕前面有一片偏振片。戴著偏光太陽眼鏡歪頭看手機，會看到什麼？
5. 真實偏振片的消光比有限（正交時仍有少量透光），馬呂斯曲線在 90° 附近會如何偏離？

## 七、誤差來源與模型限制

- 理想偏振片：平行分量 100% 透過、垂直分量完全吸收。真實的聚乙烯醇碘偏振片對平行分量約只透過 80% 到 90%，且有有限的消光比。
- 光子計數的統計漲落：每次量測 $N$ 個光子，相對誤差約 $1/\sqrt{N p}$（$p$ 為透射機率），因此強度很小（接近正交）時相對誤差最大。
- 忽略偏振片表面的反射、光源強度的漂移與偵測器的暗計數。

## 八、延伸挑戰

1. 加入「消光比」參數，讓垂直分量也有小比例透過，觀察曲線在 90° 的最小值。
2. 把中間片改為四分之一波片，觀察圓偏振光通過檢偏片時強度與 θ 無關。
3. 實作 $N$ 片逐步旋轉的偏振片組，驗證探究問題 2 的公式。

## 九、延伸閱讀

- E. Hecht, *Optics*（5th ed.），Ch. 8〈Polarization〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Electromagnetic Waves〉章：偏振
- R. P. Feynman, *The Feynman Lectures on Physics*, Vol. I, Ch. 33〈Polarization〉
- P. A. M. Dirac, *The Principles of Quantum Mechanics*, Ch. 1：以偏振光子說明量子態的疊加
`;

const malus: ExampleDef = {
  id: 'malus',
  category: '光學',
  difficulty: '入門',
  listDescription: '非偏振光通過起偏片、檢偏片（與可插入的中間偏振片）：以光子計數量測各階段強度，驗證馬呂斯定律 I = ½I₀cos²θ 與三片偏振片的 I₀/8·sin²2φ。',
  description: malusHandout,
  info: { title: '偏振與馬呂斯定律', author: '', keywords: '', abstract: '' },
  variables: doubles('ml', [
    ['thA', '30', '檢偏片角度 θ（°，相對起偏片）'],
    ['wA', '0', '檢偏片自動旋轉速率（°/s）'],
    ['mid', '0', '中間偏振片（1 = 插入）'],
    ['phi', '45', '中間片角度 φ（°）'],
    ['I1m', '0', '起偏片後 I₁/I₀（量測）'],
    ['I2m', '0', '中間片後 I₂/I₀（量測）'],
    ['I3m', '0', '檢偏片後 I/I₀（量測）'],
    ['I3th', '0', '檢偏片後 I/I₀（理論）'],
    ['Nph', '0', '目前角度下累計發射光子數'],
    ['tau', '0', '動畫時間（無物理意義）'],
  ]),
  odePages: [{
    id: 'ml-ode', name: '檢偏片旋轉', method: 'Euler', increment: '0.02', comment: '',
    rates: [
      { state: 'thA', expression: 'wA' },
      { state: 'tau', expression: '1' },
    ],
  }],
  constraintPages: [{
    id: 'ml-con', name: '光子計數', comment: '每步發射 2000 個隨機偏振光子，依 cos² 機率通過各偏振片',
    code: String.raw`if (thA > 180 || thA < 0) thA = thA - 180 * Math.floor(thA / 180);
mid = mid >= 0.5 ? 1 : 0;
var d2r = Math.PI / 180;
var sig = mid + '|' + phi;
if (_v._sig !== sig || !_v._bn) {
  _v._sig = sig; _v._bn = []; _v._bp = []; _v._bt = [];
  for (var b = 0; b < 36; b++) { _v._bn.push(0); _v._bp.push(0); _v._bt.push(0); }
  _v._cnt = [0, 0, 0, 0]; _v._th = thA;
}
if (Math.abs(thA - _v._th) > 1e-9) { _v._th = thA; _v._cnt = [0, 0, 0, 0]; }
var cp = Math.cos(phi * d2r);
I3th = mid > 0.5 ? 0.5 * cp * cp * Math.pow(Math.cos((thA - phi) * d2r), 2) : 0.5 * Math.pow(Math.cos(thA * d2r), 2);
if (t !== _v._tl) {
  _v._tl = t;
  var nEm = 2000, c1 = 0, c2 = 0, c3 = 0, pol = mid > 0.5 ? phi : 0;
  var pMid = cp * cp, cA = Math.cos((thA - pol) * d2r), pA = cA * cA;
  for (var i = 0; i < nEm; i++) {
    var ca = Math.cos(Math.random() * Math.PI);       // 隨機偏振方向
    if (Math.random() >= ca * ca) continue;            // 起偏片（透射軸 0°）
    c1++;
    if (mid > 0.5 && Math.random() >= pMid) continue;  // 中間片（透射軸 φ）
    c2++;
    if (Math.random() < pA) c3++;                      // 檢偏片（透射軸 θ）
  }
  var cnt = _v._cnt;
  cnt[0] += nEm; cnt[1] += c1; cnt[2] += c2; cnt[3] += c3;
  var bi = Math.min(35, Math.floor(thA / 5));
  _v._bn[bi] += nEm; _v._bp[bi] += c3; _v._bt[bi] += thA * nEm;
}
var cn = _v._cnt;
Nph = cn[0];
if (cn[0] > 0) { I1m = cn[1] / cn[0]; I2m = cn[2] / cn[0]; I3m = cn[3] / cn[0]; }`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('ml-dp', 640, 460, [0, 10, 0, 10]),
    slider('ml-s-th', 'thA', 0, 180, 1, '檢偏片角度 θ (°)'),
    slider('ml-s-w', 'wA', 0, 30, 1, '自動旋轉速率 (°/s)'),
    slider('ml-s-m', 'mid', 0, 1, 1, '中間偏振片（1 = 插入）'),
    slider('ml-s-p', 'phi', 0, 180, 1, '中間片角度 φ (°)'),
    readout('ml-r-I1', '起偏片後 I₁/I₀（量測）', 'Nph > 0 ? I1m : "…"', { digits: 4, color: C.amber, group: '各階段強度（光子計數）' }),
    readout('ml-r-I1t', '理論 I₁/I₀', '0.5', { digits: 4, color: C.muted, group: '各階段強度（光子計數）' }),
    readout('ml-r-I2', '中間片後 I₂/I₀（量測）', 'mid > 0.5 ? (Nph > 0 ? I2m : "…") : "—（未插入）"', { digits: 4, color: C.purple, group: '各階段強度（光子計數）' }),
    readout('ml-r-I2t', '理論 ½cos²φ', 'mid > 0.5 ? 0.5 * Math.pow(Math.cos(phi * Math.PI / 180), 2) : "—"', { digits: 4, color: C.muted, group: '各階段強度（光子計數）' }),
    readout('ml-r-I3', '檢偏片後 I/I₀（量測）', 'Nph > 0 ? I3m : "…"', { digits: 4, color: C.blue, group: '各階段強度（光子計數）' }),
    readout('ml-r-I3t', '理論 I/I₀', 'I3th', { digits: 4, color: C.muted, group: '各階段強度（光子計數）' }),
    readout('ml-r-N', '目前角度累計光子數', 'Nph / 1e4', { unit: '萬個', digits: 1, color: C.ink, group: '統計' }),
    readout('ml-r-se', 'I 的預期相對統計誤差', 'Nph > 0 && I3th > 1e-6 ? 100 * Math.sqrt((1 - I3th) / (Nph * I3th)) : "—"', { unit: '%', digits: 3, color: C.ink, group: '統計' }),
    readout('ml-r-3p', '三片理論 ⅛sin²2φ', 'mid > 0.5 ? Math.pow(Math.sin(2 * phi * Math.PI / 180), 2) / 8 : "—（未插入）"', { digits: 4, color: C.red, group: '三片偏振片（θ = 90° 時）' }),
    readout('ml-r-cos', 'cos²θ', 'Math.pow(Math.cos(thA * Math.PI / 180), 2)', { digits: 4, color: C.teal, group: '統計' }),
    customDraw('ml-draw', '偏振片光路', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var th = vars.thA, ph = vars.phi, mid = vars.mid > 0.5, d2r = Math.PI / 180, tau = vars.tau;
var I1 = 0.5, I2 = mid ? 0.5 * Math.pow(Math.cos(ph * d2r), 2) : 0.5, I3 = vars.I3th;
var ay = 122, Rr = 64, kx = 0.6;
function P(x0, u, v) { return [x0 + u * Rr * kx, ay - v * Rr]; }
// 光束
var segs = [[48, 168, 1], [168, 300, I1 * 2], [300, 432, I2 * 2], [432, 560, I3 * 2]];
segs.forEach(function (s) {
  ctx.fillStyle = "rgba(233,162,59," + (0.08 + 0.32 * s[2]).toFixed(3) + ")";
  ctx.fillRect(s[0], ay - 10, s[1] - s[0], 20);
});
// 光源
var glow = ctx.createRadialGradient(40, ay, 2, 40, ay, 26);
glow.addColorStop(0, "rgba(255,240,200,1)"); glow.addColorStop(1, "rgba(233,162,59,0)");
ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(40, ay, 26, 0, 2 * Math.PI); ctx.fill();
ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(40, ay, 9, 0, 2 * Math.PI); ctx.fill();
// 偏振片
function polar(x0, angDeg, name, sym, on) {
  var a = angDeg * d2r, ax = Math.sin(a), av = Math.cos(a), qx = Math.cos(a), qv = -Math.sin(a);
  ctx.save();
  ctx.beginPath();
  for (var s = 0; s <= 48; s++) { var q = P(x0, Math.cos(s / 48 * 2 * Math.PI), Math.sin(s / 48 * 2 * Math.PI)); if (s) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
  ctx.closePath();
  if (on) { ctx.fillStyle = "rgba(43,45,49,0.10)"; ctx.fill(); ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 1.5; ctx.stroke(); }
  else { ctx.setLineDash([4, 4]); ctx.strokeStyle = "#B8B4AA"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]); }
  if (on) {
    ctx.clip();
    ctx.strokeStyle = "rgba(43,45,49,0.28)"; ctx.lineWidth = 1;
    for (var o = -0.9; o <= 0.91; o += 0.15) {
      var ln = Math.sqrt(Math.max(0, 1 - o * o)), p1 = P(x0, o * qx - ln * ax, o * qv - ln * av), p2 = P(x0, o * qx + ln * ax, o * qv + ln * av);
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }
    var e1 = P(x0, -ax, -av), e2 = P(x0, ax, av);
    ctx.strokeStyle = "#E9A23B"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(e1[0], e1[1]); ctx.lineTo(e2[0], e2[1]); ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = on ? "#2B2D31" : "#9AA0A6"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(name, x0, ay - Rr - 10);
  ctx.font = "11px sans-serif"; ctx.fillStyle = on ? "#B97A1E" : "#9AA0A6";
  ctx.fillText(on ? sym : "（未插入）", x0, ay + Rr + 16);
}
polar(168, 0, "起偏片 P₁", "透射軸 0°", true);
polar(300, ph, "中間片 P₂", "透射軸 φ", mid);
polar(432, th, "檢偏片 A", "透射軸 θ", true);
// 電場向量
var osc = Math.cos(2 * Math.PI * 0.9 * tau), L0 = 46;
function efield(x0, angDeg, amp) {
  if (amp < 0.01) { ctx.fillStyle = "#9AA0A6"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("E ≈ 0", x0, ay + 4); return; }
  var a = angDeg * d2r, ux = Math.sin(a) * kx, uy = -Math.cos(a), Lf = L0 * amp;
  ctx.strokeStyle = "rgba(209,73,91,0.35)"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(x0 - ux * Lf, ay - uy * Lf); ctx.lineTo(x0 + ux * Lf, ay + uy * Lf); ctx.stroke(); ctx.setLineDash([]);
  arrow(x0, ay, x0 + ux * Lf * osc, ay + uy * Lf * osc, "#D1495B", 2.5);
}
for (var k = 0; k < 6; k++) {
  var aa = (k * 30 + tau * 70) * d2r, sx = Math.sin(aa) * kx, sy = -Math.cos(aa), Lu = 30;
  ctx.strokeStyle = "rgba(209,73,91,0.55)"; ctx.lineWidth = 1.5;
  arrow(104, ay, 104 + sx * Lu, ay + sy * Lu, "rgba(209,73,91,0.6)", 1.5);
  arrow(104, ay, 104 - sx * Lu, ay - sy * Lu, "rgba(209,73,91,0.6)", 1.5);
}
efield(234, 0, Math.sqrt(I1 * 2) * 0.72);
efield(366, mid ? ph : 0, Math.sqrt(I2 * 2) * 0.72);
efield(498, th, Math.sqrt(I3 * 2) * 0.72);
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
ctx.fillText("非偏振光", 104, ay + Rr + 16);
// 偵測器
ctx.fillStyle = "#2B2D31"; ctx.fillRect(568, ay - 34, 54, 68);
var fr = Math.min(1, vars.I3m / 0.5);
ctx.fillStyle = "#3A3D44"; ctx.fillRect(576, ay - 26, 14, 52);
ctx.fillStyle = "#E9A23B"; ctx.fillRect(576, ay + 26 - 52 * fr, 14, 52 * fr);
ctx.fillStyle = "#FFFDF8"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("偵測", 607, ay + 4);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.fillText("光子偵測器", 595, ay - Rr - 10);
// ── I/I0 對 θ ──
var thy = [], ref = [], dots = [], bn = vars._bn || [], bp = vars._bp || [], bt = vars._bt || [];
for (var g = 0; g <= 180; g += 2) {
  var c2 = Math.pow(Math.cos(g * d2r), 2);
  ref.push([g, 0.5 * c2]);
  thy.push([g, mid ? I2 * Math.pow(Math.cos((g - ph) * d2r), 2) : 0.5 * c2]);
}
for (var b = 0; b < bn.length; b++) if (bn[b] >= 2000) dots.push([bt[b] / bn[b], bp[b] / bn[b]]);
var series = [{ pts: thy, color: "#2A9D8F", label: "理論" }, { pts: [], dots: dots, color: "#2F6FB0", label: "量測" }];
if (mid) series.unshift({ pts: ref, color: "#9AA0A6", dash: [5, 4], width: 1.2, label: "兩片 ½cos²θ" });
var gp = miniPlot({ x: 6, y: 236, w: 412, h: 218 }, series, { title: "透射強度 I/I₀ 對檢偏片角度 θ", xlabel: "θ(°)", xmin: 0, xmax: 180, ymin: 0, ymax: 0.55 });
ctx.strokeStyle = "rgba(233,162,59,0.9)"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(gp.px(th), 256); ctx.lineTo(gp.px(th), 436); ctx.stroke();
// ── 強度長條 ──
var bx = 426, bw = W - bx - 6, top = 236, bh = 218;
ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx, top, bw, bh); ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, top + 0.5, bw - 1, bh - 1);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("各階段強度 I/I₀", bx + 6, top + 14);
var y0 = top + bh - 24, hmax = bh - 52;
var bars = [["I₀", 1, 1, "#E9A23B"], ["I₁", vars.I1m, 0.5, "#B97A1E"], ["I₂", mid ? vars.I2m : vars.I1m, I2, "#533177"], ["I", vars.I3m, I3, "#2F6FB0"]];
ctx.strokeStyle = "#B8B4AA"; ctx.beginPath(); ctx.moveTo(bx + 10, y0 + 0.5); ctx.lineTo(bx + bw - 10, y0 + 0.5); ctx.stroke();
bars.forEach(function (br, j) {
  var x0 = bx + 18 + j * (bw - 28) / 4, ww = (bw - 28) / 4 - 14;
  var on = !(j === 2 && !mid);
  ctx.fillStyle = on ? br[3] : "#D9D3C4";
  ctx.fillRect(x0, y0 - hmax * br[1], ww, hmax * br[1]);
  ctx.strokeStyle = "#2B2D31"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 3, y0 - hmax * br[2]); ctx.lineTo(x0 + ww + 3, y0 - hmax * br[2]); ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(br[0], x0 + ww / 2, y0 + 14);
});
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "right"; ctx.fillText("橫線：理論", bx + bw - 6, top + 14);
`),
  ],
};

// ─────────────────────────────────────────────
// 弦上脈衝的反射與透射
// ─────────────────────────────────────────────
const pulseHandout = String.raw`# 🪢 弦上脈衝的反射與透射實驗講義

> 把一條細繩和一條粗繩接在一起，抖一下細繩的一端：脈衝到達接點時，一部分「穿過去」、一部分「彈回來」，而且彈回來的脈衝竟然上下顛倒。這個簡單的現象與光在玻璃表面的反射、電纜中訊號的反射、甚至超音波影像的原理，用的是同一組公式。

## 一、實驗目的

1. 觀察脈衝在兩條線密度不同的弦接點處的反射與透射。
2. 量測反射與透射脈衝的振幅比，驗證 $r = \dfrac{Z_1 - Z_2}{Z_1 + Z_2}$、$\tau = \dfrac{2Z_1}{Z_1 + Z_2}$。
3. 量測兩段弦上的波速，驗證 $v = \sqrt{T/\mu}$。
4. 驗證能量守恆：反射能量比 $R = r^2$ 與透射能量比 $T = (Z_2/Z_1)\tau^2$ 之和為 1。
5. 比較固定端、自由端與吸收端的反射。

## 二、課前預報

1. 張力 $T$、線密度 $\mu$ 的弦，波速為何？波阻抗 $Z = \sqrt{T\mu} = \mu v$ 的單位是什麼？
2. 接點處必須滿足哪兩個條件？（提示：弦不能斷開；接點沒有質量，所受合力必須為零。）
3. 由上述兩個條件推導 $r$ 與 $\tau$，並證明 $1 + r = \tau$。
4. 細繩（$\mu_1$）接到線密度 4 倍的粗繩，$r$、$\tau$ 各是多少？反射脈衝是正立還是倒立？反過來從粗繩傳到細繩呢？
5. 透射振幅 $\tau$ 可以大於 1，這是否違反能量守恆？

## 三、實驗原理

### 1. 波動方程與阻抗
張力 $T$ 均勻，兩段線密度為 $\mu_1$、$\mu_2$：
$$ \mu(x)\frac{\partial^2 y}{\partial t^2} = T\frac{\partial^2 y}{\partial x^2}, \qquad v_j = \sqrt{\frac{T}{\mu_j}}, \qquad Z_j = \sqrt{T\mu_j} $$
因張力相同，$v_2/v_1 = Z_1/Z_2 = \sqrt{\mu_1/\mu_2}$。

### 2. 接點條件
在接點 $x = 0$：
- 位移連續：$y_1(0, t) = y_2(0, t)$
- 斜率連續（無質量接點受力平衡）：$\partial y_1/\partial x = \partial y_2/\partial x$

令入射波 $f(t - x/v_1)$、反射波 $r f(t + x/v_1)$、透射波 $\tau f(t - x/v_2)$，代入兩條件得
$$ r = \frac{Z_1 - Z_2}{Z_1 + Z_2}, \qquad \tau = \frac{2Z_1}{Z_1 + Z_2} = 1 + r $$
- $Z_2 \gt Z_1$（傳到較重的弦）：$r \lt 0$，反射脈衝倒立。$Z_2 \to \infty$ 就是固定端（$r = -1$）。
- $Z_2 \lt Z_1$（傳到較輕的弦）：$r \gt 0$，反射脈衝正立。$Z_2 \to 0$ 就是自由端（$r = +1$）。

### 3. 能量
行進波的功率 $P = Z\omega^2A^2/2$ 正比於 $ZA^2$，因此
$$ R = r^2, \qquad T_E = \frac{Z_2}{Z_1}\tau^2 = \frac{4Z_1Z_2}{(Z_1 + Z_2)^2}, \qquad R + T_E = 1 $$
透射脈衝在較慢的弦上會被「壓窄」（寬度乘以 $v_2/v_1$），所以振幅與能量的關係必須連同阻抗一起考慮。

### 4. 數值方法
弦被分成約 600 小段，以有限差分（leapfrog）求解 $\mu y_{tt} = T y_{xx}$。為了讓兩段弦都有相同的解析度，格點間距與當地波速成正比（$\Delta x_j \propto v_j$），接點的格點質量取兩側各半：
$$ m_i\frac{y_i^{n+1} - 2y_i^n + y_i^{n-1}}{\Delta t^2} = \frac{T}{\Delta x_+}\left(y_{i+1}^n - y_i^n\right) - \frac{T}{\Delta x_-}\left(y_i^n - y_{i-1}^n\right) $$
時間步長滿足 CFL 條件 $v\Delta t/\Delta x \le 0.9$。吸收端使用一階 Mur 邊界條件。

### 5. 本模擬如何量測
- 弦張力 $T = 1$ N、左段 $\mu_1 = 1$ kg/m（$v_1 = 1$ m/s），脈衝 $y = A e^{-(x - x_0)^2/2\sigma^2}$ 由 $x_0 = -1$ m 向右出發。
- $v_1$：$t = 0.5$ s 時入射脈衝峰的位置。
- 脈衝峰抵達接點後再經 $3\sigma/v_1$，此時反射與透射脈衝已完全分開：取左段（$x \lt -1.5\sigma$）與右段的最大偏移量，除以 $A$ 得到 $r$、$\tau$；同時由透射脈衝峰的位置算出 $v_2$，並分別計算兩段弦的動能加位能。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| 阻抗比 Z₂/Z₁ | 0.3 至 4 | 等於 $\sqrt{\mu_2/\mu_1}$；右段弦的粗細隨之改變 |
| 脈衝寬度 σ | 0.05 至 0.10 m | 高斯脈衝的標準差 |
| 端點條件 | 0、1、2 | 0 固定端、1 自由端、2 吸收端（無反射，預設） |
| **重新發射脈衝** | | 從 $x_0 = -1$ m 再發射一次 |

- 上方：藍色為左段弦（介質 1）、紅色為右段弦（介質 2，線條粗細代表線密度）。灰色虛線標出入射振幅 $A$，綠色與紅色虛線分別為理論的 $rA$ 與 $\tau A$，脈衝分開後可直接比對峰值。
- 左下：兩段弦的能量（以初始能量為單位）隨時間變化，以及總能量。
- 右下：$r$、$\tau$ 對 $Z_2/Z_1$ 的理論曲線，點為每次發射量到的值（改變阻抗比後重新量測，點會累積）。
- 改變任一滑桿會自動重新發射。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：波速
σ = 0.08 m、兩端吸收。改變阻抗比，記錄兩段弦的波速：

| Z₂/Z₁ | μ₂/μ₁ | 量測 $v_1$ | 量測 $v_2$ | 理論 $v_1Z_1/Z_2$ |
|---|---|---|---|---|
| 0.5 | | | | |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### 步驟 B：反射與透射振幅
| Z₂/Z₁ | 量測 r | 理論 r | 量測 τ | 理論 τ | 量測 1 + r |
|---|---|---|---|---|---|
| 0.3 | | | | | |
| 0.5 | | | | | |
| 0.8 | | | | | |
| 1.0 | | | | | |
| 1.5 | | | | | |
| 2.0 | | | | | |
| 4.0 | | | | | |

把量測點畫在 $r$、$\tau$ 對 $Z_2/Z_1$ 的圖上，與理論曲線比較。

### 步驟 C：能量守恆與端點
1. 對步驟 B 的每一列記錄 $R$、$T_E$ 與 $R + T_E$。
2. 把兩端條件改為固定端與自由端，觀察脈衝在遠端反射後的正倒，並說明能量圖的變化。

| Z₂/Z₁ | 量測 R | 理論 $r^2$ | 量測 $T_E$ | 理論 $4Z_1Z_2/(Z_1+Z_2)^2$ | R + $T_E$ |
|---|---|---|---|---|---|
| 0.5 | | | | | |
| 2.0 | | | | | |
| 4.0 | | | | | |

## 六、實驗探究問題

1. 當 $Z_2 = Z_1$ 時沒有反射，稱為「阻抗匹配」。舉出兩個工程上刻意做阻抗匹配的例子。
2. 為什麼透射脈衝在較重的弦上變窄、在較輕的弦上變寬？脈衝的「時間長度」有沒有改變？
3. $\tau \gt 1$ 時透射脈衝比入射脈衝還高，能量卻比較少，請用 $P \propto ZA^2$ 解釋。
4. 光由空氣（$n_1$）垂直射向玻璃（$n_2$）時，振幅反射係數為 $(n_1 - n_2)/(n_1 + n_2)$。光學中的 $n$ 對應到弦的哪個量？為何反射光在牛頓環實驗中有半波損失？
5. 超音波檢查時要在皮膚上塗凝膠，用本實驗的觀點說明原因。

## 七、誤差來源與模型限制

- 有限格點：脈衝越窄、阻抗比越大，每個脈衝寬度內的格點越少，數值色散會讓脈衝後方出現小漣漪；在最不利的設定（σ = 0.05 m、Z₂/Z₁ = 4）振幅量測誤差約 1%，一般設定下小於 0.1%。
- 接點處以離散質量近似「無質量接點」，對很窄的脈衝會有微小的頻率相依反射。
- 吸收端採一階 Mur 條件，對垂直入射的一維波幾乎完美，但仍有極小的反射。
- 理想弦：小振幅、完全柔軟、無阻尼、張力處處相同。真實的繩子有阻尼與剛性，脈衝會逐漸衰減與變形。

## 八、延伸挑戰

1. 在接點加上一個點質量 $M$，推導並驗證頻率相依的反射係數（高頻脈衝反射較多）。
2. 在兩段弦中間插入長度為四分之一波長、阻抗為 $\sqrt{Z_1Z_2}$ 的第三段，驗證抗反射層的原理（與光學鍍膜相同）。
3. 讓線密度沿弦緩慢漸變，觀察反射是否大幅減少（漸變阻抗匹配）。

## 九、延伸閱讀

- A. P. French, *Vibrations and Waves*, Ch. 7〈Progressive Waves〉：波阻抗與邊界上的反射
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Waves—I〉章：弦波的能量與反射
- F. S. Crawford, *Waves*（Berkeley Physics Course Vol. 3），Ch. 5〈Reflection〉
- H. J. Pain, *The Physics of Vibrations and Waves*（6th ed.），Ch. 5〈Transverse Wave Motion〉：阻抗與反射
`;

const pulseReflection: ExampleDef = {
  id: 'pulse-reflection',
  category: '振動與波動',
  difficulty: '基礎',
  listDescription: '兩條線密度不同的弦接在一起，高斯脈衝到達接點時部分反射、部分透射：以有限差分解波動方程，量測振幅比、波速與能量，驗證 r = (Z₁−Z₂)/(Z₁+Z₂) 與 τ = 2Z₁/(Z₁+Z₂)。',
  description: pulseHandout,
  info: { title: '弦上脈衝的反射與透射', author: '', keywords: '', abstract: '' },
  variables: doubles('pr', [
    ['zr', '2', '阻抗比 Z₂/Z₁ = √(μ₂/μ₁)'],
    ['wid', '0.08', '脈衝寬度 σ（m）'],
    ['endC', '2', '兩端條件：0 固定、1 自由、2 吸收'],
    ['rTh', '0', '理論反射係數 r'],
    ['tTh', '0', '理論透射係數 τ'],
    ['rMeas', '0', '量測反射振幅比'],
    ['tMeas', '0', '量測透射振幅比'],
    ['v1m', '0', '量測 v₁（m/s）'],
    ['v2m', '0', '量測 v₂（m/s）'],
    ['RE', '0', '量測反射能量比'],
    ['TE', '0', '量測透射能量比'],
    ['ELf', '0', '左段能量 / 初始能量'],
    ['ERf', '0', '右段能量 / 初始能量'],
    ['Etot', '1', '總能量 / 初始能量'],
    ['meas', '0', '是否已完成量測（1 = 是）'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'pr-ode', name: '時間推進', method: 'Euler', increment: '0.01', comment: '弦的運動在約束頁以有限差分法求解',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'pr-con', name: '波動方程（非均勻格點有限差分）', comment: '格點間距與當地波速成正比；接點質量取兩側各半',
    code: String.raw`var Ntot = 600, x0p = -1.0, Aamp = 1.0, Tn = 1.0, mu1 = 1.0, v1 = 1.0;
var sig = zr + '|' + wid + '|' + endC;
rTh = (1 - zr) / (1 + zr);
tTh = 2 / (1 + zr);
if (_v._sig !== sig || !_v._y) {
  _v._sig = sig; t = 0; _v._lt = 0;
  var N1 = Math.round(Ntot / (1 + zr)), N2 = Ntot - N1, N = N1 + N2;
  var dx1 = 2 / N1, dx2 = 2 / N2, mu2 = zr * zr * mu1, v2 = Math.sqrt(Tn / mu2);
  var xs = new Float64Array(N + 1), ms = new Float64Array(N + 1), ks = new Float64Array(N);
  for (var i = 0; i <= N; i++) xs[i] = i <= N1 ? -2 + i * dx1 : (i - N1) * dx2;
  for (var j = 0; j < N; j++) ks[j] = Tn / (xs[j + 1] - xs[j]);
  for (var q = 0; q <= N; q++) {
    var mL = q > 0 ? (q <= N1 ? mu1 * dx1 : mu2 * dx2) : 0;
    var mR = q < N ? (q < N1 ? mu1 * dx1 : mu2 * dx2) : 0;
    ms[q] = 0.5 * (mL + mR);
  }
  var hmax = 0.9 * Math.min(dx1 / v1, dx2 / v2), ns0 = Math.ceil(0.01 / hmax - 1e-9), hs = 0.01 / ns0;
  var y = new Float64Array(N + 1), yo = new Float64Array(N + 1);
  for (var p = 0; p <= N; p++) {
    var u0 = (xs[p] - x0p) / wid, u1 = (xs[p] - x0p + v1 * hs) / wid;
    y[p] = Aamp * Math.exp(-0.5 * u0 * u0);
    yo[p] = Aamp * Math.exp(-0.5 * u1 * u1);
  }
  if (endC < 0.5) { y[0] = 0; y[N] = 0; yo[0] = 0; yo[N] = 0; }
  _v._y = y; _v._yo = yo; _v._yn = new Float64Array(N + 1);
  _v._xs = xs; _v._ms = ms; _v._ks = ks; _v._N1 = N1; _v._N = N;
  _v._h = hs; _v._fL = mu1 * dx1 / (mu1 * dx1 + mu2 * dx2); _v._dx1 = dx1; _v._dx2 = dx2; _v._v2 = v2; _v._E0 = 0; _v._v1done = 0;
  meas = 0; rMeas = 0; tMeas = 0; v1m = 0; v2m = 0; RE = 0; TE = 0; ELf = 0; ERf = 0; Etot = 1;
}
function peakAt(arr, xsArr, i0, i1) {
  var best = i0, bv = 0;
  for (var a = i0; a <= i1; a++) if (Math.abs(arr[a]) > bv) { bv = Math.abs(arr[a]); best = a; }
  var xp = xsArr[best];
  if (best > 0 && best < arr.length - 1) {
    var fa = Math.abs(arr[best - 1]), fb = Math.abs(arr[best]), fc = Math.abs(arr[best + 1]), dd = fa - 2 * fb + fc;
    if (dd < 0) {
      var off = 0.5 * (fa - fc) / dd;
      xp = xsArr[best] + off * (off > 0 ? xsArr[best + 1] - xsArr[best] : xsArr[best] - xsArr[best - 1]);
    }
  }
  return { i: best, val: arr[best], x: xp };
}
if (t > _v._lt) {
  var dtp = t - _v._lt; _v._lt = t;
  var hh = _v._h, nsub = Math.max(1, Math.round(dtp / hh));
  var Y = _v._y, YO = _v._yo, YN = _v._yn, M = _v._ms, Kc = _v._ks, NN = _v._N, NL = _v._N1, X = _v._xs;
  var h2 = hh * hh, EL = 0, ER = 0;
  for (var s = 0; s < nsub; s++) {
    for (var c = 1; c < NN; c++) {
      YN[c] = 2 * Y[c] - YO[c] + h2 / M[c] * (Kc[c] * (Y[c + 1] - Y[c]) - Kc[c - 1] * (Y[c] - Y[c - 1]));
    }
    if (endC < 0.5) { YN[0] = 0; YN[NN] = 0; }
    else if (endC < 1.5) {
      YN[0] = 2 * Y[0] - YO[0] + h2 / M[0] * Kc[0] * (Y[1] - Y[0]);
      YN[NN] = 2 * Y[NN] - YO[NN] - h2 / M[NN] * Kc[NN - 1] * (Y[NN] - Y[NN - 1]);
    } else {
      var cl = (v1 * hh - _v._dx1) / (v1 * hh + _v._dx1), cr = (_v._v2 * hh - _v._dx2) / (_v._v2 * hh + _v._dx2);
      YN[0] = Y[1] + cl * (YN[1] - Y[0]);
      YN[NN] = Y[NN - 1] + cr * (YN[NN - 1] - Y[NN]);
    }
    if (s === nsub - 1) {
      // 能量：動能用中央差分速度，位能用彈簧伸長
      for (var e = 0; e <= NN; e++) {
        var vel = (YN[e] - YO[e]) / (2 * hh), ke = 0.5 * M[e] * vel * vel;
        if (e < NL) EL += ke; else if (e > NL) ER += ke; else { EL += ke * _v._fL; ER += ke * (1 - _v._fL); }
        if (e < NN) { var pe = 0.5 * Kc[e] * (Y[e + 1] - Y[e]) * (Y[e + 1] - Y[e]); if (e < NL) EL += pe; else ER += pe; }
      }
    }
    var tmp = YO; YO = Y; Y = YN; YN = tmp;
  }
  _v._y = Y; _v._yo = YO; _v._yn = YN;
  if (!(_v._E0 > 0)) _v._E0 = EL + ER;
  var E0 = _v._E0;
  ELf = EL / E0; ERf = ER / E0; Etot = (EL + ER) / E0;
  // 量測 v1：t ≈ 0.5 s 時入射脈衝峰的位置
  if (!_v._v1done && t >= 0.5) {
    var pk1 = peakAt(Y, X, 1, NL - 1);
    v1m = (pk1.x - x0p) / t; _v._v1done = 1;
  }
  // 脈衝峰抵達接點後 3σ/v1 量測反射與透射
  if (_v._v1done && meas < 0.5 && t >= -x0p / v1m + 3 * wid / v1m) {
    var iL = 1;
    while (iL < NL && X[iL] < -1.5 * wid) iL++;
    var pr = peakAt(Y, X, 1, iL - 1), pt = peakAt(Y, X, NL + 1, NN - 1);
    rMeas = pr.val / Aamp; tMeas = pt.val / Aamp;
    v2m = pt.x / (t + x0p / v1m);
    RE = ELf; TE = ERf; meas = 1;
    if (!_v._hist) _v._hist = [];
    _v._hist.push([zr, rMeas, tMeas]);
    if (_v._hist.length > 60) _v._hist.shift();
  }
} else if (t < _v._lt) {
  _v._lt = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('pr-dp', 640, 460, [0, 10, 0, 10]),
    slider('pr-s-z', 'zr', 0.3, 4, 0.05, '阻抗比 Z₂/Z₁'),
    slider('pr-s-w', 'wid', 0.05, 0.1, 0.005, '脈衝寬度 σ (m)'),
    slider('pr-s-e', 'endC', 0, 2, 1, '端點條件 (0/1/2)'),
    button('pr-b-fire', '重新發射脈衝', '_v._sig = "";'),
    readout('pr-r-mu', '線密度比 μ₂/μ₁', 'zr * zr', { digits: 3, color: C.ink, group: '弦的性質' }),
    readout('pr-r-v1', '量測 v₁', 'v1m > 0 ? v1m : "量測中…"', { unit: 'm/s', digits: 4, color: C.blue, group: '弦的性質' }),
    readout('pr-r-v2', '量測 v₂', 'meas > 0.5 ? v2m : "等待透射脈衝…"', { unit: 'm/s', digits: 4, color: C.red, group: '弦的性質' }),
    readout('pr-r-v2t', '理論 v₂ = v₁Z₁/Z₂', '1 / zr', { unit: 'm/s', digits: 4, color: C.muted, group: '弦的性質' }),
    readout('pr-r-r', '量測反射振幅比', 'meas > 0.5 ? rMeas : "等待脈衝抵達接點…"', { digits: 4, color: C.teal, group: '振幅' }),
    readout('pr-r-rt', '理論 r = (Z₁−Z₂)/(Z₁+Z₂)', 'rTh', { digits: 4, color: C.muted, group: '振幅' }),
    readout('pr-r-t', '量測透射振幅比', 'meas > 0.5 ? tMeas : "等待脈衝抵達接點…"', { digits: 4, color: C.red, group: '振幅' }),
    readout('pr-r-tt', '理論 τ = 2Z₁/(Z₁+Z₂)', 'tTh', { digits: 4, color: C.muted, group: '振幅' }),
    readout('pr-r-R', '反射能量比 R（量測）', 'meas > 0.5 ? RE : "…"', { digits: 4, color: C.teal, group: '能量' }),
    readout('pr-r-Rt', '理論 r²', 'rTh * rTh', { digits: 4, color: C.muted, group: '能量' }),
    readout('pr-r-T', '透射能量比 T（量測）', 'meas > 0.5 ? TE : "…"', { digits: 4, color: C.red, group: '能量' }),
    readout('pr-r-Tt', '理論 (Z₂/Z₁)τ²', 'zr * tTh * tTh', { digits: 4, color: C.muted, group: '能量' }),
    readout('pr-r-RT', 'R + T（量測）', 'meas > 0.5 ? RE + TE : "…"', { digits: 4, color: C.purple, group: '能量' }),
    readout('pr-r-E', '目前總能量 / 初始能量', 'Etot', { digits: 4, color: C.ink, group: '能量' }),
    customDraw('pr-draw', '弦與能量圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var Y = vars._y, X = vars._xs, NL = vars._N1, N = vars._N, zr = vars.zr, endC = vars.endC;
var x0 = 44, x1 = W - 44, cy = 140, ys = 62, top = 8, bot = 246;
function PX(x) { return x0 + (x + 2) / 4 * (x1 - x0); }
function PY(y) { return cy - y * ys; }
// 兩種介質的背景
ctx.fillStyle = "rgba(47,111,176,0.07)"; ctx.fillRect(PX(-2), top, PX(0) - PX(-2), bot - top);
ctx.fillStyle = "rgba(209,73,91,0.07)"; ctx.fillRect(PX(0), top, PX(2) - PX(0), bot - top);
ctx.fillStyle = "#2F6FB0"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("介質 1：μ₁、v₁、Z₁", PX(-2) + 6, top + 16);
ctx.fillStyle = "#D1495B"; ctx.textAlign = "right"; ctx.fillText("介質 2：μ₂ = (Z₂/Z₁)² μ₁", PX(2) - 6, top + 16);
// 參考線：A、rA、τA
ctx.save(); ctx.beginPath(); ctx.rect(0, top, W, bot - top); ctx.clip();
ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PX(-2), cy); ctx.lineTo(PX(2), cy); ctx.stroke();
function hline(xa, xb, yv, col, lab) {
  ctx.strokeStyle = col; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(PX(xa), PY(yv)); ctx.lineTo(PX(xb), PY(yv)); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText(lab, PX(xb) + 4, PY(yv) + 3);
}
hline(-2, -1.55, 1, "#9AA0A6", "A");
hline(-1.0, -0.05, vars.rTh, "#2A9D8F", "rA");
hline(0.05, 1.7, vars.tTh, "#D1495B", "τA");
// 弦
if (Y && X) {
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#2F6FB0"; ctx.lineWidth = 2; ctx.beginPath();
  for (var i = 0; i <= NL; i++) { if (i) ctx.lineTo(PX(X[i]), PY(Y[i])); else ctx.moveTo(PX(X[i]), PY(Y[i])); }
  ctx.stroke();
  ctx.strokeStyle = "#D1495B"; ctx.lineWidth = Math.max(0.8, Math.min(7, 2 * zr)); ctx.beginPath();
  for (var j = NL; j <= N; j++) { if (j > NL) ctx.lineTo(PX(X[j]), PY(Y[j])); else ctx.moveTo(PX(X[j]), PY(Y[j])); }
  ctx.stroke();
  ctx.fillStyle = "#2B2D31"; ctx.beginPath(); ctx.arc(PX(0), PY(Y[NL]), 4, 0, 2 * Math.PI); ctx.fill();
}
ctx.restore();
// 端點
function endMark(xe, dir) {
  var px = PX(xe);
  if (endC < 0.5) {
    ctx.fillStyle = "#6B6F76"; ctx.fillRect(dir < 0 ? px - 10 : px, cy - 46, 10, 92);
    ctx.strokeStyle = "#FFFDF8"; ctx.lineWidth = 1;
    for (var k = -40; k < 46; k += 10) { ctx.beginPath(); ctx.moveTo(dir < 0 ? px - 10 : px, cy + k); ctx.lineTo(dir < 0 ? px : px + 10, cy + k + 8); ctx.stroke(); }
  } else if (endC < 1.5) {
    ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, cy - 80); ctx.lineTo(px, cy + 80); ctx.stroke();
    ctx.beginPath(); ctx.arc(px, PY(Y ? Y[dir < 0 ? 0 : N] : 0), 5, 0, 2 * Math.PI); ctx.stroke();
  } else {
    var gr = ctx.createLinearGradient(px, 0, px + dir * 30, 0);
    gr.addColorStop(0, "rgba(107,111,118,0.05)"); gr.addColorStop(1, "rgba(107,111,118,0.45)");
    ctx.fillStyle = gr; ctx.fillRect(Math.min(px, px + dir * 30), cy - 46, 30, 92);
  }
}
endMark(-2, -1); endMark(2, 1);
var endName = endC < 0.5 ? "固定端" : endC < 1.5 ? "自由端" : "吸收端";
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif";
ctx.textAlign = "left"; ctx.fillText(endName, PX(-2) + 3, bot - 4);
ctx.textAlign = "right"; ctx.fillText(endName, PX(2) - 3, bot - 4);
ctx.textAlign = "center"; ctx.fillText("接點 x = 0", PX(0), bot - 4);
[-1, 1].forEach(function (xm) { ctx.fillText(xm + " m", PX(xm), bot - 4); });
// ── 能量對時間 ──
var tt = vars.t, hE = track("_prE", [tt, vars.ELf, vars.ERf, vars.Etot], 3000);
var tmax = Math.max(4, Math.ceil(tt));
miniPlot({ x: 6, y: 254, w: 340, h: 200 }, [
  { pts: hE.map(function (p) { return [p[0], p[1]]; }), color: "#2F6FB0", label: "左段" },
  { pts: hE.map(function (p) { return [p[0], p[2]]; }), color: "#D1495B", label: "右段" },
  { pts: hE.map(function (p) { return [p[0], p[3]]; }), color: "#2B2D31", dash: [5, 3], label: "總和" },
], { title: "能量 / 初始能量", xlabel: "t(s)", xmin: 0, xmax: tmax, ymin: 0, ymax: 1.15 });
// ── r、τ 對 Z2/Z1 ──
var rc = [], tc = [];
for (var z = 0.3; z <= 4.001; z += 0.05) { rc.push([z, (1 - z) / (1 + z)]); tc.push([z, 2 / (1 + z)]); }
var hist = vars._hist || [];
var gz = miniPlot({ x: 352, y: 254, w: W - 358, h: 200 }, [
  { pts: rc, color: "#2A9D8F", label: "r" },
  { pts: tc, color: "#D1495B", label: "τ" },
  { pts: [], dots: hist.map(function (p) { return [p[0], p[1]]; }), color: "#2A9D8F" },
  { pts: [], dots: hist.map(function (p) { return [p[0], p[2]]; }), color: "#D1495B" },
], { title: "振幅比對 Z₂/Z₁", xlabel: "Z₂/Z₁", xmin: 0, xmax: 4, ymin: -0.7, ymax: 1.7 });
ctx.strokeStyle = "rgba(233,162,59,0.9)"; ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(gz.px(zr), 274); ctx.lineTo(gz.px(zr), 436); ctx.stroke();
`),
  ],
};

const OPTICS_EXAMPLES: ExampleDef[] = [thinLens, newtonRings, malus, pulseReflection];

export default OPTICS_EXAMPLES;

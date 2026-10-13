import { button, C, customDraw, doubles, drawingPanel, readout, slider } from './builders';
import type { ExampleDef } from './types';

// ═════════════════════════════════════════════════════════════
// 大學普物：近代物理
// ═════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// 拉塞福散射
// ─────────────────────────────────────────────
const rutherfordHandout = String.raw`# 🎯 拉塞福散射：發現原子核實驗講義

> 「這就好像你用 15 吋砲彈射向一張衛生紙，砲彈卻彈回來打中你自己。」——拉塞福形容 1909 年蓋革與馬士登觀察到 α 粒子大角度散射時的震驚。這個實驗推翻了湯姆森的葡萄乾布丁模型，確立了原子核的存在。

## 一、實驗目的

1. 觀察 α 粒子在原子核庫侖斥力作用下的雙曲線軌跡。
2. 驗證撞擊參數 $b$ 與散射角 $\theta$ 的關係 $\tan(\theta/2) = d_0/(2b)$。
3. 統計大量粒子的散射角分布，與拉塞福公式 $dN/d\Omega \propto 1/\sin^4(\theta/2)$ 比較。
4. 理解為什麼「少數粒子大角度反彈」意味著正電荷集中在極小的核中。

## 二、課前預報

1. 寫出 α 粒子（電荷 $2e$）與原子核（電荷 $Ze$）之間的庫侖位能，並推導正面碰撞時動能 $E_k$ 全部轉為位能的最近距離 $d_0 = \dfrac{k(2e)(Ze)}{E_k}$。
2. 5 MeV 的 α 粒子射向金核（Z = 79），$d_0$ 約為多少 fm？與金原子半徑（約 0.14 nm）相比如何？
3. 為何庫侖力下的軌跡是雙曲線？在什麼條件下 α 粒子會被反彈（$\theta \gt 90°$）？
4. 若 α 粒子束均勻照射在截面上，撞擊參數小於 $b$ 的機率正比於什麼？
5. 在湯姆森模型中，正電荷均勻分布在整個原子中，α 粒子最大可能的偏折角大約是多少？

## 三、實驗原理

### 1. 撞擊參數與散射角
角動量與能量守恆給出雙曲線軌道，散射角滿足
$$ \tan\frac{\theta}{2} = \frac{d_0}{2b}, \qquad d_0 = \frac{kq_\alpha Q}{E_k} $$
$b$ 越小，散射角越大；$b = 0$ 時正面反彈（$\theta = 180°$）。

### 2. 微分截面
粒子束均勻照射，撞擊參數在 $b$ 到 $b + db$ 的環面積為 $2\pi b\ db$，換成立體角得到拉塞福公式：
$$ \frac{d\sigma}{d\Omega} = \left(\frac{d_0}{4}\right)^2\frac{1}{\sin^4(\theta/2)} $$
因此散射角大於 $\Theta$ 的機率
$$ P(\theta \gt \Theta) = \frac{\pi b(\Theta)^2}{\pi b_{max}^2} = \left(\frac{d_0}{2b_{max}\tan(\Theta/2)}\right)^2 $$

### 3. 本模擬
- 單位：$d_0 = 1/E_k$（任意長度單位），粒子入射速率固定為 3。
- 撞擊參數 $b$ 以「圓盤內均勻分布」抽樣（$b = b_{max}\sqrt{u}$），重現三維實驗的統計。
- 軌跡以速度 Verlet 法積分，近核處自動縮小步長；粒子離開畫面後繼續積分到很遠處再量測出射角。

## 四、模擬器操作說明

| 控制項 | 範圍 | 說明 |
|---|---|---|
| α 粒子動能 E | 0.5 至 4 | 決定 $d_0 = 1/E$ |
| 束半徑 b_max | 0.5 至 6 | 撞擊參數的最大值 |
| 發射率 | 1 至 20 粒/秒 | |

- 上方：金色為原子核，虛線圓為 $d_0$；淺色帶為粒子束範圍。
- 下方：散射角直方圖（對數刻度），橘點為拉塞福公式的理論期望值。
- 改變 E 或 b_max 會清除統計重新開始。建議將速度調為 4× 以累積更多數據。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：單一軌跡（發射率 1、b_max = 2）
觀察數條軌跡，估計其撞擊參數與散射角，驗證 $b$ 越小 $\theta$ 越大。

### 步驟 B：散射角分布（E = 1、b_max = 3，累積 ≥ 500 顆）
| θ 區間 | 0–10° | 10–20° | 20–30° | 30–60° | 60–90° | 90–180° |
|---|---|---|---|---|---|---|
| 實測個數 | | | | | | |
| 理論期望 | | | | | | |

### 步驟 C：反彈比例與動能
| E | 實測 $N(\theta \gt 90°)/N$ | 理論 $(d_0/2b_{max})^2$ |
|---|---|---|
| 0.5 | | |
| 1 | | |
| 2 | | |
| 4 | | |

動能加倍時，反彈比例變為幾倍？

## 六、實驗探究問題

1. 為何蓋革與馬士登觀察到的大於 90° 的散射比例雖然只有約八千分之一，卻足以推翻湯姆森模型？
2. 由「最近距離 $d_0$」可以估計原子核大小的上限。若動能夠大，使 α 粒子進入核力範圍，散射分布會出現什麼偏差？
3. 拉塞福公式在 $\theta \to 0$ 時發散，真實情況下是什麼因素讓它不發散？（提示：電子的屏蔽）
4. 若把靶核換成鋁（Z = 13），在相同 α 動能下，反彈比例變為金的幾倍？
5. 現代的「深度非彈性散射」實驗用電子撞擊質子，發現質子內部有夸克。它與拉塞福散射有何相同的思路？

## 七、誤差來源與模型限制

- 二維軌跡呈現的是每顆粒子自己的散射平面；統計上以三維撞擊參數分布抽樣。
- 忽略原子核反衝（金核質量約為 α 粒子的 49 倍）與電子屏蔽。
- 有限的粒子數造成直方圖的統計漲落，尤其大角度的區間；誤差約為 $\sqrt N$。

## 八、延伸挑戰

1. 把斥力改為吸引力（如帶負電的粒子），比較軌跡與散射角分布。
2. 讓靶為兩個相距一段距離的原子核，觀察多重散射。
3. 以「湯姆森模型」——正電荷均勻分布在半徑 $R$ 的球內——取代點電荷，比較散射角分布。

## 九、延伸閱讀

- E. Rutherford, "The scattering of α and β particles by matter and the structure of the atom", *Philosophical Magazine* 21, 669 (1911)
- H. Geiger, E. Marsden, "The laws of deflexion of α particles through large angles", *Philosophical Magazine* 25, 604 (1913)
- J. R. Taylor, *Classical Mechanics*, Ch. 14〈Collision Theory〉
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Nuclear Physics〉章：發現原子核
`;

const rutherford: ExampleDef = {
  id: 'rutherford',
  category: '近代物理',
  difficulty: '進階',
  listDescription: 'α 粒子束射向原子核：觀察庫侖斥力下的雙曲線軌跡，累積數百顆粒子的散射角直方圖，與拉塞福公式 1/sin⁴(θ/2) 比較。',
  description: rutherfordHandout,
  info: { title: '拉塞福散射', author: '', keywords: '', abstract: '' },
  variables: doubles('rf', [
    ['Ek', '1', 'α 粒子動能（相對單位）'],
    ['bmax', '3', '粒子束半徑（最大撞擊參數）'],
    ['rate', '5', '每秒發射粒子數'],
    ['d0', '1', '正面碰撞最近距離 = 1/Ek'],
    ['nTot', '0', '已統計粒子數'],
    ['nBack', '0', '散射角大於 90° 的粒子數'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'rf-ode', name: '時間推進', method: 'Euler', increment: '0.02', comment: '粒子軌跡在約束頁以速度 Verlet 法積分',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'rf-con', name: '庫侖散射', comment: '',
    code: String.raw`d0 = 1 / Ek;
var v0 = 3, K = d0 * v0 * v0 / 2, X0 = 14;
var sig = Ek + '|' + bmax;
if (!_v._P || _v._sig !== sig) {
  _v._sig = sig; _v._P = []; _v._done = [];
  _v._hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  _v._next = t; _v._lt = t; nTot = 0; nBack = 0;
}
function stepP(p, h) {
  var r = Math.sqrt(p.x * p.x + p.y * p.y), f = K / (r * r * r);
  p.vx += 0.5 * h * f * p.x; p.vy += 0.5 * h * f * p.y;
  p.x += h * p.vx; p.y += h * p.vy;
  r = Math.sqrt(p.x * p.x + p.y * p.y); f = K / (r * r * r);
  p.vx += 0.5 * h * f * p.x; p.vy += 0.5 * h * f * p.y;
}
if (t > _v._lt) {
  var dtp = t - _v._lt; _v._lt = t;
  while (t >= _v._next) {
    var bb = bmax * Math.sqrt(Math.random()) * (Math.random() < 0.5 ? -1 : 1);
    var vs = Math.sqrt(Math.max(0.01, v0 * v0 - 2 * K / Math.sqrt(X0 * X0 + bb * bb)));
    var y0 = bb * v0 / vs;   // 角動量與從無窮遠入射時相同
    _v._P.push({ x: -X0, y: y0, vx: vs, vy: 0, b: bb, path: [[-X0, y0]] });
    _v._next += 1 / rate;
  }
  var keep = [];
  for (var i = 0; i < _v._P.length; i++) {
    var p = _v._P[i], rem = dtp;
    while (rem > 1e-12) {
      var rr = Math.sqrt(p.x * p.x + p.y * p.y), h = Math.min(rem, Math.max(1e-4, 0.01 * rr / v0));
      stepP(p, h); rem -= h;
    }
    var lp = p.path[p.path.length - 1];
    if ((p.x - lp[0]) * (p.x - lp[0]) + (p.y - lp[1]) * (p.y - lp[1]) > 0.04) p.path.push([p.x, p.y]);
    if (p.x * p.vx + p.y * p.vy > 0 && p.x * p.x + p.y * p.y > (X0 + 1) * (X0 + 1)) {
      p.path.push([p.x, p.y]);
      for (var s = 0; s < 400 && p.x * p.x + p.y * p.y < 4e5; s++) stepP(p, 0.05 * Math.sqrt(p.x * p.x + p.y * p.y) / v0);
      var th = Math.atan2(Math.abs(p.vy), p.vx);
      _v._hist[Math.min(17, Math.floor(th * 180 / Math.PI / 10))]++;
      nTot = nTot + 1; if (th > Math.PI / 2) nBack = nBack + 1;
      _v._done.push({ path: p.path, th: th });
      if (_v._done.length > 30) _v._done.shift();
    } else {
      keep.push(p);
    }
  }
  _v._P = keep;
} else if (t < _v._lt) {
  _v._lt = t;
}`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('rf-dp', 620, 460, [0, 10, 0, 10]),
    slider('rf-s-E', 'Ek', 0.5, 4, 0.1, 'α 粒子動能 E'),
    slider('rf-s-b', 'bmax', 0.5, 6, 0.1, '束半徑 b_max'),
    slider('rf-s-r', 'rate', 1, 20, 1, '發射率（粒/秒）'),
    readout('rf-r-d0', '正面碰撞最近距離 d₀', 'd0', { digits: 3, color: C.amber, group: '設定' }),
    readout('rf-r-N', '已統計粒子數 N', 'nTot', { digits: 0, color: C.ink, group: '統計' }),
    readout('rf-r-nb', '散射角 > 90° 的個數', 'nBack', { digits: 0, color: C.red, group: '統計' }),
    readout('rf-r-pb', '實測反彈比例', 'nTot > 0 ? 100 * nBack / nTot : "…"', { unit: '%', digits: 2, color: C.red, group: '統計' }),
    readout('rf-r-pth', '理論 (d₀/2b_max)²', 'Math.min(1, Math.pow(d0 / (2 * bmax), 2)) * 100', { unit: '%', digits: 2, color: C.muted, group: '統計' }),
    customDraw('rf-draw', '散射繪圖', String.raw`
ctx.fillStyle = "#FFFDF8"; ctx.fillRect(0, 0, W, H);
var sc = 19.5, ox = W / 2, oy = 128, d0 = vars.d0, bmax = vars.bmax;
function X(x) { return ox + x * sc; }
function Y(y) { return oy - y * sc; }
ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 256); ctx.clip();
ctx.fillStyle = "#F3EDE0"; ctx.fillRect(0, 0, W, 256);
ctx.fillStyle = "rgba(233,162,59,0.14)"; ctx.fillRect(0, Y(bmax), X(-13), Y(-bmax) - Y(bmax));
(vars._done || []).forEach(function (d) {
  ctx.strokeStyle = d.th > Math.PI / 2 ? "rgba(209,73,91,0.55)" : "rgba(47,111,176,0.3)"; ctx.lineWidth = 1;
  ctx.beginPath(); d.path.forEach(function (q, i) { if (i) ctx.lineTo(X(q[0]), Y(q[1])); else ctx.moveTo(X(q[0]), Y(q[1])); }); ctx.stroke();
});
(vars._P || []).forEach(function (p) {
  ctx.strokeStyle = "rgba(47,111,176,0.75)"; ctx.lineWidth = 1.3; ctx.beginPath();
  p.path.forEach(function (q, i) { if (i) ctx.lineTo(X(q[0]), Y(q[1])); else ctx.moveTo(X(q[0]), Y(q[1])); });
  ctx.lineTo(X(p.x), Y(p.y)); ctx.stroke();
  ctx.fillStyle = "#2F6FB0"; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 3, 0, 2 * Math.PI); ctx.fill();
});
ctx.strokeStyle = "rgba(185,122,30,0.8)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(X(0), Y(0), d0 * sc, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = "#E9A23B"; ctx.strokeStyle = "#B97A1E"; ctx.beginPath(); ctx.arc(X(0), Y(0), 5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
ctx.restore();
ctx.fillStyle = "#6B6F76"; ctx.font = "10px sans-serif"; ctx.textAlign = "left"; ctx.fillText("α 粒子束 →", 8, Y(bmax) - 4);
// 直方圖與理論
var hist = vars._hist || [], N = vars.nTot;
function Pgt(T) { if (T <= 0) return 1; var bT = d0 / (2 * Math.tan(T / 2)); return Math.min(1, bT * bT / (bmax * bmax)); }
var top = 268, bh = H - top - 26, L = 50, Rr = W - 12, bw = (Rr - L) / 18;
var maxc = Math.max(10, N);
function LY(c) { return top + bh - (Math.log10(Math.max(c, 0.1)) + 1) / (Math.log10(maxc) + 1.2) * bh; }
ctx.strokeStyle = "#B8B4AA"; ctx.beginPath(); ctx.moveTo(L, top); ctx.lineTo(L, top + bh); ctx.lineTo(Rr, top + bh); ctx.stroke();
ctx.font = "10px monospace"; ctx.fillStyle = "#6B6F76"; ctx.textAlign = "right";
for (var e = 0; Math.pow(10, e) <= maxc; e++) { ctx.fillText(String(Math.pow(10, e)), L - 4, LY(Math.pow(10, e)) + 3); ctx.strokeStyle = "rgba(43,45,49,0.06)"; ctx.beginPath(); ctx.moveTo(L, LY(Math.pow(10, e))); ctx.lineTo(Rr, LY(Math.pow(10, e))); ctx.stroke(); }
ctx.textAlign = "center";
for (var k = 0; k < 18; k++) {
  var x0 = L + k * bw, c = hist[k] || 0;
  if (c > 0) { ctx.fillStyle = k >= 9 ? "rgba(209,73,91,0.6)" : "rgba(47,111,176,0.55)"; ctx.fillRect(x0 + 2, LY(c), bw - 4, top + bh - LY(c)); }
  var ex = N * (Pgt(k * Math.PI / 18) - Pgt((k + 1) * Math.PI / 18));
  if (ex > 0.05) { ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(x0 + bw / 2, LY(ex), 3.5, 0, 2 * Math.PI); ctx.fill(); }
  if (k % 3 === 0) { ctx.fillStyle = "#6B6F76"; ctx.fillText(String(k * 10) + "°", x0, top + bh + 12); }
}
ctx.fillText("180°", Rr, top + bh + 12);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left";
ctx.fillText("散射角分布（對數刻度）  ■ 實測  ● 拉塞福公式期望值", L, top - 2);
`),
  ],
};

// ─────────────────────────────────────────────
// 密立根油滴實驗
// ─────────────────────────────────────────────
const millikanHandout = String.raw`# 💧 密立根油滴實驗：測量基本電荷講義

> 1909 至 1913 年間，密立根（Robert Millikan）在顯微鏡下追蹤一顆顆帶電的小油滴，發現它們的電荷總是某個最小值的整數倍——這個最小值就是基本電荷 $e$。他因此獲得 1923 年諾貝爾物理獎。

## 一、實驗目的

1. 利用油滴在空氣中的終端速度（斯托克斯定律）求出油滴半徑。
2. 在平行板電場中量測油滴上升速度，計算油滴所帶電荷。
3. 統計多顆油滴的電荷，驗證電荷的量子化並估計基本電荷 $e$。

## 二、課前預報

1. 寫出斯托克斯阻力 $F = 6\pi\eta rv$，並說明為何微米級油滴幾乎瞬間就達到終端速度。
2. 推導無電場時的終端速度 $v_f = \dfrac{2\rho gr^2}{9\eta}$，並反解出 $r$。
3. 推導加上向上電力 $qE$ 後的上升終端速度 $v_r$，證明
   $$ q = \frac{6\pi\eta r(v_f + v_r)}{E} $$
4. 半徑 0.6 μm、密度 886 kg/m³ 的油滴，在 η = 1.81×10⁻⁵ Pa·s 的空氣中，下落 0.5 mm 需要多久？
5. 若油滴帶 3e，要讓它懸停，平行板（間距 5 mm）需加多少電壓？

## 三、實驗原理

### 1. 力的平衡
油滴（帶負電 $q$）受重力 $mg$（已扣除空氣浮力）、斯托克斯阻力、與電力 $qE$。因為鬆弛時間只有約 $10^{-5}$ s，可直接使用終端速度：
$$ v = \frac{qE - mg}{6\pi\eta r} \quad(\text{向上為正}) $$

### 2. 量測步驟的公式
- 不加電壓，量下落速度 $v_f$：
$$ r = \sqrt{\frac{9\eta v_f}{2\rho g}}, \qquad m = \frac43\pi r^3\rho $$
- 加電壓 $V$（$E = V/d$）使油滴上升，量上升速度 $v_r$：
$$ q = \frac{6\pi\eta r\left(v_f + v_r\right)}{E} $$

### 3. 平衡法（另一種方法）
調整電壓使油滴靜止：$qV/d = mg$，故 $q = mgd/V$。

### 4. 布朗運動
微米級油滴會受空氣分子撞擊而隨機抖動（見「布朗運動」範例），這是密立根實驗的主要隨機誤差來源之一，因此每顆油滴應重複量測多次取平均。

## 四、模擬器操作說明

| 控制項 | 說明 |
|---|---|
| 電壓 V | −1000 至 1000 V；正電壓使帶負電的油滴受到向上的電力 |
| **新油滴** | 噴入一顆新油滴（半徑與電荷隨機） |
| **碼表** | 按一次開始計時、再按一次停止 |
| 顯示答案 | 1 時顯示油滴真實的半徑、電荷數與位置 |

- 顯微鏡視野中，粗刻度線間距 0.5 mm，細刻度 0.1 mm。
- 平行板間距 d = 5 mm、油密度 886 kg/m³、空氣黏滯係數 1.81×10⁻⁵ Pa·s、g = 9.8 m/s²。
- 油滴到達視野邊緣時會停住，請調整電壓把它拉回來。

- **實驗數據儀表板**（模擬畫面下方）：即時顯示各項量測值與理論值。按「＋ 記錄一列」可把當下所有數值存入數據表，完成後按「匯出表格 CSV」，用試算表作圖分析。

## 五、實驗步驟與數據記錄

### 步驟 A：一顆油滴的完整量測
1. V = 0，等油滴下落到某條粗刻度線時按「碼表」，下落 0.5 mm 到下一條粗刻度線時再按，得 $t_f$。重複 3 次。
2. 加電壓（例如 +600 V）使油滴上升，同樣量上升 0.5 mm 的時間 $t_r$。重複 3 次。

| 次數 | $t_f$ (s) | $t_r$ (s) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 平均 | | |

計算 $v_f$、$v_r$、$r$、$m$、$q$，以及 $q/e$（$e = 1.602 \times 10^{-19}$ C）。

### 步驟 B：多顆油滴
按「新油滴」重複步驟 A，至少量測 8 顆：

| 油滴 | r (μm) | q (×10⁻¹⁹ C) | q / 1.602×10⁻¹⁹ | 最接近整數 n | q/n |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| … | | | | | |

把所有 q 畫在數線上，觀察是否聚集在某個值的整數倍附近；以 $\sum q/\sum n$ 估計 $e$。

### 步驟 C：平衡法驗證
選一顆油滴，調電壓使它幾乎靜止，以 $q = mgd/V$ 計算電荷，與步驟 A 比較。

## 六、實驗探究問題

1. 如果不知道 $e$ 的值，只有一堆量得的 $q$，要如何「找出」最小公因數？油滴數量要多少才可靠？
2. 為何要選擇帶電量少（n 小）的油滴來量測？
3. 布朗運動對量測時間的影響有多大？為何量測距離越長，相對誤差越小？
4. 密立根原始數據中使用的空氣黏滯係數略有誤差，使 $e$ 偏小約 0.6%。這說明了系統誤差的什麼特性？
5. 查閱關於密立根實驗數據取捨的爭議（如 Holton 與 Goodstein 的討論），你如何看待實驗中「挑選數據」的倫理？

## 七、誤差來源與模型限制

- 未納入坎寧漢修正：油滴半徑接近空氣分子平均自由程（約 0.07 μm）時，斯托克斯定律需修正。
- 碼表的反應時間（約 0.1–0.2 s）與布朗運動造成的隨機誤差。
- 假設油滴是完美球形、密度均勻，且量測期間電荷不變（真實實驗中可能吸附離子而改變）。

## 八、延伸挑戰

1. 加入坎寧漢修正 $F = 6\pi\eta rv/(1 + A\lambda/r)$，比較 $e$ 的估計值變化。
2. 加入「油滴偶爾捕獲一個離子」的隨機事件，讓學生觀察同一顆油滴電荷的跳變。
3. 把量測數據匯出，寫一個程式自動找出最佳的基本電荷值。

## 九、延伸閱讀

- R. A. Millikan, "On the elementary electrical charge and the Avogadro constant", *Physical Review* 2, 109 (1913)
- R. A. Millikan, Nobel Lecture "The electron and the light-quant from the experimental point of view" (1924)
- D. Goodstein, "In defense of Robert Andrews Millikan", *American Scientist* 89, 54 (2001)
- D. Halliday, R. Resnick, J. Walker, *Fundamentals of Physics*,〈Electric Fields〉章：密立根油滴實驗
- CODATA 2018：基本電荷 $e = 1.602176634 \times 10^{-19}$ C（2019 年起為定義值）
`;

const millikan: ExampleDef = {
  id: 'millikan',
  category: '近代物理',
  difficulty: '進階',
  listDescription: '在顯微鏡下追蹤帶電油滴：以碼表量測無電場時的下落速度與加電壓後的上升速度，計算電荷並統計多顆油滴，驗證電荷量子化。',
  description: millikanHandout,
  info: { title: '密立根油滴實驗', author: '', keywords: '', abstract: '' },
  variables: doubles('mk', [
    ['V', '0', '平行板電壓（V），正值使負電油滴受向上電力'],
    ['dpl', '5', '平行板間距（mm）'],
    ['rho', '886', '油密度（kg/m³）'],
    ['eta', '1.81e-5', '空氣黏滯係數（Pa·s）'],
    ['g', '9.8', '重力加速度'],
    ['Tair', '293', '空氣溫度（K，影響布朗運動）'],
    ['yd', '1.0', '油滴高度（mm，視野中心為 0）'],
    ['rTrue', '0.6', '油滴真實半徑（μm）'],
    ['nTrue', '3', '油滴帶電數（e 的倍數）'],
    ['show', '0', '顯示答案（1 = 是）'],
    ['sw', '0', '碼表讀數（s）'],
    ['swRun', '0', '碼表運行中（1 = 是）'],
    ['sw0', '0', '碼表起始時間'],
    ['tau', '0', '計時用（無物理意義）'],
  ]),
  odePages: [{
    id: 'mk-ode', name: '時間推進', method: 'Euler', increment: '0.01', comment: '油滴運動在約束頁計算（含布朗運動）',
    rates: [{ state: 'tau', expression: '1' }],
  }],
  constraintPages: [{
    id: 'mk-con', name: '油滴受力（終端速度 + 布朗運動）', comment: '',
    code: String.raw`if (_v._lt === undefined || t < _v._lt) _v._lt = t;
if (t > _v._lt) {
  var dtp = t - _v._lt; _v._lt = t;
  var r = rTrue * 1e-6, m = 4 / 3 * Math.PI * r * r * r * (rho - 1.2);
  var q = nTrue * 1.602176634e-19, Efield = V / (dpl * 1e-3), gam = 6 * Math.PI * eta * r;
  var vel = (q * Efield - m * g) / gam;
  var Dd = 1.380649e-23 * Tair / gam;
  var u1 = Math.random() || 1e-12, u2 = Math.random();
  var noise = Math.sqrt(2 * Dd * dtp) * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  yd += (vel * dtp + noise) * 1000;
  if (yd > 1.3) yd = 1.3;
  if (yd < -1.3) yd = -1.3;
}
if (swRun > 0) sw = t - sw0;`,
  }],
  initPages: [],
  viewElements: [
    drawingPanel('mk-dp', 600, 420, [0, 10, 0, 10]),
    slider('mk-s-V', 'V', -1000, 1000, 5, '電壓 V'),
    button('mk-b-new', '新油滴', 'rTrue = 0.45 + 0.4 * Math.random(); nTrue = 1 + Math.floor(Math.random() * 6); yd = 1.0; swRun = 0; sw = 0;'),
    button('mk-b-sw', '碼表 開始／停止', 'if (swRun > 0) { swRun = 0; sw = t - sw0; } else { swRun = 1; sw0 = t; sw = 0; }'),
    slider('mk-s-sh', 'show', 0, 1, 1, '顯示答案'),
    readout('mk-r-V', '電壓 V', 'V', { unit: 'V', digits: 0, color: C.ink, group: '儀器' }),
    readout('mk-r-E', '電場 E = V/d', 'V / (dpl * 1e-3)', { unit: 'V/m', color: C.ink, group: '儀器' }),
    readout('mk-r-sw', '碼表', 'sw', { unit: 's', digits: 2, color: C.red, group: '儀器' }),
    readout('mk-r-r', '油滴半徑 r', 'show >= 0.5 ? rTrue : "（已隱藏）"', { unit: 'μm', digits: 3, color: C.teal, group: '答案（「顯示答案」設為 1）' }),
    readout('mk-r-n', '帶電數 n', 'show >= 0.5 ? nTrue : "（已隱藏）"', { unit: 'e', digits: 0, color: C.teal, group: '答案（「顯示答案」設為 1）' }),
    readout('mk-r-q', '電荷 q', 'show >= 0.5 ? nTrue * 1.602176634e-19 : "（已隱藏）"', { unit: 'C', color: C.teal, group: '答案（「顯示答案」設為 1）' }),
    readout('mk-r-Vb', '平衡電壓', 'show >= 0.5 ? (4 / 3 * Math.PI * Math.pow(rTrue * 1e-6, 3) * (rho - 1.2)) * g * dpl * 1e-3 / (nTrue * 1.602176634e-19) : "（已隱藏）"', { unit: 'V', digits: 0, color: C.teal, group: '答案（「顯示答案」設為 1）' }),
    customDraw('mk-draw', '顯微鏡視野', String.raw`
ctx.fillStyle = "#F4F1EA"; ctx.fillRect(0, 0, W, H);
var cx = 200, cy = 205, Rv = 190, mmpx = Rv / 1.35;
ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rv, 0, 2 * Math.PI); ctx.clip();
ctx.fillStyle = "#0E1218"; ctx.fillRect(cx - Rv, cy - Rv, 2 * Rv, 2 * Rv);
for (var k = -13; k <= 13; k++) {
  var yy = cy - k * 0.1 * mmpx, major = k % 5 === 0;
  ctx.strokeStyle = major ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"; ctx.lineWidth = major ? 1.2 : 1;
  ctx.beginPath(); ctx.moveTo(cx - (major ? 120 : 70), yy); ctx.lineTo(cx + (major ? 120 : 70), yy); ctx.stroke();
  if (major) { ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "10px monospace"; ctx.textAlign = "left"; ctx.fillText((k * 0.1).toFixed(1), cx + 126, yy + 3); }
}
var dy = cy - vars.yd * mmpx, glow = ctx.createRadialGradient(cx, dy, 0, cx, dy, 9);
glow.addColorStop(0, "rgba(255,250,220,1)"); glow.addColorStop(0.4, "rgba(255,230,150,0.8)"); glow.addColorStop(1, "rgba(255,200,80,0)");
ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, dy, 9, 0, 2 * Math.PI); ctx.fill();
ctx.restore();
ctx.strokeStyle = "#6B6F76"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, Rv, 0, 2 * Math.PI); ctx.stroke();
if (Math.abs(vars.yd) >= 1.29) { ctx.fillStyle = "#E9A23B"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText(vars.yd > 0 ? "油滴到達上緣，請降低電壓" : "油滴到達下緣，請提高電壓", cx, cy + Rv - 14); }
// 讀數
var Ef = vars.V / (vars.dpl * 1e-3);
ctx.fillStyle = "#2B2D31"; ctx.font = "bold 28px monospace"; ctx.textAlign = "left";
ctx.fillText(vars.sw.toFixed(2) + " s", 412, 52);
ctx.font = "11px sans-serif"; ctx.fillStyle = vars.swRun > 0 ? "#D1495B" : "#6B6F76";
ctx.fillText(vars.swRun > 0 ? "● 計時中" : "碼表（已停止）", 414, 70);
`),
  ],
};

const MODERN_EXAMPLES: ExampleDef[] = [rutherford, millikan];

export default MODERN_EXAMPLES;

/**
 * Small JavaScript helpers that are prepended to the CustomDraw code of the
 * university-physics examples. They are plain source text (not imported
 * functions) because CustomDraw code is stored inside the example and must
 * stay self-contained when exported or edited by users.
 *
 * Available inside CustomDraw after `${DRAW_LIB}`:
 * - track(key, row, maxN)           history buffer kept on the view side; cleared when t jumps back (reset)
 * - miniPlot(box, series, opt)      line chart with a shared y axis; returns { px, py } mappers
 * - infoBox(x, y, lines, opt)       translucent read-out panel; lines are strings or [text, color]
 * - arrow(x0, y0, x1, y1, color, w) pixel-space arrow
 */
export const DRAW_LIB = String.raw`// ===== Kinetix 繪圖小工具（miniPlot / infoBox / track / arrow）=====
function track(key, row, maxN) {
  var h = vars[key];
  if (!h || row[0] < h.lastT) { h = vars[key] = []; h.lastT = -Infinity; }
  if (row[0] !== h.lastT) {
    h.push(row); h.lastT = row[0];
    if (h.length > maxN) h.splice(0, h.length - maxN);
  }
  return h;
}
function miniPlot(box, series, opt) {
  opt = opt || {};
  var xmin = opt.xmin, xmax = opt.xmax, ymin = opt.ymin, ymax = opt.ymax;
  var axn = Infinity, axx = -Infinity, ayn = Infinity, ayx = -Infinity;
  series.forEach(function (s) {
    s.pts.forEach(function (p) {
      if (p[0] < axn) axn = p[0]; if (p[0] > axx) axx = p[0];
      if (p[1] < ayn) ayn = p[1]; if (p[1] > ayx) ayx = p[1];
    });
  });
  if (xmin === undefined) xmin = isFinite(axn) ? axn : 0;
  if (xmax === undefined) xmax = isFinite(axx) ? axx : 1;
  if (ymin === undefined) ymin = isFinite(ayn) ? Math.min(ayn, 0) : 0;
  if (ymax === undefined) ymax = isFinite(ayx) ? ayx * 1.1 : 1;
  if (xmax - xmin < 1e-12) xmax = xmin + 1;
  if (ymax - ymin < 1e-12) ymax = ymin + 1;
  var L = box.x + 38, R = box.x + box.w - 8, T = box.y + 20, B = box.y + box.h - 18;
  var px = function (x) { return L + ((x - xmin) / (xmax - xmin)) * (R - L); };
  var py = function (y) { return B - ((y - ymin) / (ymax - ymin)) * (B - T); };
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.93)";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "#E5E1D8"; ctx.lineWidth = 1;
  ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
  ctx.strokeStyle = "#B8B4AA";
  ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
  if (ymin < 0 && ymax > 0) {
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(L, py(0)); ctx.lineTo(R, py(0)); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.fillStyle = "#6B6F76"; ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(Number(ymax.toPrecision(3)).toString(), L - 3, T + 4);
  ctx.fillText(Number(ymin.toPrecision(3)).toString(), L - 3, B);
  ctx.textAlign = "left";
  ctx.fillText(Number(xmin.toPrecision(3)).toString(), L, B + 12);
  ctx.textAlign = "right";
  ctx.fillText((opt.xlabel ? opt.xlabel + " " : "") + Number(xmax.toPrecision(3)), R, B + 12);
  ctx.textAlign = "left";
  if (opt.title) { ctx.fillStyle = "#2B2D31"; ctx.font = "bold 11px sans-serif"; ctx.fillText(opt.title, box.x + 6, box.y + 13); }
  ctx.beginPath(); ctx.rect(L, T - 2, R - L, B - T + 4); ctx.clip();
  var lx = box.x + box.w - 8;
  series.forEach(function (s) {
    if (s.pts.length) {
      ctx.strokeStyle = s.color || "#2F6FB0"; ctx.lineWidth = s.width || 1.6;
      ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      s.pts.forEach(function (p, i) { if (i) ctx.lineTo(px(p[0]), py(p[1])); else ctx.moveTo(px(p[0]), py(p[1])); });
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (s.dots) {
      ctx.fillStyle = s.color || "#2F6FB0";
      s.dots.forEach(function (p) { ctx.beginPath(); ctx.arc(px(p[0]), py(p[1]), 3.5, 0, 2 * Math.PI); ctx.fill(); });
    }
  });
  ctx.restore();
  ctx.save(); ctx.font = "10px sans-serif"; ctx.textAlign = "right";
  series.forEach(function (s) {
    if (!s.label) return;
    ctx.fillStyle = s.color || "#2F6FB0";
    ctx.fillText(s.label, lx, box.y + 13);
    lx -= ctx.measureText(s.label).width + 10;
  });
  ctx.restore();
  return { px: px, py: py };
}
function infoBox(x, y, lines, opt) {
  opt = opt || {};
  ctx.save();
  ctx.font = (opt.font || "12px monospace");
  var w = opt.w || 0;
  lines.forEach(function (ln) { var s = typeof ln === "string" ? ln : ln[0]; w = Math.max(w, ctx.measureText(s).width + 16); });
  var lh = opt.lh || 16, h = lines.length * lh + 8;
  if (opt.right) x = x - w;
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#E5E1D8"; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.textAlign = "left";
  lines.forEach(function (ln, i) {
    var s = typeof ln === "string" ? ln : ln[0];
    ctx.fillStyle = typeof ln === "string" ? "#2B2D31" : ln[1];
    ctx.fillText(s, x + 8, y + 4 + lh * (i + 1) - 4);
  });
  ctx.restore();
  return { w: w, h: h };
}
function arrow(x0, y0, x1, y1, color, w) {
  var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;
  var ux = dx / len, uy = dy / len, hs = Math.min(9, len * 0.45);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 2;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hs * 0.8, y1 - uy * hs * 0.8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - ux * hs - uy * hs * 0.45, y1 - uy * hs + ux * hs * 0.45);
  ctx.lineTo(x1 - ux * hs + uy * hs * 0.45, y1 - uy * hs - ux * hs * 0.45);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
// ===== 以下為本範例的繪圖程式 =====
`;

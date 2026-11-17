/**
 * 彈出式模擬舞台：在獨立視窗中只顯示模擬畫面（含儀表板）與播放控制，
 * 不含程式碼與講義，方便上課投影。視窗與編輯器同源，編輯器修改模型後
 * 會呼叫視窗的 `__kinetixLoad` 重新載入最新的模擬。
 */

export interface StagePopupWindow extends Window {
  __kinetixLoad?: (html: string, title: string, w: number, h: number) => void;
}

const SHELL_HTML = String.raw`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>模擬舞台</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #FAF8F3; color: #2B2D31;
    font-family: 'Noto Sans TC', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  body { display: flex; flex-direction: column; }
  header { flex-shrink: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
    padding: 8px 14px; background: #FFFFFF; border-bottom: 1px solid #E5E1D8; }
  #title { font-weight: 700; font-size: 15px; margin-right: auto; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; max-width: 50vw; }
  button, select { font: inherit; font-size: 14px; font-weight: 600; border-radius: 10px;
    border: 1px solid #E5E1D8; padding: 6px 12px; min-height: 36px; cursor: pointer;
    background: #FFFFFF; color: #2B2D31; }
  button:hover, select:hover { background: #FAF8F3; }
  #play { background: #E9A23B; border-color: #E9A23B; color: #FFFFFF; min-width: 92px; }
  #play.running { background: #6B6F76; border-color: #6B6F76; }
  #t { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 14px;
    color: #6B6F76; min-width: 96px; text-align: right; }
  main { flex: 1; min-height: 0; overflow: auto; display: flex; justify-content: center;
    align-items: flex-start; padding: 12px; }
  #wrap { background: #FFFFFF; border: 1px solid #E5E1D8; border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  iframe { display: block; width: 100%; height: 100%; border: none; }
  :fullscreen header, :fullscreen main { background: #FAF8F3; }
</style>
</head>
<body>
<header>
  <span id="title">模擬舞台</span>
  <button id="play" type="button">▶ 播放</button>
  <button id="step" type="button" title="單步">⏭ 單步</button>
  <button id="reset" type="button" title="重置">↺ 重置</button>
  <select id="speed" title="播放速度">
    <option value="0.25">0.25×</option><option value="0.5">0.5×</option>
    <option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option>
  </select>
  <span id="t">t = 0.000 s</span>
  <button id="fs" type="button" title="全螢幕（再按 Esc 離開）">⛶ 全螢幕</button>
</header>
<main><div id="wrap"><iframe id="frame" title="模擬舞台" sandbox="allow-scripts allow-downloads"></iframe></div></main>
<script>
(function () {
  var frame = document.getElementById('frame');
  var wrap = document.getElementById('wrap');
  var main = document.querySelector('main');
  var playBtn = document.getElementById('play');
  var tEl = document.getElementById('t');
  var speedSel = document.getElementById('speed');
  var html = '', simW = 400, simH = 400, contentH = null, running = false;

  function send(msg) { if (frame.contentWindow) frame.contentWindow.postMessage(msg, '*'); }

  // Fit the simulation to the window: as large as possible while the whole
  // simulation stays visible; the dashboard below may scroll.
  function layout() {
    var availW = main.clientWidth - 24, availH = main.clientHeight - 24;
    var w = Math.max(240, Math.min(availW, availH * simW / simH));
    wrap.style.width = w + 'px';
    wrap.style.height = (contentH || w * simH / simW) + 'px';
  }

  function setRunning(r) {
    running = r;
    playBtn.textContent = r ? '⏸ 暫停' : '▶ 播放';
    playBtn.classList.toggle('running', r);
  }

  window.__kinetixLoad = function (newHtml, title, w, h) {
    html = newHtml; simW = w || 400; simH = h || 400; contentH = null;
    document.title = (title || '模擬') + '｜模擬舞台';
    document.getElementById('title').textContent = title || '模擬舞台';
    setRunning(false);
    tEl.textContent = 't = 0.000 s';
    layout();
    frame.srcdoc = html;
  };

  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow || !e.data || typeof e.data !== 'object') return;
    var d = e.data;
    if (d.type === 'ejss:ready') {
      if (speedSel.value !== '1') send({ type: 'ejss:setSpeed', speed: parseFloat(speedSel.value) });
    } else if (d.type === 'ejss:status') {
      setRunning(!!d.running);
      tEl.textContent = 't = ' + (Number(d.t) || 0).toFixed(3) + ' s';
    } else if (d.type === 'ejss:contentHeight') {
      contentH = typeof d.height === 'number' && d.height > 0 ? d.height : null;
      layout();
    } else if (d.type === 'csvData') {
      var url = URL.createObjectURL(new Blob([d.csv], { type: 'text/csv;charset=utf-8;' }));
      var a = document.createElement('a');
      a.href = url; a.download = (d.title || 'simulation') + '.csv'; a.click();
      URL.revokeObjectURL(url);
    }
  });

  playBtn.onclick = function () { send(running ? 'pause' : 'play'); setRunning(!running); };
  document.getElementById('step').onclick = function () { send('step'); };
  document.getElementById('reset').onclick = function () { if (html) window.__kinetixLoad(html, document.getElementById('title').textContent, simW, simH); };
  speedSel.onchange = function () { send({ type: 'ejss:setSpeed', speed: parseFloat(speedSel.value) }); };
  document.getElementById('fs').onclick = function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  };
  window.addEventListener('resize', layout);
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); playBtn.click(); }
  });
})();
</script>
</body>
</html>`;

/**
 * Opens (or focuses) the stage popup and loads the given preview HTML into it.
 * Returns null when the browser blocked the popup.
 */
export function openStagePopup(
  existing: StagePopupWindow | null,
  html: string,
  title: string,
  bbox: { w: number; h: number }
): StagePopupWindow | null {
  let win = existing && !existing.closed ? existing : null;
  if (!win) {
    win = window.open('', 'kinetix-stage', 'popup,width=1100,height=820') as StagePopupWindow | null;
    if (!win) return null;
    // A window with this name may survive from an earlier editor session.
    if (!win.__kinetixLoad) {
      win.document.open();
      win.document.write(SHELL_HTML);
      win.document.close();
    }
  }
  win.__kinetixLoad?.(html, title, bbox.w, bbox.h);
  win.focus();
  return win;
}

/** Reloads an open popup with the latest model; no-op when it is closed. */
export function refreshStagePopup(
  win: StagePopupWindow | null,
  html: string,
  title: string,
  bbox: { w: number; h: number }
): void {
  if (win && !win.closed) win.__kinetixLoad?.(html, title, bbox.w, bbox.h);
}

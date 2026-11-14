import fs from 'fs';

const bundle = fs.readFileSync('apps/fx/src/embed/castleRuntime.iife.js', 'utf8');

const snippetHtml = `<!-- Gridika · 3D интерактивный QR-код (Замок): ссылка https://gridika.ru -->
<div id="gridika-test-castle" style="width:100%;max-width:520px;height:480px;margin:0 auto;position:relative;border-radius:18px;overflow:hidden;background:#0c1f17;box-shadow:0 14px 36px rgba(0,0,0,0.45);">
  <div style="position:absolute;top:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;color:#19C37D;letter-spacing:0.05em;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:4px 10px;border-radius:8px;border:1px solid rgba(25,195,125,0.25);pointer-events:none;">GRIDIKA 3D · ЗАМОК</div>
  <div style="position:absolute;bottom:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;pointer-events:none;">Клик — трансформация в QR • Зажмите — вращение</div>
  <a id="gridika-test-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;bottom:14px;right:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;color:#8BF0C2;text-decoration:none;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;border:1px solid rgba(25,195,125,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.2);">Gridika.ru ↗</a>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function() {
  function start() {
    ${bundle}
    if (window.GridikaCastleModule) {
      window.GridikaCastleModule.initCastleWidget('gridika-test-castle', { url: 'https://gridika.ru', height: 480 });
    }
  }
  if (window.THREE) {
    start();
  } else {
    var check = setInterval(function() {
      if (window.THREE) {
        clearInterval(check);
        start();
      }
    }, 50);
  }
})();
</script>`;

const fullPageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Gridika 3D — Тестовый виджет: Замок (QR на https://gridika.ru)</title>
  <style>
    body {
      margin: 0;
      padding: 30px 15px;
      background: #08120e;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #fff;
      box-sizing: border-box;
    }
    .wrapper {
      width: 100%;
      max-width: 520px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    ${snippetHtml}
  </div>
</body>
</html>`;

fs.writeFileSync('apps/fx/public/test-widget.html', fullPageHtml, 'utf8');
fs.writeFileSync('apps/fx/src/embed/castleSnippet.txt', snippetHtml, 'utf8');
console.log('Successfully written test-widget.html and castleSnippet.txt');

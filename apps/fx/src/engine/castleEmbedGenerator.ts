import { codeHeader } from './codeNotice';
import { domainLockJs } from './domainLock';
import runtimeSource from '../embed/castleRuntime.iife.js?raw';

export interface CastleEmbedOptions {
  text: string;
  height?: number;
  mode?: 'day' | 'night' | 'winter';
  license?: { id: string; domain: string };
}

export function generateCastleEmbedCode(o: CastleEmbedOptions): string {
  const id = 'gridika-castle-' + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 480;
  const url = o.text || 'https://gridika.ru';
  const mode = o.mode || 'day';

  const badgeHtml = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;bottom:14px;right:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;color:#8BF0C2;text-decoration:none;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;border:1px solid rgba(25,195,125,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.2);">Gridika.ru ↗</a>`;

  const header = o.license
    ? codeHeader('3D QR-Замок', o.license)
    : '<!-- Gridika · 3D интерактивный QR-код (Замок) -->';

  const licenseJs = o.license ? domainLockJs(`${id}-badge`, o.license.domain) : '';

  return `${header}
<div id="${id}" style="width:100%;max-width:520px;height:${height}px;margin:0 auto;position:relative;border-radius:18px;overflow:hidden;background:#0c1f17;box-shadow:0 14px 36px rgba(0,0,0,0.45);">
  <div style="position:absolute;top:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;color:#19C37D;letter-spacing:0.05em;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:4px 10px;border-radius:8px;border:1px solid rgba(25,195,125,0.25);pointer-events:none;">GRIDIKA 3D · ЗАМОК</div>
  <div style="position:absolute;bottom:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;pointer-events:none;">Клик — трансформация в QR • Зажмите — вращение</div>
  ${badgeHtml}
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function() {
  function start() {
    ${runtimeSource}
    if (typeof GridikaCastleModule !== 'undefined' && GridikaCastleModule.initCastleWidget) {
      GridikaCastleModule.initCastleWidget("${id}", { url: ${JSON.stringify(url)}, height: ${height}, mode: ${JSON.stringify(mode)} });
    }
  }
  ${licenseJs}
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
}

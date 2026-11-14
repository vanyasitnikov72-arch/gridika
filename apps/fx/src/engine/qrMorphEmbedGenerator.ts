import { codeHeader } from './codeNotice';
import { domainLockJs } from './domainLock';
import runtimeSource from '../embed/qrMorphRuntime.iife.js?raw';
import type { TargetShapeType } from './shapes';

export interface QrMorphEmbedOptions {
  text: string;
  shape: TargetShapeType;
  themeId: string;
  height?: number;
  season?: string;
  timeOfDay?: string;
  islandMode?: string;
  gardenMode?: string;
  eqMode?: string;
  cakeFlavor?: string;
  castleMode?: string;
  license?: { id: string; domain: string };
}

export function generateQrMorphEmbedCode(o: QrMorphEmbedOptions): string {
  const id = 'gridika-qr-' + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 480;
  const url = o.text || 'https://gridika.ru';

  const badgeHtml = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;bottom:14px;right:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:700;color:#8BF0C2;text-decoration:none;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;border:1px solid rgba(25,195,125,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.2);">Gridika.ru ↗</a>`;

  const header = o.license
    ? codeHeader('3D интерактивный QR-код', o.license)
    : '<!-- Gridika · 3D интерактивный QR-код -->';

  const licenseJs = o.license ? domainLockJs(`${id}-badge`, o.license.domain) : '';

  const opts = {
    url,
    shape: o.shape || 'tree',
    themeId: o.themeId || 'velvet-emerald',
    season: o.season,
    timeOfDay: o.timeOfDay,
    islandMode: o.islandMode,
    gardenMode: o.gardenMode,
    eqMode: o.eqMode,
    cakeFlavor: o.cakeFlavor,
    castleMode: o.castleMode,
    initialState: 'morphed',
  };

  return `${header}
<div id="${id}" style="width:100%;max-width:520px;height:${height}px;margin:0 auto;position:relative;border-radius:18px;overflow:hidden;background:#0c1f17;box-shadow:0 14px 36px rgba(0,0,0,0.45);">
  <div style="position:absolute;top:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;color:#19C37D;letter-spacing:0.05em;background:rgba(12,31,23,0.85);backdrop-filter:blur(6px);padding:4px 10px;border-radius:8px;border:1px solid rgba(25,195,125,0.25);pointer-events:none;">GRIDIKA 3D · ИНТЕРАКТИВНЫЙ QR</div>
  <div style="position:absolute;bottom:14px;left:16px;z-index:10;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);padding:5px 12px;border-radius:8px;pointer-events:none;">Кликните для переключения в QR</div>
  ${badgeHtml}
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function() {
  function start() {
    ${runtimeSource}
    if (typeof GridikaQrMorphModule !== 'undefined' && GridikaQrMorphModule.initQrMorphWidget) {
      GridikaQrMorphModule.initQrMorphWidget("${id}", ${JSON.stringify(opts)});
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

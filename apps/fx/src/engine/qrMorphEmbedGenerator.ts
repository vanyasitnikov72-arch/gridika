import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/qrMorphRuntime.iife.js?raw';
import type { TargetShapeType } from './shapes';

export interface QrMorphEmbedOptions {
  text: string;
  shape: TargetShapeType;
  themeId: string;
  height?: number;
  maxWidth?: number;
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
  const maxW = o.maxWidth ?? 480;
  const url = o.text || 'https://gridika.ru';

  const header = o.license
    ? codeHeader('3D интерактивный QR-код', o.license)
    : '<!-- Gridika · 3D интерактивный QR-код -->';

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
<div id="${id}" style="width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;position:relative;background:transparent;user-select:none;-webkit-user-select:none;"></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script>
(function() {
  function start() {
    ${runtimeSource}
    if (typeof GridikaQrMorphModule !== 'undefined' && GridikaQrMorphModule.initQrMorphWidget) {
      GridikaQrMorphModule.initQrMorphWidget("${id}", ${JSON.stringify(opts)});
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
}

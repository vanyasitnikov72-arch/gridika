// The gift runtime is plain JS, so its source is pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/giftRuntime.js?raw';
import { buildGiftData, type GiftMode, type GiftSettings } from './giftScene';

/**
 * Site snippet for 03 · Подарок с промокодом (Tilda T123, WordPress, Webflow, Wix, plain HTML).
 * The reward is precomputed as cubes; three.js comes from a public CDN (jsDelivr, unpkg fallback).
 */

export interface GiftEmbedOptions {
  settings: GiftSettings;
  mode: GiftMode;
  height?: number;
  maxWidth?: number;
  license: { id: string; domain: string };
}

const THREE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js',
  'https://unpkg.com/three@0.174.0/build/three.module.min.js',
];

const BS = String.fromCharCode(92);
const LS = new RegExp(String.fromCharCode(0x2028), 'g');
const PS = new RegExp(String.fromCharCode(0x2029), 'g');
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, BS + 'u003c').replace(LS, BS + 'u2028').replace(PS, BS + 'u2029');

export function generateGiftEmbedCode(o: GiftEmbedOptions): string {
  const id = 'gridika-gift-' + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 520;
  const maxW = o.maxWidth ?? 560;
  const d = buildGiftData(o.settings);
  const data = { reward: d.reward, code: d.code, url: d.url, caption: d.caption, trigger: d.trigger, shape: d.shape, pattern: d.pattern };
  const runtime = runtimeSource.replace(/^export /gm, '');

  return `${codeHeader('подарок с промокодом', o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;"></div>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap">
<script type="module">
var GRIDIKA = ${safeJson({ data, mode: o.mode })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createGiftViewer(THREE, el, { data: GRIDIKA.data, mode: GRIDIKA.mode });
})();
</script>`;
}

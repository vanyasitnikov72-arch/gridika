// The card runtime is plain JS, so its source can be pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/cardRuntime.js?raw';
import { buildCardData, type CardMode, type CardStyle } from './cardScene';
import type { CardContact } from './vcard';
import { domainLockJs } from './domainLock';

/**
 * Tilda T123 snippet for 02 · Визитка с QR.
 * Self-contained: card data and the QR are precomputed here, the 3D runtime is inlined,
 * three.js comes from a public CDN (jsDelivr, unpkg as the fallback). Nothing hits Gridika servers.
 */

export interface CardEmbedOptions {
  contact: CardContact;
  mode: CardMode;
  style: CardStyle;
  /** small PNG data URL (see logoToDataUrl) */
  logo?: string | null;
  height?: number;
  license?: { id: string; domain: string };
}

const THREE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js',
  'https://unpkg.com/three@0.174.0/build/three.module.min.js',
];

/** JSON that is safe inside <script> */
const LS = new RegExp(String.fromCharCode(0x2028), 'g');
const PS = new RegExp(String.fromCharCode(0x2029), 'g');
const BS = String.fromCharCode(92); // a backslash, spelled out
const safeJson = (v: unknown) =>
  JSON.stringify(v).replace(/</g, BS + 'u003c').replace(LS, BS + 'u2028').replace(PS, BS + 'u2029');

/** Downscale the uploaded logo so it does not bloat the snippet. */
export function logoToDataUrl(img: HTMLImageElement | null, max = 256): string | null {
  if (!img || !img.width) return null;
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k);
  c.height = Math.round(img.height * k);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/png');
}

export function generateCardEmbedCode(o: CardEmbedOptions): string {
  const id = 'gridika-card-' + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? 560;
  const data = buildCardData(o.contact);
  const payload = {
    card: { contact: data.contact, siteLabel: data.siteLabel, links: data.links, qr: data.qr },
    mode: o.mode,
    style: o.style,
    logo: o.logo ?? null,
  };

  const header = o.license
    ? codeHeader('визитка с QR', o.license)
    : `<!-- Gridika: 3D-визитка с QR -->`;

  // the badge always ships; with a license it is removed only on the licensed domain
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:12px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const lock = o.license
    ? domainLockJs(`${id}-badge`, o.license.domain)
    : '';

  const runtime = runtimeSource.replace(/^export /gm, '');

  return `${header}
<div id="${id}" style="position:relative;width:100%;max-width:440px;height:${height}px;margin:0 auto;">${badge}</div>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap">
<script type="module">${lock}
var GRIDIKA = ${safeJson(payload)};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  var logo = null;
  if (GRIDIKA.logo) logo = await new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = GRIDIKA.logo; });
  el.__gridika = createCardViewer(THREE, el, { data: GRIDIKA.card, mode: GRIDIKA.mode, style: GRIDIKA.style, logo: logo });
})();
</script>`;
}

// The morph runtime is plain JS, so its source is pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/morphRuntime.js?raw';
import type { MorphData } from './morphScene';
import { domainLockJs } from './domainLock';

/**
 * Site snippet for 05 · Морф «до / после» (Tilda T123, WordPress, Webflow, Wix, plain HTML).
 * Both pictures travel as colour grids; three.js comes from a public CDN (jsDelivr, unpkg fallback).
 * The block keeps the pictures' proportions (aspect-ratio) and stretches to the column width.
 */

export interface MorphEmbedOptions {
  data: MorphData;
  license: { id: string; domain: string };
  maxWidth?: number;
}

const THREE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js',
  'https://unpkg.com/three@0.174.0/build/three.module.min.js',
];

const BS = String.fromCharCode(92);
const LS = new RegExp(String.fromCharCode(0x2028), 'g');
const PS = new RegExp(String.fromCharCode(0x2029), 'g');
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, BS + 'u003c').replace(LS, BS + 'u2028').replace(PS, BS + 'u2029');

/** rough block height on a 760 px wide column, for the install hint */
export function morphEmbedHeight(d: { w: number; h: number }, maxWidth = 760): number {
  return Math.round((maxWidth * d.h) / d.w);
}

export function generateMorphEmbedCode(o: MorphEmbedOptions): string {
  const id = 'gridika-morph-' + Math.random().toString(36).slice(2, 8);
  const maxW = o.maxWidth ?? 760;
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:12px;bottom:52px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = runtimeSource.replace(/^export /gm, '');

  return `${codeHeader('морф «до / после»', o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;aspect-ratio:${o.data.w}/${o.data.h};margin:0 auto;border-radius:18px;overflow:hidden;">${badge}</div>
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
var GRIDIKA = ${safeJson({ data: o.data })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createMorphViewer(THREE, el, { data: GRIDIKA.data });
})();
</script>`;
}

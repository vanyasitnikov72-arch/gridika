// The logo runtime is plain JS, so its source is pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/logoRuntime.js?raw';
import type { LogoData, LogoMode } from './logoScene';

/**
 * Site snippet for 04 · 3D-логотип (Tilda T123, WordPress, Webflow, Wix, plain HTML).
 * The logo travels as a colour grid; three.js comes from a public CDN (jsDelivr, unpkg fallback).
 * Transparent background (neon adds a soft aura in the logo colour), so it sits on top of any first screen.
 */

export interface LogoEmbedOptions {
  data: LogoData;
  mode: LogoMode;
  height?: number;
  maxWidth?: number;
  license: { id: string; domain: string };
}

export const LOGO_EMBED_HEIGHT = 420;

const THREE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js',
  'https://unpkg.com/three@0.174.0/build/three.module.min.js',
];

const BS = String.fromCharCode(92);
const LS = new RegExp(String.fromCharCode(0x2028), 'g');
const PS = new RegExp(String.fromCharCode(0x2029), 'g');
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, BS + 'u003c').replace(LS, BS + 'u2028').replace(PS, BS + 'u2029');

export function generateLogoEmbedCode(o: LogoEmbedOptions): string {
  const id = 'gridika-logo-' + Math.random().toString(36).slice(2, 8);
  const height = o.height ?? LOGO_EMBED_HEIGHT;
  const maxW = o.maxWidth ?? 480;
  const runtime = runtimeSource.replace(/^export /gm, '');

  return `${codeHeader('3D-логотип из вокселей', o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;height:${height}px;margin:0 auto;"></div>
<script type="module">
var GRIDIKA = ${safeJson({ data: o.data, mode: o.mode })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createLogoViewer(THREE, el, { data: GRIDIKA.data, mode: GRIDIKA.mode });
})();
</script>`;
}

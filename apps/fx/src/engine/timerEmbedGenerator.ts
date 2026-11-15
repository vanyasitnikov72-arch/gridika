// The timer runtime is plain JS, so its source is pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/timerRuntime.js?raw';
import type { TimerData } from './timerScene';

/**
 * Site snippet for 06 · Таймер акции (Tilda T123, WordPress, Webflow, Wix, plain HTML).
 * The end moment is absolute (UTC), so the countdown is the same for every visitor.
 * Transparent background; the title and the button are plain HTML inside the block.
 */

export interface TimerEmbedOptions {
  data: TimerData;
  license: { id: string; domain: string };
  maxWidth?: number;
}

/** rough block height on a 320 px column, for the install hint */
export function timerEmbedHeight(d: Pick<TimerData, 'format' | 'title' | 'button'>, maxWidth = 320): number {
  return Math.round(maxWidth / (d.format === 'dhms' ? 1.08 : 2.2)) + (d.title ? 40 : 0) + (d.button ? 70 : 0);
}

const THREE_URLS = [
  'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.min.js',
  'https://unpkg.com/three@0.174.0/build/three.module.min.js',
];

const BS = String.fromCharCode(92);
const LS = new RegExp(String.fromCharCode(0x2028), 'g');
const PS = new RegExp(String.fromCharCode(0x2029), 'g');
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, BS + 'u003c').replace(LS, BS + 'u2028').replace(PS, BS + 'u2029');

export function generateTimerEmbedCode(o: TimerEmbedOptions): string {
  const id = 'gridika-timer-' + Math.random().toString(36).slice(2, 8);
  const maxW = o.maxWidth ?? 320;
  const runtime = runtimeSource.replace(/^export /gm, '');
  const ends = o.data.personal
    ? `личный, ${o.data.personal} ч с первого визита`
    : `до ${new Date(o.data.end).toISOString().replace('T', ' ').slice(0, 16)} UTC`;

  return `${codeHeader(`таймер акции · ${ends}`, o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:${maxW}px;margin:0 auto;"></div>
<script type="module">
var GRIDIKA = ${safeJson({ data: o.data })};
${runtime}
(async function () {
  var el = document.getElementById("${id}");
  var THREE = null, urls = ${JSON.stringify(THREE_URLS)};
  for (var i = 0; i < urls.length && !THREE; i++) { try { THREE = await import(urls[i]); } catch (e) {} }
  if (!THREE || !el) return;
  el.__gridika = createTimerViewer(THREE, el, { data: GRIDIKA.data });
})();
</script>`;
}

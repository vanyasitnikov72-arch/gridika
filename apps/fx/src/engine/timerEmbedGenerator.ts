// The timer runtime is plain JS, so its source is pasted into the snippet as is.
import { codeHeader } from './codeNotice';
import runtimeSource from '../embed/timerRuntime.js?raw';
import type { TimerData } from './timerScene';
import { domainLockJs } from './domainLock';

/**
 * Site snippet for 06 · Таймер акции (Tilda T123, WordPress, Webflow, Wix, plain HTML).
 * The end moment is absolute (UTC), so the countdown is the same for every visitor.
 * Transparent background; the title and the button are plain HTML inside the block.
 */

export interface TimerEmbedOptions {
  data: TimerData;
  license: { id: string; domain: string };
}

/** rough block height on a 900 px column, for the install hint */
export function timerEmbedHeight(d: Pick<TimerData, 'format' | 'title' | 'button'>): number {
  return Math.round(900 / (d.format === 'dhms' ? 2.7 : 2.2)) + (d.title ? 40 : 0) + (d.button ? 70 : 0);
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
  const badge = `<a id="${id}-badge" href="https://gridika.ru" target="_blank" rel="noopener" style="position:absolute;right:8px;top:8px;z-index:5;font:600 11px system-ui,-apple-system,sans-serif;color:#64748b;text-decoration:none;background:rgba(255,255,255,0.85);padding:4px 9px;border-radius:6px;border:1px solid rgba(0,0,0,0.08)">Gridika</a>`;
  const runtime = runtimeSource.replace(/^export /gm, '');
  const ends = o.data.personal
    ? `личный, ${o.data.personal} ч с первого визита`
    : `до ${new Date(o.data.end).toISOString().replace('T', ' ').slice(0, 16)} UTC`;

  return `${codeHeader(`таймер акции · ${ends}`, o.license)}
<div id="${id}" style="position:relative;width:100%;max-width:900px;margin:0 auto;">${badge}</div>
<script type="module">${domainLockJs(`${id}-badge`, o.license.domain)}
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

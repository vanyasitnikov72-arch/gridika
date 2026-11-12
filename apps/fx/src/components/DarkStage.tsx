import { useEffect, useRef, useState } from 'preact/hooks';

/**
 * Dark preview behind the studio stage (desktop): one shape that fills the space next to the
 * product wave right under it (the wave colour glows into the dark), with a soft rounded right edge.
 * Built in card pixels, so it fits however the card is stretched.
 *
 * Turning it on, the dark flows out from under the wave like a liquid: the middle runs ahead as a
 * tongue, the top and bottom follow, a soft ripple travels along the front. Turning it off, it
 * flows back under the wave.
 */

const IN_MS = 950;
const OUT_MS = 700;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Geo {
  w: number;
  h: number;
  /** where the dark rests (right edge) and where it starts from (inside the wave) */
  R: number;
  S: number;
  t: string;
}

/** the dark shape for a given progress (0 = hidden under the wave, 1 = in place) */
function shape(g: Geo, p: number, opening: boolean): string {
  const { h, R, S } = g;
  // the middle leads, the corners follow
  const mid = S + (R - S) * (opening ? easeOut(clamp01(p * 1.18)) : easeInOut(p));
  const ends = S + (R - S) * (opening ? easeOut(clamp01(p * 1.18 - 0.18)) : easeInOut(clamp01(p * 1.1 - 0.1)));
  // a ripple along the front while it moves, gone at rest
  const swell = Math.sin(Math.PI * p) * 46;
  const r = Math.max(6, Math.min(46, ends - S));
  const B = h;
  return [
    `M -40 0`,
    `L ${ends - r} 0`,
    `C ${ends - r * 0.35} 0 ${ends} ${r * 0.35} ${ends} ${r}`,
    `C ${mid + 16 + swell} ${h * 0.34} ${mid - 14 + swell * 0.35} ${h * 0.62} ${ends} ${B - r}`,
    `C ${ends} ${B - r * 0.35} ${ends - r * 0.35} ${B} ${ends - r} ${B}`,
    `L -40 ${B} Z`,
  ].join(' ');
}

export function DarkStage({
  show,
  cardRef,
  waveRef,
  stageRef,
  wavePath,
  waveBox,
}: {
  show: boolean;
  cardRef: { current: HTMLElement | null };
  waveRef: { current: SVGSVGElement | null };
  stageRef: { current: HTMLElement | null };
  wavePath: string;
  waveBox: { w: number; h: number };
}) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [p, setP] = useState(show ? 1 : 0);
  const pRef = useRef(p);
  pRef.current = p;
  const opening = useRef(show);

  useEffect(() => {
    const card = cardRef.current, wave = waveRef.current, stage = stageRef.current;
    if (!card || !wave || !stage) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      if (!desktop.matches) return setGeo(null);
      const cr = card.getBoundingClientRect(), wr = wave.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      if (!cr.width || !wr.width) return;
      setGeo({
        w: cr.width,
        h: cr.height,
        R: Math.min(cr.width - 8, sr.right - cr.left + 10),
        // the deepest point of the wave's right edge: the dark hides there when off
        S: wr.left - cr.left + wr.width * 0.6,
        t: `translate(${wr.left - cr.left} ${wr.top - cr.top}) scale(${wr.width / waveBox.w} ${wr.height / waveBox.h})`,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(card);
    ro.observe(wave);
    ro.observe(stage);
    desktop.addEventListener('change', update);
    return () => {
      ro.disconnect();
      desktop.removeEventListener('change', update);
    };
  }, []);

  // flow in / out from wherever it is now
  useEffect(() => {
    opening.current = show;
    const from = pRef.current, to = show ? 1 : 0;
    if (from === to) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setP(to);
    const dur = (show ? IN_MS : OUT_MS) * Math.abs(to - from);
    const t0 = performance.now();
    let raf = 0;
    const step = () => {
      const k = clamp01((performance.now() - t0) / dur);
      setP(from + (to - from) * k);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [show]);

  if (!geo || p <= 0) return null;
  const d = shape(geo, p, opening.current);
  return (
    <svg
      className="hidden lg:block absolute inset-0 pointer-events-none z-0"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      style={{ opacity: Math.min(1, p * 2.2) }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="dark-stage-fill" gradientUnits="userSpaceOnUse" cx={geo.w * 0.42} cy={geo.h * 0.45} r={Math.max(geo.w, geo.h) * 0.55}>
          <stop offset="0%" stop-color="#241d36" />
          <stop offset="100%" stop-color="#121017" />
        </radialGradient>
        <clipPath id="dark-stage-clip">
          <path d={d} />
        </clipPath>
        <filter id="dark-stage-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      {/* the dark runs right under the wave, no gap */}
      <path d={d} fill="url(#dark-stage-fill)" />
      {/* where the two meet: a blurred, widened copy of the wave in its own colours,
          so right at the edge the colour matches the wave and then melts into the dark */}
      <g clip-path="url(#dark-stage-clip)" filter="url(#dark-stage-glow)">
        <path
          d={wavePath}
          transform={geo.t}
          fill="url(#jadeGradient)"
          stroke="url(#jadeGradient)"
          stroke-width="50"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

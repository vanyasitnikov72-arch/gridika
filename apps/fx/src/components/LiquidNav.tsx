import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { Product, ProductId } from '../data/products';

/**
 * Product list on the studio wave. The selection is a smooth liquid drop that rests still.
 * On a switch it behaves like water: gathers into a narrow drop at the old item,
 * flows (stretched into a teardrop, with a trailing bead merged by a goo filter)
 * to the new item and spreads out there with a slight overshoot.
 */

type Rect = { x: number; y: number; w: number; h: number };

const DURATION = 560;

export function LiquidNav({
  items,
  activeId,
  onSelect,
}: {
  items: Product[];
  activeId: ProductId;
  onSelect: (id: ProductId) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropRef = useRef<HTMLSpanElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const prevRect = useRef<Rect | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vertical, setVertical] = useState(true);

  const measure = (id: ProductId): Rect | null => {
    const btn = btnRefs.current[id];
    if (!btn) return null;
    return { x: btn.offsetLeft, y: btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight };
  };

  // follow the active item; animate the flow from the previous one
  useLayoutEffect(() => {
    const nav = navRef.current;
    const to = measure(activeId);
    if (!nav || !to) return;
    const isVertical = getComputedStyle(nav).flexDirection === 'column';
    setVertical(isVertical);
    setRect(to);
    const from = prevRect.current;
    prevRect.current = to;
    if (!from || (from.x === to.x && from.y === to.y)) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) flow(from, to, isVertical);

    // horizontal list (mobile): bring the item into view inside the list only
    if (!isVertical) {
      const target = to.x - (nav.clientWidth - to.w) / 2;
      nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
  }, [activeId]);

  // keep the drop on its item when the layout changes (no animation)
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => {
      const r = measure(activeId);
      if (!r) return;
      prevRect.current = r;
      setRect(r);
      setVertical(getComputedStyle(nav).flexDirection === 'column');
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, [activeId]);

  function flow(a: Rect, b: Rect, isVertical: boolean) {
    const drop = dropRef.current, bead = beadRef.current, bar = barRef.current;
    if (!drop || !bead) return;
    const ca = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const cb = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const h = Math.min(a.h, b.h);
    // a shape centred at c; "across" is its size across the travel direction, "along" along it
    const at = (c: { x: number; y: number }, across: number, along: number): Keyframe => {
      const w = isVertical ? across : along;
      const hh = isVertical ? along : across;
      return { left: `${c.x - w / 2}px`, top: `${c.y - hh / 2}px`, width: `${w}px`, height: `${hh}px` };
    };
    const box = (r: Rect): Keyframe => ({ left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
    const mid = { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 };
    const dist = Math.hypot(cb.x - ca.x, cb.y - ca.y);
    const stretch = Math.min(h * 0.9, dist * 0.35); // teardrop elongation while moving
    const spreadB = isVertical ? b.w : b.h;
    const thinB = isVertical ? b.h : b.w;

    drop.animate(
      [
        { ...box(a), easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        // gathers in on itself at the old item: a narrow drop
        { ...at(ca, h * 1.25, h * 0.86), offset: 0.26, easing: 'cubic-bezier(0.5, 0, 0.5, 1)' },
        // flows: thinner across, stretched along the way
        { ...at(mid, h * 0.72, h * 0.9 + stretch), offset: 0.5, easing: 'cubic-bezier(0.5, 0, 0.5, 1)' },
        // arrives as a drop
        { ...at(cb, h * 1.25, h * 0.9), offset: 0.7, easing: 'cubic-bezier(0.2, 0, 0.2, 1)' },
        // spreads out, a touch past the item, then settles
        { ...at(cb, spreadB * 1.04, thinB * 1.04), offset: 0.88, easing: 'cubic-bezier(0.4, 0, 0.3, 1)' },
        box(b),
      ],
      { duration: DURATION },
    );

    // trailing bead lags behind the drop; the goo filter merges them into a teardrop
    const d = h * 0.62;
    const dot = (c: { x: number; y: number }, s: number, o: number, offset?: number): Keyframe => ({
      left: `${c.x - (d * s) / 2}px`,
      top: `${c.y - (d * s) / 2}px`,
      width: `${d * s}px`,
      height: `${d * s}px`,
      opacity: o,
      ...(offset !== undefined ? { offset } : {}),
    });
    const lerp = (t: number) => ({ x: ca.x + (cb.x - ca.x) * t, y: ca.y + (cb.y - ca.y) * t });
    const e = 'cubic-bezier(0.5, 0, 0.5, 1)';
    bead.animate(
      [
        { ...dot(ca, 0.6, 0), easing: e },
        { ...dot(ca, 1, 1, 0.28), easing: e },
        // always a step behind the drop's centre
        { ...dot(lerp(0.22), 0.9, 1, 0.52), easing: e },
        { ...dot(lerp(0.78), 0.7, 1, 0.72), easing: e },
        { ...dot(cb, 0.45, 1, 0.84), easing: e },
        dot(cb, 0.2, 0),
      ],
      { duration: DURATION },
    );

    // the side bar shrinks away, travels and grows back with the drop
    if (bar && isVertical) {
      bar.animate(
        [
          { top: `${a.y + 8}px`, height: `${a.h - 16}px`, opacity: 1 },
          { top: `${a.y + a.h / 2}px`, height: '0px', opacity: 0, offset: 0.25 },
          { top: `${b.y + b.h / 2}px`, height: '0px', opacity: 0, offset: 0.75 },
          { top: `${b.y + 8}px`, height: `${b.h - 16}px`, opacity: 1 },
        ],
        { duration: DURATION, easing: 'ease-in-out' },
      );
    }
  }

  return (
    <nav
      ref={navRef}
      aria-label="Продукты Gridika"
      className="relative mt-5 lg:mt-7 lg:mb-8 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="vx-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>

      {/* liquid layer: opaque shapes merged by the goo filter, faded as a whole */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'url(#vx-goo)', opacity: 0.18, width: navRef.current ? `${navRef.current.scrollWidth}px` : undefined }}
      >
        <span ref={beadRef} className="absolute rounded-full bg-[var(--vx-on)]" style={{ opacity: 0, left: 0, top: 0, width: 0, height: 0 }} />
        <span
          ref={dropRef}
          className="absolute rounded-full bg-[var(--vx-on)]"
          style={rect ? { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` } : { opacity: 0 }}
        />
      </div>

      {/* accent bar on the left of the selected item (desktop list) */}
      <span
        ref={barRef}
        aria-hidden="true"
        className="absolute -left-0.5 w-1 rounded-full bg-[var(--vx-on)] pointer-events-none"
        style={rect && vertical ? { top: `${rect.y + 8}px`, height: `${rect.h - 16}px` } : { opacity: 0 }}
      />

      {items.map((prod) => {
        const on = prod.id === activeId;
        return (
          <button
            key={prod.id}
            ref={(el) => {
              btnRefs.current[prod.id] = el;
            }}
            type="button"
            aria-current={on ? 'true' : undefined}
            onClick={() => onSelect(prod.id)}
            className={`relative shrink-0 flex items-center gap-2.5 rounded-full lg:rounded-xl px-3 lg:px-2.5 py-1.5 text-[14px] font-extrabold text-left whitespace-nowrap transition-opacity duration-200 cursor-pointer outline-none focus-visible:bg-[color-mix(in_srgb,var(--vx-on)_10%,transparent)] ${
              on ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <span className="font-mono text-[10px] opacity-60">{prod.number}</span>
            <span>{prod.label}</span>
            {!prod.ready && <span className="text-[9px] font-black uppercase tracking-wider opacity-50">скоро</span>}
          </button>
        );
      })}
    </nav>
  );
}

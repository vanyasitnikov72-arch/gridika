import * as THREE from 'three';
// @ts-ignore — plain JS runtime shared with the site snippet
import { createLogoViewer, decodeLogoGrid, LOGO_MODES } from '../embed/logoRuntime.js';

/**
 * 04 · 3D-логотип. The image is turned into a small colour grid once, here in the studio:
 * trim the empty margins, sample each cell (4×4 sub-pixels), drop the background of opaque images,
 * then reduce the colours to a short palette. The grid travels to the snippet (and in the purchase
 * link) as a run-length string, so the site needs no image at all.
 */

export type LogoMode = 'gloss' | 'matte' | 'chrome' | 'pearl' | 'toon' | 'neon';
export type LogoMotion = 'spin' | 'sway' | 'still';
export { LOGO_MODES };

export interface LogoSettings {
  /** cubes along the longer side */
  res: number;
  /** thickness in cubes */
  depth: number;
  motion: LogoMotion;
  colors: 'logo' | 'mono';
  mono: string;
}

export interface LogoData {
  w: number;
  h: number;
  palette: string[];
  rle: string;
  depth: number;
  motion: LogoMotion;
}

/** the logo as cells with palette indices, before the look settings are applied */
export interface LogoBase {
  w: number;
  h: number;
  /** -1 = empty, otherwise palette index */
  idx: Int16Array;
  palette: string[];
}

export const LOGO_RES = { min: 20, max: 64 };

// a demo mark: three rounded bars and a sun, transparent background
export const DEMO_LOGO_SVG =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 200 200">` +
      `<rect x="18" y="74" width="40" height="108" rx="20" fill="#5b3df5"/>` +
      `<rect x="80" y="30" width="40" height="152" rx="20" fill="#8b5cf6"/>` +
      `<rect x="142" y="104" width="40" height="78" rx="20" fill="#c4b5fd"/>` +
      `<circle cx="162" cy="58" r="22" fill="#ffb547"/>` +
      `</svg>`,
  );

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const dist2 = (a: number[], b: number[]) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не получилось открыть картинку'));
    img.src = src;
  });
}

/** Image (data URL / URL) → grid of `res` cubes along the longer side. */
export async function rasterizeLogo(src: string, res: number): Promise<LogoBase> {
  const img = await loadImage(src);
  // SVG without a size reports 0 or 150: draw it big enough
  const iw = img.naturalWidth > 150 ? img.naturalWidth : 600;
  const ih = img.naturalHeight > 150 ? img.naturalHeight : Math.round(600 * ((img.naturalHeight || 1) / (img.naturalWidth || 1)));
  const k = Math.min(1, 900 / Math.max(iw, ih));
  const W = Math.max(1, Math.round(iw * k)), H = Math.max(1, Math.round(ih * k));
  const big = document.createElement('canvas');
  big.width = W;
  big.height = H;
  const bctx = big.getContext('2d', { willReadFrequently: true })!;
  bctx.drawImage(img, 0, 0, W, H);
  const px = bctx.getImageData(0, 0, W, H).data;

  // opaque picture (JPG, PNG on white)? then the background is the colour of the corners
  const at = (x: number, y: number) => {
    const o = (y * W + x) * 4;
    return [px[o], px[o + 1], px[o + 2], px[o + 3]];
  };
  const corners = [at(0, 0), at(W - 1, 0), at(0, H - 1), at(W - 1, H - 1)];
  const opaque = corners.every((c) => c[3] > 240) && corners.every((c) => dist2(c, corners[0]) < 30 * 30);
  const bg = opaque ? corners[0] : null;
  const solid = (o: number) => px[o + 3] > 110 && (!bg || dist2([px[o], px[o + 1], px[o + 2]], bg) > 46 * 46);

  // trim the empty margins
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (solid((y * W + x) * 4)) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) throw new Error('На картинке не нашлось логотипа');
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
  const w = bw >= bh ? res : Math.max(2, Math.round((res * bw) / bh));
  const h = bh >= bw ? res : Math.max(2, Math.round((res * bh) / bw));

  // each cell: share of solid sub-pixels and their average colour
  const cells: (number[] | null)[] = new Array(w * h).fill(null);
  const S = 4;
  for (let cy = 0; cy < h; cy++)
    for (let cx = 0; cx < w; cx++) {
      let n = 0, r = 0, g = 0, b = 0;
      for (let sy = 0; sy < S; sy++)
        for (let sx = 0; sx < S; sx++) {
          const x = Math.min(x1, x0 + Math.floor(((cx + (sx + 0.5) / S) * bw) / w));
          const y = Math.min(y1, y0 + Math.floor(((cy + (sy + 0.5) / S) * bh) / h));
          const o = (y * W + x) * 4;
          if (solid(o)) {
            n++;
            r += px[o];
            g += px[o + 1];
            b += px[o + 2];
          }
        }
      if (n / (S * S) >= 0.42) cells[cy * w + cx] = [r / n, g / n, b / n];
    }

  return { w, h, ...quantize(cells, bg ? bg.slice(0, 3) : null) };
}

/** A short palette: merge close colours, fold rare ones (edge blends) into their neighbours. */
function quantize(cells: (number[] | null)[], bg: number[] | null): { idx: Int16Array; palette: string[] } {
  const filled = cells.filter(Boolean) as number[][];
  const buckets = new Map<string, { c: number[]; n: number }>();
  for (const c of filled) {
    const k = c.map((v) => Math.round(v / 12)).join(',');
    const e = buckets.get(k);
    if (e) {
      e.n++;
      e.c = e.c.map((v, i) => v + (c[i] - v) / e.n);
    } else buckets.set(k, { c: [...c], n: 1 });
  }
  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  const centers: { c: number[]; n: number }[] = [];
  for (const s of sorted) {
    const near = centers.find((x) => dist2(x.c, s.c) < 42 * 42);
    if (near) {
      const t = s.n / (near.n + s.n);
      near.c = near.c.map((v, i) => v + (s.c[i] - v) * t);
      near.n += s.n;
    } else if (centers.length < 10) centers.push({ c: [...s.c], n: s.n });
    else {
      let best = centers[0];
      for (const x of centers) if (dist2(x.c, s.c) < dist2(best.c, s.c)) best = x;
      best.n += s.n;
    }
  }
  // tiny clusters are usually anti-aliasing between two colours
  const total = filled.length || 1;
  let kept = centers.filter((x) => x.n / total >= 0.015).sort((a, b) => b.n - a.n);
  // a colour lying between a bigger colour and the background (or another bigger colour) is an edge blend
  const ends = (x: { c: number[]; n: number }) => kept.filter((y) => y !== x && y.n > x.n * 1.5).map((y) => y.c).concat(bg ? [bg] : []);
  const nearSegment = (p: number[], a: number[], b: number[]) => {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
    const L = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2 || 1;
    const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / L));
    return t > 0.08 && t < 0.92 && dist2(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]) < 26 * 26;
  };
  for (const x of [...kept].sort((a, b) => a.n - b.n)) {
    if (x === kept[0] || x.n / total > 0.2) continue;
    const big = kept.filter((y) => y !== x && y.n > x.n * 1.5);
    const e = ends(x);
    const owner = big.find((a) => e.some((b) => b !== a.c && nearSegment(x.c, a.c, b)));
    if (owner) {
      owner.n += x.n;
      kept = kept.filter((y) => y !== x);
    }
  }
  const pal = (kept.length ? kept : centers).sort((a, b) => b.n - a.n);
  const idx = new Int16Array(cells.length).fill(-1);
  cells.forEach((c, i) => {
    if (!c) return;
    let bi = 0;
    for (let j = 1; j < pal.length; j++) if (dist2(pal[j].c, c) < dist2(pal[bi].c, c)) bi = j;
    idx[i] = bi;
  });
  return { idx, palette: pal.map((x) => hex(x.c[0], x.c[1], x.c[2])) };
}

function encodeRle(idx: Int16Array): string {
  let out = '';
  for (let i = 0; i < idx.length; ) {
    const v = idx[i];
    let n = 1;
    while (i + n < idx.length && idx[i + n] === v) n++;
    out += (n > 1 ? n : '') + (v < 0 ? '.' : String.fromCharCode(97 + v));
    i += n;
  }
  return out;
}

export function buildLogoData(base: LogoBase, s: LogoSettings): LogoData {
  const mono = s.colors === 'mono';
  const idx = mono ? base.idx.map((v) => (v < 0 ? -1 : 0)) : base.idx;
  return {
    w: base.w,
    h: base.h,
    palette: mono ? [s.mono] : base.palette,
    rle: encodeRle(idx as Int16Array),
    depth: s.depth,
    motion: s.motion,
  };
}

/** back from a saved grid (purchase link): the original colours are kept */
export function baseFromData(d: LogoData): LogoBase {
  return { w: d.w, h: d.h, idx: decodeLogoGrid(d), palette: d.palette };
}

interface RuntimeApi {
  setData(d: LogoData): void;
  setMode(m: LogoMode): void;
  replay(): void;
  burst(): void;
  setPaused(p: boolean): void;
  snapshot(): HTMLCanvasElement;
  settle(): void;
  count(): number;
  dispose(): void;
}

export class LogoViewer {
  private api: RuntimeApi;
  constructor(container: HTMLElement, data: LogoData, mode: LogoMode) {
    container.innerHTML = '';
    this.api = createLogoViewer(THREE, container, { data, mode }) as RuntimeApi;
  }
  setData(d: LogoData) {
    this.api.setData(d);
  }
  setMode(m: LogoMode) {
    this.api.setMode(m);
  }
  replay() {
    this.api.replay();
  }
  burst() {
    this.api.burst();
  }
  setPaused(p: boolean) {
    this.api.setPaused(p);
  }
  snapshot() {
    return this.api.snapshot();
  }
  settle() {
    this.api.settle();
  }
  count() {
    return this.api.count();
  }
  dispose() {
    this.api.dispose();
  }
}

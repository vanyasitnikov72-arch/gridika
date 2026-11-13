import * as THREE from 'three';
// @ts-ignore — plain JS runtime shared with the site snippet
import { createMorphViewer, MORPH_MODES } from '../embed/morphRuntime.js';

/**
 * 05 · Морф «до / после». Both pictures are cropped to one frame (the "before" picture's shape,
 * kept between 3:4 and 16:9) and sampled into colour grids of the same size, once, here in the
 * studio. The grids travel to the snippet (and in the purchase link) as RGB565 base64.
 */

export type MorphMode = 'wave' | 'burst' | 'pixel' | 'spiral' | 'rain' | 'mosaic';
export type MorphSpeed = 'slow' | 'normal' | 'fast';
export type MorphControl = 'slider' | 'scroll' | 'auto';
export { MORPH_MODES };

export function morphEmbedHeight(d: { w: number; h: number }, maxWidth = 760): number {
  const pixel = Math.min(18, Math.max(8, Math.floor(maxWidth / (d.w + 4))));
  return Math.round(d.h * pixel + 80);
}

export interface MorphSettings {
  /** cubes along the width */
  res: number;
  mode: MorphMode;
  control: MorphControl;
  labelA: string;
  labelB: string;
  speed: MorphSpeed;
  labelStyle: 'dark' | 'light';
  depth: 'flat' | 'deep';
}

export interface MorphData {
  w: number;
  h: number;
  a: string;
  b: string;
  labels: [string, string] | null;
  control: MorphControl;
  mode: MorphMode;
  speed?: MorphSpeed;
  labelStyle?: 'dark' | 'light';
  depth?: 'flat' | 'deep';
}

/** the two pictures as grids, before the settings are applied */
export interface MorphBase {
  w: number;
  h: number;
  a: string;
  b: string;
}

const ASPECT = { min: 3 / 4, max: 16 / 9 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не получилось открыть картинку'));
    img.src = src;
  });
}

/** picture → w×h grid (cropped to fill, like CSS object-fit: cover) → base64 RGB565 */
function sample(img: HTMLImageElement, w: number, h: number): string {
  const iw = img.naturalWidth || 600, ih = img.naturalHeight || 450;
  const k = Math.max(w / iw, h / ih);
  // draw big first, then shrink: the browser averages the pixels of each cell
  const S = 4;
  const big = document.createElement('canvas');
  big.width = w * S;
  big.height = h * S;
  const bctx = big.getContext('2d')!;
  bctx.imageSmoothingQuality = 'high';
  const dw = iw * k * S, dh = ih * k * S;
  bctx.drawImage(img, (w * S - dw) / 2, (h * S - dh) / 2, dw, dh);
  const small = document.createElement('canvas');
  small.width = w;
  small.height = h;
  const sctx = small.getContext('2d', { willReadFrequently: true })!;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(big, 0, 0, w, h);
  const px = sctx.getImageData(0, 0, w, h).data;
  let bin = '';
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], a = px[i * 4 + 3] / 255;
    // transparent parts sit on white
    const R = r * a + 255 * (1 - a), G = g * a + 255 * (1 - a), B = b * a + 255 * (1 - a);
    const v = (Math.round((R / 255) * 31) << 11) | (Math.round((G / 255) * 63) << 5) | Math.round((B / 255) * 31);
    bin += String.fromCharCode(v & 255, v >> 8);
  }
  return btoa(bin);
}

/** both pictures → grids of the same size, `res` cubes wide */
export async function sampleMorph(srcA: string, srcB: string, res: number): Promise<MorphBase> {
  const [a, b] = await Promise.all([loadImage(srcA), loadImage(srcB)]);
  const aspect = Math.min(ASPECT.max, Math.max(ASPECT.min, (a.naturalWidth || 4) / (a.naturalHeight || 3)));
  const w = res, h = Math.max(8, Math.round(res / aspect));
  return { w, h, a: sample(a, w, h), b: sample(b, w, h) };
}

export function buildMorphData(base: MorphBase, s: MorphSettings): MorphData {
  const la = s.labelA.trim(), lb = s.labelB.trim();
  return {
    w: base.w,
    h: base.h,
    a: base.a,
    b: base.b,
    labels: la || lb ? [la, lb] : null,
    control: s.control,
    mode: s.mode,
    speed: s.speed || 'normal',
    labelStyle: s.labelStyle || 'dark',
    depth: s.depth || 'flat',
  };
}

export function baseFromMorphData(d: MorphData): MorphBase {
  return { w: d.w, h: d.h, a: d.a, b: d.b };
}

// ---------- demo pair: a room before and after renovation, drawn in code ----------

function room(after: boolean): string {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 480;
  const x = c.getContext('2d')!;
  const rect = (col: string, a: number, b: number, w: number, h: number) => {
    x.fillStyle = col;
    x.fillRect(a, b, w, h);
  };
  const round = (col: string, a: number, b: number, w: number, h: number, r: number) => {
    x.fillStyle = col;
    x.beginPath();
    x.roundRect(a, b, w, h, r);
    x.fill();
  };
  if (!after) {
    rect('#a9a297', 0, 0, 640, 330); // dull wall
    for (let i = 0; i < 7; i++) rect('rgba(90,80,60,0.12)', 40 + i * 90, 30 + (i % 3) * 40, 50, 70); // stains
    rect('#8d8679', 0, 300, 640, 30); // dirty skirting
    rect('#5e4b38', 0, 330, 640, 150); // worn floor
    for (let i = 0; i < 6; i++) rect('#4a3a2b', 0, 352 + i * 22, 640, 3);
    rect('#77808a', 90, 70, 150, 130); // grey window
    rect('#5c636b', 160, 70, 8, 130);
    rect('#5c636b', 90, 132, 150, 8);
    rect('#3a3530', 412, 0, 4, 120); // bare bulb
    x.fillStyle = '#e8e2c8';
    x.beginPath();
    x.arc(414, 128, 12, 0, 7);
    x.fill();
    rect('#9a7b55', 380, 250, 130, 90); // cardboard boxes
    rect('#866a47', 470, 210, 90, 130);
    rect('#b49369', 380, 290, 130, 8);
    rect('#6e6a63', 60, 280, 120, 60); // old radiator
    for (let i = 0; i < 6; i++) rect('#57534d', 66 + i * 19, 284, 8, 52);
  } else {
    rect('#8fc1ad', 0, 0, 640, 230); // sage wall
    rect('#f4efe6', 0, 230, 640, 100); // white wainscot
    for (let i = 0; i < 16; i++) rect('#e6dfd2', i * 42, 230, 3, 100);
    rect('#c98f58', 0, 330, 640, 150); // warm wood floor
    for (let i = 0; i < 6; i++) rect('#b77d48', 0, 352 + i * 22, 640, 3);
    rect('#ffffff', 84, 54, 166, 150); // window with sky
    rect('#9fd6f7', 94, 64, 146, 130);
    rect('#ffffff', 163, 64, 8, 130);
    rect('#ffffff', 94, 125, 146, 8);
    x.fillStyle = '#ffffff';
    x.beginPath();
    x.ellipse(130, 95, 26, 10, 0, 0, 7);
    x.fill();
    round('#e8d3a2', 300, 360, 300, 70, 30); // rug
    round('#e0568a', 330, 250, 250, 90, 22); // pink sofa
    round('#c43f72', 330, 225, 250, 50, 20);
    round('#f2a541', 360, 236, 54, 40, 12); // cushions
    round('#ffffff', 498, 236, 54, 40, 12);
    rect('#2b2b33', 345, 338, 10, 22);
    rect('#2b2b33', 555, 338, 10, 22);
    rect('#ffffff', 400, 70, 110, 84); // framed picture
    rect('#f2a541', 410, 80, 90, 64);
    x.fillStyle = '#4a9b7f';
    x.beginPath();
    x.moveTo(410, 144);
    x.lineTo(450, 100);
    x.lineTo(500, 144);
    x.fill();
    rect('#2b2b33', 464, 0, 4, 90); // pendant lamp
    x.fillStyle = '#ffd36b';
    x.beginPath();
    x.moveTo(436, 120);
    x.lineTo(496, 120);
    x.lineTo(478, 90);
    x.lineTo(454, 90);
    x.fill();
    round('#d9cbb5', 70, 300, 70, 70, 10); // plant in a pot
    x.fillStyle = '#3f8f5f';
    for (let i = 0; i < 6; i++) {
      x.beginPath();
      x.ellipse(105 + Math.cos(i) * 34, 240 + Math.sin(i * 1.7) * 30, 22, 46, i * 0.5, 0, 7);
      x.fill();
    }
  }
  return c.toDataURL('image/png');
}

let demo: { a: string; b: string } | null = null;
export function demoMorphPair(): { a: string; b: string } {
  demo ??= { a: room(false), b: room(true) };
  return demo;
}

interface RuntimeApi {
  setData(d: MorphData): void;
  setProgress(v: number, instant?: boolean): void;
  release(): void;
  setPaused(p: boolean): void;
  snapshot(): HTMLCanvasElement;
  dispose(): void;
}

export class MorphViewer {
  private api: RuntimeApi;
  constructor(container: HTMLElement, data: MorphData) {
    container.innerHTML = '';
    this.api = createMorphViewer(THREE, container, { data }) as RuntimeApi;
  }
  setData(d: MorphData) {
    this.api.setData(d);
  }
  setProgress(v: number, instant?: boolean) {
    this.api.setProgress(v, instant);
  }
  release() {
    this.api.release();
  }
  setPaused(p: boolean) {
    this.api.setPaused(p);
  }
  snapshot() {
    return this.api.snapshot();
  }
  dispose() {
    this.api.dispose();
  }
}

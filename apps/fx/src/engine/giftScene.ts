import * as THREE from 'three';
import jsQR from 'jsqr';
import { generateQrMatrix } from './qrMatrix';
// @ts-ignore — plain JS runtime shared with the site snippet
import { createGiftViewer, GIFT_PALETTES } from '../embed/giftRuntime.js';

/**
 * 03 · Подарок с промокодом. The 3D scene lives in embed/giftRuntime.js (same code on the site);
 * here the reward is turned into a grid of cubes once, so the snippet needs no fonts or QR library.
 */

export type GiftMode = 'festive' | 'kraft' | 'neon' | 'mint' | 'royal' | 'sunny';
export type GiftShape = 'cube' | 'tall' | 'flat';
export type GiftPattern = 'plain' | 'dots' | 'stripes';
export type GiftKind = 'code' | 'percent' | 'qr';
export type GiftTrigger = 'click' | 'scroll';
export { GIFT_PALETTES };

export interface GiftSettings {
  kind: GiftKind;
  /** promo code, e.g. GRID20 */
  code: string;
  /** discount, e.g. 20 */
  percent: string;
  /** link for the QR coupon */
  url: string;
  caption: string;
  trigger: GiftTrigger;
  shape: GiftShape;
  pattern: GiftPattern;
}

export interface GiftData {
  reward: { kind: GiftKind; w: number; h: number; cells: [number, number][] };
  code: string;
  url: string;
  caption: string;
  trigger: GiftTrigger;
  shape: GiftShape;
  pattern: GiftPattern;
  /** text in the QR (for the scan check) */
  qrText: string;
}

/** Draw text with the site font and turn its pixels into cells (works for any language). */
function rasterizeText(text: string): { w: number; h: number; cells: [number, number][] } {
  const H = 13; // font size in cells: blocky but readable
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const font = `900 ${H}px Nunito, system-ui, sans-serif`;
  ctx.font = font;
  const w = Math.max(1, Math.ceil(ctx.measureText(text).width) + 2);
  const h = H + 4;
  c.width = w;
  c.height = h;
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#000';
  ctx.fillText(text, 1, H);
  const img = ctx.getImageData(0, 0, w, h).data;
  const cells: [number, number][] = [];
  let minY = h, maxY = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (img[(y * w + x) * 4 + 3] > 110) {
        cells.push([x, y]);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  if (!cells.length) return { w: 1, h: 1, cells: [[0, 0]] };
  return { w, h: maxY - minY + 1, cells: cells.map(([x, y]) => [x, y - minY]) };
}

export function buildGiftData(s: GiftSettings): GiftData {
  if (s.kind === 'qr') {
    const url = s.url.trim() || 'https://gridika.ru';
    const qr = generateQrMatrix(url, 'M');
    const cells: [number, number][] = [];
    for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) cells.push([c, r]);
    return { reward: { kind: 'qr', w: qr.size, h: qr.size, cells }, code: '', url, caption: s.caption, trigger: s.trigger, shape: s.shape, pattern: s.pattern, qrText: url };
  }
  const text = s.kind === 'percent' ? `-${(s.percent.replace(/[^\d]/g, '') || '10').slice(0, 3)}%` : (s.code.trim() || 'GRID20').slice(0, 14);
  const r = rasterizeText(text);
  return { reward: { kind: s.kind, ...r }, code: s.kind === 'code' ? text : '', url: '', caption: s.caption, trigger: s.trigger, shape: s.shape, pattern: s.pattern, qrText: '' };
}

interface RuntimeApi {
  onOpen: ((open: boolean) => void) | null;
  setData(d: GiftData): void;
  setMode(m: GiftMode): void;
  open(): void;
  close(): void;
  isOpen(): boolean;
  setPaused(p: boolean): void;
  snapshot(): HTMLCanvasElement;
  dispose(): void;
}

export class GiftViewer {
  private api: RuntimeApi;
  private data: GiftData;
  onOpen?: (open: boolean) => void;

  constructor(container: HTMLElement, settings: GiftSettings, mode: GiftMode) {
    this.data = buildGiftData(settings);
    container.innerHTML = '';
    this.api = createGiftViewer(THREE, container, { data: this.data, mode }) as RuntimeApi;
    this.api.onOpen = (o) => this.onOpen?.(o);
  }
  get kind() {
    return this.data.reward.kind;
  }
  setSettings(s: GiftSettings) {
    this.data = buildGiftData(s);
    this.api.setData(this.data);
  }
  setMode(m: GiftMode) {
    this.api.setMode(m);
  }
  open() {
    this.api.open();
  }
  close() {
    this.api.close();
  }
  setPaused(p: boolean) {
    this.api.setPaused(p);
  }
  snapshot() {
    return this.api.snapshot();
  }
  /** QR coupon only: read it straight off the rendered frame. */
  checkScan(): { ok: boolean; text: string | null } {
    const c = this.api.snapshot();
    const img = c.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, c.width, c.height);
    const res = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    return { ok: !!res && res.data === this.data.qrText, text: res?.data ?? null };
  }
  dispose() {
    this.api.dispose();
  }
}

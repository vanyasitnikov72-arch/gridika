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

const FONT_5X7: Record<string, number[]> = {
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 2, 4, 8, 31],
  '3': [31, 2, 4, 2, 1, 17, 14],
  '4': [2, 6, 10, 18, 31, 2, 2],
  '5': [31, 16, 30, 1, 1, 17, 14],
  '6': [6, 8, 16, 30, 17, 17, 14],
  '7': [31, 1, 2, 4, 8, 8, 8],
  '8': [14, 17, 17, 14, 17, 17, 14],
  '9': [14, 17, 17, 15, 1, 2, 12],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '+': [0, 4, 4, 31, 4, 4, 0],
  '%': [27, 27, 2, 4, 8, 27, 27],
  ' ': [0, 0, 0, 0, 0, 0, 0],
  'A': [14, 17, 17, 31, 17, 17, 17],
  'B': [30, 17, 17, 30, 17, 17, 30],
  'C': [14, 17, 16, 16, 16, 17, 14],
  'D': [28, 18, 17, 17, 17, 18, 28],
  'E': [31, 16, 16, 30, 16, 16, 31],
  'F': [31, 16, 16, 30, 16, 16, 16],
  'G': [14, 17, 16, 23, 17, 17, 14],
  'H': [17, 17, 17, 31, 17, 17, 17],
  'I': [14, 4, 4, 4, 4, 4, 14],
  'J': [7, 2, 2, 2, 2, 18, 12],
  'K': [17, 18, 20, 24, 20, 18, 17],
  'L': [16, 16, 16, 16, 16, 16, 31],
  'M': [17, 27, 21, 21, 17, 17, 17],
  'N': [17, 17, 25, 21, 19, 17, 17],
  'O': [14, 17, 17, 17, 17, 17, 14],
  'P': [30, 17, 17, 30, 16, 16, 16],
  'Q': [14, 17, 17, 17, 21, 18, 13],
  'R': [30, 17, 17, 30, 20, 18, 17],
  'S': [14, 17, 16, 14, 1, 17, 14],
  'T': [31, 4, 4, 4, 4, 4, 4],
  'U': [17, 17, 17, 17, 17, 17, 14],
  'V': [17, 17, 17, 17, 17, 10, 4],
  'W': [17, 17, 17, 21, 21, 27, 17],
  'X': [17, 17, 10, 4, 10, 17, 17],
  'Y': [17, 17, 10, 4, 4, 4, 4],
  'Z': [31, 1, 2, 4, 8, 16, 31],
  '!': [4, 4, 4, 4, 4, 0, 4],
  '?': [14, 17, 1, 2, 4, 0, 4],
  '.': [0, 0, 0, 0, 0, 0, 4],
  ':': [0, 4, 0, 0, 0, 4, 0],
  '_': [0, 0, 0, 0, 0, 0, 31],
};

const CYR_MAP: Record<string, string> = {
  'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H',
  'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T', 'Х': 'X'
};

function rasterizeTextHeadless(text: string): { w: number; h: number; cells: [number, number][] } {
  const upper = text.toUpperCase();
  const cells: [number, number][] = [];
  let curX = 0;
  for (let i = 0; i < upper.length; i++) {
    const rawChar = upper[i];
    const ch = CYR_MAP[rawChar] || rawChar;
    const rows = FONT_5X7[ch] || FONT_5X7['?'] || [14, 17, 1, 2, 4, 0, 4];
    for (let y = 0; y < 7; y++) {
      const rowBits = rows[y] || 0;
      for (let bit = 0; bit < 5; bit++) {
        if ((rowBits >> (4 - bit)) & 1) {
          cells.push([curX + bit, y]);
        }
      }
    }
    curX += 6;
  }
  const w = Math.max(1, curX - 1);
  return { w, h: 7, cells };
}

/** Draw text with the site font and turn its pixels into cells (works for any language). */
function rasterizeText(text: string): { w: number; h: number; cells: [number, number][] } {
  if (typeof document === 'undefined') {
    return rasterizeTextHeadless(text);
  }
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
  const safeSettings: GiftSettings = {
    caption: s?.caption || '',
    code: s?.code || 'GRID20',
    percent: s?.percent || '10',
    url: s?.url || 'https://gridika.ru',
    trigger: s?.trigger || 'click',
    shape: s?.shape || 'cube',
    pattern: s?.pattern || 'dots',
    kind: s?.kind || 'code',
  };
  if (safeSettings.kind === 'qr') {
    const url = (safeSettings.url || '').trim() || 'https://gridika.ru';
    const qr = generateQrMatrix(url, 'M');
    const cells: [number, number][] = [];
    for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) cells.push([c, r]);
    return { reward: { kind: 'qr', w: qr.size, h: qr.size, cells }, code: '', url, caption: safeSettings.caption, trigger: safeSettings.trigger, shape: safeSettings.shape, pattern: safeSettings.pattern, qrText: url };
  }
  const text = safeSettings.kind === 'percent' ? `-${((safeSettings.percent || '').replace(/[^\d]/g, '') || '10').slice(0, 3)}%` : ((safeSettings.code || '').trim() || 'GRID20').slice(0, 14);
  const r = rasterizeText(text);
  return { reward: { kind: safeSettings.kind, ...r }, code: safeSettings.kind === 'code' ? text : '', url: '', caption: safeSettings.caption, trigger: safeSettings.trigger, shape: safeSettings.shape, pattern: safeSettings.pattern, qrText: '' };
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

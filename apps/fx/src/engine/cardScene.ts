import * as THREE from 'three';
import jsQR from 'jsqr';
import { generateQrMatrix } from './qrMatrix';
import { buildVCard, QR_OPTIONAL, cleanSite, cleanPhone, siteUrl, telegramUrl, whatsappUrl, type CardContact } from './vcard';
// @ts-ignore — plain JS runtime shared with the Tilda snippet
import { createCardViewer, CARD_PALETTES, CARD_STYLES } from '../embed/cardRuntime.js';

/**
 * 02 · Визитка с QR. The 3D card itself lives in embed/cardRuntime.js (same code runs on the
 * customer's site); this file prepares its data and adds studio-only checks.
 */

export type CardMode = 'emerald' | 'graphite' | 'gold' | 'ocean' | 'berry' | 'amethyst' | 'terracotta' | 'snow';
export type CardStyle = 'classic' | 'minimal' | 'pixel' | 'wave' | 'split' | 'diagonal' | 'grid';
export { CARD_PALETTES, CARD_STYLES };

export interface CardData {
  contact: CardContact;
  siteLabel: string;
  links: { kind: 'telegram' | 'whatsapp' | 'site' | 'phone'; url: string }[];
  qr: { size: number; cells: [number, number][] };
  /** text in the QR (vCard) */
  qrText: string;
  /** fields left out of the QR to keep it scannable (still printed on the front) */
  qrOmitted: (keyof CardContact)[];
}

/** Everything the card runtime needs, computed once (QR included) so the embed needs no QR library. */
export function buildCardData(contact: CardContact): CardData {
  let qrText = '';
  let qrOmitted: (keyof CardContact)[] = [];
  // keep the QR at most 53×53 modules: drop optional fields one by one if needed
  for (let n = 0; n <= QR_OPTIONAL.length; n++) {
    const omit = QR_OPTIONAL.slice(0, n).filter((k) => contact[k].trim());
    qrText = buildVCard(contact, omit);
    qrOmitted = omit;
    if (generateQrMatrix(qrText, 'L').size <= 53) break;
  }
  // stronger error correction while the code stays small, fewer modules once it gets dense
  let qr = generateQrMatrix(qrText, 'M');
  if (qr.size > 49) qr = generateQrMatrix(qrText, 'L');
  const cells: [number, number][] = [];
  for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.modules[r][c]) cells.push([c, r]);

  const links: CardData['links'] = [];
  if (telegramUrl(contact)) links.push({ kind: 'telegram', url: telegramUrl(contact) });
  if (whatsappUrl(contact)) links.push({ kind: 'whatsapp', url: whatsappUrl(contact) });
  if (siteUrl(contact)) links.push({ kind: 'site', url: siteUrl(contact) });
  if (!links.length && cleanPhone(contact.phone)) links.push({ kind: 'phone', url: `tel:${cleanPhone(contact.phone)}` });

  return { contact, siteLabel: cleanSite(contact.site), links, qr: { size: qr.size, cells }, qrText, qrOmitted };
}

interface RuntimeApi {
  onFlip: ((f: boolean) => void) | null;
  setData(d: CardData): void;
  setMode(m: CardMode): void;
  setStyle(s: CardStyle): void;
  setLogo(img: HTMLImageElement | null): void;
  setFlipped(f: boolean): void;
  isFlipped(): boolean;
  setPaused(p: boolean): void;
  snapshot(): HTMLCanvasElement;
  dispose(): void;
}

export class CardViewer {
  private api: RuntimeApi;
  private data: CardData;
  onFlip?: (flipped: boolean) => void;

  constructor(container: HTMLElement, contact: CardContact, mode: CardMode, style: CardStyle = 'classic') {
    this.data = buildCardData(contact);
    container.innerHTML = '';
    this.api = createCardViewer(THREE, container, { data: this.data, mode, style }) as RuntimeApi;
    this.api.onFlip = (f) => this.onFlip?.(f);
  }

  get qrText() {
    return this.data.qrText;
  }
  get qrSize() {
    return this.data.qr.size;
  }
  get qrOmitted() {
    return this.data.qrOmitted;
  }

  setContact(c: CardContact) {
    this.data = buildCardData(c);
    this.api.setData(this.data);
  }
  setMode(m: CardMode) {
    this.api.setMode(m);
  }
  setStyle(s: CardStyle) {
    this.api.setStyle(s);
  }
  setLogo(img: HTMLImageElement | null) {
    this.api.setLogo(img);
  }
  setFlipped(f: boolean) {
    this.api.setFlipped(f);
  }
  setPaused(p: boolean) {
    this.api.setPaused(p);
  }
  snapshot() {
    return this.api.snapshot();
  }

  /** Read the QR straight off the rendered 3D frame, like a phone camera would. */
  checkScan(): { ok: boolean; text: string | null } {
    const c = this.api.snapshot();
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const res = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    const text = res?.data ?? null;
    return { ok: text === this.data.qrText, text };
  }

  dispose() {
    this.api.dispose();
  }
}

/**
 * Purchase flow without accounts or a server.
 * The buyer's studio settings travel in the link after "#" (never sent to a server): studio →
 * payment → /thanks#key=…&cfg=… → the ready code. The same link reopens the studio as it was.
 */
import type { ProductId } from '../data/products';
import type { CardContact } from './vcard';
import type { GiftSettings } from './giftScene';
import type { LogoData, LogoSettings } from './logoScene';
import type { MorphData, MorphSettings } from './morphScene';
import type { TimerSettings } from './timerScene';

export interface PurchaseConfig {
  /** product */
  p: ProductId;
  /** the site where the block will be installed (the key is bound to it) */
  site: string;
  qr?: { text: string; shape: string; themeId: string; modes: Record<string, string> };
  card?: { contact: CardContact; hidden: (keyof CardContact)[]; mode: string; style: string };
  gift?: { settings: GiftSettings; mode: string };
  /** the logo travels as its colour grid (the image itself stays with the buyer) */
  logo?: { data: LogoData; settings: LogoSettings; mode: string };
  /** both pictures as colour grids (~16 KB for 64×48) */
  morph?: { data: MorphData; settings: MorphSettings };
  timer?: { settings: TimerSettings; mode: string };
}

const toB64url = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
};

export function encodeConfig(c: PurchaseConfig): string {
  return toB64url(JSON.stringify(c));
}
export function decodeConfig(s: string): PurchaseConfig | null {
  try {
    const c = JSON.parse(fromB64url(s));
    return c && typeof c.p === 'string' ? (c as PurchaseConfig) : null;
  } catch {
    return null;
  }
}

/** key and settings from a "#key=…&cfg=…" hash */
export function readHash(hash: string): { key: string | null; cfg: PurchaseConfig | null } {
  const h = hash.replace(/^#/, '');
  const get = (name: string) => {
    const m = h.match(new RegExp(`(?:^|&)${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };
  const cfg = get('cfg');
  return { key: get('key'), cfg: cfg ? decodeConfig(cfg) : null };
}

export function buildHash(key: string | null, cfg: PurchaseConfig | null): string {
  const parts: string[] = [];
  if (key) parts.push(`key=${encodeURIComponent(key)}`);
  if (cfg) parts.push(`cfg=${encodeConfig(cfg)}`);
  return parts.join('&');
}

// links that point to social networks / messengers say nothing about where the block will live
const NOT_A_SITE = /(^|\.)(instagram\.com|t\.me|telegram\.me|vk\.com|vk\.ru|wa\.me|whatsapp\.com|youtube\.com|youtu\.be|tiktok\.com|facebook\.com|ok\.ru|linktr\.ee|taplink\.cc|avito\.ru|ozon\.ru|wildberries\.ru|yandex\.ru|google\.com|gridika\.ru)$/i;

/** a good first guess for "where will the block be installed" from what the buyer typed in the studio */
export function guessSite(c: Omit<PurchaseConfig, 'site'>): string {
  const raw = c.qr?.text || c.card?.contact.site || c.gift?.settings.url || c.timer?.settings.buttonUrl || '';
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (!host.includes('.') || NOT_A_SITE.test(host)) return '';
    return host;
  } catch {
    return '';
  }
}

// ---- orders: several effects bought at once, no keys ----
// The order link carries every effect's settings after "#" (never sent to a server), signed:
// /thanks#order=<number>&items=<b64url JSON array>&sig=<signature> (see verifyOrder in license.ts).
// "#order=demo" is the sample order for previews.

/** the settings of one bought effect (the site is not needed any more) */
export type OrderItem = Omit<PurchaseConfig, 'site'> & { site?: string };

export function encodeOrder(items: OrderItem[]): string {
  return toB64url(JSON.stringify(items.map(({ site: _site, ...c }) => c)));
}

export interface OrderLink {
  id: string;
  items: OrderItem[];
  /** the items exactly as written in the link (what the signature covers) */
  itemsB64: string;
  sig: string;
  token?: string;
}

/** the order in a "#order=…&items=…&sig=…" hash; null when the hash has no order */
export function readOrderHash(hash: string): OrderLink | null {
  const h = hash.replace(/^#/, '');
  const get = (name: string) => {
    const m = h.match(new RegExp(`(?:^|&)${name}=([^&]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  };
  const id = get('order');
  if (!id) return null;
  const itemsB64 = get('items') || '';
  let items: OrderItem[] = [];
  if (itemsB64) {
    try {
      const arr = JSON.parse(fromB64url(itemsB64));
      if (Array.isArray(arr)) items = arr.filter((c) => c && typeof c.p === 'string') as OrderItem[];
    } catch {
      /* broken link */
    }
  }
  return { id, items, itemsB64, sig: get('sig') || '', token: get('t') || '' };
}

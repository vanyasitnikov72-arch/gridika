/**
 * Gridika license keys (no accounts, no server). Every product is sold: the studio is free to
 * try, but the code for a site (and the picture) is issued only for a valid key for that product.
 *
 * Key:  GRD1-<payload base64url>.<signature base64url>
 * Payload: { v: 1, id: '7F3K2Q', d: 'zerno-coffee.ru' | '*', p: 'qr-card' | 'all', t: '2026-11-11', n?: 'Анна Смирнова' }
 * Signature: ECDSA P-256 / SHA-256 over the payload bytes, made offline by scripts/license.mjs
 * with the private key. The site only holds the public key, so a key cannot be forged or
 * re-pointed to another domain without breaking the signature.
 *
 * Sharing protection (the code runs on the client, so this is deterrence, not DRM):
 *  - domain-bound keys (d = domain) only unlock code for that domain;
 *  - every badge-free snippet is locked to one domain: copied to another site, the badge comes back;
 *  - the key id is written into the snippet, and leaked ids can be revoked (REVOKED_KEY_IDS);
 *  - a card key names its person (n): one key = one person's card. Phone, links, colours and style
 *    change freely, another person needs another key (small typos in the name are forgiven);
 *  - a logo key and a before/after key carry a fingerprint of their content (f, engine/fingerprint.js):
 *    one key = one logo / one photo pair; colours, effects, grid and captions change freely.
 *  - the gift and the timer are per site: any promo codes and dates. "All effects" keys carry no
 *    name or fingerprint: everything, without limits, on one site.
 */

import { LICENSE_PUBLIC_KEYS } from '../data/licensePublicKey';
import { REVOKED_KEY_IDS } from '../data/revokedKeys';

export interface LicensePayload {
  v: 1;
  /** short public id, shown to the buyer and written into the snippet */
  id: string;
  /** bound domain, or '*' for a key that works on any one site the buyer chooses */
  d: string;
  /** the product this key unlocks, or 'all' (old 'pro' keys count as 'all') */
  p: string;
  /** issue date, YYYY-MM-DD */
  t: string;
  /** business card keys: whose card it is (one key = one person) */
  n?: string;
  /** logo / before-after keys: fingerprint of the logo or the photo pair (one key = one item) */
  f?: string;
}

/** "Анна  Смирнова" / "смирнова анна" / "Анна Смирнова." -> the same words in a fixed order */
export function normalizePersonName(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
    .sort()
    .join(' ');
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

/** Is this the person the key was bought for? Word order, case, ё/е and a typo or two don't matter. */
export function nameMatches(keyName: string, name: string): boolean {
  const a = normalizePersonName(keyName), b = normalizePersonName(name);
  if (!a || !b) return false;
  return editDistance(a, b) <= (a.length >= 10 ? 2 : 1);
}

/** A card key without a name (old or batch keys) fits any card. */
export function cardNameOk(l: LicensePayload | null, name: string): boolean {
  return !l?.n || nameMatches(l.n, name);
}

/** does this key unlock the given product? */
export function licenseCovers(l: LicensePayload | null, product: string): boolean {
  return !!l && (l.p === 'all' || l.p === 'pro' || l.p === product);
}

export type LicenseCheck =
  | { ok: true; license: LicensePayload }
  | { ok: false; reason: 'format' | 'signature' | 'revoked' | 'unsupported' };

const PREFIX = 'GRD1-';

export function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Normalise what people paste: spaces, line breaks, "https://www." etc. */
export function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^[a-z]+:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '').replace(/^www\./, '');
  return d;
}

export function isValidDomain(d: string): boolean {
  return /^(?=.{3,253}$)([a-z0-9а-яё](?:[a-z0-9а-яё-]{0,61}[a-z0-9а-яё])?\.)+[a-zа-яё0-9-]{2,63}$/i.test(d);
}

// every key that has ever signed licenses (append-only list): a license signed by any of them is valid
let publicKeysPromise: Promise<CryptoKey[]> | null = null;
function publicKeys(): Promise<CryptoKey[]> {
  publicKeysPromise ??= Promise.all(
    LICENSE_PUBLIC_KEYS.map((jwk) => crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify'])),
  );
  return publicKeysPromise;
}

export async function verifyLicense(raw: string): Promise<LicenseCheck> {
  const key = raw.replace(/\s+/g, '');
  if (!key.startsWith(PREFIX)) return { ok: false, reason: 'format' };
  const [payloadPart, sigPart] = key.slice(PREFIX.length).split('.');
  if (!payloadPart || !sigPart) return { ok: false, reason: 'format' };
  if (typeof crypto === 'undefined' || !crypto.subtle) return { ok: false, reason: 'unsupported' };

  let payloadBytes: Uint8Array<ArrayBuffer>, sig: Uint8Array<ArrayBuffer>, license: LicensePayload;
  try {
    payloadBytes = b64urlToBytes(payloadPart);
    sig = b64urlToBytes(sigPart);
    license = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return { ok: false, reason: 'format' };
  }
  if (license?.v !== 1 || typeof license.id !== 'string' || typeof license.d !== 'string') return { ok: false, reason: 'format' };

  let valid = false;
  try {
    for (const pk of await publicKeys()) {
      if (await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pk, sig, payloadBytes)) {
        valid = true;
        break;
      }
    }
  } catch {
    return { ok: false, reason: 'unsupported' };
  }
  if (!valid) return { ok: false, reason: 'signature' };
  if (REVOKED_KEY_IDS.includes(license.id)) return { ok: false, reason: 'revoked' };
  return { ok: true, license };
}

export const LICENSE_ERRORS: Record<Exclude<LicenseCheck, { ok: true }>['reason'], string> = {
  format: 'Не похоже на ключ Gridika. Скопируйте его из письма целиком — он начинается с GRD1-.',
  signature: 'Ключ повреждён или не настоящий. Скопируйте его из письма ещё раз.',
  revoked: 'Этот ключ отозван. Если это ошибка, напишите нам — заменим.',
  unsupported: 'Браузер не умеет проверять ключи. Откройте студию в свежем Chrome, Safari или Firefox.',
};

/** Remember the key on this device only (a convenience: the email is the real copy). */
const STORAGE = 'gridika-license';
export function loadSavedKey(): string {
  try {
    return localStorage.getItem(STORAGE) ?? '';
  } catch {
    return '';
  }
}
export function saveKey(key: string) {
  try {
    if (key) localStorage.setItem(STORAGE, key);
    else localStorage.removeItem(STORAGE);
  } catch {}
}

/**
 * Order links are signed with the same key ring as licenses: /thanks#order=ID&items=B64&sig=SIG.
 * The signature covers "gridika-order:" + ID + "." + B64 exactly as written in the link, so neither
 * the order number nor any effect's settings can be changed (or made up) without breaking it.
 * Links are signed where the private key lives (scripts/order.mjs now, the payment function later).
 */
export function orderSignedText(id: string, itemsB64: string): string {
  return `gridika-order:${id}.${itemsB64}`;
}

export async function verifyOrder(id: string, itemsB64: string, sig: string): Promise<boolean> {
  if (!id || !itemsB64 || !sig || typeof crypto === 'undefined' || !crypto.subtle) return false;
  try {
    const bytes = new TextEncoder().encode(orderSignedText(id, itemsB64));
    const s = b64urlToBytes(sig);
    for (const pk of await publicKeys()) {
      if (await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pk, s, bytes)) return true;
    }
  } catch {
    /* broken link */
  }
  return false;
}

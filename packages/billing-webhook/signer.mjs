import { webcrypto as crypto } from 'node:crypto';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const ALGO = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };

const b64url = (bytes) => Buffer.from(bytes).toString('base64url');

export function newId() {
  const r = crypto.getRandomValues(new Uint8Array(6));
  return [...r].map((x) => ALPHABET[x % ALPHABET.length]).join('');
}

export function normalizeDomain(input) {
  if (!input || input === '*') return '*';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/^www\./, '');
}

/**
 * Issues a cryptographically signed Gridika license key.
 *
 * @param {object} privateKeyJwk - JSON Web Key of the private ECDSA P-256 key
 * @param {object} params
 * @param {string} params.product - 'qr-morph' | 'qr-card' | 'gift-box' | 'voxel-logo' | 'voxel-morph' | 'sale-timer' | 'all'
 * @param {string} [params.domain] - target website domain (or '*' for any)
 * @param {string} [params.name] - cardholder name for 'qr-card'
 * @param {string} [params.fp] - fingerprint for 'voxel-logo' or 'voxel-morph'
 */
export async function issueKey(privateKeyJwk, { product, domain, name, fp }) {
  if (!privateKeyJwk) throw new Error('Private key JWK is required');
  const privateKey = await crypto.subtle.importKey('jwk', privateKeyJwk, ALGO, false, ['sign']);

  const keyId = newId();
  const d = normalizeDomain(domain);
  const payload = {
    v: 1,
    id: keyId,
    d,
    p: product,
    t: new Date().toISOString().slice(0, 10),
  };

  if (name && typeof name === 'string' && name.trim()) {
    payload.n = name.trim().replace(/\s+/g, ' ');
  }
  if (fp && typeof fp === 'string' && fp.trim()) {
    payload.f = fp.trim();
  }

  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const sig = new Uint8Array(await crypto.subtle.sign(SIGN, privateKey, bytes));

  return {
    keyId,
    payload,
    key: `GRD1-${b64url(bytes)}.${b64url(sig)}`,
  };
}

import { webcrypto as crypto } from 'node:crypto';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const ALGO = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };

export function newId() {
  const r = crypto.getRandomValues(new Uint8Array(6));
  return [...r].map((x) => ALPHABET[x % ALPHABET.length]).join('');
}

export function newOrderId() {
  return 'GR-' + newId();
}

/**
 * Signs an order containing multiple effects and returns the signed URL.
 * URL format: https://gridika.ru/thanks#order=GR-XXXXXX&items=<b64url>&sig=<sig>
 * This matches verifyOrder() in apps/fx/src/engine/license.ts.
 */
export async function signOrderLink(privateKeyJwk, { orderId, items, baseUrl = 'https://gridika.ru' }) {
  if (!privateKeyJwk) throw new Error('Private key JWK is required');
  const privateKey = await crypto.subtle.importKey('jwk', privateKeyJwk, ALGO, false, ['sign']);

  const id = orderId || newOrderId();

  // Normalize items (the signed link does not need site, matching encodeOrder)
  const cleanItems = (items || []).map((it) => {
    const { site: _site, ...rest } = it;
    return rest;
  });

  const itemsB64 = Buffer.from(JSON.stringify(cleanItems)).toString('base64url');
  const message = `gridika-order:${id}.${itemsB64}`;
  const sig = Buffer.from(
    await crypto.subtle.sign(SIGN, privateKey, new TextEncoder().encode(message))
  ).toString('base64url');

  const base = baseUrl.replace(/\/$/, '');
  const orderUrl = `${base}/thanks#order=${encodeURIComponent(id)}&items=${itemsB64}&sig=${sig}`;

  return {
    orderId: id,
    items: cleanItems,
    itemsB64,
    sig,
    orderUrl,
  };
}

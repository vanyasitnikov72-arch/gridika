#!/usr/bin/env node
/**
 * Signed order links (no keys for buyers): /thanks#order=ID&items=B64&sig=SIG.
 * The thanks page shows the codes only when the signature checks out against
 * src/data/licensePublicKey.ts, so a link cannot be made up or edited to get code for free.
 * Signs with the same private key as licenses (.license/private.jwk). Later the payment
 * function does exactly this after a confirmed payment (see ADMIN.md).
 *
 *   node scripts/order.mjs sign --file order.json [--id GR-7Q4K2D] [--base https://gridika.ru]
 *       order.json: an array of effect settings, or the cart as saved in the browser
 *       (localStorage "gridika_cart_v1": items with a "config" field), or { "items": [...] }.
 *       Prints the order number and the link for the email.
 *
 *   node scripts/order.mjs check "<link>"
 *       Checks the link's signature and lists what is in the order.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRIVATE = join(root, '.license', 'private.jwk');
const PUBLIC_TS = join(root, 'src', 'data', 'licensePublicKey.ts');
const ALGO = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };
const PRODUCTS = ['qr-morph', 'qr-card', 'gift-box', 'voxel-logo', 'voxel-morph', 'sale-timer'];

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? undefined : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
};
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

/** must match orderSignedText in src/engine/license.ts */
const signedText = (id, itemsB64) => `gridika-order:${id}.${itemsB64}`;

// order numbers: GR- and 6 chars without look-alikes (0/O, 1/I/L)
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const newId = () => 'GR-' + [...crypto.getRandomValues(new Uint8Array(6))].map((x) => ALPHABET[x % ALPHABET.length]).join('');

function readItems(file) {
  if (!existsSync(file)) fail(`Нет файла ${file}`);
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    fail(`${file}: это не JSON`);
  }
  const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : null;
  if (!list?.length) fail('В файле нет эффектов: нужен массив настроек или корзина из браузера.');
  return list.map((x, i) => {
    const c = x && typeof x === 'object' && x.config ? x.config : x;
    if (!c || !PRODUCTS.includes(c.p)) fail(`Эффект №${i + 1}: неизвестный продукт «${c?.p}».`);
    const { site: _site, ...rest } = c; // the order needs no site (same as encodeOrder in purchase.ts)
    return rest;
  });
}

async function sign() {
  const file = flag('file');
  if (typeof file !== 'string') fail('Укажите файл заказа: node scripts/order.mjs sign --file order.json');
  if (!existsSync(PRIVATE)) fail('Нет секретного ключа .license/private.jwk (node scripts/license.mjs init).');
  const items = readItems(file);
  const id = typeof flag('id') === 'string' ? flag('id') : newId();
  if (!/^[A-Z0-9-]{4,24}$/.test(id)) fail('Номер заказа: латиница, цифры и дефис, 4–24 знака.');
  const itemsB64 = Buffer.from(JSON.stringify(items)).toString('base64url');
  const privateKey = await crypto.subtle.importKey('jwk', JSON.parse(readFileSync(PRIVATE, 'utf8')), ALGO, false, ['sign']);
  const sig = Buffer.from(await crypto.subtle.sign(SIGN, privateKey, new TextEncoder().encode(signedText(id, itemsB64)))).toString('base64url');
  const base = typeof flag('base') === 'string' ? flag('base').replace(/\/$/, '') : 'https://gridika.ru';
  console.log(`Заказ ${id} · кодов: ${items.length} (${items.map((c) => c.p).join(', ')})`);
  console.log(`${base}/thanks#order=${encodeURIComponent(id)}&items=${itemsB64}&sig=${sig}`);
}

/** every public key listed in src/data/licensePublicKey.ts (same reading as scripts/license.mjs) */
function publicKeys() {
  return [...readFileSync(PUBLIC_TS, 'utf8').matchAll(/\{\s*"kty"[\s\S]*?\}/g)].map((m) => JSON.parse(m[0]));
}

async function check() {
  const link = args[1];
  if (!link) fail('Укажите ссылку: node scripts/order.mjs check "<ссылка>"');
  const hash = link.slice(link.indexOf('#') + 1);
  const get = (n) => (hash.match(new RegExp(`(?:^|&)${n}=([^&]+)`)) || [])[1];
  const id = decodeURIComponent(get('order') || ''), itemsB64 = get('items') || '', sig = get('sig') || '';
  if (!id || !itemsB64 || !sig) fail('В ссылке нет order, items или sig.');
  const bytes = new TextEncoder().encode(signedText(id, itemsB64));
  let ok = false;
  for (const jwk of publicKeys()) {
    const pk = await crypto.subtle.importKey('jwk', jwk, ALGO, false, ['verify']);
    if (await crypto.subtle.verify(SIGN, pk, Buffer.from(sig, 'base64url'), bytes)) ok = true;
  }
  const items = JSON.parse(Buffer.from(itemsB64, 'base64url').toString('utf8'));
  console.log(`${ok ? 'Подпись верна' : 'ПОДПИСЬ НЕВЕРНА'} · заказ ${id} · кодов: ${items.length} (${items.map((c) => c.p).join(', ')})`);
  if (!ok) process.exit(1);
}

const cmd = args[0];
if (cmd === 'sign') await sign();
else if (cmd === 'check') await check();
else fail('Команды: sign --file order.json | check "<ссылка>"');

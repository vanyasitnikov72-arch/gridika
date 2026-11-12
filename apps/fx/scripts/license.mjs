#!/usr/bin/env node
/**
 * Gridika license keys — run on your own computer only.
 *
 *   node scripts/license.mjs init
 *       Creates the signing key pair once:
 *       .license/private.jwk  — SECRET, never commit or share it (it is in .gitignore). Back it up.
 *       src/data/licensePublicKey.ts — public half, goes to the site.
 *       Refuses to run once a public key exists: replacing it would void every license already sold.
 *
 *   node scripts/license.mjs rotate
 *       Only if the secret key leaked or is about to be retired: makes a new pair, keeps the old secret
 *       as .license/private-<date>.jwk and APPENDS the new public key, so every old license still works.
 *       Then add the new key to release/keys.lock.json (scripts/check-release.mjs prints the line).
 *
 *   node scripts/license.mjs issue --product qr-card --domain zerno-coffee.ru
 *       One key for one product, bound to a domain (best protection: works only for that site).
 *       --product: qr-morph | qr-card | gift-box | voxel-logo | voxel-morph | sale-timer | all
 *
 *   node scripts/license.mjs issue --product qr-card --domain zerno-coffee.ru --name "Анна Смирнова"
 *       A business card key names its person: one key = one person's card (typos are forgiven).
 *       The name comes from the studio settings the buyer paid with (cfg.card.contact.name).
 *
 *   node scripts/license.mjs issue --cfg "<cfg из ссылки покупки>"
 *       Everything from the purchase link (/thanks#key=…&cfg=…): product, site, and what the key is
 *       bound to — the person's name for a card, the logo or the photo pair fingerprint
 *       (one key = one logo / one pair). Gift, timer and QR keys are per site.
 *
 *   node scripts/license.mjs issue --product qr-morph --any --count 50 > keys.txt
 *       Unbound keys (the buyer types their domain in the studio), e.g. a batch to upload
 *       to a digital-goods shop that emails a key after payment.
 *
 *   node scripts/license.mjs check GRD1-...
 *       Decode and verify a key.
 */
import { webcrypto as crypto } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logoFingerprint, morphFingerprint } from '../src/engine/fingerprint.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRIVATE = join(root, '.license', 'private.jwk');
const PUBLIC_TS = join(root, 'src', 'data', 'licensePublicKey.ts');
const ALGO = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };

const b64url = (bytes) => Buffer.from(bytes).toString('base64url');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? undefined : args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
};

// ids: 6 chars without look-alikes (0/O, 1/I/L)
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
function newId() {
  const r = crypto.getRandomValues(new Uint8Array(6));
  return [...r].map((x) => ALPHABET[x % ALPHABET.length]).join('');
}

function normalizeDomain(input) {
  return String(input).trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '').replace(/^www\./, '');
}

/** every public key listed in src/data/licensePublicKey.ts, oldest first */
function readPublicKeys() {
  if (!existsSync(PUBLIC_TS)) return [];
  return [...readFileSync(PUBLIC_TS, 'utf8').matchAll(/\{\s*"kty"[\s\S]*?\}/g)].map((m) => JSON.parse(m[0]));
}
function writePublicKeys(keys) {
  const [first, ...rest] = keys;
  writeFileSync(
    PUBLIC_TS,
    `/**\n * Public halves of the Gridika license signing keys. Safe to publish.\n *\n` +
      ` * LICENSE_PUBLIC_KEYS is append-only: every key that has ever signed licenses stays here forever,\n` +
      ` * otherwise buyers holding those licenses would lose access. A new signing key (scripts/license.mjs\n` +
      ` * rotate) is appended at the end; the studio accepts a license signed by any key in the list.\n` +
      ` * scripts/check-release.mjs refuses a release that drops or changes a key listed in release/keys.lock.json.\n */\n` +
      `export const LICENSE_PUBLIC_KEY: JsonWebKey = ${JSON.stringify(first, null, 2)};\n\n` +
      `export const LICENSE_PUBLIC_KEYS: JsonWebKey[] = [\n  LICENSE_PUBLIC_KEY,\n` +
      rest.map((k) => `  ${JSON.stringify(k)},\n`).join('') +
      `];\n`,
  );
}
async function newPair() {
  const pair = await crypto.subtle.generateKey(ALGO, true, ['sign', 'verify']);
  const priv = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const { kty, crv, x, y } = await crypto.subtle.exportKey('jwk', pair.publicKey);
  return { priv, pub: { kty, crv, x, y } };
}

async function init() {
  if (readPublicKeys().length) {
    console.error('Ключ подписи уже создан. Пересоздание сделало бы недействительными все проданные ключи — init больше не нужен.\nЕсли секретный ключ утёк: node scripts/license.mjs rotate');
    process.exit(1);
  }
  const { priv, pub } = await newPair();
  mkdirSync(dirname(PRIVATE), { recursive: true });
  writeFileSync(PRIVATE, JSON.stringify(priv, null, 2));
  writePublicKeys([pub]);
  console.log(`Готово.\n  секретный ключ: ${PRIVATE}  (сделайте резервную копию, не публикуйте)\n  публичный ключ: ${PUBLIC_TS}`);
}

async function rotate() {
  const keys = readPublicKeys();
  if (!keys.length || !existsSync(PRIVATE)) {
    console.error('Нечего менять: сначала node scripts/license.mjs init');
    process.exit(1);
  }
  const backup = join(dirname(PRIVATE), `private-${new Date().toISOString().slice(0, 10)}.jwk`);
  writeFileSync(backup, readFileSync(PRIVATE));
  const { priv, pub } = await newPair();
  writeFileSync(PRIVATE, JSON.stringify(priv, null, 2));
  writePublicKeys([...keys, pub]);
  console.log(`Новый ключ подписи готов, старые ключи покупателей продолжат работать.\n  старый секретный ключ: ${backup}\n  новый секретный ключ: ${PRIVATE}\n  в ${PUBLIC_TS} добавлен публичный ключ №${keys.length + 1}\nДобавьте его в release/keys.lock.json (строку подскажет node scripts/check-release.mjs) и выпустите сайт.`);
}

async function loadPrivate() {
  if (!existsSync(PRIVATE)) {
    console.error('Нет ключа подписи. Сначала: node scripts/license.mjs init');
    process.exit(1);
  }
  return crypto.subtle.importKey('jwk', JSON.parse(readFileSync(PRIVATE, 'utf8')), ALGO, false, ['sign']);
}

const PRODUCTS = ['qr-morph', 'qr-card', 'gift-box', 'voxel-logo', 'voxel-morph', 'sale-timer', 'all'];

async function issueOne(privateKey, domain, product, name, fp) {
  const payload = { v: 1, id: newId(), d: domain, p: product, t: new Date().toISOString().slice(0, 10) };
  if (name) payload.n = name;
  if (fp) payload.f = fp;
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const sig = new Uint8Array(await crypto.subtle.sign(SIGN, privateKey, bytes));
  return { payload, key: `GRD1-${b64url(bytes)}.${b64url(sig)}` };
}

async function issue() {
  // the purchase link's settings: product, site and what the key is bound to
  const cfgArg = flag('cfg');
  let cfg = null;
  if (typeof cfgArg === 'string') {
    try {
      cfg = JSON.parse(Buffer.from(cfgArg.replace(/^.*cfg=/, '').replace(/&.*$/, ''), 'base64url').toString('utf8'));
    } catch {
      console.error('Не получилось прочитать --cfg: вставьте значение cfg из ссылки покупки');
      process.exit(1);
    }
  }
  const domainArg = flag('domain') ?? cfg?.site;
  const any = flag('any');
  if (!domainArg && !any) {
    console.error('Укажите --domain site.ru или --any');
    process.exit(1);
  }
  const product = flag('product') ?? cfg?.p;
  if (!PRODUCTS.includes(product)) {
    console.error(`Укажите продукт: --product ${PRODUCTS.join(' | ')}`);
    process.exit(1);
  }
  const domain = any ? '*' : normalizeDomain(domainArg);
  const count = Math.max(1, Number(flag('count')) || 1);
  const nameArg = flag('name') ?? (product === 'qr-card' ? cfg?.card?.contact?.name : undefined);
  const name = typeof nameArg === 'string' ? nameArg.trim().replace(/\s+/g, ' ') : '';
  // one key = one logo / one photo pair
  const fpArg = flag('fp');
  const fp =
    typeof fpArg === 'string' ? fpArg
    : product === 'voxel-logo' && cfg?.logo?.data ? logoFingerprint(cfg.logo.data)
    : product === 'voxel-morph' && cfg?.morph?.data ? morphFingerprint(cfg.morph.data)
    : '';
  if ((product === 'voxel-logo' || product === 'voxel-morph') && !fp) console.error('Внимание: ключ без отпечатка (--cfg) подойдёт для любого логотипа / любой пары фото.');
  if (product === 'qr-card' && !name) console.error('Внимание: ключ визитки без --name подойдёт для визитки любого человека.');
  const privateKey = await loadPrivate();
  for (let i = 0; i < count; i++) {
    const { payload, key } = await issueOne(privateKey, domain, product, name, fp);
    if (count === 1) console.error(`id ${payload.id} · ${product} · ${domain === '*' ? 'любой сайт' : domain}${name ? ` · ${name}` : ''}${fp ? ` · ${fp.slice(0, 14)}…` : ''}`);
    console.log(key);
  }
}

async function check() {
  const key = (args[1] || '').replace(/\s+/g, '');
  const [p, s] = key.replace(/^GRD1-/, '').split('.');
  const bytes = Buffer.from(p, 'base64url');
  let ok = false;
  for (const jwk of readPublicKeys()) {
    const publicKey = await crypto.subtle.importKey('jwk', jwk, ALGO, false, ['verify']);
    if (await crypto.subtle.verify(SIGN, publicKey, Buffer.from(s, 'base64url'), bytes)) ok = true;
  }
  console.log(ok ? 'подпись верна' : 'ПОДПИСЬ НЕВЕРНА', JSON.parse(bytes.toString('utf8')));
}

const cmd = args[0];
if (cmd === 'init') await init();
else if (cmd === 'issue') await issue();
else if (cmd === 'check') await check();
else if (cmd === 'rotate') await rotate();
else console.log('Команды: init | issue --cfg "<cfg>" | issue --product qr-card --domain site.ru | issue --product all --any [--count N] | check <ключ> | rotate');

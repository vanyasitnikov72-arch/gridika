#!/usr/bin/env node
/**
 * Gridika release guard: run before every deploy (CI does it on dev and main).
 * Blocks a release that would cut buyers off from what they paid for:
 *
 *  1. every public key in release/keys.lock.json is still in src/data/licensePublicKey.ts
 *     (licenses signed by a dropped key would stop working);
 *  2. the demo licenses still verify (the key format and the signature check did not change);
 *  3. every product id ever sold is still known to the site and to the key script;
 *  4. one-item fingerprints (logo / photo pair) still give the same result on the golden samples
 *     (otherwise logo and before/after keys stop matching their content);
 *  5. the purchase link format (#key=…&cfg=…) and the license prefix are unchanged.
 *
 *   node scripts/check-release.mjs        → exit 1 with a list of problems, or "OK"
 */
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const problems = [];
const ok = [];
const fail = (msg) => problems.push(msg);

// ---- 1. public keys ----
const pubTs = read('src/data/licensePublicKey.ts');
const keys = [...pubTs.matchAll(/\{\s*"kty"[\s\S]*?\}/g)].map((m) => JSON.parse(m[0]));
const lock = JSON.parse(read('release/keys.lock.json'));
for (const k of lock.publicKeys) {
  if (!keys.some((j) => j.x === k.x && j.y === k.y)) fail(`Публичный ключ от ${k.added} пропал из src/data/licensePublicKey.ts — все ключи, подписанные им, перестанут работать. Верните его.`);
}
const unlocked = keys.filter((j) => !lock.publicKeys.some((k) => k.x === j.x && k.y === j.y));
for (const j of unlocked) {
  fail(`Новый публичный ключ не записан в release/keys.lock.json. Добавьте в "publicKeys":\n    { "x": "${j.x}", "y": "${j.y}", "added": "${new Date().toISOString().slice(0, 10)}" }`);
}
if (!/export const LICENSE_PUBLIC_KEYS/.test(pubTs)) fail('В licensePublicKey.ts нет списка LICENSE_PUBLIC_KEYS — проверка ключей сломается.');
else ok.push(`публичные ключи на месте (${keys.length})`);

// ---- 2. demo licenses verify ----
const emailTs = read('src/emails/keyEmail.ts');
const demo = [...emailTs.matchAll(/'(GRD1-[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+)'/g)].map((m) => m[1]);
const imported = [];
for (const j of keys) {
  try {
    imported.push(await crypto.subtle.importKey('jwk', j, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']));
  } catch {
    fail(`Публичный ключ ${String(j.x).slice(0, 10)}… повреждён — подписанные им ключи не пройдут проверку.`);
  }
}
let verified = 0;
for (const key of demo) {
  const [p, s] = key.slice(5).split('.');
  const bytes = Buffer.from(p, 'base64url'), sig = Buffer.from(s, 'base64url');
  let good = false;
  for (const pk of imported) if (await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pk, sig, bytes)) good = true;
  if (good) verified++;
  else fail(`Демо-ключ ${JSON.parse(bytes.toString('utf8')).id} больше не проходит проверку подписи.`);
}
if (!demo.length) fail('Не нашлось демо-ключей в src/emails/keyEmail.ts — нечем проверить формат.');
else if (verified === demo.length) ok.push(`демо-ключи проходят проверку (${verified})`);

// ---- 3. product ids ----
const productsTs = read('src/data/products.ts');
const scriptMjs = read('scripts/license.mjs');
for (const id of lock.products) {
  if (id !== 'all' && !productsTs.includes(`id: '${id}'`)) fail(`Продукт «${id}» пропал из src/data/products.ts — у покупателей есть ключи на него. Скройте его из студии, но не удаляйте id.`);
  if (!new RegExp(`['"]${id}['"]`).test(scriptMjs.slice(scriptMjs.indexOf('const PRODUCTS')))) fail(`Скрипт выдачи ключей больше не знает продукт «${id}».`);
}
ok.push(`продукты на месте (${lock.products.length})`);

// ---- 4. fingerprints ----
const fp = await import(pathToFileURL(join(root, 'src/engine/fingerprint.js')).href);
const gold = JSON.parse(read('release/fingerprints.json'));
if (fp.logoFingerprint(gold.logo.data) !== gold.logo.fp) fail('Отпечаток логотипа изменился — ключи 3D-логотипа перестанут совпадать с логотипами. Новую версию добавляйте как L2, не меняя L1.');
if (!fp.contentMatches(gold.logo.fp, 'voxel-logo', gold.logo.data)) fail('Логотип не совпадает со своим же отпечатком.');
if (fp.morphFingerprint(gold.morph.data) !== gold.morph.fp) fail('Отпечаток пары фото изменился — ключи морфа перестанут совпадать с фото. Новую версию добавляйте как M2, не меняя M1.');
if (!fp.contentMatches(gold.morph.fp, 'voxel-morph', gold.morph.data)) fail('Пара фото не совпадает со своим же отпечатком.');
ok.push('отпечатки логотипа и фото прежние');

// ---- 5. formats ----
const licenseTs = read('src/engine/license.ts');
if (!licenseTs.includes("const PREFIX = 'GRD1-'")) fail('Изменился префикс ключей GRD1- — старые ключи не пройдут проверку.');
const purchaseTs = read('src/engine/purchase.ts');
if (!/get\('key'\)/.test(purchaseTs) || !/get\('cfg'\)/.test(purchaseTs)) fail('Изменился формат ссылки покупки (#key=…&cfg=…) — ссылки из писем перестанут открываться.');
for (const page of ['src/pages/thanks.astro', 'src/pages/index.astro']) if (!existsSync(join(root, page))) fail(`Нет страницы ${page} — на неё ведут ссылки из писем.`);
ok.push('формат ключей и ссылок прежний');

if (problems.length) {
  console.error('\n✗ Выпуск остановлен — он сломал бы доступ покупателей:\n');
  problems.forEach((p) => console.error('  • ' + p));
  console.error('');
  process.exit(1);
}
console.log('✓ ' + ok.join('\n✓ '));
console.log('\nOK: выпуск безопасен для купленных ключей.');

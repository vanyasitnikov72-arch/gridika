/**
 * Local test of the orders function: an in-memory PostgreSQL (pg-mem) with schema.sql, a fake
 * YooKassa (fetch is stubbed), no SMTP (emails are recorded). Checks the honest purchase and
 * every way of getting code without paying that we know of.
 *
 *   pnpm --filter @temka/billing-webhook test
 */
import { readFileSync, existsSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { newDb } from 'pg-mem';
import nodemailer from 'nodemailer';

// ---- environment ----
const keyFile = new URL('../../apps/fx/.license/private.jwk', import.meta.url);
if (existsSync(keyFile)) process.env.PRIVATE_KEY_JWK = readFileSync(keyFile, 'utf8');
else {
  const pair = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  process.env.PRIVATE_KEY_JWK = JSON.stringify(await webcrypto.subtle.exportKey('jwk', pair.privateKey));
}
process.env.YOOKASSA_SHOP_ID = 'test-shop';
process.env.YOOKASSA_SECRET_KEY = 'test-secret';
process.env.ADMIN_SECRET = 'a-long-admin-secret-for-tests';
process.env.SMTP_PASS = 'x';
process.env.SITE_URL = 'https://gridika.ru';

// ---- in-memory PostgreSQL with the real schema ----
const mem = newDb();
mem.public.none(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
const { Pool } = mem.adapters.createPg();
const db = await import('./db.mjs');
db.setPool(new Pool());

// ---- fake SMTP: remember what would be sent ----
const sent = [];
nodemailer.createTransport = () => ({ sendMail: async (m) => sent.push(m) });

// ---- fake YooKassa ----
const payments = new Map();
let refunds = 0;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (u.startsWith('https://api.telegram.org')) return json(200, {});
  if (!u.startsWith('https://api.yookassa.ru/v3')) throw new Error('unexpected fetch ' + u);
  if (opts.headers?.Authorization !== 'Basic ' + Buffer.from('test-shop:test-secret').toString('base64')) return json(401, {});
  if (opts.method === 'POST' && u.endsWith('/payments')) {
    const b = JSON.parse(opts.body);
    if (JSON.stringify(b.metadata).length > 512) return json(400, { description: 'metadata too long' });
    const p = { id: 'pay_' + (payments.size + 1), status: 'pending', paid: false, amount: b.amount, metadata: b.metadata, confirmation: { confirmation_url: 'https://yoomoney.ru/checkout/x' } };
    payments.set(p.id, p);
    return json(200, p);
  }
  const m = u.match(/\/payments\/([^/?]+)$/);
  if (opts.method === 'GET' && m) return payments.has(m[1]) ? json(200, payments.get(m[1])) : json(404, {});
  if (opts.method === 'POST' && u.endsWith('/refunds')) {
    refunds++;
    return json(200, { id: 'ref_1', status: 'succeeded' });
  }
  return json(404, {});
};

const { handler } = await import('./index.mjs');
const call = async (action, body, { method = 'POST', headers = {} } = {}) => {
  const r = await handler({ httpMethod: method, url: '/', queryStringParameters: { action }, headers: { origin: 'https://gridika.ru', ...headers }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.statusCode, body: JSON.parse(r.body || '{}'), headers: r.headers };
};

let failed = 0;
const check = (name, ok, extra = '') => {
  console.log(`${ok ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`);
  if (!ok) failed++;
};

const qr = (text) => ({ p: 'qr-morph', qr: { text, shape: 'tree', themeId: 'velvet-emerald', modes: {} } });
const bigMorph = { p: 'voxel-morph', morph: { data: { w: 64, h: 48, a: 'x'.repeat(12000), b: 'y'.repeat(12000) }, settings: {} } };
const admin = { headers: { authorization: 'Bearer a-long-admin-secret-for-tests' } };

// 1. honest purchase
const created = await call('create-payment', { email: 'Buyer@Example.com', items: [qr('https://one.ru'), qr('https://two.ru'), bigMorph] });
check('payment is created; the price comes from the server', created.status === 200 && created.body.total === 3790, JSON.stringify(created.body.total));
const orderId = created.body.orderId;
const order0 = await db.getOrder(orderId);
check('order waits as "pending", effects stored in the DB (not in YooKassa metadata)', order0?.status === 'pending' && order0.items.length === 3);
const payId = order0.paymentId;

const early = await call('order-status', { orderId, token: order0.accessToken });
check('before payment the thanks page gets no link', early.body.status === 'pending' && !early.body.orderUrl);

// 2. a forged notification: the payment is not paid at YooKassa
const forged = await call('webhook', { type: 'notification', event: 'payment.succeeded', object: { id: payId, status: 'succeeded', paid: true, metadata: { orderId } } });
check('forged "succeeded" for an unpaid payment does nothing', (await db.getOrder(orderId)).status === 'pending' && sent.length === 0, forged.body.reason);

const madeUp = await call('webhook', { type: 'notification', event: 'payment.succeeded', object: { id: 'pay_fake', status: 'succeeded', paid: true, metadata: { orderId } } });
check('made-up payment id is ignored', madeUp.body.reason === 'unknown_payment' && sent.length === 0);

const oldStyle = await call('webhook', { event: 'payment.succeeded', email: 'attacker@example.com', items: [qr('https://free.ru')] });
check('old-style "send me an order" request is rejected', oldStyle.status === 400 && sent.length === 0);

// 3. the real payment
Object.assign(payments.get(payId), { status: 'succeeded', paid: true });
const ok = await call('webhook', { type: 'notification', event: 'payment.succeeded', object: { id: payId } });
const paid = await db.getOrder(orderId);
check('real payment → order paid, link signed, one email', ok.status === 200 && paid.status === 'paid' && paid.orderUrl.includes('&sig=') && sent.length === 1 && sent[0].to === 'buyer@example.com');

const again = await call('webhook', { type: 'notification', event: 'payment.succeeded', object: { id: payId } });
check('repeated notification sends nothing twice', again.body.message === 'already_processed' && sent.length === 1);

const back = await call('order-status', { orderId, token: order0.accessToken });
check('back from payment: the buyer gets the link', back.body.status === 'paid' && back.body.orderUrl === paid.orderUrl);
const wrongToken = await call('order-status', { orderId, token: 'guess' });
check('someone else cannot fetch the link by order number', wrongToken.status === 404);

// 4. codes from the server
const hash = new URL(paid.orderUrl).hash.slice(1);
const g = (n) => decodeURIComponent((hash.match(new RegExp(`(?:^|&)${n}=([^&]+)`)) || [])[1] || '');
const codes = await call('get-order-codes', { orderId: g('order'), itemsB64: g('items'), sig: g('sig') });
check('signed link → codes built on the server', codes.status === 200 && codes.body.codes.length === 3 && codes.body.codes[0].length > 1000);
const tampered = await call('get-order-codes', { orderId: g('order'), itemsB64: Buffer.from(JSON.stringify([qr('https://free.ru')])).toString('base64url'), sig: g('sig') });
check('edited link → no codes', tampered.status === 403);

// 5. a payment for a different amount
const c2 = await call('create-payment', { email: 'x@y.ru', items: [qr('https://a.ru')] });
const o2 = await db.getOrder(c2.body.orderId);
Object.assign(payments.get(o2.paymentId), { status: 'succeeded', paid: true, amount: { value: '1.00', currency: 'RUB' } });
await call('webhook', { type: 'notification', object: { id: o2.paymentId } });
check('payment with the wrong amount does not open the order', (await db.getOrder(o2.id)).status === 'pending' && sent.length === 1);

// 6. admin API
const noAuth = await call('admin-orders', null, { method: 'GET' });
const wrongAuth = await call('admin-resend', { orderId, targetEmail: 'evil@example.com' }, { headers: { authorization: 'Bearer gridika2026 a-long-admin-secret-for-tests' } });
check('admin without the secret: 401, nothing sent', noAuth.status === 401 && wrongAuth.status === 401 && sent.length === 1);
const list = await call('admin-orders', null, { method: 'GET', ...admin });
check('admin lists orders with events, no access tokens', list.status === 200 && list.body.orders.length === 2 && list.body.orders.every((o) => !o.accessToken) && list.body.orders.find((o) => o.id === orderId).events.length >= 3);
const resend = await call('admin-resend', { orderId, targetEmail: 'new@example.com' }, admin);
check('admin resend works', resend.status === 200 && sent.length === 2 && sent[1].to === 'new@example.com');
const refund = await call('admin-refund', { orderId }, admin);
check('admin refund goes through YooKassa', refund.status === 200 && refunds === 1 && (await db.getOrder(orderId)).status === 'refunded');
const afterRefund = await call('get-order-codes', { orderId: g('order'), itemsB64: g('items'), sig: g('sig') });
check('refunded order no longer gets codes', afterRefund.status === 410);

delete process.env.ADMIN_SECRET;
const off = await call('admin-orders', null, { method: 'GET', headers: { authorization: 'Bearer ' } });
check('no ADMIN_SECRET configured → admin is off', off.status === 503);
process.env.ADMIN_SECRET = 'a-long-admin-secret-for-tests';

// 7. CORS
const evil = await call('order-status', { orderId, token: 'x' }, { headers: { origin: 'https://evil.example' } });
check('other sites get no CORS permission', !evil.headers['Access-Control-Allow-Origin']);

console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);

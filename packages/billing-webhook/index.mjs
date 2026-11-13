/**
 * Gridika orders function (Yandex Cloud Functions, entry point index.handler).
 *
 * The function has one public URL; the action goes in the query: <url>?action=…
 *   create-payment  POST  site cart → pending order in the DB → YooKassa payment → redirect URL
 *   webhook         POST  YooKassa notification → the payment is re-read from YooKassa → order paid →
 *                         signed link → email (the notification itself is never trusted)
 *   order-status    POST  the thanks page after paying: { orderId, token } → paid? → the order link
 *   get-order-codes POST  the thanks page: signed link → codes built here (not in the site's JS)
 *   admin-orders    GET   admin: orders with events          (Authorization: Bearer ADMIN_SECRET)
 *   admin-resend    POST  admin: send the order email again  (same)
 *   admin-refund    POST  admin: refund through YooKassa     (same)
 *   admin-note      POST  admin: save a note                 (same)
 *
 * Environment: see DEPLOY.md. Nothing has a default secret: without ADMIN_SECRET the admin API is
 * off, without YooKassa keys payments are off, without DATABASE_URL nothing is stored.
 */
import { timingSafeEqual, randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { signOrderLink, newOrderId, verifyOrderLink } from './signer.mjs';
import { renderOrderEmail } from './emailTemplate.mjs';
import { orderPrice } from './pricing.mjs';
import * as db from './db.mjs';
import { yookassaConfigured, createPayment, getPayment, createRefund } from './yookassa.mjs';

const PRODUCTS = new Set(['qr-morph', 'qr-card', 'gift-box', 'voxel-logo', 'voxel-morph', 'sale-timer']);
const MAX_ITEMS = 50;
const MAX_ITEMS_BYTES = 1_500_000;
const SITE = () => (process.env.SITE_URL || 'https://gridika.ru').replace(/\/$/, '');

// ---------- helpers ----------

function corsHeaders(event) {
  const allowed = (process.env.ALLOWED_ORIGINS || 'https://gridika.ru,https://www.gridika.ru').split(',').map((s) => s.trim());
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const h = { 'Content-Type': 'application/json', Vary: 'Origin' };
  if (allowed.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
  return h;
}

const reply = (event, statusCode, data) => ({ statusCode, headers: corsHeaders(event), body: JSON.stringify(data) });

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const escHtml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const EMAIL_RE = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,185}\.[^\s@<>"]{2,}$/;

function privateKey() {
  try {
    return process.env.PRIVATE_KEY_JWK ? JSON.parse(process.env.PRIVATE_KEY_JWK) : null;
  } catch {
    return null;
  }
}

function createMailer() {
  if (!process.env.SMTP_PASS) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.spaceweb.ru',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER || 'info@gridika.ru', pass: process.env.SMTP_PASS },
  });
}

async function sendOrderEmail(order, to, resend = false) {
  const mailer = createMailer();
  if (!mailer) throw new Error('SMTP is not configured');
  await mailer.sendMail({
    from: `"Gridika" <${process.env.SMTP_USER || 'info@gridika.ru'}>`,
    to,
    subject: `${resend ? '[Повторно] ' : ''}Ваш заказ Gridika № ${order.id} — готовый код эффектов`,
    html: renderOrderEmail({ orderId: order.id, items: order.items, total: order.total, orderUrl: order.orderUrl }),
  });
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err.message);
  }
}

/** the cart's effects: known products, sane size; the site field is dropped */
function cleanItems(items) {
  if (!Array.isArray(items) || items.length < 1 || items.length > MAX_ITEMS) return null;
  const out = [];
  for (const it of items) {
    if (!it || typeof it !== 'object' || !PRODUCTS.has(it.p)) return null;
    const { site: _site, ...rest } = it;
    out.push(rest);
  }
  if (Buffer.byteLength(JSON.stringify(out)) > MAX_ITEMS_BYTES) return null;
  return out;
}

/** admin calls carry "Authorization: Bearer <ADMIN_SECRET>"; no secret configured → admin is off */
function adminCheck(event) {
  const secret = process.env.ADMIN_SECRET || '';
  if (secret.length < 16) return 503;
  const auth = event.headers?.authorization || event.headers?.Authorization || '';
  return safeEqual(auth, `Bearer ${secret}`) ? 0 : 401;
}

const publicOrder = ({ accessToken: _t, ...o }) => o;

// ---------- the paid order: link, email, notification ----------

async function fulfil(order, paymentId) {
  const key = privateKey();
  const { orderUrl } = await signOrderLink(key, { orderId: order.id, items: order.items, baseUrl: SITE() });
  await db.setOrderUrl(order.id, orderUrl);
  await db.addEvent(order.id, 'payment', `Оплата ${order.total} ₽ подтверждена ЮKassa (${paymentId})`);
  const paid = { ...order, orderUrl };
  try {
    await sendOrderEmail(paid, order.email);
    await db.setEmailStatus(order.id, 'sent');
    await db.addEvent(order.id, 'email_sent', `Письмо отправлено на ${order.email}`);
  } catch (err) {
    console.error(`Email for ${order.id} failed:`, err.message);
    await db.setEmailStatus(order.id, 'failed');
    await db.addEvent(order.id, 'email_failed', `Письмо не отправлено: ${err.message}`);
  }
  await notifyTelegram(
    `🎉 <b>Новый заказ Gridika</b>\n№ <b>${escHtml(order.id)}</b>\n` +
      `Покупатель: <code>${escHtml(order.email)}</code>\n` +
      `Кодов: <b>${order.items.length}</b> (${escHtml(order.items.map((i) => i.p).join(', '))})\n` +
      `Сумма: <b>${order.total} ₽</b>`,
  );
}

// ---------- actions ----------

async function onCreatePayment(event, body) {
  if (!yookassaConfigured()) return reply(event, 503, { error: 'payments_disabled' });
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return reply(event, 400, { error: 'bad_email' });
  const items = cleanItems(body.items);
  if (!items) return reply(event, 400, { error: 'bad_items' });

  const { total, discount } = orderPrice(items.length);
  const id = newOrderId();
  const accessToken = randomBytes(24).toString('base64url');
  const source = String(body.source || 'direct').slice(0, 120);
  await db.createOrder({ id, email, items, total, discount, accessToken, source });

  try {
    const payment = await createPayment({
      orderId: id,
      total,
      email,
      codes: items.length,
      returnUrl: `${SITE()}/thanks#order=${encodeURIComponent(id)}&t=${accessToken}`,
    });
    await db.setPaymentId(id, payment.id);
    return reply(event, 200, { orderId: id, total, discount, confirmationUrl: payment.confirmation?.confirmation_url });
  } catch (err) {
    console.error('Payment creation failed:', err.message, err.data || '');
    await db.setStatus(id, 'canceled');
    await db.addEvent(id, 'canceled', 'ЮKassa не создала платёж');
    return reply(event, 502, { error: 'payment_failed' });
  }
}

async function onWebhook(event, body) {
  // Anyone can call this URL, so the notification only says "look at payment X":
  // the payment itself is read back from YooKassa with our secret key.
  const paymentId = body?.object?.id;
  if (body?.type !== 'notification' || typeof paymentId !== 'string') return reply(event, 400, { error: 'not_a_notification' });
  if (!yookassaConfigured() || !privateKey()) return reply(event, 500, { error: 'not_configured' }); // YooKassa retries later

  let payment;
  try {
    payment = await getPayment(paymentId);
  } catch (err) {
    if (err.status === 404) return reply(event, 200, { status: 'ignored', reason: 'unknown_payment' });
    console.error('Cannot read payment', paymentId, err.message);
    return reply(event, 500, { error: 'yookassa_unavailable' }); // retry
  }

  const orderId = payment?.metadata?.orderId;
  const order = orderId ? await db.getOrder(orderId) : null;
  if (!order) return reply(event, 200, { status: 'ignored', reason: 'unknown_order' });

  if (payment.status === 'canceled') {
    if (order.status === 'pending') {
      await db.setStatus(order.id, 'canceled');
      await db.addEvent(order.id, 'canceled', 'Платёж отменён');
    }
    return reply(event, 200, { status: 'ok' });
  }
  if (payment.status !== 'succeeded' || payment.paid !== true) return reply(event, 200, { status: 'ignored', reason: payment.status });

  const amountOk = payment.amount?.currency === 'RUB' && Math.round(Number(payment.amount?.value) * 100) === order.total * 100;
  if (!amountOk || (order.paymentId && order.paymentId !== payment.id)) {
    console.error(`Payment ${payment.id} does not match order ${order.id}`, payment.amount);
    await db.addEvent(order.id, 'mismatch', `Платёж ${payment.id} не совпал с заказом (${payment.amount?.value} ${payment.amount?.currency})`);
    return reply(event, 200, { status: 'ignored', reason: 'mismatch' });
  }

  // exactly once, even if YooKassa sends the notification twice at the same time
  if (!(await db.markPaid(order.id, payment.id))) return reply(event, 200, { status: 'ok', message: 'already_processed' });
  await fulfil(order, payment.id);
  return reply(event, 200, { status: 'ok', orderId: order.id });
}

async function onOrderStatus(event, body) {
  const order = body.orderId ? await db.getOrder(String(body.orderId)) : null;
  if (!order || !body.token || !safeEqual(order.accessToken, body.token)) return reply(event, 404, { error: 'not_found' });
  if (order.status === 'paid' && order.orderUrl) return reply(event, 200, { status: 'paid', orderUrl: order.orderUrl, email: order.email });
  return reply(event, 200, { status: order.status === 'paid' ? 'pending' : order.status });
}

async function onGetOrderCodes(event, body) {
  const { orderId, itemsB64, sig } = body;
  if (!orderId || !itemsB64 || !sig) return reply(event, 400, { error: 'missing_fields' });
  const key = privateKey();
  if (!key) return reply(event, 500, { error: 'not_configured' });
  if (!(await verifyOrderLink(key, orderId, itemsB64, sig))) return reply(event, 403, { error: 'bad_signature' });

  // an order in our database that was refunded no longer gets its codes
  const order = await db.getOrder(String(orderId)).catch(() => null);
  if (order && order.status === 'refunded') return reply(event, 410, { error: 'refunded' });

  let items;
  try {
    items = JSON.parse(Buffer.from(itemsB64, 'base64url').toString('utf8'));
  } catch {
    return reply(event, 400, { error: 'bad_items' });
  }
  const { buildPurchaseCode } = await import('./codeCompiler.mjs');
  const codes = items.map((item) => {
    try {
      return buildPurchaseCode({ ...item, site: '' }, { id: orderId, domain: '*' }) || '';
    } catch (err) {
      console.error('Code build failed:', item?.p, err.message);
      return '';
    }
  });
  return reply(event, 200, { ok: true, orderId, codes });
}

async function onAdmin(event, action, body) {
  const denied = adminCheck(event);
  if (denied) return reply(event, denied, { error: denied === 503 ? 'admin_disabled' : 'unauthorized' });

  if (action === 'admin-orders') {
    const orders = await db.listOrders({ limit: 500 });
    return reply(event, 200, { orders: orders.map(publicOrder) });
  }

  const order = body.orderId ? await db.getOrder(String(body.orderId)) : null;
  if (!order) return reply(event, 404, { error: 'not_found' });

  if (action === 'admin-resend') {
    if (order.status !== 'paid' || !order.orderUrl) return reply(event, 409, { error: 'not_paid' });
    const to = String(body.targetEmail || order.email).trim().toLowerCase();
    if (!EMAIL_RE.test(to)) return reply(event, 400, { error: 'bad_email' });
    try {
      await sendOrderEmail(order, to, true);
    } catch (err) {
      await db.addEvent(order.id, 'email_failed', `Повторная отправка не удалась: ${err.message}`);
      return reply(event, 502, { error: 'email_failed', message: err.message });
    }
    await db.setEmailStatus(order.id, 'sent');
    await db.addEvent(order.id, 'email_resent', `Письмо переслано на ${to}`);
    return reply(event, 200, { status: 'ok' });
  }

  if (action === 'admin-refund') {
    if (order.status !== 'paid' || !order.paymentId) return reply(event, 409, { error: 'not_paid' });
    try {
      const refund = await createRefund({ paymentId: order.paymentId, total: order.total, orderId: order.id });
      if (refund.status === 'canceled') throw new Error('ЮKassa отклонила возврат');
    } catch (err) {
      await db.addEvent(order.id, 'refund_failed', `Возврат не прошёл: ${err.message}`);
      return reply(event, 502, { error: 'refund_failed', message: err.message });
    }
    await db.setStatus(order.id, 'refunded');
    await db.addEvent(order.id, 'refund', `Возврат ${order.total} ₽ через ЮKassa`);
    return reply(event, 200, { status: 'ok' });
  }

  if (action === 'admin-note') {
    await db.setNote(order.id, String(body.note || '').slice(0, 2000));
    return reply(event, 200, { status: 'ok' });
  }
  return reply(event, 404, { error: 'unknown_action' });
}

// ---------- entry point ----------

export async function handler(event) {
  const method = event.httpMethod || 'GET';
  if (method === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(event), body: '' };

  const path = String(event.url || event.path || '/').split('?')[0];
  const action = event.queryStringParameters?.action || path.split('/').filter(Boolean).pop() || '';
  if (method === 'GET' && (action === '' || action === 'health')) return reply(event, 200, { status: 'ok', service: 'gridika-orders', v: 3 });

  let body = {};
  if (method === 'POST') {
    try {
      let raw = event.body || '{}';
      if (event.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
      body = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return reply(event, 400, { error: 'bad_json' });
    }
  }

  try {
    if (method === 'POST' && action === 'create-payment') return await onCreatePayment(event, body);
    if (method === 'POST' && action === 'webhook') return await onWebhook(event, body);
    if (method === 'POST' && action === 'order-status') return await onOrderStatus(event, body);
    if (method === 'POST' && action === 'get-order-codes') return await onGetOrderCodes(event, body);
    if (action.startsWith('admin-') && ((method === 'GET' && action === 'admin-orders') || method === 'POST')) return await onAdmin(event, action, body);
    return reply(event, 404, { error: 'unknown_action' });
  } catch (err) {
    console.error(`Action ${action} failed:`, err);
    return reply(event, 500, { error: 'internal' });
  }
}

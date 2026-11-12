import nodemailer from 'nodemailer';
import { signOrderLink, newOrderId, verifyOrderLink } from './signer.mjs';
import { renderOrderEmail } from './emailTemplate.mjs';
import { orderPrice, BUNDLE_MAX } from './pricing.mjs';
import {
  saveOrder,
  getOrder,
  getOrderByPaymentId,
  addOrderEvent,
  updateOrderStatus,
  listOrders,
} from './db.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

/**
 * Sends a notification to Telegram if credentials are set in environment
 */
async function notifyTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

/**
 * Creates SMTP transporter (SpaceWeb)
 */
function createMailer() {
  const host = process.env.SMTP_HOST || 'smtp.spaceweb.ru';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || 'info@gridika.ru';
  const pass = process.env.SMTP_PASS;

  if (!pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Yandex Cloud Function entrypoint
 */
export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  // Parse path & method
  const path = event.url || event.path || '/';
  const method = event.httpMethod || 'GET';

  // 1. Health check
  if (method === 'GET' && (path === '/' || path === '/health')) {
    return jsonResponse(200, { status: 'ok', service: 'gridika-orders-engine', v: '2.0' });
  }

  // Parse body
  let body = {};
  try {
    let raw = event.body || '{}';
    if (event.isBase64Encoded) {
      raw = Buffer.from(raw, 'base64').toString('utf8');
    }
    body = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid JSON request body' });
  }

  // 2. CREATE PAYMENT: Cart checkout -> YooKassa redirect
  if (method === 'POST' && path.includes('create-payment')) {
    const { email, items, source } = body;
    if (!email || !email.includes('@')) {
      return jsonResponse(400, { error: 'Valid customer email is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(400, { error: 'Order must contain at least 1 effect' });
    }

    const { total, discount } = orderPrice(items.length);
    const orderId = newOrderId();
    const cleanItems = items.map(({ site: _site, ...rest }) => rest);
    const itemsB64 = Buffer.from(JSON.stringify(cleanItems)).toString('base64url');

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    // Dev/fallback mode if keys are not configured yet
    if (!shopId || !secretKey) {
      console.warn('YooKassa credentials not configured; generating demo redirect link');
      const orderUrl = `https://gridika.ru/thanks#order=${encodeURIComponent(orderId)}&demo=true`;
      return jsonResponse(200, {
        orderId,
        total,
        discount,
        confirmationUrl: orderUrl,
        mode: 'demo',
      });
    }

    // Call YooKassa API
    try {
      const authHeader = 'Basic ' + Buffer.from(`${shopId}:${secretKey}`).toString('base64');
      const idempotenceKey = orderId + '-' + Date.now();

      const yooRes = await fetch('https://api.yookassa.ru/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': idempotenceKey,
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: {
            value: total.toFixed(2),
            currency: 'RUB',
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: `https://gridika.ru/thanks#order=${encodeURIComponent(orderId)}`,
          },
          description: `Заказ Gridika № ${orderId} (${items.length} ${items.length === 1 ? 'эффект' : 'эффекта'})`,
          receipt: {
            customer: { email },
            items: [
              {
                description: `Готовый 3D-код Gridika (${items.length} шт.)`,
                quantity: '1.00',
                amount: { value: total.toFixed(2), currency: 'RUB' },
                vat_code: 1, // без НДС для самозанятых / УСН
                payment_mode: 'full_payment',
                payment_subject: 'commodity',
              },
            ],
          },
          metadata: {
            orderId,
            email,
            itemsB64,
            source: source || 'direct',
          },
        }),
      });

      const yooData = await yooRes.json();
      if (!yooRes.ok || !yooData.confirmation?.confirmation_url) {
        console.error('YooKassa API Error:', yooData);
        return jsonResponse(502, { error: 'Failed to create payment with YooKassa', details: yooData });
      }

      return jsonResponse(200, {
        orderId,
        total,
        discount,
        paymentId: yooData.id,
        confirmationUrl: yooData.confirmation.confirmation_url,
      });
    } catch (err) {
      console.error('Payment creation error:', err);
      return jsonResponse(500, { error: 'Internal server error while creating payment' });
    }
  }

  // 3. GET ORDER CODES: Server-side code generation for /thanks page (isolated from client JS)
  if (method === 'POST' && path.includes('get-order-codes')) {
    const { orderId, itemsB64, sig } = body;
    if (!orderId || !itemsB64 || !sig) {
      return jsonResponse(400, { error: 'Missing orderId, itemsB64 or sig' });
    }

    const privateKeyRaw = process.env.PRIVATE_KEY_JWK;
    if (!privateKeyRaw) {
      return jsonResponse(500, { error: 'Server signing key is not configured' });
    }

    let privateKeyJwk;
    try {
      privateKeyJwk = JSON.parse(privateKeyRaw);
    } catch {
      return jsonResponse(500, { error: 'Invalid server signing key' });
    }

    // Verify cryptographic signature
    const isValid = await verifyOrderLink(privateKeyJwk, orderId, itemsB64, sig);
    if (!isValid) {
      return jsonResponse(403, { error: 'Invalid or forged order signature' });
    }

    // Decode items
    let items = [];
    try {
      items = JSON.parse(Buffer.from(itemsB64, 'base64url').toString('utf8'));
    } catch {
      return jsonResponse(400, { error: 'Corrupted items payload' });
    }

    // Compile commercial, clean, watermark-free HTML/JS code for each effect on the server
    const { buildPurchaseCode } = await import('./codeCompiler.mjs');
    const codes = items.map((item) => {
      try {
        return buildPurchaseCode(item, { id: orderId, domain: '*' }) || '';
      } catch (err) {
        console.error('Failed to compile code for item:', item, err);
        return '';
      }
    });

    return jsonResponse(200, {
      ok: true,
      orderId,
      codes,
    });
  }

  // 3. WEBHOOK: YooKassa payment.succeeded
  if (method === 'POST' && (path.includes('webhook') || body.type === 'notification' || body.event === 'payment.succeeded')) {
    const isYoo = body.type === 'notification' && body.event === 'payment.succeeded';
    const obj = isYoo ? (body.object || {}) : body;
    const meta = obj.metadata || {};

    const paymentId = obj.id || body.paymentId || 'MANUAL-' + Date.now();
    const orderId = meta.orderId || body.orderId || newOrderId();
    const email = meta.email || obj.receipt?.customer?.email || body.email;
    const source = meta.source || body.source || 'direct';

    if (!email || !email.includes('@')) {
      console.error('Missing email in payment payload:', body);
      return jsonResponse(400, { error: 'Customer email missing in payment' });
    }

    // Check duplicate
    const existing = await getOrderByPaymentId(paymentId);
    if (existing && existing.status === 'paid') {
      console.log(`Payment ${paymentId} for order ${existing.id} already processed. Skipping.`);
      return jsonResponse(200, { status: 'ok', message: 'Already processed', orderId: existing.id });
    }

    // Parse items
    let items = [];
    if (meta.itemsB64) {
      try {
        items = JSON.parse(Buffer.from(meta.itemsB64, 'base64url').toString('utf8'));
      } catch (err) {
        console.error('Failed to parse itemsB64:', err);
      }
    } else if (Array.isArray(body.items)) {
      items = body.items;
    } else if (meta.product || body.product) {
      items = [{ p: meta.product || body.product || 'qr-morph' }];
    }

    if (items.length === 0) {
      items = [{ p: 'qr-morph' }];
    }

    // Load private key
    const privateKeyRaw = process.env.PRIVATE_KEY_JWK;
    if (!privateKeyRaw) {
      console.error('PRIVATE_KEY_JWK environment variable is missing');
      return jsonResponse(500, { error: 'Server signing key is not configured' });
    }

    let privateKeyJwk;
    try {
      privateKeyJwk = JSON.parse(privateKeyRaw);
    } catch {
      return jsonResponse(500, { error: 'Invalid PRIVATE_KEY_JWK format' });
    }

    // Cryptographically sign the order URL
    const { orderUrl } = await signOrderLink(privateKeyJwk, { orderId, items });
    const { total, discount } = orderPrice(items.length);

    // Send email
    let emailStatus = 'sent';
    const mailer = createMailer();
    if (mailer) {
      try {
        const html = renderOrderEmail({ orderId, items, total, orderUrl });
        await mailer.sendMail({
          from: `"Gridika" <${process.env.SMTP_USER || 'info@gridika.ru'}>`,
          to: email,
          subject: `Ваш заказ Gridika № ${orderId} — готовый код эффектов`,
          html,
        });
        console.log(`Email successfully sent to ${email} for order ${orderId}`);
      } catch (err) {
        console.error('Failed to send order email:', err);
        emailStatus = 'bounced';
      }
    } else {
      console.log('SMTP not configured; skipped sending real email');
    }

    // Save order in DB
    const saved = await saveOrder({
      id: orderId,
      email,
      items,
      codesCount: items.length,
      total,
      discount,
      paymentId,
      paymentProvider: 'yookassa',
      status: 'paid',
      emailStatus,
      orderUrl,
      source,
      note: '',
      events: [
        {
          id: 'ev-1',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          type: 'payment',
          text: `Оплата ${total} ₽ подтверждена (ЮKassa)`,
        },
        {
          id: 'ev-2',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          type: 'email_sent',
          text: `Письмо отправлено на ${email}`,
        },
      ],
    });

    // Telegram notification
    await notifyTelegram(
      `🎉 <b>Новый заказ Gridika!</b>\n` +
      `№ <b>${orderId}</b>\n` +
      `Покупатель: <code>${email}</code>\n` +
      `Кодов: <b>${items.length}</b> (${items.map((i) => i.p).join(', ')})\n` +
      `Сумма: <b>${total} ₽</b> (скидка ${discount} ₽)\n` +
      `<a href="${orderUrl}">Открыть страницу заказа</a>`
    );

    return jsonResponse(200, {
      status: 'ok',
      orderId,
      orderUrl,
      emailStatus,
    });
  }

  // 4. ADMIN API: GET /admin/orders
  if (method === 'GET' && path.includes('admin/orders')) {
    const auth = event.headers?.authorization || event.headers?.Authorization || '';
    const adminPass = process.env.ADMIN_SECRET || 'gridika2026';
    if (!auth.includes(adminPass)) {
      return jsonResponse(401, { error: 'Unauthorized' });
    }

    const orders = await listOrders();
    return jsonResponse(200, { orders });
  }

  // 5. ADMIN API: POST /admin/orders/resend
  if (method === 'POST' && path.includes('admin/orders/resend')) {
    const { orderId, targetEmail } = body;
    const order = await getOrder(orderId);
    if (!order) return jsonResponse(404, { error: 'Order not found' });

    const mailer = createMailer();
    const dest = targetEmail || order.email;
    if (mailer) {
      const html = renderOrderEmail({
        orderId: order.id,
        items: order.items,
        total: order.total,
        orderUrl: order.orderUrl,
      });
      await mailer.sendMail({
        from: `"Gridika" <${process.env.SMTP_USER || 'info@gridika.ru'}>`,
        to: dest,
        subject: `[Повторно] Ваш заказ Gridika № ${order.id} — готовый код эффектов`,
        html,
      });
    }

    await addOrderEvent(order.id, {
      type: 'email_resent',
      text: `Письмо переслано на ${dest}`,
    });

    return jsonResponse(200, { status: 'ok', message: `Resent to ${dest}` });
  }

  // 6. ADMIN API: POST /admin/orders/refund
  if (method === 'POST' && path.includes('admin/orders/refund')) {
    const { orderId } = body;
    const order = await getOrder(orderId);
    if (!order) return jsonResponse(404, { error: 'Order not found' });

    await updateOrderStatus(orderId, 'refunded');
    await addOrderEvent(order.id, {
      type: 'refund',
      text: `Возврат средств оформлен администратором`,
    });

    return jsonResponse(200, { status: 'ok', message: 'Order marked as refunded' });
  }

  return jsonResponse(404, { error: 'Route not found' });
}

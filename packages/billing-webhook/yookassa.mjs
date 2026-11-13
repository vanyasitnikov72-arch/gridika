/**
 * YooKassa API (https://yookassa.ru/developers/api): create a payment, read it back, refund it.
 * Every call is authorised with the shop id and the secret key from the function's environment.
 */
import zlib from 'node:zlib';

const API = 'https://api.yookassa.ru/v3';

export function yookassaConfigured() {
  return !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

export function packMetadataItems(items) {
  if (!items) return {};
  try {
    const json = typeof items === 'string' ? (items.startsWith('[') ? items : Buffer.from(items, 'base64url').toString('utf8')) : JSON.stringify(items);
    const def = zlib.deflateRawSync(Buffer.from(json));
    const b64 = 'z:' + def.toString('base64url');
    if (b64.length <= 510) {
      return { items: b64 };
    }
    const chunks = {};
    const CHUNK_SIZE = 500;
    for (let i = 0; i * CHUNK_SIZE < b64.length && i < 10; i++) {
      chunks[`it${i}`] = b64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    }
    return chunks;
  } catch (err) {
    console.error('packMetadataItems error:', err);
    return {};
  }
}

export function unpackMetadataItems(metadata) {
  if (!metadata) return [];
  let str = metadata.items || '';
  if (!str) {
    let combined = '';
    for (let i = 0; i < 10; i++) {
      if (metadata[`it${i}`]) combined += metadata[`it${i}`];
      else break;
    }
    str = combined;
  }
  if (!str) return [];
  try {
    if (str.startsWith('z:')) {
      const buf = Buffer.from(str.slice(2), 'base64url');
      const decompressed = zlib.inflateRawSync(buf).toString('utf8');
      return JSON.parse(decompressed);
    }
    return JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
  } catch (err) {
    console.error('unpackMetadataItems error:', err);
    return [];
  }
}

function headers(idempotenceKey) {
  const auth = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64');
  const h = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' };
  if (idempotenceKey) h['Idempotence-Key'] = idempotenceKey;
  return h;
}

async function call(method, path, body, idempotenceKey) {
  const res = await fetch(`${API}${path}`, { method, headers: headers(idempotenceKey), body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const err = new Error(`YooKassa ${method} ${path}: HTTP ${res.status} ${data?.description || ''}`.trim());
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const money = (rub) => ({ value: Number(rub).toFixed(2), currency: 'RUB' });

/** a payment for an order; only the order number travels in metadata (it has a 512-char limit per value) */
export function createPayment({ orderId, total, email, codes, items, itemsB64, accessToken, source, returnUrl }) {
  const metadata = {
    orderId,
    ...packMetadataItems(items || itemsB64),
  };
  if (email && email.length <= 100) metadata.email = email;
  if (accessToken) metadata.token = accessToken;
  if (source) metadata.src = source.slice(0, 50);

  return call(
    'POST',
    '/payments',
    {
      amount: money(total),
      capture: true,
      confirmation: { type: 'redirect', return_url: returnUrl },
      description: `Заказ Gridika № ${orderId}`,
      receipt: {
        customer: { email },
        items: [
          {
            description: `Готовый 3D-код Gridika, ${codes} шт.`,
            quantity: '1.00',
            amount: money(total),
            vat_code: 1,
            payment_mode: 'full_payment',
            payment_subject: 'intellectual_activity',
          },
        ],
      },
      metadata,
    },
    // one payment per order, even if the request is repeated
    `pay-${orderId}`,
  );
}

/** the payment as YooKassa sees it — the only source of truth for "paid" */
export function getPayment(paymentId) {
  return call('GET', `/payments/${encodeURIComponent(paymentId)}`);
}

export function listPayments(limit = 40) {
  return call('GET', `/payments?limit=${limit}`);
}

export function createRefund({ paymentId, total, orderId }) {
  return call('POST', '/refunds', { payment_id: paymentId, amount: money(total), description: `Возврат по заказу Gridika № ${orderId}` }, `refund-${orderId}`);
}

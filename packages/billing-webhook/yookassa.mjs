/**
 * YooKassa API (https://yookassa.ru/developers/api): create a payment, read it back, refund it.
 * Every call is authorised with the shop id and the secret key from the function's environment.
 */
const API = 'https://api.yookassa.ru/v3';

export function yookassaConfigured() {
  return !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
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
export function createPayment({ orderId, total, email, codes, returnUrl }) {
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
      metadata: { orderId },
    },
    // one payment per order, even if the request is repeated
    `pay-${orderId}`,
  );
}

/** the payment as YooKassa sees it — the only source of truth for "paid" */
export function getPayment(paymentId) {
  return call('GET', `/payments/${encodeURIComponent(paymentId)}`);
}

export function createRefund({ paymentId, total, orderId }) {
  return call('POST', '/refunds', { payment_id: paymentId, amount: money(total), description: `Возврат по заказу Gridika № ${orderId}` }, `refund-${orderId}`);
}

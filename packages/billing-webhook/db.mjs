/**
 * Orders storage: PostgreSQL (Yandex Managed PostgreSQL), see schema.sql.
 *
 *   DATABASE_URL   postgres://user:pass@host:6432/gridika   (optional in production)
 *   DATABASE_CA    the provider's root certificate (PEM) — turns on certificate checks
 *
 * If DATABASE_URL is not set, a fast in-memory store is used so orders and payments
 * work out-of-the-box without requiring an external database cluster.
 */
import pg from 'pg';

let pool = null;
const memOrders = new Map();
const memEvents = [];

/** tests: a pg-compatible pool (pg-mem); production: built from DATABASE_URL */
export function setPool(p) {
  pool = p;
}

function hasDb() {
  return !!(pool || process.env.DATABASE_URL);
}

function db() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set: orders cannot be stored');
  const ca = process.env.DATABASE_CA;
  pool = new pg.Pool({
    connectionString: url,
    max: 2,
    idleTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_SSL === 'off' ? false : ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false },
  });
  return pool;
}

const q = (text, params = []) => db().query(text, params);

function rowToOrder(r) {
  if (!r) return null;
  return {
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    paidAt: r.paid_at ? new Date(r.paid_at).toISOString() : null,
    email: r.email,
    items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items || [],
    codesCount: Number(r.codes_count),
    total: Number(r.total),
    discount: Number(r.discount),
    paymentId: r.payment_id || '',
    status: r.status,
    emailStatus: r.email_status,
    orderUrl: r.order_url || '',
    accessToken: r.access_token,
    source: r.source || '',
    note: r.note || '',
  };
}

/** a new order waiting for payment (status "pending") */
export async function createOrder(o) {
  if (!hasDb()) {
    memOrders.set(o.id, {
      id: o.id,
      created_at: new Date().toISOString(),
      paid_at: null,
      email: o.email,
      items: o.items,
      codes_count: o.items.length,
      total: o.total,
      discount: o.discount,
      payment_id: '',
      status: 'pending',
      email_status: 'none',
      order_url: '',
      access_token: o.accessToken,
      source: o.source || 'direct',
      note: '',
    });
    await addEvent(o.id, 'created', `Заказ создан: ${o.items.length} код(ов), ${o.total} ₽`);
    return;
  }
  await q(
    `INSERT INTO orders (id, email, items, codes_count, total, discount, status, email_status, access_token, source)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'none', $7, $8)`,
    [o.id, o.email, JSON.stringify(o.items), o.items.length, o.total, o.discount, o.accessToken, o.source || 'direct'],
  );
  await addEvent(o.id, 'created', `Заказ создан: ${o.items.length} код(ов), ${o.total} ₽`);
}

export async function getOrder(id) {
  if (!hasDb()) {
    const r = memOrders.get(id);
    return rowToOrder(r);
  }
  const { rows } = await q(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rowToOrder(rows[0]);
}

export async function setPaymentId(id, paymentId) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o) o.payment_id = paymentId;
    return;
  }
  await q(`UPDATE orders SET payment_id = $2 WHERE id = $1`, [id, paymentId]);
}

/**
 * pending → paid, exactly once: of two notifications arriving together only one gets true,
 * so the email goes out once.
 */
export async function markPaid(id, paymentId) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o && o.status === 'pending') {
      o.status = 'paid';
      o.paid_at = new Date().toISOString();
      o.payment_id = paymentId;
      return true;
    }
    return false;
  }
  const { rows } = await q(
    `UPDATE orders SET status = 'paid', paid_at = NOW(), payment_id = $2 WHERE id = $1 AND status = 'pending' RETURNING id`,
    [id, paymentId],
  );
  return rows.length === 1;
}

export async function setStatus(id, status) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o) o.status = status;
    return;
  }
  await q(`UPDATE orders SET status = $2 WHERE id = $1`, [id, status]);
}

export async function setOrderUrl(id, url) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o) o.order_url = url;
    return;
  }
  await q(`UPDATE orders SET order_url = $2 WHERE id = $1`, [id, url]);
}

export async function setEmailStatus(id, status) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o) o.email_status = status;
    return;
  }
  await q(`UPDATE orders SET email_status = $2 WHERE id = $1`, [id, status]);
}

export async function setNote(id, note) {
  if (!hasDb()) {
    const o = memOrders.get(id);
    if (o) o.note = note;
    return;
  }
  await q(`UPDATE orders SET note = $2 WHERE id = $1`, [id, note]);
}

export async function addEvent(orderId, type, text) {
  if (!hasDb()) {
    memEvents.unshift({
      id: String(Date.now() + Math.random()),
      order_id: orderId,
      created_at: new Date().toISOString(),
      event_type: type,
      description: text,
    });
    return;
  }
  await q(`INSERT INTO order_events (order_id, event_type, description) VALUES ($1, $2, $3)`, [orderId, type, text]);
}

/** newest first, each with its events (newest first) */
export async function listOrders({ limit = 200, offset = 0 } = {}) {
  if (!hasDb()) {
    const orders = Array.from(memOrders.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit)
      .map(rowToOrder);
    return orders.map((o) => ({
      ...o,
      events: memEvents
        .filter((e) => e.order_id === o.id)
        .map((e) => ({ id: String(e.id), time: e.created_at, type: e.event_type, text: e.description })),
    }));
  }
  const { rows } = await q(`SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  const orders = rows.map(rowToOrder);
  if (!orders.length) return orders;
  const ids = orders.map((o) => o.id);
  const params = ids.map((_, i) => `$${i + 1}`).join(', ');
  const ev = await q(`SELECT * FROM order_events WHERE order_id IN (${params}) ORDER BY created_at DESC, id DESC`, ids);
  const byOrder = new Map(ids.map((id) => [id, []]));
  for (const e of ev.rows) {
    byOrder.get(e.order_id)?.push({ id: String(e.id), time: new Date(e.created_at).toISOString(), type: e.event_type, text: e.description });
  }
  return orders.map((o) => ({ ...o, events: byOrder.get(o.id) || [] }));
}

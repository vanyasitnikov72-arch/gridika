/**
 * Orders storage: PostgreSQL (Yandex Managed PostgreSQL), see schema.sql.
 *
 *   DATABASE_URL   postgres://user:pass@host:6432/gridika   (required in production)
 *   DATABASE_CA    the provider's root certificate (PEM) — turns on certificate checks
 *
 * A Cloud Function instance is short-lived and several may run at once, so nothing is kept in
 * memory: every read and write goes to the database. Tests pass their own pool (setPool).
 */
import pg from 'pg';

let pool = null;

/** tests: a pg-compatible pool (pg-mem); production: built from DATABASE_URL */
export function setPool(p) {
  pool = p;
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
  await q(
    `INSERT INTO orders (id, email, items, codes_count, total, discount, status, email_status, access_token, source)
     VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'none', $7, $8)`,
    [o.id, o.email, JSON.stringify(o.items), o.items.length, o.total, o.discount, o.accessToken, o.source || 'direct'],
  );
  await addEvent(o.id, 'created', `Заказ создан: ${o.items.length} код(ов), ${o.total} ₽`);
}

export async function getOrder(id) {
  const { rows } = await q(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rowToOrder(rows[0]);
}

export async function setPaymentId(id, paymentId) {
  await q(`UPDATE orders SET payment_id = $2 WHERE id = $1`, [id, paymentId]);
}

/**
 * pending → paid, exactly once: of two notifications arriving together only one gets true,
 * so the email goes out once.
 */
export async function markPaid(id, paymentId) {
  const { rows } = await q(
    `UPDATE orders SET status = 'paid', paid_at = NOW(), payment_id = $2 WHERE id = $1 AND status = 'pending' RETURNING id`,
    [id, paymentId],
  );
  return rows.length === 1;
}

export async function setStatus(id, status) {
  await q(`UPDATE orders SET status = $2 WHERE id = $1`, [id, status]);
}

export async function setOrderUrl(id, url) {
  await q(`UPDATE orders SET order_url = $2 WHERE id = $1`, [id, url]);
}

export async function setEmailStatus(id, status) {
  await q(`UPDATE orders SET email_status = $2 WHERE id = $1`, [id, status]);
}

export async function setNote(id, note) {
  await q(`UPDATE orders SET note = $2 WHERE id = $1`, [id, note]);
}

export async function addEvent(orderId, type, text) {
  await q(`INSERT INTO order_events (order_id, event_type, description) VALUES ($1, $2, $3)`, [orderId, type, text]);
}

/** newest first, each with its events (newest first) */
export async function listOrders({ limit = 200, offset = 0 } = {}) {
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

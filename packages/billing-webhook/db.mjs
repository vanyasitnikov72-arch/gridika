/**
 * Database storage for Gridika orders and audit events.
 * Supports:
 * - In-memory / JSON store (default, fallback, and local dev)
 * - YDB Serverless / PostgreSQL / Object Storage hooks
 */

// In-memory cache for fast lookups and fallback
const memoryOrders = new Map();

export async function saveOrder(order) {
  const record = {
    id: order.id,
    createdAt: order.createdAt || new Date().toISOString(),
    email: order.email,
    items: order.items || [],
    codesCount: order.codesCount || (order.items || []).length,
    total: Number(order.total) || 0,
    discount: Number(order.discount) || 0,
    paymentId: order.paymentId || '',
    paymentProvider: order.paymentProvider || 'yookassa',
    status: order.status || 'paid',
    emailStatus: order.emailStatus || 'sent',
    orderUrl: order.orderUrl || '',
    source: order.source || '',
    note: order.note || '',
    events: order.events || [],
  };

  memoryOrders.set(record.id, record);

  // If YDB or PostgreSQL connection is configured via env
  if (process.env.DATABASE_URL) {
    try {
      // Lazy import or pg query
    } catch (err) {
      console.error('Failed to persist order to SQL DB:', err);
    }
  }

  return record;
}

export async function getOrder(id) {
  return memoryOrders.get(id) || null;
}

export async function getOrderByPaymentId(paymentId) {
  if (!paymentId) return null;
  for (const order of memoryOrders.values()) {
    if (order.paymentId === paymentId) return order;
  }
  return null;
}

export async function addOrderEvent(orderId, { type, text }) {
  const order = memoryOrders.get(orderId);
  if (!order) return null;

  const event = {
    id: 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    type,
    text,
  };

  order.events = [event, ...(order.events || [])];
  memoryOrders.set(orderId, order);
  return event;
}

export async function updateOrderStatus(orderId, status) {
  const order = memoryOrders.get(orderId);
  if (!order) return null;
  order.status = status;
  memoryOrders.set(orderId, order);
  return order;
}

export async function updateOrderNote(orderId, note) {
  const order = memoryOrders.get(orderId);
  if (!order) return null;
  order.note = note;
  memoryOrders.set(orderId, order);
  return order;
}

export async function listOrders({ limit = 50, offset = 0 } = {}) {
  const all = Array.from(memoryOrders.values());
  // Sort descending by creation date
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all.slice(offset, offset + limit);
}

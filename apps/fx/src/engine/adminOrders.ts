import type { OrderItem } from './purchase';

export interface OrderEvent {
  id: string;
  time: string;
  type: 'payment' | 'email_sent' | 'email_resent' | 'link_opened' | 'refund' | 'note';
  text: string;
}

export interface AdminOrder {
  id: string;
  createdAt: string; // ISO
  email: string;
  items: (OrderItem | any)[];
  codesCount: number;
  total: number;
  discount: number;
  paymentId: string;
  paymentProvider: 'yookassa' | 'cloudpayments' | 'tinkoff' | 'manual';
  status: 'paid' | 'refunded' | 'failed';
  emailStatus: 'sent' | 'bounced' | 'resent';
  orderUrl: string;
  source: string;
  note: string;
  events: OrderEvent[];
}

export interface OrdersSummary {
  revenueToday: number;
  revenue7d: number;
  revenue30d: number;
  revenueTotal: number;
  ordersCount: number;
  codesCount: number;
  averageCheck: number;
  tierCounts: {
    single: number; // 1
    bundle: number; // 2-6
    studio: number; // 7+
  };
  productCounts: Record<string, number>;
  alerts: {
    failedEmails: number;
    refunds: number;
    failedPayments: number;
  };
}

// Built-in initial sample orders for development and preview
export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'GR-7Q4K2D',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 min ago
    email: 'anna.smirnova@studionord.ru',
    items: [
      {
        p: 'qr-morph',
        qr: { text: 'https://zerno-coffee.ru', shape: 'tree', themeId: 'velvet-emerald', modes: {} },
      },
      {
        p: 'qr-card',
        card: {
          contact: {
            name: 'Анна Смирнова',
            role: 'Дизайнер интерьеров',
            company: 'Studio Nord',
            phone: '+7 900 123-45-67',
            email: 'anna.smirnova@studionord.ru',
            site: 'studionord.ru',
            telegram: 'studionord',
            whatsapp: '',
          },
          hidden: [],
          mode: 'graphite',
          style: 'classic',
        },
      },
      {
        p: 'gift-box',
        gift: {
          settings: {
            kind: 'code',
            code: 'COFFEE20',
            percent: '20',
            url: 'https://zerno-coffee.ru',
            caption: 'Скидка 20% на первый заказ',
            trigger: 'click',
            shape: 'cube',
            pattern: 'plain',
          },
          mode: 'festive',
        },
      },
    ],
    codesCount: 3,
    total: 3290,
    discount: 1180,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f01',
    paymentProvider: 'yookassa',
    status: 'paid',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'tilda_expert_dir',
    note: 'Студия дизайна из СПб, планируют ещё 4 сайта',
    events: [
      { id: 'ev-1', time: '17:22', type: 'payment', text: 'Оплата 3 290 ₽ подтверждена (ЮKassa, чек отправлен в ФНС)' },
      { id: 'ev-2', time: '17:22', type: 'email_sent', text: 'Письмо с 3 кодами отправлено на anna.smirnova@studionord.ru' },
      { id: 'ev-3', time: '17:25', type: 'link_opened', text: 'Покупатель открыл страницу заказа' },
    ],
  },
  {
    id: 'GR-9K1M3P',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(), // 3.5 hours ago
    email: 'mikhail@barber-blade.ru',
    items: [
      {
        p: 'qr-morph',
        qr: { text: 'https://barber-blade.ru', shape: 'torus', themeId: 'obsidian-gold', modes: {} },
      },
    ],
    codesCount: 1,
    total: 1490,
    discount: 0,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f02',
    paymentProvider: 'yookassa',
    status: 'paid',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'vk_ads_target',
    note: 'QR для входной двери барбершопа',
    events: [
      { id: 'ev-1', time: '14:35', type: 'payment', text: 'Оплата 1 490 ₽ через СБП (ЮKassa)' },
      { id: 'ev-2', time: '14:35', type: 'email_sent', text: 'Письмо отправлено на mikhail@barber-blade.ru' },
      { id: 'ev-3', time: '14:38', type: 'link_opened', text: 'Код скопирован в буфер' },
    ],
  },
  {
    id: 'GR-4V8L2X',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // Yesterday
    email: 'artem@craft-brew.com',
    items: [
      {
        p: 'sale-timer',
        timer: {
          settings: {
            title: 'Фестиваль крафта в эти выходные',
            end: '2026-11-20T23:59:59',
            ctaText: 'Купить билет',
            ctaUrl: 'https://craft-brew.com/tickets',
            theme: 'neon',
            tz: 'Europe/Moscow',
          },
        },
      },
      {
        p: 'gift-box',
        gift: {
          settings: {
            kind: 'present',
            url: 'https://craft-brew.com/secret',
            caption: 'Подарок при заказе сета',
            trigger: 'hover',
            shape: 'sphere',
            pattern: 'festive',
          },
          mode: 'gold',
        },
      },
    ],
    codesCount: 2,
    total: 2490,
    discount: 490,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f03',
    paymentProvider: 'yookassa',
    status: 'paid',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'tilda_community',
    note: '',
    events: [
      { id: 'ev-1', time: 'Вчера 19:10', type: 'payment', text: 'Оплата 2 490 ₽ картой Мир' },
      { id: 'ev-2', time: 'Вчера 19:10', type: 'email_sent', text: 'Письмо отправлено на artem@craft-brew.com' },
    ],
  },
  {
    id: 'GR-3B5N8Y',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    email: 'hello@agency-pixels.pro',
    items: [
      { p: 'qr-morph', qr: { text: 'https://pixels.pro/client1', shape: 'tree', themeId: 'velvet-emerald', modes: {} } },
      { p: 'qr-card', card: { contact: { name: 'Pixels Lead', phone: '+7 999 111-22-33' }, hidden: [], mode: 'graphite', style: 'classic' } },
      { p: 'gift-box', gift: { settings: { kind: 'code', code: 'PROMO10' }, mode: 'festive' } },
      { p: 'voxel-logo', logo: { settings: { text: 'PIXELS', depth: 4 } } },
      { p: 'voxel-morph', morph: { settings: { beforeText: 'OLD', afterText: 'NEW' } } },
      { p: 'sale-timer', timer: { settings: { title: 'Акция' } } },
      { p: 'qr-morph', qr: { text: 'https://pixels.pro/client2', shape: 'island', themeId: 'ocean-drift', modes: {} } },
      { p: 'qr-card', card: { contact: { name: 'Client 2' }, hidden: [], mode: 'minimal', style: 'compact' } },
      { p: 'gift-box', gift: { settings: { kind: 'link', url: 'https://pixels.pro/bonus' } } },
      { p: 'sale-timer', timer: { settings: { title: 'Black Friday' } } },
    ],
    codesCount: 10,
    total: 8900,
    discount: 6000,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f04',
    paymentProvider: 'yookassa',
    status: 'paid',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'referral_studio',
    note: 'Веб-студия Pixels: взяли пакет 10 кодов для клиентских проектов на Тильде',
    events: [
      { id: 'ev-1', time: '10 ноя 12:00', type: 'payment', text: 'Оплата 8 900 ₽ (ЮKassa, Студийный пакет 10 кодов)' },
      { id: 'ev-2', time: '10 ноя 12:00', type: 'email_sent', text: 'Письмо отправлено на hello@agency-pixels.pro' },
      { id: 'ev-3', time: '10 ноя 12:15', type: 'link_opened', text: 'Все 10 кодов выгружены' },
    ],
  },
  {
    id: 'GR-1Z9P4W',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    email: 'katya.photo@mail.ru',
    items: [
      {
        p: 'qr-card',
        card: {
          contact: {
            name: 'Екатерина Власова',
            role: 'Свадебный фотограф',
            phone: '+7 911 555-44-33',
            email: 'katya.photo@mail.ru',
            site: 'vlasova-photo.ru',
          },
          hidden: [],
          mode: 'champagne',
          style: 'creative',
        },
      },
    ],
    codesCount: 1,
    total: 1490,
    discount: 0,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f05',
    paymentProvider: 'yookassa',
    status: 'paid',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'instagram',
    note: '',
    events: [
      { id: 'ev-1', time: '8 ноя 16:40', type: 'payment', text: 'Оплата 1 490 ₽ через СБП' },
      { id: 'ev-2', time: '8 ноя 16:40', type: 'email_sent', text: 'Письмо отправлено на katya.photo@mail.ru' },
    ],
  },
  {
    id: 'GR-6R2T7Q',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
    email: 'dmitry@loft-mebel.ru',
    items: [
      {
        p: 'qr-morph',
        qr: { text: 'https://loft-mebel.ru', shape: 'cube', themeId: 'graphite-neon', modes: {} },
      },
    ],
    codesCount: 1,
    total: 1490,
    discount: 0,
    paymentId: '2e4f8a12-000f-5000-9000-1b2c3d4e5f06',
    paymentProvider: 'yookassa',
    status: 'refunded',
    emailStatus: 'sent',
    orderUrl: '/thanks#order=demo',
    source: 'google_search',
    note: 'Клиент ошибся адресом сайта и переоформил новый заказ с правильным',
    events: [
      { id: 'ev-1', time: '6 ноя 11:15', type: 'payment', text: 'Оплата 1 490 ₽' },
      { id: 'ev-2', time: '6 ноя 11:15', type: 'email_sent', text: 'Письмо отправлено' },
      { id: 'ev-3', time: '6 ноя 14:20', type: 'refund', text: 'Возврат средств 1 490 ₽ (по просьбе клиента)' },
    ],
  },
];

const STORAGE_KEY = 'gridika_admin_orders_v1';
const AUTH_KEY = 'gridika_admin_token_v1';

// Calculate summary indicators
export function computeOrdersSummary(orders: AdminOrder[]): OrdersSummary {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  let revenueToday = 0;
  let revenue7d = 0;
  let revenue30d = 0;
  let revenueTotal = 0;
  let codesCount = 0;
  let paidOrdersCount = 0;

  const tierCounts = { single: 0, bundle: 0, studio: 0 };
  const productCounts: Record<string, number> = {};
  const alerts = { failedEmails: 0, refunds: 0, failedPayments: 0 };

  orders.forEach((o) => {
    const age = now - new Date(o.createdAt).getTime();

    if (o.status === 'refunded') {
      alerts.refunds += 1;
    }
    if (o.status === 'failed') {
      alerts.failedPayments += 1;
    }
    if (o.emailStatus === 'bounced') {
      alerts.failedEmails += 1;
    }

    if (o.status === 'paid') {
      paidOrdersCount += 1;
      revenueTotal += o.total;
      codesCount += o.codesCount;

      if (age <= dayMs) {
        revenueToday += o.total;
      }
      if (age <= 7 * dayMs) {
        revenue7d += o.total;
      }
      if (age <= 30 * dayMs) {
        revenue30d += o.total;
      }

      if (o.codesCount === 1) tierCounts.single += 1;
      else if (o.codesCount <= 6) tierCounts.bundle += 1;
      else tierCounts.studio += 1;

      o.items.forEach((it) => {
        const p = it.p || 'qr-morph';
        productCounts[p] = (productCounts[p] || 0) + 1;
      });
    }
  });

  const averageCheck = paidOrdersCount > 0 ? Math.round(revenueTotal / paidOrdersCount) : 0;

  return {
    revenueToday,
    revenue7d,
    revenue30d,
    revenueTotal,
    ordersCount: paidOrdersCount,
    codesCount,
    averageCheck,
    tierCounts,
    productCounts,
    alerts,
  };
}

// Format CSV for tax reporting and Excel
export function exportOrdersToCsv(orders: AdminOrder[]): string {
  const header = ['Номер', 'Дата', 'Email', 'Кодов', 'Сумма (₽)', 'Скидка (₽)', 'Статус', 'Провайдер', 'ID платежа', 'Эффекты', 'Заметка'];
  const rows = orders.map((o) => [
    o.id,
    new Date(o.createdAt).toLocaleString('ru-RU'),
    o.email,
    o.codesCount,
    o.total,
    o.discount,
    o.status === 'paid' ? 'Оплачен' : o.status === 'refunded' ? 'Возврат' : 'Ошибка',
    o.paymentProvider,
    o.paymentId,
    o.items.map((it) => it.p).join('+'),
    `"${(o.note || '').replace(/"/g, '""')}"`,
  ]);

  return [header.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
}

// Client-side storage helpers
export function loadAdminOrders(): AdminOrder[] {
  if (typeof window === 'undefined') return INITIAL_ADMIN_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_ORDERS));
      return INITIAL_ADMIN_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADMIN_ORDERS;
  } catch {
    return INITIAL_ADMIN_ORDERS;
  }
}

export function saveAdminOrders(orders: AdminOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save admin orders to localStorage', err);
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const token = sessionStorage.getItem(AUTH_KEY);
    return token === 'gridika_admin_authenticated';
  } catch {
    return false;
  }
}

export function setAuthenticated(val: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (val) sessionStorage.setItem(AUTH_KEY, 'gridika_admin_authenticated');
    else sessionStorage.removeItem(AUTH_KEY);
  } catch {}
}

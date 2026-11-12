/**
 * A sample order for previews (the email preview and /thanks#order=demo): three effects,
 * so the multi-effect layout is what you see.
 */
import type { OrderItem } from './purchase';

export const DEMO_ORDER_ID = 'GR-7Q4K2D';

export const DEMO_ORDER: OrderItem[] = [
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
        email: 'anna@example.com',
        site: 'example.com',
        telegram: 'gridika',
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
      settings: { kind: 'code', code: 'COFFEE20', percent: '20', url: 'https://zerno-coffee.ru', caption: 'Скидка 20% на первый заказ', trigger: 'click', shape: 'cube', pattern: 'plain' },
      mode: 'festive',
    },
  },
];

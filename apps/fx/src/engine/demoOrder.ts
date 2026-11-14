/**
 * A sample order for previews (the email preview and /thanks#order=demo): three effects,
 * so the multi-effect layout is what you see.
 */
import type { OrderItem } from './purchase';

export const DEMO_ORDER_ID = 'GR-7Q4K2D';

export const DEMO_ORDER: OrderItem[] = [
  {
    p: 'qr-morph',
    qr: { text: 'https://gridika.ru', shape: 'castle', themeId: 'velvet-emerald', modes: { castle: 'day' } },
  },
  {
    p: 'qr-card',
    card: {
      contact: {
        name: 'Александр Волков',
        role: 'Арт-директор',
        company: 'Gridika Design',
        phone: '+7 900 123-45-67',
        email: 'alex@gridika.ru',
        site: 'gridika.ru',
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
      settings: { kind: 'code', code: 'GRIDIKA2026', percent: '25', url: 'https://gridika.ru', caption: 'Скидка 25% на заказ', trigger: 'click', shape: 'cube', pattern: 'plain' },
      mode: 'festive',
    },
  },
  {
    p: 'sale-timer',
    timer: {
      settings: { date: '2026-12-31', time: '23:59', tz: 3, format: 'dhms', title: 'До конца распродажи', buttonText: 'Купить со скидкой', buttonUrl: 'https://gridika.ru', endAction: 'text', endText: 'Акция началась!', endUrl: '', endType: 'date', hours: 24 },
      mode: 'sale',
    },
  },
  {
    p: 'voxel-morph',
    morph: {
      data: { res: 48, a: { w: 48, h: 36, cols: ['#19c37d'] }, b: { w: 48, h: 36, cols: ['#f59e0b'] } },
      settings: { res: 48, mode: 'wave', control: 'slider', depth: 'flat', speed: 'normal', labelA: 'До', labelB: 'После', labelStyle: 'dark' },
    },
  },
  {
    p: 'voxel-logo',
    logo: {
      data: { w: 16, h: 16, cols: ['#19c37d'] },
      settings: { w: 16, h: 16 },
      mode: 'spin',
    },
  },
];

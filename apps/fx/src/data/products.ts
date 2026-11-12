/**
 * Gridika product lineup. One source for the studio tabs and the catalog cards.
 * Everything except 3D QR is planned (see PRODUCTS.md in the repo root for the full specs).
 */

export type ProductId = 'qr-morph' | 'qr-card' | 'gift-box' | 'voxel-logo' | 'voxel-morph' | 'sale-timer';

export type ProductCategory = 'all' | 'qr' | 'sales' | 'brand';

export interface Product {
  id: ProductId;
  number: string;
  /** short tab label */
  label: string;
  title: string;
  tagline: string;
  /** what the visitor sees and does */
  bullets: string[];
  /** planned modes / looks */
  modes: string[];
  /** what one key includes (pricing cards) */
  unit: string;
  tildaBlock: string;
  category: ProductCategory[];
  ready: boolean;
  /** brand colour of the product: wave blob, accents across the page */
  theme: ProductTheme;
  /** wave blob outline (same command structure for every product so it can morph) */
  wave: string;
}

export interface ProductTheme {
  accent: string;
  /** gradient end of the blob */
  deep: string;
  /** text colour on the accent */
  on: string;
  /** pale tint for chips and the page glow */
  soft: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'qr-morph',
    number: '01',
    label: '3D QR',
    title: '3D QR-Морфинг',
    tagline: 'QR-код, который превращается в живую 3D-сцену и всегда сканируется',
    bullets: [
      'Сверху — обычный QR, сбоку — дерево, город, остров, сад, эквалайзер, торт или замок',
      'Плавный переход камеры, у каждой формы свои режимы',
      'Гарантированно считывается камерой смартфона',
    ],
    modes: ['7 форм', 'по 3 режима у каждой'],
    unit: 'Любые ссылки и формы на вашем сайте',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'qr'],
    ready: true,
    theme: { accent: '#19C37D', deep: '#132A22', on: '#132A22', soft: '#DFF8EB' },
    wave: 'M 0,0 L 310,0 C 370,0 430,35 440,110 C 450,175 365,205 325,270 C 290,325 305,385 340,435 C 385,495 440,530 420,580 C 400,620 340,620 280,620 L 0,620 Z',
  },
  {
    id: 'qr-card',
    number: '02',
    label: 'Визитка с QR',
    title: 'Визитка с QR',
    tagline: 'Объёмная визитка, на обороте — QR, который сохраняет контакт',
    bullets: [
      'Лицевая сторона: имя, роль и ссылки на воксельной карточке, наклоняется за курсором',
      'По клику карточка переворачивается, на обороте собирается 3D QR с vCard',
      'Навели камеру — контакт сразу сохранён в телефон',
    ],
    modes: ['7 дизайнов', '8 цветов'],
    unit: '1 ключ = 1 визитка (один человек)',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'qr', 'brand'],
    ready: true,
    theme: { accent: '#5b6b82', deep: '#161b24', on: '#F4F1EC', soft: '#e3e8ef' },
    wave: 'M 0,0 L 340,0 C 400,0 440,60 420,140 C 400,210 330,230 320,300 C 310,360 360,390 390,450 C 420,510 430,560 400,595 C 380,620 330,620 290,620 L 0,620 Z',
  },
  {
    id: 'gift-box',
    number: '03',
    label: 'Подарок',
    title: 'Подарок с промокодом',
    tagline: 'Воксельная коробка открывается, внутри собирается скидка или QR-купон',
    bullets: [
      'Коробка с бантом слегка покачивается и зовёт нажать',
      'По клику крышка подлетает, лента развязывается, вылетает конфетти',
      'Из коробки собирается промокод, процент скидки или QR-купон',
    ],
    modes: ['Праздник', 'Крафт', 'Чёрная пятница'],
    unit: 'Любые промокоды и акции на вашем сайте',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'sales', 'qr'],
    ready: true,
    theme: { accent: '#e5484d', deep: '#4f1216', on: '#FFF5F2', soft: '#fde3e1' },
    wave: 'M 0,0 L 280,0 C 350,0 400,20 420,80 C 445,150 400,200 360,250 C 320,300 290,360 320,420 C 350,480 445,520 430,575 C 418,615 360,620 300,620 L 0,620 Z',
  },
  {
    id: 'voxel-logo',
    number: '04',
    label: '3D-логотип',
    title: '3D-логотип из вокселей',
    tagline: 'Логотип клиента раскладывается на воксели и собирается в объёмный знак',
    bullets: [
      'Загружаете PNG или SVG — логотип превращается в объёмный воксельный знак',
      'Кубики слетаются и собирают знак, когда блок появляется на экране',
      'При наведении рассыпается и снова собирается, бугорок бежит за курсором',
    ],
    modes: ['6 эффектов', 'Глянец · Металлик · Неон…'],
    unit: '1 ключ = 1 логотип',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'brand'],
    ready: true,
    theme: { accent: '#8b5cf6', deep: '#22114a', on: '#F7F3FF', soft: '#ece4ff' },
    wave: 'M 0,0 L 320,0 C 390,0 445,50 430,130 C 418,195 340,215 310,285 C 285,345 320,400 365,445 C 410,490 450,540 425,585 C 405,620 345,620 290,620 L 0,620 Z',
  },
  {
    id: 'voxel-morph',
    number: '05',
    label: 'Морф до/после',
    title: 'Морф «до / после»',
    tagline: 'Картинка «до» рассыпается на воксели и собирается в «после»',
    bullets: [
      'Две фотографии: «до» и «после» — ремонт, фигура, дизайн, авто',
      'Ползунок, прокрутка или автоплей: кубики пересобирают одну картинку в другую',
      'Объёмный эффект вместо привычной плоской шторки',
    ],
    modes: ['Волна', 'Взрыв', 'Пиксель'],
    unit: '1 ключ = 1 пара фото · пакеты 5 и 15 пар',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'sales', 'brand'],
    ready: true,
    theme: { accent: '#e0568a', deep: '#47112e', on: '#FFF4F8', soft: '#fce1ec' },
    wave: 'M 0,0 L 300,0 C 360,0 420,25 435,95 C 448,160 390,200 345,260 C 300,320 285,380 330,430 C 375,480 435,515 425,570 C 415,615 350,620 285,620 L 0,620 Z',
  },
  {
    id: 'sale-timer',
    number: '06',
    label: 'Таймер акции',
    title: 'Таймер акции',
    tagline: 'Обратный отсчёт из воксельных цифр, которые пересыпаются каждую секунду',
    bullets: [
      'Дни, часы, минуты и секунды собраны из кубиков',
      'Каждую секунду цифра рассыпается и собирается в новую',
      'В конце отсчёта — вспышка и надпись «Акция началась» или «Успейте»',
    ],
    modes: ['Распродажа', 'Запуск', 'Новый год'],
    unit: 'Любые даты и акции на вашем сайте',
    tildaBlock: 'Tilda (T123) и любой сайт',
    category: ['all', 'sales'],
    ready: true,
    theme: { accent: '#f5a524', deep: '#4a2a06', on: '#2a1a05', soft: '#fdefd2' },
    wave: 'M 0,0 L 330,0 C 385,0 425,45 430,120 C 435,185 350,215 315,280 C 285,335 310,395 350,440 C 395,490 445,535 420,582 C 400,620 335,620 275,620 L 0,620 Z',
  },
];

export const productById = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;

/** Paint the whole page in the product's colours (CSS variables registered in Layout.astro). */
export function applyProductTheme(id: ProductId) {
  if (typeof document === 'undefined') return;
  const { theme } = productById(id);
  const root = document.documentElement.style;
  root.setProperty('--vx-accent', theme.accent);
  root.setProperty('--vx-deep', theme.deep);
  root.setProperty('--vx-on', theme.on);
  root.setProperty('--vx-soft', theme.soft);
}

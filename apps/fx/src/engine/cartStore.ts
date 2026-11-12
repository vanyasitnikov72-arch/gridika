/**
 * Cart Store for Multi-Effect Orders in Gridika Studio.
 * Persists in localStorage and provides reactive subscriptions.
 */
import type { PurchaseConfig } from './purchase';
import { PRODUCTS, type ProductId } from '../data/products';

export interface CartItem {
  id: string;
  productId: ProductId;
  title: string;
  subtitle: string;
  theme: {
    accent: string;
    deep: string;
    soft: string;
  };
  config: PurchaseConfig;
  addedAt: number;
}

const STORAGE_KEY = 'gridika_cart_v1';

let listeners: Array<(items: CartItem[]) => void> = [];

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  notify(items);
}

export function subscribeCart(listener: (items: CartItem[]) => void): () => void {
  listeners.push(listener);
  // initial call
  listener(getCart());
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify(items: CartItem[]): void {
  listeners.forEach((l) => {
    try {
      l(items);
    } catch (e) {
      console.error('Cart listener error', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gridika:cart-updated', { detail: { items } }));
  }
}

export function generateCartSubtitle(config: PurchaseConfig): string {
  const p = config.p;
  if (p === 'qr-morph' && config.qr) {
    const shapeMap: Record<string, string> = {
      tree: 'Дерево',
      city: 'Мегаполис',
      island: 'Остров',
      maze: 'Сад-лабиринт',
      equalizer: 'Эквалайзер',
      cake: 'Торт',
      castle: 'Замок',
    };
    return `${shapeMap[config.qr.shape] || 'Форма 3D'} · ${config.qr.text.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 28)}`;
  }
  if (p === 'qr-card' && config.card) {
    const name = config.card.contact.name || config.card.contact.company || 'Визитка';
    const styles: Record<string, string> = { classic: 'Классика', minimal: 'Минимал', pixel: 'Пиксели', wave: 'Волна', split: 'Две части', diagonal: 'Диагональ', grid: 'Чертёж' };
    return `${name} · ${styles[config.card.style] || 'Классика'}`;
  }
  if (p === 'gift-box' && config.gift) {
    const g = config.gift.settings;
    const what = g.kind === 'percent' ? `Скидка ${g.percent || 10}%` : g.kind === 'qr' ? 'QR-купон' : `Промокод ${g.code || 'GRID20'}`;
    return `${what} · ${g.shape === 'tall' ? 'высокая' : g.shape === 'flat' ? 'плоская' : 'кубическая'} коробка`;
  }
  if (p === 'voxel-logo') {
    const looks: Record<string, string> = { gloss: 'Глянец', matte: 'Матовый', chrome: 'Металлик', pearl: 'Перламутр', toon: 'Мультяшный', neon: 'Неон' };
    const l = config.logo;
    return l ? `${looks[l.mode] || 'Глянец'} · ${l.data.w}×${l.data.h} кубиков` : '3D-логотип из вокселей';
  }
  if (p === 'voxel-morph') {
    const modes: Record<string, string> = { wave: 'Волна', burst: 'Взрыв', pixel: 'Пиксель', spiral: 'Спираль', rain: 'Дождь', mosaic: 'Мозаика' };
    const m = config.morph;
    return m ? `${modes[m.settings.mode] || 'Волна'} · ${m.settings.control === 'auto' ? 'сам' : m.settings.control === 'scroll' ? 'прокрутка' : 'ползунок'}` : 'Морф «до / после»';
  }
  if (p === 'sale-timer' && config.timer) {
    const t = config.timer.settings;
    if (t.endType === 'personal') return `${t.title || 'Таймер'} · ${t.hours || 24} ч у каждого`;
    const [y, mo, d] = (t.date || '').split('-');
    return `${t.title || 'Таймер'} · до ${d && mo ? `${+d}.${mo}` : '—'} ${t.time || ''}`.trim();
  }
  return 'Интерактивный 3D-блок';
}

/** Adds a new item to the order (an order may hold several codes of the same effect). */
export function addToCart(config: PurchaseConfig): CartItem {
  const cart = getCart();
  const d = describeOrderItem(config);
  const newItem: CartItem = {
    id: 'ci_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    productId: config.p,
    title: d.title,
    subtitle: d.subtitle,
    theme: d.theme,
    config,
    addedAt: Date.now(),
  };
  cart.push(newItem);
  saveCart(cart);
  return newItem;
}

/** Replaces the settings of one item (the studio edits it live); returns null if it is gone. */
export function updateCartItem(id: string, config: PurchaseConfig): CartItem | null {
  const cart = getCart();
  const idx = cart.findIndex((it) => it.id === id);
  if (idx < 0) return null;
  const d = describeOrderItem(config);
  cart[idx] = { ...cart[idx], productId: config.p, title: d.title, subtitle: d.subtitle, theme: d.theme, config };
  saveCart(cart);
  return cart[idx];
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((it) => it.id !== id);
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function isProductInCart(productId: ProductId): boolean {
  return getCart().some((it) => it.productId === productId);
}

/** title, one-line summary and colours of an effect in an order (cart, thanks page, email) */
export function describeOrderItem(config: Omit<PurchaseConfig, 'site'>): { title: string; subtitle: string; theme: { accent: string; deep: string; soft: string } } {
  const prod = PRODUCTS.find((p) => p.id === config.p);
  const t = prod?.theme || { accent: '#19C37D', deep: '#132A22', soft: '#DFF8EB' };
  return {
    title: prod?.title || '3D-эффект',
    subtitle: generateCartSubtitle({ site: '', ...config } as PurchaseConfig),
    theme: { accent: t.accent, deep: t.deep, soft: t.soft },
  };
}

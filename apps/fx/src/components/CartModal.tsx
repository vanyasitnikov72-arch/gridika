import { useState, useEffect, useRef } from 'preact/hooks';
import type { CartItem } from '../engine/cartStore';
import { ProductPreview } from './ProductPreview';
import { orderPrice, nextCodeHint, codes, rub, PRICE_ONE } from '../engine/pricing';
import { ordersApi } from '../data/api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onEditItem: (item: CartItem) => void;
  /** another code of the same effect (a copy, opened in the studio) */
  onDuplicateItem?: (item: CartItem) => void;
  /** the item the studio is editing right now */
  editingId?: string;
  onAddCurrentToCart?: () => void;
  currentProductTitle?: string;
  isCurrentInCart?: boolean;
}

/** the order price for `count` codes (see engine/pricing.ts) */
export const calculateCartTotal = orderPrice;

const EXIT_MS = 220;

export function CartModal({ isOpen, onClose, items, onRemoveItem, onEditItem, onDuplicateItem, editingId, onAddCurrentToCart, currentProductTitle, isCurrentInCart }: CartModalProps) {
  const [email, setEmail] = useState('');
  // kept mounted for the closing animation
  const [mounted, setMounted] = useState(isOpen);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    } else if (mounted) {
      setShown(false);
      const t = window.setTimeout(() => setMounted(false), EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // while open: the page underneath does not scroll, Esc closes, focus moves into the window
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, pad: html.style.paddingRight };
    html.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const focusT = window.setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 30);
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pad;
      document.removeEventListener('keydown', key);
      clearTimeout(focusT);
    };
  }, [isOpen]);

  if (!mounted) return null;

  const count = items.length;
  const { total, discount, rawTotal } = orderPrice(count);
  const hint = nextCodeHint(count);
  // several codes of one effect get a number: «3D QR-Морфинг · 2»
  const seen: Record<string, number> = {};
  const totals: Record<string, number> = {};
  items.forEach((it) => (totals[it.productId] = (totals[it.productId] || 0) + 1));
  const numbered = items.map((it) => {
    seen[it.productId] = (seen[it.productId] || 0) + 1;
    return totals[it.productId] > 1 ? `${it.title} · ${seen[it.productId]}` : it.title;
  });
  const removeWithFade = (id: string) => {
    setLeaving(id);
    window.setTimeout(() => {
      onRemoveItem(id);
      setLeaving(null);
    }, 200);
  };
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Укажите корректный email для отправки кода и чека');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const apiUrl = (typeof window !== 'undefined' && (window as any).GRIDIKA_API_URL) || ordersApi('create-payment') || '/api/create-payment';
      const cleanItems = items.map((it) => it.config);

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          items: cleanItems,
          source: typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('utm_source') || 'direct') : 'direct',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.description || errData.message || errData.error || `Ошибка платежного шлюза (${res.status})`);
      }

      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      throw new Error('ЮKassa не вернула ссылку на оплату');
    } catch (err: any) {
      console.warn('Payment API error:', err);
      setErrorMsg(err.message || 'Не удалось связаться с платежным шлюзом. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-[background-color,backdrop-filter] duration-200 ${
        shown ? 'bg-[#132A22]/45 backdrop-blur-[3px]' : 'bg-transparent backdrop-blur-0'
      }`}
      onPointerDown={(e) => {
        // a click on the dimmed backdrop (not inside the window) closes it
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ваш заказ"
        tabIndex={-1}
        className={`relative w-full max-w-full sm:max-w-[560px] max-h-[92dvh] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white sm:border border-[#e5dfd2] rounded-t-[2rem] sm:rounded-[2.25rem] shadow-[0_30px_80px_-24px_rgba(19,42,34,0.45)] flex flex-col text-[#132A22] outline-none [scrollbar-width:thin] transition-[opacity,transform] duration-200 ease-out ${
          shown ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-6 sm:translate-y-2 sm:scale-[0.97]'
        }`}
      >
        {/* grab handle on phones */}
        <div className="sm:hidden flex justify-center pt-2.5" aria-hidden="true">
          <span className="w-10 h-1 rounded-full bg-[#e5dfd2]" />
        </div>

        {/* header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 sm:px-7 pt-4 sm:pt-6 pb-3.5 sm:pb-4 flex items-start justify-between gap-3 sm:gap-4 border-b border-[#f0ebe2]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] sm:text-2xl font-black tracking-tight">Ваш заказ</h3>
              {count > 0 && (
                <span className="px-2 sm:px-2.5 h-5.5 sm:h-6 inline-flex items-center rounded-full bg-[var(--vx-soft)] text-[var(--vx-deep)] text-[11px] sm:text-[11.5px] font-black">{codes(count)}</span>
              )}
            </div>
            <p className="text-[11.5px] sm:text-[12px] text-[#78716c] mt-0.5 sm:mt-1 font-semibold leading-tight">Готовый код для Tilda и любого сайта. Купили — и он ваш.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#f3efe7] hover:bg-[#e8e2d5] text-[#132A22] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-7 pt-4 pb-6 flex flex-col gap-4">
          {count === 0 ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--vx-soft)] flex items-center justify-center mb-3" aria-hidden="true">
                <svg className="w-6 h-6 text-[var(--vx-deep)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
                  <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
                  <path d="M4 7.5 12 12l8-4.5M12 12v9" />
                </svg>
              </div>
              <h4 className="text-base font-black">В заказе пока пусто</h4>
              <p className="text-[12.5px] text-[#78716c] max-w-xs mt-1 leading-relaxed font-semibold">Настройте эффект в студии и нажмите «В заказ».</p>
              {onAddCurrentToCart && currentProductTitle && (
                <button
                  type="button"
                  onClick={onAddCurrentToCart}
                  className="mt-5 h-11 px-5 rounded-full bg-[#132A22] hover:bg-[#1d3a2f] text-white font-black text-[13px] transition-colors active:scale-[0.97] cursor-pointer"
                >
                  Добавить «{currentProductTitle}»
                </button>
              )}
            </div>
          ) : (
            <>
              {/* the effects */}
              <ul className="flex flex-col gap-2">
                {items.map((item, idx) => (
                  <li
                    key={item.id}
                    className={`group p-2.5 sm:p-3 pr-2 sm:pr-2.5 rounded-2xl bg-[#faf7f2] border border-[#efe9de] flex items-center gap-2 sm:gap-3 transition-[opacity,transform,border-color] duration-200 hover:border-[#e2dacb] ${
                      leaving === item.id ? 'opacity-0 -translate-x-3' : 'opacity-100'
                    }`}
                  >
                    <span
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[14px] flex items-center justify-center shrink-0 shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]"
                      style={`background:linear-gradient(135deg,${item.theme.accent},${item.theme.deep})`}
                      aria-hidden="true"
                    >
                      <ProductPreview id={item.productId} className="w-5 h-5 sm:w-6 sm:h-6" float={false} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] sm:text-[14px] font-black truncate leading-tight flex items-center gap-1.5">
                        <span className="truncate">{numbered[idx]}</span>
                        {editingId === item.id && (
                          <span className="shrink-0 px-1.5 h-[18px] inline-flex items-center rounded-full bg-[var(--vx-soft)] text-[var(--vx-deep)] text-[9px] sm:text-[9.5px] font-black uppercase tracking-wide">в студии</span>
                        )}
                      </h4>
                      <p className="text-[11px] sm:text-[12px] font-semibold text-[#78716c] truncate mt-0.5">{item.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      aria-label={`Изменить «${item.title}» в студии`}
                      className="h-7 sm:h-8 px-2 sm:px-3 rounded-full bg-white border border-[#e5dfd2] hover:border-[#132A22] hover:bg-[#132A22] hover:text-white text-[#44403c] text-[11px] sm:text-[11.5px] font-extrabold transition-colors cursor-pointer shrink-0"
                    >
                      Изменить
                    </button>
                    {onDuplicateItem && (
                      <button
                        type="button"
                        onClick={() => onDuplicateItem(item)}
                        aria-label={`Ещё один «${item.title}» — копия, которую можно изменить`}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#78716c] hover:text-[#132A22] hover:bg-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                          <path d="M11 2.5H4.5a2 2 0 0 0-2 2V11" />
                          <path d="M9.25 7.5v4M7.25 9.5h4" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeWithFade(item.id)}
                      aria-label={`Убрать «${item.title}» из заказа`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#a8a29e] hover:text-[#be3a52] hover:bg-[#fdecef] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
                        <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 -mt-1 px-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[12.5px] font-black text-[var(--vx-deep)] hover:underline underline-offset-4 cursor-pointer"
                >
                  + Добавить ещё эффект
                </button>
                {onAddCurrentToCart && !isCurrentInCart && currentProductTitle && (
                  <button type="button" onClick={onAddCurrentToCart} className="text-[12px] font-bold text-[#78716c] hover:text-[#132A22] cursor-pointer">
                    + «{currentProductTitle}» из студии
                  </button>
                )}
              </div>

              {/* total */}
              <div className="rounded-2xl border border-[#efe9de] overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between text-[13px] font-semibold text-[#57534e]">
                  <span>{codes(count)} × {rub(PRICE_ONE)}</span>
                  <span className={discount > 0 ? 'line-through text-[#a8a29e]' : ''}>{rub(rawTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="px-4 pb-3 -mt-1 flex items-center justify-between text-[13px] font-extrabold text-[#15803d]">
                    <span>{count > 6 ? 'Скидка за пакет' : 'Скидка за комплект'}</span>
                    <span>−{rub(discount)}</span>
                  </div>
                )}
                <div className="px-4 py-3.5 bg-[#f6f2ea] flex items-center justify-between">
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#78716c]">Итого</span>
                  <span className="text-[26px] font-black tracking-tight tabular-nums">{rub(total)}</span>
                </div>
              </div>
              {hint && (
                <p className="-mt-1.5 px-1 text-[12px] font-bold text-[#15803d] leading-snug">
                  {hint}. Нужно несколько одинаковых эффектов с разными ссылками — нажмите{' '}
                  <svg className="inline w-3 h-3 -mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
                    <path d="M11 2.5H4.5a2 2 0 0 0-2 2V11" />
                  </svg>{' '}
                  у эффекта.
                </p>
              )}

              {/* checkout */}
              <div className="flex flex-col gap-2.5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#a8a29e] pl-1">Почта для кода и чека</span>
                  <input
                    type="email"
                    value={email}
                    maxLength={120}
                    autoComplete="email"
                    onInput={(e) => {
                      setEmail((e.target as HTMLInputElement).value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="ivan@yandex.ru"
                    className={`w-full h-12 px-4 rounded-2xl bg-[#faf7f2] border text-[14px] font-semibold outline-none transition-colors ${
                      errorMsg ? 'border-red-400 bg-red-50/20' : 'border-[#e5dfd2] focus:border-[var(--vx-accent)] focus:bg-white'
                    }`}
                  />
                </label>

                {errorMsg && (
                  <p className="px-1 text-[12px] font-bold text-red-500 leading-snug">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="h-12 rounded-full bg-[#132A22] hover:bg-[#1f4235] text-white font-black text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {loading ? (
                    <span>Создаём заказ...</span>
                  ) : (
                    <>
                      <span>Оплатить {rub(total)}</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11.5px] font-semibold text-[#a8a29e] leading-snug">Разовая оплата, без подписки. Код сразу на экране и на почте.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import type { CartItem } from '../engine/cartStore';
import { calculateCartTotal } from './CartModal';

interface CartFloatingPillProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export function CartFloatingPill({ items, onOpenCart }: CartFloatingPillProps) {
  if (items.length === 0) return null;

  const count = items.length;
  const { total } = calculateCartTotal(count);

  return (
    <aside
      aria-label="Корзина заказов"
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <button
        type="button"
        onClick={onOpenCart}
        className="h-12 pl-4 pr-5 rounded-full bg-[#132A22]/95 hover:bg-[#1a382d] text-white border border-[#19C37D]/40 shadow-[0_12px_32px_-8px_rgba(19,42,34,0.65)] hover:shadow-[0_16px_36px_-6px_rgba(25,195,125,0.4)] backdrop-blur-md flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer select-none group"
      >
        <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[var(--vx-accent)] text-[#132A22] text-xs font-black shrink-0 shadow-sm">
          {count}
          <span className="absolute -inset-1 rounded-full bg-[var(--vx-accent)] opacity-40 animate-ping pointer-events-none" />
        </span>

        <div className="flex items-baseline gap-2 text-xs sm:text-[13px] font-black">
          <span className="text-[#F0EBE9]">В заказе:</span>
          <span className="text-[var(--vx-accent)]">{total.toLocaleString('ru-RU')} ₽</span>
        </div>

        <span className="text-white/40 font-light">|</span>

        <span className="text-xs sm:text-[13px] font-black text-white group-hover:text-[var(--vx-accent)] flex items-center gap-1 transition-colors">
          Оформить заказ
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </button>
    </aside>
  );
}

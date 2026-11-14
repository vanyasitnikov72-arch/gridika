import type { WidgetSize } from '../engine/purchase';
import { WIDGET_SIZE_MAP } from '../engine/purchase';
import type { ProductId } from '../data/products';

export function SizePill({
  size,
  onChange,
  productId,
}: {
  size: WidgetSize;
  onChange: (s: WidgetSize) => void;
  productId: ProductId;
}) {
  const pixelMap = WIDGET_SIZE_MAP[productId] || { s: 360, m: 480, l: 640 };
  const items: { id: WidgetSize; label: string; px: number }[] = [
    { id: 's', label: 'S', px: pixelMap.s },
    { id: 'm', label: 'M', px: pixelMap.m },
    { id: 'l', label: 'L', px: pixelMap.l },
  ];

  return (
    <div className="h-7 p-0.5 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_4px_14px_rgba(85,70,50,0.06)] backdrop-blur-md select-none flex items-center gap-1 shrink-0">
      <span className="text-[9px] font-black uppercase tracking-wider text-[#a8a29e] pl-2 pr-0.5">Размер:</span>
      <div className="flex items-center gap-0.5">
        {items.map((it) => {
          const on = size === it.id;
          return (
            <button
              key={it.id}
              type="button"
              title={`${it.label} · ${it.px} px`}
              onClick={() => onChange(it.id)}
              className={`h-[22px] px-2 rounded-full text-[10.5px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                on
                  ? 'bg-[#132A22] text-white shadow-sm'
                  : 'text-[#78716c] hover:text-[#132A22] hover:bg-[#f6f3ee]'
              }`}
            >
              <span>{it.label}</span>
              <span className={`text-[8.5px] font-mono font-medium ${on ? 'text-white/70' : 'text-[#a8a29e]'}`}>
                {it.px}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

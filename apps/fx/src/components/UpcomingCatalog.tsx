import { PRODUCTS, type ProductId } from '../data/products';
import { ProductPreview } from './ProductPreview';

/**
 * «Линейка» — compact roadmap of the product lineup in release order.
 * Products are chosen in the studio; each step here opens its product there.
 */

function openInStudio(id: ProductId) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('fx:select-product', { detail: { productId: id } }));
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('fx', id);
    window.history.replaceState({}, '', url.toString());
  } catch {}
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function UpcomingCatalog() {
  const ready = PRODUCTS.filter((p) => p.ready).length;
  return (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.14em] bg-[var(--vx-soft)] text-[#132A22]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vx-accent)]" />
          Линейка
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-[#132A22] tracking-tight leading-[1.08]">
          Шесть эффектов <br className="hidden sm:inline" />
          <span className="text-[var(--vx-accent)]">в одном стиле</span>
        </h2>
        <p className="mt-3 text-[#6b645c] text-sm sm:text-[15px] font-semibold leading-relaxed">
          Готово {ready} из {PRODUCTS.length}. Остальные выходят по очереди — у каждого свой цвет, как волна в студии.
        </p>
      </div>

      <ol className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* progress line behind the steps (desktop) */}
        <span aria-hidden="true" className="hidden lg:block absolute left-[8%] right-[8%] top-[3.25rem] h-[3px] rounded-full bg-[#e9e3d7]" />
        <span
          aria-hidden="true"
          className="hidden lg:block absolute left-[8%] top-[3.25rem] h-[3px] rounded-full"
          style={{ width: `${(Math.max(ready - 0.5, 0.5) / PRODUCTS.length) * 84}%`, background: 'var(--vx-accent)' }}
        />

        {PRODUCTS.map((p) => (
          <li key={p.id} className="relative">
            <button
              type="button"
              onClick={() => openInStudio(p.id)}
              className="group w-full h-full text-left rounded-[1.75rem] bg-white border border-[#e9e3d7] p-4 pt-3 shadow-[0_14px_30px_-22px_rgba(85,70,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-22px_rgba(85,70,50,0.45)] cursor-pointer flex flex-col"
            >
              {/* drop with the product colour */}
              <span
                className="relative z-10 w-[4.25rem] h-[4.25rem] mx-auto flex items-center justify-center rounded-[46%_54%_52%_48%/55%_48%_52%_45%] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
                style={{ background: `linear-gradient(140deg, ${p.theme.accent}, ${p.theme.deep})` }}
              >
                <ProductPreview id={p.id} className="w-11 h-11" float={false} />
              </span>
              <span className="mt-3 flex items-center justify-between gap-1">
                <span className="font-mono text-[10px] font-bold text-[#a8a29e]">{p.number}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                  style={p.ready ? { background: p.theme.accent, color: p.theme.on } : { background: p.theme.soft, color: '#57534e' }}
                >
                  {p.ready ? 'Готово' : 'Скоро'}
                </span>
              </span>
              <span className="mt-1.5 text-[15px] font-black text-[#132A22] leading-tight">{p.label}</span>
              <span className="mt-1 text-[11.5px] font-semibold text-[#78716c] leading-snug line-clamp-3">{p.tagline}</span>
              <span className="mt-auto pt-3 text-[11px] font-extrabold text-[#132A22] opacity-0 group-hover:opacity-100 transition-opacity">
                {p.ready ? 'Настроить ↑' : 'Посмотреть ↑'}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

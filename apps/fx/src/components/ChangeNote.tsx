/**
 * "Want to change something?" — shown next to the bought code (studio and thanks page).
 * Plain text in the code (titles, captions, button text and links) is edited right there;
 * what is built from cubes (QR, promo code, logo, photos) is a new code from the studio.
 * Static markup: works as a Preact component in the studio and as plain HTML in Astro pages.
 */
export const CHANGE_STEPS = [
  { t: 'Текст — прямо в коде', d: 'Заголовки, подписи, текст и ссылки кнопок лежат в коде обычным текстом в кавычках: найдите (Ctrl+F) и замените.' },
  { t: 'QR, промокод, логотип — в студии', d: 'Они собраны из кубиков. «Изменить в студии» у кода — настройки откроются как были, поменяйте и оформите новый код.' },
  { t: 'Замените код на сайте', d: 'В том же HTML-блоке удалите старый код и вставьте новый, затем опубликуйте.' },
];

export function ChangeNote({ compact = false }: { compact?: boolean }) {
  const steps = CHANGE_STEPS;
  return (
    <div className={`rounded-2xl border border-[#ece6da] bg-white ${compact ? 'p-3.5' : 'p-4'}`}>
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 shrink-0 rounded-xl bg-[#FFF4DB] text-[#B7791F] flex items-center justify-center" aria-hidden="true">
          <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-black text-[#132A22] leading-tight">Захотели что-то поменять?</div>
          <div className="text-[11.5px] font-semibold text-[#6b645c] leading-snug">Текст можно поправить прямо в коде. Только то, что собрано из кубиков (QR, промокод, логотип), меняется в студии.</div>
        </div>
      </div>
      <ol className="mt-3 flex flex-col gap-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="w-5 h-5 shrink-0 rounded-full bg-[#132A22] text-white text-[10px] font-black flex items-center justify-center mt-px">{i + 1}</span>
            <span className="text-[12px] leading-snug text-[#6b645c] font-semibold">
              <b className="text-[#132A22] font-extrabold">{s.t}.</b> {s.d}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 rounded-xl bg-[#DFF8EB] px-3 py-2 text-[11.5px] font-bold text-[#14532d] leading-snug">
        Купленный код ваш навсегда: без подписки и привязки к сайту, а ссылка из письма не сгорает.
      </div>
    </div>
  );
}

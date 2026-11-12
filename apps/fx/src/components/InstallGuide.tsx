import { useState } from 'preact/hooks';
import { CHANGE_STEPS } from './ChangeNote';

/** Where to paste the code: short guides per platform, shown under the code. */

type Platform = 'tilda' | 'wordpress' | 'webflow' | 'wix' | 'html' | 'change';

const TABS: { id: Platform; label: string }[] = [
  { id: 'tilda', label: 'Tilda' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'webflow', label: 'Webflow' },
  { id: 'wix', label: 'Wix' },
  { id: 'html', label: 'HTML' },
  { id: 'change', label: 'Как изменить' },
];

export function InstallGuide({ height }: { height: number }) {
  const [tab, setTab] = useState<Platform>('tilda');
  const steps: Record<Exclude<Platform, 'change'>, string[]> = {
    tilda: [
      'В редакторе страницы: «Все блоки» → «Другое» → «HTML-код» (блок T123).',
      'Вставьте код, сохраните и опубликуйте страницу.',
      'Блок T123 доступен на платных тарифах Тильды (Personal и Business).',
    ],
    wordpress: [
      'В редакторе страницы добавьте блок «Произвольный HTML» (Custom HTML).',
      'В Elementor — виджет «HTML». Вставьте код и обновите страницу.',
    ],
    webflow: [
      'Перетащите на страницу элемент Code Embed и вставьте код.',
      'Сохраните и опубликуйте. Встраивание кода доступно на платных планах Webflow.',
    ],
    wix: [
      '«Добавить» → «Встроить код» → «Встроить HTML», режим «Код».',
      `Вставьте код и растяните блок по высоте эффекта — примерно ${height} px.`,
    ],
    html: [
      'Вставьте код внутрь <body> в то место страницы, где должен быть эффект. Больше ничего подключать не нужно.',
      'Сайт на React, Vue, Next.js: вставляйте код в HTML-шаблон страницы, а не как HTML-строку в компонент — иначе скрипты не запустятся.',
    ],
  };

  return (
    <div className="rounded-2xl bg-[#DFF8EB]/50 border border-[#19C37D]/20 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/70 border border-[#19C37D]/15 self-start overflow-x-auto max-w-full [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 h-7 rounded-lg text-[11.5px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              tab === t.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:text-[#132A22]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* fixed height: switching tabs never moves the window */}
      <div className="min-h-[124px] sm:h-[124px] sm:overflow-y-auto">
        {tab === 'change' ? (
          <>
            <p className="text-xs font-bold text-[#B7791F] leading-snug mb-2">Не правьте код вручную — картинка, надписи и QR в нём собраны из кубиков, правка их сломает.</p>
            <ol className="flex flex-col gap-1.5">
              {CHANGE_STEPS.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-[#132A22] leading-snug">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-[#132A22] text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                  <span><b className="font-extrabold">{s.t}.</b> <span className="text-[#57534e]">{s.d}</span></span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {steps[tab].map((s, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-[#132A22] leading-relaxed">
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#19C37D] text-[#132A22] text-[10px] font-black flex items-center justify-center mt-px">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

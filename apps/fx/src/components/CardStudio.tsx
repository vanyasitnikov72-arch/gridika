import { useEffect, useRef, useState } from 'preact/hooks';
import { CardViewer, CARD_PALETTES, type CardMode, type CardStyle } from '../engine/cardScene';
import { type CardContact } from '../engine/vcard';

/** 02 · Визитка с QR — studio stage and settings panel (state lives in QrConfigurator). */

export const CARD_MODES: { id: CardMode; label: string }[] = [
  { id: 'graphite', label: 'Графит' },
  { id: 'emerald', label: 'Изумруд' },
  { id: 'gold', label: 'Золото' },
  { id: 'ocean', label: 'Океан' },
  { id: 'amethyst', label: 'Аметист' },
  { id: 'berry', label: 'Бордо' },
  { id: 'terracotta', label: 'Терракота' },
  { id: 'snow', label: 'Снег' },
];

export const CARD_STYLE_OPTIONS: { id: CardStyle; label: string }[] = [
  { id: 'classic', label: 'Классика' },
  { id: 'minimal', label: 'Минимал' },
  { id: 'pixel', label: 'Пиксели' },
  { id: 'wave', label: 'Волна' },
  { id: 'split', label: 'Две части' },
  { id: 'diagonal', label: 'Диагональ' },
  { id: 'grid', label: 'Чертёж' },
];

export const DEMO_CONTACT: CardContact = {
  name: 'Анна Смирнова',
  role: 'Дизайнер интерьеров',
  company: 'Studio Nord',
  phone: '+7 900 123-45-67',
  email: 'anna@example.com',
  site: 'voxelka.ru',
  telegram: 'voxelka',
  whatsapp: '',
};

export interface CardState {
  contact: CardContact;
  setContact: (c: CardContact) => void;
  mode: CardMode;
  setMode: (m: CardMode) => void;
  style: CardStyle;
  setStyle: (s: CardStyle) => void;
  /** fields the person chose not to show (not on the card, not in the QR) */
  hidden: (keyof CardContact)[];
  setHidden: (h: (keyof CardContact)[]) => void;
  flipped: boolean;
  setFlipped: (f: boolean) => void;
  logo: HTMLImageElement | null;
  setLogo: (l: HTMLImageElement | null) => void;
  /** the live 3D card (for snapshots) */
  viewer: { current: CardViewer | null };
  scan: { checked: boolean; ok: boolean; size: number; omitted: string[] };
  setScan: (s: { checked: boolean; ok: boolean; size: number; omitted: string[] }) => void;
}

export function useCardState(): CardState {
  const [contact, setContact] = useState<CardContact>(DEMO_CONTACT);
  const [mode, setMode] = useState<CardMode>('graphite');
  const [style, setStyle] = useState<CardStyle>('classic');
  const [hidden, setHidden] = useState<(keyof CardContact)[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [scan, setScan] = useState({ checked: false, ok: false, size: 0, omitted: [] as string[] });
  const viewer = useRef<CardViewer | null>(null);
  return { viewer, contact, setContact, mode, setMode, style, setStyle, hidden, setHidden, flipped, setFlipped, logo, setLogo, scan, setScan };
}

/** what actually goes on the card and into the QR */
export function visibleContact(state: Pick<CardState, 'contact' | 'hidden'>): CardContact {
  if (!state.hidden.length) return state.contact;
  return { ...state.contact, ...Object.fromEntries(state.hidden.map((k) => [k, ''])) };
}

const pill = 'h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0';

export function CardStage({ state, active }: { state: CardState; active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CardViewer | null>(null);

  // Build the 3D card ahead of time (when the browser is idle after load), paused,
  // so opening the tab is instant instead of a hitch while WebGL and textures are set up.
  const mount = () => {
    if (viewerRef.current || !hostRef.current) return;
    const v = new CardViewer(hostRef.current, visibleContact(state), state.mode, state.style);
    v.onFlip = (f) => state.setFlipped(f);
    v.setLogo(state.logo);
    v.setPaused(!activeRef.current);
    viewerRef.current = v;
    state.viewer.current = v;
    (window as any).__vxCard = v; // handy for checks in the console
  };
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (active) {
      mount();
    }
    viewerRef.current?.setPaused(!active);
  }, [active]);

  useEffect(() => () => viewerRef.current?.dispose(), []);

  useEffect(() => viewerRef.current?.setContact(visibleContact(state)), [state.contact, state.hidden]);
  useEffect(() => viewerRef.current?.setMode(state.mode), [state.mode]);
  useEffect(() => viewerRef.current?.setStyle(state.style), [state.style]);
  useEffect(() => viewerRef.current?.setLogo(state.logo), [state.logo]);
  useEffect(() => viewerRef.current?.setFlipped(state.flipped), [state.flipped]);

  // read the QR off the real 3D frame once the back has assembled
  useEffect(() => {
    if (!state.flipped) return;
    const t = setTimeout(() => {
      const v = viewerRef.current;
      if (!v) return;
      const r = v.checkScan();
      state.setScan({ checked: true, ok: r.ok, size: v.qrSize, omitted: v.qrOmitted.map((k) => FIELD_LABEL[k]) });
    }, 2300);
    return () => clearTimeout(t);
  }, [state.flipped, state.contact, state.hidden, state.mode, state.style]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex-1 min-h-0 lg:pl-12">
        <div ref={hostRef} className="w-full h-full relative select-none" />
      </div>

      <div className="relative z-20 mt-2 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 lg:translate-x-12">
        {/* front / back */}
        <div className={`relative w-[68px] ${pill}`}>
          <div
            className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-[var(--vx-accent)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${
              state.flipped ? 'translate-x-[32px]' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            title="Лицевая сторона"
            onClick={() => state.setFlipped(false)}
            className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${!state.flipped ? 'text-[var(--vx-on)]' : 'text-[#78716c] hover:text-[#132A22]'}`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="6" y="3" width="12" height="18" rx="2.5" />
              <path d="M9 14h6M9 17h4" />
            </svg>
          </button>
          <button
            type="button"
            title="Оборот с QR"
            onClick={() => state.setFlipped(true)}
            className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${state.flipped ? 'text-[var(--vx-on)]' : 'text-[#78716c] hover:text-[#132A22]'}`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>
        </div>

        {/* colours: swatches show the card colour and its accent */}
        <div className={`w-[234px] justify-between px-1.5 ${pill}`}>
          {CARD_MODES.map((opt) => {
            const p = (CARD_PALETTES as Record<string, { bgA: string; accent: string }>)[opt.id];
            const on = state.mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                title={opt.label}
                aria-label={opt.label}
                aria-pressed={on}
                onClick={() => state.setMode(opt.id)}
                className={`relative w-[22px] h-[22px] rounded-full shrink-0 cursor-pointer transition-transform duration-200 ${on ? 'scale-110' : 'hover:scale-110'}`}
                style={{
                  background: `linear-gradient(135deg, ${p.bgA} 0 55%, ${p.accent} 55% 100%)`,
                  boxShadow: on ? '0 0 0 2px #fff, 0 0 0 4px #132A22' : 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const FIELD_LABEL: Record<keyof CardContact, string> = {
  name: 'имя', role: 'должность', company: 'компания', phone: 'телефон', email: 'почта', site: 'сайт', telegram: 'Telegram', whatsapp: 'WhatsApp',
};

const FIELDS: { key: keyof CardContact; label: string; placeholder: string; wide?: boolean; type?: string }[] = [
  { key: 'name', label: 'Имя и фамилия', placeholder: 'Анна Смирнова', wide: true },
  { key: 'role', label: 'Должность', placeholder: 'Дизайнер интерьеров', wide: true },
  { key: 'company', label: 'Компания', placeholder: 'Studio Nord' },
  { key: 'phone', label: 'Телефон', placeholder: '+7 900 123-45-67', type: 'tel' },
  { key: 'email', label: 'Почта', placeholder: 'anna@site.ru', type: 'email', wide: true },
  { key: 'site', label: 'Сайт', placeholder: 'site.ru' },
  { key: 'telegram', label: 'Telegram', placeholder: '@username' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '+7 900 …', type: 'tel' },
];

export function CardPanel({ state }: { state: CardState }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (key: keyof CardContact, value: string) => {
    state.setContact({ ...state.contact, [key]: value });
    state.setScan({ ...state.scan, checked: false });
  };

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => state.setLogo(img);
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3 fx-fade-in">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">Визитка · 02</span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">Визитка с QR</h2>
        <p className="text-[11px] text-[#78716c] font-semibold mt-1">Нажмите на карточку — на обороте QR с контактом.</p>
      </div>

      {/* design of the card */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#f6f3ee] border border-[#ebe5da]">
        {CARD_STYLE_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => state.setStyle(o.id)}
            className={`h-7 px-1 rounded-xl text-[10.5px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              state.style === o.id ? 'bg-white text-[#132A22] shadow-[0_2px_8px_-2px_rgba(19,42,34,0.2)]' : 'text-[#78716c] hover:text-[#132A22]'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {FIELDS.map((f) => (
          <label key={f.key} className={`flex flex-col gap-0.5 ${f.wide ? 'col-span-2' : ''}`}>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#a8a29e] pl-1">{f.label}</span>
            <span className="relative">
              <input
                type={f.type ?? 'text'}
                value={state.contact[f.key]}
                placeholder={f.placeholder}
                onInput={(e) => set(f.key, (e.target as HTMLInputElement).value)}
                className={`w-full pl-3 ${f.key === 'name' ? 'pr-3' : 'pr-8'} py-1.5 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-xs font-bold outline-none focus:bg-white focus:border-[var(--vx-accent)] transition-colors ${
                  state.hidden.includes(f.key) ? 'text-[#b9b3aa] line-through' : 'text-[#132A22]'
                }`}
              />
              {f.key !== 'name' && (
                <button
                  type="button"
                  title={state.hidden.includes(f.key) ? 'Показать на карточке' : 'Скрыть с карточки и из QR'}
                  onClick={(e) => {
                    e.preventDefault();
                    const h = state.hidden.includes(f.key) ? state.hidden.filter((k) => k !== f.key) : [...state.hidden, f.key];
                    state.setHidden(h);
                    state.setScan({ ...state.scan, checked: false });
                  }}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    state.hidden.includes(f.key) ? 'text-[#c2410c] bg-[#fdebe3]' : 'text-[#a8a29e] hover:text-[#132A22] hover:bg-[#f3efe7]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="2.8" />
                    {state.hidden.includes(f.key) && <path d="M4 20 20 4" />}
                  </svg>
                </button>
              )}
            </span>
          </label>
        ))}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9.5px] font-black uppercase tracking-wider text-[#a8a29e] pl-1">Логотип</span>
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={(e) => onLogo((e.target as HTMLInputElement).files?.[0])} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#f3efe7] hover:bg-[#ebe5d9] border border-[#e5dfd2] text-xs font-extrabold text-[#132A22] cursor-pointer truncate"
            >
              {state.logo ? 'Заменить' : 'Загрузить'}
            </button>
            {state.logo && (
              <button type="button" title="Убрать логотип" onClick={() => state.setLogo(null)} className="w-7 h-7 shrink-0 rounded-xl bg-[#f3efe7] text-[#78716c] hover:text-[#132A22] text-xs font-black cursor-pointer">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="-mt-1 text-[11px] font-bold leading-snug text-right">
        {!state.scan.checked ? (
          <span className="text-[#a8a29e]">{state.flipped ? 'Проверяем скан…' : 'Скан проверим на обороте'}</span>
        ) : state.scan.ok ? (
          <span className="text-[#15803d]">
            ✓ QR сканируется
            {state.scan.omitted.length > 0 && <span className="text-[#a8a29e] font-semibold"> · в QR не вошли: {state.scan.omitted.join(', ')}</span>}
          </span>
        ) : (
          <span className="text-[#c2410c]">QR не читается — скройте часть полей</span>
        )}
      </div>
    </div>
  );
}

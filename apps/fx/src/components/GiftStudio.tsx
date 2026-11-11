import { useEffect, useRef, useState } from 'preact/hooks';
import { GiftViewer, GIFT_PALETTES, type GiftKind, type GiftMode, type GiftPattern, type GiftSettings, type GiftShape, type GiftTrigger } from '../engine/giftScene';

/** 03 · Подарок с промокодом — studio stage and settings panel (state lives in QrConfigurator). */

export const GIFT_MODES: { id: GiftMode; title: string }[] = [
  { id: 'festive', title: 'Праздник: красная коробка, золотая лента' },
  { id: 'kraft', title: 'Крафт: бумага и бечёвка' },
  { id: 'neon', title: 'Чёрная пятница: чёрная коробка и неон' },
  { id: 'mint', title: 'Мята: мятная коробка, розовая лента' },
  { id: 'royal', title: 'Королевский: синяя коробка, серебро и золото' },
  { id: 'sunny', title: 'Солнце: жёлтая коробка, синяя лента' },
];

const SHAPES: { id: GiftShape; label: string }[] = [
  { id: 'cube', label: 'Куб' },
  { id: 'tall', label: 'Высокая' },
  { id: 'flat', label: 'Плоская' },
];

const PATTERNS: { id: GiftPattern; label: string }[] = [
  { id: 'plain', label: 'Однотонная' },
  { id: 'dots', label: 'Горошек' },
  { id: 'stripes', label: 'Полоски' },
];

const KINDS: { id: GiftKind; label: string }[] = [
  { id: 'code', label: 'Промокод' },
  { id: 'percent', label: 'Скидка' },
  { id: 'qr', label: 'QR-купон' },
];

const TRIGGERS: { id: GiftTrigger; label: string }[] = [
  { id: 'click', label: 'По клику' },
  { id: 'scroll', label: 'При прокрутке' },
];

export const DEMO_GIFT: GiftSettings = {
  kind: 'code',
  code: 'VOXEL20',
  percent: '20',
  url: 'https://voxelka.ru',
  caption: 'Скидка 20% на первый заказ',
  trigger: 'click',
  shape: 'cube',
  pattern: 'plain',
};

export interface GiftState {
  settings: GiftSettings;
  setSettings: (s: GiftSettings) => void;
  mode: GiftMode;
  setMode: (m: GiftMode) => void;
  opened: boolean;
  setOpened: (o: boolean) => void;
  viewer: { current: GiftViewer | null };
  scan: { checked: boolean; ok: boolean };
  setScan: (s: { checked: boolean; ok: boolean }) => void;
}

export function useGiftState(): GiftState {
  const [settings, setSettings] = useState<GiftSettings>(DEMO_GIFT);
  const [mode, setMode] = useState<GiftMode>('festive');
  const [opened, setOpened] = useState(false);
  const [scan, setScan] = useState({ checked: false, ok: false });
  const viewer = useRef<GiftViewer | null>(null);
  return { settings, setSettings, mode, setMode, opened, setOpened, viewer, scan, setScan };
}

const pill = 'h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0';

export function GiftStage({ state, active }: { state: GiftState; active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<GiftViewer | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  // built ahead of time when the browser is idle, paused until the tab is opened
  const mount = () => {
    if (viewerRef.current || !hostRef.current) return;
    const v = new GiftViewer(hostRef.current, state.settings, state.mode);
    v.onOpen = (o) => state.setOpened(o);
    v.setPaused(!activeRef.current);
    viewerRef.current = v;
    state.viewer.current = v;
    (window as any).__vxGift = v;
    // the promo code is drawn with the page font: rebuild once it is loaded
    document.fonts?.ready.then(() => viewerRef.current?.setSettings(state.settings));
  };
  useEffect(() => {
    if (active) {
      mount();
    }
    viewerRef.current?.setPaused(!active);
  }, [active]);

  useEffect(() => () => viewerRef.current?.dispose(), []);

  useEffect(() => viewerRef.current?.setSettings(state.settings), [state.settings]);
  useEffect(() => viewerRef.current?.setMode(state.mode), [state.mode]);
  useEffect(() => {
    const v = viewerRef.current;
    if (!v) return;
    if (state.opened) v.open();
    else v.close();
  }, [state.opened]);

  // QR coupon: read it off the real 3D frame once it has assembled
  useEffect(() => {
    if (!state.opened || state.settings.kind !== 'qr') return;
    const t = setTimeout(() => {
      const v = viewerRef.current;
      if (v) state.setScan({ checked: true, ok: v.checkScan().ok });
    }, 2600);
    return () => clearTimeout(t);
  }, [state.opened, state.settings, state.mode]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex-1 min-h-0 lg:pl-12">
        <div ref={hostRef} className="w-full h-full relative select-none" />
      </div>

      <div className="relative z-20 mt-2 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 lg:translate-x-12">
        {/* closed / opened */}
        <div className={`relative w-[68px] ${pill}`}>
          <div
            className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-[var(--vx-accent)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${
              state.opened ? 'translate-x-[32px]' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            title="Закрыть коробку"
            onClick={() => state.setOpened(false)}
            className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${!state.opened ? 'text-[var(--vx-on)]' : 'text-[#78716c] hover:text-[#132A22]'}`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="1.5" />
              <rect x="3" y="7" width="18" height="4" rx="1" />
              <path d="M12 7v13" />
            </svg>
          </button>
          <button
            type="button"
            title="Открыть подарок"
            onClick={() => state.setOpened(true)}
            className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${state.opened ? 'text-[var(--vx-on)]' : 'text-[#78716c] hover:text-[#132A22]'}`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinejoin="round">
              <rect x="4" y="12" width="16" height="8" rx="1.5" />
              <path d="M5 8.5 18 4l1 3-13 4.5z" />
            </svg>
          </button>
        </div>

        <div className={`w-[234px] justify-between px-2 ${pill}`}>
          {GIFT_MODES.map((opt) => {
            const p = (GIFT_PALETTES as Record<string, { box: string; ribbon: string }>)[opt.id];
            const on = state.mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                title={opt.title}
                aria-label={opt.title}
                aria-pressed={on}
                onClick={() => state.setMode(opt.id)}
                className={`w-[24px] h-[24px] rounded-full shrink-0 cursor-pointer transition-transform duration-200 ${on ? 'scale-110' : 'hover:scale-110'}`}
                style={{
                  background: `linear-gradient(90deg, ${p.box} 0 38%, ${p.ribbon} 38% 62%, ${p.box} 62% 100%)`,
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

function Segmented<T extends string>({ items, value, onChange, small }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; small?: boolean }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#f6f3ee] border border-[#ebe5da]">
      {items.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex-1 h-7 px-1 rounded-xl ${small ? 'text-[10px]' : 'text-[11.5px]'} font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            value === o.id ? 'bg-white text-[#132A22] shadow-[0_2px_8px_-2px_rgba(19,42,34,0.2)]' : 'text-[#78716c] hover:text-[#132A22]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const input =
  'w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:bg-white focus:border-[var(--vx-accent)] transition-colors';
const label = 'text-[9.5px] font-black uppercase tracking-wider text-[#a8a29e] pl-1';

export function GiftPanel({ state }: { state: GiftState }) {
  const s = state.settings;
  const set = (patch: Partial<GiftSettings>) => {
    state.setSettings({ ...s, ...patch });
    state.setScan({ checked: false, ok: false });
  };
  return (
    <div className="flex flex-col gap-2.5 fx-fade-in">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">Подарок · 03</span>
        <h2 className="text-3xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">Подарок с промокодом</h2>
        <p className="text-[11px] text-[#78716c] font-semibold mt-1">Нажмите на коробку — внутри подарок для посетителя.</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className={label}>Что внутри</span>
        <Segmented items={KINDS} value={s.kind} onChange={(kind) => set({ kind })} />
      </label>

      {s.kind === 'code' && (
        <label className="flex flex-col gap-0.5">
          <span className={label}>Промокод</span>
          <input className={`${input} font-mono uppercase tracking-wider`} value={s.code} maxLength={14} placeholder="VOXEL20" onInput={(e) => set({ code: (e.target as HTMLInputElement).value.toUpperCase() })} />
        </label>
      )}
      {s.kind === 'percent' && (
        <label className="flex flex-col gap-0.5">
          <span className={label}>Скидка, %</span>
          <input className={input} inputMode="numeric" value={s.percent} maxLength={3} placeholder="20" onInput={(e) => set({ percent: (e.target as HTMLInputElement).value.replace(/[^\d]/g, '') })} />
        </label>
      )}
      {s.kind === 'qr' && (
        <label className="flex flex-col gap-0.5">
          <span className={label}>Ссылка на акцию</span>
          <input className={`${input} font-mono`} value={s.url} placeholder="https://shop.ru/sale" onInput={(e) => set({ url: (e.target as HTMLInputElement).value })} />
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className={label}>Коробка</span>
        <Segmented items={SHAPES} value={s.shape} onChange={(shape) => set({ shape })} />
      </label>
      <label className="flex flex-col gap-1">
        <span className={label}>Узор</span>
        <Segmented items={PATTERNS} value={s.pattern} onChange={(pattern) => set({ pattern })} />
      </label>

      <label className="flex flex-col gap-0.5">
        <span className={label}>Подпись под подарком</span>
        <input className={input} value={s.caption} maxLength={60} placeholder="Скидка 20% на первый заказ" onInput={(e) => set({ caption: (e.target as HTMLInputElement).value })} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={label}>Когда открывается</span>
        <Segmented items={TRIGGERS} value={s.trigger} onChange={(trigger) => set({ trigger })} />
      </label>

      <div className="text-[11px] font-bold text-right -mt-1">
        {s.kind !== 'qr' ? (
          <span className="text-[#a8a29e]">{s.kind === 'code' ? 'Посетитель скопирует промокод одной кнопкой' : 'Под скидкой — ваша подпись'}</span>
        ) : !state.scan.checked ? (
          <span className="text-[#a8a29e]">{state.opened ? 'Проверяем скан…' : 'Скан проверим, когда подарок откроется'}</span>
        ) : state.scan.ok ? (
          <span className="text-[#15803d]">✓ QR-купон сканируется</span>
        ) : (
          <span className="text-[#c2410c]">QR не читается — сократите ссылку</span>
        )}
      </div>
    </div>
  );
}

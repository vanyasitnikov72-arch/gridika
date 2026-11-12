import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  LogoViewer,
  rasterizeLogo,
  buildLogoData,
  baseFromData,
  DEMO_LOGO_SVG,
  LOGO_RES,
  type LogoBase,
  type LogoData,
  type LogoMode,
  type LogoMotion,
  type LogoSettings,
} from '../engine/logoScene';

/** 04 · 3D-логотип — studio stage and settings panel (state lives in QrConfigurator). */

export const LOGO_MODE_OPTIONS: { id: LogoMode; label: string; swatch: string }[] = [
  { id: 'gloss', label: 'Глянец', swatch: 'radial-gradient(circle at 32% 28%,#ffffff 0 14%,#a78bfa 34%,#5b3df5 70%,#3b1f9e 100%)' },
  { id: 'matte', label: 'Матовый', swatch: 'linear-gradient(135deg,#e4dcff,#c4b5fd)' },
  { id: 'chrome', label: 'Металлик', swatch: 'linear-gradient(160deg,#f8fafc 0%,#94a3b8 38%,#f1f5f9 52%,#475569 78%,#cbd5e1 100%)' },
  { id: 'pearl', label: 'Перламутр', swatch: 'conic-gradient(from 200deg,#fde2f3,#e0e7ff,#d1fae5,#fef3c7,#fde2f3)' },
  { id: 'toon', label: 'Мультяшный', swatch: 'linear-gradient(135deg,#8b5cf6 0 50%,#5b3df5 50% 100%)' },
  { id: 'neon', label: 'Неон', swatch: 'radial-gradient(circle,#0c0a16 36%,#c084fc 42%,#0c0a16 66%)' },
];

const DEPTHS: { id: string; label: string }[] = [
  { id: '2', label: 'Тонкий' },
  { id: '4', label: 'Средний' },
  { id: '7', label: 'Объёмный' },
];
const MOTIONS: { id: LogoMotion; label: string }[] = [
  { id: 'sway', label: 'Покачивание' },
  { id: 'spin', label: 'Вращение' },
  { id: 'still', label: 'Статично' },
];
const COLORS: { id: LogoSettings['colors']; label: string }[] = [
  { id: 'logo', label: 'Из логотипа' },
  { id: 'mono', label: 'Один цвет' },
];
const MONO = ['#132A22', '#5b3df5', '#19C37D', '#e0457b', '#ff8a3d', '#2f6fde', '#c9a27a', '#ffffff'];

/** white and near-white: invisible on a light page */
export function isLightColor(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.8;
}

export const DEMO_LOGO_SETTINGS: LogoSettings = { res: 36, depth: 4, motion: 'sway', colors: 'logo', mono: '#5b3df5' };

export interface LogoState {
  /** the uploaded image (stays in the browser); null when restored from a saved grid */
  src: string | null;
  setSrc: (s: string | null) => void;
  fileName: string;
  setFileName: (s: string) => void;
  base: LogoBase | null;
  setBase: (b: LogoBase | null) => void;
  settings: LogoSettings;
  setSettings: (s: LogoSettings) => void;
  mode: LogoMode;
  setMode: (m: LogoMode) => void;
  /** studio preview only: the site code keeps a transparent background */
  previewBg: 'light' | 'dark';
  setPreviewBg: (b: 'light' | 'dark') => void;
  /** every colour of the logo is near-white */
  lightLogo: boolean;
  data: LogoData | null;
  error: string;
  setError: (e: string) => void;
  viewer: { current: LogoViewer | null };
  /** restore from the purchase link */
  restore: (d: LogoData, s: LogoSettings, m: LogoMode) => void;
}

export function useLogoState(): LogoState {
  const [src, setSrc] = useState<string | null>(DEMO_LOGO_SVG);
  const [fileName, setFileName] = useState('Демо-логотип');
  const [base, setBase] = useState<LogoBase | null>(null);
  const [settings, setSettings] = useState<LogoSettings>(DEMO_LOGO_SETTINGS);
  const [mode, setMode] = useState<LogoMode>('gloss');
  const [previewBg, setPreviewBg] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState('');
  const viewer = useRef<LogoViewer | null>(null);

  // the picture is re-sampled only when it or the detail changes
  useEffect(() => {
    if (!src) return;
    let alive = true;
    rasterizeLogo(src, settings.res)
      .then((b) => {
        if (!alive) return;
        setBase(b);
        setError('');
      })
      .catch((e) => alive && setError(e?.message || 'Не получилось прочитать картинку'));
    return () => {
      alive = false;
    };
  }, [src, settings.res]);

  const data = useMemo(() => (base ? buildLogoData(base, settings) : null), [base, settings.depth, settings.motion, settings.colors, settings.mono]);
  // a white logo is shown on a dark preview right away, otherwise it disappears on the page
  const lightLogo = !!data && data.palette.every(isLightColor);
  useEffect(() => {
    if (lightLogo) setPreviewBg('dark');
  }, [lightLogo]);

  const restore = (d: LogoData, s: LogoSettings, m: LogoMode) => {
    setSrc(null);
    setFileName('Логотип из ссылки');
    setBase(baseFromData(d));
    setSettings(s);
    setMode(m);
  };

  return { src, setSrc, fileName, setFileName, base, setBase, settings, setSettings, mode, setMode, previewBg, setPreviewBg, lightLogo, data, error, setError, viewer, restore };
}

const pill = 'h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0';

export function LogoStage({ state, active }: { state: LogoState; active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<LogoViewer | null>(null);
  const replayIconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (active && !viewerRef.current && hostRef.current && state.data) {
      const v = new LogoViewer(hostRef.current, state.data, state.mode);
      viewerRef.current = v;
      state.viewer.current = v;
      (window as any).__vxLogo = v;
    }
    viewerRef.current?.setPaused(!active);
  }, [active, state.data]);
  useEffect(() => () => viewerRef.current?.dispose(), []);
  useEffect(() => {
    if (state.data) viewerRef.current?.setData(state.data);
  }, [state.data]);
  useEffect(() => viewerRef.current?.setMode(state.mode), [state.mode]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex-1 min-h-0 lg:pl-12">
        <div className="relative w-full h-full">
          {/* mobile: no wave, so a rounded dark tile; desktop: the card draws a dark area that hugs the wave */}
          <div className={`lg:hidden absolute inset-0 rounded-[2rem] bg-[#17141f] transition-opacity duration-500 ${state.previewBg === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
          <div ref={hostRef} className="relative w-full h-full select-none" />
        </div>
      </div>

      <div className="relative z-20 mt-2 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 lg:translate-x-6">
        <button
          type="button"
          title="Собрать заново"
          aria-label="Собрать заново"
          onClick={(e) => {
            viewerRef.current?.replay();
            // feedback: the arrow makes a full turn (the way it points), the button dips and glows
            const btn = e.currentTarget as HTMLElement;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            replayIconRef.current?.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }], {
              duration: 750,
              easing: 'cubic-bezier(0.3, 0.7, 0.25, 1)',
            });
            btn.animate(
              [
                { transform: 'scale(1)', color: '#57534e' },
                { transform: 'scale(0.86)', color: 'var(--vx-accent)', offset: 0.25 },
                { transform: 'scale(1.06)', color: 'var(--vx-accent)', offset: 0.6 },
                { transform: 'scale(1)', color: '#57534e' },
              ],
              { duration: 750, easing: 'ease-out' },
            );
          }}
          className={`${pill} w-9 justify-center text-[#57534e] hover:text-[#132A22] cursor-pointer`}
        >
          <svg ref={replayIconRef} className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <div className={`${pill} px-1.5 gap-1.5`}>
          {LOGO_MODE_OPTIONS.map((o) => {
            const on = state.mode === o.id;
            return (
              <button
                key={o.id}
                type="button"
                title={o.label}
                aria-label={o.label}
                aria-pressed={on}
                onClick={() => state.setMode(o.id)}
                className={`w-[24px] h-[24px] rounded-full shrink-0 cursor-pointer transition-transform duration-200 ${on ? 'scale-110' : 'hover:scale-110'}`}
                style={{ background: o.swatch, boxShadow: on ? '0 0 0 2px #fff, 0 0 0 4px #132A22' : 'inset 0 0 0 1px rgba(0,0,0,0.14)' }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#f6f3ee] border border-[#ebe5da]">
      {items.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex-1 h-7 px-1 rounded-xl text-[11.5px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            value === o.id ? 'bg-white text-[#132A22] shadow-[0_2px_8px_-2px_rgba(19,42,34,0.2)]' : 'text-[#78716c] hover:text-[#132A22]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const label = 'text-[9.5px] font-black uppercase tracking-wider text-[#a8a29e] pl-1';
const MAX_FILE = 5 * 1024 * 1024;

export function LogoPanel({ state }: { state: LogoState }) {
  const s = state.settings;
  const set = (patch: Partial<LogoSettings>) => state.setSettings({ ...s, ...patch });
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const readFile = (f: File | undefined | null) => {
    if (!f) return;
    if (!/^image\/(png|svg\+xml|jpeg|webp|gif)$/.test(f.type)) return state.setError('Нужен PNG, SVG, JPG или WebP');
    if (f.size > MAX_FILE) return state.setError('Файл больше 5 МБ — сохраните логотип поменьше');
    const r = new FileReader();
    r.onload = () => {
      state.setFileName(f.name);
      state.setSrc(String(r.result));
    };
    r.readAsDataURL(f);
  };

  const cubes = state.data ? state.data.rle.replace(/(\d*)([a-z.])/g, (_m, n, ch) => (ch === '.' ? '' : 'x'.repeat(Number(n || 1)))).length * s.depth : 0;

  return (
    <div className="flex flex-col gap-2 fx-fade-in">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">3D-логотип · 04</span>
        <h2 className="text-3xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">3D-логотип из вокселей</h2>
        <p className="text-[11px] text-[#78716c] font-semibold mt-1">Наведите курсор на логотип — он рассыплется и соберётся.</p>
      </div>

      {/* upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          readFile(e.dataTransfer?.files?.[0]);
        }}
        className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 border-dashed transition-colors ${drag ? 'border-[var(--vx-accent)] bg-[var(--vx-soft)]' : 'border-[#e5dfd2] bg-[#fbf9f5]'}`}
      >
        <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-[#ebe5da] flex items-center justify-center overflow-hidden">
          {state.src ? (
            <img src={state.src} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <div className="flex gap-0.5">
              {(state.data?.palette || []).slice(0, 4).map((c) => (
                <span key={c} className="w-2 h-5 rounded-sm" style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-extrabold text-[#132A22] truncate">{state.fileName}</div>
          <div className="text-[10.5px] font-semibold text-[#a8a29e] leading-tight">PNG, SVG, JPG · файл не уходит на сервер</div>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={(e) => readFile((e.target as HTMLInputElement).files?.[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="h-8 px-3.5 rounded-full bg-[#132A22] text-white text-[11.5px] font-extrabold shrink-0 cursor-pointer hover:bg-[#1d3a2f] transition-colors"
        >
          Загрузить
        </button>
      </div>
      {state.error && <div className="text-[11px] font-bold text-[#c2410c] -mt-1 pl-1">{state.error}</div>}
      {state.src !== DEMO_LOGO_SVG && (
        <button
          type="button"
          onClick={() => {
            state.setFileName('Демо-логотип');
            state.setSrc(DEMO_LOGO_SVG);
          }}
          className="self-end -mt-1.5 text-[10.5px] font-bold text-[#a8a29e] hover:text-[#132A22] cursor-pointer"
        >
          Вернуть демо-логотип
        </button>
      )}

      <label className="flex flex-col gap-1">
        <span className="flex items-center justify-between">
          <span className={label}>Детализация</span>
          <span className="text-[10.5px] font-extrabold text-[#57534e] pr-1">{s.res} кубиков в ширину</span>
        </span>
        <input
          type="range"
          min={LOGO_RES.min}
          max={LOGO_RES.max}
          step={2}
          value={s.res}
          disabled={!state.src}
          onInput={(e) => set({ res: Number((e.target as HTMLInputElement).value) })}
          className="w-full accent-[var(--vx-accent)] disabled:opacity-40 cursor-pointer"
        />
        {!state.src && <span className="text-[10.5px] font-semibold text-[#a8a29e] pl-1">Чтобы изменить детализацию, загрузите файл логотипа ещё раз</span>}
      </label>

      <label className="flex flex-col gap-1">
        <span className={label}>Толщина</span>
        <Segmented items={DEPTHS} value={String(s.depth)} onChange={(v) => set({ depth: Number(v) })} />
      </label>

      <div className="flex flex-col gap-1">
        <span className={label}>Цвета</span>
        <Segmented items={COLORS} value={s.colors} onChange={(colors) => set({ colors })} />
        {s.colors === 'mono' ? (
          <div className="flex items-center justify-between gap-1 px-1 pt-1">
            {MONO.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => set({ mono: c })}
                className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{ background: c, boxShadow: s.mono === c ? '0 0 0 2px #fff, 0 0 0 4px #132A22' : 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-1 pt-1 min-h-[28px]">
            {(state.base?.palette || []).map((c) => (
              <span key={c} className="w-5 h-5 rounded-md" style={{ background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} title={c} />
            ))}
            <span className="ml-auto text-[10.5px] font-semibold text-[#a8a29e]">цвета найдены в логотипе</span>
          </div>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={state.previewBg === 'dark'}
        onClick={() => state.setPreviewBg(state.previewBg === 'dark' ? 'light' : 'dark')}
        className="flex items-center gap-2.5 px-1 py-0.5 text-left cursor-pointer group"
      >
        <span className={`relative w-9 h-5 shrink-0 rounded-full transition-colors duration-300 ${state.previewBg === 'dark' ? 'bg-[#17141f]' : 'bg-[#e5dfd2]'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${state.previewBg === 'dark' ? 'translate-x-4' : ''}`} />
        </span>
        <span className="min-w-0">
          <span className="block text-[11.5px] font-extrabold text-[#132A22] leading-tight">Тёмный фон в предпросмотре</span>
          <span className="block text-[10.5px] font-semibold text-[#a8a29e] leading-tight">
            {state.lightLogo ? 'Светлый логотип — для тёмного экрана' : 'Только для просмотра, на сайте фон прозрачный'}
          </span>
        </span>
      </button>

      <label className="flex flex-col gap-1">
        <span className={label}>Движение</span>
        <Segmented items={MOTIONS} value={s.motion} onChange={(motion) => set({ motion })} />
      </label>

      <div className="text-[11px] font-bold text-right text-[#a8a29e]">{cubes ? `${cubes.toLocaleString('ru-RU')} кубиков · фон прозрачный` :'Читаем логотип…'}</div>
    </div>
  );
}

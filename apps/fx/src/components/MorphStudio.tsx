import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  MorphViewer,
  sampleMorph,
  buildMorphData,
  baseFromMorphData,
  demoMorphPair,
  type MorphBase,
  type MorphControl,
  type MorphData,
  type MorphMode,
  type MorphSettings,
} from '../engine/morphScene';

/** 05 · Морф «до / после» — studio stage and settings panel (state lives in QrConfigurator). */

export const MORPH_MODE_OPTIONS: { id: MorphMode; label: string; title: string; icon: string }[] = [
  { id: 'wave', label: 'Волна', title: 'Волна: переход катится слева направо', icon: 'M2 13c3-6 5-6 8 0s5 6 8 0 3-3 4-3' },
  { id: 'burst', label: 'Взрыв', title: 'Взрыв: кубики разлетаются и собираются', icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8' },
  { id: 'pixel', label: 'Пиксель', title: 'Пиксель: кубики переворачиваются рядами, как табло', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM15 15h3v3h-3z' },
  { id: 'spiral', label: 'Спираль', title: 'Спираль: переход закручивается от центра', icon: 'M12 12a1.5 1.5 0 1 1 1.5 1.5A4 4 0 1 1 16 9.2 6.5 6.5 0 1 1 6 7' },
  { id: 'rain', label: 'Дождь', title: 'Дождь: старые кубики осыпаются, новые падают сверху', icon: 'M6 3v5M12 6v5M18 3v5M6 13v3M12 15v6M18 12v4' },
  { id: 'mosaic', label: 'Мозаика', title: 'Мозаика: кубики переворачиваются вразнобой', icon: 'M4 4h4v4H4zM10 4h4v4h-4zM16 10h4v4h-4zM4 10h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z' },
];
const SPEEDS: { id: MorphSettings['speed']; label: string }[] = [
  { id: 'slow', label: 'Медленно' },
  { id: 'normal', label: 'Обычно' },
  { id: 'fast', label: 'Быстро' },
];
const LABEL_STYLES: { id: MorphSettings['labelStyle']; label: string }[] = [
  { id: 'dark', label: 'Тёмные' },
  { id: 'light', label: 'Светлые' },
];
const DEPTHS: { id: MorphSettings['depth']; label: string }[] = [
  { id: 'flat', label: 'Плоские' },
  { id: 'deep', label: 'Объёмные' },
];
const RESES: { id: string; label: string }[] = [
  { id: '48', label: 'Крупная' },
  { id: '64', label: 'Средняя' },
  { id: '80', label: 'Мелкая' },
];
const CONTROLS: { id: MorphControl; label: string }[] = [
  { id: 'slider', label: 'Ползунок' },
  { id: 'scroll', label: 'Прокрутка' },
  { id: 'auto', label: 'Сам' },
];

export const DEMO_MORPH_SETTINGS: MorphSettings = { res: 64, mode: 'wave', control: 'slider', labelA: 'До', labelB: 'После', speed: 'normal', labelStyle: 'dark', depth: 'flat' };

export interface MorphState {
  /** the two pictures (stay in the browser); null when restored from saved grids */
  srcA: string | null;
  srcB: string | null;
  nameA: string;
  nameB: string;
  setPicture: (side: 'a' | 'b', src: string, name: string) => void;
  resetDemo: () => void;
  isDemo: boolean;
  base: MorphBase | null;
  settings: MorphSettings;
  setSettings: (s: MorphSettings) => void;
  data: MorphData | null;
  error: string;
  setError: (e: string) => void;
  viewer: { current: MorphViewer | null };
  restore: (d: MorphData, s: MorphSettings) => void;
}

export function useMorphState(): MorphState {
  const [srcA, setSrcA] = useState<string | null>(null);
  const [srcB, setSrcB] = useState<string | null>(null);
  const [nameA, setNameA] = useState('Демо: комната до');
  const [nameB, setNameB] = useState('Демо: после ремонта');
  const [isDemo, setIsDemo] = useState(true);
  const [base, setBase] = useState<MorphBase | null>(null);
  const [settings, setSettings] = useState<MorphSettings>(DEMO_MORPH_SETTINGS);
  const [error, setError] = useState('');
  const restored = useRef(false);
  const viewer = useRef<MorphViewer | null>(null);

  const resetDemo = () => {
    const d = demoMorphPair();
    setSrcA(d.a);
    setSrcB(d.b);
    setNameA('Демо: комната до');
    setNameB('Демо: после ремонта');
    setIsDemo(true);
  };
  // the demo pictures are drawn in the browser
  useEffect(() => {
    if (!restored.current) resetDemo();
  }, []);

  useEffect(() => {
    if (!srcA || !srcB) return;
    let alive = true;
    sampleMorph(srcA, srcB, settings.res)
      .then((b) => {
        if (!alive) return;
        setBase(b);
        setError('');
      })
      .catch((e) => alive && setError(e?.message || 'Не получилось прочитать картинку'));
    return () => {
      alive = false;
    };
  }, [srcA, srcB, settings.res]);

  const data = useMemo(() => (base ? buildMorphData(base, settings) : null), [base, settings.mode, settings.control, settings.labelA, settings.labelB, settings.speed, settings.labelStyle, settings.depth]);

  const setPicture = (side: 'a' | 'b', src: string, name: string) => {
    // the other side keeps its picture; a restored grid has none, so fall back to the demo for it
    const demo = demoMorphPair();
    if (side === 'a') {
      setSrcA(src);
      setNameA(name);
      if (!srcB) setSrcB(demo.b);
    } else {
      setSrcB(src);
      setNameB(name);
      if (!srcA) setSrcA(demo.a);
    }
    setIsDemo(false);
  };

  const restore = (d: MorphData, s: MorphSettings) => {
    restored.current = true;
    setSrcA(null);
    setSrcB(null);
    setNameA('Фото «до» из ссылки');
    setNameB('Фото «после» из ссылки');
    setIsDemo(false);
    setBase(baseFromMorphData(d));
    // links made before the newer settings existed get the defaults
    setSettings({ ...DEMO_MORPH_SETTINGS, ...s });
  };

  return { srcA, srcB, nameA, nameB, setPicture, resetDemo, isDemo, base, settings, setSettings, data, error, setError, viewer, restore };
}

const pill = 'h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0';

export function MorphStage({ state, active }: { state: MorphState; active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<MorphViewer | null>(null);

  useEffect(() => {
    if (active && !viewerRef.current && hostRef.current && state.data) {
      const v = new MorphViewer(hostRef.current, state.data);
      viewerRef.current = v;
      state.viewer.current = v;
      (window as any).__vxMorph = v;
    }
    viewerRef.current?.setPaused(!active);
  }, [active, state.data]);
  useEffect(() => () => viewerRef.current?.dispose(), []);
  useEffect(() => {
    if (state.data) viewerRef.current?.setData(state.data);
  }, [state.data]);

  const d = state.data;
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full lg:w-[calc(100%+22px)] lg:self-start flex-1 min-h-0 lg:pl-[80px] flex items-center justify-center">
        {/* the block keeps the pictures' proportions, like on the site; clear of the wave on desktop */}
        <div
          ref={hostRef}
          className="relative w-full max-h-full rounded-[18px] overflow-hidden select-none shadow-[0_18px_40px_-18px_rgba(40,20,30,0.45)] lg:translate-y-[90px] lg:-translate-x-[30px]"
          style={{ aspectRatio: d ? `${d.w} / ${d.h}` : '4 / 3' }}
        />
      </div>

      <div className="relative z-20 mt-3 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 lg:translate-x-12">
        <div className={`${pill} pr-3`}>
          {MORPH_MODE_OPTIONS.map((o) => {
            const on = state.settings.mode === o.id;
            return (
              <button
                key={o.id}
                type="button"
                title={o.title}
                aria-label={o.label}
                aria-pressed={on}
                onClick={() => state.setSettings({ ...state.settings, mode: o.id })}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  on ? 'bg-[var(--vx-accent)] text-[var(--vx-on)]' : 'text-[#78716c] hover:text-[#132A22] hover:bg-[#f6f3ee]'
                }`}
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d={o.icon} />
                </svg>
              </button>
            );
          })}
          <span className="ml-1 min-w-[58px] text-[11.5px] font-extrabold text-[#132A22] whitespace-nowrap">{MORPH_MODE_OPTIONS.find((o) => o.id === state.settings.mode)?.label}</span>
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
const MAX_FILE = 8 * 1024 * 1024;

function PictureSlot({ side, state }: { side: 'a' | 'b'; state: MorphState }) {
  const s = state.settings;
  const src = side === 'a' ? state.srcA : state.srcB;
  const name = side === 'a' ? state.nameA : state.nameB;
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const read = (f: File | undefined | null) => {
    if (!f) return;
    if (!/^image\/(png|jpeg|webp|gif|svg\+xml)$/.test(f.type)) return state.setError('Нужна картинка: JPG, PNG или WebP');
    if (f.size > MAX_FILE) return state.setError('Фото больше 8 МБ — сохраните его поменьше');
    const r = new FileReader();
    r.onload = () => state.setPicture(side, String(r.result), f.name);
    r.readAsDataURL(f);
  };
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          read(e.dataTransfer?.files?.[0]);
        }}
        title={`${name} — нажмите или перетащите фото`}
        className={`group relative h-[74px] rounded-2xl overflow-hidden border-2 border-dashed transition-colors cursor-pointer ${
          drag ? 'border-[var(--vx-accent)] bg-[var(--vx-soft)]' : 'border-[#e5dfd2] bg-[#fbf9f5] hover:border-[var(--vx-accent)]'
        }`}
      >
        {src && <img src={src} alt={name || "Изображение для морфинга"} className="absolute inset-0 w-full h-full object-cover" />}
        <span className="absolute inset-x-1.5 bottom-1.5 h-6 rounded-full bg-white/90 text-[10.5px] font-extrabold text-[#132A22] flex items-center justify-center shadow-sm group-hover:bg-white">
          {src ? 'Заменить' : 'Загрузить фото'}
        </span>
      </button>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => read((e.target as HTMLInputElement).files?.[0])} />
      <input
        className="w-full px-2.5 py-1.5 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-[11.5px] font-bold outline-none focus:bg-white focus:border-[var(--vx-accent)]"
        value={side === 'a' ? s.labelA : s.labelB}
        maxLength={18}
        placeholder={side === 'a' ? 'До' : 'После'}
        aria-label={side === 'a' ? 'Подпись первой картинки' : 'Подпись второй картинки'}
        onInput={(e) => state.setSettings({ ...s, [side === 'a' ? 'labelA' : 'labelB']: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
}

export function MorphPanel({ state }: { state: MorphState }) {
  const s = state.settings;
  const set = (patch: Partial<MorphSettings>) => state.setSettings({ ...s, ...patch });
  const d = state.data;
  return (
    <div className="flex flex-col gap-2.5 fx-fade-in">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">Морф до/после · 05</span>
        <h2 className="text-3xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">Морф «до / после»</h2>
        <p className="text-[11px] text-[#78716c] font-semibold mt-1">Потяните ползунок — кубики пересоберут одну картинку в другую.</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-center justify-between">
          <span className={label}>Картинки и подписи</span>
          {!state.isDemo && (
            <button type="button" onClick={state.resetDemo} className="text-[10.5px] font-bold text-[#a8a29e] hover:text-[#132A22] cursor-pointer pr-1">
              Вернуть демо
            </button>
          )}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <PictureSlot side="a" state={state} />
          <PictureSlot side="b" state={state} />
        </div>
        {state.error && <div className="text-[11px] font-bold text-[#c2410c] pl-1">{state.error}</div>}
      </div>

      <label className="flex flex-col gap-1">
        <span className={label}>Сетка</span>
        <Segmented items={RESES} value={String(s.res)} onChange={(v) => set({ res: Number(v) })} />
        {!state.srcA && <span className="text-[10.5px] font-semibold text-[#a8a29e] pl-1">Чтобы изменить сетку, загрузите фото ещё раз</span>}
      </label>

      <label className="flex flex-col gap-1">
        <span className={label}>Как запускается</span>
        <Segmented items={CONTROLS} value={s.control} onChange={(control) => set({ control })} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={label}>Скорость перехода</span>
        <Segmented items={SPEEDS} value={s.speed} onChange={(speed) => set({ speed })} />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 min-w-0">
          <span className={label}>Подписи</span>
          <Segmented items={LABEL_STYLES} value={s.labelStyle} onChange={(labelStyle) => set({ labelStyle })} />
        </label>
        <label className="flex flex-col gap-1 min-w-0">
          <span className={label}>Кубики</span>
          <Segmented items={DEPTHS} value={s.depth} onChange={(depth) => set({ depth })} />
        </label>
      </div>

      <div className="text-[11px] font-bold text-right text-[#a8a29e]">
        {d ? `${d.w}×${d.h} = ${(d.w * d.h).toLocaleString('ru-RU')} кубиков · фото не уходят на сервер` : 'Читаем картинки…'}
      </div>
    </div>
  );
}

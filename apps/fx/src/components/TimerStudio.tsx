import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { DatePicker, TimePicker, Select } from './Pickers';
import {
  TimerViewer,
  buildTimerData,
  demoTimerDate,
  timerEndMs,
  TIMEZONES,
  type TimerData,
  type TimerEndAction,
  type TimerEndType,
  type TimerFormat,
  type TimerMode,
  type TimerSettings,
} from '../engine/timerScene';

/** 06 · Таймер акции — studio stage and settings panel (state lives in QrConfigurator). */

export const TIMER_MODE_OPTIONS: { id: TimerMode; label: string; swatch: string }[] = [
  { id: 'sale', label: 'Распродажа', swatch: 'linear-gradient(135deg,#e8343f 0 55%,#ffc83d 55%)' },
  { id: 'launch', label: 'Запуск', swatch: 'linear-gradient(135deg,#35e0b0 0 55%,#1f2a33 55%)' },
  { id: 'newyear', label: 'Новый год', swatch: 'linear-gradient(135deg,#1f9a57 0 55%,#f2c14e 55%)' },
  { id: 'blackfriday', label: 'Чёрная пятница', swatch: 'linear-gradient(135deg,#16161c 0 55%,#ff2e88 55%)' },
  { id: 'minimal', label: 'Минимал', swatch: 'linear-gradient(135deg,#2b2b33 0 55%,#ece6da 55%)' },
  { id: 'spring', label: 'Весна', swatch: 'linear-gradient(135deg,#ec5c9a 0 55%,#fde2ef 55%)' },
];
const FORMATS: { id: TimerFormat; label: string }[] = [
  { id: 'dhms', label: 'С днями' },
  { id: 'hms', label: 'Без дней' },
  { id: 'dhm', label: 'Без секунд' },
];
const END_TYPES: { id: TimerEndType; label: string }[] = [
  { id: 'date', label: 'К дате' },
  { id: 'personal', label: 'Свой у каждого' },
];
const HOURS = [1, 2, 3, 6, 12, 24, 48, 72];
const END_ACTIONS: { id: TimerEndAction; label: string }[] = [
  { id: 'text', label: 'Надпись' },
  { id: 'link', label: 'Переход' },
  { id: 'hide', label: 'Скрыть блок' },
];

export const DEMO_TIMER_SETTINGS: TimerSettings = {
  date: '',
  time: '18:00',
  tz: 3,
  format: 'dhms',
  title: 'До конца распродажи',
  buttonText: 'Купить со скидкой',
  buttonUrl: '',
  endAction: 'text',
  endText: 'Акция началась!',
  endUrl: '',
  endType: 'date',
  hours: 24,
};

export interface TimerState {
  settings: TimerSettings;
  setSettings: (s: TimerSettings) => void;
  mode: TimerMode;
  setMode: (m: TimerMode) => void;
  data: TimerData | null;
  previewEnd: boolean;
  setPreviewEnd: (v: boolean) => void;
  viewer: { current: TimerViewer | null };
  restore: (s: TimerSettings, m: TimerMode) => void;
}

export function useTimerState(): TimerState {
  const [settings, setSettings] = useState<TimerSettings>(DEMO_TIMER_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('sale');
  const [previewEnd, setPreviewEnd] = useState(false);
  const restored = useRef(false);
  const viewer = useRef<TimerViewer | null>(null);
  // the demo date is set in the browser (in 3 days at 18:00 Moscow time)
  useEffect(() => {
    if (!restored.current) setSettings((s) => (s.date ? s : { ...s, ...demoTimerDate() }));
  }, []);
  const data = useMemo(() => buildTimerData(settings, mode), [settings, mode]);
  const restore = (s: TimerSettings, m: TimerMode) => {
    restored.current = true;
    // links made before the newer settings existed get the defaults
    setSettings({ ...DEMO_TIMER_SETTINGS, ...s });
    setMode(m);
  };
  return { settings, setSettings, mode, setMode, data, previewEnd, setPreviewEnd, viewer, restore };
}

const pill = 'h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0';

export function TimerStage({ state, active }: { state: TimerState; active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<TimerViewer | null>(null);

  useEffect(() => {
    if (active && !viewerRef.current && hostRef.current && state.data) {
      const v = new TimerViewer(hostRef.current, state.data);
      viewerRef.current = v;
      state.viewer.current = v;
      (window as any).__vxTimer = v;
    }
    viewerRef.current?.setPaused(!active);
  }, [active, state.data]);
  useEffect(() => () => viewerRef.current?.dispose(), []);
  useEffect(() => {
    if (state.data) viewerRef.current?.setData(state.data);
  }, [state.data]);
  useEffect(() => {
    viewerRef.current?.previewEnd(state.previewEnd);
  }, [state.previewEnd, state.data]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex-1 min-h-0 lg:pl-[72px] flex items-center justify-center">
        <div ref={hostRef} className="relative w-full select-none" />
      </div>

      <div className="relative z-20 mt-3 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 lg:translate-x-9">
        <div className={`${pill} pl-2 pr-3 gap-1.5`}>
          {TIMER_MODE_OPTIONS.map((o) => {
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
          <span className="ml-1 min-w-[96px] text-[11.5px] font-extrabold text-[#132A22] whitespace-nowrap">{TIMER_MODE_OPTIONS.find((o) => o.id === state.mode)?.label}</span>
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

const input =
  'w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:bg-white focus:border-[var(--vx-accent)] transition-colors';
const label = 'text-[9.5px] font-black uppercase tracking-wider text-[#a8a29e] pl-1';

export function TimerPanel({ state }: { state: TimerState }) {
  const s = state.settings;
  const set = (patch: Partial<TimerSettings>) => state.setSettings({ ...s, ...patch });
  const end = timerEndMs(s);
  const past = Number.isFinite(end) && end <= Date.now();
  return (
    <div className="flex flex-col gap-2 fx-fade-in">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">Таймер акции · 06</span>
        <h2 className="text-3xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">Таймер акции</h2>
        <p className="text-[11px] text-[#78716c] font-semibold mt-1">Каждую секунду цифра пересыпается из кубиков в новую.</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className={label}>Когда заканчивается</span>
        <Segmented items={END_TYPES} value={s.endType || 'date'} onChange={(endType) => set({ endType })} />
        {s.endType === 'personal' ? (
          <div className="flex items-center gap-1.5">
            <div className="w-[84px] shrink-0">
              <Select label="Сколько часов" value={s.hours || 24} options={HOURS.map((h) => ({ value: h, label: `${h} ч` }))} onChange={(hours) => set({ hours })} />
            </div>
            <span className="text-[10.5px] font-semibold text-[#78716c] leading-tight">с первого визита — у каждого посетителя свой отсчёт, запоминается в его браузере</span>
          </div>
        ) : (
        <div className="grid grid-cols-[1.3fr_0.62fr_1.15fr] gap-1.5">
          <DatePicker value={s.date} onChange={(date) => set({ date })} />
          <TimePicker value={s.time} onChange={(time) => set({ time })} />
          <Select
            label="Часовой пояс"
            value={s.tz}
            width={210}
            options={TIMEZONES.map((z) => ({ value: z.tz, label: z.label }))}
            display={(v) => (TIMEZONES.find((z) => z.tz === v)?.label || '').replace(/ \(UTC(.+)\)$/, ' $1')}
            onChange={(tz) => set({ tz })}
          />
        </div>
        )}
        {s.endType !== 'personal' && past && <span className="text-[10.5px] font-bold text-[#c2410c] pl-1">Это время уже прошло — посетители сразу увидят финал</span>}
      </div>

      <label className="flex flex-col gap-0.5">
        <span className={label}>Заголовок над таймером</span>
        <input className={input} value={s.title} maxLength={48} placeholder="До конца распродажи" onInput={(e) => set({ title: (e.target as HTMLInputElement).value })} />
      </label>

      <div className="flex flex-col gap-1">
        <span className={label}>Формат</span>
        <Segmented items={FORMATS} value={s.format} onChange={(format) => set({ format })} />
        {s.format === 'hms' && s.endType !== 'personal' && Number.isFinite(end) && end - Date.now() > 99 * 3600_000 && (
          <span className="text-[10.5px] font-bold text-[#c2410c] pl-1">До конца больше 99 часов — часы упрутся в 99. Выберите «С днями»</span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className={label}>Кнопка под таймером (необязательно)</span>
        <div className="grid grid-cols-2 gap-1.5">
          <input className={input} value={s.buttonText} maxLength={28} placeholder="Текст кнопки" onInput={(e) => set({ buttonText: (e.target as HTMLInputElement).value })} />
          <input className={`${input} font-mono`} value={s.buttonUrl} maxLength={300} placeholder="https://…" onInput={(e) => set({ buttonUrl: (e.target as HTMLInputElement).value })} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-center justify-between">
          <span className={label}>Когда время выйдет</span>
          <button
            type="button"
            onClick={() => state.setPreviewEnd(!state.previewEnd)}
            className="text-[10.5px] font-extrabold text-[var(--vx-deep)] hover:text-[#132A22] cursor-pointer pr-1"
          >
            {state.previewEnd ? '← Вернуть отсчёт' : 'Посмотреть финал ▶'}
          </button>
        </span>
        <Segmented items={END_ACTIONS} value={s.endAction} onChange={(endAction) => set({ endAction })} />
        {s.endAction === 'link' ? (
          <input className={`${input} font-mono`} value={s.endUrl} maxLength={300} placeholder="https://… — куда перевести посетителя" onInput={(e) => set({ endUrl: (e.target as HTMLInputElement).value })} />
        ) : s.endAction === 'text' ? (
          <input className={input} value={s.endText} maxLength={36} placeholder="Акция началась!" onInput={(e) => set({ endText: (e.target as HTMLInputElement).value })} />
        ) : (
          <span className="text-[10.5px] font-semibold text-[#a8a29e] pl-1">После конца отсчёта блок исчезнет со страницы</span>
        )}
      </div>
    </div>
  );
}

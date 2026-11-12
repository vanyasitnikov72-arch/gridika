import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import type { ComponentChildren } from 'preact';

/**
 * Site-styled replacements for the system date / time / select pickers.
 * Popovers are rendered into <body> with fixed positioning, so scrolling panels never clip them.
 */

const trigger =
  'w-full min-w-0 h-[30px] px-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none flex items-center gap-1.5 cursor-pointer transition-colors hover:bg-white focus-visible:border-[var(--vx-accent)]';

function Chevron() {
  return (
    <svg className="w-3 h-3 ml-auto shrink-0 text-[#a8a29e]" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

/** a popover under (or above) its anchor; closes on outside click, Escape, scroll or resize */
function Popover({ anchor, open, onClose, children, width }: { anchor: { current: HTMLElement | null }; open: boolean; onClose: () => void; children: ComponentChildren; width?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null);
  useLayoutEffect(() => {
    if (!open || !anchor.current) return;
    const place = () => {
      const r = anchor.current!.getBoundingClientRect();
      const w = Math.max(width ?? r.width, r.width);
      const h = boxRef.current?.offsetHeight ?? 300;
      const up = r.bottom + 6 + h > window.innerHeight && r.top - 6 - h > 0;
      const left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
      setPos({ left, top: up ? r.top - 6 - h : r.bottom + 6, width: w, up });
    };
    place();
    const raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, [open, width]);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (boxRef.current?.contains(t) || anchor.current?.contains(t)) return;
      onClose();
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && (onClose(), anchor.current?.focus());
    const away = (e: Event) => {
      if (boxRef.current && e.target instanceof Node && boxRef.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', away, true);
    window.addEventListener('resize', away);
    return () => {
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', away, true);
      window.removeEventListener('resize', away);
    };
  }, [open]);
  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={boxRef}
      className="fixed z-[200] rounded-2xl bg-white border border-[#ebe5da] shadow-[0_18px_40px_-12px_rgba(40,32,20,0.28)] p-1.5 font-sans text-[#132A22] animate-[gx-pop_.16s_ease-out]"
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999, width: pos?.width, transformOrigin: pos?.up ? 'bottom' : 'top' }}
    >
      <style>{'@keyframes gx-pop{from{opacity:0;transform:translateY(4px) scale(.98)}to{opacity:1;transform:none}}'}</style>
      {children}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------- select

export function Select<T extends string | number>({
  value,
  options,
  onChange,
  label,
  display,
  width,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  /** what the closed button shows (defaults to the option label) */
  display?: (v: T) => string;
  width?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const choose = (v: T) => {
    onChange(v);
    setOpen(false);
    ref.current?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setHi(idx);
      setOpen(true);
    } else if (open && e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((h) => Math.min(options.length - 1, h + 1));
    } else if (open && e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => Math.max(0, h - 1));
    } else if (open && e.key === 'Enter') {
      e.preventDefault();
      choose(options[hi].value);
    }
  };
  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setHi(idx);
          setOpen(!open);
        }}
        onKeyDown={onKey}
        className={`${trigger} ${open ? 'bg-white border-[var(--vx-accent)]' : ''}`}
      >
        <span className="truncate">{display ? display(value) : options[idx]?.label}</span>
        <Chevron />
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width={width}>
        <ul role="listbox" aria-label={label} className="max-h-[260px] overflow-y-auto overscroll-contain [scrollbar-width:thin] flex flex-col gap-0.5">
          {options.map((o, i) => {
            const on = o.value === value;
            return (
              <li
                key={String(o.value)}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setHi(i)}
                onClick={() => choose(o.value)}
                className={`h-8 px-2.5 rounded-xl flex items-center gap-2 text-[12.5px] font-bold cursor-pointer transition-colors ${
                  on ? 'bg-[var(--vx-soft)] text-[#132A22]' : i === hi ? 'bg-[#f6f3ee]' : ''
                }`}
              >
                <span className="truncate">{o.label}</span>
                {on && (
                  <svg className="w-3.5 h-3.5 ml-auto shrink-0 text-[var(--vx-deep)]" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 7.5 6 10.5 11 4" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      </Popover>
    </>
  );
}

// ---------------------------------------------------------------- date

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
const MONTHS_SHORT = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const pad = (v: number) => String(v).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function DatePicker({ value, onChange, label = 'Дата' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [y0, m0, d0] = value ? value.split('-').map(Number) : [0, 0, 0];
  const today = new Date();
  const [view, setView] = useState({ y: y0 || today.getFullYear(), m: (m0 || today.getMonth() + 1) - 1 });
  useEffect(() => {
    if (open && y0) setView({ y: y0, m: m0 - 1 });
  }, [open]);
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const step = (k: number) => setView((v) => ({ y: v.y + Math.floor((v.m + k) / 12), m: (((v.m + k) % 12) + 12) % 12 }));
  const todayKey = ymd(today.getFullYear(), today.getMonth(), today.getDate());
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    ref.current?.focus();
  };
  return (
    <>
      <button ref={ref} type="button" aria-label={label} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} className={`${trigger} ${open ? 'bg-white border-[var(--vx-accent)]' : ''}`}>
        <span className="truncate">{y0 ? `${d0} ${MONTHS_SHORT[m0 - 1]} ${y0}` : 'Выберите дату'}</span>
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width={258}>
        <div role="dialog" aria-label="Календарь" className="p-1.5">
          <div className="flex items-center justify-between px-1 pb-2">
            <button type="button" onClick={() => step(-1)} aria-label="Предыдущий месяц" className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#f6f3ee] cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 2.5 4 6l3.5 3.5" /></svg>
            </button>
            <span className="text-[13px] font-black capitalize">
              {MONTHS[view.m]} {view.y}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Следующий месяц" className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#f6f3ee] cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEK.map((w, i) => (
              <span key={w} className={`h-6 text-[10px] font-black uppercase tracking-wider flex items-center justify-center ${i > 4 ? 'text-[#e0457b]/70' : 'text-[#a8a29e]'}`}>
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={i} />;
              const k = ymd(view.y, view.m, d);
              const sel = k === value, isToday = k === todayKey, past = k < todayKey;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(k)}
                  className={`h-8 rounded-xl text-[12.5px] font-bold transition-colors cursor-pointer ${
                    sel
                      ? 'bg-[var(--vx-accent)] text-[var(--vx-on)] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.35)]'
                      : isToday
                        ? 'ring-2 ring-inset ring-[var(--vx-accent)] text-[#132A22] hover:bg-[#f6f3ee]'
                        : past
                          ? 'text-[#c9c2b6] hover:bg-[#f6f3ee]'
                          : 'text-[#132A22] hover:bg-[#f6f3ee]'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between pt-2 px-1">
            <button type="button" onClick={() => pick(todayKey)} className="text-[11.5px] font-extrabold text-[var(--vx-deep)] hover:underline cursor-pointer">
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => {
                const t = new Date(Date.now() + 7 * 86400_000);
                pick(ymd(t.getFullYear(), t.getMonth(), t.getDate()));
              }}
              className="text-[11.5px] font-extrabold text-[#78716c] hover:text-[#132A22] cursor-pointer"
            >
              Через неделю
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
}

// ---------------------------------------------------------------- time

export function TimePicker({ value, onChange, label = 'Время' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hh, mm] = (value || '00:00').split(':').map(Number);
  const set = (h: number, m: number, close: boolean) => {
    onChange(`${pad(h)}:${pad(m)}`);
    if (close) {
      setOpen(false);
      ref.current?.focus();
    }
  };
  const cell = (on: boolean) =>
    `h-7 rounded-lg text-[12px] font-bold tabular-nums transition-colors cursor-pointer ${on ? 'bg-[var(--vx-accent)] text-[var(--vx-on)]' : 'text-[#132A22] hover:bg-[#f6f3ee]'}`;
  return (
    <>
      <button ref={ref} type="button" aria-label={label} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} className={`${trigger} ${open ? 'bg-white border-[var(--vx-accent)]' : ''}`}>
        <span className="tabular-nums">{value || '—'}</span>
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width={236}>
        <div role="dialog" aria-label="Время" className="p-1.5 flex flex-col gap-2">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] px-1 pb-1">Часы</div>
            <div className="grid grid-cols-6 gap-0.5">
              {Array.from({ length: 24 }, (_, h) => (
                <button key={h} type="button" onClick={() => set(h, mm, false)} className={cell(h === hh)}>
                  {pad(h)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] px-1 pb-1">Минуты</div>
            <div className="grid grid-cols-6 gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                <button key={m} type="button" onClick={() => set(hh, m, true)} className={cell(m === mm)}>
                  {pad(m)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

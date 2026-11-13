import * as THREE from 'three';
// @ts-ignore — plain JS runtime shared with the site snippet
import { createTimerViewer, TIMER_MODES, timerParts } from '../embed/timerRuntime.js';

/**
 * 06 · Таймер акции. The end moment is stored as an absolute UTC time (date + time + time zone),
 * so every visitor sees the same countdown wherever and whenever they open the page.
 */

export type TimerMode = 'sale' | 'launch' | 'newyear' | 'blackfriday' | 'minimal' | 'spring';
export type TimerFormat = 'dhms' | 'hms' | 'dhm';
export type TimerEndType = 'date' | 'personal';
export type TimerEndAction = 'text' | 'link' | 'hide';
export { TIMER_MODES, timerParts };

export function timerEmbedHeight(d: Pick<TimerData, 'format' | 'title' | 'button'>): number {
  return Math.round(900 / (d.format === 'dhms' ? 2.7 : 2.2)) + (d.title ? 40 : 0) + (d.button ? 70 : 0);
}

export interface TimerSettings {
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string;
  /** hours from UTC, e.g. 3 for Moscow */
  tz: number;
  format: TimerFormat;
  /** to a fixed date, or N hours from each visitor's first visit */
  endType?: TimerEndType;
  hours?: number;
  title: string;
  buttonText: string;
  buttonUrl: string;
  endAction: TimerEndAction;
  endText: string;
  endUrl: string;
}

export interface TimerData {
  end: number;
  format: TimerFormat;
  /** hours from the visitor's first visit (0 = a fixed date) */
  personal?: number;
  /** keeps each visitor's countdown between visits */
  pid?: string;
  title: string;
  button: { text: string; url: string } | null;
  endAction: TimerEndAction;
  endText: string;
  endUrl: string;
  mode: TimerMode;
}

export const TIMEZONES: { tz: number; label: string }[] = [
  { tz: 2, label: 'Калининград (UTC+2)' },
  { tz: 3, label: 'Москва (UTC+3)' },
  { tz: 4, label: 'Самара (UTC+4)' },
  { tz: 5, label: 'Екатеринбург (UTC+5)' },
  { tz: 6, label: 'Омск (UTC+6)' },
  { tz: 7, label: 'Новосибирск (UTC+7)' },
  { tz: 8, label: 'Иркутск (UTC+8)' },
  { tz: 9, label: 'Якутск (UTC+9)' },
  { tz: 10, label: 'Владивосток (UTC+10)' },
  { tz: 11, label: 'Магадан (UTC+11)' },
  { tz: 12, label: 'Камчатка (UTC+12)' },
  { tz: 0, label: 'Лондон (UTC+0)' },
  { tz: 1, label: 'Берлин (UTC+1)' },
];

/** the end moment in UTC ms (NaN if the date or time is incomplete) */
export function timerEndMs(s: Pick<TimerSettings, 'date' | 'time' | 'tz'>): number {
  const [y, m, d] = s.date.split('-').map(Number);
  const [hh, mm] = (s.time || '00:00').split(':').map(Number);
  if (!y || !m || !d) return NaN;
  return Date.UTC(y, m - 1, d, hh || 0, mm || 0) - s.tz * 3600_000;
}

/** a demo end: in 3 days at 18:00 Moscow time */
export function demoTimerDate(now = Date.now()): { date: string; time: string } {
  const msk = new Date(now + 3 * 3600_000 + 3 * 86400_000);
  const pad = (v: number) => String(v).padStart(2, '0');
  return { date: `${msk.getUTCFullYear()}-${pad(msk.getUTCMonth() + 1)}-${pad(msk.getUTCDate())}`, time: '18:00' };
}

export function buildTimerData(s: TimerSettings, mode: TimerMode): TimerData | null {
  const personal = s.endType === 'personal' ? Math.max(1, Math.min(720, s.hours || 24)) : 0;
  const end = personal ? 0 : timerEndMs(s);
  if (!personal && !Number.isFinite(end)) return null;
  // the same campaign keeps the same id, so returning visitors keep their countdown after a code update
  let hash = 5381;
  for (const ch of `${s.title}|${personal}`) hash = ((hash * 33) ^ ch.charCodeAt(0)) >>> 0;
  const bt = s.buttonText.trim();
  return {
    end,
    format: s.format,
    personal,
    pid: personal ? hash.toString(36) : undefined,
    title: s.title.trim(),
    button: bt ? { text: bt, url: s.buttonUrl.trim() } : null,
    endAction: s.endAction,
    endText: s.endText.trim(),
    endUrl: s.endUrl.trim(),
    mode,
  };
}

interface RuntimeApi {
  setData(d: TimerData): void;
  previewEnd(v: boolean): void;
  setPaused(p: boolean): void;
  snapshot(): HTMLCanvasElement;
  settle(): void;
  dispose(): void;
}

export class TimerViewer {
  private api: RuntimeApi;
  constructor(container: HTMLElement, data: TimerData) {
    container.innerHTML = '';
    this.api = createTimerViewer(THREE, container, { data, studio: true }) as RuntimeApi;
  }
  setData(d: TimerData) {
    this.api.setData(d);
  }
  previewEnd(v: boolean) {
    this.api.previewEnd(v);
  }
  setPaused(p: boolean) {
    this.api.setPaused(p);
  }
  snapshot() {
    return this.api.snapshot();
  }
  settle() {
    this.api.settle();
  }
  dispose() {
    this.api.dispose();
  }
}

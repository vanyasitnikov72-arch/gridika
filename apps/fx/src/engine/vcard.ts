/**
 * Contact card → vCard 3.0 text for the QR on the back of the business card.
 * Scanning it offers "Add contact" on iOS and Android. Empty fields are skipped
 * to keep the QR as small (and as easy to scan) as possible.
 */

export interface CardContact {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  site: string;
  /** Telegram username without @ */
  telegram: string;
  /** WhatsApp number (digits) */
  whatsapp: string;
}

export const EMPTY_CONTACT: CardContact = {
  name: '',
  role: '',
  company: '',
  phone: '',
  email: '',
  site: '',
  telegram: '',
  whatsapp: '',
};

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export const cleanPhone = (v?: string) => {
  const d = (v || '').replace(/[^\d+]/g, '');
  return d.startsWith('8') && d.length === 11 ? '+7' + d.slice(1) : d;
};
export const cleanSite = (v?: string) => (v || '').trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
export const cleanTelegram = (v?: string) => (v || '').trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//i, '');

export const telegramUrl = (c: Partial<CardContact>) => (cleanTelegram(c.telegram) ? `https://t.me/${cleanTelegram(c.telegram)}` : '');
export const whatsappUrl = (c: Partial<CardContact>) => {
  const d = cleanPhone(c.whatsapp).replace('+', '');
  return d ? `https://wa.me/${d}` : '';
};
export const siteUrl = (c: Partial<CardContact>) => (cleanSite(c.site) ? `https://${cleanSite(c.site)}` : '');

/** fields that can be left out of the QR (in this order) when it gets too dense to scan */
export const QR_OPTIONAL: (keyof CardContact)[] = ['whatsapp', 'company', 'role', 'telegram', 'site'];

export function buildVCard(rawContact: Partial<CardContact>, omit: (keyof CardContact)[] = []): string {
  let c: CardContact = { ...EMPTY_CONTACT, ...(rawContact || {}) };
  if (omit.length) c = { ...c, ...Object.fromEntries(omit.map((k) => [k, ''])) };
  const name = (c.name || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  // "Имя Фамилия" → N:Фамилия;Имя
  const first = parts[0] ?? '';
  const last = parts.slice(1).join(' ');
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${esc(last)};${esc(first)};;;`, `FN:${esc(name || 'Контакт')}`];
  if (c.company?.trim()) lines.push(`ORG:${esc(c.company.trim())}`);
  if (c.role?.trim()) lines.push(`TITLE:${esc(c.role.trim())}`);
  if (cleanPhone(c.phone)) lines.push(`TEL;TYPE=CELL:${cleanPhone(c.phone)}`);
  if (c.email?.trim()) lines.push(`EMAIL:${c.email.trim()}`);
  if (siteUrl(c)) lines.push(`URL:${siteUrl(c)}`);
  if (telegramUrl(c)) lines.push(`URL:${telegramUrl(c)}`);
  if (whatsappUrl(c)) lines.push(`URL:${whatsappUrl(c)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

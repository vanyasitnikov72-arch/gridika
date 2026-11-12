/**
 * The email a buyer gets after paying: what was bought and one link to the ready codes.
 * No keys: the link (/thanks#order=…&items=…) carries every effect's settings and builds the codes.
 * Table layout with inline styles so it renders the same in Gmail, Yandex, Mail.ru and Outlook;
 * no images (often blocked), the brand is set in text.
 */
import { VOXEL_DARK_PATH, VOXEL_GREEN_PATH } from './keyEmail';

export interface OrderEmailItem {
  title: string;
  /** e.g. «Дерево · zerno-coffee.ru» */
  subtitle: string;
  accent: string;
}

export interface OrderEmail {
  orderId: string;
  items: OrderEmailItem[];
  /** paid total, ₽ */
  total: number;
  /** link to the ready codes: https://gridika.ru/thanks#order=…&items=… */
  orderUrl: string;
  accent?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rub = (v: number) => `${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;')}&nbsp;₽`;
export const effectsWord = (n: number) =>
  `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'эффект' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'эффекта' : 'эффектов'}`;

export function renderOrderEmail(e: OrderEmail): string {
  const accent = e.accent ?? '#19C37D';
  const ink = '#132A22', muted = '#6b645c', line = '#ece6da', cream = '#f6f3ee';
  const font = "'Nunito','Segoe UI',Roboto,Arial,sans-serif";
  const many = e.items.length > 1;
  const step = (n: number, title: string, text: string) => `
    <tr><td style="padding:0 0 14px 0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" style="width:28px"><div style="width:22px;height:22px;border-radius:11px;background:${accent};color:${ink};font:800 12px/22px ${font};text-align:center">${n}</div></td>
        <td style="padding-left:10px;font:600 14px/20px ${font};color:${muted}"><b style="color:${ink}">${title}</b><br>${text}</td>
      </tr></table>
    </td></tr>`;
  const item = (it: OrderEmailItem) => `
    <tr><td style="padding:12px 14px;border-bottom:1px solid ${line}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" style="width:22px;padding-top:4px"><div style="width:12px;height:12px;border-radius:4px;background:${esc(it.accent)}"></div></td>
        <td valign="top" style="font:800 14px/19px ${font};color:${ink}">${esc(it.title)}<br><span style="font:600 12.5px/18px ${font};color:${muted}">${esc(it.subtitle)}</span></td>
      </tr></table>
    </td></tr>`;

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ваш заказ Gridika № ${esc(e.orderId)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${cream}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${cream}"><tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">

    <tr><td style="padding:0 8px 18px 8px">
      <div style="display:inline-block;line-height:1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 11" width="100" height="22" shape-rendering="crispEdges" style="display:block">
          <path d="${VOXEL_DARK_PATH}" fill="${ink}"/>
          <path d="${VOXEL_GREEN_PATH}" fill="${accent}"/>
        </svg>
        <div style="padding-top:7px;font:700 10.5px/1 ${font};letter-spacing:0.15em;color:#a8a29e;text-transform:uppercase">3D для сайтов</div>
      </div>
    </td></tr>

    <tr><td style="background:#ffffff;border:1px solid ${line};border-radius:24px;padding:32px 28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font:900 26px/1.15 ${font};color:${ink};letter-spacing:-0.5px">Спасибо за покупку!</td></tr>
        <tr><td style="padding-top:8px;font:600 15px/22px ${font};color:${muted}">${
          many ? `Код всех ${e.items.length} эффектов уже собран с вашими настройками.` : 'Код уже собран с вашими настройками.'
        } Он ваш навсегда — без подписки и привязки к сайту.</td></tr>

        <tr><td style="padding-top:22px">
          <div style="font:800 11px/1 ${font};letter-spacing:1.5px;text-transform:uppercase;color:#a8a29e;padding-bottom:8px">Заказ № ${esc(e.orderId)} · ${effectsWord(e.items.length)}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${cream};border-radius:16px">
            ${e.items.map(item).join('')}
            <tr><td style="padding:12px 14px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="font:800 11px/1 ${font};letter-spacing:1.2px;text-transform:uppercase;color:#a8a29e">Оплачено</td>
                <td align="right" style="font:900 18px/1 ${font};color:${ink}">${rub(e.total)}</td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-top:22px" align="left">
          <a href="${esc(e.orderUrl)}" style="display:inline-block;background:${ink};color:#ffffff;text-decoration:none;font:800 15px/1 ${font};padding:15px 24px;border-radius:999px">${many ? 'Забрать код эффектов' : 'Забрать код'}&nbsp;&nbsp;→</a>
        </td></tr>
        <tr><td style="padding-top:10px;font:600 12px/18px ${font};color:#a8a29e">По ссылке — готовый код${many ? ' каждого эффекта' : ''}: скопируйте его или скачайте файлом.</td></tr>

        <tr><td style="padding-top:26px;border-top:1px solid ${line}"></td></tr>
        <tr><td style="padding-top:20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${step(1, 'Заберите код', many ? 'Кнопкой выше. У каждого эффекта свой код — копируйте по одному.' : 'Кнопкой выше: скопируйте его или скачайте файлом.')}
          ${step(2, 'Вставьте на сайт', `Tilda — блок T123 «HTML-код», WordPress — «Произвольный HTML», Webflow — Code Embed.${many ? ' Каждый эффект — в свой блок.' : ''}`)}
          ${step(3, 'Опубликуйте страницу', 'Эффект заработает сразу — на компьютере и на телефоне.')}
        </table></td></tr>

        <tr><td style="padding-top:8px">
          <div style="background:${cream};border-radius:14px;padding:14px 16px;font:600 13px/20px ${font};color:${muted}">
            <b style="color:${ink}">Сохраните это письмо.</b> Ссылка не сгорает: по ней код можно скопировать снова в любой момент. Текст и ссылки кнопок можно поправить прямо в коде, а QR, промокод или логотип — в студии: откройте эффект по ссылке и нажмите «Изменить в студии». Чек об оплате приходит отдельным письмом от платёжного сервиса.
          </div>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:18px 8px 0 8px;font:600 12px/18px ${font};color:#a8a29e">
      Есть вопросы? Напишите нам: <a href="mailto:support@gridika.ru" style="color:${ink};font-weight:700;text-decoration:underline">support@gridika.ru</a> &bull; <a href="https://gridika.ru" style="color:${muted};text-decoration:none">gridika.ru</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

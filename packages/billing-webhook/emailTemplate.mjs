/**
 * Renders the official Gridika key email for buyers.
 * Cross-client HTML table layout compatible with Gmail, Mail.ru, Yandex and Outlook.
 */

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PRODUCT_NAMES = {
  'qr-morph': '3D QR-Морфинг',
  'qr-card': 'Визитка с QR',
  'gift-box': '3D-подарок',
  'voxel-logo': '3D-логотип',
  'voxel-morph': '3D-морф до/после',
  'sale-timer': 'Таймер скидки',
  'all': 'Все эффекты Gridika',
};

const PRODUCT_ACCENTS = {
  'qr-morph': '#19C37D',
  'qr-card': '#5C7CFA',
  'gift-box': '#FF6B6B',
  'voxel-logo': '#9B51E0',
  'voxel-morph': '#FA5252',
  'sale-timer': '#FFA94D',
  'all': '#19C37D',
};

// Voxel paths for Gridika logo
const VOXEL_DARK_PATH =
  'M4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM19 0h1v1h-1zM20 0h1v1h-1zM21 0h1v1h-1zM28 0h1v1h-1zM29 0h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM19 1h1v1h-1zM20 1h1v1h-1zM21 1h1v1h-1zM28 1h1v1h-1zM29 1h1v1h-1zM30 1h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM28 2h1v1h-1zM29 2h1v1h-1zM30 2h1v1h-1zM1 3h1v1h-1zM2 3h1v1h-1zM3 3h1v1h-1zM12 3h1v1h-1zM13 3h1v1h-1zM16 3h1v1h-1zM20 3h1v1h-1zM25 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM29 3h1v1h-1zM30 3h1v1h-1zM1 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM12 4h1v1h-1zM13 4h1v1h-1zM14 4h1v1h-1zM15 4h1v1h-1zM16 4h1v1h-1zM17 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM21 4h1v1h-1zM23 4h1v1h-1zM24 4h1v1h-1zM25 4h1v1h-1zM26 4h1v1h-1zM27 4h1v1h-1zM28 4h1v1h-1zM29 4h1v1h-1zM30 4h1v1h-1zM1 5h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM16 5h1v1h-1zM19 5h1v1h-1zM20 5h1v1h-1zM21 5h1v1h-1zM23 5h1v1h-1zM24 5h1v1h-1zM25 5h1v1h-1zM28 5h1v1h-1zM29 5h1v1h-1zM30 5h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM14 6h1v1h-1zM19 6h1v1h-1zM20 6h1v1h-1zM21 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM28 6h1v1h-1zM29 6h1v1h-1zM30 6h1v1h-1zM1 7h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM14 7h1v1h-1zM19 7h1v1h-1zM20 7h1v1h-1zM21 7h1v1h-1zM23 7h1v1h-1zM24 7h1v1h-1zM28 7h1v1h-1zM29 7h1v1h-1zM30 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM14 8h1v1h-1zM19 8h1v1h-1zM20 8h1v1h-1zM21 8h1v1h-1zM23 8h1v1h-1zM24 8h1v1h-1zM25 8h1v1h-1zM28 8h1v1h-1zM29 8h1v1h-1zM30 8h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM14 9h1v1h-1zM19 9h1v1h-1zM20 9h1v1h-1zM21 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM25 9h1v1h-1zM26 9h1v1h-1zM27 9h1v1h-1zM28 9h1v1h-1zM29 9h1v1h-1zM30 9h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM19 10h1v1h-1zM20 10h1v1h-1zM24 10h1v1h-1zM25 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM29 10h1v1h-1z';

const VOXEL_GREEN_PATH =
  'M32 0h1v1h-1zM33 0h1v1h-1zM34 0h1v1h-1zM36 0h1v1h-1zM37 0h1v1h-1zM32 1h1v1h-1zM33 1h1v1h-1zM34 1h1v1h-1zM36 1h1v1h-1zM37 1h1v1h-1zM38 1h1v1h-1zM36 2h1v1h-1zM37 2h1v1h-1zM38 2h1v1h-1zM33 3h1v1h-1zM36 3h1v1h-1zM37 3h1v1h-1zM38 3h1v1h-1zM41 3h1v1h-1zM42 3h1v1h-1zM45 3h1v1h-1zM46 3h1v1h-1zM47 3h1v1h-1zM48 3h1v1h-1zM32 4h1v1h-1zM33 4h1v1h-1zM34 4h1v1h-1zM36 4h1v1h-1zM37 4h1v1h-1zM38 4h1v1h-1zM40 4h1v1h-1zM41 4h1v1h-1zM42 4h1v1h-1zM44 4h1v1h-1zM45 4h1v1h-1zM46 4h1v1h-1zM47 4h1v1h-1zM48 4h1v1h-1zM49 4h1v1h-1zM50 4h1v1h-1zM32 5h1v1h-1zM33 5h1v1h-1zM34 5h1v1h-1zM36 5h1v1h-1zM37 5h1v1h-1zM38 5h1v1h-1zM39 5h1v1h-1zM40 5h1v1h-1zM41 5h1v1h-1zM42 5h1v1h-1zM48 5h1v1h-1zM49 5h1v1h-1zM50 5h1v1h-1zM32 6h1v1h-1zM33 6h1v1h-1zM34 6h1v1h-1zM36 6h1v1h-1zM37 6h1v1h-1zM38 6h1v1h-1zM39 6h1v1h-1zM40 6h1v1h-1zM41 6h1v1h-1zM46 6h1v1h-1zM47 6h1v1h-1zM48 6h1v1h-1zM49 6h1v1h-1zM50 6h1v1h-1zM32 7h1v1h-1zM33 7h1v1h-1zM34 7h1v1h-1zM36 7h1v1h-1zM37 7h1v1h-1zM38 7h1v1h-1zM39 7h1v1h-1zM40 7h1v1h-1zM41 7h1v1h-1zM44 7h1v1h-1zM45 7h1v1h-1zM46 7h1v1h-1zM47 7h1v1h-1zM48 7h1v1h-1zM49 7h1v1h-1zM50 7h1v1h-1zM32 8h1v1h-1zM33 8h1v1h-1zM34 8h1v1h-1zM36 8h1v1h-1zM37 8h1v1h-1zM38 8h1v1h-1zM39 8h1v1h-1zM40 8h1v1h-1zM41 8h1v1h-1zM42 8h1v1h-1zM44 8h1v1h-1zM45 8h1v1h-1zM48 8h1v1h-1zM49 8h1v1h-1zM50 8h1v1h-1zM32 9h1v1h-1zM33 9h1v1h-1zM34 9h1v1h-1zM36 9h1v1h-1zM37 9h1v1h-1zM38 9h1v1h-1zM40 9h1v1h-1zM41 9h1v1h-1zM42 9h1v1h-1zM44 9h1v1h-1zM45 9h1v1h-1zM46 9h1v1h-1zM47 9h1v1h-1zM48 9h1v1h-1zM49 9h1v1h-1zM50 9h1v1h-1zM32 10h1v1h-1zM33 10h1v1h-1zM36 10h1v1h-1zM37 10h1v1h-1zM41 10h1v1h-1zM42 10h1v1h-1zM45 10h1v1h-1zM46 10h1v1h-1zM47 10h1v1h-1zM49 10h1v1h-1zM50 10h1v1h-1z';

export function renderEmail({ product, key, keyId, domain, holder, studioUrl, readyUrl }) {
  const productTitle = PRODUCT_NAMES[product] || product;
  const accent = PRODUCT_ACCENTS[product] || '#19C37D';
  const ink = '#132A22', muted = '#6b645c', line = '#ece6da', cream = '#f6f3ee';
  const font = "'Nunito','Segoe UI',Roboto,Arial,sans-serif";
  const mono = "'JetBrains Mono',Consolas,'Courier New',monospace";
  const site = !domain || domain === '*' ? 'для одного сайта на ваш выбор' : `для сайта <b style="color:${ink}">${esc(domain)}</b>`;

  const step = (n, title, text) => `
    <tr><td style="padding:0 0 14px 0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" style="width:28px"><div style="width:22px;height:22px;border-radius:11px;background:${accent};color:${ink};font:800 12px/22px ${font};text-align:center">${n}</div></td>
        <td style="padding-left:10px;font:600 14px/20px ${font};color:${muted}"><b style="color:${ink}">${title}</b><br>${text}</td>
      </tr></table>
    </td></tr>`;

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ваш ключ Gridika</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
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
        <tr><td style="padding-top:8px;font:600 15px/22px ${font};color:${muted}">${esc(productTitle)}${holder ? ` «${esc(holder)}»` : ''} ${site}. Навсегда, без подписки.${holder ? ' Телефон, ссылки, цвет и стиль можно менять в любой момент.' : ''}</td></tr>

        <tr><td style="padding-top:22px">
          <div style="font:800 11px/1 ${font};letter-spacing:1.5px;text-transform:uppercase;color:#a8a29e;padding-bottom:8px">Ваш ключ · № ${esc(keyId)}</div>
          <div style="background:${cream};border:1px dashed ${accent};border-radius:14px;padding:14px 16px;font:600 12px/18px ${mono};color:${ink};word-break:break-all">${esc(key)}</div>
        </td></tr>

        <tr><td style="padding-top:22px" align="left">
          ${
            readyUrl
              ? `<a href="${esc(readyUrl)}" style="display:inline-block;background:${ink};color:#ffffff;text-decoration:none;font:800 15px/1 ${font};padding:15px 24px;border-radius:999px">Скопировать готовый код&nbsp;&nbsp;→</a>
          &nbsp;&nbsp;<a href="${esc(studioUrl)}" style="display:inline-block;color:${ink};text-decoration:underline;font:700 14px/1 ${font};padding:15px 4px">Изменить в студии</a>`
              : `<a href="${esc(studioUrl)}" style="display:inline-block;background:${ink};color:#ffffff;text-decoration:none;font:800 15px/1 ${font};padding:15px 24px;border-radius:999px">Получить код в студии&nbsp;&nbsp;→</a>`
          }
        </td></tr>
        <tr><td style="padding-top:10px;font:600 12px/18px ${font};color:#a8a29e">${readyUrl ? 'Код уже собран с вашими настройками — останется вставить его на сайт.' : 'Кнопка откроет студию с уже вставленным ключом.'}</td></tr>

        <tr><td style="padding-top:26px;border-top:1px solid ${line}"></td></tr>
        <tr><td style="padding-top:20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${step(1, 'Заберите код', readyUrl ? 'Кнопкой выше: скопируйте его или скачайте файлом.' : 'Кнопкой выше — студия откроется с ключом, код соберётся под ваш сайт.')}
          ${step(2, 'Вставьте на сайт', 'Tilda — блок T123 «HTML-код», WordPress — «Произвольный HTML», Webflow — Code Embed.')}
          ${step(3, 'Нужно что-то поменять?', 'Не правьте код вручную — QR и надписи в нём собраны из кубиков. Откройте студию с ключом, поменяйте и замените старый код новым.')}
        </table></td></tr>

        <tr><td style="padding-top:8px">
          <div style="background:${cream};border-radius:14px;padding:14px 16px;font:600 13px/20px ${font};color:${muted}">
            <b style="color:${ink}">Сохраните это письмо.</b> Ключ не сгорает: пересобирайте код для своего сайта сколько угодно раз — если поменяется ссылка или вы обновите страницу. Чек об оплате приходит отдельным письмом от платёжного сервиса.
          </div>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:18px 8px 0 8px;font:600 12px/18px ${font};color:#a8a29e">
      Вопросы — просто ответьте на это письмо. <a href="https://gridika.ru" style="color:${muted}">gridika.ru</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

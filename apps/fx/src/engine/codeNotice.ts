/**
 * What every bought snippet says about itself, and how the buyer takes it home (copy or file).
 * Titles, captions and button links are plain text the buyer may edit; the QR, promo code, logo
 * and photos are baked into the code as voxels, so those change through the studio.
 */

/** Header comment of a bought snippet: what it is, which order, and what not to do with it. */
export function codeHeader(title: string, license: { id: string; domain: string }): string {
  const where = license.domain && license.domain !== '*' ? ` · сайт ${license.domain}` : '';
  return `<!--
  Gridika · ${title}
  Заказ № ${license.id}${where} · код ваш навсегда, без подписки

  Вставьте код целиком в HTML-блок сайта (Tilda — блок T123).

  Заголовки, подписи, текст и ссылки кнопок можно менять прямо здесь —
  это обычный текст в кавычках (найдите его через Ctrl+F).
  QR, промокод, логотип и фото собраны из кубиков: их меняйте
  на gridika.ru и вставьте новый код вместо этого.
-->`;
}

/** File name for the downloaded code, e.g. gridika-qr-card-zerno-coffee.ru.txt */
export function codeFileName(product: string, domain: string): string {
  const site = (domain || 'site').replace(/[^a-z0-9.-]/gi, '_');
  return `gridika-${product}-${site}.txt`;
}

/** Saves the code as a plain text file — opens in any text editor, the code is copied from there. */
export function downloadCode(code: string, fileName: string): void {
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

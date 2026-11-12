/**
 * What every bought snippet says about itself, and how the buyer takes it home (copy or file).
 * The link, text and QR are baked into the code as voxels, so hand edits break the picture —
 * changes go through the studio with the same key.
 */

/** Header comment of a licensed snippet: what it is, for which site, and how to change it. */
export function codeHeader(title: string, license: { id: string; domain: string }): string {
  return `<!--
  Gridika · ${title}
  Ключ ${license.id} · сайт ${license.domain}

  Не меняйте этот код вручную: картинка, текст и QR в нём уже собраны
  из кубиков — ручная правка их сломает.

  Как поменять ссылку, текст, логотип или цвет:
    1. gridika.ru → «Получить код» → вставьте ключ из письма
    2. Измените что нужно и скопируйте новый код
    3. На сайте удалите этот код и вставьте новый на его место
  Ключ можно использовать сколько угодно раз для этого сайта.
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

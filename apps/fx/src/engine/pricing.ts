/**
 * Prices, one-off (no subscriptions). One rule for the cart, the pricing section and the email:
 * the first code is 1 490 ₽, the second 1 200 ₽, and every next one is 100 ₽ cheaper,
 * down to 790 ₽ from the 7th code on (the studio pack).
 *   1 — 1 490 ₽ · 2 — 2 690 ₽ · 3 — 3 790 ₽ · 4 — 4 790 ₽ · 5 — 5 690 ₽ · 6 — 6 490 ₽ · +790 ₽ each
 * A "code" is one configured effect in the order; the same effect may be ordered several times.
 */
export const PRICE_ONE = 1;
/** what the 2nd … 6th code adds to the order */
const STEPS = [1, 1, 1, 1, 1];
/** every code from the 7th on */
export const EXTRA_CODE_PRICE = 1;
/** all effects of the line: 6 codes */
export const BUNDLE_MAX = 6;

/** what the n-th code in the order costs (1-based) */
export function codePrice(nth: number): number {
  if (nth <= 1) return PRICE_ONE;
  return STEPS[nth - 2] ?? EXTRA_CODE_PRICE;
}

export function orderTotal(n: number): number {
  let total = 0;
  for (let i = 1; i <= n; i++) total += codePrice(i);
  return total;
}

export const BUNDLE_PRICE = orderTotal(BUNDLE_MAX);

export function orderPrice(n: number): { total: number; discount: number; rawTotal: number } {
  const total = orderTotal(n);
  const rawTotal = Math.max(0, n) * PRICE_ONE;
  return { total, discount: rawTotal - total, rawTotal };
}

const codesWord = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'код' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'кода' : 'кодов');
export const codes = (n: number) => `${n} ${codesWord(n)}`;
export const rub = (v: number) => `${v.toLocaleString('ru-RU')} ₽`;

const ORDINAL = ['', 'Первый', 'Второй', 'Третий', 'Четвёртый', 'Пятый', 'Шестой'];

/** what the next code in the order would cost — the nudge under the total */
export function nextCodeHint(n: number): string | null {
  if (n <= 0) return null;
  if (n >= BUNDLE_MAX) return `Каждый следующий код — всего ${rub(EXTRA_CODE_PRICE)}`;
  return `${ORDINAL[n + 1]} код — ${rub(codePrice(n + 1))}, каждый следующий ещё дешевле`;
}

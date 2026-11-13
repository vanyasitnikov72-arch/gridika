/**
 * The orders function (packages/billing-webhook) — its «Ссылка для вызова» from Yandex Cloud Functions,
 * e.g. 'https://functions.yandexcloud.net/d4e…'. It is public, not a secret.
 * Empty: payments are switched off on the site (the cart shows «Оплата скоро»), nothing breaks.
 */
export const ORDERS_API = '';

/** the URL for one action of the function, or '' while it is not connected */
export function ordersApi(action: string): string {
  if (!ORDERS_API) return '';
  return `${ORDERS_API}${ORDERS_API.includes('?') ? '&' : '?'}action=${encodeURIComponent(action)}`;
}

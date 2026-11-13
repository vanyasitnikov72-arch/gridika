export const PRICE_ONE = 1490;
const STEPS = [1200, 1100, 1000, 900, 800];
export const EXTRA_CODE_PRICE = 790;
export const BUNDLE_MAX = 6;

export function codePrice(nth) {
  if (nth <= 1) return PRICE_ONE;
  return STEPS[nth - 2] ?? EXTRA_CODE_PRICE;
}

export function orderTotal(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += codePrice(i);
  return total;
}

export function orderPrice(n) {
  const total = orderTotal(n);
  const rawTotal = Math.max(0, n) * PRICE_ONE;
  return { total, discount: rawTotal - total, rawTotal };
}

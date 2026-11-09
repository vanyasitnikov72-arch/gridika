/**
 * Утилиты форматирования денежных сумм и процентов для локали РФ
 */

export interface FormatCurrencyOptions {
  showKopecks?: boolean;
  withSymbol?: boolean;
}

/**
 * Форматирует число в рубли: 150000 -> "150 000 ₽"
 * Использует неразрывный пробел (\u00A0) для защиты от переноса валюты.
 */
export function formatRubles(amount: number, options: FormatCurrencyOptions = {}): string {
  const { showKopecks = false, withSymbol = true } = options;

  if (isNaN(amount) || !isFinite(amount)) {
    return `0${withSymbol ? '\u00A0₽' : ''}`;
  }

  const rounded = showKopecks ? Math.round(amount * 100) / 100 : Math.round(amount);
  const parts = rounded.toFixed(showKopecks ? 2 : 0).split('.');
  
  // Добавляем пробелы между тысячами
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  const decimalPart = parts[1] ? `,${parts[1]}` : '';

  const formattedNumber = `${integerPart}${decimalPart}`;
  return withSymbol ? `${formattedNumber}\u00A0₽` : formattedNumber;
}

/**
 * Форматирует процент: 0.13 -> "13%"
 */
export function formatPercent(rate: number, decimals: number = 0): string {
  if (isNaN(rate) || !isFinite(rate)) return '0%';
  const val = (rate * 100).toFixed(decimals).replace('.', ',');
  return `${val}%`;
}

/**
 * Очищает пользовательский ввод и преобразует в число
 */
export function parseNumberInput(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) || value < 0 ? 0 : value;
  }
  if (!value) return 0;
  
  // Очищаем от пробелов, букв, заменяем запятую на точку
  const cleaned = value.replace(/[\s\u00A0]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

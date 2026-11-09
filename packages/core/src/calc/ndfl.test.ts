import { describe, it, expect } from 'vitest';
import {
  calculateSalaryFromGross,
  calculateGrossFromNet,
  calculateProgressiveTax,
  formatRubles,
  formatPercent,
  parseNumberInput,
} from '../index';

describe('NDFL 2026 Progressive Scale Calculations', () => {
  it('correctly calculates 13% tax for salary below 2.4M threshold', () => {
    const res = calculateSalaryFromGross({ monthlyGross: 100000 });

    expect(res.monthlyGross).toBe(100000);
    expect(res.annualGross).toBe(1200000);
    // 13% от 100 000 = 13 000
    expect(res.monthlyNetFirstMonth).toBe(87000);
    expect(res.monthlyNetLastMonth).toBe(87000);
    expect(res.monthlyNetAverage).toBe(87000);
    expect(res.annualNdfl).toBe(156000);
    expect(res.annualNet).toBe(1044000);
    expect(res.effectiveTaxRate).toBeCloseTo(0.13, 3);
  });

  it('correctly transitions from 13% to 15% when crossing 2.4M threshold during the year', () => {
    // 300 000 в месяц:
    // Месяцы 1-8 (сумма 2,4 млн) облагаются по 13% (налог 39 000, на руки 261 000)
    // Месяцы 9-12 (сумма с 2,4 до 3,6 млн) облагаются по 15% (налог 45 000, на руки 255 000)
    const res = calculateSalaryFromGross({ monthlyGross: 300000 });

    expect(res.annualGross).toBe(3600000);
    // Месяц 1: 300 000 - 39 000 = 261 000
    expect(res.months[0].ndflMonthly).toBe(39000);
    expect(res.months[0].netSalary).toBe(261000);

    // Месяц 8: накопительно 2.4 млн, ровно граница 13%
    expect(res.months[7].cumulativeGross).toBe(2400000);
    expect(res.months[7].ndflMonthly).toBe(39000);
    expect(res.months[7].netSalary).toBe(261000);

    // Месяц 9: превышение 2.4 млн, ставка 15%
    expect(res.months[8].ndflMonthly).toBe(45000);
    expect(res.months[8].netSalary).toBe(255000);

    // Годовой налог: 2.4M * 0.13 (312 000) + 1.2M * 0.15 (180 000) = 492 000
    expect(res.annualNdfl).toBe(492000);
    expect(res.annualNet).toBe(3600000 - 492000);
  });

  it('correctly calculates high income brackets up to 18%', () => {
    // 600 000 в месяц -> 7 200 000 в год
    // 2.4M * 0.13 = 312 000
    // 2.6M (от 2.4 до 5.0) * 0.15 = 390 000
    // 2.2M (от 5.0 до 7.2) * 0.18 = 396 000
    // Итого налог = 1 098 000
    const res = calculateSalaryFromGross({ monthlyGross: 600000 });
    expect(res.annualNdfl).toBe(1098000);
    expect(res.annualNet).toBe(7200000 - 1098000);
  });

  it('correctly applies standard child deductions with 450 000 rub limit', () => {
    // 100 000 в месяц, двое детей (1400 + 2800 = 4200 руб./мес)
    // Месяцы 1-4: доход 100k, 200k, 300k, 400k <= 450k -> вычет применяется
    // Месяц 5: доход 500k > 450k -> вычет прекращается
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      children: { firstCount: 1, secondCount: 1 },
    });

    expect(res.annualDeductions).toBe(4200 * 4); // 16 800 руб.
    expect(res.deductionsEndedMonth).toBe(5);

    // Месяц 1: база 100 000 - 4 200 = 95 800. НДФЛ 13% = 12 454. На руки = 87 546
    expect(res.months[0].deductions).toBe(4200);
    expect(res.months[0].taxableBase).toBe(95800);
    expect(res.months[0].ndflMonthly).toBe(12454);
    expect(res.months[0].netSalary).toBe(87546);

    // Месяц 5: вычет 0, НДФЛ 13 000, на руки 87 000
    expect(res.months[4].deductions).toBe(0);
    expect(res.months[4].ndflMonthly).toBe(13000);
    expect(res.months[4].netSalary).toBe(87000);
  });

  it('calculates reverse salary (Gross from target Net)', () => {
    // Хотим получать 87 000 на руки в месяц
    const res = calculateGrossFromNet(87000);
    expect(res.monthlyGross).toBe(100000);
    expect(res.monthlyNetAverage).toBe(87000);
  });

  it('calculates reverse salary for higher income across brackets', () => {
    const targetNet = 250000;
    const res = calculateGrossFromNet(targetNet);
    expect(Math.abs(res.monthlyNetAverage - targetNet)).toBeLessThanOrEqual(5);
  });
});

describe('Formatting Utilities', () => {
  it('formats rubles correctly', () => {
    expect(formatRubles(150000)).toBe('150\u00A0000\u00A0₽');
    expect(formatRubles(0)).toBe('0\u00A0₽');
    expect(formatRubles(1250.5, { showKopecks: true })).toBe('1\u00A0250,50\u00A0₽');
  });

  it('formats percentages correctly', () => {
    expect(formatPercent(0.13)).toBe('13%');
    expect(formatPercent(0.155, 1)).toBe('15,5%');
  });

  it('parses number inputs cleaning extra chars', () => {
    expect(parseNumberInput('150 000')).toBe(150000);
    expect(parseNumberInput('150\u00A0000 ₽')).toBe(150000);
    expect(parseNumberInput('2500,50')).toBe(2500.5);
    expect(parseNumberInput('')).toBe(0);
  });
});

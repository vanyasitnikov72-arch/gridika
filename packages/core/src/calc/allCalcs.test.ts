import { describe, it, expect } from 'vitest';
import {
  calculateNpd,
  calculateLoan,
  calculateAnnuityPayment,
  calculateMortgageVsRent,
  calculateSalaryFromGross,
  calculateUsn,
  compareWorkRegimes,
  exportScheduleToCsv,
} from '../index';

describe('Advanced NDFL Features', () => {
  it('handles regional northern multiplier correctly', () => {
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      regionalMultiplier: 1.5,
    });

    expect(res.baseMonthlyGross).toBe(100000);
    expect(res.regionalBonusMonthly).toBe(50000);
    expect(res.monthlyGross).toBe(150000);
  });

  it('correctly calculates advance and salary split', () => {
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      advancePercent: 45,
    });

    expect(res.payoutSplit.advancePercent).toBe(45);
    expect(res.payoutSplit.advanceGross).toBe(45000);
    expect(res.payoutSplit.finalSalaryGross).toBe(55000);
    expect(res.payoutSplit.advanceNet + res.payoutSplit.finalSalaryNet).toBe(res.monthlyNetAverage);
  });

  it('calculates non-resident flat 30% tax rate', () => {
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      taxpayerStatus: 'nonResident',
    });

    expect(res.monthlyNetAverage).toBe(70000); // 100k - 30% = 70k
    expect(res.effectiveTaxRate).toBeCloseTo(0.30, 2);
  });
});

describe('USN 6% (ИП Доходы) Calculator', () => {
  it('reduces tax by 100% of insurance contributions for IP without employees', () => {
    // Годовой доход 1 000 000 руб.
    // Налог 6% = 60 000 руб.
    // Взносы: 53 658 + 1% от (1 000 000 - 300 000) = 53 658 + 7 000 = 60 658 руб.
    // Так как взносы 60 658 >= налог 60 000, налог к доплате = 0 руб!
    const res = calculateUsn({
      annualIncome: 1000000,
      hasEmployees: false,
    });

    expect(res.calculatedTax).toBe(60000);
    expect(res.totalContributions).toBe(60658);
    expect(res.taxDeductionAmount).toBe(60000);
    expect(res.finalTaxToPay).toBe(0);
    expect(res.totalPaymentsToBudget).toBe(60658);
  });

  it('limits tax deduction to 50% for IP with employees', () => {
    const res = calculateUsn({
      annualIncome: 1000000,
      hasEmployees: true,
    });

    expect(res.calculatedTax).toBe(60000);
    // Максимум вычета 50% = 30 000 руб
    expect(res.taxDeductionAmount).toBe(30000);
    expect(res.finalTaxToPay).toBe(30000);
  });
});

describe('Regimes Comparison (Штат vs Самозанятый vs ИП)', () => {
  it('correctly compares net payouts for 200 000 rub monthly income', () => {
    const res = compareWorkRegimes(200000, 'fromGross');

    expect(res.items.length).toBe(3);
    const emp = res.items.find((i) => i.id === 'employment')!;
    const npd = res.items.find((i) => i.id === 'selfEmployed')!;
    const usn = res.items.find((i) => i.id === 'individualEntrepreneur')!;

    // Самозанятый на 6% получает больше, чем сотрудник после 13% НДФЛ
    expect(npd.netPayout).toBeGreaterThan(emp.netPayout);
    expect(usn.netPayout).toBeGreaterThan(emp.netPayout);
  });
});

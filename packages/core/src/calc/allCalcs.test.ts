import { describe, it, expect } from 'vitest';
import {
  calculateNpd,
  calculateLoan,
  calculateAnnuityPayment,
  calculateMortgageVsRent,
  calculateSalaryFromGross,
  exportScheduleToCsv,
} from '../index';

describe('Advanced NDFL Features', () => {
  it('handles regional northern multiplier correctly', () => {
    // Базовый оклад 100 000 руб, районный коэффициент 1.5 (например, Якутия / Север)
    // Общий доход = 150 000 руб (100k база + 50k северная надбавка)
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      regionalMultiplier: 1.5,
    });

    expect(res.baseMonthlyGross).toBe(100000);
    expect(res.regionalBonusMonthly).toBe(50000);
    expect(res.monthlyGross).toBe(150000);
    expect(res.annualGross).toBe(1800000);
  });

  it('applies property tax deduction exemption', () => {
    // Вычет 260 000 руб (НДФЛ не удерживается, пока вычет не исчерпан)
    const res = calculateSalaryFromGross({
      monthlyGross: 100000,
      taxExemptDeductionRemaining: 260000,
    });

    // Месяцы 1-2 (по 100 000) полностью освобождены от НДФЛ
    expect(res.months[0].ndflMonthly).toBe(0);
    expect(res.months[0].netSalary).toBe(100000);
    expect(res.months[1].ndflMonthly).toBe(0);
    expect(res.propertyTaxExemptSaved).toBeGreaterThan(0);
  });
});

describe('NPD (Self-Employed) Calculator', () => {
  it('calculates 4% and 6% tax with first registration bonus (10 000 ₽)', () => {
    const res = calculateNpd({
      incomeFromIndividuals: 100000,
      incomeFromLegalEntities: 0,
      initialBonus: 10000,
    });

    expect(res.baseTax).toBe(4000);
    expect(res.bonusUsed).toBe(1000);
    expect(res.taxToPay).toBe(3000);
    expect(res.netIncome).toBe(97000);
    expect(res.bonusRemaining).toBe(9000);
  });

  it('correctly tracks marketplace commissions and gross tax base', () => {
    // Выручка 200 000 руб от юрлиц (WB), комиссия WB 15% (30 000 руб)
    // Налог 6% должен браться со ВСЕХ 200 000 руб = 12 000 руб!
    const res = calculateNpd({
      incomeFromIndividuals: 0,
      incomeFromLegalEntities: 200000,
      commissionRate: 15,
      initialBonus: 0,
    });

    expect(res.totalIncome).toBe(200000);
    expect(res.commissionAmount).toBe(30000);
    expect(res.payoutOnCard).toBe(170000);
    expect(res.taxToPay).toBe(12000); // 6% от 200k
    expect(res.netIncome).toBe(158000); // 170k - 12k
  });
});

describe('Loan with Early Repayments Calculator', () => {
  it('calculates standard annuity payment correctly', () => {
    const pmt = calculateAnnuityPayment(1000000, 12, 12);
    expect(pmt).toBe(88849);
  });

  it('calculates interest savings and reduced term with monthly extra payment', () => {
    const res = calculateLoan({
      principal: 1000000,
      annualRate: 20,
      termMonths: 60,
      monthlyEarlyRepayment: 20000,
      earlyStrategy: 'reduceTerm',
    });

    expect(res.actualTermMonths).toBeLessThan(35);
    expect(res.monthsSaved).toBeGreaterThan(25);
    expect(res.interestSaved).toBeGreaterThan(200000);
  });

  it('exports schedule to valid CSV string', () => {
    const res = calculateLoan({
      principal: 100000,
      annualRate: 15,
      termMonths: 12,
    });
    const csv = exportScheduleToCsv(res.schedule);
    expect(csv).toContain('Номер месяца;Общий платеж');
    expect(csv.split('\r\n').length).toBe(13);
  });
});

describe('Mortgage vs Rent Calculator', () => {
  it('simulates multi-year comparison with initial repair costs', () => {
    const res = calculateMortgageVsRent({
      propertyPrice: 10000000,
      initialPayment: 2000000,
      initialRepairCost: 1000000,
      mortgageRate: 18,
      mortgageTermYears: 20,
      monthlyRent: 45000,
      horizonYears: 10,
      depositYieldRate: 16,
    });

    expect(res.timeline.length).toBe(10);
    expect(res.finalPropertyValue).toBeGreaterThan(10000000);
    expect(res.winner).toBeDefined();
  });
});

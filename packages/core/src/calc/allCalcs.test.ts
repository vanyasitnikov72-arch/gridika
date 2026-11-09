import { describe, it, expect } from 'vitest';
import {
  calculateNpd,
  calculateLoan,
  calculateAnnuityPayment,
  calculateMortgageVsRent,
  NPD_ANNUAL_LIMIT,
} from '../index';

describe('NPD (Self-Employed) Calculator', () => {
  it('calculates 4% and 6% tax with first registration bonus (10 000 ₽)', () => {
    // 100 000 руб. от физлиц (базовый 4% = 4000, с бонусом 1% скидка -> налог 3000, списано 1000 бонуса)
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

  it('correctly tracks annual limit 2.4 million ₽', () => {
    const res = calculateNpd({
      incomeFromIndividuals: 500000,
      incomeFromLegalEntities: 0,
      priorCumulativeIncome: 2000000,
    });

    expect(res.totalCumulativeIncome).toBe(2500000);
    expect(res.isLimitExceeded).toBe(true);
    expect(res.remainingLimit).toBe(0);
  });
});

describe('Loan with Early Repayments Calculator', () => {
  it('calculates standard annuity payment correctly', () => {
    // 1 000 000 руб, 12% годовых, 12 месяцев
    const pmt = calculateAnnuityPayment(1000000, 12, 12);
    expect(pmt).toBe(88849);
  });

  it('calculates interest savings and reduced term with monthly extra payment', () => {
    // Кредит 1 млн руб на 5 лет (60 мес) под 20%
    const res = calculateLoan({
      principal: 1000000,
      annualRate: 20,
      termMonths: 60,
      monthlyEarlyRepayment: 20000,
      earlyStrategy: 'reduceTerm',
    });

    // С досрочными платежами кредит закроется значительно быстрее 60 месяцев
    expect(res.actualTermMonths).toBeLessThan(35);
    expect(res.monthsSaved).toBeGreaterThan(25);
    expect(res.interestSaved).toBeGreaterThan(200000);
  });
});

describe('Mortgage vs Rent Calculator', () => {
  it('simulates multi-year comparison correctly', () => {
    const res = calculateMortgageVsRent({
      propertyPrice: 10000000,
      initialPayment: 2000000,
      mortgageRate: 18,
      mortgageTermYears: 20,
      monthlyRent: 45000,
      horizonYears: 10,
      depositYieldRate: 16,
    });

    expect(res.timeline.length).toBe(10);
    expect(res.finalPropertyValue).toBeGreaterThan(10000000);
    expect(res.finalRemainingMortgageDebt).toBeLessThan(8000000);
    expect(res.winner).toBeDefined();
  });
});

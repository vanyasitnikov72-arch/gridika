/**
 * Кредитный калькулятор с поддержкой аннуитетного и дифференцированного платежа,
 * а также досрочного погашения (уменьшение срока или уменьшение платежа).
 */

export type LoanType = 'annuity' | 'differentiated';
export type EarlyStrategy = 'reduceTerm' | 'reducePayment';

export interface OneTimeEarlyPayment {
  month: number;
  amount: number;
}

export interface LoanInput {
  /** Сумма кредита, руб. */
  principal: number;
  /** Годовая процентная ставка (например 18.5 для 18.5%) */
  annualRate: number;
  /** Срок кредита в месяцах */
  termMonths: number;
  /** Тип платежа */
  type?: LoanType;
  /** Ежемесячный дополнительный платеж сверх графика, руб. */
  monthlyEarlyRepayment?: number;
  /** Разовые досрочные погашения */
  oneTimeEarlyPayments?: OneTimeEarlyPayment[];
  /** Стратегия при досрочном погашении */
  earlyStrategy?: EarlyStrategy;
}

export interface LoanScheduleMonth {
  month: number;
  payment: number;
  principalPortion: number;
  interestPortion: number;
  earlyRepayment: number;
  remainingPrincipal: number;
}

export interface LoanCalculationResult {
  principal: number;
  annualRate: number;
  initialTermMonths: number;
  actualTermMonths: number;
  monthsSaved: number;
  
  /** Базовый ежемесячный платёж (первый месяц) */
  monthlyPaymentFirstMonth: number;
  /** Базовый ежемесячный платёж (последний месяц, актуально для дифференцированного) */
  monthlyPaymentLastMonth: number;
  
  /** Общая сумма выплат без досрочных погашений */
  baseTotalPayment: number;
  /** Общая переплата по процентам без досрочных погашений */
  baseTotalInterest: number;
  
  /** Фактическая общая сумма выплат с учётом досрочки */
  actualTotalPayment: number;
  /** Фактическая переплата по процентам */
  actualTotalInterest: number;
  /** Сэкономленные проценты */
  interestSaved: number;
  
  /** Детальный график платежей */
  schedule: LoanScheduleMonth[];
}

/**
 * Расчёт аннуитетного платежа
 */
export function calculateAnnuityPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / months);

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const payment = principal * ((monthlyRate * factor) / (factor - 1));
  return Math.round(payment);
}

export function calculateLoan(input: LoanInput): LoanCalculationResult {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualRate);
  const termMonths = Math.max(1, input.termMonths);
  const type: LoanType = input.type ?? 'annuity';
  const monthlyEarly = Math.max(0, input.monthlyEarlyRepayment ?? 0);
  const oneTimeMap = new Map<number, number>();
  (input.oneTimeEarlyPayments ?? []).forEach((p) => {
    oneTimeMap.set(p.month, (oneTimeMap.get(p.month) ?? 0) + Math.max(0, p.amount));
  });
  const strategy: EarlyStrategy = input.earlyStrategy ?? 'reduceTerm';

  const monthlyRate = annualRate / 100 / 12;

  // 1. Расчёт базового варианта (без досрочных платежей)
  let baseTotalPayment = 0;
  let baseTotalInterest = 0;
  let baseFirstMonth = 0;
  let baseLastMonth = 0;

  if (type === 'annuity') {
    const basePmt = calculateAnnuityPayment(principal, annualRate, termMonths);
    baseFirstMonth = basePmt;
    baseLastMonth = basePmt;
    baseTotalPayment = basePmt * termMonths;
    baseTotalInterest = Math.max(0, baseTotalPayment - principal);
  } else {
    // Дифференцированный
    const principalPerMonth = principal / termMonths;
    baseFirstMonth = Math.round(principalPerMonth + principal * monthlyRate);
    let rem = principal;
    for (let m = 1; m <= termMonths; m++) {
      const interest = rem * monthlyRate;
      const pmt = Math.round(principalPerMonth + interest);
      if (m === 1) baseFirstMonth = pmt;
      if (m === termMonths) baseLastMonth = pmt;
      baseTotalInterest += interest;
      rem -= principalPerMonth;
    }
    baseTotalInterest = Math.round(baseTotalInterest);
    baseTotalPayment = principal + baseTotalInterest;
  }

  // 2. Расчёт с учётом досрочных погашений
  const schedule: LoanScheduleMonth[] = [];
  let remainingPrincipal = principal;
  let currentAnnuityPayment = calculateAnnuityPayment(remainingPrincipal, annualRate, termMonths);
  let currentDiffPrincipalPmt = principal / termMonths;
  let actualTotalPayment = 0;
  let actualTotalInterest = 0;

  for (let m = 1; m <= termMonths; m++) {
    if (remainingPrincipal <= 0.01) break;

    const interestForMonth = Math.round(remainingPrincipal * monthlyRate);
    actualTotalInterest += interestForMonth;

    let regularPayment = 0;
    let principalPortion = 0;

    if (type === 'annuity') {
      regularPayment = currentAnnuityPayment;
      principalPortion = regularPayment - interestForMonth;
      if (principalPortion > remainingPrincipal) {
        principalPortion = remainingPrincipal;
        regularPayment = principalPortion + interestForMonth;
      }
    } else {
      principalPortion = Math.min(remainingPrincipal, currentDiffPrincipalPmt);
      regularPayment = Math.round(principalPortion + interestForMonth);
    }

    remainingPrincipal = Math.max(0, remainingPrincipal - principalPortion);

    // Досрочное погашение
    const oneTime = oneTimeMap.get(m) ?? 0;
    const totalExtraAvailable = monthlyEarly + oneTime;
    const actualExtra = Math.min(remainingPrincipal, totalExtraAvailable);
    remainingPrincipal = Math.max(0, remainingPrincipal - actualExtra);

    const totalMonthPayment = regularPayment + actualExtra;
    actualTotalPayment += totalMonthPayment;

    schedule.push({
      month: m,
      payment: totalMonthPayment,
      principalPortion: Math.round(principalPortion),
      interestPortion: interestForMonth,
      earlyRepayment: actualExtra,
      remainingPrincipal: Math.round(remainingPrincipal),
    });

    if (remainingPrincipal <= 0.01) break;

    // Пересчёт платежа при стратегии reducePayment
    if (actualExtra > 0 && strategy === 'reducePayment') {
      const remainingMonths = termMonths - m;
      if (remainingMonths > 0) {
        if (type === 'annuity') {
          currentAnnuityPayment = calculateAnnuityPayment(remainingPrincipal, annualRate, remainingMonths);
        } else {
          currentDiffPrincipalPmt = remainingPrincipal / remainingMonths;
        }
      }
    }
  }

  const actualTermMonths = schedule.length;
  const monthsSaved = Math.max(0, termMonths - actualTermMonths);
  const interestSaved = Math.max(0, baseTotalInterest - actualTotalInterest);

  return {
    principal,
    annualRate,
    initialTermMonths: termMonths,
    actualTermMonths,
    monthsSaved,
    monthlyPaymentFirstMonth: baseFirstMonth,
    monthlyPaymentLastMonth: baseLastMonth,
    baseTotalPayment,
    baseTotalInterest,
    actualTotalPayment,
    actualTotalInterest,
    interestSaved,
    schedule,
  };
}

import ratesData from '../rates/rates-2026.json';

export interface ChildrenDeductionInput {
  firstCount?: number;
  secondCount?: number;
  thirdAndMoreCount?: number;
  disabledCount?: number;
}

export interface NdflCalculationInput {
  /** Оклад (Gross) в месяц, руб. */
  monthlyGross: number;
  /** Количество месяцев работы в году (по умолчанию 12) */
  monthsCount?: number;
  /** Вычеты на детей */
  children?: ChildrenDeductionInput;
  /** Является ли работодатель субъектом МСП (льготный тариф взносов) */
  isMsp?: boolean;
  /** Ставка взноса на травматизм (по умолчанию 0.002 = 0.2%) */
  injuryRate?: number;
}

export interface MonthBreakdown {
  month: number;
  gross: number;
  cumulativeGross: number;
  deductions: number;
  taxableBase: number;
  cumulativeTaxableBase: number;
  ndflMonthly: number;
  cumulativeNdfl: number;
  netSalary: number;
  effectiveRate: number;
  bracketsUsed: { rate: number; amount: number }[];
}

export interface TaxBracketBreakdown {
  rate: number;
  label: string;
  minIncome: number;
  maxIncome: number | null;
  taxableAmountInBracket: number;
  taxInBracket: number;
}

export interface EmployerCosts {
  pensionAndMedical: number;
  injury: number;
  totalContributions: number;
  totalCostForEmployer: number;
  contributionsPercentOfGross: number;
}

export interface NdflCalculationResult {
  /** Среднемесячный оклад Gross */
  monthlyGross: number;
  /** Среднемесячная выплата на руки Net */
  monthlyNetAverage: number;
  /** Сумма на руки в первый месяц */
  monthlyNetFirstMonth: number;
  /** Сумма на руки в последний месяц года (когда может сработать повышенная ставка) */
  monthlyNetLastMonth: number;
  /** Годовой доход Gross */
  annualGross: number;
  /** Общая сумма НДФЛ за год */
  annualNdfl: number;
  /** Сумма на руки за год Net */
  annualNet: number;
  /** Эффективная ставка НДФЛ (налог / доход) */
  effectiveTaxRate: number;
  /** Общая сумма детских налоговых вычетов за год */
  annualDeductions: number;
  /** В каком месяце закончилось действие детского вычета (превышение 450 тыс. руб.) */
  deductionsEndedMonth: number | null;
  /** Помесячная детальная разбивка */
  months: MonthBreakdown[];
  /** Разбивка налога по прогрессивной шкале за год */
  bracketsBreakdown: TaxBracketBreakdown[];
  /** Расходы работодателя */
  employerCosts: EmployerCosts;
  /** Версия ставок и дата */
  ratesMeta: {
    version: string;
    updatedAt: string;
    source: string;
  };
}

/**
 * Расчёт налога по прогрессивной шкале с базы дохода
 */
export function calculateProgressiveTax(taxableIncome: number): {
  totalTax: number;
  brackets: TaxBracketBreakdown[];
} {
  const bracketsConfig = ratesData.ndfl.brackets;
  let remainingIncome = Math.max(0, taxableIncome);
  let totalTax = 0;

  const brackets: TaxBracketBreakdown[] = [];

  for (let i = 0; i < bracketsConfig.length; i++) {
    const b = bracketsConfig[i];
    const bracketMin = b.minIncome;
    const bracketMax = b.maxIncome;
    const bracketCapacity = bracketMax !== null ? bracketMax - bracketMin : Infinity;

    if (remainingIncome <= 0) {
      brackets.push({
        rate: b.rate,
        label: b.label,
        minIncome: bracketMin,
        maxIncome: bracketMax,
        taxableAmountInBracket: 0,
        taxInBracket: 0,
      });
      continue;
    }

    const amountInBracket = Math.min(remainingIncome, bracketCapacity);
    const taxInBracket = Math.round(amountInBracket * b.rate);

    totalTax += taxInBracket;
    remainingIncome -= amountInBracket;

    brackets.push({
      rate: b.rate,
      label: b.label,
      minIncome: bracketMin,
      maxIncome: bracketMax,
      taxableAmountInBracket: amountInBracket,
      taxInBracket,
    });
  }

  return { totalTax, brackets };
}

/**
 * Вычисляет месячную сумму детских вычетов
 */
export function calculateMonthlyChildDeduction(children?: ChildrenDeductionInput): number {
  if (!children) return 0;
  const cfg = ratesData.ndfl.childDeductions;
  const first = (children.firstCount ?? 0) * cfg.first;
  const second = (children.secondCount ?? 0) * cfg.second;
  const third = (children.thirdAndMoreCount ?? 0) * cfg.thirdAndMore;
  const disabled = (children.disabledCount ?? 0) * cfg.disabledChild;
  return first + second + third + disabled;
}

/**
 * Основная функция прямого расчёта: из оклада (Gross) в сумму на руки (Net)
 */
export function calculateSalaryFromGross(input: NdflCalculationInput): NdflCalculationResult {
  const monthlyGross = Math.max(0, input.monthlyGross);
  const monthsCount = Math.max(1, Math.min(12, input.monthsCount ?? 12));
  const childMonthlyDeduction = calculateMonthlyChildDeduction(input.children);
  const deductionLimit = ratesData.ndfl.childDeductions.annualIncomeLimit;

  let cumulativeGross = 0;
  let cumulativeTaxableBase = 0;
  let cumulativeNdfl = 0;
  let deductionsEndedMonth: number | null = null;
  let annualDeductions = 0;

  const months: MonthBreakdown[] = [];

  for (let m = 1; m <= monthsCount; m++) {
    cumulativeGross += monthlyGross;

    // Проверяем право на детский вычет
    let monthDeduction = 0;
    if (childMonthlyDeduction > 0) {
      if (cumulativeGross <= deductionLimit) {
        monthDeduction = Math.min(childMonthlyDeduction, monthlyGross);
      } else if (deductionsEndedMonth === null) {
        deductionsEndedMonth = m;
      }
    }
    annualDeductions += monthDeduction;

    const monthTaxable = Math.max(0, monthlyGross - monthDeduction);
    cumulativeTaxableBase += monthTaxable;

    // НДФЛ рассчитывается накопительным итогом с начала года (ст. 226 НК РФ)
    const cumulativeTaxResult = calculateProgressiveTax(cumulativeTaxableBase);
    const ndflForThisMonth = Math.max(0, cumulativeTaxResult.totalTax - cumulativeNdfl);
    cumulativeNdfl += ndflForThisMonth;

    const netSalary = Math.max(0, monthlyGross - ndflForThisMonth);
    const effectiveRate = monthlyGross > 0 ? ndflForThisMonth / monthlyGross : 0;

    months.push({
      month: m,
      gross: monthlyGross,
      cumulativeGross,
      deductions: monthDeduction,
      taxableBase: monthTaxable,
      cumulativeTaxableBase,
      ndflMonthly: ndflForThisMonth,
      cumulativeNdfl,
      netSalary,
      effectiveRate,
      bracketsUsed: cumulativeTaxResult.brackets
        .filter((b) => b.taxInBracket > 0)
        .map((b) => ({ rate: b.rate, amount: b.taxInBracket })),
    });
  }

  const annualGross = monthlyGross * monthsCount;
  const annualNet = months.reduce((acc, curr) => acc + curr.netSalary, 0);
  const annualNdfl = cumulativeNdfl;
  const effectiveTaxRate = annualGross > 0 ? annualNdfl / annualGross : 0;
  const monthlyNetAverage = monthsCount > 0 ? Math.round(annualNet / monthsCount) : 0;

  // Итоговая разбивка по шкале за год
  const { brackets: bracketsBreakdown } = calculateProgressiveTax(cumulativeTaxableBase);

  // Расчёт взносов работодателя
  const employerCosts = calculateEmployerContributions({
    annualGross,
    isMsp: input.isMsp ?? false,
    injuryRate: input.injuryRate ?? ratesData.employerInsurance.injuryRateDefault,
    monthsCount,
  });

  return {
    monthlyGross,
    monthlyNetAverage,
    monthlyNetFirstMonth: months[0]?.netSalary ?? 0,
    monthlyNetLastMonth: months[months.length - 1]?.netSalary ?? 0,
    annualGross,
    annualNdfl,
    annualNet,
    effectiveTaxRate,
    annualDeductions,
    deductionsEndedMonth,
    months,
    bracketsBreakdown,
    employerCosts,
    ratesMeta: {
      version: ratesData.version,
      updatedAt: ratesData.updatedAt,
      source: ratesData.ndfl.source,
    },
  };
}

/**
 * Расчёт расходов работодателя (страховые взносы)
 */
export function calculateEmployerContributions(params: {
  annualGross: number;
  isMsp: boolean;
  injuryRate: number;
  monthsCount: number;
}): EmployerCosts {
  const { annualGross, isMsp, injuryRate, monthsCount } = params;
  const cfg = ratesData.employerInsurance;

  let pensionAndMedical = 0;

  if (!isMsp) {
    // Стандартный общий тариф
    if (annualGross <= cfg.limit2025) {
      pensionAndMedical = Math.round(annualGross * cfg.standardRateUnderLimit);
    } else {
      const under = cfg.limit2025 * cfg.standardRateUnderLimit;
      const over = (annualGross - cfg.limit2025) * cfg.standardRateOverLimit;
      pensionAndMedical = Math.round(under + over);
    }
  } else {
    // Льготный тариф для субъектов МСП: 30% до 1 МРОТ в месяц, 15% свыше
    const monthlyMrot = cfg.mrot2025;
    const monthlyGross = monthsCount > 0 ? annualGross / monthsCount : 0;

    let monthlyContrib = 0;
    if (monthlyGross <= monthlyMrot) {
      monthlyContrib = monthlyGross * 0.30;
    } else {
      monthlyContrib = monthlyMrot * 0.30 + (monthlyGross - monthlyMrot) * 0.15;
    }
    pensionAndMedical = Math.round(monthlyContrib * monthsCount);
  }

  const injury = Math.round(annualGross * injuryRate);
  const totalContributions = pensionAndMedical + injury;
  const totalCostForEmployer = annualGross + totalContributions;
  const contributionsPercentOfGross = annualGross > 0 ? totalContributions / annualGross : 0;

  return {
    pensionAndMedical,
    injury,
    totalContributions,
    totalCostForEmployer,
    contributionsPercentOfGross,
  };
}

/**
 * Обратный расчёт: из желаемой суммы на руки (Net) в оклад (Gross)
 * Так как функция Net(Gross) строго монотонно возрастает, используем точный бинарный поиск
 */
export function calculateGrossFromNet(
  targetMonthlyNet: number,
  options?: Omit<NdflCalculationInput, 'monthlyGross'>
): NdflCalculationResult {
  if (targetMonthlyNet <= 0) {
    return calculateSalaryFromGross({ ...options, monthlyGross: 0 });
  }

  // Приблизительная оценка снизу и сверху
  let low = targetMonthlyNet;
  let high = targetMonthlyNet * 2; // Даже при максимальной ставке 22%, Gross < Net / 0.78

  // Расширяем high при необходимости
  while (calculateSalaryFromGross({ ...options, monthlyGross: high }).monthlyNetAverage < targetMonthlyNet) {
    high *= 1.5;
  }

  // Бинарный поиск с точностью до 1 рубля
  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const res = calculateSalaryFromGross({ ...options, monthlyGross: mid });

    if (Math.abs(res.monthlyNetAverage - targetMonthlyNet) <= 1 || low >= high - 1) {
      return res;
    }

    if (res.monthlyNetAverage < targetMonthlyNet) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return calculateSalaryFromGross({ ...options, monthlyGross: low });
}

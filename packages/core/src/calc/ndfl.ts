import ratesData from '../rates/rates-2026.json';

export interface ChildrenDeductionInput {
  firstCount?: number;
  secondCount?: number;
  thirdAndMoreCount?: number;
  disabledCount?: number;
}

export interface NdflCalculationInput {
  /** Базовый оклад (Gross) в месяц, руб. */
  monthlyGross: number;
  /** Количество месяцев работы в году (по умолчанию 12) */
  monthsCount?: number;
  /** Вычеты на детей */
  children?: ChildrenDeductionInput;
  /** Районный коэффициент (например 1.0 - стандарт, 1.15 - Урал, 1.2 - Новосибирск, 1.5 - Север, 2.0 - Чукотка) */
  regionalMultiplier?: number;
  /** Имущественный / социальный вычет через работодателя (уведомление ФНС), руб. */
  taxExemptDeductionRemaining?: number;
  /** Ежемесячная премия, руб. */
  monthlyBonus?: number;
  /** Является ли работодатель субъектом МСП (льготный тариф взносов) */
  isMsp?: boolean;
  /** Ставка взноса на травматизм (по умолчанию 0.002 = 0.2%) */
  injuryRate?: number;
}

export interface MonthBreakdown {
  month: number;
  gross: number;
  baseSalary: number;
  regionalBonus: number;
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
  /** Базовый оклад в месяц */
  baseMonthlyGross: number;
  /** Полный среднемесячный оклад с учётом районного коэффициента и премий */
  monthlyGross: number;
  /** Районная надбавка в месяц */
  regionalBonusMonthly: number;
  /** Районный коэффициент */
  regionalMultiplier: number;
  /** Среднемесячная выплата на руки Net */
  monthlyNetAverage: number;
  /** Сумма на руки в первый месяц */
  monthlyNetFirstMonth: number;
  /** Сумма на руки в последний месяц года */
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
  /** Сколько сэкономлено благодаря имущественному/социальному вычету */
  propertyTaxExemptSaved: number;
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
 * Расчёт налога по прогрессивной 5-ступенчатой шкале (ст. 224 п. 1 НК РФ)
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
 * Расчёт налога на районные надбавки и северные коэффициенты:
 * Согласно п. 6.1 ст. 224 НК РФ (в ред. 176-ФЗ) для надбавок сохраняется шкала:
 * - 13% до 5 млн руб.
 * - 15% свыше 5 млн руб.
 */
export function calculateNorthernTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 5000000) {
    return Math.round(taxableIncome * 0.13);
  }
  return Math.round(5000000 * 0.13 + (taxableIncome - 5000000) * 0.15);
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
 * Основная функция прямого расчёта
 */
export function calculateSalaryFromGross(input: NdflCalculationInput): NdflCalculationResult {
  const baseSalary = Math.max(0, input.monthlyGross);
  const bonus = Math.max(0, input.monthlyBonus ?? 0);
  const regionalMultiplier = Math.max(1, input.regionalMultiplier ?? 1.0);
  const monthsCount = Math.max(1, Math.min(12, input.monthsCount ?? 12));
  
  // Районная надбавка начисляется на оклад + премии
  const basePlusBonus = baseSalary + bonus;
  const regionalBonusMonthly = Math.round(basePlusBonus * (regionalMultiplier - 1));
  const fullMonthlyGross = basePlusBonus + regionalBonusMonthly;

  const childMonthlyDeduction = calculateMonthlyChildDeduction(input.children);
  const deductionLimit = ratesData.ndfl.childDeductions.annualIncomeLimit;
  let remainingPropertyExempt = Math.max(0, input.taxExemptDeductionRemaining ?? 0);

  let cumulativeBaseGross = 0;
  let cumulativeRegionalGross = 0;
  let cumulativeGross = 0;
  let cumulativeTaxableBase = 0;
  let cumulativeNdfl = 0;
  let deductionsEndedMonth: number | null = null;
  let annualDeductions = 0;
  let propertyTaxExemptSaved = 0;

  const months: MonthBreakdown[] = [];

  for (let m = 1; m <= monthsCount; m++) {
    cumulativeGross += fullMonthlyGross;
    cumulativeBaseGross += basePlusBonus;
    cumulativeRegionalGross += regionalBonusMonthly;

    // Детский вычет
    let monthChildDeduction = 0;
    if (childMonthlyDeduction > 0) {
      if (cumulativeGross <= deductionLimit) {
        monthChildDeduction = Math.min(childMonthlyDeduction, fullMonthlyGross);
      } else if (deductionsEndedMonth === null) {
        deductionsEndedMonth = m;
      }
    }
    annualDeductions += monthChildDeduction;

    let monthTaxable = Math.max(0, fullMonthlyGross - monthChildDeduction);

    // Имущественный / социальный вычет (полное освобождение от НДФЛ)
    if (remainingPropertyExempt > 0) {
      const usedExempt = Math.min(remainingPropertyExempt, monthTaxable);
      monthTaxable -= usedExempt;
      remainingPropertyExempt -= usedExempt;
      propertyTaxExemptSaved += Math.round(usedExempt * 0.13);
    }

    cumulativeTaxableBase += monthTaxable;

    let cumulativeTaxTotal = 0;
    if (regionalMultiplier > 1.0) {
      // Раздельный учёт: базовая часть по 5-ступенчатой шкале, северная часть по 2-ступенчатой шкале (до 5 млн 13%, свыше 15%)
      const baseShare = fullMonthlyGross > 0 ? basePlusBonus / fullMonthlyGross : 1;
      const baseTaxable = cumulativeTaxableBase * baseShare;
      const northernTaxable = cumulativeTaxableBase * (1 - baseShare);

      const baseTax = calculateProgressiveTax(baseTaxable).totalTax;
      const northernTax = calculateNorthernTax(northernTaxable);
      cumulativeTaxTotal = baseTax + northernTax;
    } else {
      cumulativeTaxTotal = calculateProgressiveTax(cumulativeTaxableBase).totalTax;
    }

    const ndflForThisMonth = Math.max(0, cumulativeTaxTotal - cumulativeNdfl);
    cumulativeNdfl += ndflForThisMonth;

    const netSalary = Math.max(0, fullMonthlyGross - ndflForThisMonth);
    const effectiveRate = fullMonthlyGross > 0 ? ndflForThisMonth / fullMonthlyGross : 0;

    months.push({
      month: m,
      gross: fullMonthlyGross,
      cumulativeGross,
      baseSalary: basePlusBonus,
      regionalBonus: regionalBonusMonthly,
      deductions: monthChildDeduction,
      taxableBase: monthTaxable,
      cumulativeTaxableBase,
      ndflMonthly: ndflForThisMonth,
      cumulativeNdfl,
      netSalary,
      effectiveRate,
      bracketsUsed: [],
    });
  }

  const annualGross = fullMonthlyGross * monthsCount;
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
    baseMonthlyGross: baseSalary,
    monthlyGross: fullMonthlyGross,
    regionalBonusMonthly,
    regionalMultiplier,
    monthlyNetAverage,
    monthlyNetFirstMonth: months[0]?.netSalary ?? 0,
    monthlyNetLastMonth: months[months.length - 1]?.netSalary ?? 0,
    annualGross,
    annualNdfl,
    annualNet,
    effectiveTaxRate,
    annualDeductions,
    deductionsEndedMonth,
    propertyTaxExemptSaved,
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
    if (annualGross <= cfg.limit2025) {
      pensionAndMedical = Math.round(annualGross * cfg.standardRateUnderLimit);
    } else {
      const under = cfg.limit2025 * cfg.standardRateUnderLimit;
      const over = (annualGross - cfg.limit2025) * cfg.standardRateOverLimit;
      pensionAndMedical = Math.round(under + over);
    }
  } else {
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
 */
export function calculateGrossFromNet(
  targetMonthlyNet: number,
  options?: Omit<NdflCalculationInput, 'monthlyGross'>
): NdflCalculationResult {
  if (targetMonthlyNet <= 0) {
    return calculateSalaryFromGross({ ...options, monthlyGross: 0 });
  }

  let low = targetMonthlyNet;
  let high = targetMonthlyNet * 2.5;

  while (calculateSalaryFromGross({ ...options, monthlyGross: high }).monthlyNetAverage < targetMonthlyNet) {
    high *= 1.5;
  }

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

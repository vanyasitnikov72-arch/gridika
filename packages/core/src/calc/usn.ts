/**
 * Расчёт налога ИП на УСН «Доходы 6%» (ст. 346.12–346.25 НК РФ)
 * с учётом уменьшения на фиксированные страховые взносы и 1% свыше 300 000 ₽.
 */

export interface UsnCalculationInput {
  /** Годовой доход ИП (выручка), руб. */
  annualIncome: number;
  /** Ставка налога УСН, % (по умолчанию 6%, льготные ставки в регионах от 1% до 6%) */
  taxRate?: number;
  /** Есть ли наёмные сотрудники у ИП (влияет на лимит уменьшения налога 50% или 100%) */
  hasEmployees?: boolean;
  /** Фиксированные страховые взносы ИП за себя (по умолчанию 53 658 руб. на 2025–2026 год) */
  fixedContributions?: number;
}

export interface UsnQuarterBreakdown {
  quarter: number;
  label: string;
  quarterIncome: number;
  quarterTax: number;
  quarterContributions: number;
  taxToPay: number;
}

export interface UsnCalculationResult {
  annualIncome: number;
  taxRate: number;
  hasEmployees: boolean;

  /** Исчисленный налог УСН (до вычета взносов): Доход * Ставка */
  calculatedTax: number;

  /** Фиксированные страховые взносы за себя */
  fixedContributions: number;
  /** Дополнительный взнос 1% с доходов свыше 300 000 руб. */
  onePercentContribution: number;
  /** Всего страховых взносов ИП за себя (фиксированные + 1%) */
  totalContributions: number;

  /** Сумма, на которую фактически уменьшается налог УСН */
  taxDeductionAmount: number;
  /** Налог УСН к доплате в бюджет после вычета взносов */
  finalTaxToPay: number;

  /** Всего обязательных платежей государству (Налог + Взносы) */
  totalPaymentsToBudget: number;
  /** Чистая прибыль ИП после всех налогов и взносов */
  netProfit: number;
  /** Эффективная налоговая нагрузка (все платежи / выручка) */
  effectiveTaxRate: number;

  /** Примерный расчёт по 4 кварталам */
  quarters: UsnQuarterBreakdown[];
}

export const USN_FIXED_CONTRIBUTIONS_2026 = 53658;
export const USN_ONE_PERCENT_MAX_2026 = 300888;

export function calculateUsn(input: UsnCalculationInput): UsnCalculationResult {
  const annualIncome = Math.max(0, input.annualIncome);
  const taxRate = Math.max(0, Math.min(6, input.taxRate ?? 6));
  const hasEmployees = input.hasEmployees ?? false;
  const fixedContributions = Math.max(0, input.fixedContributions ?? USN_FIXED_CONTRIBUTIONS_2026);

  // 1. Исчисленный налог УСН
  const calculatedTax = Math.round(annualIncome * (taxRate / 100));

  // 2. Страховые взносы
  // 1% с доходов свыше 300 000 руб.
  const excessIncome = Math.max(0, annualIncome - 300000);
  const onePercentCalculated = Math.round(excessIncome * 0.01);
  const onePercentContribution = Math.min(USN_ONE_PERCENT_MAX_2026, onePercentCalculated);

  const totalContributions = fixedContributions + onePercentContribution;

  // 3. Уменьшение налога на страховые взносы (п. 3.1 ст. 346.21 НК РФ)
  // Без работников: уменьшение до 100% налога
  // С работниками: уменьшение максимум до 50% налога
  const maxDeductionLimit = hasEmployees ? Math.round(calculatedTax * 0.5) : calculatedTax;
  const taxDeductionAmount = Math.min(maxDeductionLimit, totalContributions);

  const finalTaxToPay = Math.max(0, calculatedTax - taxDeductionAmount);
  const totalPaymentsToBudget = finalTaxToPay + totalContributions;
  const netProfit = Math.max(0, annualIncome - totalPaymentsToBudget);
  const effectiveTaxRate = annualIncome > 0 ? totalPaymentsToBudget / annualIncome : 0;

  // Поквартальный ориентир
  const quarterIncome = Math.round(annualIncome / 4);
  const quarterCalculatedTax = Math.round(calculatedTax / 4);
  const quarterFixed = Math.round(fixedContributions / 4);
  const quarterDeduction = hasEmployees ? Math.round(quarterCalculatedTax * 0.5) : quarterCalculatedTax;
  const quarterTaxToPay = Math.max(0, quarterCalculatedTax - Math.min(quarterDeduction, quarterFixed));

  const quarters: UsnQuarterBreakdown[] = [
    { quarter: 1, label: '1 квартал (до 28 апреля)', quarterIncome, quarterTax: quarterCalculatedTax, quarterContributions: quarterFixed, taxToPay: quarterTaxToPay },
    { quarter: 2, label: '2 квартал / полугодие (до 28 июля)', quarterIncome, quarterTax: quarterCalculatedTax, quarterContributions: quarterFixed, taxToPay: quarterTaxToPay },
    { quarter: 3, label: '3 квартал / 9 месяцев (до 28 октября)', quarterIncome, quarterTax: quarterCalculatedTax, quarterContributions: quarterFixed, taxToPay: quarterTaxToPay },
    { quarter: 4, label: '4 квартал / годовой расчёт (до 28 апреля)', quarterIncome, quarterTax: quarterCalculatedTax, quarterContributions: quarterFixed + onePercentContribution, taxToPay: finalTaxToPay - quarterTaxToPay * 3 },
  ];

  return {
    annualIncome,
    taxRate,
    hasEmployees,
    calculatedTax,
    fixedContributions,
    onePercentContribution,
    totalContributions,
    taxDeductionAmount,
    finalTaxToPay,
    totalPaymentsToBudget,
    netProfit,
    effectiveTaxRate,
    quarters,
  };
}

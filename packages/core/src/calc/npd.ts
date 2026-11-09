/**
 * Расчёт налога на профессиональный доход (НПД / Самозанятые)
 * Федеральный закон от 27.11.2018 № 422-ФЗ
 */

export interface NpdCalculationInput {
  /** Доход от физических лиц (в месяц или за период), руб. */
  incomeFromIndividuals: number;
  /** Доход от юридических лиц и ИП (в месяц или за период), руб. */
  incomeFromLegalEntities: number;
  /** Доступный остаток налогового бонуса (максимум 10 000 руб.), по умолчанию 10 000 */
  initialBonus?: number;
  /** Суммарный доход с начала года до текущего периода, руб. */
  priorCumulativeIncome?: number;
}

export interface NpdCalculationResult {
  /** Общий доход за период */
  totalIncome: number;
  /** Налог без учёта вычета (базовый) */
  baseTax: number;
  /** Базовый налог с физлиц (4%) */
  taxFromIndividuals: number;
  /** Базовый налог с юрлиц (6%) */
  taxFromLegalEntities: number;
  /** Сумма списанного налогового бонуса */
  bonusUsed: number;
  /** Оставшийся налоговый бонус */
  bonusRemaining: number;
  /** Итоговый налог к уплате за период */
  taxToPay: number;
  /** Чистый доход после уплаты налога */
  netIncome: number;
  /** Эффективная процентная ставка налога */
  effectiveRate: number;
  /** Суммарный доход с начала года */
  totalCumulativeIncome: number;
  /** Превышен ли годовой лимит 2 400 000 руб. */
  isLimitExceeded: boolean;
  /** Остаток дохода до исчерпания годового лимита */
  remainingLimit: number;
  /** Годовой лимит НПД */
  annualLimit: number;
}

export const NPD_ANNUAL_LIMIT = 2400000;
export const NPD_MAX_BONUS = 10000;

export function calculateNpd(input: NpdCalculationInput): NpdCalculationResult {
  const indIncome = Math.max(0, input.incomeFromIndividuals);
  const legalIncome = Math.max(0, input.incomeFromLegalEntities);
  const totalIncome = indIncome + legalIncome;
  
  const priorIncome = Math.max(0, input.priorCumulativeIncome ?? 0);
  const totalCumulativeIncome = priorIncome + totalIncome;
  const isLimitExceeded = totalCumulativeIncome > NPD_ANNUAL_LIMIT;
  const remainingLimit = Math.max(0, NPD_ANNUAL_LIMIT - totalCumulativeIncome);

  let bonusRemaining = Math.max(0, Math.min(NPD_MAX_BONUS, input.initialBonus ?? NPD_MAX_BONUS));

  // Базовые ставки: 4% с физлиц, 6% с юрлиц
  const baseTaxInd = indIncome * 0.04;
  const baseTaxLegal = legalIncome * 0.06;
  const baseTax = Math.round(baseTaxInd + baseTaxLegal);

  // Бонус: 1% компенсируется с физлиц, 2% с юрлиц
  const potentialIndBonus = indIncome * 0.01;
  const actualIndBonus = Math.min(bonusRemaining, potentialIndBonus);
  bonusRemaining -= actualIndBonus;

  const potentialLegalBonus = legalIncome * 0.02;
  const actualLegalBonus = Math.min(bonusRemaining, potentialLegalBonus);
  bonusRemaining -= actualLegalBonus;

  const totalBonusUsed = Math.round(actualIndBonus + actualLegalBonus);
  const taxToPay = Math.max(0, baseTax - totalBonusUsed);
  const netIncome = totalIncome - taxToPay;
  const effectiveRate = totalIncome > 0 ? taxToPay / totalIncome : 0;

  return {
    totalIncome,
    baseTax,
    taxFromIndividuals: Math.round(baseTaxInd),
    taxFromLegalEntities: Math.round(baseTaxLegal),
    bonusUsed: totalBonusUsed,
    bonusRemaining: Math.round(bonusRemaining),
    taxToPay,
    netIncome,
    effectiveRate,
    totalCumulativeIncome,
    isLimitExceeded,
    remainingLimit,
    annualLimit: NPD_ANNUAL_LIMIT,
  };
}

import { calculateAnnuityPayment } from './loan';

export interface MortgageVsRentInput {
  /** Стоимость квартиры, руб. */
  propertyPrice: number;
  /** Первоначальный взнос, руб. */
  initialPayment: number;
  /** Процентная ставка по ипотеке, % годовых (например 6 или 18) */
  mortgageRate: number;
  /** Срок ипотеки, лет (например 20) */
  mortgageTermYears: number;
  /** Ежемесячная стоимость аренды аналогичной квартиры, руб. */
  monthlyRent: number;
  /** Затраты на ремонт/мебель на старте, руб. (для покупателя) */
  initialRepairCost?: number;
  /** Ежемесячные расходы владельца (капремонт, налог на имущество), руб. */
  monthlyMaintenanceCost?: number;
  /** Ежегодная страховка ипотеки (% от остатка долга, по умолчанию 0.4%) */
  mortgageInsuranceRate?: number;
  /** Ожидаемый годовой рост стоимости недвижимости, % (по умолчанию 5%) */
  propertyAppreciationRate?: number;
  /** Ожидаемый годовой рост аренды, % (по умолчанию 6%) */
  rentGrowthRate?: number;
  /** Доходность альтернативных инвестиций / вклада, % годовых (например 16%) */
  depositYieldRate?: number;
  /** Горизонт сравнения, лет (по умолчанию 10) */
  horizonYears?: number;
}

export interface YearComparisonStep {
  year: number;
  propertyValue: number;
  mortgageRemainingDebt: number;
  buyerNetWealth: number;
  renterPortfolioValue: number;
  annualRent: number;
  annualMortgagePayments: number;
}

export interface MortgageVsRentResult {
  propertyPrice: number;
  initialPayment: number;
  loanAmount: number;
  monthlyMortgagePayment: number;
  initialMonthlyRent: number;
  horizonYears: number;

  /** Стоимость квартиры через N лет */
  finalPropertyValue: number;
  /** Остаток долга по ипотеке через N лет */
  finalRemainingMortgageDebt: number;
  /** Чистый капитал покупателя (стоимость жилья минус остаток долга) */
  buyerFinalNetWealth: number;
  /** Всего потрачено покупателем (взнос + ремонт + платежи + обслуживание) */
  buyerTotalPaid: number;

  /** Итоговый инвестиционный капитал арендатора (взнос + ремонт + разница под процент) */
  renterFinalPortfolio: number;
  /** Всего потрачено на аренду за весь горизонт */
  renterTotalRentPaid: number;

  /** Разница капитала: если положительная, покупка выгоднее, если отрицательная — аренда выгоднее */
  wealthDifference: number;
  winner: 'buyer' | 'renter';

  /** Динамика по годам */
  timeline: YearComparisonStep[];
}

export function calculateMortgageVsRent(input: MortgageVsRentInput): MortgageVsRentResult {
  const propertyPrice = Math.max(0, input.propertyPrice);
  const initialPayment = Math.max(0, Math.min(propertyPrice, input.initialPayment));
  const loanAmount = Math.max(0, propertyPrice - initialPayment);
  const mortgageRate = Math.max(0, input.mortgageRate);
  const mortgageTermYears = Math.max(1, input.mortgageTermYears);
  const mortgageTermMonths = mortgageTermYears * 12;

  const initialMonthlyRent = Math.max(0, input.monthlyRent);
  const initialRepair = Math.max(0, input.initialRepairCost ?? 0);
  const monthlyMaintenance = Math.max(0, input.monthlyMaintenanceCost ?? 3000);
  const monthlyInsuranceRate = (input.mortgageInsuranceRate ?? 0.4) / 100 / 12;

  const propertyGrowth = (input.propertyAppreciationRate ?? 5) / 100;
  const rentGrowth = (input.rentGrowthRate ?? 6) / 100;
  const depositYield = (input.depositYieldRate ?? 16) / 100;
  const horizonYears = Math.max(1, Math.min(30, input.horizonYears ?? 10));

  const monthlyMortgagePmt = calculateAnnuityPayment(loanAmount, mortgageRate, mortgageTermMonths);
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const monthlyDepositRate = depositYield / 12;

  let currentPropertyValue = propertyPrice;
  let remainingDebt = loanAmount;
  
  // Стартовый капитал арендатора: первоначальный взнос + деньги, которые покупатель потратил на ремонт
  let renterCapital = initialPayment + initialRepair;
  let currentMonthlyRent = initialMonthlyRent;

  let buyerTotalPaid = initialPayment + initialRepair;
  let renterTotalRentPaid = 0;

  const timeline: YearComparisonStep[] = [];

  for (let y = 1; y <= horizonYears; y++) {
    let yearMortgagePaid = 0;
    let yearRentPaid = 0;

    for (let m = 1; m <= 12; m++) {
      const monthIndex = (y - 1) * 12 + m;

      let monthMortgagePayment = 0;
      let monthInsurance = 0;

      if (monthIndex <= mortgageTermMonths && remainingDebt > 0.01) {
        const interest = remainingDebt * monthlyMortgageRate;
        let principalPmt = monthlyMortgagePmt - interest;
        if (principalPmt > remainingDebt) principalPmt = remainingDebt;
        remainingDebt = Math.max(0, remainingDebt - principalPmt);
        monthInsurance = remainingDebt * monthlyInsuranceRate;
        monthMortgagePayment = principalPmt + interest + monthInsurance;
      }

      // Полные расходы покупателя в месяц: ипотека + страховка + капремонт/налоги
      const totalBuyerMonthlyCost = monthMortgagePayment + monthlyMaintenance;
      yearMortgagePaid += totalBuyerMonthlyCost;
      buyerTotalPaid += totalBuyerMonthlyCost;

      // Расходы арендатора в месяц
      yearRentPaid += currentMonthlyRent;
      renterTotalRentPaid += currentMonthlyRent;

      // Инвестиции арендатора растут на процент депозита
      renterCapital *= (1 + monthlyDepositRate);

      // Дельта инвестируется
      const delta = totalBuyerMonthlyCost - currentMonthlyRent;
      renterCapital += delta;
      if (renterCapital < 0) renterCapital = 0;
    }

    currentPropertyValue *= (1 + propertyGrowth);
    currentMonthlyRent *= (1 + rentGrowth);

    const buyerNetWealth = Math.max(0, Math.round(currentPropertyValue - remainingDebt));
    const renterNetWealth = Math.round(renterCapital);

    timeline.push({
      year: y,
      propertyValue: Math.round(currentPropertyValue),
      mortgageRemainingDebt: Math.round(remainingDebt),
      buyerNetWealth,
      renterPortfolioValue: renterNetWealth,
      annualRent: Math.round(yearRentPaid),
      annualMortgagePayments: Math.round(yearMortgagePaid),
    });
  }

  const finalPropertyValue = Math.round(currentPropertyValue);
  const finalRemainingMortgageDebt = Math.round(remainingDebt);
  const buyerFinalNetWealth = Math.max(0, finalPropertyValue - finalRemainingMortgageDebt);
  const renterFinalPortfolio = Math.round(renterCapital);
  const wealthDifference = buyerFinalNetWealth - renterFinalPortfolio;
  const winner: 'buyer' | 'renter' = wealthDifference >= 0 ? 'buyer' : 'renter';

  return {
    propertyPrice,
    initialPayment,
    loanAmount,
    monthlyMortgagePayment: monthlyMortgagePmt,
    initialMonthlyRent,
    horizonYears,
    finalPropertyValue,
    finalRemainingMortgageDebt,
    buyerFinalNetWealth,
    buyerTotalPaid: Math.round(buyerTotalPaid),
    renterFinalPortfolio,
    renterTotalRentPaid: Math.round(renterTotalRentPaid),
    wealthDifference,
    winner,
    timeline,
  };
}

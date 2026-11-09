import { calculateSalaryFromGross } from './ndfl';
import { calculateNpd } from './npd';
import { calculateUsn } from './usn';

export interface RegimeComparisonItem {
  id: 'employment' | 'selfEmployed' | 'individualEntrepreneur';
  title: string;
  badge: string;
  badgeColor: string;
  
  /** Сумма, которую платит заказчик / работодатель (полные затраты) */
  employerBudget: number;
  /** Сумма до вычетов (оклад / выручка) */
  grossIncome: number;
  /** Суммарные налоги и страховые взносы */
  totalTaxesAndDeductions: number;
  /** Чистая сумма на руки / прибыль исполнителя */
  netPayout: number;
  /** Эффективная процентная ставка потерь на налогах и взносах от бюджета */
  lossPercentage: number;
  /** Особенности режима */
  features: string[];
}

export interface WorkRegimeComparisonResult {
  monthlyAmount: number;
  mode: 'fromGross' | 'fromBudget';
  items: RegimeComparisonItem[];
  recommendation: string;
}

export function compareWorkRegimes(
  amount: number,
  mode: 'fromGross' | 'fromBudget' = 'fromGross'
): WorkRegimeComparisonResult {
  const monthlyAmount = Math.max(0, amount);
  const annualAmount = monthlyAmount * 12;

  let empGross = 0;
  let npdGross = 0;
  let usnGross = 0;

  if (mode === 'fromGross') {
    // Введена сумма оклада / договора
    empGross = monthlyAmount;
    npdGross = monthlyAmount;
    usnGross = monthlyAmount;
  } else {
    // Введён суммарный бюджет компании (ФОТ)
    // В штате: Бюджет = Оклад * 1.302
    empGross = Math.round(monthlyAmount / 1.302);
    npdGross = monthlyAmount;
    usnGross = monthlyAmount;
  }

  // 1. Штат (Трудовой договор)
  const empRes = calculateSalaryFromGross({ monthlyGross: empGross });
  const empEmployerCost = Math.round(empRes.employerCosts.totalCostForEmployer / 12);
  const empNet = empRes.monthlyNetAverage;
  const empLoss = empEmployerCost - empNet;
  const empLossPct = empEmployerCost > 0 ? empLoss / empEmployerCost : 0;

  // 2. Самозанятый (НПД с юрлицом)
  const npdRes = calculateNpd({
    incomeFromIndividuals: 0,
    incomeFromLegalEntities: npdGross,
  });
  const npdNet = npdRes.netIncome;
  const npdLoss = npdGross - npdNet;
  const npdLossPct = npdGross > 0 ? npdLoss / npdGross : 0;

  // 3. ИП на УСН (Доходы 6%)
  const usnRes = calculateUsn({
    annualIncome: usnGross * 12,
    hasEmployees: false,
  });
  const usnMonthlyPayments = Math.round(usnRes.totalPaymentsToBudget / 12);
  const usnNet = usnGross - usnMonthlyPayments;
  const usnLossPct = usnGross > 0 ? usnMonthlyPayments / usnGross : 0;

  const items: RegimeComparisonItem[] = [
    {
      id: 'employment',
      title: 'Трудовой договор (Штат)',
      badge: 'Максимум защиты',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      employerBudget: empEmployerCost,
      grossIncome: empGross,
      totalTaxesAndDeductions: empLoss,
      netPayout: empNet,
      lossPercentage: empLossPct,
      features: [
        'Оплачиваемый отпуск 28 дней и больничные',
        'Работодатель платит 30% страховых взносов за свой счёт',
        'НДФЛ 13%–22% удерживается автоматически',
        'Право на трудовые гарантии при увольнении',
      ],
    },
    {
      id: 'selfEmployed',
      title: 'Самозанятый (НПД)',
      badge: 'Минимум налогов',
      badgeColor: 'bg-teal-100 text-teal-800',
      employerBudget: npdGross,
      grossIncome: npdGross,
      totalTaxesAndDeductions: npdLoss,
      netPayout: npdNet,
      lossPercentage: npdLossPct,
      features: [
        'Ставка налога всего 6% при работе с компаниями',
        'Нет отчетности, деклараций и онлайн-кассы',
        'Заказчик не платит страховые взносы',
        'Годовой лимит дохода: до 2,4 млн ₽ в год',
      ],
    },
    {
      id: 'individualEntrepreneur',
      title: 'ИП на УСН «Доходы 6%»',
      badge: 'Без лимита 2,4 млн',
      badgeColor: 'bg-amber-100 text-amber-800',
      employerBudget: usnGross,
      grossIncome: usnGross,
      totalTaxesAndDeductions: usnMonthlyPayments,
      netPayout: usnNet,
      lossPercentage: usnLossPct,
      features: [
        'Лимит дохода до 450 млн ₽ в год (в отличие от 2,4 млн)',
        'Фиксированные взносы 53 658 ₽ в год уменьшают налог до 0 ₽',
        '1% с дохода свыше 300 000 ₽',
        'Требуется расчётный счёт и годовая декларация',
      ],
    },
  ];

  let recommendation = '';
  if (annualAmount <= 2400000) {
    recommendation = 'При доходе до 2,4 млн ₽ в год выгоднее всего Самозанятость (НПД): минимальный налог 6% и отсутствие отчетности.';
  } else {
    recommendation = 'При доходе свыше 2,4 млн ₽ в год лимит самозанятости исчерпан. Оптимальный выбор — ИП на УСН «Доходы 6%».';
  }

  return {
    monthlyAmount,
    mode,
    items,
    recommendation,
  };
}

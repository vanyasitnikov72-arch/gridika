import { useState, useMemo } from 'preact/hooks';
import {
  calculateSalaryFromGross,
  calculateGrossFromNet,
  formatRubles,
  formatPercent,
  type ChildrenDeductionInput,
  type NdflCalculationResult,
  type TaxpayerStatus,
} from '@temka/core';

const REGIONS = [
  { label: 'Стандартный (без надбавок)', value: 1.0 },
  { label: 'Урал, Поволжье (1.15)', value: 1.15 },
  { label: 'Новосибирск, Омск, Алтай (1.20)', value: 1.20 },
  { label: 'Красноярск, Иркутск, Кузбасс (1.30)', value: 1.30 },
  { label: 'Хабаровск, Архангельск, Карелия (1.40)', value: 1.40 },
  { label: 'Магадан, Мурманск, Сахалин (1.70)', value: 1.70 },
  { label: 'Чукотка, Камчатка, Норильск (2.00)', value: 2.00 },
];

export default function SalaryTab() {
  const [mode, setMode] = useState<'gross' | 'net'>('gross');
  const [salaryNum, setSalaryNum] = useState<number>(150000);
  const [taxpayerStatus, setTaxpayerStatus] = useState<TaxpayerStatus>('resident');
  const [advancePercent, setAdvancePercent] = useState<number>(45);
  const [monthlyBonus, setMonthlyBonus] = useState<number>(0);
  const [regionalMultiplier, setRegionalMultiplier] = useState<number>(1.0);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [firstCount, setFirstCount] = useState<number>(0);
  const [secondCount, setSecondCount] = useState<number>(0);
  const [thirdCount, setThirdCount] = useState<number>(0);
  const [hasPropertyExempt, setHasPropertyExempt] = useState<boolean>(false);
  const [propertyExemptAmount, setPropertyExemptAmount] = useState<number>(260000);
  const [isMsp, setIsMsp] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showMonthsBreakdown, setShowMonthsBreakdown] = useState<boolean>(false);

  const childrenConfig: ChildrenDeductionInput | undefined = useMemo(() => {
    if (!hasChildren) return undefined;
    return {
      firstCount,
      secondCount,
      thirdAndMoreCount: thirdCount,
    };
  }, [hasChildren, firstCount, secondCount, thirdCount]);

  const result: NdflCalculationResult = useMemo(() => {
    if (mode === 'gross') {
      return calculateSalaryFromGross({
        monthlyGross: salaryNum,
        taxpayerStatus,
        advancePercent,
        monthlyBonus,
        regionalMultiplier,
        children: childrenConfig,
        taxExemptDeductionRemaining: hasPropertyExempt ? propertyExemptAmount : 0,
        isMsp,
      });
    } else {
      return calculateGrossFromNet(salaryNum, {
        taxpayerStatus,
        advancePercent,
        monthlyBonus,
        regionalMultiplier,
        children: childrenConfig,
        taxExemptDeductionRemaining: hasPropertyExempt ? propertyExemptAmount : 0,
        isMsp,
      });
    }
  }, [mode, salaryNum, taxpayerStatus, advancePercent, monthlyBonus, regionalMultiplier, childrenConfig, hasPropertyExempt, propertyExemptAmount, isMsp]);

  return (
    <div class="space-y-6">
      {/* Шапка режима */}
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            {mode === 'gross' ? 'Расчёт зарплаты на руки (Net)' : 'Расчёт оклада от суммы на руки'}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Точный расчёт по 5-ступенчатой шкале НДФЛ 2026 года (176-ФЗ)
          </p>
        </div>

        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('gross')}
            class={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'gross'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            От оклада (Gross)
          </button>
          <button
            type="button"
            onClick={() => setMode('net')}
            class={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'net'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            От желаемой суммы (Net)
          </button>
        </div>
      </div>

      {/* Основной ввод с ползунком */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-700">
            {mode === 'gross' ? 'Оклад по трудовому договору' : 'Сумма на руки в месяц'}
          </label>
          <span class="text-xl font-black text-emerald-700">
            {formatRubles(salaryNum)}
          </span>
        </div>

        <div class="relative">
          <input
            type="range"
            min="20000"
            max="1000000"
            step="5000"
            value={salaryNum}
            onInput={(e) => setSalaryNum(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Быстрые кнопки */}
        <div class="flex flex-wrap gap-2 pt-1">
          {[50000, 100000, 150000, 250000, 450000, 800000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSalaryNum(preset)}
              class={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                salaryNum === preset
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {formatRubles(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Тонкие настройки (Вычеты, Регион, МСП) */}
      <div class="pt-4 border-t border-slate-100 space-y-4">
        <div class="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <span>{showAdvanced ? '▲ Скрыть дополнительные параметры' : '⚙️ Тонкие параметры (дети, регион, вычеты, МСП)'}</span>
          </button>
          <span class="text-[11px] text-slate-400">для максимальной точности</span>
        </div>

        {showAdvanced && (
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            {/* Статус налогоплательщика */}
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Статус налогоплательщика:
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTaxpayerStatus('resident')}
                  class={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    taxpayerStatus === 'resident'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span class="block">Резидент РФ</span>
                  <span class={`text-[10px] block font-normal ${taxpayerStatus === 'resident' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Шкала 13%–22% (176-ФЗ)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaxpayerStatus('remoteForeign')}
                  class={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    taxpayerStatus === 'remoteForeign'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span class="block">Дистанционщик за рубежом</span>
                  <span class={`text-[10px] block font-normal ${taxpayerStatus === 'remoteForeign' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    13% до 5 млн ₽ (389-ФЗ)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaxpayerStatus('nonResident')}
                  class={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                    taxpayerStatus === 'nonResident'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span class="block">Нерезидент РФ</span>
                  <span class={`text-[10px] block font-normal ${taxpayerStatus === 'nonResident' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Фиксированная ставка 30%
                  </span>
                </button>
              </div>
            </div>

            {/* Районный коэффициент */}
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Районный коэффициент / Северная надбавка:
              </label>
              <select
                value={regionalMultiplier}
                onChange={(e) => setRegionalMultiplier(parseFloat((e.target as HTMLSelectElement).value))}
                class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p class="text-[11px] text-slate-500 mt-1">
                По ст. 224 НК РФ (176-ФЗ) на районные надбавки распространяется льготная 2-ступенчатая шкала (13% до 5 млн ₽).
              </p>
            </div>

            {/* Дети */}
            <div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => setHasChildren((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span class="text-xs font-bold text-slate-800">
                  Стандартные вычеты на детей (лимит дохода 450 000 ₽/год)
                </span>
              </label>

              {hasChildren && (
                <div class="grid grid-cols-3 gap-3 mt-2">
                  <div class="bg-white p-2 rounded-lg border border-slate-200">
                    <span class="block text-[10px] text-slate-500 font-bold">1-й ребёнок (1 400 ₽)</span>
                    <input
                      type="number"
                      min="0"
                      value={firstCount}
                      onInput={(e) => setFirstCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                      class="w-full mt-1 p-1 font-bold text-xs border rounded"
                    />
                  </div>
                  <div class="bg-white p-2 rounded-lg border border-slate-200">
                    <span class="block text-[10px] text-slate-500 font-bold">2-й ребёнок (2 800 ₽)</span>
                    <input
                      type="number"
                      min="0"
                      value={secondCount}
                      onInput={(e) => setSecondCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                      class="w-full mt-1 p-1 font-bold text-xs border rounded"
                    />
                  </div>
                  <div class="bg-white p-2 rounded-lg border border-slate-200">
                    <span class="block text-[10px] text-slate-500 font-bold">3-й и более (6 000 ₽)</span>
                    <input
                      type="number"
                      min="0"
                      value={thirdCount}
                      onInput={(e) => setThirdCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                      class="w-full mt-1 p-1 font-bold text-xs border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Имущественный вычет через работодателя */}
            <div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasPropertyExempt}
                  onChange={(e) => setHasPropertyExempt((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span class="text-xs font-bold text-slate-800">
                  Уведомление о вычете за покупку квартиры/лечение (НДФЛ временно 0%)
                </span>
              </label>

              {hasPropertyExempt && (
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-slate-500">Остаток налоговой базы вычета:</span>
                  <input
                    type="number"
                    step="10000"
                    value={propertyExemptAmount}
                    onInput={(e) => setPropertyExemptAmount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                    class="w-36 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  />
                  <span class="text-xs text-slate-500">₽</span>
                </div>
              )}
            </div>

            {/* МСП */}
            <div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMsp}
                  onChange={(e) => setIsMsp((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span class="text-xs font-semibold text-slate-700">
                  Работодатель входит в реестр МСП (ставка страховых взносов 15% свыше МРОТ)
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Главные результаты */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span class="text-[11px] uppercase font-bold text-emerald-800">На руки (Net)</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.monthlyNetAverage)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1">
            {result.monthlyNetFirstMonth !== result.monthlyNetLastMonth ? (
              <>В нач. года: {formatRubles(result.monthlyNetFirstMonth)}, в конце: {formatRubles(result.monthlyNetLastMonth)}</>
            ) : (
              'ежемесячно'
            )}
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Налог НДФЛ</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(Math.round(result.annualNdfl / 12))}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            эффективная ставка: {formatPercent(result.effectiveTaxRate, 1)} (за год: {formatRubles(result.annualNdfl)})
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">
            {mode === 'gross' ? 'Полный оклад Gross' : 'Требуемый оклад Gross'}
          </span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {formatRubles(result.monthlyGross)}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            {result.regionalMultiplier > 1 ? `вкл. надбавку ${formatRubles(result.regionalBonusMonthly)}` : `всего в год: ${formatRubles(result.annualGross)}`}
          </span>
        </div>
      </div>

      {/* Разбивка на Аванс и Зарплату (по ст. 136 ТК РФ и правилам с 2023 года) */}
      <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
            📅 Реальные выплаты на карту в течение месяца:
          </span>
          <span class="text-[11px] text-slate-400">НДФЛ удерживается при каждой выплате</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block">Аванс (20–25 число)</span>
              <span class="text-[11px] text-slate-500">
                начислено {formatRubles(result.payoutSplit.advanceGross)}, НДФЛ {formatRubles(result.payoutSplit.advanceNdfl)}
              </span>
            </div>
            <div class="text-right">
              <span class="text-lg font-black text-emerald-700 block">
                {formatRubles(result.payoutSplit.advanceNet)}
              </span>
              <span class="text-[10px] text-emerald-800 font-semibold">на карту</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 block">Зарплата (5–10 число)</span>
              <span class="text-[11px] text-slate-500">
                начислено {formatRubles(result.payoutSplit.finalSalaryGross)}, НДФЛ {formatRubles(result.payoutSplit.finalSalaryNdfl)}
              </span>
            </div>
            <div class="text-right">
              <span class="text-lg font-black text-emerald-700 block">
                {formatRubles(result.payoutSplit.finalSalaryNet)}
              </span>
              <span class="text-[10px] text-emerald-800 font-semibold">на карту</span>
            </div>
          </div>
        </div>
      </div>

      {/* Затраты компании */}
      <div class="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span class="font-bold text-indigo-950 block">Полные затраты работодателя на сотрудника:</span>
          <span class="text-slate-600">
            Страховые взносы: {formatRubles(Math.round(result.employerCosts.totalContributions / 12))}/мес ({formatPercent(result.employerCosts.contributionsPercentOfGross, 1)} от оклада)
          </span>
        </div>
        <div class="text-right">
          <span class="text-base font-black text-indigo-950 block">
            {formatRubles(Math.round(result.employerCosts.totalCostForEmployer / 12))} / мес
          </span>
          <span class="text-[10px] text-indigo-600">ФОТ + все взносы</span>
        </div>
      </div>

      {/* Помесячный график */}
      <div>
        <button
          type="button"
          onClick={() => setShowMonthsBreakdown(!showMonthsBreakdown)}
          class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>{showMonthsBreakdown ? '▲ Скрыть помесячный график' : '▼ Показать подробный помесячный график выплат'}</span>
        </button>

        {showMonthsBreakdown && (
          <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold border-b">
                <tr>
                  <th class="p-2.5">Месяц</th>
                  <th class="p-2.5">Начислено</th>
                  <th class="p-2.5">Вычет</th>
                  <th class="p-2.5">Доход с нач. года</th>
                  <th class="p-2.5">НДФЛ</th>
                  <th class="p-2.5">На руки</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {result.months.map((m) => (
                  <tr key={m.month} class="hover:bg-slate-50">
                    <td class="p-2 font-medium">{m.month}-й мес.</td>
                    <td class="p-2">{formatRubles(m.gross)}</td>
                    <td class="p-2 text-slate-500">{m.deductions > 0 ? formatRubles(m.deductions) : '—'}</td>
                    <td class="p-2 text-slate-600">{formatRubles(m.cumulativeGross)}</td>
                    <td class="p-2 text-rose-600 font-bold">{formatRubles(m.ndflMonthly)}</td>
                    <td class="p-2 text-emerald-700 font-black">{formatRubles(m.netSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

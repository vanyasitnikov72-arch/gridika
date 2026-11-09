import { useState, useMemo } from 'preact/hooks';
import {
  calculateUsn,
  formatRubles,
  formatPercent,
  USN_FIXED_CONTRIBUTIONS_2026,
} from '@temka/core';

export default function UsnTab() {
  const [annualIncome, setAnnualIncome] = useState<number>(3000000);
  const [taxRate, setTaxRate] = useState<number>(6);
  const [hasEmployees, setHasEmployees] = useState<boolean>(false);
  const [showQuarters, setShowQuarters] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateUsn({
      annualIncome,
      taxRate,
      hasEmployees,
    });
  }, [annualIncome, taxRate, hasEmployees]);

  const monthlyAverageProfit = Math.round(result.netProfit / 12);
  const monthlyRevenue = Math.round(annualIncome / 12);

  return (
    <div class="space-y-6">
      {/* Шапка таба */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            Калькулятор налога ИП на УСН «Доходы 6%»
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            С законным уменьшением налога на 100% страховых взносов (ст. 346.21 НК РФ)
          </p>
        </div>

        {/* Переключатель сотрудников */}
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setHasEmployees(false)}
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !hasEmployees
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ИП без сотрудников (вычет до 100%)
          </button>
          <button
            type="button"
            onClick={() => setHasEmployees(true)}
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              hasEmployees
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            С сотрудниками (вычет до 50%)
          </button>
        </div>
      </div>

      {/* Ползунок годовой выручки */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Годовой доход ИП (выручка)
            </span>
            <span class="text-xs text-slate-500">
              в среднем в месяц: {formatRubles(monthlyRevenue)}
            </span>
          </div>
          <span class="text-2xl font-black text-emerald-700">
            {formatRubles(annualIncome)}
          </span>
        </div>

        <input
          type="range"
          min="100000"
          max="20000000"
          step="100000"
          value={annualIncome}
          onInput={(e) => setAnnualIncome(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
          class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        {/* Быстрые пресеты */}
        <div class="flex flex-wrap gap-2 pt-1">
          {[1000000, 2400000, 5000000, 10000000, 15000000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAnnualIncome(preset)}
              class={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                annualIncome === preset
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {formatRubles(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Ставка налога УСН */}
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span class="font-bold text-slate-800 block">Ставка УСН (по умолчанию 6%):</span>
          <span class="text-slate-500">В ряде регионов РФ действуют пониженные ставки от 1% до 5%</span>
        </div>
        <div class="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setTaxRate(rate)}
              class={`w-8 h-8 rounded-lg font-bold transition-all ${
                taxRate === rate
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border text-slate-700 hover:bg-slate-100'
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Карточки результатов */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
          <span class="text-[11px] uppercase font-bold text-emerald-800">Чистая прибыль ИП</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.netProfit)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1 font-semibold">
            в среднем: {formatRubles(monthlyAverageProfit)} в месяц
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200">
          <span class="text-[11px] uppercase font-bold text-teal-800">Страховые взносы за себя</span>
          <div class="text-2xl font-black text-teal-950 mt-1">
            {formatRubles(result.totalContributions)}
          </div>
          <span class="text-[11px] text-teal-700 block mt-1">
            фикс. {formatRubles(result.fixedContributions)} + 1% свыше 300к ({formatRubles(result.onePercentContribution)})
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">Налог УСН к доплате</span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {result.finalTaxToPay === 0 ? (
              <span class="text-emerald-600">0 ₽ 🎉</span>
            ) : (
              formatRubles(result.finalTaxToPay)
            )}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            {result.finalTaxToPay === 0
              ? 'Налог полностью перекрыт взносами!'
              : `исчислено ${formatRubles(result.calculatedTax)}, вычет ${formatRubles(result.taxDeductionAmount)}`}
          </span>
        </div>
      </div>

      {/* Информационная плашка об уменьшении налога */}
      <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
        <span class="font-bold block mb-1">💡 Как работает законное уменьшение налога УСН «Доходы»:</span>
        ИП имеет законное право уменьшать исчисленный налог на сумму уплаченных страховых взносов (п. 3.1 ст. 346.21 НК РФ).
        Если сумма взносов больше или равна налогу (до дохода ~1 млн ₽ в год при 6%), налог УСН становится <span class="font-bold text-emerald-800">ровно 0 рублей</span>, и вы платите только взносы на собственную пенсию и ОМС.
      </div>

      {/* Поквартальный график уплаты */}
      <div>
        <button
          type="button"
          onClick={() => setShowQuarters(!showQuarters)}
          class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>{showQuarters ? '▲ Скрыть поквартальный график' : '▼ Показать поквартальный график авансовых платежей'}</span>
        </button>

        {showQuarters && (
          <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold border-b">
                <tr>
                  <th class="p-2.5">Отчётный период</th>
                  <th class="p-2.5">Доход</th>
                  <th class="p-2.5">Налог УСН</th>
                  <th class="p-2.5">Взносы</th>
                  <th class="p-2.5">К уплате в бюджет</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {result.quarters.map((q) => (
                  <tr key={q.quarter} class="hover:bg-slate-50">
                    <td class="p-2 font-bold text-slate-800">{q.label}</td>
                    <td class="p-2">{formatRubles(q.quarterIncome)}</td>
                    <td class="p-2 text-slate-600">{formatRubles(q.quarterTax)}</td>
                    <td class="p-2 text-teal-700 font-semibold">{formatRubles(q.quarterContributions)}</td>
                    <td class="p-2 font-black text-emerald-700">
                      {q.taxToPay <= 0 ? '0 ₽' : formatRubles(q.taxToPay)}
                    </td>
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

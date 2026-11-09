import { useState, useMemo } from 'preact/hooks';
import {
  calculateMortgageVsRent,
  formatRubles,
  parseNumberInput,
} from '@temka/core';

export default function MortgageVsRentTab() {
  const [priceInput, setPriceInput] = useState<string>('9 000 000');
  const [downPaymentInput, setDownPaymentInput] = useState<string>('2 000 000');
  const [mortgageRateInput, setMortgageRateInput] = useState<string>('18');
  const [mortgageYearsInput, setMortgageYearsInput] = useState<string>('20');
  const [rentInput, setRentInput] = useState<string>('45 000');
  const [depositYieldInput, setDepositYieldInput] = useState<string>('16');
  const [horizonInput, setHorizonInput] = useState<number>(10);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);

  const price = useMemo(() => parseNumberInput(priceInput), [priceInput]);
  const downPayment = useMemo(() => parseNumberInput(downPaymentInput), [downPaymentInput]);
  const mortgageRate = useMemo(() => parseNumberInput(mortgageRateInput), [mortgageRateInput]);
  const mortgageYears = useMemo(() => parseNumberInput(mortgageYearsInput), [mortgageYearsInput]);
  const rent = useMemo(() => parseNumberInput(rentInput), [rentInput]);
  const depositYield = useMemo(() => parseNumberInput(depositYieldInput), [depositYieldInput]);

  const result = useMemo(() => {
    return calculateMortgageVsRent({
      propertyPrice: price,
      initialPayment: downPayment,
      mortgageRate,
      mortgageTermYears: mortgageYears,
      monthlyRent: rent,
      depositYieldRate: depositYield,
      horizonYears: horizonInput,
    });
  }, [price, downPayment, mortgageRate, mortgageYears, rent, depositYield, horizonInput]);

  return (
    <div class="space-y-6">
      {/* Заголовок */}
      <div class="pb-4 border-b border-slate-100">
        <h3 class="text-xl font-bold text-slate-900">
          Калькулятор: Ипотека или аренда квартиры
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Сравнение капитала покупателя и арендатора с инвестициями на горизонте до 30 лет
        </p>
      </div>

      {/* Параметры */}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Цена квартиры
          </label>
          <div class="relative">
            <input
              type="text"
              value={priceInput}
              onInput={(e) => setPriceInput((e.target as HTMLInputElement).value)}
              class="w-full pl-3 pr-8 py-2 text-base font-bold rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₽</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Первоначальный взнос
          </label>
          <div class="relative">
            <input
              type="text"
              value={downPaymentInput}
              onInput={(e) => setDownPaymentInput((e.target as HTMLInputElement).value)}
              class="w-full pl-3 pr-8 py-2 text-base font-bold rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₽</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Ставка ипотеки (% год.)
          </label>
          <div class="relative">
            <input
              type="text"
              value={mortgageRateInput}
              onInput={(e) => setMortgageRateInput((e.target as HTMLInputElement).value)}
              class="w-full pl-3 pr-8 py-2 text-base font-bold rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Аренда аналога (в мес.)
          </label>
          <div class="relative">
            <input
              type="text"
              value={rentInput}
              onInput={(e) => setRentInput((e.target as HTMLInputElement).value)}
              class="w-full pl-3 pr-8 py-2 text-base font-bold rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₽</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Доходность инвестиций/вклада
          </label>
          <div class="relative">
            <input
              type="text"
              value={depositYieldInput}
              onInput={(e) => setDepositYieldInput((e.target as HTMLInputElement).value)}
              class="w-full pl-3 pr-8 py-2 text-base font-bold rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Горизонт расчёта
          </label>
          <div class="flex gap-1.5 pt-1">
            {[5, 10, 15, 20].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizonInput(h)}
                class={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  horizonInput === h
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {h} лет
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Главный вердикт */}
      <div
        class={`p-5 rounded-2xl border ${
          result.winner === 'buyer'
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-amber-50 border-amber-300'
        }`}
      >
        <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
          Финансовый результат через {result.horizonYears} лет
        </span>
        <div class="text-2xl font-black text-slate-900 mt-1">
          {result.winner === 'buyer'
            ? `Покупка квартиры выгоднее на ${formatRubles(Math.abs(result.wealthDifference))}`
            : `Аренда с инвестированием взноса выгоднее на ${formatRubles(Math.abs(result.wealthDifference))}`}
        </div>
        <p class="text-xs text-slate-600 mt-2">
          {result.winner === 'buyer'
            ? 'За счёт роста стоимости недвижимости и погашения основного долга собственный капитал покупателя опережает накопления на депозите.'
            : 'При высоких ставках по вкладам арендатор сохраняет крупный капитал первоначального взноса, проценты по которому перекрывают затраты на аренду.'}
        </p>
      </div>

      {/* Сравнение капиталов */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-slate-700">Сценарий: Ипотека</span>
            <span class="text-xs font-bold text-slate-900">
              платёж: {formatRubles(result.monthlyMortgagePayment)}/мес
            </span>
          </div>
          <div class="text-xl font-black text-slate-900">
            {formatRubles(result.buyerFinalNetWealth)}
          </div>
          <span class="text-xs text-slate-500 block mt-1">
            чистая стоимость квартиры (за вычетом остатка долга {formatRubles(result.finalRemainingMortgageDebt)})
          </span>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-slate-700">Сценарий: Аренда</span>
            <span class="text-xs font-bold text-slate-900">
              старт с взноса: {formatRubles(result.initialPayment)}
            </span>
          </div>
          <div class="text-xl font-black text-slate-900">
            {formatRubles(result.renterFinalPortfolio)}
          </div>
          <span class="text-xs text-slate-500 block mt-1">
            накопленный инвестиционный портфель с капитализацией процентов
          </span>
        </div>
      </div>

      {/* Таблица динамики */}
      <div>
        <button
          type="button"
          onClick={() => setShowTimeline(!showTimeline)}
          class="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
        >
          <span>{showTimeline ? '▲ Скрыть динамику по годам' : '▼ Показать динамику капитала по годам'}</span>
        </button>

        {showTimeline && (
          <div class="mt-3 max-h-72 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b">
                <tr>
                  <th class="p-2.5">Год</th>
                  <th class="p-2.5">Цена жилья</th>
                  <th class="p-2.5">Остаток ипотеки</th>
                  <th class="p-2.5">Капитал покупателя</th>
                  <th class="p-2.5">Капитал арендатора</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {result.timeline.map((step) => (
                  <tr key={step.year} class="hover:bg-slate-50">
                    <td class="p-2 font-bold">{step.year}-й год</td>
                    <td class="p-2">{formatRubles(step.propertyValue)}</td>
                    <td class="p-2 text-rose-600">{formatRubles(step.mortgageRemainingDebt)}</td>
                    <td class="p-2 font-bold text-slate-900">{formatRubles(step.buyerNetWealth)}</td>
                    <td class="p-2 font-bold text-amber-700">{formatRubles(step.renterPortfolioValue)}</td>
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

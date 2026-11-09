import { useState, useMemo } from 'preact/hooks';
import {
  calculateMortgageVsRent,
  formatRubles,
} from '@temka/core';

export default function MortgageVsRentTab() {
  const [price, setPrice] = useState<number>(9000000);
  const [downPayment, setDownPayment] = useState<number>(2000000);
  const [mortgageRate, setMortgageRate] = useState<number>(18);
  const [mortgageYears, setMortgageYears] = useState<number>(20);
  const [rent, setRent] = useState<number>(45000);
  const [depositYield, setDepositYield] = useState<number>(16);
  const [horizon, setHorizon] = useState<number>(10);
  const [repairCost, setRepairCost] = useState<number>(500000);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(4000);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showTimeline, setShowTimeline] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateMortgageVsRent({
      propertyPrice: price,
      initialPayment: downPayment,
      mortgageRate,
      mortgageTermYears: mortgageYears,
      monthlyRent: rent,
      initialRepairCost: repairCost,
      monthlyMaintenanceCost: monthlyMaintenance,
      depositYieldRate: depositYield,
      horizonYears: horizon,
    });
  }, [price, downPayment, mortgageRate, mortgageYears, rent, repairCost, monthlyMaintenance, depositYield, horizon]);

  const setProgramPreset = (rateVal: number, downVal: number) => {
    setMortgageRate(rateVal);
    setDownPayment(downVal);
  };

  const buyerPct = Math.round((result.buyerFinalNetWealth / (result.buyerFinalNetWealth + result.renterFinalPortfolio || 1)) * 100);
  const renterPct = 100 - buyerPct;

  return (
    <div class="space-y-6">
      {/* Шапка */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            Калькулятор: Ипотека или аренда квартиры
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Честный математический расчёт с учётом сложного процента на вкладах и роста цен на жильё
          </p>
        </div>

        {/* Программы ипотеки */}
        <div class="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setProgramPreset(6, Math.round(price * 0.2))}
            class={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              mortgageRate === 6
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Семейная / IT (6%)
          </button>
          <button
            type="button"
            onClick={() => setProgramPreset(22, Math.round(price * 0.2))}
            class={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
              mortgageRate === 22
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Рыночная (22%)
          </button>
        </div>
      </div>

      {/* Основные ползунки */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Цена квартиры */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Цена квартиры</span>
            <span class="text-lg font-black text-amber-900">{formatRubles(price)}</span>
          </div>
          <input
            type="range"
            min="2000000"
            max="40000000"
            step="200000"
            value={price}
            onInput={(e) => setPrice(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Первоначальный взнос */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Первоначальный взнос</span>
            <span class="text-lg font-black text-amber-900">
              {formatRubles(downPayment)} ({price > 0 ? Math.round((downPayment / price) * 100) : 0}%)
            </span>
          </div>
          <input
            type="range"
            min="300000"
            max={price}
            step="100000"
            value={downPayment}
            onInput={(e) => setDownPayment(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Аренда аналога */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Аренда такого же жилья</span>
            <span class="text-lg font-black text-amber-900">{formatRubles(rent)} / мес</span>
          </div>
          <input
            type="range"
            min="15000"
            max="250000"
            step="2000"
            value={rent}
            onInput={(e) => setRent(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Доходность вклада */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Доходность вклада / активов</span>
            <span class="text-lg font-black text-amber-900">{depositYield}% годовых</span>
          </div>
          <input
            type="range"
            min="6"
            max="25"
            step="0.5"
            value={depositYield}
            onInput={(e) => setDepositYield(parseFloat((e.target as HTMLInputElement).value) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>
      </div>

      {/* Горизонт сравнения */}
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-100 text-xs">
        <span class="font-bold text-slate-700">Горизонт расчёта:</span>
        <div class="flex gap-2">
          {[5, 10, 15, 20].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              class={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                horizon === h
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {h} лет
            </button>
          ))}
        </div>
      </div>

      {/* Тонкие настройки */}
      <div class="pt-2 border-t border-slate-100 space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          class="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5"
        >
          <span>{showAdvanced ? '▲ Скрыть расходы на ремонт и налоги' : '⚙️ Тонкие расходы (ремонт, мебель, налог, капремонт)'}</span>
        </button>

        {showAdvanced && (
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">
                Ремонт, мебель и техника на старте:
              </label>
              <input
                type="number"
                step="50000"
                value={repairCost}
                onInput={(e) => setRepairCost(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
              />
              <span class="text-[11px] text-slate-400">арендатор эти деньги сразу инвестирует под процент</span>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">
                Капремонт и налог на имущество:
              </label>
              <input
                type="number"
                step="500"
                value={monthlyMaintenance}
                onInput={(e) => setMonthlyMaintenance(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
              />
              <span class="text-[11px] text-slate-400">руб/мес (в аренде эти траты несёт хозяин квартиры)</span>
            </div>
          </div>
        )}
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
          Итог через {result.horizonYears} лет
        </span>
        <div class="text-2xl font-black text-slate-900 mt-1">
          {result.winner === 'buyer'
            ? `Покупка в ипотеку выгоднее на ${formatRubles(Math.abs(result.wealthDifference))}`
            : `Аренда с накоплениями выгоднее на ${formatRubles(Math.abs(result.wealthDifference))}`}
        </div>
        <p class="text-xs text-slate-600 mt-2">
          {result.winner === 'buyer'
            ? 'Прирост стоимости недвижимости и выплата основного долга обогнали капитализацию депозитов.'
            : 'Высокая ставка по вкладам позволила арендатору сохранить и многократно приумножить капитал взноса.'}
        </p>

        {/* Визуальная шкала долей капитала */}
        <div class="mt-4 space-y-1">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-emerald-800">Капитал покупателя: {formatRubles(result.buyerFinalNetWealth)} ({buyerPct}%)</span>
            <span class="text-amber-800">Капитал арендатора: {formatRubles(result.renterFinalPortfolio)} ({renterPct}%)</span>
          </div>
          <div class="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden">
            <div class="bg-emerald-600 h-full transition-all" style={{ width: `${buyerPct}%` }} />
            <div class="bg-amber-500 h-full transition-all" style={{ width: `${renterPct}%` }} />
          </div>
        </div>
      </div>

      {/* Кнопка таблицы динамики */}
      <div>
        <button
          type="button"
          onClick={() => setShowTimeline(!showTimeline)}
          class="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
        >
          <span>{showTimeline ? '▲ Скрыть динамику по годам' : '▼ Показать подробную таблицу динамики капитала по годам'}</span>
        </button>

        {showTimeline && (
          <div class="mt-3 max-h-72 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b">
                <tr>
                  <th class="p-2.5">Год</th>
                  <th class="p-2.5">Цена жилья</th>
                  <th class="p-2.5">Остаток долга</th>
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
                    <td class="p-2 font-black text-slate-900">{formatRubles(step.buyerNetWealth)}</td>
                    <td class="p-2 font-black text-amber-800">{formatRubles(step.renterPortfolioValue)}</td>
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

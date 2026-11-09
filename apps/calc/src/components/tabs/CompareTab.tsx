import { useState, useMemo } from 'preact/hooks';
import {
  compareWorkRegimes,
  formatRubles,
  formatPercent,
} from '@temka/core';

export default function CompareTab() {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(200000);
  const [mode, setMode] = useState<'fromGross' | 'fromBudget'>('fromGross');

  const result = useMemo(() => {
    return compareWorkRegimes(monthlyAmount, mode);
  }, [monthlyAmount, mode]);

  return (
    <div class="space-y-6">
      {/* Шапка */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            Сравнение: Штат vs Самозанятый vs ИП
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Где остаётся больше денег на руках и сколько теряется на налогах и взносах
          </p>
        </div>

        {/* Переключатель точки отсчёта */}
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('fromGross')}
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'fromGross'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Сумма по договору
          </button>
          <button
            type="button"
            onClick={() => setMode('fromBudget')}
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'fromBudget'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бюджет компании (ФОТ)
          </button>
        </div>
      </div>

      {/* Ползунок суммы */}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              {mode === 'fromGross' ? 'Сумма в месяц (Gross)' : 'Общий месячный бюджет заказчика / компании'}
            </span>
            <span class="text-xs text-slate-500">
              {formatRubles(monthlyAmount * 12)} в год
            </span>
          </div>
          <span class="text-2xl font-black text-emerald-700">
            {formatRubles(monthlyAmount)} / мес
          </span>
        </div>

        <input
          type="range"
          min="50000"
          max="1000000"
          step="10000"
          value={monthlyAmount}
          onInput={(e) => setMonthlyAmount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
          class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div class="flex flex-wrap gap-2 pt-1">
          {[80000, 150000, 200000, 300000, 500000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMonthlyAmount(preset)}
              class={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                monthlyAmount === preset
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {formatRubles(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* 3 карточки сравнения */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.items.map((item) => (
          <div
            key={item.id}
            class="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span class="text-xs text-slate-400">
                  потери: {formatPercent(item.lossPercentage, 1)}
                </span>
              </div>

              <h4 class="text-base font-extrabold text-slate-900 mb-1">
                {item.title}
              </h4>

              {/* Чистая сумма на руки */}
              <div class="my-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] uppercase font-bold text-slate-500 block">
                  На руки / чистая прибыль:
                </span>
                <div class="text-2xl font-black text-slate-950 mt-0.5">
                  {formatRubles(item.netPayout)}
                </div>
                <span class="text-xs text-rose-600 font-semibold mt-1 block">
                  налоги и взносы: {formatRubles(item.totalTaxesAndDeductions)}
                </span>
              </div>

              {/* Особенности режима */}
              <ul class="space-y-1.5 text-xs text-slate-600 mb-4">
                {item.features.map((f, idx) => (
                  <li key={idx} class="flex items-start gap-1.5">
                    <span class="text-emerald-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Затраты компании: <span class="font-bold text-slate-700">{formatRubles(item.employerBudget)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Рекомендация */}
      <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
        <span class="text-xl">💡</span>
        <div class="text-xs text-emerald-950 leading-relaxed">
          <span class="font-bold block mb-0.5">Что выбрать:</span>
          {result.recommendation}
        </div>
      </div>
    </div>
  );
}

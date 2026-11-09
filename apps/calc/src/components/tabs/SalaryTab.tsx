import { useState, useMemo } from 'preact/hooks';
import {
  calculateSalaryFromGross,
  calculateGrossFromNet,
  formatRubles,
  formatPercent,
  parseNumberInput,
  type ChildrenDeductionInput,
  type NdflCalculationResult,
} from '@temka/core';

export default function SalaryTab() {
  const [mode, setMode] = useState<'gross' | 'net'>('gross');
  const [salaryInput, setSalaryInput] = useState<string>('150 000');
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [firstCount, setFirstCount] = useState<number>(0);
  const [secondCount, setSecondCount] = useState<number>(0);
  const [thirdCount, setThirdCount] = useState<number>(0);
  const [disabledCount] = useState<number>(0);
  const [isMsp, setIsMsp] = useState<boolean>(false);
  const [showMonthsBreakdown, setShowMonthsBreakdown] = useState<boolean>(false);

  const salaryNum = useMemo(() => parseNumberInput(salaryInput), [salaryInput]);

  const childrenConfig: ChildrenDeductionInput | undefined = useMemo(() => {
    if (!hasChildren) return undefined;
    return {
      firstCount,
      secondCount,
      thirdAndMoreCount: thirdCount,
      disabledCount,
    };
  }, [hasChildren, firstCount, secondCount, thirdCount, disabledCount]);

  const result: NdflCalculationResult = useMemo(() => {
    if (mode === 'gross') {
      return calculateSalaryFromGross({
        monthlyGross: salaryNum,
        children: childrenConfig,
        isMsp,
      });
    } else {
      return calculateGrossFromNet(salaryNum, {
        children: childrenConfig,
        isMsp,
      });
    }
  }, [mode, salaryNum, childrenConfig, isMsp]);

  const setPreset = (amount: number) => {
    setSalaryInput(formatRubles(amount, { withSymbol: false }).replace(/\u00A0/g, ' '));
  };

  return (
    <div class="space-y-6">
      {/* Переключатель режима и заголовок */}
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-xl font-bold text-slate-900">
            {mode === 'gross' ? 'Расчёт зарплаты на руки (Net)' : 'Расчёт оклада (Gross)'}
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            5-ступенчатая шкала НДФЛ 13%–22% по закону № 176-ФЗ
          </p>
        </div>

        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('gross')}
            class={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'gross'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            От оклада до выплаты
          </button>
          <button
            type="button"
            onClick={() => setMode('net')}
            class={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'net'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Сколько просить на руки
          </button>
        </div>
      </div>

      {/* Поле ввода */}
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          {mode === 'gross' ? 'Оклад до вычета налогов' : 'Сумма на руки в месяц'}
        </label>
        <div class="relative max-w-md">
          <input
            type="text"
            value={salaryInput}
            onInput={(e) => setSalaryInput((e.target as HTMLInputElement).value)}
            placeholder="150 000"
            class="w-full pl-4 pr-12 py-3 text-2xl font-black rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none text-slate-900"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
            ₽
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mt-2.5">
          {[60000, 100000, 150000, 250000, 500000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              class="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-medium rounded-lg transition-colors"
            >
              {formatRubles(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Чекбоксы: Дети и МСП */}
      <div class="pt-2 border-t border-slate-100 space-y-3">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasChildren}
            onChange={(e) => setHasChildren((e.target as HTMLInputElement).checked)}
            class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <span class="text-xs font-semibold text-slate-700">
            Есть дети (вычеты: 1-й — 1 400 ₽, 2-й — 2 800 ₽, 3-й — 6 000 ₽ до лимита 450 тыс. ₽)
          </span>
        </label>

        {hasChildren && (
          <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span class="block text-[11px] font-medium text-slate-700 mb-1">1-й ребёнок</span>
              <input
                type="number"
                min="0"
                value={firstCount}
                onInput={(e) => setFirstCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-xs font-bold"
              />
            </div>
            <div>
              <span class="block text-[11px] font-medium text-slate-700 mb-1">2-й ребёнок</span>
              <input
                type="number"
                min="0"
                value={secondCount}
                onInput={(e) => setSecondCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-xs font-bold"
              />
            </div>
            <div>
              <span class="block text-[11px] font-medium text-slate-700 mb-1">3-й и более</span>
              <input
                type="number"
                min="0"
                value={thirdCount}
                onInput={(e) => setThirdCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-xs font-bold"
              />
            </div>
          </div>
        )}

        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isMsp}
            onChange={(e) => setIsMsp((e.target as HTMLInputElement).checked)}
            class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <span class="text-xs text-slate-600">
            Работодатель из реестра МСП (пониженные страховые взносы 15% свыше МРОТ)
          </span>
        </label>
      </div>

      {/* Результаты в карточках */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span class="text-[11px] uppercase font-bold text-emerald-800">На руки (Net)</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.monthlyNetAverage)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1">в среднем в месяц</span>
        </div>

        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Налог НДФЛ</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(Math.round(result.annualNdfl / 12))}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            ставка {formatPercent(result.effectiveTaxRate, 1)}
          </span>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">Оклад (Gross)</span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {formatRubles(result.monthlyGross)}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            всего в год: {formatRubles(result.annualGross)}
          </span>
        </div>
      </div>

      {/* Шкала ступеней налога */}
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
        <span class="font-bold text-slate-700 block mb-2">Ступени шкалы НДФЛ:</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {result.bracketsBreakdown.map((b) => (
            <div
              key={b.label}
              class={`p-2 rounded-lg border flex items-center justify-between ${
                b.taxableAmountInBracket > 0
                  ? 'bg-white border-emerald-300 font-semibold text-slate-900'
                  : 'border-slate-200 text-slate-400 bg-transparent'
              }`}
            >
              <span>{b.label} ({b.maxIncome ? `до ${formatRubles(b.maxIncome)}` : 'свыше 50 млн'})</span>
              <span>{b.taxInBracket > 0 ? formatRubles(b.taxInBracket) : '0 ₽'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Помесячный график */}
      <div>
        <button
          type="button"
          onClick={() => setShowMonthsBreakdown(!showMonthsBreakdown)}
          class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>{showMonthsBreakdown ? '▲ Скрыть помесячный график' : '▼ Показать помесячный график'}</span>
        </button>

        {showMonthsBreakdown && (
          <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold border-b">
                <tr>
                  <th class="p-2.5">Месяц</th>
                  <th class="p-2.5">Оклад</th>
                  <th class="p-2.5">Вычет</th>
                  <th class="p-2.5">НДФЛ</th>
                  <th class="p-2.5">На руки</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {result.months.map((m) => (
                  <tr key={m.month}>
                    <td class="p-2 font-medium">{m.month}-й мес.</td>
                    <td class="p-2">{formatRubles(m.gross)}</td>
                    <td class="p-2 text-slate-500">{m.deductions > 0 ? formatRubles(m.deductions) : '—'}</td>
                    <td class="p-2 text-rose-600 font-semibold">{formatRubles(m.ndflMonthly)}</td>
                    <td class="p-2 text-emerald-700 font-bold">{formatRubles(m.netSalary)}</td>
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

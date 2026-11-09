import { useState, useEffect, useMemo } from 'preact/hooks';
import {
  calculateSalaryFromGross,
  calculateGrossFromNet,
  formatRubles,
  formatPercent,
  parseNumberInput,
  type ChildrenDeductionInput,
  type NdflCalculationResult,
} from '@temka/core';

export default function SalaryCalculator() {
  const [mode, setMode] = useState<'gross' | 'net'>('gross');
  const [salaryInput, setSalaryInput] = useState<string>('150 000');
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [firstCount, setFirstCount] = useState<number>(0);
  const [secondCount, setSecondCount] = useState<number>(0);
  const [thirdCount, setThirdCount] = useState<number>(0);
  const [disabledCount, setDisabledCount] = useState<number>(0);
  const [isMsp, setIsMsp] = useState<boolean>(false);
  const [showMonthsBreakdown, setShowMonthsBreakdown] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Считывание параметров из URL при первой загрузке (SEO & sharing)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    const urlSalary = params.get('salary');
    const urlFirst = params.get('c1');
    const urlSecond = params.get('c2');
    const urlThird = params.get('c3');
    const urlMsp = params.get('msp');

    if (urlMode === 'net' || urlMode === 'gross') {
      setMode(urlMode);
    }
    if (urlSalary) {
      setSalaryInput(urlSalary);
    }
    if (urlFirst || urlSecond || urlThird) {
      setHasChildren(true);
      if (urlFirst) setFirstCount(parseInt(urlFirst, 10) || 0);
      if (urlSecond) setSecondCount(parseInt(urlSecond, 10) || 0);
      if (urlThird) setThirdCount(parseInt(urlThird, 10) || 0);
    }
    if (urlMsp === '1') {
      setIsMsp(true);
    }
  }, []);

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

  // Вычисление результата
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

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    url.searchParams.set('salary', salaryNum.toString());
    if (hasChildren) {
      if (firstCount > 0) url.searchParams.set('c1', firstCount.toString());
      if (secondCount > 0) url.searchParams.set('c2', secondCount.toString());
      if (thirdCount > 0) url.searchParams.set('c3', thirdCount.toString());
    } else {
      url.searchParams.delete('c1');
      url.searchParams.delete('c2');
      url.searchParams.delete('c3');
    }
    if (isMsp) {
      url.searchParams.set('msp', '1');
    } else {
      url.searchParams.delete('msp');
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const setPreset = (amount: number) => {
    setSalaryInput(formatRubles(amount, { withSymbol: false }).replace(/\u00A0/g, ' '));
  };

  return (
    <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all">
      {/* Шапка калькулятора */}
      <div class="p-6 md:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white print:bg-none print:text-black print:p-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full mb-2 print:hidden">
              Шкала ставок 2025–2026 (176-ФЗ)
            </span>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">
              {mode === 'gross' ? 'Расчёт зарплаты на руки' : 'Расчёт оклада от суммы на руки'}
            </h2>
            <p class="text-emerald-100 text-sm mt-1 print:text-slate-600">
              С учётом 5-ступенчатой прогрессивной шкалы НДФЛ и лимитов вычетов
            </p>
          </div>

          {/* Переключатель режимов */}
          <div class="flex bg-black/20 p-1 rounded-xl backdrop-blur-sm print:hidden">
            <button
              type="button"
              onClick={() => setMode('gross')}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'gross'
                  ? 'bg-white text-emerald-900 shadow-md font-bold'
                  : 'text-white hover:text-emerald-100'
              }`}
            >
              От оклада
            </button>
            <button
              type="button"
              onClick={() => setMode('net')}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'net'
                  ? 'bg-white text-emerald-900 shadow-md font-bold'
                  : 'text-white hover:text-emerald-100'
              }`}
            >
              На руки
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 space-y-8">
        {/* Поле ввода суммы */}
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            {mode === 'gross' ? 'Оклад до вычета налогов (Gross)' : 'Желаемая сумма на руки (Net)'}
          </label>
          <div class="relative max-w-lg">
            <input
              type="text"
              value={salaryInput}
              onInput={(e) => setSalaryInput((e.target as HTMLInputElement).value)}
              placeholder="150 000"
              class="w-full pl-5 pr-14 py-4 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-800"
            />
            <span class="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
              ₽
            </span>
          </div>

          {/* Быстрые пресеты */}
          <div class="flex flex-wrap gap-2 mt-3 print:hidden">
            {[60000, 100000, 150000, 250000, 500000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPreset(preset)}
                class="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
              >
                {formatRubles(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Дополнительные параметры (Вычеты на детей и МСП) */}
        <div class="border-t border-slate-100 pt-6 space-y-4 print:hidden">
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren((e.target as HTMLInputElement).checked)}
                class="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span class="text-sm font-semibold text-slate-800">
                Есть дети (налоговый вычет по 176-ФЗ)
              </span>
            </label>
            <span class="text-xs text-slate-500">Лимит дохода: 450 000 ₽/год</span>
          </div>

          {hasChildren && (
            <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">
                  1-й ребёнок (1 400 ₽)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={firstCount}
                  onInput={(e) => setFirstCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                  class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">
                  2-й ребёнок (2 800 ₽)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={secondCount}
                  onInput={(e) => setSecondCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                  class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">
                  3-й и след. (6 000 ₽)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={thirdCount}
                  onInput={(e) => setThirdCount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                  class="w-full p-2 bg-white rounded-lg border border-emerald-200 text-sm font-semibold"
                />
              </div>
            </div>
          )}

          <div class="pt-2">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isMsp}
                onChange={(e) => setIsMsp((e.target as HTMLInputElement).checked)}
                class="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span class="text-sm font-semibold text-slate-800">
                Работодатель из реестра МСП (пониженные страховые взносы 15% свыше МРОТ)
              </span>
            </label>
          </div>
        </div>

        {/* Главные результаты */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <span class="text-xs uppercase font-bold tracking-wider text-emerald-800">
              Выплата на руки (Net)
            </span>
            <div class="text-3xl font-black text-emerald-950 mt-1">
              {formatRubles(result.monthlyNetAverage)}
            </div>
            <p class="text-xs text-emerald-700 mt-2">
              {result.monthlyNetFirstMonth !== result.monthlyNetLastMonth ? (
                <>В начале года: {formatRubles(result.monthlyNetFirstMonth)}, в конце: {formatRubles(result.monthlyNetLastMonth)}</>
              ) : (
                'Ежемесячно при стандартном графике'
              )}
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-rose-50 border border-rose-200/80">
            <span class="text-xs uppercase font-bold tracking-wider text-rose-800">
              Налог НДФЛ
            </span>
            <div class="text-3xl font-black text-rose-950 mt-1">
              {formatRubles(Math.round(result.annualNdfl / 12))}
            </div>
            <p class="text-xs text-rose-700 mt-2">
              Эффективная ставка: <span class="font-bold">{formatPercent(result.effectiveTaxRate, 1)}</span> (всего за год: {formatRubles(result.annualNdfl)})
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span class="text-xs uppercase font-bold tracking-wider text-slate-700">
              {mode === 'gross' ? 'Оклад по договору' : 'Требуемый оклад (Gross)'}
            </span>
            <div class="text-3xl font-black text-slate-900 mt-1">
              {formatRubles(result.monthlyGross)}
            </div>
            <p class="text-xs text-slate-500 mt-2">
              За год (Gross): {formatRubles(result.annualGross)}
            </p>
          </div>
        </div>

        {/* Прогрессивная шкала: наглядная разбивка */}
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200/70">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
            <span>Разбивка налога по шкале ставок 2026</span>
            <span class="text-xs font-normal text-slate-500 lowercase">ст. 224 НК РФ</span>
          </h3>

          <div class="space-y-3">
            {result.bracketsBreakdown.map((bracket) => {
              const hasAmount = bracket.taxableAmountInBracket > 0;
              return (
                <div
                  key={bracket.label}
                  class={`p-3 rounded-xl border flex flex-wrap items-center justify-between text-sm transition-all ${
                    hasAmount
                      ? 'bg-white border-emerald-300 shadow-sm'
                      : 'bg-transparent border-slate-200 opacity-60'
                  }`}
                >
                  <div class="flex items-center gap-3">
                    <span
                      class={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        hasAmount ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {bracket.label}
                    </span>
                    <span class="font-medium text-slate-800">
                      {bracket.maxIncome
                        ? `до ${formatRubles(bracket.maxIncome)}`
                        : `свыше ${formatRubles(bracket.minIncome)}`}
                    </span>
                  </div>

                  <div class="text-right">
                    {hasAmount ? (
                      <div>
                        <span class="font-bold text-slate-900">
                          {formatRubles(bracket.taxInBracket)}
                        </span>
                        <span class="text-xs text-slate-500 block">
                          с базы {formatRubles(bracket.taxableAmountInBracket)}
                        </span>
                      </div>
                    ) : (
                      <span class="text-xs text-slate-400">порог не достигнут</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Расходы работодателя */}
        <div class="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100">
          <h3 class="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-2">
            Сколько сотрудник обходится компании
          </h3>
          <p class="text-xs text-indigo-700 mb-4">
            Помимо оклада работодатель платит взносы в Социальный фонд РФ (ОПС, ОМС, ВНиМ) и от травматизма.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span class="text-xs text-slate-600">Страховые взносы (год)</span>
              <div class="text-xl font-bold text-slate-900 mt-1">
                {formatRubles(result.employerCosts.totalContributions)}
              </div>
              <span class="text-xs text-indigo-600 font-medium">
                {formatPercent(result.employerCosts.contributionsPercentOfGross, 1)} от оклада
              </span>
            </div>
            <div>
              <span class="text-xs text-slate-600">Всего затрат в месяц</span>
              <div class="text-xl font-bold text-slate-900 mt-1">
                {formatRubles(Math.round(result.employerCosts.totalCostForEmployer / 12))}
              </div>
              <span class="text-xs text-slate-500">оклад + взносы</span>
            </div>
            <div>
              <span class="text-xs text-slate-600">Всего затрат в год</span>
              <div class="text-xl font-bold text-indigo-950 mt-1">
                {formatRubles(result.employerCosts.totalCostForEmployer)}
              </div>
              <span class="text-xs text-slate-500">полный зарплатный фонд</span>
            </div>
          </div>
        </div>

        {/* Разворачиваемый помесячный график */}
        <div>
          <button
            type="button"
            onClick={() => setShowMonthsBreakdown(!showMonthsBreakdown)}
            class="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center justify-between transition-colors print:hidden"
          >
            <span>Помесячный график выплат и пороги налогов</span>
            <span>{showMonthsBreakdown ? '▲ Скрыть' : '▼ Показать'}</span>
          </button>

          {(showMonthsBreakdown || typeof window === 'undefined') && (
            <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 print:block">
              <table class="w-full text-left text-xs md:text-sm">
                <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="p-3">Месяц</th>
                    <th class="p-3">Оклад</th>
                    <th class="p-3">Вычеты</th>
                    <th class="p-3">Доход с нач. года</th>
                    <th class="p-3">НДФЛ</th>
                    <th class="p-3">На руки</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {result.months.map((m) => (
                    <tr key={m.month} class="hover:bg-slate-50">
                      <td class="p-3 font-semibold text-slate-800">{m.month}-й мес.</td>
                      <td class="p-3">{formatRubles(m.gross)}</td>
                      <td class="p-3 text-slate-500">{m.deductions > 0 ? formatRubles(m.deductions) : '—'}</td>
                      <td class="p-3 text-slate-600">{formatRubles(m.cumulativeGross)}</td>
                      <td class="p-3 font-semibold text-rose-600">{formatRubles(m.ndflMonthly)}</td>
                      <td class="p-3 font-bold text-emerald-700">{formatRubles(m.netSalary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Панель действий: поделиться и распечатать */}
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 print:hidden">
          <div class="text-xs text-slate-500">
            {copySuccess ? (
              <span class="text-emerald-600 font-semibold">✓ Ссылка с параметрами скопирована!</span>
            ) : (
              'Данные актуальны на ноябрь 2026 г.'
            )}
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              Скопировать ссылку
            </button>
            <button
              type="button"
              onClick={handlePrint}
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              Распечатать / Сохранить в PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

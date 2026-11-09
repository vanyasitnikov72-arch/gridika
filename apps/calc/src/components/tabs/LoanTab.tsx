import { useState, useMemo } from 'preact/hooks';
import {
  calculateLoan,
  formatRubles,
  parseNumberInput,
  type LoanType,
  type EarlyStrategy,
} from '@temka/core';

export default function LoanTab() {
  const [principalInput, setPrincipalInput] = useState<string>('1 000 000');
  const [rateInput, setRateInput] = useState<string>('21');
  const [termYearsInput, setTermYearsInput] = useState<string>('5');
  const [loanType, setLoanType] = useState<LoanType>('annuity');
  const [monthlyEarlyInput, setMonthlyEarlyInput] = useState<string>('10 000');
  const [earlyStrategy, setEarlyStrategy] = useState<EarlyStrategy>('reduceTerm');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const principal = useMemo(() => parseNumberInput(principalInput), [principalInput]);
  const rate = useMemo(() => parseNumberInput(rateInput), [rateInput]);
  const termYears = useMemo(() => parseNumberInput(termYearsInput), [termYearsInput]);
  const monthlyEarly = useMemo(() => parseNumberInput(monthlyEarlyInput), [monthlyEarlyInput]);

  const result = useMemo(() => {
    return calculateLoan({
      principal,
      annualRate: rate,
      termMonths: Math.max(1, Math.round(termYears * 12)),
      type: loanType,
      monthlyEarlyRepayment: monthlyEarly,
      earlyStrategy,
    });
  }, [principal, rate, termYears, loanType, monthlyEarly, earlyStrategy]);

  const yearsSaved = Math.floor(result.monthsSaved / 12);
  const remMonthsSaved = result.monthsSaved % 12;

  return (
    <div class="space-y-6">
      {/* Заголовок таба */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900">
            Кредитный калькулятор с досрочным погашением
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Расчёт аннуитета, дифференцированного платежа и экономии на процентах
          </p>
        </div>

        {/* Выбор типа платежа */}
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLoanType('annuity')}
            class={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              loanType === 'annuity'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Аннуитетный
          </button>
          <button
            type="button"
            onClick={() => setLoanType('differentiated')}
            class={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              loanType === 'differentiated'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Дифференцированный
          </button>
        </div>
      </div>

      {/* Поля ввода параметров кредита */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Сумма кредита
          </label>
          <div class="relative">
            <input
              type="text"
              value={principalInput}
              onInput={(e) => setPrincipalInput((e.target as HTMLInputElement).value)}
              placeholder="1 000 000"
              class="w-full pl-4 pr-10 py-2.5 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none"
            />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">₽</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Ставка (% годовых)
          </label>
          <div class="relative">
            <input
              type="text"
              value={rateInput}
              onInput={(e) => setRateInput((e.target as HTMLInputElement).value)}
              placeholder="21"
              class="w-full pl-4 pr-10 py-2.5 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none"
            />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">%</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Срок (лет)
          </label>
          <div class="relative">
            <input
              type="text"
              value={termYearsInput}
              onInput={(e) => setTermYearsInput((e.target as HTMLInputElement).value)}
              placeholder="5"
              class="w-full pl-4 pr-12 py-2.5 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none"
            />
            <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">лет</span>
          </div>
        </div>
      </div>

      {/* Блок досрочного погашения */}
      <div class="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-3">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-950 block">
          Параметры досрочного погашения
        </span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Дополнительно каждый месяц
            </label>
            <div class="relative">
              <input
                type="text"
                value={monthlyEarlyInput}
                onInput={(e) => setMonthlyEarlyInput((e.target as HTMLInputElement).value)}
                placeholder="0"
                class="w-full pl-3 pr-8 py-2 bg-white rounded-lg border border-indigo-200 text-sm font-bold"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₽</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Цель досрочки
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEarlyStrategy('reduceTerm')}
                class={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                  earlyStrategy === 'reduceTerm'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                Сократить срок
              </button>
              <button
                type="button"
                onClick={() => setEarlyStrategy('reducePayment')}
                class={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                  earlyStrategy === 'reducePayment'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                Уменьшить платёж
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Карточки результатов */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">Базовый платёж</span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {formatRubles(result.monthlyPaymentFirstMonth)}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            {loanType === 'differentiated'
              ? `к концу срока: ${formatRubles(result.monthlyPaymentLastMonth)}`
              : 'ежемесячно по графику'}
          </span>
        </div>

        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span class="text-[11px] uppercase font-bold text-emerald-800">Экономия на процентах</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.interestSaved)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1">
            {result.monthsSaved > 0
              ? `срок сокращён на ${yearsSaved > 0 ? `${yearsSaved} г. ` : ''}${remMonthsSaved} мес.`
              : 'без досрочных платежей'}
          </span>
        </div>

        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Переплата банку</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(result.actualTotalInterest)}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            всего выплат: {formatRubles(result.actualTotalPayment)}
          </span>
        </div>
      </div>

      {/* График платежей */}
      <div>
        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          class="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>{showSchedule ? '▲ Скрыть график платежей' : '▼ Показать подробный график платежей'}</span>
        </button>

        {showSchedule && (
          <div class="mt-3 max-h-80 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b">
                <tr>
                  <th class="p-2.5">№ мес.</th>
                  <th class="p-2.5">Платёж</th>
                  <th class="p-2.5">Основной долг</th>
                  <th class="p-2.5">Проценты</th>
                  <th class="p-2.5">Досрочно</th>
                  <th class="p-2.5">Остаток долга</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {result.schedule.map((row) => (
                  <tr key={row.month} class="hover:bg-slate-50">
                    <td class="p-2 font-medium">{row.month}</td>
                    <td class="p-2 font-bold">{formatRubles(row.payment)}</td>
                    <td class="p-2">{formatRubles(row.principalPortion)}</td>
                    <td class="p-2 text-rose-600">{formatRubles(row.interestPortion)}</td>
                    <td class="p-2 text-indigo-600 font-semibold">
                      {row.earlyRepayment > 0 ? formatRubles(row.earlyRepayment) : '—'}
                    </td>
                    <td class="p-2 text-slate-600">{formatRubles(row.remainingPrincipal)}</td>
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

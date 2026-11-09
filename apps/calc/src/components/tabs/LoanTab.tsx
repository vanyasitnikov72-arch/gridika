import { useState, useMemo } from 'preact/hooks';
import {
  calculateLoan,
  formatRubles,
  exportScheduleToCsv,
  type LoanType,
  type EarlyStrategy,
  type OneTimeEarlyPayment,
} from '@temka/core';

export default function LoanTab() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(21);
  const [termYears, setTermYears] = useState<number>(5);
  const [loanType, setLoanType] = useState<LoanType>('annuity');
  const [monthlyEarly, setMonthlyEarly] = useState<number>(10000);
  const [earlyStrategy, setEarlyStrategy] = useState<EarlyStrategy>('reduceTerm');
  const [oneTimePayments, setOneTimePayments] = useState<OneTimeEarlyPayment[]>([]);
  const [annualInsuranceRate, setAnnualInsuranceRate] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateLoan({
      principal,
      annualRate: rate,
      termMonths: Math.max(1, Math.round(termYears * 12)),
      type: loanType,
      monthlyEarlyRepayment: monthlyEarly,
      oneTimeEarlyPayments: oneTimePayments,
      earlyStrategy,
      annualInsuranceRate,
    });
  }, [principal, rate, termYears, loanType, monthlyEarly, oneTimePayments, earlyStrategy, annualInsuranceRate]);

  const addOneTimePayment = () => {
    setOneTimePayments([
      ...oneTimePayments,
      { id: Math.random().toString(), month: 6, amount: 50000 },
    ]);
  };

  const removeOneTimePayment = (index: number) => {
    setOneTimePayments(oneTimePayments.filter((_, i) => i !== index));
  };

  const updateOneTimePayment = (index: number, field: 'month' | 'amount', value: number) => {
    const updated = [...oneTimePayments];
    updated[index] = { ...updated[index], [field]: value };
    setOneTimePayments(updated);
  };

  const handleDownloadCsv = () => {
    if (typeof window === 'undefined') return;
    const csvContent = '\uFEFF' + exportScheduleToCsv(result.schedule);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `grafik-platezhey-${principal}-rub.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const yearsSaved = Math.floor(result.monthsSaved / 12);
  const remMonthsSaved = result.monthsSaved % 12;

  return (
    <div class="space-y-6">
      {/* Шапка */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            Кредитный калькулятор с досрочным погашением
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Точный расчёт аннуитета, дифференцированного платежа и реальной выгоды досрочки
          </p>
        </div>

        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLoanType('annuity')}
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
            class={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              loanType === 'differentiated'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Дифференцированный
          </button>
        </div>
      </div>

      {/* Основные ползунки параметров кредита */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Сумма кредита */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Сумма кредита</span>
            <span class="text-lg font-black text-indigo-900">{formatRubles(principal)}</span>
          </div>
          <input
            type="range"
            min="50000"
            max="15000000"
            step="50000"
            value={principal}
            onInput={(e) => setPrincipal(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>50 тыс. ₽</span>
            <span>5 млн ₽</span>
            <span>15 млн ₽</span>
          </div>
        </div>

        {/* Процентная ставка */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Ставка</span>
            <span class="text-lg font-black text-indigo-900">{rate}% годовых</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="0.5"
            value={rate}
            onInput={(e) => setRate(parseFloat((e.target as HTMLInputElement).value) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>5% (льготная)</span>
            <span>22% (рынок)</span>
            <span>40%</span>
          </div>
        </div>

        {/* Срок кредита */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Срок кредита</span>
            <span class="text-lg font-black text-indigo-900">{termYears} лет ({termYears * 12} мес.)</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={termYears}
            onInput={(e) => setTermYears(parseInt((e.target as HTMLInputElement).value, 10) || 1)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>1 год</span>
            <span>15 лет</span>
            <span>30 лет</span>
          </div>
        </div>
      </div>

      {/* Блок досрочного погашения */}
      <div class="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-950">
            Досрочное погашение и стратегия
          </span>
          <div class="flex bg-white p-1 rounded-xl border border-indigo-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setEarlyStrategy('reduceTerm')}
              class={`px-3 py-1 rounded-lg transition-all ${
                earlyStrategy === 'reduceTerm'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Сократить срок (макс. экономия)
            </button>
            <button
              type="button"
              onClick={() => setEarlyStrategy('reducePayment')}
              class={`px-3 py-1 rounded-lg transition-all ${
                earlyStrategy === 'reducePayment'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Уменьшить платёж
            </button>
          </div>
        </div>

        {/* Ежемесячный досрочный платеж */}
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-700 font-semibold">Дополнительно каждый месяц к регулярному платежу:</span>
            <span class="font-black text-indigo-900">{formatRubles(monthlyEarly)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="2000"
            value={monthlyEarly}
            onInput={(e) => setMonthlyEarly(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Разовые досрочные платежи */}
        <div class="pt-2 border-t border-indigo-100 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">Разовые досрочные платежи (с премий, продажи активов):</span>
            <button
              type="button"
              onClick={addOneTimePayment}
              class="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-200 transition-colors"
            >
              + Добавить разовый платёж
            </button>
          </div>

          {oneTimePayments.map((p, idx) => (
            <div key={p.id ?? idx} class="flex items-center gap-2 bg-white p-2 rounded-xl border border-indigo-200 text-xs">
              <span class="text-slate-500">В</span>
              <input
                type="number"
                min="1"
                max={termYears * 12}
                value={p.month}
                onInput={(e) => updateOneTimePayment(idx, 'month', parseInt((e.target as HTMLInputElement).value, 10) || 1)}
                class="w-16 p-1 border rounded text-center font-bold"
              />
              <span class="text-slate-500">месяц внести:</span>
              <input
                type="number"
                step="10000"
                value={p.amount}
                onInput={(e) => updateOneTimePayment(idx, 'amount', parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-28 p-1 border rounded text-right font-bold"
              />
              <span class="text-slate-500">₽</span>
              <button
                type="button"
                onClick={() => removeOneTimePayment(idx)}
                class="ml-auto text-rose-500 hover:text-rose-700 font-bold px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Карточки результатов */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
          <span class="text-[11px] uppercase font-bold text-emerald-800">Чистая экономия</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.interestSaved)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1 font-semibold">
            {result.monthsSaved > 0
              ? `срок кредита сокращён на ${yearsSaved > 0 ? `${yearsSaved} г. ` : ''}${remMonthsSaved} мес.`
              : 'без досрочных платежей'}
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">Базовый платёж</span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {formatRubles(result.monthlyPaymentFirstMonth)}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            {loanType === 'differentiated'
              ? `снижается до ${formatRubles(result.monthlyPaymentLastMonth)}`
              : 'ежемесячно по договору'}
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Переплата банку</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(result.actualTotalInterest)}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            всего банку вернётся: {formatRubles(result.actualTotalPayment)}
          </span>
        </div>
      </div>

      {/* Кнопки графика и экспорта */}
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          class="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>{showSchedule ? '▲ Скрыть подробный график' : '▼ Показать подробный график всех платежей'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadCsv}
          class="px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
        >
          <span>📥</span>
          <span>Скачать график в Excel (CSV)</span>
        </button>
      </div>

      {showSchedule && (
        <div class="max-h-80 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b">
              <tr>
                <th class="p-2.5">Месяц</th>
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
  );
}

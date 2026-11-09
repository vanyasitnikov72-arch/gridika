import { useState, useMemo } from 'preact/hooks';
import {
  calculateNpd,
  formatRubles,
  formatPercent,
  parseNumberInput,
  NPD_ANNUAL_LIMIT,
} from '@temka/core';

export default function NpdTab() {
  const [individualIncomeInput, setIndividualIncomeInput] = useState<string>('50 000');
  const [legalIncomeInput, setLegalIncomeInput] = useState<string>('100 000');
  const [useBonus, setUseBonus] = useState<boolean>(true);
  const [bonusInput, setBonusInput] = useState<string>('10 000');
  const [priorIncomeInput, setPriorIncomeInput] = useState<string>('0');

  const indIncome = useMemo(() => parseNumberInput(individualIncomeInput), [individualIncomeInput]);
  const legalIncome = useMemo(() => parseNumberInput(legalIncomeInput), [legalIncomeInput]);
  const bonus = useMemo(() => (useBonus ? parseNumberInput(bonusInput) : 0), [useBonus, bonusInput]);
  const priorIncome = useMemo(() => parseNumberInput(priorIncomeInput), [priorIncomeInput]);

  const result = useMemo(() => {
    return calculateNpd({
      incomeFromIndividuals: indIncome,
      incomeFromLegalEntities: legalIncome,
      initialBonus: bonus,
      priorCumulativeIncome: priorIncome,
    });
  }, [indIncome, legalIncome, bonus, priorIncome]);

  const limitProgressPercent = Math.min(100, Math.round((result.totalCumulativeIncome / NPD_ANNUAL_LIMIT) * 100));

  return (
    <div class="space-y-6">
      {/* Шапка таба */}
      <div class="pb-4 border-b border-slate-100">
        <h3 class="text-xl font-bold text-slate-900">
          Калькулятор налога самозанятого (НПД)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Ставки 4% (физлица) и 6% (юрлица), налоговый вычет 10 000 ₽ и лимит дохода 2,4 млн ₽
        </p>
      </div>

      {/* Поля ввода доходов */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Доход от физлиц (ставка 4%)
          </label>
          <div class="relative">
            <input
              type="text"
              value={individualIncomeInput}
              onInput={(e) => setIndividualIncomeInput((e.target as HTMLInputElement).value)}
              placeholder="50 000"
              class="w-full pl-4 pr-12 py-3 text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₽</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Доход от юрлиц и ИП (ставка 6%)
          </label>
          <div class="relative">
            <input
              type="text"
              value={legalIncomeInput}
              onInput={(e) => setLegalIncomeInput((e.target as HTMLInputElement).value)}
              placeholder="100 000"
              class="w-full pl-4 pr-12 py-3 text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₽</span>
          </div>
        </div>
      </div>

      {/* Опции бонуса и дохода с начала года */}
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useBonus}
              onChange={(e) => setUseBonus((e.target as HTMLInputElement).checked)}
              class="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <span class="text-xs font-semibold text-slate-800">
              Учитывать налоговый бонус 10 000 ₽ (снижает ставки до 3% и 4%)
            </span>
          </label>

          {useBonus && (
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-500">Остаток бонуса:</span>
              <input
                type="text"
                value={bonusInput}
                onInput={(e) => setBonusInput((e.target as HTMLInputElement).value)}
                class="w-24 p-1.5 bg-white border border-slate-300 rounded-lg text-center font-bold"
              />
            </div>
          )}
        </div>

        <div class="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs text-slate-600">Доход с начала года (для проверки лимита 2,4 млн ₽):</span>
          <div class="flex items-center gap-1">
            <input
              type="text"
              value={priorIncomeInput}
              onInput={(e) => setPriorIncomeInput((e.target as HTMLInputElement).value)}
              placeholder="0"
              class="w-32 p-1.5 bg-white border border-slate-300 rounded-lg text-right font-bold text-xs"
            />
            <span class="text-xs font-bold text-slate-500">₽</span>
          </div>
        </div>
      </div>

      {/* Карточки результатов */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-xl bg-teal-50 border border-teal-200">
          <span class="text-[11px] uppercase font-bold text-teal-800">Чистый доход</span>
          <div class="text-2xl font-black text-teal-950 mt-1">
            {formatRubles(result.netIncome)}
          </div>
          <span class="text-[11px] text-teal-700 block mt-1">
            из {formatRubles(result.totalIncome)} общего дохода
          </span>
        </div>

        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Налог к уплате</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(result.taxToPay)}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            эффективная ставка: {formatPercent(result.effectiveRate, 1)}
          </span>
        </div>

        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <span class="text-[11px] uppercase font-bold text-emerald-800">Экономия на бонусе</span>
          <div class="text-2xl font-black text-emerald-950 mt-1">
            {formatRubles(result.bonusUsed)}
          </div>
          <span class="text-[11px] text-emerald-700 block mt-1">
            останется бонуса: {formatRubles(result.bonusRemaining)}
          </span>
        </div>
      </div>

      {/* Прогресс-бар годового лимита */}
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-slate-700">Лимит дохода самозанятого: 2 400 000 ₽ / год</span>
          <span class={`font-bold ${result.isLimitExceeded ? 'text-rose-600' : 'text-slate-600'}`}>
            {result.isLimitExceeded ? 'Лимит превышен!' : `Осталось: ${formatRubles(result.remainingLimit)}`}
          </span>
        </div>

        <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            class={`h-full rounded-full transition-all ${
              result.isLimitExceeded ? 'bg-rose-500' : 'bg-teal-600'
            }`}
            style={{ width: `${limitProgressPercent}%` }}
          />
        </div>

        {result.isLimitExceeded && (
          <p class="text-xs text-rose-700 mt-2 font-medium">
            Внимание: при превышении дохода 2,4 млн ₽ право на применение специального налогового режима НПД в текущем году утрачивается. Доход сверх лимита облагается по ставке 13% НДФЛ или требует открытия ИП на УСН.
          </p>
        )}
      </div>
    </div>
  );
}

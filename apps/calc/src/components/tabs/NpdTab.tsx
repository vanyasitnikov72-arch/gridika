import { useState, useMemo } from 'preact/hooks';
import {
  calculateNpd,
  formatRubles,
  formatPercent,
  NPD_ANNUAL_LIMIT,
} from '@temka/core';

export default function NpdTab() {
  const [indIncome, setIndIncome] = useState<number>(40000);
  const [legalIncome, setLegalIncome] = useState<number>(120000);
  const [useBonus, setUseBonus] = useState<boolean>(true);
  const [bonusAmount, setBonusAmount] = useState<number>(10000);
  const [priorIncome, setPriorIncome] = useState<number>(0);
  const [commissionRate, setCommissionRate] = useState<number>(0);
  const [includePension, setIncludePension] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateNpd({
      incomeFromIndividuals: indIncome,
      incomeFromLegalEntities: legalIncome,
      initialBonus: useBonus ? bonusAmount : 0,
      priorCumulativeIncome: priorIncome,
      commissionRate,
      includePensionContributions: includePension,
    });
  }, [indIncome, legalIncome, useBonus, bonusAmount, priorIncome, commissionRate, includePension]);

  const limitProgressPercent = Math.min(100, Math.round((result.totalCumulativeIncome / NPD_ANNUAL_LIMIT) * 100));

  return (
    <div class="space-y-6">
      {/* Шапка таба */}
      <div class="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 class="text-xl font-black text-slate-900">
            Калькулятор налога самозанятого (НПД)
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Ставки 4% (физлица) и 6% (юрлица), налоговый бонус 10 000 ₽ и комиссии маркетплейсов
          </p>
        </div>
      </div>

      {/* Ползунки доходов */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Физлица */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
              От физлиц (ставка 4%)
            </span>
            <span class="text-lg font-black text-teal-700">
              {formatRubles(indIncome)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="300000"
            step="5000"
            value={indIncome}
            onInput={(e) => setIndIncome(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>0 ₽</span>
            <span>150 000 ₽</span>
            <span>300 000 ₽</span>
          </div>
        </div>

        {/* Юрлица и ИП */}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
              От юрлиц и ИП (ставка 6%)
            </span>
            <span class="text-lg font-black text-teal-700">
              {formatRubles(legalIncome)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={legalIncome}
            onInput={(e) => setLegalIncome(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div class="flex justify-between text-[10px] text-slate-400">
            <span>0 ₽</span>
            <span>250 000 ₽</span>
            <span>500 000 ₽</span>
          </div>
        </div>
      </div>

      {/* Тонкие настройки */}
      <div class="pt-2 border-t border-slate-100 space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          class="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
        >
          <span>{showAdvanced ? '▲ Скрыть комиссии и вычеты' : '⚙️ Комиссии маркетплейсов (WB/Ozon), бонус и пенсия'}</span>
        </button>

        {showAdvanced && (
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            {/* Комиссия площадок */}
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-slate-700">
                  Комиссия маркетплейса / эквайринга: {commissionRate}%
                </label>
                <span class="text-xs font-semibold text-rose-600">
                  {formatRubles(result.commissionAmount)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={commissionRate}
                onInput={(e) => setCommissionRate(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
              <p class="text-[11px] text-slate-500 mt-1">
                Важно: по закону № 422-ФЗ налог исчисляется со всей цены продажи покупателю, а не с суммы после удержания комиссии Wildberries/Ozon.
              </p>
            </div>

            {/* Бонус 10 000 руб */}
            <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useBonus}
                  onChange={(e) => setUseBonus((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
                <span class="text-xs font-bold text-slate-800">
                  Налоговый бонус (снижает ставку до 3% и 4%)
                </span>
              </label>

              {useBonus && (
                <div class="flex items-center gap-1.5 text-xs">
                  <span class="text-slate-500">Остаток:</span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={bonusAmount}
                    onInput={(e) => setBonusAmount(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
                    class="w-24 p-1 bg-white border border-slate-300 rounded font-bold text-center text-xs"
                  />
                  <span>₽</span>
                </div>
              )}
            </div>

            {/* Пенсионные взносы */}
            <div class="pt-2 border-t border-slate-200/60">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includePension}
                  onChange={(e) => setIncludePension((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-teal-600 rounded border-slate-300"
                />
                <span class="text-xs font-bold text-slate-800">
                  Учитывать добровольные взносы в СФР на пенсионный стаж (~4 470 ₽/мес)
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Карточки результатов */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200">
          <span class="text-[11px] uppercase font-bold text-teal-800">Чистая прибыль</span>
          <div class="text-2xl font-black text-teal-950 mt-1">
            {formatRubles(result.netIncome)}
          </div>
          <span class="text-[11px] text-teal-700 block mt-1">
            после всех налогов и комиссий
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <span class="text-[11px] uppercase font-bold text-rose-800">Налог НПД к уплате</span>
          <div class="text-2xl font-black text-rose-950 mt-1">
            {formatRubles(result.taxToPay)}
          </div>
          <span class="text-[11px] text-rose-700 block mt-1">
            эффективная ставка: {formatPercent(result.effectiveRate, 1)} (списан бонус {formatRubles(result.bonusUsed)})
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] uppercase font-bold text-slate-700">Общая выручка</span>
          <div class="text-2xl font-black text-slate-900 mt-1">
            {formatRubles(result.totalIncome)}
          </div>
          <span class="text-[11px] text-slate-500 block mt-1">
            {result.commissionAmount > 0 ? `на карту поступило: ${formatRubles(result.payoutOnCard)}` : 'сумма всех чеков'}
          </span>
        </div>
      </div>

      {/* Шкала лимита 2,4 млн ₽ */}
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-slate-700">Годовой лимит самозанятого: 2 400 000 ₽</span>
          <span class={`font-bold ${result.isLimitExceeded ? 'text-rose-600' : 'text-slate-600'}`}>
            {result.isLimitExceeded ? 'Лимит превышен!' : `Осталось до лимита: ${formatRubles(result.remainingLimit)}`}
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
      </div>
    </div>
  );
}

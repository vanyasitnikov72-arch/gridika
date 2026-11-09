import { useState, useEffect } from 'preact/hooks';
import SalaryTab from './tabs/SalaryTab';
import NpdTab from './tabs/NpdTab';
import UsnTab from './tabs/UsnTab';
import CompareTab from './tabs/CompareTab';
import LoanTab from './tabs/LoanTab';
import MortgageVsRentTab from './tabs/MortgageVsRentTab';

export type TabKey = 'salary' | 'npd' | 'usn' | 'compare' | 'loan' | 'mortgage';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
  badge?: string;
}

const TABS: TabItem[] = [
  { key: 'salary', label: 'Зарплата (НДФЛ)', icon: '💰' },
  { key: 'npd', label: 'Самозанятый (НПД)', icon: '🧾' },
  { key: 'usn', label: 'ИП на УСН 6%', icon: '💼' },
  { key: 'compare', label: 'Сравнение режимов', icon: '⚖️' },
  { key: 'loan', label: 'Кредит с досрочкой', icon: '📊' },
  { key: 'mortgage', label: 'Ипотека vs Аренда', icon: '🏠' },
];

interface Props {
  initialTab?: TabKey;
}

export default function UnifiedCalculator({ initialTab = 'salary' }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabKey | null;
    if (tabParam && ['salary', 'npd', 'usn', 'compare', 'loan', 'mortgage'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', key);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div class="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Навигационные табы сверху */}
      <div class="bg-slate-900 p-2 sm:p-3 overflow-x-auto no-scrollbar print:hidden">
        <div class="flex items-center gap-1.5 min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                class={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span class="px-1.5 py-0.5 text-[10px] bg-emerald-500/30 text-emerald-300 rounded font-normal">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Контейнер активного калькулятора */}
      <div class="p-6 md:p-8">
        {activeTab === 'salary' && <SalaryTab />}
        {activeTab === 'npd' && <NpdTab />}
        {activeTab === 'usn' && <UsnTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'loan' && <LoanTab />}
        {activeTab === 'mortgage' && <MortgageVsRentTab />}

        {/* Нижняя панель действий */}
        <div class="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div class="text-xs text-slate-500">
            {copied ? (
              <span class="text-emerald-600 font-bold">✓ Ссылка на текущий калькулятор скопирована!</span>
            ) : (
              'Все вычисления производятся в браузере приватно и быстро.'
            )}
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Скопировать ссылку
            </button>
            <button
              type="button"
              onClick={handlePrint}
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              Распечатать / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'preact/hooks';
import confetti from 'canvas-confetti';

interface EffectCard {
  id: string;
  candidateNumber: number;
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
  initialVotes: number;
  category: string;
}

const UPCOMING_EFFECTS: EffectCard[] = [
  {
    id: 'particles',
    candidateNumber: 2,
    title: 'Заголовок из частиц',
    subtitle: 'Кинетическая типографика',
    description: 'Заголовок сайта из сотен объемных частиц, которые мягко разлетаются от курсора мыши и пальца на смартфоне. Создает эффект живого пространства на первом экране.',
    specs: ['Zero Block Tilda', '+35% внимания', '60 FPS WebGL'],
    initialVotes: 184,
    category: 'Hero-блок',
  },
  {
    id: 'timer',
    candidateNumber: 3,
    title: 'Голографический таймер',
    subtitle: 'Объемный 3D-отсчет',
    description: 'Объемный 3D-таймер обратного отсчета до старта события, вебинара или скидки. Парящие стеклянные цифры со светящимися кольцами стимулируют быстрое принятие решения.',
    specs: ['Блок T123', 'x1.8 конверсия акций', 'Авто-рестарт'],
    initialVotes: 246,
    category: 'Лидогенерация',
  },
  {
    id: 'pedestal',
    candidateNumber: 4,
    title: '3D Витрина товара',
    subtitle: 'Подиум с обзором 360°',
    description: 'Интерактивный подиум товара с динамическим бликом, вращением на 360° и взрыв-схемой компонентов. Позволяет рассмотреть продукт со всех сторон прямо в каталоге.',
    specs: ['ST300 / Zero Block', 'x2.2 глубина просмотра', 'Взрыв-схема'],
    initialVotes: 312,
    category: 'E-Commerce',
  },
];

export function UpcomingCatalog() {
  const [votes, setVotes] = useState<Record<string, number>>({
    particles: 184,
    timer: 246,
    pedestal: 312,
  });
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // Live ticking seconds for Holographic Timer
  const [seconds, setSeconds] = useState(52);
  const [minutes, setMinutes] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setMinutes((m) => (m === 0 ? 59 : m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Particle card hover dispersion state
  const [particlesHovered, setParticlesHovered] = useState(false);

  const handleVote = (id: string, e: MouseEvent) => {
    if (userVoted[id]) return;

    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setVotes((prev) => ({ ...prev, [id]: prev[id] + 1 }));

    // Confetti burst from button position
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { x, y },
        colors: ['#19C37D', '#DFF8EB', '#132A22'],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="w-full">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/25 shadow-sm inline-block mb-3">
          Будущие эффекты
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-tight">
          Каталог в разработке
        </h2>
        <p className="text-[#78716c] text-xs sm:text-sm mt-2 font-medium leading-relaxed">
          Скоро появятся новые интерактивные механики. Голосуйте за виджеты, которые выйдут первыми.
        </p>
      </div>

      {/* 3 TACTILE CARDS WITH LIVE PREVIEWS & VOTING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: ЗАГОЛОВОК ИЗ ЧАСТИЦ (Кандидат №2) */}
        <div
          className="soft-3d-card p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl transition-all group select-none"
          onMouseEnter={() => setParticlesHovered(true)}
          onMouseLeave={() => setParticlesHovered(false)}
        >
          <div>
            {/* Top row: Icon + Status badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#DFF8EB]/70 border border-[#19C37D]/25 flex items-center justify-center text-[#19C37D] shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/20">
                  №2
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ede9df] text-[#57534e]">
                  Скоро
                </span>
              </div>
            </div>

            {/* LIVE VISUAL PREVIEW: KINETIC FLOATING PARTICLES */}
            <div className="h-40 rounded-2xl bg-gradient-to-b from-[#fbf9f5] to-[#f0ece3] border border-[#e5dfd2] relative overflow-hidden flex flex-col items-center justify-center p-3 mb-5 shadow-inner">
              {/* Particle Orbs in organic floating layout */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { x: '18%', y: '25%', size: 'w-2 h-2', bg: 'bg-[#19C37D]', delay: '0s' },
                  { x: '35%', y: '15%', size: 'w-3 h-3', bg: 'bg-[#19C37D]/80', delay: '0.4s' },
                  { x: '72%', y: '28%', size: 'w-2.5 h-2.5', bg: 'bg-[#132A22]/50', delay: '0.8s' },
                  { x: '82%', y: '65%', size: 'w-3.5 h-3.5', bg: 'bg-[#19C37D]', delay: '1.2s' },
                  { x: '65%', y: '78%', size: 'w-2 h-2', bg: 'bg-[#132A22]/60', delay: '0.2s' },
                  { x: '24%', y: '72%', size: 'w-3 h-3', bg: 'bg-[#19C37D]/70', delay: '0.6s' },
                  { x: '12%', y: '52%', size: 'w-2.5 h-2.5', bg: 'bg-[#132A22]/40', delay: '1.0s' },
                  { x: '50%', y: '82%', size: 'w-2 h-2', bg: 'bg-[#19C37D]', delay: '1.4s' },
                ].map((pt, i) => (
                  <div
                    key={i}
                    className={`absolute rounded-full ${pt.size} ${pt.bg} shadow-sm transition-all duration-500 ease-out`}
                    style={{
                      left: pt.x,
                      top: pt.y,
                      transform: particlesHovered
                        ? `translate(${(i % 2 === 0 ? 1 : -1) * 14}px, ${(i % 3 === 0 ? -1 : 1) * 14}px) scale(1.2)`
                        : 'translate(0, 0)',
                    }}
                  />
                ))}
              </div>

              {/* Title Simulation in Center */}
              <div className="relative z-10 px-4 py-2 rounded-xl bg-white/90 border border-[#e5dfd2] backdrop-blur-md shadow-md text-center">
                <span className="text-xs font-black tracking-tight text-[#132A22]">
                  TEMKA <span className="text-[#19C37D]">PARTICLES</span>
                </span>
                <span className="block text-[9px] font-mono font-bold text-[#78716c] mt-0.5">
                  {particlesHovered ? 'Курсор рассеивает частицы' : 'Наведите для отклика'}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h4 className="font-black text-[#132A22] text-lg tracking-tight">
              Заголовок из частиц
            </h4>
            <p className="text-xs text-[#57534e] mt-2 leading-relaxed font-medium">
              Заголовок сайта из сотен частиц, которые мягко разлетаются от курсора мыши и пальца на экране.
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#78716c]">
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">Zero Block</span>
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">+35% внимания</span>
              <span className="px-2 py-0.5 rounded-md bg-[#DFF8EB] text-[#132A22]">60 FPS</span>
            </div>
          </div>

          {/* Bottom Voting Button */}
          <div className="mt-6 pt-4 border-t border-[#ede9df] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#19C37D]">
              Кандидат №2
            </span>

            <button
              type="button"
              onClick={(e) => handleVote('particles', e)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                userVoted.particles
                  ? 'bg-[#19C37D] text-[#132A22] font-black'
                  : 'bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22]'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span>{userVoted.particles ? 'Голос учтен' : 'Хочу виджет'}</span>
              <span className="font-mono text-[11px] opacity-90 font-black">
                ({votes.particles})
              </span>
            </button>
          </div>
        </div>

        {/* CARD 2: ГОЛОГРАФИЧЕСКИЙ ТАЙМЕР (Кандидат №3) */}
        <div className="soft-3d-card p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl transition-all group select-none">
          <div>
            {/* Top row: Icon + Status badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#DFF8EB]/70 border border-[#19C37D]/25 flex items-center justify-center text-[#19C37D] shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/20">
                  №3
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ede9df] text-[#57534e]">
                  Скоро
                </span>
              </div>
            </div>

            {/* LIVE VISUAL PREVIEW: 3D HOLOGRAPHIC TIMER */}
            <div className="h-40 rounded-2xl bg-gradient-to-b from-[#132A22] to-[#1a382d] border border-[#19C37D]/30 relative overflow-hidden flex flex-col items-center justify-center p-3 mb-5 shadow-inner text-[#F0EBE9]">
              {/* Soft mint ambient glow behind */}
              <div className="absolute w-28 h-28 rounded-full bg-[#19C37D]/20 blur-2xl pointer-events-none" />

              <span className="text-[9px] font-mono uppercase tracking-widest text-[#19C37D] font-black mb-2 relative z-10">
                Live 3D Countdown
              </span>

              {/* Three 3D Digits Tiles */}
              <div className="flex items-center gap-1.5 relative z-10">
                <div className="w-10 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
                  <span className="text-base font-black font-mono leading-none text-[#F0EBE9]">04</span>
                  <span className="text-[7px] font-bold text-[#19C37D] uppercase mt-0.5">ч</span>
                </div>
                <span className="text-sm font-bold text-[#19C37D] animate-pulse">:</span>
                <div className="w-10 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
                  <span className="text-base font-black font-mono leading-none text-[#F0EBE9]">{String(minutes).padStart(2, '0')}</span>
                  <span className="text-[7px] font-bold text-[#19C37D] uppercase mt-0.5">м</span>
                </div>
                <span className="text-sm font-bold text-[#19C37D] animate-pulse">:</span>
                <div className="w-10 h-12 rounded-xl bg-[#19C37D]/20 border border-[#19C37D]/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
                  <span className="text-base font-black font-mono leading-none text-[#19C37D]">{String(seconds).padStart(2, '0')}</span>
                  <span className="text-[7px] font-bold text-[#19C37D] uppercase mt-0.5">с</span>
                </div>
              </div>

              <span className="text-[9px] text-[#DFF8EB]/70 font-mono mt-2.5 relative z-10">
                Парящие стеклянные блоки
              </span>
            </div>

            {/* Title & Description */}
            <h4 className="font-black text-[#132A22] text-lg tracking-tight">
              Голографический таймер
            </h4>
            <p className="text-xs text-[#57534e] mt-2 leading-relaxed font-medium">
              Объемный 3D таймер обратного отсчета до старта события, вебинара или распродажи с парящими цифрами.
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#78716c]">
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">Блок T123</span>
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">x1.8 конверсия</span>
              <span className="px-2 py-0.5 rounded-md bg-[#DFF8EB] text-[#132A22]">Авто-рестарт</span>
            </div>
          </div>

          {/* Bottom Voting Button */}
          <div className="mt-6 pt-4 border-t border-[#ede9df] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#19C37D]">
              Кандидат №3
            </span>

            <button
              type="button"
              onClick={(e) => handleVote('timer', e)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                userVoted.timer
                  ? 'bg-[#19C37D] text-[#132A22] font-black'
                  : 'bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22]'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span>{userVoted.timer ? 'Голос учтен' : 'Хочу виджет'}</span>
              <span className="font-mono text-[11px] opacity-90 font-black">
                ({votes.timer})
              </span>
            </button>
          </div>
        </div>

        {/* CARD 3: 3D ВИТРИНА ТОВАРА (Кандидат №4) */}
        <div className="soft-3d-card p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl transition-all group select-none">
          <div>
            {/* Top row: Icon + Status badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#DFF8EB]/70 border border-[#19C37D]/25 flex items-center justify-center text-[#19C37D] shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/20">
                  №4
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ede9df] text-[#57534e]">
                  Скоро
                </span>
              </div>
            </div>

            {/* LIVE VISUAL PREVIEW: 3D PRODUCT PEDESTAL WITH HOVERING LUXURY ITEM */}
            <div className="h-40 rounded-2xl bg-gradient-to-b from-[#fbf9f5] to-[#f0ece3] border border-[#e5dfd2] relative overflow-hidden flex flex-col items-center justify-center p-3 mb-5 shadow-inner">
              {/* Floating 3D Geometric Object */}
              <div className="relative flex flex-col items-center">
                {/* 3D Levitating Cube / Item */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#132A22] via-[#19C37D] to-[#DFF8EB] shadow-[0_12px_24px_rgba(25,195,125,0.4)] flex items-center justify-center text-white border border-white/40 transform -rotate-12 group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-6 h-6 text-[#132A22] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>

                {/* Soft Ambient Floor Shadow */}
                <div className="w-16 h-3 rounded-full bg-[#132A22]/20 blur-[2px] mt-4 transform scale-90 group-hover:scale-75 transition-transform duration-500" />

                {/* Ceramic Stage Disk Base */}
                <div className="w-24 h-4 rounded-full bg-white border border-[#e5dfd2] shadow-sm -mt-2 flex items-center justify-center">
                  <div className="w-18 h-1 rounded-full bg-[#ede9df]" />
                </div>
              </div>

              <span className="text-[9px] font-mono font-bold text-[#78716c] mt-2">
                Вращение на 360° • Отражения
              </span>
            </div>

            {/* Title & Description */}
            <h4 className="font-black text-[#132A22] text-lg tracking-tight">
              3D Витрина товара
            </h4>
            <p className="text-xs text-[#57534e] mt-2 leading-relaxed font-medium">
              Интерактивный подиум товара с динамическим бликом, вращением на 360° и взрыв-схемой компонентов.
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#78716c]">
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">ST300</span>
              <span className="px-2 py-0.5 rounded-md bg-[#eee9de]">Zero Block</span>
              <span className="px-2 py-0.5 rounded-md bg-[#DFF8EB] text-[#132A22]">x2.2 глубина</span>
            </div>
          </div>

          {/* Bottom Voting Button */}
          <div className="mt-6 pt-4 border-t border-[#ede9df] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#19C37D]">
              Кандидат №4
            </span>

            <button
              type="button"
              onClick={(e) => handleVote('pedestal', e)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                userVoted.pedestal
                  ? 'bg-[#19C37D] text-[#132A22] font-black'
                  : 'bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22]'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span>{userVoted.pedestal ? 'Голос учтен' : 'Хочу виджет'}</span>
              <span className="font-mono text-[11px] opacity-90 font-black">
                ({votes.pedestal})
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER CALLOUT: REQUEST CUSTOM 3D EFFECT */}
      <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-[#faf7f2] border border-[#e5dfd2] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#DFF8EB] border border-[#19C37D]/25 flex items-center justify-center text-[#19C37D] shrink-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-black text-[#132A22]">
              Нужен персональный 3D-виджет для вашего проекта?
            </h4>
            <p className="text-xs text-[#78716c] font-medium mt-0.5">
              Соберем кастомный WebGL-блок под ваш дизайн-макет в Тильде за 2-3 дня.
            </p>
          </div>
        </div>

        <a
          href="https://t.me/temka"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Предложить свою идею в Telegram</span>
          <span className="text-xs">→</span>
        </a>
      </div>
    </div>
  );
}

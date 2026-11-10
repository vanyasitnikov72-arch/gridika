import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { type TreeSeason } from '../engine/treeScene';
import { type TimeOfDay } from '../engine/cityScene';
import { type IslandMode } from '../engine/islandScene';

const ISLAND_OPTIONS: { id: IslandMode; label: string; dot: string }[] = [
  { id: 'summer', label: 'Лето', dot: '#2f9fc7' },
  { id: 'winter', label: 'Зима', dot: '#a9c9da' },
  { id: 'volcano', label: 'Вулкан', dot: '#ff5a1f' },
];

const TIME_OPTIONS: { id: TimeOfDay; label: string; dot: string }[] = [
  { id: 'day', label: 'День', dot: '#f2c14e' },
  { id: 'sunset', label: 'Закат', dot: '#f08a4b' },
  { id: 'night', label: 'Ночь', dot: '#3b4a8a' },
];

const SEASON_OPTIONS: { id: TreeSeason; label: string; dot: string }[] = [
  { id: 'spring', label: 'Весна', dot: '#d0507f' },
  { id: 'summer', label: 'Лето', dot: '#8a5ccc' },
  { id: 'autumn', label: 'Осень', dot: '#c8661a' },
];
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

interface ShapeOption {
  id: TargetShapeType;
  label: string;
  desc: string;
  /** Planned shape: shown in the showcase as «Скоро», cannot be selected yet. */
  soon?: boolean;
}

/** Jade wave on the left of the card (viewBox 0 0 460 620, stretched). Also used to clip the 3D canvas. */
const WAVE_PATH = 'M 0,0 L 310,0 C 370,0 430,35 440,110 C 450,175 365,205 325,270 C 290,325 305,385 340,435 C 385,495 440,530 420,580 C 400,620 340,620 280,620 L 0,620 Z';
const WAVE_VIEWBOX = { w: 460, h: 620 };

const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'tree', label: 'Дерево', desc: 'Бонсай' },
  { id: 'city', label: 'Мегаполис', desc: 'Архитектура' },
  { id: 'island', label: 'Остров', desc: 'Горы и море' },
  { id: 'maze', label: 'Сад-лабиринт', desc: 'Изгороди', soon: true },
  { id: 'equalizer', label: 'Эквалайзер', desc: 'Музыка', soon: true },
  { id: 'castle', label: 'Замок', desc: 'Крепость', soon: true },
  { id: 'cake', label: 'Торт', desc: 'Праздник', soon: true },
];

export function QrConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);

  // Clip the 3D canvas along the jade wave, so shadows (and anything else) stop at its edge
  // instead of being drawn over the green shape. Desktop layout only: on narrow screens the
  // wave sits behind the whole card.
  useEffect(() => {
    const el = containerRef.current;
    const wave = waveRef.current;
    if (!el || !wave) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      if (!desktop.matches) {
        el.style.maskImage = '';
        el.style.webkitMaskImage = '';
        return;
      }
      const wr = wave.getBoundingClientRect();
      const cr = el.getBoundingClientRect();
      if (!cr.width || !cr.height) return;
      const sx = wr.width / WAVE_VIEWBOX.w;
      const sy = wr.height / WAVE_VIEWBOX.h;
      const ox = wr.left - cr.left;
      const oy = wr.top - cr.top;
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='${cr.width}' height='${cr.height}'>` +
        `<defs><mask id='m' maskUnits='userSpaceOnUse' x='0' y='0' width='${cr.width}' height='${cr.height}'>` +
        `<rect width='100%' height='100%' fill='white'/>` +
        `<path d='${WAVE_PATH}' fill='black' transform='translate(${ox} ${oy}) scale(${sx} ${sy})'/>` +
        `</mask></defs><rect width='100%' height='100%' fill='black' mask='url(#m)'/></svg>`;
      const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      el.style.maskImage = url;
      el.style.webkitMaskImage = url;
      el.style.maskSize = el.style.webkitMaskSize = '100% 100%';
      el.style.maskRepeat = el.style.webkitMaskRepeat = 'no-repeat';
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    ro.observe(wave);
    desktop.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      desktop.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  const viewerRef = useRef<QrMorphViewer | null>(null);

  const [text, setText] = useState('https://temka.io');
  const [shape, setShape] = useState<TargetShapeType>('tree');
  const [themeId, setThemeId] = useState<string>('velvet-emerald');
  const [season, setSeason] = useState<TreeSeason>('spring');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [islandMode, setIslandMode] = useState<IslandMode>('summer');
  const [currentState, setCurrentState] = useState<'qr' | 'morphed'>('qr');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const currentShapeLabel = SHAPE_OPTIONS.find((s) => s.id === shape)?.label || 'Форма';

  // Initialize 3D Viewer once mounted
  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new QrMorphViewer({
      container: containerRef.current,
      text,
      shape,
      themeId,
      season,
      timeOfDay,
      islandMode,
      onStateChange: (st) => setCurrentState(st),
      onReady: () => {
        runValidation(text, themeId);
      },
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  // Update viewer on configuration changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.updateConfig(text, shape, themeId);
      runValidation(text, themeId);
    }
  }, [text, shape, themeId]);

  useEffect(() => {
    viewerRef.current?.setSeason(season);
  }, [season]);

  useEffect(() => {
    viewerRef.current?.setTimeOfDay(timeOfDay);
  }, [timeOfDay]);

  useEffect(() => {
    viewerRef.current?.setIslandMode(islandMode);
  }, [islandMode]);

  const runValidation = (newText: string, currentThemeId: string) => {
    try {
      const { modules } = generateQrMatrix(newText);
      const th = THEMES[currentThemeId] || THEMES['velvet-emerald'];
      const res = validateQrScan(modules, newText, th.voxelColor, th.bgColor, th.finderColor);
      setValidation(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetQrMode = () => {
    if (viewerRef.current) {
      viewerRef.current.setState('qr');
      setCurrentState('qr');
    }
  };

  const handleSetShapeMode = () => {
    if (viewerRef.current) {
      viewerRef.current.setState('morphed');
      setCurrentState('morphed');
    }
  };


  const handleDownloadPng = () => {
    if (!viewerRef.current) return;
    const dataUrl = viewerRef.current.exportSnapshot();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `temka-fx-qr-${shape}-${Date.now()}.png`;
    a.click();
  };

  const handleOpenEmbedModal = () => {
    const code = generateEmbedCode({
      text,
      shape,
      themeId,
      height: 480,
      showBadge: true,
    });
    setEmbedCode(code);
    setShowModal(true);
  };

  const handleCopyCode = async () => {
    const code = generateEmbedCode({
      text,
      shape,
      themeId,
      height: 480,
      showBadge: true,
    });
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const renderShapeIcon = (shapeId: TargetShapeType) => {
    switch (shapeId) {
      case 'tree':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19v3M8 22h8" />
            <path d="M12 19c-4 0-7-2.5-7-6.5a6 6 0 0 1 1.5-4 5.5 5.5 0 0 1 10.5-2A6 6 0 0 1 19 12.5C19 16.5 16 19 12 19z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      case 'crystal':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3h12l4 6-10 12L2 9z" />
          </svg>
        );
      case 'city':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M5 21V7l8-4v18M19 21v-9l-6-2" />
          </svg>
        );
      case 'pyramid':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 20h20L12 2z" />
            <line x1="12" y1="2" x2="12" y2="20" />
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'maze':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 3v8h6M17 7v10h-6M7 15v6" />
          </svg>
        );
      case 'island':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l5-8 3 4 3-6 7 10z" />
            <path d="M2 21c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0" />
          </svg>
        );
      case 'equalizer':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 20v-6M9 20V8M14 20v-9M19 20V4" />
          </svg>
        );
      case 'castle':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M3 21V8h3v2h3V8h6v2h3V8h3v13z" />
            <path d="M10 21v-5h4v5" />
          </svg>
        );
      case 'cake':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21V13h16v8zM2 21h20M6 13v-3h12v3" />
            <path d="M12 10V6M12 3.5v.01" />
          </svg>
        );
      case 'sphere':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full">
      {/* MASTER CARD (1:1 SOFA CAKE REFERENCE) */}
      <div className="relative w-full rounded-[2.5rem] bg-white border border-[#e8e2d5] shadow-[0_30px_70px_-15px_rgba(85,70,50,0.08),0_0_0_1px_rgba(85,70,50,0.02)] overflow-hidden p-5 sm:p-7 md:p-8">
        
        {/* 1. SEAMLESS ORGANIC JADE WAVE: CONCAVE CRADLE ENVELOPING THE PODIUM */}
        <div className="absolute top-0 left-0 bottom-0 w-full sm:w-[48%] lg:w-[38%] pointer-events-none select-none z-0">
          <svg ref={waveRef} className="w-full h-full filter drop-shadow-[0_16px_36px_rgba(25,195,125,0.25)]" viewBox="0 0 460 620" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="sofaWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d38e" />
                <stop offset="55%" stopColor="#19C37D" />
                <stop offset="100%" stopColor="#132A22" />
              </linearGradient>
            </defs>
            {/* 
              Organic path that starts at top, bulges right (x=440), 
              then smoothly curves INWARD to the left (x=310-330) to cradle and wrap around the circular 3D podium,
              and then curves back OUTWARD to the right (x=420) beneath the podium before closing.
            */}
            <path d={WAVE_PATH} fill="url(#sofaWaveGrad)" />
          </svg>
        </div>

        {/* Top-right subtle mascot dot (Direct element from Sofa Cake reference, clean yellow, no glow) */}
        <div className="absolute top-7 right-7 sm:top-8 sm:right-8 w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-sm pointer-events-none z-20">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 8c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
          </svg>
        </div>

        {/* Master Card 3-Zone Content Layout (3 cols left, 5 cols center, 4 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          
          {/* 1. LEFT ZONE: Brand Typography on Green Wave (lg:col-span-3) */}
          <div className="lg:col-span-3 relative flex flex-col justify-between h-full min-h-[280px] sm:min-h-[340px] p-2 sm:p-3 text-[#132A22] pointer-events-none select-none">
            {/* Minimal outline triangle icon */}
            <div className="w-8 h-8 rounded-xl border border-[#132A22]/40 flex items-center justify-center opacity-90 shadow-sm">
              <svg className="w-4 h-4 fill-none stroke-[#132A22] stroke-2" viewBox="0 0 24 24">
                <path d="M12 2L2 19h20L12 2z" />
              </svg>
            </div>

            {/* Giant Stacked Title (Mirroring 'Sofa cake') */}
            <div className="my-auto py-6 sm:py-8">
              <div className="text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-[0.94] text-[#132A22]">
                Temka <br />
                FX
              </div>
              <div className="text-xs font-bold text-[#132A22]/80 tracking-wide mt-2.5">
                WebGL 3D Studio
              </div>
            </div>

            {/* Outline pill at bottom-left mirroring '@by.illarion' in reference */}
            <div className="inline-flex self-start px-3.5 py-1 rounded-full border border-[#132A22]/40 text-[#132A22] text-[11px] font-bold tracking-tight">
              @temka.fx
            </div>
          </div>

          {/* 2. CENTER ZONE: Expansive 3D Stage (lg:col-span-5, fully cradled by the green curve) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-1 lg:my-0">
            <div className="relative w-full h-[360px] sm:h-[430px] flex flex-col items-center">
              {/* Three.js Canvas: takes all space above the toolbar, nothing is drawn over it */}
              <div ref={containerRef} className="w-full flex-1 min-h-0 cursor-grab active:cursor-grabbing z-10 relative select-none" />

              {/* Toolbar under the stage: mode switcher + tree seasons */}
              <div className="relative z-20 mt-2 flex flex-wrap items-center justify-center gap-2 shrink-0">
              {/* Soft 3D Minimal Seamless Icon Switcher */}
              <div className="relative p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md select-none flex items-center gap-1">
                {/* Seamless Sliding Pill Indicator */}
                <div
                  className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-[#19C37D] shadow-[0_2px_8px_rgba(25,195,125,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${
                    currentState === 'morphed' ? 'translate-x-[32px]' : 'translate-x-0'
                  }`}
                />

                {/* Button 1: QR Mode */}
                <button
                  type="button"
                  onClick={handleSetQrMode}
                  title="Режим сканируемого QR-кода"
                  aria-label="Режим QR-кода"
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 active:scale-90 ${
                    currentState === 'qr' ? 'text-[#132A22]' : 'text-[#78716c] hover:text-[#132A22]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h3M20 14v3" />
                  </svg>
                </button>

                {/* Button 2: 3D Shape Mode */}
                <button
                  type="button"
                  onClick={handleSetShapeMode}
                  title={`Режим 3D фигуры: ${currentShapeLabel}`}
                  aria-label="Режим 3D фигуры"
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 active:scale-90 ${
                    currentState === 'morphed' ? 'text-[#132A22]' : 'text-[#78716c] hover:text-[#132A22]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </button>
              </div>
                {/* Tree seasons (only for the QR Tree shape) */}
                {shape === 'tree' && (
                  <div className="p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-0.5">
                    {SEASON_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSeason(opt.id)}
                        aria-pressed={season === opt.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          season === opt.id ? 'bg-[#132A22] text-white' : 'text-[#57534e] hover:bg-[#f3efe7]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: opt.dot }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Island modes (only for the QR Island shape) */}
                {shape === 'island' && (
                  <div className="p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-0.5">
                    {ISLAND_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setIslandMode(opt.id)}
                        aria-pressed={islandMode === opt.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          islandMode === opt.id ? 'bg-[#132A22] text-white' : 'text-[#57534e] hover:bg-[#f3efe7]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: opt.dot }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* City time of day (only for the QR City shape) */}
                {shape === 'city' && (
                  <div className="p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-0.5">
                    {TIME_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setTimeOfDay(opt.id)}
                        aria-pressed={timeOfDay === opt.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          timeOfDay === opt.id ? 'bg-[#132A22] text-white' : 'text-[#57534e] hover:bg-[#f3efe7]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: opt.dot }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* 3. RIGHT ZONE: High-End Product Catalog (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-3 text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                Витрина
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                3D Морфинг
              </h2>
            </div>

            {/* Table Header: ФОРМА | СПЕЦИФИКАЦИЯ | ВЫБОР (Reference Layout) */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#a8a29e] pt-2 pb-1 border-b border-[#f0ede6]">
              <span>ФОРМА</span>
              <span className="hidden sm:inline">СПЕЦИФИКАЦИЯ</span>
              <span>ВЫБОР</span>
            </div>

            {/* Interactive Shape Rows */}
            <div className="flex flex-col gap-1">
              {SHAPE_OPTIONS.map((opt) => {
                const isSelected = shape === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={opt.soon}
                    title={opt.soon ? 'Скоро' : undefined}
                    onClick={() => {
                      if (opt.soon) return;
                      setShape(opt.id);
                      if (viewerRef.current) {
                        viewerRef.current.setState('morphed');
                        setCurrentState('morphed');
                      }
                    }}
                    className={`group w-full flex items-center justify-between py-1.5 px-3 rounded-2xl transition-all text-left ${
                      opt.soon
                        ? 'text-[#a8a29e] cursor-default'
                        : isSelected
                          ? 'bg-[#DFF8EB]/70 text-[#132A22] font-extrabold shadow-sm ring-1 ring-[#19C37D]/30'
                          : 'text-[#57534e] hover:text-[#132A22] hover:bg-[#faf8f4]'
                    }`}
                  >
                    {/* Shape Name */}
                    <span className="text-xs font-bold tracking-tight">{opt.label}</span>

                    {/* Spec / Description */}
                    <span className="text-[11px] font-mono text-[#a8a29e] hidden sm:inline">
                      {opt.desc}
                    </span>

                    {/* Thumbnail Icon + Plus / Checkmark Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                          isSelected ? 'bg-[#19C37D] text-[#132A22] shadow-sm font-bold' : 'bg-[#eee9de] text-[#78716c]'
                        }`}
                      >
                        {renderShapeIcon(opt.id)}
                      </div>

                      {opt.soon ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#f3efe7] text-[9px] font-black uppercase tracking-wide text-[#a8a29e]">
                          Скоро
                        </span>
                      ) : (
                      <div className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'text-[#19C37D]' : 'text-[#a8a29e] group-hover:text-[#132A22]'
                      }`}>
                        {isSelected ? (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          '+'
                        )}
                      </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* URL input, full width */}
            <div className="pt-2">
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={text}
                  onInput={(e) => setText((e.target as HTMLInputElement).value)}
                  placeholder="https://temka.io"
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-mono font-bold outline-none focus:bg-white focus:border-[#19C37D] transition-all shadow-inner"
                />
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#132A22] text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM DOCK BAR: Arrow CTA & Download PNG (Positioned at bottom-right) */}
        <div className="mt-3 sm:mt-4 flex items-center justify-end gap-2 relative z-10">
          {/* Arrow CTA Button (Get code for Tilda T123) */}
          <button
            onClick={handleOpenEmbedModal}
            title="Получить код для Tilda T123"
            aria-label="Получить код для Tilda"
            className="w-9 h-9 rounded-2xl bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Subtle Dash */}
          <span className="text-[#d8d2c4] select-none text-xs font-light">—</span>

          {/* Download PNG */}
          <button
            onClick={handleDownloadPng}
            title="Скачать PNG снимок"
            aria-label="Скачать PNG снимок"
            className="w-9 h-9 rounded-2xl bg-[#eee9de] hover:bg-[#e4ded2] text-[#132A22] flex items-center justify-center transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>

      </div>

      {/* EMBED CODE SOFT 3D MODAL (Minimalist, Zero Emojis) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-[#e5dfd2] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-[#132A22]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#132A22]">Код для блока T123 в Tilda</h3>
                <p className="text-xs text-[#78716c] mt-0.5 font-medium">
                  Самодостаточный HTML/JS блок с предрасчитанной матрицей.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0EBE9] hover:bg-[#e6dfdc] text-[#132A22] font-bold flex items-center justify-center text-sm shadow-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="w-full max-h-64 overflow-y-auto p-4 rounded-2xl bg-[#132A22] text-[#19C37D] font-mono text-xs leading-relaxed select-all shadow-inner">
                {embedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#19C37D] hover:bg-[#149e64] text-[#132A22] font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#DFF8EB]/50 border border-[#19C37D]/20 text-xs text-[#132A22] flex items-start gap-2.5 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-[#19C37D] text-[#132A22] flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm">
                i
              </div>
              <div>
                <b className="text-[#132A22]">Подсказка:</b> Высоту виджета можно регулировать в первой строчке кода (<code className="text-[#19C37D] font-mono font-bold">height: 480px</code>). Код адаптируется под экраны любых смартфонов.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#F0EBE9] hover:bg-[#e6dfdc] text-[#132A22] text-xs sm:text-sm font-bold border border-[#e5dfd2] transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>{copied ? 'Код скопирован' : 'Скопировать код'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

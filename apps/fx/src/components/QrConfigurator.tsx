import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES, type ThemeConfig } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

interface ShapeOption {
  id: TargetShapeType;
  label: string;
  desc: string;
}

const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'phone', label: 'Смартфон', desc: '3D Монолит' },
  { id: 'crystal', label: 'Кристалл', desc: 'Октаэдр' },
  { id: 'city', label: 'Мегаполис', desc: 'Архитектура' },
  { id: 'pyramid', label: 'Пирамида', desc: 'Геометрия' },
  { id: 'heart', label: 'Сердце', desc: '3D Форма' },
  { id: 'sphere', label: 'Сфера', desc: 'Планета' },
];

export function QrConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<QrMorphViewer | null>(null);

  const [text, setText] = useState('https://temka.io');
  const [shape, setShape] = useState<TargetShapeType>('phone');
  const [themeId, setThemeId] = useState<string>('velvet-emerald');
  const [currentState, setCurrentState] = useState<'qr' | 'morphed'>('qr');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [embedCode, setEmbedCode] = useState('');

  // Initialize 3D Viewer once mounted
  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new QrMorphViewer({
      container: containerRef.current,
      text,
      shape,
      themeId,
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

  const runValidation = (newText: string, currentThemeId: string) => {
    try {
      const { modules } = generateQrMatrix(newText);
      const th = THEMES[currentThemeId] || THEMES['velvet-emerald'];
      const res = validateQrScan(modules, newText, th.voxelColor, th.bgColor);
      setValidation(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleMorph = () => {
    if (viewerRef.current) {
      viewerRef.current.toggleState();
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
      <div className="relative w-full rounded-[2.5rem] bg-white border border-[#e8e2d5] shadow-[0_30px_70px_-15px_rgba(85,70,50,0.08),0_0_0_1px_rgba(85,70,50,0.02)] overflow-hidden p-6 sm:p-10">
        
        {/* 1. SEAMLESS ORGANIC JADE WAVE: CONCAVE CRADLE ENVELOPING THE PODIUM */}
        <div className="absolute top-0 left-0 bottom-0 w-full sm:w-[48%] lg:w-[38%] pointer-events-none select-none z-0">
          <svg className="w-full h-full filter drop-shadow-[0_16px_36px_rgba(30,166,120,0.22)]" viewBox="0 0 460 620" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="sofaWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#24b282" />
                <stop offset="55%" stopColor="#1ea678" />
                <stop offset="100%" stopColor="#179469" />
              </linearGradient>
            </defs>
            {/* 
              Organic path that starts at top, bulges right (x=440), 
              then smoothly curves INWARD to the left (x=310-330) to cradle and wrap around the circular 3D podium,
              and then curves back OUTWARD to the right (x=420) beneath the podium before closing.
            */}
            <path
              d="M 0,0 
                 L 310,0 
                 C 370,0 430,35 440,110 
                 C 450,175 365,205 325,270 
                 C 290,325 305,385 340,435 
                 C 385,495 440,530 420,580 
                 C 400,620 340,620 280,620 
                 L 0,620 
                 Z"
              fill="url(#sofaWaveGrad)"
            />
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
          <div className="lg:col-span-3 relative flex flex-col justify-between h-full min-h-[280px] sm:min-h-[340px] p-2 sm:p-3 text-white pointer-events-none select-none">
            {/* Minimal outline triangle icon */}
            <div className="w-8 h-8 rounded-xl border border-white/50 flex items-center justify-center opacity-90 shadow-sm">
              <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                <path d="M12 2L2 19h20L12 2z" />
              </svg>
            </div>

            {/* Giant Stacked Title (Mirroring 'Sofa cake') */}
            <div className="my-auto py-6 sm:py-8">
              <div className="text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-[0.94] drop-shadow-sm">
                Temka <br />
                FX
              </div>
              <div className="text-xs font-bold text-emerald-100/90 tracking-wide mt-2.5">
                WebGL 3D Studio
              </div>
            </div>

            {/* Floating white pebble at bottom-left */}
            <div className="w-12 h-6 rounded-full bg-white/95 shadow-md transform -rotate-12"></div>
          </div>

          {/* 2. CENTER ZONE: Expansive 3D Stage (lg:col-span-5, fully cradled by the green curve) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-2 lg:my-0">
            <div className="relative w-full h-[380px] sm:h-[430px] flex items-center justify-center">
              {/* Three.js Canvas with generous breathing room on all sides */}
              <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10 relative select-none" />

              {/* Floating Mode Status Pill */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full soft-3d-pill text-[11px] font-bold text-[#1c1917] z-20 pointer-events-none shadow-sm backdrop-blur-sm bg-white/95">
                <span className={`w-2 h-2 rounded-full ${currentState === 'qr' ? 'bg-[#1ea678] animate-pulse' : 'bg-[#ea580c]'}`} />
                <span>{currentState === 'qr' ? 'Режим: QR-код' : `3D: ${SHAPE_OPTIONS.find((s) => s.id === shape)?.label}`}</span>
              </div>
            </div>
          </div>

          {/* 3. RIGHT ZONE: High-End Product Catalog (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-3 text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1ea678]">
                Витрина
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1c1917] tracking-tight leading-[1.05] mt-0.5">
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
                    onClick={() => setShape(opt.id)}
                    className={`group w-full flex items-center justify-between py-2 px-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? 'bg-[#f6f4ee] text-[#1c1917] font-extrabold shadow-sm ring-1 ring-[#e5dfd2]'
                        : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f4]'
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
                          isSelected ? 'bg-[#1ea678] text-white shadow-sm' : 'bg-[#eee9de] text-[#78716c]'
                        }`}
                      >
                        {renderShapeIcon(opt.id)}
                      </div>

                      <div className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'text-[#1ea678]' : 'text-[#a8a29e] group-hover:text-[#1c1917]'
                      }`}>
                        {isSelected ? (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          '+'
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Minimal URL Input & Palette Row */}
            <div className="pt-2 flex items-center gap-2">
              <div className="relative flex-1">
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
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#1c1917] text-xs font-mono font-bold outline-none focus:bg-white focus:border-[#1ea678] transition-all shadow-inner"
                />
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Theme Swatches */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                {Object.values(THEMES).map((th: ThemeConfig) => {
                  const isSelected = themeId === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setThemeId(th.id)}
                      title={th.name}
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-2 border-[#1ea678] scale-110 shadow-sm ring-2 ring-[#1ea678]/25'
                          : 'border-[#e5dfd2] hover:scale-105'
                      }`}
                      style={{ backgroundColor: th.voxelColor }}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM DOCK BAR (Direct 1:1 Mirror of Sofa Cake Dock) */}
        <div className="mt-8 pt-5 border-t border-[#f2ede4] flex flex-wrap items-center justify-between gap-4 relative z-10">
          
          {/* LEFT: SQUIRCLE BUTTONS CONNECTED BY DASHES (Reference Dock) */}
          <div className="flex items-center gap-2">
            {/* Squircle 1: 3D/QR Toggle */}
            <button
              onClick={handleToggleMorph}
              title={currentState === 'qr' ? 'Запустить 3D морфинг' : 'Вернуть QR-код'}
              className="w-9 h-9 rounded-2xl bg-[#eee9de] hover:bg-[#e4ded2] text-[#1c1917] flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </button>

            {/* Subtle Dash */}
            <span className="text-[#d8d2c4] select-none text-xs font-light">—</span>

            {/* Squircle 2: Refresh / Cycle */}
            <button
              onClick={handleToggleMorph}
              title="Переключить анимацию"
              className="w-9 h-9 rounded-2xl bg-[#eee9de] hover:bg-[#e4ded2] text-[#1c1917] flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 11-9-9c2.5 0 4.8 1 6.5 2.7L21 8M21 3v5h-5" />
              </svg>
            </button>

            {/* Subtle Dash */}
            <span className="text-[#d8d2c4] select-none text-xs font-light">—</span>

            {/* Squircle 3: PNG Snapshot */}
            <button
              onClick={handleDownloadPng}
              title="Скачать PNG снимок"
              className="w-9 h-9 rounded-2xl bg-[#eee9de] hover:bg-[#e4ded2] text-[#1c1917] flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          {/* CENTER: FLOATING WHITE PILL DOCK WITH ARROW (Direct Sofa Cake Reference Dock) */}
          <div className="bg-white rounded-full pl-5 pr-2 py-1.5 shadow-[0_10px_28px_rgba(85,70,50,0.1)] border border-[#ede7db] flex items-center gap-3.5">
            {/* Ruler / Dimension Icon */}
            <div className="text-[#78716c] hover:text-[#1c1917] transition-colors" title="Стандарт матрицы">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M2 12h20M7 12v-3M12 12v-3M17 12v-3" />
              </svg>
            </div>

            {/* Palette Icon */}
            <div className="text-[#78716c] hover:text-[#1c1917] transition-colors" title="Тема оформления">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </div>

            {/* QR Scan Status */}
            <div
              className="flex items-center gap-1.5 text-xs font-extrabold text-[#1ea678]"
              title={validation?.isValid ? 'Камера распознает QR-код (WCAG 2.1)' : 'Проверка камеры'}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{validation?.isValid !== false ? '100% QR' : 'Скан...'}</span>
            </div>

            {/* Vertical Divider */}
            <span className="h-5 w-[1px] bg-[#e5dfd2]"></span>

            {/* Dark Squircle CTA Button with Arrow → */}
            <button
              onClick={handleOpenEmbedModal}
              title="Получить код для Tilda T123"
              className="w-9 h-9 rounded-2xl bg-[#201e1c] hover:bg-[#1ea678] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* RIGHT: SQUIRCLE EMBED / SPLIT BUTTON (Reference Dock) */}
          <div className="flex items-center">
            <button
              onClick={handleOpenEmbedModal}
              title="Открыть код для блока T123"
              className="w-9 h-9 rounded-2xl bg-[#eee9de] hover:bg-[#e4ded2] text-[#1c1917] flex items-center justify-center transition-colors shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 3v18" />
              </svg>
            </button>
          </div>

        </div>

      </div>

      {/* EMBED CODE SOFT 3D MODAL (Minimalist, Zero Emojis) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-[#e5dfd2] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-[#1c1917]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#1c1917]">Код для блока T123 в Tilda</h3>
                <p className="text-xs text-[#78716c] mt-0.5 font-medium">
                  Самодостаточный HTML/JS блок с предрасчитанной матрицей.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#f6f4ee] hover:bg-[#eee9de] text-[#1c1917] font-bold flex items-center justify-center text-sm shadow-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="w-full max-h-64 overflow-y-auto p-4 rounded-2xl bg-[#201e1c] text-[#24b282] font-mono text-xs leading-relaxed select-all shadow-inner">
                {embedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#1ea678] hover:bg-[#179469] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#e5dfd2] text-xs text-[#57534e] flex items-start gap-2.5 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-[#1ea678]/15 text-[#1ea678] flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                i
              </div>
              <div>
                <b className="text-[#1c1917]">Подсказка:</b> Высоту виджета можно регулировать в первой строчке кода (<code className="text-[#1ea678] font-mono font-bold">height: 480px</code>). Код адаптируется под экраны любых смартфонов.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#f6f4ee] hover:bg-[#eee9de] text-[#1c1917] text-xs sm:text-sm font-bold border border-[#e5dfd2] transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2.5 rounded-full bg-[#201e1c] hover:bg-[#1ea678] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
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

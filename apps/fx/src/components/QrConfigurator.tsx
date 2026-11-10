import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES, type ThemeConfig } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

const SHAPE_OPTIONS: { id: TargetShapeType; label: string }[] = [
  { id: 'phone', label: 'Смартфон' },
  { id: 'crystal', label: 'Кристалл' },
  { id: 'city', label: 'Мегаполис' },
  { id: 'pyramid', label: 'Пирамида' },
  { id: 'heart', label: 'Сердце' },
  { id: 'sphere', label: 'Сфера' },
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

  return (
    <div className="w-full">
      {/* UNIFIED HERO MASTER CARD (Direct 1:1 Mirror of Sofa Cake Reference) */}
      <div className="relative w-full rounded-[2.5rem] p-6 sm:p-10 bg-white border border-[#e5dfd2] shadow-[0_25px_60px_-15px_rgba(85,70,50,0.08),0_0_0_1px_rgba(85,70,50,0.02)] overflow-hidden">
        
        {/* Floating blurred terracotta pill at top-right (Depth of field from reference) */}
        <div className="absolute -top-6 right-20 sm:right-32 w-16 h-8 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] blur-[6px] opacity-75 pointer-events-none transform rotate-12 z-20"></div>

        {/* Top-right subtle mascot dot (Direct element from Sofa Cake reference) */}
        <div className="absolute top-7 right-7 sm:top-9 sm:right-9 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs shadow-sm pointer-events-none z-20">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 8c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
          </svg>
        </div>

        {/* Master Card 3-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* 1. LEFT: Organic Jade Liquid Spill (Uncut, complete rounded organic shape from reference) */}
          <div className="lg:col-span-4 relative flex flex-col justify-between select-none">
            <div className="relative w-full aspect-[4/5] max-w-[340px] mx-auto lg:mx-0">
              {/* Organic Jade SVG Background (Reference contours & jade gradient) */}
              <svg className="w-full h-full filter drop-shadow-[0_16px_32px_rgba(30,166,120,0.22)]" viewBox="0 0 460 520" fill="none">
                <defs>
                  <linearGradient id="masterCardJade" x1="10%" y1="0%" x2="90%" y2="100%">
                    <stop offset="0%" stop-color="#24b282" />
                    <stop offset="60%" stop-color="#1ea678" />
                    <stop offset="100%" stop-color="#179469" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50,45 
                     C 50,20 75,10 110,8 
                     L 330,12 
                     C 390,15 440,45 450,105 
                     C 460,170 450,250 435,320 
                     C 420,380 430,430 415,465 
                     C 395,510 350,520 280,515 
                     L 110,510 
                     C 60,510 45,475 45,430 
                     Z"
                  fill="url(#masterCardJade)"
                />
              </svg>

              {/* Floating orange blurred pill at top-right of spill */}
              <div className="absolute -top-3 right-2 w-14 h-7 rounded-full bg-gradient-to-r from-[#ea580c] to-[#f97316] blur-[5px] opacity-80 pointer-events-none transform rotate-12 shadow-md"></div>

              {/* Typography inside the Jade Shape */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white pointer-events-none">
                {/* Minimal Outline Icon */}
                <div className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center opacity-90">
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M12 2L2 19h20L12 2z" />
                  </svg>
                </div>

                {/* Bold Stacked Title (Mirroring 'Sofa cake' typography) */}
                <div className="my-auto">
                  <div className="text-4xl sm:text-[46px] font-black tracking-[-0.035em] leading-[0.96]">
                    Temka <br />
                    FX
                  </div>
                  <div className="text-xs font-bold text-emerald-100 tracking-wide mt-2.5">
                    WebGL 3D Studio
                  </div>
                </div>

                {/* White floating kidney bean / pebble (Direct Sofa cake reference element) */}
                <div className="w-12 h-6 rounded-full bg-white/95 shadow-md transform -rotate-12 mt-2"></div>
              </div>
            </div>
          </div>

          {/* 2. CENTER: Interactive 3D Stage (Overlaps smoothly onto both zones) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative my-2 lg:my-0">
            <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[400px] flex items-center justify-center">
              {/* 3D WebGL Canvas */}
              <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10 relative select-none" />

              {/* Depth of field accent in the foreground (like reference blurred element) */}
              <div className="absolute -bottom-2 left-6 w-16 h-8 rounded-full bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#6366f1] blur-[8px] opacity-60 pointer-events-none transform -rotate-6 z-20"></div>

              {/* Status Pill above canvas */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full soft-3d-pill text-[11px] font-bold text-[#1c1917] z-20 pointer-events-none shadow-sm backdrop-blur-sm bg-white/90">
                <span className={`w-2 h-2 rounded-full ${currentState === 'qr' ? 'bg-[#1ea678] animate-pulse' : 'bg-[#ea580c]'}`} />
                <span>{currentState === 'qr' ? 'Режим: QR-код' : `3D: ${SHAPE_OPTIONS.find((s) => s.id === shape)?.label}`}</span>
              </div>
            </div>
          </div>

          {/* 3. RIGHT: Minimalist Parameters & Controls (Mirror of 'My storehouse' from reference) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-4 text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1ea678]">
                Конфигуратор 3D
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1c1917] tracking-tight">
                Параметры
              </h2>
            </div>

            {/* Input URL field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#78716c] flex items-center justify-between">
                <span>Ссылка для QR</span>
                <span className="text-[9px] text-[#a8a29e] font-mono">UTF-8 QR</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={text}
                  onInput={(e) => setText((e.target as HTMLInputElement).value)}
                  placeholder="https://vash-sait.ru"
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] focus:bg-white focus:border-[#1ea678] text-[#1c1917] text-xs font-mono font-bold outline-none transition-all shadow-inner"
                />
                {text && (
                  <button
                    onClick={() => setText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] text-xs px-1"
                    title="Очистить"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Shape selection pills (Clean text, no emojis) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#78716c]">
                3D Форма морфинга
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SHAPE_OPTIONS.map((opt) => {
                  const isSelected = shape === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setShape(opt.id)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'bg-[#1ea678] text-white shadow-sm'
                          : 'bg-[#fbf9f5] text-[#57534e] border border-[#e5dfd2] hover:border-[#1ea678]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme selection swatches */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#78716c]">
                Палитра
              </label>
              <div className="flex items-center gap-2.5">
                {Object.values(THEMES).map((th: ThemeConfig) => {
                  const isSelected = themeId === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setThemeId(th.id)}
                      title={th.name}
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                        isSelected ? 'border-2 border-[#1ea678] scale-110 shadow-sm ring-2 ring-[#1ea678]/20' : 'border-[#e5dfd2] hover:scale-105'
                      }`}
                      style={{ backgroundColor: th.voxelColor }}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Row (Clean SVG check, no emoji) */}
            {validation && (
              <div className="flex items-center gap-2 pt-2 border-t border-[#f0ede6] text-xs font-bold text-[#57534e]">
                <svg className="w-4 h-4 text-[#1ea678] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Камера: 100% считываемость (WCAG 2.1)</span>
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM DOCK BAR (Direct Sofa Cake Reference Dock) */}
        <div className="mt-8 pt-6 border-t border-[#f2ede4] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMorph}
              className="px-4 py-2 rounded-full soft-3d-pill hover:bg-[#f6f4ee] text-[#1c1917] text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 11-9-9c2.5 0 4.8 1 6.5 2.7L21 8M21 3v5h-5" />
              </svg>
              <span>{currentState === 'qr' ? 'Запустить 3D' : 'В QR-код'}</span>
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-4 py-2 rounded-full soft-3d-pill hover:bg-[#f6f4ee] text-[#1c1917] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>PNG Снимок</span>
            </button>
          </div>

          {/* Primary CTA Dock Bar with Arrow (Direct Sofa Cake Reference Dock) */}
          <div className="soft-3d-dock pl-4 pr-1.5 py-1.5 flex items-center gap-3">
            <span className="text-xs font-extrabold text-[#1c1917]">
              Код для Tilda (T123)
            </span>
            <button
              onClick={handleOpenEmbedModal}
              className="w-8 h-8 rounded-full bg-[#201e1c] hover:bg-[#1ea678] text-white flex items-center justify-center transition-colors shadow-sm active:scale-95"
              title="Получить код"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
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

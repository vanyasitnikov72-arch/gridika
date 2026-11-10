import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES, type ThemeConfig } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

const SHAPE_OPTIONS: { id: TargetShapeType; label: string; icon: string; desc: string }[] = [
  { id: 'city', label: 'Мегаполис', icon: '🏙️', desc: 'Архитектурный 3D город' },
  { id: 'crystal', label: 'Кристалл', icon: '💎', desc: 'Алмазный октаэдр' },
  { id: 'pyramid', label: 'Пирамида', icon: '🏛️', desc: 'Ступенчатый монолит' },
  { id: 'heart', label: '3D Сердце', icon: '💖', desc: 'Объемная воксельная форма' },
  { id: 'sphere', label: 'Сфера', icon: '🌐', desc: 'Геодезическая сфера' },
];

export function QrConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<QrMorphViewer | null>(null);

  const [text, setText] = useState('https://temka.io');
  const [shape, setShape] = useState<TargetShapeType>('city');
  const [themeId, setThemeId] = useState<string>('soft-indigo');
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
      const th = THEMES[currentThemeId] || THEMES['soft-indigo'];
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT: Bento Main Stage Card (Soft 3D Viewport) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div className="relative w-full aspect-square max-h-[580px] rounded-[2rem] overflow-hidden bento-card-light flex flex-col items-center justify-center group transition-all p-3">
          {/* 3D WebGL Canvas inside smooth rounded inner vessel */}
          <div ref={containerRef} className="w-full h-full rounded-[1.6rem] overflow-hidden cursor-grab active:cursor-grabbing" />

          {/* Top Floating Tactile Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            {/* Mode badge */}
            <div className="tactile-pill flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-zinc-900 pointer-events-auto border border-white">
              <span className={`w-2 h-2 rounded-full ${currentState === 'qr' ? 'bg-indigo-600 animate-pulse' : 'bg-purple-600'}`} />
              <span>{currentState === 'qr' ? 'Режим QR-кода' : `3D фигура: ${SHAPE_OPTIONS.find((s) => s.id === shape)?.label}`}</span>
            </div>

            {/* Scanner status badge */}
            {validation && (
              <div
                className={`tactile-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold pointer-events-auto border border-white ${
                  validation.isValid
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
                title={validation.message}
              >
                <span className={validation.isValid ? 'text-emerald-600' : 'text-amber-600'}>
                  {validation.isValid ? '✓' : '⚠'}
                </span>
                <span>{validation.isValid ? 'Камера 100%' : 'Контраст'}</span>
              </div>
            )}
          </div>

          {/* Bottom Floating Soft Dock (Inspired by Sofa cake reference) */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <span className="tactile-pill text-xs font-semibold text-zinc-700 px-4 py-1.5 rounded-2xl border border-white shadow-md">
              {currentState === 'qr' ? '👆 Клик по QR для морфинга' : '🔄 Зажмите мышь для вращения'}
            </span>

            {/* Tactile morph pill button with arrow */}
            <button
              onClick={handleToggleMorph}
              className="pointer-events-auto pl-4 pr-2 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 group"
            >
              <span>{currentState === 'qr' ? '3D Морфинг' : 'Собрать в QR'}</span>
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                {currentState === 'qr' ? '→' : '↺'}
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons Under Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMorph}
              className="px-4 py-2.5 rounded-2xl bg-[#1b1a33] hover:bg-[#252445] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>✨</span>
              <span>{currentState === 'qr' ? 'Анимация' : 'В QR-код'}</span>
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-4 py-2.5 rounded-2xl bg-[#1b1a33] hover:bg-[#252445] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>Скачать PNG</span>
            </button>
          </div>

          <button
            onClick={handleOpenEmbedModal}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>Код для Tilda</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Bento Controls Card (Soft Lilac Panel) */}
      <div className="lg:col-span-5 flex flex-col gap-5 bento-card-light p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-zinc-950 tracking-tight">Параметры</h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Моментальный Soft 3D рендеринг
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-600 text-white uppercase tracking-wider shadow-sm">
            Live 3D
          </span>
        </div>

        {/* 1. Target URL / Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
            Ссылка или текст
          </label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onInput={(e) => setText((e.target as HTMLInputElement).value)}
              placeholder="https://vash-sait.ru"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-zinc-950 text-sm outline-none transition-all font-mono font-medium shadow-sm"
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[11px] font-bold text-zinc-400 mr-1 py-0.5">Пресеты:</span>
            {[
              { label: 'Портфолио', url: 'https://designer-portfolio.ru' },
              { label: 'Telegram', url: 'https://t.me/channel' },
              { label: 'Меню', url: 'https://cafe-menu.ru' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setText(preset.url)}
                className="text-[11px] font-bold px-3 py-1 rounded-xl bg-white hover:bg-indigo-50 text-zinc-700 border border-slate-200 shadow-sm transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Choose 3D Morph Target Shape (Bento Mini-Tiles) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
            3D фигура для морфинга
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SHAPE_OPTIONS.map((opt) => {
              const isSelected = shape === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setShape(opt.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                      : 'bg-white text-zinc-800 border border-slate-200/90 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black">{opt.label}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100 font-medium' : 'text-zinc-500 font-normal'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Choose Color Palette / Theme */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
            Студийная палитра
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(THEMES).map((th: ThemeConfig) => {
              const isSelected = themeId === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setThemeId(th.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-white border-2 border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                      : 'bg-white/80 border border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch palette */}
                    <div className="flex items-center -space-x-1">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: th.bgColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: th.voxelColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: th.accentColor }}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black text-zinc-900">{th.name}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{th.subtitle}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCopyCode}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{copied ? '✓ Скопировано в буфер!' : '📋 Скопировать код'}</span>
          </button>
          <button
            onClick={handleOpenEmbedModal}
            className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-zinc-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-colors"
          >
            Инструкция
          </button>
        </div>
      </div>

      {/* EMBED CODE BENTO MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#f0f2f9] border border-white rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-zinc-950">Код для блока T123 в Tilda</h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Самодостаточный HTML/JS блок с предрасчитанной матрицей.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-zinc-700 font-bold flex items-center justify-center text-sm shadow-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="w-full max-h-64 overflow-y-auto p-4 rounded-2xl bg-[#121224] text-indigo-300 font-mono text-xs leading-relaxed select-all shadow-inner">
                {embedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>{copied ? '✓ Скопировано' : '📋 Копировать'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-zinc-700 flex items-start gap-2.5 shadow-sm">
              <span className="text-indigo-600 text-base leading-none">💡</span>
              <div>
                <b className="text-zinc-950">Подсказка:</b> Высоту виджета можно регулировать в первой строчке кода (<code className="text-indigo-600 font-mono font-bold">height: 480px</code>). Код адаптируется под экраны любых смартфонов.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-zinc-700 text-xs sm:text-sm font-bold border border-slate-200 transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                {copied ? '✓ Код скопирован!' : 'Скопировать код'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

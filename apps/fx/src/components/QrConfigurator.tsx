import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES, type ThemeConfig } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

const SHAPE_OPTIONS: { id: TargetShapeType; label: string; icon: string; desc: string }[] = [
  { id: 'city', label: 'Мегаполис', icon: '🏙️', desc: 'Небоскребы с разной высотой и проспектами' },
  { id: 'crystal', label: 'Кристалл', icon: '💎', desc: 'Парящий алмазный октаэдр с гранями' },
  { id: 'pyramid', label: 'Пирамида', icon: '🏛️', desc: 'Ступенчатый монолит с ярусами' },
  { id: 'heart', label: '3D Сердце', icon: '💖', desc: 'Объемное воксельное сердце' },
  { id: 'sphere', label: 'Сфера', icon: '🌐', desc: 'Геодезическая планетарная сфера' },
];

export function QrConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<QrMorphViewer | null>(null);

  const [text, setText] = useState('https://temka.io');
  const [shape, setShape] = useState<TargetShapeType>('city');
  const [themeId, setThemeId] = useState<string>('dark-gold');
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

  // Update viewer on state changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.updateConfig(text, shape, themeId);
      runValidation(text, themeId);
    }
  }, [text, shape, themeId]);

  const runValidation = (newText: string, currentThemeId: string) => {
    try {
      const { modules } = generateQrMatrix(newText);
      const th = THEMES[currentThemeId] || THEMES['dark-gold'];
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: 3D Live Interactive Stage */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="relative w-full aspect-square max-h-[580px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl shadow-indigo-950/30 flex flex-col items-center justify-center group">
          {/* 3D WebGL Canvas container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Floating Badge Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {/* Mode badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-200 pointer-events-auto shadow-md">
              <span className={`w-2 h-2 rounded-full ${currentState === 'qr' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              {currentState === 'qr' ? 'Режим QR-кода' : `3D фигура: ${SHAPE_OPTIONS.find((s) => s.id === shape)?.label}`}
            </div>

            {/* Camera verification status badge */}
            {validation && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md ${
                  validation.isValid
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                }`}
                title={validation.message}
              >
                <span>{validation.isValid ? '✓' : '⚠'}</span>
                <span>{validation.isValid ? 'Камера считывает 100%' : 'Проверьте контраст'}</span>
              </div>
            )}
          </div>

          {/* Bottom Interactive Hint */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800">
              {currentState === 'qr' ? '👆 Кликните по QR для трансформации' : '🔄 Зажмите и вращайте 3D модель'}
            </span>

            <button
              onClick={handleToggleMorph}
              className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              {currentState === 'qr' ? 'Собрать 3D фигуру ➔' : 'Вернуть в QR-код ↺'}
            </button>
          </div>
        </div>

        {/* Action Buttons Under Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMorph}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-medium transition-colors"
            >
              {currentState === 'qr' ? '✨ Анимация взрыва' : '📱 Собрать в QR'}
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>Скачать PNG</span>
            </button>
          </div>

          <button
            onClick={handleOpenEmbedModal}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>Получить код для Tilda</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Customization Controls Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Настройка эффекта</h2>
          <p className="text-sm text-slate-400 mt-1">
            Измените ссылку, фигуру и цвета — превью обновляется мгновенно.
          </p>
        </div>

        {/* 1. Target URL / Text */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Ссылка или текст для QR-кода
          </label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onInput={(e) => setText((e.target as HTMLInputElement).value)}
              placeholder="https://vash-sait.ru"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white text-sm outline-none transition-all font-mono"
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[11px] text-slate-500 mr-1 py-0.5">Примеры:</span>
            {[
              { label: 'Telegram-канал', url: 'https://t.me/durov' },
              { label: 'Сайт портфолио', url: 'https://designer-portfolio.ru' },
              { label: 'Меню ресторана', url: 'https://cafe-menu.ru' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setText(preset.url)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Choose 3D Morph Target Shape */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            3D фигура для трансформации
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SHAPE_OPTIONS.map((opt) => {
              const isSelected = shape === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setShape(opt.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Choose Color Palette / Theme */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Цветовая тема
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(THEMES).map((th: ThemeConfig) => {
              const isSelected = themeId === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setThemeId(th.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch palette */}
                    <div className="flex items-center -space-x-1">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-800"
                        style={{ backgroundColor: th.bgColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-800"
                        style={{ backgroundColor: th.voxelColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-800"
                        style={{ backgroundColor: th.accentColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-slate-800"
                        style={{ backgroundColor: th.finderColor }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{th.name}</span>
                  </div>
                  {isSelected && <span className="text-indigo-400 text-sm">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tilda Step Guide */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
            <span>🚀</span>
            <span>Как вставить на Tilda за 1 минуту:</span>
          </div>
          <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside pl-1">
            <li>Нажмите <b>«Получить код для Tilda»</b> ниже</li>
            <li>В редакторе страницы Tilda добавьте блок <b>T123 (HTML-код)</b></li>
            <li>Вставьте скопированный код и опубликуйте страницу</li>
          </ol>
        </div>

        {/* Bottom CTA */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{copied ? '✓ Скопировано в буфер!' : '📋 Быстро скопировать код'}</span>
          </button>
          <button
            onClick={handleOpenEmbedModal}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors"
          >
            Инструкция
          </button>
        </div>
      </div>

      {/* EMBED CODE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Код для вставки в Tilda / сайт</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Полностью автономный код без сторонних тяжелых библиотек. Работает на любых доменах.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="w-full max-h-64 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs leading-relaxed select-all">
                {embedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{copied ? '✓ Скопировано' : '📋 Копировать'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-amber-400 text-base leading-none">💡</span>
              <div>
                <b className="text-white">Совет для Тильды:</b> Высоту блока можно легко менять прямо в первой строчке кода (<code className="text-indigo-300 font-mono">height: 480px</code>). Код адаптируется под экраны телефонов и планшетов автоматически.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
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

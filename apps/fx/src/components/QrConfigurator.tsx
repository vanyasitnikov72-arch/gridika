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
  const [themeId, setThemeId] = useState<string>('studio-minimal');
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
      const th = THEMES[currentThemeId] || THEMES['studio-minimal'];
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
        particleCount: 40,
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
      {/* LEFT: 3D Stage Viewport */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="relative w-full aspect-square max-h-[580px] rounded-3xl overflow-hidden border border-zinc-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center group transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
          {/* 3D WebGL Canvas */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Top Floating Badge Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {/* Mode badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/90 text-xs font-medium text-zinc-800 pointer-events-auto shadow-sm">
              <span className={`w-2 h-2 rounded-full ${currentState === 'qr' ? 'bg-zinc-900' : 'bg-blue-600'}`} />
              <span>{currentState === 'qr' ? 'Режим QR-кода' : `3D фигура: ${SHAPE_OPTIONS.find((s) => s.id === shape)?.label}`}</span>
            </div>

            {/* Scanner status badge */}
            {validation && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border shadow-sm ${
                  validation.isValid
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50/90 border-amber-200 text-amber-800'
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
            <span className="text-xs font-medium text-zinc-600 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200/80 shadow-sm">
              {currentState === 'qr' ? '👆 Кликните по QR для трансформации' : '🔄 Зажмите мышь для 3D вращения'}
            </span>

            <button
              onClick={handleToggleMorph}
              className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium shadow-sm transition-all active:scale-95"
            >
              {currentState === 'qr' ? 'Собрать 3D фигуру →' : 'Вернуть в QR ↺'}
            </button>
          </div>
        </div>

        {/* Action Buttons Under Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMorph}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm font-medium transition-colors shadow-sm"
            >
              {currentState === 'qr' ? '✨ Анимация' : '📱 В QR-код'}
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>Скачать PNG</span>
            </button>
          </div>

          <button
            onClick={handleOpenEmbedModal}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>Получить код для Tilda</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Settings & Controls Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Настройка эффекта</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Минималистичный 3D-элемент, готовый для вставки на ваш сайт.
          </p>
        </div>

        {/* 1. Target URL / Text */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Ссылка или текст для QR-кода
          </label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onInput={(e) => setText((e.target as HTMLInputElement).value)}
              placeholder="https://vash-sait.ru"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-zinc-900 text-sm outline-none transition-all font-mono"
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[11px] text-zinc-400 mr-1 py-0.5">Примеры:</span>
            {[
              { label: 'Портфолио', url: 'https://designer-portfolio.ru' },
              { label: 'Telegram-канал', url: 'https://t.me/channel' },
              { label: 'Меню ресторана', url: 'https://cafe-menu.ru' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setText(preset.url)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Choose 3D Morph Target Shape */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
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
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                      : 'bg-white border-zinc-200/90 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Choose Color Palette / Theme */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Цветовая палитра
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
                      ? 'bg-zinc-50 border-zinc-950 ring-1 ring-zinc-950'
                      : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch palette */}
                    <div className="flex items-center -space-x-1">
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 shadow-inner"
                        style={{ backgroundColor: th.bgColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 shadow-inner"
                        style={{ backgroundColor: th.voxelColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 shadow-inner"
                        style={{ backgroundColor: th.accentColor }}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-zinc-900">{th.name}</span>
                      <span className="text-[11px] text-zinc-500">{th.subtitle}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tilda Step Guide */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs uppercase tracking-wider">
            <span>🚀</span>
            <span>Установка на сайт:</span>
          </div>
          <ol className="text-xs text-zinc-600 space-y-1 list-decimal list-inside pl-1">
            <li>Скопируйте код кнопкой ниже</li>
            <li>В Tilda добавьте блок <b>T123 (HTML-код)</b></li>
            <li>Вставьте код и опубликуйте страницу</li>
          </ol>
        </div>

        {/* Bottom CTA */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{copied ? '✓ Скопировано в буфер!' : '📋 Скопировать код'}</span>
          </button>
          <button
            onClick={handleOpenEmbedModal}
            className="py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium text-sm transition-colors shadow-sm"
          >
            Инструкция
          </button>
        </div>
      </div>

      {/* EMBED CODE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">Код для вставки в Tilda</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Самодостаточный HTML/JS блок. Работает на любых доменах без сложных настроек.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="w-full max-h-64 overflow-y-auto p-4 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed select-all">
                {embedCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
              >
                <span>{copied ? '✓ Скопировано' : '📋 Копировать'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
              <span className="text-zinc-900 text-base leading-none">💡</span>
              <div>
                <b className="text-zinc-900">Подсказка для Tilda:</b> Высоту блока можно изменить прямо в первой строчке кода (<code className="text-zinc-900 font-mono font-medium">height: 480px</code>). Код адаптируется под экраны смартфонов и планшетов автоматически.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleCopyCode}
                className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium shadow-sm transition-all"
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

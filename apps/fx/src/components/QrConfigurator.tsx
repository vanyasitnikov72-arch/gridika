import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { type TreeSeason } from '../engine/treeScene';
import { type TimeOfDay } from '../engine/cityScene';
import { type IslandMode } from '../engine/islandScene';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import confetti from 'canvas-confetti';

export type ActiveProductType =
  | 'qr-morph'
  | 'holo-card'
  | 'spatial-calc'
  | 'unbox-3d'
  | 'jelly-btn'
  | 'spatial-prism';

const STUDIO_PRODUCTS: Array<{ id: ActiveProductType; label: string; number: string }> = [
  { id: 'qr-morph', label: '3D QR', number: '01' },
  { id: 'holo-card', label: '3D-Визитка', number: '02' },
  { id: 'spatial-calc', label: 'Калькулятор', number: '03' },
  { id: 'unbox-3d', label: 'Анбоксинг', number: '04' },
  { id: 'jelly-btn', label: 'Hero-Кнопка', number: '05' },
  { id: 'spatial-prism', label: 'Before/After', number: '06' },
];

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

interface ShapeOption {
  id: TargetShapeType;
  label: string;
  desc: string;
  soon?: boolean;
}

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

  // Active Studio Product
  const [activeProduct, setActiveProduct] = useState<ActiveProductType>('qr-morph');

  // Clip the 3D canvas along the jade wave
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

  // Product 1: QR Morph State
  const [text, setText] = useState('https://temka.io');
  const [shape, setShape] = useState<TargetShapeType>('tree');
  const [themeId, setThemeId] = useState<string>('velvet-emerald');
  const [season, setSeason] = useState<TreeSeason>('spring');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [islandMode, setIslandMode] = useState<IslandMode>('summer');
  const [currentState, setCurrentState] = useState<'qr' | 'morphed'>('morphed');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const currentShapeLabel = SHAPE_OPTIONS.find((s) => s.id === shape)?.label || 'Форма';

  // Product 2: Holo Card State
  const [cardName, setCardName] = useState('Алексей Ровер');
  const [cardRole, setCardRole] = useState('3D & Web Дизайнер');
  const [cardTelegram, setCardTelegram] = useState('@alex_rover');
  const [cardPhone, setCardPhone] = useState('+7 (999) 000-00-00');
  const [cardTheme, setCardTheme] = useState<'emerald' | 'gold' | 'obsidian'>('emerald');
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // Product 3: Spatial Calc State
  const [calcFloors, setCalcFloors] = useState<number>(3);
  const [calcBasePrice, setCalcBasePrice] = useState<number>(45000);

  // Product 4: Unbox 3D State
  const [unboxTitle, setUnboxTitle] = useState('Temka Premium Drop');
  const [unboxOpen, setUnboxOpen] = useState(false);
  const [unboxStyle, setUnboxStyle] = useState<'emerald' | 'kraft' | 'neon'>('emerald');

  // Product 5: Jelly Button State
  const [jellyText, setJellyText] = useState('Запустить проект');
  const [jellyLink, setJellyLink] = useState('#contact');
  const [jellyRadius, setJellyRadius] = useState<number>(120);
  const [jellyOffset, setJellyOffset] = useState({ x: 0, y: 0 });
  const jellyAreaRef = useRef<HTMLDivElement>(null);

  // Product 6: Spatial Prism State
  const [prismBefore, setPrismBefore] = useState('Черновой бетон');
  const [prismAfter, setPrismAfter] = useState('Премиум 3D Лофт');
  const [prismSide, setPrismSide] = useState<'before' | 'after'>('after');

  // Sync with URL query parameter & custom events from Catalog
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('fx') as ActiveProductType;
      if (p && STUDIO_PRODUCTS.some((sp) => sp.id === p)) {
        setActiveProduct(p);
      }
    } catch {}

    const handleSelectProduct = (e: Event) => {
      const custom = e as CustomEvent<{ productId: ActiveProductType }>;
      if (custom.detail?.productId) {
        setActiveProduct(custom.detail.productId);
      }
    };
    window.addEventListener('fx:select-product', handleSelectProduct);
    return () => {
      window.removeEventListener('fx:select-product', handleSelectProduct);
    };
  }, []);

  const initViewer = () => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      const viewer = new QrMorphViewer({
        container: containerRef.current,
        text,
        shape,
        themeId,
        season,
        timeOfDay,
        islandMode,
        initialState: 'morphed',
        onStateChange: (st) => setCurrentState(st),
        onReady: () => {
          runValidation(text, themeId);
        },
      });

      viewerRef.current = viewer;
    } catch (err) {
      console.warn('Failed to initialize 3D viewer:', err);
    }
  };

  // Initialize 3D Viewer once mounted
  useEffect(() => {
    initViewer();
    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  // When activeProduct switches to qr-morph, ensure viewer is active and sized properly
  useEffect(() => {
    if (activeProduct === 'qr-morph') {
      if (!viewerRef.current) {
        initViewer();
      } else {
        viewerRef.current.handleResize();
      }
    }
  }, [activeProduct]);

  // Update viewer on configuration changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.updateConfig(text, shape, themeId);
      runValidation(text, themeId);
    }
  }, [text, shape, themeId]);

  useEffect(() => {
    if (viewerRef.current && shape === 'tree') {
      viewerRef.current.setSeason(season);
    }
  }, [season, shape]);

  useEffect(() => {
    if (viewerRef.current && shape === 'city') {
      viewerRef.current.setTimeOfDay(timeOfDay);
    }
  }, [timeOfDay, shape]);

  useEffect(() => {
    if (viewerRef.current && shape === 'island') {
      viewerRef.current.setIslandMode(islandMode);
    }
  }, [islandMode, shape]);

  const runValidation = (url: string, theme: string) => {
    try {
      const { modules } = generateQrMatrix(url);
      const th = THEMES[theme] || THEMES['velvet-emerald'];
      const result = validateQrScan(modules, url, th.voxelColor, th.bgColor, th.finderColor);
      setValidation(result);
    } catch (e) {
      console.warn('QR scan validation warning:', e);
    }
  };

  const handleSetQrMode = () => {
    setCurrentState('qr');
    if (viewerRef.current) {
      viewerRef.current.setState('qr');
    }
  };

  const handleSetShapeMode = () => {
    setCurrentState('morphed');
    if (viewerRef.current) {
      viewerRef.current.setState('morphed');
    }
  };

  const handleDownloadPng = () => {
    if (activeProduct === 'qr-morph' && viewerRef.current) {
      const dataUrl = viewerRef.current.exportSnapshot();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `temka-fx-qr-${shape}-${Date.now()}.png`;
      a.click();
    } else {
      handleOpenEmbedModal();
    }
  };

  const getEmbedCodeForProduct = (prod: ActiveProductType): string => {
    switch (prod) {
      case 'qr-morph':
        return generateEmbedCode({
          text,
          shape,
          themeId,
          height: 480,
          showBadge: true,
        });
      case 'holo-card':
        return `<!-- Temka FX: 3D Holographic Card for Tilda T123 -->
<div id="temka-fx-card" style="width:100%;max-width:440px;margin:0 auto;perspective:900px;font-family:system-ui,-apple-system,sans-serif;">
  <div class="fx-card" style="width:100%;height:250px;border-radius:24px;padding:24px;background:linear-gradient(135deg,#132A22 0%,#19C37D 100%);color:#fff;box-shadow:0 20px 48px rgba(19,42,34,0.35);display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.1s ease-out;position:relative;overflow:hidden;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:11px;font-family:monospace;letter-spacing:2px;color:#DFF8EB;font-weight:bold;">TEMKA 3D CARD</span>
      <span style="font-size:10px;font-weight:bold;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:99px;">Tilda T123</span>
    </div>
    <div>
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">${cardName || 'Алексей Ровер'}</div>
      <div style="font-size:13px;color:#DFF8EB;opacity:0.9;margin-top:2px;">${cardRole || '3D & Web Дизайнер'}</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.2);">
      <a href="https://t.me/${(cardTelegram || '@alex_rover').replace('@', '')}" target="_blank" style="padding:6px 14px;border-radius:99px;background:#19C37D;color:#132A22;font-size:12px;font-weight:bold;text-decoration:none;">Telegram</a>
      <a href="tel:${cardPhone || '+79990000000'}" style="padding:6px 14px;border-radius:99px;background:rgba(255,255,255,0.2);color:#fff;font-size:12px;font-weight:bold;text-decoration:none;">Позвонить</a>
    </div>
  </div>
</div>
<script>
(function(){
  var c = document.querySelector('#temka-fx-card .fx-card');
  if(!c) return;
  document.addEventListener('mousemove', function(e){
    var r = c.getBoundingClientRect();
    var x = e.clientX - r.left - r.width/2;
    var y = e.clientY - r.top - r.height/2;
    if(Math.abs(x) < 400 && Math.abs(y) < 400){
      c.style.transform = 'rotateX(' + (-y*0.04) + 'deg) rotateY(' + (x*0.04) + 'deg) scale3d(1.02,1.02,1.02)';
    } else {
      c.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  });
})();
<\/script>`;
      case 'spatial-calc':
        return `<!-- Temka FX: 3D Spatial Calculator for Tilda T123 -->
<div id="temka-fx-calc" style="width:100%;max-width:440px;margin:0 auto;padding:24px;border-radius:24px;background:#fff;border:1px solid #e5dfd2;box-shadow:0 16px 40px rgba(85,70,50,0.08);font-family:system-ui,-apple-system,sans-serif;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
    <span style="font-size:13px;font-weight:bold;color:#132A22;">Объем / Этажи: <b id="fx-step-val">${calcFloors}</b></span>
    <span style="font-size:16px;font-weight:900;color:#19C37D;" id="fx-sum-val">${(calcFloors * calcBasePrice).toLocaleString('ru-RU')} ₽</span>
  </div>
  <input id="fx-range" type="range" min="1" max="5" value="${calcFloors}" style="width:100%;accent-color:#19C37D;cursor:pointer;">
</div>
<script>
(function(){
  var r = document.getElementById('fx-range');
  var sv = document.getElementById('fx-step-val');
  var sm = document.getElementById('fx-sum-val');
  if(!r) return;
  r.addEventListener('input', function(e){
    var v = Number(e.target.value);
    sv.innerText = v;
    var total = v * ${calcBasePrice};
    sm.innerText = total.toLocaleString('ru-RU') + ' ₽';
    var formInput = document.querySelector('input[name="calc_sum"]');
    if(formInput) formInput.value = total;
  });
})();
<\/script>`;
      case 'unbox-3d':
        return `<!-- Temka FX: 3D Unbox Widget for Tilda T123 -->
<div id="temka-fx-unbox" style="width:100%;max-width:440px;margin:0 auto;text-align:center;padding:20px;font-family:system-ui,-apple-system,sans-serif;">
  <div class="fx-unbox-box" style="width:200px;height:120px;margin:0 auto;background:#b45309;border-radius:16px;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,0.15);font-weight:bold;font-size:13px;">
    <span>${unboxTitle || 'Распаковать товар'}</span>
  </div>
</div>`;
      case 'jelly-btn':
        return `<!-- Temka FX: Magnetic Jelly Button for Tilda Zero Block -->
<div style="padding:20px;text-align:center;font-family:system-ui,-apple-system,sans-serif;">
  <a id="temka-jelly-btn" href="${jellyLink || '#contact'}" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:99px;background:#19C37D;color:#132A22;font-weight:900;font-size:14px;text-decoration:none;box-shadow:0 8px 24px rgba(25,195,125,0.4);transition:transform 0.08s ease-out;">
    ${jellyText || 'Запустить проект'} →
  </a>
</div>
<script>
(function(){
  var btn = document.getElementById('temka-jelly-btn');
  if(!btn) return;
  document.addEventListener('mousemove', function(e){
    var r = btn.getBoundingClientRect();
    var cx = r.left + r.width/2;
    var cy = r.top + r.height/2;
    var dx = e.clientX - cx;
    var dy = e.clientY - cy;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 120){
      btn.style.transform = 'translate(' + (dx*0.35) + 'px, ' + (dy*0.35) + 'px)';
    } else {
      btn.style.transform = 'translate(0,0)';
    }
  });
})();
<\/script>`;
      case 'spatial-prism':
        return `<!-- Temka FX: Spatial 3D Before/After for Tilda T123 -->
<div id="temka-fx-prism" style="width:100%;max-width:440px;margin:0 auto;border-radius:24px;padding:24px;background:#132A22;color:#fff;text-align:center;font-family:system-ui,-apple-system,sans-serif;">
  <div style="font-size:18px;font-weight:900;margin-bottom:8px;">${prismAfter || 'Премиум Дизайн'}</div>
  <div style="font-size:12px;color:#DFF8EB;">3D Сравнение До / После</div>
</div>`;
    }
  };

  const handleOpenEmbedModal = () => {
    const code = getEmbedCodeForProduct(activeProduct);
    setEmbedCode(code);
    setShowModal(true);
  };

  const handleCopyCode = async () => {
    const code = getEmbedCodeForProduct(activeProduct);
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
      case 'city':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M6 21V9l6-4v16M12 5l6 4v12" />
          </svg>
        );
      case 'island':
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            <path d="M4 18l5-9 4 5 3-3 4 7" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        );
    }
  };

  // Tilt handler for Holo Card in Center Stage
  const handleCardTilt = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
    setCardTilt({
      rx: -py * 16,
      ry: px * 16,
      gx: ((e.clientX - r.left) / r.width) * 100,
      gy: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  // Magnetic button handler in Center Stage
  const handleMagneticMove = (e: MouseEvent) => {
    const area = jellyAreaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const cx = r.width / 2;
    const cy = r.height / 2;
    const dx = e.clientX - r.left - cx;
    const dy = e.clientY - r.top - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < jellyRadius) {
      setJellyOffset({ x: dx * 0.38, y: dy * 0.38 });
    } else {
      setJellyOffset({ x: 0, y: 0 });
    }
  };

  return (
    <div className="w-full">
      {/* STUDIO FX PRODUCT SWITCHER (Top of Master Studio) */}
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_4px_16px_rgba(85,70,50,0.06)] backdrop-blur-md mb-5 w-fit max-w-full mx-auto overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none transition-all">
        {STUDIO_PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => {
              setActiveProduct(prod.id);
              try {
                const url = new URL(window.location.href);
                url.searchParams.set('fx', prod.id);
                window.history.pushState({}, '', url.toString());
              } catch {}
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer ${
              activeProduct === prod.id
                ? 'bg-[#132A22] text-[#F0EBE9] shadow-md scale-[1.03]'
                : 'text-[#57534e] hover:bg-[#f3efe7] hover:text-[#132A22] active:scale-95'
            }`}
          >
            {prod.label}
          </button>
        ))}
      </div>

      {/* MASTER STUDIO CARD CONTAINER */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative w-full bg-white rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-[0_24px_64px_-16px_rgba(85,70,50,0.08),0_4px_16px_-2px_rgba(85,70,50,0.03),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#e5dfd2] overflow-hidden select-none">
          
          {/* Green Wave Silhouette Background on Left */}
          <div className="absolute inset-y-0 left-0 w-[42%] lg:w-[38%] pointer-events-none select-none z-0">
            <svg
              ref={waveRef}
              viewBox={`0 0 ${WAVE_VIEWBOX.w} ${WAVE_VIEWBOX.h}`}
              preserveAspectRatio="none"
              className="w-full h-full drop-shadow-[0_12px_32px_rgba(25,195,125,0.25)]"
            >
              <defs>
                <linearGradient id="jadeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#19C37D" />
                  <stop offset="65%" stopColor="#15a86b" />
                  <stop offset="100%" stopColor="#132A22" />
                </linearGradient>
              </defs>
              <path d={WAVE_PATH} fill="url(#jadeGradient)" />
            </svg>
          </div>

          {/* Top-right subtle mascot dot */}
          <div className="absolute top-7 right-7 sm:top-8 sm:right-8 w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-sm pointer-events-none z-20">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 8c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
            </svg>
          </div>

          {/* Master Card 3-Zone Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* 1. LEFT ZONE: Brand Typography on Green Wave */}
            <div className="lg:col-span-3 relative flex flex-col justify-between h-full min-h-[280px] sm:min-h-[340px] p-2 sm:p-3 text-[#132A22] pointer-events-none select-none">
              <div className="w-8 h-8 rounded-xl border border-[#132A22]/40 flex items-center justify-center opacity-90 shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-[#132A22] stroke-2" viewBox="0 0 24 24">
                  <path d="M12 2L2 19h20L12 2z" />
                </svg>
              </div>

              <div className="my-auto py-6 sm:py-8">
                <div className="text-4xl sm:text-5xl font-black tracking-[-0.04em] leading-[0.94] text-[#132A22]">
                  Temka <br />
                  FX
                </div>
                <div className="text-xs font-bold text-[#132A22]/80 tracking-wide mt-2.5">
                  WebGL 3D Studio
                </div>
              </div>

              <div className="inline-flex self-start px-3.5 py-1 rounded-full border border-[#132A22]/40 text-[#132A22] text-[11px] font-bold tracking-tight">
                @temka.fx
              </div>
            </div>

            {/* 2. CENTER ZONE: Expansive Stage (Switches depending on activeProduct) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-1 lg:my-0">
              <div className="relative w-full h-[360px] sm:h-[430px] flex flex-col items-center justify-center">

                {/* MODE 01: QR MORPH STAGE (Permanently mounted for persistent Three.js context) */}
                <div
                  className={`w-full h-full flex flex-col items-center transition-all duration-300 ${
                    activeProduct === 'qr-morph'
                      ? 'relative z-10 opacity-100 scale-100 pointer-events-auto'
                      : 'absolute inset-0 opacity-0 scale-95 pointer-events-none -z-10'
                  }`}
                >
                  <div ref={containerRef} className="w-full flex-1 min-h-0 cursor-grab active:cursor-grabbing z-10 relative select-none" />

                  {/* Sub-toolbar under the QR stage */}
                  <div className="relative z-20 mt-2 flex flex-nowrap items-center justify-center gap-2.5 shrink-0 translate-x-5 sm:translate-x-7">
                    <div className="relative w-[68px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center gap-1 shrink-0">
                      <div
                        className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-[#19C37D] shadow-[0_2px_8px_rgba(25,195,125,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none ${
                          currentState === 'morphed' ? 'translate-x-[32px]' : 'translate-x-0'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleSetQrMode}
                        title="Режим QR"
                        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors active:scale-90 cursor-pointer ${
                          currentState === 'qr' ? 'text-[#132A22]' : 'text-[#78716c] hover:text-[#132A22]'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="7" height="7" rx="1.5" />
                          <rect x="14" y="3" width="7" height="7" rx="1.5" />
                          <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleSetShapeMode}
                        title="Режим 3D фигуры"
                        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors active:scale-90 cursor-pointer ${
                          currentState === 'morphed' ? 'text-[#132A22]' : 'text-[#78716c] hover:text-[#132A22]'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      </button>
                    </div>

                    {shape === 'tree' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {SEASON_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSeason(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              season === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {shape === 'island' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {ISLAND_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setIslandMode(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              islandMode === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {shape === 'city' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {TIME_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTimeOfDay(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              timeOfDay === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* MODE 02: 3D-ВИЗИТКА STAGE */}
                {activeProduct === 'holo-card' && (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-4 [perspective:900px] select-none"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={() => setCardTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })}
                  >
                    <div
                      className="w-72 h-44 rounded-2xl p-5 flex flex-col justify-between text-white shadow-2xl transition-transform duration-100 ease-out relative overflow-hidden"
                      style={{
                        background:
                          cardTheme === 'emerald'
                            ? 'linear-gradient(135deg, #132A22 0%, #19C37D 100%)'
                            : cardTheme === 'gold'
                              ? 'linear-gradient(135deg, #1c1917 0%, #b45309 50%, #d97706 100%)'
                              : 'linear-gradient(135deg, #09090b 0%, #27272a 100%)',
                        transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) scale3d(1.03, 1.03, 1.03)`,
                        boxShadow: '0 24px 50px -12px rgba(19, 42, 34, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at ${cardTilt.gx}% ${cardTilt.gy}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                        }}
                      />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="w-8 h-6 rounded-md bg-white/20 border border-white/30 flex items-center justify-center">
                          <div className="w-5 h-3 rounded-sm border border-white/40"></div>
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-[#DFF8EB] font-bold uppercase">
                          3D Holo Card
                        </span>
                      </div>
                      <div className="relative z-10">
                        <div className="text-xl font-black tracking-tight text-white">{cardName || 'Ваше Имя'}</div>
                        <div className="text-xs text-[#DFF8EB]/90 font-medium mt-0.5">{cardRole || 'Специализация'}</div>
                      </div>
                      <div className="flex items-center gap-2 relative z-10 pt-2 border-t border-white/15 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 font-bold">{cardTelegram || '@telegram'}</span>
                        <span className="text-[10px] text-[#DFF8EB] font-bold ml-auto">Tilda T123</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-sm">
                      {(['emerald', 'gold', 'obsidian'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCardTheme(t)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            cardTheme === t ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                          }`}
                        >
                          {t === 'emerald' ? 'Изумруд' : t === 'gold' ? 'Золото' : 'Оникс'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODE 03: ЖИВОЙ 3D-КАЛЬКУЛЯТОР STAGE */}
                {activeProduct === 'spatial-calc' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
                    <div className="w-72 p-5 rounded-2xl bg-white border border-[#e5dfd2] shadow-xl text-center">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#19C37D]">
                        3D Voxel Building
                      </span>
                      <div className="my-4 h-28 flex items-end justify-center gap-2">
                        {Array.from({ length: calcFloors }).map((_, i) => (
                          <div
                            key={i}
                            className="w-12 h-9 rounded-xl bg-[#19C37D] border border-[#149e64] shadow-md flex items-center justify-center text-[#132A22] font-black text-xs animate-in zoom-in-75 duration-200"
                          >
                            Э{i + 1}
                          </div>
                        ))}
                      </div>
                      <div className="text-2xl font-black text-[#132A22] font-mono">
                        {(calcFloors * calcBasePrice).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 04: 3D АНБОКСИНГ STAGE */}
                {activeProduct === 'unbox-3d' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none cursor-pointer" onClick={() => setUnboxOpen(!unboxOpen)}>
                    <div className="relative w-36 h-28 flex items-center justify-center">
                      <div
                        className={`absolute w-16 h-16 rounded-2xl bg-[#19C37D] text-[#132A22] flex items-center justify-center font-black text-xs shadow-2xl transition-all duration-300 ${
                          unboxOpen ? '-translate-y-12 scale-110 opacity-100' : 'translate-y-0 scale-75 opacity-0'
                        }`}
                      >
                        Товар
                      </div>
                      <div
                        className={`w-32 h-8 rounded-t-xl bg-[#d97706] shadow-md transition-all duration-300 ${
                          unboxOpen ? '-translate-y-8 -rotate-12' : 'translate-y-0 rotate-0'
                        }`}
                      />
                      <div className="w-32 h-16 rounded-b-xl bg-[#b45309] shadow-inner flex items-center justify-center text-xs font-bold text-white/90">
                        {unboxTitle}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#78716c] mt-4">
                      {unboxOpen ? 'Кликните, чтобы закрыть коробку' : 'Кликните по упаковке для открытия'}
                    </span>
                  </div>
                )}

                {/* MODE 05: KINETIC HERO-КНОПКА STAGE */}
                {activeProduct === 'jelly-btn' && (
                  <div
                    ref={jellyAreaRef}
                    className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={() => setJellyOffset({ x: 0, y: 0 })}
                  >
                    <div
                      className="px-8 py-4 rounded-full bg-[#19C37D] text-[#132A22] font-black text-sm shadow-[0_12px_32px_rgba(25,195,125,0.45)] border border-white/40 flex items-center gap-2 cursor-pointer transition-transform duration-75 ease-out active:scale-95"
                      style={{
                        transform: `translate(${jellyOffset.x}px, ${jellyOffset.y}px)`,
                      }}
                    >
                      <span>{jellyText}</span>
                      <span>→</span>
                    </div>
                    <span className="text-xs font-bold text-[#a8a29e] mt-4">
                      Притягивается к курсору в радиусе {jellyRadius}px
                    </span>
                  </div>
                )}

                {/* MODE 06: SPATIAL BEFORE / AFTER STAGE */}
                {activeProduct === 'spatial-prism' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
                    <div
                      className="w-64 h-44 rounded-2xl p-5 flex flex-col justify-between shadow-2xl border border-[#e5dfd2] transition-all duration-300"
                      style={{
                        background:
                          prismSide === 'after'
                            ? 'linear-gradient(135deg, #19C37D 0%, #132A22 100%)'
                            : 'linear-gradient(135deg, #78716c 0%, #292524 100%)',
                        color: '#F0EBE9',
                      }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                        <span>{prismSide === 'after' ? 'После (3D)' : 'До ремонта'}</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                      </div>
                      <div className="text-center font-black text-lg">
                        {prismSide === 'after' ? prismAfter : prismBefore}
                      </div>
                      <div className="text-xs text-white/80 font-mono text-center">
                        {prismSide === 'after' ? '✓ Готовый проект под ключ' : '0% завершения'}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 bg-[#eee9de] p-1 rounded-full">
                      <button
                        type="button"
                        onClick={() => setPrismSide('before')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          prismSide === 'before' ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e]'
                        }`}
                      >
                        До
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrismSide('after')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          prismSide === 'after' ? 'bg-[#19C37D] text-[#132A22] font-black shadow-sm' : 'text-[#57534e]'
                        }`}
                      >
                        После (3D)
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* 3. RIGHT ZONE: Dynamic Configuration Controls based on activeProduct */}
            <div className="lg:col-span-4 flex flex-col justify-center gap-3 text-left">
              
              {/* CONTROLS: 01 3D QR */}
              {activeProduct === 'qr-morph' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      3D Морфинг
                    </h2>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#a8a29e] pt-2 pb-1 border-b border-[#f0ede6]">
                    <span>ФОРМА</span>
                    <span className="hidden sm:inline">СПЕЦИФИКАЦИЯ</span>
                    <span>ВЫБОР</span>
                  </div>

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
                            setCurrentState('morphed');
                            if (viewerRef.current) {
                              viewerRef.current.setState('morphed');
                            }
                          }}
                          className={`group w-full flex items-center justify-between py-1.5 px-3 rounded-2xl transition-all text-left ${
                            opt.soon
                              ? 'text-[#a8a29e] cursor-default'
                              : isSelected
                                ? 'bg-[#DFF8EB]/70 text-[#132A22] font-extrabold shadow-sm ring-1 ring-[#19C37D]/30 cursor-pointer'
                                : 'text-[#57534e] hover:text-[#132A22] hover:bg-[#faf8f4] cursor-pointer'
                          }`}
                        >
                          <span className="text-xs font-bold tracking-tight">{opt.label}</span>
                          <span className="text-[11px] font-mono text-[#a8a29e] hidden sm:inline">
                            {opt.desc}
                          </span>
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#132A22] text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTROLS: 02 3D-ВИЗИТКА */}
              {activeProduct === 'holo-card' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      3D-Визитка
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Имя эксперта
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onInput={(e) => setCardName((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Специализация / Роль
                      </label>
                      <input
                        type="text"
                        value={cardRole}
                        onInput={(e) => setCardRole((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Telegram ник
                      </label>
                      <input
                        type="text"
                        value={cardTelegram}
                        onInput={(e) => setCardTelegram((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-mono font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTROLS: 03 3D-КАЛЬКУЛЯТОР */}
              {activeProduct === 'spatial-calc' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      3D-Калькулятор
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#a8a29e]">Количество этажей / шагов:</span>
                        <span className="text-[#19C37D] font-mono font-black">{calcFloors}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={calcFloors}
                        onInput={(e) => setCalcFloors(Number((e.target as HTMLInputElement).value))}
                        className="w-full accent-[#19C37D] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Базовая цена за единицу (₽)
                      </label>
                      <input
                        type="number"
                        value={calcBasePrice}
                        onInput={(e) => setCalcBasePrice(Number((e.target as HTMLInputElement).value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-mono font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTROLS: 04 3D-АНБОКСИНГ */}
              {activeProduct === 'unbox-3d' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      3D-Анбоксинг
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Название товара на упаковке
                      </label>
                      <input
                        type="text"
                        value={unboxTitle}
                        onInput={(e) => setUnboxTitle((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTROLS: 05 HERO-КНОПКА */}
              {activeProduct === 'jelly-btn' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      Hero-Кнопка
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Текст на кнопке
                      </label>
                      <input
                        type="text"
                        value={jellyText}
                        onInput={(e) => setJellyText((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Ссылка действия
                      </label>
                      <input
                        type="text"
                        value={jellyLink}
                        onInput={(e) => setJellyLink((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-mono font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTROLS: 06 BEFORE/AFTER */}
              {activeProduct === 'spatial-prism' && (
                <div className="flex flex-col gap-3 fx-fade-in">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#19C37D]">
                      Витрина
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                      Before / After
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Заголовок «До»
                      </label>
                      <input
                        type="text"
                        value={prismBefore}
                        onInput={(e) => setPrismBefore((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#a8a29e] tracking-wider block mb-1">
                        Заголовок «После»
                      </label>
                      <input
                        type="text"
                        value={prismAfter}
                        onInput={(e) => setPrismAfter((e.target as HTMLInputElement).value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-[#132A22] text-xs font-bold outline-none focus:border-[#19C37D]"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* BOTTOM DOCK BAR: Arrow CTA & Download PNG */}
          <div className="mt-3 sm:mt-4 flex items-center justify-end gap-2.5 relative z-10">
            {/* Arrow CTA Button (Get code for Tilda T123) */}
            <button
              onClick={handleOpenEmbedModal}
              title="Получить код для Tilda T123"
              aria-label="Получить код для Tilda"
              className="w-13 sm:w-14 h-9 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Download PNG or action */}
            <button
              onClick={handleDownloadPng}
              title="Скачать снимок"
              aria-label="Скачать снимок"
              className="w-13 sm:w-14 h-9 rounded-full bg-[#eee9de] hover:bg-[#e4ded2] text-[#132A22] flex items-center justify-center transition-colors shadow-sm active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>

        </div>

        {/* EMBED CODE SOFT 3D MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white border border-[#e5dfd2] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-[#132A22]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#132A22]">Код для блока T123 в Tilda</h3>
                  <p className="text-xs text-[#78716c] mt-0.5 font-medium">
                    Самодостаточный HTML/JS блок. Без сторонних серверов.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F0EBE9] hover:bg-[#e6dfdc] text-[#132A22] font-bold flex items-center justify-center text-sm shadow-sm transition-colors cursor-pointer"
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
                  className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#19C37D] hover:bg-[#149e64] text-[#132A22] font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
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
                  <b className="text-[#132A22]">Инструкция:</b> В редакторе Tilda добавьте блок <b>T123 (HTML-код)</b> и вставьте этот сниппет. Эффект готов к публикации!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

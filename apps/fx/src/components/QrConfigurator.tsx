import { useState, useEffect, useRef } from 'preact/hooks';
import { QrMorphViewer, THEMES } from '../engine/QrMorphViewer';
import { type TargetShapeType } from '../engine/shapes';
import { type TreeSeason } from '../engine/treeScene';
import { type TimeOfDay } from '../engine/cityScene';
import { type IslandMode } from '../engine/islandScene';
import { type GardenMode } from '../engine/mazeScene';
import { type EqMode } from '../engine/equalizerScene';
import { type CakeFlavor } from '../engine/cakeScene';
import { type CastleMode } from '../engine/castleScene';
import { generateQrMatrix } from '../engine/qrMatrix';
import { validateQrScan, type ValidationResult } from '../engine/qrValidator';
import { generateEmbedCode } from '../engine/standaloneGenerator';
import { verifyLicense, normalizeDomain, isValidDomain, loadSavedKey, saveKey, licenseCovers, cardNameOk, LICENSE_ERRORS, type LicensePayload } from '../engine/license';
import { PRODUCTS, productById, applyProductTheme, type ProductId } from '../data/products';
import { ProductPreview } from './ProductPreview';
import { LiquidNav } from './LiquidNav';
import { InstallGuide } from './InstallGuide';
import { codeFileName, downloadCode } from '../engine/codeNotice';
import { readHash, buildHash, guessSite, type PurchaseConfig } from '../engine/purchase';
import { DEMO_KEYS, DEMO_KEY } from '../emails/keyEmail';
import { CardStage, CardPanel, useCardState, visibleContact } from './CardStudio';
import { GiftStage, GiftPanel, useGiftState } from './GiftStudio';
import { generateGiftEmbedCode } from '../engine/giftEmbedGenerator';
import { LogoStage, LogoPanel, useLogoState } from './LogoStudio';
import { DarkStage } from './DarkStage';
import { contentMatches } from '../engine/fingerprint.js';
import { MorphStage, MorphPanel, useMorphState } from './MorphStudio';
import { TimerStage, TimerPanel, useTimerState } from './TimerStudio';
import { generateTimerEmbedCode, timerEmbedHeight } from '../engine/timerEmbedGenerator';
import { generateMorphEmbedCode, morphEmbedHeight } from '../engine/morphEmbedGenerator';
import { generateLogoEmbedCode, LOGO_EMBED_HEIGHT } from '../engine/logoEmbedGenerator';
import { generateCardEmbedCode, logoToDataUrl } from '../engine/cardEmbedGenerator';
import { getCart, addToCart, updateCartItem, removeFromCart, subscribeCart, type CartItem } from '../engine/cartStore';
import { CartModal } from './CartModal';
import { CartFloatingPill } from './CartFloatingPill';
import confetti from 'canvas-confetti';

export type ActiveProductType = ProductId;

const STUDIO_PRODUCTS = PRODUCTS;
/** products with a working studio and site code */
const BUILT: ProductId[] = ['qr-morph', 'qr-card', 'gift-box', 'voxel-logo', 'voxel-morph', 'sale-timer'];

const ISLAND_OPTIONS: { id: IslandMode; label: string; dot: string }[] = [
  { id: 'summer', label: 'Лето', dot: '#2f9fc7' },
  { id: 'winter', label: 'Зима', dot: '#a9c9da' },
  { id: 'volcano', label: 'Вулкан', dot: '#ff5a1f' },
];

const CASTLE_OPTIONS: { id: CastleMode; label: string; dot: string }[] = [
  { id: 'day', label: 'День', dot: '#d8a92a' },
  { id: 'night', label: 'Ночь', dot: '#3b4a8a' },
  { id: 'winter', label: 'Зима', dot: '#a9c9da' },
];

const CAKE_OPTIONS: { id: CakeFlavor; label: string; dot: string }[] = [
  { id: 'chocolate', label: 'Шоколад', dot: '#7a4a2e' },
  { id: 'strawberry', label: 'Клубника', dot: '#e8708e' },
  { id: 'mint', label: 'Мята', dot: '#7fd0b0' },
];

const EQ_OPTIONS: { id: EqMode; label: string; dot: string }[] = [
  { id: 'neon', label: 'Неон', dot: '#a98ae0' },
  { id: 'retro', label: 'Ретро', dot: '#e8c040' },
  { id: 'mono', label: 'Моно', dot: '#9a9aa6' },
];

const GARDEN_OPTIONS: { id: GardenMode; label: string; dot: string }[] = [
  { id: 'day', label: 'День', dot: '#4a9a40' },
  { id: 'evening', label: 'Вечер', dot: '#8a7ab8' },
  { id: 'autumn', label: 'Осень', dot: '#d98a2a' },
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

/** 3D QR wave: the canvas is clipped along it, so it must match the qr-morph product wave */
const WAVE_PATH = productById('qr-morph').wave;
const WAVE_VIEWBOX = { w: 460, h: 620 };

const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'tree', label: 'Дерево', desc: 'Бонсай' },
  { id: 'city', label: 'Мегаполис', desc: 'Архитектура' },
  { id: 'island', label: 'Остров', desc: 'Горы и море' },
  { id: 'maze', label: 'Сад-лабиринт', desc: 'Изгороди' },
  { id: 'equalizer', label: 'Эквалайзер', desc: 'Музыка' },
  { id: 'cake', label: 'Торт', desc: 'Праздник' },
  { id: 'castle', label: 'Замок', desc: 'Крепость' },
];

export function QrConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stageColRef = useRef<HTMLDivElement>(null);

  // Active Studio Product
  const [activeProduct, setActiveProduct] = useState<ActiveProductType>('qr-morph');
  const active = productById(activeProduct);
  const activeProductRef = useRef(activeProduct);
  activeProductRef.current = activeProduct;
  const card = useCardState();
  const gift = useGiftState();
  const logo = useLogoState();
  const morph = useMorphState();
  const timer = useTimerState();

  useEffect(() => applyProductTheme(activeProduct), [activeProduct]);

  const selectProduct = (id: ProductId) => {
    setActiveProduct(id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('fx', id);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

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
  const [text, setText] = useState('https://gridika.ru');
  const [shape, setShape] = useState<TargetShapeType>('tree');
  const [themeId, setThemeId] = useState<string>('velvet-emerald');
  const [season, setSeason] = useState<TreeSeason>('spring');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [islandMode, setIslandMode] = useState<IslandMode>('summer');
  const [gardenMode, setGardenMode] = useState<GardenMode>('day');
  const [eqMode, setEqMode] = useState<EqMode>('neon');
  const [cakeFlavor, setCakeFlavor] = useState<CakeFlavor>('chocolate');
  const [castleMode, setCastleMode] = useState<CastleMode>('day');
  const [currentState, setCurrentState] = useState<'qr' | 'morphed'>('morphed');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'bundle' | 'studio'>('single');
  const [studioSites, setStudioSites] = useState<2 | 3 | 4 | 5>(2);
  const [studioExtraSites, setStudioExtraSites] = useState<string[]>(['', '', '', '']);

  // Every product is sold: the studio is free to try, the code for a site needs a key for that product.
  // No accounts: the key lives in the buyer's email and, for convenience, on this device.
  const [licenseKey, setLicenseKey] = useState('');
  const [license, setLicense] = useState<LicensePayload | null>(null);
  const [licenseError, setLicenseError] = useState('');
  const [siteDomain, setSiteDomain] = useState('');
  useEffect(() => {
    const saved = loadSavedKey();
    if (saved) setLicenseKey(saved);
  }, []);
  useEffect(() => {
    let cancelled = false;
    const key = licenseKey.trim();
    if (!key) {
      setLicense(null);
      setLicenseError('');
      return;
    }
    verifyLicense(key).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setLicense(res.license);
        setLicenseError('');
        saveKey(key);
        if (res.license.d !== '*') setSiteDomain(res.license.d);
      } else {
        setLicense(null);
        setLicenseError(LICENSE_ERRORS[res.reason]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [licenseKey]);
  // ---- the studio settings that travel through payment (see engine/purchase.ts) ----
  const currentConfig = (): Omit<PurchaseConfig, 'site'> => {
    if (activeProduct === 'qr-card') return { p: activeProduct, card: { contact: card.contact, hidden: card.hidden, mode: card.mode, style: card.style } };
    if (activeProduct === 'gift-box') return { p: activeProduct, gift: { settings: gift.settings, mode: gift.mode } };
    if (activeProduct === 'voxel-logo') return { p: activeProduct, logo: logo.data ? { data: logo.data, settings: logo.settings, mode: logo.mode } : undefined };
    if (activeProduct === 'voxel-morph') return { p: activeProduct, morph: morph.data ? { data: morph.data, settings: morph.settings } : undefined };
    if (activeProduct === 'sale-timer') return { p: activeProduct, timer: { settings: timer.settings, mode: timer.mode } };
    return { p: 'qr-morph', qr: { text, shape, themeId, modes: { season, timeOfDay, islandMode, gardenMode, eqMode, cakeFlavor, castleMode } } };
  };
  /** shows saved settings in the studio; with an order item id the studio edits that item live */
  function applyConfig(c: PurchaseConfig, itemId?: string) {
    seenInStudio.current.add(c.p);
    if (itemId) editingItem.current.set(c.p, itemId);
    else editingItem.current.delete(c.p);
    savedSite.current = c.site || '';
    setActiveProduct(c.p as ActiveProductType);
    if (c.qr) {
      setText(c.qr.text);
      setShape(c.qr.shape as TargetShapeType);
      setThemeId(c.qr.themeId);
      const m = c.qr.modes || {};
      if (m.season) setSeason(m.season as TreeSeason);
      if (m.timeOfDay) setTimeOfDay(m.timeOfDay as TimeOfDay);
      if (m.islandMode) setIslandMode(m.islandMode as IslandMode);
      if (m.gardenMode) setGardenMode(m.gardenMode as GardenMode);
      if (m.eqMode) setEqMode(m.eqMode as EqMode);
      if (m.cakeFlavor) setCakeFlavor(m.cakeFlavor as CakeFlavor);
      if (m.castleMode) setCastleMode(m.castleMode as CastleMode);
    }
    if (c.card) {
      card.setContact(c.card.contact);
      card.setHidden(c.card.hidden);
      card.setMode(c.card.mode as any);
      card.setStyle(c.card.style as any);
    }
    if (c.gift) {
      gift.setSettings(c.gift.settings);
      gift.setMode(c.gift.mode as any);
    }
    if (c.logo) logo.restore(c.logo.data, c.logo.settings, c.logo.mode as any);
    if (c.morph) morph.restore(c.morph.data, c.morph.settings);
    if (c.timer) timer.restore(c.timer.settings, c.timer.mode as any);
  }
  // where the block will live: guessed from the link typed in the studio, the buyer confirms it
  const [buySite, setBuySite] = useState('');
  useEffect(() => {
    if (showModal && !license) setBuySite((s) => s || guessSite(currentConfig()));
  }, [showModal, activeProduct]);
  const buyDomain = normalizeDomain(buySite);
  const buyCfg: PurchaseConfig = { ...currentConfig(), site: buyDomain };
  // what the buyer will see after paying, shown with a demo key for example.com
  const demoKey = DEMO_KEYS[activeProduct] ?? (activeProduct === 'qr-card' ? DEMO_KEY : '');
  const previewHref = demoKey ? `/thanks#${buildHash('demo', { ...buyCfg, site: 'example.com' })}` : '';

  const proDomain = license ? (license.d !== '*' ? license.d : normalizeDomain(siteDomain)) : '';
  const covers = licenseCovers(license, activeProduct);
  const proActive = covers && isValidDomain(proDomain);
  const keyProductLabel = !license
    ? ''
    : license.p === 'all' || license.p === 'pro'
      ? 'все эффекты'
      : '«' + (PRODUCTS.find((x) => x.id === license.p)?.label ?? license.p) + '»';
  const currentShapeLabel = SHAPE_OPTIONS.find((s) => s.id === shape)?.label || 'Форма';

  // Arrived from the "thank you" page or the email: #key=GRD1-… in the address.
  // The hash never reaches a server or analytics; we drop it from the address right away.
  const openWithKey = useRef(false);
  const savedSite = useRef('');
  useEffect(() => {
    try {
      const { key, cfg } = readHash(window.location.hash);
      if (!key && !cfg) return;
      if (cfg) applyConfig(cfg);
      if (key) {
        setLicenseKey(key);
        openWithKey.current = true;
      }
      const url = new URL(window.location.href);
      url.hash = 'studio';
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, []);
  useEffect(() => {
    if (!openWithKey.current || !license) return;
    openWithKey.current = false;
    if (license.d === '*' && savedSite.current) setSiteDomain(savedSite.current);
    if (PRODUCTS.some((x) => x.id === license.p && x.ready)) setActiveProduct(license.p as ActiveProductType);
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setShowModal(true), 400);
  }, [license]);

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

    const handleOpenBuyModal = () => {
      const cfg = currentConfig();
      const linked = editingItem.current.get(cfg.p);
      if (!linked || !getCart().some((it) => it.id === linked)) {
        const item = addToCart({ ...cfg, site: buySite });
        editingItem.current.set(cfg.p, item.id);
        seenInStudio.current.add(cfg.p);
      }
      setShowCartModal(true);
    };
    window.addEventListener('fx:open-buy-modal', handleOpenBuyModal);

    return () => {
      window.removeEventListener('fx:select-product', handleSelectProduct);
      window.removeEventListener('fx:open-buy-modal', handleOpenBuyModal);
    };
  }, []);

  // Cart state & reactivity
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart);
  const [showCartModal, setShowCartModal] = useState(false);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  /** product → the order item the studio is editing right now */
  const editingItem = useRef<Map<string, string>>(new Map());
  /** products whose settings the studio has already shown (from the order, a link or by hand) */
  const seenInStudio = useRef<Set<string>>(new Set());
  const orderBadgeRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** the counter on "Получить код" gives a little hop */
  const bumpBadge = () => {
    if (reducedMotion()) return;
    orderBadgeRef.current?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.35)', offset: 0.35 }, { transform: 'scale(0.92)', offset: 0.7 }, { transform: 'scale(1)' }],
      { duration: 480, easing: 'ease-out' },
    );
  };
  /** a small cube flies from "В заказ" into the order button: that is the whole confirmation */
  const flyToOrder = () => {
    const from = cartBtnRef.current?.getBoundingClientRect();
    const to = (orderBadgeRef.current ?? document.getElementById('studio-get-code-btn'))?.getBoundingClientRect();
    if (!from || !to || reducedMotion()) return bumpBadge();
    const cube = document.createElement('span');
    cube.setAttribute('aria-hidden', 'true');
    cube.style.cssText =
      'position:fixed;z-index:60;width:12px;height:12px;border-radius:3px;pointer-events:none;background:var(--vx-accent);box-shadow:0 4px 10px -2px rgba(0,0,0,.35)';
    document.body.appendChild(cube);
    const x0 = from.left + 22, y0 = from.top + from.height / 2 - 6;
    const x1 = to.left + to.width / 2 - 6, y1 = to.top + to.height / 2 - 6;
    const lift = Math.min(70, 30 + Math.abs(x1 - x0) * 0.25);
    const anim = cube.animate(
      [
        { transform: `translate(${x0}px,${y0}px) scale(.6) rotate(0deg)`, opacity: 0 },
        { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - lift}px) scale(1.15) rotate(180deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${x1}px,${y1}px) scale(.5) rotate(360deg)`, opacity: 0.9 },
      ],
      { duration: 620, easing: 'cubic-bezier(.45,0,.25,1)' },
    );
    anim.onfinish = () => {
      cube.remove();
      bumpBadge();
    };
  };

  useEffect(() => {
    return subscribeCart((items) => setCartItems(items));
  }, []);

  const currentCartItem = cartItems.find((it) => it.id === editingItem.current.get(activeProduct));
  const isCurrentInCart = Boolean(currentCartItem);

  /** adds what the studio shows as a new code of the order and keeps editing it */
  const addCurrentAsNew = () => {
    const item = addToCart({ ...currentConfig(), site: buySite });
    editingItem.current.set(activeProduct, item.id);
    seenInStudio.current.add(activeProduct);
    return item;
  };

  const handleToggleCart = () => {
    if (isCurrentInCart && currentCartItem) {
      removeFromCart(currentCartItem.id);
      editingItem.current.delete(activeProduct);
      requestAnimationFrame(bumpBadge);
    } else {
      addCurrentAsNew();
      requestAnimationFrame(flyToOrder);
    }
  };

  // ---- the order mirrors the studio ----
  // The studio edits one order item per product (added here, or opened with «Изменить» / «Ещё такой»):
  // every edit goes straight into that item. After a reload the studio first shows the latest item
  // of the product, so its demo settings never overwrite what the person configured.
  const liveConfig = currentConfig();
  const liveKey = JSON.stringify(liveConfig);
  const liveReady =
    (activeProduct !== 'voxel-logo' || !!logo.data) && (activeProduct !== 'voxel-morph' || !!morph.data) && (activeProduct !== 'sale-timer' || !!timer.data);
  useEffect(() => {
    if (!seenInStudio.current.has(activeProduct)) {
      const mine = cartItems.filter((it) => it.productId === activeProduct);
      if (mine.length) {
        const last = mine[mine.length - 1];
        applyConfig(last.config, last.id);
        return;
      }
    }
    const item = currentCartItem;
    if (!item || !liveReady) return;
    const t = window.setTimeout(() => {
      const { site, ...saved } = item.config;
      if (JSON.stringify(saved) !== liveKey) updateCartItem(item.id, { ...liveConfig, site: site || buySite } as PurchaseConfig);
    }, 250);
    return () => clearTimeout(t);
  }, [liveKey, activeProduct, cartItems, liveReady]);

  /** another code of the same effect: a copy of this item, opened in the studio to be changed */
  const handleDuplicateCartItem = (item: CartItem) => {
    const copy = addToCart(item.config);
    handleEditCartItem(copy);
  };

  const handleEditCartItem = (item: CartItem) => {
    applyConfig(item.config, item.id);
    setShowCartModal(false);
    // bring the studio into view: the edits go straight into the order
    requestAnimationFrame(() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

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
        gardenMode,
        eqMode,
        cakeFlavor,
        castleMode,
        initialState: 'morphed',
        onStateChange: (st) => setCurrentState(st),
        onReady: () => {
          runValidation(text, themeId);
        },
      });

      viewerRef.current = viewer;
      // opened straight on another product (?fx=…): build the scene but do not draw it yet
      if (activeProductRef.current !== 'qr-morph') viewer.setPaused(true);
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
    // the 3D QR keeps its scene but stops drawing while another product is on screen
    viewerRef.current?.setPaused(activeProduct !== 'qr-morph');
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

  useEffect(() => {
    if (viewerRef.current && shape === 'maze') {
      viewerRef.current.setGardenMode(gardenMode);
    }
  }, [gardenMode, shape]);

  useEffect(() => {
    if (viewerRef.current && shape === 'equalizer') {
      viewerRef.current.setEqMode(eqMode);
    }
  }, [eqMode, shape]);

  useEffect(() => {
    if (viewerRef.current && shape === 'cake') {
      viewerRef.current.setCakeFlavor(cakeFlavor);
    }
  }, [cakeFlavor, shape]);

  useEffect(() => {
    if (viewerRef.current && shape === 'castle') {
      viewerRef.current.setCastleMode(castleMode);
    }
  }, [castleMode, shape]);

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
    if (!proActive) {
      handleOpenEmbedModal(); // the picture is a working QR too, so it comes with the key
      return;
    }
    if (activeProduct === 'qr-morph' && viewerRef.current) {
      const dataUrl = viewerRef.current.exportSnapshot();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `gridika-qr-${shape}-${Date.now()}.png`;
      a.click();
    } else if (activeProduct === 'sale-timer' && timer.viewer.current) {
      const a = document.createElement('a');
      a.href = timer.viewer.current.snapshot().toDataURL('image/png');
      a.download = `gridika-timer-${Date.now()}.png`;
      a.click();
    } else if (activeProduct === 'voxel-morph' && morph.viewer.current) {
      const a = document.createElement('a');
      a.href = morph.viewer.current.snapshot().toDataURL('image/png');
      a.download = `gridika-morph-${Date.now()}.png`;
      a.click();
    } else if (activeProduct === 'voxel-logo' && logo.viewer.current) {
      const a = document.createElement('a');
      a.href = logo.viewer.current.snapshot().toDataURL('image/png');
      a.download = `gridika-logo-${Date.now()}.png`;
      a.click();
    } else if (activeProduct === 'gift-box' && gift.viewer.current) {
      const a = document.createElement('a');
      a.href = gift.viewer.current.snapshot().toDataURL('image/png');
      a.download = `gridika-gift-${Date.now()}.png`;
      a.click();
    } else if (activeProduct === 'qr-card' && card.viewer.current) {
      const a = document.createElement('a');
      a.href = card.viewer.current.snapshot().toDataURL('image/png');
      a.download = `gridika-card-${Date.now()}.png`;
      a.click();
    } else {
      handleOpenEmbedModal();
    }
  };

  const getEmbedCodeForProduct = (prod: ActiveProductType): string =>
    !proActive
      ? ''
      : prod === 'qr-morph'
      ? generateEmbedCode({
          text,
          shape,
          themeId,
          height: 480,
          showBadge: true,
          license: { id: license!.id, domain: proDomain },
        })
      : prod === 'qr-card'
        ? generateCardEmbedCode({
            contact: visibleContact(card),
            mode: card.mode,
            style: card.style,
            logo: logoToDataUrl(card.logo),
            license: { id: license!.id, domain: proDomain },
          })
        : prod === 'gift-box'
          ? generateGiftEmbedCode({ settings: gift.settings, mode: gift.mode, license: { id: license!.id, domain: proDomain } })
          : prod === 'voxel-logo' && logo.data
            ? generateLogoEmbedCode({ data: logo.data, mode: logo.mode, license: { id: license!.id, domain: proDomain } })
            : prod === 'voxel-morph' && morph.data
              ? generateMorphEmbedCode({ data: morph.data, license: { id: license!.id, domain: proDomain } })
              : prod === 'sale-timer' && timer.data
                ? generateTimerEmbedCode({ data: timer.data, license: { id: license!.id, domain: proDomain } })
                : '';

  // regenerate the snippet when the license or the domain changes while the window is open
  useEffect(() => {
    if (showModal) setEmbedCode(getEmbedCodeForProduct(activeProduct));
  }, [proActive, proDomain, activeProduct, showModal]);

  const handleOpenEmbedModal = () => {
    const code = getEmbedCodeForProduct(activeProduct);
    setEmbedCode(code);
    setShowModal(true);
  };

  const [downloaded, setDownloaded] = useState(false);
  const handleDownloadCode = () => {
    const code = embedCode || getEmbedCodeForProduct(activeProduct);
    if (!code) return;
    downloadCode(code, codeFileName(activeProduct, proDomain || ''));
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopyCode = async () => {
    const code = embedCode || getEmbedCodeForProduct(activeProduct);
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

  return (
    <div className="w-full">
      {/* MASTER STUDIO CARD CONTAINER */}
      <div className="relative w-full max-w-5xl mx-auto">
        <div ref={cardRef} className="relative w-full bg-white rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-[0_24px_64px_-16px_rgba(85,70,50,0.08),0_4px_16px_-2px_rgba(85,70,50,0.03),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#e5dfd2] overflow-hidden select-none">
          
          {/* 3D logo: dark preview that hugs the wave (desktop) */}
          <DarkStage
            show={activeProduct === 'voxel-logo' && logo.previewBg === 'dark'}
            cardRef={cardRef}
            waveRef={waveRef}
            stageRef={stageColRef}
            wavePath={productById('voxel-logo').wave}
            waveBox={WAVE_VIEWBOX}
          />

          {/* Product wave: colour and outline follow the selected product (desktop) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[38%] pointer-events-none select-none z-0">
            <svg
              ref={waveRef}
              viewBox={`0 0 ${WAVE_VIEWBOX.w} ${WAVE_VIEWBOX.h}`}
              preserveAspectRatio="none"
              className="w-full h-full"
              style={{
                // no shadow over the dark preview: it would draw a dark seam along the wave
                filter: activeProduct === 'voxel-logo' && logo.previewBg === 'dark' ? 'none' : 'drop-shadow(0 10px 16px rgba(19, 42, 34, 0.14))',
              }}
            >
              <defs>
                <linearGradient id="jadeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" style={{ stopColor: 'var(--vx-accent)' }} />
                  <stop offset="65%" style={{ stopColor: 'color-mix(in srgb, var(--vx-accent) 82%, var(--vx-deep))' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--vx-deep)' }} />
                </linearGradient>
              </defs>
              <path
                d={active.wave}
                fill="url(#jadeGradient)"
                style={{ d: `path("${active.wave}")`, transition: 'd 0.55s cubic-bezier(0.65, 0, 0.35, 1)' } as any}
              />
            </svg>
          </div>

          {/* Top-right subtle mascot dot */}
          <div className="absolute top-7 right-7 sm:top-8 sm:right-8 w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-sm pointer-events-none z-20">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 8c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
            </svg>
          </div>

          {/* Master Card 3-Zone Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 lg:h-[560px]">
            
            {/* 1. LEFT ZONE: product navigation on the wave */}
            <div className="lg:col-span-3 relative lg:h-full flex flex-col rounded-[1.75rem] lg:rounded-none p-5 lg:p-2 bg-[linear-gradient(140deg,var(--vx-accent),color-mix(in_srgb,var(--vx-accent)_70%,var(--vx-deep))_70%,var(--vx-deep))] lg:bg-none text-[var(--vx-on)] select-none">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] opacity-75 lg:pt-1">
                <span>Линейка</span>
                <span className="font-mono tracking-normal">{active.number}/{String(PRODUCTS.length).padStart(2, '0')}</span>
              </div>

              <div key={activeProduct} className="mt-4 lg:mt-auto lg:h-[190px] lg:pr-6 flex flex-col justify-end fx-fade-in">
                <div className="text-[2rem] lg:text-[2.4rem] font-black tracking-[-0.02em] leading-[1]">{active.label}</div>
                <p className="text-[13px] font-semibold opacity-80 mt-2.5 leading-snug max-w-[14rem] lg:line-clamp-4">{active.tagline}</p>
              </div>

              <LiquidNav items={STUDIO_PRODUCTS} activeId={activeProduct} onSelect={selectProduct} />
            </div>

            {/* 2. CENTER ZONE: Expansive Stage (Switches depending on activeProduct) */}
            <div ref={stageColRef} className="lg:col-span-5 flex flex-col items-center justify-center relative my-1 lg:my-0">
              <div className="relative w-full h-[360px] sm:h-[430px] lg:h-[520px] flex flex-col items-center justify-center">

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

                    {shape === 'maze' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {GARDEN_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setGardenMode(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              gardenMode === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {shape === 'equalizer' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {EQ_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setEqMode(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              eqMode === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {shape === 'cake' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {CAKE_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCakeFlavor(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              cakeFlavor === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {shape === 'castle' && (
                      <div className="w-[234px] h-9 p-1 rounded-full bg-white/95 border border-[#e5dfd2] shadow-[0_6px_20px_rgba(85,70,50,0.08)] backdrop-blur-md select-none flex items-center justify-between gap-1 shrink-0">
                        {CASTLE_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCastleMode(opt.id)}
                            className={`w-[72px] h-7 flex items-center justify-center gap-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              castleMode === opt.id ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#57534e] hover:bg-[#f3efe7]'
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

                {/* PLANNED PRODUCTS: voxel preview */}
                {/* 02: business card (kept mounted, paused when hidden) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeProduct === 'qr-card' ? 'relative z-10 opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <CardStage state={card} active={activeProduct === 'qr-card'} />
                </div>

                {/* 03: gift box (kept mounted, paused when hidden) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeProduct === 'gift-box' ? 'relative z-10 opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <GiftStage state={gift} active={activeProduct === 'gift-box'} />
                </div>

                {/* 04: voxel logo (kept mounted, paused when hidden) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeProduct === 'voxel-logo' ? 'relative z-10 opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <LogoStage state={logo} active={activeProduct === 'voxel-logo'} />
                </div>

                {/* 05: before / after morph (kept mounted, paused when hidden) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeProduct === 'voxel-morph' ? 'relative z-10 opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <MorphStage state={morph} active={activeProduct === 'voxel-morph'} />
                </div>

                {/* 06: sale countdown (kept mounted, paused when hidden) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    activeProduct === 'sale-timer' ? 'relative z-10 opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <TimerStage state={timer} active={activeProduct === 'sale-timer'} />
                </div>

                {!BUILT.includes(activeProduct) && (
                  <div key={activeProduct} className="w-full h-full flex flex-col items-center justify-center gap-5 fx-fade-in select-none">
                    <div className="w-[70%] max-w-[270px] aspect-square flex items-center justify-center lg:translate-x-12">
                      <ProductPreview id={activeProduct} className="w-full h-full drop-shadow-[0_18px_30px_rgba(19,42,34,0.18)]" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#f3efe7] text-[#78716c] border border-[#e5dfd2]">
                      В разработке
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. RIGHT ZONE: Dynamic Configuration Controls based on activeProduct */}
            <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto overflow-x-hidden lg:-mr-3 lg:pr-3 [scrollbar-width:thin] flex flex-col justify-center [justify-content:safe_center] gap-3 text-left">
              
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

                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide text-[#a8a29e] pt-2 pb-1 px-3 border-b border-[#f0ede6]">
                    <span className="w-[100px] shrink-0">ФОРМА</span>
                    <span className="hidden sm:inline flex-1 min-w-0 truncate">СПЕЦИФИКАЦИЯ</span>
                    <span className="ml-auto shrink-0">ВЫБОР</span>
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
                          className={`group w-full flex items-center gap-2 py-1.5 px-3 rounded-2xl transition-all text-left ${
                            opt.soon
                              ? 'text-[#a8a29e] cursor-default'
                              : isSelected
                                ? 'bg-[#DFF8EB]/70 text-[#132A22] font-extrabold shadow-sm ring-1 ring-[#19C37D]/30 cursor-pointer'
                                : 'text-[#57534e] hover:text-[#132A22] hover:bg-[#faf8f4] cursor-pointer'
                          }`}
                        >
                          {/* fixed-width name column keeps every spec on one vertical line */}
                          <span className="w-[100px] shrink-0 text-xs font-bold tracking-tight truncate">{opt.label}</span>
                          <span className="flex-1 min-w-0 text-[11px] font-mono text-[#a8a29e] hidden sm:inline truncate">
                            {opt.desc}
                          </span>
                          <div className="flex items-center gap-2 ml-auto shrink-0">
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
                        maxLength={300}
                        onInput={(e) => setText((e.target as HTMLInputElement).value)}
                        placeholder="https://gridika.ru"
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

              {/* PLANNED PRODUCTS: what it will be */}
              {activeProduct === 'qr-card' && <CardPanel state={card} />}
              {activeProduct === 'gift-box' && <GiftPanel state={gift} />}
              {activeProduct === 'voxel-logo' && <LogoPanel state={logo} />}
              {activeProduct === 'voxel-morph' && <MorphPanel state={morph} />}
              {activeProduct === 'sale-timer' && <TimerPanel state={timer} />}

              {!BUILT.includes(activeProduct) && (() => {
                const prod = productById(activeProduct);
                return (
                  <div key={prod.id} className="flex flex-col gap-3 fx-fade-in">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--vx-accent)]">
                        Скоро · {prod.number}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black text-[#132A22] tracking-tight leading-[1.05] mt-0.5">
                        {prod.title}
                      </h2>
                      <p className="text-xs text-[#57534e] font-medium leading-relaxed mt-2">{prod.tagline}</p>
                    </div>
                    <ul className="flex flex-col gap-2 mt-1">
                      {prod.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-xs text-[#44403c] leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-[2px] bg-[var(--vx-accent)] shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#a8a29e] mr-1">Режимы</span>
                      {prod.modes.map((m) => (
                        <span key={m} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f3efe7] text-[#57534e]">{m}</span>
                      ))}
                    </div>
                    <div className="mt-2 px-3 py-2.5 rounded-2xl bg-[#fbf9f5] border border-[#ede7db] text-[11px] text-[#78716c] font-medium">
                      Тот же воксельный стиль, что у 3D QR. Встраивание: <span className="font-mono font-bold text-[#132A22]">{prod.tildaBlock}</span>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

          {/* BOTTOM DOCK: Action controls (Add to cart & Checkout) */}
          <div className={`mt-3 sm:mt-4 flex items-center justify-end gap-2.5 sm:gap-3 relative z-10 transition-opacity ${BUILT.includes(activeProduct) ? '' : 'opacity-0 pointer-events-none'}`}>
            
            <style>{`
              .gx-cart { transition: background-color .35s ease, border-color .35s ease, color .35s ease, box-shadow .35s ease, transform .15s ease; }
              .gx-cart .gx-ico, .gx-cart .gx-lbl { transition: opacity .32s cubic-bezier(.16,1,.3,1), transform .42s cubic-bezier(.34,1.56,.64,1); }
              /* icons: plus → check (in the order) → cross (hover: remove) */
              .gx-cart .gx-plus { opacity: 1; transform: rotate(0) scale(1); }
              .gx-cart .gx-check, .gx-cart .gx-x { opacity: 0; transform: rotate(-90deg) scale(.4); }
              .gx-cart[data-on='1'] .gx-plus { opacity: 0; transform: rotate(90deg) scale(.4); }
              .gx-cart[data-on='1'] .gx-check { opacity: 1; transform: rotate(0) scale(1); }
              /* labels slide like a drum */
              .gx-cart .gx-l-add { opacity: 1; transform: translateY(0); }
              .gx-cart .gx-l-in, .gx-cart .gx-l-rm { opacity: 0; transform: translateY(110%); }
              .gx-cart[data-on='1'] .gx-l-add { opacity: 0; transform: translateY(-110%); }
              .gx-cart[data-on='1'] .gx-l-in { opacity: 1; transform: translateY(0); }
              @media (hover: hover) {
                .gx-cart[data-on='1']:hover .gx-check { opacity: 0; transform: rotate(90deg) scale(.4); }
                .gx-cart[data-on='1']:hover .gx-x { opacity: 1; transform: rotate(0) scale(1); }
                .gx-cart[data-on='1']:hover .gx-l-in { opacity: 0; transform: translateY(-110%); }
                .gx-cart[data-on='1']:hover .gx-l-rm { opacity: 1; transform: translateY(0); }
              }
              .gx-cart .gx-dot { transition: background-color .35s ease; }
              @media (prefers-reduced-motion: reduce) { .gx-cart, .gx-cart .gx-ico, .gx-cart .gx-lbl { transition: none; } }
            `}</style>

            {/* add to the order / in the order / remove — one button, no pop-ups */}
            <button
              ref={cartBtnRef}
              type="button"
              onClick={handleToggleCart}
              data-on={isCurrentInCart ? '1' : '0'}
              aria-pressed={isCurrentInCart}
              aria-label={isCurrentInCart ? 'В заказе — убрать из заказа' : 'Добавить в заказ'}
              className={`gx-cart group relative h-10 w-[128px] pl-1.5 pr-3 rounded-full inline-flex items-center gap-2 text-[13px] font-black cursor-pointer select-none shrink-0 active:scale-[0.96] border ${
                isCurrentInCart
                  ? 'bg-[var(--vx-soft)] border-[color-mix(in_srgb,var(--vx-accent)_55%,transparent)] text-[#132A22] [@media(hover:hover)]:hover:bg-[#fdf1f3] [@media(hover:hover)]:hover:border-[#f3c4cd] [@media(hover:hover)]:hover:text-[#a3263f]'
                  : 'bg-white border-[#e5dfd2] text-[#132A22] hover:border-[color-mix(in_srgb,var(--vx-accent)_55%,#e5dfd2)] hover:shadow-[0_6px_16px_-10px_rgba(19,42,34,0.45)]'
              }`}
            >
              <span
                className={`gx-dot relative w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                  isCurrentInCart ? 'bg-[var(--vx-accent)] text-[var(--vx-on)] [@media(hover:hover)]:group-hover:bg-[#e9677f] [@media(hover:hover)]:group-hover:text-white' : 'bg-[var(--vx-soft)] text-[var(--vx-deep)]'
                }`}
                aria-hidden="true"
              >
                <svg className="gx-ico gx-plus absolute w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 2.5v9M2.5 7h9" /></svg>
                <svg className="gx-ico gx-check absolute w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 7.4 5.7 10.2 11.2 4" /></svg>
                <svg className="gx-ico gx-x absolute w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 3l6 6M9 3l-6 6" /></svg>
              </span>
              <span className="relative flex-1 h-5 overflow-hidden text-left" aria-hidden="true">
                <span className="gx-lbl gx-l-add absolute inset-0 whitespace-nowrap leading-5">В заказ</span>
                <span className="gx-lbl gx-l-in absolute inset-0 whitespace-nowrap leading-5">В заказе</span>
                <span className="gx-lbl gx-l-rm absolute inset-0 whitespace-nowrap leading-5">Убрать</span>
              </span>
            </button>

            {/* Main action: Получить код (the counter shows how many effects are in the order) */}
            <button
              type="button"
              id="studio-get-code-btn"
              onClick={() => {
                if (!isCurrentInCart) addCurrentAsNew();
                setShowCartModal(true);
              }}
              className="relative h-10 pl-4 sm:pl-5 pr-1.5 rounded-full bg-[#132A22] hover:bg-[#1d3a2f] text-[#F0EBE9] text-[13px] sm:text-[13.5px] font-extrabold inline-flex items-center gap-2.5 sm:gap-3 whitespace-nowrap transition-colors shadow-md active:scale-[0.97] cursor-pointer shrink-0"
            >
              <span className="whitespace-nowrap">Получить код</span>
              <span className="relative w-7 h-7 rounded-full bg-[var(--vx-accent)] text-[var(--vx-on)] flex items-center justify-center shadow-sm shrink-0" aria-hidden="true">
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span
                  ref={orderBadgeRef}
                  className={`absolute -top-2 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#132A22] text-[10.5px] font-black leading-[18px] text-center shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[opacity,transform] duration-300 ${
                    cartItems.length ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                >
                  {cartItems.length || ''}
                </span>
              </span>
              <span className="sr-only">{cartItems.length ? `, в заказе ${cartItems.length}` : ''}</span>
            </button>
          </div>

        </div>

        {/* EMBED CODE SOFT 3D MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white border border-[#e5dfd2] rounded-[2.5rem] p-6 sm:p-7 shadow-2xl flex flex-col gap-4 text-[#132A22] [scrollbar-width:thin]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#132A22]">Код для сайта</h3>
                  <p className="text-xs text-[#78716c] mt-0.5 font-medium">
                    Tilda, WordPress, Webflow, Wix или обычный HTML. Работает без нашего сервера.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F0EBE9] hover:bg-[#e6dfdc] text-[#132A22] font-bold flex items-center justify-center text-sm shadow-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* KEY: the code for a site is issued only for a key that covers this product */}
              <div className="rounded-2xl border border-[#e5dfd2] bg-[#fbf9f5] p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] font-black text-[#132A22]">
                    {proActive
                      ? `Ключ ${license!.id} · ${keyProductLabel}`
                      : selectedPlan === 'single'
                        ? `Тариф «${productById(activeProduct).title}»`
                        : selectedPlan === 'bundle'
                          ? 'Тариф «Все 8 эффектов»'
                          : `Тариф «Studio Master» (${studioSites} ${studioSites === 5 ? 'сайтов' : 'сайта'})`}
                  </div>
                  {license ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLicenseKey('');
                        setSiteDomain('');
                        saveKey('');
                      }}
                      className="text-[11px] font-bold text-[#a8a29e] hover:text-[#132A22] cursor-pointer"
                    >
                      Другой ключ
                    </button>
                  ) : null}
                </div>

                {!license && (
                  <>
                    <div className="rounded-2xl bg-white border border-[#ebe5da] p-4 flex flex-col gap-3 shadow-sm">
                      {/* Plan Selection Tabs */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a8a29e]">Тариф лицензии</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          
                          {/* Option 1: Single */}
                          <button
                            type="button"
                            onClick={() => setSelectedPlan('single')}
                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                              selectedPlan === 'single'
                                ? 'border-[#19C37D] bg-[#DFF8EB]/40 shadow-sm ring-1 ring-[#19C37D]'
                                : 'border-[#ebe5da] bg-[#faf8f5] hover:bg-white text-[#57534e]'
                            }`}
                          >
                            <div>
                              <div className="text-[11.5px] font-black text-[#132A22] leading-tight truncate">
                                {productById(activeProduct).title}
                              </div>
                              <div className="text-[10px] text-[#78716c] font-semibold mt-0.5">
                                Этот эффект · 1 сайт
                              </div>
                            </div>
                            <div className="mt-2 text-[15px] font-black text-[#132A22]">1 490 ₽</div>
                          </button>

                          {/* Option 2: Bundle */}
                          <button
                            type="button"
                            onClick={() => setSelectedPlan('bundle')}
                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                              selectedPlan === 'bundle'
                                ? 'border-[#19C37D] bg-[#DFF8EB]/40 shadow-sm ring-1 ring-[#19C37D]'
                                : 'border-[#ebe5da] bg-[#faf8f5] hover:bg-white text-[#57534e]'
                            }`}
                          >
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#19C37D] text-[#132A22] text-[9px] font-black uppercase">
                              ХИТ
                            </span>
                            <div>
                              <div className="text-[11.5px] font-black text-[#132A22]">Все 8 эффектов</div>
                              <div className="text-[10px] text-[#78716c] font-semibold mt-0.5">1 сайт · навсегда</div>
                            </div>
                            <div className="mt-2 text-[15px] font-black text-[#132A22]">3 990 ₽</div>
                          </button>

                          {/* Option 3: Studio */}
                          <button
                            type="button"
                            onClick={() => setSelectedPlan('studio')}
                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                              selectedPlan === 'studio'
                                ? 'border-[#132A22] bg-[#132A22] text-white shadow-sm ring-1 ring-[#132A22]'
                                : 'border-[#ebe5da] bg-[#faf8f5] hover:bg-white text-[#57534e]'
                            }`}
                          >
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-[var(--vx-accent)] text-[#132A22] text-[9px] font-black uppercase">
                              СТУДИЯ
                            </span>
                            <div>
                              <div className={`text-[11.5px] font-black ${selectedPlan === 'studio' ? 'text-white' : 'text-[#132A22]'}`}>Studio Master</div>
                              <div className={`text-[10px] font-semibold mt-0.5 ${selectedPlan === 'studio' ? 'text-white/70' : 'text-[#78716c]'}`}>
                                2–5 сайтов + будущее
                              </div>
                            </div>
                            <div className={`mt-2 text-[15px] font-black ${selectedPlan === 'studio' ? 'text-[var(--vx-accent)]' : 'text-[#132A22]'}`}>
                              от 6 990 ₽
                            </div>
                          </button>

                        </div>
                      </div>

                      {/* Studio Sites Sub-switcher */}
                      {selectedPlan === 'studio' && (
                        <div className="rounded-xl bg-[#f5f2eb] p-2.5 flex flex-col gap-1.5 border border-[#ebe5da]">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#57534e]">
                            <span>Количество сайтов в ключе:</span>
                            <span className="font-mono font-black text-[#132A22]">
                              {studioSites === 2 && '6 990 ₽ (~3 495 ₽/сайт)'}
                              {studioSites === 3 && '8 990 ₽ (~2 996 ₽/сайт)'}
                              {studioSites === 4 && '10 990 ₽ (~2 748 ₽/сайт)'}
                              {studioSites === 5 && '12 990 ₽ (~2 598 ₽/сайт)'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[2, 3, 4, 5].map((cnt) => (
                              <button
                                key={cnt}
                                type="button"
                                onClick={() => setStudioSites(cnt as 2 | 3 | 4 | 5)}
                                className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                                  studioSites === cnt
                                    ? 'bg-[#132A22] text-[var(--vx-accent)] shadow-sm'
                                    : 'bg-white hover:bg-[#eae4d8] text-[#57534e]'
                                }`}
                              >
                                {cnt} {cnt === 5 ? 'сайтов' : 'сайта'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <label className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a8a29e]" htmlFor="buy-site">
                        {selectedPlan === 'studio'
                          ? `Сайт первого проекта (из ${studioSites})`
                          : 'Сайт, где будет стоять блок'}
                      </label>
                      <input
                        id="buy-site"
                        type="text"
                        maxLength={80}
                        value={buySite}
                        onInput={(e) => setBuySite((e.target as HTMLInputElement).value)}
                        placeholder={selectedPlan === 'studio' ? 'первый-проект.ru' : 'ваш-сайт.ru'}
                        spellcheck={false}
                        autoComplete="off"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-sm font-mono font-bold text-[#132A22] outline-none focus:bg-white focus:border-[var(--vx-accent)]"
                      />

                      {/* If Studio Master: optional fields for remaining sites */}
                      {selectedPlan === 'studio' && (
                        <div className="flex flex-col gap-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#78716c]">
                            <span>Остальные сайты ({studioSites - 1}):</span>
                            <span className="text-[10px] text-[#a8a29e] font-semibold">можно указать сейчас или позже</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {Array.from({ length: studioSites - 1 }).map((_, idx) => (
                              <input
                                key={idx}
                                type="text"
                                maxLength={80}
                                value={studioExtraSites[idx] || ''}
                                onInput={(e) => {
                                  const val = (e.target as HTMLInputElement).value;
                                  setStudioExtraSites((prev) => {
                                    const next = [...prev];
                                    next[idx] = val;
                                    return next;
                                  });
                                }}
                                placeholder={`проект-${idx + 2}.ru (или позже)`}
                                spellcheck={false}
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded-xl bg-[#fbf9f5] border border-[#e5dfd2] text-xs font-mono text-[#132A22] outline-none focus:bg-white focus:border-[var(--vx-accent)]"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[11.5px] font-semibold text-[#6b645c] leading-relaxed">
                        {selectedPlan === 'single' ? (
                          'Ключ выпустим под этот сайт, а ваши настройки сохранятся — после оплаты сразу получите готовый код. Разово, навсегда для этого сайта.'
                        ) : selectedPlan === 'bundle' ? (
                          'Один ключ разблокирует все 8 эффектов линейки Gridika для этого сайта. Настраивайте любые эффекты по очереди в студии и забирайте готовый код для каждого из них без ограничений.'
                        ) : (
                          `Мастер-ключ для ${studioSites} сайтов: открывает все 8 текущих эффектов + ВСЕ БУДУЩИЕ новинки каталога навсегда. Домены остальных проектов не обязательно знать прямо сейчас — один мастер-ключ активирует их по очереди в студии в любое удобное время.`
                        )}
                      </p>

                      <button
                        type="button"
                        disabled
                        className="h-11 rounded-full bg-[#132A22] text-white/70 font-extrabold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>
                          {selectedPlan === 'single' && `Купить ключ «${productById(activeProduct).title}» · 1 490 ₽ (оплата скоро)`}
                          {selectedPlan === 'bundle' && 'Купить «Все эффекты» · 3 990 ₽ (оплата скоро)'}
                          {selectedPlan === 'studio' && `Купить Studio Master (${studioSites} ${studioSites === 5 ? 'сайтов' : 'сайта'}) · ${
                            studioSites === 2 ? '6 990 ₽' : studioSites === 3 ? '8 990 ₽' : studioSites === 4 ? '10 990 ₽' : '12 990 ₽'
                          } (оплата скоро)`}
                        </span>
                      </button>

                      {previewHref && isValidDomain(buyDomain) && (
                        <a href={previewHref} target="_blank" rel="noopener" className="text-center text-[11.5px] font-bold text-[#6b645c] underline decoration-[#d6cfc2] underline-offset-4 hover:text-[#132A22]">
                          Как это будет после оплаты (пример) →
                        </a>
                      )}
                    </div>
                    <p className="text-[11.5px] font-semibold text-[#6b645c] leading-relaxed">Уже купили? Вставьте ключ из письма:</p>
                    <input
                      type="text"
                      value={licenseKey}
                      maxLength={800}
                      onInput={(e) => setLicenseKey((e.target as HTMLInputElement).value)}
                      placeholder="GRD1-…"
                      spellcheck={false}
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5dfd2] text-xs font-mono text-[#132A22] outline-none focus:border-[var(--vx-accent)]"
                    />
                  </>
                )}
                {licenseError && <div className="text-[11.5px] font-semibold text-[#c2410c]">{licenseError}</div>}

                {license && !covers && (
                  <div className="text-[11.5px] font-semibold text-[#c2410c] leading-relaxed">
                    Ключ {license.id} куплен на {keyProductLabel}. Для «{productById(activeProduct).label}» нужен свой ключ или ключ «Все эффекты».
                  </div>
                )}

                {license && covers && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[11.5px] font-semibold text-[#57534e]">
                      Ключ <b className="font-mono text-[#132A22]">{license.id}</b> подтверждён.{' '}
                      {license.d !== '*' ? (
                        <>Он выпущен для сайта <b className="text-[#132A22]">{license.d}</b>.</>
                      ) : (
                        <>Укажите сайт, где будет стоять код:</>
                      )}
                    </div>
                    {license.d === '*' && (
                      <input
                        type="text"
                        value={siteDomain}
                        maxLength={80}
                        onInput={(e) => setSiteDomain((e.target as HTMLInputElement).value)}
                        placeholder="ваш-сайт.ru"
                        spellcheck={false}
                        autoComplete="off"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5dfd2] text-xs font-mono text-[#132A22] outline-none focus:border-[var(--vx-accent)]"
                      />
                    )}
                    {!proActive && <div className="text-[11.5px] font-semibold text-[#a8a29e]">Введите адрес сайта, например zerno-coffee.ru</div>}
                  </div>
                )}
              </div>

              {/* Code — only with a key for this product */}
              {proActive && (
                <>
                  <pre className="w-full h-36 overflow-y-auto p-4 rounded-2xl bg-[#132A22] text-[var(--vx-accent)] font-mono text-xs leading-relaxed select-all shadow-inner whitespace-pre-wrap break-all">
                    {embedCode}
                  </pre>
                  {/* the buyer picks: clipboard or a file */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 -mt-1">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="h-11 rounded-full bg-[#19C37D] hover:bg-[#149e64] text-[#132A22] font-extrabold text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {copied ? 'Скопировано ✓' : 'Скопировать код'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCode}
                      className="h-11 rounded-full bg-white border border-[#e5dfd2] hover:bg-[#f6f3ee] text-[#132A22] font-extrabold text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                      </svg>
                      {downloaded ? 'Файл сохранён ✓' : 'Скачать файлом'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPng}
                      className="col-span-2 sm:col-span-1 h-11 rounded-full bg-white border border-[#e5dfd2] hover:bg-[#f6f3ee] text-[#132A22] font-extrabold text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.6" /><path d="m21 15-5-5L5 21" />
                      </svg>
                      Картинка PNG
                    </button>
                  </div>
                  <div className="text-[11.5px] font-semibold text-[#15803d] -mt-2">
                    ✓ Код работает на {proDomain} и в предпросмотре Тильды. Скопированный на другой сайт, он покажет пометку Gridika.
                  </div>
                </>
              )}

              {proActive && <InstallGuide height={activeProduct === 'qr-card' ? 560 : activeProduct === 'gift-box' ? 520 : activeProduct === 'voxel-logo' ? LOGO_EMBED_HEIGHT : activeProduct === 'voxel-morph' && morph.data ? morphEmbedHeight(morph.data) : activeProduct === 'sale-timer' && timer.data ? timerEmbedHeight(timer.data) : 480} />}
            </div>
          </div>
        )}

        {/* Floating Cart Dock Pill & Order Modal */}
        <CartFloatingPill items={cartItems} onOpenCart={() => setShowCartModal(true)} />
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          items={cartItems}
          onRemoveItem={(id) => removeFromCart(id)}
          onEditItem={handleEditCartItem}
          onDuplicateItem={handleDuplicateCartItem}
          editingId={currentCartItem?.id}
          onAddCurrentToCart={() => {
            addCurrentAsNew();
          }}
          currentProductTitle={productById(activeProduct).title}
          isCurrentInCart={isCurrentInCart}
        />
      </div>
    </div>
  );
}

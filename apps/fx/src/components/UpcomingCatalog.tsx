import { useState, useRef } from 'preact/hooks';

export type ProductFilter = 'all' | 'conversion' | 'ecommerce' | 'brand';

interface CatalogProduct {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeStyle: string;
  metric: string;
  metricDesc: string;
  description: string;
  tildaBlock: string;
  category: ProductFilter[];
  actionLabel: string;
  isFlagship?: boolean;
}

const TOP6_PRODUCTS: CatalogProduct[] = [
  {
    id: 'qr-morph',
    number: '01',
    title: '3D QR-Морфинг',
    subtitle: 'Живая трехмерная скульптура из любого QR-кода',
    badge: 'Флагман • Доступен сейчас',
    badgeStyle: 'bg-[#19C37D] text-[#132A22]',
    metric: '100% считываемость',
    metricDesc: 'Камерой любого смартфона',
    description: 'Обычный черно-белый QR-код трансформируется в парящее 3D-дерево с опадающими лепестками, футуристичный мегаполис или остров. Увеличивает глубину просмотра и гарантированно считывается.',
    tildaBlock: 'Блок T123',
    category: ['all', 'conversion', 'brand'],
    actionLabel: 'Настроить свой QR ↑',
    isFlagship: true,
  },
  {
    id: 'holo-card',
    number: '02',
    title: '3D-Визитка / Link-in-Bio',
    subtitle: 'Голографическая карта эксперта с гироскопом',
    badge: 'Личный бренд',
    badgeStyle: 'bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/30',
    metric: '+45% CTR',
    metricDesc: 'Переходов в Telegram и мессенджеры',
    description: 'Вместо скучного списка ссылок Taplink — объемная банковская карта или бейдж с металлическими бликами. Наклоняется за курсором и реагирует на гироскоп смартфона. При клике эффектно вылетают кнопки соцсетей.',
    tildaBlock: 'Блок T123 / Zero Block',
    category: ['all', 'brand', 'conversion'],
    actionLabel: 'Смотреть демо',
  },
  {
    id: 'spatial-calc',
    number: '03',
    title: 'Живой 3D-Калькулятор',
    subtitle: 'Геймифицированный ползунок с растущим объектом',
    badge: 'Лидогенерация',
    badgeStyle: 'bg-[#132A22] text-[#F0EBE9]',
    metric: '+62% заявок',
    metricDesc: 'Рост заполненных смет и расчетов',
    description: 'Посетитель двигает ползунок — прямо на глазах вырастают 3D-этажи дома, стопка купюр или объем проекта. Сумма пересчитывается на лету и автоматически передается в стандартную форму Tilda.',
    tildaBlock: 'Блок T123 + Форма Tilda',
    category: ['all', 'conversion'],
    actionLabel: 'Смотреть демо',
  },
  {
    id: 'unbox-3d',
    number: '04',
    title: '3D-Анбоксинг Товара',
    subtitle: 'Интерактивная распаковка коробки в карточке товара',
    badge: 'E-Commerce',
    badgeStyle: 'bg-[#eee9de] text-[#132A22] border border-[#ded8cb]',
    metric: 'x2.4 время',
    metricDesc: 'Удержания внимания в каталоге товаров',
    description: 'Интерактивная брендовая коробка, чашка кофе или флакон в карточке товара Tilda. При скролле или клике крышка плавно открывается с пружинящим звуком, выпуская парящий товар с мягким свечением.',
    tildaBlock: 'Блок T123 / Каталог ST300',
    category: ['all', 'ecommerce', 'conversion'],
    actionLabel: 'Смотреть демо',
  },
  {
    id: 'jelly-btn',
    number: '05',
    title: 'Магнитная Kinetic Hero-кнопка',
    subtitle: 'Объемная желейная кнопка для первого экрана',
    badge: 'Конверсия первого экрана',
    badgeStyle: 'bg-[#19C37D] text-[#132A22]',
    metric: '+31% кликов',
    metricDesc: 'По главному конверсионному действию',
    description: 'Hero-кнопка для главного экрана. Магнитится к курсору в радиусе 120px и дает приятный тактильный желейный отклик при клике. Встраивается в 1 строчку кода поверх Zero Block.',
    tildaBlock: '1 строчка кода в HTML',
    category: ['all', 'conversion', 'brand'],
    actionLabel: 'Смотреть демо',
  },
  {
    id: 'spatial-prism',
    number: '06',
    title: 'Spatial Before / After',
    subtitle: 'Объемная 3D-призма сравнения вместо плоской шторки',
    badge: 'Визуализация кейсов',
    badgeStyle: 'bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/30',
    metric: '360° обзор',
    metricDesc: 'Осязаемый результат работ',
    description: 'Трехмерный поворотный кристалл для дизайнеров интерьера, ремонта, тюнинга авто и эстетической медицины. Клиент свайпом крутит объект и видит реальную объемную трансформацию «До» и «После».',
    tildaBlock: 'Блок T123',
    category: ['all', 'brand', 'ecommerce'],
    actionLabel: 'Смотреть демо',
  },
];

export function UpcomingCatalog() {
  const [filter, setFilter] = useState<ProductFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Micro-interactive states:
  // 1. QR Morph Shape selector
  const [qrShape, setQrShape] = useState<'tree' | 'city' | 'island'>('tree');

  // 2. 3D Card tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // 3. 3D Calc Slider
  const [calcFloors, setCalcFloors] = useState<number>(3);

  // 4. Unbox state
  const [boxOpen, setBoxOpen] = useState(false);

  // 5. Magnetic button offset
  const [magOffset, setMagOffset] = useState({ x: 0, y: 0 });
  const magneticBoxRef = useRef<HTMLDivElement>(null);

  // 6. Before / After Prism side
  const [prismSide, setPrismSide] = useState<'before' | 'after'>('after');

  const filteredProducts = TOP6_PRODUCTS.filter((p) =>
    filter === 'all' ? true : p.category.includes(filter)
  );

  const handleMouseMoveTilt = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      rx: -py * 16,
      ry: px * 16,
      gx: ((e.clientX - rect.left) / rect.width) * 100,
      gy: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeaveTilt = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const handleMouseMoveMagnetic = (e: MouseEvent) => {
    const box = magneticBoxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 110) {
      setMagOffset({ x: dx * 0.38, y: dy * 0.38 });
    } else {
      setMagOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeaveMagnetic = () => {
    setMagOffset({ x: 0, y: 0 });
  };

  const handleProductAction = (product: CatalogProduct) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fx:select-product', { detail: { productId: product.id } })
      );
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('fx', product.id);
        window.history.pushState({}, '', url.toString());
      } catch {}
    }
    const el = document.getElementById('showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/25 shadow-sm inline-block mb-3">
          Каталог 3D-Продуктов
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#132A22] tracking-tight leading-[1.08]">
          ТОП-6 интерактивных механик <br className="hidden sm:inline" />
          <span className="text-[#19C37D]">для сайтов на Tilda</span>
        </h2>
        <p className="text-[#57534e] text-xs sm:text-sm mt-3 font-medium max-w-xl mx-auto leading-relaxed">
          Каждый 3D-виджет упакован в готовый автономный сниппет для блока T123. Вставляется за 20 секунд, мгновенно повышает вовлеченность и конверсию.
        </p>

        {/* CATEGORY FILTER TABS */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 select-none">
          {[
            { id: 'all' as ProductFilter, label: 'Все 6 направлений' },
            { id: 'conversion' as ProductFilter, label: 'Конверсия & Лиды (4)' },
            { id: 'brand' as ProductFilter, label: 'Личный бренд & Визитки (3)' },
            { id: 'ecommerce' as ProductFilter, label: 'E-Commerce & Товары (2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#132A22] text-[#F0EBE9] shadow-md scale-105'
                  : 'bg-white/80 border border-[#e5dfd2] text-[#57534e] hover:bg-white hover:text-[#132A22] shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BENTO GRID OF 6 PRODUCTS */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        
        {/* PRODUCT 01: 3D QR-МОРФИНГ (FEATURED WIDE CARD: COL-SPAN-12 LG:COL-SPAN-8) */}
        {filteredProducts.some((p) => p.id === 'qr-morph') && (
          <div className="col-span-12 lg:col-span-8 soft-3d-card p-6 sm:p-9 flex flex-col justify-between group hover:shadow-2xl transition-all relative overflow-hidden">
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#19C37D] text-[#132A22] font-mono font-black text-xs flex items-center justify-center shadow-sm">
                  01
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#19C37D] text-[#132A22] shadow-sm">
                  Флагман • Доступен сейчас
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  Tilda T123
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#19C37D] bg-[#DFF8EB]/70 px-3 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>100% считываемость</span>
              </div>
            </div>

            {/* Middle row: content + interactive mini-stage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center relative z-10">
              <div className="md:col-span-7">
                <h3 className="text-2xl sm:text-3xl font-black text-[#132A22] tracking-tight">
                  3D QR-Морфинг
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] mt-2.5 leading-relaxed font-medium">
                  Обычный черно-белый QR-код трансформируется в парящее 3D-дерево, небоскребы или остров при скролле страницы. 
                  Привлекает внимание и гарантированно считывается камерой любого смартфона.
                </p>

                {/* Sub-shape pills */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wide text-[#a8a29e]">
                    Формы:
                  </span>
                  {[
                    { id: 'tree' as const, label: 'Бонсай' },
                    { id: 'city' as const, label: 'Мегаполис' },
                    { id: 'island' as const, label: 'Остров' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQrShape(s.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        qrShape === s.id
                          ? 'bg-[#19C37D] text-[#132A22] shadow-sm font-extrabold'
                          : 'bg-[#eee9de] text-[#57534e] hover:bg-[#e4ded2]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual stage mockup */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-br from-[#f8f5ee] to-[#e8e2d4] border border-[#e5dfd2] shadow-inner flex flex-col items-center justify-center p-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {qrShape === 'tree' && (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-12 rounded-2xl bg-[#19C37D] shadow-[0_8px_20px_rgba(25,195,125,0.4)] flex items-center justify-center text-[#132A22] font-black text-xs">
                          Бонсай
                        </div>
                        <div className="w-4 h-6 bg-[#6d4c41] rounded-b-md shadow-sm"></div>
                        <div className="w-20 h-2 bg-[#132A22]/20 rounded-full blur-[2px] mt-1"></div>
                      </div>
                    )}
                    {qrShape === 'city' && (
                      <div className="flex items-end gap-1">
                        <div className="w-5 h-16 rounded-t-md bg-[#3b4a8a] shadow-md"></div>
                        <div className="w-7 h-22 rounded-t-md bg-[#19C37D] shadow-lg"></div>
                        <div className="w-6 h-12 rounded-t-md bg-[#f2c14e] shadow-md"></div>
                      </div>
                    )}
                    {qrShape === 'island' && (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-10 rounded-2xl bg-[#2f9fc7] shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                          Лагуна
                        </div>
                        <div className="w-14 h-4 bg-[#e0c080] rounded-b-xl shadow-sm"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#78716c] mt-2">
                    {qrShape === 'tree' && '3 сезона • 320 вокселей'}
                    {qrShape === 'city' && 'День / Ночь • 340 вокселей'}
                    {qrShape === 'island' && '3 биома • 300 вокселей'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="pt-4 border-t border-[#ede9df] flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3 text-xs font-bold text-[#57534e]">
                <span>0% CPU вне экрана</span>
                <span>•</span>
                <span>60–120 FPS</span>
                <span>•</span>
                <span>WCAG 2.1</span>
              </div>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[0])}
                className="px-5 py-2.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Настроить свой QR</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT 02: 3D-ВИЗИТКА / LINK-IN-BIO (COL-SPAN-12 LG:COL-SPAN-4) */}
        {filteredProducts.some((p) => p.id === 'holo-card') && (
          <div
            className="col-span-12 lg:col-span-4 soft-3d-card p-6 sm:p-7 flex flex-col justify-between group hover:shadow-2xl transition-all select-none"
            onMouseMove={handleMouseMoveTilt}
            onMouseLeave={handleMouseLeaveTilt}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#eee9de] text-[#132A22] font-mono font-black text-xs flex items-center justify-center">
                    02
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/30 shadow-sm">
                    Личный бренд
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  +45% CTR
                </span>
              </div>

              <h3 className="text-xl font-black text-[#132A22] tracking-tight">
                3D-Визитка / Link-in-Bio
              </h3>
              <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed font-medium">
                Голографическая карта эксперта с металлическими бликами и гироскопом. Заменяет скучные сервисы ссылок.
              </p>

              {/* 3D TILT CARD PREVIEW */}
              <div className="my-5 flex justify-center py-2 [perspective:800px]">
                <div
                  className="w-56 h-34 rounded-2xl p-4 flex flex-col justify-between text-white shadow-2xl transition-transform duration-100 ease-out relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #132A22 0%, #1d4034 50%, #19C37D 100%)',
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`,
                    boxShadow: '0 20px 40px -10px rgba(19, 42, 34, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {/* Dynamic Glare */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Card Header */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-7 h-5 rounded-md bg-[#e5dfd2]/30 border border-white/20 flex items-center justify-center">
                      <div className="w-4 h-3 rounded-sm border border-white/40"></div>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-[#DFF8EB] font-bold">
                      TEMKA CARD
                    </span>
                  </div>

                  {/* Card Name */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-black tracking-tight text-white">
                      Alex Rover
                    </div>
                    <div className="text-[9px] text-[#DFF8EB]/80 font-mono">
                      Creative 3D Lead • @temka
                    </div>
                  </div>

                  {/* Quick icons */}
                  <div className="flex items-center gap-1.5 relative z-10 pt-1 border-t border-white/10">
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">TG</span>
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">WA</span>
                    <span className="text-[9px] text-[#DFF8EB] font-bold ml-auto">+45% в TG</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ede9df] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#19C37D]">Наклоните карту курсором</span>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[1])}
                className="px-3.5 py-1.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Настроить в студии</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT 03: ЖИВОЙ 3D-КАЛЬКУЛЯТОР (COL-SPAN-12 LG:COL-SPAN-4) */}
        {filteredProducts.some((p) => p.id === 'spatial-calc') && (
          <div className="col-span-12 lg:col-span-4 soft-3d-card p-6 sm:p-7 flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#eee9de] text-[#132A22] font-mono font-black text-xs flex items-center justify-center">
                    03
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#132A22] text-[#F0EBE9] shadow-sm">
                    Лидогенерация
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  +62% заявок
                </span>
              </div>

              <h3 className="text-xl font-black text-[#132A22] tracking-tight">
                Живой 3D-Калькулятор
              </h3>
              <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed font-medium">
                Двигаешь ползунок — прямо на глазах растет 3D-объект и передает готовую смету в форму Tilda.
              </p>

              {/* INTERACTIVE RANGE SLIDER DEMO */}
              <div className="my-5 p-4 rounded-2xl bg-[#faf7f2] border border-[#e5dfd2]">
                <div className="flex items-center justify-between text-xs font-bold text-[#132A22] mb-2">
                  <span>Объем объекта:</span>
                  <span className="text-[#19C37D] font-mono font-black">{calcFloors} этажа</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={calcFloors}
                  onInput={(e) => setCalcFloors(Number((e.target as HTMLInputElement).value))}
                  className="w-full accent-[#19C37D] cursor-pointer"
                />

                {/* Stacking 3D floors */}
                <div className="mt-3 h-16 flex items-end justify-center gap-1.5">
                  {Array.from({ length: calcFloors }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-7 rounded-lg bg-[#19C37D] border border-[#149e64] shadow-md flex items-center justify-center text-[#132A22] text-[10px] font-black transition-all"
                    >
                      Э{i + 1}
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-center text-xs font-black text-[#132A22]">
                  Расчет: <span className="text-[#19C37D] font-mono">{calcFloors * 45} 000 ₽</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ede9df] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#78716c]">Связка с формой Tilda</span>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[2])}
                className="px-3.5 py-1.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Настроить в студии</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT 04: 3D-АНБОКСИНГ ТОВАРА (COL-SPAN-12 LG:COL-SPAN-4) */}
        {filteredProducts.some((p) => p.id === 'unbox-3d') && (
          <div className="col-span-12 lg:col-span-4 soft-3d-card p-6 sm:p-7 flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#eee9de] text-[#132A22] font-mono font-black text-xs flex items-center justify-center">
                    04
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#eee9de] text-[#132A22] border border-[#ded8cb] shadow-sm">
                    E-Commerce
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  x2.4 время
                </span>
              </div>

              <h3 className="text-xl font-black text-[#132A22] tracking-tight">
                3D-Анбоксинг Товара
              </h3>
              <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed font-medium">
                Интерактивная распаковка упаковки в карточке товара. При скролле крышка открывается с пружинящим звуком.
              </p>

              {/* UNBOXING INTERACTIVE MOCKUP */}
              <div
                className="my-5 h-34 rounded-2xl bg-gradient-to-b from-[#faf7f2] to-[#eee8dc] border border-[#e5dfd2] flex flex-col items-center justify-center cursor-pointer p-4 select-none"
                onClick={() => setBoxOpen(!boxOpen)}
                title="Нажмите для открытия коробки"
              >
                <div className="relative w-24 h-20 flex items-center justify-center">
                  <div
                    className={`absolute w-12 h-12 rounded-xl bg-[#19C37D] text-[#132A22] flex items-center justify-center font-black text-xs shadow-xl transition-all duration-300 ${
                      boxOpen ? '-translate-y-8 scale-110 opacity-100' : 'translate-y-0 scale-75 opacity-0'
                    }`}
                  >
                    Товар
                  </div>

                  <div
                    className={`w-20 h-5 rounded-t-lg bg-[#d97706] shadow-md transition-all duration-300 ${
                      boxOpen ? '-translate-y-5 -rotate-12' : 'translate-y-0 rotate-0'
                    }`}
                  />
                  <div className="w-20 h-10 rounded-b-lg bg-[#b45309] shadow-inner flex items-center justify-center text-[10px] font-bold text-white/90">
                    Упаковка
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#78716c] mt-2">
                  {boxOpen ? 'Коробка открыта (кликните закрыть)' : 'Кликните, чтобы распаковать'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ede9df] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#19C37D]">Каталог ST300</span>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[3])}
                className="px-3.5 py-1.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Настроить в студии</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT 05: МАГНИТНАЯ KINETIC-КНОПКА (COL-SPAN-12 LG:COL-SPAN-4) */}
        {filteredProducts.some((p) => p.id === 'jelly-btn') && (
          <div
            ref={magneticBoxRef}
            className="col-span-12 lg:col-span-4 soft-3d-card p-6 sm:p-7 flex flex-col justify-between group hover:shadow-2xl transition-all"
            onMouseMove={handleMouseMoveMagnetic}
            onMouseLeave={handleMouseLeaveMagnetic}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#eee9de] text-[#132A22] font-mono font-black text-xs flex items-center justify-center">
                    05
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#19C37D] text-[#132A22] shadow-sm">
                    Конверсия
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  +31% CTR
                </span>
              </div>

              <h3 className="text-xl font-black text-[#132A22] tracking-tight">
                Магнитная Kinetic-Кнопка
              </h3>
              <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed font-medium">
                Объемная желе-кнопка для главного экрана. Магнитится к курсору в радиусе 120px с пружинной инерцией.
              </p>

              {/* LIVE MAGNETIC BUTTON INTERACTIVE */}
              <div className="my-5 h-34 rounded-2xl bg-[#faf7f2] border border-[#e5dfd2] flex flex-col items-center justify-center relative overflow-hidden select-none">
                <div
                  className="px-6 py-3 rounded-full bg-[#19C37D] text-[#132A22] font-black text-xs shadow-[0_8px_24px_rgba(25,195,125,0.45)] border border-white/40 flex items-center gap-2 cursor-pointer transition-transform duration-75 ease-out active:scale-90"
                  style={{
                    transform: `translate(${magOffset.x}px, ${magOffset.y}px)`,
                  }}
                >
                  <span>Наведите курсор</span>
                  <span>→</span>
                </div>
                <span className="text-[10px] font-bold text-[#a8a29e] mt-3">
                  Магнитный радиус: 120px
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ede9df] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#19C37D]">1 строчка в Zero Block</span>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[4])}
                className="px-3.5 py-1.5 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Настроить в студии</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT 06: SPATIAL BEFORE / AFTER (COL-SPAN-12 LG:COL-SPAN-8) */}
        {filteredProducts.some((p) => p.id === 'spatial-prism') && (
          <div className="col-span-12 lg:col-span-8 soft-3d-card p-6 sm:p-9 flex flex-col justify-between group hover:shadow-2xl transition-all">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#eee9de] text-[#132A22] font-mono font-black text-xs flex items-center justify-center">
                  06
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/30 shadow-sm">
                  Визуализация кейсов
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#eee9de] text-[#57534e]">
                  Tilda T123
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#eee9de] p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setPrismSide('before')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    prismSide === 'before'
                      ? 'bg-[#132A22] text-white shadow-sm'
                      : 'text-[#57534e] hover:text-[#132A22]'
                  }`}
                >
                  До ремонта
                </button>
                <button
                  type="button"
                  onClick={() => setPrismSide('after')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    prismSide === 'after'
                      ? 'bg-[#19C37D] text-[#132A22] shadow-sm font-extrabold'
                      : 'text-[#57534e] hover:text-[#132A22]'
                  }`}
                >
                  После (3D)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              <div className="md:col-span-7">
                <h3 className="text-2xl sm:text-3xl font-black text-[#132A22] tracking-tight">
                  Spatial Before / After
                </h3>
                <p className="text-xs sm:text-sm text-[#57534e] mt-2.5 leading-relaxed font-medium">
                  Объемная вращающаяся 3D-призма вместо банального плоского слайдера-шторки. 
                  Позволяет в реальном 3D показать результат дизайн-проекта, тюнинга авто, ремонта или бьюти-процедур.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#19C37D]">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Вращение на 360° свайпом
                  </span>
                  <span>•</span>
                  <span>Текстурирование в 1 клик</span>
                </div>
              </div>

              {/* Prism Graphic Mockup */}
              <div className="md:col-span-5 flex justify-center">
                <div
                  className="w-48 h-36 rounded-2xl p-4 flex flex-col justify-between shadow-xl border border-[#e5dfd2] transition-all duration-300"
                  style={{
                    background: prismSide === 'after' 
                      ? 'linear-gradient(135deg, #19C37D 0%, #132A22 100%)' 
                      : 'linear-gradient(135deg, #78716c 0%, #44403c 100%)',
                    color: '#F0EBE9',
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span>{prismSide === 'after' ? 'Стильный Лофт' : 'Черновая отделка'}</span>
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>
                  <div className="text-center font-black text-sm">
                    {prismSide === 'after' ? 'Премиум Дизайн-проект' : 'Бетонные стены и кабели'}
                  </div>
                  <div className="text-[10px] text-white/70 font-mono text-center">
                    {prismSide === 'after' ? '✓ Готово под ключ' : '0% завершения'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ede9df] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#78716c]">Свайп на смартфонах • Плавный разворот</span>
              <button
                type="button"
                onClick={() => handleProductAction(TOP6_PRODUCTS[5])}
                className="px-4 py-2 rounded-full bg-[#132A22] hover:bg-[#19C37D] text-[#F0EBE9] hover:text-[#132A22] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Настроить в студии</span>
                <span>↑</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CODE & ACCESS DETAILS FOR EACH PRODUCT */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-[#e5dfd2] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-[#132A22]">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DFF8EB] text-[#132A22] border border-[#19C37D]/30 shadow-sm">
                  {selectedProduct.badge}
                </span>
                <h3 className="text-2xl font-black text-[#132A22] mt-2 tracking-tight">
                  {selectedProduct.title}
                </h3>
                <p className="text-xs text-[#78716c] mt-0.5 font-medium">
                  {selectedProduct.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-[#F0EBE9] hover:bg-[#e6dfdc] text-[#132A22] font-bold flex items-center justify-center text-sm shadow-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5dfd2] text-xs text-[#57534e] space-y-2.5">
              <div className="flex items-center justify-between font-bold text-[#132A22]">
                <span>Совместимость:</span>
                <span className="font-mono text-[#19C37D]">{selectedProduct.tildaBlock}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-[#132A22]">
                <span>Главная польза:</span>
                <span className="font-mono text-[#19C37D]">{selectedProduct.metric}</span>
              </div>
              <p className="text-[11px] leading-relaxed pt-1 border-t border-[#ede9df]">
                {selectedProduct.description}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2500);
                }}
                className="w-full py-3 rounded-full bg-[#19C37D] hover:bg-[#149e64] text-[#132A22] font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span>{copiedCode ? 'Код блока T123 скопирован в буфер!' : 'Получить готовый код для блока T123'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-full py-2.5 rounded-full bg-[#eee9de] hover:bg-[#e4ded2] text-[#57534e] font-bold text-xs transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

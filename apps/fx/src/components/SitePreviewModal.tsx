import { useState, useEffect } from 'preact/hooks';
import type { RefObject } from 'preact';
import type { ProductId } from '../data/products';
import type { TargetShapeType } from '../engine/shapes';
import type { WidgetSize } from '../engine/purchase';

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: ProductId;
  qrShape?: TargetShapeType;
  qrMode?: string;
  size: WidgetSize;
  onSizeChange: (s: WidgetSize) => void;
  slotRef: RefObject<HTMLDivElement>;
  onGetCode?: () => void;
  onViewportChange?: () => void;
}

interface Palette {
  bgLight: string;
  bgDark: string;
  surfaceLight: string;
  surfaceDark: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  inkLight: string;
  mutedLight: string;
  borderLight: string;
  borderDark: string;
}

type LayoutKind = 'hero-split' | 'promo-banner' | 'timer-center' | 'contact-card' | 'logo-center' | 'case-study';

interface SiteTemplate {
  layout: LayoutKind;
  url: string;
  brand: string;
  nav: string[];
  badge: string;
  heading: string;
  lead: string;
  cta: string;
  secondaryCta: string;
  proof: string;
  sceneHint: string;
  stats: { val: string; label: string }[];
  sectionTitle: string;
  cards: { tag: string; title: string; desc: string; meta: string }[];
  footerNote: string;
  palette: Palette;
}

function getQrPalette(shape: TargetShapeType, mode?: string): Palette {
  switch (shape) {
    case 'tree':
      if (mode === 'summer') {
        return {
          bgLight: 'linear-gradient(165deg, #eefaf3 0%, #ffffff 50%, #f3f0fc 100%)',
          bgDark: 'linear-gradient(165deg, #0f1f18 0%, #0b1110 60%, #161224 100%)',
          surfaceLight: 'rgba(238, 250, 243, 0.78)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#2f9660',
          accentSoft: 'rgba(47, 150, 96, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#142e21',
          mutedLight: '#506b5d',
          borderLight: 'rgba(47, 150, 96, 0.2)',
          borderDark: 'rgba(59, 175, 114, 0.26)',
        };
      }
      if (mode === 'autumn') {
        return {
          bgLight: 'linear-gradient(165deg, #fcf3e8 0%, #ffffff 50%, #f9eee0 100%)',
          bgDark: 'linear-gradient(165deg, #24160c 0%, #120d0a 60%, #1d130b 100%)',
          surfaceLight: 'rgba(252, 243, 232, 0.8)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#c8661a',
          accentSoft: 'rgba(200, 102, 26, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#3a200e',
          mutedLight: '#7c5c44',
          borderLight: 'rgba(200, 102, 26, 0.22)',
          borderDark: 'rgba(200, 102, 26, 0.28)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #fdf2f6 0%, #ffffff 50%, #f1f9f2 100%)',
        bgDark: 'linear-gradient(165deg, #23141c 0%, #110e12 60%, #111c16 100%)',
        surfaceLight: 'rgba(253, 242, 246, 0.76)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#d0507f',
        accentSoft: 'rgba(208, 80, 127, 0.13)',
        accentInk: '#ffffff',
        inkLight: '#331c26',
        mutedLight: '#735663',
        borderLight: 'rgba(208, 80, 127, 0.2)',
        borderDark: 'rgba(208, 80, 127, 0.28)',
      };

    case 'maze':
      if (mode === 'evening') {
        return {
          bgLight: 'linear-gradient(165deg, #f0f3fa 0%, #ffffff 50%, #eef5ef 100%)',
          bgDark: 'linear-gradient(165deg, #141926 0%, #0d1214 60%, #111d15 100%)',
          surfaceLight: 'rgba(240, 243, 250, 0.82)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#63599c',
          accentSoft: 'rgba(99, 89, 156, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#1f2338',
          mutedLight: '#5a607a',
          borderLight: 'rgba(99, 89, 156, 0.22)',
          borderDark: 'rgba(99, 89, 156, 0.3)',
        };
      }
      if (mode === 'autumn') {
        return {
          bgLight: 'linear-gradient(165deg, #f8f4e8 0%, #ffffff 50%, #f4efe0 100%)',
          bgDark: 'linear-gradient(165deg, #211c10 0%, #12110b 60%, #1b180e 100%)',
          surfaceLight: 'rgba(248, 244, 232, 0.82)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#b87a24',
          accentSoft: 'rgba(184, 122, 36, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#332712',
          mutedLight: '#736348',
          borderLight: 'rgba(184, 122, 36, 0.24)',
          borderDark: 'rgba(184, 122, 36, 0.3)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #eaf6e5 0%, #fafcf8 50%, #f3ede0 100%)',
        bgDark: 'linear-gradient(165deg, #112112 0%, #0b130c 60%, #151b12 100%)',
        surfaceLight: 'rgba(234, 246, 229, 0.8)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#3b8c35',
        accentSoft: 'rgba(59, 140, 53, 0.14)',
        accentInk: '#ffffff',
        inkLight: '#173315',
        mutedLight: '#4e694b',
        borderLight: 'rgba(59, 140, 53, 0.24)',
        borderDark: 'rgba(72, 166, 65, 0.3)',
      };

    case 'cake':
      if (mode === 'strawberry') {
        return {
          bgLight: 'linear-gradient(165deg, #fdf0f4 0%, #fffaf7 52%, #fae7ec 100%)',
          bgDark: 'linear-gradient(165deg, #26141a 0%, #140d10 60%, #211318 100%)',
          surfaceLight: 'rgba(253, 240, 244, 0.82)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#d95c7c',
          accentSoft: 'rgba(217, 92, 124, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#3d1924',
          mutedLight: '#7d5460',
          borderLight: 'rgba(217, 92, 124, 0.22)',
          borderDark: 'rgba(217, 92, 124, 0.28)',
        };
      }
      if (mode === 'mint') {
        return {
          bgLight: 'linear-gradient(165deg, #ecf9f3 0%, #fffdf9 52%, #e6f5ee 100%)',
          bgDark: 'linear-gradient(165deg, #10221c 0%, #0b1411 60%, #111f1a 100%)',
          surfaceLight: 'rgba(236, 249, 243, 0.82)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#3aa884',
          accentSoft: 'rgba(58, 168, 132, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#15342a',
          mutedLight: '#4e7065',
          borderLight: 'rgba(58, 168, 132, 0.22)',
          borderDark: 'rgba(58, 168, 132, 0.28)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #f8eee2 0%, #fffcf7 50%, #f1e3d2 100%)',
        bgDark: 'linear-gradient(165deg, #231811 0%, #140e0a 60%, #1e140e 100%)',
        surfaceLight: 'rgba(248, 238, 226, 0.84)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#8a5233',
        accentSoft: 'rgba(138, 82, 51, 0.13)',
        accentInk: '#fffaf5',
        inkLight: '#361f13',
        mutedLight: '#785a47',
        borderLight: 'rgba(138, 82, 51, 0.22)',
        borderDark: 'rgba(196, 146, 106, 0.26)',
      };

    case 'city':
      if (mode === 'sunset') {
        return {
          bgLight: 'linear-gradient(165deg, #fdf1e8 0%, #ffffff 52%, #f1eff6 100%)',
          bgDark: 'linear-gradient(165deg, #24181a 0%, #11121a 60%, #1a1522 100%)',
          surfaceLight: 'rgba(253, 241, 232, 0.8)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#df783d',
          accentSoft: 'rgba(223, 120, 61, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#281f29',
          mutedLight: '#6b606e',
          borderLight: 'rgba(223, 120, 61, 0.22)',
          borderDark: 'rgba(223, 120, 61, 0.28)',
        };
      }
      if (mode === 'night') {
        return {
          bgLight: 'linear-gradient(165deg, #edf0f8 0%, #ffffff 52%, #e7ebf5 100%)',
          bgDark: 'linear-gradient(165deg, #131a2e 0%, #0b0f1c 60%, #11182b 100%)',
          surfaceLight: 'rgba(237, 240, 248, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.05)',
          accent: '#465ca8',
          accentSoft: 'rgba(70, 92, 168, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#171f36',
          mutedLight: '#586382',
          borderLight: 'rgba(70, 92, 168, 0.22)',
          borderDark: 'rgba(120, 148, 230, 0.26)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #f1f4f9 0%, #ffffff 52%, #f5f1e9 100%)',
        bgDark: 'linear-gradient(165deg, #161d26 0%, #0d1117 60%, #141920 100%)',
        surfaceLight: 'rgba(241, 244, 249, 0.84)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#3b5278',
        accentSoft: 'rgba(59, 82, 120, 0.12)',
        accentInk: '#ffffff',
        inkLight: '#182230',
        mutedLight: '#5b6678',
        borderLight: 'rgba(59, 82, 120, 0.2)',
        borderDark: 'rgba(130, 155, 195, 0.24)',
      };

    case 'island':
      if (mode === 'volcano') {
        return {
          bgLight: 'linear-gradient(165deg, #fcf0ea 0%, #ffffff 52%, #f5f1ee 100%)',
          bgDark: 'linear-gradient(165deg, #26140e 0%, #120e0d 60%, #1f120e 100%)',
          surfaceLight: 'rgba(252, 240, 234, 0.82)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#e8501c',
          accentSoft: 'rgba(232, 80, 28, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#2b1914',
          mutedLight: '#6e5851',
          borderLight: 'rgba(232, 80, 28, 0.22)',
          borderDark: 'rgba(232, 80, 28, 0.3)',
        };
      }
      if (mode === 'winter') {
        return {
          bgLight: 'linear-gradient(165deg, #edf6fb 0%, #ffffff 52%, #e7f1f8 100%)',
          bgDark: 'linear-gradient(165deg, #101e29 0%, #0a121a 60%, #111d26 100%)',
          surfaceLight: 'rgba(237, 246, 251, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#3e84b0',
          accentSoft: 'rgba(62, 132, 176, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#162b3b',
          mutedLight: '#547085',
          borderLight: 'rgba(62, 132, 176, 0.22)',
          borderDark: 'rgba(120, 185, 224, 0.25)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #e8f7fb 0%, #ffffff 50%, #faf3e4 100%)',
        bgDark: 'linear-gradient(165deg, #0d2229 0%, #091317 60%, #112026 100%)',
        surfaceLight: 'rgba(232, 247, 251, 0.82)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#1b8db3',
        accentSoft: 'rgba(27, 141, 179, 0.14)',
        accentInk: '#ffffff',
        inkLight: '#122f3b',
        mutedLight: '#4e6f7d',
        borderLight: 'rgba(27, 141, 179, 0.22)',
        borderDark: 'rgba(56, 178, 214, 0.26)',
      };

    case 'equalizer':
      if (mode === 'retro') {
        return {
          bgLight: 'linear-gradient(165deg, #fbf5e6 0%, #ffffff 52%, #f5eedd 100%)',
          bgDark: 'linear-gradient(165deg, #221b0e 0%, #12100b 60%, #1c160c 100%)',
          surfaceLight: 'rgba(251, 245, 230, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#cc9518',
          accentSoft: 'rgba(204, 149, 24, 0.15)',
          accentInk: '#1f1606',
          inkLight: '#2e220b',
          mutedLight: '#736243',
          borderLight: 'rgba(204, 149, 24, 0.25)',
          borderDark: 'rgba(232, 192, 64, 0.28)',
        };
      }
      if (mode === 'mono') {
        return {
          bgLight: 'linear-gradient(165deg, #f2f2f5 0%, #ffffff 52%, #ececf0 100%)',
          bgDark: 'linear-gradient(165deg, #18181c 0%, #0d0d10 60%, #151519 100%)',
          surfaceLight: 'rgba(242, 242, 245, 0.86)',
          surfaceDark: 'rgba(255, 255, 255, 0.05)',
          accent: '#27272e',
          accentSoft: 'rgba(39, 39, 46, 0.1)',
          accentInk: '#ffffff',
          inkLight: '#18181c',
          mutedLight: '#63636e',
          borderLight: 'rgba(39, 39, 46, 0.16)',
          borderDark: 'rgba(255, 255, 255, 0.14)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #f3eefc 0%, #ffffff 52%, #eee8fd 100%)',
        bgDark: 'linear-gradient(165deg, #1b132b 0%, #0e0b16 60%, #171026 100%)',
        surfaceLight: 'rgba(243, 238, 252, 0.84)',
        surfaceDark: 'rgba(255, 255, 255, 0.05)',
        accent: '#7c5ce0',
        accentSoft: 'rgba(124, 92, 224, 0.14)',
        accentInk: '#ffffff',
        inkLight: '#201638',
        mutedLight: '#635682',
        borderLight: 'rgba(124, 92, 224, 0.22)',
        borderDark: 'rgba(169, 138, 224, 0.28)',
      };

    case 'castle':
      if (mode === 'night') {
        return {
          bgLight: 'linear-gradient(165deg, #edeff7 0%, #ffffff 52%, #f4eef5 100%)',
          bgDark: 'linear-gradient(165deg, #15192b 0%, #0b0e19 60%, #171426 100%)',
          surfaceLight: 'rgba(237, 239, 247, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.05)',
          accent: '#4a5a9e',
          accentSoft: 'rgba(74, 90, 158, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#1b2038',
          mutedLight: '#5d6480',
          borderLight: 'rgba(74, 90, 158, 0.22)',
          borderDark: 'rgba(122, 138, 209, 0.26)',
        };
      }
      if (mode === 'winter') {
        return {
          bgLight: 'linear-gradient(165deg, #eff5f8 0%, #ffffff 52%, #e9eff4 100%)',
          bgDark: 'linear-gradient(165deg, #141e26 0%, #0c1217 60%, #131b22 100%)',
          surfaceLight: 'rgba(239, 245, 248, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#547f9e',
          accentSoft: 'rgba(84, 127, 158, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#1a2a36',
          mutedLight: '#5a6e7d',
          borderLight: 'rgba(84, 127, 158, 0.22)',
          borderDark: 'rgba(140, 180, 209, 0.25)',
        };
      }
      return {
        bgLight: 'linear-gradient(165deg, #f9f3e8 0%, #ffffff 52%, #f5ebde 100%)',
        bgDark: 'linear-gradient(165deg, #241c12 0%, #130f0b 60%, #1d160f 100%)',
        surfaceLight: 'rgba(249, 243, 232, 0.84)',
        surfaceDark: 'rgba(255, 255, 255, 0.04)',
        accent: '#b88924',
        accentSoft: 'rgba(184, 137, 36, 0.15)',
        accentInk: '#ffffff',
        inkLight: '#332613',
        mutedLight: '#736149',
        borderLight: 'rgba(184, 137, 36, 0.24)',
        borderDark: 'rgba(216, 169, 42, 0.28)',
      };
      default:
      return getQrPalette('tree', mode);
  }
}

function getQrTemplate(shape: TargetShapeType, mode?: string): SiteTemplate {
  const palette = getQrPalette(shape, mode);
  switch (shape) {
    case 'tree':
      return {
        layout: 'hero-split',
        url: 'zerno-coffee.ru',
        brand: 'ЗЕРНО',
        nav: ['Меню', 'Кофейни', 'Обжарка', 'Контакты'],
        badge: mode === 'autumn' ? 'Осеннее меню' : mode === 'summer' ? 'Летние напитки' : 'Весеннее меню',
        heading: 'Спешелти кофе и меню в один скан',
        lead: 'Наведите камеру на дерево у кассы — сверху оно превращается в чёткий QR-код и сразу открывает сезонную карту напитков.',
        cta: 'Открыть меню',
        secondaryCta: 'Найти кофейню',
        proof: '4.9 ★ на Яндекс Картах · 3 кофейни в центре',
        sceneHint: 'Покрутите 3D-дерево · Сверху — рабочий QR меню',
        stats: [
          { val: '12 сортов', label: 'свежей обжарки каждую неделю' },
          { val: '3 минуты', label: 'среднее время выдачи заказа' },
          { val: '08:00–22:00', label: 'работаем каждый день' },
        ],
        sectionTitle: 'Хиты недели',
        cards: [
          { tag: 'Сезон', title: 'Сакура-раф', desc: 'Сливочный эспрессо с нотами вишни и миндаля', meta: '360 ₽' },
          { tag: 'Фильтр', title: 'Эфиопия Гуджи', desc: 'Бергамот, жасмин и белый персик', meta: '290 ₽' },
          { tag: 'Выпечка', title: 'Круассан фисташка', desc: 'Слоёное тесто и крем из сицилийской фисташки', meta: '310 ₽' },
        ],
        footerNote: '© ЗЕРНО · Москва, ул. Покровка, 18',
        palette,
      };
    case 'maze':
      return {
        layout: 'hero-split',
        url: 'vertograd-sad.ru',
        brand: 'ВЕРТОГРАД',
        nav: ['Проекты', 'Услуги', 'Питомник', 'Контакты'],
        badge: 'Ландшафтная архитектура',
        heading: 'Живые сады и парки под ключ',
        lead: 'Проектируем регулярные сады, живые изгороди и зоны отдыха. Отсканируйте 3D-план участка сверху, чтобы открыть каталог растений.',
        cta: 'Обсудить участок',
        secondaryCta: 'Смотреть сады',
        proof: '140+ реализованных садов · Собственный питомник',
        sceneHint: 'Покрутите 3D-сад · Сверху — QR на каталог растений',
        stats: [
          { val: '12 лет', label: 'создаём загородные сады' },
          { val: '3 года', label: 'гарантия приживаемости растений' },
          { val: 'от 10 соток', label: 'работаем с участками любой формы' },
        ],
        sectionTitle: 'Реализованные сады',
        cards: [
          { tag: '24 сотки', title: 'Усадьба в Барвихе', desc: 'Регулярный сад с лабиринтом из туи и беседкой', meta: '2026' },
          { tag: '18 соток', title: 'Лесной участок', desc: 'Теневые цветники, дорожки из плитняка и пруд', meta: '2025' },
          { tag: '35 соток', title: 'Парк у воды', desc: 'Многоуровневое освещение и плодовый сад', meta: '2025' },
        ],
        footerNote: '© ВЕРТОГРАД · Студия ландшафтного дизайна',
        palette,
      };
    case 'cake':
      return {
        layout: 'hero-split',
        url: 'krem-vanil.ru',
        brand: 'КРЕМ & ВАНИЛЬ',
        nav: ['Торты', 'Начинки', 'Свадьбы', 'Доставка'],
        badge: 'Авторская кондитерская',
        heading: 'Праздничные торты с доставкой к столу',
        lead: 'Собираем многоярусные торты из натуральных сливок и бельгийского шоколада. Наведите камеру сверху — откроется конструктор начинок.',
        cta: 'Выбрать начинку',
        secondaryCta: 'Рассчитать вес',
        proof: '2 400+ праздников · Бережная доставка в рефрижераторе',
        sceneHint: 'Покрутите 3D-торт · Сверху — QR на конструктор начинок',
        stats: [
          { val: '14 начинок', label: 'от тёмного шоколада до фисташки' },
          { val: 'за 24 часа', label: 'принимаем срочные заказы' },
          { val: '100% натурально', label: 'без заменителей и маргарина' },
        ],
        sectionTitle: 'Популярные вкусы',
        cards: [
          { tag: 'Бестселлер', title: 'Тройной шоколад', desc: 'Влажный бисквит, ганаш и хрустящий пралине', meta: '2 600 ₽/кг' },
          { tag: 'Ягодный', title: 'Клубника-пломбир', desc: 'Ванильный крем-чиз и конфи из спелой ягоды', meta: '2 400 ₽/кг' },
          { tag: 'Лёгкий', title: 'Мята и лайм', desc: 'Освежающий мусс и миндальный дакуаз', meta: '2 500 ₽/кг' },
        ],
        footerNote: '© КРЕМ & ВАНИЛЬ · Кондитерский цех',
        palette,
      };
    case 'city':
      return {
        layout: 'hero-split',
        url: 'nord-arch.ru',
        brand: 'NORD ARCH',
        nav: ['Кварталы', 'Проекты', 'Бюро', 'Контакты'],
        badge: 'Архитектурное бюро',
        heading: 'Жилые кварталы нового поколения',
        lead: 'Проектируем городскую среду с чистой геометрией и светом. Отсканируйте 3D-макет квартала сверху, чтобы открыть презентацию в PDF.',
        cta: 'Смотреть проекты',
        secondaryCta: 'Связаться с бюро',
        proof: '380 000 м² спроектированной застройки',
        sceneHint: 'Покрутите 3D-квартал · Сверху — QR на портфолио',
        stats: [
          { val: '28 проектов', label: 'в Москве, Петербурге и Казани' },
          { val: 'BIM-подход', label: 'точная смета без перерасхода' },
          { val: '9 наград', label: 'архитектурных премий за 4 года' },
        ],
        sectionTitle: 'Знаковые объекты',
        cards: [
          { tag: 'Жильё', title: 'Квартал «Северный»', desc: 'Переменная этажность и закрытый двор-парк', meta: '2026' },
          { tag: 'Офисы', title: 'Деловой центр «Ось»', desc: 'Панорамное остекление и террасы на кровле', meta: '2025' },
          { tag: 'Культура', title: 'Павильон набережной', desc: 'Дерево, бетон и общественный лекторий', meta: '2025' },
        ],
        footerNote: '© NORD ARCH · Архитектура и урбанистика',
        palette,
      };
    case 'island':
      return {
        layout: 'hero-split',
        url: 'bereg-tours.ru',
        brand: 'БЕРЕГ',
        nav: ['Маршруты', 'Глэмпинги', 'Даты', 'Отзывы'],
        badge: mode === 'volcano' ? 'Экспедиция · Камчатка' : mode === 'winter' ? 'Зимние маршруты' : 'Авторские путешествия',
        heading: 'Уединённые острова и маршруты без толп',
        lead: 'Собираем небольшие группы до 10 человек. Наведите телефон на 3D-остров — откроется подробная карта маршрута и свободные даты.',
        cta: 'Выбрать даты',
        secondaryCta: 'Программа тура',
        proof: '98% гостей возвращаются в новое путешествие',
        sceneHint: 'Покрутите 3D-остров · Сверху — QR с картой маршрута',
        stats: [
          { val: 'до 10 человек', label: 'камерные группы без суеты' },
          { val: 'Всё включено', label: 'трансферы, гиды и проживание' },
          { val: '18 маршрутов', label: 'от Карелии до Камчатки' },
        ],
        sectionTitle: 'Ближайшие заезды',
        cards: [
          { tag: '5 дней', title: 'Ладожские шхеры', desc: 'Каяки, баня на воде и домики с видом на залив', meta: '48 000 ₽' },
          { tag: '7 дней', title: 'Вулканы и океан', desc: 'Треккинг, горячие источники и чёрный пляж', meta: '89 000 ₽' },
          { tag: '4 дня', title: 'Северный берег', desc: 'Киты, арктическая кухня и прогулка на катере', meta: '54 000 ₽' },
        ],
        footerNote: '© БЕРЕГ · Клуб авторских путешествий',
        palette,
      };
    case 'equalizer':
      return {
        layout: 'hero-split',
        url: 'volna-sound.ru',
        brand: 'ВОЛНА',
        nav: ['Релизы', 'Студия', 'Артисты', 'Бронь'],
        badge: 'Студия звука и лейбл',
        heading: 'Сведение, мастеринг и живой звук',
        lead: 'Аналоговое оборудование и акустика мирового уровня. Отсканируйте 3D-эквалайзер сверху, чтобы послушать свежий плейлист релизов.',
        cta: 'Забронировать студию',
        secondaryCta: 'Слушать примеры',
        proof: '320+ выпущенных треков на всех площадках',
        sceneHint: 'Покрутите эквалайзер · Сверху — QR на плейлист',
        stats: [
          { val: '24/7', label: 'доступ в аппаратную и тон-зал' },
          { val: '48 часов', label: 'средний срок сведения трека' },
          { val: 'Top-50', label: 'релизы клиентов в чартах' },
        ],
        sectionTitle: 'Услуги студии',
        cards: [
          { tag: 'Запись', title: 'Вокал и инструменты', desc: 'Парк ламповых микрофонов и звукорежиссёр', meta: '2 500 ₽/ч' },
          { tag: 'Пост', title: 'Сведение + мастеринг', desc: 'Чистый баланс для стримингов и винила', meta: 'от 9 000 ₽' },
          { tag: 'Под ключ', title: 'Продакшн сингла', desc: 'Аранжировка, запись и дистрибуция', meta: 'от 35 000 ₽' },
        ],
        footerNote: '© ВОЛНА Sound · Запись и мастеринг',
        palette,
      };
    case 'castle':
      return {
        layout: 'hero-split',
        url: 'fest-krepost.ru',
        brand: 'КРЕПОСТЬ',
        nav: ['Программа', 'Площадки', 'Билеты', 'Как добраться'],
        badge: 'Исторический фестиваль',
        heading: 'Два дня музыки, ремёсел и огней',
        lead: 'Ярмарка мастеров, концерты на главной площади и ночное шоу у стен крепости. Отсканируйте замок сверху для мгновенной покупки билета.',
        cta: 'Купить билет',
        secondaryCta: 'Карта фестиваля',
        proof: '15 000 гостей в прошлом сезоне · 0+ для всей семьи',
        sceneHint: 'Покрутите 3D-замок · Сверху — QR на покупку билета',
        stats: [
          { val: '3 сцены', label: 'живой фолк, оркестр и электроника' },
          { val: '60+ мастерских', label: 'кузница, керамика и стрельба из лука' },
          { val: '12–13 июля', label: 'Старая крепость, вход с 10:00' },
        ],
        sectionTitle: 'Что ждёт на площадке',
        cards: [
          { tag: 'День 1', title: 'Рыцарский турнир', desc: 'Показательные поединки и парад знамён', meta: '13:00' },
          { tag: 'Вечер', title: 'Симфония у стен', desc: 'Живой оркестр и световая проекция на башнях', meta: '20:30' },
          { tag: 'Семье', title: 'Детский городок', desc: 'Квесты по крепости и ремесленные игры', meta: 'Весь день' },
        ],
        footerNote: '© Фестиваль «КРЕПОСТЬ» · Билеты без комиссии',
        palette,
      };
      default:
      return getQrTemplate('tree', mode);

  }
}

function getTemplate(productId: ProductId, qrShape: TargetShapeType, qrMode?: string): SiteTemplate {
  if (productId === 'qr-morph') return getQrTemplate(qrShape, qrMode);

  switch (productId) {
    case 'gift-box':
      return {
        layout: 'promo-banner',
        url: 'luma-store.ru',
        brand: 'LUMA',
        nav: ['Каталог', 'Новинки', 'Подарки', 'Доставка'],
        badge: 'Подарок новым покупателям',
        heading: 'Откройте коробку — внутри ваш промокод',
        lead: 'Кликните по 3D-подарку прямо здесь, чтобы забрать скидку на первый заказ и сразу применить её в корзине.',
        cta: 'Перейти в каталог',
        secondaryCta: 'Условия акции',
        proof: '14 200+ заказов · Доставка по РФ от 1 дня',
        sceneHint: 'Нажмите на коробку, чтобы открыть скидку',
        stats: [
          { val: '−20%', label: 'скидка по промокоду из коробки' },
          { val: '2 часа', label: 'экспресс-доставка по городу' },
          { val: '30 дней', label: 'простой обмен и возврат' },
        ],
        sectionTitle: 'Популярное в каталоге',
        cards: [
          { tag: 'Хит', title: 'Керамический диффузор', desc: 'Матовая глазурь и тёплый аромат сандала', meta: '3 490 ₽' },
          { tag: 'Новинка', title: 'Плед из мериноса', desc: 'Невесомая вязка в трёх базовых оттенках', meta: '6 900 ₽' },
          { tag: 'Набор', title: 'Чайный сет ручной работы', desc: 'Чайник и две пиалы из белой глины', meta: '4 200 ₽' },
        ],
        footerNote: '© LUMA Home · Ежедневно 10:00–21:00',
        palette: {
          bgLight: 'linear-gradient(165deg, #fff2f1 0%, #ffffff 50%, #fdf5f4 100%)',
          bgDark: 'linear-gradient(165deg, #241013 0%, #110c0d 60%, #1c1012 100%)',
          surfaceLight: 'rgba(255, 242, 241, 0.76)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#e5484d',
          accentSoft: 'rgba(229, 72, 77, 0.13)',
          accentInk: '#ffffff',
          inkLight: '#361316',
          mutedLight: '#785457',
          borderLight: 'rgba(229, 72, 77, 0.2)',
          borderDark: 'rgba(229, 72, 77, 0.28)',
        },
      };

    case 'sale-timer':
      return {
        layout: 'timer-center',
        url: 'skill-sprint.ru',
        brand: 'SPRINT',
        nav: ['Программа', 'Спикеры', 'Тарифы', 'Вопросы'],
        badge: 'Поток №14 · Закрытие набора',
        heading: 'Спеццена действует до конца отсчёта',
        lead: 'Забронируйте место на курсе по продуктовому дизайну — после обнуления таймера стоимость поднимется на 25%.',
        cta: 'Занять место',
        secondaryCta: 'Скачать программу',
        proof: '1 800+ выпускников · Рассрочка 0% на 6 месяцев',
        sceneHint: 'Живой 3D-таймер обновляется каждую секунду',
        stats: [
          { val: '8 недель', label: 'практики на реальных брифах' },
          { val: '12 мест', label: 'осталось по текущей цене' },
          { val: '94%', label: 'учеников защищают диплом' },
        ],
        sectionTitle: 'Тарифы обучения',
        cards: [
          { tag: 'Базовый', title: 'Самостоятельный', desc: 'Доступ ко всем урокам, шаблонам и чату потока', meta: '24 900 ₽' },
          { tag: 'Хит', title: 'С наставником', desc: 'Еженедельные разборы работ и помощь с портфолио', meta: '39 900 ₽' },
          { tag: 'Про', title: 'Индивидуальный', desc: 'Личные созвоны с арт-директором и стажировка', meta: '64 900 ₽' },
        ],
        footerNote: '© SPRINT Education · Поддержка студентов 24/7',
        palette: {
          bgLight: 'linear-gradient(165deg, #fff8ea 0%, #ffffff 52%, #fdf4e2 100%)',
          bgDark: 'linear-gradient(165deg, #24190a 0%, #120f0a 60%, #1c150a 100%)',
          surfaceLight: 'rgba(255, 248, 234, 0.8)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#e59217',
          accentSoft: 'rgba(229, 146, 23, 0.15)',
          accentInk: '#241504',
          inkLight: '#332008',
          mutedLight: '#756045',
          borderLight: 'rgba(229, 146, 23, 0.24)',
          borderDark: 'rgba(245, 165, 36, 0.28)',
        },
      };

    case 'qr-card':
      return {
        layout: 'contact-card',
        url: 'nord.studio',
        brand: 'NORD',
        nav: ['Проекты', 'Услуги', 'Команда', 'Контакты'],
        badge: 'Прямой контакт',
        heading: 'Давайте обсудим ваш проект',
        lead: 'Нажмите на 3D-визитку, чтобы перевернуть её — на обороте QR-код, который за секунду сохранит номер, Telegram и почту в телефон.',
        cta: 'Написать в Telegram',
        secondaryCta: 'Скачать презентацию',
        proof: 'Отвечаем в течение 2 часов в рабочие дни',
        sceneHint: 'Нажмите на визитку, чтобы перевернуть к QR',
        stats: [
          { val: 'Москва', label: 'Берсеневская наб., 6с3' },
          { val: 'hello@nord.studio', label: 'для брифов и предложений' },
          { val: '10:00–19:00', label: 'встречи в офисе и онлайн' },
        ],
        sectionTitle: 'Чем помогаем бизнесу',
        cards: [
          { tag: '01', title: 'Сайты и лендинги', desc: 'Дизайн, разработка и интерактивные 3D-блоки', meta: 'от 3 недель' },
          { tag: '02', title: 'Веб-сервисы', desc: 'Личные кабинеты, дизайн-системы и прототипы', meta: 'от 5 недель' },
          { tag: '03', title: 'Аудит конверсии', desc: 'Разбор узких мест и быстрые правки', meta: '5 дней' },
        ],
        footerNote: '© NORD Studio · Продуктовый и веб-дизайн',
        palette: {
          bgLight: 'linear-gradient(165deg, #eff2f7 0%, #ffffff 55%, #eaeef5 100%)',
          bgDark: 'linear-gradient(165deg, #141922 0%, #0c0f15 60%, #121720 100%)',
          surfaceLight: 'rgba(239, 242, 247, 0.84)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#4a5c75',
          accentSoft: 'rgba(74, 92, 117, 0.13)',
          accentInk: '#ffffff',
          inkLight: '#18202c',
          mutedLight: '#5c6675',
          borderLight: 'rgba(74, 92, 117, 0.2)',
          borderDark: 'rgba(130, 150, 178, 0.24)',
        },
      };

    case 'voxel-logo':
      return {
        layout: 'logo-center',
        url: 'forma-design.ru',
        brand: 'FORMA',
        nav: ['Кейсы', 'Подход', 'Шоурил', 'Связаться'],
        badge: 'Дизайн и креативная разработка',
        heading: 'Создаём цифровые бренды с характером',
        lead: 'Наведите курсор на объёмный знак — он реагирует на движение и работает на 60 fps без тяжёлых видеофайлов.',
        cta: 'Начать проект',
        secondaryCta: 'Смотреть шоурил',
        proof: 'Awwwards · CSSDA · Behance Featured',
        sceneHint: 'Проведите курсором по воксельному логотипу',
        stats: [
          { val: '42 запуска', label: 'флагманские сайты и айдентика' },
          { val: '60 fps', label: 'лёгкий WebGL на любом экране' },
          { val: '100% в срок', label: 'прозрачные спринты по неделям' },
        ],
        sectionTitle: 'Избранные направления',
        cards: [
          { tag: '01', title: 'Айдентика', desc: 'Логотип, типографика, палитра и 3D-носители', meta: 'от 3 недель' },
          { tag: '02', title: 'Флагманские сайты', desc: 'Нестандартная вёрстка и живой интерактив', meta: 'от 4 недель' },
          { tag: '03', title: 'Поддержка', desc: 'Развитие продукта и быстрые гипотезы', meta: 'Ретейнер' },
        ],
        footerNote: '© FORMA Digital · Санкт-Петербург',
        palette: {
          bgLight: 'linear-gradient(165deg, #f3eeff 0%, #ffffff 55%, #efeaff 100%)',
          bgDark: 'linear-gradient(165deg, #1b1133 0%, #0d0a17 60%, #160e29 100%)',
          surfaceLight: 'rgba(243, 238, 255, 0.8)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#7c4dff',
          accentSoft: 'rgba(124, 77, 255, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#211342',
          mutedLight: '#635682',
          borderLight: 'rgba(124, 77, 255, 0.22)',
          borderDark: 'rgba(139, 92, 246, 0.3)',
        },
      };

    case 'voxel-morph':
      return {
        layout: 'case-study',
        url: 'remont-pro.ru',
        brand: 'ПРОЕКТ',
        nav: ['Портфолио', 'Цены', 'Этапы', 'Калькулятор'],
        badge: 'Кейс · ЖК «Символ», 74 м²',
        heading: 'Посмотрите преображение «до и после»',
        lead: 'Передвиньте ползунок или кликните по кадру — воксели пересоберут черновую отделку в готовый интерьер. Срок: 3,5 месяца.',
        cta: 'Рассчитать смету',
        secondaryCta: 'Все объекты',
        proof: 'Гарантия 3 года по договору · Фиксированная смета',
        sceneHint: 'Потяните ползунок, чтобы пересобрать интерьер',
        stats: [
          { val: '210+', label: 'сданных квартир и офисов' },
          { val: '0 ₽', label: 'выезд инженера и замер' },
          { val: 'Фотоотчёт', label: 'каждую пятницу в Telegram' },
        ],
        sectionTitle: 'Другие объекты',
        cards: [
          { tag: '92 м²', title: 'ЖК «Остров»', desc: 'Кухня-гостиная, скрытые двери и тёплый свет', meta: '4 месяца' },
          { tag: '58 м²', title: 'Апартаменты в центре', desc: 'Ремонт под ключ с меблировкой и техникой', meta: '2,5 месяца' },
          { tag: '115 м²', title: 'Таунхаус в Сколково', desc: 'Авторский надзор и натуральный шпон', meta: '5 месяцев' },
        ],
        footerNote: '© ПРОЕКТ Интерьер · Работаем по договору',
        palette: {
          bgLight: 'linear-gradient(165deg, #fdf0f5 0%, #ffffff 55%, #faeff4 100%)',
          bgDark: 'linear-gradient(165deg, #24101c 0%, #120b10 60%, #1d0e17 100%)',
          surfaceLight: 'rgba(253, 240, 245, 0.8)',
          surfaceDark: 'rgba(255, 255, 255, 0.04)',
          accent: '#d6457d',
          accentSoft: 'rgba(214, 69, 125, 0.14)',
          accentInk: '#ffffff',
          inkLight: '#361324',
          mutedLight: '#755364',
          borderLight: 'rgba(214, 69, 125, 0.2)',
          borderDark: 'rgba(224, 86, 138, 0.28)',
        },
      };
  }
}

export function SitePreviewModal({
  isOpen,
  onClose,
  productId,
  qrShape = 'tree',
  qrMode,
  size,
  onSizeChange,
  slotRef,
  onViewportChange,
}: SitePreviewModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsSmallScreen(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const notify = () => {
      const el = slotRef.current;
      if (!el || el.clientWidth === 0 || el.clientHeight === 0) return;
      onViewportChange?.();
    };
    const t1 = window.setTimeout(notify, 50);
    const t2 = window.setTimeout(notify, 220);

    const el = slotRef.current;
    let ro: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(notify);
      ro.observe(el);
    }
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro?.disconnect();
    };
  }, [isOpen, device, isSmallScreen, size, theme, productId, qrShape, qrMode]);

  if (!isOpen) return null;

  const tpl = getTemplate(productId, qrShape, qrMode);
  const p = tpl.palette;
  const isDark = theme === 'dark';
  const isMobile = isSmallScreen || device === 'mobile';
  const showPhoneFrame = isMobile && !isSmallScreen;
  const showLaptopFrame = !isMobile && !isSmallScreen;

  const pageBg = isDark ? p.bgDark : p.bgLight;
  const surfaceBg = isDark ? p.surfaceDark : p.surfaceLight;
  const borderCol = isDark ? p.borderDark : p.borderLight;
  const headingCol = isDark ? '#f5f7fa' : p.inkLight;
  const mutedCol = isDark ? 'rgba(245, 247, 250, 0.68)' : p.mutedLight;

  const getStageBoxClass = () => {
    if (productId === 'sale-timer') {
      return isMobile ? 'h-[340px]' : 'h-[390px]';
    }
    if (productId === 'gift-box') {
      return isMobile ? 'h-[310px]' : 'h-[345px]';
    }
    if (productId === 'voxel-logo') {
      return isMobile ? 'h-[260px]' : 'h-[295px]';
    }
    if (productId === 'voxel-morph') {
      return isMobile ? 'h-[310px]' : 'h-[355px]';
    }
    return isMobile ? 'h-[320px]' : 'h-[370px]';
  };

  const getStageScale = () => {
    const sizeFactor = size === 's' ? 0.78 : size === 'l' ? 0.96 : 0.88;
    if (productId === 'sale-timer') return (isMobile ? 0.78 : 0.86) * sizeFactor;
    if (productId === 'gift-box') return (isMobile ? 0.86 : 0.92) * sizeFactor;
    if (productId === 'voxel-morph') return (isMobile ? 0.86 : 0.92) * sizeFactor;
    return (isMobile ? 0.9 : 0.92) * sizeFactor;
  };

  const renderStage = (maxWidthClass = 'max-w-[460px]') => (
    <div className={`w-full ${maxWidthClass} mx-auto flex flex-col items-center`}>
      <div className={`w-full ${getStageBoxClass()} relative overflow-visible flex items-center justify-center`}>
        <div
          className="pointer-events-none absolute inset-4 rounded-full blur-[54px]"
          style={{
            background: `radial-gradient(circle, ${p.accentSoft} 0%, transparent 72%)`,
            opacity: isDark ? 0.9 : 1,
          }}
        />
        <div
          ref={slotRef}
          className="gx-site-preview-slot relative z-10 w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${getStageScale()})`, transformOrigin: 'center center' }}
        />
      </div>
      <div
        className="mt-4 relative z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold border"
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.78)',
          borderColor: borderCol,
          color: mutedCol,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
        <span>{tpl.sceneHint}</span>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .gx-site-preview-slot [class*="lg:translate-x-"],
        .gx-site-preview-slot [class*="translate-x-"] {
          translate: 0px 0px !important;
          --tw-translate-x: 0px !important;
          transform: none !important;
        }
        .gx-site-preview-slot [class*="lg:pl-"] {
          padding-left: 0px !important;
        }
        .gx-site-preview-slot [class*="lg:ml-"] {
          margin-left: 0px !important;
        }
        .gx-site-preview-slot [class*="bottom-2"][class*="z-20"],
        .gx-site-preview-slot .bottom-2.z-20 {
          display: none !important;
        }
        .gx-site-preview-slot [class*="pb-20"],
        .gx-site-preview-slot [class*="pb-24"] {
          padding-bottom: 0 !important;
        }
        .gx-site-preview-slot > div,
        .gx-site-preview-slot > div > div {
          overflow: visible !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .gx-site-preview-slot canvas {
          margin-left: auto !important;
          margin-right: auto !important;
          display: block !important;
        }
        .gx-device-screen-mobile {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .gx-device-screen-mobile::-webkit-scrollbar {
          display: none;
        }
        .gx-device-screen-desktop {
          scrollbar-width: thin;
        }
      `}</style>

      <div className="relative w-full max-w-6xl h-[100dvh] sm:h-[calc(100dvh-1.25rem)] flex flex-col rounded-none sm:rounded-[2rem] bg-[#ebe6df] border-0 sm:border border-[#ddd6ca] shadow-2xl overflow-hidden">
        {/* Browser top bar */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-[#e5dfd2]">
          <div className="hidden sm:flex items-center gap-2">
            <span className="flex items-center gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8a39b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ecd08f]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#a9d8a0]" />
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f6f3ee] border border-[#ebe5da] text-[11px] font-mono font-bold text-[#78716c] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
              https://{tpl.url}
            </span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
            <div className="p-0.5 rounded-full bg-[#f3efe7] border border-[#e5dfd2] inline-flex text-[11px] font-extrabold">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  !isDark ? 'bg-white text-[#132A22] shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'
                }`}
              >
                Светлый
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'
                }`}
              >
                Тёмный
              </button>
            </div>

            <div className="hidden sm:inline-flex p-0.5 rounded-full bg-[#f3efe7] border border-[#e5dfd2] text-[11px] font-extrabold">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  !isMobile ? 'bg-white text-[#132A22] shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'
                }`}
              >
                ПК
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  isMobile ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'
                }`}
              >
                Телефон
              </button>
            </div>

            <div className="p-0.5 rounded-full bg-[#f3efe7] border border-[#e5dfd2] inline-flex text-[11px] font-extrabold">
              {(['s', 'm', 'l'] as WidgetSize[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSizeChange(s)}
                  className={`w-7 py-1 rounded-full uppercase transition-colors cursor-pointer ${
                    size === s ? 'bg-[#132A22] text-white shadow-sm' : 'text-[#78716c] hover:text-[#132A22]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть примерку"
              className="w-8 h-8 rounded-full bg-[#F0EBE9] hover:bg-[#e5dfd2] text-[#132A22] font-bold flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Device frame viewport */}
        <div className="flex-1 min-h-0 p-0 sm:p-5 flex justify-center items-center overflow-hidden">
          <div
            className={`w-full h-full min-h-0 flex flex-col items-center ${
              isSmallScreen ? 'max-w-none' : isMobile ? 'max-w-[404px] max-h-[760px]' : 'max-w-5xl'
            }`}
          >
            {/* Outer device bezel: none on real phone, Phone bezel or Laptop on desktop */}
            <div
              className={`relative w-full flex-1 min-h-0 flex flex-col ${
                isSmallScreen
                  ? ''
                  : showPhoneFrame
                    ? 'bg-[#17181c] ring-1 ring-white/15 shadow-[0_28px_65px_-18px_rgba(0,0,0,0.45)] rounded-[3rem] p-[10px]'
                    : 'bg-[#17181c] ring-1 ring-white/15 shadow-[0_28px_65px_-18px_rgba(0,0,0,0.45)] rounded-t-[1.5rem] rounded-b-[0.75rem] p-[10px] pt-[18px]'
              }`}
            >
              {showPhoneFrame && (
                <>
                  <span className="pointer-events-none hidden sm:block absolute -left-[3px] top-24 w-[3px] h-7 rounded-l-sm bg-[#2d3036]" />
                  <span className="pointer-events-none hidden sm:block absolute -left-[3px] top-36 w-[3px] h-11 rounded-l-sm bg-[#2d3036]" />
                  <span className="pointer-events-none hidden sm:block absolute -right-[3px] top-36 w-[3px] h-14 rounded-r-sm bg-[#2d3036]" />
                </>
              )}
              {showLaptopFrame && (
                <span className="pointer-events-none absolute top-[6px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a2d35] ring-1 ring-white/10" />
              )}

              {/* Inner screen glass */}
              <div
                className={`flex-1 min-h-0 overflow-hidden flex flex-col relative ${
                  isSmallScreen ? 'rounded-none' : showPhoneFrame ? 'rounded-[2.4rem]' : 'rounded-[0.75rem]'
                }`}
                style={{ background: pageBg, color: headingCol }}
              >
                {/* Phone status bar + Dynamic Island (desktop preview only) */}
                {showPhoneFrame && (
                  <div
                    className="shrink-0 relative z-20 px-6 pt-2.5 pb-2 flex items-center justify-between text-[11px] font-bold select-none"
                    style={{
                      background: isDark ? 'rgba(10,12,16,0.88)' : 'rgba(255,255,255,0.88)',
                      color: isDark ? '#f5f7fa' : '#18181b',
                    }}
                  >
                    <span>9:41</span>
                    <span className="w-[84px] h-[22px] rounded-full bg-[#0e0f12] flex items-center justify-end pr-2">
                      <span className="w-2 h-2 rounded-full bg-[#1e2636] ring-1 ring-white/10" />
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <span>5G</span>
                      <span className="inline-flex items-center w-5 h-2.5 rounded-[3px] border border-current p-[1.5px]">
                        <span className="w-full h-full rounded-[1px] bg-current" />
                      </span>
                    </span>
                  </div>
                )}

                {/* Scrollable site content inside the screen */}
                <div
                  className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col relative ${
                    isMobile ? 'gx-device-screen-mobile' : 'gx-device-screen-desktop'
                  }`}
                  style={{ colorScheme: isDark ? 'dark' : 'light' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-35"
                    style={{
                      backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div
                    className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px]"
                    style={{ background: p.accent, opacity: isDark ? 0.22 : 0.14 }}
                  />

                  <header
                    className="shrink-0 relative z-10 px-5 sm:px-9 min-h-[72px] py-3.5 flex items-center justify-between border-b backdrop-blur-md"
                    style={{ borderColor: borderCol, background: isDark ? 'rgba(10,12,16,0.65)' : 'rgba(255,255,255,0.78)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm"
                        style={{ background: p.accent, color: p.accentInk }}
                      >
                        {tpl.brand.slice(0, 1)}
                      </span>
                      <span className="text-[13px] font-black tracking-[0.2em] uppercase">{tpl.brand}</span>
                    </div>

                    {isMobile ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3.5 py-2 rounded-full text-[11px] font-extrabold shadow-sm"
                          style={{ background: p.accent, color: p.accentInk }}
                        >
                          {tpl.cta}
                        </span>
                      </div>
                    ) : (
                      <>
                        <nav className="flex items-center gap-7 text-[13px] font-bold" style={{ color: mutedCol }}>
                          {tpl.nav.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </nav>
                        <span
                          className="px-4 py-2 rounded-full text-xs font-extrabold shadow-sm select-none"
                          style={{ background: p.accent, color: p.accentInk }}
                        >
                          {tpl.cta}
                        </span>
                      </>
                    )}
                  </header>

                  {tpl.layout === 'timer-center' && (
                    <section className="shrink-0 relative z-10 px-5 sm:px-10 pt-7 pb-5 flex flex-col items-center text-center">
                      <span
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border"
                        style={{ background: surfaceBg, borderColor: borderCol, color: isDark ? p.accent : p.inkLight }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                        {tpl.badge}
                      </span>
                      <h3 className={`mt-3.5 font-black tracking-tight leading-[1.08] max-w-2xl ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
                        {tpl.heading}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed" style={{ color: mutedCol }}>
                        {tpl.lead}
                      </p>
                      <div className="mt-3 w-full">{renderStage('max-w-[660px]')}</div>
                      <div className="mt-4 text-[11px] font-bold" style={{ color: mutedCol }}>
                        {tpl.proof}
                      </div>
                    </section>
                  )}

                  {tpl.layout === 'logo-center' && (
                    <section className="shrink-0 relative z-10 px-5 sm:px-10 py-7 sm:py-9 flex flex-col items-center text-center">
                      <span
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border"
                        style={{ background: surfaceBg, borderColor: borderCol, color: isDark ? p.accent : p.inkLight }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                        {tpl.badge}
                      </span>
                      <div className="mt-3 w-full">{renderStage('max-w-[420px]')}</div>
                      <h3 className={`mt-4 font-black tracking-tight leading-[1.06] max-w-2xl ${isMobile ? 'text-2xl' : 'text-3xl sm:text-[2.6rem]'}`}>
                        {tpl.heading}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm font-semibold max-w-lg leading-relaxed" style={{ color: mutedCol }}>
                        {tpl.lead}
                      </p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                        <span className="px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold shadow-md select-none" style={{ background: p.accent, color: p.accentInk }}>
                          {tpl.cta}
                        </span>
                        <span className="px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold border select-none" style={{ borderColor: borderCol, background: surfaceBg }}>
                          {tpl.secondaryCta}
                        </span>
                      </div>
                    </section>
                  )}

                  {tpl.layout === 'promo-banner' && (
                    <section className="shrink-0 relative z-10 px-5 sm:px-10 pt-6 pb-4">
                      <div
                        className={`rounded-[1.75rem] border p-5 sm:p-8 grid gap-5 items-center ${
                          isMobile ? 'grid-cols-1 text-center' : 'grid-cols-12 text-left'
                        }`}
                        style={{ background: surfaceBg, borderColor: borderCol }}
                      >
                        <div className={isMobile ? 'flex flex-col items-center' : 'col-span-6 flex flex-col items-start'}>
                          <span
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border"
                            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff', borderColor: borderCol, color: p.accent }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                            {tpl.badge}
                          </span>
                          <h3 className={`mt-3.5 font-black tracking-tight leading-[1.08] ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                            {tpl.heading}
                          </h3>
                          <p className="mt-2.5 text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: mutedCol }}>
                            {tpl.lead}
                          </p>
                          <div className={`mt-5 flex flex-wrap gap-2.5 ${isMobile ? 'justify-center' : ''}`}>
                            <span className="px-5 py-2.5 rounded-full text-xs font-extrabold shadow-md select-none" style={{ background: p.accent, color: p.accentInk }}>
                              {tpl.cta}
                            </span>
                            <span className="px-4 py-2.5 rounded-full text-xs font-extrabold border select-none" style={{ borderColor: borderCol }}>
                              {tpl.secondaryCta}
                            </span>
                          </div>
                        </div>
                        <div className={isMobile ? 'w-full' : 'col-span-6'}>{renderStage('max-w-[420px]')}</div>
                      </div>
                    </section>
                  )}

                  {(tpl.layout === 'hero-split' || tpl.layout === 'contact-card' || tpl.layout === 'case-study') && (
                    <section
                      className={`shrink-0 relative z-10 px-5 sm:px-10 ${isMobile ? 'py-6' : 'py-8 sm:py-10'} grid gap-5 sm:gap-8 items-center ${
                        isMobile ? 'grid-cols-1 text-center' : 'grid-cols-12 text-left'
                      }`}
                    >
                      <div className={isMobile ? 'flex flex-col items-center' : 'col-span-6 flex flex-col items-start'}>
                        <span
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold border"
                          style={{ background: surfaceBg, borderColor: borderCol, color: isDark ? p.accent : p.inkLight }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                          {tpl.badge}
                        </span>

                        <h3 className={`mt-3.5 font-black tracking-tight leading-[1.06] ${isMobile ? 'text-[1.65rem]' : 'text-3xl sm:text-[2.4rem]'}`}>
                          {tpl.heading}
                        </h3>

                        <p className="mt-3 text-xs sm:text-sm font-semibold leading-relaxed max-w-md" style={{ color: mutedCol }}>
                          {tpl.lead}
                        </p>

                        <div className={`mt-5 flex flex-wrap gap-2.5 ${isMobile ? 'justify-center' : 'justify-start'}`}>
                          <span
                            className="px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold shadow-md select-none"
                            style={{ background: p.accent, color: p.accentInk }}
                          >
                            {tpl.cta}
                          </span>
                          <span
                            className="px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-extrabold border select-none"
                            style={{ borderColor: borderCol, background: surfaceBg }}
                          >
                            {tpl.secondaryCta}
                          </span>
                        </div>

                        <div
                          className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold"
                          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)', borderColor: borderCol, color: mutedCol }}
                        >
                          <span className="flex -space-x-1.5">
                            <span className="w-4 h-4 rounded-full border border-white/80" style={{ background: p.accent }} />
                            <span className="w-4 h-4 rounded-full border border-white/80 opacity-80" style={{ background: p.accent }} />
                            <span className="w-4 h-4 rounded-full border border-white/80 opacity-60" style={{ background: p.accent }} />
                          </span>
                          <span>{tpl.proof}</span>
                        </div>
                      </div>

                      <div className={isMobile ? 'w-full mt-1' : 'col-span-6'}>{renderStage('max-w-[440px]')}</div>
                    </section>
                  )}

                  <section
                    className={`shrink-0 relative z-10 mx-5 sm:mx-10 mt-1 rounded-2xl border px-5 py-4 grid gap-4 ${
                      isMobile ? 'grid-cols-1 text-center' : 'grid-cols-3'
                    }`}
                    style={{ background: surfaceBg, borderColor: borderCol }}
                  >
                    {tpl.stats.map((st) => (
                      <div key={st.val}>
                        <div className="text-base sm:text-lg font-black tracking-tight" style={{ color: isDark ? p.accent : p.inkLight }}>
                          {st.val}
                        </div>
                        <div className="text-[11px] font-semibold mt-0.5" style={{ color: mutedCol }}>
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="shrink-0 relative z-10 px-5 sm:px-10 py-7">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-black tracking-tight">{tpl.sectionTitle}</h4>
                      <span className="text-xs font-extrabold" style={{ color: p.accent }}>
                        Смотреть все →
                      </span>
                    </div>

                    <div className={`grid gap-3.5 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                      {tpl.cards.map((c) => (
                        <div
                          key={c.title}
                          className="p-4 rounded-2xl border flex flex-col justify-between gap-3 relative overflow-hidden"
                          style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)', borderColor: borderCol }}
                        >
                          <div className="absolute top-0 inset-x-0 h-1" style={{ background: p.accent, opacity: 0.55 }} />
                          <div className="pt-1">
                            <span
                              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                              style={{
                                background: p.accentSoft,
                                color: isDark ? p.accent : p.inkLight,
                              }}
                            >
                              {c.tag}
                            </span>
                            <div className="mt-2.5 text-sm font-black">{c.title}</div>
                            <p className="mt-1 text-xs font-semibold leading-snug" style={{ color: mutedCol }}>
                              {c.desc}
                            </p>
                          </div>
                          <div className="pt-2.5 border-t flex items-center justify-between text-xs font-black" style={{ borderColor: borderCol }}>
                            <span>{c.meta}</span>
                            <span style={{ color: p.accent }}>Подробнее →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <footer
                    className="shrink-0 relative z-10 px-5 sm:px-10 pt-4 pb-16 sm:pb-4 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold"
                    style={{ borderColor: borderCol, color: mutedCol }}
                  >
                    <span>{tpl.footerNote}</span>
                    <span>3D-виджет · Gridika</span>
                  </footer>
                </div>

                {/* Phone home indicator bar (desktop preview only) */}
                {showPhoneFrame && (
                  <div
                    className="shrink-0 relative z-20 py-2 flex justify-center"
                    style={{ background: isDark ? 'rgba(10,12,16,0.88)' : 'rgba(255,255,255,0.88)' }}
                  >
                    <span
                      className="w-28 h-1 rounded-full"
                      style={{ background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.22)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Laptop keyboard deck + trackpad (desktop PC mode only) */}
            {showLaptopFrame && (
              <div className="shrink-0 w-full flex flex-col items-center select-none pointer-events-none">
                <div className="w-[74%] h-[5px] bg-[#141519] rounded-b-sm" />

                <div
                  className="w-[106%] max-w-[calc(100%+2.75rem)] pt-2 pb-2 px-[8%] bg-gradient-to-b from-[#d9d5ce] via-[#e6e2dc] to-[#ccc7bf] border-t border-white/70 flex flex-col items-center"
                  style={{ clipPath: 'polygon(2.5% 0%, 97.5% 0%, 100% 100%, 0% 100%)' }}
                >
                  <div className="w-full max-w-[640px] p-[5px] rounded-[6px] bg-[#bab5ac]/75 shadow-inner flex flex-col gap-[2.5px]">
                    <div className="flex w-full gap-[2.5px]">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[4px] rounded-[1.5px] bg-[#1d1f24] border-t border-white/10"
                        />
                      ))}
                    </div>

                    <div className="flex w-full gap-[2.5px]">
                      {Array.from({ length: 13 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                        />
                      ))}
                      <span className="flex-[1.7] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    </div>

                    <div className="flex w-full gap-[2.5px]">
                      <span className="flex-[1.45] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                        />
                      ))}
                      <span className="flex-[1.25] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    </div>

                    <div className="flex w-full gap-[2.5px]">
                      <span className="flex-[1.75] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      {Array.from({ length: 11 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                        />
                      ))}
                      <span className="flex-[1.95] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    </div>

                    <div className="flex w-full gap-[2.5px]">
                      <span className="flex-[2.25] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                        />
                      ))}
                      <span className="flex-[2.45] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    </div>

                    <div className="flex w-full gap-[2.5px] items-end">
                      <span className="flex-[1.15] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-[1.15] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-[5.4] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-[1.15] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-[1.15] h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                      <span className="flex-1 h-[7px] flex flex-col gap-[1px]">
                        <span className="flex-1 rounded-[1px] bg-[#1d1f24]" />
                        <span className="flex-1 rounded-[1px] bg-[#1d1f24]" />
                      </span>
                      <span className="flex-1 h-[7px] rounded-[2px] bg-[#1d1f24] border-t border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    </div>
                  </div>

                  <div className="mt-1.5 w-[20%] max-w-[140px] h-4 rounded-[4px] bg-[#d0cbc3]/85 border border-black/10 shadow-inner" />
                </div>

                <div className="w-[106%] max-w-[calc(100%+2.75rem)] h-2.5 rounded-b-[12px] bg-gradient-to-b from-[#c4bfb6] via-[#aba59c] to-[#8b857c] shadow-[0_16px_30px_-8px_rgba(0,0,0,0.38)] flex justify-center">
                  <span className="w-20 h-1 rounded-b-full bg-[#7d776e]/65" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating return button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute bottom-4 right-5 z-30 h-9 px-5 rounded-full bg-[#132A22]/95 hover:bg-[#1d3a2f] text-[#F0EBE9] text-xs font-extrabold cursor-pointer shadow-lg backdrop-blur-sm transition-all active:scale-[0.97]"
        >
          ← Вернуться в студию
        </button>
      </div>
    </div>
  );
}
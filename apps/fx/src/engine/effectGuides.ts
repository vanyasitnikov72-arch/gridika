import type { ProductId } from '../data/products';

export interface SimField {
  id: string;
  label: string;
  originalVal: string;
  newVal: string;
  fieldKey: string;
  description?: string;
  range?: string;
  type?: 'text' | 'number' | 'color' | 'url' | 'phone';
}

export interface ForbiddenItem {
  codeSnippet: string;
  title: string;
  desc: string;
  consequence: string;
}

export interface EffectGuide {
  title: string;
  editLines: string[];
  editableFields: SimField[];
  breakLines: string[];
  forbiddenItems?: ForbiddenItem[];
  breakTarget: {
    fieldKey: string;
    originalVal: string;
    attemptedVal: string;
    brokenWhy: string;
    cameraTruth: string;
  };
  studioActionText: string;
}

export const EFFECT_GUIDES: Record<ProductId, EffectGuide> = {
  'qr-card': {
    title: 'Визитка с QR',
    editLines: [
      "// Файл визитки (открыт в Блокноте)",
      "const cardConfig = {",
      "  name: 'Иван Иванов',",
      "  role: 'Основатель example.com',",
      "  phone: '+7 915 886-00-69',",
      "  email: 'hello@example.com',",
      "  maxWidth: '440px',",
      "  minWidth: '280px',",
      "};",
    ],
    editableFields: [
      {
        id: 'phone',
        label: 'Номер телефона',
        fieldKey: 'phone',
        originalVal: '+7 915 886-00-69',
        newVal: '+7 999 123-45-67',
        description: 'Отображается на лицевой стороне 3D-визитки, кликабелен для звонка с сайта',
        range: 'Любой номер в одинарных кавычках: \'+7 (999) 000-00-00\'',
        type: 'phone',
      },
      {
        id: 'name',
        label: 'Имя и фамилия',
        fieldKey: 'name',
        originalVal: 'Иван Иванов',
        newVal: 'Алексей Смирнов',
        description: 'Имя владельца на лицевой стороне 3D-визитки',
        range: 'До 30 символов в одинарных кавычках: \'Иван Иванов\'',
        type: 'text',
      },
      {
        id: 'role',
        label: 'Должность / статус',
        fieldKey: 'role',
        originalVal: 'Основатель example.com',
        newVal: 'Директор по развитию',
        description: 'Подпись под именем (профессия, компания или статус)',
        range: 'До 40 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'email',
        label: 'Email адрес',
        fieldKey: 'email',
        originalVal: 'hello@example.com',
        newVal: 'support@example.com',
        description: 'Электронная почта для быстрой связи',
        range: 'Корректный email в кавычках: \'mail@site.ru\'',
        type: 'text',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '440px',
        newVal: '580px',
        description: 'Ограничивает максимальный размер 3D-визитки на больших экранах',
        range: 'Пресеты: S (340px), M (440px), L (580px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '280px',
        newVal: '320px',
        description: 'Порог сжатия визитки на экранах смартфонов для сохранения читаемости текста',
        range: 'от 260px до 340px, стандарт: 280px',
        type: 'text',
      },
    ],
    breakLines: [
      "// 3D-модель QR-кода на обороте визитки",
      "const QR_VOXELS_3D = [0x1f, 0x4a, 0x8b, /* 14 000 вокселей под old-link.ru */];",
      "const targetUrl = 'https://old-link.ru';",
    ],
    forbiddenItems: [
      {
        title: 'Строка целевой ссылки QR-кода (targetUrl)',
        codeSnippet: "targetUrl: 'https://mysite.ru', // зашита в 3D-кубики",
        desc: 'Физический 3D-узор из 14 000 объёмных вокселей на обороте визитки сгенерирован под конкретный адрес. Камера телефона сканирует расположение кубиков, а не строчку текста в файле.',
        consequence: 'Если изменить ссылку в файле — 3D-кубики не перерисуются, и камера по-прежнему откроет старый сайт.',
      },
      {
        title: 'Массив 3D-кубиков визитки (QR_VOXELS_3D)',
        codeSnippet: 'const QR_VOXELS_3D = "..."; // 14 000 вокселей',
        desc: 'Длинная строка закодированных трёхмерных координат каждого вокселя для движка Three.js.',
        consequence: 'Если удалить или изменить хотя бы один символ — 3D-модель сломается и исчезнет с экрана.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Библиотека Three.js, которая отвечает за рендеринг объёмной 3D-графики, освещение и вращение.',
        consequence: 'Если удалить эту строку — браузер не сможет отобразить 3D-визитку, останется пустое место.',
      },
    ],
    breakTarget: {
      fieldKey: 'targetUrl',
      originalVal: 'https://old-link.ru',
      attemptedVal: 'https://new-link.ru',
      brokenWhy: 'Сам 3D QR-код построен из тысяч объёмных кубиков, рассчитанных математически под старый адрес.',
      cameraTruth: 'Камера смартфона сканирует именно 3D-кубики в пространстве, а не строчку текста внизу файла! Поэтому телефон откроет старый сайт.',
    },
    studioActionText: 'Открыть в студии и пересобрать 3D QR-код',
  },

  'gift-box': {
    title: 'Подарок с промокодом',
    editLines: [
      "// Файл подарка (открыт в Блокноте)",
      "const giftConfig = {",
      "  caption: 'Ваш промокод на скидку 20%',",
      "  buttonText: 'Забрать подарок',",
      "  buttonUrl: 'https://myshop.ru/sale',",
      "  codeToCopy: 'GRIDIKA20',",
      "  maxWidth: '560px',",
      "  minWidth: '320px',",
      "};",
    ],
    editableFields: [
      {
        id: 'caption',
        label: 'Текст предложения / скидки',
        fieldKey: 'caption',
        originalVal: 'Ваш промокод на скидку 20%',
        newVal: 'Скидка 30% на все заказы',
        description: 'Главный заголовок на всплывающей карточке подарка',
        range: 'Любой текст до 60 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'codeToCopy',
        label: 'Промокод (кнопка)',
        fieldKey: 'codeToCopy',
        originalVal: 'GRIDIKA20',
        newVal: 'SALE30',
        description: 'Текст промокода, который копируется в буфер при клике',
        range: 'Буквы и цифры без пробелов: \'SALE30\', \'GIFT2026\'',
        type: 'text',
      },
      {
        id: 'buttonText',
        label: 'Текст кнопки',
        fieldKey: 'buttonText',
        originalVal: 'Забрать подарок',
        newVal: 'Перейти в каталог',
        description: 'Призыв к действию на кнопке перехода',
        range: 'До 25 символов: \'Забрать подарок\', \'Активировать\'',
        type: 'text',
      },
      {
        id: 'buttonUrl',
        label: 'Ссылка кнопки',
        fieldKey: 'buttonUrl',
        originalVal: 'https://myshop.ru/sale',
        newVal: 'https://myshop.ru/catalog',
        description: 'Куда переходит посетитель при клике по кнопке',
        range: 'Полный URL-адрес обязательно с https://',
        type: 'url',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '560px',
        newVal: '720px',
        description: 'Максимальная ширина 3D-коробки подарка на десктопе',
        range: 'Пресеты: S (420px), M (560px), L (720px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '320px',
        newVal: '360px',
        description: 'Минимальная ширина подарка на смартфонах для корректного взрыва конфетти',
        range: 'от 280px до 360px, стандарт: 320px',
        type: 'text',
      },
    ],
    breakLines: [
      "// 3D-модель коробки подарка",
      "const LID_VOXELS = [... /* 3D-буквы «GRIDIKA20» из вокселей на крышке */];",
      "const promoCode = 'GRIDIKA20';",
    ],
    forbiddenItems: [
      {
        title: '3D-буквы промокода на крышке (LID_VOXELS)',
        codeSnippet: 'const LID_VOXELS = [/* 3D-кубики слова на крышке */];',
        desc: 'Слово промокода на крышке коробки физически выложено объёмными кубиками.',
        consequence: 'Если изменить текст в коде — крышка останется прежней: покупатель увидит одно слово, а скопирует другое.',
      },
      {
        title: 'Анимация физики открытия коробки',
        codeSnippet: 'const UNBOX_KEYFRAMES = [/* ключевые кадры физики Three.js */];',
        desc: 'Математический расчёт разлёта створок коробки и эффекта появления подарка.',
        consequence: 'Ручная правка сломает анимацию — подарок перестанет открываться при клике.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Ядро WebGL-рендерера сцены Three.js.',
        consequence: 'Без этой строки 3D-подарок не сможет отобразиться на сайте.',
      },
    ],
    breakTarget: {
      fieldKey: 'promoCode',
      originalVal: 'GRIDIKA20',
      attemptedVal: 'SALE50',
      brokenWhy: 'На 3D-крышке коробки слово выложено физическими объёмными кубиками.',
      cameraTruth: 'Если заменить текст в коде, на крышке всё равно останется старое слово GRIDIKA20 — покупатель увидит одно, а скопирует другое!',
    },
    studioActionText: 'Открыть в студии и изменить буквы на крышке',
  },

  'qr-morph': {
    title: '3D QR-Морфинг',
    editLines: [
      "// Файл QR-Морфинга (открыт в Блокноте)",
      "const morphConfig = {",
      "  hintText: 'Наведите камеру смартфона',",
      "  backgroundColor: '#132A22',",
      "  autoRotateSpeed: 0.8,",
      "  maxWidth: '480px',",
      "  minWidth: '280px',",
      "};",
    ],
    editableFields: [
      {
        id: 'hintText',
        label: 'Текст подсказки',
        fieldKey: 'hintText',
        originalVal: 'Наведите камеру смартфона',
        newVal: 'Отсканируйте камерой',
        description: 'Подсказка для посетителей под 3D-сценой',
        range: 'Любая фраза до 50 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'autoRotateSpeed',
        label: 'Скорость автовращения',
        fieldKey: 'autoRotateSpeed',
        originalVal: '0.8',
        newVal: '1.2',
        description: 'Скорость вращения 3D-фигуры в режиме ожидания',
        range: 'от 0.1 (едва заметно) до 3.0 (быстро), стандарт: 0.8',
        type: 'number',
      },
      {
        id: 'backgroundColor',
        label: 'Цвет фона сцены',
        fieldKey: 'backgroundColor',
        originalVal: '#132A22',
        newVal: '#0a1712',
        description: 'Фоновая подложка canvas-контейнера',
        range: 'HEX-код цвета (#132A22, #000000) или \'transparent\'',
        type: 'color',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '480px',
        newVal: '640px',
        description: 'Максимальная ширина 3D QR-сцены на компьютере',
        range: 'Пресеты: S (360px), M (480px), L (640px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '280px',
        newVal: '320px',
        description: 'Минимальная ширина блока для безошибочного считывания QR-кода камерой',
        range: 'от 260px до 340px, стандарт: 280px',
        type: 'text',
      },
    ],
    breakLines: [
      "// 3D-сетка воксельного морфинга (куб/дерево -> QR)",
      "const MORPH_FRAMES = [/* 16 000 точек перехода геометрии */];",
      "const scanUrl = 'https://old-link.ru';",
    ],
    forbiddenItems: [
      {
        title: 'Целевая ссылка QR-кода (scanUrl)',
        codeSnippet: "scanUrl: 'https://mysite.ru', // зашита в кубики",
        desc: 'Вся 3D-анимация перетекания фигуры в QR-код построена под эту конкретную ссылку. Камера смартфона считывает физический узор кубиков, а не строчку текста в коде.',
        consequence: 'Если изменить ссылку вручную в файле — 3D-кубики останутся прежними, и камера откроет старый адрес.',
      },
      {
        title: 'Массив кадров морфинга (MORPH_FRAMES)',
        codeSnippet: 'const MORPH_FRAMES = [...]; // 16 000 координат',
        desc: 'Математический расчёт полёта каждого отдельного кубика в пространстве. Именно благодаря этим координатам дерево или сфера красиво перетекают в форму QR-кода.',
        consequence: 'Если изменить или повредить этот массив — браузер выдаст ошибку WebGL, и анимация зависнет.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Ядро Three.js, управляющее расчётом частиц и физикой на видеокарте.',
        consequence: 'Без этого скрипта морфинг превратится в невидимый блок.',
      },
    ],
    breakTarget: {
      fieldKey: 'scanUrl',
      originalVal: 'https://old-link.ru',
      attemptedVal: 'https://new-link.ru',
      brokenWhy: 'Анимация превращения дерева или сферы в QR-код рассчитана по точным координатам вокселей.',
      cameraTruth: 'Камера смартфона считывает 3D-кубики QR-кода. Смена текстовой переменной не перестроит 3D-волновой морфинг.',
    },
    studioActionText: 'Собрать новый морфинг под другую ссылку в студии',
  },

  'voxel-logo': {
    title: '3D-логотип из вокселей',
    editLines: [
      "// Файл 3D-логотипа (открыт в Блокноте)",
      "const logoConfig = {",
      "  caption: 'Интерактивный 3D-логотип',",
      "  autoRotateSpeed: 0.8,",
      "  lightBrightness: 1.2,",
      "  maxWidth: '480px',",
      "  minWidth: '280px',",
      "};",
    ],
    editableFields: [
      {
        id: 'caption',
        label: 'Подпись под логотипом',
        fieldKey: 'caption',
        originalVal: 'Интерактивный 3D-логотип',
        newVal: 'Вращайте мышкой или пальцем',
        description: 'Текстовый баннер под трёхмерным логотипом',
        range: 'Любая фраза до 50 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'autoRotateSpeed',
        label: 'Скорость вращения',
        fieldKey: 'autoRotateSpeed',
        originalVal: '0.8',
        newVal: '1.5',
        description: 'Плавность и темп автоматического вращения логотипа',
        range: 'от 0.1 (медленно) до 3.0 (быстро), стандарт: 0.8',
        type: 'number',
      },
      {
        id: 'lightBrightness',
        label: 'Яркость освещения 3D-сцены',
        fieldKey: 'lightBrightness',
        originalVal: '1.2',
        newVal: '1.8',
        description: 'Интенсивность виртуального студийного прожектора Three.js',
        range: 'от 0.5 (приглушённое) до 2.5 (очень яркое), стандарт: 1.2',
        type: 'number',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '480px',
        newVal: '640px',
        description: 'Максимальная ширина 3D-логотипа на экранах ноутбуков и мониторов',
        range: 'Пресеты: S (360px), M (480px), L (640px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '280px',
        newVal: '320px',
        description: 'Порог сжатия 3D-логотипа на смартфонах для сохранения детализации кубиков',
        range: 'от 260px до 340px, стандарт: 280px',
        type: 'text',
      },
    ],
    breakLines: [
      "// Сетка цветных 3D-кубиков вашего логотипа",
      "const VOXEL_PALETTE = ['#19C37D', '#132A22', ...];",
      "const VOXEL_DATA = 'eJzt1rEJACAQBDHX/rs... 8000 кубиков';",
      "const brandName = 'Мой Бренд';",
    ],
    forbiddenItems: [
      {
        title: 'Массив 3D-кубиков логотипа (VOXEL_DATA)',
        codeSnippet: 'const VOXEL_DATA = "eJzt1rEJACAQBDHX/rs... 8000 кубиков";',
        desc: 'Форма и координаты каждого кубика, рассчитанные попиксельно из загруженного изображения.',
        consequence: 'Смена названия в коде не изменит форму самого 3D-логотипа — кубики останутся прежними.',
      },
      {
        title: 'Цветовая палитра (VOXEL_PALETTE)',
        codeSnippet: "const VOXEL_PALETTE = ['#19C37D', '#132A22', ...];",
        desc: 'Шестнадцатеричная матрица оттенков материалов Three.js.',
        consequence: 'Удаление или повреждение палитры сделает логотип черным или невидимым.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Ядро Three.js, управляющее интерактивным вращением и светом.',
        consequence: 'Без библиотеки 3D-логотип не сможет загрузиться.',
      },
    ],
    breakTarget: {
      fieldKey: 'brandName',
      originalVal: 'Мой Бренд',
      attemptedVal: 'Новый Бренд',
      brokenWhy: 'Форма и цвет каждого кубика сгенерированы попиксельно из загруженного изображения.',
      cameraTruth: 'Смена текста brandName в коде не изменит ни одного кубика самого 3D-логотипа на экране.',
    },
    studioActionText: 'Загрузить новое изображение в студии',
  },

  'voxel-morph': {
    title: 'Морф «до / после»',
    editLines: [
      "// Файл морфа До/После (открыт в Блокноте)",
      "const morphConfig = {",
      "  labelBefore: 'До ремонта',",
      "  labelAfter: 'После ремонта',",
      "  transitionDuration: 1.2,",
      "  maxWidth: '480px',",
      "  minWidth: '300px',",
      "};",
    ],
    editableFields: [
      {
        id: 'labelBefore',
        label: 'Ярлык состояния «До»',
        fieldKey: 'labelBefore',
        originalVal: 'До ремонта',
        newVal: 'Было',
        description: 'Текст бейджа для первой исходной 3D-модели',
        range: 'До 20 символов: \'До\', \'Было\', \'Черновой\'',
        type: 'text',
      },
      {
        id: 'labelAfter',
        label: 'Ярлык состояния «После»',
        fieldKey: 'labelAfter',
        originalVal: 'После ремонта',
        newVal: 'Стало',
        description: 'Текст бейджа для второй финальной 3D-модели',
        range: 'До 20 символов: \'После\', \'Стало\', \'Чистовой\'',
        type: 'text',
      },
      {
        id: 'transitionDuration',
        label: 'Длительность перехода (сек)',
        fieldKey: 'transitionDuration',
        originalVal: '1.2',
        newVal: '1.8',
        description: 'Время перетекания миллионов вокселей между моделями',
        range: 'от 0.5 сек (динамично) до 3.0 сек (очень плавно), стандарт: 1.2',
        type: 'number',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '480px',
        newVal: '680px',
        description: 'Максимальная ширина блока фото-морфа на странице',
        range: 'Пресеты: S (360px), M (480px), L (680px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '300px',
        newVal: '340px',
        description: 'Минимальная ширина рамки фотографий на узких экранах',
        range: 'от 280px до 340px, стандарт: 300px',
        type: 'text',
      },
    ],
    breakLines: [
      "// Координаты миллионов точек перехода между фото",
      "const POINT_CLOUD_A = [... /* воксели первого фото */];",
      "const POINT_CLOUD_B = [... /* воксели второго фото */];",
    ],
    forbiddenItems: [
      {
        title: '3D-облака точек двух фото (POINT_CLOUD_A / B)',
        codeSnippet: 'const POINT_CLOUD_A = [... /* 12 000 вокселей фото 1 */];',
        desc: 'Трёхмерные облака точек, рассчитанные нейросетью из двух загруженных фотографий.',
        consequence: 'Заменить сами фото можно только в студии через новую генерацию облаков точек.',
      },
      {
        title: 'Сетка векторной интерполяции',
        codeSnippet: 'const TRANSITION_VECTORS = [... /* расчёт перетекания */];',
        desc: 'Векторы плавного перемещения кубиков между состояниями «До» и «После».',
        consequence: 'Ручная правка ломает синхронизацию — кубики разлетятся хаотично.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Ядро Three.js для анимации частиц в реальном времени.',
        consequence: 'Без скрипта морфинг работать не будет.',
      },
    ],
    breakTarget: {
      fieldKey: 'POINT_CLOUD_A',
      originalVal: 'Фото 1',
      attemptedVal: 'Новое фото',
      brokenWhy: 'Трёхмерные облака точек рассчитаны нейросетью из двух загруженных фотографий.',
      cameraTruth: 'Заменить сами 3D-снимки можно только загрузив новую пару фотографий в студию.',
    },
    studioActionText: 'Загрузить новые фотографии в студии',
  },

  'sale-timer': {
    title: 'Таймер акции',
    editLines: [
      "// Файл таймера акции (открыт в Блокноте)",
      "const timerConfig = {",
      "  bannerTitle: 'До конца распродажи осталось:',",
      "  buttonText: 'За покупками →',",
      "  buttonUrl: 'https://myshop.ru/catalog',",
      "  countdownHours: 24,",
      "  maxWidth: '320px',",
      "  minWidth: '260px',",
      "};",
    ],
    editableFields: [
      {
        id: 'bannerTitle',
        label: 'Заголовок акции',
        fieldKey: 'bannerTitle',
        originalVal: 'До конца распродажи осталось:',
        newVal: 'Финальная ликвидация года:',
        description: 'Текст над 3D-цифрами таймера обратного отсчёта',
        range: 'Любой текст до 60 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'countdownHours',
        label: 'Время отсчёта (часы)',
        fieldKey: 'countdownHours',
        originalVal: '24',
        newVal: '48',
        description: 'Продолжительность таймера в часах от первого захода',
        range: 'от 1 до 168 часов (до 7 дней). Число без кавычек',
        type: 'number',
      },
      {
        id: 'buttonText',
        label: 'Текст кнопки',
        fieldKey: 'buttonText',
        originalVal: 'За покупками →',
        newVal: 'Получить скидку 50%',
        description: 'Призыв к действию под таймером',
        range: 'До 30 символов в одинарных кавычках',
        type: 'text',
      },
      {
        id: 'buttonUrl',
        label: 'Ссылка перехода',
        fieldKey: 'buttonUrl',
        originalVal: 'https://myshop.ru/catalog',
        newVal: 'https://myshop.ru/black-friday',
        description: 'Куда переходит покупатель при клике по кнопке',
        range: 'Полный URL обязательно с https://',
        type: 'url',
      },
      {
        id: 'maxWidth',
        label: 'Максимальный размер (ширина)',
        fieldKey: 'maxWidth',
        originalVal: '320px',
        newVal: '700px',
        description: 'Максимальная ширина таймера. Пресет L (700px) подходит для формата цифр в одну строчку',
        range: 'Пресеты: S (280px), M (320px), L (700px). Можно указать любое значение в px или %',
        type: 'text',
      },
      {
        id: 'minWidth',
        label: 'Минимальный размер (ширина)',
        fieldKey: 'minWidth',
        originalVal: '260px',
        newVal: '280px',
        description: 'Минимальная ширина таймера для комфортного отображения 3D-цифр на экранах',
        range: 'от 240px до 280px, стандарт: 260px',
        type: 'text',
      },
    ],
    breakLines: [
      "// 3D-модели цифр таймера из вокселей",
      "const DIGIT_3D_MODELS = [... /* 3D-геометрия цифр от 0 до 9 */];",
      "const digitStyle = 'voxel-rounded';",
    ],
    forbiddenItems: [
      {
        title: '3D-модели цифр таймера (DIGIT_3D_MODELS)',
        codeSnippet: 'const DIGIT_3D_MODELS = [... /* 3D-геометрия цифр 0-9 */];',
        desc: 'Объёмные трёхмерные воксельные модели цифр от 0 до 9, вшитые в движок.',
        consequence: 'Если стереть геометрию — вместо цифр таймера будут пустые квадраты.',
      },
      {
        title: 'Стиль 3D-цифр (digitStyle)',
        codeSnippet: "digitStyle: 'voxel-rounded', // ← стиль заложен при сборке",
        desc: 'Округлый, кубический или неоновый 3D-стиль, сгенерированный в студии.',
        consequence: 'Текст и время меняются в коде свободно, а изменить стиль 3D-цифр можно только в студии.',
      },
      {
        title: 'Скрипт 3D-движка (<script src="...">)',
        codeSnippet: '<script src="https://gridika.ru/engine/v1.js"></script>',
        desc: 'Ядро Three.js, управляющее обратным отсчётом и 3D-вращением цифр.',
        consequence: 'Без скрипта таймер не появится на сайте.',
      },
    ],
    breakTarget: {
      fieldKey: 'digitStyle',
      originalVal: 'voxel-rounded',
      attemptedVal: 'cyber-neon',
      brokenWhy: 'Стили объёмных цифр встроены в 3D-библиотеку сцены.',
      cameraTruth: 'Текст, время и ссылки меняются свободно в коде, а стиль 3D-цифр выбирается в студии.',
    },
    studioActionText: 'Выбрать другой 3D-стиль цифр в студии',
  },
};

export function renderEffectGuideHtml(productId: string, studioUrl: string): string {
  const g = EFFECT_GUIDES[productId as ProductId];
  if (!g) return '';

  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Prepare editable code lines HTML
  const editCodeHtml = g.editLines
    .map((line, idx) => {
      const lineNum = idx + 1;
      return `<div data-sim-line="${lineNum}" class="flex items-center gap-2 px-3 py-0.5 rounded transition-colors font-mono text-[11px] leading-relaxed select-text">
        <span class="text-[#78716c]/50 text-[10px] w-4 text-right select-none shrink-0">${lineNum}</span>
        <span data-sim-code-text class="text-[#132A22] whitespace-pre">${esc(line)}</span>
      </div>`;
    })
    .join('');

  // Prepare field buttons
  const fieldButtonsHtml = g.editableFields
    .map((f, i) => `
      <button type="button" data-sim-pick="${f.id}" class="h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
        i === 0 ? 'bg-[#19C37D] text-[#132A22] shadow-sm' : 'bg-white hover:bg-[#f6f3ee] text-[#132A22] border border-[#e5dfd2]'
      }">
        🔍 ${esc(f.label)}
      </button>`)
    .join('');

  // Prepare break code lines HTML
  const breakCodeHtml = g.breakLines
    .map((line, idx) => {
      const lineNum = idx + 1;
      return `<div data-sim-break-line="${lineNum}" class="flex items-center gap-2 px-3 py-0.5 rounded transition-colors font-mono text-[11px] leading-relaxed select-text">
        <span class="text-[#78716c]/50 text-[10px] w-4 text-right select-none shrink-0">${lineNum}</span>
        <span data-sim-break-text class="text-[#132A22] whitespace-pre">${esc(line)}</span>
      </div>`;
    })
    .join('');

  return `
    <div data-guide hidden class="mt-3.5 overflow-hidden rounded-2xl bg-white border border-[#ece6da] p-3.5 sm:p-4 text-left shadow-sm">
      
      <!-- HEADER WORKFLOW (4 STEPS) -->
      <div class="pb-3 mb-3 border-b border-[#f3efe7]">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-[#132A22]">
            <span class="w-2 h-2 rounded-full bg-[#19C37D]"></span>
            <span>Инструкция: как менять данные</span>
          </div>
          <span class="text-[10.5px] font-bold text-[#19C37D] bg-[#DFF8EB] px-2 py-0.5 rounded-full">без перепокупки кода</span>
        </div>
        
        <!-- Step pills -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
          <div class="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#f0ebe1] text-[#132A22] font-semibold leading-tight">
            <span class="text-[#19C37D] font-black mr-1">1.</span>Откройте в Блокноте
          </div>
          <div class="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#f0ebe1] text-[#132A22] font-semibold leading-tight">
            <span class="text-[#19C37D] font-black mr-1">2.</span>Нажмите <kbd class="px-1 py-0.2 rounded bg-white border text-[10px] font-mono font-bold">Ctrl+F</kbd>
          </div>
          <div class="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#f0ebe1] text-[#132A22] font-semibold leading-tight">
            <span class="text-[#19C37D] font-black mr-1">3.</span>Замените в кавычках
          </div>
          <div class="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#f0ebe1] text-[#132A22] font-semibold leading-tight">
            <span class="text-[#19C37D] font-black mr-1">4.</span>Сохраните <kbd class="px-1 py-0.2 rounded bg-white border text-[10px] font-mono font-bold">Ctrl+S</kbd>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE SIMULATOR WIDGET -->
      <div data-sim-widget class="rounded-xl border border-[#e5dfd2] overflow-hidden bg-[#FAF8F5]">
        
        <!-- Tab Bar -->
        <div class="flex items-center border-b border-[#e5dfd2] bg-[#F4EFEA] p-1 gap-1">
          <button type="button" data-sim-tab="edit" class="flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer bg-white text-[#132A22] shadow-sm flex items-center justify-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#19C37D]"></span>
            <span>Как менять текст (Так можно ✓)</span>
          </button>
          <button type="button" data-sim-tab="break" class="flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer text-[#78716c] hover:text-[#132A22] flex items-center justify-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#ef4444]"></span>
            <span>Смена 3D-ссылки (Что сломается ✕)</span>
          </button>
        </div>

        <!-- PANEL 1: EDIT TEXT (CAN DO) -->
        <div data-sim-panel="edit" class="p-3">
          
          <!-- Mini Editor Window -->
          <div class="rounded-xl bg-white border border-[#e5dfd2] shadow-xs overflow-hidden">
            <!-- Window top bar -->
            <div class="flex items-center justify-between px-3 py-1.5 bg-[#F6F3EE] border-b border-[#ece6da]">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                <span class="ml-2 font-mono text-[10.5px] font-bold text-[#78716c]">effect.html (Блокнот)</span>
              </div>
              <span class="text-[10px] font-bold text-[#0f5c3c] bg-[#DFF8EB] px-2 py-0.5 rounded">Интерактивный симулятор</span>
            </div>

            <!-- Code lines -->
            <div data-sim-code-container class="p-2.5 space-y-0.5 bg-[#FAF9F6]">
              ${editCodeHtml}
            </div>
          </div>

          <!-- Controls under editor -->
          <div class="mt-2.5 p-3 rounded-xl bg-white border border-[#ece6da]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[11px] font-bold text-[#78716c]">Нажмите Ctrl+F для поиска:</span>
                ${fieldButtonsHtml}
              </div>
            </div>

            <!-- Replace action bar -->
            <div class="mt-2.5 pt-2.5 border-t border-[#f0ebe1] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div class="flex-1 flex items-center gap-2 bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#e5dfd2]">
                <span class="text-[11px] font-bold text-[#78716c] shrink-0">Заменить на:</span>
                <input type="text" data-sim-input class="flex-1 bg-transparent text-[11.5px] font-mono font-bold text-[#132A22] outline-none min-w-0" value="${esc(g.editableFields[0].newVal)}" />
              </div>
              <button type="button" data-sim-apply class="h-8 px-4 rounded-lg bg-[#19C37D] hover:bg-[#17b373] text-[#132A22] font-black text-[12px] transition-colors cursor-pointer shrink-0">
                Заменить в коде
              </button>
              <button type="button" data-sim-reset class="h-8 px-2.5 rounded-lg bg-white border border-[#e5dfd2] hover:bg-[#f6f3ee] text-[#78716c] font-bold text-[11px] transition-colors cursor-pointer shrink-0">
                Сбросить
              </button>
            </div>

            <!-- Success banner (hidden by default) -->
            <div data-sim-success hidden class="mt-2.5 p-2.5 rounded-lg bg-[#F0FAF5] border border-[#d2f3e3] text-[11.5px] text-[#0f5c3c] font-semibold leading-snug">
              <div class="flex items-center gap-1.5 font-black text-[#0f5c3c]">
                <span>✓</span>
                <span>Текст успешно изменён!</span>
              </div>
              <p class="mt-1 text-[11px] text-[#132A22]">
                Теперь нажмите <kbd class="px-1 py-0.2 rounded bg-white border text-[10px] font-mono font-bold">Ctrl+S</kbd> в Блокноте и сохраните файл. На вашем сайте контакт или надпись обновятся сразу — перепокупать код не нужно!
              </p>
              <p class="mt-1 text-[10.5px] text-[#78716c]">
                ⚠️ Главное: не стирайте кавычки <code class="font-mono bg-white/80 px-1 py-0.2 rounded border text-[#0f5c3c]">'...'</code> и запятые на конце строки.
              </p>
            </div>
          </div>
        </div>

        <!-- PANEL 2: BREAKAGE SIMULATION (CANNOT DO) -->
        <div data-sim-panel="break" hidden class="p-3">
          
          <!-- Break editor -->
          <div class="rounded-xl bg-white border border-[#e5dfd2] shadow-xs overflow-hidden">
            <div class="flex items-center justify-between px-3 py-1.5 bg-[#FFF5F5] border-b border-[#fee2e2]">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                <span class="ml-2 font-mono text-[10.5px] font-bold text-[#991b1b]">effect.html (попытка изменить 3D вручную)</span>
              </div>
              <span class="text-[10px] font-bold text-[#991b1b] bg-[#fee2e2] px-2 py-0.5 rounded">Симулятор ошибки</span>
            </div>

            <!-- Break code container -->
            <div data-sim-break-container class="p-2.5 space-y-0.5 bg-[#FAF9F6]">
              ${breakCodeHtml}
            </div>
          </div>

          <!-- Break Action Trigger -->
          <div class="mt-2.5 p-3 rounded-xl bg-white border border-[#ece6da]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="text-[12px] font-black text-[#132A22]">Что будет, если поменять ссылку или QR вручную?</span>
                <p class="text-[11px] text-[#78716c]">Нажмите кнопку ниже, чтобы увидеть, почему это сломает эффект:</p>
              </div>
              <button type="button" data-sim-break-btn class="h-8 px-3.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-extrabold text-[11.5px] transition-colors cursor-pointer shrink-0">
                💥 Заменить ссылку в коде
              </button>
            </div>

            <!-- Break Result Card (shown after click) -->
            <div data-sim-break-result hidden class="mt-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#fecaca] text-left">
              <div class="flex items-center gap-2 text-[12px] font-black text-[#991b1b]">
                <span class="w-5 h-5 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-[11px]">✕</span>
                <span>ЭФФЕКТ СЛОМАЛСЯ: ПОЛНЫЙ РАССИНХРОН!</span>
              </div>

              <!-- Comparison pills -->
              <div class="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="p-2 rounded-lg bg-white/90 border border-[#fecaca]">
                  <div class="text-[10px] font-extrabold uppercase text-[#991b1b]">В коде вы написали:</div>
                  <div class="font-mono text-[11px] font-bold text-[#132A22] mt-0.5">${esc(g.breakTarget.attemptedVal)}</div>
                  <div class="text-[10px] text-[#78716c] mt-0.5">Но это просто строчка текста в файле</div>
                </div>
                <div class="p-2 rounded-lg bg-white/90 border border-[#fecaca]">
                  <div class="text-[10px] font-extrabold uppercase text-[#b45309]">В 3D-модели заложено:</div>
                  <div class="font-mono text-[11px] font-bold text-[#b45309] mt-0.5">${esc(g.breakTarget.originalVal)}</div>
                  <div class="text-[10px] text-[#78716c] mt-0.5">Физическая геометрия Three.js</div>
                </div>
              </div>

              <!-- Why camera fails -->
              <div class="mt-2.5 p-2 rounded-lg bg-white/90 border border-[#fecaca] text-[11px] text-[#132A22] leading-relaxed">
                <p><b>📱 Что увидит камера смартфона:</b></p>
                <p class="mt-0.5 text-[#78716c]">${esc(g.breakTarget.cameraTruth)}</p>
                <p class="mt-1.5 text-[10.5px] text-[#991b1b] font-semibold">
                  ⚠️ ${esc(g.breakTarget.brokenWhy)}
                </p>
              </div>

              <!-- Action to Studio -->
              <div class="mt-3 flex items-center justify-between flex-wrap gap-2">
                <span class="text-[11px] font-bold text-[#78716c]">Как сделать правильно:</span>
                <a href="${studioUrl}" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#132A22] hover:bg-[#1f3f33] text-[#19C37D] font-extrabold text-[11px] transition-colors">
                  <span>${esc(g.studioActionText)}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>`;
}

export function attachEffectGuideSimulator(guideBox: HTMLElement, productId: string) {
  const g = EFFECT_GUIDES[productId as ProductId];
  if (!g) return;

  const simWidget = guideBox.querySelector('[data-sim-widget]') as HTMLElement | null;
  if (!simWidget || simWidget.dataset.simBound) return;
  simWidget.dataset.simBound = '1';

  // Tabs
  const tabEdit = simWidget.querySelector('[data-sim-tab="edit"]') as HTMLButtonElement | null;
  const tabBreak = simWidget.querySelector('[data-sim-tab="break"]') as HTMLButtonElement | null;
  const panelEdit = simWidget.querySelector('[data-sim-panel="edit"]') as HTMLElement | null;
  const panelBreak = simWidget.querySelector('[data-sim-panel="break"]') as HTMLElement | null;

  function switchTab(mode: 'edit' | 'break') {
    if (!tabEdit || !tabBreak || !panelEdit || !panelBreak) return;
    if (mode === 'edit') {
      panelEdit.hidden = false;
      panelBreak.hidden = true;
      tabEdit.className = 'flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer bg-white text-[#132A22] shadow-sm flex items-center justify-center gap-1.5';
      tabBreak.className = 'flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer text-[#78716c] hover:text-[#132A22] flex items-center justify-center gap-1.5';
    } else {
      panelEdit.hidden = true;
      panelBreak.hidden = false;
      tabBreak.className = 'flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer bg-white text-[#132A22] shadow-sm flex items-center justify-center gap-1.5';
      tabEdit.className = 'flex-1 py-1.5 px-3 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer text-[#78716c] hover:text-[#132A22] flex items-center justify-center gap-1.5';
    }
  }

  tabEdit?.addEventListener('click', () => switchTab('edit'));
  tabBreak?.addEventListener('click', () => switchTab('break'));

  // Editable fields logic
  let activeField = g.editableFields[0];
  const input = simWidget.querySelector('[data-sim-input]') as HTMLInputElement | null;
  const applyBtn = simWidget.querySelector('[data-sim-apply]') as HTMLButtonElement | null;
  const resetBtn = simWidget.querySelector('[data-sim-reset]') as HTMLButtonElement | null;
  const successBox = simWidget.querySelector('[data-sim-success]') as HTMLElement | null;
  const pickButtons = simWidget.querySelectorAll('[data-sim-pick]');
  const lineRows = simWidget.querySelectorAll('[data-sim-line]');

  function highlightField(field: SimField) {
    activeField = field;
    if (input) input.value = field.newVal;

    pickButtons.forEach((btn) => {
      const b = btn as HTMLButtonElement;
      const isCurrent = b.dataset.simPick === field.id;
      if (isCurrent) {
        b.className = 'h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer bg-[#19C37D] text-[#132A22] shadow-sm';
      } else {
        b.className = 'h-7 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer bg-white hover:bg-[#f6f3ee] text-[#132A22] border border-[#e5dfd2]';
      }
    });

    lineRows.forEach((row) => {
      const r = row as HTMLElement;
      const textEl = r.querySelector('[data-sim-code-text]');
      const txt = textEl?.textContent || '';
      if (txt.includes(field.fieldKey)) {
        r.classList.add('bg-[#FFF9C4]', 'ring-1', 'ring-[#FBC02D]');
      } else {
        r.classList.remove('bg-[#FFF9C4]', 'ring-1', 'ring-[#FBC02D]', 'bg-[#DFF8EB]', 'ring-[#19C37D]');
      }
    });
  }

  // Initial highlight
  if (activeField) highlightField(activeField);

  pickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.simPick;
      const found = g.editableFields.find((f) => f.id === id);
      if (found) highlightField(found);
    });
  });

  applyBtn?.addEventListener('click', () => {
    if (!activeField || !input) return;
    const newVal = input.value.trim() || activeField.newVal;

    lineRows.forEach((row) => {
      const r = row as HTMLElement;
      const textEl = r.querySelector('[data-sim-code-text]');
      if (!textEl) return;
      const txt = textEl.textContent || '';
      if (txt.includes(activeField.fieldKey)) {
        textEl.textContent = `  ${activeField.fieldKey}: '${newVal}', // ✓ изменено!`;
        r.classList.remove('bg-[#FFF9C4]', 'ring-[#FBC02D]');
        r.classList.add('bg-[#DFF8EB]', 'ring-1', 'ring-[#19C37D]');
      }
    });

    if (successBox) successBox.hidden = false;
  });

  resetBtn?.addEventListener('click', () => {
    lineRows.forEach((row, idx) => {
      const r = row as HTMLElement;
      const textEl = r.querySelector('[data-sim-code-text]');
      if (textEl && g.editLines[idx]) {
        textEl.textContent = g.editLines[idx];
      }
      r.classList.remove('bg-[#FFF9C4]', 'ring-1', 'ring-[#FBC02D]', 'bg-[#DFF8EB]', 'ring-[#19C37D]');
    });
    if (successBox) successBox.hidden = true;
    if (g.editableFields[0]) highlightField(g.editableFields[0]);
  });

  // Breakage panel logic
  const breakBtn = simWidget.querySelector('[data-sim-break-btn]') as HTMLButtonElement | null;
  const breakResult = simWidget.querySelector('[data-sim-break-result]') as HTMLElement | null;
  const breakLines = simWidget.querySelectorAll('[data-sim-break-line]');

  breakBtn?.addEventListener('click', () => {
    breakLines.forEach((row) => {
      const r = row as HTMLElement;
      const textEl = r.querySelector('[data-sim-break-text]');
      if (!textEl) return;
      const txt = textEl.textContent || '';
      if (txt.includes(g.breakTarget.fieldKey)) {
        textEl.textContent = `const ${g.breakTarget.fieldKey} = '${g.breakTarget.attemptedVal}'; // ❌ РАССИНХРОН`;
        r.classList.add('bg-[#FEE2E2]', 'ring-1', 'ring-[#EF4444]', 'text-[#991B1B]');
      }
    });
    if (breakResult) {
      breakResult.hidden = false;
      breakResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}


// ====== Sections of the TRAVA site ======
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

// ----- Lang strings (RU / EN) -----
const STRINGS = {
  ru: {
    nav: { cottages: "Проживание", activities: "Активности", events: "Корпоративы", winter: "Зима", contacts: "Контакты" },
    cta_book: "Забронировать",
    hero_eyebrow: "Загородный клуб · Ленинградская область",
    hero_title_a: "Загородный клуб",
    hero_title_b: "Трава",
    hero_title_em: "отдых для всей семьи в 1,5 часах от Петербурга",
    hero_sub: "18 номеров, две бани с джакузи на улице, бассейн летом, мини-зоопарк и территория в сосновом лесу. Животные приветствуются.",
    cta_book_cottage: "Забронировать коттедж",
    cta_gallery: "Смотреть фото",
    meta: { dist: "от м. Парнас", cottages: "коттеджей", year: "круглый год" },
    season_summer: "Лето",
    season_winter: "Зима",
    section_overview_eyebrow: "Главное",
    section_overview_title: "Что есть в Траве",
    section_cottages_eyebrow: "01 — Проживание",
    section_cottages_title: "Проживание в коттеджах",
    section_cottages_lede: "18 коттеджей в сосновом лесу — от 4-местных до больших на компанию 8–10 человек. Своя кухня, тёплый пол, терраса и Smart TV в каждом. Заезд с животными — разрешён.",
    section_banya_eyebrow: "02 — Баня и джакузи",
    section_banya_title: "Две бани и два джакузи под открытым небом",
    section_banya_body: "Дровяные парные с печкой и берёзовыми вениками. Два гидромассажных бассейна на свежем воздухе — работают круглый год, в том числе зимой. После пара — комната отдыха с диваном и ТВ.",
    section_activities_eyebrow: "03 — Активности",
    section_activities_title: "Чем заняться в Траве",
    section_events_eyebrow: "04 — Мероприятия",
    section_events_title: "Корпоративы, свадьбы, банкеты",
    section_events_body: "Крытая терраса со сценой, проживание для гостей, баня после мероприятия. Принимаем группы от 20 до 60 человек. Звук, свет, сцена, парковка, охрана — на месте.",
    section_winter_eyebrow: "05 — Зима",
    section_winter_title: "Зимний отдых у подножия горнолыжных курортов",
    section_winter_body: "Трава — удобная база для гостей Красного озера и Золотой долины. Проживание + трансфер на подъёмники по предварительному заказу, групповые заезды райдеров, баня после катания.",
    section_gallery_eyebrow: "06 — Галерея",
    section_gallery_title: "Как у нас",
    section_reviews_eyebrow: "07 — Отзывы",
    section_reviews_title: "Что говорят гости",
    section_faq_eyebrow: "08 — FAQ",
    section_faq_title: "Частые вопросы",
    section_contacts_eyebrow: "09 — Контакты",
    section_contacts_title: "Как нас найти",
  },
  en: {
    nav: { cottages: "Stay", activities: "Activities", events: "Events", winter: "Winter", contacts: "Contact" },
    cta_book: "Book",
    hero_eyebrow: "Country club · Leningrad region",
    hero_title_a: "Trava country club",
    hero_title_b: "",
    hero_title_em: "a family retreat, 1.5 hours from St. Petersburg",
    hero_sub: "18 cottages, two banyas with outdoor hot tubs, a summer pool, a petting zoo and a pine-forest territory. Pets welcome.",
    cta_book_cottage: "Book a cottage",
    cta_gallery: "See photos",
    meta: { dist: "from Parnas metro", cottages: "cottages", year: "year-round" },
    season_summer: "Summer",
    season_winter: "Winter",
    section_overview_eyebrow: "At a glance",
    section_overview_title: "What's at Trava",
    section_cottages_eyebrow: "01 — Stay",
    section_cottages_title: "Cottages in the woods",
    section_cottages_lede: "18 cottages in a pine forest — from 4-person to large ones for a group of 8–10. Each with a kitchen, heated floors, terrace and Smart TV. Pets allowed.",
    section_banya_eyebrow: "02 — Banya & hot tubs",
    section_banya_title: "Two banyas and two open-air hot tubs",
    section_banya_body: "Wood-fired steam rooms with birch leaf bunches. Two hydro-massage tubs outside — open year-round, even in winter. After the steam — a lounge with sofa and TV.",
    section_activities_eyebrow: "03 — Activities",
    section_activities_title: "Things to do at Trava",
    section_events_eyebrow: "04 — Events",
    section_events_title: "Offsites, weddings, banquets",
    section_events_body: "Covered terrace with stage, accommodation for guests, banya after the event. Groups from 20 to 60 people. Sound, lights, stage, parking, security — on site.",
    section_winter_eyebrow: "05 — Winter",
    section_winter_title: "Winter base at the foot of the ski resorts",
    section_winter_body: "A convenient base for guests of Krasnoe Ozero and Zolotaya Dolina. Stay + transfer to the lifts on request, group rider stays, banya after the slopes.",
    section_gallery_eyebrow: "06 — Gallery",
    section_gallery_title: "Around here",
    section_reviews_eyebrow: "07 — Reviews",
    section_reviews_title: "What guests say",
    section_faq_eyebrow: "08 — FAQ",
    section_faq_title: "Frequently asked",
    section_contacts_eyebrow: "09 — Contact",
    section_contacts_title: "How to find us",
  }
};

// ----- Cottages data -----
const COTTAGES_DATA = [
  {
    id: "4p",
    tag: "4–5 мест · 50 м²",
    title: "Коттедж на 4 человека",
    sub: "От 5 000 ₽/будни · 7 000 ₽/выходные",
    priceWeek: "5 000–7 000 ₽",
    priceWeekend: "7 000–8 000 ₽",
    photos: [
      "media/kott1_18_10.jpg",
      "media/kottedj_dlya_4.jpg",
      "media/42-7.jpg",
      "media/banya_2018_13.jpg",
      "media/velosiped3.jpg",
    ],
    feats: ["1 двуспальная + 2 односпальные", "До 5 доп. мест", "Кухня · индукция · холодильник", "Душевая кабина · фен", "Тёплый пол · Smart TV", "Терраса · вид на лес"],
    included: "Бельё, полотенца, фен, чай/кофе, вода в день заезда",
  },
  {
    id: "8p",
    tag: "8–10 мест",
    title: "Коттедж на компанию",
    sub: "Большая семья или дружеская компания",
    priceWeek: "по запросу",
    priceWeekend: "по запросу",
    photos: [
      "media/78-7.jpg",
      "media/kott_8_pers.jpg",
      "media/432-7.jpg",
      "media/banya_2018_4.jpg",
    ],
    feats: ["2 спальни + гостиная", "До 10 человек", "Полная кухня", "2 санузла", "Терраса · мангал рядом", "Подходит для компании"],
    included: "Бельё, полотенца, чай/кофе. Уточняйте наличие по WhatsApp.",
  },
];

// ----- Cottage carousel -----
function CottageCarousel({ photos, alt }) {
  const [idx, setIdx] = useStateS(0);
  const n = photos.length;
  const go = (delta) => setIdx((i) => (i + delta + n) % n);
  return (
    <div className="cot-car">
      {photos.map((p, i) => (
        <img
          key={p}
          src={p}
          alt={alt}
          className={`photo-img cot-car-img ${i === idx ? "is-active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <button type="button" className="cot-car-btn cot-car-prev" onClick={(e) => { e.stopPropagation(); e.preventDefault(); go(-1); }} aria-label="Предыдущее фото">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" className="cot-car-btn cot-car-next" onClick={(e) => { e.stopPropagation(); e.preventDefault(); go(1); }} aria-label="Следующее фото">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="cot-car-dots">
        {photos.map((_, i) => (
          <button
            type="button"
            key={i}
            className={`cot-car-dot ${i === idx ? "is-active" : ""}`}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIdx(i); }}
            aria-label={`Фото ${i + 1}`}
          />
        ))}
      </div>
      <div className="cot-car-counter">{idx + 1} / {n}</div>
    </div>
  );
}

// ----- Activities data -----
const ACTIVITIES = {
  summer: {
    label: "Лето",
    photo: "media/42-7.jpg",
    items: [
      { name: "Бассейн", price: "летний сезон, бесплатно" },
      { name: "Прокат техники", price: "мотоциклы и квадроциклы" },
      { name: "Прокат велосипедов", price: "по сезону" },
      { name: "Спорт: футбол, волейбол", price: "бесплатно" },
      { name: "Открытый тренажёрный зал", price: "бесплатно" },
      { name: "Детская площадка и мангальные зоны", price: "бесплатно" },
    ],
  },
  winter: {
    label: "Зима",
    photo: "media/34-7.jpg",
    items: [
      { name: "Красное озеро · 15 мин", price: "трансфер по запросу" },
      { name: "Золотая долина · 25 мин", price: "трансфер по запросу" },
      { name: "Баня после катания", price: "от 4 500 ₽/3 ч" },
      { name: "Джакузи на улице зимой", price: "круглый год" },
      { name: "Снегоходные прогулки", price: "по запросу" },
    ],
  },
  always: {
    label: "Круглый год",
    photo: "media/zoo_main.jpg",
    items: [
      { name: "Баня × 2 + 2 джакузи на улице", price: "от 4 500 ₽/3 ч" },
      { name: "Мини-зоопарк", price: "бесплатно для гостей" },
      { name: "Конный клуб", price: "по расписанию" },
      { name: "Wi-Fi, парковка, охрана", price: "входит в проживание" },
      { name: "Мангальные зоны у коттеджей", price: "бесплатно" },
    ],
  },
};

// ----- Events -----
const EVENT_TYPES = [
  { num: "01", title: "Корпоративы", desc: "Тимбилдинг, конференции, банкеты. Крытая терраса со сценой на 60 чел." },
  { num: "02", title: "Свадьбы", desc: "Выездная регистрация на природе, банкет, проживание в коттеджах." },
  { num: "03", title: "Дни рождения", desc: "От тихого семейного до большой компании — баня, мангал, тортик." },
  { num: "04", title: "Тимбилдинги", desc: "Площадка в сосновом лесу, квесты, спорт, баня после программы." },
];

// ----- Reviews -----
const REVIEWS = [
  { stars: "★★★★★", text: "«Уехали на выходные с детьми и не хотели возвращаться. Тихо, тепло, баня — отдельная любовь.»", name: "Анна К.", date: "Март 2026", initials: "АК" },
  { stars: "★★★★★", text: "«Отмечали серебряную свадьбу — 40 человек на террасе, ночёвка в коттеджах. Всё прошло идеально.»", name: "Сергей и Марина", date: "Февраль 2026", initials: "СМ" },
  { stars: "★★★★★", text: "«Корпоратив 60 человек. Квест по лесу, баня до утра, утром завтрак. Команда довольна, шеф — счастлив.»", name: "Иван П., HR", date: "Январь 2026", initials: "ИП" },
];

// ----- FAQ -----
const FAQ_DATA = [
  { q: "Можно ли с домашними животными?", a: "Да, мы pet-friendly. Просим заранее предупредить менеджера и не оставлять питомца одного в коттедже." },
  { q: "Как добраться без машины?", a: "Автобус №898 от м. Парнас идёт прямо в район базы (1,5 часа в пути). Также можно заказать платный трансфер от любой точки СПб." },
  { q: "Что включено в стоимость коттеджа?", a: "Постельное бельё, полотенца, фен, чай/кофе и вода в день заезда. Своя кухня с индукцией, посудой и холодильником. Тёплый пол, Smart TV, Wi-Fi. Парковка бесплатная." },
  { q: "Какая ситуация с курением и тишиной?", a: "Курение — только на террасе. Звукоизоляция между коттеджами слабая, поэтому просим соблюдать тишину после 23:00." },
  { q: "Как оплачивается бронь?", a: "Предоплата 30% подтверждает бронь. Остальное — при заезде наличными или картой. Отмена за 7 дней — без штрафа." },
  { q: "Можно ли с детьми?", a: "Конечно. Детская площадка, мангальные зоны, мини-зоопарк, бассейн летом. Дети до 14 лет — без доплаты на дополнительном месте." },
];

// ============== HEADER ==============
function Header({ lang, setLang, season, setSeason, T }) {
  const [scrolled, setScrolled] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""}`} style={{ color: scrolled ? "var(--bark-900)" : "var(--paper)" }}>
      <a href="#top" className="nav-logo">
        <span className="leaf"></span>
        TRAVA
      </a>
      <div className="nav-links">
        <a href="#cottages">{T.nav.cottages}</a>
        <a href="#activities">{T.nav.activities}</a>
        <a href="#events">{T.nav.events}</a>
        <a href="#winter">{T.nav.winter}</a>
        <a href="#contacts">{T.nav.contacts}</a>
      </div>
      <div className="nav-right">
        <div className="season-toggle season-toggle-nav" role="tablist" aria-label="Сезон">
          <button
            role="tab"
            aria-selected={season === "summer"}
            className={season === "summer" ? "active" : ""}
            onClick={() => setSeason("summer")}
          >🌿 Лето</button>
          <button
            role="tab"
            aria-selected={season === "winter"}
            className={season === "winter" ? "active" : ""}
            onClick={() => setSeason("winter")}
          >❄ Зима</button>
        </div>
        <div className="lang-toggle">
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>RU</button>
          <span style={{ opacity: 0.4 }}>/</span>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <a href="#booking" className="btn btn-terra nav-cta-btn">
          {T.cta_book}
        </a>
        <button className="nav-burger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

// ============== SEASONAL FX (snow / grass) ==============
const SNOWFLAKE_SVGS = [
  // Classic 6-arm with bumps
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <g>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/>
      <line x1="19.1" y1="4.9" x2="4.9" y2="19.1"/>
      <polyline points="9.5 4.5 12 6 14.5 4.5"/>
      <polyline points="9.5 19.5 12 18 14.5 19.5"/>
      <polyline points="4.5 9.5 6 12 4.5 14.5"/>
      <polyline points="19.5 9.5 18 12 19.5 14.5"/>
      <polyline points="7 6 8.5 8.5 6 7"/>
      <polyline points="17 18 15.5 15.5 18 17"/>
      <polyline points="17 6 15.5 8.5 18 7"/>
      <polyline points="7 18 8.5 15.5 6 17"/>
    </g>
  </svg>`,
  // Simpler 6-arm with diamonds
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <g>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <line x1="4" y1="7.5" x2="20" y2="16.5"/>
      <line x1="20" y1="7.5" x2="4" y2="16.5"/>
      <polygon points="12 5.5 10.5 7 12 8.5 13.5 7" fill="currentColor"/>
      <polygon points="12 15.5 10.5 17 12 18.5 13.5 17" fill="currentColor"/>
      <polygon points="5.5 8.5 5 10.5 7 11 7.5 9" fill="currentColor"/>
      <polygon points="18.5 8.5 17 9 16.5 11 18 11.5" fill="currentColor"/>
      <polygon points="5.5 15.5 7.5 15 7 13 5 13.5" fill="currentColor"/>
      <polygon points="18.5 15.5 18 13.5 16 14 16.5 16" fill="currentColor"/>
    </g>
  </svg>`,
  // Plus-style with dots
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <line x1="12" y1="3" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/>
    <line x1="18.5" y1="5.5" x2="5.5" y2="18.5"/>
    <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="20" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="6" cy="6" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="18" cy="18" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="18" cy="6" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="6" cy="18" r="0.9" fill="currentColor" stroke="none"/>
  </svg>`,
];

function SeasonalFX({ season }) {
  if (season === "winter") {
    const flakes = Array.from({ length: 28 }).map((_, i) => ({
      left: ((i * 137 + 7) % 100),
      size: 14 + ((i * 41) % 22),
      delay: ((i * 73) % 100) / 8,
      duration: 14 + ((i * 53) % 16),
      drift: -50 + ((i * 31) % 130),
      opacity: 0.55 + ((i * 17) % 40) / 100,
      svg: SNOWFLAKE_SVGS[i % SNOWFLAKE_SVGS.length],
      spinDir: i % 2 === 0 ? 1 : -1,
    }));
    return (
      <div className="fx-layer fx-winter" aria-hidden="true">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="snow"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              animationDelay: `-${f.delay}s`,
              animationDuration: `${f.duration}s`,
              opacity: f.opacity,
              "--drift": `${f.drift}px`,
              "--spin": `${f.spinDir * 360}deg`,
            }}
            dangerouslySetInnerHTML={{ __html: f.svg }}
          />
        ))}
      </div>
    );
  }
  if (season === "summer") {
    const blades = Array.from({ length: 32 }).map((_, i) => ({
      left: (i * 197 + 11) % 100,
      height: 22 + ((i * 41) % 36),
      delay: ((i * 73) % 100) / 30,
      duration: 3.5 + ((i * 19) % 30) / 10,
      hue: 130 + ((i * 13) % 30),
      tilt: -8 + ((i * 7) % 17),
    }));
    return (
      <div className="fx-layer fx-summer" aria-hidden="true">
        {blades.map((b, i) => (
          <span
            key={i}
            className="grass"
            style={{
              left: `${b.left}%`,
              height: `${b.height}px`,
              animationDelay: `-${b.delay}s`,
              animationDuration: `${b.duration}s`,
              background: `linear-gradient(to top, oklch(0.3 0.06 ${b.hue}), oklch(0.5 0.09 ${b.hue}))`,
              "--tilt-base": `${b.tilt}deg`,
            }}
          />
        ))}
      </div>
    );
  }
  return null;
}

// ============== HERO ==============
function HeroIllustration() {
  return (
    <div className="hero-illust">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {/* Sky/paper backdrop with subtle stripes */}
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="oklch(0.42 0.06 145)" strokeOpacity="0.18" strokeWidth="1"/>
          </pattern>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.07 145)"/>
            <stop offset="100%" stopColor="oklch(0.4 0.06 145)"/>
          </linearGradient>
        </defs>
        {/* Soft sun */}
        <circle cx="1100" cy="220" r="140" fill="oklch(0.92 0.05 80)" opacity="0.6"/>
        {/* Distant hills */}
        <path d="M0 600 Q 360 420 720 540 T 1440 500 L 1440 900 L 0 900 Z" fill="url(#hill)" opacity="0.4"/>
        <path d="M0 680 Q 300 520 720 620 T 1440 580 L 1440 900 L 0 900 Z" fill="url(#hill)" opacity="0.7"/>
        {/* Ground */}
        <rect x="0" y="720" width="1440" height="180" fill="oklch(0.35 0.05 145)"/>
        <rect x="0" y="720" width="1440" height="180" fill="url(#hatch)"/>
        {/* Trees — simple triangles */}
        {[120, 220, 340, 500, 980, 1100, 1240, 1340].map((x, i) => (
          <g key={i} transform={`translate(${x} ${640 + (i % 3) * 18})`}>
            <polygon points="0,0 -28,80 28,80" fill="oklch(0.28 0.05 145)" />
            <polygon points="0,30 -22,90 22,90" fill="oklch(0.32 0.06 145)" />
            <rect x="-3" y="80" width="6" height="14" fill="oklch(0.25 0.03 65)"/>
          </g>
        ))}
        {/* Cottage silhouette */}
        <g transform="translate(680 600)">
          <polygon points="-60,-40 0,-90 60,-40" fill="oklch(0.32 0.04 65)"/>
          <rect x="-60" y="-40" width="120" height="70" fill="oklch(0.42 0.04 65)"/>
          <rect x="-15" y="-10" width="30" height="40" fill="oklch(0.85 0.08 80)"/>
        </g>
      </svg>
    </div>
  );
}

function Hero({ T, heroStyle, season, setSeason, BookingWidget }) {
  const heroPhoto = season === "winter" ? "media/banya_2018_4.jpg" : "media/topimage.jpg";
  return (
    <section className="hero" id="top" data-hero-style={heroStyle} data-season={season}>
      <div className="hero-bg"></div>
      <div className="hero-vignette"></div>
      {heroStyle === "illustration" && <HeroIllustration />}
      {heroStyle === "photo" && (
        <img src={heroPhoto} alt="" className="hero-photo-bg" key={heroPhoto} />
      )}

      <div className="container" style={{ width: "100%" }}>
        <div className="hero-grid">
          <div className="hero-eyebrow-row">
            <span className="dot"></span>
            {T.hero_eyebrow}
          </div>
          <h1>
            {T.hero_title_a}<br/>
            <span className="brand-trava">{T.hero_title_b}</span>
            <em className="hero-em">— {T.hero_title_em}</em>
          </h1>
          <p className="hero-sub">{T.hero_sub}</p>
          <div className="hero-ctas">
            <a href="#booking" className="btn btn-terra">{T.cta_book_cottage}
              <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
            </a>
            <a href="#gallery" className="btn btn-light hero-btn-ghost">{T.cta_gallery}</a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <strong>1,5 ч</strong>
              <span>{T.meta.dist}</span>
            </div>
            <div className="hero-meta-item">
              <strong>18</strong>
              <span>{T.meta.cottages}</span>
            </div>
            <div className="hero-meta-item">
              <strong>365</strong>
              <span>{T.meta.year}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingBand({ BookingWidget }) {
  return (
    <div className="container booking-wrap" id="booking">
      <BookingWidget />
    </div>
  );
}

function HeroScroll() {
  return (
    <div className="hero-scroll">
      <span>Прокрутить</span>
      <span className="line"></span>
    </div>
  );
}

// ============== OVERVIEW (4 cards) ==============
function OverviewCards({ T }) {
  const cards = [
    { id: "cottages", title: "Коттеджи", desc: "18 номеров от 4 до 10 мест", icon: "house", href: "#cottages" },
    { id: "banya", title: "Баня и джакузи", desc: "2 парных + 2 джакузи на улице", icon: "leaf", href: "#banya" },
    { id: "activities", title: "Активности", desc: "Бассейн, прокат, спорт, детям", icon: "bike", href: "#activities" },
    { id: "events", title: "Корпоративы", desc: "Терраса со сценой, 20–60 чел.", icon: "stage", href: "#events" },
  ];
  const Icon = ({ name }) => {
    const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
    if (name === "house") return <svg {...common}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>;
    if (name === "leaf") return <svg {...common}><path d="M5 19c0-8 7-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c4-4 7-7 10-10"/></svg>;
    if (name === "bike") return <svg {...common}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h3l2 4 3 4"/><path d="M10 9l-1-3h2"/></svg>;
    if (name === "stage") return <svg {...common}><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M5 14V8h14v6"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/></svg>;
    return null;
  };
  return (
    <section className="section section-overview">
      <div className="container">
        <div className="overview-grid">
          {cards.map((c) => (
            <a href={c.href} className="ov-card" key={c.id}>
              <div className="ov-card-ico"><Icon name={c.icon} /></div>
              <div className="ov-card-body">
                <div className="ov-card-title">{c.title}</div>
                <div className="ov-card-desc">{c.desc}</div>
              </div>
              <span className="ov-card-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== FACTS BAND ==============
function FactsBand() {
  const facts = [
    { num: "1,5 ч", label: "от м. Парнас" },
    { num: "18", label: "коттеджей · до 10 чел" },
    { num: "2 + 2", label: "бани + джакузи под открытым небом" },
    { num: "898", label: "автобус от Парнаса" },
  ];
  return (
    <div className="facts">
      {facts.map((f, i) => (
        <div className="fact" key={i}>
          <div className="num">{f.num}</div>
          <div className="label">{f.label}</div>
        </div>
      ))}
    </div>
  );
}

// ============== COTTAGES ==============
function Cottages({ T }) {
  return (
    <section className="section" id="cottages">
      <div className="container">
        <div className="s-head">
          <div>
            <span className="eyebrow">{T.section_cottages_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_cottages_title}</h2>
          </div>
          <p className="lede">{T.section_cottages_lede}</p>
        </div>

        <div className="cottages">
          {COTTAGES_DATA.map((c) => (
            <article className="cottage" key={c.id}>
              <div className="cottage-photo">
                <span className="cottage-tag">{c.tag}</span>
                <CottageCarousel photos={c.photos} alt={c.title} />
              </div>
              <div className="cottage-body">
                <div className="cottage-title-row">
                  <div>
                    <div className="cottage-title">{c.title}</div>
                    <div className="muted cottage-sub">{c.sub}</div>
                  </div>
                  <div className="cottage-price-block">
                    <div className="cottage-price-row"><span>будни</span><b>{c.priceWeek}</b></div>
                    <div className="cottage-price-row"><span>выходные</span><b>{c.priceWeekend}</b></div>
                  </div>
                </div>
                <div className="cottage-feats">
                  {c.feats.map((f) => <span key={f}>{f}</span>)}
                </div>
                <div className="cottage-included">
                  <span className="cottage-included-label">Включено</span>
                  <span>{c.included}</span>
                </div>
                <a href="#booking" className="cottage-cta">
                  Забронировать <span className="arrow">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="cottage-rules">
          <div className="cottage-rule"><span className="r-ico">🐶</span><div><b>Животные</b><span>разрешены</span></div></div>
          <div className="cottage-rule"><span className="r-ico">🚬</span><div><b>Курение</b><span>только на террасе</span></div></div>
          <div className="cottage-rule"><span className="r-ico">🧹</span><div><b>Уборка</b><span>1 раз в 3 дня</span></div></div>
          <div className="cottage-rule"><span className="r-ico">🌙</span><div><b>Тишина</b><span>после 23:00</span></div></div>
        </div>
      </div>
    </section>
  );
}

// ============== BANYA ==============
function Banya({ T, season = "summer" }) {
  const photo = season === "winter" ? "media/banya_2018_2.jpg" : "media/banya_2018_10.jpg";
  return (
    <section className="section" id="banya" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="split">
          <div className="split-photo">
            <img src={photo} alt="Парная" className="photo-img" key={photo} />
          </div>
          <div>
            <span className="eyebrow">{T.section_banya_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_banya_title}</h2>
            <p className="lede" style={{ marginTop: 24 }}>{T.section_banya_body}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 32 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 1 }}>2 × 6</div>
                <div className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Парных по 6 человек</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 1 }}>от 4 500 ₽</div>
                <div className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>3 часа аренды</div>
              </div>
            </div>
            <a href="#booking" className="btn btn-primary" style={{ marginTop: 32 }}>
              Добавить баню к броне
              <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============== WINTER SECTION ==============
function WinterSection({ T }) {
  return (
    <section className="section winter-section" id="winter">
      <div className="winter-bg" aria-hidden="true">
        <img src="media/34-7.jpg" alt="" />
      </div>
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="s-head">
          <div>
            <span className="eyebrow" style={{ color: "oklch(0.82 0.04 130)" }}>{T.section_winter_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12, color: "var(--paper)" }}>{T.section_winter_title}</h2>
          </div>
          <p className="lede" style={{ color: "oklch(0.92 0.01 85)" }}>{T.section_winter_body}</p>
        </div>
        <div className="winter-resorts">
          <div className="resort">
            <div className="resort-num">01</div>
            <div className="resort-title">Красное озеро</div>
            <div className="resort-dist">15 мин на машине</div>
            <div className="resort-info">Старейший горнолыжный комплекс региона. 13 трасс, перепад 95 м.</div>
          </div>
          <div className="resort">
            <div className="resort-num">02</div>
            <div className="resort-title">Золотая долина</div>
            <div className="resort-dist">25 мин на машине</div>
            <div className="resort-info">9 трасс разной сложности, школа, сноупарк, тюбинговая горка.</div>
          </div>
          <div className="resort">
            <div className="resort-num">03</div>
            <div className="resort-title">Игора</div>
            <div className="resort-dist">35 мин на машине</div>
            <div className="resort-info">Крупный курорт со школой, тюбингом и катком на льду.</div>
          </div>
        </div>
        <div className="winter-packages">
          <h3 className="h-display winter-packages-title">Зимние пакеты</h3>
          <ul className="winter-list">
            <li><span>Проживание + трансфер на подъёмники</span><span className="muted-light">по запросу</span></li>
            <li><span>Групповые заезды для райдеров</span><span className="muted-light">от 8 человек</span></li>
            <li><span>Баня после катания</span><span className="muted-light">от 4 500 ₽ / 3 ч</span></li>
            <li><span>Джакузи на свежем воздухе</span><span className="muted-light">круглый год</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============== EVENT KP FORM ==============
function EventKPForm() {
  const [sent, setSent] = useStateS(false);
  const [data, setData] = useStateS({ name: "", phone: "", type: "Корпоратив", guests: "", date: "", budget: "" });
  const set = (k, v) => setData({ ...data, [k]: v });
  const submit = (e) => {
    e.preventDefault();
    if (!data.name || !data.phone) return;
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };
  if (sent) {
    return (
      <div className="kp-form kp-form-sent">
        <div className="kp-sent-title">Заявка отправлена ✓</div>
        <div className="kp-sent-sub">Менеджер свяжется в течение 15 минут (10:00–21:00).</div>
      </div>
    );
  }
  return (
    <form className="kp-form" onSubmit={submit}>
      <div className="kp-form-head">
        <div className="kp-form-eyebrow">Получить КП</div>
        <div className="kp-form-title">Расскажите о мероприятии</div>
      </div>
      <div className="kp-grid">
        <label className="kp-field">
          <span>Имя</span>
          <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Как к вам обращаться" required />
        </label>
        <label className="kp-field">
          <span>Телефон</span>
          <input value={data.phone} onChange={(e) => set("phone", e.target.value)} type="tel" placeholder="+7 (___) ___-__-__" required />
        </label>
        <label className="kp-field">
          <span>Тип мероприятия</span>
          <select value={data.type} onChange={(e) => set("type", e.target.value)}>
            <option>Корпоратив</option>
            <option>Свадьба</option>
            <option>День рождения</option>
            <option>Тимбилдинг</option>
            <option>Банкет</option>
            <option>Другое</option>
          </select>
        </label>
        <label className="kp-field">
          <span>Гостей</span>
          <input value={data.guests} onChange={(e) => set("guests", e.target.value)} type="number" min="1" placeholder="20–60" />
        </label>
        <label className="kp-field">
          <span>Дата</span>
          <input value={data.date} onChange={(e) => set("date", e.target.value)} type="date" />
        </label>
        <label className="kp-field">
          <span>Бюджет, ₽</span>
          <input value={data.budget} onChange={(e) => set("budget", e.target.value)} placeholder="ориентир" />
        </label>
      </div>
      <div className="kp-actions">
        <button type="submit" className="btn btn-terra">Получить КП →</button>
        <a href="https://wa.me/79533667063" className="btn kp-wa" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </form>
  );
}

// ============== RESTAURANT (deprecated, kept as no-op) ==============
function Restaurant() { return null; }

// ============== ACTIVITIES ==============
function Activities({ T, season = "summer" }) {
  const [tab, setTab] = useStateS(season);
  useEffectS(() => { setTab(season); }, [season]);
  const data = ACTIVITIES[tab];
  return (
    <section className="section" id="activities" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="s-head">
          <div>
            <span className="eyebrow">{T.section_activities_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_activities_title}</h2>
          </div>
          <p className="lede">Лес, озеро, склоны Коробицино в 5 км. Найдётся, чем заняться круглый год — мы помогли с тем, чтобы вам не пришлось ничего планировать.</p>
        </div>

        <div className="act-tabs">
          {Object.entries(ACTIVITIES).map(([k, v]) => (
            <button key={k} className={`act-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
              {v.label}
            </button>
          ))}
        </div>

        <div className="act-panel">
          <div className="act-photo">
            <img src={data.photo} alt={data.label} className="photo-img" />
          </div>
          <div>
            <ul className="act-list">
              {data.items.map((it) => (
                <li key={it.name}>
                  <span>{it.name}</span>
                  <span className="price">{it.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============== EVENTS ==============
function Events({ T }) {
  return (
    <section className="section" id="events">
      <div className="container">
        <div className="events">
          <div className="events-text">
            <span className="eyebrow" style={{ color: "oklch(0.78 0.04 130)" }}>{T.section_events_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12, color: "var(--paper)" }}>{T.section_events_title}</h2>
            <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.55, opacity: 0.85, maxWidth: "48ch" }}>{T.section_events_body}</p>
            <div className="events-feats">
              <span>🎤 Сцена со звуком и светом</span>
              <span>🪑 До 60 человек на террасе</span>
              <span>🛏 Проживание для гостей</span>
              <span>🧖 Баня после праздника</span>
              <span>🅿️ Парковка и охрана</span>
              <span>📡 Wi-Fi на территории</span>
            </div>
            <div className="events-types">
              {EVENT_TYPES.map((e) => (
                <div className="event-card" key={e.num}>
                  <div className="num">{e.num}</div>
                  <div className="ttl">{e.title}</div>
                  <div className="desc">{e.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="events-form">
            <EventKPForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============== GALLERY ==============
function Gallery({ T, season = "summer" }) {
  const summerSlots = [
    { id: "g1", cls: "g g1", src: "media/topimage.jpg", alt: "Коттеджи летом" },
    { id: "g2", cls: "g g2", src: "media/velosiped3.jpg", alt: "Велосипеды у коттеджа" },
    { id: "g3", cls: "g g3", src: "media/42-7.jpg", alt: "Гамак в лесу" },
    { id: "g4", cls: "g g4", src: "media/kottedj_dlya_4.jpg", alt: "Интерьер коттеджа" },
    { id: "g5", cls: "g g5", src: "media/kott1_18_10.jpg", alt: "Коттедж с террасой" },
    { id: "g6", cls: "g g6", src: "media/banya5.jpg", alt: "Банные аксессуары" },
    { id: "g7", cls: "g g7", src: "media/66-7.jpg", alt: "Беседка в лесу" },
  ];
  const winterSlots = [
    { id: "g1", cls: "g g1", src: "media/banya_2018_2.jpg", alt: "Джакузи на снегу" },
    { id: "g2", cls: "g g2", src: "media/34-7.jpg", alt: "Площадка в снегу" },
    { id: "g3", cls: "g g3", src: "media/banya_2018_4.jpg", alt: "Коттедж зимой" },
    { id: "g4", cls: "g g4", src: "media/banya_2018_13.jpg", alt: "Зимняя терраса" },
    { id: "g5", cls: "g g5", src: "media/432-7.jpg", alt: "Зимний коттедж" },
    { id: "g6", cls: "g g6", src: "media/banya_2018_10.jpg", alt: "Парная" },
    { id: "g7", cls: "g g7", src: "media/110-7.jpg", alt: "Зимний хоровод" },
  ];
  const slots = season === "winter" ? winterSlots : summerSlots;
  const lede = season === "winter"
    ? "Зима в Траве — пар после катания, джакузи под звёздами и хвойный воздух с морозцем. Снимки сделаны нашими гостями."
    : "Лес, баня под открытым небом, неспешные завтраки и зимние вечера у печки. Самые честные фотографии — те, что сделаны гостями.";
  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="s-head">
          <div>
            <span className="eyebrow">{T.section_gallery_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_gallery_title}</h2>
          </div>
          <p className="lede">{lede}</p>
        </div>
        <div className="gallery-grid">
          {slots.map((s) => (
            <div key={s.id} className={s.cls}>
              <img src={s.src} alt={s.alt} className="photo-img" key={s.src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== REVIEWS ==============
function Reviews({ T }) {
  return (
    <section className="section" id="reviews" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="s-head">
          <div>
            <span className="eyebrow">{T.section_reviews_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_reviews_title}</h2>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1 }}>4.9</span>
              <div>
                <div style={{ color: "var(--terra-600)", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>★★★★★</div>
                <div className="muted" style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>на основе 247 отзывов</div>
              </div>
            </div>
          </div>
        </div>
        <div className="reviews">
          {REVIEWS.map((r, i) => (
            <article className="review" key={i}>
              <div className="stars">{r.stars}</div>
              <div className="text">{r.text}</div>
              <div className="who">
                <div className="av">{r.initials}</div>
                <div className="who-meta">
                  <span className="who-name">{r.name}</span>
                  <span className="who-date">{r.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== FAQ ==============
function FAQ({ T }) {
  const [open, setOpen] = useStateS(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{T.section_faq_eyebrow}</span>
          <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_faq_title}</h2>
        </div>
        <div className="faq">
          {FAQ_DATA.map((item, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={i} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span>{item.q}</span>
                <span className="ico"></span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== CONTACTS ==============
function Contacts({ T }) {
  return (
    <section className="section" id="contacts" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="s-head">
          <div>
            <span className="eyebrow">{T.section_contacts_eyebrow}</span>
            <h2 className="h-display h2" style={{ marginTop: 12 }}>{T.section_contacts_title}</h2>
          </div>
          <p className="lede">Звоните с 10:00 до 21:00 — менеджеры отвечают сразу. Или приезжайте: автобус №898 от м. Парнас, или 1,5 часа на машине.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Загородный клуб «ТРАВА»</h3>
            <div className="row">
              <div className="label">Адрес</div>
              <div className="val">Ленинградская обл., Приозерский р-н,<br/>пос. Мичуринское</div>
            </div>
            <div className="row">
              <div className="label">GPS</div>
              <div className="val" style={{ fontFamily: "var(--font-mono)", fontSize: 16 }}>60.552695, 29.8067</div>
            </div>
            <div className="row">
              <div className="label">Как доехать</div>
              <div className="val">Автобус №898 от м. Парнас · 1,5 ч<br/>На машине — 1,5 ч от Петербурга<br/>Трансфер от ресепшен — платно</div>
            </div>
            <div className="row">
              <div className="label">Телефон · WhatsApp · 10:00 — 21:00</div>
              <div className="val"><a href="tel:+79533667063">+7 (953) 366-70-63</a></div>
            </div>
            <div className="row">
              <div className="label">Email</div>
              <div className="val"><a href="mailto:trava.tv.trava@gmail.com">trava.tv.trava@gmail.com</a></div>
            </div>
            <div className="row">
              <div className="label">ВКонтакте</div>
              <div className="val"><a href="https://vk.com/clubtrava_tv" target="_blank" rel="noopener">vk.com/clubtrava_tv</a></div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: "auto", position: "relative", flexWrap: "wrap" }}>
              <a href="#booking" className="btn btn-light">Забронировать онлайн</a>
              <a href="https://wa.me/79533667063" className="btn btn-ghost" style={{ borderColor: "oklch(1 0 0 / 0.3)", color: "var(--paper)" }} target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
          <div className="map">
            <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="mapDots" patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="2" cy="2" r="1" fill="oklch(0.42 0.06 145)" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="800" height="600" fill="oklch(0.94 0.018 120)"/>
              <rect width="800" height="600" fill="url(#mapDots)"/>
              {/* Lake */}
              <path d="M 380 220 Q 460 200 540 240 T 620 320 Q 600 380 540 400 T 420 380 Q 360 340 380 220 Z" fill="oklch(0.78 0.04 220)" opacity="0.6"/>
              <text x="500" y="320" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="0.14em" fill="oklch(0.4 0.06 220)" textAnchor="middle">ОЗЕРО</text>
              {/* Roads */}
              <path d="M 0 480 Q 240 420 480 460 T 800 440" stroke="oklch(0.7 0.02 85)" strokeWidth="3" fill="none"/>
              <path d="M 460 460 L 480 320" stroke="oklch(0.7 0.02 85)" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
              {/* Forest dots */}
              {Array.from({ length: 60 }).map((_, i) => {
                const x = (i * 137) % 800;
                const y = (i * 91 + 50) % 600;
                if (x > 380 && x < 620 && y > 220 && y < 400) return null;
                return <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.42 0.06 145)" opacity="0.5"/>
              })}
              <text x="60" y="500" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="0.14em" fill="oklch(0.4 0.06 145)">м. Парнас ← автобус 898</text>
              <text x="700" y="430" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="0.14em" fill="oklch(0.4 0.06 145)" textAnchor="end">→ Приозерск</text>
              <text x="60" y="540" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="0.1em" fill="oklch(0.4 0.06 145)" opacity="0.7">60.552695, 29.8067</text>
            </svg>
            <div className="map-pin">
              <div className="label">TRAVA · Мичуринское</div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============== FOOTER ==============
function Footer({ T }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            TRAVA
            <span className="sub">Загородный клуб · с 2014 года</span>
          </div>
        </div>
        <div>
          <h4>Сайт</h4>
          <ul>
            <li><a href="#cottages">Проживание</a></li>
            <li><a href="#banya">Баня и джакузи</a></li>
            <li><a href="#activities">Активности</a></li>
            <li><a href="#events">Корпоративы</a></li>
            <li><a href="#winter">Зима</a></li>
          </ul>
        </div>
        <div>
          <h4>Контакты</h4>
          <ul>
            <li>+7 (953) 366-70-63</li>
            <li>trava.tv.trava@gmail.com</li>
            <li>10:00 — 21:00 ежедневно</li>
            <li>Приозерский р-н, пос. Мичуринское</li>
          </ul>
        </div>
        <div>
          <h4>Соцсети</h4>
          <ul>
            <li><a href="https://vk.com/clubtrava_tv" target="_blank" rel="noopener">ВКонтакте</a></li>
            <li><a href="https://wa.me/79533667063" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/trava.club/" target="_blank" rel="noopener">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <span>© 2014–2026 TRAVA. Все права защищены.</span>
        <span>Политика конфиденциальности · Правила проживания</span>
      </div>
    </footer>
  );
}

// Export
Object.assign(window, {
  Header, Hero, BookingBand, FactsBand, OverviewCards, Cottages, Banya, Restaurant, Activities, Events, EventKPForm, WinterSection, SeasonalFX, Gallery, Reviews, FAQ, Contacts, Footer,
  STRINGS,
});

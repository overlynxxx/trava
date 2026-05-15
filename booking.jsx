// Booking module — даты, гости, тип размещения, доп.услуги
const { useState, useMemo, useEffect, useRef } = React;

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DOW_RU = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

const COTTAGE_TYPES = [
  { id: "4p", title: "Коттедж на 4", desc: "До 5 гостей, 50 м²", price: 7000, capacity: 5 },
  { id: "8p", title: "Коттедж на 8–10", desc: "Большая компания, 2 спальни", price: 16000, capacity: 10 },
];

const EXTRAS = [
  { id: "banya", title: "Баня (3 часа)", price: 4500 },
  { id: "jacuzzi", title: "Джакузи на улице", price: 2500 },
  { id: "bikes", title: "Велосипеды", price: 600 },
  { id: "atv", title: "Квадроцикл", price: 3500 },
  { id: "grill", title: "Гриль-сет", price: 2000 },
  { id: "transfer", title: "Трансфер от м. Парнас", price: 4500 },
];

function fmtDate(d) {
  if (!d) return null;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = MONTHS_RU[d.getMonth()].slice(0, 3).toLowerCase();
  return `${dd} ${mm}`;
}
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function Calendar({ checkIn, checkOut, onSelect }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  // Disabled (booked) dates — несколько случайных, чтобы было «живо»
  const disabled = useMemo(() => {
    const set = new Set();
    const offsets = [3, 4, 12, 13, 14, 22];
    for (const o of offsets) {
      const d = new Date(today); d.setDate(d.getDate() + o);
      set.add(d.toDateString());
    }
    return set;
  }, []);

  const monthDays = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const last = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    const dow = (first.getDay() + 6) % 7; // Mon = 0
    const days = [];
    for (let i = 0; i < dow; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(view.getFullYear(), view.getMonth(), d));
    return days;
  }, [view]);

  const handle = (d) => {
    if (!d) return;
    if (!checkIn || (checkIn && checkOut)) {
      onSelect({ checkIn: d, checkOut: null });
    } else if (d <= checkIn) {
      onSelect({ checkIn: d, checkOut: null });
    } else {
      onSelect({ checkIn, checkOut: d });
    }
  };

  return (
    <div>
      <div className="cal-head">
        <button onClick={(e) => { e.stopPropagation(); setView(new Date(view.getFullYear(), view.getMonth() - 1, 1)); }}>‹</button>
        <div className="month">{MONTHS_RU[view.getMonth()]} {view.getFullYear()}</div>
        <button onClick={(e) => { e.stopPropagation(); setView(new Date(view.getFullYear(), view.getMonth() + 1, 1)); }}>›</button>
      </div>
      <div className="cal-grid">
        {DOW_RU.map((d) => <div key={d} className="dow">{d}</div>)}
        {monthDays.map((d, i) => {
          if (!d) return <div key={i} className="day muted"></div>;
          const isPast = d < today;
          const isDisabled = disabled.has(d.toDateString()) || isPast;
          const isStart = sameDay(d, checkIn);
          const isEnd = sameDay(d, checkOut);
          const inRange = checkIn && checkOut && d > checkIn && d < checkOut;
          const isToday = sameDay(d, today);
          const cls = ["day"];
          if (isDisabled) cls.push("disabled");
          if (inRange) cls.push("in-range");
          if (isStart) cls.push("range-start");
          if (isEnd) cls.push("range-end");
          if (isToday) cls.push("today");
          return (
            <div
              key={i}
              className={cls.join(" ")}
              onClick={(e) => { e.stopPropagation(); if (!isDisabled) handle(d); }}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuestPopover({ adults, kids, setAdults, setKids, max }) {
  const Counter = ({ value, set, min = 0, max: m = 20 }) => (
    <div className="guest-counter">
      <button onClick={(e) => { e.stopPropagation(); set(Math.max(min, value - 1)); }} disabled={value <= min}>−</button>
      <span className="num">{value}</span>
      <button onClick={(e) => { e.stopPropagation(); set(Math.min(m, value + 1)); }} disabled={value >= m}>+</button>
    </div>
  );
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="guest-row">
        <div>
          <div className="name">Взрослые</div>
          <div className="meta">от 14 лет</div>
        </div>
        <Counter value={adults} set={setAdults} min={1} max={max} />
      </div>
      <div className="guest-row">
        <div>
          <div className="name">Дети</div>
          <div className="meta">до 14 лет — бесплатно</div>
        </div>
        <Counter value={kids} set={setKids} min={0} max={max} />
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
        Всего: {adults + kids} {kids > 0 ? `(${adults} взр + ${kids} дет)` : ""}
      </div>
    </div>
  );
}

function TypePopover({ type, setType, totalGuests }) {
  return (
    <div className="type-grid" onClick={(e) => e.stopPropagation()}>
      {COTTAGE_TYPES.map((c) => {
        const tooSmall = totalGuests > c.capacity;
        return (
          <button
            key={c.id}
            className={`type-card ${type === c.id ? "active" : ""}`}
            onClick={() => setType(c.id)}
            style={tooSmall ? { opacity: 0.5 } : {}}
          >
            <div className="ttl">{c.title}</div>
            <div className="desc">{c.desc}</div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--bark-500)" }}>
              от <b style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--bark-900)" }}>{c.price.toLocaleString("ru")} ₽</b> / ночь
            </div>
            {tooSmall && <div style={{ fontSize: 11, color: "var(--terra-600)", marginTop: 6 }}>Не подходит для {totalGuests} гостей</div>}
          </button>
        );
      })}
    </div>
  );
}

function BookingWidget({ variant = "hero" }) {
  const [open, setOpen] = useState(null); // 'dates' | 'guests' | 'type' | null
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [type, setType] = useState("4p");
  const [extras, setExtras] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);

  const totalGuests = adults + kids;
  const nights = nightsBetween(checkIn, checkOut);
  const cottage = COTTAGE_TYPES.find((c) => c.id === type);
  const extrasTotal = Object.entries(extras).filter(([_, v]) => v).reduce((s, [k]) => {
    const ex = EXTRAS.find((e) => e.id === k);
    if (!ex) return s;
    return s + (ex.perPerson ? ex.price * totalGuests : ex.price);
  }, 0);
  const total = (nights || 0) * (cottage?.price || 0) + extrasTotal;

  // Auto-pick type if guests don't fit
  useEffect(() => {
    if (totalGuests > 5 && type === "4p") setType("8p");
  }, [totalGuests]);

  // Click outside to close popover
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onSelectDates = ({ checkIn: ci, checkOut: co }) => {
    setCheckIn(ci); setCheckOut(co);
    if (ci && co) setOpen(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) { setOpen("dates"); return; }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (submitted) {
    return (
      <div className="booking" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 32, marginBottom: 8 }}>Запрос отправлен ✓</div>
        <div className="muted">Мы свяжемся с вами в течение 15 минут с 10:00 до 21:00</div>
      </div>
    );
  }

  return (
    <div className="booking" ref={ref}>
      <form className="booking-row" onSubmit={submit}>
        <div className={`booking-field ${open === "dates" ? "is-active" : ""}`} onClick={() => setOpen(open === "dates" ? null : "dates")}>
          <label>Заезд — Выезд</label>
          <div className={`value ${!checkIn ? "placeholder" : ""}`}>
            {checkIn ? `${fmtDate(checkIn)} ${checkOut ? "— " + fmtDate(checkOut) : "—"}` : "Выберите даты"}
          </div>
          {nights > 0 && <div className="sub">{nights} ноч.</div>}
          {open === "dates" && (
            <div className="booking-popover" onClick={(e) => e.stopPropagation()} style={{ minWidth: 360 }}>
              <Calendar checkIn={checkIn} checkOut={checkOut} onSelect={onSelectDates} />
            </div>
          )}
        </div>

        <div className={`booking-field ${open === "guests" ? "is-active" : ""}`} onClick={() => setOpen(open === "guests" ? null : "guests")}>
          <label>Гости</label>
          <div className="value">{totalGuests} {totalGuests === 1 ? "гость" : totalGuests < 5 ? "гостя" : "гостей"}</div>
          <div className="sub">{adults} взр {kids > 0 ? `· ${kids} дет` : ""}</div>
          {open === "guests" && (
            <div className="booking-popover" onClick={(e) => e.stopPropagation()}>
              <GuestPopover adults={adults} kids={kids} setAdults={setAdults} setKids={setKids} max={cottage?.capacity || 8} />
            </div>
          )}
        </div>

        <div className={`booking-field ${open === "type" ? "is-active" : ""}`} onClick={() => setOpen(open === "type" ? null : "type")}>
          <label>Размещение</label>
          <div className="value">{cottage?.title}</div>
          <div className="sub">от {cottage?.price.toLocaleString("ru")} ₽/ноч.</div>
          {open === "type" && (
            <div className="booking-popover align-right" onClick={(e) => e.stopPropagation()} style={{ minWidth: 420 }}>
              <TypePopover type={type} setType={(t) => { setType(t); setOpen(null); }} totalGuests={totalGuests} />
            </div>
          )}
        </div>

        <div className="booking-field" style={{ cursor: "default" }}>
          <label>Итого</label>
          <div className="value">
            {nights > 0 ? `${total.toLocaleString("ru")} ₽` : "—"}
          </div>
          <div className="sub">
            {nights > 0 ? `за ${nights} ноч.` : "выберите даты"}
          </div>
        </div>

        <button type="submit" className="btn btn-terra">
          Забронировать
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </form>

      <div className="booking-extras">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bark-500)", alignSelf: "center", marginRight: 6 }}>+ к брони:</span>
        {EXTRAS.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`chip ${extras[e.id] ? "active" : ""}`}
            onClick={() => setExtras({ ...extras, [e.id]: !extras[e.id] })}
          >
            {e.title}
            <span className="price">{e.price.toLocaleString("ru")} ₽{e.perPerson ? "/чел" : ""}</span>
          </button>
        ))}
      </div>

      {nights > 0 && (
        <div className="booking-summary">
          <div>
            {cottage?.title} · {nights} ноч. · {totalGuests} гост.
            {extrasTotal > 0 && ` · доп. ${extrasTotal.toLocaleString("ru")} ₽`}
          </div>
          <div className="total">{total.toLocaleString("ru")} ₽</div>
        </div>
      )}
    </div>
  );
}

window.BookingWidget = BookingWidget;

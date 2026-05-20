// Booking module — даты, гости, тип размещения, доп.услуги + интеграция Bnovo + ЮKassa
const { useState, useMemo, useEffect, useRef, useCallback } = React;

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

// ===== Helpers =====
function fmtDate(d) {
  if (!d) return null;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = MONTHS_RU[d.getMonth()].slice(0, 3).toLowerCase();
  return `${dd} ${mm}`;
}
function fmtDateISO(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtPhone(raw) {
  const num = raw.replace(/\D/g, '').replace(/^8/, '7').replace(/^07/, '79');
  if (num.length !== 11) return null;
  return `+${num.slice(0,1)} (${num.slice(1,4)}) ${num.slice(4,7)}-${num.slice(7,9)}-${num.slice(9,11)}`;
}
function parsePhone(raw) {
  return raw.replace(/\D/g, '').replace(/^8/, '7');
}

// ===== Calendar =====
function Calendar({ checkIn, checkOut, onSelect }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
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
    const dow = (first.getDay() + 6) % 7;
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

// ===== Guest Popover =====
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
      <div className="guest-row"><div><div className="name">Взрослые</div><div className="meta">от 14 лет</div></div><Counter value={adults} set={setAdults} min={1} max={max} /></div>
      <div className="guest-row"><div><div className="name">Дети</div><div className="meta">до 14 лет — бесплатно</div></div><Counter value={kids} set={setKids} min={0} max={max} /></div>
      <div className="muted" style={{ fontSize: 12, marginTop: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
        Всего: {adults + kids} {kids > 0 ? `(${adults} взр + ${kids} дет)` : ""}
      </div>
    </div>
  );
}

// ===== Cottage Type Popover =====
function TypePopover({ type, setType, totalGuests }) {
  return (
    <div className="type-grid" onClick={(e) => e.stopPropagation()}>
      {COTTAGE_TYPES.map((c) => {
        const tooSmall = totalGuests > c.capacity;
        return (
          <button key={c.id} className={`type-card ${type === c.id ? "active" : ""}`} onClick={() => setType(c.id)} style={tooSmall ? { opacity: 0.5 } : {}}>
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

// ===== Loading Spinner =====
function Spinner({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" style={{ animation: "spin 1s linear infinite", marginRight: 8 }}>
      <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M11 1 a10 10 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </svg>
  );
}

// ===== Contact Fields (inline) =====
function ContactFields({ name, phone, email, setName, setPhone, setEmail, errors }) {
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 280 }}>
      <div>
        <label style={{ fontSize: 12, color: "var(--bark-700)", display: "block", marginBottom: 4, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Имя *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Анна Иванова"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: errors.name ? "1px solid var(--terra-600)" : "1px solid var(--line)", fontSize: 15, background: "var(--paper)", color: "var(--bark-900)" }}
        />
        {errors.name && <div style={{ fontSize: 11, color: "var(--terra-600)", marginTop: 3 }}>{errors.name}</div>}
      </div>
      <div>
        <label style={{ fontSize: 12, color: "var(--bark-700)", display: "block", marginBottom: 4, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Телефон *</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: errors.phone ? "1px solid var(--terra-600)" : "1px solid var(--line)", fontSize: 15, background: "var(--paper)", color: "var(--bark-900)" }}
        />
        {errors.phone && <div style={{ fontSize: 11, color: "var(--terra-600)", marginTop: 3 }}>{errors.phone}</div>}
      </div>
      <div>
        <label style={{ fontSize: 12, color: "var(--bark-700)", display: "block", marginBottom: 4, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="anna@example.com"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 15, background: "var(--paper)", color: "var(--bark-900)" }}
        />
      </div>
    </div>
  );
}

// ===== States =====
const STATUS = {
  IDLE: 'idle',
  CHECKING: 'checking',     // Проверяем доступность
  BOOKING: 'booking',       // Создаём бронь
  PAYING: 'paying',         // Создаём платёж
  SUCCESS: 'success',     // Готово
  ERROR: 'error',           // Ошибка
  NOT_AVAILABLE: 'not_available', // Мест нет
};

// ===== Main Booking Widget =====
function BookingWidget({ variant = "hero" }) {
  const [open, setOpen] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [type, setType] = useState("4p");
  const [extras, setExtras] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payNow, setPayNow] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [errors, setErrors] = useState({});
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

  // Auto-pick type
  useEffect(() => {
    if (totalGuests > 5 && type === "4p") setType("8p");
  }, [totalGuests]);

  // Click outside
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Parse URL params on load (редирект после оплаты)
  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentStatus = url.searchParams.get('payment');
    const bId = url.searchParams.get('booking');
    if (paymentStatus === 'success' && bId) {
      setStatus(STATUS.SUCCESS);
      setBookingResult({ bookingNumber: bId, payment: true });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const onSelectDates = ({ checkIn: ci, checkOut: co }) => {
    setCheckIn(ci); setCheckOut(co);
    if (ci && co) setOpen(null);
  };

  const validate = () => {
    const errs = {};
    if (!checkIn || !checkOut) errs.dates = "Выберите даты";
    if (!name.trim()) errs.name = "Укажите имя";
    const phoneDigits = parsePhone(phone);
    if (!phoneDigits || phoneDigits.length < 10) errs.phone = "Укажите корректный телефон";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getSelectedExtras = () => {
    return Object.entries(extras).filter(([_, v]) => v).map(([id]) => {
      const ex = EXTRAS.find(e => e.id === id);
      return { id, title: ex?.title, price: ex?.price };
    });
  };

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    setErrors({});

    // Validate
    if (!checkIn || !checkOut) { setOpen("dates"); return; }
    if (!name.trim() || !phone.trim()) {
      const errs = {};
      if (!name.trim()) errs.name = "Укажите имя";
      if (!phone.trim()) errs.phone = "Укажите телефон";
      setErrors(errs);
      setOpen("contacts");
      return;
    }
    const phoneDigits = parsePhone(phone);
    if (!phoneDigits || phoneDigits.length < 10) {
      setErrors({ phone: "Неверный формат телефона" });
      setOpen("contacts");
      return;
    }

    // Step 1: Check availability
    setStatus(STATUS.CHECKING);
    try {
      const avail = await (window.BnovoClient ? BnovoClient.checkAvailability({
        checkIn: fmtDateISO(checkIn),
        checkOut: fmtDateISO(checkOut),
        roomType: type,
      }) : Promise.resolve({ available: true }));

      if (!avail.available) {
        setStatus(STATUS.NOT_AVAILABLE);
        setErrorMsg("Выбранные даты уже заняты. Попробуйте другие даты.");
        return;
      }

      // Step 2: Create booking
      setStatus(STATUS.BOOKING);
      const bookingData = {
        checkIn: fmtDateISO(checkIn),
        checkOut: fmtDateISO(checkOut),
        roomType: type,
        adults,
        kids,
        name: name.trim(),
        phone: phoneDigits,
        email: email.trim(),
        extras: getSelectedExtras(),
        total,
        nights,
      };

      const bResult = await (window.BnovoClient ? BnovoClient.createBooking(bookingData) : Promise.resolve({
        success: true, bookingId: Math.floor(Math.random()*900000)+100000, bookingNumber: "B" + Math.floor(Math.random()*900000)+100000
      }));

      if (!bResult.success) {
        setStatus(STATUS.ERROR);
        setErrorMsg(bResult.error || "Не удалось создать бронь. Попробуйте позже.");
        return;
      }

      // Step 3: Payment (optional)
      if (payNow && total > 0) {
        setStatus(STATUS.PAYING);
        const pResult = await (window.YooKassaClient ? YooKassaClient.createPayment({
          amount: total,
          bookingNumber: bResult.bookingNumber,
          description: `Бронирование TRAVA #${bResult.bookingNumber}`,
          returnUrl: `${window.location.origin}?payment=success&booking=${bResult.bookingNumber}`,
          customer: { name: name.trim(), email: email.trim(), phone: phoneDigits },
        }) : Promise.resolve({ success: true, paymentUrl: null, paymentId: 'test' }));

        if (!pResult.success) {
          // Booking created but payment failed — show booking number anyway
          setStatus(STATUS.SUCCESS);
          setBookingResult({ ...bResult, payment: false, paymentError: pResult.error });
          return;
        }

        if (pResult.paymentUrl) {
          window.location.href = pResult.paymentUrl;
          return; // уйдём на ЮKassa
        }
      }

      // No payment or done
      setStatus(STATUS.SUCCESS);
      setBookingResult({ ...bResult, payment: payNow });
    } catch (err) {
      console.error('Booking error:', err);
      setStatus(STATUS.ERROR);
      setErrorMsg(err.message || "Что-то пошло не так. Попробуйте ещё раз.");
    }
  }, [checkIn, checkOut, type, adults, kids, name, phone, email, extras, payNow, total, nights]);

  const reset = () => {
    setStatus(STATUS.IDLE);
    setErrorMsg("");
    setBookingResult(null);
    setOpen(null);
  };

  // ===== States UI =====
  if (status === STATUS.SUCCESS) {
    return (
      <div className="booking" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 8 }}>✓ Бронирование создано</div>
        <div className="muted" style={{ marginBottom: 12, fontSize: 16 }}>
          Номер брони: <b style={{ color: "var(--moss-700)", fontSize: 22 }}>#{bookingResult?.bookingNumber || bookingResult?.bookingId}</b>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          {fmtDate(checkIn)} — {fmtDate(checkOut)} · {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
          <br />{cottage?.title} · {totalGuests} {totalGuests === 1 ? 'гость' : totalGuests < 5 ? 'гостя' : 'гостей'}
          {bookingResult?.payment && <><br /><span style={{ color: "var(--moss-700)" }}>Оплата получена ✓</span></>}
        </div>
        <button type="button" className="btn btn-terra" onClick={reset}>Новая бронь</button>
      </div>
    );
  }

  if (status === STATUS.CHECKING || status === STATUS.BOOKING || status === STATUS.PAYING) {
    return (
      <div className="booking" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: 22 }}>
          <Spinner size={22} />
          {status === STATUS.CHECKING ? "Проверяем доступность..." : status === STATUS.BOOKING ? "Создаём бронь..." : "Перенаправляем на оплату..."}
        </div>
      </div>
    );
  }

  if (status === STATUS.NOT_AVAILABLE) {
    return (
      <div className="booking" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ color: "var(--terra-600)", fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>Мест нет на выбранные даты</div>
        <div className="muted" style={{ marginBottom: 16 }}>{errorMsg}</div>
        <button type="button" className="btn btn-terra" onClick={reset}>Попробовать другие даты</button>
      </div>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <div className="booking" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ color: "var(--terra-600)", fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>Ошибка</div>
        <div className="muted" style={{ marginBottom: 16 }}>{errorMsg}</div>
        <button type="button" className="btn btn-terra" onClick={reset}>Попробовать снова</button>
      </div>
    );
  }

  // ===== Main Form =====
  return (
    <div className="booking" ref={ref}>
      <form className="booking-row" onSubmit={submit}>
        {/* Dates */}
        <div className={`booking-field ${open === "dates" ? "is-active" : ""} ${errors.dates ? "has-error" : ""}`} onClick={() => setOpen(open === "dates" ? null : "dates")}>
          <label>Заезд — Выезд</label>
          <div className={`value ${!checkIn ? "placeholder" : ""}`}>
            {checkIn ? `${fmtDate(checkIn)} ${checkOut ? "— " + fmtDate(checkOut) : "—"}` : "Выберите даты"}
          </div>
          {nights > 0 && <div className="sub">{nights} ноч.</div>}
          {errors.dates && <div style={{ fontSize: 11, color: "var(--terra-600)", marginTop: 2 }}>{errors.dates}</div>}
          {open === "dates" && (
            <div className="booking-popover" onClick={(e) => e.stopPropagation()} style={{ minWidth: 360 }}>
              <Calendar checkIn={checkIn} checkOut={checkOut} onSelect={onSelectDates} />
            </div>
          )}
        </div>

        {/* Guests */}
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

        {/* Type */}
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

        {/* Contacts */}
        <div className={`booking-field ${open === "contacts" ? "is-active" : ""}`} onClick={() => setOpen(open === "contacts" ? null : "contacts")}>
          <label>Контакты</label>
          <div className={`value ${!name.trim() ? "placeholder" : ""}`}>
            {name.trim() || "Введите данные"}
          </div>
          {name.trim() && <div className="sub">{fmtPhone(phone) || phone}</div>}
          {open === "contacts" && (
            <div className="booking-popover" onClick={(e) => e.stopPropagation()} style={{ minWidth: 320 }}>
              <ContactFields name={name} phone={phone} email={email} setName={setName} setPhone={setPhone} setEmail={setEmail} errors={errors} />
            </div>
          )}
        </div>

        {/* Total */}
        <div className="booking-field" style={{ cursor: "default" }}>
          <label>Итого</label>
          <div className="value">{nights > 0 ? `${total.toLocaleString("ru")} ₽` : "—"}</div>
          <div className="sub">{nights > 0 ? `за ${nights} ноч.` : "выберите даты"}</div>
        </div>

        {/* Payment toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <input type="checkbox" id="pay-now" checked={payNow} onChange={(e) => setPayNow(e.target.checked)} />
          <label htmlFor="pay-now" style={{ fontSize: 13, cursor: "pointer", userSelect: "none" }}>Оплатить сейчас</label>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-terra">
          {payNow ? "Забронировать и оплатить" : "Забронировать"}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </form>

      {/* Extras */}
      <div className="booking-extras">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--bark-500)", alignSelf: "center", marginRight: 6 }}>+ к брони:</span>
        {EXTRAS.map((e) => (
          <button key={e.id} type="button" className={`chip ${extras[e.id] ? "active" : ""}`} onClick={() => setExtras({ ...extras, [e.id]: !extras[e.id] })}>
            {e.title}
            <span className="price">{e.price.toLocaleString("ru")} ₽{e.perPerson ? "/чел" : ""}</span>
          </button>
        ))}
      </div>

      {/* Summary */}
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

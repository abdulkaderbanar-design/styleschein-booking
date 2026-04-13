import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

// --- DATA from StyleSchein website ---
const SERVICES = {
  haarschnitte: [
    { id: 1, name: "Herrenhaarschnitt", duration: 30, price: 20, cat: "Haarschnitte" },
    { id: 2, name: "Maschinenhaarschnitt", duration: 20, price: 15, cat: "Haarschnitte" },
    { id: 3, name: "Maschinenhaarschnitt mit Übergang", duration: 25, price: 20, cat: "Haarschnitte" },
    { id: 4, name: "Kinderhaarschnitt", duration: 20, price: 15, cat: "Haarschnitte" },
  ],
  bartpflege: [
    { id: 5, name: "Bart trimmen & Konturen", duration: 20, price: 15, cat: "Bartpflege" },
    { id: 6, name: "Klassische Nassrasur", duration: 25, price: 15, cat: "Bartpflege" },
    { id: 7, name: "Bart färben", duration: 30, price: 15, cat: "Bartpflege" },
  ],
  zusaetzlich: [
    { id: 8, name: "Augenbrauen zupfen mit Faden", duration: 10, price: 10, cat: "Zusätzlich" },
    { id: 9, name: "Ohren & Nase mit Wachs reinigen", duration: 10, price: 10, cat: "Zusätzlich" },
    { id: 10, name: "Kopfrasur mit Messer", duration: 25, price: 20, cat: "Zusätzlich" },
    { id: 11, name: "Gesichtsmaske Pflege", duration: 30, price: 20, cat: "Zusätzlich" },
  ],
  pakete: [
    { id: 12, name: "Komplettpaket", duration: 60, price: 60, cat: "Paket" },
  ],
};

const ALL_SERVICES = [...SERVICES.haarschnitte, ...SERVICES.bartpflege, ...SERVICES.zusaetzlich, ...SERVICES.pakete];

const HOURS = {
  1: { open: "10:00", close: "19:00" }, // Mo
  2: { open: "10:00", close: "19:00" }, // Di
  3: { open: "10:00", close: "19:00" }, // Mi
  4: { open: "10:00", close: "19:00" }, // Do
  5: { open: "09:00", close: "19:00" }, // Fr
  6: { open: "09:00", close: "17:00" }, // Sa
  0: null, // So - geschlossen
};

const SHOP = {
  name: "StyleSchein",
  tagline: "Friseur aus Leidenschaft, Schnitte aus Erfahrung",
  subtitle: "HAIRCUT & SHAVE",
  address: "Himmelgeisterstr. 131",
  city: "40225 Düsseldorf",
  ubahn: "D-Moorenstraße · D-Chlodwigstraße",
  phone: "+49 211 1234567",
};

// Color palette from website
const C = {
  bg: "#0a1f10",
  bgLight: "#0f2b16",
  bgCard: "rgba(180,155,100,0.12)",
  bgCardSolid: "#1a3a22",
  gold: "#c4a265",
  goldLight: "#d4b87a",
  goldDark: "#a08245",
  goldBg: "rgba(196,162,101,0.15)",
  goldBorder: "rgba(196,162,101,0.3)",
  text: "#f0ece4",
  textMuted: "rgba(240,236,228,0.55)",
  textDim: "rgba(240,236,228,0.3)",
  green: "#1a5c2e",
  greenLight: "#2a7a40",
  success: "#3cb55c",
  error: "#d94040",
};

// --- SVG Icons ---
const Icons = {
  scissors: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  ),
  razor: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v12a2 2 0 002 2h6a2 2 0 002-2V3"/><path d="M7 8h10"/><path d="M10 17v4"/><path d="M14 17v4"/>
    </svg>
  ),
  sparkle: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
    </svg>
  ),
  gift: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13"/><path d="M3 13h18"/><path d="M8 8c0-2 1-4 4-4s4 2 4 4"/>
    </svg>
  ),
  calendar: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clock: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  user: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  phone: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  bell: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  mapPin: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  check: (s = 20, c = C.success) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: (s = 20, c = C.error) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  home: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  list: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  chevLeft: (s = 20, c = C.textMuted) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  train: (s = 16, c = C.goldLight) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/><circle cx="8" cy="15" r="1" fill={c}/><circle cx="16" cy="15" r="1" fill={c}/>
    </svg>
  ),
};

// Real logo image
const LOGO_SRC = "data:image/png;base64,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";
const INTERIOR_SRC = "data:image/jpeg;base64,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";
const Logo = ({ size = 70 }) => (
  <img src={LOGO_SRC} alt="StyleSchein Logo" style={{ width: size, height: size, objectFit: "contain", display: "block" }} />
);

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "success" ? C.success : type === "error" ? C.error : C.gold;
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
      background: bg, color: "#fff", padding: "14px 28px", borderRadius: 14,
      zIndex: 9999, fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600,
      boxShadow: `0 8px 32px ${bg}55`, animation: "slideDown 0.4s ease",
      maxWidth: "90vw", textAlign: "center",
    }}>{message}</div>
  );
}

function getServiceIcon(cat) {
  if (cat === "Haarschnitte") return Icons.scissors;
  if (cat === "Bartpflege") return Icons.razor;
  if (cat === "Paket") return Icons.gift;
  return Icons.sparkle;
}

// Separate memoized form to prevent full app re-render on keystrokes
const ConfirmForm = memo(({ onBook, onBack, selectedServices, selectedDate, selectedTime, totalPrice, totalDuration, serviceNames, initialName, initialPhone }) => {
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [reminder, setReminder] = useState(true);

  const iStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 10,
    background: "rgba(255,255,255,0.06)", border: `1px solid ${C.goldBorder}`,
    color: C.text, fontSize: 15, fontFamily: "'Cormorant Garamond', serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "16px 20px" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Buchung bestätigen</h3>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
        Bitte überprüfe deine Angaben
      </p>

      {/* Summary */}
      <div style={{
        background: C.goldBg, border: `1px solid ${C.goldBorder}`,
        borderRadius: 16, padding: "20px", marginBottom: 20,
      }}>
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.goldBorder}` }}>
          <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Services</div>
          {selectedServices.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                {getServiceIcon(s.cat)(16, C.gold)} {s.name}
              </div>
              <div style={{ color: C.gold, fontWeight: 600, fontSize: 14, fontFamily: "'Cormorant Garamond', serif" }}>{s.price}€</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.goldBorder}` }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>Gesamt · ca. {totalDuration} Min.</span>
            <span style={{ color: C.gold, fontSize: 20, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{totalPrice}€</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
              {Icons.calendar(12, C.textDim)} Datum
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{selectedDate?.split("-").reverse().join(".")}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
              {Icons.clock(12, C.textDim)} Uhrzeit
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{selectedTime} Uhr</div>
          </div>
        </div>
      </div>

      {/* Customer fields - local state, no parent re-render */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 600 }}>
          {Icons.user(14, C.textMuted)} Dein Name
        </label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Vor- und Nachname" style={iStyle} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontWeight: 600 }}>
          {Icons.phone(14, C.textMuted)} Telefon
        </label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0152 1234567" type="tel" style={iStyle} />
      </div>

      {/* Reminder */}
      <div onClick={() => setReminder(!reminder)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderRadius: 12, background: C.bgCard,
        border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {Icons.bell(18, reminder ? C.gold : C.textDim)}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Terminerinnerung</div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 1 }}>24h vorher per SMS</div>
          </div>
        </div>
        <div style={{
          width: 46, height: 26, borderRadius: 13, padding: 3,
          background: reminder ? C.green : "rgba(255,255,255,0.12)",
          transition: "all 0.3s", display: "flex",
          justifyContent: reminder ? "flex-end" : "flex-start",
        }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.3s" }} />
        </div>
      </div>

      <button onClick={() => onBook(name, phone, reminder)} style={{
        width: "100%", padding: "16px", borderRadius: 12, border: "none",
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
        color: C.bg, fontSize: 16, fontWeight: 700,
        fontFamily: "'Cormorant Garamond', serif", cursor: "pointer",
        boxShadow: `0 4px 20px ${C.gold}44`, letterSpacing: 0.5,
      }}>Jetzt verbindlich buchen</button>
      <button onClick={onBack} style={{
        width: "100%", marginTop: 10, padding: "12px", background: "none",
        border: "none", color: C.textMuted, fontSize: 13, cursor: "pointer",
        fontFamily: "'Cormorant Garamond', serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
      }}>{Icons.chevLeft(16, C.textDim)} Zurück</button>
    </div>
  );
});

// Separate memo component for phone lookup - prevents keyboard from closing
const PhoneLookup = memo(({ onSearch, isLoading, initialPhone }) => {
  const [phone, setPhone] = useState(initialPhone || "");
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, marginTop: 12 }}>
      <div style={{ flex: 1, position: "relative" }}>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="z.B. 0152 1234567"
          type="tel"
          style={{
            width: "100%", padding: "10px 36px 10px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: `1px solid ${C.goldBorder}`,
            color: C.text, fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none",
            boxSizing: "border-box",
          }}
        />
        {phone && (
          <button onClick={() => setPhone("")} style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
            width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", padding: 0,
          }}>{Icons.x(12, C.textDim)}</button>
        )}
      </div>
      <button onClick={() => onSearch(phone)} style={{
        padding: "10px 18px", borderRadius: 10, border: "none",
        background: C.gold, color: C.bg, fontSize: 13, fontWeight: 700,
        cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
        opacity: isLoading ? 0.6 : 1,
      }}>{isLoading ? "..." : "Laden"}</button>
    </div>
  );
});

// ============================================
// n8n Webhook URL - HIER DEINE URL EINTRAGEN!
// Nach dem Import in n8n findest du die URL
// im Webhook-Node unter "Production URL"
// ============================================
const API_URL = "https://banab007.app.n8n.cloud/webhook/styleschein-booking";

export default function StyleScheinApp() {
  const [screen, setScreen] = useState("home");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [showAltSlots, setShowAltSlots] = useState(null);
  const [slotError, setSlotError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Belegte Slots für ein Datum von n8n laden
  const loadBookedSlots = useCallback(async (dateStr, extraBlockedTime) => {
    if (!dateStr) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", telefon: "", role: "admin" })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(e) { data = {}; }
      if (data.success && data.termine) {
        const slots = data.termine
          .filter(t => t.datum === dateStr)
          .map(t => t.uhrzeit);
        // Auch den gerade abgelehnten Slot hinzufügen
        if (extraBlockedTime && !slots.includes(extraBlockedTime)) {
          slots.push(extraBlockedTime);
        }
        setBookedSlots(slots);
      }
    } catch(e) {
      // Bei Fehler trotzdem den abgelehnten Slot blocken
      if (extraBlockedTime) setBookedSlots([extraBlockedTime]);
      else setBookedSlots([]);
    }
    setLoadingSlots(false);
  }, []);
  const [userPhone, setUserPhone] = useState("");
  const [savedName, setSavedName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Termine vom n8n-Webhook laden
  const loadAppointments = useCallback(async (phone) => {
    if (!phone) return;
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", telefon: phone, role: "kunde" })
      });
      const data = await res.json();
      if (data.success && data.termine) {
        setAppointments(data.termine.map(t => ({
          id: t.id,
          service: { name: t.service },
          date: t.datum,
          time: t.uhrzeit,
          customer: t.name,
          status: "confirmed",
        })));
      }
    } catch (e) {
      // Fallback: lokale Daten laden wenn API nicht erreichbar
      try {
        const r = await window.storage.get("styleschein-appointments");
        if (r?.value) setAppointments(JSON.parse(r.value));
      } catch (err) {}
      setToast({ message: "Offline-Modus — Verbindung zum Server fehlgeschlagen", type: "warning" });
    }
    setIsLoading(false);
  }, []);

  // Beim Start lokale Daten laden (Fallback)
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("styleschein-appointments");
        if (r?.value) setAppointments(JSON.parse(r.value));
        const p = await window.storage.get("styleschein-phone");
        if (p?.value) setUserPhone(p.value);
        const n = await window.storage.get("styleschein-name");
        if (n?.value) setSavedName(n.value);
      } catch (e) {}
    })();
  }, []);

  // Auch lokal speichern als Backup
  const saveLocal = async (appts) => {
    try { await window.storage.set("styleschein-appointments", JSON.stringify(appts)); } catch (e) {}
  };

  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) days.push(d);
    }
    return days;
  };

  const formatDate = (d) => {
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    return { day: days[d.getDay()], date: d.getDate(), month: months[d.getMonth()], full: d.toISOString().split("T")[0], dow: d.getDay() };
  };

  const getTimeSlotsForDate = (dateStr) => {
    if (!dateStr) return [];
    const d = new Date(dateStr);
    const dow = d.getDay();
    const h = HOURS[dow];
    if (!h) return [];
    const slots = [];
    const [oh, om] = h.open.split(":").map(Number);
    const [ch] = h.close.split(":").map(Number);
    for (let hr = oh; hr < ch; hr++) {
      for (let min of [0, 30]) {
        if (hr === oh && min < om) continue;
        slots.push(`${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
      }
    }
    return slots;
  };

  const isSlotBooked = (date, time) => appointments.some(a => a.date === date && a.time === time && a.status !== "cancelled");

  // Find alternative slots when one is booked
  const getAlternativeSlots = (date, time) => {
    const slots = getTimeSlotsForDate(date);
    const idx = slots.indexOf(time);
    const alts = [];
    // Check nearby slots same day
    for (let offset = 1; offset <= 3; offset++) {
      if (idx - offset >= 0 && !isSlotBooked(date, slots[idx - offset])) alts.push({ date, time: slots[idx - offset], label: "Heute" });
      if (idx + offset < slots.length && !isSlotBooked(date, slots[idx + offset])) alts.push({ date, time: slots[idx + offset], label: "Heute" });
      if (alts.length >= 4) break;
    }
    // Check next day if not enough
    if (alts.length < 3) {
      const nextDays = getNextDays();
      const dIdx = nextDays.findIndex(d => formatDate(d).full === date);
      if (dIdx >= 0 && dIdx + 1 < nextDays.length) {
        const nd = formatDate(nextDays[dIdx + 1]);
        const nSlots = getTimeSlotsForDate(nd.full);
        const closeIdx = nSlots.indexOf(time) >= 0 ? nSlots.indexOf(time) : Math.floor(nSlots.length / 2);
        for (let i = Math.max(0, closeIdx - 1); i <= Math.min(nSlots.length - 1, closeIdx + 1) && alts.length < 5; i++) {
          if (!isSlotBooked(nd.full, nSlots[i])) alts.push({ date: nd.full, time: nSlots[i], label: `${nd.day} ${nd.date}.${nd.month}` });
        }
      }
    }
    return alts.slice(0, 4);
  };

  const handleSlotClick = (date, time) => {
    if (isSlotBooked(date, time)) {
      const alts = getAlternativeSlots(date, time);
      setShowAltSlots({ date, time, alternatives: alts });
    } else {
      setSelectedTime(time);
      setSelectedDate(date);
      setShowAltSlots(null);
      setBookingStep(2);
    }
  };

  const handleBook = async (name, phone, reminder) => {
    if (!name.trim() || !phone.trim()) {
      setToast({ message: "Bitte Name und Telefon eingeben", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      // An n8n-Webhook senden
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "book",
          name: name.trim(),
          telefon: phone.trim(),
          service: serviceNames,
          datum: selectedDate,
          uhrzeit: selectedTime,
          dauer: String(totalDuration),
        })
      });
      
      // Antwort als Text lesen und dann parsen (sicherer)
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(e) { data = {}; }

      if (data.success === true) {
        setToast({ message: "Termin erfolgreich gebucht!", type: "success" });
        setUserPhone(phone.trim());
        setSavedName(name.trim());
        try { 
          await window.storage.set("styleschein-phone", phone.trim());
          await window.storage.set("styleschein-name", name.trim());
        } catch(e){}
        await loadAppointments(phone.trim());
        setIsLoading(false);
        resetBooking();
        setScreen("appointments");
        return;
      } else {
        // Termin ist belegt — zurück zur Zeitauswahl
        setToast({ message: data.message || "Dieser Termin ist leider belegt — bitte wähle eine andere Zeit", type: "error" });
        setSlotError(selectedDate + " " + selectedTime);
        // Abgelehnte Zeit sofort als belegt markieren + alle anderen laden
        setBookedSlots(prev => [...prev, selectedTime]);
        loadBookedSlots(selectedDate, selectedTime);
        setSelectedTime(null); // Auswahl zurücksetzen!
        setBookingStep(1);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // Netzwerkfehler — KEINEN lokalen Termin erstellen!
      setToast({ message: "Verbindungsfehler — bitte prüfe dein Internet und versuche es erneut", type: "error" });
      setIsLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", event_id: id })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Termin wurde storniert", type: "success" });
        await loadAppointments(userPhone);
      } else {
        setToast({ message: "Stornierung fehlgeschlagen", type: "error" });
      }
    } catch (e) {
      // Fallback: lokal als storniert markieren
      const updated = appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a);
      setAppointments(updated);
      await saveLocal(updated);
      setToast({ message: "Lokal storniert (Offline)", type: "warning" });
    }
    setIsLoading(false);
    setCancelConfirm(null);
  };

  const resetBooking = () => {
    setSelectedServices([]); setSelectedDate(null);
    setSelectedTime(null);
    setBookingStep(0); setShowAltSlots(null); setSlotError(null); setBookedSlots([]);
  };

  // Combined service info for multi-selection
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const serviceNames = selectedServices.map(s => s.name).join(" + ");

  const toggleService = (s) => {
    setSelectedServices(prev => {
      const exists = prev.find(x => x.id === s.id);
      if (exists) return prev.filter(x => x.id !== s.id);
      return [...prev, s];
    });
  };

  const activeAppointments = appointments.filter(a => a.status !== "cancelled");
  const cancelledAppointments = appointments.filter(a => a.status === "cancelled");

  // Einzelnen stornierten Termin aus dem Verlauf löschen
  const removeFromHistory = async (id) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    await saveLocal(updated);
  };

  // Alle stornierten Termine aus dem Verlauf löschen
  const clearCancelledHistory = async () => {
    const updated = appointments.filter(a => a.status !== "cancelled");
    setAppointments(updated);
    await saveLocal(updated);
    setToast({ message: "Stornierter Verlauf gelöscht", type: "success" });
  };
  const nextDays = useMemo(getNextDays, []);

  // --- SCREENS ---
  const HomeScreen = () => (
    <div>
      {/* Hero with interior background */}
      <div style={{
        padding: "40px 24px 36px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${INTERIOR_SRC})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.45) saturate(0.9)",
          zIndex: 0,
        }} />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(180deg, rgba(10,31,16,0.4) 0%, rgba(10,31,16,0.75) 100%)`,
          zIndex: 1,
        }} />
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: 16 }}><Logo size={100} /></div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700,
            margin: 0, letterSpacing: 2, color: C.text,
          }}>{SHOP.name}</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: C.goldLight, fontSize: 15, letterSpacing: 1, marginTop: 8, fontStyle: "italic" }}>
            {SHOP.tagline}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "0 20px", display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => { setScreen("book"); setBookingStep(0); }} style={{
          flex: 1, padding: "20px 16px", border: `2px solid ${C.gold}`,
          borderRadius: 14, background: C.goldBg, color: C.gold,
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700,
          cursor: "pointer", transition: "all 0.3s",
        }}>
          <span style={{ display: "block", marginBottom: 8 }}>{Icons.calendar(28, C.gold)}</span>
          Termin Buchen
        </button>
        <button onClick={() => setScreen("appointments")} style={{
          flex: 1, padding: "20px 16px", border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: 14, background: C.bgCard, color: C.text,
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700,
          cursor: "pointer", transition: "all 0.3s",
        }}>
          <span style={{ display: "block", marginBottom: 8 }}>{Icons.list(28, C.textMuted)}</span>
          Meine Termine
          {activeAppointments.length > 0 && (
            <span style={{
              display: "inline-block", marginLeft: 8, background: C.gold,
              color: C.bg, borderRadius: 10, padding: "2px 8px",
              fontSize: 11, fontWeight: 800,
            }}>{activeAppointments.length}</span>
          )}
        </button>
      </div>

      {/* Services */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, margin: 0 }}>Unsere Services</h3>
          <span style={{ color: C.textDim, fontSize: 12, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>Für deinen perfekten Auftritt</span>
        </div>

        {[
          { title: "Haarschnitte", items: SERVICES.haarschnitte, icon: Icons.scissors },
          { title: "Bartpflege", items: SERVICES.bartpflege, icon: Icons.razor },
          { title: "Zusätzliche Services", items: SERVICES.zusaetzlich, icon: Icons.sparkle },
        ].map(cat => (
          <div key={cat.title} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {cat.icon(16, C.goldDark)}
              <span style={{ fontSize: 14, fontWeight: 700, color: C.goldLight, fontFamily: "'Cormorant Garamond', serif", letterSpacing: 1 }}>{cat.title}</span>
            </div>
            {cat.items.map(s => (
              <div key={s.id} onClick={() => { setSelectedServices([s]); setScreen("book"); setBookingStep(0); }} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "13px 16px", marginBottom: 2, borderRadius: 8,
                background: "transparent", cursor: "pointer",
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 14, color: C.text }}>{s.name}</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>{s.price}€</span>
              </div>
            ))}
          </div>
        ))}

        {/* Komplettpaket */}
        <div onClick={() => { setSelectedServices([SERVICES.pakete[0]]); setScreen("book"); setBookingStep(0); }} style={{
          padding: "18px 20px", borderRadius: 14, cursor: "pointer",
          background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
          textAlign: "center", marginTop: 8,
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.bg }}>
            Komplettpaket nur 60€!
          </span>
        </div>
      </div>

      {/* Öffnungszeiten */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{
          padding: "20px", borderRadius: 14,
          background: C.bgCard, border: `1px solid ${C.goldBorder}`,
        }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, margin: "0 0 14px", textAlign: "center" }}>Öffnungszeiten</h4>
          {[
            ["Montag – Donnerstag", "10:00 – 19:00 Uhr"],
            ["Freitag", "09:00 – 19:00 Uhr"],
            ["Samstag", "09:00 – 17:00 Uhr"],
            ["Sonntag", "geschlossen"],
          ].map(([d, h]) => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: h === "geschlossen" ? C.textDim : C.text }}>
              <span>{d}</span><span style={{ fontWeight: 600 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Standort & Navigation */}
      <div style={{ padding: "0 20px 20px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>Standort</h3>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SHOP.address + ", " + SHOP.city)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <div style={{
            padding: "20px", borderRadius: 14,
            background: C.goldBg, border: `1px solid ${C.goldBorder}`,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              {Icons.mapPin(22, C.gold)}
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{SHOP.address}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{SHOP.city}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.goldBorder}` }}>
              {Icons.train(16, C.textMuted)}
              <span style={{ fontSize: 13, color: C.textMuted }}>{SHOP.ubahn}</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px", borderRadius: 10,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color: C.bg, fontSize: 14, fontWeight: 700,
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              {Icons.mapPin(16, C.bg)} Route mit Google Maps starten
            </div>
          </div>
        </a>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );

  const BookScreen = () => {
    const steps = ["Service", "Datum & Zeit", "Bestätigen"];
    return (
      <div>
        {/* Progress */}
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{
                  height: 3, borderRadius: 2, marginBottom: 6,
                  background: i <= bookingStep ? C.gold : "rgba(255,255,255,0.08)",
                  transition: "all 0.4s",
                }} />
                <span style={{ fontSize: 10, fontWeight: i === bookingStep ? 700 : 400, color: i <= bookingStep ? C.gold : C.textDim }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Service (Mehrfachauswahl) */}
        {bookingStep === 0 && (
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Services wählen</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              Wähle einen oder mehrere Services aus
            </p>
            {[
              { title: "Haarschnitte", items: SERVICES.haarschnitte },
              { title: "Bartpflege", items: SERVICES.bartpflege },
              { title: "Zusätzliche Services", items: SERVICES.zusaetzlich },
              { title: "Pakete", items: SERVICES.pakete },
            ].map(cat => (
              <div key={cat.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, marginBottom: 6, marginTop: 14, letterSpacing: 1, textTransform: "uppercase" }}>
                  {cat.title}
                </div>
                {cat.items.map(s => {
                  const sel = selectedServices.some(x => x.id === s.id);
                  const IconFn = getServiceIcon(s.cat);
                  return (
                    <div key={s.id} onClick={() => toggleService(s)} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "15px 16px", marginBottom: 6, borderRadius: 12,
                      background: sel ? C.goldBg : C.bgCard,
                      border: sel ? `1px solid ${C.gold}` : "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      {/* Checkbox */}
                      <div style={{
                        width: 24, height: 24, borderRadius: 6,
                        border: sel ? `2px solid ${C.gold}` : "2px solid rgba(255,255,255,0.2)",
                        background: sel ? C.gold : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s", flexShrink: 0,
                      }}>
                        {sel && Icons.check(14, C.bg)}
                      </div>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: sel ? C.goldBg : "rgba(255,255,255,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{IconFn(18, sel ? C.gold : C.textMuted)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ color: C.textDim, fontSize: 12, marginTop: 2 }}>ca. {s.duration} Min.</div>
                      </div>
                      <div style={{ color: C.gold, fontWeight: 700, fontSize: 17, fontFamily: "'Cormorant Garamond', serif" }}>{s.price}€</div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Zusammenfassung und Weiter-Button */}
            {selectedServices.length > 0 && (
              <div style={{
                position: "sticky", bottom: 0, padding: "16px 0 8px",
                background: C.bg, borderTop: `1px solid ${C.goldBorder}`, marginTop: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: C.textMuted }}>
                  <span>{selectedServices.length} Service{selectedServices.length > 1 ? "s" : ""} · ca. {totalDuration} Min.</span>
                  <span style={{ color: C.gold, fontWeight: 700, fontSize: 16 }}>Gesamt: {totalPrice}€</span>
                </div>
                <button onClick={() => setBookingStep(1)} style={{
                  width: "100%", padding: "16px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                  color: C.bg, fontSize: 16, fontWeight: 700,
                  fontFamily: "'Cormorant Garamond', serif", cursor: "pointer",
                  boxShadow: `0 4px 20px ${C.gold}44`,
                }}>Weiter zur Terminauswahl</button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Date & Time */}
        {bookingStep === 1 && (
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Termin wählen</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 6, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              {serviceNames} · {totalPrice}€ · ca. {totalDuration} Min.
            </p>

            {/* Fehler-Banner wenn Termin belegt war */}
            {slotError && (
              <div style={{
                padding: "14px 16px", borderRadius: 12, marginBottom: 16, marginTop: 10,
                background: "rgba(217,64,64,0.12)", border: "1px solid rgba(217,64,64,0.25)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                {Icons.x(18, C.error)}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.error }}>Termin leider belegt!</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Bitte wähle eine andere Uhrzeit oder ein anderes Datum</div>
                </div>
              </div>
            )}

            {/* Date carousel */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginTop: 16, marginBottom: 16 }}>
              {nextDays.slice(0, 12).map(d => {
                const f = formatDate(d);
                const sel = selectedDate === f.full;
                const isToday = f.full === formatDate(new Date()).full;
                return (
                  <div key={f.full} onClick={() => { setSelectedDate(f.full); setSelectedTime(null); setShowAltSlots(null); setSlotError(null); loadBookedSlots(f.full); }} style={{
                    minWidth: 58, padding: "12px 6px", textAlign: "center",
                    borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                    background: sel ? C.goldBg : C.bgCard,
                    border: sel ? `1px solid ${C.gold}` : "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div style={{ fontSize: 10, color: sel ? C.gold : C.textDim, fontWeight: 700 }}>
                      {isToday ? "Heute" : f.day}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: sel ? C.gold : C.text, fontFamily: "'Cormorant Garamond', serif" }}>{f.date}</div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{f.month}</div>
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                  {Icons.clock(14, C.textMuted)} Verfügbare Uhrzeiten
                  {loadingSlots && <span style={{ fontSize: 11, color: C.textDim, marginLeft: 8 }}>Lade...</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {getTimeSlotsForDate(selectedDate).map(t => {
                    const booked = bookedSlots.includes(t) || isSlotBooked(selectedDate, t);
                    // Vergangene Uhrzeiten für heute erkennen
                    const now = new Date();
                    const isToday = selectedDate === formatDate(now).full;
                    const [sh, sm] = t.split(":").map(Number);
                    const isPast = isToday && (sh < now.getHours() || (sh === now.getHours() && sm <= now.getMinutes()));
                    const blocked = booked || isPast;
                    const sel = !blocked && selectedTime === t;
                    return (
                      <button key={t} onClick={() => !blocked && handleSlotClick(selectedDate, t)} style={{
                        padding: "12px", borderRadius: 10, border: "none",
                        fontSize: 14, fontWeight: 600,
                        cursor: blocked ? "not-allowed" : "pointer",
                        fontFamily: "'Cormorant Garamond', serif", transition: "all 0.2s",
                        background: booked ? "rgba(217,64,64,0.1)" : isPast ? "rgba(255,255,255,0.02)" : sel ? C.gold : C.bgCard,
                        color: booked ? "rgba(217,64,64,0.5)" : isPast ? "rgba(255,255,255,0.15)" : sel ? C.bg : C.text,
                        textDecoration: booked ? "line-through" : isPast ? "line-through" : "none",
                        border: booked ? "1px solid rgba(217,64,64,0.2)" : sel ? "none" : "1px solid rgba(255,255,255,0.04)",
                        opacity: blocked ? 0.5 : 1,
                        pointerEvents: blocked ? "none" : "auto",
                      }}>{t}</button>
                    );
                  })}
                </div>

                {/* Alternative slot suggestions */}
                {showAltSlots && (
                  <div style={{
                    marginTop: 16, padding: "16px", borderRadius: 14,
                    background: "rgba(217,64,64,0.08)", border: "1px solid rgba(217,64,64,0.2)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: C.error, display: "flex", alignItems: "center", gap: 6 }}>
                      {Icons.x(16, C.error)} {showAltSlots.time} Uhr ist leider belegt
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>
                      Wie wäre es mit einem dieser Alternativen?
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {showAltSlots.alternatives.map((alt, i) => (
                        <button key={i} onClick={() => {
                          setSelectedDate(alt.date); setSelectedTime(alt.time);
                          setShowAltSlots(null); setBookingStep(2);
                        }} style={{
                          padding: "10px 16px", borderRadius: 10, border: `1px solid ${C.goldBorder}`,
                          background: C.goldBg, color: C.gold, fontSize: 13, fontWeight: 600,
                          cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
                        }}>
                          {alt.label} · {alt.time}
                        </button>
                      ))}
                    </div>
                    {showAltSlots.alternatives.length === 0 && (
                      <div style={{ color: C.textDim, fontSize: 13 }}>
                        Bitte wähle ein anderes Datum für mehr Verfügbarkeit.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            <button onClick={() => setBookingStep(0)} style={{
              marginTop: 16, padding: "10px 0", background: "none", border: "none",
              color: C.textMuted, fontSize: 13, cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif", display: "flex", alignItems: "center", gap: 4,
            }}>{Icons.chevLeft(16, C.textDim)} Zurück</button>
          </div>
        )}

        {/* Step 2: Confirm - uses separate memoized component */}
        {bookingStep === 2 && (
          <ConfirmForm
            onBook={handleBook}
            onBack={() => setBookingStep(1)}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            totalPrice={totalPrice}
            totalDuration={totalDuration}
            serviceNames={serviceNames}
            initialName={savedName}
            initialPhone={userPhone}
          />
        )}
        <div style={{ height: 80 }} />
      </div>
    );
  };

  const AppointmentsScreen = () => (
    <div style={{ padding: "16px 20px" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Meine Termine</h3>

      {/* Telefonnummer — eigene Memo-Komponente, Tastatur bleibt offen */}
      <PhoneLookup
        initialPhone={userPhone}
        isLoading={isLoading}
        onSearch={(phone) => { setUserPhone(phone); loadAppointments(phone); }}
      />

      {/* Neuen Termin buchen — mit gespeicherten Kundendaten */}
      <button onClick={() => { setScreen("book"); setBookingStep(0); }} style={{
        width: "100%", padding: "14px", borderRadius: 12, border: "none",
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
        color: C.bg, fontSize: 15, fontWeight: 700, cursor: "pointer",
        fontFamily: "'Cormorant Garamond', serif", marginBottom: 16,
        boxShadow: `0 4px 16px ${C.gold}33`, letterSpacing: 0.5,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {Icons.calendar(18, C.bg)} Neuen Termin buchen
      </button>
      {savedName && (
        <p style={{ fontSize: 11, color: C.textDim, marginTop: -12, marginBottom: 14, textAlign: "center", fontFamily: "'Cormorant Garamond', serif" }}>
          Deine Daten ({savedName}) werden automatisch übernommen
        </p>
      )}

      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
        {activeAppointments.length} aktive Buchung{activeAppointments.length !== 1 ? "en" : ""}
      </p>
      {appointments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <div style={{ marginBottom: 16 }}>{Icons.calendar(48, C.textDim)}</div>
          <p style={{ color: C.textMuted, fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>Noch keine Termine gebucht</p>
          <button onClick={() => { setScreen("book"); setBookingStep(0); }} style={{
            marginTop: 16, padding: "12px 32px", borderRadius: 12,
            background: C.goldBg, border: `1px solid ${C.goldBorder}`,
            color: C.gold, fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Cormorant Garamond', serif",
          }}>Ersten Termin buchen</button>
        </div>
      ) : (
        [...appointments].reverse().map(a => {
          const IconFn = getServiceIcon(a.service?.cat);
          return (
            <div key={a.id} style={{
              padding: "18px", marginBottom: 10, borderRadius: 14,
              background: a.status === "cancelled" ? "rgba(255,255,255,0.015)" : C.bgCard,
              border: a.status === "cancelled" ? "1px solid rgba(255,255,255,0.03)" : `1px solid rgba(255,255,255,0.06)`,
              opacity: a.status === "cancelled" ? 0.45 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                    {IconFn(18, a.status === "cancelled" ? C.textDim : C.gold)} {a.service?.name}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 13, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    {Icons.calendar(14, C.textDim)} {a.date?.split("-").reverse().join(".")}
                    <span style={{ margin: "0 4px", color: C.textDim }}>·</span>
                    {Icons.clock(14, C.textDim)} {a.time} Uhr
                  </div>
                  <div style={{ color: C.textDim, fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    {Icons.user(13, C.textDim)} {a.customer}
                  </div>
                  {a.reminder && a.status !== "cancelled" && (
                    <div style={{ color: C.green, fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      {Icons.bell(13, C.greenLight)} Erinnerung aktiv
                    </div>
                  )}
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                  background: a.status === "cancelled" ? "rgba(217,64,64,0.12)" : "rgba(60,181,92,0.12)",
                  color: a.status === "cancelled" ? C.error : C.success,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {a.status === "cancelled" ? Icons.x(12, C.error) : Icons.check(12, C.success)}
                  {a.status === "cancelled" ? "Storniert" : "Bestätigt"}
                </div>
              </div>
              {a.status !== "cancelled" && (
                cancelConfirm === a.id ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={() => handleCancel(a.id)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, border: "none",
                      background: "rgba(217,64,64,0.15)", color: C.error,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}>Ja, stornieren</button>
                    <button onClick={() => setCancelConfirm(null)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, border: "none",
                      background: "rgba(255,255,255,0.05)", color: C.textMuted,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}>Abbrechen</button>
                  </div>
                ) : (
                  <button onClick={() => setCancelConfirm(a.id)} style={{
                    marginTop: 14, padding: "8px 16px", borderRadius: 8, border: "none",
                    background: "rgba(255,255,255,0.04)", color: C.textDim,
                    fontSize: 12, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
                  }}>Termin stornieren</button>
                )
              )}
              {a.status === "cancelled" && (
                <button onClick={() => removeFromHistory(a.id)} style={{
                  marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "none",
                  background: "rgba(217,64,64,0.08)", color: "rgba(217,64,64,0.6)",
                  fontSize: 12, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>{Icons.x(12, "rgba(217,64,64,0.6)")} Aus Verlauf löschen</button>
              )}
            </div>
          );
        })
      )}
      {/* Button zum Löschen aller stornierten Termine */}
      {cancelledAppointments.length > 0 && (
        <button onClick={clearCancelledHistory} style={{
          width: "100%", marginTop: 16, padding: "12px", borderRadius: 10, border: `1px solid rgba(217,64,64,0.2)`,
          background: "rgba(217,64,64,0.06)", color: "rgba(217,64,64,0.7)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>{Icons.x(14, "rgba(217,64,64,0.7)")} Stornierten Verlauf löschen ({cancelledAppointments.length})</button>
      )}
      <div style={{ height: 80 }} />
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', serif",
      minHeight: "100vh", background: C.bg, color: C.text,
      maxWidth: 480, margin: "0 auto", position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input::placeholder { color: ${C.textDim}; }
        ::-webkit-scrollbar { height: 3px; } ::-webkit-scrollbar-thumb { background: ${C.goldBorder}; border-radius: 3px; }
      `}</style>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, ${C.bgLight} 0%, ${C.bg} 100%)`,
        padding: "14px 20px 10px", position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid rgba(196,162,101,0.1)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={38} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{SHOP.name}</div>
              <div style={{ fontSize: 9, color: C.textDim, letterSpacing: 2, textTransform: "uppercase" }}>{SHOP.subtitle}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, textAlign: "right" }}>Friseur<br/>Düsseldorf</div>
        </div>
        {/* Nav */}
        <div style={{ display: "flex", gap: 3, marginTop: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 3 }}>
          {[
            { id: "home", label: "Home", icon: Icons.home },
            { id: "book", label: "Buchen", icon: Icons.calendar },
            { id: "appointments", label: "Termine", icon: Icons.list },
          ].map(tab => {
            const active = screen === tab.id;
            return (
              <button key={tab.id} onClick={() => { setScreen(tab.id); if (tab.id === "book") { resetBooking(); } }}
                style={{
                  flex: 1, padding: "9px 4px 7px", border: "none", borderRadius: 10,
                  fontSize: 10, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                  fontFamily: "'Cormorant Garamond', serif", letterSpacing: 0.5,
                  background: active ? C.goldBg : "transparent",
                  color: active ? C.gold : C.textDim,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                }}>
                {tab.icon(16, active ? C.gold : C.textDim)}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {screen === "home" && HomeScreen()}
      {screen === "book" && BookScreen()}
      {screen === "appointments" && AppointmentsScreen()}
    </div>
  );
}

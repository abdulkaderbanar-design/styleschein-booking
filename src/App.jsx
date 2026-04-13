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
  qr: (s = 20, c = C.gold) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4" rx="1"/><line x1="22" y1="14" x2="22" y2="22"/><line x1="14" y1="22" x2="22" y2="22"/>
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
const LOGO_SRC = "data:image/jpeg;base64,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";
const INTERIOR_SRC = "data:image/jpeg;base64,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";
const Logo = ({ size = 70 }) => (
  <img src={LOGO_SRC} alt="StyleSchein Logo" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
);

// QR Code
function QRCode({ value, size = 200 }) {
  const modules = useMemo(() => {
    const grid = 29;
    const data = Array(grid).fill(null).map(() => Array(grid).fill(false));
    const addFinder = (x, y) => {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4))
          if (x + i < grid && y + j < grid) data[x + i][y + j] = true;
      }
    };
    addFinder(0, 0); addFinder(0, grid - 7); addFinder(grid - 7, 0);
    let hash = 0;
    for (let i = 0; i < value.length; i++) { hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0; }
    for (let i = 8; i < grid - 8; i++) for (let j = 8; j < grid - 8; j++) {
      const v = (hash * (i * grid + j + 1)) & 0xFFFF;
      data[i][j] = v % 3 !== 0;
    }
    for (let i = 8; i < grid - 8; i++) { data[6][i] = i % 2 === 0; data[i][6] = i % 2 === 0; }
    return data;
  }, [value]);
  const cs = size / 29;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="6"/>
      {modules.map((row, i) => row.map((cell, j) =>
        cell ? <rect key={`${i}-${j}`} x={j*cs+0.5} y={i*cs+0.5} width={cs-0.3} height={cs-0.3} fill={C.bg} rx="0.8"/> : null
      ))}
      {/* Center logo image */}
      <defs><clipPath id="qrClip"><circle cx={size/2} cy={size/2} r="14"/></clipPath></defs>
      <rect x={size/2-18} y={size/2-18} width={36} height={36} fill="white" rx="4"/>
      <image href={LOGO_SRC} x={size/2-14} y={size/2-14} width={28} height={28} clipPath="url(#qrClip)" />
    </svg>
  );
}

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
const ConfirmForm = memo(({ onBook, onBack, selectedService, selectedDate, selectedTime }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.goldBorder}` }}>
          <div>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Service</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              {getServiceIcon(selectedService?.cat)(18, C.gold)} {selectedService?.name}
            </div>
          </div>
          <div style={{ color: C.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{selectedService?.price}€</div>
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
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+49 170 1234567" type="tel" style={iStyle} />
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

// ============================================
// n8n Webhook URL - HIER DEINE URL EINTRAGEN!
// Nach dem Import in n8n findest du die URL
// im Webhook-Node unter "Production URL"
// ============================================
const API_URL = "https://banab007.app.n8n.cloud/webhook/styleschein-booking";

export default function StyleScheinApp() {
  const [screen, setScreen] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [showAltSlots, setShowAltSlots] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("kunde"); // "kunde" or "admin"

  // Termine vom n8n-Webhook laden
  const loadAppointments = useCallback(async (phone, role) => {
    if (!phone && role !== "admin") return;
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", telefon: phone, role: role || "kunde" })
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
          service: selectedService?.name,
          datum: selectedDate,
          uhrzeit: selectedTime,
          dauer: String(selectedService?.duration || 30),
        })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Termin erfolgreich gebucht!", type: "success" });
        // Telefonnr. merken für spätere Terminabfragen
        setUserPhone(phone.trim());
        try { await window.storage.set("styleschein-phone", phone.trim()); } catch(e){}
        // Termine neu laden
        await loadAppointments(phone.trim(), viewMode);
      } else {
        setToast({ message: data.message || "Termin ist leider belegt", type: "error" });
      }
    } catch (e) {
      // Fallback: lokal speichern
      const newAppt = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        service: selectedService, date: selectedDate, time: selectedTime,
        customer: name.trim(), phone: phone.trim(), status: "confirmed",
      };
      const updated = [...appointments, newAppt];
      setAppointments(updated);
      await saveLocal(updated);
      setToast({ message: "Termin lokal gespeichert (Offline)", type: "warning" });
    }
    setIsLoading(false);
    resetBooking();
    setScreen("appointments");
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
        await loadAppointments(userPhone, viewMode);
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
    setSelectedService(null); setSelectedDate(null);
    setSelectedTime(null);
    setBookingStep(0); setShowAltSlots(null);
  };

  const activeAppointments = appointments.filter(a => a.status !== "cancelled");
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
          filter: "brightness(0.25) saturate(0.8)",
          zIndex: 0,
        }} />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(180deg, rgba(10,31,16,0.6) 0%, rgba(10,31,16,0.85) 100%)`,
          zIndex: 1,
        }} />
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 20 }}><Logo size={90} /></div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700,
            margin: 0, letterSpacing: 2, color: C.text,
          }}>{SHOP.name}</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: C.goldLight, fontSize: 15, letterSpacing: 1, marginTop: 8, fontStyle: "italic" }}>
            {SHOP.tagline}
          </p>
          <p style={{ color: C.textDim, fontSize: 12, marginTop: 16, lineHeight: 1.7 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{Icons.mapPin(14, C.textMuted)} {SHOP.address}, {SHOP.city}</span>
            <br/>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}>{Icons.train(14, C.textMuted)} {SHOP.ubahn}</span>
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
              <div key={s.id} onClick={() => { setSelectedService(s); setScreen("book"); setBookingStep(1); }} style={{
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
        <div onClick={() => { setSelectedService(SERVICES.pakete[0]); setScreen("book"); setBookingStep(1); }} style={{
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

        {/* Step 0: Service */}
        {bookingStep === 0 && (
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Service wählen</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              Was dürfen wir für dich tun?
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
                  const sel = selectedService?.id === s.id;
                  const IconFn = getServiceIcon(s.cat);
                  return (
                    <div key={s.id} onClick={() => { setSelectedService(s); setBookingStep(1); }} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "15px 16px", marginBottom: 6, borderRadius: 12,
                      background: sel ? C.goldBg : C.bgCard,
                      border: sel ? `1px solid ${C.gold}` : "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: sel ? C.goldBg : "rgba(255,255,255,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{IconFn(20, sel ? C.gold : C.textMuted)}</div>
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
          </div>
        )}

        {/* Step 1: Date & Time */}
        {bookingStep === 1 && (
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Termin wählen</h3>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 6, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              {selectedService?.name} · {selectedService?.price}€
            </p>

            {/* Date carousel */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginTop: 16, marginBottom: 16 }}>
              {nextDays.slice(0, 12).map(d => {
                const f = formatDate(d);
                const sel = selectedDate === f.full;
                const isToday = f.full === formatDate(new Date()).full;
                return (
                  <div key={f.full} onClick={() => { setSelectedDate(f.full); setSelectedTime(null); setShowAltSlots(null); }} style={{
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
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {getTimeSlotsForDate(selectedDate).map(t => {
                    const booked = isSlotBooked(selectedDate, t);
                    const sel = selectedTime === t;
                    return (
                      <button key={t} onClick={() => handleSlotClick(selectedDate, t)} style={{
                        padding: "12px", borderRadius: 10, border: "none",
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Cormorant Garamond', serif", transition: "all 0.2s",
                        background: sel ? C.gold : booked ? "rgba(217,64,64,0.1)" : C.bgCard,
                        color: sel ? C.bg : booked ? "rgba(217,64,64,0.4)" : C.text,
                        textDecoration: booked ? "line-through" : "none",
                        border: booked ? "1px solid rgba(217,64,64,0.15)" : sel ? "none" : "1px solid rgba(255,255,255,0.04)",
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
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        )}
        <div style={{ height: 80 }} />
      </div>
    );
  };

  const AppointmentsScreen = () => (
    <div style={{ padding: "16px 20px" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>
        {viewMode === "admin" ? "Alle Termine (Friseur)" : "Meine Termine"}
      </h3>

      {/* Telefonnummer eingeben zum Nachschlagen */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, marginTop: 12 }}>
        <input
          value={userPhone}
          onChange={e => setUserPhone(e.target.value)}
          placeholder="Telefonnummer eingeben..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: `1px solid ${C.goldBorder}`,
            color: C.text, fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none",
          }}
        />
        <button onClick={() => loadAppointments(userPhone, viewMode)} style={{
          padding: "10px 18px", borderRadius: 10, border: "none",
          background: C.gold, color: C.bg, fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
          opacity: isLoading ? 0.6 : 1,
        }}>{isLoading ? "..." : "Laden"}</button>
      </div>

      {/* Kunde / Admin Toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["kunde", "admin"].map(mode => (
          <button key={mode} onClick={() => { setViewMode(mode); loadAppointments(userPhone, mode); }} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: "none",
            background: viewMode === mode ? C.goldBg : "rgba(255,255,255,0.03)",
            color: viewMode === mode ? C.gold : C.textDim,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Cormorant Garamond', serif",
          }}>{mode === "kunde" ? "Meine Termine" : "Friseur-Ansicht"}</button>
        ))}
      </div>

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
            </div>
          );
        })
      )}
      <div style={{ height: 80 }} />
    </div>
  );

  const QRScreen = () => (
    <div style={{ padding: "16px 20px", textAlign: "center" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>QR-Code</h3>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 28, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
        Kunden scannen und buchen direkt ihren Termin
      </p>
      <div style={{
        display: "inline-block", padding: 20, borderRadius: 20,
        background: "#fff", boxShadow: `0 8px 40px rgba(42,122,64,0.25)`,
      }}>
        <QRCode value="https://styleschein.de/booking" size={200} />
      </div>
      <div style={{
        marginTop: 24, padding: "20px", borderRadius: 14,
        background: C.bgCard, border: `1px solid rgba(255,255,255,0.06)`,
        textAlign: "left",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Cormorant Garamond', serif" }}>
          {Icons.sparkle(16, C.gold)} Einsatzmöglichkeiten
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.9, fontFamily: "'Cormorant Garamond', serif" }}>
          An der Kasse aufstellen<br />
          Im Schaufenster platzieren<br />
          Auf Visitenkarten drucken<br />
          In Social-Media-Posts teilen
        </div>
      </div>
      <div style={{
        marginTop: 14, padding: "18px", borderRadius: 14,
        background: C.goldBg, border: `1px solid ${C.goldBorder}`,
        textAlign: "left",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: C.gold, fontFamily: "'Cormorant Garamond', serif" }}>
          Als App installieren
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, fontFamily: "'Cormorant Garamond', serif" }}>
          <strong style={{ color: C.text }}>iPhone:</strong> Safari → Teilen → „Zum Home-Bildschirm"<br />
          <strong style={{ color: C.text }}>Android:</strong> Chrome → Menü → „App installieren"
        </div>
      </div>
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
            { id: "qr", label: "QR-Code", icon: Icons.qr },
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

      {screen === "home" && <HomeScreen />}
      {screen === "book" && <BookScreen />}
      {screen === "appointments" && <AppointmentsScreen />}
      {screen === "qr" && <QRScreen />}
    </div>
  );
}

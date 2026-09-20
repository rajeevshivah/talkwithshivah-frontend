// Date + money helpers for classes. Everything shown in IST.
const IST = { timeZone: "Asia/Kolkata" };

export const fmtDay = (d) => new Date(d).toLocaleDateString("en-IN", { ...IST, day: "numeric" });
export const fmtMonth = (d) => new Date(d).toLocaleDateString("en-IN", { ...IST, month: "short" });
export const fmtWeekday = (d) => new Date(d).toLocaleDateString("en-IN", { ...IST, weekday: "long" });
export const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-IN", { ...IST, hour: "numeric", minute: "2-digit" }).toUpperCase();
export const fmtDateLong = (d) =>
  new Date(d).toLocaleDateString("en-IN", { ...IST, weekday: "short", day: "numeric", month: "long" });
export const fmtDateTime = (d) => `${fmtDateLong(d)}, ${fmtTime(d)}`;

export const rupees = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// "in 3 days", "in 5 hours", "in 20 minutes", "now"
export const timeUntil = (d, now = Date.now()) => {
  const ms = new Date(d).getTime() - now;
  if (ms <= 0) return null;
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `in ${mins} minute${mins === 1 ? "" : "s"}`;
  const hrs = Math.round(mins / 60);
  if (hrs < 36) return `in ${hrs} hour${hrs === 1 ? "" : "s"}`;
  const days = Math.round(hrs / 24);
  return `in ${days} days`;
};

// Human summary of the schedule: "One evening" / "5 evenings"
export const sessionsLabel = (sessions = []) => {
  const n = sessions.length;
  if (n <= 1) return "One sitting";
  return `${n} sittings`;
};

// Seat line shown on cards and the class page
export const seatsLine = (cls) => {
  if (cls.closedReason === "full") return "Full";
  if (cls.seatsLeft == null) return null;
  if (cls.seatsLeft <= 3) return `Only ${cls.seatsLeft} seat${cls.seatsLeft === 1 ? "" : "s"} left`;
  return `${cls.seatsLeft} of ${cls.seatLimit} seats left`;
};

// upi:// deep link with the exact amount filled in
export const upiLink = ({ upiId, upiName, amount, note }) => {
  const p = new URLSearchParams({ pa: upiId, pn: upiName || "talkWithShivah", am: String(amount), cu: "INR" });
  if (note) p.set("tn", note.slice(0, 40));
  return `upi://pay?${p.toString()}`;
};

// Slug from a title: "Calm the Overthinking Mind" -> "calm-the-overthinking-mind"
export const slugify = (s = "") =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 60);

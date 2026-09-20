// ============================================================
// classJson.js — turn pasted JSON (usually written by an AI) into
// class form data, with clear per-class errors.
//
// Accepts: one class object, an array of classes, or { "classes": [...] }.
// Times without a timezone ("2026-10-05T19:00") are treated as IST.
// ============================================================
import { slugify } from "../utils/classFormat";

const DEFAULT_CONFIRM =
  "Your seat is confirmed. Join the WhatsApp group for reminders and the joining link.";

export const EXAMPLE_JSON = [
  {
    title: "Calm the Overthinking Mind — 3 evenings",
    slug: "calm-the-overthinking-mind",
    description:
      "For people whose mind won't switch off at night.\n\nWe'll practise two simple techniques and you'll leave with a 10-minute routine you can keep.",
    thumbnail: "",
    sessions: [
      { title: "Seeing the loop", startsAt: "2026-10-05T19:00", durationMins: 60, joinUrl: "" },
      { title: "Breath as an anchor", startsAt: "2026-10-06T19:00", durationMins: 60, joinUrl: "" },
      { title: "A routine that stays", startsAt: "2026-10-07T19:00", durationMins: 60, joinUrl: "" },
    ],
    isPaid: true,
    price: 199,
    mrp: 499,
    seatLimit: 15,
    registrationClosesAt: null,
    whatsappLink: "",
    confirmationMsg: DEFAULT_CONFIRM,
    isPublished: false,
  },
];

// Text copied by "Copy format for AI" — paste into ChatGPT / Claude,
// describe your classes under it, paste the reply back here.
export const AI_PROMPT = `Create class data for my meditation website talkWithShivah.

Return ONLY valid JSON — no explanation, no markdown code fences.
Return an ARRAY of class objects, even if there is only one class.

Rules for each field:
- title: short, clear class name (required)
- slug: lowercase-words-with-hyphens, used in the link (optional — made from title if missing)
- description: plain text, 2–4 short paragraphs, use \\n\\n between paragraphs. Who it is for, what we practise, what to bring.
- thumbnail: image URL or ""
- sessions: array, at least one. Each session:
    - title: name of that sitting
    - startsAt: date and time in India time (IST), format "YYYY-MM-DDTHH:mm", e.g. "2026-10-05T19:00"
    - durationMins: number, e.g. 45 or 60
    - joinUrl: Google Meet link or ""
- isPaid: true or false
- price: number in rupees (0 if free)
- mrp: number, original price shown struck out (0 to hide)
- seatLimit: number (0 = unlimited)
- registrationClosesAt: "YYYY-MM-DDTHH:mm" in IST, or null to close when the first session starts
- whatsappLink: WhatsApp group invite link or ""
- confirmationMsg: one or two sentences shown after the seat is confirmed
- isPublished: false (I will review before publishing)

Format example:
${JSON.stringify(EXAMPLE_JSON, null, 2)}

My classes:
[describe your classes here — topic, dates, times, number of sessions, price, seats]
`;

// "2026-10-05T19:00" / "2026-10-05 19:00" → treated as IST.
// Anything with Z or an offset is left as given.
const toIso = (v) => {
  if (v === null || v === undefined || v === "") return null;
  let s = String(v).trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(s)) s += "+05:30";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T19:00+05:30";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// Parse raw text → array of raw class objects. Throws with a readable message.
export function parseClassJson(text) {
  let cleaned = String(text || "").trim();
  // AI replies often wrap JSON in ```json fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  if (!cleaned) throw new Error("Paste some JSON first.");
  let data;
  try {
    data = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`This isn't valid JSON — ${e.message}. Ask the AI to return only JSON.`, { cause: e });
  }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.classes)) return data.classes;
  if (data && typeof data === "object") return [data];
  throw new Error("Expected a class object or an array of classes.");
}

// Raw object → { data: formShape, errors: [], warnings: [] }
export function normalizeClass(raw, index = 0) {
  const errors = [];
  const warnings = [];
  const label = raw?.title ? `"${raw.title}"` : `Class ${index + 1}`;

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { data: null, errors: [`${label}: not an object`], warnings };
  }

  const title = String(raw.title || "").trim();
  if (!title) errors.push("Missing title");

  const sessionsRaw = Array.isArray(raw.sessions) ? raw.sessions : [];
  if (!sessionsRaw.length) errors.push("Needs at least one session in \"sessions\"");

  const sessions = sessionsRaw.map((s, i) => {
    const startsAt = toIso(s?.startsAt);
    if (!startsAt) errors.push(`Session ${i + 1}: startsAt must look like "2026-10-05T19:00"`);
    else if (new Date(startsAt) < new Date()) warnings.push(`Session ${i + 1} is in the past`);
    return {
      title: String(s?.title || `Session ${i + 1}`).trim(),
      startsAt: startsAt || null,
      durationMins: num(s?.durationMins, 60) || 60,
      joinUrl: String(s?.joinUrl || "").trim(),
    };
  });

  const isPaid = raw.isPaid === undefined ? num(raw.price) > 0 : !!raw.isPaid;
  const price = isPaid ? num(raw.price) : 0;
  if (isPaid && price <= 0) errors.push("Paid class needs a price above 0");

  let registrationClosesAt = null;
  if (raw.registrationClosesAt) {
    registrationClosesAt = toIso(raw.registrationClosesAt);
    if (registrationClosesAt === undefined) {
      errors.push('registrationClosesAt must look like "2026-10-04T21:00" or be null');
      registrationClosesAt = null;
    }
  }

  const known = new Set([
    "title", "slug", "description", "thumbnail", "sessions", "isPaid", "price", "mrp",
    "seatLimit", "registrationClosesAt", "whatsappLink", "confirmationMsg", "isPublished", "isCompleted",
  ]);
  const unknown = Object.keys(raw).filter((k) => !known.has(k));
  if (unknown.length) warnings.push(`Ignored unknown field${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`);

  return {
    errors,
    warnings,
    data: {
      title,
      slug: slugify(raw.slug || title),
      description: String(raw.description || ""),
      thumbnail: String(raw.thumbnail || "").trim(),
      sessions,
      isPaid,
      price,
      mrp: num(raw.mrp),
      seatLimit: Math.max(0, Math.floor(num(raw.seatLimit))),
      registrationClosesAt,
      whatsappLink: String(raw.whatsappLink || "").trim(),
      confirmationMsg: String(raw.confirmationMsg || "").trim() || DEFAULT_CONFIRM,
      isPublished: !!raw.isPublished,
      isCompleted: !!raw.isCompleted,
    },
  };
}

// Make slugs unique within one import batch ("x", "x-2", "x-3"…)
export function dedupeSlugs(items) {
  const seen = {};
  return items.map((it) => {
    if (!it.data) return it;
    const base = it.data.slug || "class";
    seen[base] = (seen[base] || 0) + 1;
    if (seen[base] === 1) return it;
    return { ...it, data: { ...it.data, slug: `${base}-${seen[base]}` } };
  });
}

// Current form state → JSON (for "Copy as JSON" on an existing class)
export function formToJson(f) {
  const ist = (iso) => {
    if (!iso) return null;
    const d = new Date(new Date(iso).getTime() + 5.5 * 3600000);
    return d.toISOString().slice(0, 16);
  };
  return {
    title: f.title,
    slug: f.slug,
    description: f.description,
    thumbnail: f.thumbnail,
    sessions: f.sessions.map((s) => ({
      title: s.title, startsAt: ist(s.startsAt), durationMins: Number(s.durationMins) || 60, joinUrl: s.joinUrl || "",
    })),
    isPaid: f.isPaid,
    price: Number(f.price) || 0,
    mrp: Number(f.mrp) || 0,
    seatLimit: Number(f.seatLimit) || 0,
    registrationClosesAt: ist(f.registrationClosesAt),
    whatsappLink: f.whatsappLink,
    confirmationMsg: f.confirmationMsg,
    isPublished: f.isPublished,
  };
}

export const copyText = (text) =>
  navigator.clipboard?.writeText(text).then(() => true).catch(() => false) ?? Promise.resolve(false);

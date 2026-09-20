// ============================================================
// ClassForm — create / edit a class (/manage)
// ============================================================
import { useState } from "react";
import { classesAdminAPI } from "../utils/classesApi";
import { slugify } from "../utils/classFormat";
import { useToast } from "../context/ToastContext";
import { input, btnPrimary, btnGhost, label } from "./ui";

// <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm"
const toLocalInput = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const off = dt.getTimezoneOffset() * 60000;
  return new Date(dt.getTime() - off).toISOString().slice(0, 16);
};
const fromLocalInput = (v) => (v ? new Date(v).toISOString() : null);

const nextEvening = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(19, 0, 0, 0);
  return d.toISOString();
};

const EMPTY = {
  title: "",
  slug: "",
  description: "",
  thumbnail: "",
  sessions: [{ title: "Session 1", startsAt: nextEvening(), durationMins: 60, joinUrl: "" }],
  isPaid: true,
  price: 199,
  mrp: 0,
  seatLimit: 15,
  registrationClosesAt: null,
  whatsappLink: "",
  confirmationMsg: "Your seat is confirmed. Join the WhatsApp group for reminders and the joining link.",
  isPublished: false,
  isCompleted: false,
};

export default function ClassForm({ initial, onDone, onCancel }) {
  const { showToast } = useToast();
  const isNew = !initial?._id;
  const [f, setF] = useState(() => (initial ? { ...EMPTY, ...initial } : EMPTY));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setTitle = (v) => setF((p) => ({ ...p, title: v, slug: slugTouched ? p.slug : slugify(v) }));

  const setSession = (i, k, v) =>
    setF((p) => ({ ...p, sessions: p.sessions.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));

  // New session = previous one + 1 day, same time and length
  const addSession = () =>
    setF((p) => {
      const last = p.sessions[p.sessions.length - 1];
      const start = last?.startsAt ? new Date(new Date(last.startsAt).getTime() + 86400000).toISOString() : nextEvening();
      return {
        ...p,
        sessions: [...p.sessions, {
          title: `Session ${p.sessions.length + 1}`, startsAt: start,
          durationMins: last?.durationMins || 60, joinUrl: last?.joinUrl || "",
        }],
      };
    });
  const removeSession = (i) => setF((p) => ({ ...p, sessions: p.sessions.filter((_, j) => j !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim()) return setError("Give the class a title.");
    if (!f.slug.trim()) return setError("Add a link name (slug).");
    if (!f.sessions.length || f.sessions.some((s) => !s.startsAt || !s.title.trim())) {
      return setError("Every session needs a title and a date.");
    }
    if (f.isPaid && !(Number(f.price) > 0)) return setError("A paid class needs a price above 0.");

    const body = {
      ...f,
      slug: slugify(f.slug),
      price: f.isPaid ? Number(f.price) : 0,
      mrp: Number(f.mrp) || 0,
      seatLimit: Number(f.seatLimit) || 0,
      sessions: f.sessions.map((s) => ({
        ...(s._id ? { _id: s._id } : {}),
        title: s.title.trim(), startsAt: s.startsAt,
        durationMins: Number(s.durationMins) || 60, joinUrl: (s.joinUrl || "").trim(),
      })),
    };
    delete body._id; delete body.counts; delete body.seatsTaken; delete body.createdAt; delete body.updatedAt;
    delete body.startsAt; delete body.endsAt; delete body.id; delete body.__v; delete body.registrationOpen;

    setBusy(true);
    try {
      if (isNew) await classesAdminAPI.create(body);
      else await classesAdminAPI.update(initial._id, body);
      showToast(isNew ? "Class created" : "Class saved");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold">{isNew ? "New class" : "Edit class"}</h2>
        <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>

      {/* ---- Basics ---- */}
      <section className="space-y-4">
        <div>
          <span className={label}>Title</span>
          <input className={input} value={f.title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Calm the Overthinking Mind — 3 evenings" />
        </div>
        <div>
          <span className={label}>Link name (slug)</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm whitespace-nowrap hidden sm:inline">…/class/</span>
            <input className={input} value={f.slug}
              onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
              onBlur={() => set("slug", slugify(f.slug))} placeholder="calm-the-overthinking-mind" />
          </div>
          {!isNew && <p className="text-xs text-yellow-300/80 mt-1">Changing this breaks links you've already shared.</p>}
        </div>
        <div>
          <span className={label}>Description (line breaks are kept)</span>
          <textarea className={`${input} min-h-[160px]`} value={f.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder={"Who it's for, what you'll practise, what to bring.\n\nKeep it short and concrete."} />
        </div>
        <div>
          <span className={label}>Image URL (optional)</span>
          <input className={input} value={f.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} placeholder="https://…" />
        </div>
      </section>

      {/* ---- Sessions ---- */}
      <section>
        <h3 className="font-display text-xl font-semibold mb-3">Sessions</h3>
        <div className="space-y-3">
          {f.sessions.map((s, i) => (
            <div key={s._id || i} className="border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <span className={label}>Title</span>
                <input className={input} value={s.title} onChange={(e) => setSession(i, "title", e.target.value)} />
              </div>
              <div className="md:col-span-4">
                <span className={label}>Starts (IST)</span>
                <input type="datetime-local" className={input} value={toLocalInput(s.startsAt)}
                  onChange={(e) => setSession(i, "startsAt", fromLocalInput(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <span className={label}>Minutes</span>
                <input type="number" min="5" className={input} value={s.durationMins}
                  onChange={(e) => setSession(i, "durationMins", e.target.value)} />
              </div>
              <div className="md:col-span-2 flex items-end">
                {f.sessions.length > 1 && (
                  <button type="button" onClick={() => removeSession(i)}
                    className="w-full text-red-300 text-sm border border-red-500/25 rounded-lg py-2.5 hover:bg-red-500/10">
                    Remove
                  </button>
                )}
              </div>
              <div className="md:col-span-12">
                <span className={label}>Meet link (only shown to confirmed people)</span>
                <input className={input} value={s.joinUrl} onChange={(e) => setSession(i, "joinUrl", e.target.value)}
                  placeholder="https://meet.google.com/…" />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSession} className={`${btnGhost} mt-3`}>Add another session</button>
      </section>

      {/* ---- Price & seats ---- */}
      <section className="space-y-4">
        <h3 className="font-display text-xl font-semibold">Price and seats</h3>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={f.isPaid} onChange={(e) => set("isPaid", e.target.checked)} className="w-4 h-4 accent-yellow-400" />
          Paid class (UPI, approved by you)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {f.isPaid && (
            <>
              <div>
                <span className={label}>Price ₹</span>
                <input type="number" min="1" className={input} value={f.price} onChange={(e) => set("price", e.target.value)} />
              </div>
              <div>
                <span className={label}>MRP ₹ (struck out, optional)</span>
                <input type="number" min="0" className={input} value={f.mrp} onChange={(e) => set("mrp", e.target.value)} />
              </div>
            </>
          )}
          <div>
            <span className={label}>Seats (0 = no limit)</span>
            <input type="number" min="0" className={input} value={f.seatLimit} onChange={(e) => set("seatLimit", e.target.value)} />
          </div>
          <div>
            <span className={label}>Registration closes</span>
            <input type="datetime-local" className={input} value={toLocalInput(f.registrationClosesAt)}
              onChange={(e) => set("registrationClosesAt", fromLocalInput(e.target.value))} />
            <span className="text-[11px] text-gray-500">Empty = when the first session starts</span>
          </div>
        </div>
      </section>

      {/* ---- After confirmation ---- */}
      <section className="space-y-4">
        <h3 className="font-display text-xl font-semibold">What confirmed people get</h3>
        <div>
          <span className={label}>WhatsApp group link</span>
          <input className={input} value={f.whatsappLink} onChange={(e) => set("whatsappLink", e.target.value)}
            placeholder="https://chat.whatsapp.com/…" />
        </div>
        <div>
          <span className={label}>Confirmation message</span>
          <textarea className={`${input} min-h-[80px]`} value={f.confirmationMsg}
            onChange={(e) => set("confirmationMsg", e.target.value)} />
        </div>
      </section>

      {/* ---- Visibility ---- */}
      <section className="space-y-3 border-t border-white/10 pt-6">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={f.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="w-4 h-4 accent-yellow-400" />
          Published — visible on the site and open for registration
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={f.isCompleted} onChange={(e) => set("isCompleted", e.target.checked)} className="w-4 h-4 accent-yellow-400" />
          Completed — hide from upcoming classes
        </label>
      </section>

      {error && <p className="text-red-300 text-sm" role="alert">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? "Saving…" : isNew ? "Create class" : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </form>
  );
}

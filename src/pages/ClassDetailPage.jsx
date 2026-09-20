// ============================================================
// ClassDetailPage — /class/:slug   (the link you share in reels)
//
// Two modes on one page:
//   1. Not registered  → class details + registration form
//   2. Registered      → status: pending / confirmed / not verified
//
// "Registered" is known from ?r=<key> in the URL (status link from
// the email) or from the key saved on this device after registering.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { classesAPI, savedRegKey } from "../utils/classesApi";
import {
  fmtDateTime, fmtDateLong, fmtTime, rupees, timeUntil, seatsLine,
} from "../utils/classFormat";
import { useToast } from "../context/ToastContext";
import UpiPay from "../components/UpiPay";
import Footer from "../components/Footer";

const inputCls =
  "w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 " +
  "focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40";

const primaryBtn =
  "w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-display font-bold text-lg " +
  "px-8 py-4 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";

// Re-render every minute so "begins in …" stays true
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function ClassDetailPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const now = useNow();

  const [cls, setCls] = useState(null);         // public class data
  const [status, setStatus] = useState(null);   // registration status payload
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  const urlKey = params.get("r");

  const loadStatus = useCallback(async (key) => {
    const data = await classesAPI.status(key);
    // A status link for a different class — send them to the right page
    if (data.class.slug !== slug) {
      navigate(`/class/${data.class.slug}?r=${key}`, { replace: true });
      return;
    }
    savedRegKey.set(slug, key);
    setStatus({ ...data, key });
    setCls(data.class);
  }, [slug, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    setLoadError("");
    const key = urlKey || savedRegKey.get(slug);
    try {
      if (key) {
        try {
          await loadStatus(key);
          return;
        } catch (e) {
          if (e.status !== 404) throw e;
          savedRegKey.clear(slug); // stale or wrong key — fall through to the form
          setStatus(null);
        }
      }
      const data = await classesAPI.get(slug);
      setCls(data);
    } catch (e) {
      if (e.status === 404) setNotFound(true);
      else setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, [slug, urlKey, loadStatus]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-gray-400 text-sm">Loading…</div>;
  }

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-3xl font-semibold mb-4">Couldn't load this class</h1>
        <p className="text-gray-400 mb-8">{loadError}</p>
        <button onClick={load} className="text-yellow-300 border-b border-yellow-500/40 pb-0.5">Try again</button>
      </div>
    );
  }

  if (notFound || !cls) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-4xl font-semibold mb-4">This class isn't available</h1>
        <p className="text-gray-400 mb-8">It may have finished or the link may be mistyped.</p>
        <Link to="/classes" className="text-yellow-300 border-b border-yellow-500/40 pb-0.5">See upcoming classes</Link>
      </div>
    );
  }

  const begins = cls.startsAt ? timeUntil(cls.startsAt, now) : null;
  const seats = seatsLine(cls);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        <Link to="/classes" className="text-gray-400 hover:text-white text-sm">← All classes</Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,26rem] gap-10 lg:gap-14 mt-8">

          {/* ---------------- Left: about the class ---------------- */}
          <div>
            {begins && <p className="text-teal-300 text-sm mb-4">Begins {begins}</p>}
            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.08] mb-6">{cls.title}</h1>

            {cls.thumbnail && (
              <img src={cls.thumbnail} alt="" className="w-full max-h-80 object-cover rounded-2xl mb-8 border border-white/10" />
            )}

            {cls.description && (
              <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line mb-10 max-w-2xl">
                {cls.description}
              </p>
            )}

            <h2 className="font-display text-2xl font-semibold mb-4">
              {cls.sessions.length > 1 ? "Schedule" : "When"}
            </h2>
            <ol className="border-l border-yellow-500/30 ml-2 space-y-6 mb-4">
              {(status?.access?.sessions || cls.sessions).map((s) => (
                <li key={s._id} className="relative pl-6">
                  <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                  <div className="text-teal-300 text-sm">{fmtDateLong(s.startsAt)} · {fmtTime(s.startsAt)} IST</div>
                  <div className="font-display text-xl font-semibold mt-0.5">{s.title}</div>
                  <div className="text-gray-500 text-sm">{s.durationMins} minutes on Google Meet</div>
                  {s.joinUrl && (
                    <a href={s.joinUrl} target="_blank" rel="noreferrer"
                      className="inline-block mt-2 text-sm text-yellow-300 border-b border-yellow-500/40 pb-0.5 hover:border-yellow-300">
                      Joining link
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* ---------------- Right: register / status ---------------- */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white/4 border border-white/10 rounded-2xl p-6 md:p-7">
              {status ? (
                <StatusPanel status={status} slug={slug} onRefresh={() => loadStatus(status.key)} />
              ) : (
                <>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-display text-4xl font-semibold text-teal-300">
                      {cls.isPaid ? rupees(cls.price) : "Free"}
                    </span>
                    {cls.isPaid && cls.mrp > cls.price && (
                      <span className="text-gray-500 line-through">{rupees(cls.mrp)}</span>
                    )}
                  </div>
                  {seats && (
                    <p className={`text-sm mb-6 ${cls.closedReason === "full" ? "text-red-300" : "text-gray-300"}`}>{seats}</p>
                  )}
                  {!seats && <div className="mb-6" />}

                  {cls.registrationOpen ? (
                    <RegisterForm cls={cls} slug={slug}
                      onRegistered={(key) => navigate(`/class/${slug}?r=${key}`, { replace: true })} />
                  ) : (
                    <ClosedNotice cls={cls} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ============================================================
function ClosedNotice({ cls }) {
  return (
    <div>
      <p className="text-gray-200">
        {cls.closedReason === "full" ? "All seats for this class are taken." : "Registration for this class has closed."}
      </p>
      <p className="text-gray-400 text-sm mt-2">Watch Instagram for the next one, or book a one-on-one session.</p>
      <Link to="/booking"
        className="block text-center mt-6 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-display font-bold px-6 py-3 rounded-xl">
        Book a session
      </Link>
    </div>
  );
}

// ============================================================
function RegisterForm({ cls, slug, onRegistered }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "", utr: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("Please enter a 10-digit WhatsApp number.");
    if (cls.isPaid && !/^[A-Za-z0-9]{6,30}$/.test(form.utr.trim())) {
      return setError("Enter the UTR / transaction ID from your UPI app after paying.");
    }
    setBusy(true);
    try {
      const res = await classesAPI.register(slug, form);
      savedRegKey.set(slug, res.accessKey);
      showToast(res.existing ? "You're already registered — here's your status" : "Registration received");
      onRegistered(res.accessKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Your name">
        <input className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" required maxLength={80} />
      </Field>
      <Field label="Email">
        <input className={inputCls} type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
      </Field>
      <Field label="WhatsApp number" hint="The joining details are shared here">
        <input className={inputCls} type="tel" inputMode="tel" value={form.phone} onChange={set("phone")}
          autoComplete="tel" placeholder="98765 43210" required />
      </Field>
      <Field label="What brings you here?" hint="Optional — helps me shape the class">
        <textarea className={`${inputCls} min-h-[80px]`} value={form.note} onChange={set("note")} maxLength={600}
          placeholder="Overthinking at night, stress at work, want to start meditating…" />
      </Field>

      {/* Honeypot — hidden from people, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></label>
      </div>

      {cls.isPaid && (
        <div className="pt-2 space-y-4">
          <div className="text-sm text-gray-300">Pay first, then enter the transaction ID below.</div>
          <UpiPay payment={cls.payment} amount={cls.price} title={cls.title} />
          <Field label="UTR / transaction ID" hint="12-digit number shown in your UPI app after paying">
            <input className={inputCls} value={form.utr} onChange={set("utr")} inputMode="text" autoComplete="off" required />
          </Field>
        </div>
      )}

      {error && <p className="text-red-300 text-sm" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy ? "Registering…" : cls.isPaid ? `Register · ${rupees(cls.price)} paid` : "Register for free"}
      </button>
    </form>
  );
}

// ============================================================
function StatusPanel({ status, slug, onRefresh }) {
  const { showToast } = useToast();
  const { registration: reg, access, payment } = status;
  const cls = status.class;
  const [checking, setChecking] = useState(false);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const link = `${window.location.origin}/class/${slug}?r=${status.key}`;
  const copyLink = () =>
    navigator.clipboard?.writeText(link)
      .then(() => showToast("Link copied"))
      .catch(() => showToast("Couldn't copy — long-press the link instead", "error"));

  const refresh = async () => {
    setChecking(true);
    try { await onRefresh(); } finally { setChecking(false); }
  };

  const resubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[A-Za-z0-9]{6,30}$/.test(utr.trim())) return setError("Enter the UTR exactly as shown in your UPI app.");
    setBusy(true);
    try {
      await classesAPI.resubmit(status.key, utr.trim());
      showToast("UTR submitted");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const first = reg.name.split(" ")[0];

  return (
    <div>
      {reg.status === "active" && (
        <>
          <div className="text-green-300 text-sm mb-2">✓ Seat confirmed</div>
          <h2 className="font-display text-3xl font-semibold mb-3">See you there, {first}.</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{access?.confirmationMsg}</p>
          {access?.whatsappLink && (
            <a href={access.whatsappLink} target="_blank" rel="noreferrer"
              className="block text-center bg-gradient-to-r from-teal-500 to-teal-300 text-black font-display font-bold text-lg px-6 py-4 rounded-xl">
              Join the WhatsApp group
            </a>
          )}
          <p className="text-gray-500 text-xs mt-4">The schedule on this page now includes the joining links.</p>
        </>
      )}

      {reg.status === "pending" && (
        <>
          <div className="text-teal-300 text-sm mb-2">Payment being verified</div>
          <h2 className="font-display text-3xl font-semibold mb-3">Thank you, {first}.</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            Your seat is held. Once the payment of {rupees(reg.amount)} is verified — usually within a few hours —
            you'll get an email, and the WhatsApp group link will appear on this page.
          </p>
          <p className="text-gray-500 text-xs mb-6">UTR {reg.utr}</p>
          <button onClick={refresh} disabled={checking}
            className="w-full border border-white/15 rounded-xl py-3 text-sm hover:bg-white/5 disabled:opacity-50">
            {checking ? "Checking…" : "Check status again"}
          </button>
        </>
      )}

      {reg.status === "rejected" && (
        <>
          <div className="text-red-300 text-sm mb-2">Payment not verified</div>
          <h2 className="font-display text-3xl font-semibold mb-3">Let's sort this out, {first}.</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">{reg.rejectReason}</p>
          {cls.registrationOpen ? (
            <form onSubmit={resubmit} className="space-y-4">
              {cls.isPaid && <UpiPay payment={payment} amount={cls.price} title={cls.title} />}
              <Field label="Correct UTR / transaction ID">
                <input className={inputCls} value={utr} onChange={(e) => setUtr(e.target.value)} autoComplete="off" />
              </Field>
              {error && <p className="text-red-300 text-sm" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className={primaryBtn}>
                {busy ? "Submitting…" : "Submit UTR"}
              </button>
            </form>
          ) : (
            <p className="text-gray-400 text-sm">Registration for this class has closed. Reply to the email you received and we'll help.</p>
          )}
        </>
      )}

      {/* Status link — works from any device */}
      <div className="mt-7 pt-6 border-t border-white/10">
        <div className="text-sm text-gray-300 mb-1">Your registration link</div>
        <p className="text-gray-500 text-xs mb-3">Open it on any device to see this page. It's also in your email.</p>
        <div className="flex gap-2">
          <input readOnly value={link} onFocus={(e) => e.target.select()}
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400" />
          <button onClick={copyLink} className="px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 text-sm">Copy</button>
        </div>
        <p className="text-gray-600 text-xs mt-3">Registered {fmtDateTime(reg.registeredAt)} as {reg.email}</p>
      </div>
    </div>
  );
}

// ============================================================
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-200 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

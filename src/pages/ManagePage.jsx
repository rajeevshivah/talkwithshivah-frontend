// ============================================================
// ManagePage — /manage   (not linked anywhere on the site)
// Admin for group classes. Uses its own login from the classes
// backend — separate from your MentorHub account.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { classesAdminAPI, adminToken } from "../utils/classesApi";
import { fmtDateTime, rupees } from "../utils/classFormat";
import { useToast } from "../context/ToastContext";
import ClassForm from "../manage/ClassForm";
import RegistrationsPanel from "../manage/RegistrationsPanel";
import UpiSettings from "../manage/UpiSettings";
import ImportPanel from "../manage/ImportPanel";
import { input, btnPrimary, btnGhost, label } from "../manage/ui";

export default function ManagePage() {
  const [authed, setAuthed] = useState(!!adminToken.get());

  // Validate a saved token once on load
  useEffect(() => {
    if (!adminToken.get()) return;
    classesAdminAPI.me().catch(() => { adminToken.clear(); setAuthed(false); });
  }, []);

  const logout = () => { adminToken.clear(); setAuthed(false); };

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/10 px-6">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <div className="font-display text-xl">
            talkWith<span className="text-yellow-400">Shivah</span>
            <span className="text-gray-500 text-sm font-sans ml-3">Classes admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/classes" className="text-gray-400 hover:text-white">View site</Link>
            {authed && <button onClick={logout} className="text-gray-400 hover:text-white">Log out</button>}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {authed ? <Dashboard onAuthLost={logout} /> : <Login onLogin={() => setAuthed(true)} />}
      </div>
    </div>
  );
}

// ============================================================
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await classesAdminAPI.login(email, password);
      adminToken.set(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h1 className="font-display text-4xl font-semibold mb-2">Log in</h1>
      <p className="text-gray-400 text-sm mb-4">Use the admin email and password set on the classes backend.</p>
      <div>
        <span className={label}>Email</span>
        <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      </div>
      <div>
        <span className={label}>Password</span>
        <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </div>
      {error && <p className="text-red-300 text-sm" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>{busy ? "Logging in…" : "Log in"}</button>
    </form>
  );
}

// ============================================================
function Dashboard({ onAuthLost }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState("classes");
  const [classes, setClasses] = useState(null);
  const [upiMissing, setUpiMissing] = useState(false);
  const [editing, setEditing] = useState(null);   // null | {} (new) | class
  const [viewing, setViewing] = useState(null);   // class whose registrations are open
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [list, settings] = await Promise.all([classesAdminAPI.list(), classesAdminAPI.getSettings()]);
      setClasses(list);
      setUpiMissing(!settings.upiId);
    } catch (e) {
      if (e.status === 401) return onAuthLost();
      showToast(e.message, "error");
      setClasses([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  const shareLink = (c) => `${window.location.origin}/class/${c.slug}`;
  const copyLink = (c) =>
    navigator.clipboard?.writeText(shareLink(c)).then(() => showToast("Class link copied"));

  const remove = async (c) => {
    const n = c.counts.active + c.counts.pending + c.counts.rejected;
    if (!window.confirm(`Delete "${c.title}"${n ? ` and its ${n} registration(s)` : ""}? This can't be undone.`)) return;
    try {
      const res = await classesAdminAPI.remove(c._id);
      showToast(res.message);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  if (editing) {
    return (
      // {} = blank new class; object without _id = new class prefilled from JSON
      <ClassForm initial={Object.keys(editing).length ? editing : null}
        onCancel={() => setEditing(null)}
        onDone={() => { setEditing(null); load(); }} />
    );
  }
  if (importing) {
    return (
      <ImportPanel
        onBack={() => setImporting(false)}
        onReview={(data) => { setImporting(false); setEditing(data); }}
        onDone={() => { setImporting(false); load(); }} />
    );
  }
  if (viewing) {
    return <RegistrationsPanel cls={viewing} onBack={() => { setViewing(null); load(); }} />;
  }

  const pendingTotal = (classes || []).reduce((n, c) => n + c.counts.pending, 0);

  return (
    <div>
      <div className="flex gap-2 mb-8">
        {[["classes", "Classes"], ["upi", "UPI details"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm ${tab === id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === "upi" && <UpiSettings />}

      {tab === "classes" && (
        <>
          {upiMissing && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
              Add your UPI ID before publishing a paid class, otherwise people can't pay.{" "}
              <button onClick={() => setTab("upi")} className="underline">Add UPI details</button>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-4xl font-semibold">Classes</h1>
              {pendingTotal > 0 && (
                <p className="text-teal-300 text-sm mt-1">{pendingTotal} registration{pendingTotal === 1 ? "" : "s"} waiting for approval</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setImporting(true)} className={btnGhost}>Import JSON</button>
              <button onClick={() => setEditing({})} className={btnPrimary}>New class</button>
            </div>
          </div>

          {classes === null && <p className="text-gray-400 text-sm">Loading…</p>}
          {classes?.length === 0 && (
            <div className="border border-white/10 rounded-2xl p-8 text-center text-gray-300">
              No classes yet. Create one, publish it, and share its link.
            </div>
          )}

          <div className="space-y-3">
            {classes?.map((c) => (
              <div key={c._id} className="border border-white/10 rounded-xl p-5 bg-white/3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-2xl font-semibold">{c.title}</h3>
                      {!c.isPublished && <Badge tone="muted">Draft</Badge>}
                      {c.isCompleted && <Badge tone="muted">Completed</Badge>}
                      {c.isPublished && !c.isCompleted && (
                        c.registrationOpen ? <Badge tone="green">Open</Badge> : <Badge tone="muted">Closed</Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {c.startsAt ? fmtDateTime(c.startsAt) : "No date"} · {c.sessions.length} session{c.sessions.length === 1 ? "" : "s"}
                      {" · "}{c.isPaid ? rupees(c.price) : "Free"}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="text-green-300">{c.counts.active} confirmed</span>
                      {c.counts.pending > 0 && <span className="text-teal-300"> · {c.counts.pending} to approve</span>}
                      {c.seatLimit > 0 && <span className="text-gray-400"> · {c.seatsTaken}/{c.seatLimit} seats</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setViewing(c)} className={btnPrimary}>Registrations</button>
                    <button onClick={() => setEditing(c)} className={btnGhost}>Edit</button>
                    {c.isPublished && <button onClick={() => copyLink(c)} className={btnGhost}>Copy link</button>}
                    <button onClick={() => remove(c)} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-300">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Badge({ tone, children }) {
  const cls = {
    green: "bg-green-500/15 text-green-300",
    muted: "bg-white/8 text-gray-400",
  }[tone];
  return <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{children}</span>;
}

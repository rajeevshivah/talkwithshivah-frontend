// ============================================================
// ImportPanel — create one or many classes from JSON (/manage)
// Flow: Copy format for AI → ask AI → paste reply → Check → Create.
// ============================================================
import { useState } from "react";
import { classesAdminAPI } from "../utils/classesApi";
import { fmtDateTime, rupees } from "../utils/classFormat";
import { useToast } from "../context/ToastContext";
import { parseClassJson, normalizeClass, dedupeSlugs, AI_PROMPT, EXAMPLE_JSON, copyText } from "./classJson";
import { input, btnPrimary, btnGhost } from "./ui";

export default function ImportPanel({ onBack, onReview, onDone }) {
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [items, setItems] = useState(null);     // normalized results
  const [parseError, setParseError] = useState("");
  const [results, setResults] = useState({});   // index -> { ok, message }
  const [busy, setBusy] = useState(false);

  const copy = async (value, msg) => {
    const ok = await copyText(value);
    showToast(ok ? msg : "Couldn't copy — select the text and copy manually", ok ? "success" : "error");
  };

  const check = () => {
    setParseError("");
    setResults({});
    try {
      const raw = parseClassJson(text);
      if (!raw.length) throw new Error("The list is empty.");
      setItems(dedupeSlugs(raw.map((r, i) => normalizeClass(r, i))));
    } catch (e) {
      setItems(null);
      setParseError(e.message);
    }
  };

  const valid = (items || []).map((it, i) => ({ ...it, i })).filter((it) => it.data && it.errors.length === 0);

  const remaining = valid.filter((it) => !results[it.i]?.ok);

  const createAll = async () => {
    setBusy(true);
    const out = {};
    for (const it of valid) {
      if (results[it.i]?.ok) continue; // don't re-create on retry
      try {
        await classesAdminAPI.create(it.data);
        out[it.i] = { ok: true, message: "Created" };
      } catch (e) {
        out[it.i] = { ok: false, message: e.message };
      }
      setResults((r) => ({ ...r, ...out }));
    }
    setBusy(false);
    const made = Object.values({ ...results, ...out }).filter((r) => r.ok).length;
    const failed = Object.values(out).filter((r) => !r.ok).length;
    if (made && !failed) {
      showToast(`${made} class${made === 1 ? "" : "es"} created`);
      onDone();
    } else if (failed) {
      showToast(`${failed} couldn't be created — see the reasons below`, "error");
    }
  };

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← All classes</button>
      <h2 className="font-display text-3xl font-semibold mt-3">Import classes from JSON</h2>
      <p className="text-gray-400 text-sm mt-1 max-w-2xl">
        Copy the format, paste it into ChatGPT or Claude, describe your classes under it,
        then paste the reply here. One class or many — both work.
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        <button onClick={() => copy(AI_PROMPT, "Format copied — paste it into your AI chat")} className={btnPrimary}>
          Copy format for AI
        </button>
        <button onClick={() => copy(JSON.stringify(EXAMPLE_JSON, null, 2), "Example JSON copied")} className={btnGhost}>
          Copy example JSON
        </button>
      </div>

      <textarea
        className={`${input} font-mono text-xs min-h-[260px] mt-6`}
        value={text}
        onChange={(e) => { setText(e.target.value); setItems(null); setResults({}); }}
        placeholder='[ { "title": "…", "sessions": [ { "title": "…", "startsAt": "2026-10-05T19:00" } ], … } ]'
        spellCheck={false}
      />

      {parseError && <p className="text-red-300 text-sm mt-3" role="alert">{parseError}</p>}

      <div className="flex gap-2 mt-4">
        <button onClick={check} className={btnGhost} disabled={!text.trim()}>Check JSON</button>
      </div>

      {items && (
        <div className="mt-8">
          <h3 className="font-display text-xl font-semibold mb-3">
            {items.length} class{items.length === 1 ? "" : "es"} found
            {valid.length !== items.length && (
              <span className="text-red-300 text-sm font-sans font-normal ml-2">
                · {items.length - valid.length} with problems will be skipped
              </span>
            )}
          </h3>

          <div className="space-y-3">
            {items.map((it, i) => {
              const d = it.data;
              const res = results[i];
              return (
                <div key={i} className={`border rounded-xl p-4 bg-white/3 ${
                  it.errors.length ? "border-red-500/30" : res?.ok ? "border-green-500/30" : "border-white/10"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-xl font-semibold">{d?.title || `Class ${i + 1}`}</div>
                      {d && (
                        <p className="text-gray-400 text-sm mt-1">
                          /class/{d.slug}
                          {d.sessions[0]?.startsAt && <> · {fmtDateTime(d.sessions[0].startsAt)} IST</>}
                          {" · "}{d.sessions.length} session{d.sessions.length === 1 ? "" : "s"}
                          {" · "}{d.isPaid ? rupees(d.price) : "Free"}
                          {" · "}{d.seatLimit ? `${d.seatLimit} seats` : "no seat limit"}
                          {" · "}{d.isPublished ? "Published" : "Draft"}
                        </p>
                      )}
                      {it.errors.map((e) => <p key={e} className="text-red-300 text-sm mt-1">✕ {e}</p>)}
                      {it.warnings.map((w) => <p key={w} className="text-yellow-200/80 text-xs mt-1">⚠ {w}</p>)}
                      {res && (
                        <p className={`text-sm mt-1 ${res.ok ? "text-green-300" : "text-red-300"}`}>
                          {res.ok ? "✓ Created" : `✕ ${res.message}`}
                        </p>
                      )}
                    </div>
                    {d && !it.errors.length && !res?.ok && (
                      <button onClick={() => onReview(d)} className={btnGhost}>Review in form</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {remaining.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={createAll} disabled={busy} className={btnPrimary}>
                {busy ? "Creating…" : `Create ${remaining.length} class${remaining.length === 1 ? "" : "es"}`}
              </button>
              <span className="text-gray-500 text-xs">
                Classes marked Draft stay hidden until you tick Published.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

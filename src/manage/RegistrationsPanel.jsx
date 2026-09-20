// ============================================================
// RegistrationsPanel — people registered for one class (/manage)
// Approve after checking the UTR in your bank / UPI app.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { classesAdminAPI } from "../utils/classesApi";
import { fmtDateTime, rupees } from "../utils/classFormat";
import { useToast } from "../context/ToastContext";
import { btnGhost, btnPrimary, btnDanger } from "./ui";

const FILTERS = [
  { id: "pending", label: "To approve" },
  { id: "active", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const STATUS_STYLE = {
  pending: "bg-teal-500/15 text-teal-300",
  active: "bg-green-500/15 text-green-300",
  rejected: "bg-red-500/15 text-red-300",
};
const STATUS_LABEL = { pending: "To approve", active: "Confirmed", rejected: "Rejected" };

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function RegistrationsPanel({ cls, onBack }) {
  const { showToast } = useToast();
  const [regs, setRegs] = useState(null);
  const [filter, setFilter] = useState(cls.isPaid ? "pending" : "active");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    classesAdminAPI.registrations(cls._id)
      .then(setRegs)
      .catch((e) => { showToast(e.message, "error"); setRegs([]); });
  // showToast is not memoised in ToastContext — keep it out of deps to avoid refetch loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls._id]);

  useEffect(() => { load(); }, [load]);

  const act = async (id, fn, okMsg) => {
    setBusyId(id);
    try {
      const res = await fn();
      showToast(res?.message || okMsg);
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const approve = (r) => act(r._id, () => classesAdminAPI.approve(r._id));
  const reject = (r) => {
    const reason = window.prompt(
      `Reason for rejecting ${r.name}? They'll see this and can submit a corrected UTR.`,
      "We couldn't find this payment. Please check the UTR and submit it again."
    );
    if (reason === null) return;
    act(r._id, () => classesAdminAPI.reject(r._id, reason));
  };
  const remove = (r) => {
    if (!window.confirm(`Delete ${r.name}'s registration? This can't be undone.`)) return;
    act(r._id, () => classesAdminAPI.removeRegistration(r._id));
  };
  const toggleAttended = async (r) => {
    try {
      const { attended } = await classesAdminAPI.toggleAttended(r._id);
      setRegs((list) => list.map((x) => (x._id === r._id ? { ...x, attended } : x)));
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const exportCsv = () => {
    const rows = [["Name", "Email", "WhatsApp", "Status", "Amount", "UTR", "Attended", "Note", "Registered"]];
    regs.forEach((r) => rows.push([
      r.name, r.email, r.phone, STATUS_LABEL[r.status], r.amount, r.utr,
      r.attended ? "yes" : "", r.note, fmtDateTime(r.createdAt),
    ]));
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cls.slug}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyNumbers = () => {
    const nums = regs.filter((r) => r.status === "active").map((r) => r.phone).join("\n");
    if (!nums) return showToast("No confirmed people yet", "error");
    navigator.clipboard?.writeText(nums).then(() => showToast("Confirmed WhatsApp numbers copied"));
  };

  const counts = (regs || []).reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
  const shown = (regs || []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white text-sm">← All classes</button>
      <h2 className="font-display text-3xl font-semibold mt-3">{cls.title}</h2>
      <p className="text-gray-400 text-sm mt-1">
        {counts.active || 0} confirmed · {counts.pending || 0} to approve
        {cls.seatLimit > 0 && ` · ${cls.seatsTaken} of ${cls.seatLimit} seats taken`}
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filter === f.id ? "border-yellow-400/60 bg-yellow-500/15 text-yellow-300" : "border-white/10 text-gray-400 hover:text-white"}`}>
            {f.label}
            {f.id !== "all" && counts[f.id] ? ` (${counts[f.id]})` : ""}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={copyNumbers} className={btnGhost} disabled={!regs?.length}>Copy confirmed numbers</button>
        <button onClick={exportCsv} className={btnGhost} disabled={!regs?.length}>Download CSV</button>
      </div>

      {regs === null && <p className="text-gray-400 text-sm mt-8">Loading…</p>}
      {regs && shown.length === 0 && (
        <p className="text-gray-400 text-sm mt-8">
          {filter === "pending" ? "Nothing waiting for approval." : "No registrations here yet."}
        </p>
      )}

      <div className="space-y-3 mt-6">
        {shown.map((r) => (
          <div key={r._id} className="border border-white/10 rounded-xl p-4 bg-white/3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{r.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                  {r.attended && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300">Attended</span>}
                </div>
                <div className="text-sm text-gray-400 mt-1 break-all">
                  <a href={`https://wa.me/${r.phone.length === 10 ? "91" + r.phone : r.phone}`} target="_blank" rel="noreferrer"
                    className="text-teal-300 hover:underline">{r.phone}</a>
                  <span className="text-gray-600"> · </span>{r.email}
                </div>
                {r.amount > 0 && (
                  <div className="text-sm mt-1">
                    {rupees(r.amount)} · UTR <span className="font-mono text-gray-200 select-all">{r.utr || "—"}</span>
                    {r.utrReused && (
                      <span className="ml-2 text-xs text-red-300">⚠ this UTR is used on another registration</span>
                    )}
                  </div>
                )}
                {r.note && <p className="text-sm text-gray-300 mt-2 italic">"{r.note}"</p>}
                {r.status === "rejected" && r.rejectReason && (
                  <p className="text-xs text-red-300/80 mt-1">Rejected: {r.rejectReason}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">{fmtDateTime(r.createdAt)}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {r.status === "pending" && (
                  <>
                    <button onClick={() => approve(r)} disabled={busyId === r._id} className={btnPrimary}>Approve</button>
                    <button onClick={() => reject(r)} disabled={busyId === r._id} className={btnDanger}>Reject</button>
                  </>
                )}
                {r.status === "active" && (
                  <button onClick={() => toggleAttended(r)} className={btnGhost}>
                    {r.attended ? "Unmark attended" : "Mark attended"}
                  </button>
                )}
                <button onClick={() => remove(r)} disabled={busyId === r._id}
                  className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-300">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

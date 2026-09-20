// ============================================================
// UpiSettings — the UPI ID people pay to (/manage)
// ============================================================
import { useEffect, useState } from "react";
import { classesAdminAPI } from "../utils/classesApi";
import { useToast } from "../context/ToastContext";
import UpiPay from "../components/UpiPay";
import { input, btnPrimary, label } from "./ui";

export default function UpiSettings() {
  const { showToast } = useToast();
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    classesAdminAPI.getSettings().then(setS).catch((e) => showToast(e.message, "error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!s) return <p className="text-gray-400 text-sm">Loading…</p>;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setS(await classesAdminAPI.saveSettings({ upiId: s.upiId, upiName: s.upiName, paymentNote: s.paymentNote }));
      showToast("UPI details saved");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={save} className="space-y-4">
        <h2 className="font-display text-3xl font-semibold">UPI details</h2>
        <p className="text-gray-400 text-sm">Used for every paid class. The QR code is generated from this.</p>
        <div>
          <span className={label}>UPI ID</span>
          <input className={input} value={s.upiId} onChange={(e) => setS({ ...s, upiId: e.target.value })} placeholder="name@okaxis" />
        </div>
        <div>
          <span className={label}>Payee name (as shown in UPI apps)</span>
          <input className={input} value={s.upiName} onChange={(e) => setS({ ...s, upiName: e.target.value })} />
        </div>
        <div>
          <span className={label}>Note under the QR</span>
          <textarea className={`${input} min-h-[80px]`} value={s.paymentNote}
            onChange={(e) => setS({ ...s, paymentNote: e.target.value })} />
        </div>
        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Saving…" : "Save UPI details"}</button>
      </form>

      <div>
        <span className={label}>Preview (₹1 — scan it to test before going live)</span>
        <UpiPay payment={s} amount={1} title="Test payment" />
      </div>
    </div>
  );
}

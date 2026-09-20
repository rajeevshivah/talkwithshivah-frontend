// ============================================================
// UpiPay — QR code + "open UPI app" button for an exact amount.
// The QR is generated in the browser from your UPI ID, so there
// is no image to upload or keep updated.
// ============================================================
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { upiLink, rupees } from "../utils/classFormat";
import { useToast } from "../context/ToastContext";

export default function UpiPay({ payment, amount, title }) {
  const { showToast } = useToast();
  const [qr, setQr] = useState("");
  const link = payment?.upiId ? upiLink({ ...payment, amount, note: title }) : "";

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 220, margin: 1, color: { dark: "#15112b", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [link]);

  if (!payment?.upiId) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        Payment details aren't set up yet. Please message us on WhatsApp to register.
      </div>
    );
  }

  const copyId = () => {
    navigator.clipboard?.writeText(payment.upiId)
      .then(() => showToast("UPI ID copied"))
      .catch(() => showToast("Couldn't copy — please copy it manually", "error"));
  };

  return (
    <div className="rounded-2xl border border-teal-500/25 bg-teal-500/5 p-5">
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {qr && (
          <img src={qr} alt={`UPI QR code to pay ${rupees(amount)}`}
            className="w-44 h-44 rounded-xl bg-white p-2 flex-shrink-0" />
        )}
        <div className="text-center sm:text-left">
          <div className="font-display text-3xl font-semibold text-teal-300">{rupees(amount)}</div>
          <div className="text-gray-300 text-sm mt-1">to {payment.upiName || "talkWithShivah"}</div>
          <button type="button" onClick={copyId}
            className="mt-2 text-sm text-gray-400 hover:text-white underline decoration-white/20 underline-offset-4 break-all">
            {payment.upiId}
          </button>
          {/* Deep link — opens GPay / PhonePe / Paytm on phones */}
          <a href={link}
            className="sm:hidden mt-4 block bg-gradient-to-r from-teal-500 to-teal-300 text-black font-display font-bold px-6 py-3 rounded-xl">
            Pay with a UPI app
          </a>
          <p className="hidden sm:block text-gray-500 text-xs mt-3">Scan with any UPI app on your phone.</p>
        </div>
      </div>
      {payment.note && <p className="text-gray-400 text-xs mt-4 leading-relaxed">{payment.note}</p>}
    </div>
  );
}

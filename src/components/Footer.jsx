// ============================================================
// Footer — talkWithShivah
// ============================================================
export default function Footer() {
  return (
    <div className="bg-white/2 border-t border-white/7 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-bold mb-3">
              talkWith<span className="text-yellow-400">Shivah</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              One-on-one meditation and contemplative practice with
              Rajeev Shivah. Old texts, living practice, from Varanasi.
            </p>
            <div className="flex gap-3">
              <a href="https://www.youtube.com/@talkwithshivah" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center
                  justify-center text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400
                  cursor-pointer transition-all text-xs font-bold">
                YT
              </a>
              <a href="https://www.instagram.com/talkwithshivah" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center
                  justify-center text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400
                  cursor-pointer transition-all text-xs font-bold">
                IG
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="font-display font-bold text-base mb-3 text-gray-300">Quiet Links</div>
            <div className="space-y-2">
              {[
                ["Book a Sitting", "/booking"],
                ["YouTube — talkWithShivah", "https://www.youtube.com/@talkwithshivah"],
                ["Instagram", "https://www.instagram.com/talkwithshivah"],
                ["Tech mentorship — MentorHub", "https://mentorshub.rajeevshivah.me"],
              ].map(([label, href]) => (
                <a key={label} href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="block text-gray-400 text-xs hover:text-yellow-400 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-display font-bold text-base mb-3 text-gray-300">Contact</div>
            <div className="space-y-2 text-xs text-gray-400">
              <div>📍 Varanasi, India</div>
              <div>🕉️ youtube.com/@talkwithshivah</div>
              <div className="pt-2 text-gray-500">
                Questions before booking? Ask on Instagram — I read everything.
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/7 pt-6 flex flex-wrap justify-between
          items-center gap-3 text-xs text-gray-500">
          <div>© 2026 talkWithShivah · Rajeev Shivah · All rights reserved</div>
          <div>From the ghats of Varanasi 🪔</div>
        </div>
      </div>
    </div>
  );
}

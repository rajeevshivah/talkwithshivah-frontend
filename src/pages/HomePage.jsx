// ============================================================
// HomePage.jsx — talkWithShivah
// A quiet page for a quiet practice. Same skeleton as the
// MentorHub homepage, rewritten for meditation & contemplation.
// ============================================================
import { useState, useEffect } from "react";
import { testimonialAPI, packageAPI } from "../utils/api";
import { FAQS } from "../data/constants";
import PackageCard from "../components/PackageCard";
import Footer from "../components/Footer";
import TestimonialForm from "../components/TestimonialForm";

// ---- What we sit with ----
const EXPERTISE = [
  { icon: "🪷", label: "Breath & Attention", desc: "Simple, honest sitting practice" },
  { icon: "🕉️", label: "Vigyana Bhairava", desc: "112 dharanas, taken one at a time" },
  { icon: "🌊", label: "Kashmir Shaivism", desc: "Recognition, not belief" },
  { icon: "🔥", label: "Advaita Vedanta", desc: "Inquiry into what you are" },
  { icon: "📿", label: "Daily Sadhana", desc: "A practice that fits your life" },
  { icon: "🌙", label: "Stillness at Work", desc: "Practice inside a busy day" },
];

const TRUST_POINTS = [
  { icon: "🧘", value: "8+", label: "Years of Daily Practice" },
  { icon: "📍", value: "Varanasi", label: "Where the Practice Lives" },
  { icon: "📖", value: "Texts", label: "VBT · Upanishads · Tantra" },
  { icon: "🕯️", value: "1-on-1", label: "Unhurried Sessions" },
];

const WHY_POINTS = [
  {
    icon: "🌀",
    title: "The mind will not slow down",
    desc: "You have tried apps, timers, ten-minute routines. The noise returns the moment the timer ends. Technique alone is not the problem.",
  },
  {
    icon: "🧭",
    title: "Too many methods, no direction",
    desc: "Breathwork, mantra, mindfulness, non-duality videos at 2 AM. Everything sounds true and nothing sticks, because nothing was chosen for you.",
  },
  {
    icon: "🪨",
    title: "Practice went dry",
    desc: "You sat regularly once. Then it became mechanical, and stopping felt easier than continuing. Every practitioner passes through this. Few are told what it means.",
  },
  {
    icon: "🌱",
    title: "What actually helps",
    desc: "One practice, chosen for your temperament, held with someone who sits daily. Not more content. A relationship with the practice itself.",
  },
];

export default function HomePage({ onBook }) {
  const [testimonials, setTestimonials] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    packageAPI.getActive("meditation")
      .then((res) => setPackages(res.packages || []))
      .catch(() => setPackages([]));
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialAPI.getApproved("meditation");
      setTestimonials(data.testimonials);
    } catch (err) {
      // fall back silently
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Fallbacks until real ones arrive
  const FALLBACK_TESTIMONIALS = [
    {
      _id: "f1",
      name: "Ananya R.",
      college: "Working professional",
      rating: 5,
      domain: "Beginning Practice",
      text: "I came thinking I needed to learn to concentrate. Rajeev asked me what my mind actually does when I sit, and built the practice around that instead. Three months in, sitting is the easiest part of my day.",
    },
    {
      _id: "f2",
      name: "Vikram S.",
      college: "Practitioner, 2 years",
      rating: 5,
      domain: "Vigyana Bhairava",
      text: "I had read the Vigyana Bhairava twice and understood nothing I could use. One conversation turned three verses into an actual daily practice. That difference is hard to describe until you feel it.",
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <div>

      {/* ============================================================
          HERO
      ============================================================ */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 relative overflow-hidden">
        {/* Signature: breathing glow */}
        <div aria-hidden="true"
          className="breathe-glow pointer-events-none absolute top-8 right-0 md:right-16 w-96 h-96 rounded-full
            bg-gradient-to-br from-yellow-500/25 to-teal-500/10 blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">

          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border
              border-yellow-500/20 rounded-full px-4 py-1.5 text-yellow-400 text-xs
              font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              From Varanasi · One seat, one conversation
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight mb-4">
              The mind quiets<br />
              when it is <span className="bg-gradient-to-r from-yellow-300 to-teal-300
                bg-clip-text text-transparent italic">
                understood
              </span>,<br />
              not when it is fought.
            </h1>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
              I have sat every day for eight years, with the Vigyana Bhairava,
              Kashmir Shaivism, and Advaita Vedanta as companions. In one unhurried
              session we find the practice that fits your mind — and how to stay with it.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => onBook()}
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
                  font-display font-bold text-base px-7 py-3.5 rounded-xl hover:-translate-y-1
                  transition-all hover:shadow-lg hover:shadow-yellow-500/25"
              >
                Book a Sitting
              </button>
              <a
                href="https://www.youtube.com/@talkwithshivah"
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 text-white font-display font-semibold text-base
                  px-7 py-3.5 rounded-xl hover:border-yellow-500/40 hover:text-yellow-300
                  transition-all flex items-center gap-2"
              >
                Listen First
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.youtube.com/@talkwithshivah" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-300 transition-colors">
                <span className="text-base">🕉️</span> talkWithShivah
              </a>
              <span className="text-gray-700">·</span>
              <a href="https://www.instagram.com/talkwithshivah" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-300 transition-colors">
                <span className="text-base">📷</span> Instagram
              </a>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-500">📍 Varanasi, India</span>
            </div>
          </div>

          {/* Right — Photo + credentials */}
          <div className="flex flex-col items-center md:items-end">
            <div className="relative">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden
                border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                <img
                  src="https://i.ibb.co/G4LxCjJB/1757955995866-1.png"
                  alt="Rajeev Shivah"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-yellow-500/20 to-teal-500/20
                        flex items-center justify-center font-display font-bold text-6xl text-yellow-400">
                        ॐ
                      </div>`;
                  }}
                />
              </div>

              <div className="absolute -bottom-3 -right-3 bg-dark-2 border border-white/10
                rounded-xl px-3 py-2 text-xs">
                <div className="font-display font-bold text-base text-white">Rajeev Shivah</div>
                <div className="text-gray-400">8 yrs daily practice · Varanasi</div>
              </div>

              <div className="absolute -top-3 -left-3 bg-teal-500/15 border border-teal-500/30
                rounded-xl px-3 py-2 text-xs flex items-center gap-2">
                <span className="text-teal-300">🪔</span>
                <span className="text-teal-300 font-medium">talkWithShivah</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-8 justify-center md:justify-end max-w-xs">
              {["8+ Years Daily Sitting", "Vigyana Bhairava Tantra",
                "Kashmir Shaivism", "Advaita Vedanta",
                "Practice, not theory"].map((c) => (
                <span key={c} className="bg-white/4 border border-white/7 text-gray-300
                  text-xs px-3 py-1.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          TRUST BAR
      ============================================================ */}
      <div className="border-y border-white/7 bg-white/2">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_POINTS.map(({ icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-display font-bold text-2xl text-yellow-400">{value}</div>
                <div className="text-gray-400 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          WHY I TEACH
      ============================================================ */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-b border-white/7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-flex items-center gap-2 bg-teal-500/10 border
              border-teal-500/20 rounded-full px-3 py-1 text-teal-300 text-xs
              font-medium mb-4">
              Why I Hold These Sessions
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Everyone is told to meditate.<br />
              Almost no one is shown how.
            </h2>
            <blockquote className="border-l-2 border-yellow-500/50 pl-4 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "For years I collected techniques the way people collect books they
                never read. What changed everything was not a new method. It was
                sitting with what was actually happening in my own mind, one honest
                look at a time. That is what I offer — not a course, a companionship
                in practice."
              </p>
              <footer className="mt-3 text-yellow-400 text-xs font-medium">
                — Rajeev Shivah
              </footer>
            </blockquote>
            <button
              onClick={() => onBook()}
              className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
                font-display font-bold text-base px-6 py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Begin, Quietly →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {WHY_POINTS.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 bg-white/3 border border-white/7
                rounded-xl hover:border-white/12 transition-all">
                <div className="text-2xl flex-shrink-0">{icon}</div>
                <div>
                  <div className="font-display font-bold text-base mb-1">{title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          WHAT WE SIT WITH
      ============================================================ */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-b border-white/7">
        <span className="inline-flex items-center gap-2 bg-yellow-500/10 border
          border-yellow-500/20 rounded-full px-3 py-1 text-yellow-400 text-xs
          font-medium mb-4">
          What We Sit With
        </span>
        <h2 className="font-display text-4xl font-semibold mb-2">
          Old texts, living practice
        </h2>
        <p className="text-gray-400 text-sm mb-10 max-w-lg">
          Nothing here is invented. These traditions have carried practitioners
          for over a thousand years. My work is making them usable in your
          actual life, this week.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {EXPERTISE.map(({ icon, label, desc }) => (
            <div key={label} className="bg-white/4 border border-white/7 rounded-2xl p-5
              hover:border-yellow-500/20 hover:-translate-y-1 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center
                justify-center text-xl mb-3 group-hover:bg-yellow-500/20 transition-all">
                {icon}
              </div>
              <div className="font-display font-bold text-base mb-1">{label}</div>
              <div className="text-gray-400 text-xs">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          PACKAGES
      ============================================================ */}
      {packages.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-16 border-b border-white/7">
          <span className="inline-flex items-center gap-2 bg-teal-500/10 border
            border-teal-500/20 rounded-full px-3 py-1 text-teal-300 text-xs
            font-medium mb-4">
            Sessions
          </span>
          <h2 className="font-display text-4xl font-semibold mb-2">
            Choose a way to begin
          </h2>
          <p className="text-gray-400 text-sm mb-10 max-w-lg">
            Every session is one-on-one, on Google Meet, unhurried.
            Pay by UPI after choosing your time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} onBook={onBook} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <div className="max-w-4xl mx-auto px-6 py-10 border-b border-white/7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {[
            ["✓", "Book a time", "Pick a session and a slot that suits you"],
            ["✓", "Pay by UPI", "Confirmed personally, usually within hours"],
            ["✓", "We sit together", "Google Meet link arrives by email"],
          ].map(([check, title, sub]) => (
            <div key={title}>
              <div className="text-teal-300 font-bold text-sm">{check} {title}</div>
              <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          TESTIMONIALS
      ============================================================ */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-b border-white/7">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 bg-yellow-500/10 border
              border-yellow-500/20 rounded-full px-3 py-1 text-yellow-400 text-xs
              font-medium mb-4">
              From Fellow Practitioners
            </span>
            <h2 className="font-display text-4xl font-semibold">
              What sitting together has meant
            </h2>
          </div>

          <button
            onClick={() => setShowTestimonialForm(true)}
            className="flex items-center gap-2 border border-yellow-500/30 text-yellow-400
              px-4 py-2.5 rounded-xl text-sm font-display font-semibold
              hover:bg-yellow-500/10 transition-all"
          >
            Share Your Experience
          </button>
        </div>

        {testimonialsLoading ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayTestimonials.map((t) => (
              <div key={t._id} className="bg-white/4 border border-white/7 rounded-2xl p-6
                hover:border-white/12 transition-all flex flex-col">
                <div className="text-yellow-400 text-sm mb-1">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <div className="text-xs text-teal-300 mb-3 font-medium">{t.domain}</div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-4 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400
                    font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {t.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    {t.college && (
                      <div className="text-gray-400 text-xs">{t.college}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center p-6 bg-white/2 border border-white/7 rounded-2xl">
          <p className="text-gray-400 text-sm mb-3">
            Have we sat together? An honest word helps others decide whether this is for them.
          </p>
          <button
            onClick={() => setShowTestimonialForm(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
              font-display font-bold text-base px-6 py-2.5 rounded-xl hover:opacity-90 transition-all"
          >
            Write a Few Lines
          </button>
        </div>
      </div>

      {/* ============================================================
          FAQ
      ============================================================ */}
      <div className="max-w-2xl mx-auto px-6 py-16 border-b border-white/7">
        <span className="inline-flex items-center gap-2 bg-teal-500/10 border
          border-teal-500/20 rounded-full px-3 py-1 text-teal-300 text-xs
          font-medium mb-4">
          Questions
        </span>
        <h2 className="font-display text-4xl font-semibold mb-8">
          Asked often, answered honestly
        </h2>
        {FAQS.map(({ q, a }, i) => (
          <div key={i} className={`border rounded-xl mb-2 overflow-hidden transition-all
            ${openFaq === i ? "border-yellow-500/25" : "border-white/7"}`}>
            <div
              className="flex justify-between items-center p-5 cursor-pointer select-none"
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <span className="font-medium text-sm pr-4">{q}</span>
              <span className={`text-gray-400 transition-transform flex-shrink-0
                ${openFaq === i ? "rotate-180" : ""}`}>
                ▾
              </span>
            </div>
            {openFaq === i && (
              <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{a}</div>
            )}
          </div>
        ))}
      </div>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center border-b border-white/7">
        <div className="bg-gradient-to-br from-yellow-500/8 to-teal-500/8 border
          border-yellow-500/15 rounded-3xl p-10">
          <div className="text-4xl mb-4">🪷</div>
          <h2 className="font-display text-4xl font-semibold mb-4">
            The seat is already there.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            One conversation to understand your mind, choose a practice,
            and know how to stay with it when it gets difficult. That is
            usually all a beginning needs.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => onBook()}
              className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
                font-display font-bold text-base px-8 py-3.5 rounded-xl hover:-translate-y-1
                transition-all hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Book a Sitting
            </button>
            <a
              href="https://www.youtube.com/@talkwithshivah"
              target="_blank"
              rel="noreferrer"
              className="border border-white/10 text-white font-display font-semibold text-base
                px-8 py-3.5 rounded-xl hover:border-yellow-500/40 hover:text-yellow-300
                transition-all"
            >
              Listen First
            </a>
          </div>
        </div>
      </div>

      <Footer />

      {showTestimonialForm && (
        <TestimonialForm
          onClose={() => {
            setShowTestimonialForm(false);
            fetchTestimonials();
          }}
        />
      )}
    </div>
  );
}

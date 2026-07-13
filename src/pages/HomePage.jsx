// ============================================================
// HomePage.jsx — talkWithShivah
// Centered, spare, slow. A dusk sky, one line, one door in.
// Deliberately half the sections of the tech site.
// ============================================================
import { useState, useEffect } from "react";
import { testimonialAPI, packageAPI } from "../utils/api";
import { FAQS } from "../data/constants";
import PackageCard from "../components/PackageCard";
import Footer from "../components/Footer";
import TestimonialForm from "../components/TestimonialForm";

const TEXTS = ["Vigyana Bhairava Tantra", "Kashmir Shaivism", "Advaita Vedanta", "The Upanishads"];

export default function HomePage({ onBook }) {
  const [testimonials, setTestimonials] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);

  useEffect(() => {
    testimonialAPI.getApproved("meditation")
      .then((d) => setTestimonials(d.testimonials || []))
      .catch(() => {});
    packageAPI.getActive("meditation")
      .then((res) => setPackages(res.packages || []))
      .catch(() => setPackages([]));
  }, []);

  const FALLBACK_TESTIMONIALS = [
    {
      _id: "f1",
      name: "Ananya R.",
      college: "Working professional",
      rating: 5,
      domain: "Beginning Practice",
      text: "I came thinking I needed to learn to concentrate. Rajeev asked what my mind actually does when I sit, and built the practice around that instead. Three months in, sitting is the easiest part of my day.",
    },
    {
      _id: "f2",
      name: "Vikram S.",
      college: "Practitioner, 2 years",
      rating: 5,
      domain: "Vigyana Bhairava",
      text: "I had read the Vigyana Bhairava twice and understood nothing I could use. One conversation turned three verses into an actual daily practice.",
    },
  ];
  const displayTestimonials = (testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS).slice(0, 3);

  return (
    <div>

      {/* ============================================================
          HERO — centered, one line, one door
      ============================================================ */}
      <div className="relative overflow-hidden">
        <div aria-hidden="true"
          className="breathe-glow pointer-events-none absolute left-1/2 -translate-x-1/2 top-10
            w-[34rem] h-[34rem] rounded-full bg-gradient-to-b from-yellow-500/20 to-teal-500/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-24 text-center">
          <p className="text-teal-300 text-sm tracking-[0.25em] uppercase mb-8">
            From Varanasi
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.1] mb-8">
            The mind quiets when it is
            <span className="italic text-yellow-300"> understood</span>,
            <br className="hidden md:block" /> not when it is fought.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            One-on-one meditation sessions with Rajeev Shivah —
            eight years of daily practice, old texts held lightly,
            and a practice chosen for the mind you actually have.
          </p>
          <button
            onClick={() => onBook()}
            className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
              font-display font-bold text-lg px-10 py-4 rounded-xl hover:-translate-y-1
              transition-all hover:shadow-lg hover:shadow-yellow-500/25"
          >
            Book a Session
          </button>
          <p className="text-gray-500 text-xs mt-6">
            45 to 75 minutes · Google Meet · pay by UPI
          </p>
        </div>
      </div>

      {/* ============================================================
          HOW A SESSION WORKS — one quiet line
      ============================================================ */}
      <div className="border-y border-white/10 bg-white/3">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              ["॰", "Choose a session", "Four ways in, depending on where you are"],
              ["॰॰", "Pick a time", "Evenings and weekends, IST"],
              ["॰॰॰", "We sit together", "The Meet link arrives by email after UPI confirmation"],
            ].map(([mark, title, sub]) => (
              <div key={title}>
                <div className="text-yellow-300 font-display text-xl mb-2">{mark}</div>
                <div className="font-display font-bold text-lg">{title}</div>
                <div className="text-gray-400 text-sm mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          SESSIONS
      ============================================================ */}
      {packages.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-3">
            Four ways to begin
          </h2>
          <p className="text-gray-400 text-sm text-center mb-14 max-w-md mx-auto">
            Whether you have never sat, or have sat for years and gone dry —
            one of these will fit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} onBook={onBook} />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          ABOUT — photo lives here, not the hero
      ============================================================ */}
      <div className="border-y border-white/10 bg-white/3">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-10 items-center">
            {/* Placeholder graphic — replace with your own photo later */}
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-full mx-auto md:mx-0
              bg-gradient-to-br from-yellow-500/25 to-teal-500/15 border border-yellow-500/20
              flex items-center justify-center font-display text-7xl text-yellow-300 select-none">
              ॐ
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-display text-4xl font-semibold mb-4">Rajeev Shivah</h2>
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                I have sat every day for eight years, in Varanasi, where the practice
                is not an idea but the air. For years I collected techniques the way
                people collect books they never read. What changed everything was not
                a new method — it was one honest look at what my mind was actually doing.
                That look is what I offer. Not a course. A companionship in practice.
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start text-sm text-teal-300">
                {TEXTS.map((t, i) => (
                  <span key={t}>
                    {t}{i < TEXTS.length - 1 && <span className="text-gray-600 ml-3">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          A FEW WORDS FROM PRACTITIONERS
      ============================================================ */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-display text-4xl font-semibold text-center mb-14">
          A few words from practitioners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayTestimonials.map((t) => (
            <div key={t._id} className="bg-white/4 border border-white/10 rounded-2xl p-7">
              <p className="text-gray-200 text-base leading-relaxed mb-5 font-display italic">
                "{t.text}"
              </p>
              <div className="text-sm">
                <span className="font-semibold text-yellow-300">{t.name}</span>
                {t.college && <span className="text-gray-400"> · {t.college}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => setShowTestimonialForm(true)}
            className="text-yellow-300 text-sm border-b border-yellow-500/40 pb-0.5
              hover:border-yellow-300 transition-colors"
          >
            Have we sat together? Share a few words
          </button>
        </div>
      </div>

      {/* ============================================================
          QUESTIONS
      ============================================================ */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <h2 className="font-display text-4xl font-semibold text-center mb-10">
          Questions
        </h2>
        {FAQS.map(({ q, a }, i) => (
          <div key={i} className={`border rounded-xl mb-2 overflow-hidden transition-all
            ${openFaq === i ? "border-yellow-500/30" : "border-white/10"}`}>
            <div
              className="flex justify-between items-center p-5 cursor-pointer select-none"
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <span className="font-medium text-sm pr-4">{q}</span>
              <span className={`text-gray-400 transition-transform flex-shrink-0
                ${openFaq === i ? "rotate-180" : ""}`}>▾</span>
            </div>
            {openFaq === i && (
              <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{a}</div>
            )}
          </div>
        ))}
      </div>

      {/* ============================================================
          FINAL LINE
      ============================================================ */}
      <div className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8">
          The seat is already there.
        </h2>
        <button
          onClick={() => onBook()}
          className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black
            font-display font-bold text-lg px-10 py-4 rounded-xl hover:-translate-y-1
            transition-all hover:shadow-lg hover:shadow-yellow-500/20"
        >
          Book a Session
        </button>
      </div>

      <Footer />

      {showTestimonialForm && (
        <TestimonialForm onClose={() => setShowTestimonialForm(false)} />
      )}
    </div>
  );
}

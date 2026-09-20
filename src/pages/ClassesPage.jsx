// ============================================================
// ClassesPage — /classes
// ============================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { classesAPI } from "../utils/classesApi";
import ClassCard from "../components/ClassCard";
import Footer from "../components/Footer";

export default function ClassesPage() {
  const [classes, setClasses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    classesAPI.list().then(setClasses).catch((e) => { setError(e.message); setClasses([]); });
  }, []);

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 min-h-[70vh]">
        <h1 className="font-display text-5xl md:text-6xl font-semibold mb-4">Group classes</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-xl">
          Live on Google Meet, a few people at a time. Register here, and the joining
          details reach you on WhatsApp.
        </p>

        {classes === null && <p className="text-gray-400 text-sm">Loading classes…</p>}

        {error && <p className="text-red-300 text-sm mb-6">{error}</p>}

        {classes?.length === 0 && !error && (
          <div className="border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-300">No classes are scheduled right now.</p>
            <p className="text-gray-400 text-sm mt-2">
              New classes are announced on Instagram. Until then, a one-on-one session is always open.
            </p>
            <Link to="/booking"
              className="inline-block mt-6 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-display font-bold px-7 py-3 rounded-xl">
              Book a session
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {classes?.map((c) => <ClassCard key={c._id} cls={c} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}

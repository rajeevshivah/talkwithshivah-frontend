// ============================================================
// ClassesSection — homepage block. Renders nothing at all when
// there are no upcoming classes, so the page never shows an
// empty "coming soon" shelf.
// ============================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { classesAPI } from "../utils/classesApi";
import ClassCard from "../components/ClassCard";

export default function ClassesSection() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    classesAPI.list().then(setClasses).catch(() => setClasses([]));
  }, []);

  if (classes.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20">
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-center mb-3">
        Sit with a group
      </h2>
      <p className="text-gray-400 text-sm text-center mb-12 max-w-md mx-auto">
        Live classes on Google Meet, a few people at a time.
      </p>
      <div className="space-y-4">
        {classes.slice(0, 3).map((c) => <ClassCard key={c._id} cls={c} />)}
      </div>
      {classes.length > 3 && (
        <div className="text-center mt-8">
          <Link to="/classes" className="text-yellow-300 text-sm border-b border-yellow-500/40 pb-0.5 hover:border-yellow-300">
            See all {classes.length} classes
          </Link>
        </div>
      )}
    </div>
  );
}

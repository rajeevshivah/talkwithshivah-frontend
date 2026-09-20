// ============================================================
// ClassCard — one upcoming class. The date sits on the left as
// a large serif numeral, like a date carved into a ghat step.
// ============================================================
import { Link } from "react-router-dom";
import { fmtDay, fmtMonth, fmtWeekday, fmtTime, rupees, sessionsLabel, seatsLine } from "../utils/classFormat";

export default function ClassCard({ cls }) {
  const seats = seatsLine(cls);
  const full = cls.closedReason === "full";

  return (
    <Link to={`/class/${cls.slug}`}
      className="group flex gap-5 md:gap-7 items-stretch bg-white/4 border border-white/10 rounded-2xl p-5 md:p-6
        hover:border-yellow-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
      <div className="flex flex-col items-center justify-center w-16 md:w-20 flex-shrink-0 border-r border-white/10 pr-5 md:pr-7">
        <div className="font-display text-5xl md:text-6xl font-semibold leading-none text-yellow-300">{fmtDay(cls.startsAt)}</div>
        <div className="text-gray-400 text-sm mt-1">{fmtMonth(cls.startsAt)}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display text-2xl md:text-[1.7rem] font-semibold leading-tight group-hover:text-yellow-300 transition-colors">
          {cls.title}
        </h3>
        <p className="text-gray-400 text-sm mt-2">
          {fmtWeekday(cls.startsAt)}, {fmtTime(cls.startsAt)} IST
          <span className="text-gray-600"> · </span>
          {sessionsLabel(cls.sessions)}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-3 text-sm">
          <span className="text-teal-300 font-semibold">
            {cls.isPaid ? rupees(cls.price) : "Free"}
            {cls.isPaid && cls.mrp > cls.price && (
              <span className="text-gray-500 line-through font-normal ml-2">{rupees(cls.mrp)}</span>
            )}
          </span>
          {seats && <span className={full ? "text-red-300" : "text-gray-300"}>{seats}</span>}
        </div>
      </div>
    </Link>
  );
}

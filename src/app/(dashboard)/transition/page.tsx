export default function TransitionPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Input card */}
      <div className="bg-space-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold mb-1">What If Simulator</h2>
        <p className="text-[13px] text-text-secondary mb-5">
          Simulate a pivot and see what happened to real alumni who made the same
          move.
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px]">
              Currently In
            </label>
            <input
              className="px-3.5 py-2.5 rounded-lg bg-white/4 border border-border text-sm outline-none focus:border-indigo min-w-[200px]"
              value="Economics"
              readOnly
            />
          </div>
          <div className="text-xl text-indigo-bright font-bold pb-2.5">
            &rarr;
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px]">
              Switch To
            </label>
            <input
              className="px-3.5 py-2.5 rounded-lg bg-white/4 border border-border text-sm outline-none focus:border-indigo min-w-[200px]"
              value="Public Health"
              readOnly
            />
          </div>
          <button className="px-6 py-2.5 rounded-lg bg-indigo text-white text-sm font-semibold hover:bg-indigo-bright transition-colors">
            Simulate
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-indigo/15 border border-indigo/30 rounded-[10px] px-[18px] py-3.5 text-sm flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path d="M17 3l4 4-4 4" />
            <path d="M3 11h18" />
          </svg>
        </div>
        <div>
          <strong>12 alumni</strong> switched from Economics to Public Health.
          Most pivoted between <strong>sophomore and junior year</strong>. Top
          outcome: Health Policy (5 alumni).
        </div>
      </div>

      {/* Transition cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5">
        {[
          {
            top: true,
            badge: "Closest Match",
            classYear: "Class of 2021",
            match: "92%",
            major: "Economics \u2192 Public Health",
            outcome: "Health Policy Researcher @ WHO",
            prePivot: "Pre-pivot (4 semesters): Econ 101, Stats, Micro, Macro, Econometrics",
            timeline: [
              { semester: "Junior Fall \u2014 PIVOT", pivot: true, courses: [{ name: "Intro Public Health", tag: "new" }, { name: "Epidemiology", tag: "new" }, { name: "Adv. Econometrics", tag: "dropped" }] },
              { semester: "Junior Spring", pivot: false, courses: [{ name: "Health Policy", tag: "new" }, { name: "Biostatistics", tag: "new" }, { name: "Stats II", tag: null }] },
              { semester: "Senior Year", pivot: false, courses: [{ name: "Community Health", tag: null }, { name: "Global Health Seminar", tag: null }, { name: "Capstone: Health Equity", tag: null }] },
            ],
          },
          {
            top: false,
            classYear: "Class of 2022",
            match: "88%",
            major: "Economics \u2192 Public Health",
            outcome: "Epidemiologist @ CDC",
            prePivot: "Pre-pivot (3 semesters): Econ 101, Micro, Stats, Calc II",
            timeline: [
              { semester: "Sophomore Spring \u2014 PIVOT", pivot: true, courses: [{ name: "Public Health 101", tag: "new" }, { name: "Biology for PH", tag: "new" }, { name: "Macro II", tag: "dropped" }] },
              { semester: "Junior Fall", pivot: false, courses: [{ name: "Epidemiology", tag: "new" }, { name: "Biostatistics", tag: "new" }, { name: "Applied Stats", tag: null }] },
              { semester: "Senior Year", pivot: false, courses: [{ name: "Infectious Disease", tag: null }, { name: "Research Methods", tag: null }, { name: "CDC Internship", tag: null }] },
            ],
          },
        ].map((card, ci) => (
          <div
            key={ci}
            className={`bg-space-card border rounded-xl overflow-hidden transition-colors hover:border-border-hover ${
              card.top ? "border-indigo/30" : "border-border"
            }`}
          >
            {card.badge && (
              <div className="text-[11px] font-bold px-4 py-1.5 bg-indigo/15 text-indigo-bright inline-block">
                {card.badge}
              </div>
            )}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-text-secondary font-medium">
                  {card.classYear}
                </span>
                <span className="text-[13px] font-bold text-indigo-bright">
                  {card.match} match
                </span>
              </div>
              <div className="text-[15px] font-bold">{card.major}</div>
              <div className="text-[13px] text-text-secondary mt-1">
                {card.outcome}
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs text-text-tertiary bg-white/[0.03] px-3 py-2 rounded-md mb-3">
                {card.prePivot}
              </div>
              {card.timeline.map((tl, ti) => (
                <div key={ti} className="flex gap-3.5 pb-4 last:pb-0">
                  <div className="flex flex-col items-center shrink-0 w-4">
                    <div
                      className={
                        tl.pivot
                          ? "w-2.5 h-2.5 rounded-sm rotate-45 bg-indigo border-2 border-indigo-bright shrink-0 z-[1]"
                          : "w-2 h-2 rounded-full bg-white/20 border-2 border-white/50 shrink-0 z-[1]"
                      }
                    />
                    {ti < card.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold mb-1.5 ${
                        tl.pivot ? "text-indigo-bright" : "text-text-secondary"
                      }`}
                    >
                      {tl.semester}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tl.courses.map((c) => (
                        <span
                          key={c.name}
                          className={`text-[11px] px-2 py-[3px] rounded ${
                            c.tag === "new"
                              ? "bg-indigo/15 text-indigo-bright"
                              : c.tag === "dropped"
                                ? "bg-white/5 text-text-secondary line-through opacity-40"
                                : "bg-white/5 text-text-secondary"
                          }`}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

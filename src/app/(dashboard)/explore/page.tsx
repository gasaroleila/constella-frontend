export default function ExplorePage() {
  return (
    <div className="flex h-[calc(100vh-56px)] -m-7">
      {/* Filter sidebar */}
      <div className="w-[300px] shrink-0 border-r border-border flex flex-col overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-bold mb-1">Explore Paths</h2>
          <p className="text-xs text-text-secondary">
            Discover alumni who started where you are
          </p>
          {/* Mode toggle */}
          <div className="flex mt-4 bg-white/4 border border-border rounded-lg p-[3px]">
            <button className="flex-1 py-[7px] rounded-md text-xs font-semibold text-center bg-indigo text-white">
              Open
            </button>
            <button className="flex-1 py-[7px] rounded-md text-xs font-semibold text-center text-text-secondary">
              Focused
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-[18px]">
          {/* Year */}
          <div>
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
              Your Year
            </div>
            <input
              className="w-full px-3 py-[9px] rounded-lg bg-white/4 border border-border text-[13px] outline-none focus:border-indigo"
              value="Sophomore"
              readOnly
            />
          </div>
          {/* Interests */}
          <div>
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
              Interests
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Biology", "Public Health", "Psychology", "Data Science", "Economics"].map(
                (tag, i) => (
                  <button
                    key={tag}
                    className={`text-xs px-2.5 py-[5px] rounded-md border transition-all ${
                      i < 2
                        ? "bg-indigo/15 border-indigo/30 text-indigo-bright"
                        : "bg-white/4 border-border text-text-secondary hover:border-border-hover"
                    }`}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
          {/* Career area */}
          <div>
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
              Career Area
            </div>
            <input
              className="w-full px-3 py-[9px] rounded-lg bg-white/4 border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
              placeholder="Any career area"
            />
          </div>
          {/* Major filter */}
          <div>
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
              Major Filter
            </div>
            <input
              className="w-full px-3 py-[9px] rounded-lg bg-white/4 border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
              placeholder="Any major"
            />
          </div>
        </div>

        <button className="mx-5 mb-5 py-2.5 rounded-lg bg-indigo text-white text-sm font-semibold hover:bg-indigo-bright transition-colors">
          Explore Constellation
        </button>
      </div>

      {/* Constellation canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-sm">
          Constellation map will render here
        </div>
        {/* Legend */}
        <div className="absolute bottom-5 left-5 bg-space/85 backdrop-blur-xl border border-border rounded-[10px] p-[14px_18px] text-xs">
          <div className="font-bold text-text-secondary text-[11px] uppercase tracking-[1px] mb-2">
            Clusters
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { color: "#5B60E8", label: "You" },
              { color: "#34D399", label: "Health Policy (12)" },
              { color: "#FBBF24", label: "UX Research (8)" },
              { color: "#FB7185", label: "Data Science (11)" },
              { color: "#A78BFA", label: "Biotech (6)" },
              { color: "#67E8F9", label: "Education (9)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-text-secondary"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni detail panel */}
      <div className="w-[340px] shrink-0 border-l border-border bg-space-raised overflow-y-auto">
        <div className="p-5 border-b border-border">
          <button className="text-xs text-text-tertiary hover:text-text-secondary mb-3 flex items-center gap-1">
            &larr; Back to constellation
          </button>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-indigo/15 text-indigo-bright">
              94% Match
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-white/5 text-text-secondary">
              Class of 2022
            </span>
          </div>
          <div className="text-[15px] font-bold mb-1">
            Biochemistry + Public Health
          </div>
          <div className="text-[13px] text-text-secondary">
            Health Policy Analyst @ State Health Dept
          </div>
        </div>

        {/* Timeline */}
        <div className="p-5">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-4">
            Academic Journey
          </div>
          {[
            { semester: "Freshman Fall", courses: ["Bio 101", "Chem 101", "Intro Psych"], pivot: false },
            { semester: "Freshman Spring", courses: ["Chem 102", "Physics I", "Sociology 101"], pivot: false },
            { semester: "Sophomore Fall", courses: ["Organic Chem", { name: "Intro Public Health", tag: "new" }], pivot: false },
            { semester: "Sophomore Spring \u2014 PIVOT", courses: [{ name: "Health Policy", tag: "new" }, { name: "Epidemiology", tag: "new" }, { name: "Physics II", tag: "dropped" }], pivot: true },
            { semester: "Junior Fall", courses: ["Biostatistics", "Community Health"], pivot: false },
            { semester: "Senior Year", courses: ["Capstone", "Internship: State Health Dept"], pivot: false },
          ].map((item, i, arr) => (
            <div key={i} className="flex gap-3.5 pb-4 last:pb-0">
              <div className="flex flex-col items-center shrink-0 w-4">
                <div
                  className={
                    item.pivot
                      ? "w-2.5 h-2.5 rounded-sm rotate-45 bg-indigo border-2 border-indigo-bright shrink-0 z-[1]"
                      : "w-2 h-2 rounded-full bg-white/20 border-2 border-white/50 shrink-0 z-[1]"
                  }
                />
                {i < arr.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div>
                <div
                  className={`text-xs font-semibold mb-1.5 ${
                    item.pivot ? "text-indigo-bright" : "text-text-secondary"
                  }`}
                >
                  {item.semester}
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.courses.map((course) => {
                    const name = typeof course === "string" ? course : course.name;
                    const tag = typeof course === "string" ? null : course.tag;
                    return (
                      <span
                        key={name}
                        className={`text-[11px] px-2 py-[3px] rounded ${
                          tag === "new"
                            ? "bg-indigo/15 text-indigo-bright"
                            : tag === "dropped"
                              ? "bg-white/5 text-text-secondary line-through opacity-40"
                              : "bg-white/5 text-text-secondary"
                        }`}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activities */}
        <div className="px-5 py-4 border-t border-border">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2.5">
            Activities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Global Health Club", "Public Health Internship", "Research Assistant"].map(
              (act) => (
                <span
                  key={act}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white/4 text-text-secondary border border-border"
                >
                  {act}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Constellation } from "@/components/constellation/constellation";
import { CLUSTER_COLORS, mockConstellationData } from "@/lib/mock-data";
import { explore } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import type { AlumniRecord, ConstellationData } from "@/lib/types";

const INTEREST_SUGGESTIONS = [
  "Biology", "Public Health", "Psychology", "Data Science", "Economics",
  "Computer Science", "Chemistry", "Mathematics", "Business", "Education",
  "Sociology", "Political Science", "Health Policy", "Neuroscience", "Design",
];

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior"];

const MAJOR_OPTIONS = [
  "", "Accounting", "Biochemistry", "Biology", "Business", "Chemistry",
  "Cognitive Science", "CS", "Design", "Economics", "Education", "English",
  "Finance", "HCI", "Health Policy", "Math", "Molecular Biology",
  "Psychology", "Public Health", "Statistics",
];

export default function ExplorePage() {
  const token = useAuthStore((s) => s.token);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);

  // Filter state
  const [mode, setMode] = useState<"open" | "focused">("open");
  const [year, setYear] = useState("Sophomore");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set(["Economics"]),
  );
  const [interestQuery, setInterestQuery] = useState("");
  const [interestDropdownOpen, setInterestDropdownOpen] = useState(false);
  const [majorFilter, setMajorFilter] = useState("");
  const [careerArea, setCareerArea] = useState("");

  // Saved paths
  const [savedPaths, setSavedPaths] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem("constella-saved-paths");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // API state
  const [constellationData, setConstellationData] = useState<ConstellationData>({
    clusters: [], totalAlumni: 0, summary: "",
  });
  const [loading, setLoading] = useState(true);

  // Debounced fetch from backend
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fetchConstellation = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await explore(token, {
        interests: [...selectedInterests],
        careerArea,
        major: majorFilter,
      });
      setConstellationData(data.clusters.length > 0 ? data : mockConstellationData);
    } catch {
      setConstellationData(mockConstellationData);
    } finally {
      setLoading(false);
    }
  }, [token, selectedInterests, careerArea, majorFilter]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchConstellation, 300);
    return () => clearTimeout(timerRef.current);
  }, [fetchConstellation]);

  const legendItems = constellationData.clusters.map((c) => ({
    color: CLUSTER_COLORS[c.label] || "#888",
    label: `${c.label} (${c.alumni.length})`,
  }));

  // Interest input helpers
  const filteredSuggestions = INTEREST_SUGGESTIONS.filter(
    (s) => !selectedInterests.has(s) && s.toLowerCase().includes(interestQuery.toLowerCase()),
  );

  const addInterest = (interest: string) => {
    setSelectedInterests((prev) => new Set(prev).add(interest));
    setInterestQuery("");
    setInterestDropdownOpen(false);
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      next.delete(interest);
      return next;
    });
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && interestQuery.trim()) {
      e.preventDefault();
      addInterest(filteredSuggestions[0] || interestQuery.trim());
    } else if (e.key === "Backspace" && !interestQuery && selectedInterests.size > 0) {
      const last = [...selectedInterests].pop()!;
      removeInterest(last);
    }
  };

  const toggleSave = (id: string) => {
    setSavedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("constella-saved-paths", JSON.stringify([...next]));
      return next;
    });
  };

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
          <div className="flex mt-4 bg-surface border border-border rounded-lg p-[3px]">
            <button
              onClick={() => setMode("open")}
              className={`flex-1 py-[7px] rounded-md text-xs font-semibold text-center transition-colors ${
                mode === "open"
                  ? "bg-indigo text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setMode("focused")}
              className={`flex-1 py-[7px] rounded-md text-xs font-semibold text-center transition-colors ${
                mode === "focused"
                  ? "bg-indigo text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Focused
            </button>
          </div>
        </div>

        {mode === "focused" ? (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-[18px]">
            <div>
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
                Career Area
              </div>
              <input
                className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
                placeholder="e.g. Health Policy"
                value={careerArea}
                onChange={(e) => setCareerArea(e.target.value)}
              />
              <p className="text-[11px] text-text-tertiary mt-2">
                Enter a career area to focus the constellation on matching clusters.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-[18px]">
            {/* Year */}
            <div>
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
                Your Year
              </div>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo appearance-none cursor-pointer"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
                Interests
              </div>
              {/* Selected pills */}
              {selectedInterests.size > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[...selectedInterests].map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-[3px] rounded-md bg-indigo/15 border border-indigo/30 text-indigo-bright flex items-center gap-1"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="hover:text-white transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* Input + dropdown */}
              <div className="relative">
                <input
                  className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
                  placeholder="Type an interest..."
                  value={interestQuery}
                  onChange={(e) => { setInterestQuery(e.target.value); setInterestDropdownOpen(true); }}
                  onFocus={() => setInterestDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setInterestDropdownOpen(false), 150)}
                  onKeyDown={handleInterestKeyDown}
                />
                {interestDropdownOpen && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-space-card border border-border rounded-lg shadow-lg z-10 max-h-[160px] overflow-y-auto">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addInterest(s)}
                        className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Major filter */}
            <div>
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
                Major Filter
              </div>
              <div className="relative">
                <select
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                  className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo appearance-none cursor-pointer"
                >
                  <option value="">Any major</option>
                  {MAJOR_OPTIONS.filter(Boolean).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Career area */}
            <div>
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
                Career Area{" "}
                <span className="font-normal normal-case tracking-normal">(optional)</span>
              </div>
              <input
                className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
                placeholder="Any career area"
                value={careerArea}
                onChange={(e) => setCareerArea(e.target.value)}
              />
            </div>
          </div>
        )}

      </div>

      {/* Constellation canvas */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-space/60">
            <div className="text-sm text-text-secondary">Loading constellation...</div>
          </div>
        )}
        <Constellation
          data={constellationData}
          onSelectAlumni={setSelectedAlumni}
          selectedAlumniId={selectedAlumni?.id}
        />
        {/* Legend */}
        <div className="absolute bottom-5 left-5 bg-space/85 backdrop-blur-xl border border-border rounded-[10px] p-[14px_18px] text-xs">
          <div className="font-bold text-text-secondary text-[11px] uppercase tracking-[1px] mb-2">
            Clusters
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#5B60E8" }} />
              You
            </div>
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-text-secondary">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni detail panel */}
      {selectedAlumni && (
        <div className="w-[340px] shrink-0 border-l border-border bg-space-raised overflow-y-auto">
          <div className="p-5 border-b border-border">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="text-xs text-text-tertiary hover:text-text-secondary mb-3 flex items-center gap-1"
            >
              &larr; Back to constellation
            </button>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-indigo/15 text-indigo-bright">
                {selectedAlumni.similarityScore}% Match
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-surface text-text-secondary">
                Class of {selectedAlumni.graduationYear}
              </span>
            </div>
            <div className="text-[15px] font-bold mb-1">
              {selectedAlumni.majors.join(" + ")}
            </div>
            <div className="text-[13px] text-text-secondary">
              {selectedAlumni.careerOutcome.title}{selectedAlumni.careerOutcome.org ? ` @ ${selectedAlumni.careerOutcome.org}` : ""}
            </div>

            {/* Save/Unsave button */}
            <button
              onClick={() => toggleSave(selectedAlumni.id)}
              className={`mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                savedPaths.has(selectedAlumni.id)
                  ? "bg-indigo/15 text-indigo-bright border border-indigo/30"
                  : "bg-surface border border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill={savedPaths.has(selectedAlumni.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-3.5 h-3.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {savedPaths.has(selectedAlumni.id) ? "Saved" : "Save Path"}
            </button>
          </div>

          {/* Timeline */}
          <div className="p-5">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-4">
              Academic Journey
            </div>
            {buildTimeline(selectedAlumni).map((item, i, arr) => (
              <div key={i} className="flex gap-3.5 pb-4 last:pb-0">
                <div className="flex flex-col items-center shrink-0 w-4">
                  <div
                    className={
                      item.pivot
                        ? "w-2.5 h-2.5 rounded-sm rotate-45 bg-indigo border-2 border-indigo-bright shrink-0 z-[1]"
                        : "w-2 h-2 rounded-full bg-dot border-2 border-dot-border shrink-0 z-[1]"
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
                    {item.courses.map((course) => (
                      <span
                        key={course.name}
                        className={`text-[11px] px-2 py-[3px] rounded ${
                          course.tag === "new"
                            ? "bg-indigo/15 text-indigo-bright"
                            : course.tag === "dropped"
                              ? "bg-surface text-text-secondary line-through opacity-40"
                              : "bg-surface text-text-secondary"
                        }`}
                      >
                        {course.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interests */}
          {selectedAlumni.interests.length > 0 && (
            <div className="px-5 py-4 border-t border-border">
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2.5">
                Interests
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedAlumni.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-surface text-text-secondary border border-border"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function semesterOrder(label: string): number {
  const parts = label.toLowerCase();
  const years: Record<string, number> = { freshman: 0, sophomore: 1, junior: 2, senior: 3 };
  const terms: Record<string, number> = { fall: 0, spring: 1, summer: 2 };
  let order = 0;
  for (const [k, v] of Object.entries(years)) { if (parts.includes(k)) { order += v * 10; break; } }
  for (const [k, v] of Object.entries(terms)) { if (parts.includes(k)) { order += v; break; } }
  return order;
}

function buildTimeline(alumni: AlumniRecord) {
  const semesters = Object.entries(alumni.coursesBySemester || {}).sort(
    ([a], [b]) => semesterOrder(a) - semesterOrder(b),
  );
  const pivotSemesters = new Set((alumni.pivotPoints || []).map((p) => p.semester));

  return semesters.map(([semester, courses]) => ({
    semester: pivotSemesters.has(semester) ? `${semester} — PIVOT` : semester,
    pivot: pivotSemesters.has(semester),
    courses: courses.map((c) => ({
      name: c.name,
      tag: c.status === "kept" ? null : (c.status as "new" | "dropped" | null),
    })),
  }));
}

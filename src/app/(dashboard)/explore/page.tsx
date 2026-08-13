"use client";

import { useState } from "react";
import { Constellation } from "@/components/constellation/constellation";
import { mockConstellationData, CLUSTER_COLORS } from "@/lib/mock-data";
import type { AlumniRecord } from "@/lib/types";

export default function ExplorePage() {
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);

  const legendItems = mockConstellationData.clusters.map((c) => ({
    color: CLUSTER_COLORS[c.label] || "#888",
    label: `${c.label} (${c.alumni.length})`,
  }));

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
              className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo"
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
                        : "bg-surface border-border text-text-secondary hover:border-border-hover"
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
              className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
              placeholder="Any career area"
            />
          </div>
          {/* Major filter */}
          <div>
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-2">
              Major Filter
            </div>
            <input
              className="w-full px-3 py-[9px] rounded-lg bg-surface border border-border text-[13px] outline-none focus:border-indigo placeholder:text-text-tertiary"
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
        <Constellation
          data={mockConstellationData}
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
              {selectedAlumni.careerOutcome.title} @ {selectedAlumni.careerOutcome.industry}
            </div>
          </div>

          {/* Timeline placeholder — real data comes from backend */}
          <div className="p-5">
            <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1.5px] mb-4">
              Academic Journey
            </div>
            {[
              { semester: "Freshman Fall", courses: ["Intro Course A", "Intro Course B", "Gen Ed"], pivot: false },
              { semester: "Sophomore Fall", courses: [{ name: "Exploratory Course", tag: "new" as const }], pivot: false },
              ...(selectedAlumni.pivotPoints?.length
                ? [{
                    semester: `${selectedAlumni.pivotPoints[0].semester} — PIVOT`,
                    courses: [
                      { name: selectedAlumni.pivotPoints[0].toMajor + " Intro", tag: "new" as const },
                      { name: selectedAlumni.pivotPoints[0].fromMajor + " Adv.", tag: "dropped" as const },
                    ],
                    pivot: true,
                  }]
                : []),
              { semester: "Senior Year", courses: ["Capstone", "Internship"], pivot: false },
            ].map((item, i, arr) => (
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
                                ? "bg-surface text-text-secondary line-through opacity-40"
                                : "bg-surface text-text-secondary"
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
              {["Research Club", "Internship Program", "Study Abroad"].map(
                (act) => (
                  <span
                    key={act}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-surface text-text-secondary border border-border"
                  >
                    {act}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

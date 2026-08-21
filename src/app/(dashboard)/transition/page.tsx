"use client";

import { useState } from "react";
import { simulate } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import type { TransitionSimulation } from "@/lib/types";

export default function TransitionPage() {
  const token = useAuthStore((s) => s.token);
  const [fromMajor, setFromMajor] = useState("");
  const [toMajor, setToMajor] = useState("");
  const [simulation, setSimulation] = useState<TransitionSimulation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulate = async () => {
    if (!fromMajor.trim() || !toMajor.trim() || !token) return;
    setLoading(true);
    setError("");
    try {
      const data = await simulate(token, { fromMajor: fromMajor.trim(), toMajor: toMajor.trim() });
      setSimulation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

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
              className="px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm outline-none focus:border-indigo min-w-[200px]"
              value={fromMajor}
              onChange={(e) => setFromMajor(e.target.value)}
              placeholder="e.g. Economics"
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
              className="px-3.5 py-2.5 rounded-lg bg-surface border border-border text-sm outline-none focus:border-indigo min-w-[200px]"
              value={toMajor}
              onChange={(e) => setToMajor(e.target.value)}
              placeholder="e.g. Public Health"
            />
          </div>
          <button
            onClick={handleSimulate}
            disabled={!fromMajor.trim() || !toMajor.trim() || loading}
            className="px-6 py-2.5 rounded-lg bg-indigo text-white text-sm font-semibold hover:bg-indigo-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo"
          >
            {loading ? "Simulating..." : "Simulate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-space-card border border-border rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Summary bar */}
      {simulation && simulation.cards.length > 0 && (
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
            <strong>{simulation.totalTransitions} alumni</strong> switched from{" "}
            {simulation.cards[0].fromMajor} to {simulation.cards[0].toMajor}.
            Most pivoted between <strong>{simulation.peakTiming}</strong>. Top
            outcome: {simulation.topOutcome} ({simulation.topOutcomeCount} alumni).
          </div>
        </div>
      )}

      {/* Transition cards */}
      {simulation && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5">
          {simulation.cards.map((card, ci) => (
            <div
              key={ci}
              className={`bg-space-card border rounded-xl overflow-hidden transition-colors hover:border-border-hover ${
                card.isTopMatch ? "border-indigo/30" : "border-border"
              }`}
            >
              {card.isTopMatch && (
                <div className="text-[11px] font-bold px-4 py-1.5 bg-indigo/15 text-indigo-bright inline-block">
                  Closest Match
                </div>
              )}
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-text-secondary font-medium">
                    Class of {card.classYear}
                  </span>
                  <span className="text-[13px] font-bold text-indigo-bright">
                    {card.matchPercent}% match
                  </span>
                </div>
                <div className="text-[15px] font-bold">
                  {card.fromMajor} &rarr; {card.toMajor}
                </div>
                <div className="text-[13px] text-text-secondary mt-1">
                  {card.outcome}
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="text-xs text-text-tertiary bg-surface px-3 py-2 rounded-md mb-3">
                  {card.prePivotSummary}
                </div>
                {card.timeline.map((tl, ti) => (
                  <div key={ti} className="flex gap-3.5 pb-4 last:pb-0">
                    <div className="flex flex-col items-center shrink-0 w-4">
                      <div
                        className={
                          tl.pivot
                            ? "w-2.5 h-2.5 rounded-sm rotate-45 bg-indigo border-2 border-indigo-bright shrink-0 z-[1]"
                            : "w-2 h-2 rounded-full bg-dot border-2 border-dot-border shrink-0 z-[1]"
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
                                  ? "bg-surface text-text-secondary line-through opacity-40"
                                  : "bg-surface text-text-secondary"
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
      )}

      {/* Empty state */}
      {!simulation && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo/15 flex items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-7 h-7 text-indigo-bright"
            >
              <path d="M17 3l4 4-4 4" />
              <path d="M3 11h18" />
              <path d="M7 21l-4-4 4-4" />
              <path d="M21 13H3" />
            </svg>
          </div>
          <h3 className="text-base font-bold mb-1">Run a simulation</h3>
          <p className="text-sm text-text-tertiary max-w-[300px]">
            Enter your current and target majors above, then click Simulate to
            see alumni who made the same pivot.
          </p>
        </div>
      )}

      {/* No results */}
      {simulation && simulation.cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-base font-bold mb-1">No transitions found</h3>
          <p className="text-sm text-text-tertiary max-w-[300px]">
            No alumni matched this pivot. Try different majors.
          </p>
        </div>
      )}
    </div>
  );
}

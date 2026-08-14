"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MOCK_SAVED_PATHS, PATH_COLORS, PATH_COLORS_LIGHT } from "@/lib/mock-data";
import { useTheme } from "@/components/theme-provider";
import type { SavedPath } from "@/lib/types";

const STAGES = ["Freshman", "Sophomore", "Junior", "Senior", "Outcome"];

export default function CreatePathPage() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [combined, setCombined] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const togglePath = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setCombined(false);
  };

  const combinePaths = () => {
    if (selected.size < 2) return;
    setCombined(true);
  };

  const selectedCount = selected.size;
  const countText =
    selectedCount === 0
      ? "Select 2 or more paths to combine"
      : selectedCount === 1
        ? "1 path selected \u2014 select at least 1 more"
        : `${selectedCount} paths selected`;

  const selectedPaths = MOCK_SAVED_PATHS.filter((p) => selected.has(p.id));

  // Sankey drawing
  const drawSankey = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (!combined) return;

    const paths = selectedPaths;
    const stageCount = STAGES.length;
    const padX = 80;
    const padY = 60;
    const usableW = W - padX * 2;
    const usableH = H - padY * 2;
    const colW = usableW / (stageCount - 1);
    const nodeW = 14;
    const nodeRadius = 4;

    // Build nodes per stage
    const stageNodes = STAGES.map((stage) => {
      const items = new Map<string, { name: string; paths: Set<number>; value: number }>();
      paths.forEach((p) => {
        const courses = stage === "Outcome" ? [p.outcomeField] : (p.semesters[stage] || []);
        courses.forEach((c) => {
          if (!items.has(c)) items.set(c, { name: c, paths: new Set(), value: 0 });
          const item = items.get(c)!;
          item.paths.add(p.id);
          item.value += 1;
        });
      });
      return [...items.values()];
    });

    // Position nodes
    const nodePositions = new Map<string, { x: number; y: number; w: number; h: number; node: (typeof stageNodes)[0][0]; stage: number }>();
    stageNodes.forEach((nodes, si) => {
      const x = padX + si * colW;
      const totalVal = nodes.reduce((s, n) => s + n.value, 0);
      const totalH =
        nodes.reduce((s, n) => s + Math.max(16, (n.value / totalVal) * usableH * 0.7), 0) +
        (nodes.length - 1) * 6;
      let curY = padY + (usableH - totalH) / 2;

      nodes.forEach((n) => {
        const h = Math.max(16, (n.value / totalVal) * usableH * 0.7);
        nodePositions.set(`${si}-${n.name}`, { x, y: curY, w: nodeW, h, node: n, stage: si });
        curY += h + 6;
      });
    });

    // Draw links
    paths.forEach((p) => {
      const c = isLight ? PATH_COLORS_LIGHT[p.color] : PATH_COLORS[p.color];
      for (let si = 0; si < stageCount - 1; si++) {
        const stage = STAGES[si];
        const nextStage = STAGES[si + 1];
        const courses = p.semesters[stage] || [];
        const nextCourses = nextStage === "Outcome" ? [p.outcomeField] : (p.semesters[nextStage] || []);

        courses.forEach((fromC, ci) => {
          const toC = nextCourses[ci % nextCourses.length];
          const from = nodePositions.get(`${si}-${fromC}`);
          const to = nodePositions.get(`${si + 1}-${toC}`);
          if (!from || !to) return;

          const x0 = from.x + from.w;
          const y0 = from.y + from.h / 2;
          const x1 = to.x;
          const y1 = to.y + to.h / 2;
          const cp = (x1 - x0) * 0.45;

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.bezierCurveTo(x0 + cp, y0, x1 - cp, y1, x1, y1);
          ctx.lineWidth = 2;
          ctx.strokeStyle = c + (isLight ? "40" : "35");
          ctx.stroke();
        });
      }
    });

    // Draw nodes
    nodePositions.forEach((pos) => {
      const { x, y, w, h, node } = pos;
      const pathIds = [...node.paths];
      const shared = pathIds.length > 1;

      if (shared) {
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        pathIds.forEach((pid, i) => {
          const p = MOCK_SAVED_PATHS.find((pp) => pp.id === pid)!;
          const c = isLight ? PATH_COLORS_LIGHT[p.color] : PATH_COLORS[p.color];
          gradient.addColorStop(i / Math.max(1, pathIds.length - 1), c);
        });
        ctx.fillStyle = gradient;
      } else {
        const p = MOCK_SAVED_PATHS.find((pp) => pp.id === pathIds[0])!;
        const c = isLight ? PATH_COLORS_LIGHT[p.color] : PATH_COLORS[p.color];
        ctx.fillStyle = c;
      }

      ctx.globalAlpha = shared ? 0.9 : 0.65;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, nodeRadius);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      ctx.font = `${shared ? "600" : "500"} 11px system-ui, sans-serif`;
      ctx.fillStyle = isLight
        ? shared ? "rgba(30,30,60,0.9)" : "rgba(30,30,60,0.7)"
        : shared ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)";
      ctx.textAlign = "left";

      const labelX = x + w + 8;
      const labelY = y + h / 2 + 4;
      const maxLabelW = colW - w - 16;
      let label = node.name;
      if (ctx.measureText(label).width > maxLabelW && maxLabelW > 20) {
        while (ctx.measureText(label + "...").width > maxLabelW && label.length > 3) {
          label = label.slice(0, -1);
        }
        label += "...";
      }
      ctx.fillText(label, labelX, labelY);

      if (shared) {
        ctx.font = "600 9px system-ui, sans-serif";
        ctx.fillStyle = isLight ? "rgba(62,67,173,0.7)" : "rgba(91,96,232,0.8)";
        ctx.fillText(`${pathIds.length} paths`, labelX, labelY + 13);
      }
    });

    // Stage headers
    STAGES.forEach((stage, si) => {
      const x = padX + si * colW + nodeW / 2;
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillStyle = isLight ? "rgba(30,30,60,0.5)" : "rgba(255,255,255,0.3)";
      ctx.textAlign = "center";
      ctx.fillText(stage, x, padY - 16);
    });
  }, [combined, selectedPaths, isLight]);

  // Draw on combine / theme change / resize
  useEffect(() => {
    drawSankey();
  }, [drawSankey]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => drawSankey());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [drawSankey]);

  const getColor = (p: SavedPath) =>
    isLight ? PATH_COLORS_LIGHT[p.color] : PATH_COLORS[p.color];

  return (
    <div className="flex h-[calc(100vh-56px)] -m-7">
      {/* Left panel: Saved Paths */}
      <div className="w-[320px] shrink-0 border-r border-border flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-[15px] font-bold">Saved Paths</h2>
          <button className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg bg-indigo text-white text-xs font-semibold hover:bg-indigo-bright transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Path
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {MOCK_SAVED_PATHS.map((p) => {
            const sel = selected.has(p.id);
            const c = getColor(p);
            return (
              <button
                key={p.id}
                onClick={() => togglePath(p.id)}
                className={`relative text-left rounded-[10px] p-[14px_16px] border transition-all ${
                  sel
                    ? "border-indigo/30 bg-indigo/[0.06]"
                    : "border-border bg-space-card hover:border-border-hover"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    sel ? "bg-indigo border-indigo" : "border-border"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-3 h-3 transition-opacity ${sel ? "opacity-100" : "opacity-0"}`}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Match badge */}
                <span
                  className="text-[11px] font-bold px-2 py-[3px] rounded inline-block mb-2"
                  style={{ background: c + "20", color: c }}
                >
                  {p.match}% match
                </span>

                {/* Major */}
                <div className="text-sm font-bold mb-1 pr-7">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                    style={{ background: c }}
                  />
                  {p.major}
                </div>

                {/* Outcome */}
                <div className="text-xs text-text-secondary mb-2.5">
                  {p.outcome} &middot; Class of {p.classYear}
                </div>

                {/* Course pills */}
                <div className="flex flex-wrap gap-1">
                  {p.courses.slice(0, 5).map((course) => (
                    <span key={course} className="text-[10px] px-[7px] py-[3px] rounded bg-[rgba(255,255,255,0.05)] text-text-tertiary">
                      {course}
                    </span>
                  ))}
                  {p.courses.length > 5 && (
                    <span className="text-[10px] px-[7px] py-[3px] rounded bg-[rgba(255,255,255,0.05)] text-text-tertiary">
                      +{p.courses.length - 5}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <button
            onClick={combinePaths}
            disabled={selectedCount < 2}
            className="w-full py-[11px] rounded-lg bg-indigo text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M6 3v12" />
              <path d="M18 9a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M6 21a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M18 9c0 4-6 6-6 12" />
              <path d="M6 9c0 4 6 6 6 12" />
            </svg>
            Combine Paths
          </button>
          <div className="text-xs text-text-tertiary text-center mt-2">{countText}</div>
        </div>
      </div>

      {/* Right panel: Sankey */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-text-secondary">Path Flow Diagram</span>
            {combined && (
              <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-indigo/15 text-indigo-bright">
                {selectedCount} paths combined
              </span>
            )}
          </div>
        </div>

        {/* Canvas area */}
        <div ref={canvasWrapRef} className="flex-1 relative overflow-hidden">
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Empty state */}
          {!combined && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-indigo/15 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7 text-indigo-bright">
                  <path d="M6 3v12" />
                  <path d="M18 9a3 3 0 100-6 3 3 0 000 6z" />
                  <path d="M6 21a3 3 0 100-6 3 3 0 000 6z" />
                  <path d="M18 9c0 4-6 6-6 12" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1.5">No paths selected</h3>
              <p className="text-[13px] text-text-tertiary max-w-[280px] leading-relaxed">
                Select saved alumni paths from the left panel, then combine them to see how they flow together.
              </p>
            </div>
          )}

          {/* Legend */}
          {combined && (
            <div className="absolute bottom-5 right-5 bg-space-card border border-border rounded-[10px] p-[14px_18px] backdrop-blur-xl">
              <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-[1px] mb-2">
                Paths
              </div>
              <div className="flex flex-col gap-1.5">
                {selectedPaths.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs text-text-secondary">
                    <div
                      className="w-5 h-[3px] rounded-sm shrink-0"
                      style={{ background: getColor(p) }}
                    />
                    {p.major}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

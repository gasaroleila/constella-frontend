"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const tools = [
  {
    id: "explore",
    name: "Explore",
    tag: "The full star map",
    desc: "See every alumni path from your school at once. Each star is a real alumnus, each cluster is a career outcome. Zoom into clusters, filter by major or industry, and discover paths you never knew existed.",
    bullets: [
      "Open Explore: browse the entire constellation freely",
      "Focused Explore: filter by career area, major, or industry",
      "Click any star to see a full alumni journey",
    ],
    clusters: [
      { cx: 0.18, cy: 0.15, label: "Health Policy", nodes: 8, color: "#34D399" },
      { cx: 0.78, cy: 0.18, label: "UX Research", nodes: 6, color: "#FBBF24" },
      { cx: 0.82, cy: 0.65, label: "Data Science", nodes: 7, color: "#FB7185" },
      { cx: 0.55, cy: 0.85, label: "Biotech", nodes: 5, color: "#A78BFA" },
      { cx: 0.15, cy: 0.7, label: "Education", nodes: 6, color: "#38BDF8" },
      { cx: 0.35, cy: 0.3, label: "Finance", nodes: 4, color: "#FB923C" },
    ],
    youNode: { cx: 0.48, cy: 0.5 },
  },
  {
    id: "transition",
    name: "Transition",
    tag: "The what-if simulator",
    desc: "Thinking about switching majors? See exactly what happened to alumni who made the same move. The semester-by-semester playbook — bridge courses, dropped courses, and where they ended up.",
    bullets: [
      "See the top 5 most relevant alumni transitions",
      "Bridge courses, dropped courses, and exact sequence",
      "Career outcomes post-pivot",
    ],
    clusters: [
      { cx: 0.2, cy: 0.4, label: "Economics", nodes: 5, color: "#FB923C" },
      { cx: 0.75, cy: 0.4, label: "Public Health", nodes: 5, color: "#34D399" },
    ],
    youNode: { cx: 0.48, cy: 0.45 },
    arcFrom: { cx: 0.2, cy: 0.4 },
    arcTo: { cx: 0.75, cy: 0.4 },
  },
  {
    id: "create",
    name: "Create Path",
    tag: "Your custom journey",
    desc: "No single alumnus matches your vision perfectly? Combine elements from different alumni journeys to build your own. Pick courses from one path, a career pivot from another, and see how the pieces fit together.",
    bullets: [
      "Drag elements from any alumni path into your own",
      "See how chosen courses connect to outcomes",
      "Save and revisit your custom path anytime",
    ],
    clusters: [
      { cx: 0.15, cy: 0.2, label: "From #12", nodes: 3, color: "#34D399" },
      { cx: 0.8, cy: 0.2, label: "From #7", nodes: 3, color: "#FBBF24" },
      { cx: 0.15, cy: 0.75, label: "From #34", nodes: 3, color: "#A78BFA" },
    ],
    youNode: { cx: 0.55, cy: 0.55 },
  },
];

// Pre-generate stable node positions
const toolNodes = tools.map((tool) => {
  const nodes: { bx: number; by: number; color: string; phase: number }[] = [];
  tool.clusters.forEach((cl) => {
    for (let i = 0; i < cl.nodes; i++) {
      const a = (Math.PI * 2 / cl.nodes) * i + 0.3 * Math.sin(i * 7);
      const r = 18 + Math.abs(Math.sin(i * 3)) * 30;
      nodes.push({
        bx: cl.cx + Math.cos(a) * r * 0.06,
        by: cl.cy + Math.sin(a) * r * 0.08,
        color: cl.color,
        phase: i * 1.3,
      });
    }
  });
  return nodes;
});

export function ToolExplorer() {
  const [activeTool, setActiveTool] = useState(0);
  const activeToolRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const skyCanvasRef = useRef<HTMLCanvasElement>(null);
  const constCanvasRef = useRef<HTMLCanvasElement>(null);

  // Starfield background
  useEffect(() => {
    const c = skyCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const stars: { x: number; y: number; r: number; p: number; s: number }[] = [];
    for (let i = 0; i < 350; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: 0.005 + Math.random() * 0.015,
      });
    }

    function getStarColor() {
      const style = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      return isDark ? [200, 210, 255] : [60, 60, 120];
    }

    function resize() {
      const sticky = c!.parentElement;
      if (!sticky) return;
      c!.width = sticky.clientWidth;
      c!.height = sticky.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, c!.width, c!.height);
      t += 0.016;
      const [r, g, b] = getStarColor();
      stars.forEach((s) => {
        const a = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * s.s * 60 + s.p));
        ctx!.beginPath();
        ctx!.arc(s.x * c!.width, s.y * c!.height, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx!.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Constellation canvas — reads activeToolRef directly
  useEffect(() => {
    const canvas = constCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let raf: number;

    function getThemeColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      return {
        line: isDark ? [200, 210, 255] : [60, 60, 120],
        label: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
        youText: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      };
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      if (W === 0 || H === 0) { raf = requestAnimationFrame(draw); return; }
      t += 0.016;

      const idx = activeToolRef.current;
      const tool = tools[idx];
      const nodes = toolNodes[idx];
      const colors = getThemeColors();

      // Connection lines
      ctx!.lineWidth = 0.6;
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const ax = a.bx * W, ay = a.by * H, bx = b.bx * W, by = b.by * H;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 100) {
            ctx!.beginPath(); ctx!.moveTo(ax, ay); ctx!.lineTo(bx, by);
            const [r, g, b2] = colors.line;
            ctx!.strokeStyle = `rgba(${r},${g},${b2},${0.06 * (1 - d / 100)})`;
            ctx!.stroke();
          }
        });
      });

      // Lines to You node
      const yx = tool.youNode.cx * W, yy = tool.youNode.cy * H;
      tool.clusters.forEach((cl) => {
        ctx!.beginPath(); ctx!.moveTo(yx, yy); ctx!.lineTo(cl.cx * W, cl.cy * H);
        ctx!.strokeStyle = "rgba(91,96,232,0.08)"; ctx!.lineWidth = 0.8; ctx!.stroke();
      });

      // Arc for transition
      if ("arcFrom" in tool && tool.arcFrom && tool.arcTo) {
        const fx = tool.arcFrom.cx * W, fy = tool.arcFrom.cy * H;
        const tx = tool.arcTo.cx * W, ty = tool.arcTo.cy * H;
        ctx!.beginPath();
        ctx!.moveTo(fx, fy);
        ctx!.quadraticCurveTo((fx + tx) / 2, fy - 80, tx, ty);
        ctx!.strokeStyle = "rgba(91,96,232,0.25)"; ctx!.lineWidth = 2;
        ctx!.setLineDash([6, 4]); ctx!.stroke(); ctx!.setLineDash([]); ctx!.lineWidth = 0.6;
      }

      // Nodes
      nodes.forEach((n) => {
        const x = n.bx * W, y = n.by * H + Math.sin(t * 0.8 + n.phase) * 2;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, n.color + "30"); g.addColorStop(1, "transparent");
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(x, y, 12, 0, Math.PI * 2); ctx!.fill();
        ctx!.beginPath(); ctx!.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx!.fillStyle = n.color; ctx!.fill();
      });

      // Cluster labels
      ctx!.font = "600 11px system-ui,sans-serif"; ctx!.textAlign = "center";
      tool.clusters.forEach((cl) => {
        ctx!.fillStyle = colors.label;
        ctx!.fillText(cl.label + " (" + cl.nodes + ")", cl.cx * W, cl.cy * H - 35);
      });

      // You node
      const glowR = 18 + Math.sin(t * 1.5) * 4;
      const yg = ctx!.createRadialGradient(yx, yy, 0, yx, yy, glowR);
      yg.addColorStop(0, "rgba(91,96,232,0.35)"); yg.addColorStop(1, "transparent");
      ctx!.fillStyle = yg; ctx!.beginPath(); ctx!.arc(yx, yy, glowR, 0, Math.PI * 2); ctx!.fill();
      ctx!.beginPath(); ctx!.arc(yx, yy, 7, 0, Math.PI * 2); ctx!.fillStyle = "#5B60E8"; ctx!.fill();
      ctx!.font = "800 12px system-ui,sans-serif"; ctx!.fillStyle = colors.youText;
      ctx!.fillText("You", yx, yy + 22);

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Scroll driver
  const onScroll = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const sectionH = sec.offsetHeight;
    const scrolled = -rect.top;
    const viewH = window.innerHeight;
    const scrollable = sectionH - viewH;
    if (scrollable <= 0) return;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));
    const idx = Math.min(2, Math.floor(progress * 3));
    if (idx !== activeToolRef.current) {
      activeToolRef.current = idx;
      setActiveTool(idx);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section className="sky-section" id="tools" ref={sectionRef}>
      <div className="sky-sticky">
        <canvas className="sky-canvas" ref={skyCanvasRef} />

        <div className="relative z-[2] text-center pt-20 px-12 pb-6 shrink-0 max-md:pt-[60px] max-md:px-6">
          <div className="text-xs font-bold tracking-[2.5px] uppercase text-indigo-bright/80 mb-4">Your Instruments</div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-tight text-balance text-text-primary mb-3">
            Three ways to read the sky.
          </h2>
          <p className="text-base leading-relaxed text-text-tertiary max-w-[500px] mx-auto">Scroll to explore each tool.</p>
        </div>

        {/* Progress dots */}
        <div className="sky-progress absolute left-12 top-1/2 -translate-y-1/2 z-[3] flex flex-col gap-4 items-center max-md:hidden">
          {["Explore", "Transition", "Create Path"].map((label, i) => (
            <div key={label}>
              <div
                data-label={label}
                className={`sky-progress-dot w-2.5 h-2.5 rounded-full relative transition-all duration-400 ${activeTool === i ? "active bg-indigo-bright shadow-[0_0_12px_rgba(91,96,232,0.5)]" : "bg-text-tertiary/30"}`}
              />
              {i < 2 && <div className="w-px h-5 bg-border mx-auto mt-4" />}
            </div>
          ))}
        </div>

        <div className="relative z-[2] flex-1 flex items-stretch max-w-[1120px] mx-auto w-full px-12 pb-[60px] pt-5 gap-12 max-md:flex-col max-md:px-6 max-md:gap-6">
          {/* Constellation canvas */}
          <div className="flex-1 relative min-w-0">
            <canvas ref={constCanvasRef} className="w-full h-full" />
          </div>

          {/* Tool detail panel */}
          <div className="w-[420px] shrink-0 flex flex-col justify-center relative max-md:w-full">
            {tools.map((tool, i) => (
              <div key={tool.id} className={`tool-slide${activeTool === i ? " active" : ""}`}>
                <div className="text-[32px] font-bold tracking-tight text-text-primary mb-1.5">{tool.name}</div>
                <div className="text-[13px] font-bold text-indigo-bright/90 mb-5">{tool.tag}</div>
                <div className="text-[15px] leading-relaxed text-text-secondary mb-6">{tool.desc}</div>
                <ul className="tool-bullets flex flex-col gap-2.5 list-none">
                  {tool.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-text-secondary leading-normal">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

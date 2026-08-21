"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const SCHOOL = "Brandeis University";
const SPEED = 75;

const clusters = [
  { cx: 140, cy: 100, label: "Health Policy", nodes: [{ x: 115, y: 75 }, { x: 155, y: 68 }, { x: 130, y: 110 }, { x: 160, y: 105 }, { x: 118, y: 130 }] },
  { cx: 350, cy: 80, label: "UX Research", nodes: [{ x: 325, y: 58 }, { x: 365, y: 62 }, { x: 340, y: 90 }, { x: 375, y: 85 }, { x: 350, y: 108 }] },
  { cx: 560, cy: 120, label: "Data Science", nodes: [{ x: 535, y: 95 }, { x: 575, y: 100 }, { x: 548, y: 130 }, { x: 580, y: 135 }, { x: 558, y: 150 }] },
  { cx: 180, cy: 280, label: "Biotech", nodes: [{ x: 155, y: 258 }, { x: 195, y: 262 }, { x: 170, y: 290 }, { x: 200, y: 295 }, { x: 165, y: 310 }] },
];

const youNode = { x: 350, y: 200 };
const highlightNode = clusters[1].nodes[2]; // UX Research cluster

function buildSvgContent(highlight: boolean) {
  const allNodes = clusters.flatMap((c) => c.nodes).concat([youNode]);
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  allNodes.forEach((a, i) => {
    allNodes.forEach((b, j) => {
      if (j <= i) return;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 100) {
        lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    });
  });

  return { lines, highlight };
}

const svgData = buildSvgContent(false);
const svgDataBg = buildSvgContent(true);

export function DemoSection() {
  const [step, setStep] = useState(1);
  const [typedText, setTypedText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownHighlighted, setDropdownHighlighted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [materialized, setMaterialized] = useState(false);
  const [materializedBg, setMaterializedBg] = useState(false);
  const [replayVisible, setReplayVisible] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const startedRef = useRef(false);

  const goToStep = useCallback((s: number, auto: boolean) => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    setStep(s);
    setAutoPlay(auto);
    setReplayVisible(s === 3);

    if (s === 1) {
      setTypedText("");
      setDropdownVisible(false);
      setDropdownHighlighted(false);
      setCursorVisible(true);
      setMaterialized(false);
      setMaterializedBg(false);

      let ci = 0;
      intervalRef.current = setInterval(() => {
        ci++;
        setTypedText(SCHOOL.slice(0, ci));
        if (ci === 5) setDropdownVisible(true);
        if (ci >= SCHOOL.length) {
          clearInterval(intervalRef.current);
          setDropdownHighlighted(true);
          setCursorVisible(false);
          if (auto) {
            timeoutRef.current = setTimeout(() => goToStep(2, true), 1000);
          }
        }
      }, SPEED);
    } else if (s === 2) {
      setMaterialized(true);
      if (auto) {
        timeoutRef.current = setTimeout(() => goToStep(3, true), 2500);
      }
    } else {
      setMaterializedBg(true);
      if (auto) {
        timeoutRef.current = setTimeout(() => goToStep(1, true), 4500);
      }
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          goToStep(1, true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [goToStep]);

  const renderSvg = (data: typeof svgData, mat: boolean, id: string) => (
    <svg viewBox="0 0 700 380" className="w-full h-full">
      {data.lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="var(--color-border)" strokeWidth="0.8"
          className={`demo-line${mat ? " materialized" : ""}`} />
      ))}
      {clusters.map((c, ci) => (
        <g key={ci}>
          {c.nodes.map((n, ni) => (
            <circle key={ni} cx={n.x} cy={n.y} r="4"
              fill="var(--color-dot)"
              className={`demo-node${mat ? " materialized" : ""}`}
              style={{ transitionDelay: `${ci * 200 + ni * 60}ms` }} />
          ))}
          <text x={c.cx} y={c.cy - 40} textAnchor="middle"
            className={`demo-label${mat ? " materialized" : ""}`}
            style={{ transitionDelay: `${ci * 200 + 300}ms` }}>
            {c.label}
          </text>
        </g>
      ))}
      {/* You glow */}
      <circle cx={youNode.x} cy={youNode.y} r="22"
        fill="var(--color-indigo-bright)" fillOpacity="0.2"
        className={`you-glow demo-node${mat ? " materialized" : ""}`}
        style={{ transitionDelay: "800ms" }} />
      {/* You dot */}
      <circle cx={youNode.x} cy={youNode.y} r="7"
        fill="var(--color-indigo-bright)"
        className={`demo-node${mat ? " materialized" : ""}`}
        style={{ transitionDelay: "800ms" }} />
      {/* You label */}
      <text x={youNode.x} y={youNode.y + 24} textAnchor="middle"
        className={`you-label-text${mat ? " materialized" : ""}`}>
        You
      </text>
      {/* Highlight ring for frame 3 */}
      {data.highlight && (
        <circle cx={highlightNode.x} cy={highlightNode.y} r="12"
          fill="none" stroke="var(--color-indigo-bright)" strokeWidth="2"
          className="demo-highlight-ring" />
      )}
    </svg>
  );

  return (
    <section className="px-12 py-[100px] bg-space-raised max-md:px-6" id="how-it-works">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="text-xs font-bold tracking-[2.5px] uppercase text-indigo-bright mb-4">See It In Action</div>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold leading-[1.15] tracking-tight text-balance">
            From your school to your constellation.
          </h2>
        </div>

        <div ref={containerRef} className="max-w-[880px] mx-auto rounded-2xl overflow-hidden border border-border bg-[var(--t-visual-bg)] shadow-[0_24px_64px_rgba(0,0,0,0.08)] relative reveal" style={{ transitionDelay: "200ms" }}>
          <div className="h-[440px] max-md:h-[340px] relative overflow-hidden">
            {/* Frame 1: School search */}
            <div className={`demo-frame${step === 1 ? " active" : ""}`}>
              <div className="w-full max-w-[440px] flex flex-col items-center">
                <div className="text-sm font-bold text-text-secondary mb-4">Find your school</div>
                <div className="w-full py-4 px-5 rounded-xl bg-space-card border border-border text-[17px] font-semibold text-text-primary flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 shrink-0 text-text-tertiary">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <span>{typedText}</span>
                  {cursorVisible && <span className="demo-cursor" />}
                </div>
                <div className={`demo-dropdown w-full max-w-[440px] mt-2 rounded-xl bg-space-card border border-border overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)]${dropdownVisible ? " visible" : ""}`}>
                  <div className={`flex items-center gap-3 py-3.5 px-5 transition-colors${dropdownHighlighted ? " highlighted demo-dropdown-item" : ""}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[18px] h-[18px] text-indigo-bright shrink-0">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                    <span className="text-[15px] font-semibold">Brandeis University</span>
                    <span className="text-xs text-text-secondary ml-auto font-semibold">Waltham, MA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame 2: Constellation appears */}
            <div className={`demo-frame${step === 2 ? " active" : ""}`}>
              <div className="w-full h-full flex items-center justify-center relative">
                {renderSvg(svgData, materialized, "demoSvg")}
              </div>
            </div>

            {/* Frame 3: Alumni card */}
            <div className={`demo-frame${step === 3 ? " active" : ""}`}>
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-50">
                  {renderSvg(svgDataBg, materializedBg, "demoSvgBg")}
                </div>
                <div className="alumni-card bg-space-card border border-border rounded-xl p-7 w-[260px] shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo to-indigo-bright mb-3.5 flex items-center justify-center text-base font-bold text-white">A</div>
                  <div className="text-base font-bold mb-0.5">Alumnus #34</div>
                  <div className="text-xs text-text-tertiary mb-3.5 font-semibold">Class of 2023</div>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold mb-4 p-2 px-3 rounded-lg bg-indigo/8">
                    <span className="text-text-secondary">Psychology</span>
                    <span className="text-indigo-bright">&rarr;</span>
                    <span className="text-indigo-bright">UX Research</span>
                  </div>
                  <div className="text-xs text-text-secondary font-semibold leading-relaxed">
                    <strong className="text-text-primary font-bold">Current:</strong> UX Researcher at a health-tech startup<br />
                    <strong className="text-text-primary font-bold">Pivoted:</strong> Sophomore Spring<br />
                    <strong className="text-text-primary font-bold">Bridge courses:</strong> HCI, Cognitive Science, Design Thinking
                  </div>
                </div>
              </div>
            </div>

            {/* Replay */}
            <button
              onClick={() => goToStep(1, true)}
              className={`absolute bottom-4 right-4 px-3.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-bold text-text-secondary cursor-pointer transition-opacity ${replayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              &#8635; Replay
            </button>
          </div>

          {/* Step buttons */}
          <div className="flex items-center justify-center gap-3 py-5">
            {[
              { step: 1, title: "Enter your school" },
              { step: 2, title: "Explore the constellation" },
              { step: 3, title: "Discover real paths" },
            ].map((s) => (
              <button key={s.step} onClick={() => goToStep(s.step, false)}
                className={`demo-step-btn flex items-center gap-2.5 py-2 px-4 rounded-full border border-transparent cursor-pointer transition-all text-text-tertiary hover:text-text-secondary ${step === s.step ? "active" : ""}`}
              >
                <span className="demo-step-num w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold bg-surface border border-border transition-all">
                  {s.step}
                </span>
                <span className="demo-step-title text-[13px] font-bold">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useEffect } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const W = c.width, H = c.height;
    const nodes: { x: number; y: number; p: number; s: number; dx: number; dy: number }[] = [];

    [
      { x: W * 0.2, y: H * 0.25, n: 6 },
      { x: W * 0.75, y: H * 0.2, n: 5 },
      { x: W * 0.5, y: H * 0.5, n: 7 },
      { x: W * 0.15, y: H * 0.75, n: 5 },
      { x: W * 0.8, y: H * 0.7, n: 4 },
      { x: W * 0.45, y: H * 0.8, n: 5 },
    ].forEach((cl) => {
      for (let i = 0; i < cl.n; i++) {
        const a = (Math.PI * 2 / cl.n) * i + Math.random() * 0.5;
        const r = 25 + Math.random() * 45;
        nodes.push({
          x: cl.x + Math.cos(a) * r,
          y: cl.y + Math.sin(a) * r,
          p: Math.random() * Math.PI * 2,
          s: 0.003 + Math.random() * 0.004,
          dx: 0, dy: 0,
        });
      }
    });

    const ctr = { x: W * 0.5, y: H * 0.45 };
    let t = 0;
    let raf: number;

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const st = getComputedStyle(document.documentElement);
      const nc = st.getPropertyValue("--t-dot").trim() || "rgba(255,255,255,0.2)";
      const lc = st.getPropertyValue("--t-border").trim() || "rgba(255,255,255,0.06)";
      t++;

      nodes.forEach((n) => {
        n.dx = n.x + Math.sin(t * n.s + n.p) * 3;
        n.dy = n.y + Math.cos(t * n.s + n.p) * 3;
      });

      ctx!.strokeStyle = lc;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].dx - nodes[j].dx;
          const dy = nodes[i].dy - nodes[j].dy;
          if (Math.sqrt(dx * dx + dy * dy) < 90) {
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].dx, nodes[i].dy);
            ctx!.lineTo(nodes[j].dx, nodes[j].dy);
            ctx!.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx!.beginPath();
        ctx!.arc(n.dx, n.dy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = nc;
        ctx!.fill();
      });

      const g = ctx!.createRadialGradient(ctr.x, ctr.y, 0, ctr.x, ctr.y, 30);
      g.addColorStop(0, "rgba(91,96,232,0.3)");
      g.addColorStop(1, "transparent");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(ctr.x, ctr.y, 30, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(ctr.x, ctr.y, 5, 0, Math.PI * 2);
      ctx!.fillStyle = "#5B60E8";
      ctx!.fill();

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} className="w-full h-[500px] max-md:h-[300px]" />;
}

"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

interface Props {
  className?: string;
}

interface FloatingNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  color: string;
  isCenter?: boolean;
  isLabel?: boolean;
  label?: string;
  isBg?: boolean;
}

const CLUSTERS = [
  { label: "Health Policy", angle: -0.4, dist: 0.28, count: 10 },
  { label: "UX Research", angle: 0.9, dist: 0.32, count: 7 },
  { label: "Data Science", angle: 2.0, dist: 0.25, count: 9 },
  { label: "Biotech", angle: 3.2, dist: 0.35, count: 5 },
  { label: "Education", angle: 4.5, dist: 0.28, count: 8 },
  { label: "Finance", angle: 5.4, dist: 0.3, count: 4 },
];

export function DecorativeConstellation({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<FloatingNode[]>([]);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(w, h);
    }

    function initNodes(w: number, h: number) {
      const nodes: FloatingNode[] = [];
      const cx = w / 2;
      const cy = h / 2;
      const isLight = themeRef.current === "light";

      // Center node
      nodes.push({
        x: cx, y: cy, baseX: cx, baseY: cy,
        r: 8, color: "#3E43AD", isCenter: true, label: "You",
      });

      // Cluster nodes
      CLUSTERS.forEach((cl) => {
        const clx = cx + Math.cos(cl.angle) * Math.min(w, h) * cl.dist;
        const cly = cy + Math.sin(cl.angle) * Math.min(w, h) * cl.dist;
        for (let i = 0; i < cl.count; i++) {
          const a = Math.random() * Math.PI * 2;
          const s = 18 + Math.random() * 32;
          const nx = clx + Math.cos(a) * s;
          const ny = cly + Math.sin(a) * s;
          const op = 0.3 + Math.random() * 0.5;
          nodes.push({
            x: nx, y: ny, baseX: nx, baseY: ny,
            r: 2 + Math.random() * 3,
            color: isLight ? `rgba(80,85,120,${op})` : `rgba(200,204,216,${op})`,
          });
        }
        // Label
        nodes.push({
          x: clx, y: cly - 42, baseX: clx, baseY: cly - 42,
          r: 0, color: "", isLabel: true, label: cl.label,
        });
      });

      // Background dust
      for (let i = 0; i < 18; i++) {
        const bgOp = 0.05 + Math.random() * 0.1;
        const bx = Math.random() * w;
        const by = Math.random() * h;
        nodes.push({
          x: bx, y: by, baseX: bx, baseY: by,
          r: 1 + Math.random() * 1.5,
          color: isLight ? `rgba(80,85,120,${bgOp * 1.5})` : `rgba(200,204,216,${bgOp})`,
          isBg: true,
        });
      }

      nodesRef.current = nodes;
    }

    function draw(t: number) {
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const isLight = themeRef.current === "light";
      const nodes = nodesRef.current;

      ctx!.clearRect(0, 0, w, h);

      // Draw connections
      ctx!.lineWidth = 0.4;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].isLabel || nodes[i].isBg) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[j].isLabel || nodes[j].isBg) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const op = (1 - dist / 90) * 0.1;
            ctx!.strokeStyle =
              nodes[i].isCenter || nodes[j].isCenter
                ? `rgba(91,96,232,${op * 2.5})`
                : isLight
                  ? `rgba(80,85,120,${op * 1.5})`
                  : `rgba(200,204,216,${op})`;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        if (n.isLabel) {
          ctx!.font = "10px system-ui, sans-serif";
          ctx!.fillStyle = isLight ? "rgba(80,85,120,0.5)" : "rgba(200,204,216,0.35)";
          ctx!.textAlign = "center";
          ctx!.fillText(n.label!, n.x, n.y);
          return;
        }

        // Float animation
        n.x = n.baseX + Math.sin(t * 0.0004 + n.baseY * 0.01) * 6;
        n.y = n.baseY + Math.cos(t * 0.0003 + n.baseX * 0.01) * 5;

        // Center glow
        if (n.isCenter) {
          const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, 22);
          g.addColorStop(0, isLight ? "rgba(62,67,173,0.15)" : "rgba(62,67,173,0.25)");
          g.addColorStop(1, "transparent");
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 22, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.fillStyle = n.color;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();

        if (n.isCenter && n.label) {
          ctx!.font = "600 11px system-ui, sans-serif";
          ctx!.fillStyle = isLight ? "rgba(30,30,60,0.6)" : "rgba(255,255,255,0.6)";
          ctx!.textAlign = "center";
          ctx!.fillText(n.label, n.x, n.y + n.r + 15);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    animRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
    />
  );
}

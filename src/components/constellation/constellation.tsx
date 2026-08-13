"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { AlumniRecord, Cluster, ConstellationData } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/mock-data";
import { useTheme } from "@/components/theme-provider";

interface Node {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  r: number;
  color: string;
  type: "student" | "alumni" | "cluster-center";
  cluster?: string;
  alumni?: AlumniRecord;
  label?: string;
  opacity: number;
}

interface Props {
  data: ConstellationData;
  onSelectAlumni?: (alumni: AlumniRecord | null) => void;
  selectedAlumniId?: string | null;
}

export function Constellation({ data, onSelectAlumni, selectedAlumniId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3.Simulation<Node, undefined> | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const transformRef = useRef(d3.zoomIdentity);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const animRef = useRef<number>(0);

  const buildNodes = useCallback(
    (width: number, height: number): Node[] => {
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height);
      const nodes: Node[] = [];

      // Student node
      nodes.push({
        id: "student",
        x: cx,
        y: cy,
        r: 10,
        color: "#5B60E8",
        type: "student",
        label: "You",
        opacity: 1,
      });

      data.clusters.forEach((cluster) => {
        const clusterX = cx + cluster.x * scale;
        const clusterY = cy + cluster.y * scale;
        const color = CLUSTER_COLORS[cluster.label] || "#888";

        // Cluster center (invisible, for force targeting)
        nodes.push({
          id: `center-${cluster.id}`,
          x: clusterX,
          y: clusterY,
          r: 0,
          color,
          type: "cluster-center",
          cluster: cluster.label,
          label: cluster.label,
          opacity: 0,
        });

        // Alumni nodes
        cluster.alumni.forEach((alumni) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 20 + Math.random() * 40;
          nodes.push({
            id: alumni.id,
            x: clusterX + Math.cos(angle) * dist,
            y: clusterY + Math.sin(angle) * dist,
            r: 3 + (alumni.similarityScore / 100) * 4,
            color,
            type: "alumni",
            cluster: cluster.label,
            alumni,
            opacity: 0.7,
          });
        });
      });

      return nodes;
    },
    [data],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const t = transformRef.current;
    const nodes = nodesRef.current;
    const isLight = theme === "light";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(dpr * t.k, 0, 0, dpr * t.k, dpr * t.x, dpr * t.y);

    // Draw edges from student to cluster centers
    const studentNode = nodes.find((n) => n.type === "student");
    if (studentNode) {
      const centers = nodes.filter((n) => n.type === "cluster-center");
      centers.forEach((center) => {
        const inExpanded = expandedCluster === null || expandedCluster === center.cluster;
        ctx.strokeStyle = isLight
          ? `rgba(62,67,173,${inExpanded ? 0.08 : 0.02})`
          : `rgba(91,96,232,${inExpanded ? 0.12 : 0.03})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(studentNode.x, studentNode.y);
        ctx.lineTo(center.x, center.y);
        ctx.stroke();
      });
    }

    // Draw connections within clusters
    const alumniNodes = nodes.filter((n) => n.type === "alumni");
    for (let i = 0; i < alumniNodes.length; i++) {
      for (let j = i + 1; j < alumniNodes.length; j++) {
        if (alumniNodes[i].cluster !== alumniNodes[j].cluster) continue;
        const dx = alumniNodes[i].x - alumniNodes[j].x;
        const dy = alumniNodes[i].y - alumniNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          const inExpanded =
            expandedCluster === null || expandedCluster === alumniNodes[i].cluster;
          const op = (1 - dist / 60) * (inExpanded ? 0.12 : 0.02);
          ctx.strokeStyle = isLight
            ? `rgba(0,0,0,${op})`
            : `rgba(255,255,255,${op})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(alumniNodes[i].x, alumniNodes[i].y);
          ctx.lineTo(alumniNodes[j].x, alumniNodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      if (node.type === "cluster-center") return;

      const inExpanded =
        expandedCluster === null || expandedCluster === node.cluster || node.type === "student";
      const isSelected = selectedAlumniId === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const alpha = inExpanded ? node.opacity : 0.1;

      // Glow for student node
      if (node.type === "student") {
        const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 28);
        g.addColorStop(0, isLight ? "rgba(62,67,173,0.12)" : "rgba(62,67,173,0.25)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Selection ring
      if (isSelected || isHovered) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Node circle
      ctx.globalAlpha = alpha;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label for student
      if (node.type === "student" && node.label) {
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillStyle = isLight ? "rgba(30,30,60,0.6)" : "rgba(255,255,255,0.6)";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.r + 16);
      }
    });

    // Draw cluster labels
    const centers = nodes.filter((n) => n.type === "cluster-center");
    centers.forEach((center) => {
      const inExpanded = expandedCluster === null || expandedCluster === center.cluster;
      const clusterAlumni = alumniNodes.filter((n) => n.cluster === center.cluster);
      const count = clusterAlumni.length;

      // Calculate centroid of cluster alumni
      if (clusterAlumni.length === 0) return;
      const avgY = clusterAlumni.reduce((s, n) => s + n.y, 0) / clusterAlumni.length;
      const avgX = clusterAlumni.reduce((s, n) => s + n.x, 0) / clusterAlumni.length;
      const minY = Math.min(...clusterAlumni.map((n) => n.y - n.r));

      ctx.globalAlpha = inExpanded ? 0.6 : 0.15;
      ctx.font = "600 11px system-ui, sans-serif";
      ctx.fillStyle = isLight ? "rgba(30,30,60,0.7)" : "rgba(200,204,216,0.7)";
      ctx.textAlign = "center";
      ctx.fillText(`${center.label} (${count})`, avgX, minY - 10);
      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }, [theme, expandedCluster, selectedAlumniId, hoveredNode]);

  // Initialize simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const nodes = buildNodes(w, h);
    nodesRef.current = nodes;

    // Force simulation
    const sim = d3
      .forceSimulation(nodes)
      .force(
        "cluster",
        d3.forceManyBody<Node>().strength((d) => {
          if (d.type === "student") return -80;
          if (d.type === "cluster-center") return -20;
          return -8;
        }),
      )
      .force(
        "x",
        d3.forceX<Node>((d) => {
          if (d.type === "student") return w / 2;
          const center = nodes.find(
            (n) => n.type === "cluster-center" && n.cluster === d.cluster,
          );
          return center ? center.x : w / 2;
        }).strength((d) => (d.type === "alumni" ? 0.15 : 0.5)),
      )
      .force(
        "y",
        d3.forceY<Node>((d) => {
          if (d.type === "student") return h / 2;
          const center = nodes.find(
            (n) => n.type === "cluster-center" && n.cluster === d.cluster,
          );
          return center ? center.y : h / 2;
        }).strength((d) => (d.type === "alumni" ? 0.15 : 0.5)),
      )
      .force(
        "collide",
        d3.forceCollide<Node>((d) => d.r + 2).strength(0.8),
      )
      .alphaDecay(0.02)
      .on("tick", draw);

    simRef.current = sim;

    // Zoom
    const zoom = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        draw();
      });

    d3.select(canvas).call(zoom);

    return () => {
      sim.stop();
      cancelAnimationFrame(animRef.current);
    };
  }, [data, buildNodes, draw]);

  // Redraw on theme/state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Resize handler
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const nodes = buildNodes(rect.width, rect.height);
      nodesRef.current = nodes;
      if (simRef.current) {
        simRef.current.nodes(nodes);
        simRef.current.alpha(0.3).restart();
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [buildNodes]);

  // Hit testing for mouse events
  const hitTest = useCallback(
    (clientX: number, clientY: number): Node | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const mx = (clientX - rect.left - t.x) / t.k;
      const my = (clientY - rect.top - t.y) / t.k;

      // Check alumni nodes first, then student
      const clickable = nodesRef.current.filter(
        (n) => n.type === "alumni" || n.type === "student",
      );
      for (let i = clickable.length - 1; i >= 0; i--) {
        const n = clickable[i];
        const dx = mx - n.x;
        const dy = my - n.y;
        if (dx * dx + dy * dy <= (n.r + 4) * (n.r + 4)) return n;
      }
      return null;
    },
    [],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const node = hitTest(e.clientX, e.clientY);

      if (!node) {
        // Click on empty space — go back to overview
        if (expandedCluster) {
          setExpandedCluster(null);
        }
        onSelectAlumni?.(null);
        return;
      }

      if (node.type === "alumni") {
        if (expandedCluster === null) {
          // Layer 1 → Layer 2: expand this cluster
          setExpandedCluster(node.cluster!);
        } else if (expandedCluster === node.cluster) {
          // Layer 2 → Layer 3: select alumni
          onSelectAlumni?.(node.alumni!);
        }
      }
    },
    [expandedCluster, hitTest, onSelectAlumni],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const node = hitTest(e.clientX, e.clientY);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = node ? "pointer" : "grab";
      }
      setHoveredNode(node);
      if (node) {
        const rect = canvasRef.current!.getBoundingClientRect();
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    [hitTest],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="block w-full h-full"
      />

      {/* Tooltip */}
      {hoveredNode && hoveredNode.type === "alumni" && hoveredNode.alumni && (
        <div
          className="absolute pointer-events-none bg-space-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg z-10"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-semibold mb-0.5">
            {hoveredNode.alumni.majors.join(" + ")}
          </div>
          <div className="text-text-secondary">
            {hoveredNode.alumni.careerOutcome.title}
          </div>
          <div className="text-text-tertiary mt-0.5">
            Class of {hoveredNode.alumni.graduationYear} &middot;{" "}
            {hoveredNode.alumni.similarityScore}% match
          </div>
        </div>
      )}

      {/* Back button when cluster is expanded */}
      {expandedCluster && (
        <button
          onClick={() => {
            setExpandedCluster(null);
            onSelectAlumni?.(null);
          }}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-card border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-all z-10"
        >
          &larr; Back to overview
        </button>
      )}
    </div>
  );
}

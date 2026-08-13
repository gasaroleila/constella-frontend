import type { AlumniRecord, Cluster, ConstellationData } from "./types";

const clusterColors: Record<string, string> = {
  "Health Policy": "#34D399",
  "UX Research": "#FBBF24",
  "Data Science": "#FB7185",
  "Biotech": "#A78BFA",
  "Education": "#67E8F9",
  "Finance": "#F97316",
};

function makeAlumni(
  cluster: string,
  count: number,
  baseYear: number,
): AlumniRecord[] {
  const majors: Record<string, string[][]> = {
    "Health Policy": [["Biochemistry", "Public Health"], ["Biology", "Public Health"], ["Chemistry", "Health Policy"]],
    "UX Research": [["Psychology", "HCI"], ["Cognitive Science"], ["Psychology", "Design"]],
    "Data Science": [["Statistics", "CS"], ["Math", "CS"], ["Economics", "CS"]],
    "Biotech": [["Biology", "Business"], ["Biochemistry"], ["Molecular Biology"]],
    "Education": [["Psychology", "Education"], ["English", "Education"], ["Math", "Education"]],
    "Finance": [["Economics", "Finance"], ["Math", "Finance"], ["Accounting"]],
  };

  const outcomes: Record<string, string[]> = {
    "Health Policy": ["Health Policy Analyst", "Epidemiologist", "Public Health Researcher", "Health Program Manager"],
    "UX Research": ["UX Researcher", "Product Designer", "UX Strategist", "Design Researcher"],
    "Data Science": ["Data Scientist", "ML Engineer", "Data Analyst", "Analytics Manager"],
    "Biotech": ["Biotech Startup Founder", "Research Scientist", "Lab Director", "Biotech Consultant"],
    "Education": ["Teacher", "Curriculum Designer", "EdTech PM", "School Counselor"],
    "Finance": ["Financial Analyst", "Investment Banker", "Risk Analyst", "Portfolio Manager"],
  };

  const clusterMajors = majors[cluster] || [["General Studies"]];
  const clusterOutcomes = outcomes[cluster] || ["Professional"];

  return Array.from({ length: count }, (_, i) => {
    const m = clusterMajors[i % clusterMajors.length];
    const outcome = clusterOutcomes[i % clusterOutcomes.length];
    const score = Math.round((95 - i * 3 - Math.random() * 5) * 10) / 10;
    const year = baseYear - Math.floor(Math.random() * 4);

    const hasPivot = Math.random() > 0.5;
    return {
      id: `${cluster.replace(/\s/g, "-").toLowerCase()}-${i}`,
      graduationYear: year,
      majors: m,
      careerOutcome: { title: outcome, industry: cluster },
      coursesBySemester: {},
      interests: [],
      pivotPoints: hasPivot
        ? [{ semester: "Junior Fall", fromMajor: m[0], toMajor: m[m.length - 1] }]
        : undefined,
      similarityScore: Math.max(score, 50),
      cluster,
    };
  });
}

export const CLUSTER_COLORS = clusterColors;

export const mockConstellationData: ConstellationData = (() => {
  const clusterDefs: { label: string; count: number; angle: number; dist: number }[] = [
    { label: "Health Policy", count: 12, angle: -0.4, dist: 0.28 },
    { label: "UX Research", count: 8, angle: 0.9, dist: 0.32 },
    { label: "Data Science", count: 11, angle: 2.0, dist: 0.25 },
    { label: "Biotech", count: 6, angle: 3.2, dist: 0.35 },
    { label: "Education", count: 9, angle: 4.5, dist: 0.28 },
    { label: "Finance", count: 4, angle: 5.4, dist: 0.3 },
  ];

  const clusters: Cluster[] = clusterDefs.map((def) => {
    const alumni = makeAlumni(def.label, def.count, 2024);
    return {
      id: def.label.replace(/\s/g, "-").toLowerCase(),
      label: def.label,
      alumni,
      topMajors: [...new Set(alumni.flatMap((a) => a.majors))].slice(0, 3),
      x: Math.cos(def.angle) * def.dist,
      y: Math.sin(def.angle) * def.dist,
    };
  });

  return {
    clusters,
    totalAlumni: clusters.reduce((s, c) => s + c.alumni.length, 0),
    summary: "50 alumni across 6 career clusters",
  };
})();

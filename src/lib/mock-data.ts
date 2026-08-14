import type { AlumniRecord, Cluster, ConstellationData, SavedPath, TransitionCard, TransitionSimulation } from "./types";

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

// Interest-to-cluster mapping for explore filters
const INTEREST_CLUSTERS: Record<string, string[]> = {
  "Biology": ["Health Policy", "Biotech"],
  "Public Health": ["Health Policy"],
  "Psychology": ["UX Research", "Education"],
  "Data Science": ["Data Science"],
  "Economics": ["Finance"],
};

export function filterConstellationData(
  data: ConstellationData,
  filters: { interests: string[]; careerArea: string; major: string; mode: "open" | "focused" },
): ConstellationData {
  let clusters = data.clusters;

  if (filters.mode === "focused") {
    // Focused mode: filter only by career area
    if (filters.careerArea) {
      const q = filters.careerArea.toLowerCase();
      clusters = clusters.filter((c) => c.label.toLowerCase().includes(q));
    }
  } else {
    // Open mode: all filters optional, apply any that are set
    if (filters.interests.length > 0) {
      const matched = new Set(filters.interests.flatMap((i) => INTEREST_CLUSTERS[i] || []));
      if (matched.size > 0) {
        clusters = clusters.filter((c) => matched.has(c.label));
      }
    }

    if (filters.careerArea) {
      const q = filters.careerArea.toLowerCase();
      clusters = clusters.filter((c) => c.label.toLowerCase().includes(q));
    }

    if (filters.major) {
      const q = filters.major.toLowerCase();
      clusters = clusters
        .map((c) => ({
          ...c,
          alumni: c.alumni.filter((a) => a.majors.some((m) => m.toLowerCase().includes(q))),
        }))
        .filter((c) => c.alumni.length > 0);
    }
  }

  const totalAlumni = clusters.reduce((s, c) => s + c.alumni.length, 0);
  return {
    clusters,
    totalAlumni,
    summary: `${totalAlumni} alumni across ${clusters.length} career clusters`,
  };
}

export function generateMockSimulation(fromMajor: string, toMajor: string): TransitionSimulation {
  const cardCount = 3 + Math.floor(Math.random() * 3);
  const totalTransitions = cardCount + 4 + Math.floor(Math.random() * 8);
  const pivotTimings = ["Sophomore Spring", "Junior Fall", "Junior Spring", "Sophomore Fall"];

  const outcomes = [
    `${toMajor} Researcher @ WHO`,
    `${toMajor} Analyst @ CDC`,
    `Senior ${toMajor} Specialist`,
    `${toMajor} Program Manager`,
    `${toMajor} Consultant @ Deloitte`,
  ];

  const cards: TransitionCard[] = Array.from({ length: cardCount }, (_, i) => {
    const pivotSem = pivotTimings[i % pivotTimings.length];
    return {
      isTopMatch: i === 0,
      classYear: 2024 - i,
      matchPercent: Math.round(94 - i * 4 - Math.random() * 3),
      fromMajor,
      toMajor,
      outcome: outcomes[i % outcomes.length],
      prePivotSummary: `Pre-pivot (${2 + i} semesters): ${fromMajor} 101, Stats, Intro ${fromMajor}`,
      timeline: [
        {
          semester: `${pivotSem} \u2014 PIVOT`,
          pivot: true,
          courses: [
            { name: `Intro ${toMajor}`, tag: "new" },
            { name: `${toMajor} Methods`, tag: "new" },
            { name: `Adv. ${fromMajor}`, tag: "dropped" },
          ],
        },
        {
          semester: "Junior Spring",
          pivot: false,
          courses: [
            { name: `${toMajor} Seminar`, tag: "new" },
            { name: `Applied ${toMajor}`, tag: null },
          ],
        },
        {
          semester: "Senior Year",
          pivot: false,
          courses: [
            { name: `${toMajor} Capstone`, tag: null },
            { name: "Research Thesis", tag: null },
          ],
        },
      ],
    };
  });

  return {
    totalTransitions,
    peakTiming: "sophomore and junior year",
    topOutcome: toMajor,
    topOutcomeCount: Math.ceil(totalTransitions * 0.4),
    cards,
  };
}

// Create Path page data

export const PATH_COLORS = ["#34D399", "#FBBF24", "#FB7185", "#A78BFA", "#67E8F9", "#F97316"];
export const PATH_COLORS_LIGHT = ["#059669", "#D97706", "#E11D48", "#7C3AED", "#0891B2", "#EA580C"];

export const MOCK_SAVED_PATHS: SavedPath[] = [
  {
    id: 1, match: 94, color: 0,
    major: "Biochem + Public Health",
    outcome: "Health Policy Analyst @ State Dept",
    classYear: 2022,
    courses: ["Bio 101", "Chem 101", "Organic Chem", "Intro PH", "Epidemiology", "Health Policy", "Biostatistics", "Community Health"],
    semesters: {
      Freshman: ["Bio 101", "Chem 101", "Intro Psych"],
      Sophomore: ["Organic Chem", "Physics", "Intro Public Health"],
      Junior: ["Epidemiology", "Health Policy", "Biostatistics"],
      Senior: ["Community Health", "Capstone: Health Equity"],
    },
    outcomeField: "Health Policy",
  },
  {
    id: 2, match: 91, color: 1,
    major: "Psychology + HCI",
    outcome: "UX Researcher @ Google",
    classYear: 2023,
    courses: ["Intro Psych", "Cognitive Psych", "Stats", "HCI", "User Research", "Design Thinking", "Data Viz"],
    semesters: {
      Freshman: ["Intro Psych", "Sociology 101", "Stats I"],
      Sophomore: ["Cognitive Psych", "Research Methods", "HCI Intro"],
      Junior: ["User Research", "Design Thinking", "Data Viz"],
      Senior: ["UX Capstone", "Cognitive Science Thesis"],
    },
    outcomeField: "UX Research",
  },
  {
    id: 3, match: 88, color: 2,
    major: "Stats + CS",
    outcome: "Data Scientist @ Spotify",
    classYear: 2021,
    courses: ["Calc I", "Stats I", "Intro CS", "Prob Theory", "ML", "Data Structures", "Applied ML", "Big Data"],
    semesters: {
      Freshman: ["Calc I", "Stats I", "Intro CS"],
      Sophomore: ["Calc II", "Prob Theory", "Data Structures"],
      Junior: ["ML", "Linear Algebra", "Applied Stats"],
      Senior: ["Applied ML", "Big Data", "CS Thesis"],
    },
    outcomeField: "Data Science",
  },
  {
    id: 4, match: 85, color: 3,
    major: "Biology + Business",
    outcome: "Biotech Startup Founder",
    classYear: 2020,
    courses: ["Bio 101", "Chem 101", "Genetics", "Molecular Bio", "Entrepreneurship", "Business Strategy"],
    semesters: {
      Freshman: ["Bio 101", "Chem 101", "Econ 101"],
      Sophomore: ["Genetics", "Organic Chem", "Intro Business"],
      Junior: ["Molecular Bio", "Entrepreneurship", "Marketing"],
      Senior: ["Business Strategy", "Biotech Seminar", "Startup Lab"],
    },
    outcomeField: "Biotech",
  },
  {
    id: 5, match: 82, color: 4,
    major: "Public Health + Econ",
    outcome: "Health Data Analyst @ McKinsey",
    classYear: 2021,
    courses: ["Econ 101", "Stats", "Intro PH", "Micro", "Health Economics", "Epidemiology", "Cost-Benefit"],
    semesters: {
      Freshman: ["Econ 101", "Stats I", "Sociology 101"],
      Sophomore: ["Micro", "Macro", "Intro Public Health"],
      Junior: ["Health Economics", "Epidemiology", "Econometrics"],
      Senior: ["Cost-Benefit in Health", "PH Capstone", "Consulting Practicum"],
    },
    outcomeField: "Health Economics",
  },
  {
    id: 6, match: 79, color: 5,
    major: "Economics + Public Health",
    outcome: "Policy Analyst @ Brookings",
    classYear: 2023,
    courses: ["Econ 101", "Stats", "Micro", "Macro", "Health Policy", "Public Policy", "Econometrics"],
    semesters: {
      Freshman: ["Econ 101", "Calc I", "Intro Political Sci"],
      Sophomore: ["Micro", "Macro", "Stats II"],
      Junior: ["Public Policy", "Health Policy", "Econometrics"],
      Senior: ["Policy Analysis", "Senior Thesis", "Research Methods"],
    },
    outcomeField: "Policy",
  },
];

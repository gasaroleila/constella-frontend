// Alumni and student data models — mirrors backend schema

export interface Course {
  id: string;
  name: string;
  semester: string;
  semesterIndex?: number;
  status?: "kept" | "new" | "dropped";
}

export interface CareerOutcome {
  title: string;
  org?: string;
  industry?: string;
  occupation?: string;
  region?: string;
  provenance?: string;
}

export interface Program {
  code: string;
  role: string;
  provenance: string;
}

export interface PivotPoint {
  semester: string;
  fromMajor: string;
  toMajor: string;
}

export interface AlumniRecord {
  id: string;
  graduationYear: number;
  majors: string[];
  minors?: string[];
  careerOutcome: CareerOutcome;
  coursesBySemester: Record<string, Course[]>;
  interests: string[];
  pivotPoints?: PivotPoint[];
  similarityScore: number;
  cluster: string;
  matchReason?: string;
  programs?: Program[];
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  schoolId?: string;
  currentYear: string;
  declaredMajor?: string;
  minors?: string[];
  coursesCompleted: Course[];
  interests: string[];
}

export interface Cluster {
  id: string;
  label: string;
  similarity?: number;
  alumni: AlumniRecord[];
  topMajors: string[];
  x: number;
  y: number;
}

export interface ClusterEdge {
  source: string;
  target: string;
  weight: number;
}

export interface ConstellationData {
  student?: { year: string; interests: string[]; courses: string[] };
  clusters: Cluster[];
  clusterEdges?: ClusterEdge[];
  totalAlumni: number;
  summary: string;
  meta?: {
    cached: boolean;
    generatedAt: string;
    totalCandidates: number;
    returned: number;
    edgesBeforePruning?: number;
  };
}

// Saved path for Create Path page

export interface SavedPath {
  id: number;
  match: number;
  color: number;
  major: string;
  outcome: string;
  classYear: number;
  courses: string[];
  semesters: Record<string, string[]>;
  outcomeField: string;
}

// Transition page card types

export interface TransitionCourse {
  name: string;
  tag: "kept" | "new" | "dropped" | null;
}

export interface TransitionTimelineEntry {
  semester: string;
  pivot: boolean;
  courses: TransitionCourse[];
}

export interface TransitionCard {
  id: string;
  isTopMatch: boolean;
  classYear: number;
  matchPercent: number;
  fromMajor: string;
  toMajor: string;
  pivotSemester?: string;
  pivotType?: string;
  careerOutcome: CareerOutcome;
  prePivotSummary: string;
  timeline: TransitionTimelineEntry[];
}

export interface TransitionSimulation {
  fromMajor: string;
  toMajor: string;
  totalTransitions: number;
  peakTiming: string;
  topOutcome: string;
  topOutcomeCount: number;
  cards: TransitionCard[];
}

// Dashboard

export interface DashboardStats {
  alumniMatches: number;
  clusters: number;
  highestMatch: number;
  savedPaths: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  topMatches: AlumniRecord[];
  meta?: { cached: boolean; generatedAt: string };
}

// Activity

export interface ActivityItem {
  id: number;
  kind: string;
  label: string;
  at: string;
}

// Search

export interface SearchResult {
  type: "major" | "cluster" | "alumnus";
  id: string;
  label: string;
  detail: string | null;
  count: number | null;
  provenance: string | null;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

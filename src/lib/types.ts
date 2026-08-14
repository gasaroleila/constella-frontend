// Alumni and student data models — mirrors backend schema

export interface Course {
  id: string;
  name: string;
  semester: string;
  status?: "kept" | "new" | "dropped";
}

export interface AlumniRecord {
  id: string;
  graduationYear: number;
  majors: string[];
  minors?: string[];
  careerOutcome: {
    title: string;
    industry: string;
  };
  coursesBySemester: Record<string, Course[]>;
  interests: string[];
  pivotPoints?: PivotPoint[];
  similarityScore: number;
  cluster: string;
}

export interface PivotPoint {
  semester: string;
  fromMajor: string;
  toMajor: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  currentYear: string;
  declaredMajor?: string;
  coursesCompleted: Course[];
  interests: string[];
}

export interface Cluster {
  id: string;
  label: string;
  alumni: AlumniRecord[];
  topMajors: string[];
  x: number;
  y: number;
}

export interface ConstellationData {
  clusters: Cluster[];
  totalAlumni: number;
  summary: string;
}

export interface SimulationQuery {
  fromMajor: string;
  toMajor: string;
}

export interface SimulationResult {
  constellation: ConstellationData;
  summary: string;
  totalTransitions: number;
  peakPivotTiming: string;
}

// Transition page card types

export interface TransitionCourse {
  name: string;
  tag: "new" | "dropped" | null;
}

export interface TransitionTimelineEntry {
  semester: string;
  pivot: boolean;
  courses: TransitionCourse[];
}

export interface TransitionCard {
  isTopMatch: boolean;
  classYear: number;
  matchPercent: number;
  fromMajor: string;
  toMajor: string;
  outcome: string;
  prePivotSummary: string;
  timeline: TransitionTimelineEntry[];
}

export interface TransitionSimulation {
  totalTransitions: number;
  peakTiming: string;
  topOutcome: string;
  topOutcomeCount: number;
  cards: TransitionCard[];
}

// API client for backend integration
// Backend: FastAPI server (see docs/backend.md)

import type {
  ConstellationData,
  StudentProfile,
  TransitionSimulation,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Auth
export async function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return request<{ token: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Student profile
export async function getProfile(token: string) {
  return request<StudentProfile>("/me", {
    headers: authHeaders(token),
  });
}

// Cohort matching — constellation data
export async function explore(
  token: string,
  params: { interests?: string[]; careerArea?: string; major?: string },
) {
  const query = new URLSearchParams();
  if (params.interests?.length)
    query.set("interests", params.interests.join(","));
  if (params.careerArea) query.set("career_area", params.careerArea);
  if (params.major) query.set("major", params.major);

  return request<ConstellationData>(`/explore?${query}`, {
    headers: authHeaders(token),
  });
}

// What If simulator
export async function simulate(
  token: string,
  query: { fromMajor: string; toMajor: string },
) {
  return request<TransitionSimulation>("/simulate", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(query),
  });
}

// Dashboard stats
export interface DashboardStats {
  alumniMatches: number;
  clustersExplored: number;
  highestMatch: number;
  savedPaths: number;
}

export async function getDashboardStats(token: string) {
  return request<DashboardStats>("/dashboard/stats", {
    headers: authHeaders(token),
  });
}

// API client for backend integration
// Backend: FastAPI server (see docs/backend.md)

import type {
  ConstellationData,
  DashboardResponse,
  StudentProfile,
  TransitionSimulation,
  ActivityItem,
  SearchResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ETag cache for conditional requests
const etagCache = new Map<string, string>();

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Send ETag for conditional requests on GET
  const method = options?.method ?? "GET";
  if (method === "GET") {
    const etag = etagCache.get(url);
    if (etag) headers.set("If-None-Match", etag);
  }

  const res = await fetch(url, { ...options, headers });

  // Store ETag from response
  const responseEtag = res.headers.get("ETag");
  if (responseEtag) etagCache.set(url, responseEtag);

  if (res.status === 304) {
    // Not modified — caller should use cached data
    return undefined as T;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Schools (public)
export interface School {
  id: string;
  name: string;
}

export async function getSchools() {
  return request<School[]>("/api/students/schools");
}

// Auth
export async function login(email: string, password: string) {
  return request<{ token: string; student: StudentProfile }>("/api/students/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  schoolId: string;
  year?: string;
}) {
  return request<{ token: string; student: StudentProfile }>("/api/students/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Student profile
export async function getProfile(token: string) {
  return request<StudentProfile>("/api/students/me", {
    headers: authHeaders(token),
  });
}

// Cohort matching — constellation data
export async function explore(
  token: string,
  params: { interests?: string[]; careerArea?: string; major?: string; maxAlumni?: number; refresh?: boolean },
) {
  const query = new URLSearchParams();
  if (params.interests?.length)
    query.set("interests", params.interests.join(","));
  if (params.careerArea) query.set("careerArea", params.careerArea);
  if (params.major) query.set("major", params.major);
  if (params.maxAlumni) query.set("maxAlumni", String(params.maxAlumni));
  if (params.refresh) query.set("refresh", "true");

  return request<ConstellationData>(`/api/constellation?${query}`, {
    headers: authHeaders(token),
  });
}

// What If simulator
export async function simulate(
  token: string,
  query: { fromMajor: string; toMajor: string; topN?: number },
) {
  return request<TransitionSimulation>("/api/simulate", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(query),
  });
}

// Dashboard
export async function getDashboard(token: string) {
  return request<DashboardResponse>("/api/students/me/dashboard", {
    headers: authHeaders(token),
  });
}

// Activity feed
export async function getActivity(token: string, limit = 20) {
  return request<ActivityItem[]>(`/api/students/me/activity?limit=${limit}`, {
    headers: authHeaders(token),
  });
}

// Search
export async function search(token: string, q: string) {
  return request<SearchResponse>(`/api/search?q=${encodeURIComponent(q)}`, {
    headers: authHeaders(token),
  });
}

# Constella - Backend Spec

## Matching & Similarity Logic

### Similarity Score

The similarity score is a weighted calculation. **Course overlap is the primary signal** — an alumnus who took the same classes as you before they pivoted is the strongest match, because their transition path is directly applicable to your current position.

**Score formula:**

| Factor | Weight | What it measures |
|---|---|---|
| Course overlap | 50% | Percentage of the student's current courses that appear in the alumnus's pre-pivot transcript. More shared courses = higher score. |
| Pivot year alignment | 20% | How closely the alumnus's pivot timing matches the student's current year. A sophomore seeing alumni who pivoted as sophomores scores higher than those who pivoted as seniors. |
| From/To major match | 20% | How closely the alumnus's origin and destination majors align with the student's current major and intended direction (if specified). |
| Interest/activity overlap | 10% | Shared interests, clubs, or extracurriculars. Lightweight tiebreaker, not a primary signal. |

**Course overlap calculation:**

```
course_overlap = (courses in common between student and alumnus pre-pivot) / (total student courses)
```

This is directional — it measures what percentage of *your* courses the alumnus also took, not the other way around. An alumnus who took 40 courses and shares 8 with you is just as relevant as one who took 15 and shares 8.

### Ranking

1. Compute similarity score for all alumni who match the student's pivot query (or broad explore query)
2. Rank by score descending
3. Return top 5 for the What If Simulator, top 50-200 for the Cohort Matching constellation (pre-clustered by career outcome)

### Clustering (for constellation view)

Alumni are grouped into clusters by career outcome before being sent to the frontend. Clustering happens server-side so the frontend only renders pre-assigned groups, not raw data.

### Data Model

**Student profile (input):**
- Courses completed (with semester)
- Current year
- Declared/undeclared major
- Interests (optional)
- Pivot query: from/to major or career area (for What If mode)

**Alumni record:**
- Courses taken by semester
- Major(s) declared + change dates
- Graduation year
- Career outcome (title, industry)
- Interests/extracurriculars
- Pivot points (if any): when they changed, from what, to what

---

## Tech Stack

### PostgreSQL (database)

Primary data store. Alumni data is inherently relational — students have courses, courses belong to semesters, alumni have majors and outcomes. Postgres handles this naturally. Use array columns and `pg_trgm` for efficient course overlap queries.

### Python + FastAPI (API layer)

Lightweight async API framework. The similarity scoring and clustering logic is computational work — Python handles it well with NumPy for the scoring math and pandas for data wrangling. FastAPI is fast to build and doesn't bottleneck on concurrent requests.

### Redis (cache layer)

Stores pre-computed similarity scores and cluster assignments. Alumni data doesn't change on every request — it changes when new alumni records come in. Pre-compute the heavy work in background jobs and cache the results. This is what keeps the constellation loading fast.

### Data Flow

```
PostgreSQL (raw alumni + student data)
    ↓
Background job (computes similarity scores + clusters)
    ↓
Redis (cached results: scored alumni, cluster assignments)
    ↓
FastAPI (serves pre-computed results to frontend)
    ↓
Frontend (renders constellation)
```

Background jobs re-run when new alumni data is added or a student's profile changes (new courses, new semester). Not on every page load.

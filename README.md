# Constella Student Portal

**Live demo:** [constella-view.vercel.app](https://constella-view.vercel.app)

Constella turns anonymized alumni transcript data into an interactive discovery tool for students. Instead of generic advising, students see what real alumni from their school actually did -the majors they chose, the pivots they made, and where they ended up.

## The Problem

43% of students change their major at least once, and most do it with zero visibility into outcomes. Advisors give the same guidance to everyone. Students can't see what a Biology-to-Public-Health switch actually looks like semester by semester, or what careers came out of it. Pivots feel like gambles because there's no precedent to follow.

## What Constella Does

Constella takes a school's course and outcome data, clusters alumni by similarity, and gives students three tools to explore it:

- **Explore** -A constellation graph of every alumni path at the school. Each node is an alumnus, each cluster is a career outcome area. Students are matched to alumni who share their courses, interests, and trajectory. Click any star to see the full journey.

- **Transition** -A what-if simulator. Enter a major switch (e.g. Economics to Public Health) and see the top 5 most similar alumni who made that move. Semester-by-semester: bridge courses added, courses dropped, and career outcomes post-pivot.

- **Create Path** -No single alumnus matches perfectly? Pull elements from multiple alumni journeys -courses from one, a career pivot from another -and assemble a custom path.

## How Matching Works

Students are matched to alumni using five signals:

1. Course overlap (shared coursework)
2. Declared/intended major
3. Interest tags
4. Career cluster proximity
5. Pivot history similarity

The backend clusters alumni using these signals and returns ranked matches per student profile.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, D3.js, Zustand |
| Backend | Python FastAPI, PostgreSQL, Redis |
| Deployment | Vercel (frontend), Railway (backend) |

## Running Locally

```bash
cd app
npm install
npm run dev
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Open [localhost:3000](http://localhost:3000).

## Architecture

```
app/src/
  app/
    (marketing)/     Landing page
    (auth)/          Login, signup
    (dashboard)/     Explore, Transition, Create Path, Dashboard
  components/
    constellation/   D3 constellation graph renderer
    landing/         Landing page sections (demo, tool explorer)
    ui/              Shared UI components
  lib/
    api.ts           Backend API client
    types.ts         Shared TypeScript types
  stores/            Zustand state management
```

## Data Privacy

All alumni data is anonymized. No real names are shown. The platform is designed to be FERPA-compliant -students see patterns and paths, never personally identifiable information.

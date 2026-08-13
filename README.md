# Constella

Student discovery platform that helps students explore real alumni paths from their school. Students see what alumni in their position actually did — the majors they chose, the pivots they made, and where they ended up.

## Core Features

- **Cohort Matching** — Interactive constellation graph showing alumni matched by course overlap, interests, and career outcomes
- **What If Simulator** — Simulate a major pivot and see semester-by-semester transition paths from real alumni who made the same move

## Tech Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, D3.js, Zustand

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.local.example` or create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

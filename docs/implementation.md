# Constella Frontend - Implementation Doc

Created: August 12, 2026, 10:48 PM

---

## Tech Stack

| Layer         | Choice                  | Why                                                                                      |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router) | File-based routing, SSR for landing/SEO, client components for interactive constellation |
| Styling       | Tailwind CSS 4          | Utility-first, design tokens map directly to CSS variables from mockups                  |
| Visualization | D3.js                   | Force-directed graph layout, zoom/pan, cluster expansion per spec                        |
| State         | Zustand                 | Lightweight store for constellation state, auth tokens, What If mode                     |
| Language      | TypeScript              | Type safety across data models shared with backend                                       |

## Project Structure

```
app/                          # Next.js project root
  src/
    app/
      layout.tsx              # Root layout (html/body, global font)
      globals.css             # Design tokens, Tailwind config
      (marketing)/
        page.tsx              # Landing page (/)
      (auth)/
        layout.tsx            # Split-screen auth layout
        login/page.tsx        # /login
        signup/page.tsx       # /signup
      (dashboard)/
        layout.tsx            # Sidebar + topbar layout
        dashboard/page.tsx    # /dashboard — stats, preview, activity
        explore/page.tsx      # /explore — filter sidebar + constellation + detail panel
        transition/page.tsx   # /transition — What If simulator with card results
        saved/page.tsx        # /saved — bookmarked alumni paths
        settings/page.tsx     # /settings — profile & preferences
    components/
      ui/                     # Shared primitives (buttons, inputs, modals)
      constellation/          # D3 constellation renderer, cluster nodes
      auth/                   # Auth form logic (client components)
      layout/
        sidebar.tsx           # App sidebar with nav items + user profile
        topbar.tsx            # Search box, theme toggle, notifications
    lib/
      api.ts                  # Typed API client for backend
      types.ts                # Shared TypeScript interfaces
    hooks/                    # Custom hooks (useAuth, useConstellation, etc.)
  .env.local                  # NEXT_PUBLIC_API_URL
```

Route groups keep layouts separate:

- `(marketing)` — no sidebar, public
- `(auth)` — split-screen layout, public
- `(dashboard)` — sidebar + topbar, auth-required

## Design Tokens

All CSS variables from the HTML mockups are mapped to Tailwind theme tokens in `globals.css`. The palette:

| Token              | Value                      | Use                 |
| ------------------ | -------------------------- | ------------------- |
| `space`          | `#04060F`                | Page background     |
| `space-raised`   | `#0B0E1C`                | Cards, sidebar      |
| `space-card`     | `#10132A`                | Elevated cards      |
| `indigo`         | `#3E43AD`                | Primary action      |
| `indigo-bright`  | `#5B60E8`                | Hover states, links |
| `text-primary`   | `rgba(255,255,255,0.92)` | Body text           |
| `text-secondary` | `rgba(255,255,255,0.55)` | Labels, muted text  |
| `text-tertiary`  | `rgba(255,255,255,0.3)`  | Placeholders        |

Light theme support is designed in the mockups but deferred — dark theme ships first.

## Pages

### Landing (`/`)

Static marketing page. Server component. Links to `/signup` and `/login`. Matches `design/landing-page-v2.html`.

### Auth (`/login`, `/signup`)

Client components for form interactivity. Google OAuth button (wired to backend OAuth flow). Split-screen layout with constellation animation on the right panel. Matches `design/auth.html`.

### Dashboard (`/dashboard`)

Home view after login. Contains:

- Greeting with user name
- Stats row: Alumni Matches, Clusters Explored, Highest Match, Saved Paths
- Constellation preview card with "Open Full View" link
- Quick actions grid (Explore, Simulate, Update Profile, Saved Paths)
- Top Matches list with similarity percentages
- Recent Activity feed with timeline dots

Matches `design/dashboard.html` — Dashboard page section.

### Explore (`/explore`)

Three-panel layout filling the viewport:

1. **Left filter sidebar** (300px) — Open/Focused mode toggle, year, interest tags, career area input, major filter input, "Explore Constellation" button
2. **Constellation canvas** (flex) — D3 force-directed graph with floating legend overlay showing cluster colors and counts
3. **Alumni detail panel** (340px) — slides in from right with header (match %, class year, major, outcome), vertical timeline with semester nodes and course pills, activities section

Each cluster has a distinct color: indigo (you), green (Health Policy), amber (UX Research), rose (Data Science), purple (Biotech), cyan (Education).

Matches `design/dashboard.html` — Explore page section.

### Transition (`/transition`)

Separate page for the What If Simulator. Contains:

- Input card: "Currently In" and "Switch To" fields with arrow and Simulate button
- Summary bar: accent background showing count, peak timing, top outcome
- Transition cards grid: each card shows class year, match %, from/to major, outcome, collapsed pre-pivot summary, then expanded timeline from pivot onward with course pills
- Top match card has accent border + "Closest Match" badge

Matches `design/dashboard.html` — Transition page section.

### Saved Paths (`/saved`)

Placeholder. Will show bookmarked alumni paths.

### Settings (`/settings`)

Placeholder. Profile and preferences management.

## Sidebar Navigation

5 items matching the design:

| Nav Item    | Route           | Icon    |
| ----------- | --------------- | ------- |
| Dashboard   | `/dashboard`  | Grid    |
| Explore     | `/explore`    | Compass |
| Transition  | `/transition` | Arrows  |
| Saved Paths | `/saved`      | Star    |
| Settings    | `/settings`   | Gear    |

Active state: indigo background + bright text. User avatar + name + school at sidebar bottom.

## Topbar

- Dynamic page title based on route
- Search box (text input with search icon)
- Theme toggle button (moon/sun)
- Notification bell button

## Constellation Rendering Plan

### Layer 1: Overview

- Student node centered, accent-colored (indigo)
- Alumni clusters surround it, each with a distinct color
- Clusters positioned by similarity (closer = stronger match)
- Clusters labeled by career outcome
- Hover on cluster: tooltip with count + top majors
- Click cluster: transitions to Layer 2
- Floating legend overlay at bottom-left

### Layer 2: Cluster Expansion

- Clicked cluster expands, others fade/shrink
- Individual alumni nodes become selectable
- Each node shows label: Major(s) | Career Outcome
- Node size reflects similarity score
- Back arrow or click-outside returns to overview

### Layer 3: Alumni Detail Panel (340px)

- Slides in from right, constellation area adjusts
- Header: match badge, class year badge, major, career outcome
- "Back to constellation" link
- Vertical timeline with:
  - Circle nodes for regular semesters
  - Diamond node (rotated square) for pivot semester in indigo
  - Course pills: neutral for regular, indigo for `[new]`, strikethrough+dimmed for `[dropped]`
  - Pivot semester label in indigo-bright
- Activities section at bottom with pill tags
- Close via back button, Escape key, or clicking constellation area

### D3 Implementation

- `d3-force` for node positioning within clusters
- `d3-zoom` for pan/zoom on the canvas
- Cluster positions pre-computed by backend — frontend places them
- Transitions animated with D3 transitions (expand, fade, slide)
- Canvas-based rendering for performance with 50-200 nodes

## Backend Integration

### API Contract

The frontend expects a FastAPI backend at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).

| Endpoint         | Method | Purpose                 | Request                                      | Response              |
| ---------------- | ------ | ----------------------- | -------------------------------------------- | --------------------- |
| `/auth/login`  | POST   | Login                   | `{ email, password }`                      | `{ token }`         |
| `/auth/signup` | POST   | Register                | `{ firstName, lastName, email, password }` | `{ token }`         |
| `/auth/google` | GET    | Google OAuth redirect   | —                                           | Redirect              |
| `/me`          | GET    | Get student profile     | Bearer token                                 | `StudentProfile`    |
| `/explore`     | GET    | Cohort matching results | `?interests=...&career_area=...&major=...` | `ConstellationData` |
| `/simulate`    | POST   | What If simulation      | `{ fromMajor, toMajor }`                   | `SimulationResult`  |

### Data Flow

```
Student opens /explore
  -> Frontend calls GET /explore with filters
  -> Backend queries PostgreSQL, computes similarity scores
  -> Backend clusters alumni by career outcome
  -> Returns pre-computed ConstellationData (clusters + scored alumni)
  -> Frontend renders D3 constellation from cluster positions

Student clicks alumni node
  -> Full alumni record already in ConstellationData payload
  -> Panel renders client-side, no additional API call

Student opens /transition and simulates
  -> Frontend calls POST /simulate with from/to majors
  -> Backend returns SimulationResult (transition cards + summary)
  -> Frontend renders transition cards with timelines
```

### Auth Flow

- JWT-based. Token stored in Zustand + httpOnly cookie
- All `/explore` and `/simulate` requests include `Authorization: Bearer <token>`
- Google OAuth: frontend redirects to `/auth/google`, backend handles OAuth flow, redirects back with token
- Dashboard routes protected via middleware or layout-level auth check

### Key Types (shared with backend)

Types are defined in `src/lib/types.ts`. The backend (Python) should produce JSON matching these shapes:

- `AlumniRecord` — one alumnus with courses, majors, career outcome, similarity score, cluster assignment
- `Cluster` — group of alumni with label, position, top majors
- `ConstellationData` — full response for constellation render (array of clusters)
- `SimulationResult` — constellation data + summary text + transition count

### What the backend must pre-compute

1. **Similarity scores** — per alumni, relative to the requesting student's profile
2. **Cluster assignments** — group alumni by career outcome, assign x/y positions
3. **Pivot detection** — identify semester where major changed, tag courses as new/dropped
4. **Top 5 ranking** — for What If mode, rank transitions by similarity score

## Build Order

### Phase 1: Static Shell (done)

- [X] Project scaffolding (Next.js + Tailwind + TypeScript)
- [X] Route structure with layouts (dashboard, explore, transition, saved, settings)
- [X] Dashboard layout: sidebar (5 nav items + user profile) + topbar (search, theme, notifications)
- [X] Dashboard home page (stats, preview, matches, activity)
- [X] Explore page (filter sidebar + constellation placeholder + detail panel)
- [X] Transition page (input card + summary bar + transition cards with timelines)
- [X] Saved/Settings placeholder pages
- [X] Design tokens
- [X] API client + types

### Phase 2: Landing Page

Full rebuild to match `design/landing-page-v2.html`:

- [X] Fixed nav with scroll blur, nav links (Features, How It Works), theme toggle button
- [X] Two-column hero: badge, emphasized headline, sub-text, two CTAs (primary + ghost), trust avatars with count
- [X] Stats bar (68+ paths, 7 clusters, 92% accuracy, 4.8 rating)
- [X] Problem section: lead text with highlighted stat, 3 problem cards with icons
- [X] Solution section: "How Constella Works" headline, browser mockup with constellation placeholder
- [X] Feature section: Cohort Matching (two-column, text + bullets left, visual right)
- [X] Feature section: What If Simulator (reversed two-column, simulator card mockup)
- [X] Feature section: Alumni Timeline (timeline mockup visual)
- [X] How It Works: 3 steps with numbered circles and connecting line
- [X] Testimonials grid (3 cards with stars, quotes, authors)
- [X] Trust bar (icons with labels)
- [X] Final CTA section with radial glow
- [X] Footer: multi-column with brand, Product/Company/Legal links, copyright

### Phase 3: Auth Pages (done)

Match `design/auth.html`:

- [X] Google OAuth button with icon
- [X] Mode toggle (Sign Up / Log In) with active state styling
- [X] Password visibility toggle button
- [X] Forgot password link on login view
- [X] Terms of service and privacy policy links
- [ ] Visual panel: canvas constellation animation with floating nodes and cluster labels (deferred to Phase 4)
- [X] Visual panel: tagline, subtitle, and stats (68+ paths, 7 clusters, 92% accuracy)

### Phase 4: Constellation Rendering (done)

- [X] D3 force-directed graph rendering in explore page canvas
- [X] Cluster visualization with distinct colors and labels
- [X] Zoom/pan controls
- [X] Click-to-expand cluster interaction (Layer 1 -> Layer 2)
- [X] Alumni node hover tooltips (graduation year, similarity %)
- [X] Alumni detail panel show/hide on node click (Layer 3)
- [X] Constellation preview on dashboard page
- [X] Constellation canvas in landing page hero + solution mockup + auth panel

### Phase 5: Interactivity

- [ ] Explore filter sidebar wired to constellation (Open/Focused mode, interest tags, inputs)
- [ ] Transition page: functional pivot input with simulate action
- [ ] Transition page: dynamic card rendering from simulation results
- [ ] Saved paths: save/unsave alumni from detail panel
- [ ] Panel content swapping (click different node without closing)

### Phase 6: Backend Integration

- [ ] Auth flow (login/signup/Google OAuth)
- [ ] Protected routes (middleware or layout guard)
- [ ] Wire explore page to GET /explore
- [ ] Wire transition page to POST /simulate
- [ ] Wire dashboard stats from backend
- [ ] Loading states and error handling

### Phase 7: Polish

- [ ] Light theme support (toggle in topbar and landing nav)
- [ ] Mobile responsive (sidebar collapse, constellation as list, panel from bottom, landing stacks)
- [ ] Animations (panel slide, cluster expand/collapse, page transitions)
- [ ] Nav scroll blur effect on landing page
- [ ] Search functionality in topbar

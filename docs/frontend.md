Constellation Map - Frontend Spec

## Overview

The constellation map is the primary UI for the Cohort Matching Engine. Students see their matched alumni as stars in an interactive graph, clustered by career outcome. The entire experience has three interaction layers: overview, cluster expansion, and alumni detail modal.

---

## Layer 1: Constellation Overview

The default view when results load.

- **Student node** at the center, visually distinct (larger, different color/glow)
- **Alumni clusters** surround it, positioned by similarity — closer clusters are stronger matches
- Each cluster is a tight group of star nodes with a label ("Health Policy," "UX Research," "Biotech Startups")
- Cluster size (number of stars) reflects how many alumni landed in that outcome
- Subtle connecting lines between clusters that share common majors

**Interactions:**

- Hover on a cluster: shows a tooltip with count and top majors ("12 alumni | Top majors: Biochem, Public Health")
- Click a cluster: transitions to Layer 2
- Zoom and pan enabled across the full constellation

---

## Layer 2: Cluster Expansion

When a student clicks a cluster, it expands in place. The other clusters fade/shrink to the periphery.

- Stars in the cluster spread apart so each node is individually selectable
- Each expanded node shows a short label: `Major(s) | Career Outcome`
- Nodes are sized by similarity score to the student — closer matches appear larger
- A back arrow or click-outside returns to the full constellation overview

**Interactions:**

- Hover on a node: tooltip with graduation year and similarity percentage
- Click a node: opens Layer 3 (alumni detail modal)

---

## Layer 3: Alumni Detail Panel

A side panel that slides in from the right. The constellation stays fully visible and interactive on the left.

### Panel layout

**Header section** at the top:

- Class year, similarity score, final major(s), career outcome
- Anonymized — no real names (e.g. "Class of 2022," not "John Smith")

**Vertical timeline** below the header:

- A single vertical line runs down the left side of the modal
- Each semester is a node (circle) on the line
- To the right of each node: semester label and course cards

```
Header:
  Class of 2022 | 92% match
  Biochemistry + Public Health (double major)
  Health Policy Analyst @ State Health Dept

Timeline:

  ●  Freshman Fall
  │    Bio 101 · Chem 101 · Intro Psych
  │
  ●  Freshman Spring
  │    Chem 102 · Physics I · Sociology 101
  │
  ●  Sophomore Fall
  │    Organic Chem · Intro to Public Health [new]
  │
  ◆  Sophomore Spring  ← PIVOT
  │    Health Policy [new] · Epidemiology [new]
  │    Physics II [dropped]
  │
  ●  Junior Fall
  │    Biostatistics · Community Health
  │
  ●  Junior Spring
  │    Senior Thesis: Health Equity
  │
  ●  Senior Fall
  │    Capstone · Internship: State Health Dept
  │
  ●  Senior Spring
       Graduated

  Interests & Activities:
  Global Health Club · Public Health Internship (Summer '21)
```

### Timeline design details

- **Line:** Thin vertical line in muted color, running continuously down the left
- **Semester nodes:** Small circles on the line. Default color for regular semesters. Accent-colored diamond (◆) for the pivot semester.
- **Course tags:** Each course is a small pill/chip to the right of its semester node. Regular courses in neutral color. New bridge courses tagged `[new]` in accent color. Dropped courses tagged `[dropped]` in muted/strikethrough style.
- **Pivot marker:** The pivot semester gets a diamond node, an accent-colored label ("PIVOT"), and a subtle background highlight across its row.
- **Scrollable:** Timeline scrolls vertically within the modal if it exceeds the viewport height.
- **Interests & activities** at the bottom: clubs, research, internships — shown as pills below the timeline.
- **No real names displayed** — alumni are anonymized
- Close modal via X button, clicking outside, or Escape key

### Panel behavior

- Slides in from the right edge, taking up ~40% of the screen width
- Constellation compresses to the left ~60% but remains fully interactive — student can click other alumni nodes to swap the panel content without closing it
- Smooth slide-in animation
- Closing the panel (X button, Escape key, or clicking the constellation area) expands the graph back to full width
- Closing returns to the expanded cluster view (Layer 2)

---

## What If Simulator

The What If Simulator is a mode within the constellation view, not a separate page. Students toggle into it to simulate a pivot and see alumni who made the same move.

### Entry point

A persistent **"What if I switch?"** button sits in the top bar of the constellation view (next to the explore search/filters). Clicking it opens the simulator input inline — no page change, no modal.

### Step 1: Pivot Input Bar

A horizontal input bar slides down below the top bar. Two fields, styled as dropdowns with search:

```
┌─────────────────────────────────────────────────────────┐
│  I'm currently in  [  Economics  ▼]   →   What if I     │
│  switch to          [  Public Health  ▼]   [Simulate]   │
└─────────────────────────────────────────────────────────┘
```

- **"I'm currently in"** — auto-filled from the student's profile if they have a declared major. Editable dropdown with search (lists all majors/programs at their school).
- **"What if I switch to"** — dropdown with search. Includes majors, minors, and independent/custom major options.
- **Simulate button** — triggers the query.

The bar is compact and conversational — reads like a sentence, not a form. One line, two inputs, one button.

### Step 2: Results — Constellation Re-renders

After clicking Simulate, the constellation re-renders showing only alumni who made that transition (or a similar one). The view changes:

- **Summary bar** appears below the pivot input: "12 alumni switched from Economics → Public Health. Most pivoted in sophomore or junior year."
- **Constellation shows transition clusters** — alumni grouped by career outcome *after* their pivot. Same interaction model as the main constellation (click cluster → expand → click node → side panel).
- **Top 5 badge** — the 5 most relevant transitions are visually marked (slightly larger nodes, accent border) so students can spot them immediately without clicking every node.

### Step 3: Side Panel (Transition View)

Clicking an alumni node in What If mode opens the same right-side panel, but the timeline is **focused on the transition**:

- Semesters before the pivot are collapsed into a summary line: "Pre-pivot: Econ 101, Stats, Micro, Macro (4 semesters)"
- The pivot semester is expanded and highlighted with the diamond marker
- Post-pivot semesters show the full detail: bridge courses `[new]`, dropped courses `[dropped]`, new major courses
- Career outcome at the bottom

This keeps the panel scannable — students care about *how the pivot worked*, not the alumnus's entire freshman year.

```
Panel in What If mode:

  Class of 2021 | 88% match
  Economics → Public Health
  Health Policy Researcher @ WHO

  Pre-pivot (4 semesters):
    Econ 101 · Stats · Micro · Macro · Econometrics...

  ◆  Junior Fall  ← PIVOT
  │    Intro to Public Health [new] · Epidemiology [new]
  │    Advanced Econometrics [dropped]
  │
  ●  Junior Spring
  │    Health Policy [new] · Biostatistics [new]
  │    Kept: Stats II
  │
  ●  Senior Fall
  │    Community Health · Global Health Seminar
  │
  ●  Senior Spring
       Capstone: Health Equity Research
       Graduated

  Interests & Activities:
  Global Health Club · WHO Internship (Summer '20)
```

### Exiting What If mode

- Click the **X** on the pivot input bar, or click **"Back to Explore"**
- Constellation smoothly re-renders back to the student's original cohort matching view
- No state is lost — the student's explore results are still there

---

## Visual Design Notes

- **Color palette:** Clean light background (white or very light gray). Nodes in a neutral dark tone (charcoal/slate). One accent color used sparingly for the student's center node, pivot markers, and new-course tags. Cluster labels in dark gray.
- **Aesthetic:** Minimal and professional. No glow effects, no starfield textures. Thin lines, clean typography, generous whitespace. Should feel like a well-designed tool, not a visualization gimmick.
- **Nodes:** Simple filled circles, no gradients or shadows. Size communicates similarity score. The student's node is the accent color; everything else is neutral.
- **Pivot highlighting in panel:** Accent color on the diamond node and `[new]` course tags. Dropped courses in light gray with strikethrough. Nothing else highlighted.
- **Animation:** Subtle and functional — smooth transitions on cluster expand/collapse and panel slide. No floating, drifting, or ambient motion.
- **Responsive:** Constellation fills the viewport on desktop. On mobile, clusters stack vertically as a scrollable list with the same expand and side panel behavior (panel slides up from bottom on mobile).

---

## Tech Stack

- **D3.js** — force-directed graph layout, zoom/pan, cluster expansion animations
- **React** — modal component, state management for layer transitions
- **Backend pre-computation** — similarity scores and cluster assignments are computed server-side. Frontend receives 50-200 nodes per query, not raw alumni data.

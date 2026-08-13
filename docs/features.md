# Constella - Core Features

**Mission:** Help students discover the path worth taking — before they ever need a tool to complete it.

**Data asset:** School-specific alumni outcome data (majors, courses, career outcomes, pivots). Every feature is powered by this. If it doesn't use this data, it doesn't belong here.

---

## 1. Cohort Matching Engine

**What it does:** Takes a student's profile — interests, courses taken so far, year — and surfaces alumni who had a similar early trajectory at their school. Shows where those alumni ended up, what they studied, and the non-obvious combinations they pursued.

**How it works:** The student provides inputs — interests, courses taken, year — and the system matches them to alumni with similar profiles. The results appear as an interactive constellation graph (see UI section below). Two entry points, same matching logic:

- **Open explore** — Student inputs their interests and current courses. Matching is broad, surfacing a wide range of alumni paths including non-obvious combinations (CS + Art, Anthropology + Data Science) and programs they didn't know existed.
- **Focused explore** — Student adds a specific filter: a career area, major, or industry they're curious about. Same matching logic, just narrower results. This gives the backend fewer dimensions to match on, making it a lighter query.

Both produce the same output — a constellation of matched alumni and their paths. The only difference is how wide the net is cast.

**Why it's different:** Advisors give generic advice. LinkedIn shows you what professionals have now, not the college decisions that got them there. Constella shows you what alumni *at your school, in your position* actually did — specific, grounded, real.

**Key data inputs:**

- Student: declared/undeclared interests, courses completed, year, optional filters (career area, major, industry)
- Alumni: major(s), courses taken, career outcomes, any pivot points

---

## 2. "What If" Simulator

**What it does:** Lets students simulate a pivot and see what happened to real alumni who made the same move.

**How it works:** Student selects a change — switching majors, adding a minor, dropping a track — and the system surfaces alumni who made that exact (or similar) transition at their school. It shows:

- How many alumni made this pivot and when (sophomore year? junior year?)
- The actual transition path: what courses they took to bridge, what they dropped, what they added, and in what order
- How long the transition took (1 semester? 2?)
- Where they ended up (career outcomes post-pivot)

When a student runs a simulation, the system surfaces the **top 5 most relevant alumni transitions** — ranked by how closely the alumnus's starting position matches the student's current profile (courses, year, interests). Each transition is a full story: their path in, their bridge, and their outcome. The student isn't scrolling through a list of 50 — they're seeing the 5 most "you" transitions.

The point isn't just "yes, people did this." It's "here are the 5 most relevant examples of how, semester by semester." That's the difference between reassurance and a playbook.

**Why it matters:** Changing direction in college feels high-stakes and irreversible. Students stay in wrong-fit majors because they can't see what happens on the other side. Even students who decide to pivot don't know *how* — what to take first, what to drop, how to sequence it. This feature answers both "should I?" and "how do I?"

### What the student sees

When a student runs a simulation, they get a results page with two layers:

**Summary bar:** "8 alumni made a similar pivot. Most switched between sophomore and junior year. Top outcomes: health policy (5), biotech (2), medical research (1)."

**Top 5 transition cards**, each showing one alumnus's full semester-by-semester path:

```
Transition #1 (closest match to you)
----------------------------------------------
Alumnus: Class of 2022 | Similarity: 92%

Before pivot: Pre-Med track (Bio 101, Chem 101, Physics I, Organic Chem)
Pivot point:  Spring, Sophomore Year

Semester-by-semester bridge:
  Fall Soph   → Kept: Organic Chem | Added: Intro to Public Health
  Spring Soph → Dropped: Physics II | Added: Health Policy, Epidemiology
  Fall Junior  → Added: Biostatistics, Community Health
  Spring Junior → Senior thesis in health equity

Final major: Biochemistry + Public Health (double major)
Outcome:     Health Policy Analyst @ state health department
```

Each card is expandable — collapsed view shows the pivot point, final major, and outcome. Expanded view shows the full semester map.

Students can compare cards side-by-side to see different strategies for the same pivot (some went faster, some kept more of their original coursework, some ended up in different careers).

### Data required per alumni record

| Field                        | Description                                         | Source                                                  |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Courses by semester          | Every course taken, organized by semester/term      | Registrar transcript data                               |
| Major(s) declared + dates    | What they declared and when, including changes      | Registrar records                                       |
| Minor(s) / concentrations    | Secondary academic tracks                           | Registrar records                                       |
| Graduation year              | Class year                                          | Registrar records                                       |
| Career outcome               | Job title + industry within 1-3 years of graduation | Alumni surveys, LinkedIn scraping, career services data |
| Interests / extracurriculars | Clubs, research, internships                        | Student activity records, alumni surveys                |

### How matching + ranking works

The top 5 are ranked by a similarity score based on:

- **Course overlap** — how many of the student's current courses match the alumnus's pre-pivot courses (heaviest weight)
- **Year alignment** — did the alumnus pivot at the same point in their college timeline
- **Interest overlap** — shared interests, extracurriculars, or declared areas of exploration
- **Recency** — more recent alumni weighted slightly higher (curriculum and job market relevance)

---

## What we cut and why

| Feature                        | Why it's out                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Real-time skill gap translator | Generic — LinkedIn Learning, Coursera own this space. Not powered by our unique alumni data. |
| LinkedIn/Email templates       | Commodity feature. Dilutes the core story.                                                    |
| Alumni Outreach Generator      | Nice-to-have, not core to discovery. Can revisit later.                                       |
| End of term reflection         | Not connected to the alumni data engine.                                                      |

---

## Positioning

**Stellic** helps students navigate the path they've chosen. **Constella** helps students discover the path worth taking.

We exist *before* Stellic — before a student has decided. Our product answers: **"What did people like me, at my school, actually do?"**

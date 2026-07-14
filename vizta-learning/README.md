# Vizta Learning

A self-paced Media Arts e-learning platform for Grade 9 and Grade 10 students,
hosted at **learn.viztasystems.com**. Built to the Term 1 build brief.

This README covers the **complete Term 1 build (Steps 1–8)**: the database
schema, the seed script, the student login, the dashboard + lesson page, saving
submissions + quizzes with sequential unlocking, the certificate, the teacher
admin panel, and the n8n grade export.

## Golden rules (fixed — do not work around)

- Submissions are **text, image url, or link only**. Never a file upload.
- The data model is exactly the five conceptual groups in the brief: Students,
  Modules, Activities, Submissions, and Quizzes + QuizResults. No extra tables.
- Student login is **class code + student number**. No student emails, no
  student passwords.
- All content loads from the **seed files**, never hard-coded in the app.
- Branding is Vizta **mint `#3EB489`** and **navy `#1B2A4A`**.
- **Free tier only.** Any choice that risks a cost gets flagged here, not shipped.

## Where this lives

The app is in the `vizta-learning/` subfolder of the portfolio repo for now.
When you deploy, either point Vercel's *Root Directory* setting at
`vizta-learning`, or split it into its own repo:

```bash
# promote the subfolder to its own repo later, history-free:
cp -r vizta-learning /path/to/new/vizta-learning && cd /path/to/new/vizta-learning
git init && git add . && git commit -m "Vizta Learning"
```

## The five-table schema

The SQL migration is `supabase/migrations/0001_init.sql`. It creates six physical
tables that map to the brief's five conceptual groups (Quizzes and QuizResults
are one line item in the brief):

| Table          | Purpose                                             | Seeded?          |
|----------------|-----------------------------------------------------|------------------|
| `students`     | One row per student. No email, no password.         | No (runtime)     |
| `modules`      | One row per module.                                 | Yes              |
| `activities`   | One row per lesson (full master template).           | Yes              |
| `submissions`  | One row per student per activity. text/image/link.  | No (runtime)     |
| `quizzes`      | One row per quiz item + answer key.                 | Yes              |
| `quiz_results` | One row per student per quiz attempt.               | No (runtime)     |

Nothing is Term 1 specific — Terms 2–6 load later by adding seed rows, no code
changes. `"order"` is a reserved SQL word, so it is quoted in the schema.

### Run the migration

Use whichever you prefer:

- **Supabase SQL Editor:** paste the contents of
  `supabase/migrations/0001_init.sql` and run it.
- **Supabase CLI:** `supabase db push` (with the migration in place).

The migration is safe to re-run (`create table if not exists`, etc.).

## The seed files

Term 1 content lives in `loadable/`. These are your prepared files — no lesson
text was retyped or invented:

| File             | Rows | Source                                                        |
|------------------|------|---------------------------------------------------------------|
| `modules.json`   | 2    | Transcribed from your *Term 1 Lessons* doc (titles, standards)|
| `activities.json`| 9    | Provided as-is                                                |
| `quizzes.json`   | 45   | Generated from your `quizzes.csv` (same data)                 |

Matching CSVs (`modules.csv`, `activities.csv`, `quizzes.csv`) are kept alongside.

## Seeding

1. Install deps: `npm install`
2. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API).
3. Run the migration (above) so the tables exist.
4. Seed: `npm run seed`

The script upserts on each primary key, so it is **safe to run more than once**
— re-running never duplicates. It prints a per-table row count at the end.
Expected after a clean seed:

```
  modules         2
  activities      9
  quizzes        45
```

> **Security:** the seed script uses the **service-role key**, which bypasses
> row-level security. It runs only on your machine. Never put this key in the
> browser or commit `.env`.

## Running the app

The front end is a Next.js (App Router) app in this folder.

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (as for seeding) — **server only**
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by the
     teacher login in the browser (the anon key is safe to expose)
   - `SESSION_SECRET` — any long random string (signs the student session cookie)
   - `CLASS_CODES` — the class-code → grade mapping (default `MEDIA9:G9,MEDIA10:G10`)
3. `npm run dev`, then open http://localhost:3000

> **Build-time vars:** the `NEXT_PUBLIC_*` values are baked into the browser
> bundle **when you build**, not at runtime. On your host (e.g. Vercel) set them
> as environment variables *before* the build, or the teacher login won't know
> where Supabase is. The server-only keys (`SUPABASE_SERVICE_ROLE_KEY`,
> `SESSION_SECRET`) are read at runtime and must never be `NEXT_PUBLIC_`.

Student pages: `/` (landing, pick grade), `/login` (class code + student number),
`/dashboard` (module, lessons, progress, locks), `/lesson/[activityId]` (the full
lesson), `/certificate`. Teacher pages: `/teacher/login` and the `/teacher` panel.
To see real data, seed the content and add a test student (via the teacher panel,
or directly in the Supabase table editor).

## Dashboard and lesson page (Step 3)

Both read real Supabase data server-side, scoped to the signed-in student.

- **Dashboard** shows the student's module, the term output as the goal, a
  progress percentage, each lesson with a status badge (Not started / Submitted /
  Graded / Complete), and **sequential locks**: the first lesson is open; each
  later lesson unlocks only when the one before it is complete. Locked lessons are
  visible but not clickable, and "Up next" points to the next open lesson.
- **Lesson page** renders the master template in order: goal → *Before you watch*
  (hook + watch-for questions) → the embedded video → *After you watch* → the
  activity brief with its submission type → the rubric as a points table → the
  quiz. Rows without a final video URL (`G9-A1.3`, `G10-A1.4`, `G10-A1.5`) show a
  friendly "your teacher will add the video" placeholder instead of a broken embed.

**Definition of complete** (per the brief): a lesson is complete when the student
has **both** submitted its activity **and** taken its quiz. Progress % = complete
lessons ÷ total lessons in the module.

**Student privacy on the lesson page:** the DepEd **competency code is never shown
to students** (it's kept server-side for the teacher's export), and none of the
teacher-facing video notes (candidate, preview note, status) are rendered.

## Submissions and quizzes (Steps 4–5)

The lesson page now saves work and the module unlocks as the student progresses.

- **Activity submission** writes a `submissions` row (`status = 'Submitted'`, a
  timestamp). The `submission_type` is enforced: text must be non-empty; link and
  image must be a valid `http(s)` URL. **Never a file upload.** It upserts on
  `(student_id, activity_id)`, so a student can revise and resubmit until it's
  graded; once a teacher grades it, the box locks and shows the grade + feedback.
- **Quiz** is **auto-graded on the server**: the answer key (`correct`) is read
  server-side and never sent to the browser. A `quiz_results` row is saved with
  the score and date. The student immediately sees their score and which answers
  were right, and can retake it (each attempt is its own row, per the brief).
- **Sequential unlocking + progress** are now live end to end: completing a lesson
  (submission **and** quiz) marks it Complete, advances the progress percentage,
  and unlocks the next lesson. When every lesson is complete the dashboard shows a
  completion state with a link to the certificate.

## Certificate of completion (Step 6)

When a student completes every lesson in their module, the dashboard shows a
"View your certificate" button leading to `/certificate`.

- The page **re-checks completion server-side** and redirects to the dashboard if
  the student isn't actually finished — the certificate can't be reached early by
  typing the URL.
- It's a clean, branded (mint/navy) page showing the **student name, class, course
  title** (from the module — nothing hard-coded to Term 1), and the **date**, with
  a **Print / Save as PDF** button and print-specific CSS so it prints or saves as
  a PDF nicely on a phone or a cheap printer.
- The date shown is the day the certificate is viewed/printed (we don't store a
  per-module completion timestamp — that would need an extra column and isn't
  required for a print-time date).

## Student login (class code + student number)

No Supabase Auth for students, no emails, no passwords — per the golden rules,
minors don't create accounts. Login is custom:

- The student enters a **class code** (e.g. `MEDIA9`) and their **student number**.
- The class code maps to a grade via the `CLASS_CODES` env var, so you can change
  codes each school year without touching code.
- A **signed, httpOnly session cookie** holds only `student_id`, name, number, and
  class. The student number never appears in a URL. Nothing beyond name, number,
  and class is collected.
- All student-data lookups run **server-side** with the service-role key (never in
  the browser), which is the secure fit for a custom (non-Supabase-Auth) login.

### First-login model: the teacher adds students first (chosen)

A student can log in **only if the teacher has already added their row** to
`students`. An unknown student number gets a plain-language message telling them
to ask their teacher, not a new account.

**Why this over create-on-first-use:** it is the safer choice for a minors
platform. There is no self-registration, so no one who happens to learn a class
code can create accounts; typos can't silently create duplicate students; and
your class roster stays the single source of truth for grades and DepEd records.
The small cost — you add students up front — is handled in the teacher panel
(Step 7) or a roster import, and it's a one-time step per term.

> To try login before the teacher panel exists, add a test student directly in
> the Supabase Table editor: a row in `students` with `class` = `G9`, a
> `student_number`, and a `name`. Then log in with `MEDIA9` + that number.

## Teacher admin panel (Step 7)

Behind a separate teacher login using **Supabase Auth** (email + password —
adults only, entirely separate from student login). Pages live under `/teacher`.

**Set up a teacher account** (one-time), in the Supabase dashboard:
Authentication → Users → **Add user** → enter the teacher's email and a password
(tick "Auto Confirm" so no confirmation email is needed). Then sign in at
`/teacher/login`.

What the panel does:

- **Overview** — counts of students and work awaiting grading.
- **Students & progress** — the full roster with each student's completion, and an
  **Add student** form (name + number + class). This is how you enroll students
  for the teacher-adds-first login model.
- **Grade submissions** — review each submission, set a grade and feedback. Saving
  flips the row to `Graded`, which locks the student's box and shows them the grade.
  Ungraded work shows by default; "show all" includes already-graded.
- **Modules** — unlock or lock a module for a class (toggles the `unlocked` flag).
- **Content & videos** — confirm or replace each lesson's video link. Lesson text
  still comes from the seed files; this is for the one thing that needs your eyes,
  the video, per the preview reminder below.

Security model: teacher pages verify the Supabase Auth session server-side, then
perform DB writes with the service-role key on the server. The service-role key
never reaches the browser.

## Row Level Security

`supabase/migrations/0002_rls.sql` enables RLS on all six tables with **no
policies**, which denies all direct access via the public anon key while the
server's service-role key bypasses RLS as normal. Because every read and write in
this app goes through the server, this simply shuts the front door on anyone who
gets the anon key — important for a platform used by minors. Run it after the
initial migration (same ways: SQL editor or `supabase db push`). If you later
give n8n a limited key instead of the service role, add explicit read-only
policies at that point.

## Grade export and n8n (Step 8)

Grade export for DepEd records is done by **n8n on your Hostinger VPS**, not
inside this app. The app exposes one secured, read-only endpoint that n8n reads.

### The endpoint

```
GET /api/export/grades            → JSON  { generated_at, count, rows[] }
GET /api/export/grades?format=csv → CSV
Header:  Authorization: Bearer <EXPORT_API_TOKEN>
```

- Returns **one row per student per activity** — a complete gradebook — including
  each activity's **competency code** (needed for DepEd, never shown to students),
  the grade, rubric total, quiz score, feedback, and submission time.
- Without a valid token it returns `401`; if `EXPORT_API_TOKEN` is unset, `500`.
- Set `EXPORT_API_TOKEN` to a long random string (server-side only).

### Wiring n8n (on the Hostinger VPS)

1. In n8n, create a workflow with a **Schedule** trigger (e.g. nightly) or a
   **Manual/Webhook** trigger.
2. Add an **HTTP Request** node:
   - Method `GET`, URL `https://learn.viztasystems.com/api/export/grades`
   - Header `Authorization` = `Bearer <your EXPORT_API_TOKEN>`
   - Response format: JSON (use `?format=csv` instead if a node prefers CSV).
3. Add a **Google Sheets** node → *Append or update rows*, mapping the fields
   from `rows[]` (map on `student_number` + `activity_id` to update in place).
4. Save and activate. Test with the schedule's "execute now".

### On-demand trigger from the panel (optional)

If you set `N8N_EXPORT_WEBHOOK_URL` to your workflow's **Webhook** URL, the
teacher panel's **Export now** button (Overview) POSTs to it to run the export on
demand. Leave it blank to hide the button and rely on n8n's schedule.

### Why an endpoint (not a Supabase key)

The brief allows either a secured endpoint or a limited Supabase key. The
endpoint is used because it works cleanly with the RLS we enabled (the anon key
can't read the tables directly), and it controls exactly what leaves the app.

## Video preview reminder

The lesson videos still need your eyes. The app embeds whatever `video_url` is
in the data. Several activity rows are marked `SELECTED` or `SOURCE SELECTED`
(not `LOCKED`) — preview and clear each link before students use it. Two rows
(`G9-A1.3`, `G10-A1.4`) intentionally carry a source/instruction in `video_url`
rather than a final link, and `G10-A1.5` is intentionally left open. These are
handled gracefully on the lesson page (built in Step 3).

## Build progress

- [x] **Step 1 — Schema + seed script**
- [x] **Step 2 — Student login** (class code + student number, teacher-adds-first)
- [x] **Step 3 — Dashboard + lesson page** (reading real data, sequential locks)
- [x] **Step 4 — Submission + quiz saving** (text/link/image; server-side auto-grade)
- [x] **Step 5 — Sequential unlocking + progress** (live: complete → unlock next)
- [x] **Step 6 — Certificate** (printable, completion-gated)
- [x] **Step 7 — Teacher admin panel** (Supabase Auth; grading, roster, unlock, content)
- [x] **Step 8 — n8n grade export** (secured read-only endpoint + on-demand trigger)

**Term 1 is complete.** Everything is data-driven, so Terms 2–6 load by adding
seed rows — no code changes.

## Deploying to learn.viztasystems.com

1. Push this repo (or the `vizta-learning/` subfolder) to a free Next.js host —
   **Vercel** or **Netlify** both have free tiers that support the App Router.
2. Set the environment variables from `.env.example` in the host's project
   settings **before building** (the `NEXT_PUBLIC_*` ones are baked in at build).
3. Run the two SQL migrations and the seed script against your Supabase project.
4. In the host, add the custom domain `learn.viztasystems.com`; the host shows a
   CNAME (or A) record to add at your DNS provider. Point the `learn` subdomain
   there and wait for the certificate to issue.

Everything above stays within free tiers: Supabase free tier, a free Next.js
host, and your existing Hostinger VPS for n8n. No paid services are introduced.

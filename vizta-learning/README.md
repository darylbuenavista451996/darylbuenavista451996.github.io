# Vizta Learning

A self-paced Media Arts e-learning platform for Grade 9 and Grade 10 students,
hosted at **learn.viztasystems.com**. Built to the Term 1 build brief.

This README grows as the build progresses. Right now it covers **Steps 1–2 of
the build order: the database schema, the seed script, and the student login.**
Later steps (dashboard, lesson page, submissions, quizzes, certificate, teacher
panel, n8n export) will add their own sections.

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
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (as for seeding)
   - `SESSION_SECRET` — any long random string (signs the student session cookie)
   - `CLASS_CODES` — the class-code → grade mapping (default `MEDIA9:G9,MEDIA10:G10`)
3. `npm run dev`, then open http://localhost:3000

Pages so far: `/` (landing, pick grade), `/login` (class code + student number),
`/dashboard` (stub — proves login works; the real dashboard is Step 3).

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
- [ ] Step 3 — Dashboard + lesson page (reading real data)
- [ ] Step 4 — Submission + quiz saving
- [ ] Step 5 — Sequential unlocking + progress
- [ ] Step 6 — Certificate
- [ ] Step 7 — Teacher admin panel
- [ ] Step 8 — n8n grade export

-- Vizta Learning — Term 1 schema
-- Section 4 of the build brief. Six physical tables mapping to the five
-- conceptual groups (Quizzes and QuizResults are one line item in the brief).
-- Column names follow the brief; "order" is quoted throughout (reserved word).
-- Designed to hold all six terms later: nothing is Term 1 specific.

-- Idempotent-friendly: safe to re-run. Uses IF NOT EXISTS on tables.

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- 1. Students -----------------------------------------------------------------
-- One row per enrolled student. No email, no password (golden rule: minors).
create table if not exists public.students (
  student_id     uuid primary key default gen_random_uuid(),
  name           text not null,
  student_number text not null,
  class          text not null check (class in ('G9', 'G10')),
  created_at     timestamptz not null default now(),
  -- student_number is unique *within a class*, per the brief
  constraint students_number_unique_per_class unique (class, student_number)
);

-- 2. Modules ------------------------------------------------------------------
-- Seeded from modules.json. One row per module.
create table if not exists public.modules (
  module_id            text primary key,          -- e.g. G9-M1
  title                text not null,
  grade_class          text not null check (grade_class in ('G9', 'G10')),
  term                 text not null,
  "order"              integer not null,          -- sequence within the class
  weeks                integer,
  output               text,                      -- the term deliverable
  content_standard     text,
  performance_standard text,
  unlocked             boolean not null default false
);

-- 3. Activities ---------------------------------------------------------------
-- Seeded from activities.json. One row per lesson; the full master template.
-- Extra video_* fields carried by the seed data are kept (golden rule allows
-- extra columns; new tables are not allowed).
create table if not exists public.activities (
  activity_id        text primary key,            -- e.g. G9-A1.1
  module_id          text not null references public.modules(module_id) on delete cascade,
  "order"            integer not null,            -- sequence within the module
  week               text,
  title              text not null,
  competency_code    text,                        -- DepEd code; hidden from students
  is_performance_task boolean not null default false,
  lesson_goal        text,
  before_hook        text,
  watch_for          jsonb,                       -- array of strings
  video_slot         text,
  video_candidate    text,
  video_preview_note text,
  video_status       text,
  video_title        text,
  video_channel      text,
  video_runtime      text,
  video_url          text,
  after_bridge       text,
  activity_brief     text,
  submission_type    text,                        -- Short text | Link | image
  tool               text,
  ai_note            text,
  rubric             jsonb,                       -- array of {criteria, points}
  rubric_total       integer
);

-- 4. Submissions --------------------------------------------------------------
-- One row per student per activity. content is text, an image url, or a link.
-- NEVER a file (golden rule: no file upload).
create table if not exists public.submissions (
  submission_id uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(student_id) on delete cascade,
  activity_id   text not null references public.activities(activity_id) on delete cascade,
  content       text,                             -- answer, image url, or link
  submitted_at  timestamptz not null default now(),
  status        text not null default 'Submitted'
                  check (status in ('Not started', 'Submitted', 'Graded')),
  grade         integer,
  feedback      text,
  -- one submission row per student per activity
  constraint submissions_unique_per_student_activity unique (student_id, activity_id)
);

-- 5. Quizzes ------------------------------------------------------------------
-- Seeded from quizzes.json. One row per quiz item + answer key.
create table if not exists public.quizzes (
  quiz_id     text primary key,                   -- e.g. G9-A1.1-Q1
  activity_id text not null references public.activities(activity_id) on delete cascade,
  module_id   text references public.modules(module_id) on delete cascade,
  "order"     integer not null,
  question    text not null,
  option_a    text,
  option_b    text,
  option_c    text,
  option_d    text,
  correct     text not null check (correct in ('A', 'B', 'C', 'D'))
);

-- 6. QuizResults --------------------------------------------------------------
-- One row per student per quiz attempt.
create table if not exists public.quiz_results (
  result_id   uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(student_id) on delete cascade,
  activity_id text not null references public.activities(activity_id) on delete cascade,
  score       integer not null,
  date        timestamptz not null default now()
);

-- Helpful indexes for the dashboard/lesson queries -----------------------------
create index if not exists idx_activities_module on public.activities(module_id, "order");
create index if not exists idx_quizzes_activity  on public.quizzes(activity_id, "order");
create index if not exists idx_submissions_student on public.submissions(student_id);
create index if not exists idx_quiz_results_student on public.quiz_results(student_id);

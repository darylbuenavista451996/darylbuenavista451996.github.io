-- 0010 — Mathematics platform: lesson locks and recorded results.
--
-- The Mathematics app (viztasystems.com/web-platforms/mathematics) is a
-- separate app that shares this database. Two small tables support it:
--   * math_lessons  — one row per math lesson, with an unlock switch the
--     teacher controls. Lessons start LOCKED so no one can answer in advance.
--   * math_results  — one row per student per lesson, written once when the
--     student finishes. This is the official, tamper-resistant record of the
--     reward points (the app cannot change a row that already exists).
--
-- Safe to re-run.

create extension if not exists "pgcrypto";

create table if not exists public.math_lessons (
  lesson_id text primary key,
  title     text not null,
  "order"   integer not null default 0,
  unlocked  boolean not null default false
);

create table if not exists public.math_results (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students(student_id) on delete cascade,
  lesson_id    text not null,
  points       integer not null default 0,
  quiz_score   integer not null default 0,
  tab_switches integer not null default 0,
  submitted_at timestamptz not null default now(),
  -- one result per student per lesson; the app inserts and never updates, so
  -- the first submission is final.
  constraint math_results_unique unique (student_id, lesson_id)
);

create index if not exists idx_math_results_lesson on public.math_results(lesson_id);
create index if not exists idx_math_results_student on public.math_results(student_id);

-- RLS on, no policies: the anon key can touch nothing; the server (service role)
-- bypasses RLS, same pattern as the rest of the schema.
alter table public.math_lessons enable row level security;
alter table public.math_results enable row level security;

-- Seed the first lesson, locked. The teacher unlocks it from the dashboard.
insert into public.math_lessons (lesson_id, title, "order", unlocked)
values ('parallel-perpendicular', 'Parallel & Perpendicular Lines', 1, false)
on conflict (lesson_id) do nothing;

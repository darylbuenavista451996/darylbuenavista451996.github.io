-- 0012 — Mathematics terms: a Term 1 / Term 2 switch, and a term on each lesson.
--
-- Works like the Modules page for Media Arts:
--   * math_terms   — one row per term with an open/closed switch the teacher controls
--                    from the Mathematics tab. A closed term cannot be entered by
--                    students, even if its lessons are unlocked. Nothing is deleted:
--                    the lessons and records stay stored for next year.
--   * math_lessons.term — which term each lesson belongs to.
--
-- Term 1 starts CLOSED and Term 2 starts OPEN. Safe to re-run: re-running does not
-- undo a switch you have changed.

create table if not exists public.math_terms (
  term     integer primary key,
  unlocked boolean not null default false
);
alter table public.math_terms enable row level security;

insert into public.math_terms (term, unlocked) values (1, false), (2, true)
on conflict (term) do nothing;

alter table public.math_lessons add column if not exists term integer not null default 1;

-- Which lessons belong to which term (only changes the term tag, never the lock).
update public.math_lessons set term = 1 where lesson_id in ('parallel-perpendicular', 'linear-functions');
update public.math_lessons set term = 2 where lesson_id = 'triangle-similarity';

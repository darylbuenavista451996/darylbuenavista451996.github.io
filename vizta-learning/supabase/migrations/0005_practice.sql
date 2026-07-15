-- Makes the guided-practice a graded, auto-scored task.
-- Stores the student's practice response and its auto-score on the same
-- submissions row (extra columns; no new table). Scoring is a plain
-- completion check in app code (no AI, no cost).

alter table public.submissions add column if not exists practice text;
alter table public.submissions add column if not exists practice_score integer;

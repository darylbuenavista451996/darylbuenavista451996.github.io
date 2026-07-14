-- Adds a place to store each student's written reflection for a task.
-- One reflection per student per activity, kept on the same submissions row as
-- the activity (extra column; no new table). Completion is decided in app code
-- by a simple length check — no AI, no external service.

alter table public.submissions add column if not exists reflection text;

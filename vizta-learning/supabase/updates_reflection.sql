-- Vizta Learning — turn on reflection completion credit.
-- Paste into the Supabase SQL editor and Run. Safe to re-run.
-- Adds one column; students' reflections save here and are auto-credited by the
-- app (a simple word-count check, no AI).

alter table public.submissions add column if not exists reflection text;

select 'reflection column ready' as status;

-- Adds the `sections` column to activities: a data-driven, ordered list of
-- lesson blocks (warm-up, extra videos, readings, guided practice, reflection)
-- that make a lesson a full self-paced session rather than a single video.
-- Optional per lesson (null = the classic short lesson). No new tables.

alter table public.activities add column if not exists sections jsonb;

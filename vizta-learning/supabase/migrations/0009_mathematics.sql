-- 0009 — Add the Grade 9 Mathematics track (class code M9).
--
-- The students and modules tables originally allowed only the Media Arts grades
-- ('G9', 'G10'). This widens the allowed classes to include 'M9' so Mathematics
-- students can self-register. Nothing else changes: Media Arts data is untouched,
-- and Mathematics lessons are self-contained interactive pages (no module rows
-- required), so no seed data is needed here.
--
-- Safe to re-run.

alter table public.students drop constraint if exists students_class_check;
alter table public.students
  add constraint students_class_check check (class in ('G9', 'G10', 'M9'));

alter table public.modules drop constraint if exists modules_grade_class_check;
alter table public.modules
  add constraint modules_grade_class_check check (grade_class in ('G9', 'G10', 'M9'));

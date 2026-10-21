-- Term 2 fresh start: archive Term 1 student data, then clear all student accounts
-- so students sign up again with the class codes.
--
-- RUN THIS ONCE, in the Supabase SQL editor, ONLY when you are sure.
--
-- BEFORE YOU RUN IT (the archive below is a safety net, not a substitute):
--   1. Download your records from the teacher dashboard: Scores / Grading CSV,
--      the Mathematics CSV, and the Side Task CSV if you used it.
--   2. Make sure the class codes (CLASS_CODES in Vercel) are what you want
--      students to use for Term 2.
--
-- WHAT IT DOES
--   * Copies students, submissions, quiz results, attendance, math results (and
--     side task submissions if that table exists) into a private schema called
--     archive_t1. That schema is NOT exposed through the app's API.
--   * Deletes every row in public.students. Everything that belongs to a student
--     (submissions, quiz_results, attendance, math_results, side task rows) goes
--     with it automatically.
--   * Leaves alone: teacher accounts, modules, activities, quizzes, math_lessons
--     (lock states included), and the class codes.
--
-- It refuses to run twice, so it can never wipe accounts students create in Term 2.
-- To restore Term 1 data later, copy rows back from archive_t1.*.
--
-- NOT covered: profile photos stay in the "avatars" storage bucket as orphan files.
-- Clear them in Supabase > Storage > avatars if you want (optional).

begin;

do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'archive_t1') then
    raise exception 'archive_t1 already exists. This script has already been run, so it will not run again.';
  end if;
end $$;

create schema archive_t1;

-- Archive without password hashes: keep who the student was, not their login secret.
create table archive_t1.students as
  select student_id, name, student_number, class, email, created_at
  from public.students;
create table archive_t1.submissions  as table public.submissions;
create table archive_t1.quiz_results as table public.quiz_results;
create table archive_t1.attendance   as table public.attendance;
create table archive_t1.math_results as table public.math_results;

do $$
begin
  if to_regclass('public.side_task_submissions') is not null then
    execute 'create table archive_t1.side_task_submissions as table public.side_task_submissions';
    execute 'alter table archive_t1.side_task_submissions enable row level security';
  end if;
end $$;

-- Lock the archive down: row level security on, no policies = only the service
-- role (and you in the SQL editor) can read it.
alter table archive_t1.students     enable row level security;
alter table archive_t1.submissions  enable row level security;
alter table archive_t1.quiz_results enable row level security;
alter table archive_t1.attendance   enable row level security;
alter table archive_t1.math_results enable row level security;

-- Wipe the accounts. Child rows are removed by "on delete cascade".
delete from public.students;

-- Check: everything student related should now be empty.
select
  (select count(*) from public.students)      as students_left,
  (select count(*) from public.submissions)   as submissions_left,
  (select count(*) from public.quiz_results)  as quiz_results_left,
  (select count(*) from public.attendance)    as attendance_left,
  (select count(*) from public.math_results)  as math_results_left,
  (select count(*) from archive_t1.students)  as students_archived;

commit;

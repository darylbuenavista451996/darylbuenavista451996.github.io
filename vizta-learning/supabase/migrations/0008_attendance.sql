-- Daily attendance.
--
-- One record per student per day, marked by the teacher as Present, Late, or
-- Absent. Kept simple and separate from grades. RLS is enabled with no policies
-- (deny the anon role; the server's service-role client bypasses it), matching
-- every other table.

create table if not exists public.attendance (
  attendance_id uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(student_id) on delete cascade,
  date          date not null,
  status        text not null check (status in ('Present', 'Late', 'Absent')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- one mark per student per day; re-marking updates the same row
  constraint attendance_unique_per_day unique (student_id, date)
);

create index if not exists attendance_date_idx on public.attendance (date);

alter table public.attendance enable row level security;

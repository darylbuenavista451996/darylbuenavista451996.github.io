-- Side Task: "Build Your First Website"
-- An out-of-curriculum activity published to both Grade 9 and Grade 10 Media
-- Arts. Students follow a step-by-step guide, publish a Google Site, and paste
-- their live link here so the teacher can open it and grade the working parts.
--
-- One row per student per side task. Kept separate from `submissions` (which is
-- foreign-keyed to curriculum activities) so it needs no activities row.
create table if not exists public.side_task_submissions (
  student_id   uuid not null references public.students(student_id) on delete cascade,
  task_id      text not null,                 -- e.g. 'website'
  url          text not null,                 -- the student's published site link
  submitted_at timestamptz not null default now(),
  grade        integer,                       -- teacher's mark (null until graded)
  feedback     text,
  updated_at   timestamptz not null default now(),
  primary key (student_id, task_id)
);

-- RLS on, no policies: only the service-role client (server-side) can read/write.
alter table public.side_task_submissions enable row level security;

create index if not exists idx_side_task_student on public.side_task_submissions(student_id);

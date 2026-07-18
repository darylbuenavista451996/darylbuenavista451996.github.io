-- Student self-registration.
--
-- Students may now create their own account with a name, email and password
-- (gated at sign-up by a class code, so they land in the right grade). This is
-- opt-in and additive: teacher-added students with just a student number keep
-- working exactly as before, so no existing login breaks.
--
-- Passwords are stored ONLY as a salted scrypt hash (see lib/studentAuth.ts).
-- The email + hash are read server-side only; RLS already denies the anon role
-- and the service-role client bypasses it, so these never reach the browser.

alter table public.students
  add column if not exists email text,
  add column if not exists password_hash text;

-- Self-registered students have no school-issued number, so it can be empty.
alter table public.students
  alter column student_number drop not null;

-- One account per email (case-insensitive), but only when an email is set —
-- teacher-added rows with a null email are unaffected.
create unique index if not exists students_email_unique
  on public.students (lower(email))
  where email is not null;

-- Row Level Security hardening.
--
-- The app never uses the anon key to touch these tables: every read and write
-- goes through the server with the service-role key (student login is custom;
-- teacher pages verify the Supabase Auth session, then use the service role).
--
-- Enabling RLS with NO policies means the anon and authenticated roles are
-- denied all direct access via PostgREST, while the service_role key bypasses
-- RLS as normal. This shuts the front door on anyone who gets the public anon
-- key — important for a platform used by minors. If you later wire n8n with a
-- limited key instead of the service role, add explicit read-only policies then.

alter table public.students     enable row level security;
alter table public.modules      enable row level security;
alter table public.activities   enable row level security;
alter table public.submissions  enable row level security;
alter table public.quizzes      enable row level security;
alter table public.quiz_results enable row level security;

-- No policies are defined on purpose: default-deny for anon/authenticated.
-- Re-running is safe (enabling RLS that is already enabled is a no-op).

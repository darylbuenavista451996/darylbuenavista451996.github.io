-- Student profile photos.
--
-- Students can upload a real photo. The file lives in a PRIVATE Supabase
-- Storage bucket ("avatars"); this column stores only the object path. The app
-- serves the image through short-lived signed URLs generated server-side, so a
-- minor's photo is never on a public, guessable URL. Teachers can remove a
-- photo (moderation). When there's no photo, the app shows the student's
-- initials in a colored circle instead.

alter table public.students
  add column if not exists avatar_path text;

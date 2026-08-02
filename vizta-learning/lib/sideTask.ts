// Data + rubric for the Media Arts "Side Task" (out-of-curriculum). Right now
// there is one side task, "Build Your First Website", but the shape allows more
// later. Reads use the service-role client, scoped in code to the student.
import { supabaseServer } from './supabase';

export const WEBSITE_TASK_ID = 'website';

export type SideTaskSubmission = {
  url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
};

// The grading rubric shown to students AND used by the teacher. Each part is a
// working feature of the finished site; the teacher deducts a part's points when
// it does not work. Total is 100.
export type RubricPart = { label: string; points: number; how: string };
export const WEBSITE_RUBRIC: RubricPart[] = [
  { label: 'The site is published and the link opens', points: 30, how: 'Opening your link shows a real, live page (not "page not found").' },
  { label: 'Cover shows your full name and a tagline', points: 10, how: 'Your real name is the big title, with a one-line tagline under it.' },
  { label: 'About Me paragraph', points: 15, how: 'A short paragraph (3 to 4 sentences) about you.' },
  { label: 'Your photo shows', points: 10, how: 'A picture of you (or your avatar) that actually loads.' },
  { label: 'Three pieces of your work show', points: 15, how: 'Three images of your work, all loading (5 points each).' },
  { label: 'Contact button works', points: 15, how: 'A button that opens an email to you when clicked (mailto link).' },
  { label: 'The site looks finished', points: 5, how: 'A theme is applied and there is no leftover placeholder text.' },
];
export const WEBSITE_RUBRIC_TOTAL = WEBSITE_RUBRIC.reduce((s, p) => s + p.points, 0);

export async function getSideTaskSubmission(
  studentId: string,
  taskId: string
): Promise<SideTaskSubmission | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('side_task_submissions')
    .select('url, submitted_at, grade, feedback')
    .eq('student_id', studentId)
    .eq('task_id', taskId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    url: data.url as string,
    submitted_at: data.submitted_at as string,
    grade: (data.grade as number | null) ?? null,
    feedback: (data.feedback as string | null) ?? null,
  };
}

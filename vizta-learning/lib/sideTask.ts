// Data + rubric for the Media Arts "Side Task". Right now there is one side
// task, "Build a Company Homepage" (a milk tea shop), but the shape allows more
// later. Reads use the service-role client, scoped in code to the student.
import { supabaseServer } from './supabase';

export const HOMEPAGE_TASK_ID = 'homepage';

export type SideTaskSubmission = {
  url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
};

// The grading rubric shown to students AND used by the teacher. Each part is a
// working part of the finished homepage; the teacher deducts a part's points
// when it is missing or broken. Total is 100.
export type RubricPart = { label: string; points: number; how: string };
export const HOMEPAGE_RUBRIC: RubricPart[] = [
  { label: 'The site is published and the link opens', points: 20, how: 'Opening the link shows a real, live homepage (not "page not found").' },
  { label: 'Navbar with logo and links', points: 10, how: 'A top bar with the logo image and the menu links.' },
  { label: 'Hero with headline, tagline, and button', points: 15, how: 'A big first screen with the background image, heading, one line, and a button.' },
  { label: 'About section (text and image)', points: 10, how: 'The "Our Story" text with the cup image beside it.' },
  { label: 'Menu with three drink cards', points: 20, how: 'Three cards, each with a drink image, name, and price, all loading.' },
  { label: 'Features section', points: 10, how: 'The three "Why" items with their icons and text.' },
  { label: 'Contact with a working email button', points: 10, how: 'Clicking the button opens an email (mailto link).' },
  { label: 'Footer', points: 5, how: 'The dark bar at the very bottom with the company name.' },
];
export const HOMEPAGE_RUBRIC_TOTAL = HOMEPAGE_RUBRIC.reduce((s, p) => s + p.points, 0);

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

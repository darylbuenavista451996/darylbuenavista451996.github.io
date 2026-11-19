// The list of math lessons. Adding a lesson here (with a matching route folder)
// makes it appear on the home page and — via ensureLessonsRegistered — creates
// its locked row in the teacher's dashboard automatically. No SQL needed.

export type LessonMeta = {
  id: string; // also the route slug, e.g. /parallel-perpendicular
  title: string;
  term: number; // 1 or 2: which term the lesson belongs to
  order: number;
  blurb: string;
  // Optional: the lesson opens by itself on this date (Philippine time) between
  // these hours, with no teacher unlock needed. The teacher's manual unlock still
  // works too, for example to let a student catch up later.
  window?: { date: string; from: string; to: string };
};

const PH_OFFSET_MS = 8 * 60 * 60 * 1000; // Philippines is UTC+8, no daylight saving

function phMs(date: string, hhmm: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) - PH_OFFSET_MS;
}

export type WindowState = 'none' | 'before' | 'open' | 'after';

export function windowState(l: LessonMeta | undefined, now = Date.now()): WindowState {
  if (!l?.window) return 'none';
  if (now < phMs(l.window.date, l.window.from)) return 'before';
  // No closing time: once a lesson's day has started it stays open.
  return 'open';
}

function t12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${ap}`;
}

export function windowDay(l: LessonMeta): string {
  if (!l.window) return '';
  const [y, m, d] = l.window.date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

export function windowLabel(l: LessonMeta): string {
  if (!l.window) return '';
  const [y, m, d] = l.window.date.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
  return `${day}, ${t12(l.window.from)} to ${t12(l.window.to)}`;
}

export const LESSONS: LessonMeta[] = [
  {
    id: 'parallel-perpendicular',
    title: 'Parallel & Perpendicular Lines',
    term: 1,
    order: 1,
    blurb:
      'Check whether two lines are parallel, perpendicular, or neither, and find the equation of a line through a point.',
  },
  {
    id: 'linear-functions',
    title: 'Solving Problems with Linear Functions',
    term: 1,
    order: 2,
    blurb:
      'Read slope and starting value, build the equation from a word problem, and solve real-life problems with linear functions.',
  },
  {
    id: 'discriminant',
    title: 'The Discriminant',
    term: 2,
    order: 4,
    blurb:
      'Use b² − 4ac to tell whether a quadratic equation has two, one, or no real solutions, without solving it.',
    window: { date: '2026-11-16', from: '09:30', to: '12:00' },
  },
  {
    id: 'completing-the-square',
    title: 'Completing the Square',
    term: 2,
    order: 5,
    blurb:
      'Turn one side of a quadratic into a perfect square and solve step by step, even when the equation will not factor.',
    window: { date: '2026-11-17', from: '09:30', to: '12:00' },
  },
  {
    id: 'sum-product-roots',
    title: 'Sum and Product of Roots',
    term: 2,
    order: 6,
    blurb:
      'Find the sum and product of the roots of a quadratic equation without solving it, and build an equation from its roots.',
    window: { date: '2026-11-18', from: '09:30', to: '12:00' },
  },
];

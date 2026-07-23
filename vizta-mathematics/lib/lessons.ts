// The list of math lessons. Adding a lesson here (with a matching route folder)
// makes it appear on the home page and — via ensureLessonsRegistered — creates
// its locked row in the teacher's dashboard automatically. No SQL needed.

export type LessonMeta = {
  id: string; // also the route slug, e.g. /parallel-perpendicular
  title: string;
  order: number;
  blurb: string;
};

export const LESSONS: LessonMeta[] = [
  {
    id: 'parallel-perpendicular',
    title: 'Parallel & Perpendicular Lines',
    order: 1,
    blurb:
      'Check whether two lines are parallel, perpendicular, or neither, and find the equation of a line through a point.',
  },
  {
    id: 'linear-functions',
    title: 'Solving Problems with Linear Functions',
    order: 2,
    blurb:
      'Read slope and starting value, build the equation from a word problem, and solve real-life problems with linear functions.',
  },
];

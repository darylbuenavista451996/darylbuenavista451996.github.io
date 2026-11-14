// The list of math lessons. Adding a lesson here (with a matching route folder)
// makes it appear on the home page and — via ensureLessonsRegistered — creates
// its locked row in the teacher's dashboard automatically. No SQL needed.

export type LessonMeta = {
  id: string; // also the route slug, e.g. /parallel-perpendicular
  title: string;
  term: number; // 1 or 2: which term the lesson belongs to
  order: number;
  blurb: string;
};

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
    id: 'triangle-similarity',
    title: 'Triangle Similarities',
    term: 2,
    order: 3,
    blurb:
      'Learn when two triangles are similar (AA, SSS, SAS), find a scale factor, and use proportions to solve for missing sides.',
  },
  {
    id: 'discriminant',
    title: 'The Discriminant',
    term: 2,
    order: 4,
    blurb:
      'Use b² − 4ac to tell whether a quadratic equation has two, one, or no real solutions, without solving it.',
  },
  {
    id: 'completing-the-square',
    title: 'Completing the Square',
    term: 2,
    order: 5,
    blurb:
      'Turn one side of a quadratic into a perfect square and solve step by step, even when the equation will not factor.',
  },
  {
    id: 'quadratic-formula',
    title: 'The Quadratic Formula',
    term: 2,
    order: 6,
    blurb:
      'Solve any quadratic equation with x = (−b ± √(b² − 4ac)) / 2a, including answers that keep a square root.',
  },
];

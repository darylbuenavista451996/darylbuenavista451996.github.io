// Reward-points rules for a lesson. Confirmed with the teacher: modest values,
// based on each student's own performance (no ranking against classmates).
//
//   Watch the video ......... 1
//   Read the discussion ..... 1
//   Do the activity ......... 2
//   Write the reflection .... 2
//   Multiple-choice quiz .... 1 per correct answer (10 questions = up to 10)
//   Perfect quiz bonus ...... 2
//   ---------------------------------
//   Maximum per lesson ...... 18

export const POINTS = {
  watch: 1,
  read: 1,
  activity: 2,
  reflect: 2,
  quizPerCorrect: 1,
  perfectBonus: 2,
} as const;

export const QUIZ_LENGTH = 10;
export const MAX_POINTS =
  POINTS.watch +
  POINTS.read +
  POINTS.activity +
  POINTS.reflect +
  QUIZ_LENGTH * POINTS.quizPerCorrect +
  POINTS.perfectBonus; // 18

export type LessonProgress = {
  watched: boolean;
  read: boolean;
  activityDone: boolean;
  reflection: string;
  reflected: boolean;
  quizDone: boolean;
  quizScore: number; // 0..QUIZ_LENGTH
};

export const EMPTY_PROGRESS: LessonProgress = {
  watched: false,
  read: false,
  activityDone: false,
  reflection: '',
  reflected: false,
  quizDone: false,
  quizScore: 0,
};

// Total reward points from a lesson's current state.
export function computePoints(p: LessonProgress): number {
  let pts = 0;
  if (p.watched) pts += POINTS.watch;
  if (p.read) pts += POINTS.read;
  if (p.activityDone) pts += POINTS.activity;
  if (p.reflected) pts += POINTS.reflect;
  if (p.quizDone) {
    pts += p.quizScore * POINTS.quizPerCorrect;
    if (p.quizScore === QUIZ_LENGTH) pts += POINTS.perfectBonus;
  }
  return pts;
}

// Everything in the lesson has been done.
export function isLessonComplete(p: LessonProgress): boolean {
  return p.watched && p.read && p.activityDone && p.reflected && p.quizDone;
}

// Reward-points model (v2). Points come ONLY from graded work — no points for
// watching the video or reading. Nothing reveals whether an answer is right
// until the student presses "Finish lesson", so answers can't be shared mid-way.
//
// Per lesson the graded parts and their points are defined in the lesson content
// (each question carries its own points). Reflection is a completion item.

export const REFLECTION_POINTS = 2;

// A student's answer to a graded question: a chosen option index, or typed text.
export type Answer = number | string;

export type LessonProgress = {
  reflection: string;
  reflected: boolean;
  answers: Record<number, Answer>; // keyed by the question's global index
  finished: boolean; // pressed "Finish lesson"
  tabSwitches: number; // times the student left the page (integrity signal)
  finalPoints?: number; // total points, frozen at Finish (for offline re-sync)
  finalQuizScore?: number; // multiple-choice quiz correct count, frozen at Finish
};

export const EMPTY_PROGRESS: LessonProgress = {
  reflection: '',
  reflected: false,
  answers: {},
  finished: false,
  tabSwitches: 0,
};

// Normalize a typed answer for comparison: lowercase, no spaces.
export function normalizeTyped(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '');
}

'use client';

// Local, offline-first storage for a student's lesson progress, points, and
// streak. Everything lives in the phone's localStorage so it survives with no
// connection. (A later step syncs points to the server for the teacher's CSV
// export; this file is purely the on-device store.)

import { EMPTY_PROGRESS, type LessonProgress } from './points';

const LESSON_KEY = (id: string) => `vmath.lesson.${id}`;
const STREAK_KEY = 'vmath.streak';

export type Streak = { last: string; count: number };

function safeGet(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  } catch {
    /* storage full or blocked; progress just won't persist */
  }
}

export function loadProgress(id: string): LessonProgress {
  const raw = safeGet(LESSON_KEY(id));
  if (!raw) return { ...EMPTY_PROGRESS };
  try {
    return { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as Partial<LessonProgress>) };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(id: string, p: LessonProgress): void {
  safeSet(LESSON_KEY(id), JSON.stringify(p));
}

// Today's date in the Philippines, as YYYY-MM-DD.
export function manilaToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86_400_000);
}

export function getStreak(): Streak {
  const raw = safeGet(STREAK_KEY);
  if (!raw) return { last: '', count: 0 };
  try {
    return JSON.parse(raw) as Streak;
  } catch {
    return { last: '', count: 0 };
  }
}

// Record activity for today and return the updated streak. Same day keeps the
// count; a consecutive day increments it; a gap resets it to 1.
export function bumpStreak(): Streak {
  const today = manilaToday();
  const cur = getStreak();
  let next: Streak;
  if (cur.last === today) {
    next = cur;
  } else if (cur.last && daysBetween(cur.last, today) === 1) {
    next = { last: today, count: cur.count + 1 };
  } else {
    next = { last: today, count: 1 };
  }
  safeSet(STREAK_KEY, JSON.stringify(next));
  return next;
}

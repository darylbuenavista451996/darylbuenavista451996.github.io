'use client';

// Local, offline-first storage for a student's lesson progress and points.
// Everything lives in the phone's localStorage so it survives with no
// connection. (A later step syncs points to the server for the teacher's CSV
// export; this file is purely the on-device store.)

import { EMPTY_PROGRESS, type LessonProgress } from './points';

// Keyed per student AND per lesson, so progress never leaks between students on
// a shared device.
const LESSON_KEY = (studentKey: string, id: string) => `vmath.${studentKey}.lesson.${id}`;

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

export function loadProgress(studentKey: string, id: string): LessonProgress {
  const raw = safeGet(LESSON_KEY(studentKey, id));
  if (!raw) return { ...EMPTY_PROGRESS };
  try {
    return { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as Partial<LessonProgress>) };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(studentKey: string, id: string, p: LessonProgress): void {
  safeSet(LESSON_KEY(studentKey, id), JSON.stringify(p));
}

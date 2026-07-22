'use client';

// Local, offline-first storage for a student's lesson progress and points.
// Everything lives in the phone's localStorage so it survives with no
// connection. (A later step syncs points to the server for the teacher's CSV
// export; this file is purely the on-device store.)

import { EMPTY_PROGRESS, type LessonProgress } from './points';

const LESSON_KEY = (id: string) => `vmath.lesson.${id}`;

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

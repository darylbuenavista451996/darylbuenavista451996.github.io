'use client';

// Keeps what a student is typing safe if time runs out or they sign out. The
// text is saved to the device (localStorage) as they type, keyed per student and
// per field, and restored when they come back. Nothing leaves the phone until
// they actually submit.

import { useEffect, useRef, useState } from 'react';

export function draftKey(studentKey: string, activityId: string, field: string): string {
  return `vizta.draft.${studentKey}.${activityId}.${field}`;
}

// Controlled value backed by a saved draft. `enabled` false (e.g. already
// submitted) skips all draft behavior and just uses `initial`.
export function useDraft(
  key: string,
  initial: string,
  enabled = true,
): readonly [string, (v: string) => void] {
  const [value, setValue] = useState(initial);
  const loaded = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null && saved !== '') setValue(saved);
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [key, enabled]);

  useEffect(() => {
    if (!enabled || !loaded.current) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage full/blocked — just won't persist */
    }
  }, [key, value, enabled]);

  return [value, setValue] as const;
}

export function clearDraft(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

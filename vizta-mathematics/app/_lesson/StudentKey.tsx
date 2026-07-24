'use client';

// Carries the signed-in student's id down to the lesson components so their
// on-device progress is stored PER STUDENT. Without this, two students sharing a
// phone (or a test account followed by a real one) would see each other's saved
// answers and "finished" state.

import { createContext, useContext } from 'react';

const StudentKeyContext = createContext<string>('anon');

export function StudentKeyProvider({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <StudentKeyContext.Provider value={value}>{children}</StudentKeyContext.Provider>;
}

export function useStudentKey(): string {
  return useContext(StudentKeyContext);
}

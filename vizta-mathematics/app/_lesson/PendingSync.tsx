'use client';

// Flushes a finished-but-not-yet-sent result to the server. Rendered on the
// locked screen so that a student who finished a lesson OFFLINE and comes back
// later (even after the teacher has re-locked it) still gets their points into
// the teacher's records the moment they have internet. Uses the score frozen at
// Finish, so it needs no access to the lesson's questions.

import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/lessonStore';
import { recordResult } from '../actions';

export default function PendingSync({ lessonId }: { lessonId: string }) {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const p = loadProgress(lessonId);
    if (!p.finished || p.finalPoints === undefined) return; // nothing finished to send
    let synced = false;
    try {
      synced = window.localStorage.getItem(`vmath.synced.${lessonId}`) === '1';
    } catch {
      /* ignore */
    }
    if (synced) return;

    setMsg('Sending your earlier work to your teacher…');
    recordResult({
      lessonId,
      points: p.finalPoints,
      quizScore: p.finalQuizScore ?? 0,
      tabSwitches: p.tabSwitches,
    })
      .then((r) => {
        if (r.ok) {
          try {
            window.localStorage.setItem(`vmath.synced.${lessonId}`, '1');
          } catch {
            /* ignore */
          }
          setMsg('✓ Your work has been recorded for your teacher.');
        } else {
          setMsg('');
        }
      })
      .catch(() => setMsg(''));
  }, [lessonId]);

  if (!msg) return null;
  return <p className="ls-note" style={{ textAlign: 'center', marginTop: 14 }}>{msg}</p>;
}

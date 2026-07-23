'use client';

// Flushes a finished-but-not-yet-sent result to the server. Rendered on the
// locked screen so that a student who finished the lesson OFFLINE and comes back
// later (even after the teacher has re-locked it) still gets their points into
// the teacher's records the moment they have internet.

import { useEffect, useState } from 'react';
import { loadProgress } from '@/lib/lessonStore';
import { computePoints } from '@/lib/points';
import { recordResult } from '../actions';

export default function PendingSync({ lessonId }: { lessonId: string }) {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const p = loadProgress(lessonId);
    if (!p.quizDone) return; // nothing finished to send
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
      points: computePoints(p),
      quizScore: p.quizScore,
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

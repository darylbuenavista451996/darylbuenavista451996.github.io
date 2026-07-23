'use client';

// Integrity helper for a lesson: if the student leaves the page (switches to
// another app or tab, e.g. to search for answers), it counts it and warns them
// when they return. A phone browser cannot block app switching, so this
// discourages and reminds rather than preventing.

import { useEffect, useState } from 'react';

export default function LessonGuard() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onVisibility() {
      if (document.hidden) {
        setCount((c) => c + 1);
        setShow(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!show) return null;
  return (
    <div className="lesson-warn" role="alert">
      <strong>Please stay on this lesson.</strong> You left the page{' '}
      {count === 1 ? 'once' : `${count} times`}. During a lesson, please do not switch to other apps
      or search elsewhere.
      <button type="button" className="lesson-warn-x" onClick={() => setShow(false)}>
        I understand
      </button>
    </div>
  );
}

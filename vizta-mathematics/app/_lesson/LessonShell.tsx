'use client';

// The shared six-part lesson flow: Watch, Learn, Activity, Reflect, Quiz,
// Rewards. Content is passed in per lesson, so every math lesson reuses this
// exact structure and the same reward-points rules. It runs offline once
// opened (localStorage), enforces a 45-minute time limit, and records the final
// points on the server (once) so the teacher can export them.

import { useEffect, useRef, useState } from 'react';
import {
  computePoints,
  isLessonComplete,
  MAX_POINTS,
  QUIZ_LENGTH,
  type LessonProgress,
  EMPTY_PROGRESS,
} from '@/lib/points';
import { loadProgress, saveProgress } from '@/lib/lessonStore';
import { recordResult } from '../actions';

const LIMIT_MINUTES = 45;
const LIMIT_MS = LIMIT_MINUTES * 60 * 1000;

export type QuizQuestion = { q: string; options: string[]; answer: number };

export type LessonContent = {
  lessonId: string;
  video: { title: string; youtubeId: string; channel: string };
  discussion: React.ReactNode;
  activity: React.ReactNode;
  reflectionPrompt: string;
  quiz: QuizQuestion[];
};

function SectionTag({ n, label, done }: { n: number; label: string; done: boolean }) {
  return (
    <div className="ls-tag">
      <span className={`ls-step ${done ? 'done' : ''}`}>{done ? '✓' : n}</span>
      <h2 className="ls-h2">{label}</h2>
    </div>
  );
}

function fmtTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

// ---- The quiz (10 questions, one attempt; auto-submits when time is up) ----
function Quiz({
  questions,
  done,
  score,
  timeUp,
  onSubmit,
}: {
  questions: QuizQuestion[];
  done: boolean;
  score: number;
  timeUp: boolean;
  onSubmit: (score: number) => void;
}) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const submittedRef = useRef(false);
  const allAnswered = picks.every((p) => p !== null);

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    let s = 0;
    questions.forEach((q, i) => {
      if (picks[i] === q.answer) s += 1;
    });
    onSubmit(s);
  }

  // When the timer runs out, submit whatever is answered.
  useEffect(() => {
    if (timeUp && !done && !submittedRef.current) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp, done]);

  if (done) {
    return (
      <div className={`ls-quiz-result ${score === QUIZ_LENGTH ? 'perfect' : ''}`}>
        <strong>You scored {score} / {QUIZ_LENGTH}.</strong>
        <p>
          {score === QUIZ_LENGTH
            ? 'Perfect. You earned the bonus points.'
            : `That is ${score} reward ${score === 1 ? 'point' : 'points'} from the quiz.`}
        </p>
      </div>
    );
  }

  return (
    <div className="ls-quiz">
      {questions.map((q, qi) => (
        <div className="ls-q" key={qi}>
          <p className="ls-q-text"><span className="ls-q-num">{qi + 1}</span>{q.q}</p>
          <div className="ls-opts">
            {q.options.map((opt, oi) => (
              <label key={oi} className={`ls-opt ${picks[qi] === oi ? 'sel' : ''}`}>
                <input
                  type="radio"
                  name={`q${qi}`}
                  checked={picks[qi] === oi}
                  disabled={timeUp}
                  onChange={() => setPicks((prev) => prev.map((p, i) => (i === qi ? oi : p)))}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-primary ls-submit" onClick={submit} disabled={!allAnswered}>
        {allAnswered ? 'Submit answers' : `Answer all ${QUIZ_LENGTH} questions`}
      </button>
      <p className="ls-note">You have one attempt, and submitting finishes the lesson. Check your answers first.</p>
    </div>
  );
}

export default function LessonShell({ content }: { content: LessonContent }) {
  const { lessonId, video, discussion, activity, reflectionPrompt, quiz } = content;
  const [p, setP] = useState<LessonProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [warn, setWarn] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const START_KEY = `vmath.start.${lessonId}`;
  const SYNC_KEY = `vmath.synced.${lessonId}`;

  // Load saved progress and the timer start (localStorage is client-only).
  useEffect(() => {
    setP(loadProgress(lessonId));
    let s: number | null = null;
    try {
      const r = window.localStorage.getItem(START_KEY);
      if (r) s = parseInt(r, 10);
    } catch {
      /* ignore */
    }
    if (!s || Number.isNaN(s)) {
      s = Date.now();
      try {
        window.localStorage.setItem(START_KEY, String(s));
      } catch {
        /* ignore */
      }
    }
    setStartAt(s);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Tick the clock every second.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Integrity: count when the student leaves the page and warn them on return.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) {
        setP((prev) => {
          const next = { ...prev, tabSwitches: (prev.tabSwitches ?? 0) + 1 };
          saveProgress(lessonId, next);
          return next;
        });
        setWarn(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [lessonId]);

  const remaining = startAt ? startAt + LIMIT_MS - now : LIMIT_MS;
  const timeUp = remaining <= 0;
  const locked = p.quizDone || timeUp; // no more earning once the quiz is in or time is up

  function update(patch: Partial<LessonProgress>) {
    if (locked) return;
    setP((prev) => {
      const next = { ...prev, ...patch };
      saveProgress(lessonId, next);
      return next;
    });
  }

  const points = computePoints(p);
  const pct = Math.round((points / MAX_POINTS) * 100);
  const complete = isLessonComplete(p);

  // Record the final result on the server, once, after the quiz is submitted
  // (which also happens automatically when time runs out). Retries on a later
  // visit if the student was offline.
  useEffect(() => {
    if (!ready || !p.quizDone) return;
    let alreadySynced = false;
    try {
      alreadySynced = window.localStorage.getItem(SYNC_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (alreadySynced) {
      setSyncStatus('saved');
      return;
    }
    setSyncStatus('saving');
    recordResult({
      lessonId,
      points: computePoints(p),
      quizScore: p.quizScore,
      tabSwitches: p.tabSwitches,
    })
      .then((r) => {
        if (r.ok) {
          try {
            window.localStorage.setItem(SYNC_KEY, '1');
          } catch {
            /* ignore */
          }
          setSyncStatus('saved');
        } else {
          setSyncStatus('error');
        }
      })
      .catch(() => setSyncStatus('error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, p.quizDone]);

  const badges: string[] = [];
  if (p.quizDone && p.quizScore === QUIZ_LENGTH) badges.push('Perfect Score ⭐');
  if (complete) badges.push('Lesson Complete ✅');

  return (
    <div className="ls" aria-busy={!ready}>
      {/* Integrity warning shown after the student leaves the page */}
      {warn && (
        <div className="ls-warn" role="alert">
          <strong>Please stay on this lesson.</strong> You left the page{' '}
          {p.tabSwitches === 1 ? 'once' : `${p.tabSwitches} times`}. During a graded lesson you should
          not switch to other apps or search elsewhere. Your teacher can see how many times this happened.
          <button type="button" className="ls-warn-x" onClick={() => setWarn(false)}>I understand</button>
        </div>
      )}

      {/* Points + timer HUD */}
      <div className="ls-hud">
        <div className="ls-hud-top">
          <span className="ls-hud-label">Reward points</span>
          <span className="ls-hud-points">{points} <span className="ls-hud-max">/ {MAX_POINTS}</span></span>
        </div>
        <div className="ls-hud-track"><div className="ls-hud-fill" style={{ width: `${pct}%` }} /></div>
        <div className={`ls-timer ${remaining <= 5 * 60 * 1000 && !timeUp ? 'low' : ''}`}>
          {timeUp ? '⏱ Time is up' : `⏱ ${fmtTime(remaining)} left`}
        </div>
      </div>

      {timeUp && !p.quizDone && (
        <div className="ls-timeup" role="status">Time is up. Your lesson has been submitted with what you finished.</div>
      )}

      {/* 1. Watch */}
      <section className="ls-sec">
        <SectionTag n={1} label="Watch" done={p.watched} />
        <p className="ls-sub">Watch the video first. It needs internet, so watch it once while you are connected.</p>
        <div className="ls-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="ls-video-meta">{video.title} · {video.channel}</p>
        {p.watched ? (
          <p className="ls-earned">Watched · +1 point</p>
        ) : (
          <button type="button" className="btn btn-ghost" disabled={locked} onClick={() => update({ watched: true })}>
            I watched the video
          </button>
        )}
      </section>

      {/* 2. Learn */}
      <section className="ls-sec">
        <SectionTag n={2} label="Learn" done={p.read} />
        <div className="ls-read">{discussion}</div>
        {p.read ? (
          <p className="ls-earned">Read · +1 point</p>
        ) : (
          <button type="button" className="btn btn-ghost" disabled={locked} onClick={() => update({ read: true })}>
            I read this
          </button>
        )}
      </section>

      {/* 3. Activity */}
      <section className="ls-sec">
        <SectionTag n={3} label="Activity" done={p.activityDone} />
        <p className="ls-sub">Try the tools below. Play with your own examples until it makes sense.</p>
        <div className="ls-activity">{activity}</div>
        {p.activityDone ? (
          <p className="ls-earned">Activity done · +2 points</p>
        ) : (
          <button type="button" className="btn btn-ghost" disabled={locked} onClick={() => update({ activityDone: true })}>
            I did the activity
          </button>
        )}
      </section>

      {/* 4. Reflect */}
      <section className="ls-sec">
        <SectionTag n={4} label="Reflect" done={p.reflected} />
        <p className="ls-sub">{reflectionPrompt}</p>
        <textarea
          className="ls-reflect"
          rows={4}
          placeholder="Write your answer here…"
          value={p.reflection}
          readOnly={p.reflected || locked}
          onChange={(e) => setP((prev) => ({ ...prev, reflection: e.target.value }))}
        />
        {p.reflected ? (
          <p className="ls-earned">Reflection saved · +2 points · locked</p>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={locked || p.reflection.trim().length < 3}
            onClick={() => update({ reflected: true })}
          >
            Save my reflection
          </button>
        )}
      </section>

      {/* 5. Quiz */}
      <section className="ls-sec">
        <SectionTag n={5} label="Multiple choice" done={p.quizDone} />
        <p className="ls-sub">Ten questions, one point each. A perfect score earns a 2-point bonus. Submitting finishes the lesson.</p>
        <Quiz
          questions={quiz}
          done={p.quizDone}
          score={p.quizScore}
          timeUp={timeUp}
          onSubmit={(s) => {
            setP((prev) => {
              const next = { ...prev, quizDone: true, quizScore: s };
              saveProgress(lessonId, next);
              return next;
            });
          }}
        />
      </section>

      {/* 6. Rewards */}
      <section className="ls-sec ls-rewards">
        <SectionTag n={6} label="Your rewards" done={complete} />
        <div className="ls-reward-total">
          <span className="ls-reward-num">{points}</span>
          <span className="ls-reward-of">out of {MAX_POINTS} points</span>
        </div>
        {badges.length > 0 ? (
          <div className="ls-badges">
            {badges.map((b) => (
              <span key={b} className="ls-badge">{b}</span>
            ))}
          </div>
        ) : (
          <p className="ls-sub">Finish every part to earn badges.</p>
        )}
        {p.quizDone ? (
          <p className="ls-note">
            {syncStatus === 'saved'
              ? '✓ Your points are recorded for your teacher.'
              : syncStatus === 'saving'
                ? 'Saving your points…'
                : 'Saved on this phone. Your points will be sent to your teacher when you are online.'}
          </p>
        ) : (
          <p className="ls-note">Finish the quiz to record your points for your teacher.</p>
        )}
      </section>
    </div>
  );
}

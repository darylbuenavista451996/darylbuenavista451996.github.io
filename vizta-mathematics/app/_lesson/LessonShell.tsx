'use client';

// The lesson flow (v2): Watch and Learn earn no points; the graded work is
// typed and multiple-choice questions, each LOCKED the moment it is answered,
// with NO right/wrong feedback until the student presses "Finish lesson". Finish
// reveals the points and the answer key, and records the result on the server.
// 45-minute timer; works offline once opened.

import { useEffect, useRef, useState } from 'react';
import {
  EMPTY_PROGRESS,
  REFLECTION_POINTS,
  normalizeTyped,
  type LessonProgress,
  type Answer,
} from '@/lib/points';
import { loadProgress, saveProgress } from '@/lib/lessonStore';
import { recordResult } from '../actions';

const LIMIT_MINUTES = 45;
const LIMIT_MS = LIMIT_MINUTES * 60 * 1000;

export type ChoiceQuestion = {
  kind: 'choice';
  prompt: React.ReactNode;
  options: string[];
  answer: number;
  points: number;
};
export type TypedQuestion = {
  kind: 'typed';
  prompt: React.ReactNode;
  accept: string[];
  correct: string;
  points: number;
  placeholder?: string;
  hint?: string;
};
export type GradedQuestion = ChoiceQuestion | TypedQuestion;
export type GradedGroup = {
  title: string;
  instructions?: string;
  quiz?: boolean; // the multiple-choice quiz group (used for the recorded quiz score)
  questions: GradedQuestion[];
};
export type LessonContent = {
  lessonId: string;
  video: { title: string; youtubeId: string; channel: string };
  discussion: React.ReactNode;
  explore?: React.ReactNode;
  groups: GradedGroup[];
  reflectionPrompt: string;
};

function isCorrect(q: GradedQuestion, a: Answer | undefined): boolean {
  if (a === undefined) return false;
  if (q.kind === 'choice') return a === q.answer;
  return q.accept.map(normalizeTyped).includes(normalizeTyped(String(a)));
}

function fmtTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

// ---- one multiple-choice question ----
function ChoiceQ({
  q,
  index,
  value,
  finished,
  onPick,
}: {
  q: ChoiceQuestion;
  index: number;
  value: Answer | undefined;
  finished: boolean;
  onPick: (index: number, value: Answer) => void;
}) {
  const answered = value !== undefined;
  return (
    <div className="gq">
      <p className="gq-prompt">{q.prompt}</p>
      <div className="gq-opts">
        {q.options.map((opt, oi) => {
          let cls = 'gq-opt';
          if (finished) {
            if (oi === q.answer) cls += ' correct';
            else if (oi === value) cls += ' wrong';
          } else if (oi === value) cls += ' sel';
          return (
            <button
              key={oi}
              type="button"
              className={cls}
              disabled={answered || finished}
              onClick={() => onPick(index, oi)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {finished && (
        <p className={`gq-key ${value === q.answer ? 'ok' : 'no'}`}>
          {value === q.answer ? `Correct · +${q.points}` : `Answer: ${q.options[q.answer]}`}
        </p>
      )}
    </div>
  );
}

// ---- one typed question ----
function TypedQ({
  q,
  index,
  value,
  finished,
  onPick,
}: {
  q: TypedQuestion;
  index: number;
  value: Answer | undefined;
  finished: boolean;
  onPick: (index: number, value: Answer) => void;
}) {
  const [text, setText] = useState('');
  const answered = value !== undefined;

  if (answered || finished) {
    const correct = isCorrect(q, value);
    return (
      <div className="gq">
        <p className="gq-prompt">{q.prompt}</p>
        <p className="gq-typed">Your answer: <strong>{value !== undefined ? String(value) : '(no answer)'}</strong></p>
        {finished && (
          <p className={`gq-key ${correct ? 'ok' : 'no'}`}>
            {correct ? `Correct · +${q.points}` : `Answer: ${q.correct}`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="gq">
      <p className="gq-prompt">{q.prompt}</p>
      {q.hint && <p className="gq-hint">{q.hint}</p>}
      <div className="gq-typed-row">
        <input
          className="mlz-input"
          value={text}
          placeholder={q.placeholder}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          autoCapitalize="none"
        />
        <button
          type="button"
          className="btn btn-primary gq-lock"
          disabled={text.trim().length === 0}
          onClick={() => onPick(index, text.trim())}
        >
          Lock
        </button>
      </div>
    </div>
  );
}

export default function LessonShell({ content }: { content: LessonContent }) {
  const { lessonId, video, discussion, explore, groups, reflectionPrompt } = content;
  const [p, setP] = useState<LessonProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [warn, setWarn] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const syncRef = useRef(false);

  const START_KEY = `vmath.start.${lessonId}`;
  const SYNC_KEY = `vmath.synced.${lessonId}`;

  // Flatten graded questions into a single indexed list.
  const flat: GradedQuestion[] = [];
  const quizIdx: number[] = [];
  for (const g of groups) for (const q of g.questions) {
    if (g.quiz) quizIdx.push(flat.length);
    flat.push(q);
  }
  const total = flat.length;
  const maxPoints = flat.reduce((s, q) => s + q.points, 0) + REFLECTION_POINTS;

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

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

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
  const answeredCount = flat.filter((_, i) => p.answers[i] !== undefined).length;
  const allAnswered = answeredCount === total;
  // Everything must be done before Finish turns green: all graded questions AND
  // the reflection. The timer can still auto-finish when it runs out.
  const canFinish = allAnswered && p.reflected;
  const finished = p.finished;

  function onPick(index: number, val: Answer) {
    if (finished) return;
    setP((prev) => {
      if (prev.answers[index] !== undefined) return prev; // already locked
      const next = { ...prev, answers: { ...prev.answers, [index]: val } };
      saveProgress(lessonId, next);
      return next;
    });
  }

  function doFinish() {
    setP((prev) => {
      if (prev.finished) return prev;
      let pts = 0;
      flat.forEach((q, i) => {
        if (isCorrect(q, prev.answers[i])) pts += q.points;
      });
      if (prev.reflected) pts += REFLECTION_POINTS;
      const qc = quizIdx.filter((i) => isCorrect(flat[i], prev.answers[i])).length;
      const next = { ...prev, finished: true, finalPoints: pts, finalQuizScore: qc };
      saveProgress(lessonId, next);
      return next;
    });
  }

  // Time's up: finish automatically with whatever is answered.
  useEffect(() => {
    if (timeUp && ready && !finished) doFinish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp, ready, finished]);

  // Score (only meaningful once finished).
  let points = 0;
  flat.forEach((q, i) => {
    if (isCorrect(q, p.answers[i])) points += q.points;
  });
  if (p.reflected) points += REFLECTION_POINTS;
  const quizCorrect = quizIdx.filter((i) => isCorrect(flat[i], p.answers[i])).length;

  // Record on the server, once, after finishing. Retries on a later online visit.
  useEffect(() => {
    if (!ready || !finished) return;
    if (syncRef.current) return;
    let already = false;
    try {
      already = window.localStorage.getItem(SYNC_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (already) {
      setSyncStatus('saved');
      syncRef.current = true;
      return;
    }
    syncRef.current = true;
    setSyncStatus('saving');
    recordResult({
      lessonId,
      points: p.finalPoints ?? points,
      quizScore: p.finalQuizScore ?? quizCorrect,
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
          syncRef.current = false;
        }
      })
      .catch(() => {
        setSyncStatus('error');
        syncRef.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, finished]);

  let gi = 0; // running global index while rendering groups

  return (
    <div className="ls" aria-busy={!ready}>
      {warn && !finished && (
        <div className="ls-warn" role="alert">
          <strong>Please stay on this lesson.</strong> You left the page{' '}
          {p.tabSwitches === 1 ? 'once' : `${p.tabSwitches} times`}. During a graded lesson you should
          not switch to other apps or search elsewhere. Your teacher can see how many times this happened.
          <button type="button" className="ls-warn-x" onClick={() => setWarn(false)}>I understand</button>
        </div>
      )}

      {/* HUD: progress + timer (points are hidden until Finish) */}
      <div className="ls-hud">
        <div className="ls-hud-top">
          {finished ? (
            <>
              <span className="ls-hud-label">Reward points</span>
              <span className="ls-hud-points">{points} <span className="ls-hud-max">/ {maxPoints}</span></span>
            </>
          ) : (
            <>
              <span className="ls-hud-label">Answered</span>
              <span className="ls-hud-points">{answeredCount} <span className="ls-hud-max">/ {total}</span></span>
            </>
          )}
        </div>
        <div className="ls-hud-track">
          <div className="ls-hud-fill" style={{ width: `${finished ? Math.round((points / maxPoints) * 100) : Math.round((answeredCount / Math.max(1, total)) * 100)}%` }} />
        </div>
        {!finished && (
          <div className={`ls-timer ${remaining <= 5 * 60 * 1000 && !timeUp ? 'low' : ''}`}>
            {timeUp ? '⏱ Time is up' : `⏱ ${fmtTime(remaining)} left`}
          </div>
        )}
      </div>

      {/* Watch (no points) */}
      <section className="ls-sec">
        <div className="ls-tag"><span className="ls-step muted">▶</span><h2 className="ls-h2">Watch</h2></div>
        <p className="ls-sub">Watch the video. It needs internet, so watch it while you are connected.</p>
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
      </section>

      {/* Learn (no points) */}
      <section className="ls-sec">
        <div className="ls-tag"><span className="ls-step muted">📖</span><h2 className="ls-h2">Learn</h2></div>
        <div className="ls-read">{discussion}</div>
      </section>

      {/* Explore (ungraded tools) */}
      {explore && (
        <section className="ls-sec">
          <div className="ls-tag"><span className="ls-step muted">✎</span><h2 className="ls-h2">Practice tools</h2></div>
          <p className="ls-sub">Use these to practice. They are not graded — the graded questions come next.</p>
          <div className="ls-activity">{explore}</div>
        </section>
      )}

      {/* Graded groups */}
      {groups.map((g, giGroup) => (
        <section className="ls-sec" key={ giGroup }>
          <div className="ls-tag"><span className="ls-step">{giGroup + 1}</span><h2 className="ls-h2">{g.title}</h2></div>
          {g.instructions && <p className="ls-sub">{g.instructions}</p>}
          {g.questions.map((q) => {
            const index = gi++;
            return q.kind === 'choice' ? (
              <ChoiceQ key={index} q={q} index={index} value={p.answers[index]} finished={finished} onPick={onPick} />
            ) : (
              <TypedQ key={index} q={q} index={index} value={p.answers[index]} finished={finished} onPick={onPick} />
            );
          })}
        </section>
      ))}

      {/* Reflect (completion) */}
      <section className="ls-sec">
        <div className="ls-tag"><span className="ls-step">{groups.length + 1}</span><h2 className="ls-h2">Reflect</h2></div>
        <p className="ls-sub">{reflectionPrompt}</p>
        <textarea
          className="ls-reflect"
          rows={4}
          placeholder="Write your answer here…"
          value={p.reflection}
          readOnly={p.reflected || finished}
          onChange={(e) => setP((prev) => ({ ...prev, reflection: e.target.value }))}
        />
        {p.reflected ? (
          <p className="ls-earned">Reflection saved · locked</p>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={finished || p.reflection.trim().length < 3}
            onClick={() => setP((prev) => { const next = { ...prev, reflected: true }; saveProgress(lessonId, next); return next; })}
          >
            Save my reflection
          </button>
        )}
      </section>

      {/* Finish */}
      <section className="ls-sec ls-rewards">
        <div className="ls-tag"><span className="ls-step">🏆</span><h2 className="ls-h2">Finish</h2></div>
        {finished ? (
          <>
            <div className="ls-reward-total">
              <span className="ls-reward-num">{points}</span>
              <span className="ls-reward-of">out of {maxPoints} reward points</span>
            </div>
            <p className="ls-sub">The answer key is now shown above, in green (correct) and red. Scroll up to review.</p>
            <p className="ls-note">
              {syncStatus === 'saved'
                ? '✓ Your points are recorded for your teacher.'
                : syncStatus === 'saving'
                  ? 'Saving your points…'
                  : 'Saved on this phone. Your points will be sent to your teacher when you are online.'}
            </p>
          </>
        ) : (
          <>
            <p className="ls-sub">
              Finish turns on once you have answered every question and saved your reflection. Pressing
              it reveals your points and the answer key, and cannot be undone.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canFinish}
              onClick={doFinish}
            >
              {!allAnswered
                ? `Answer all ${total} questions first (${answeredCount}/${total})`
                : !p.reflected
                  ? 'Save your reflection first'
                  : 'Finish lesson'}
            </button>
          </>
        )}
      </section>
    </div>
  );
}

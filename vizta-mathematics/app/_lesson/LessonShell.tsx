'use client';

// The shared six-part lesson flow: Watch, Learn, Activity, Reflect, Quiz,
// Rewards. Content is passed in per lesson, so every math lesson reuses this
// exact structure and the same reward-points rules. Everything runs in the
// browser and persists to localStorage, so it works fully offline once opened.

import { useEffect, useState } from 'react';
import {
  computePoints,
  isLessonComplete,
  MAX_POINTS,
  QUIZ_LENGTH,
  type LessonProgress,
  EMPTY_PROGRESS,
} from '@/lib/points';
import { loadProgress, saveProgress } from '@/lib/lessonStore';

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

// ---- The quiz (10 questions, one attempt) ----
function Quiz({
  questions,
  done,
  score,
  onSubmit,
}: {
  questions: QuizQuestion[];
  done: boolean;
  score: number;
  onSubmit: (score: number) => void;
}) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const allAnswered = picks.every((p) => p !== null);

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

  function submit() {
    let s = 0;
    questions.forEach((q, i) => {
      if (picks[i] === q.answer) s += 1;
    });
    onSubmit(s);
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
                  onChange={() => setPicks((prev) => prev.map((p, i) => (i === qi ? oi : p)))}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary ls-submit"
        onClick={submit}
        disabled={!allAnswered}
      >
        {allAnswered ? 'Submit answers' : `Answer all ${QUIZ_LENGTH} questions`}
      </button>
      <p className="ls-note">You have one attempt, so check your answers first.</p>
    </div>
  );
}

export default function LessonShell({ content }: { content: LessonContent }) {
  const { lessonId, video, discussion, activity, reflectionPrompt, quiz } = content;
  const [p, setP] = useState<LessonProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  // Load saved progress after mount (localStorage is client-only).
  useEffect(() => {
    setP(loadProgress(lessonId));
    setReady(true);
  }, [lessonId]);

  function update(patch: Partial<LessonProgress>) {
    setP((prev) => {
      const next = { ...prev, ...patch };
      saveProgress(lessonId, next);
      return next;
    });
  }

  const points = computePoints(p);
  const pct = Math.round((points / MAX_POINTS) * 100);
  const complete = isLessonComplete(p);

  const badges: string[] = [];
  if (p.quizDone && p.quizScore === QUIZ_LENGTH) badges.push('Perfect Score ⭐');
  if (complete) badges.push('Lesson Complete ✅');

  return (
    <div className="ls" aria-busy={!ready}>
      {/* Points HUD */}
      <div className="ls-hud">
        <div className="ls-hud-top">
          <span className="ls-hud-label">Reward points</span>
          <span className="ls-hud-points">{points} <span className="ls-hud-max">/ {MAX_POINTS}</span></span>
        </div>
        <div className="ls-hud-track"><div className="ls-hud-fill" style={{ width: `${pct}%` }} /></div>
      </div>

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
          <button type="button" className="btn btn-ghost" onClick={() => update({ watched: true })}>
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
          <button type="button" className="btn btn-ghost" onClick={() => update({ read: true })}>
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
          <button type="button" className="btn btn-ghost" onClick={() => update({ activityDone: true })}>
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
          onChange={(e) => setP((prev) => ({ ...prev, reflection: e.target.value }))}
        />
        {p.reflected ? (
          <p className="ls-earned">Reflection saved · +2 points</p>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={p.reflection.trim().length < 3}
            onClick={() => update({ reflected: true })}
          >
            Save my reflection
          </button>
        )}
      </section>

      {/* 5. Quiz */}
      <section className="ls-sec">
        <SectionTag n={5} label="Multiple choice" done={p.quizDone} />
        <p className="ls-sub">Ten questions, one point each. A perfect score earns a 2-point bonus.</p>
        <Quiz
          questions={quiz}
          done={p.quizDone}
          score={p.quizScore}
          onSubmit={(s) => update({ quizDone: true, quizScore: s })}
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
        <p className="ls-note">
          Your points are saved on this phone. When you connect to the internet, they are recorded for your teacher.
        </p>
      </section>
    </div>
  );
}

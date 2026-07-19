'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitQuiz, type QuizState } from './actions';
import type { QuizItem } from '@/lib/data';

function GradeButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-navy" type="submit" disabled={pending}>
      {pending ? 'Checking…' : 'Check my answers'}
    </button>
  );
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function QuizRunner({
  activityId,
  items,
  priorScore,
}: {
  activityId: string;
  items: QuizItem[];
  priorScore: number | null;
}) {
  const bound = submitQuiz.bind(null, activityId);
  const [state, formAction] = useFormState<QuizState, FormData>(bound, {});

  // After scoring, map quiz_id -> review row for coloring.
  const review = new Map((state.review ?? []).map((r) => [r.quiz_id, r]));
  const scored = state.scored === true;
  // Already completed on a previous visit — this quiz is one attempt only.
  const alreadyDone = !scored && priorScore != null;
  const locked = scored || alreadyDone;

  return (
    <form action={formAction}>
      {scored ? (
        <div className="banner banner-success" role="status">
          <strong>You scored {state.score} out of {state.total}.</strong>
          <div className="hint">Correct answers are marked below.</div>
        </div>
      ) : alreadyDone ? (
        <div className="banner banner-success" role="status">
          <strong>You already completed this quiz — you scored {priorScore} out of {items.length}.</strong>
        </div>
      ) : null}

      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <ol className="quiz">
        {items.map((q) => {
          const r = review.get(q.quiz_id);
          return (
            <li key={q.quiz_id} className="quiz-item">
              <p className="quiz-q">{q.question}</p>
              <div className="quiz-opts">
                {LETTERS.map((letter) => {
                  const text = (q as Record<string, unknown>)[`option_${letter.toLowerCase()}`] as string | null;
                  if (!text) return null;
                  let cls = 'quiz-opt';
                  if (scored && r) {
                    if (letter === r.correct) cls += ' opt-correct';
                    else if (letter === r.chosen) cls += ' opt-wrong';
                  }
                  return (
                    <label key={letter} className={cls}>
                      <input
                        type="radio"
                        name={q.quiz_id}
                        value={letter}
                        defaultChecked={r?.chosen === letter}
                        disabled={locked}
                      />
                      <span><b>{letter}.</b> {text}</span>
                      {scored && r && letter === r.correct ? <span className="tick"> ✓</span> : null}
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {locked ? null : <GradeButton />}
    </form>
  );
}

'use client';

// Completing the Square. Ungraded step-by-step tool, then graded work: 5 typed
// questions (1 pt each), 3 problems with 5 choices (2 pts each), and a
// 10-question multiple-choice quiz (1 pt each). 23 points total, same as the
// other math lessons.

import LessonKey from '../_lesson/LessonKey';
import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';
import { SquareTool } from '../_lesson/QuadTools';

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Some quadratics do not factor nicely. <strong>Completing the square</strong> works on every one of them.
        The idea: turn one side into a <strong>perfect square</strong> like <code>(x + 3)²</code>, then take the
        square root of both sides.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">The key fact</h4>
        <p style={{ margin: 0 }}>
          <code>x² + bx</code> becomes a perfect square when you add <code>(b/2)²</code>. Then
          <code> x² + bx + (b/2)² = (x + b/2)²</code>.
        </p>
        <p style={{ margin: '8px 0 0' }}>Example: <code>x² + 6x</code>. Half of 6 is 3, and 3² = 9. So <code>x² + 6x + 9 = (x + 3)²</code>.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Solving by completing the square</h4>
        <ol className="mlz-method-steps">
          <li>If <code>a</code> is not 1, divide every term by <code>a</code>.</li>
          <li>Move the constant term to the right side.</li>
          <li>Take half of the x coefficient, square it, and add it to <strong>both</strong> sides.</li>
          <li>Write the left side as a square: <code>(x + h)²</code>.</li>
          <li>Take the square root of both sides. Remember the <code>±</code>.</li>
          <li>Solve for <code>x</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p>Solve <code>x² + 6x + 5 = 0</code>.</p>
        <p><code>x² + 6x = −5</code></p>
        <p>Half of 6 is 3, and 3² = 9. Add 9 to both sides: <code>x² + 6x + 9 = −5 + 9</code></p>
        <p><code>(x + 3)² = 4</code>, so <code>x + 3 = ±2</code></p>
        <p><strong>x = −1 or x = −5</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2: a is not 1</span>
        <p>Solve <code>2x² + 8x − 10 = 0</code>.</p>
        <p>Divide by 2: <code>x² + 4x − 5 = 0</code>. Move the constant: <code>x² + 4x = 5</code>.</p>
        <p>Half of 4 is 2, and 2² = 4. Add 4 to both sides: <code>(x + 2)² = 9</code></p>
        <p><code>x + 2 = ±3</code>, so <strong>x = 1 or x = −5</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 3: the answer has a square root</span>
        <p>Solve <code>x² − 6x + 2 = 0</code>.</p>
        <p><code>x² − 6x = −2</code>. Half of −6 is −3, and (−3)² = 9. Add 9 to both sides: <code>(x − 3)² = 7</code></p>
        <p><code>x − 3 = ±√7</code>, so <strong>x = 3 ± √7</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Careful</span>
        <p>If the right side turns out negative, like <code>(x + 1)² = −4</code>, there is no real solution, because a real number squared is never negative.</p>
      </div>
      <p className="mlz-p">Use the tool below to see the steps for any equation. Try to guess each step before you read it.</p>
    </>
  );
}

const FIND: GradedGroup = {
  title: 'Part A: complete the square',
  instructions: 'Type your answer as a number. For a fraction, write it like 9/4 or as a decimal. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <>What number must be added to <code>x² + 8x</code> to make a perfect square trinomial?</>, accept: ['16'], correct: '16', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>What number must be added to <code>x² − 10x</code> to make a perfect square trinomial?</>, accept: ['25'], correct: '25', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>What number must be added to <code>x² + 3x</code> to make a perfect square trinomial?</>, accept: ['9/4', '2.25'], correct: '9/4', points: 1, placeholder: 'a fraction or decimal' },
    { kind: 'typed', prompt: <>Solve <code>x² + 6x + 5 = 0</code> by completing the square. Type the <strong>larger</strong> solution.</>, accept: ['-1'], correct: '-1', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Solve <code>x² − 4x − 12 = 0</code> by completing the square. Type the <strong>smaller</strong> solution.</>, accept: ['-2'], correct: '-2', points: 1, placeholder: 'a number' },
  ],
};

const SOLVE: GradedGroup = {
  title: 'Part B: solve the problem',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>Which equation shows <code>x² − 6x + 2 = 0</code> after completing the square?</>,
      options: ['(x − 3)² = 7', '(x − 3)² = 11', '(x + 3)² = 7', '(x − 6)² = 7', '(x − 3)² = −7'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>What are the solutions of <code>2x² + 8x − 10 = 0</code>? (Divide by 2 first.)</>,
      options: ['x = 1 or x = −5', 'x = −1 or x = 5', 'x = 2 or x = −10', 'x = 1 or x = 5', 'x = −1 or x = −5'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>A rectangular garden is 4 m longer than it is wide, and its area is 21 m². If <code>w</code> is the width, then <code>w(w + 4) = 21</code>. Completing the square gives <code>(w + 2)² = 25</code>. What is the width?</>,
      options: ['3 m', '7 m', '5 m', '−7 m', '4 m'],
      answer: 0, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'To complete the square on x² + bx, you add…', options: ['b', '(b/2)²', 'b²', '2b'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'What number completes the square for x² + 12x?', options: ['6', '12', '36', '144'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'x² + 10x + 25 can be written as…', options: ['(x + 5)²', '(x + 10)²', '(x − 5)²', 'x² + 5²'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'x² − 14x + 49 can be written as…', options: ['(x + 7)²', '(x − 7)²', '(x − 14)²', '(x − 49)²'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'When completing the square on 3x² + 12x = 9, what is the first step?', options: ['add 36 to both sides', 'divide every term by 3', 'take the square root', 'subtract 9'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'x² + 2x = 8. After adding 1 to both sides, the right side is…', options: ['8', '9', '10', '1'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'If (x − 4)² = 9, then…', options: ['x = 7 or x = 1', 'x = 13 or x = −5', 'x = 3 only', 'x = 7 only'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'If (x + 1)² = −4, then…', options: ['x = 1 or x = −3', 'x = 1 only', 'there is no real solution', 'x = −3 only'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'If (x − 5)² = 0, then…', options: ['x = 5 only', 'x = 5 or x = −5', 'x = 0', 'there is no solution'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'Which one is a perfect square trinomial?', options: ['x² + 8x + 16', 'x² + 8x + 8', 'x² + 8x + 4', 'x² + 8x + 64'], answer: 0, points: 1 },
  ],
};

export default function SquareLesson({ preview }: { preview?: boolean }) {
  const content: LessonContent = {
    lessonId: 'completing-the-square',
    video: { title: 'Completing the square', youtubeId: 'TV5kDqiJ1Os', channel: 'Khan Academy' },
    discussion: <Discussion />,
    explore: <SquareTool />,
    groups: [FIND, SOLVE, QUIZ],
    reflectionPrompt:
      'Explain in your own words why we add the same number to both sides when completing the square. Which step was hardest for you, and what helped you understand it?',
  };
  return preview ? <LessonKey content={content} /> : <LessonShell content={content} />;
}

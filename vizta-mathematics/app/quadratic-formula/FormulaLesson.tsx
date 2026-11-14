'use client';

// The Quadratic Formula. Ungraded solver tool, then graded work: 5 typed
// questions (1 pt each), 3 problems with 5 choices (2 pts each), and a
// 10-question multiple-choice quiz (1 pt each). 23 points total, same as the
// other math lessons.

import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';
import { FormulaTool } from '../_lesson/QuadTools';

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Completing the square works every time, but it takes many steps. If you do the steps once on
        <code> ax² + bx + c = 0</code> using letters, you get one formula that solves <strong>every</strong> quadratic equation:
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">The quadratic formula</h4>
        <p style={{ margin: 0, fontSize: '1.15em' }}><code>x = (−b ± √(b² − 4ac)) / (2a)</code></p>
        <p style={{ margin: '8px 0 0' }}>The part under the square root, <code>b² − 4ac</code>, is the <strong>discriminant</strong> you met in the last lesson. The <code>±</code> gives you the two solutions: one with +, one with −.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">How to use it</h4>
        <ol className="mlz-method-steps">
          <li>Write the equation as <code>ax² + bx + c = 0</code> and read <code>a</code>, <code>b</code>, <code>c</code> with their signs.</li>
          <li>Find the discriminant <code>D = b² − 4ac</code>. If <code>D &lt; 0</code>, stop: there is no real solution.</li>
          <li>Put the numbers into the formula. Use brackets for negative numbers.</li>
          <li>Work out the + answer and the − answer.</li>
          <li>Check one answer by putting it back into the original equation.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p>Solve <code>x² − 5x + 6 = 0</code>. Here <code>a = 1</code>, <code>b = −5</code>, <code>c = 6</code>.</p>
        <p><code>D = (−5)² − 4(1)(6) = 25 − 24 = 1</code></p>
        <p><code>x = (5 ± √1) / 2 = (5 ± 1) / 2</code></p>
        <p><strong>x = 3 or x = 2</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2</span>
        <p>Solve <code>2x² + x − 6 = 0</code>. Here <code>a = 2</code>, <code>b = 1</code>, <code>c = −6</code>.</p>
        <p><code>D = 1² − 4(2)(−6) = 1 + 48 = 49</code></p>
        <p><code>x = (−1 ± 7) / 4</code>, so <code>x = 6/4 = 3/2</code> or <code>x = −8/4 = −2</code></p>
        <p><strong>x = 3/2 or x = −2</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 3: the answer keeps a square root</span>
        <p>Solve <code>x² − 4x + 1 = 0</code>. Here <code>a = 1</code>, <code>b = −4</code>, <code>c = 1</code>.</p>
        <p><code>D = 16 − 4 = 12</code>, and <code>√12 = 2√3</code>.</p>
        <p><code>x = (4 ± 2√3) / 2 = 2 ± √3</code></p>
        <p><strong>x = 2 + √3 or x = 2 − √3</strong></p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Watch out</span>
        <p>The −b in front means the <strong>opposite</strong> of b. If <code>b = −5</code>, then <code>−b = 5</code>. Most mistakes come from this sign and from forgetting that 2a is on the bottom of the <em>whole</em> top part.</p>
      </div>
      <p className="mlz-p">Use the solver below to check your own work. Solve on paper first, then compare.</p>
    </>
  );
}

const FIND: GradedGroup = {
  title: 'Part A: use the formula',
  instructions: 'Type your answer as a number. For a fraction, write it like 3/2 or as a decimal. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <>Solve <code>x² − 5x + 6 = 0</code>. Type the <strong>larger</strong> solution.</>, accept: ['3'], correct: '3', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Solve <code>2x² + x − 6 = 0</code>. Type the <strong>larger</strong> solution.</>, accept: ['3/2', '1.5'], correct: '3/2', points: 1, placeholder: 'a fraction or decimal' },
    { kind: 'typed', prompt: <><code>x² + 4x + 4 = 0</code> has only one solution. What is it?</>, accept: ['-2'], correct: '-2', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Solve <code>3x² − x − 2 = 0</code>. Type the <strong>larger</strong> solution.</>, accept: ['1'], correct: '1', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Solve <code>x² = 2x + 15</code>. Write it in standard form first. Type the <strong>smaller</strong> solution.</>, accept: ['-3'], correct: '-3', points: 1, placeholder: 'a number' },
  ],
};

const SOLVE: GradedGroup = {
  title: 'Part B: solve the problem',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>What are the solutions of <code>x² − 4x + 1 = 0</code>?</>,
      options: ['x = 2 ± √3', 'x = 4 ± √3', 'x = 2 ± 2√3', 'x = −2 ± √3', 'x = 2 ± √12'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>A ball&apos;s height in meters after <code>t</code> seconds is <code>h = −5t² + 10t + 15</code>. After how many seconds does it hit the ground (<code>h = 0</code>)?</>,
      options: ['3 s', '1 s', '5 s', '−1 s', '15 s'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>The product of two consecutive positive whole numbers is 56. Which pair is it? (Let the numbers be <code>n</code> and <code>n + 1</code>, so <code>n² + n − 56 = 0</code>.)</>,
      options: ['7 and 8', '6 and 7', '8 and 9', '−8 and −7', '7 and 9'],
      answer: 0, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'The quadratic formula is…', options: ['x = (−b ± √(b² − 4ac)) / 2a', 'x = (b ± √(b² − 4ac)) / 2a', 'x = (−b ± √(b² + 4ac)) / 2a', 'x = (−b ± √(b² − 4ac)) / a'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'In 2x² + 3x − 5 = 0, the values of a, b and c are…', options: ['a = 2, b = 3, c = 5', 'a = 2, b = 3, c = −5', 'a = 3, b = 2, c = −5', 'a = −5, b = 3, c = 2'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'In x² − 6x + 8 = 0, the value of −b is…', options: ['−6', '6', '8', '−8'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'If b² − 4ac is negative, the quadratic formula gives…', options: ['two real solutions', 'one real solution', 'no real solutions', 'a solution of 0'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'The solutions of x² − 7x + 10 = 0 are…', options: ['2 and 5', '−2 and −5', '1 and 10', '3 and 4'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'The solutions of x² + x − 6 = 0 are…', options: ['−2 and 3', '2 and −3', '1 and −6', '2 and 3'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'Before using the quadratic formula, the equation must be written as…', options: ['x = something', 'ax² + bx + c = 0', '(x + h)² = k', 'y = mx + b'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'The solutions of 2x² − 8 = 0 (here b = 0) are…', options: ['x = 4 only', 'x = 2 or x = −2', 'x = 8 or x = −8', 'there are no real solutions'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'The ± symbol in the formula means…', options: ['you must pick the + answer only', 'you get one answer with + and one with −', 'you add the two answers', 'the answer is always negative'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'Which method works for every quadratic equation?', options: ['factoring', 'the quadratic formula', 'guessing', 'taking square roots'], answer: 1, points: 1 },
  ],
};

export default function FormulaLesson() {
  const content: LessonContent = {
    lessonId: 'quadratic-formula',
    video: { title: 'Introduction to the quadratic equation', youtubeId: 'IWigvJcCAJ0', channel: 'Khan Academy' },
    discussion: <Discussion />,
    explore: <FormulaTool />,
    groups: [FIND, SOLVE, QUIZ],
    reflectionPrompt:
      'Solve one quadratic equation of your own using the formula and show your steps. Then say which of the three methods from this week (discriminant, completing the square, formula) you find easiest and why.',
  };
  return <LessonShell content={content} />;
}

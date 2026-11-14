'use client';

// The Discriminant. Ungraded checker tool, then graded work: 5 typed questions
// (1 pt each), 3 problems with 5 choices (2 pts each), and a 10-question
// multiple-choice quiz (1 pt each). Same structure and points (23 total) as the
// other math lessons.

import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';
import { DiscriminantTool } from '../_lesson/QuadTools';

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        A quadratic equation can have <strong>two</strong> real solutions, <strong>one</strong>, or <strong>none</strong>.
        You can find out which one <em>without solving the equation</em>. You only need a number called
        the <strong>discriminant</strong>.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Step 1: write it in standard form</h4>
        <p style={{ margin: 0 }}>Move everything to one side so it looks like <code>ax² + bx + c = 0</code>. Then read off <code>a</code>, <code>b</code> and <code>c</code>, including their signs.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Step 2: compute the discriminant</h4>
        <p style={{ margin: 0 }}><code>D = b² − 4ac</code></p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Step 3: read the result</h4>
        <ul className="mlz-list">
          <li><strong>D &gt; 0</strong>: two different real solutions. The parabola crosses the x-axis twice.</li>
          <li><strong>D = 0</strong>: exactly one real solution. The parabola just touches the x-axis.</li>
          <li><strong>D &lt; 0</strong>: no real solutions. The parabola never reaches the x-axis.</li>
        </ul>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p><code>x² − 4x − 5 = 0</code> has <code>a = 1</code>, <code>b = −4</code>, <code>c = −5</code>.</p>
        <p><code>D = (−4)² − 4(1)(−5) = 16 + 20 = 36</code>. Since <code>36 &gt; 0</code>, there are two real solutions.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2: rearrange first</span>
        <p><code>x² = 6x − 9</code> becomes <code>x² − 6x + 9 = 0</code>, so <code>a = 1</code>, <code>b = −6</code>, <code>c = 9</code>.</p>
        <p><code>D = (−6)² − 4(1)(9) = 36 − 36 = 0</code>. There is exactly one real solution.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 3: no real solution</span>
        <p><code>x² + 2x + 7 = 0</code>: <code>D = 2² − 4(1)(7) = 4 − 28 = −24</code>. Since <code>D &lt; 0</code>, there are no real solutions.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Good to know</span>
        <p>When <code>a</code>, <code>b</code> and <code>c</code> are whole numbers and <code>D</code> is a perfect square (like 1, 4, 9, 16, 25, 36, 49), the two solutions are rational numbers, so they are whole numbers or fractions. When <code>D</code> is positive but not a perfect square, the solutions involve a square root.</p>
      </div>
      <p className="mlz-p">Use the checker below to test your own equations. Guess the answer first, then check.</p>
    </>
  );
}

const FIND: GradedGroup = {
  title: 'Part A: find the discriminant',
  instructions: 'Type your answer as a number. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <>Find the discriminant of <code>x² + 6x + 5 = 0</code>.</>, accept: ['16'], correct: '16', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the discriminant of <code>x² = 3x + 10</code>. Write it in standard form first.</>, accept: ['49'], correct: '49', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the discriminant of <code>x² − 4x + 4 = 0</code>.</>, accept: ['0'], correct: '0', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the discriminant of <code>3x² + 2x + 5 = 0</code>.</>, accept: ['-56'], correct: '-56', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the <strong>positive</strong> value of <code>k</code> so that <code>x² + kx + 9 = 0</code> has exactly one real solution.</>, accept: ['6'], correct: '6', points: 1, placeholder: 'a number' },
  ],
};

const SOLVE: GradedGroup = {
  title: 'Part B: solve the problem',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>A drone&apos;s height in meters after <code>t</code> seconds is <code>h = −t² + 6t + 1</code>. Will it ever reach a height of 12 m? (Set <code>−t² + 6t + 1 = 12</code>, then rearrange and check the discriminant.)</>,
      options: ['Yes, at two different times', 'Yes, at exactly one time', 'No, it never reaches 12 m', 'Yes, at three different times', 'It cannot be told'],
      answer: 2, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>For which values of <code>k</code> does <code>2x² + kx + 8 = 0</code> have exactly one real solution?</>,
      options: ['k = 4 only', 'k = 8 or k = −8', 'k = 16', 'k = 8 only', 'k = 0'],
      answer: 1, points: 2,
    },
    {
      kind: 'choice',
      prompt: <><code>x² + 4x + c = 0</code> must have two different real solutions. Which values of <code>c</code> work?</>,
      options: ['c > 4', 'c < 4', 'c = 4', 'c < 16', 'c > 16'],
      answer: 1, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'The discriminant of ax² + bx + c = 0 is…', options: ['b² − 4ac', 'b² + 4ac', '4ac − b²', '√(b² − 4ac)'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'If the discriminant is greater than 0, the equation has…', options: ['no real solutions', 'one real solution', 'two different real solutions', 'three solutions'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'If the discriminant is exactly 0, the equation has…', options: ['no real solutions', 'one real solution', 'two different real solutions', 'infinitely many solutions'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'If the discriminant is less than 0, the equation has…', options: ['no real solutions', 'one real solution', 'two different real solutions', 'two equal solutions'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'What is the discriminant of x² − 5x + 6 = 0?', options: ['1', '11', '49', '−1'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'What is the discriminant of x² + x + 1 = 0?', options: ['−3', '5', '3', '−5'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'Which equation has exactly one real solution?', options: ['x² + 4x + 4 = 0', 'x² + 4x + 3 = 0', 'x² + 4x + 5 = 0', 'x² − 4x − 5 = 0'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'Which equation has no real solutions?', options: ['x² + 2x − 3 = 0', 'x² + 2x + 3 = 0', 'x² − 2x + 1 = 0', 'x² + 5x + 6 = 0'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'a, b and c are whole numbers and the discriminant is 25. The two solutions are…', options: ['rational (whole numbers or fractions)', 'not real numbers', 'always irrational', 'always equal'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'The parabola y = x² − 6x + 9 touches the x-axis at how many points?', options: ['0', '1', '2', '3'], answer: 1, points: 1 },
  ],
};

export default function DiscriminantLesson() {
  const content: LessonContent = {
    lessonId: 'discriminant',
    video: { title: 'Discriminant for types of solutions for a quadratic', youtubeId: '1213qW5k55I', channel: 'Khan Academy' },
    discussion: <Discussion />,
    explore: <DiscriminantTool />,
    groups: [FIND, SOLVE, QUIZ],
    reflectionPrompt:
      'In your own words, explain what the discriminant tells you and why it is useful. Then give one equation of your own and say, using its discriminant, how many real solutions it has.',
  };
  return <LessonShell content={content} />;
}

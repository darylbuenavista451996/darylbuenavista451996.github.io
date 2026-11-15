'use client';

// Sum and Product of Roots. Ungraded tools, then graded work: 5 typed questions
// (1 pt each), 3 problems with 5 choices (2 pts each), and a 10-question
// multiple-choice quiz (1 pt each). 23 points total, same as the other lessons.

import LessonKey from '../_lesson/LessonKey';
import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';
import { RootsTool, BuildTool } from '../_lesson/QuadTools';

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        The two solutions of a quadratic equation are called its <strong>roots</strong>. You can find their
        <strong> sum</strong> and their <strong>product</strong> straight from the numbers <code>a</code>, <code>b</code>,
        <code> c</code>, without solving the equation.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">The two rules</h4>
        <p style={{ margin: 0 }}>For <code>ax² + bx + c = 0</code> with roots <code>r</code> and <code>s</code>:</p>
        <ul className="mlz-list">
          <li><strong>Sum of roots:</strong> <code>r + s = −b/a</code></li>
          <li><strong>Product of roots:</strong> <code>r · s = c/a</code></li>
        </ul>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Why it works</span>
        <p>If the roots are <code>r</code> and <code>s</code>, the equation is <code>(x − r)(x − s) = 0</code>. Multiply it out: <code>x² − (r + s)x + rs = 0</code>. So the middle number is minus the sum, and the last number is the product (when <code>a = 1</code>).</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p><code>x² − 5x + 6 = 0</code>: <code>a = 1</code>, <code>b = −5</code>, <code>c = 6</code>.</p>
        <p>Sum = <code>−(−5)/1 = 5</code>. Product = <code>6/1 = 6</code>.</p>
        <p>Check: the roots are 2 and 3. <code>2 + 3 = 5</code> and <code>2 × 3 = 6</code>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2: a is not 1</span>
        <p><code>2x² − 3x − 2 = 0</code>: <code>a = 2</code>, <code>b = −3</code>, <code>c = −2</code>.</p>
        <p>Sum = <code>−(−3)/2 = 3/2</code>. Product = <code>−2/2 = −1</code>.</p>
        <p>Check: the roots are 2 and −1/2. <code>2 + (−1/2) = 3/2</code> and <code>2 × (−1/2) = −1</code>.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Building an equation from its roots</h4>
        <ol className="mlz-method-steps">
          <li>Add the roots to get the sum. Multiply them to get the product.</li>
          <li>Write <code>x² − (sum)x + (product) = 0</code>.</li>
          <li>If there are fractions, multiply every term to clear them.</li>
        </ol>
        <p style={{ margin: '8px 0 0' }}>Roots <code>−3</code> and <code>5</code>: sum = 2, product = −15, so <code>x² − 2x − 15 = 0</code>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Good to know</span>
        <p>If the product <code>c/a</code> is negative, one root is positive and the other is negative. If it is positive, the two roots have the same sign.</p>
      </div>
      <p className="mlz-p">Use the two tools below. Work it out on paper first, then check.</p>
    </>
  );
}

const FIND: GradedGroup = {
  title: 'Part A: sum and product',
  instructions: 'Type your answer as a number. For a fraction, write it like −5/3. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <>Find the <strong>sum</strong> of the roots of <code>x² + 5x − 14 = 0</code>.</>, accept: ['-5'], correct: '-5', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the <strong>product</strong> of the roots of <code>x² + 5x − 14 = 0</code>.</>, accept: ['-14'], correct: '-14', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the <strong>sum</strong> of the roots of <code>2x² − 6x + 1 = 0</code>.</>, accept: ['3'], correct: '3', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Find the <strong>product</strong> of the roots of <code>3x² + 2x − 5 = 0</code>.</>, accept: ['-5/3'], correct: '-5/3', points: 1, placeholder: 'a number or fraction' },
    { kind: 'typed', prompt: <>One root of <code>x² − 8x + k = 0</code> is 3. Use the sum of roots to find the other root, then find <code>k</code>.</>, accept: ['15'], correct: '15', points: 1, placeholder: 'k = ?' },
  ],
};

const SOLVE: GradedGroup = {
  title: 'Part B: solve the problem',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>Which quadratic equation has roots <code>2</code> and <code>5</code>?</>,
      options: ['x² − 7x + 10 = 0', 'x² + 7x + 10 = 0', 'x² − 3x + 10 = 0', 'x² − 7x − 10 = 0', 'x² + 3x − 10 = 0'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>Two numbers have a sum of <code>4</code> and a product of <code>−12</code>. What are the numbers?</>,
      options: ['6 and −2', '−6 and 2', '3 and 1', '2 and 2', '12 and −8'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>Which equation with whole-number coefficients has roots <code>1/2</code> and <code>3</code>?</>,
      options: ['2x² − 7x + 3 = 0', '2x² + 7x + 3 = 0', 'x² − 7x + 3 = 0', '2x² − 7x − 3 = 0', 'x² − (7/2)x − 3/2 = 0'],
      answer: 0, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'For ax² + bx + c = 0, the sum of the roots is…', options: ['−b/a', 'b/a', 'c/a', '−c/a'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'For ax² + bx + c = 0, the product of the roots is…', options: ['−b/a', 'b/a', 'c/a', '−c/a'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'What is the sum of the roots of x² − 9x + 20 = 0?', options: ['9', '−9', '20', '−20'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'What is the product of the roots of x² − 9x + 20 = 0?', options: ['9', '−9', '20', '−20'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'What is the sum of the roots of 2x² + 8x − 3 = 0?', options: ['4', '−4', '8', '−3/2'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'What is the product of the roots of 2x² + 8x − 3 = 0?', options: ['−3', '3/2', '−3/2', '−4'], answer: 2, points: 1 },
    { kind: 'choice', prompt: 'Which equation has roots 4 and −1?', options: ['x² − 3x − 4 = 0', 'x² + 3x − 4 = 0', 'x² − 5x + 4 = 0', 'x² − 3x + 4 = 0'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'Which equation has roots 3 and 7?', options: ['x² + 10x + 21 = 0', 'x² − 10x + 21 = 0', 'x² − 21x + 10 = 0', 'x² − 4x + 21 = 0'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'The product of the roots of a quadratic equation is negative. This means the roots are…', options: ['one positive and one negative', 'both positive', 'both negative', 'both zero'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'The roots of x² + bx + 6 = 0 are 2 and 3. What is b?', options: ['5', '−5', '6', '−6'], answer: 1, points: 1 },
  ],
};

export default function RootsLesson({ preview }: { preview?: boolean }) {
  const content: LessonContent = {
    lessonId: 'sum-product-roots',
    video: { title: 'Formulas for sum and product of roots of quadratic equations', youtubeId: 'cSToB0vpgIk', channel: 'Mr H Tutoring' },
    discussion: <Discussion />,
    explore: (
      <>
        <RootsTool />
        <BuildTool />
      </>
    ),
    groups: [FIND, SOLVE, QUIZ],
    reflectionPrompt:
      'Pick any quadratic equation and find the sum and product of its roots without solving it. Then explain how you could use these two numbers to check your solutions from another method.',
  };
  return preview ? <LessonKey content={content} /> : <LessonShell content={content} />;
}

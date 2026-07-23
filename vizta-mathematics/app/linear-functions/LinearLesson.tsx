'use client';

// Solving Problems with Linear Functions. Ungraded practice tools, then graded
// work: 5 typed "evaluate" questions (1 pt each), 3 word/equation questions with
// 5 choices (2 pts each), and the 10-question multiple-choice quiz (1 pt each).

import { useState } from 'react';
import {
  parseLine,
  parseNumToRat,
  evalLine,
  lineFromTwoPoints,
  lineToString,
} from '@/lib/lineMath';
import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';

function EvalTool() {
  const [eq, setEq] = useState('y = 2x + 3');
  const [xv, setXv] = useState('4');
  const [out, setOut] = useState<null | { y: string }>(null);
  const [err, setErr] = useState('');
  function go() {
    setErr(''); setOut(null);
    try {
      const y = evalLine(parseLine(eq), parseNumToRat(xv));
      if (y === null) throw new Error('That is a vertical line, not a function of x.');
      setOut({ y: y.toString() });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your inputs.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Evaluate a linear function</h3>
      <p className="mlz-tool-hint">Type a function like y = 2x + 3 and a value of x. It finds y.</p>
      <label className="mlz-field"><span>Function</span><input className="mlz-input" value={eq} onChange={(e) => setEq(e.target.value)} spellCheck={false} autoCapitalize="none" /></label>
      <label className="mlz-field"><span>Value of x</span><input className="mlz-input" value={xv} onChange={(e) => setXv(e.target.value)} spellCheck={false} /></label>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Find y</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && <div className="mlz-result mlz-answer"><strong className="mlz-verdict">When x = {xv}, y = {out.y}</strong></div>}
    </div>
  );
}

function TwoPointsTool() {
  const [x1, setX1] = useState('0');
  const [y1, setY1] = useState('5');
  const [x2, setX2] = useState('2');
  const [y2, setY2] = useState('9');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  const [err, setErr] = useState('');
  function go() {
    setErr(''); setOut(null);
    try {
      const { line, steps } = lineFromTwoPoints(parseNumToRat(x1), parseNumToRat(y1), parseNumToRat(x2), parseNumToRat(y2));
      setOut({ answer: lineToString(line), steps });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your inputs.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Find the equation from two points</h3>
      <p className="mlz-tool-hint">Enter two points the line passes through. It finds the equation, with steps.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Point 1 x</span><input className="mlz-input" value={x1} onChange={(e) => setX1(e.target.value)} spellCheck={false} /></label>
        <label className="mlz-field mlz-field-sm"><span>Point 1 y</span><input className="mlz-input" value={y1} onChange={(e) => setY1(e.target.value)} spellCheck={false} /></label>
      </div>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Point 2 x</span><input className="mlz-input" value={x2} onChange={(e) => setX2(e.target.value)} spellCheck={false} /></label>
        <label className="mlz-field mlz-field-sm"><span>Point 2 y</span><input className="mlz-input" value={y2} onChange={(e) => setY2(e.target.value)} spellCheck={false} /></label>
      </div>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Find the equation</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">{out.answer}</strong>
          <ol className="mlz-steps">{out.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Many everyday situations grow at a <strong>steady rate</strong>: a jeepney fare that goes up a
        fixed amount per kilometer, load that drops the same per text, savings that increase the same
        each week. Whenever the change is constant, a <strong>linear function</strong> describes it.
      </p>
      <p className="mlz-p">A linear function has the form <code>y = mx + b</code>:</p>
      <ul className="mlz-list">
        <li><strong>m is the slope</strong> — the rate of change (how much y changes per step of x).</li>
        <li><strong>b is the y-intercept</strong> — the starting value (y when x = 0).</li>
      </ul>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Reading a function</span>
        <p>In <code>y = 2x + 13</code>, the slope is <strong>2</strong> and the starting value is <strong>13</strong>.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Slope from two points</h4>
        <p style={{ margin: 0 }}>Slope = change in y over change in x. Through <code>(1, 2)</code> and <code>(4, 8)</code>: <code>(8 - 2) / (4 - 1) = 2</code>.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Building the equation from a problem</h4>
        <ol className="mlz-method-steps">
          <li>Starting amount = <strong>b</strong>.</li>
          <li>Amount per unit = <strong>m</strong>.</li>
          <li>Write <code>y = mx + b</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example</span>
        <p>A jeepney charges 13 pesos plus 2 pesos per km: <strong>y = 2x + 13</strong>. For 5 km: <code>2(5) + 13 = 23</code> pesos.</p>
      </div>
    </>
  );
}

const EVALUATE: GradedGroup = {
  title: 'Part A: evaluate the function',
  instructions: 'Type the value of y. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <>Evaluate <code>y = 3x + 4</code> when <code>x = 2</code>.</>, accept: ['10'], correct: '10', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Evaluate <code>y = -2x + 9</code> when <code>x = 3</code>.</>, accept: ['3'], correct: '3', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Evaluate <code>y = 5x</code> when <code>x = 4</code>.</>, accept: ['20'], correct: '20', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Evaluate <code>y = -x + 6</code> when <code>x = 2</code>.</>, accept: ['4'], correct: '4', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Evaluate <code>y = 2x + 13</code> when <code>x = 5</code>.</>, accept: ['23'], correct: '23', points: 1, placeholder: 'a number' },
  ],
};

const WORD: GradedGroup = {
  title: 'Part B: build and solve',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>A tricycle charges 20 pesos plus 5 pesos per km. Which equation gives the fare y for x km?</>,
      options: ['y = 20x + 5', 'y = 5x + 20', 'y = 5x - 20', 'y = 25x', 'y = 5x + 25'],
      answer: 1, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>Find the equation of the line through <code>(0, 5)</code> and <code>(2, 9)</code>.</>,
      options: ['y = 2x + 5', 'y = 4x + 5', 'y = 2x + 9', 'y = 1/2x + 5', 'y = 2x - 5'],
      answer: 0, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>A savings plan is <code>y = 50x + 200</code> after x weeks. How much is saved after 6 weeks?</>,
      options: ['300', '500', '350', '1200', '250'],
      answer: 1, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'In y = 2x + 5, what is the rate of change (slope)?', options: ['5', '2', '7', '-5'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'In y = 3x - 4, what is the starting value (y-intercept)?', options: ['3', '-4', '4', '-3'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'What is the slope of the line through (1, 2) and (3, 8)?', options: ['2', '3', '6', '1/2'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'A jeepney charges 13 pesos plus 2 pesos per km. Which equation gives the fare y for x km?', options: ['y = 13x + 2', 'y = 2x + 13', 'y = 15x', 'y = 2x - 13'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'Using y = 2x + 13, what is the fare for a 5 km ride?', options: ['15', '23', '26', '28'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'A linear function with slope 0 has a graph that is a…', options: ['vertical line', 'horizontal line', 'curve', 'diagonal line'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'Which of these is a linear function?', options: ['y = x²', 'y = 4x - 1', 'y = 1/x', 'y = 2ˣ'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'If y = -x + 6, what is y when x = 2?', options: ['8', '4', '-4', '6'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'In the savings plan y = 50x + 200, what does the 200 mean?', options: ['savings per week', 'the amount at the start', 'total after 200 weeks', 'the slope'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'What is the equation of the line through (0, 3) with slope 5?', options: ['y = 3x + 5', 'y = 5x + 3', 'y = 5x - 3', 'y = 3x - 5'], answer: 1, points: 1 },
  ],
};

export default function LinearLesson() {
  const content: LessonContent = {
    lessonId: 'linear-functions',
    video: { title: 'Linear equation word problems (slope-intercept)', youtubeId: 'YzSyyIv6Ao8', channel: 'Khan Academy' },
    discussion: <Discussion />,
    explore: (
      <>
        <EvalTool />
        <TwoPointsTool />
      </>
    ),
    groups: [EVALUATE, WORD, QUIZ],
    reflectionPrompt:
      'Think of a real situation from your life that changes at a steady rate (money, load, distance…). Write its linear equation, and say what the slope and starting value mean.',
  };
  return <LessonShell content={content} />;
}

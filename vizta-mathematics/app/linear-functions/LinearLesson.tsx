'use client';

// Solving Problems with Linear Functions — a full class-period lesson on the
// shared six-part flow. Activity has an evaluator and a two-point equation
// builder, plus a guided-practice worksheet. All client-side, works offline.

import { useState } from 'react';
import {
  parseLine,
  parseNumToRat,
  evalLine,
  lineFromTwoPoints,
  lineToString,
} from '@/lib/lineMath';
import LessonShell, { type LessonContent, type QuizQuestion } from '../_lesson/LessonShell';

// ---- Activity tool 1: evaluate a linear function ----
function EvalTool() {
  const [eq, setEq] = useState('y = 2x + 3');
  const [xv, setXv] = useState('4');
  const [out, setOut] = useState<null | { y: string }>(null);
  const [err, setErr] = useState('');

  function go() {
    setErr('');
    setOut(null);
    try {
      const line = parseLine(eq);
      const y = evalLine(line, parseNumToRat(xv));
      if (y === null) throw new Error('That is a vertical line, not a function of x.');
      setOut({ y: y.toString() });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Please check your inputs.');
    }
  }

  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Evaluate a linear function</h3>
      <p className="mlz-tool-hint">Type a function like y = 2x + 3 and a value of x. It finds y.</p>
      <label className="mlz-field"><span>Function</span>
        <input className="mlz-input" value={eq} onChange={(e) => setEq(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <label className="mlz-field"><span>Value of x</span>
        <input className="mlz-input" value={xv} onChange={(e) => setXv(e.target.value)} spellCheck={false} />
      </label>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Find y</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">When x = {xv}, y = {out.y}</strong>
        </div>
      )}
    </div>
  );
}

// ---- Activity tool 2: equation from two points ----
function TwoPointsTool() {
  const [x1, setX1] = useState('0');
  const [y1, setY1] = useState('5');
  const [x2, setX2] = useState('2');
  const [y2, setY2] = useState('9');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  const [err, setErr] = useState('');

  function go() {
    setErr('');
    setOut(null);
    try {
      const { line, steps } = lineFromTwoPoints(
        parseNumToRat(x1), parseNumToRat(y1), parseNumToRat(x2), parseNumToRat(y2),
      );
      setOut({ answer: lineToString(line), steps });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Please check your inputs.');
    }
  }

  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Find the equation from two points</h3>
      <p className="mlz-tool-hint">Enter two points the line passes through. It finds the equation, with steps.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Point 1 x</span>
          <input className="mlz-input" value={x1} onChange={(e) => setX1(e.target.value)} spellCheck={false} />
        </label>
        <label className="mlz-field mlz-field-sm"><span>Point 1 y</span>
          <input className="mlz-input" value={y1} onChange={(e) => setY1(e.target.value)} spellCheck={false} />
        </label>
      </div>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Point 2 x</span>
          <input className="mlz-input" value={x2} onChange={(e) => setX2(e.target.value)} spellCheck={false} />
        </label>
        <label className="mlz-field mlz-field-sm"><span>Point 2 y</span>
          <input className="mlz-input" value={y2} onChange={(e) => setY2(e.target.value)} spellCheck={false} />
        </label>
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

// ---- Guided practice ----
function EvalItem({ eq, x, index }: { eq: string; x: string; index: number }) {
  const [show, setShow] = useState(false);
  const y = evalLine(parseLine(eq), parseNumToRat(x));
  return (
    <div className="mlz-practice">
      <p className="mlz-q"><span className="mlz-qnum">{index}</span>Evaluate <code>{eq}</code> when <code>x = {x}</code>.</p>
      {!show ? (
        <button type="button" className="btn btn-ghost mlz-reveal" onClick={() => setShow(true)}>Show answer</button>
      ) : (
        <div className="mlz-result mlz-answer"><strong className="mlz-verdict">y = {y ? y.toString() : '—'}</strong></div>
      )}
    </div>
  );
}

function TwoPointItem({ x1, y1, x2, y2, index }: { x1: string; y1: string; x2: string; y2: string; index: number }) {
  const [show, setShow] = useState(false);
  const r = lineFromTwoPoints(parseNumToRat(x1), parseNumToRat(y1), parseNumToRat(x2), parseNumToRat(y2));
  return (
    <div className="mlz-practice">
      <p className="mlz-q"><span className="mlz-qnum">{index}</span>Find the equation of the line through <code>({x1}, {y1})</code> and <code>({x2}, {y2})</code>.</p>
      {!show ? (
        <button type="button" className="btn btn-ghost mlz-reveal" onClick={() => setShow(true)}>Show solution</button>
      ) : (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">{lineToString(r.line)}</strong>
          <ol className="mlz-steps">{r.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

function WordItem({ q, answer, index }: { q: string; answer: string; index: number }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mlz-practice">
      <p className="mlz-q"><span className="mlz-qnum">{index}</span>{q}</p>
      {!show ? (
        <button type="button" className="btn btn-ghost mlz-reveal" onClick={() => setShow(true)}>Show answer</button>
      ) : (
        <div className="mlz-result mlz-answer"><strong className="mlz-verdict">{answer}</strong></div>
      )}
    </div>
  );
}

function GuidedPractice() {
  return (
    <div className="mlz-guided">
      <h3 className="mlz-h2">Guided practice</h3>
      <p className="mlz-p">Solve each on paper first, then reveal to check.</p>
      <h4 className="mlz-sub-h">Part A: evaluate</h4>
      <EvalItem index={1} eq="y = 3x + 4" x="2" />
      <EvalItem index={2} eq="y = -2x + 9" x="3" />
      <h4 className="mlz-sub-h">Part B: equation from two points</h4>
      <TwoPointItem index={1} x1="0" y1="5" x2="2" y2="9" />
      <TwoPointItem index={2} x1="1" y1="4" x2="3" y2="10" />
      <h4 className="mlz-sub-h">Part C: word problems</h4>
      <WordItem index={1} q="A tricycle charges 20 pesos plus 5 pesos per kilometer. Write the equation for the fare y after x km." answer="y = 5x + 20" />
      <WordItem index={2} q="Using y = 5x + 20, how much is the fare for a 6 km ride?" answer="y = 5(6) + 20 = 50 pesos" />
    </div>
  );
}

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Many everyday situations grow at a <strong>steady rate</strong>: a jeepney fare that goes up a
        fixed amount per kilometer, prepaid load that drops the same amount per text, savings that
        increase by the same amount each week. Whenever the change is constant, we can describe it with
        a <strong>linear function</strong>.
      </p>

      <h3 className="mlz-h2">Part 1. What a linear function is</h3>
      <p className="mlz-p">
        A linear function has the form <code>y = mx + b</code>. Its graph is a straight line. Two numbers
        control everything:
      </p>
      <ul className="mlz-list">
        <li><strong>m is the slope</strong> — the <strong>rate of change</strong>, how much y changes for each step of x.</li>
        <li><strong>b is the y-intercept</strong> — the <strong>starting value</strong>, where the line begins when x = 0.</li>
      </ul>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Reading a function</span>
        <p>In <code>y = 2x + 13</code>, the slope is <strong>2</strong> (y goes up 2 for each 1 of x) and the starting value is <strong>13</strong> (when x = 0, y = 13).</p>
      </div>

      <h3 className="mlz-h2">Part 2. Slope as a rate of change</h3>
      <p className="mlz-p">If you know two points on the line, the slope is the change in y over the change in x:</p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example</span>
        <p>A line passes through <code>(1, 2)</code> and <code>(4, 8)</code>. Slope = <code>(8 - 2) / (4 - 1) = 6 / 3 = 2</code>. So y rises 2 for every 1 that x increases.</p>
      </div>

      <h3 className="mlz-h2">Part 3. Building the equation from a problem</h3>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Three steps</h4>
        <ol className="mlz-method-steps">
          <li>Find the <strong>starting value</strong> (the fixed amount) — that is <strong>b</strong>.</li>
          <li>Find the <strong>rate</strong> (the amount per unit) — that is <strong>m</strong>.</li>
          <li>Write <code>y = mx + b</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Worked example</span>
        <p>A jeepney charges <strong>13 pesos</strong> to start, plus <strong>2 pesos per kilometer</strong>. Starting value b = 13, rate m = 2. The fare after x km is <strong>y = 2x + 13</strong>. For a 5 km ride: <code>y = 2(5) + 13 = 23</code> pesos.</p>
      </div>

      <h3 className="mlz-h2">Part 4. Interpreting the numbers</h3>
      <p className="mlz-p">
        In a real problem, always say what the numbers <em>mean</em>. In a savings plan <code>y = 50x + 200</code>,
        the <strong>200</strong> is the amount already saved at the start, and the <strong>50</strong> is how much is
        added each week. Reading a graph, the line crosses the y-axis at the starting value, and its steepness is the rate.
      </p>

      <h3 className="mlz-h2">Part 5. Watch out</h3>
      <ul className="mlz-list">
        <li>Don&apos;t swap m and b. The number multiplied by x is the rate; the number by itself is the starting value.</li>
        <li>An equation like <code>y = x²</code> or <code>y = 2ˣ</code> is <strong>not</strong> linear — the graph is a curve, and the rate is not constant.</li>
        <li>A slope of 0 gives a flat, horizontal line (y never changes).</li>
      </ul>

      <div className="mlz-method" style={{ background: 'var(--mint-tint)', borderColor: '#cdeadd' }}>
        <h4 className="mlz-method-title">Key points</h4>
        <ul className="mlz-list" style={{ margin: 0 }}>
          <li><code>y = mx + b</code>: <strong>m</strong> is the rate of change, <strong>b</strong> is the starting value.</li>
          <li>Slope from two points: change in y over change in x.</li>
          <li>To model a problem: starting amount is b, amount per unit is m.</li>
        </ul>
      </div>
    </>
  );
}

const QUIZ: QuizQuestion[] = [
  { q: 'In y = 2x + 5, what is the rate of change (slope)?', options: ['5', '2', '7', '-5'], answer: 1 },
  { q: 'In y = 3x - 4, what is the starting value (y-intercept)?', options: ['3', '-4', '4', '-3'], answer: 1 },
  { q: 'What is the slope of the line through (1, 2) and (3, 8)?', options: ['2', '3', '6', '1/2'], answer: 1 },
  { q: 'A jeepney charges 13 pesos plus 2 pesos per km. Which equation gives the fare y for x km?', options: ['y = 13x + 2', 'y = 2x + 13', 'y = 15x', 'y = 2x - 13'], answer: 1 },
  { q: 'Using y = 2x + 13, what is the fare for a 5 km ride?', options: ['15', '23', '26', '28'], answer: 1 },
  { q: 'A linear function with slope 0 has a graph that is a…', options: ['vertical line', 'horizontal line', 'curve', 'diagonal line'], answer: 1 },
  { q: 'Which of these is a linear function?', options: ['y = x²', 'y = 4x - 1', 'y = 1/x', 'y = 2ˣ'], answer: 1 },
  { q: 'If y = -x + 6, what is y when x = 2?', options: ['8', '4', '-4', '6'], answer: 1 },
  { q: 'In the savings plan y = 50x + 200, what does the 200 mean?', options: ['savings per week', 'the amount at the start', 'total after 200 weeks', 'the slope'], answer: 1 },
  { q: 'What is the equation of the line through (0, 3) with slope 5?', options: ['y = 3x + 5', 'y = 5x + 3', 'y = 5x - 3', 'y = 3x - 5'], answer: 1 },
];

export default function LinearLesson() {
  const content: LessonContent = {
    lessonId: 'linear-functions',
    video: {
      title: 'Linear equation word problems (slope-intercept)',
      youtubeId: 'YzSyyIv6Ao8',
      channel: 'Khan Academy',
    },
    discussion: <Discussion />,
    activity: (
      <>
        <EvalTool />
        <TwoPointsTool />
        <GuidedPractice />
      </>
    ),
    reflectionPrompt:
      'Think of a real situation from your own life that changes at a steady rate (money, load, distance…). Write its linear equation, and say what the slope and the starting value mean.',
    quiz: QUIZ,
  };
  return <LessonShell content={content} />;
}

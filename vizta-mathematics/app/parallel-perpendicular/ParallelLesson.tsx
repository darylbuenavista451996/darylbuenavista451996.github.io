'use client';

// Parallel & Perpendicular Lines — a full class-period lesson (about 45 to 60
// minutes) built on the shared six-part flow. The reading is a complete lesson
// text; the activity has the interactive checkers plus a guided-practice
// worksheet. All client-side, so it works offline once opened.

import { useState } from 'react';
import {
  parseLine,
  relationship,
  findLine,
  lineToString,
  slopeLabel,
  parseNumToRat,
  type Relation,
  type Mode,
} from '@/lib/lineMath';
import LessonShell, { type LessonContent, type QuizQuestion } from '../_lesson/LessonShell';

const RELATION_TEXT: Record<Relation, string> = {
  parallel: 'Parallel',
  perpendicular: 'Perpendicular',
  neither: 'Neither',
};
function relationClass(r: Relation): string {
  return r === 'parallel' ? 'mlz-parallel' : r === 'perpendicular' ? 'mlz-perp' : 'mlz-neither';
}

// ---- Activity tool 1: check two lines ----
function CheckTool() {
  const [l1, setL1] = useState('y = 2x + 3');
  const [l2, setL2] = useState('y = 2x - 5');
  const [out, setOut] = useState<null | { rel: Relation; s1: string; s2: string }>(null);
  const [err, setErr] = useState('');

  function check() {
    setErr('');
    setOut(null);
    try {
      const a = parseLine(l1);
      const b = parseLine(l2);
      setOut({ rel: relationship(a, b), s1: slopeLabel(a), s2: slopeLabel(b) });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Please check your equations.');
    }
  }

  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Check two lines</h3>
      <p className="mlz-tool-hint">Slope form (y = 2x + 3), standard form (2x - 3y = 6), or a vertical line (x = 5) all work.</p>
      <label className="mlz-field"><span>Line 1</span>
        <input className="mlz-input" value={l1} onChange={(e) => setL1(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <label className="mlz-field"><span>Line 2</span>
        <input className="mlz-input" value={l2} onChange={(e) => setL2(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <button type="button" className="btn btn-primary mlz-go" onClick={check}>Check</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className={`mlz-result ${relationClass(out.rel)}`}>
          <strong className="mlz-verdict">{RELATION_TEXT[out.rel]}</strong>
          <p className="mlz-slopes">Slope of line 1 is {out.s1}. Slope of line 2 is {out.s2}.</p>
          <p className="mlz-why">
            {out.rel === 'parallel' && 'The slopes are equal, so the lines never meet.'}
            {out.rel === 'perpendicular' && 'The slopes are negative reciprocals (they multiply to -1), so the lines cross at a right angle.'}
            {out.rel === 'neither' && 'The slopes are not equal and not negative reciprocals.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Activity tool 2: find the equation ----
function BuildTool() {
  const [px, setPx] = useState('2');
  const [py, setPy] = useState('3');
  const [given, setGiven] = useState('y = 5x - 2');
  const [mode, setMode] = useState<Mode>('parallel');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  const [err, setErr] = useState('');

  function solve() {
    setErr('');
    setOut(null);
    try {
      const { line: ans, steps } = findLine(parseNumToRat(px), parseNumToRat(py), parseLine(given), mode);
      setOut({ answer: lineToString(ans), steps });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Please check your inputs.');
    }
  }

  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Find the equation of a line</h3>
      <p className="mlz-tool-hint">Give a point and the line it should be parallel or perpendicular to. The steps are shown.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Point x</span>
          <input className="mlz-input" value={px} onChange={(e) => setPx(e.target.value)} spellCheck={false} />
        </label>
        <label className="mlz-field mlz-field-sm"><span>Point y</span>
          <input className="mlz-input" value={py} onChange={(e) => setPy(e.target.value)} spellCheck={false} />
        </label>
      </div>
      <label className="mlz-field"><span>Given line</span>
        <input className="mlz-input" value={given} onChange={(e) => setGiven(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <div className="mlz-mode">
        <label className={`mlz-mode-opt ${mode === 'parallel' ? 'on' : ''}`}>
          <input type="radio" name="mode" checked={mode === 'parallel'} onChange={() => setMode('parallel')} /> Parallel
        </label>
        <label className={`mlz-mode-opt ${mode === 'perpendicular' ? 'on' : ''}`}>
          <input type="radio" name="mode" checked={mode === 'perpendicular'} onChange={() => setMode('perpendicular')} /> Perpendicular
        </label>
      </div>
      <button type="button" className="btn btn-primary mlz-go" onClick={solve}>Find the equation</button>
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

// ---- Guided practice: reveal-the-answer worksheet ----
function ClassifyItem({ l1, l2, index }: { l1: string; l2: string; index: number }) {
  const [show, setShow] = useState(false);
  const rel = relationship(parseLine(l1), parseLine(l2));
  return (
    <div className="mlz-practice">
      <p className="mlz-q"><span className="mlz-qnum">{index}</span>Are <code>{l1}</code> and <code>{l2}</code> parallel, perpendicular, or neither?</p>
      {!show ? (
        <button type="button" className="btn btn-ghost mlz-reveal" onClick={() => setShow(true)}>Show answer</button>
      ) : (
        <div className={`mlz-result ${relationClass(rel)}`}><strong className="mlz-verdict">{RELATION_TEXT[rel]}</strong></div>
      )}
    </div>
  );
}

function BuildItem({ px, py, given, mode, label, index }: { px: string; py: string; given: string; mode: Mode; label: string; index: number }) {
  const [show, setShow] = useState(false);
  const r = findLine(parseNumToRat(px), parseNumToRat(py), parseLine(given), mode);
  return (
    <div className="mlz-practice">
      <p className="mlz-q"><span className="mlz-qnum">{index}</span>Find the line {label}.</p>
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

function GuidedPractice() {
  const classify: [string, string][] = [
    ['y = 3x + 2', 'y = 3x - 5'],
    ['y = 2x + 1', 'y = -1/2x + 4'],
    ['y = 4x - 3', 'y = 3x + 1'],
    ['2x - 3y = 6', '4x - 6y = 5'],
    ['3x + 2y = 8', '2x - 3y = 1'],
    ['x = 4', 'y = 2'],
  ];
  const build: { px: string; py: string; given: string; mode: Mode; label: string }[] = [
    { px: '1', py: '4', given: 'y = 3x - 2', mode: 'parallel', label: 'through (1, 4), parallel to y = 3x - 2' },
    { px: '6', py: '-1', given: 'y = 2x + 5', mode: 'perpendicular', label: 'through (6, -1), perpendicular to y = 2x + 5' },
    { px: '-2', py: '5', given: 'y = -x + 4', mode: 'parallel', label: 'through (-2, 5), parallel to y = -x + 4' },
    { px: '4', py: '2', given: 'y = -1/2x + 7', mode: 'perpendicular', label: 'through (4, 2), perpendicular to y = -1/2x + 7' },
  ];
  return (
    <div className="mlz-guided">
      <h3 className="mlz-h2">Guided practice</h3>
      <p className="mlz-p">Solve each one on paper first, then reveal to check. Use the tools above if you get stuck.</p>
      <h4 className="mlz-sub-h">Part A: parallel, perpendicular, or neither?</h4>
      {classify.map(([a, b], i) => <ClassifyItem key={i} index={i + 1} l1={a} l2={b} />)}
      <h4 className="mlz-sub-h">Part B: find the equation of the line</h4>
      {build.map((p, i) => <BuildItem key={i} index={i + 1} {...p} />)}
    </div>
  );
}

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Look around the room. The opposite edges of the whiteboard never meet, no matter how far you
        extend them. They are <strong>parallel</strong>. The edge of the board and the edge of the
        door frame meet at a perfect corner. They are <strong>perpendicular</strong>. Builders,
        designers, and engineers rely on these two relationships every day, and in coordinate
        geometry we describe both using a single idea: the <strong>slope</strong> of a line.
      </p>

      {/* Slope recap */}
      <h3 className="mlz-h2">Part 1. Recalling slope</h3>
      <p className="mlz-p">
        The slope tells you how steep a line is and which way it tilts. It is the <strong>rise over the
        run</strong>: how much the line goes up (or down) for every step to the right. There are four
        ways you will meet a slope, so let us be ready for all of them.
      </p>
      <p className="mlz-p"><strong>1. From slope-intercept form <code>y = mx + b</code>.</strong> The number in front of x is the slope. In <code>y = 3x + 2</code>, the slope is <strong>3</strong>. In <code>y = -x + 5</code>, the slope is <strong>-1</strong>.</p>
      <p className="mlz-p"><strong>2. From two points.</strong> If a line passes through two points, the slope is</p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example</span>
        <p>The line through <code>(1, 2)</code> and <code>(4, 8)</code> has slope <code>(8 - 2) / (4 - 1) = 6 / 3 = 2</code>.</p>
      </div>
      <p className="mlz-p"><strong>3. From standard form <code>Ax + By = C</code>.</strong> Solve for y, or use the shortcut <code>slope = -A/B</code>.</p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example</span>
        <p>For <code>2x - 3y = 6</code>, solve for y: <code>-3y = -2x + 6</code>, so <code>y = (2/3)x - 2</code>. The slope is <strong>2/3</strong>. The shortcut gives the same answer: <code>-A/B = -2 / -3 = 2/3</code>.</p>
      </div>
      <p className="mlz-p"><strong>4. Two special lines.</strong> A <strong>horizontal</strong> line like <code>y = 4</code> is flat, so its slope is <strong>0</strong>. A <strong>vertical</strong> line like <code>x = 6</code> is straight up and down, so its slope is <strong>undefined</strong> (there is no run to divide by).</p>

      {/* Parallel */}
      <h3 className="mlz-h2">Part 2. Parallel lines</h3>
      <p className="mlz-p">
        Two lines are <strong>parallel</strong> when they point in exactly the same direction and never
        meet. Since slope is direction, this gives us a simple rule.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Rule for parallel lines</h4>
        <p style={{ margin: 0 }}>Two lines are parallel when their <strong>slopes are equal</strong>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p><code>y = 2x + 1</code> and <code>y = 2x - 7</code>: both have slope <strong>2</strong>, so they are parallel.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2 (standard form)</span>
        <p>Are <code>2x - 3y = 6</code> and <code>4x - 6y = 5</code> parallel? The first has slope <code>-2/-3 = 2/3</code>. The second has slope <code>-4/-6 = 2/3</code>. Equal slopes, so <strong>yes, parallel</strong>.</p>
      </div>
      <p className="mlz-p">
        <strong>One caution.</strong> If two lines have the <strong>same slope and the same
        y-intercept</strong>, they are not two parallel lines; they are the <strong>same line</strong>.
        Parallel lines must have equal slopes but different intercepts.
      </p>

      {/* Perpendicular */}
      <h3 className="mlz-h2">Part 3. Perpendicular lines</h3>
      <p className="mlz-p">
        Two lines are <strong>perpendicular</strong> when they cross at a right angle (90 degrees).
        Their slopes have a special relationship: they are <strong>negative reciprocals</strong>, which
        means multiplying them gives <strong>-1</strong>.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Rule for perpendicular lines</h4>
        <p style={{ margin: '0 0 6px' }}>Two lines are perpendicular when their <strong>slopes multiply to -1</strong>.</p>
        <p style={{ margin: 0 }}>To get the negative reciprocal of a slope: <strong>flip the fraction, then change the sign</strong>.</p>
      </div>
      <p className="mlz-p">Slope 2 is 2/1. Flip it to 1/2, change the sign to <strong>-1/2</strong>. Check: <code>2 × (-1/2) = -1</code>. Slope -3/4 flips to -4/3, sign change to <strong>4/3</strong>. Check: <code>(-3/4) × (4/3) = -1</code>.</p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 1</span>
        <p><code>y = 4x - 1</code> and <code>y = -1/4x + 6</code>: multiply the slopes, <code>4 × (-1/4) = -1</code>, so they are perpendicular.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example 2 (standard form)</span>
        <p>Are <code>3x + 2y = 8</code> and <code>2x - 3y = 1</code> perpendicular? Slopes are <code>-3/2</code> and <code>2/3</code>. Multiply: <code>(-3/2) × (2/3) = -1</code>. Yes, perpendicular.</p>
      </div>

      {/* Special case */}
      <h3 className="mlz-h2">Part 4. The vertical and horizontal case</h3>
      <p className="mlz-p">
        A vertical line has no slope and a horizontal line has slope 0, so the multiply-to-negative-one
        test cannot be used on them. Just remember the picture: a <strong>vertical line</strong> (like
        <code> x = 5</code>) and a <strong>horizontal line</strong> (like <code>y = 3</code>) always meet
        at a right angle, so they are <strong>perpendicular</strong>. Two vertical lines are parallel,
        and two horizontal lines are parallel.
      </p>

      {/* Deciding */}
      <h3 className="mlz-h2">Part 5. Deciding the relationship</h3>
      <div className="mlz-method">
        <h4 className="mlz-method-title">The three-step check</h4>
        <ol className="mlz-method-steps">
          <li>Write each line as <code>y = mx + b</code> and read off both slopes.</li>
          <li>If the slopes are <strong>equal</strong>, the lines are <strong>parallel</strong>.</li>
          <li>If the slopes <strong>multiply to -1</strong>, the lines are <strong>perpendicular</strong>. Otherwise, they are <strong>neither</strong>.</li>
        </ol>
      </div>

      {/* Finding equations */}
      <h3 className="mlz-h2">Part 6. Finding the equation of a line</h3>
      <p className="mlz-p">
        A very common task is to find a line that passes through a given <strong>point</strong> and is
        parallel or perpendicular to a given line. The tool is <strong>point-slope form</strong>:
        <code> y - y1 = m(x - x1)</code>, where <code>(x1, y1)</code> is the point and <code>m</code> is
        the slope you need.
      </p>
      <div className="mlz-method">
        <h4 className="mlz-method-title">The method</h4>
        <ol className="mlz-method-steps">
          <li>Find the slope you need: the <strong>same slope</strong> for parallel, the <strong>negative reciprocal</strong> for perpendicular.</li>
          <li>Put the point and slope into <code>y - y1 = m(x - x1)</code>.</li>
          <li>Simplify to <code>y = mx + b</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example: parallel</span>
        <p>Find the line through <code>(2, 3)</code> parallel to <code>y = 5x - 2</code>. Same slope 5. Point-slope: <code>y - 3 = 5(x - 2)</code>. Simplify: <code>y = 5x - 10 + 3</code>, so <strong>y = 5x - 7</strong>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example: perpendicular</span>
        <p>Find the line through <code>(4, 1)</code> perpendicular to <code>y = 2x + 9</code>. Perpendicular slope is <code>-1/2</code>. Point-slope: <code>y - 1 = -1/2(x - 4)</code>. Simplify: <code>y = -1/2x + 2 + 1</code>, so <strong>y = -1/2x + 3</strong>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example: given a standard-form line</span>
        <p>Find the line through <code>(0, 1)</code> parallel to <code>2x + y = 7</code>. First rewrite the given line: <code>y = -2x + 7</code>, slope -2. Same slope, through <code>(0, 1)</code>: <strong>y = -2x + 1</strong>.</p>
      </div>

      {/* Mistakes + summary */}
      <h3 className="mlz-h2">Part 7. Watch out for these mistakes</h3>
      <ul className="mlz-list">
        <li>For perpendicular slopes you must <strong>flip the fraction and change the sign</strong>. Doing only one of the two is the most common error.</li>
        <li>Always rewrite standard form as <code>y = mx + b</code> before comparing slopes.</li>
        <li>Equal slope and equal intercept is the <strong>same line</strong>, not two parallel lines.</li>
        <li>Do not force the multiply-to-negative-one test on vertical or horizontal lines; use the picture instead.</li>
      </ul>

      <div className="mlz-method" style={{ background: 'var(--mint-tint)', borderColor: '#cdeadd' }}>
        <h4 className="mlz-method-title">Key points to remember</h4>
        <ul className="mlz-list" style={{ margin: 0 }}>
          <li><strong>Parallel:</strong> equal slopes.</li>
          <li><strong>Perpendicular:</strong> slopes multiply to -1 (negative reciprocals).</li>
          <li><strong>Vertical and horizontal</strong> lines are perpendicular.</li>
          <li>To build a line, find the right slope, then use <code>y - y1 = m(x - x1)</code>.</li>
        </ul>
      </div>
    </>
  );
}

const QUIZ: QuizQuestion[] = [
  { q: 'What is the slope of y = 4x - 7?', options: ['-7', '4', '7', '-4'], answer: 1 },
  { q: 'What is the slope of the line through (1, 2) and (4, 8)?', options: ['2', '3', '6', '1/2'], answer: 0 },
  { q: 'Two lines are parallel when their slopes are…', options: ['equal', 'opposite', 'negative reciprocals', 'both zero'], answer: 0 },
  { q: 'Two lines are perpendicular when their slopes…', options: ['are equal', 'multiply to -1', 'add to 0', 'are both positive'], answer: 1 },
  { q: 'The slope of a line perpendicular to a line with slope 3 is…', options: ['3', '-3', '1/3', '-1/3'], answer: 3 },
  { q: 'Are y = 2x + 1 and y = 2x - 9 parallel, perpendicular, or neither?', options: ['Parallel', 'Perpendicular', 'Neither', 'The same line'], answer: 0 },
  { q: 'Are y = 5x + 2 and y = -1/5x + 2 parallel, perpendicular, or neither?', options: ['Parallel', 'Perpendicular', 'Neither', 'Cannot tell'], answer: 1 },
  { q: 'A horizontal line and a vertical line are…', options: ['Parallel', 'Perpendicular', 'Neither', 'The same'], answer: 1 },
  { q: 'Written as y = mx + b, what is the slope of 2x + y = 8?', options: ['2', '-2', '8', '1/2'], answer: 1 },
  { q: 'The line through (0, -2) perpendicular to y = 2x + 5 is…', options: ['y = 2x - 2', 'y = -1/2x - 2', 'y = 1/2x - 2', 'y = -2x - 2'], answer: 1 },
];

export default function ParallelLesson() {
  const content: LessonContent = {
    lessonId: 'parallel-perpendicular',
    video: {
      title: 'Equations of parallel and perpendicular lines',
      youtubeId: '9hryH94KFJA',
      channel: 'Khan Academy',
    },
    discussion: <Discussion />,
    activity: (
      <>
        <CheckTool />
        <BuildTool />
        <GuidedPractice />
      </>
    ),
    reflectionPrompt:
      'Reflect on today’s lesson. (1) In your own words, how do you decide if two lines are perpendicular? (2) Which was harder for you: checking a relationship, or finding an equation? Explain why, and give one example.',
    quiz: QUIZ,
  };
  return <LessonShell content={content} />;
}

'use client';

// The interactive Parallel & Perpendicular Lines lesson. Everything runs in the
// browser (see lib/lineMath), so it keeps working with no internet once loaded.

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

const RELATION_TEXT: Record<Relation, string> = {
  parallel: 'Parallel',
  perpendicular: 'Perpendicular',
  neither: 'Neither',
};

function relationClass(r: Relation): string {
  return r === 'parallel' ? 'mlz-parallel' : r === 'perpendicular' ? 'mlz-perp' : 'mlz-neither';
}

// ---- Tool 1: are two lines parallel, perpendicular, or neither? ----
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
      <p className="mlz-tool-hint">Type each line, then check. Slope form (y = 2x + 3), standard form (2x - 3y = 6), or a vertical line (x = 5) all work.</p>
      <label className="mlz-field">
        <span>Line 1</span>
        <input className="mlz-input" value={l1} onChange={(e) => setL1(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <label className="mlz-field">
        <span>Line 2</span>
        <input className="mlz-input" value={l2} onChange={(e) => setL2(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <button type="button" className="btn btn-primary mlz-go" onClick={check}>Check</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className={`mlz-result ${relationClass(out.rel)}`}>
          <strong className="mlz-verdict">{RELATION_TEXT[out.rel]}</strong>
          <p className="mlz-slopes">Slope of line 1 is {out.s1}. Slope of line 2 is {out.s2}.</p>
          <p className="mlz-why">
            {out.rel === 'parallel' && 'The slopes are equal, so the lines never meet. They are parallel.'}
            {out.rel === 'perpendicular' && 'The slopes are negative reciprocals (they multiply to -1), so the lines cross at a right angle.'}
            {out.rel === 'neither' && 'The slopes are not equal and not negative reciprocals, so the lines are neither parallel nor perpendicular.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Tool 2: find the equation through a point ----
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
      const gx = parseNumToRat(px);
      const gy = parseNumToRat(py);
      const line = parseLine(given);
      const { line: ans, steps } = findLine(gx, gy, line, mode);
      setOut({ answer: lineToString(ans), steps });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Please check your inputs.');
    }
  }

  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Find the equation of a line</h3>
      <p className="mlz-tool-hint">Give a point and the line it should be parallel or perpendicular to. The steps are shown so you can follow the method.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm">
          <span>Point x</span>
          <input className="mlz-input" value={px} onChange={(e) => setPx(e.target.value)} spellCheck={false} inputMode="text" />
        </label>
        <label className="mlz-field mlz-field-sm">
          <span>Point y</span>
          <input className="mlz-input" value={py} onChange={(e) => setPy(e.target.value)} spellCheck={false} inputMode="text" />
        </label>
      </div>
      <label className="mlz-field">
        <span>Given line</span>
        <input className="mlz-input" value={given} onChange={(e) => setGiven(e.target.value)} spellCheck={false} autoCapitalize="none" />
      </label>
      <div className="mlz-mode">
        <label className={`mlz-mode-opt ${mode === 'parallel' ? 'on' : ''}`}>
          <input type="radio" name="mode" checked={mode === 'parallel'} onChange={() => setMode('parallel')} />
          Parallel
        </label>
        <label className={`mlz-mode-opt ${mode === 'perpendicular' ? 'on' : ''}`}>
          <input type="radio" name="mode" checked={mode === 'perpendicular'} onChange={() => setMode('perpendicular')} />
          Perpendicular
        </label>
      </div>
      <button type="button" className="btn btn-primary mlz-go" onClick={solve}>Find the equation</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">{out.answer}</strong>
          <ol className="mlz-steps">
            {out.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ---- Practice A: relationship, instant feedback ----
const PRACTICE: { l1: string; l2: string }[] = [
  { l1: 'y = 3x + 1', l2: 'y = 3x - 4' },
  { l1: 'y = 2x + 5', l2: 'y = -1/2x + 1' },
  { l1: 'y = 4x - 2', l2: 'y = -4x + 2' },
  { l1: '2x - 3y = 6', l2: '3x + 2y = 8' },
  { l1: 'x = 3', l2: 'y = 7' },
  { l1: 'y = 5x + 2', l2: 'y = 5x + 2' },
];

const CHOICES: Relation[] = ['parallel', 'perpendicular', 'neither'];

function PracticeItem({ l1, l2, index }: { l1: string; l2: string; index: number }) {
  const answer = relationship(parseLine(l1), parseLine(l2));
  const [picked, setPicked] = useState<Relation | null>(null);

  return (
    <div className="mlz-practice">
      <p className="mlz-q">
        <span className="mlz-qnum">{index + 1}</span>
        Are <code>{l1}</code> and <code>{l2}</code> parallel, perpendicular, or neither?
      </p>
      <div className="mlz-choices">
        {CHOICES.map((c) => {
          const chosen = picked === c;
          const state = picked ? (c === answer ? 'right' : chosen ? 'wrong' : '') : '';
          return (
            <button
              key={c}
              type="button"
              className={`mlz-choice ${state}`}
              onClick={() => setPicked(c)}
              disabled={picked !== null}
            >
              {RELATION_TEXT[c]}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={`mlz-feedback ${picked === answer ? 'ok' : 'no'}`}>
          {picked === answer
            ? 'Correct.'
            : `Not quite. The answer is ${RELATION_TEXT[answer]}.`}
        </p>
      )}
    </div>
  );
}

// ---- Practice B: find the equation, reveal the worked solution ----
const BUILD_PRACTICE: { px: string; py: string; given: string; mode: Mode; label: string }[] = [
  { px: '1', py: '4', given: 'y = 3x - 2', mode: 'parallel', label: 'through (1, 4), parallel to y = 3x - 2' },
  { px: '6', py: '-1', given: 'y = 2x + 5', mode: 'perpendicular', label: 'through (6, -1), perpendicular to y = 2x + 5' },
  { px: '-2', py: '5', given: 'y = -x + 4', mode: 'parallel', label: 'through (-2, 5), parallel to y = -x + 4' },
];

function BuildPracticeItem({
  px,
  py,
  given,
  mode,
  label,
  index,
}: {
  px: string;
  py: string;
  given: string;
  mode: Mode;
  label: string;
  index: number;
}) {
  const [show, setShow] = useState(false);
  const solved = findLine(parseNumToRat(px), parseNumToRat(py), parseLine(given), mode);

  return (
    <div className="mlz-practice">
      <p className="mlz-q">
        <span className="mlz-qnum">{index + 1}</span>
        Find the line {label}.
      </p>
      {!show ? (
        <button type="button" className="btn btn-ghost mlz-reveal" onClick={() => setShow(true)}>
          Show solution
        </button>
      ) : (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">{lineToString(solved.line)}</strong>
          <ol className="mlz-steps">
            {solved.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function ParallelLesson() {
  return (
    <div className="mlz">
      <p className="mlz-lead">
        Two straight lines are <strong>parallel</strong> when they run in the same
        direction and never meet, and <strong>perpendicular</strong> when they cross
        at a right angle. The whole idea rests on one number: the <strong>slope</strong>.
        Master the slope and the rest follows.
      </p>

      {/* Slope recap */}
      <h2 className="mlz-h2">First, a reminder about slope</h2>
      <p className="mlz-p">
        The slope tells you how steep a line is and which way it tilts. In the form
        <code> y = mx + b</code>, the number <strong>m</strong> is the slope and
        <strong> b</strong> is where the line crosses the y-axis.
      </p>
      <ul className="mlz-list">
        <li><code>y = 3x + 2</code> has slope <strong>3</strong>.</li>
        <li><code>y = -x + 5</code> has slope <strong>-1</strong>.</li>
        <li>A <strong>horizontal</strong> line like <code>y = 4</code> has slope <strong>0</strong> (flat).</li>
        <li>A <strong>vertical</strong> line like <code>x = 6</code> has <strong>no slope</strong> (it is undefined).</li>
      </ul>
      <p className="mlz-p">
        If a line is given in standard form like <code>2x - 3y = 6</code>, first solve
        for y to see the slope. Here it becomes <code>y = (2/3)x - 2</code>, so the
        slope is <strong>2/3</strong>. A quick shortcut: for <code>Ax + By = C</code>,
        the slope is <code>-A/B</code>.
      </p>

      {/* Parallel */}
      <h2 className="mlz-h2">Parallel lines: equal slopes</h2>
      <p className="mlz-p">
        Parallel lines point in exactly the same direction, so they have the
        <strong> same slope</strong> and never touch.
      </p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Worked example</span>
        <p>Are <code>y = 2x + 1</code> and <code>y = 2x - 7</code> parallel?</p>
        <p>Slope of the first is <strong>2</strong>. Slope of the second is <strong>2</strong>. The slopes are equal, so the lines are <strong>parallel</strong>.</p>
        <p className="mlz-note">Note: the y-intercepts (1 and -7) are different, so they are two different parallel lines. If both the slope and the intercept matched, it would be the very same line.</p>
      </div>

      {/* Perpendicular */}
      <h2 className="mlz-h2">Perpendicular lines: negative reciprocals</h2>
      <p className="mlz-p">
        Perpendicular lines cross at a right angle (90 degrees). Their slopes are
        <strong> negative reciprocals</strong>, which means when you multiply them you
        get <strong>-1</strong>.
      </p>
      <p className="mlz-p">
        To get the negative reciprocal of a slope: <strong>flip the fraction and change
        the sign</strong>. For example, slope 2 is 2/1. Flip it to 1/2, then change the
        sign to get <strong>-1/2</strong>.
      </p>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Worked example</span>
        <p>Are <code>y = 2x + 1</code> and <code>y = -1/2x + 4</code> perpendicular?</p>
        <p>Multiply the slopes: <code>2 × (-1/2) = -1</code>. Since the product is -1, the lines are <strong>perpendicular</strong>.</p>
      </div>
      <p className="mlz-p">
        <strong>Special case:</strong> a vertical line (like <code>x = 5</code>) and a
        horizontal line (like <code>y = 3</code>) are always perpendicular to each
        other, even though one slope is undefined.
      </p>

      {/* Method box */}
      <div className="mlz-method">
        <h3 className="mlz-method-title">How to check any two lines</h3>
        <ol className="mlz-method-steps">
          <li>Write each line in the form <code>y = mx + b</code>.</li>
          <li>Read off each slope.</li>
          <li>Slopes <strong>equal</strong> means <strong>parallel</strong>. Slopes that <strong>multiply to -1</strong> means <strong>perpendicular</strong>. Otherwise, <strong>neither</strong>.</li>
        </ol>
      </div>

      <h2 className="mlz-h2">Try it yourself</h2>
      <CheckTool />

      {/* Finding equations */}
      <h2 className="mlz-h2">Finding the equation of a line</h2>
      <p className="mlz-p">
        A common task: find the line that passes through a given <strong>point</strong>
        and is parallel or perpendicular to a given line. Three steps:
      </p>
      <div className="mlz-method">
        <ol className="mlz-method-steps">
          <li>Find the slope you need. <strong>Parallel</strong> means the same slope. <strong>Perpendicular</strong> means the negative reciprocal.</li>
          <li>Put the point and slope into point-slope form: <code>y - y1 = m(x - x1)</code>.</li>
          <li>Simplify into <code>y = mx + b</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Worked example: parallel</span>
        <p>Find the line through <code>(2, 3)</code> that is parallel to <code>y = 5x - 2</code>.</p>
        <p>Parallel, so use the same slope <strong>5</strong>. Point-slope: <code>y - 3 = 5(x - 2)</code>. Simplify: <code>y = 5x - 10 + 3</code>, so <strong>y = 5x - 7</strong>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Worked example: perpendicular</span>
        <p>Find the line through <code>(4, 1)</code> that is perpendicular to <code>y = 2x + 9</code>.</p>
        <p>Perpendicular, so use the negative reciprocal of 2, which is <strong>-1/2</strong>. Point-slope: <code>y - 1 = -1/2(x - 4)</code>. Simplify: <code>y = -1/2x + 2 + 1</code>, so <strong>y = -1/2x + 3</strong>.</p>
      </div>

      <BuildTool />

      {/* Common mistakes */}
      <div className="mlz-mistakes">
        <h3 className="mlz-method-title">Watch out for these mistakes</h3>
        <ul className="mlz-list">
          <li>For perpendicular slopes, you must <strong>flip the fraction and change the sign</strong>. Doing only one of the two is the most common error.</li>
          <li>Always rewrite standard form as <code>y = mx + b</code> before comparing slopes.</li>
          <li>Equal slope <em>and</em> equal intercept is the <strong>same line</strong>, not two parallel lines.</li>
        </ul>
      </div>

      {/* Practice */}
      <h2 className="mlz-h2">Practice: parallel, perpendicular, or neither?</h2>
      <p className="mlz-lead mlz-lead-sm">Pick an answer for each. You will see right away if it is correct.</p>
      {PRACTICE.map((p, i) => (
        <PracticeItem key={i} index={i} l1={p.l1} l2={p.l2} />
      ))}

      <h2 className="mlz-h2">Practice: find the equation</h2>
      <p className="mlz-lead mlz-lead-sm">Solve each on paper first, then reveal the full solution to check.</p>
      {BUILD_PRACTICE.map((p, i) => (
        <BuildPracticeItem key={i} index={i} {...p} />
      ))}

      {/* Takeaways */}
      <div className="mlz-takeaways">
        <h3 className="mlz-method-title">Key takeaways</h3>
        <ul className="mlz-list">
          <li><strong>Parallel:</strong> same slope.</li>
          <li><strong>Perpendicular:</strong> slopes multiply to -1 (negative reciprocals).</li>
          <li><strong>Vertical and horizontal</strong> lines are perpendicular.</li>
          <li>To build a line, find the right slope, then use <code>y - y1 = m(x - x1)</code>.</li>
        </ul>
      </div>
    </div>
  );
}

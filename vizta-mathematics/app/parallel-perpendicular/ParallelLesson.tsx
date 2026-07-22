'use client';

// Parallel & Perpendicular Lines, assembled into the shared six-part flow.
// The interactive checkers are the "activity"; the concept text is the
// "discussion"; a 10-question quiz follows. All client-side, so it works offline.

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

function Discussion() {
  return (
    <>
      <p className="mlz-p">
        Two lines are <strong>parallel</strong> when they run in the same direction and never meet,
        and <strong>perpendicular</strong> when they cross at a right angle. It all comes down to
        the <strong>slope</strong>.
      </p>
      <h3 className="mlz-h2">A reminder about slope</h3>
      <p className="mlz-p">In <code>y = mx + b</code>, the number <strong>m</strong> is the slope.</p>
      <ul className="mlz-list">
        <li><code>y = 3x + 2</code> has slope <strong>3</strong>.</li>
        <li>A <strong>horizontal</strong> line <code>y = 4</code> has slope <strong>0</strong>.</li>
        <li>A <strong>vertical</strong> line <code>x = 6</code> has <strong>no slope</strong> (undefined).</li>
        <li>For standard form <code>Ax + By = C</code>, the slope is <code>-A/B</code>.</li>
      </ul>

      <div className="mlz-method">
        <h3 className="mlz-method-title">The two rules</h3>
        <ol className="mlz-method-steps">
          <li><strong>Parallel:</strong> the slopes are <strong>equal</strong>.</li>
          <li><strong>Perpendicular:</strong> the slopes are <strong>negative reciprocals</strong> (they multiply to -1). Flip the fraction and change the sign.</li>
        </ol>
      </div>

      <div className="mlz-example">
        <span className="mlz-ex-tag">Example: perpendicular</span>
        <p>Slope 2 and slope -1/2: multiply them, <code>2 × (-1/2) = -1</code>, so the lines are perpendicular.</p>
      </div>
      <p className="mlz-p"><strong>Special case:</strong> a vertical line and a horizontal line are always perpendicular.</p>

      <div className="mlz-method">
        <h3 className="mlz-method-title">Finding the equation of a line through a point</h3>
        <ol className="mlz-method-steps">
          <li>Find the slope you need (same for parallel, negative reciprocal for perpendicular).</li>
          <li>Use point-slope: <code>y - y1 = m(x - x1)</code>.</li>
          <li>Simplify to <code>y = mx + b</code>.</li>
        </ol>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Example</span>
        <p>Line through <code>(2, 3)</code> parallel to <code>y = 5x - 2</code>: same slope 5, so <code>y - 3 = 5(x - 2)</code>, which gives <strong>y = 5x - 7</strong>.</p>
      </div>
    </>
  );
}

const QUIZ: QuizQuestion[] = [
  { q: 'What is the slope of y = 4x - 7?', options: ['-7', '4', '7', '-4'], answer: 1 },
  { q: 'Two lines are parallel when their slopes are…', options: ['equal', 'opposite', 'negative reciprocals', 'both zero'], answer: 0 },
  { q: 'Two lines are perpendicular when their slopes…', options: ['are equal', 'multiply to -1', 'add to 0', 'are both positive'], answer: 1 },
  { q: 'The slope of a line perpendicular to a line with slope 3 is…', options: ['3', '-3', '1/3', '-1/3'], answer: 3 },
  { q: 'Are y = 2x + 1 and y = 2x - 9 parallel, perpendicular, or neither?', options: ['Parallel', 'Perpendicular', 'Neither', 'The same line'], answer: 0 },
  { q: 'Are y = 5x + 2 and y = -1/5x + 2 parallel, perpendicular, or neither?', options: ['Parallel', 'Perpendicular', 'Neither', 'Cannot tell'], answer: 1 },
  { q: 'A horizontal line and a vertical line are…', options: ['Parallel', 'Perpendicular', 'Neither', 'The same'], answer: 1 },
  { q: 'Written as y = mx + b, what is the slope of 2x + y = 8?', options: ['2', '-2', '8', '1/2'], answer: 1 },
  { q: 'The line through (0, 3) parallel to y = 4x - 1 is…', options: ['y = 4x + 3', 'y = -1/4x + 3', 'y = 4x - 1', 'y = 3x + 4'], answer: 0 },
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
      </>
    ),
    reflectionPrompt:
      'In your own words, how do you decide if two lines are perpendicular? Give one short example.',
    quiz: QUIZ,
  };
  return <LessonShell content={content} />;
}

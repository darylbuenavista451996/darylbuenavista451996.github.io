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

// ---- Practice: instant feedback, computed with the same engine ----
const PRACTICE: { l1: string; l2: string }[] = [
  { l1: 'y = 3x + 1', l2: 'y = 3x - 4' },
  { l1: 'y = 2x + 5', l2: 'y = -1/2x + 1' },
  { l1: 'y = 4x - 2', l2: 'y = -4x + 2' },
  { l1: 'x = 3', l2: 'y = 7' },
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

export default function ParallelLesson() {
  return (
    <div className="mlz">
      <p className="mlz-lead">
        Two straight lines are <strong>parallel</strong> when they run in the same
        direction and never meet, and <strong>perpendicular</strong> when they cross
        at a right angle. The whole idea rests on one number: the <strong>slope</strong>.
      </p>

      <div className="mlz-concept">
        <h2 className="mlz-h2">The rules</h2>
        <ul className="mlz-rules">
          <li><strong>Parallel:</strong> the slopes are <strong>equal</strong>. Example: y = 2x + 1 and y = 2x - 7 both have slope 2.</li>
          <li><strong>Perpendicular:</strong> the slopes are <strong>negative reciprocals</strong>, meaning they multiply to -1. Example: slope 2 and slope -1/2.</li>
          <li><strong>Neither:</strong> the slopes are not equal and do not multiply to -1.</li>
          <li><strong>Special case:</strong> a <strong>vertical</strong> line (x = 5) and a <strong>horizontal</strong> line (y = 3) are always perpendicular to each other.</li>
        </ul>
      </div>

      <h2 className="mlz-h2">Try it yourself</h2>
      <CheckTool />
      <BuildTool />

      <h2 className="mlz-h2">Practice</h2>
      <p className="mlz-lead mlz-lead-sm">Pick an answer for each. You will see right away if it is correct.</p>
      {PRACTICE.map((p, i) => (
        <PracticeItem key={i} index={i} l1={p.l1} l2={p.l2} />
      ))}
    </div>
  );
}

'use client';

// Practice tools shared by the three quadratic lessons (discriminant, completing
// the square, quadratic formula). Ungraded: students type an equation and see the
// working. All numbers are exact, so nothing is rounded by accident.

import { useState } from 'react';
import { Rat } from '@/lib/lineMath';
import {
  parseQuadratic, discriminant, natureText, quadToString, nature,
  solveByFormula, completeTheSquare, type Quad,
} from '@/lib/quadMath';

function useEq(initial: string) {
  const [eq, setEq] = useState(initial);
  const [err, setErr] = useState('');
  return { eq, setEq, err, setErr };
}

function EqInput({ eq, setEq, onGo, label }: { eq: string; setEq: (v: string) => void; onGo: () => void; label: string }) {
  return (
    <>
      <label className="mlz-field">
        <span>Your equation</span>
        <input
          className="mlz-input"
          value={eq}
          onChange={(e) => setEq(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onGo(); }}
          spellCheck={false}
          placeholder="x^2 + 6x + 5 = 0"
        />
      </label>
      <p className="mlz-tool-hint" style={{ marginTop: 4 }}>Write squares as <code>x^2</code>. Use only x, numbers, + and -.</p>
      <button type="button" className="btn btn-primary mlz-go" onClick={onGo}>{label}</button>
    </>
  );
}

export function DiscriminantTool() {
  const { eq, setEq, err, setErr } = useEq('x^2 + 6x + 5 = 0');
  const [out, setOut] = useState<null | { q: Quad; D: string; verdict: string; steps: string[] }>(null);
  function go() {
    setErr(''); setOut(null);
    try {
      const q = parseQuadratic(eq);
      const D = discriminant(q);
      const sub = `(${q.b.toString()})^2 - 4(${q.a.toString()})(${q.c.toString()})`;
      setOut({
        q, D: D.toString(), verdict: natureText(D),
        steps: [
          `Standard form: ${quadToString(q)}`,
          `a = ${q.a.toString()}, b = ${q.b.toString()}, c = ${q.c.toString()}`,
          `D = b^2 - 4ac = ${sub} = ${D.toString()}`,
          nature(D) === 'two' ? 'D is more than 0.' : nature(D) === 'one' ? 'D is exactly 0.' : 'D is less than 0.',
        ],
      });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your equation.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Discriminant checker</h3>
      <p className="mlz-tool-hint">Type any quadratic equation. It finds a, b and c, works out the discriminant, and tells you how many real solutions there are.</p>
      <EqInput eq={eq} setEq={setEq} onGo={go} label="Find the discriminant" />
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">D = {out.D}: {out.verdict}</strong>
          <ol className="mlz-steps">{out.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

export function SquareTool() {
  const { eq, setEq, err, setErr } = useEq('x^2 + 6x + 5 = 0');
  const [out, setOut] = useState<null | { steps: string[]; answer: string }>(null);
  function go() {
    setErr(''); setOut(null);
    try { setOut(completeTheSquare(parseQuadratic(eq))); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Please check your equation.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Completing the square, step by step</h3>
      <p className="mlz-tool-hint">Type a quadratic equation. It shows every step. Try to predict each step before you read it.</p>
      <EqInput eq={eq} setEq={setEq} onGo={go} label="Show the steps" />
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

export function FormulaTool() {
  const { eq, setEq, err, setErr } = useEq('2x^2 + x - 6 = 0');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  function go() {
    setErr(''); setOut(null);
    try {
      const q = parseQuadratic(eq);
      const D = discriminant(q);
      const r = solveByFormula(q);
      const answer = r.kind === 'none' ? 'No real solutions'
        : r.kind === 'one' ? `x = ${r.text}`
        : r.text.length === 2 ? `x = ${r.text[0]} or x = ${r.text[1]}`
        : `x = ${r.text[0]}`;
      const steps = [
        `Standard form: ${quadToString(q)}`,
        `a = ${q.a.toString()}, b = ${q.b.toString()}, c = ${q.c.toString()}`,
        `D = b^2 - 4ac = ${D.toString()}`,
        D.isNeg()
          ? 'D is negative, so the square root is not a real number. There is no real solution.'
          : `x = (-b ± √D) / 2a = (${q.b.neg().toString()} ± √${D.toString()}) / ${new Rat(2).mul(q.a).toString()}`,
        answer,
      ];
      setOut({ answer, steps });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your equation.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Quadratic formula solver</h3>
      <p className="mlz-tool-hint">Type a quadratic equation to see the formula used on it. Answers are exact, so a square root stays as a square root.</p>
      <EqInput eq={eq} setEq={setEq} onGo={go} label="Solve with the formula" />
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

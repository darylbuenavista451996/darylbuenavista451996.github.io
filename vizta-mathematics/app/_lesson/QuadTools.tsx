'use client';

// Practice tools shared by the three quadratic lessons (discriminant, completing
// the square, quadratic formula). Ungraded: students type an equation and see the
// working. All numbers are exact, so nothing is rounded by accident.

import { useState } from 'react';
import { Rat, parseNumToRat } from '@/lib/lineMath';
import {
  parseQuadratic, discriminant, natureText, quadToString, nature,
  completeTheSquare, type Quad,
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

// Sum and product of roots: from an equation, or build an equation from two roots.
export function RootsTool() {
  const { eq, setEq, err, setErr } = useEq('2x^2 - 3x - 2 = 0');
  const [out, setOut] = useState<null | { sum: string; product: string; steps: string[] }>(null);
  function go() {
    setErr(''); setOut(null);
    try {
      const q = parseQuadratic(eq);
      const sum = q.b.neg().div(q.a);
      const product = q.c.div(q.a);
      setOut({
        sum: sum.toString(), product: product.toString(),
        steps: [
          `Standard form: ${quadToString(q)}`,
          `a = ${q.a.toString()}, b = ${q.b.toString()}, c = ${q.c.toString()}`,
          `Sum of roots = -b/a = ${q.b.neg().toString()} / ${q.a.toString()} = ${sum.toString()}`,
          `Product of roots = c/a = ${q.c.toString()} / ${q.a.toString()} = ${product.toString()}`,
          discriminant(q).isNeg() ? 'Note: this equation has no real roots, so these two numbers are not sums and products of real numbers.' : 'Check: solve the equation and add and multiply the two roots. You get the same numbers.',
        ],
      });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your equation.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Sum and product of roots</h3>
      <p className="mlz-tool-hint">Type a quadratic equation. It gives the sum and product of its roots without solving it.</p>
      <EqInput eq={eq} setEq={setEq} onGo={go} label="Find the sum and product" />
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">Sum = {out.sum}, product = {out.product}</strong>
          <ol className="mlz-steps">{out.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

export function BuildTool() {
  const [r1, setR1] = useState('2');
  const [r2, setR2] = useState('5');
  const [err, setErr] = useState('');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  function go() {
    setErr(''); setOut(null);
    try {
      const a = parseNumToRat(r1), b = parseNumToRat(r2);
      const sum = a.add(b), product = a.mul(b);
      // Clear fractions so the equation has whole-number coefficients.
      let l = 1;
      const g = (x: number, y: number): number => (y ? g(y, x % y) : Math.abs(x));
      for (const r of [sum, product]) l = (l / g(l, r.d)) * r.d;
      const q: Quad = { a: new Rat(l), b: sum.neg().mul(new Rat(l)), c: product.mul(new Rat(l)) };
      setOut({
        answer: quadToString(q),
        steps: [
          `Sum of roots = ${a.toString()} + ${b.toString()} = ${sum.toString()}`,
          `Product of roots = ${a.toString()} x ${b.toString()} = ${product.toString()}`,
          `x^2 - (sum)x + (product) = 0, so x^2 - (${sum.toString()})x + (${product.toString()}) = 0`,
          l > 1 ? `Multiply every term by ${l} to remove the fractions.` : 'No fractions, so this is the final equation.',
        ],
      });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your numbers.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Build an equation from its roots</h3>
      <p className="mlz-tool-hint">Type two roots (whole numbers, fractions or decimals). It builds the quadratic equation.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Root 1</span><input className="mlz-input" value={r1} onChange={(e) => setR1(e.target.value)} spellCheck={false} /></label>
        <label className="mlz-field mlz-field-sm"><span>Root 2</span><input className="mlz-input" value={r2} onChange={(e) => setR2(e.target.value)} spellCheck={false} /></label>
      </div>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Build the equation</button>
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

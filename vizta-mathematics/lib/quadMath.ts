// Exact quadratic math for the Mathematics lessons (discriminant, completing the
// square, quadratic formula). Everything uses exact fractions (Rat) and simplified
// radicals, so answers shown to students are never rounded by accident.

import { Rat, parseNumToRat } from './lineMath';

export type Quad = { a: Rat; b: Rat; c: Rat };

const gcdInt = (x: number, y: number): number => {
  x = Math.abs(x); y = Math.abs(y);
  while (y) [x, y] = [y, x % y];
  return x;
};
const lcmInt = (x: number, y: number) => (x / gcdInt(x, y)) * y;
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

// ---- Parsing "2x^2 - 3x + 1 = 0", "x² = 3x + 10", "x^2+6x=-5" -----------------
function parseSide(raw: string): { a: Rat; b: Rat; c: Rat } {
  let a = new Rat(0), b = new Rat(0), c = new Rat(0);
  if (raw === '') return { a, b, c };
  if (/[^0-9x^+\-./]/.test(raw)) {
    throw new Error('Use only x, numbers, + and -. Write it without brackets, for example x^2 + 6x + 5 = 0.');
  }
  const terms = raw.match(/[+-]?[^+-]+/g);
  if (!terms || terms.join('') !== raw) throw new Error('I could not read that equation. Try x^2 + 6x + 5 = 0.');
  for (const t of terms) {
    const sign = t.startsWith('-') ? -1 : 1;
    const body = t.replace(/^[+-]/, '');
    const coef = (s: string) => (s === '' ? new Rat(1) : parseNumToRat(s));
    if (body.endsWith('x^2')) a = a.add(coef(body.slice(0, -3)).mul(new Rat(sign)));
    else if (body.endsWith('x')) b = b.add(coef(body.slice(0, -1)).mul(new Rat(sign)));
    else if (body.includes('x')) throw new Error('Only x and x^2 are allowed. Write squares as x^2.');
    else c = c.add(parseNumToRat(body).mul(new Rat(sign)));
  }
  return { a, b, c };
}

export function parseQuadratic(input: string): Quad {
  const s = input.toLowerCase().replace(/\s+/g, '').replace(/²/g, '^2').replace(/[−–]/g, '-');
  const parts = s.split('=');
  if (parts.length > 2) throw new Error('Use only one = sign.');
  const L = parseSide(parts[0]);
  const R = parseSide(parts[1] ?? '0');
  const a = L.a.sub(R.a), b = L.b.sub(R.b), c = L.c.sub(R.c);
  if (a.isZero()) throw new Error('That is not a quadratic equation, because it has no x^2 term.');
  return { a, b, c };
}

export function discriminant(q: Quad): Rat {
  return q.b.mul(q.b).sub(new Rat(4).mul(q.a).mul(q.c));
}
export type Nature = 'two' | 'one' | 'none';
export function nature(D: Rat): Nature {
  if (D.isZero()) return 'one';
  return D.isNeg() ? 'none' : 'two';
}
export function natureText(D: Rat): string {
  const n = nature(D);
  return n === 'two' ? 'two different real solutions'
    : n === 'one' ? 'exactly one real solution (a repeated solution)'
    : 'no real solutions';
}

// Standard form string, e.g. "2x^2 - 3x + 1 = 0"
export function quadToString(q: Quad): string {
  const term = (r: Rat, v: string, first: boolean) => {
    if (r.isZero()) return '';
    const abs = r.abs();
    const mag = v !== '' && abs.eq(new Rat(1)) ? '' : abs.d === 1 || v === '' ? abs.toString() : `(${abs.toString()})`;
    const sign = r.isNeg() ? (first ? '-' : ' - ') : first ? '' : ' + ';
    return `${sign}${mag}${v}`;
  };
  const s = term(q.a, 'x^2', true) + term(q.b, 'x', q.a.isZero()) + term(q.c, '', q.a.isZero() && q.b.isZero());
  return `${s} = 0`;
}

// ---- Radicals ------------------------------------------------------------------
// sqrt(n) for a positive integer n = k * sqrt(m), with m having no square factor.
export function simplifySqrt(n: number): { k: number; m: number } {
  let k = 1, m = n;
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) { m /= f * f; k *= f; }
  }
  return { k, m };
}

export type Roots =
  | { kind: 'none' }
  | { kind: 'one'; text: string; value: number }
  | { kind: 'two'; text: string[]; values: number[] };

// Exact solutions from the quadratic formula. Fractions are cleared first so the
// discriminant is a whole number and the radical can be simplified.
export function solveByFormula(q: Quad): Roots {
  let l = 1;
  for (const r of [q.a, q.b, q.c]) l = lcmInt(l, r.d);
  let a = q.a.n * (l / q.a.d), b = q.b.n * (l / q.b.d), c = q.c.n * (l / q.c.d);
  const g = gcdInt(gcdInt(a, b), c);
  if (g > 1) { a /= g; b /= g; c /= g; }
  const D = b * b - 4 * a * c;
  if (D < 0) return { kind: 'none' };
  if (D === 0) {
    const r = new Rat(-b, 2 * a);
    return { kind: 'one', text: r.toString(), value: r.toNumber() };
  }
  if (isSquare(D)) {
    const s = Math.round(Math.sqrt(D));
    const r1 = new Rat(-b + s, 2 * a), r2 = new Rat(-b - s, 2 * a);
    // larger first
    const [hi, lo] = r1.toNumber() >= r2.toNumber() ? [r1, r2] : [r2, r1];
    return { kind: 'two', text: [hi.toString(), lo.toString()], values: [hi.toNumber(), lo.toNumber()] };
  }
  const { k, m } = simplifySqrt(D);
  const gg = gcdInt(gcdInt(b, k), 2 * a);
  let p = -b / gg, qq = k / gg, den = (2 * a) / gg;
  if (den < 0) { p = -p; den = -den; }
  const root = `${qq === 1 ? '' : qq}√${m}`;
  const top = p === 0 ? `± ${root}` : `${p} ± ${root}`;
  const text = den === 1 ? top : p === 0 ? `± ${root} / ${den}` : `(${top}) / ${den}`;
  const approx = Math.sqrt(D);
  const v1 = (-b + approx) / (2 * a), v2 = (-b - approx) / (2 * a);
  return { kind: 'two', text: [text], values: [Math.max(v1, v2), Math.min(v1, v2)] };
}

// ---- Completing the square -------------------------------------------------------
export type CtsResult = { steps: string[]; answer: string };

function sqrtRat(R: Rat): { rational: Rat | null; k: number; m: number; d: number } {
  const n = R.n, d = R.d; // R > 0, reduced
  const nd = n * d;
  if (isSquare(nd)) return { rational: new Rat(Math.round(Math.sqrt(nd)), d), k: 1, m: 1, d };
  const { k, m } = simplifySqrt(nd);
  return { rational: null, k, m, d };
}

export function completeTheSquare(q: Quad): CtsResult {
  const steps: string[] = [];
  let { a, b, c } = q;
  steps.push(`Start: ${quadToString(q)}`);
  if (!a.eq(new Rat(1))) {
    b = b.div(a); c = c.div(a); a = new Rat(1);
    steps.push(`Divide every term by ${q.a.toString()} so the x^2 term has coefficient 1: ${quadToString({ a, b, c })}`);
  }
  const rhs0 = c.neg();
  steps.push(`Move the constant to the right side: x^2 ${b.isNeg() ? '-' : '+'} ${b.abs().toString()}x = ${rhs0.toString()}`);
  const h = b.div(new Rat(2));
  const h2 = h.mul(h);
  steps.push(`Half of ${b.toString()} is ${h.toString()}, and its square is ${h2.toString()}. Add ${h2.toString()} to both sides.`);
  const R = rhs0.add(h2);
  steps.push(`Now the left side is a perfect square: (x ${h.isNeg() ? '-' : '+'} ${h.abs().toString()})^2 = ${R.toString()}`);
  const negH = h.neg();
  if (R.isNeg()) {
    steps.push('A square can never be negative, so there is no real solution.');
    return { steps, answer: 'No real solutions' };
  }
  if (R.isZero()) {
    steps.push(`The only possibility is x ${h.isNeg() ? '-' : '+'} ${h.abs().toString()} = 0, so x = ${negH.toString()}.`);
    return { steps, answer: `x = ${negH.toString()}` };
  }
  const s = sqrtRat(R);
  if (s.rational) {
    const r1 = negH.add(s.rational), r2 = negH.sub(s.rational);
    steps.push(`Take the square root of both sides: x ${h.isNeg() ? '-' : '+'} ${h.abs().toString()} = ±${s.rational.toString()}`);
    const [hi, lo] = r1.toNumber() >= r2.toNumber() ? [r1, r2] : [r2, r1];
    steps.push(`So x = ${hi.toString()} or x = ${lo.toString()}.`);
    return { steps, answer: `x = ${hi.toString()} or x = ${lo.toString()}` };
  }
  const gk = gcdInt(s.k, s.d);
  const kk = s.k / gk, dd = s.d / gk;
  const surd = `${kk === 1 ? '' : kk}√${s.m}`;
  const surdFull = dd > 1 ? `(${surd})/${dd}` : surd;
  steps.push(`Take the square root of both sides: x ${h.isNeg() ? '-' : '+'} ${h.abs().toString()} = ±${surdFull}`);
  const base = negH.isZero() ? '' : `${negH.toString()} `;
  const ans = `x = ${base}± ${surdFull}`;
  steps.push(`So ${ans}.`);
  return { steps, answer: ans };
}

// Vertex form y = a(x - h)^2 + k of y = ax^2 + bx + c
export function vertexForm(q: Quad): { h: Rat; k: Rat } {
  const h = q.b.div(new Rat(2).mul(q.a)).neg();
  const k = q.c.sub(q.b.mul(q.b).div(new Rat(4).mul(q.a)));
  return { h, k };
}

// Pure, browser-safe math for the Parallel & Perpendicular Lines lesson.
//
// Everything here is exact (rational arithmetic), so a slope of 2/3 stays 2/3
// and its perpendicular is exactly -3/2, never a rounded decimal. No DOM, no
// network: this is what lets the lesson run fully offline on a student's phone.

// A rational number n/d, always stored in lowest terms with d > 0.
export class Rat {
  n: number;
  d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('Cannot divide by zero.');
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(Math.abs(n), Math.abs(d)) || 1;
    this.n = n / g;
    this.d = d / g;
  }
  add(o: Rat) { return new Rat(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Rat) { return new Rat(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Rat) { return new Rat(this.n * o.n, this.d * o.d); }
  div(o: Rat) {
    if (o.n === 0) throw new Error('Cannot divide by zero.');
    return new Rat(this.n * o.d, this.d * o.n);
  }
  neg() { return new Rat(-this.n, this.d); }
  eq(o: Rat) { return this.n === o.n && this.d === o.d; }
  isZero() { return this.n === 0; }
  isNeg() { return this.n < 0; }
  abs() { return new Rat(Math.abs(this.n), this.d); }
  toNumber() { return this.n / this.d; }
  toString() { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`; }
}

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// A parsed line: either a slope form y = m x + b, or a vertical line x = c
// (whose slope is undefined).
export type Line =
  | { kind: 'slope'; m: Rat; b: Rat }
  | { kind: 'vertical'; x: Rat };

// Parse a single number token: integer, decimal (0.5), or fraction (1/2, -3/4).
function parseNum(t: string): Rat {
  t = t.replace(/[()\s]/g, '');
  if (t.includes('/')) {
    const parts = t.split('/');
    if (parts.length !== 2) throw new Error('Check the number format.');
    return decToRat(parts[0]).div(decToRat(parts[1]));
  }
  return decToRat(t);
}

function decToRat(s: string): Rat {
  s = s.trim();
  let sign = 1;
  if (s.startsWith('-')) { sign = -1; s = s.slice(1); }
  else if (s.startsWith('+')) s = s.slice(1);
  if (s === '') throw new Error('Missing a number.');
  if (s.includes('.')) {
    const [i, f = ''] = s.split('.');
    const denom = Math.pow(10, f.length);
    const num = parseInt((i || '0') + f, 10);
    if (Number.isNaN(num)) throw new Error('That is not a valid number.');
    return new Rat(sign * num, denom);
  }
  const k = parseInt(s, 10);
  if (Number.isNaN(k)) throw new Error('That is not a valid number.');
  return new Rat(sign * k, 1);
}

// Parse one side of an equation into coefficients of x, y and a constant.
// Understands terms like: 2x, -x, 3y, 1/2x, -0.5y, 7.
function parseExpr(raw: string): { x: Rat; y: Rat; c: Rat } {
  let s = raw.replace(/\s+/g, '').toLowerCase();
  if (!s) throw new Error('One side of the equation is empty.');
  s = s.replace(/-/g, '+-');
  if (s.startsWith('+')) s = s.slice(1);
  const terms = s.split('+').filter((t) => t !== '');
  let x = new Rat(0);
  let y = new Rat(0);
  let c = new Rat(0);
  for (const term of terms) {
    let v: 'x' | 'y' | null = null;
    let coefStr = term;
    if (term.endsWith('x')) { v = 'x'; coefStr = term.slice(0, -1); }
    else if (term.endsWith('y')) { v = 'y'; coefStr = term.slice(0, -1); }
    let coef: Rat;
    if (coefStr === '') coef = new Rat(1);
    else if (coefStr === '-') coef = new Rat(-1);
    else coef = parseNum(coefStr);
    if (v === 'x') x = x.add(coef);
    else if (v === 'y') y = y.add(coef);
    else c = c.add(coef);
  }
  return { x, y, c };
}

// Parse a full line equation such as "y = 2x + 3", "2x - 3y = 6", or "x = 5".
export function parseLine(input: string): Line {
  const parts = input.split('=');
  if (parts.length !== 2) {
    throw new Error('An equation needs one = sign, for example y = 2x + 3.');
  }
  const L = parseExpr(parts[0]);
  const R = parseExpr(parts[1]);
  // Move everything to the left:  A x + B y + C = 0
  const A = L.x.sub(R.x);
  const B = L.y.sub(R.y);
  const C = L.c.sub(R.c);
  if (!B.isZero()) {
    return { kind: 'slope', m: A.neg().div(B), b: C.neg().div(B) };
  }
  if (!A.isZero()) {
    return { kind: 'vertical', x: C.neg().div(A) };
  }
  throw new Error('That does not describe a line. Try something like y = 2x + 3.');
}

// Parse a plain number a student types (integer, decimal, or fraction) into an
// exact rational. Used for the coordinates of a point.
export function parseNumToRat(input: string): Rat {
  const t = input.trim();
  if (t === '') throw new Error('Enter a number.');
  return parseNum(t);
}

export type Relation = 'parallel' | 'perpendicular' | 'neither';

// Decide how two lines relate, covering the vertical/horizontal special cases.
export function relationship(a: Line, b: Line): Relation {
  const aVert = a.kind === 'vertical';
  const bVert = b.kind === 'vertical';
  if (aVert && bVert) return 'parallel';
  if (aVert || bVert) {
    // A vertical line is perpendicular only to a horizontal line (slope 0).
    const sloped = aVert ? b : a;
    if (sloped.kind === 'slope' && sloped.m.isZero()) return 'perpendicular';
    return 'neither';
  }
  if (a.kind === 'slope' && b.kind === 'slope') {
    if (a.m.eq(b.m)) return 'parallel';
    if (a.m.mul(b.m).eq(new Rat(-1))) return 'perpendicular';
  }
  return 'neither';
}

// The slope of a line, as text (for display).
export function slopeLabel(line: Line): string {
  if (line.kind === 'vertical') return 'undefined (vertical line)';
  if (line.m.isZero()) return '0 (horizontal line)';
  return line.m.toString();
}

// Format the coefficient in "m x" nicely: 1 -> x, -1 -> -x, else "m x".
function fmtSlopeCoef(m: Rat): string {
  if (m.eq(new Rat(1))) return 'x';
  if (m.eq(new Rat(-1))) return '-x';
  return `${m.toString()}x`;
}

// Format the "+ b" tail: hidden when 0, sign chosen from b.
function fmtConst(b: Rat): string {
  if (b.isZero()) return '';
  return b.isNeg() ? ` - ${b.abs().toString()}` : ` + ${b.toString()}`;
}

// A line as a clean equation string.
export function lineToString(line: Line): string {
  if (line.kind === 'vertical') return `x = ${line.x.toString()}`;
  if (line.m.isZero()) return `y = ${line.b.toString()}`;
  return `y = ${fmtSlopeCoef(line.m)}${fmtConst(line.b)}`;
}

// "x - 3" but "x + 3" when the value is negative, so signs never double up.
function fmtSub(varName: string, val: Rat): string {
  if (val.isZero()) return varName;
  return val.isNeg() ? `${varName} + ${val.abs().toString()}` : `${varName} - ${val.toString()}`;
}

export type Mode = 'parallel' | 'perpendicular';

// Find the line through (px, py) that is parallel or perpendicular to `given`,
// returning the answer plus a short list of worked steps.
export function findLine(
  px: Rat,
  py: Rat,
  given: Line,
  mode: Mode,
): { line: Line; steps: string[] } {
  const steps: string[] = [];
  steps.push(`The given line is ${lineToString(given)}, with slope ${slopeLabel(given)}.`);

  // Work out the target orientation.
  let target: Line;
  if (mode === 'parallel') {
    if (given.kind === 'vertical') {
      steps.push('Parallel to a vertical line is another vertical line.');
      target = { kind: 'vertical', x: px };
    } else {
      const m = given.m;
      steps.push(`Parallel lines have equal slopes, so the new slope is ${m.toString()}.`);
      const b = py.sub(m.mul(px));
      steps.push(`Point-slope through (${px.toString()}, ${py.toString()}): y - ${py.toString()} = ${m.toString()}(${fmtSub('x', px)}).`);
      steps.push(`Solve for b: b = ${py.toString()} - (${m.toString()})(${px.toString()}) = ${b.toString()}.`);
      target = { kind: 'slope', m, b };
    }
  } else {
    // perpendicular
    if (given.kind === 'vertical') {
      steps.push('Perpendicular to a vertical line is a horizontal line (slope 0).');
      target = { kind: 'slope', m: new Rat(0), b: py };
    } else if (given.m.isZero()) {
      steps.push('Perpendicular to a horizontal line is a vertical line.');
      target = { kind: 'vertical', x: px };
    } else {
      const m = new Rat(-1).div(given.m); // negative reciprocal
      steps.push(`Perpendicular slopes are negative reciprocals, so the new slope is ${m.toString()}.`);
      const b = py.sub(m.mul(px));
      steps.push(`Point-slope through (${px.toString()}, ${py.toString()}): y - ${py.toString()} = ${m.toString()}(${fmtSub('x', px)}).`);
      steps.push(`Solve for b: b = ${py.toString()} - (${m.toString()})(${px.toString()}) = ${b.toString()}.`);
      target = { kind: 'slope', m, b };
    }
  }

  steps.push(`Answer: ${lineToString(target)}.`);
  return { line: target, steps };
}

// Evaluate a linear function y = mx + b at a given x. Returns null for a
// vertical line (not a function).
export function evalLine(line: Line, x: Rat): Rat | null {
  if (line.kind === 'vertical') return null;
  return line.m.mul(x).add(line.b);
}

// Build the line through two points, with worked steps. Vertical if the
// x-values match.
export function lineFromTwoPoints(
  x1: Rat,
  y1: Rat,
  x2: Rat,
  y2: Rat,
): { line: Line; steps: string[] } {
  const steps: string[] = [];
  if (x1.eq(x2)) {
    steps.push('The two x-values are the same, so this is a vertical line.');
    return { line: { kind: 'vertical', x: x1 }, steps };
  }
  const m = y2.sub(y1).div(x2.sub(x1));
  steps.push(
    `Slope = (y2 - y1) / (x2 - x1) = (${y2.toString()} - ${y1.toString()}) / (${x2.toString()} - ${x1.toString()}) = ${m.toString()}.`,
  );
  const b = y1.sub(m.mul(x1));
  steps.push(`Find b using (${x1.toString()}, ${y1.toString()}): b = ${y1.toString()} - (${m.toString()})(${x1.toString()}) = ${b.toString()}.`);
  const line: Line = { kind: 'slope', m, b };
  steps.push(`Answer: ${lineToString(line)}.`);
  return { line, steps };
}

'use client';

// Triangle Similarities. Ungraded practice tools, then graded work: 5 typed
// "find the missing side" questions (1 pt each), 3 word problems with 5 choices
// (2 pts each), and the 10-question multiple-choice quiz (1 pt each). Same
// structure and points (23 total) as the other math lessons.

import { useState } from 'react';
import { parseNumToRat } from '@/lib/lineMath';
import LessonShell, { type LessonContent, type GradedGroup } from '../_lesson/LessonShell';

// Find a missing side using the scale factor between two similar triangles.
function ScaleTool() {
  const [a, setA] = useState('4');
  const [a2, setA2] = useState('8');
  const [b, setB] = useState('5');
  const [out, setOut] = useState<null | { answer: string; steps: string[] }>(null);
  const [err, setErr] = useState('');
  function go() {
    setErr(''); setOut(null);
    try {
      const ra = parseNumToRat(a);
      const ra2 = parseNumToRat(a2);
      const rb = parseNumToRat(b);
      if (ra.isZero()) throw new Error('The first side cannot be 0.');
      const k = ra2.div(ra); // scale factor from triangle 1 to triangle 2
      const missing = rb.mul(k);
      setOut({
        answer: missing.toString(),
        steps: [
          `Scale factor = ${a2} ÷ ${a} = ${k.toString()}`,
          `Missing side = ${b} × ${k.toString()} = ${missing.toString()}`,
        ],
      });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your inputs.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Find a missing side</h3>
      <p className="mlz-tool-hint">Two triangles are similar. Give a pair of matching sides to get the scale factor, then a third side to find its match.</p>
      <div className="mlz-point-row">
        <label className="mlz-field mlz-field-sm"><span>Side in triangle 1</span><input className="mlz-input" value={a} onChange={(e) => setA(e.target.value)} spellCheck={false} /></label>
        <label className="mlz-field mlz-field-sm"><span>Matching side in triangle 2</span><input className="mlz-input" value={a2} onChange={(e) => setA2(e.target.value)} spellCheck={false} /></label>
      </div>
      <label className="mlz-field"><span>Another side in triangle 1</span><input className="mlz-input" value={b} onChange={(e) => setB(e.target.value)} spellCheck={false} /></label>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Find the matching side</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">Matching side = {out.answer}</strong>
          <ol className="mlz-steps">{out.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

// Check whether two triangles are similar by SSS (all three ratios equal).
function SimilarTool() {
  const [t1, setT1] = useState(['3', '4', '5']);
  const [t2, setT2] = useState(['6', '8', '10']);
  const [out, setOut] = useState<null | { similar: boolean; text: string; steps: string[] }>(null);
  const [err, setErr] = useState('');
  const set1 = (i: number, v: string) => setT1((p) => p.map((x, j) => (j === i ? v : x)));
  const set2 = (i: number, v: string) => setT2((p) => p.map((x, j) => (j === i ? v : x)));
  function go() {
    setErr(''); setOut(null);
    try {
      const s1 = t1.map(parseNumToRat).slice().sort((x, y) => x.toNumber() - y.toNumber());
      const s2 = t2.map(parseNumToRat).slice().sort((x, y) => x.toNumber() - y.toNumber());
      if (s1.some((r) => r.isZero()) || s2.some((r) => r.isZero())) throw new Error('Side lengths must be more than 0.');
      const ratios = [0, 1, 2].map((i) => s2[i].div(s1[i]));
      const similar = ratios[0].eq(ratios[1]) && ratios[1].eq(ratios[2]);
      setOut({
        similar,
        text: similar
          ? `Similar by SSS. Every pair of sides has the same ratio, ${ratios[0].toString()}.`
          : 'Not similar. The three side ratios are not all equal.',
        steps: [0, 1, 2].map((i) => `${s2[i].toString()} ÷ ${s1[i].toString()} = ${ratios[i].toString()}`),
      });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Please check your inputs.'); }
  }
  return (
    <div className="mlz-tool">
      <h3 className="mlz-tool-title">Are two triangles similar? (SSS)</h3>
      <p className="mlz-tool-hint">Enter the three sides of each triangle. It compares the ratios of matching sides.</p>
      <div className="mlz-point-row">
        {t1.map((v, i) => (
          <label key={i} className="mlz-field mlz-field-sm"><span>Triangle 1 side {i + 1}</span><input className="mlz-input" value={v} onChange={(e) => set1(i, e.target.value)} spellCheck={false} /></label>
        ))}
      </div>
      <div className="mlz-point-row">
        {t2.map((v, i) => (
          <label key={i} className="mlz-field mlz-field-sm"><span>Triangle 2 side {i + 1}</span><input className="mlz-input" value={v} onChange={(e) => set2(i, e.target.value)} spellCheck={false} /></label>
        ))}
      </div>
      <button type="button" className="btn btn-primary mlz-go" onClick={go}>Check similarity</button>
      {err && <p className="mlz-err">{err}</p>}
      {out && (
        <div className="mlz-result mlz-answer">
          <strong className="mlz-verdict">{out.text}</strong>
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
        Two triangles are <strong>similar</strong> when they have the <strong>same shape</strong> but
        not always the same size. One is a scaled copy of the other, like a small photo and its
        enlargement.
      </p>
      <p className="mlz-p">When two triangles are similar, two things are always true:</p>
      <ul className="mlz-list">
        <li><strong>Corresponding angles are equal.</strong></li>
        <li><strong>Corresponding sides are proportional</strong> — they share one common ratio, called the <strong>scale factor</strong>.</li>
      </ul>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Naming matters</span>
        <p>If <code>△ABC ~ △DEF</code>, the order tells you the matches: <code>A</code> with <code>D</code>, <code>B</code> with <code>E</code>, <code>C</code> with <code>F</code>. So <code>AB/DE = BC/EF = AC/DF</code>.</p>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Three ways to know triangles are similar</h4>
        <ol className="mlz-method-steps">
          <li><strong>AA</strong> — two pairs of angles are equal.</li>
          <li><strong>SSS</strong> — all three pairs of sides are proportional.</li>
          <li><strong>SAS</strong> — two pairs of sides are proportional and the angle between them is equal.</li>
        </ol>
      </div>
      <div className="mlz-method">
        <h4 className="mlz-method-title">Finding a missing side</h4>
        <ol className="mlz-method-steps">
          <li>Find the scale factor from one pair of matching sides.</li>
          <li>Multiply the known side by the scale factor to get its match.</li>
        </ol>
        <p style={{ margin: '8px 0 0' }}>If <code>AB = 4</code> matches <code>DE = 8</code>, the scale factor is <code>8 ÷ 4 = 2</code>. Then a side of <code>5</code> matches <code>5 × 2 = 10</code>.</p>
      </div>
      <div className="mlz-example">
        <span className="mlz-ex-tag">Real life</span>
        <p>A 2 m person casts a 3 m shadow. At the same time a tree casts a 12 m shadow. The person and the tree make similar triangles with the sun, so <code>2/3 = h/12</code>, which gives a tree height of <strong>8 m</strong>.</p>
      </div>
    </>
  );
}

const FIND: GradedGroup = {
  title: 'Part A: find the missing side',
  instructions: 'Type your answer as a number. 1 point each.',
  questions: [
    { kind: 'typed', prompt: <><code>△ABC ~ △DEF</code>. <code>AB = 4</code> matches <code>DE = 8</code>, and <code>BC = 5</code>. Find <code>EF</code>.</>, accept: ['10'], correct: '10', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <><code>△ABC ~ △DEF</code>. <code>AB = 6</code> matches <code>DE = 9</code>, and <code>AC = 8</code>. Find <code>DF</code>.</>, accept: ['12'], correct: '12', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>Two triangles are similar with scale factor <code>3</code>. A side of the small triangle is <code>7</code>. Find its matching side in the large triangle.</>, accept: ['21'], correct: '21', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <><code>△PQR ~ △STU</code>. <code>PQ = 10</code> matches <code>ST = 4</code>, and <code>QR = 15</code>. Find <code>TU</code>.</>, accept: ['6'], correct: '6', points: 1, placeholder: 'a number' },
    { kind: 'typed', prompt: <>A triangle with sides <code>3, 4, 5</code> is enlarged so the shortest side becomes <code>9</code>. Find the new longest side.</>, accept: ['15'], correct: '15', points: 1, placeholder: 'a number' },
  ],
};

const SOLVE: GradedGroup = {
  title: 'Part B: solve the problem',
  instructions: 'Choose the correct answer. 2 points each.',
  questions: [
    {
      kind: 'choice',
      prompt: <>A 2 m tall person casts a 3 m shadow. At the same time, a tree casts a 12 m shadow. How tall is the tree?</>,
      options: ['6 m', '8 m', '18 m', '4 m', '9 m'],
      answer: 1, points: 2,
    },
    {
      kind: 'choice',
      prompt: <><code>△ABC ~ △XYZ</code> with a scale factor of <code>3</code>. If the perimeter of <code>△ABC</code> is <code>12</code>, what is the perimeter of <code>△XYZ</code>?</>,
      options: ['24', '36', '15', '4', '9'],
      answer: 1, points: 2,
    },
    {
      kind: 'choice',
      prompt: <>A photo <code>4</code> cm wide and <code>6</code> cm tall is enlarged, keeping the same shape, to <code>10</code> cm wide. How tall is the enlargement?</>,
      options: ['12 cm', '15 cm', '8 cm', '9 cm', '16 cm'],
      answer: 1, points: 2,
    },
  ],
};

const QUIZ: GradedGroup = {
  title: 'Part C: multiple choice',
  instructions: 'Ten questions, 1 point each.',
  quiz: true,
  questions: [
    { kind: 'choice', prompt: 'Two triangles are similar when their corresponding angles are equal and their corresponding sides are…', options: ['equal', 'proportional', 'perpendicular', 'added'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'The AA similarity postulate says two triangles are similar if…', options: ['all three sides are equal', 'two pairs of angles are equal', 'one side is equal', 'they have the same area'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'In △ABC ~ △DEF, which angle is equal to ∠A?', options: ['∠D', '∠E', '∠F', '∠B'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'In △ABC ~ △DEF, the ratio AB/DE is equal to…', options: ['BC/EF', 'AB/EF', 'DE/BC', 'EF/BC'], answer: 0, points: 1 },
    { kind: 'choice', prompt: 'A triangle is enlarged so every side is twice as long. The scale factor is…', options: ['1/2', '2', '4', '6'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'Similar triangles always have the same…', options: ['size', 'shape', 'area', 'perimeter'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'SSS similarity means two triangles are similar if…', options: ['all three sides are equal', 'all three pairs of sides are proportional', 'two angles are equal', 'they are both right triangles'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'SAS similarity needs two pairs of sides proportional and…', options: ['any angle equal', 'the included angle equal', 'a right angle', 'the perimeter equal'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'A triangle with sides 3, 4, 5 is similar to a triangle with sides 6, 8, and…', options: ['9', '10', '12', '7'], answer: 1, points: 1 },
    { kind: 'choice', prompt: 'If two triangles are congruent (exactly the same size), their scale factor is…', options: ['0', '1', '2', 'it depends'], answer: 1, points: 1 },
  ],
};

export default function TriangleLesson() {
  const content: LessonContent = {
    lessonId: 'triangle-similarity',
    video: { title: 'Similar triangles (introduction)', youtubeId: 'REPLACE_WITH_YOUR_VIDEO_ID', channel: 'Khan Academy' },
    discussion: <Discussion />,
    explore: (
      <>
        <ScaleTool />
        <SimilarTool />
      </>
    ),
    groups: [FIND, SOLVE, QUIZ],
    reflectionPrompt:
      'Describe one way you could use similar triangles to measure something too tall to reach, like a tree, a building, or a flagpole, using its shadow. What would you measure, and how would the proportion look?',
  };
  return <LessonShell content={content} />;
}

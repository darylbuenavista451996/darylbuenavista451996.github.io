'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { saveAttendanceAction, type ActionState } from '../actions';
import type { AttendanceClass, AttendanceStatus } from '@/lib/teacherData';

const STATUSES: AttendanceStatus[] = ['Present', 'Late', 'Absent'];
const SHORT: Record<AttendanceStatus, string> = { Present: 'P', Late: 'L', Absent: 'A' };

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save attendance'}
    </button>
  );
}

export default function AttendanceForm({ date, classes }: { date: string; classes: AttendanceClass[] }) {
  const [state, action] = useFormState<ActionState, FormData>(saveAttendanceAction, {});

  // Local marks keyed by student id, seeded from what's already saved.
  const initial: Record<string, AttendanceStatus | ''> = {};
  for (const c of classes) for (const s of c.students) initial[s.student_id] = s.status ?? '';
  const [marks, setMarks] = useState<Record<string, AttendanceStatus | ''>>(initial);

  const set = (id: string, status: AttendanceStatus) =>
    setMarks((m) => ({ ...m, [id]: m[id] === status ? '' : status }));
  const markAllPresent = (c: AttendanceClass) =>
    setMarks((m) => {
      const next = { ...m };
      for (const s of c.students) next[s.student_id] = 'Present';
      return next;
    });

  const count = (c: AttendanceClass, st: AttendanceStatus) =>
    c.students.filter((s) => marks[s.student_id] === st).length;

  return (
    <form action={action} className="att-form">
      <input type="hidden" name="date" value={date} />
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}

      {classes.map((c) => (
        <section className="att-class" key={c.cls}>
          <div className="att-class-head">
            <h2>{c.label} <span className="att-counts">{count(c, 'Present')} present · {count(c, 'Late')} late · {count(c, 'Absent')} absent</span></h2>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => markAllPresent(c)}>Mark all present</button>
          </div>
          {c.students.length === 0 ? (
            <p className="hint">No students in this class yet.</p>
          ) : (
            <ul className="att-list">
              {c.students.map((s) => (
                <li className="att-row" key={s.student_id}>
                  <span className="att-name">{s.name}</span>
                  <input type="hidden" name={`mark_${s.student_id}`} value={marks[s.student_id] ?? ''} />
                  <div className="att-seg" role="group" aria-label={`Attendance for ${s.name}`}>
                    {STATUSES.map((st) => (
                      <button
                        type="button"
                        key={st}
                        className={`att-btn att-${st.toLowerCase()}${marks[s.student_id] === st ? ' on' : ''}`}
                        aria-pressed={marks[s.student_id] === st}
                        onClick={() => set(s.student_id, st)}
                      >
                        <span className="att-btn-full">{st}</span>
                        <span className="att-btn-short">{SHORT[st]}</span>
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="att-actions">
        <SaveBtn />
        <a className="btn btn-ghost btn-sm" href="/teacher/attendance/export">Download attendance (CSV)</a>
      </div>
    </form>
  );
}

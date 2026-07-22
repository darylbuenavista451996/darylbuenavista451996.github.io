'use client';

import { useMemo, useState } from 'react';
import Avatar from '../../Avatar';
import ResetPasswordButton from './ResetPasswordButton';
import RemoveAvatarButton from './RemoveAvatarButton';
import RemoveStudentButton from './RemoveStudentButton';
import type { RosterEntry } from '@/lib/teacherData';

// Friendly class labels. Falls back to the raw code for anything unmapped.
const CLASS_LABELS: Record<string, string> = {
  G9: 'Grade 9 Media Arts',
  G10: 'Grade 10 Media Arts',
  M9: 'Grade 9 Mathematics',
};
function classLabel(cls: string): string {
  return CLASS_LABELS[cls] ?? cls;
}

// Show classes in a sensible order; unknown ones go last.
const CLASS_ORDER = ['G9', 'G10', 'M9'];
function classSort(a: string, b: string): number {
  const ia = CLASS_ORDER.indexOf(a);
  const ib = CLASS_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

export default function RosterTable({ roster }: { roster: RosterEntry[] }) {
  const classes = useMemo(
    () => Array.from(new Set(roster.map((s) => s.class))).sort(classSort),
    [roster]
  );
  // Default to the first class so students are never shown all mixed together.
  const [selected, setSelected] = useState<string>(classes[0] ?? 'all');

  const shown = useMemo(
    () => (selected === 'all' ? roster : roster.filter((s) => s.class === selected)),
    [roster, selected]
  );

  if (roster.length === 0) {
    return <p className="lede">No students yet. Add your first student above.</p>;
  }

  return (
    <>
      <div className="roster-filter">
        <label htmlFor="class-filter">Show class</label>
        <select
          id="class-filter"
          className="roster-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c} value={c}>
              {classLabel(c)} ({roster.filter((s) => s.class === c).length})
            </option>
          ))}
          <option value="all">All classes ({roster.length})</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Sign-in</th><th>Class</th><th>Progress</th><th>Account</th></tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.student_id}>
                <td>
                  <span className="roster-name">
                    <Avatar name={s.name} src={s.avatarUrl} size={64} />
                    {s.name}
                  </span>
                </td>
                <td>
                  {s.email ? (
                    <span className="signin-email">{s.email}</span>
                  ) : (
                    <span className="signin-num">#{s.student_number || '—'} <span className="muted-tag">class code</span></span>
                  )}
                </td>
                <td>{classLabel(s.class)}</td>
                <td>
                  <div className="mini-progress" aria-label={`${s.pct} percent`}>
                    <div className="mini-track"><div className="mini-fill" style={{ width: `${s.pct}%` }} /></div>
                    <span className="mini-lbl">{s.complete}/{s.total}</span>
                  </div>
                </td>
                <td>
                  <div className="roster-actions">
                    {s.email ? <ResetPasswordButton studentId={s.student_id} /> : null}
                    {s.hasPhoto ? <RemoveAvatarButton studentId={s.student_id} /> : null}
                    <RemoveStudentButton studentId={s.student_id} name={s.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

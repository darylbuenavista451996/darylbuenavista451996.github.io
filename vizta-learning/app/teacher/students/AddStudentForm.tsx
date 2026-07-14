'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addStudent, type ActionState } from '../actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Adding…' : 'Add student'}
    </button>
  );
}

export default function AddStudentForm() {
  const [state, action] = useFormState<ActionState, FormData>(addStudent, {});
  return (
    <form action={action} className="add-student">
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}
      <div className="add-row">
        <input name="name" type="text" placeholder="Full name" aria-label="Full name" required />
        <input name="student_number" type="text" placeholder="Student number" aria-label="Student number" required />
        <select name="class" aria-label="Class" defaultValue="G9">
          <option value="G9">Grade 9</option>
          <option value="G10">Grade 10</option>
        </select>
        <Btn />
      </div>
    </form>
  );
}

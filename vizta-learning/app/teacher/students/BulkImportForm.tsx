'use client';

import { useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { importStudents } from '../actions';
import type { ActionState } from '../actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Importing…' : 'Import roster'}
    </button>
  );
}

export default function BulkImportForm() {
  const [state, action] = useFormState<ActionState, FormData>(importStudents, {});
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ''));
    reader.readAsText(file);
  }

  return (
    <details className="bulk-import">
      <summary>Import many students from a CSV file</summary>
      <form action={action} className="bulk-form">
        {state.error ? <div className="error" role="alert">{state.error}</div> : null}
        {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}

        <p className="hint">
          One student per line: <code>name, student number, class</code>. Class is{' '}
          <code>G9</code> or <code>G10</code>. A header row is optional — for example:
        </p>
        <pre className="code-sample">name, number, class
Dela Cruz, Juan, G9
Santos, Maria, G10</pre>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={onFile}
          aria-label="Choose a CSV file"
        />
        <textarea
          name="csv"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="…or paste rows here"
          aria-label="CSV rows"
        />
        <Btn />
      </form>
    </details>
  );
}

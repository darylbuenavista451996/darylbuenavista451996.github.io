'use client';

import { useState } from 'react';

// A read-only code block with a Copy button, so students can copy each segment
// with one click instead of re-typing it.
export default function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers: select-all fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* give up quietly */
      }
      document.body.removeChild(ta);
    }
  }

  return (
    <div className="st-code">
      <div className="st-code-bar">
        <span className="st-code-file">{filename ?? 'code'}</span>
        <button type="button" className="st-copy" onClick={copy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

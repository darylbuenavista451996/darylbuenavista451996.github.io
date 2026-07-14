'use client';

// Small client button — triggers the browser's print/save-as-PDF dialog.
export default function PrintButton() {
  return (
    <button className="btn btn-primary no-print" type="button" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}

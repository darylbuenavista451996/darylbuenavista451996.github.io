// Small shared brand header. The mark is a CSS background: it shows /logo.png if
// present and falls back to the gradient silently (no broken-image icon) if not.
export default function Brand({ subtitle = 'Mathematics · Grade 9' }: { subtitle?: string }) {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">
        Vizta Learning
        <small>{subtitle}</small>
      </span>
    </div>
  );
}

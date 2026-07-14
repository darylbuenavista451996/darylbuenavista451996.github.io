// Small shared brand header. Pure presentational, safe in any component.
export default function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">
        Vizta Learning
        <small>Media Arts · Grade 9 &amp; 10</small>
      </span>
    </div>
  );
}

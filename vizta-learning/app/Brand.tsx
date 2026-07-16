/* eslint-disable @next/next/no-img-element */
// Small shared brand header. Uses /logo.png if present; the gradient background
// shows through if the logo file hasn't been added yet, so it never looks broken.
export default function Brand() {
  return (
    <div className="brand">
      <img className="brand-mark" src="/logo.png" alt="" aria-hidden="true" width={40} height={40} />
      <span className="brand-name">
        Vizta Learning
        <small>Media Arts · Grade 9 &amp; 10</small>
      </span>
    </div>
  );
}

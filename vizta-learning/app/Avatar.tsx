// Presentational avatar: the student's photo if we have a signed URL, otherwise
// their initials on a colored circle. Pure — works in server or client code.
import { initialsFor, colorFor } from '@/lib/avatar';

export default function Avatar({
  name,
  src,
  size = 40,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const dim = { width: size, height: size };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="avatar avatar-photo"
        src={src}
        alt={name}
        style={dim}
        width={size}
        height={size}
      />
    );
  }
  return (
    <span
      className="avatar avatar-initials"
      style={{ ...dim, background: colorFor(name), fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initialsFor(name)}
    </span>
  );
}

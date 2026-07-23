// Avatar display helpers — a photo when the student has one, otherwise their
// initials in a colored circle. Pure functions, safe on server or client.

// A small, brand-friendly set of background colors for the initials fallback.
// Deterministically chosen from the student's name/id so it's always the same.
const COLORS = ['#3EB489', '#1B2A4A', '#2E8B77', '#3A5A9B', '#E08A2B', '#7C5CBF', '#C0455B', '#2AA9A0'];

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export const AVATAR_BUCKET = 'avatars';
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024; // 4 MB
export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Class-code -> grade mapping.
//
// Golden rule: this mapping lives in data / an environment variable, NOT
// hard-coded, so the teacher can change codes each school year without a
// code change. Format of CLASS_CODES:  CODE:CLASS pairs, comma separated.
//   e.g.  MEDIA9:G9,MEDIA10:G10
// Codes are matched case-insensitively and trimmed.

export type ClassName = 'G9' | 'G10';

const DEFAULT = 'MEDIA9:G9,MEDIA10:G10';

export function classCodeMap(): Map<string, ClassName> {
  const raw = process.env.CLASS_CODES?.trim() || DEFAULT;
  const map = new Map<string, ClassName>();
  for (const pair of raw.split(',')) {
    const [code, cls] = pair.split(':').map((s) => s?.trim());
    if (!code || !cls) continue;
    if (cls !== 'G9' && cls !== 'G10') continue;
    map.set(code.toUpperCase(), cls);
  }
  return map;
}

// Returns the grade for a class code, or null if the code is not recognized.
export function gradeForCode(code: string): ClassName | null {
  return classCodeMap().get(code.trim().toUpperCase()) ?? null;
}

// The class code(s) that map to a given grade — used to prefill the login form
// from the landing page's grade choice.
export function codesForGrade(grade: ClassName): string[] {
  const out: string[] = [];
  for (const [code, cls] of classCodeMap()) if (cls === grade) out.push(code);
  return out;
}

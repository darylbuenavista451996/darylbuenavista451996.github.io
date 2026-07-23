// Mathematics reward-points download for the signed-in teacher: one row per
// recorded student result, with points, quiz score, and how many times the
// student left the page (integrity signal). Authenticated by the teacher session.
import { NextResponse } from 'next/server';
import { getTeacher } from '@/lib/teacherAuth';
import { getMathResults } from '@/lib/teacherData';
import { BASE_PATH } from '@/lib/basePath';

export const dynamic = 'force-dynamic';

const CLASS_LABELS: Record<string, string> = {
  G9: 'Grade 9 Media Arts',
  G10: 'Grade 10 Media Arts',
  M9: 'Grade 9 Mathematics',
};

function cell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const teacher = await getTeacher();
  if (!teacher) return new NextResponse(null, { status: 307, headers: { Location: `${BASE_PATH}/teacher/login` } });

  let csv: string;
  try {
    const rows = await getMathResults();
    const header = ['Name', 'Class', 'Lesson', 'Reward points', 'Quiz score (/10)', 'Times left page', 'Submitted'];
    const lines = [header.map(cell).join(',')];
    for (const r of rows) {
      lines.push(
        [
          cell(r.name),
          cell(CLASS_LABELS[r.class] ?? r.class),
          cell(r.lesson_id),
          cell(r.points),
          cell(r.quiz_score),
          cell(r.tab_switches),
          cell(new Date(r.submitted_at).toISOString().slice(0, 16).replace('T', ' ')),
        ].join(',')
      );
    }
    csv = lines.join('\n');
  } catch {
    return NextResponse.json({ error: 'Could not build the export.' }, { status: 500 });
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizta-math-points-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

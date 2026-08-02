// Side Task website submissions download for the signed-in teacher: one row per
// student, with their published link, grade, and note. Authenticated by session.
import { NextResponse } from 'next/server';
import { getTeacher } from '@/lib/teacherAuth';
import { getSideTaskSubmissions } from '@/lib/teacherData';
import { WEBSITE_TASK_ID } from '@/lib/sideTask';
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
    const rows = await getSideTaskSubmissions(WEBSITE_TASK_ID);
    const header = ['Name', 'Class', 'Website link', 'Grade', 'Note', 'Submitted'];
    const lines = [header.map(cell).join(',')];
    for (const r of rows) {
      lines.push(
        [
          cell(r.name),
          cell(CLASS_LABELS[r.class] ?? r.class),
          cell(r.url),
          cell(r.grade ?? ''),
          cell(r.feedback ?? ''),
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
      'Content-Disposition': `attachment; filename="vizta-website-task-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

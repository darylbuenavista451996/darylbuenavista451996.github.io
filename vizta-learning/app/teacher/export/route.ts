// One-click grade export for the signed-in teacher — no n8n, no VPS needed.
// Returns a CSV of all grades (including the DepEd competency codes) for the
// teacher to open in Excel or Google Sheets. Authenticated by the teacher's
// own session cookie, so it's just a normal download link in the panel.
import { NextResponse } from 'next/server';
import { getTeacher } from '@/lib/teacherAuth';
import { getGradeExport, toCsv } from '@/lib/exportData';
import { BASE_PATH } from '@/lib/basePath';

export const dynamic = 'force-dynamic';

export async function GET() {
  const teacher = await getTeacher();
  if (!teacher) {
    return new NextResponse(null, { status: 307, headers: { Location: `${BASE_PATH}/teacher/login` } });
  }
  let csv: string;
  try {
    csv = toCsv(await getGradeExport());
  } catch {
    return NextResponse.json({ error: 'Could not build the export.' }, { status: 500 });
  }
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizta-grades-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

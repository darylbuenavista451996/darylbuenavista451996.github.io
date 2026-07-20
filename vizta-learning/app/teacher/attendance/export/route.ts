// Attendance sheet download for the signed-in teacher: one row per student, one
// column per date (P/L/A), plus totals. Authenticated by the teacher session.
import { NextResponse } from 'next/server';
import { getTeacher } from '@/lib/teacherAuth';
import { getAttendanceSheet, attendanceToCsv } from '@/lib/exportData';
import { BASE_PATH } from '@/lib/basePath';

export const dynamic = 'force-dynamic';

export async function GET() {
  const teacher = await getTeacher();
  if (!teacher) return new NextResponse(null, { status: 307, headers: { Location: `${BASE_PATH}/teacher/login` } });
  let csv: string;
  try {
    csv = attendanceToCsv(await getAttendanceSheet());
  } catch {
    return NextResponse.json({ error: 'Could not build the attendance sheet.' }, { status: 500 });
  }
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizta-attendance-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

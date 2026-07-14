// Secured, read-only grade export for n8n.
//
//   GET /api/export/grades            -> JSON (default)
//   GET /api/export/grades?format=csv -> CSV
//
// Auth: send  Authorization: Bearer <EXPORT_API_TOKEN>
// This is the one place grades leave the app. It runs server-side with the
// service-role key; nothing here is reachable without the token. Includes the
// DepEd competency code (hidden from students, required for records).

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getGradeExport, toCsv } from '@/lib/exportData';

export const dynamic = 'force-dynamic';

function tokenOk(req: Request): boolean {
  const expected = process.env.EXPORT_API_TOKEN;
  if (!expected) return false; // not configured -> deny
  const header = req.headers.get('authorization') ?? '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  const provided = m?.[1] ?? req.headers.get('x-api-key') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!process.env.EXPORT_API_TOKEN) {
    return NextResponse.json(
      { error: 'Export is not configured. Set EXPORT_API_TOKEN.' },
      { status: 500 }
    );
  }
  if (!tokenOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rows;
  try {
    rows = await getGradeExport();
  } catch {
    return NextResponse.json({ error: 'Could not build the export.' }, { status: 500 });
  }

  const url = new URL(req.url);
  if (url.searchParams.get('format') === 'csv') {
    return new NextResponse(toCsv(rows), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vizta-grades.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

  return NextResponse.json(
    { generated_at: new Date().toISOString(), count: rows.length, rows },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

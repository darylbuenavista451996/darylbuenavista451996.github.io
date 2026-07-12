// Vizta Learning — Term 1 seed script
//
// Loads the provided seed files in loadable/ into Supabase.
// Safe to run more than once: every write is an upsert keyed on the primary
// key, so re-running never creates duplicates. Prints a per-table row count
// at the end so the teacher can confirm it worked.
//
// Usage:  npm run seed         (reads env from .env via --env-file)
// Needs:  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
//
// The service-role key bypasses RLS and must ONLY ever be used server-side,
// never shipped to the browser. This script runs on your machine, not in the app.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOADABLE = join(__dirname, '..', 'loadable');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '\n  Missing env. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n' +
      '  Copy .env.example to .env and fill both in, then run: npm run seed\n'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const readJson = (name) =>
  JSON.parse(readFileSync(join(LOADABLE, name), 'utf-8'));

// Load in FK order: modules -> activities -> quizzes.
// Students, submissions and quiz_results are runtime data, not seeded.
const plan = [
  { table: 'modules', file: 'modules.json', conflict: 'module_id' },
  { table: 'activities', file: 'activities.json', conflict: 'activity_id' },
  { table: 'quizzes', file: 'quizzes.json', conflict: 'quiz_id' },
];

async function upsert({ table, file, conflict }) {
  const rows = readJson(file);
  // Chunk to stay well within request limits; harmless for small Term 1 data.
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from(table)
      .upsert(slice, { onConflict: conflict });
    if (error) {
      console.error(`\n  Failed upserting into ${table}: ${error.message}\n`);
      process.exit(1);
    }
  }
  return rows.length;
}

async function count(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error(`  Could not count ${table}: ${error.message}`);
    return '?';
  }
  return count;
}

async function main() {
  console.log('\nSeeding Vizta Learning Term 1 content...\n');

  const attempted = {};
  for (const step of plan) {
    attempted[step.table] = await upsert(step);
    console.log(`  upserted ${String(attempted[step.table]).padStart(3)} rows -> ${step.table}`);
  }

  console.log('\nRow counts in Supabase after seeding:');
  console.log('  ---------------------------------------');
  for (const step of plan) {
    const c = await count(step.table);
    console.log(`  ${step.table.padEnd(12)} ${String(c).padStart(4)}`);
  }
  // Also show the runtime tables so the teacher sees the full five-table picture.
  for (const t of ['students', 'submissions', 'quiz_results']) {
    const c = await count(t);
    console.log(`  ${t.padEnd(12)} ${String(c).padStart(4)}  (runtime, not seeded)`);
  }
  console.log('  ---------------------------------------');
  console.log('\nDone. Re-running is safe — rows are upserted, never duplicated.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

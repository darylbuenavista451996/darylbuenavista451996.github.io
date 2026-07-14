import Link from 'next/link';
import TeacherNav from '../TeacherNav';
import GradeForm from './GradeForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getGradeQueue } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function GradePage({
  searchParams,
}: {
  searchParams: { all?: string };
}) {
  await requireTeacher();
  const includeGraded = searchParams.all === '1';
  const queue = await getGradeQueue(includeGraded);

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="grade" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Grade submissions</h1>
          <p className="lede">
            {includeGraded ? 'Showing all submissions. ' : 'Showing work awaiting a grade. '}
            <Link href={includeGraded ? '/teacher/grade' : '/teacher/grade?all=1'}>
              {includeGraded ? 'Show only ungraded' : 'Show all (including graded)'}
            </Link>
          </p>
        </div>

        {queue.length === 0 ? (
          <p className="lede">
            {includeGraded ? 'No submissions yet.' : 'Nothing to grade right now. Nice and clear.'}
          </p>
        ) : (
          <ul className="grade-list">
            {queue.map((item) => (
              <GradeForm key={`${item.student_id}|${item.activity_id}`} item={item} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

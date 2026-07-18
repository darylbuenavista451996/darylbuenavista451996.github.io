import Link from 'next/link';
import { notFound } from 'next/navigation';
import TeacherNav from '../../TeacherNav';
import LessonTextForm from '../LessonTextForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getActivityForEdit } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function EditLessonPage({ params }: { params: { activityId: string } }) {
  await requireTeacher();
  const activity = await getActivityForEdit(params.activityId);
  if (!activity) notFound();

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="content" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Edit lesson text</h1>
          <p className="lede">
            Changes here appear to students the next time they open the lesson.
            Leave a field blank to hide that section.
          </p>
          <Link className="muted-link" href="/teacher/content">← Back to all lessons</Link>
        </div>
        <LessonTextForm activity={activity} />
      </div>
    </main>
  );
}

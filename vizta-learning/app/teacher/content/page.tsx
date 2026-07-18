import TeacherNav from '../TeacherNav';
import VideoEditForm from './VideoEditForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getActivitiesBrief } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  await requireTeacher();
  const activities = await getActivitiesBrief();

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="content" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Content &amp; videos</h1>
          <p className="lede">
            Set or replace each lesson&apos;s video link — paste a YouTube link you
            have previewed and cleared — and use <em>Edit lesson text</em> to reword
            a lesson&apos;s goal, hook, activity brief or closing for your class.
          </p>
        </div>

        <div className="video-edit-list">
          {activities.map((a) => (
            <VideoEditForm
              key={a.activity_id}
              activityId={a.activity_id}
              title={a.title}
              videoUrl={a.video_url}
              videoTitle={a.video_title}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

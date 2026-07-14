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
            Lesson text comes from the seed files. Here you can confirm or replace
            each lesson&apos;s video link — the one thing that needs your eyes before
            students watch. Paste a YouTube link you have previewed and cleared.
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

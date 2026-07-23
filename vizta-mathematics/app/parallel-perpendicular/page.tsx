import LessonPage from '../_lesson/LessonPage';
import ParallelLesson from './ParallelLesson';

export const metadata = {
  title: 'Parallel & Perpendicular Lines',
};

export default function ParallelPerpendicularPage() {
  return (
    <LessonPage
      lessonId="parallel-perpendicular"
      kicker="Mathematics · Grade 9 · Coordinate Geometry"
      title="Parallel & Perpendicular Lines"
    >
      <ParallelLesson />
    </LessonPage>
  );
}

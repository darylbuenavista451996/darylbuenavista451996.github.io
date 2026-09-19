import LessonPage from '../_lesson/LessonPage';
import TriangleLesson from './TriangleLesson';

export const metadata = {
  title: 'Triangle Similarities',
};

export default function TriangleSimilarityPage() {
  return (
    <LessonPage
      lessonId="triangle-similarity"
      kicker="Mathematics · Grade 9 · Geometry"
      title="Triangle Similarities"
    >
      <TriangleLesson />
    </LessonPage>
  );
}

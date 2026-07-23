import LessonPage from '../_lesson/LessonPage';
import LinearLesson from './LinearLesson';

export const metadata = {
  title: 'Solving Problems with Linear Functions',
};

export default function LinearFunctionsPage() {
  return (
    <LessonPage
      lessonId="linear-functions"
      kicker="Mathematics · Grade 9 · Algebra"
      title="Solving Problems with Linear Functions"
    >
      <LinearLesson />
    </LessonPage>
  );
}

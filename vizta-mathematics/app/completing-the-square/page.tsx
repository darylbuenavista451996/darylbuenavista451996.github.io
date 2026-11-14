import LessonPage from '../_lesson/LessonPage';
import SquareLesson from './SquareLesson';

export const metadata = {
  title: 'Completing the Square',
};

export default function Page() {
  return (
    <LessonPage
      lessonId="completing-the-square"
      kicker="Mathematics · Grade 9 · Algebra"
      title="Completing the Square"
    >
      <SquareLesson />
    </LessonPage>
  );
}

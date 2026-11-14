import LessonPage from '../_lesson/LessonPage';
import FormulaLesson from './FormulaLesson';

export const metadata = {
  title: 'The Quadratic Formula',
};

export default function Page() {
  return (
    <LessonPage
      lessonId="quadratic-formula"
      kicker="Mathematics · Grade 9 · Algebra"
      title="The Quadratic Formula"
    >
      <FormulaLesson />
    </LessonPage>
  );
}

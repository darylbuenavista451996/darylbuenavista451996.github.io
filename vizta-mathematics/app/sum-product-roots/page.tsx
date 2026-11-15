import LessonPage from '../_lesson/LessonPage';
import RootsLesson from './RootsLesson';

export const metadata = {
  title: 'Sum and Product of Roots',
};

export default function Page() {
  return (
    <LessonPage
      lessonId="sum-product-roots"
      kicker="Mathematics · Grade 9 · Algebra"
      title="Sum and Product of Roots"
    >
      <RootsLesson />
    </LessonPage>
  );
}

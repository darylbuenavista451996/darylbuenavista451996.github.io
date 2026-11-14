import LessonPage from '../_lesson/LessonPage';
import DiscriminantLesson from './DiscriminantLesson';

export const metadata = {
  title: 'The Discriminant',
};

export default function Page() {
  return (
    <LessonPage
      lessonId="discriminant"
      kicker="Mathematics · Grade 9 · Algebra"
      title="The Discriminant"
    >
      <DiscriminantLesson />
    </LessonPage>
  );
}

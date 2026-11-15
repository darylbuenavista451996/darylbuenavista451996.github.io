// Teacher preview of a lesson with its answer key. Reached only through a signed,
// short-lived link from the teacher dashboard.
import Link from 'next/link';
import Brand from '../../Brand';
import { verifyPreviewToken } from '@/lib/previewToken';
import { LESSONS } from '@/lib/lessons';
import DiscriminantLesson from '../../discriminant/DiscriminantLesson';
import SquareLesson from '../../completing-the-square/SquareLesson';
import RootsLesson from '../../sum-product-roots/RootsLesson';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Teacher preview', robots: { index: false, follow: false } };

export default function PreviewPage({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { t?: string };
}) {
  const id = params.lessonId;
  const ok = verifyPreviewToken(searchParams.t, id);
  const meta = LESSONS.find((l) => l.id === id);
  const Comp =
    id === 'discriminant' ? DiscriminantLesson
    : id === 'completing-the-square' ? SquareLesson
    : id === 'sum-product-roots' ? RootsLesson
    : null;
  return (
    <main className="page">
      <div className="card mlz-card">
        <Brand subtitle="Mathematics · Teacher preview" />
        {!ok || !Comp || !meta ? (
          <div className="mlz-locked">
            <h2>This preview link is not valid or has expired.</h2>
            <p>Open it again from the Mathematics tab in your teacher dashboard.</p>
            <Link className="mlz-back" href="/">← Back</Link>
          </div>
        ) : (
          <>
            <h1 className="mlz-title">{meta.title}</h1>
            <Comp preview />
          </>
        )}
      </div>
    </main>
  );
}

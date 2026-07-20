import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import AvatarUploader from './AvatarUploader';
import { getSession } from '@/lib/session';
import { getAvatarPath, signedAvatarUrl } from '@/lib/avatarStore';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = getSession();
  if (!session) redirect('/login');

  const path = await getAvatarPath(session.sid);
  const currentSrc = await signedAvatarUrl(path);

  return (
    <main className="page">
      <div className="card">
        <div className="topbar">
          <Brand />
          <Link className="btn btn-ghost btn-sm" href="/dashboard">← My course</Link>
        </div>

        <div className="module-head">
          <span className="eyebrow">Your profile</span>
          <h1>Profile photo</h1>
          <p className="lede">
            Add a photo, {session.name}. It shows on your dashboard and to your
            teacher, and you can change or remove it any time.
          </p>
        </div>

        <AvatarUploader currentSrc={currentSrc} />
      </div>
    </main>
  );
}

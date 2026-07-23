'use client';

import { useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { uploadAvatar, removeMyAvatar, type AvatarState } from './actions';

function UploadBtn({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending || !hasFile}>
      {pending ? 'Uploading…' : 'Save photo'}
    </button>
  );
}

function RemoveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-ghost btn-sm" type="submit" disabled={pending}>
      {pending ? 'Removing…' : 'Remove photo'}
    </button>
  );
}

export default function AvatarUploader({ currentSrc }: { currentSrc: string | null }) {
  const [uploadState, uploadAction] = useFormState<AvatarState, FormData>(uploadAvatar, {});
  const [removeState, removeAction] = useFormState<AvatarState, FormData>(removeMyAvatar, {});
  const [preview, setPreview] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setHasFile(!!f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result ?? ''));
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  const shown = preview || currentSrc;

  return (
    <div className="avatar-editor">
      <div className="avatar-preview">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="avatar avatar-photo avatar-lg" src={shown} alt="Your photo" />
        ) : (
          <span className="avatar avatar-initials avatar-lg" aria-hidden="true">🙂</span>
        )}
      </div>

      {uploadState.error ? <div className="error" role="alert">{uploadState.error}</div> : null}
      {uploadState.ok ? <div className="banner banner-success" role="status">{uploadState.message}</div> : null}
      {removeState.error ? <div className="error" role="alert">{removeState.error}</div> : null}
      {removeState.ok ? <div className="banner banner-success" role="status">{removeState.message}</div> : null}

      <form action={uploadAction} className="avatar-form">
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          aria-label="Choose a photo"
        />
        <p className="hint">A JPG, PNG or WEBP under 4 MB. Use a photo you&apos;re happy for your class to see.</p>
        <UploadBtn hasFile={hasFile} />
      </form>

      {currentSrc ? (
        <form action={removeAction} className="avatar-remove">
          <RemoveBtn />
        </form>
      ) : null}
    </div>
  );
}

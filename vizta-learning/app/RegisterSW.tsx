'use client';

// Registers the service worker (see public/sw.js) after the app loads. Scope is
// the app's basePath so it controls every lesson and dashboard route. Failures
// are swallowed: a browser without service-worker support just runs online-only.
import { useEffect } from 'react';
import { BASE_PATH } from '@/lib/basePath';

export default function RegisterSW() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const swUrl = `${BASE_PATH}/sw.js`;
    navigator.serviceWorker.register(swUrl, { scope: `${BASE_PATH}/` }).catch(() => {
      /* offline support unavailable; app still works online */
    });
  }, []);
  return null;
}

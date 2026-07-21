import type { MetadataRoute } from 'next';
import { BASE_PATH } from '@/lib/basePath';

// Web app manifest so the math platform can be installed to a phone's home
// screen and launched like a native app. Paths carry BASE_PATH by hand: Next
// does not rewrite URLs inside the manifest body.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vizta Mathematics',
    short_name: 'Math',
    description: 'Self-paced Grade 9 Mathematics that works offline once opened.',
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f7f9fc',
    theme_color: '#1b2a4a',
    icons: [
      { src: `${BASE_PATH}/logo.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${BASE_PATH}/logo.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${BASE_PATH}/logo.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

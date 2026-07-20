/** @type {import('next').NextConfig} */

// Security response headers applied to every route. These are safe defaults for
// this app: it isn't meant to be embedded in other sites, it needs no camera or
// location access, and it should always be served over HTTPS in production.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

// The app is served one folder deep, at viztasystems.com/web-platforms/media-arts.
// Next prefixes routes, <Link>, router.push, and assets with this automatically;
// plain <a>/<form action>/absolute redirect URLs are prefixed by hand via
// NEXT_PUBLIC_BASE_PATH (see lib/basePath.ts).
const BASE_PATH = '/web-platforms/media-arts';

const nextConfig = {
  reactStrictMode: true,
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  // Allow profile photos (up to ~4 MB) to be sent to the upload server action.
  experimental: {
    serverActions: { bodySizeLimit: '5mb' },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Anyone landing on the old bare subdomain (learn.viztasystems.com/) is sent to
  // the new home. basePath:false so this matches the literal root, outside the
  // app's own /web-platforms/media-arts prefix (so it never loops).
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://viztasystems.com/web-platforms/media-arts',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */

// Security response headers applied to every route.
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

// This app is served at viztasystems.com/web-platforms/mathematics (its own
// clean path, separate from the Media Arts app). Next prefixes routes, <Link>,
// router.push, and assets with this automatically; plain <a>/<form action> and
// absolute redirect URLs are prefixed by hand via NEXT_PUBLIC_BASE_PATH.
const BASE_PATH = '/web-platforms/mathematics';

const nextConfig = {
  reactStrictMode: true,
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  experimental: {
    serverActions: {
      // Served through the reverse proxy on the main domain, so form submits
      // arrive with the browser's origin (viztasystems.com) while the forwarded
      // host is the math app's own domain. Trust these origins.
      allowedOrigins: [
        'viztasystems.com',
        'www.viztasystems.com',
        'mathematics.viztasystems.com',
      ],
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Anyone hitting the bare app domain (mathematics.viztasystems.com/) is sent
  // to the clean public URL. basePath:false so it matches the literal root only.
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://viztasystems.com/web-platforms/mathematics',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

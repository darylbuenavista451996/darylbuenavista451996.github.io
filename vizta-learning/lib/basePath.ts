// The path prefix the app is served under (see `basePath` in next.config.mjs),
// e.g. "/web-platforms/media-arts". Next.js automatically prefixes <Link>,
// router.push, redirect(), and imported assets. Use this constant only for the
// few places that build absolute URLs by hand: plain <a href>, <form action>,
// route-handler redirects, and Supabase redirect URLs.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

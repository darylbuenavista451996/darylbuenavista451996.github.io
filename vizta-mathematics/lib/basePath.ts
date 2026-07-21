// The app's base path, injected at build time from next.config.mjs. Used for the
// handful of URLs Next does not auto-prefix: plain <form action>, the service
// worker registration, and the manifest icon paths.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

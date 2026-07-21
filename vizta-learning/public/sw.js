/* Vizta Learning service worker.
 *
 * Goal: let students open the app and their lessons with no internet, after
 * they have loaded it once while online. Strategy is deliberately safe:
 *   - Pages (navigations): network-first. Online students always get fresh,
 *     correct content; offline they get the last version they saw, or a simple
 *     offline notice if they never loaded that page.
 *   - Static assets (JS, CSS, images): cache-first. Next.js gives these
 *     content-hashed names, so a cached copy is always valid.
 *   - Cross-origin requests (analytics, etc.) are left untouched.
 *
 * The cache is versioned; bump CACHE to force a clean refresh on all devices.
 */
const CACHE = 'vizta-cache-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  // Only handle our own origin. Analytics and other hosts pass straight through.
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }
  event.respondWith(cacheFirst(req));
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.status === 200) {
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response(offlinePage(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.status === 200 && (fresh.type === 'basic' || fresh.type === 'default')) {
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (e) {
    return cached || Response.error();
  }
}

function offlinePage() {
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Offline</title><style>' +
    'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
    'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f7f9fc;color:#1b2a4a;padding:24px}' +
    '.b{max-width:340px;text-align:center}h1{font-size:20px;margin:0 0 10px}p{color:#5b6577;line-height:1.6;margin:0}' +
    '</style></head><body><div class="b"><h1>You are offline</h1>' +
    '<p>This page has not been saved to your phone yet. Connect to the internet once to open it, then it will work offline afterwards.</p>' +
    '</div></body></html>'
  );
}

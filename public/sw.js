// CageMind AI — Service Worker
// Manual implementation using native Cache API (no Workbox, no build tool required)
// Compatible with Next.js 16 Turbopack

const CACHE_VERSION = "v1";
const STATIC_CACHE = `cagemind-static-${CACHE_VERSION}`;
const PAGES_CACHE = `cagemind-pages-${CACHE_VERSION}`;

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// ─── Install: pre-cache static assets ───────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: clean up old caches ──────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: smart caching strategies ────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and API requests (always network for API)
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  // Static assets (_next/static): Cache First — these are content-hashed, safe to cache forever
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/favicon")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages / images: Network First — try network, fall back to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Offline fallback for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});

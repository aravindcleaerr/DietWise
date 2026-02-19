// DietWise Service Worker - Offline Support
const CACHE_NAME = "dietwise-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/food-log",
  "/add",
  "/progress",
  "/profile",
  "/meal-plan",
  "/exercise",
  "/onboarding",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install: pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip Next.js API routes and data requests
  if (event.request.url.includes("/_next/data/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // For navigation requests, return cached index
          if (event.request.mode === "navigate") {
            return caches.match("/dashboard");
          }

          return new Response("Offline", { status: 503 });
        });
      })
  );
});

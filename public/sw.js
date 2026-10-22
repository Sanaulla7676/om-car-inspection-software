const CACHE_NAME = "omcar-inspection-v4";
const APP_SHELL = ["/","/manifest.webmanifest","/icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const pathname = new URL(request.url).pathname;
  if (request.method !== "GET" || pathname.startsWith("/api/") || pathname === "/software" || pathname === "/login" || pathname === "/admin" || pathname.endsWith("omcar-inspection.html") || pathname.toLowerCase().includes("software%20of%20omcar%20inspection.html") || pathname.toLowerCase().includes("software of omcar inspection.html")) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match("/")))
  );
});

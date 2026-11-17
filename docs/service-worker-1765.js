const CACHE_NAME = "pocket-mappori-runtime-1765-v2";
const RUNTIME_MARK = "pocket-mappori-runtime";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("pocket-mappori-runtime-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const cacheable =
    (request.destination === "script" || request.destination === "style") &&
    (url.href.includes(RUNTIME_MARK) ||
      (url.origin === location.origin && url.pathname.includes("/assets/")));
  if (!cacheable) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok || response.type === "opaque") {
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    }),
  );
});

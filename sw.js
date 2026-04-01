const CACHE = "paroliere-v2";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(["./","index.html","app.js"])
    )
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE)
            .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("words.txt")) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

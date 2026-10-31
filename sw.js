// لا حاجة لتغيير أي رقم نسخة: الصفحة تقارن محتوى الملفات المخزّنة بما على الخادم
// وتعرض «يتوفر إصدار جديد — تحديث الآن» تلقائياً عند اختلافها.
const CACHE = "asanid-cache";
const CORE = ["./", "index.html", "manifest.json", "qr.html", "qr-lib.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(CORE.map(u =>
        fetch(u, { cache: "reload" }).then(r => r.ok && c.put(u, r)).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  // طلبات التحقق من التحديث والإعلانات تذهب للشبكة مباشرة
  if (r.cache === "no-store" || r.cache === "reload") return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => hit ||
      fetch(r).then(x => {
        if (x.ok) { const y = x.clone(); caches.open(CACHE).then(c => c.put(r, y)); }
        return x;
      }).catch(() => r.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
});

// غيّر رقم الإصدار عند كل رفع جديد ليظهر تنبيه التحديث
const VERSION="1.0.0";
const CACHE="musnad-"+VERSION;
const FILES=["./","index.html","data.js","manifest.json","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.pathname.endsWith("announcements.json")||u.pathname.endsWith("version.json")){e.respondWith(fetch(e.request,{cache:"no-store"}).catch(()=>caches.match(e.request)));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

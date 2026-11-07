// Lưu sẵn app để mở nhanh và học được khi mất mạng (chấm AI vẫn cần mạng).
// Sửa app xong thì tăng số phiên bản này để điện thoại tải bản mới.
const V = "lo-ielts-v9";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png",
  ...["01","02","03","04","05","06","07","08","09","10"].map(n => `img/${n}.svg`)];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // gọi API thì để đi thẳng
  if (u.pathname.endsWith(".mp3")) return; // âm thanh tải thẳng: Chrome Android hay kẹt khi file mp3 đi qua service worker
  // Trang chính: lấy bản mới trước, mất mạng thì dùng bản đã lưu. Hình, giọng: dùng bản lưu trước.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); }
    return r;
  })));
});

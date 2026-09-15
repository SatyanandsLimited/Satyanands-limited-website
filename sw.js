const CACHE='satyanands-v1';
const ASSETS=['./','./index.html','./product.js','./manifest.json','./logo.png','./raksha-thread.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));

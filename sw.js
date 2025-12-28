const CACHE_NAME = 'AwQaty-v6';
const ASSETS = [
  './',
  './index.html',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) 
  );
});

self.addEventListener('activate', (e) => {
  const currentCaches = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
        
        if (response) return response;

        return fetch(e.request)
          .then((networkResponse) => {
            return networkResponse;
          })
          .catch(() => {
            
            return caches.match('./offline.html');
          });
      })
  );
});

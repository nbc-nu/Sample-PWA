const CACHE_NAME = 'pwa-download-v2';


const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('all files sucessfuly saved in cache.');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing... ', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});


self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

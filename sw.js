const CACHE_NAME = 'pwa-download-v2';

// Lista contendo apenas os 3 arquivos de texto estruturais do seu projeto
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação do Service Worker e armazenamento inicial do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PWA: Arquivos essenciais salvos no cache.');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões antigas de cache
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

// Interceptação obrigatória de rede para liberar a instalação do PWA
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

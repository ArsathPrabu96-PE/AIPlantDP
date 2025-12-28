const CACHE_NAME = 'plant-disease-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/js.js',
    '/manifest.json'
    // Note: Model files are large, cache selectively or not at all for offline
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
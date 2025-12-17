const CACHE_NAME = 'loldle-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './champions.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Use Stale-While-Revalidate for DDragon images to allow caching them dynamically if we wanted,
  // but for now simple Cache-First for local assets and Network-Only (or Network-First) for external images.
  // Actually, standard PWA practice: cache first for core, network for others.
  
  if (event.request.url.includes('ddragon')) {
      // Optional: Runtime caching for images could be added here
      event.respondWith(fetch(event.request));
      return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

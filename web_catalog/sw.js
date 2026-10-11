/* ===================================================================
   World of Accessories - PWA Service Worker (v1.0.1)
   High-performance offline caching & instant asset delivery
   =================================================================== */

const CACHE_NAME = 'woa-pwa-v1.0.1';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/manifest.json',
    '/manifest_en.json',
    '/favicon.ico',
    '/favicon-32.png',
    '/favicon-16.png',
    '/static/css/catalog.css',
    '/static/css/cart.css',
    '/static/js/catalog.js',
    '/static/js/cart.js',
    '/static/js/supabase_sync.js',
    '/styles/fonts.css',
    '/Branding/logo.png',
    '/Branding/logo-80.png',
    '/Branding/logo-150.png',
    '/Branding/icon-192.png',
    '/Branding/icon-512.png',
    '/Branding/icon-maskable-512.png',
    '/data/banners.json',
    '/data/categories_data.json'
];

// 1. Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[PWA SW] Precache partial error (non-fatal):', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event - Clean old caches & claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event - Intelligent caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Only process GET requests from same origin (or CDN fonts)
    if (request.method !== 'GET') return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // A. Page Navigations: Network-first, fallback to cached HTML
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const copy = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkRes;
                })
                .catch(async () => {
                    const cachedRes = await caches.match(request);
                    if (cachedRes) return cachedRes;
                    return caches.match('/index.html');
                })
        );
        return;
    }

    // B. Product Data JSON: Stale-While-Revalidate
    if (url.pathname.includes('/data/products.json') || url.pathname.includes('/data/banners.json')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedRes = await cache.match(request);
                const fetchPromise = fetch(request)
                    .then((networkRes) => {
                        if (networkRes && networkRes.status === 200) {
                            cache.put(request, networkRes.clone());
                        }
                        return networkRes;
                    })
                    .catch(() => cachedRes);

                return cachedRes || fetchPromise;
            })
        );
        return;
    }

    // C. Static Assets (CSS, JS, Fonts, Images): Cache-First, fallback to Network
    event.respondWith(
        caches.match(request).then((cachedRes) => {
            if (cachedRes) return cachedRes;

            return fetch(request).then((networkRes) => {
                if (!networkRes || networkRes.status !== 200 || networkRes.type !== 'basic') {
                    return networkRes;
                }
                const copy = networkRes.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                return networkRes;
            }).catch(() => {
                return null;
            });
        })
    );
});

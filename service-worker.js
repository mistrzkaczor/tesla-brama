importScripts("./config.js");

const CACHE_NAME =
    `tesla-gate-v${CONFIG.VERSION.replace(/\./g, "-")}`;

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./config.js",
    "./style.css",
    "./app.js",
    "./img/favicon.svg",
    "./img/gate-open.svg",
    "./img/gate-close.svg",
    "./img/icon-192.png",
    "./img/icon-512.png"
];

/* Instalacja */

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
    );

    self.skipWaiting();
});

/* Aktywacja */

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

/* Obsługa żądań */

self.addEventListener("fetch", (event) => {

    const url = event.request.url;

    /* Nie cachujemy SUPLA */

    if (
        url.includes("/read?") ||
        url.includes("/open") ||
        url.includes("/close")
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return (
                    cachedResponse ||
                    fetch(event.request)
                );
            })
    );
});

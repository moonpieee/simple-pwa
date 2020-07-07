const app = "Demo App";
const assets = [
    "./",
    "./index.html",
    "./index.css",
    "./js/app.js",
    "./assets/icon.png",
    "./assets/icon.svg",
    "./assets/RupeekLogo.svg"
]

// service worker install event
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(app).then((cacheStore) => {
        cacheStore.addAll(assets)
    }));
});


self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})
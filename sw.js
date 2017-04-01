
importScripts('serviceworker-cache-polyfill.js');

var CACHE_NAME = 'my-site-cache-v4';
var urlsToCache = [
  '/angular.min.js',
  '/angular-aria.min.js',
  '/angular-messages.min.js',
  '/angular-material.min.js',
  '/script.js',
  '/angular-material.min.css',
  '/roboto.css',
  '/material-icon.css',
  '/style.css',
  '/img/bg.jpg'
];



self.addEventListener('install', function(event) {
  // Perform install steps
  console.log("called install");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        
        return cache.addAll(urlsToCache);
      })
  );
  var cacheWhitelist = ['my-site-cache-v4'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();
            if(event.request.url != "https://checkpf.github.io/"){
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          }
        );
      })
    );
});


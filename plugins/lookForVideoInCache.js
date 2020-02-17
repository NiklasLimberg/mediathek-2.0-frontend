workbox.routing.registerRoute(
    /.*\.mp4/,
    new workbox.strategies.CacheFirst({
      cacheName: 'video',
      plugins: [
        new workbox.cacheableResponse.Plugin({statuses: [200]}),
        new workbox.rangeRequests.Plugin(),
      ],
    })
);
// Este archivo contiene la configuración de limpieza para el service worker de PWA
// Este script permite limpiar el caché antiguo y obsoleto

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Eliminar caches antiguos que ya no sean necesarios
          return cacheName.startsWith('contador-elecciones-') && 
                 !cacheName.endsWith('-' + self.serviceWorkerVersion);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

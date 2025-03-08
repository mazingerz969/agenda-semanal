/* eslint-disable no-restricted-globals */
// Este archivo está intencionalmente vacío para evitar errores durante el despliegue
// El Service Worker real se implementará en una versión futura

self.__WB_MANIFEST = self.__WB_MANIFEST || [];

// Evento de instalación vacío
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Evento de activación vacío
self.addEventListener('activate', () => {
  self.clients.claim();
});

// Evento de fetch que simplemente pasa las solicitudes a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
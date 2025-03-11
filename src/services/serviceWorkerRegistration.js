// Este archivo se encargará de registrar el Service Worker

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
          
          // Verificar actualizaciones
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // En este punto, el Service Worker actualizado ha sido instalado
                  console.log('Nuevo contenido disponible; por favor, actualice la página.');
                } else {
                  // En este punto, todo ha sido precacheado
                  console.log('El contenido está cacheado para uso offline.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Error durante el registro del Service Worker:', error);
        });
        
      // Registrar para sincronización en segundo plano
      navigator.serviceWorker.ready
        .then(registration => {
          // Verificar si la sincronización en segundo plano está disponible
          if ('sync' in registration) {
            // Registrar una tarea de sincronización
            document.addEventListener('online', () => {
              registration.sync.register('sync-tasks');
            });
          }
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
} 
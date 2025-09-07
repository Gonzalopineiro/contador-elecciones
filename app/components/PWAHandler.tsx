import React, { useEffect } from 'react';

// Componente para gestionar el registro de PWA y actualizaciones
export default function PWAHandler() {
  useEffect(() => {
    // Función para manejar las actualizaciones del Service Worker
    const handleServiceWorkerUpdate = () => {
      if (
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator && 
        window.workbox !== undefined
      ) {
        const wb = window.workbox;
        
        // Agregar eventos de workbox
        wb.addEventListener('waiting', () => {
          // Mostrar una notificación de actualización disponible
          if (confirm('¡Nueva actualización disponible! ¿Deseas actualizar ahora?')) {
            wb.messageSkipWaiting();
          }
        });

        // Recargar la página cuando el contenido se ha actualizado
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

        // Registrar el service worker
        wb.register();
      }
    };

    handleServiceWorkerUpdate();
  }, []);

  return null; // Este componente no renderiza nada
}

// Necesitas agregar esto en tu archivo index.d.ts
declare global {
  interface Window {
    workbox: any;
  }
}

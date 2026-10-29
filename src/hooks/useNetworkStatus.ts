import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true); // Por defecto asumir online para no bloquear el inicio

  useEffect(() => {
    const checkActualConnection = async () => {
      try {
        // Hacer una petición ultra rápida a un recurso público para comprobar internet real
        const response = await fetch('https://microlink.io', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        setIsOnline(true);
      } catch (error) {
        // Solo si la petición falla de verdad se asume que no hay internet
        setIsOnline(navigator.onLine);
      }
    };

    // Verificar al montar el componente y cada vez que el navegador reporte cambios
    checkActualConnection();
    window.addEventListener('online', checkActualConnection);
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', checkActualConnection);
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  return isOnline;
}

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true); // Por defecto asumir online para no bloquear el inicio

  useEffect(() => {
    const checkActualConnection = async () => {
      // Si el navegador ya indica que está online, mantener online inmediatamente
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        setIsOnline(true);
        return;
      }

      // Verificación de respaldo ultra rápida por si navigator.onLine da un falso negativo
      try {
        await fetch('https://microlink.io', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        setIsOnline(true);
      } catch {
        setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : false);
      }
    };

    checkActualConnection();
    window.addEventListener('online', checkActualConnection);
    window.addEventListener('offline', () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOnline(false);
      }
    });

    return () => {
      window.removeEventListener('online', checkActualConnection);
      window.removeEventListener('offline', checkActualConnection);
    };
  }, []);

  return isOnline;
}

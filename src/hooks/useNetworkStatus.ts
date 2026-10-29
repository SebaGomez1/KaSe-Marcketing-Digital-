import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useNetworkStatus
 * 
 * Strict Internet Connectivity Monitor.
 * Combines browser events (navigator.onLine) with real heartbeat pings to /api/health
 * so dead WiFi / captive portals / airplane mode are detected accurately.
 */
export function useNetworkStatus(pingIntervalMs: number = 10000) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Cache buster to avoid cached 200 responses
      const res = await fetch(`/api/health?_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        setIsOnline(true);
        setIsChecking(false);
        return true;
      } else {
        setIsOnline(false);
        setIsChecking(false);
        return false;
      }
    } catch {
      setIsOnline(false);
      setIsChecking(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnlineEvent = () => {
      // Browser reports online; immediately verify with server heartbeat
      checkConnectivity();
    };

    const handleOfflineEvent = () => {
      setIsOnline(false);
    };

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkConnectivity();
      }
    };

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check
    checkConnectivity();

    // Heartbeat interval
    const intervalId = setInterval(() => {
      checkConnectivity();
    }, pingIntervalMs);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
      if (pingTimeoutRef.current) clearTimeout(pingTimeoutRef.current);
    };
  }, [checkConnectivity, pingIntervalMs]);

  return { isOnline, isChecking, checkConnectivity };
}

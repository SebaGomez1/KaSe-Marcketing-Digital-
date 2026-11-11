import { useState, useEffect } from 'react';

/**
 * Formats a creation ISO timestamp into an exact, human-readable relative time string.
 * Examples:
 * - "Creada hace 15 segundos (a las 14:32h)"
 * - "Creada hace 3 minutos, 12 segundos (a las 14:32h)"
 * - "Creada hoy a las 14:32h (hace 2 h)"
 * - "Creada ayer a las 14:32h"
 * - "Creada el 24/10/2026 a las 14:32h"
 */
export function formatRelativeCreationTime(isoString?: string): string {
  if (!isoString) return 'Creada recientemente';
  const createdDate = new Date(isoString);
  if (isNaN(createdDate.getTime())) return 'Creada recientemente';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - createdDate.getTime());

  const hours = createdDate.getHours().toString().padStart(2, '0');
  const minutes = createdDate.getMinutes().toString().padStart(2, '0');
  const exactTimeStr = `${hours}:${minutes}h`;

  const isToday =
    createdDate.getDate() === now.getDate() &&
    createdDate.getMonth() === now.getMonth() &&
    createdDate.getFullYear() === now.getFullYear();

  const isYesterday =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString() ===
    createdDate.toDateString();

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);

  if (diffSec < 60) {
    return `Creada hace ${Math.max(1, diffSec)} s (a las ${exactTimeStr})`;
  } else if (diffMin < 60) {
    const secRemain = diffSec % 60;
    return `Creada hace ${diffMin} min, ${secRemain} s (a las ${exactTimeStr})`;
  } else if (isToday) {
    return `Creada hoy a las ${exactTimeStr} (hace ${diffHrs} h)`;
  } else if (isYesterday) {
    return `Creada ayer a las ${exactTimeStr}`;
  } else {
    const day = createdDate.getDate().toString().padStart(2, '0');
    const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
    const year = createdDate.getFullYear();
    return `Creada el ${day}/${month}/${year} a las ${exactTimeStr}`;
  }
}

/**
 * React hook that yields a live relative time string, automatically ticking every second
 * so live pre-flight ignition counters stay accurate on-screen.
 */
export function useLiveRelativeTime(isoString?: string, intervalMs: number = 1000): string {
  const [formatted, setFormatted] = useState<string>(() => formatRelativeCreationTime(isoString));

  useEffect(() => {
    setFormatted(formatRelativeCreationTime(isoString));
    if (!isoString) return;

    const timer = setInterval(() => {
      setFormatted(formatRelativeCreationTime(isoString));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isoString, intervalMs]);

  return formatted;
}

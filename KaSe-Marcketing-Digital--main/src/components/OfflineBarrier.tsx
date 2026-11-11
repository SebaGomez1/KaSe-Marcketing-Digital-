import React from 'react';
import { WifiOff, RefreshCw, ShieldAlert, Lock, Bot, Activity } from 'lucide-react';

interface OfflineBarrierProps {
  onRetry: () => void;
  isChecking?: boolean;
}

export const OfflineBarrier: React.FC<OfflineBarrierProps> = ({ onRetry, isChecking = false }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-lg w-full bg-neutral-900 border-2 border-rose-600/70 rounded-2xl shadow-2xl shadow-rose-950/70 p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Offline Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-5 shadow-inner">
          <WifiOff className="w-8 h-8 animate-pulse text-rose-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Acceso Restringido · Sin Conexión</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Conexión a Internet Requerida
        </h2>
        
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
          <strong className="text-rose-400">KaSe Marketing Digital</strong> y su <strong className="text-emerald-400">Agente de Inteligencia Artificial</strong> funcionan <span className="underline decoration-rose-500 font-bold text-white">ÚNICAMENTE con conexión activa a internet</span>.
        </p>

        {/* Bullet points explaining why offline usage is strictly forbidden */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 text-left space-y-3 mb-6 text-xs text-neutral-300">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-medium">Inicio de Sesión Bloqueado</strong>
              No es posible iniciar sesión sin internet. La autenticación y las credenciales se validan exclusivamente en tiempo real con el servidor seguro.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Bot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-medium">Agente de IA KaSi Pausado</strong>
              El agente de IA no genera respuestas simuladas ni heurísticas fuera de línea; requiere comunicación directa con los modelos de IA en la nube.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-medium">8 Motores y Enlace Puente en Vivo</strong>
              El enrutamiento atómico (<code className="text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">/r/:id</code>), telemetría y métricas de conversiones no admiten almacenamiento ficticio offline.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onRetry}
          disabled={isChecking}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Verificando conexión con el servidor...' : 'Reintentar Conexión Ahora'}</span>
        </button>

        <p className="text-[11px] text-neutral-400 mt-3">
          Por favor verifica tu conexión Wi-Fi, datos móviles o cable de red para reanudar el servicio.
        </p>
      </div>
    </div>
  );
};

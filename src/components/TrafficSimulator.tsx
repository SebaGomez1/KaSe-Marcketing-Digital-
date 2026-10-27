import React, { useState } from 'react';
import { 
  Play, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { Campaign } from '../types/growth';

interface TrafficSimulatorProps {
  campaign: Campaign;
  onSimulateBurst: (count: number) => void;
  isSimulating?: boolean;
}

export const TrafficSimulator: React.FC<TrafficSimulatorProps> = ({
  campaign,
  onSimulateBurst,
  isSimulating = false,
}) => {
  const { currentRegistrations, targetRegistrations, status } = campaign;
  const isQuotaReached = status === 'paused_quota_reached' || currentRegistrations >= targetRegistrations;
  const remaining = Math.max(0, targetRegistrations - currentRegistrations);
  const percent = Math.min(100, Math.round((currentRegistrations / targetRegistrations) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Simulador de Tráfico y Protocolo de Auto-Pausa
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Herramienta de pruebas de backend para validar en tiempo real cómo KaSe detiene de manera estricta y autónoma sus 8 motores al alcanzar la cuota contratada.
          </p>
        </div>
      </div>

      {/* Target Progress Card */}
      <div className="bg-[#161616] border border-neutral-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-neutral-400">ESTADO DEL CIRCUITO DE CONTROL</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              {currentRegistrations.toLocaleString()} <span className="text-neutral-500 font-light">/</span> {targetRegistrations.toLocaleString()} {campaign.targetUnitLabel || 'Registros'}
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold ${
                isQuotaReached
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isQuotaReached ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              {isQuotaReached ? 'PAUSA INTELIGENTE EJECUTADA' : 'MOTORES EN EJECUCIÓN'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-500 ${
                isQuotaReached ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 font-mono">
            <span>Progreso: {percent}%</span>
            <span>{remaining > 0 ? `Restantes para la pausa: ${remaining.toLocaleString()} ${campaign.targetUnitLabel || 'unidades'}` : '0 restantes (Meta lograda)'}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-neutral-300 mb-3">
            Inyectar Tráfico de Prueba para Verificar la Lógica:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onSimulateBurst(1)}
              disabled={isSimulating || isQuotaReached}
              className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-sky-400" />
              <span>+1 {campaign.campaignType === 'plan_sales' ? 'Venta' : 'Conversión'}</span>
            </button>

            <button
              onClick={() => onSimulateBurst(25)}
              disabled={isSimulating || isQuotaReached}
              className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>+25 Ráfaga</span>
            </button>

            <button
              onClick={() => onSimulateBurst(100)}
              disabled={isSimulating || isQuotaReached}
              className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>+100 Ráfaga</span>
            </button>

            <button
              onClick={() => onSimulateBurst(remaining || 1)}
              disabled={isSimulating || isQuotaReached}
              className="py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-medium text-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>🎯 Disparar Auto-Pausa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Logic Inspector */}
      <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Algoritmo de Control Activo en Servidor (KaSe Backend)</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">Evaluación Síncrona en cada POST</span>
        </div>

        <div className="bg-black border border-neutral-800 rounded-lg p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
          <pre>{`// Monitoreo constante por cada campaña activa mediante Webhook/Píxel
if (campana.registrosActuales >= campana.metaContratada) {
    // 1. Pausa atómica de los 8 módulos y workers BullMQ en segundo plano
    ejecutarPausaGeneral(campana.id);
    
    // 2. Registro de auditoría y notificación al cliente
    enviarNotificacionCliente(
        campana.usuarioId, 
        "Tu campaña ha alcanzado el objetivo con éxito. Motores pausados."
    );
}`}</pre>
        </div>

        {/* Live Status evaluation readout */}
        <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 text-xs flex items-center justify-between">
          <span className="text-neutral-400">
            Condición actual:{' '}
            <code className="text-neutral-200">
              ({currentRegistrations} &gt;= {targetRegistrations})
            </code>
          </span>
          <span className={`font-mono font-semibold ${isQuotaReached ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isQuotaReached ? '→ VERDADERO (MOTORES DETENIDOS)' : '→ FALSO (MOTORES TRABAJANDO)'}
          </span>
        </div>
      </div>
    </div>
  );
};

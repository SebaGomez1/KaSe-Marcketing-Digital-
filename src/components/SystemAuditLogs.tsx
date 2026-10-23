import React, { useState } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, Info, AlertTriangle, Filter, Search } from 'lucide-react';
import { Campaign, CampaignLog } from '../types/growth';

interface SystemAuditLogsProps {
  campaign: Campaign;
}

export const SystemAuditLogs: React.FC<SystemAuditLogsProps> = ({ campaign }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = campaign.logs.filter((log) => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.message.toLowerCase().includes(term) ||
        log.module.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getLevelBadge = (level: CampaignLog['level']) => {
    switch (level) {
      case 'ALERT':
        return (
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
            ALERT
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
            SUCCESS
          </span>
        );
      case 'WARNING':
        return (
          <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-1.5 py-0.5 rounded">
            WARN
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.5 rounded">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Bitácora de Auditoría del Motor
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Registro cronológico inmutable de eventos del controlador autónomo, llamadas de Webhook, disparos de Píxel y órdenes de auto-pausa.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-md">
            {['all', 'SUCCESS', 'ALERT', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">HORA (UTC)</th>
                <th className="py-3 px-4 font-semibold">NIVEL</th>
                <th className="py-3 px-4 font-semibold">MÓDULO / ORIGEN</th>
                <th className="py-3 px-4 font-semibold">MENSAJE DEL SISTEMA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500">
                    No se encontraron registros que coincidan con el filtro.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-neutral-900/40 transition-colors ${
                      log.level === 'ALERT' ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-semibold whitespace-nowrap">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-sans leading-relaxed">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

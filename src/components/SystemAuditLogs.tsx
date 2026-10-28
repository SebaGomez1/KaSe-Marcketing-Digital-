import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Filter, 
  Search, 
  RefreshCw, 
  Route, 
  CreditCard, 
  UserPlus, 
  Globe 
} from 'lucide-react';
import { Campaign, CampaignLog, User, isUserSuperAdmin } from '../types/growth';

interface SystemAuditLogsProps {
  campaign?: Campaign | null;
  allCampaigns?: Campaign[];
  currentUser?: User | null;
}

export const SystemAuditLogs: React.FC<SystemAuditLogsProps> = ({ campaign, allCampaigns = [], currentUser = null }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [serverLogs, setServerLogs] = useState<CampaignLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchServerLogs = async () => {
    setIsLoading(true);
    try {
      const adminEmail = currentUser?.email || '';
      const [resLogs, resSync] = await Promise.allSettled([
        fetch(`/api/system_audit_logs?email=${encodeURIComponent(adminEmail)}`, {
          headers: { 'x-admin-email': adminEmail },
        }),
        campaign?.id ? fetch(`/api/campaigns/${encodeURIComponent(campaign.id)}/sync-logs?limit=100`) : Promise.resolve(null),
      ]);

      const loadedLogs: CampaignLog[] = [];

      if (resLogs.status === 'fulfilled' && resLogs.value && resLogs.value.ok) {
        const data = await resLogs.value.json();
        if (Array.isArray(data.system_audit_logs)) {
          loadedLogs.push(...data.system_audit_logs);
        }
      }

      if (resSync.status === 'fulfilled' && resSync.value && resSync.value.ok) {
        const data = await resSync.value.json();
        if (Array.isArray(data.syncLogs)) {
          const mappedSyncLogs: CampaignLog[] = data.syncLogs.map((s: any) => ({
            id: s.id,
            timestamp: s.timestamp,
            level: s.status === 'error' ? 'ALERT' : 'SUCCESS',
            module: `8_MOTORES_${(s.engineId || 'SYNC').toUpperCase()}`,
            message: `[${(s.triggerType || 'cron_15m').toUpperCase()} - ${s.engineName}]: ${s.actionExecuted} (${s.latencyMs}ms)`,
            origen_motor: s.engineId,
            plataforma_atraccion: s.triggerType,
            fecha_acceso: s.timestamp,
          }));
          loadedLogs.push(...mappedSyncLogs);
        }
      }

      setServerLogs(loadedLogs);
    } catch (e) {
      console.warn('[Bitácora] Error al cargar logs globales:', e);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchServerLogs();
  }, [campaign?.id]);

  // Combine campaign logs with server-side bridge logs without duplicates
  const allLogsMap = new Map<string, CampaignLog>();

  // Add campaign specific logs if available
  if (campaign?.logs) {
    campaign.logs.forEach((l) => allLogsMap.set(l.id, l));
  }

  // Also collect logs from other campaigns if available for super admin view
  allCampaigns.forEach((c) => {
    if (c.logs) {
      c.logs.forEach((l) => allLogsMap.set(l.id, l));
    }
  });

  // Add global server bridge logs
  serverLogs.forEach((l) => {
    if (!allLogsMap.has(l.id)) {
      allLogsMap.set(l.id, l);
    }
  });

  const mergedLogs = Array.from(allLogsMap.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredLogs = mergedLogs.filter((log) => {
    const text = (log.message + ' ' + log.module).toLowerCase();

    if (filterLevel === 'PUENTES') {
      if (!text.includes('puente') && !text.includes('/r/')) return false;
    } else if (filterLevel === 'CRON_15M') {
      if (!text.includes('cron') && !text.includes('15m') && !text.includes('motores') && !text.includes('sync') && !text.includes('sincroniz') && !text.includes('activacion_inicial')) return false;
    } else if (filterLevel === 'HERO') {
      if (!text.includes('hero')) return false;
    } else if (filterLevel === 'REGISTROS') {
      if (!text.includes('registro') && !text.includes('registrado') && !text.includes('usuario')) return false;
    } else if (filterLevel === 'PAGOS') {
      if (!text.includes('pago') && !text.includes('mercadopago') && !text.includes('cobro')) return false;
    } else if (filterLevel !== 'all' && log.level !== filterLevel) {
      return false;
    }


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

  const getModuleCategoryBadge = (moduleName: string, message: string) => {
    const lower = (moduleName + ' ' + message).toLowerCase();
    if (lower.includes('hero')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-1.5 py-0.5 rounded">
          <Globe className="w-2.5 h-2.5" />
          <span>PUENTE HERO</span>
        </span>
      );
    }
    if (lower.includes('registro') || lower.includes('registrado')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-300 bg-purple-950/40 border border-purple-800/50 px-1.5 py-0.5 rounded">
          <UserPlus className="w-2.5 h-2.5" />
          <span>PUENTE REGISTRO</span>
        </span>
      );
    }
    if (lower.includes('pago') || lower.includes('mercadopago') || lower.includes('cobro')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.5 rounded">
          <CreditCard className="w-2.5 h-2.5" />
          <span>PUENTE PAGO</span>
        </span>
      );
    }
    if (lower.includes('puente') || lower.includes('/r/')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-300 bg-teal-950/40 border border-teal-800/50 px-1.5 py-0.5 rounded">
          <Route className="w-2.5 h-2.5" />
          <span>ENRUTADOR PUENTE</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
        {moduleName}
      </span>
    );
  };

  const getSearchEngineBadge = (engine?: string) => {
    const eng = (engine || 'no_motor').toLowerCase();
    if (eng.includes('google')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-400 bg-sky-950/40 border border-sky-800/60 px-1.5 py-0.5 rounded">
          <Search className="w-2.5 h-2.5" />
          <span>Google</span>
        </span>
      );
    }
    if (eng.includes('bing')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-teal-400 bg-teal-950/40 border border-teal-800/60 px-1.5 py-0.5 rounded">
          <Search className="w-2.5 h-2.5" />
          <span>Bing</span>
        </span>
      );
    }
    if (eng.includes('yahoo')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-800/60 px-1.5 py-0.5 rounded">
          <Search className="w-2.5 h-2.5" />
          <span>Yahoo</span>
        </span>
      );
    }
    if (eng.includes('duckduckgo')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5 rounded">
          <Search className="w-2.5 h-2.5" />
          <span>DuckDuckGo</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
        <span>{engine || 'no_motor'}</span>
      </span>
    );
  };

  const getPlatformBadge = (platform?: string) => {
    const plat = (platform || 'organico_directo').toLowerCase();
    if (plat.includes('facebook')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-800/60 px-1.5 py-0.5 rounded">
          <span>Facebook</span>
        </span>
      );
    }
    if (plat.includes('instagram')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-pink-400 bg-pink-950/40 border border-pink-800/60 px-1.5 py-0.5 rounded">
          <span>Instagram</span>
        </span>
      );
    }
    if (plat.includes('twitter') || plat.includes('x.com')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-neutral-200 bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded">
          <span>X / Twitter</span>
        </span>
      );
    }
    if (plat.includes('linkedin')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-1.5 py-0.5 rounded">
          <span>LinkedIn</span>
        </span>
      );
    }
    if (plat.includes('tiktok')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-800/60 px-1.5 py-0.5 rounded">
          <span>TikTok</span>
        </span>
      );
    }
    if (plat.includes('youtube')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-800/60 px-1.5 py-0.5 rounded">
          <span>YouTube</span>
        </span>
      );
    }
    if (plat.includes('utm_')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.5 rounded max-w-[140px] truncate" title={platform}>
          <span>{platform}</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded max-w-[140px] truncate" title={platform}>
        {platform || 'organico_directo'}
      </span>
    );
  };

  if (!isUserSuperAdmin(currentUser)) {
    return (
      <div className="p-8 text-center bg-[#161616] border border-neutral-800 rounded-2xl max-w-xl mx-auto my-12 space-y-3">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Acceso Restringido</h3>
        <p className="text-xs text-neutral-400">
          La bitácora de auditoría y tráfico es de acceso exclusivo para la cuenta del Administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Bitácora de Tráfico y Enrutadores Puente
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              HTTP 307 + Clics Orgánicos Reales
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Registro cronológico inmutable de todo el tráfico orgánico real. Captura automática de <strong>origen_motor</strong> (Google, Bing), <strong>plataforma_atraccion</strong> (Facebook, Instagram, UTMs) y <strong>fecha_acceso</strong> exacta sin simulaciones ni bots.
          </p>
        </div>

        {/* Filter & Refresh controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchServerLogs}
            disabled={isLoading}
            className="p-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Recargar bitácora en vivo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en bitácora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-md overflow-x-auto">
            {[
              { id: 'all', label: 'TODOS' },
              { id: 'CRON_15M', label: 'CRON 15M (8 MOTORES)' },
              { id: 'PUENTES', label: 'PUENTES' },
              { id: 'HERO', label: 'HERO' },
              { id: 'REGISTROS', label: 'REGISTROS' },
              { id: 'PAGOS', label: 'PAGOS' },
              { id: 'SUCCESS', label: 'ÉXITO' },
              { id: 'ALERT', label: 'ALERTAS' },
            ].map((f) => (

              <button
                key={f.id}
                onClick={() => setFilterLevel(f.id)}
                className={`px-2 py-1 text-[10px] font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  filterLevel === f.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Dedicated Bridge Info Banner */}
      {campaign && (
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-bold flex items-center gap-2">
                <span>Enrutador Puente Independiente de esta Campaña:</span>
                <span className="font-mono text-emerald-400">/r/{campaign.id}</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Destino final: <code className="text-neutral-300 font-mono">{campaign.targetUrl}</code> · Redirección HTTP 307 atómica.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <span className="text-neutral-400">Clics interceptados: <strong className="text-white">{campaign.clicksCount || 0}</strong></span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400">Registros: <strong className="text-emerald-400">{campaign.currentRegistrations} / {campaign.targetRegistrations}</strong></span>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-[#161616] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">FECHA ACCESO</th>
                <th className="py-3 px-4 font-semibold">ORIGEN MOTOR</th>
                <th className="py-3 px-4 font-semibold">PLATAFORMA ATRACCIÓN</th>
                <th className="py-3 px-4 font-semibold">NIVEL</th>
                <th className="py-3 px-4 font-semibold">CANAL / ENRUTADOR</th>
                <th className="py-3 px-4 font-semibold">REGISTRO DE EVENTO EN BITÁCORA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-500">
                    <div className="space-y-1">
                      <Route className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                      <p className="text-neutral-400 font-medium">No hay eventos en la bitácora que coincidan con el filtro.</p>
                      <p className="text-[11px] text-neutral-500">Todo el tráfico real de enlaces puente (/r/:id), visitas a Hero y registros se registra automáticamente aquí.</p>
                    </div>
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
                      {new Date(log.fecha_acceso || log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                      <span className="block text-[9px] text-neutral-600 font-mono">
                        {new Date(log.fecha_acceso || log.timestamp).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSearchEngineBadge(log.origen_motor)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getPlatformBadge(log.plataforma_atraccion)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getModuleCategoryBadge(log.module, log.message)}
                    </td>
                    <td className="py-3 px-4 text-neutral-200 font-sans leading-relaxed">
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

import React, { useState } from 'react';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialización ultra-segura tolerante a variables de entorno ausentes en el cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Solo creamos la instancia si las variables existen para evitar congelar la pantalla
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface AuditLog {
  id: string;
  campaign_id: string;
  timestamp: string;
  level: string;
  module: string;
  message: string;
  publication_url?: string;
}


import { 
  FolderKanban, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Globe2, 
  Zap, 
  ArrowRight, 
  Plus, 
  Activity, 
  Clock, 
  Lock,
  Code2,
  DollarSign,
  Users,
  Copy
} from 'lucide-react';
import { Campaign, User, isUserSuperAdmin } from '../types/growth';
import { useLiveRelativeTime } from '../utils/timeFormat';
import { getBridgeUrl, BRIDGE_ROUTE_CONFIGS } from '../lib/bridgeRouter';


const CampaignLiveTime: React.FC<{ createdAt?: string }> = ({ createdAt }) => {
  const liveTime = useLiveRelativeTime(createdAt, 1000);
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
      <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
      <span>{liveTime}</span>
    </span>
  );
};

interface ActiveCampaignsSectionProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onOpenNewCampaign: () => void;
  onToggleStatus?: (campaign: Campaign) => void;
  onGoToDashboard: (campaignId: string) => void;
  currentUser: User | null;
}

export const ActiveCampaignsSection: React.FC<ActiveCampaignsSectionProps> = ({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onOpenNewCampaign,
  onToggleStatus,
  onGoToDashboard,
  currentUser,
}) => {
  // Expanded campaign IDs set
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [activeCampaignId || (campaigns[0]?.id || '')]: true,
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [copiedBridgeId, setCopiedBridgeId] = useState<string | null>(null);
    const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'motores' | 'publicaciones'>('motores');
  const [logsLoading, setLogsLoading] = useState(false);

    useEffect(() => {
    // Seguridad estricta: Si no hay ID activo, tomamos el ID de la primera campaña del array de forma correcta
    const currentId = activeCampaignId || (campaigns && campaigns.length > 0 ? campaigns[0].id : null);
    if (!currentId || !supabase) return;


    const fetchLogs = async () => {
      setLogsLoading(true);
      const { data, error } = await supabase
        .from('system_audit_logs')
        .select('*')
        .eq('campaign_id', currentId)
        .order('timestamp', { ascending: false });
      if (!error && data) setLogs(data);
      setLogsLoading(false);
    };
    fetchLogs();

    const channel = supabase
      .channel(`realtime-campaign-logs-${currentId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_audit_logs', filter: `campaign_id=eq.${currentId}` }, 
        (payload) => { setLogs((prev) => [payload.new as AuditLog, ...prev]); }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeCampaignId, campaigns]);

  const publicacionesLinks = logs ? logs.filter(log => log.publication_url || (log.message && log.message.includes('http'))) : [];




  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isSuperAdmin = isUserSuperAdmin(currentUser);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    if (filterType === 'active') return camp.status === 'active';
    if (filterType === 'paused') return camp.status === 'paused_manual' || camp.status === 'paused_quota_reached';
    if (filterType === 'configuring') return camp.status === 'configuring';
    return true;
  });

  const totalActive = campaigns.filter((c) => c.status === 'active').length;
  const totalGoal = campaigns.reduce((acc, c) => acc + (c.targetRegistrations || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.currentRegistrations || 0), 0);
  const overallPercent = totalGoal > 0 ? Math.min(100, Math.round((totalDelivered / totalGoal) * 100)) : 0;

  return (
    <div className="space-y-8 py-2">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black border border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Gestión Centralizada y Permanente</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campañas Activas & Historial Seguro
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Todas las campañas creadas quedan guardadas permanentemente en tu cuenta sin riesgo de borrado. Despliega cualquier campaña para monitorear en tiempo real el progreso de registros, el estado de los 8 motores y la segmentación.
            </p>
          </div>

          {/* Quick Global Stats Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/60 border border-neutral-800 shrink-0 min-w-[300px]">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                {totalActive}
              </div>
              <div className="text-[10px] text-neutral-400 uppercase font-mono mt-0.5">Activas</div>
            </div>
            <div className="text-center border-x border-neutral-800">
              <div className="text-lg sm:text-xl font-bold font-mono text-white">
                {totalDelivered.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-400 uppercase font-mono mt-0.5">Entregados</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold font-mono text-sky-400">
                {overallPercent}%
              </div>
              <div className="text-[10px] text-neutral-400 uppercase font-mono mt-0.5">Avance Global</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todas ({campaigns.length})
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🟢 Activas ({campaigns.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterType('paused')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'paused'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⏸️ Pausadas ({campaigns.filter((c) => c.status === 'paused_manual' || c.status === 'paused_quota_reached').length})
          </button>
        </div>

        {/* Action: Create New Campaign */}
        <button
          onClick={() => onOpenNewCampaign()}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Campaña</span>
        </button>
      </div>

      {/* 3. Accordion List of Campaigns */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4 p-6">
            <FolderKanban className="w-12 h-12 text-emerald-500/50 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No hay campañas registradas actualmente</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Todas las campañas simuladas han sido eliminadas. Tu cuenta cuenta con blindaje de persistencia indestructible: cada nueva campaña que crees quedará guardada de forma permanente y nunca más desaparecerá.
              </p>
            </div>
            <button
              onClick={() => onOpenNewCampaign()}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-black inline-flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi primera campaña ahora</span>
            </button>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const isExpanded = !!expandedIds[camp.id];
            const isSelected = camp.id === activeCampaignId;
            const progress = Math.min(100, Math.round((camp.currentRegistrations / camp.targetRegistrations) * 100));
            const remaining = Math.max(0, camp.targetRegistrations - camp.currentRegistrations);
            const activeModsCount = Object.values(camp.modules).filter((m) => m.active).length;

            return (
              <div
                key={camp.id}
                className={`rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-neutral-900/90 border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                    : 'bg-[#141414] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header Row (Always visible, click to toggle accordion) */}
                <div
                  onClick={() => toggleExpand(camp.id)}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  {/* Left: Identity & Badges */}
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-neutral-500">
                        ID: {camp.id}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          SELECCIONADA
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                          camp.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : camp.status === 'paused_quota_reached'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : camp.status === 'paused_manual'
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {camp.status === 'active'
                          ? '🟢 Activa'
                          : camp.status === 'paused_quota_reached'
                          ? '🏁 Meta Cumplida'
                          : camp.status === 'paused_manual'
                          ? '⏸️ Pausada'
                          : '⚙️ Configuración'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                        {camp.plan ? `Plan ${camp.plan.toUpperCase()}` : 'Plan Estándar'}
                      </span>
                      <CampaignLiveTime createdAt={camp.createdAt} />
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-700" title="Fecha y hora de publicación en el cluster">
                        <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Publicada:</span>
                        <strong className="text-white">
                          {new Date(camp.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </strong>
                        <strong className="text-emerald-400">
                          {new Date(camp.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
                        </strong>
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{camp.name}</span>
                    </h2>

                    <div className="text-xs text-neutral-400 flex items-center gap-2">
                      <span className="truncate max-w-[280px]">{camp.targetUrl}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-500">{camp.niche}</span>
                    </div>
                  </div>

                  {/* Middle: Progress Meter & Counter */}
                  <div className="flex-1 max-w-sm space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-mono">
                        <strong className="text-white font-bold">{camp.currentRegistrations.toLocaleString()}</strong> / {camp.targetRegistrations.toLocaleString()} {camp.targetUnitLabel || 'unidades'}
                      </span>
                      <span className="font-mono font-bold text-emerald-400">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          camp.status === 'paused_quota_reached'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                      <span>{activeModsCount} de 8 Motores activos</span>
                      <span>{remaining > 0 ? `Faltan ${remaining.toLocaleString()}` : 'Completada'}</span>
                    </div>
                  </div>

                  {/* Right: Expand / Collapse Toggle + Quick Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCampaign(camp.id);
                        onGoToDashboard(camp.id);
                      }}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Abrir en Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-800/80 space-y-6 animate-in fade-in duration-200">
                    {/* Grid with 3 cards: Modules, Targeting & Integration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Card 1: 8 Módulos Autónomos */}
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-white border-b border-neutral-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-400" />
                            <span>8 Motores de Captación</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">{activeModsCount}/8 Activos</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {Object.entries(camp.modules || {}).map(([key, mod]) => (
                            <div key={key} className="flex items-center justify-between text-[11px]">
                              <span className={mod?.active ? 'text-neutral-300' : 'text-neutral-500'}>
                                {(mod?.name || key).split(':')[0]}
                              </span>
                              <span
                                className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                  mod.active
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-neutral-900 text-neutral-600'
                                }`}
                              >
                                {mod.active ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card 2: Segmentación Geográfica & Calibración */}
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-white border-b border-neutral-800 pb-2">
                          <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-cyan-400" />
                            <span>Segmentación Geográfica & Precios</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {camp.geoTargeting?.city || 'Global'}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-neutral-300">
                          <div>
                            <span className="text-neutral-500 text-[11px] block">Ciudad / Región:</span>
                            <span className="font-semibold text-white">
                              {camp.geoTargeting?.city || 'Global (Sin frontera)'} - {camp.geoTargeting?.region || 'Multiregión'}
                            </span>
                          </div>

                          <div>
                            <span className="text-neutral-500 text-[11px] block">Expansión Concéntrica:</span>
                            <span className="font-mono text-[11px] text-emerald-400">
                              {camp.geoTargeting?.autoExpandProximity ? `Sí (Radio ${camp.geoTargeting.radiusKm} km)` : 'Población estricta'}
                            </span>
                          </div>

                          {camp.minPlanPrice !== undefined && camp.maxPlanPrice !== undefined && (
                            <div>
                              <span className="text-neutral-500 text-[11px] block">Filtrado Económico (High-Ticket):</span>
                              <span className="font-mono text-[11px] text-white">
                                Planes de ${camp.minPlanPrice} a ${camp.maxPlanPrice} {camp.currency || 'USD'}
                              </span>
                            </div>
                          )}

                          <div>
                            <span className="text-neutral-500 text-[11px] block">Facturación / Pasarela:</span>
                            <span className="font-mono text-[11px] text-sky-400">
                              {camp.billing?.monthlyAmount ? `$${camp.billing.monthlyAmount} USD/mes (Mercado Pago UY)` : 'Tarifa Administrador ($0.00)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Enrutador Puente & Seguridad */}
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-white border-b border-neutral-800 pb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Enrutador Puente Autónomo</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Zero-Install Activo
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-neutral-300">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-neutral-500 text-[11px] font-medium flex items-center gap-1.5">
                                <span>{BRIDGE_ROUTE_CONFIGS[camp.campaignType || 'user_registrations']?.label || 'Enlace Puente Aislado'}:</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-mono">
                                  {BRIDGE_ROUTE_CONFIGS[camp.campaignType || 'user_registrations']?.badge || '/r/:id'}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ka-se-marcketing-digital.vercel.app';
                                  const bridgeUrl = getBridgeUrl(camp.id, camp.campaignType, origin);
                                  navigator.clipboard.writeText(bridgeUrl);
                                  setCopiedBridgeId(camp.id);
                                  setTimeout(() => setCopiedBridgeId(null), 2000);
                                }}
                                className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 px-2 py-0.5 rounded transition-all"
                                title={`Copiar enlace puente exclusivo (${camp.campaignType}) para ${camp.id}`}
                              >
                                {copiedBridgeId === camp.id ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>¡Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copiar Enlace</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <code className="font-mono text-[11px] text-emerald-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 block truncate select-all">
                              {getBridgeUrl(camp.id, camp.campaignType)}
                            </code>
                          </div>


                          <div>
                            <span className="text-neutral-500 text-[11px] block">Tráfico Interceptado (Clics al Puente):</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                                {(camp.clicksCount || 0).toLocaleString()} clics orgánicos
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                (Tráfico separado de {camp.targetUnitLabel || 'conversiones contratadas'})
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-neutral-500 text-[11px] block">Momento de Ignición & Fecha Exacta:</span>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <CampaignLiveTime createdAt={camp.createdAt} />
                              <span className="font-mono text-[11px] text-neutral-400">
                                {new Date(camp.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-neutral-500 text-[11px] block">Apagado Autónomo:</span>
                            <span className="text-[11px] text-emerald-400 font-semibold">
                              ✓ Se apaga de forma exacta en el registro #{camp.targetRegistrations.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                      <div className="text-xs text-neutral-400">
                        Estado operativo: <strong className="text-white">{camp.status === 'active' ? 'Motores operando en segundo plano 24/7' : 'En pausa preventiva'}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {onToggleStatus && (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(camp)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-neutral-600 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            {camp.status === 'active' ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-amber-400" />
                                <span>Pausar Motores</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Reanudar Motores</span>
                              </>
                            )}
                          </button>
                        )}
  {/* Panel Integrado en Tiempo Real (system_audit_logs) */}
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 my-4">
    <div className="flex border-b border-neutral-800 pb-2 gap-4">
      <button
        type="button"
        onClick={() => setActiveTab('motores')}
        className={`pb-2 text-xs font-bold uppercase transition-colors ${activeTab === 'motores' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'}`}
      >
        ⚙️ Actividad de Motores (En Vivo)
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('publicaciones')}
        className={`pb-2 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${activeTab === 'publicaciones' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'}`}
      >
        🔗 Enlaces Verificables
        {publicacionesLinks && publicacionesLinks.length > 0 && (
          <span className="bg-emerald-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
            {publicacionesLinks.length}
          </span>
        )}
      </button>
    </div>

    {activeTab === 'motores' && (
      <div className="space-y-3">
        {logsLoading ? (
          <div className="text-xs text-neutral-500 font-mono py-4">Sincronizando con Supabase...</div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-xs text-neutral-500 font-mono py-4">Esperando acciones en tiempo real de los motores...</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {logs.map((log) => {
              const isCalentamiento = log.message?.toLowerCase().includes('calentamiento') || log.message?.toLowerCase().includes('jitter');
              return (
                <div key={log.id} className="p-3 bg-black/40 border border-neutral-800 rounded-lg">
                  <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">{log.module || 'MOTOR'}</span>
                    <span>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                  {isCalentamiento ? (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 mt-1">
                      <p className="font-bold">⚠️ Modo Calentamiento y Anti-Bloqueo Activo</p>
                      <p className="mt-1 opacity-90">{log.message}. Evita bloqueos de spam automatizados en las redes sociales imitando intervalos de comportamiento humano.</p>
                    </div>
                  ) : (
                    <p className="text-neutral-300 mt-1 text-xs font-mono bg-black/40 p-2 rounded border border-neutral-800">{log.message}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

    {activeTab === 'publicaciones' && (
      <div className="space-y-3">
        {!publicacionesLinks || publicacionesLinks.length === 0 ? (
          <div className="text-xs text-amber-400 font-mono p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
            Fase de calentamiento activa. Los enlaces verificables aparecerán aquí automáticamente en tiempo real en cuanto los motores completen los primeros posteos.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {publicacionesLinks.map((pub) => {
              const matchedUrl = pub.message ? pub.message.match(/https?:\/\/[^\s]+/) : null;
              const finalUrl = pub.publication_url || (matchedUrl ? matchedUrl : '#');
              return (
                <div key={pub.id} className="p-3 bg-black/50 border border-emerald-950 rounded-lg flex justify-between items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">Publicación Confirmada</span>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{pub.message}</p>
                  </div>
                  {finalUrl !== '#' && (
                    <a
                      href={finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded font-bold text-[10px] shrink-0 uppercase transition-colors"
                    >
                      Verificar Link
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}
  </div>


                        
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCampaign(camp.id);
                            onGoToDashboard(camp.id);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Gestionar Campaña Completa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

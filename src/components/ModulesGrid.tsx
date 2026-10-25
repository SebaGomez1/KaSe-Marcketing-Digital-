import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Share2, 
  FolderPlus, 
  MessageSquare, 
  Mail, 
  Video, 
  FileText, 
  Users2,
  Lock,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Flame,
  ExternalLink
} from 'lucide-react';
import { Campaign, ModuleDefinition, GROWTH_MODULES_CATALOG } from '../types/growth';
import { ModuleConversionBreakdown } from './ModuleConversionBreakdown';

interface ModulesGridProps {
  campaign?: Campaign | null;
  onSelectModule: (moduleDef: ModuleDefinition) => void;
  onOpenNewCampaign?: () => void;
  onOpenPlans?: () => void;
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({
  campaign,
  onSelectModule,
  onOpenNewCampaign,
  onOpenPlans,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'base' | 'growth' | 'enterprise'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'mod1_seo':
        return <Search className="w-4 h-4" />;
      case 'mod2_social':
        return <Share2 className="w-4 h-4" />;
      case 'mod3_directories':
        return <FolderPlus className="w-4 h-4" />;
      case 'mod4_outbound':
        return <MessageSquare className="w-4 h-4" />;
      case 'mod5_newsletter':
        return <Mail className="w-4 h-4" />;
      case 'mod6_video':
        return <Video className="w-4 h-4" />;
      case 'mod7_pseo':
        return <FileText className="w-4 h-4" />;
      case 'mod8_influencers':
        return <Users2 className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const isModuleSupportedByPlan = (mod: ModuleDefinition) => {
    if (!campaign) return true;
    if (mod.requiredPlan === 'starter') return true;
    if (mod.requiredPlan === 'growth') return campaign.plan === 'growth' || campaign.plan === 'enterprise';
    return campaign.plan === 'enterprise';
  };

  const filteredModules = GROWTH_MODULES_CATALOG.filter((mod) => {
    // Filter by tier category
    if (activeFilter === 'base' && mod.category !== 'base') return false;
    if (activeFilter === 'growth' && mod.requiredPlan !== 'growth') return false;
    if (activeFilter === 'enterprise' && mod.requiredPlan !== 'enterprise') return false;

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mod.title.toLowerCase().includes(q);
      const matchSubtitle = mod.subtitle.toLowerCase().includes(q);
      const matchPurpose = mod.purpose.toLowerCase().includes(q);
      const matchHow = mod.howItWorks.toLowerCase().includes(q);
      const matchNumber = mod.number.toString().includes(q);
      return matchTitle || matchSubtitle || matchPurpose || matchHow || matchNumber;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header Hero section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Arquitectura Central: 8 Motores Autónomos Integrados</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ecosistema de Captación y Crecimiento KaSe
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Aquí puedes conocer qué hace cada uno de los <strong>8 módulos integrados en la aplicación</strong> y su significado exacto. Cada motor ejecuta una tarea especializada de captación (SEO en Google, redes sociales, foros de alta intención, videos y alianzas) sin requerir instalación de código, y todo el tráfico es canalizado automáticamente a través de tu <strong>Enlace Puente Inteligente</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {campaign ? (
              <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-700 space-y-1 text-xs">
                <div className="text-neutral-400 font-mono text-[11px]">Campaña Activa:</div>
                <div className="text-white font-bold truncate max-w-[200px]">{campaign.name}</div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{Object.values(campaign.modules).filter((m) => m.active).length} / 8 Operando</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1 text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Acceso Global para Todos</span>
                </div>
                <div className="text-neutral-300 text-[11px]">
                  Haz clic en cualquier módulo para ver su detalle y probar la generación en vivo con Inteligencia Artificial.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Badges + Search Input */}
        <div className="pt-4 border-t border-neutral-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Todos los Módulos (8)
            </button>
            <button
              onClick={() => setActiveFilter('base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'base'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Base: Indexación & Redes (1, 2, 3)
            </button>
            <button
              onClick={() => setActiveFilter('growth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'growth'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Growth: Outbound X & Newsletters (4, 5)
            </button>
            <button
              onClick={() => setActiveFilter('enterprise')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'enterprise'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Enterprise: Videos & Escala (6, 7, 8)
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o palabra clave..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredModules.map((modDef) => {
          const modState = campaign?.modules?.[modDef.id];
          const isSupported = isModuleSupportedByPlan(modDef);
          const isPausedByQuota = campaign?.status === 'paused_quota_reached';
          const isCurrentlyActive = modState ? (modState.active && isSupported && !isPausedByQuota) : true;

          return (
            <div
              key={modDef.id}
              className={`bg-[#141414] border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-neutral-600 hover:shadow-xl ${
                isCurrentlyActive
                  ? 'border-neutral-800 shadow-sm'
                  : 'border-neutral-800/60 opacity-85'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: Editorial number + Icon + Category badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-extrabold text-sm">
                      {modDef.number < 10 ? `0${modDef.number}.` : `${modDef.number}.`}
                    </span>
                    <span className={`p-1.5 rounded-md ${modDef.accentBg} ${modDef.accentColor} border ${modDef.accentBorder}`}>
                      {getModuleIcon(modDef.id)}
                    </span>
                  </div>

                  {campaign ? (
                    isCurrentlyActive ? (
                      <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ACTIVO
                      </span>
                    ) : isPausedByQuota ? (
                      <span className="text-amber-400 text-[11px] font-mono font-semibold">
                        PAUSADO (META)
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[10px] flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                        <Lock className="w-3 h-3 text-neutral-500" />
                        PLAN {modDef.requiredPlan.toUpperCase()}
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium uppercase">
                      Plan {modDef.requiredPlan}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {modDef.title}
                  </h3>
                  <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                    {modDef.subtitle}
                  </div>
                </div>

                {/* 3 Clear Explanations for users: Para qué sirve, Qué hace la máquina, Qué obtienes tú */}
                <div className="space-y-2.5 pt-2.5 border-t border-neutral-800/80 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <span>🎯</span>
                      <span>¿Para qué sirve?</span>
                    </span>
                    <p className="text-neutral-200 text-[11px] leading-relaxed mt-0.5">
                      {modDef.purpose}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                      <span>⚙️</span>
                      <span>¿Qué hace la máquina?</span>
                    </span>
                    <p className="text-neutral-400 text-[11px] leading-relaxed mt-0.5 line-clamp-3">
                      {modDef.howItWorks}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                      <span>📦</span>
                      <span>¿Qué obtienes tú?</span>
                    </span>
                    <p className="text-neutral-300 text-[11px] leading-relaxed mt-0.5">
                      {modDef.deliverable}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="mt-5 pt-3 border-t border-neutral-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">{modDef.metricLabel}:</span>
                  <span className="text-white font-semibold tabular-nums">
                    {modState ? modState.itemsProcessed.toLocaleString() : 'Listo para ejecutar'}
                  </span>
                </div>

                {modState && (
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
                    <Clock className="w-3 h-3 shrink-0 text-neutral-500" />
                    <span className="truncate">{modState.lastExecution}</span>
                  </div>
                )}

                <button
                  onClick={() => onSelectModule(modDef)}
                  className="w-full py-2 px-3 text-xs font-semibold text-neutral-100 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500/50 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>Ver Detalle y Probar con IA</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2.5 REAL-TIME MODULE CONVERSION BREAKDOWN & 24H INACTIVITY DIAGNOSTICS */}
      {campaign && (
        <ModuleConversionBreakdown campaign={campaign} />
      )}

      {/* 3. Explanatory Educational Section: How the 8 Modules Work Together */}
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>¿Cómo se integran estos 8 módulos con el Enlace Puente Inteligente?</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Coordinación armónica y autónoma sin necesidad de instalar scripts de píxel ni configurar webhooks.
            </p>
          </div>
          {onOpenPlans && (
            <button
              onClick={onOpenPlans}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shrink-0 glow-emerald"
            >
              Ver Planes y Módulos Incluidos →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/50 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
              <span>Generación y Publicación Multicanal</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Los 8 módulos redactan contenido especializado según su canal (artículos SEO para Google, hilos en X, respuestas de alto valor en foros Q&A con protección Anti-Ban, micro-videos virales o fichas de directorios), incorporando automáticamente tu Enlace Puente Inteligente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <span className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center text-xs">2</span>
              <span>Enrutamiento y Filtrado en Milisegundos</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Cuando una persona interesada hace clic, el servidor de KaSe intercepta la petición, verifica que sea un humano legítimo (descartando bots), cuenta la visita en tu campaña y redirige de inmediato a tu web sin retrasos ni intermediarios invasivos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-xs">3</span>
              <span>Apagado Exacto al Llegar a la Meta</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              El enrutador vigila el contador en tiempo real. En el momento exacto en que se alcanza el objetivo contratado (por ejemplo 2,000 registros), el sistema frena atómicamente todos los motores para que nunca pagues de más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

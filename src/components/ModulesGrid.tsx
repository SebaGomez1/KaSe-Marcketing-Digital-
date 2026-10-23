import React from 'react';
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
  Clock
} from 'lucide-react';
import { Campaign, ModuleDefinition, GROWTH_MODULES_CATALOG } from '../types/growth';

interface ModulesGridProps {
  campaign: Campaign;
  onSelectModule: (moduleDef: ModuleDefinition) => void;
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({
  campaign,
  onSelectModule,
}) => {
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
    if (mod.requiredPlan === 'starter') return true;
    if (mod.requiredPlan === 'growth') return campaign.plan === 'growth' || campaign.plan === 'enterprise';
    return campaign.plan === 'enterprise';
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Arquitectura de los 8 Módulos de Captación
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Ecosistema monolítico modular diseñado para operar en segundo plano hasta cumplir la meta exacta de registros contratados. Coordinado mediante colas de tareas eficientes.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-neutral-400">
            Plan activo: <strong className="text-white uppercase font-mono">{campaign.plan}</strong>
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-emerald-400 font-mono">
            {Object.values(campaign.modules).filter((m) => m.active).length} / 8 Operando
          </span>
        </div>
      </div>

      {/* Grid of 8 modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GROWTH_MODULES_CATALOG.map((modDef) => {
          const modState = campaign.modules[modDef.id];
          const isSupported = isModuleSupportedByPlan(modDef);
          const isPausedByQuota = campaign.status === 'paused_quota_reached';
          const isCurrentlyActive = modState.active && isSupported && !isPausedByQuota;

          return (
            <div
              key={modDef.id}
              className={`bg-[#161616] border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-neutral-700 ${
                isCurrentlyActive
                  ? 'border-neutral-800 shadow-sm'
                  : 'border-neutral-800/60 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Editorial number + Icon + Category */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 font-semibold">
                      {modDef.number < 10 ? `0${modDef.number}.` : `${modDef.number}.`}
                    </span>
                    <span className={modDef.accentColor}>
                      {getModuleIcon(modDef.id)}
                    </span>
                  </div>

                  {/* Clean unboxed status text */}
                  {isCurrentlyActive ? (
                    <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVO
                    </span>
                  ) : isPausedByQuota ? (
                    <span className="text-amber-400 text-[11px] font-mono">
                      PAUSADO (META)
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-[11px] flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" />
                      PLAN {modDef.requiredPlan.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Title & subtitle */}
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {modDef.title}
                  </h3>
                  <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                    {modDef.subtitle}
                  </div>
                </div>

                {/* 3 Clear Client Explanations: Para qué sirve, Qué hace, Qué obtienes */}
                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 block">
                      ¿Para qué sirve?
                    </span>
                    <p className="text-neutral-300 text-[11px] leading-snug">
                      {modDef.purpose}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-sky-400 block">
                      ¿Qué hace la máquina?
                    </span>
                    <p className="text-neutral-400 text-[11px] leading-snug line-clamp-2">
                      {modDef.howItWorks}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-neutral-200 block">
                      ¿Qué obtienes tú?
                    </span>
                    <p className="text-neutral-300 text-[11px] leading-snug">
                      {modDef.deliverable}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="mt-5 pt-3 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">{modDef.metricLabel}:</span>
                  <span className="text-white font-semibold tabular-nums">
                    {modState.itemsProcessed.toLocaleString()}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
                  <Clock className="w-3 h-3 shrink-0 text-neutral-500" />
                  <span className="truncate">{modState.lastExecution}</span>
                </div>

                <button
                  onClick={() => onSelectModule(modDef)}
                  className="w-full py-2 px-3 text-xs font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ver Detalle y Probar con IA</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400 ml-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

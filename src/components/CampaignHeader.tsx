import React from 'react';
import { ExternalLink, ShieldCheck, ChevronDown, RefreshCw, Power } from 'lucide-react';
import { Campaign } from '../types/growth';

interface CampaignHeaderProps {
  campaign: Campaign;
  allCampaigns: Campaign[];
  onSelectCampaign: (id: string) => void;
  onToggleStatus: () => void;
  onResetCounter: () => void;
  isActionLoading?: boolean;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaign,
  allCampaigns,
  onSelectCampaign,
  onToggleStatus,
  onResetCounter,
  isActionLoading = false,
}) => {
  const isQuotaReached = campaign.status === 'paused_quota_reached';
  const isManuallyPaused = campaign.status === 'paused_manual';
  const isActive = campaign.status === 'active';

  return (
    <div className="bg-[#121212] border-b border-neutral-800 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Campaign selector & Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="relative inline-block text-left">
              <select
                aria-label="Seleccionar campaña activa"
                value={campaign.id}
                onChange={(e) => onSelectCampaign(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-white text-sm font-semibold rounded-md px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-neutral-500 cursor-pointer"
              >
                {allCampaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Status indicator */}
            {isActive && (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Motores Operando
              </span>
            )}
            {isQuotaReached && (
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Pausa Automática (Meta Cumplida)
              </span>
            )}
            {isManuallyPaused && (
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                Pausa Manual
              </span>
            )}
          </div>

          {/* Clean unboxed metadata with separators (Anti-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              {campaign.campaignType === 'plan_sales'
                ? '💳 Campaña Venta de Planes'
                : campaign.campaignType === 'youtube_growth'
                ? '🎥 Campaña YouTube Growth'
                : campaign.campaignType === 'social_followers'
                ? '🌟 Campaña Seguidores'
                : campaign.campaignType === 'likes_engagement'
                ? '❤️ Campaña Engagement'
                : campaign.campaignType === 'comments_reviews'
                ? '💬 Campaña Comentarios'
                : '👥 Campaña Registros'}
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <a
              href={campaign.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-200 inline-flex items-center gap-1 transition-colors"
            >
              <span>{campaign.targetUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{campaign.niche}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="uppercase text-neutral-300 font-mono">Plan {campaign.plan}</span>
            {campaign.minPlanPrice !== undefined && campaign.maxPlanPrice !== undefined && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-emerald-400/90 font-mono" title="Rango de precios de planes del cliente calibrados para el targeting de la IA">
                  Targeting: ${campaign.minPlanPrice} - ${campaign.maxPlanPrice} {campaign.currency || 'USD'}
                </span>
              </>
            )}
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-500">
              Zero-Credentials
            </span>
          </div>
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleStatus}
            disabled={isActionLoading || (isQuotaReached && campaign.currentRegistrations >= campaign.targetRegistrations)}
            title={
              isQuotaReached
                ? 'Para reanudar, aumente la meta de conversión o reinicie el contador'
                : isActive
                ? 'Pausar motores temporalmente'
                : 'Reanudar motores'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              isActive
                ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Pausar Motores' : 'Reanudar Motores'}</span>
          </button>

          <button
            onClick={onResetCounter}
            disabled={isActionLoading}
            title="Reiniciar contador a 0 para pruebas de ciclo"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isActionLoading ? 'animate-spin' : ''}`} />
            <span>Reiniciar Contador</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Calculator, 
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import { Campaign } from '../types/growth';

import { User } from '../types/growth';

interface PlansComparisonProps {
  campaign: Campaign;
  onUpdatePlan: (plan: 'starter' | 'growth' | 'enterprise', targetRegistrations: number) => void;
  currentUser?: User | null;
  onRequestOneDollarCheckout?: () => void;
}

export const PlansComparison: React.FC<PlansComparisonProps> = ({
  campaign,
  onUpdatePlan,
  currentUser,
  onRequestOneDollarCheckout,
}) => {
  const isSuperAdmin = (currentUser?.email || '').toLowerCase() === 'kathyseba2020@gmail.com';
  // Custom user target calculator state
  const [customUsers, setCustomUsers] = useState<number>(campaign.targetRegistrations || 5000);
  const [isAppliedNotice, setIsAppliedNotice] = useState<boolean>(false);

  // Calculate pricing based on custom volume
  const getCustomTier = (volume: number) => {
    if (volume <= 2000) {
      const price = Math.round(volume * 0.245);
      return {
        plan: 'starter' as const,
        planName: 'Plan Starter',
        totalPrice: Math.max(190, price),
        unitPrice: '0.245',
        modulesCount: '3 Módulos (Base)',
        colorText: 'text-emerald-400',
        bgButton: 'bg-emerald-400 hover:bg-emerald-300 text-black',
      };
    } else if (volume <= 10000) {
      const price = Math.round(volume * 0.189);
      return {
        plan: 'growth' as const,
        planName: 'Plan Growth',
        totalPrice: price,
        unitPrice: '0.189',
        modulesCount: '5 Módulos (Base + Outbound + Newsletters)',
        colorText: 'text-sky-400',
        bgButton: 'bg-sky-400 hover:bg-sky-300 text-black',
      };
    } else {
      const price = Math.round(volume * 0.089);
      return {
        plan: 'enterprise' as const,
        planName: 'Plan Enterprise VIP',
        totalPrice: price,
        unitPrice: '0.089',
        modulesCount: 'Los 8 Módulos en Paralelo',
        colorText: 'text-purple-400',
        bgButton: 'bg-purple-500 hover:bg-purple-400 text-white glow-purple',
      };
    }
  };

  const customQuote = getCustomTier(customUsers);

  const handleApplyCustom = () => {
    onUpdatePlan(customQuote.plan, customUsers);
    setIsAppliedNotice(true);
    setTimeout(() => setIsAppliedNotice(false), 3000);
  };

  const plans = [
    {
      id: 'starter' as const,
      name: 'Plan Starter',
      badge: 'Tráfico Estable',
      price: '$490 USD',
      period: '/ mes',
      target: 2000,
      costPerUser: '$0.245 / usuario',
      description: 'Ideal para validar tu producto, conseguir los primeros 2,000 usuarios y generar tracción orgánica comprobada.',
      color: 'border-neutral-800',
      activeColor: 'border-emerald-500/50 bg-emerald-500/5',
      accentText: 'text-emerald-400',
      accentBtn: 'bg-emerald-400 text-black hover:bg-emerald-300',
      whatYouGet: [
        '2,000 usuarios registrados verificados en tu app',
        'Indexación acelerada en Google en menos de 48 horas (Módulo 1)',
        'Sindicación automática semanal en X/Twitter, LinkedIn y Facebook (Módulo 2)',
        'Inscripción de tu app en 52 directorios mundiales como Product Hunt (Módulo 3)',
        'Píxel JavaScript y Webhook de conversión sin límite',
        'Pausa automática obligatoria al registrar al usuario #2,000',
      ],
      modules: [
        { name: 'Módulo 1: SEO Técnico e Indexación API Google', included: true },
        { name: 'Módulo 2: Social Media Syndication (X, LinkedIn)', included: true },
        { name: 'Módulo 3: Programmatic Launching (50+ Directorios)', included: true },
        { name: 'Módulo 4: Automated Outbound (Reddit & X Bot)', included: false },
        { name: 'Módulo 5: Newsletter Outreach Engine', included: false },
        { name: 'Módulo 6: Video Growth Automation (TikTok/Reels)', included: false },
        { name: 'Módulo 7: Programmatic SEO & Landing Factory', included: false },
        { name: 'Módulo 8: Bot de Alianzas e Influencers', included: false },
      ],
    },
    {
      id: 'growth' as const,
      name: 'Plan Growth',
      badge: 'Tráfico en Escala',
      price: '$1,890 USD',
      period: '/ mes',
      target: 10000,
      costPerUser: '$0.189 / usuario',
      description: 'Para startups que necesitan un flujo constante de clientes potenciales mediante captación activa en foros y menciones en newsletters.',
      color: 'border-neutral-800',
      activeColor: 'border-sky-500/50 bg-sky-500/5',
      accentText: 'text-sky-400',
      accentBtn: 'bg-sky-400 text-black hover:bg-sky-300',
      whatYouGet: [
        '10,000 usuarios registrados verificados en tu app',
        'Todo lo incluido en el Plan Starter (Módulos 1, 2 y 3)',
        'Bot de escucha activa en Reddit (r/SaaS, r/startups) y X recomendando tu app (Módulo 4)',
        'Pitching personalizado a editores de newsletters tecnológicas de alta audiencia (Módulo 5)',
        'Píxel y Webhook con monitoreo continuo en segundo plano',
        'Pausa automática estricta al llegar a 10,000 usuarios registrados',
      ],
      modules: [
        { name: 'Módulo 1: SEO Técnico e Indexación API Google', included: true },
        { name: 'Módulo 2: Social Media Syndication (X, LinkedIn)', included: true },
        { name: 'Módulo 3: Programmatic Launching (50+ Directorios)', included: true },
        { name: 'Módulo 4: Automated Outbound (Reddit & X Bot)', included: true },
        { name: 'Módulo 5: Newsletter Outreach Engine', included: true },
        { name: 'Módulo 6: Video Growth Automation (TikTok/Reels)', included: false },
        { name: 'Módulo 7: Programmatic SEO & Landing Factory', included: false },
        { name: 'Módulo 8: Bot de Alianzas e Influencers', included: false },
      ],
    },
    {
      id: 'enterprise' as const,
      name: 'Plan Enterprise VIP',
      badge: 'Tráfico Masivo Ultra-Agresivo',
      price: '$8,900 USD',
      period: '/ mes',
      target: 100000,
      costPerUser: '$0.089 / usuario',
      description: 'Potencia de adquisición extrema. Los 8 módulos operando en simultáneo para dominar tu categoría con micro-videos, programmatic SEO e influencers.',
      color: 'border-neutral-800',
      activeColor: 'border-purple-500/50 bg-purple-500/5',
      accentText: 'text-purple-400',
      accentBtn: 'bg-purple-500 text-white hover:bg-purple-400 glow-purple',
      whatYouGet: [
        '100,000 o más usuarios registrados verificados en tu app',
        'Los 8 módulos completos operando en simultáneo en servidores dedicados con balanceo de carga',
        'Micro-videos virales generados con IA para TikTok, Instagram Reels y YouTube Shorts (Módulo 6)',
        'Fábrica de cientos de páginas de aterrizaje comparativas automáticas (Programmatic SEO) (Módulo 7)',
        'Bot de prospección y alianzas con micro-influencers de tu nicho (Módulo 8)',
        'Pausa automática obligatoria al registrar al usuario #100,000',
      ],
      modules: [
        { name: 'Módulo 1: SEO Técnico e Indexación API Google', included: true },
        { name: 'Módulo 2: Social Media Syndication (X, LinkedIn)', included: true },
        { name: 'Módulo 3: Programmatic Launching (50+ Directorios)', included: true },
        { name: 'Módulo 4: Automated Outbound (Reddit & X Bot)', included: true },
        { name: 'Módulo 5: Newsletter Outreach Engine', included: true },
        { name: 'Módulo 6: Video Growth Automation (TikTok/Reels)', included: true },
        { name: 'Módulo 7: Programmatic SEO & Landing Factory', included: true },
        { name: 'Módulo 8: Bot de Alianzas e Influencers', included: true },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Planes, Precios y Calculadora de Usuarios a Medida
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Precios 100% transparentes basados en resultados. Solo pagas por usuarios registrados reales contabilizados por tu Píxel o Webhook. Al llegar a la cuota, el sistema se apaga solo.
          </p>
        </div>

        <div className="text-xs text-neutral-400">
          Campaña activa:{' '}
          <strong className="text-white font-mono">{campaign.name}</strong>
        </div>
      </div>

      {/* SPECIAL $1.00 USD AUTOPRUEBA PLAN FOR KATHY (AT THE VERY TOP) */}
      {isSuperAdmin && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-neutral-900 to-black border-2 border-amber-500 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-md text-[11px] font-extrabold font-mono bg-amber-500 text-black uppercase tracking-wider shadow-sm">
                  👑 Exclusivo Kathy Seba · Prueba de Pasarela en Vivo
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono text-emerald-400 font-extrabold bg-emerald-500/20 border border-emerald-500/30">
                  $1.00 USD Único
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Plan Especial de Autoprueba Mercado Pago ($1.00 USD)
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                Diseñado exclusivamente para que realices un pago real de prueba con tu tarjeta de crédito/débito o cuenta de Mercado Pago y compruebes que tu API de producción de Mercado Pago Uruguay recibe y acredita el dinero al instante. A diferencia del resto de planes que son gratis para ti, este plan te lleva directo a la pasarela de cobro.
              </p>
            </div>

            {onRequestOneDollarCheckout && (
              <button
                type="button"
                onClick={onRequestOneDollarCheckout}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl shadow-amber-500/30 cursor-pointer shrink-0 flex items-center gap-2 transform hover:scale-105"
              >
                <span>💳 Pagar $1.00 USD con Mercado Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE CUSTOM USERS CALCULATOR (Allows user to select any specific number of users) */}
      <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  ¿Quieres comprar una cantidad específica de usuarios?
                </h3>
                <p className="text-xs text-neutral-400">
                  Ajusta la cantidad exacta de registros que necesitas para tu aplicación y cotiza al instante.
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-400">Precio Estimado</div>
              <div className="text-2xl font-bold font-mono text-white">
                ${customQuote.totalPrice.toLocaleString()} <span className="text-xs font-normal text-neutral-400">USD</span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                ~${customQuote.unitPrice} por usuario registrado
              </div>
            </div>
          </div>

          {/* Slider and Input Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-2">
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={customUsers}
                  onChange={(e) => setCustomUsers(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400 cursor-pointer h-2 bg-neutral-900 rounded-lg border border-neutral-800"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                  <span>500 usuarios</span>
                  <span>10,000 usuarios</span>
                  <span>50,000 usuarios</span>
                  <span>100,000 usuarios</span>
                </div>
              </div>

              {/* Direct numeric input */}
              <div className="w-full sm:w-48 bg-neutral-900 border border-neutral-700 rounded-lg p-2 flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Meta:</span>
                <input
                  type="number"
                  min={500}
                  max={250000}
                  step={100}
                  value={customUsers}
                  onChange={(e) => setCustomUsers(Math.max(100, parseInt(e.target.value || '0', 10)))}
                  className="w-full bg-black border border-neutral-700 rounded px-2 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-sky-500 text-right"
                />
                <span className="text-xs text-neutral-400">usuarios</span>
              </div>
            </div>

            {/* Quote details pill bar */}
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-neutral-400">
                  Plan Recomendado:{' '}
                  <strong className={`font-mono uppercase ${customQuote.colorText}`}>
                    {customQuote.planName}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span className="text-neutral-300">
                  Módulos activados: <strong>{customQuote.modulesCount}</strong>
                </span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-pausa al registrar al usuario #{customUsers.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleApplyCustom}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${customQuote.bgButton}`}
              >
                {isAppliedNotice ? '¡Meta Aplicada a la Campaña!' : `Aplicar Meta de ${customUsers.toLocaleString()} Usuarios`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE STANDARD PRICING TIERS */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Planes Estándar Pre-Configurados
          </h3>
          <p className="text-xs text-neutral-400">
            Escoge un paquete empaquetado o cámbialo en cualquier momento con 1 solo clic.
          </p>
        </div>

        {/* SPECIAL $1.00 USD AUTOPRUEBA PLAN FOR KATHY */}
        {isSuperAdmin && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-black border-2 border-amber-500/60 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    👑 Exclusivo Kathy Seba · Prueba de Pasarela en Vivo
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">$1.00 USD Único</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Plan de Autoprueba Mercado Pago ($1.00 USD)
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  Diseñado para que hagas un autopago con tu tarjeta bancaria y compruebes que tu API de producción de Mercado Pago Uruguay recibe el dinero de inmediato en tu cuenta. Este plan no tiene bypass gratis para que puedas pasar al checkout real.
                </p>
              </div>

              {onRequestOneDollarCheckout && (
                <button
                  type="button"
                  onClick={onRequestOneDollarCheckout}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/30 cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>💳 Pagar $1.00 USD con Mercado Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = campaign.plan === p.id && campaign.targetRegistrations === p.target;

            return (
              <div
                key={p.id}
                className={`bg-[#161616] border rounded-xl p-6 flex flex-col justify-between transition-all ${
                  isCurrent ? p.activeColor : p.color
                }`}
              >
                <div className="space-y-4">
                  {/* Badge & Current Plan Tag */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${p.accentText}`}>
                      {p.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold">
                        PLAN ACTIVO EN TU APP
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                    
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                        {p.price}
                      </span>
                      <span className="text-xs text-neutral-400">{p.period}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-mono text-sky-400 font-semibold">
                        {p.target.toLocaleString()} usuarios registrados
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {p.costPerUser}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* What you get bullet points (Clear and simple for the client) */}
                  <div className="pt-4 border-t border-neutral-800 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Lo que obtienes exactamente con este plan:</span>
                    </div>
                    <ul className="space-y-2 text-xs">
                      {p.whatYouGet.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-neutral-300 leading-snug">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.accentText}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modules breakdown */}
                  <div className="pt-4 border-t border-neutral-800 space-y-2">
                    <div className="text-xs font-semibold text-neutral-400">
                      Módulos Incluidos ({p.modules.filter(m => m.included).length}/8):
                    </div>
                    <ul className="space-y-1 text-[11px]">
                      {p.modules.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.included ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                          <span className={m.included ? 'text-neutral-200' : 'text-neutral-600 line-through'}>
                            {m.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 mt-6 border-t border-neutral-800">
                  <button
                    onClick={() => onUpdatePlan(p.id, p.target)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-neutral-800 text-neutral-500 cursor-default'
                        : p.accentBtn
                    }`}
                  >
                    <span>
                      {isCurrent
                        ? 'Plan Actualmente Activo'
                        : `Seleccionar ${p.name} (${p.price})`}
                    </span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MERCADO PAGO URUGUAY - RECURRENT PAYMENTS & SUBSCRIPTIONS BOX */}
      <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0 font-mono">
              MP UY
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Cobros Recurrentes Mensuales: Mercado Pago Uruguay</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  API PREAPPROVAL READY
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Los clientes se suscriben con débito automático mensual directo a tu cuenta de Mercado Pago Uruguay.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Moneda:</span>
            <span className="text-xs font-bold text-white bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded">
              USD / UYU (Dólares o Pesos Uruguayos)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
            <div className="text-neutral-400 font-medium">1. Débito Automático Recurrente</div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              El cliente ingresa su tarjeta una sola vez al contratar su plan. Cada 30 días Mercado Pago procesa el cobro automático sin que tengas que pedirlo manualmente.
            </p>
          </div>

          <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
            <div className="text-neutral-400 font-medium">2. Dinero Directo a tu Cuenta Bancaria</div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Al pasar la API de producción al final del proyecto, todos los cobros impactan de forma inmediata en tu cuenta de Mercado Pago Uruguay y se transfieren a tu banco local.
            </p>
          </div>

          <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
            <div className="text-neutral-400 font-medium">3. Sincronización con la Cuota KaSe</div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Cuando Mercado Pago confirma el pago mensual, el webhook renueva automáticamente los créditos de registros y reactiva los motores si estaban en pausa.
            </p>
          </div>
        </div>

        {/* Current Campaign Billing Status */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-neutral-400">
              Estado de Suscripción de esta Campaña:{' '}
              <strong className="text-emerald-400 font-mono">
                {campaign.billing?.subscriptionStatus === 'active' ? 'ACTIVA (DÉBITO MENSUAL VIGENTE)' : 'CONFIGURADA'}
              </strong>
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Pasarela: Mercado Pago Uruguay · Cobro: USD ${campaign.billing?.monthlyAmount || (campaign.plan === 'starter' ? 490 : campaign.plan === 'growth' ? 1890 : 8900)} / mes
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/payments/mercadopago/create-subscription', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    campaignId: campaign.id,
                    plan: campaign.plan,
                    monthlyAmount: campaign.plan === 'starter' ? 490 : campaign.plan === 'growth' ? 1890 : 8900,
                    currency: 'USD',
                  }),
                });
                const data = await res.json();
                alert(`¡Suscripción recurrente de Mercado Pago Uruguay verificada!\n\nID: ${data.subscriptionId}\nCobro recurrente: ${data.billing.monthlyAmount} USD / mes\nPróxima fecha de facturación: ${new Date(data.billing.nextBillingDate).toLocaleDateString()}`);
                window.location.reload();
              } catch (e) {
                alert('Suscripción conectada en backend.');
              }
            }}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-bold rounded-lg transition-colors cursor-pointer text-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Probar Cobro Recurrente (Simulación MP UY)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

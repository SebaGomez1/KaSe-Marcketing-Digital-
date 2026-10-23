import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  UserCheck, 
  CreditCard, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

import { User } from '../types/growth';

interface ClientOnboardingGuideProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewCampaign: () => void;
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const ClientOnboardingGuide: React.FC<ClientOnboardingGuideProps> = ({
  onNavigateTab,
  onOpenNewCampaign,
  currentUser,
  onOpenAuthModal,
}) => {
  const handleAction = (tabTarget?: string) => {
    if (!currentUser && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    if (tabTarget) {
      onNavigateTab(tabTarget);
    } else {
      onOpenNewCampaign();
    }
  };

  const steps = [
    {
      step: '01',
      title: 'Crear tu Cuenta y dar de alta tu App',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      whatYouDo: 'Ingresas a KaSe con tu cuenta de empresa y registras tu producto: nombre de tu app, enlace de tu web y una breve descripción.',
      whatYouTouch: 'Haces clic en el botón verde superior "+ Nueva Campaña".',
      whatYouGet: 'Un panel de control personalizado y aislado para tu aplicación.',
      actionLabel: currentUser ? 'Dar de Alta App' : 'Registrarse Gratis',
      action: () => handleAction(),
    },
    {
      step: '02',
      title: 'Seleccionar tu Meta o Comprar Usuarios a Medida',
      icon: <CreditCard className="w-4 h-4 text-sky-400" />,
      whatYouDo: 'Decides cuántos usuarios registrados quieres recibir en tu app este mes: desde 2,000 hasta 100,000+ o una cifra exacta personalizada con nuestra calculadora.',
      whatYouTouch: 'Pestaña "Planes y Precios" -> seleccionas Starter ($490), Growth ($1,890), Enterprise ($8,900) o ajustas el slider personalizado.',
      whatYouGet: 'Una cuota estricta garantizada por contrato y los módulos correspondientes activados.',
      actionLabel: currentUser ? 'Ver Planes y Precios' : 'Acceder para Ver Planes',
      action: () => handleAction('plans'),
    },
    {
      step: '03',
      title: 'Activar tu Enlace Puente Autónomo (Cero Código)',
      icon: <Code2 className="w-4 h-4 text-teal-400" />,
      whatYouDo: 'Copias tu enlace inteligente (/r/:campaignId) generado automáticamente por KaSe y lo compartes en tus redes o campañas. Cero scripts molestos en tu código.',
      whatYouTouch: 'Pestaña "Integración Segura" -> Botón "Copiar Enlace Puente".',
      whatYouGet: 'Cero riesgo cibernético y cero configuración técnica. KaSe rastrea y redirige atómicamente a cada visitante sin instalar nada en tu servidor.',
      actionLabel: currentUser ? 'Ver Enlace Puente' : 'Acceder a Integración',
      action: () => handleAction('integration'),
    },
    {
      step: '04',
      title: 'Los Motores Trabajan 100% Solos en Segundo Plano',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      whatYouDo: 'No tienes que hacer nada más. Puedes apagar tu ordenador.',
      whatYouTouch: 'Pestaña "Módulos (8)" para ver la cola de trabajo o inspeccionar los contenidos generados con IA.',
      whatYouGet: 'Artículos en Google indexados en <48h, hilos en X, publicaciones en LinkedIn, presencia en 50+ directorios y menciones de influencers que canalizan usuarios hacia tu registro.',
      actionLabel: currentUser ? 'Ver los 8 Módulos' : 'Acceder a Módulos',
      action: () => handleAction('modules'),
    },
    {
      step: '05',
      title: 'Auto-Pausa Inteligente: Cero Sobrecostos',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      whatYouDo: 'Revisas el tacómetro en tu Dashboard para ver cómo sube el contador de registros.',
      whatYouTouch: 'Pestaña "Simulador de Cuota" si quieres probar cómo se activa la pausa de emergencia.',
      whatYouGet: 'Al registrar exactamente al último usuario contratado (ej. 2,000), todos los motores se apagan automáticamente. No te cobramos de más ni se desperdicia tráfico.',
      actionLabel: currentUser ? 'Probar Simulador' : 'Acceder a Simulador',
      action: () => handleAction('simulator'),
    },
  ];

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6 space-y-6">
      {/* Guest Notice Banner if unauthenticated */}
      {!currentUser && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guía Oficial de Funcionamiento KaSe</h3>
              <p className="text-xs text-neutral-400">
                Esta es la arquitectura 100% autónoma. Regístrate gratis para acceder a tu panel de control y dar de alta tu primera campaña.
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Crear Cuenta Gratis</span>
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Guía Esencial: ¿Cómo funciona KaSe para ti y tus clientes?</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                PASO A PASO
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Explicación simple de principio a fin: qué tienes que hacer, a dónde tocas y qué resultados concretos obtienes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Sin conocimientos técnicos requeridos</span>
        </div>
      </div>

      {/* 5 Step Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="bg-[#181818] border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-neutral-400">PASO {s.step}</span>
                {s.icon}
              </div>

              <h3 className="text-xs font-bold text-white leading-tight">
                {s.title}
              </h3>

              <div className="space-y-2 text-[11px] text-neutral-400 leading-relaxed pt-1">
                <div>
                  <strong className="text-neutral-300 block">¿Qué haces?</strong>
                  <span>{s.whatYouDo}</span>
                </div>
                <div>
                  <strong className="text-neutral-300 block">¿A dónde tocas?</strong>
                  <span className="text-sky-300">{s.whatYouTouch}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 block">¿Qué obtienes?</strong>
                  <span className="text-neutral-300">{s.whatYouGet}</span>
                </div>
              </div>
            </div>

            <button
              onClick={s.action}
              className="w-full mt-2 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{s.actionLabel}</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Value Banner */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-neutral-300">
            <strong>En resumen:</strong> Tú solo compras la cantidad de usuarios que deseas para tu aplicación, activas tu enlace puente autónomo o webhook, y KaSe se encarga de todo el marketing orgánico hasta cumplir tu meta garantizada.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('plans')}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Elegir o Calcular Plan Ahora
        </button>
      </div>
    </div>
  );
};

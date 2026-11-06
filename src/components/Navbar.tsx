import React from 'react';
import { Zap, Plus, ShieldCheck, User as UserIcon, LogIn, Lock, LogOut } from 'lucide-react';
import { User, isUserSuperAdmin } from '../types/growth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewCampaign: () => void;
  onOpenInstallModal?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  currentUser: User | null;
  avatarUrl?: string;
  onRequestOneDollarCheckout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCampaign,
  onOpenInstallModal,
  onOpenAuthModal,
  onLogout,
  currentUser,
  avatarUrl,
  onRequestOneDollarCheckout,
}) => {
  const isSuperAdmin = isUserSuperAdmin(currentUser);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [campaignType, setCampaignType] = React.useState('Registros de Usuarios');


  // Unauthenticated visitors can see Inicio, ¿Cómo funciona?, Módulos 8, and Reseñas (no planes y precios before login)
  const publicNavItems = [
    { id: 'landing', label: '🏠 Inicio' },
    { id: 'guide', label: '¿Cómo funciona?' },
    { id: 'modules', label: 'Módulos 8' },
    { id: 'reviews', label: '⭐ Reseñas' },
  ];

  const authenticatedClientNavItems = [
    { id: 'landing', label: '🏠 Inicio' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'active_campaigns', label: '🚀 Campañas Activas' },
    { id: 'guide', label: '¿Cómo funciona?' },
    { id: 'modules', label: 'Módulos (8)' },
    { id: 'plans', label: 'Planes y Precios' },
    { id: 'reviews', label: '⭐ Reseñas' },
    { id: 'integration', label: 'Integración Segura' },
  ];

  const adminNavItems = [
    ...authenticatedClientNavItems,
    { id: 'logs', label: '📋 Bitácora' },
    { id: 'admin_global', label: '👑 Admin Global KaSe' },
  ];

  const navItems = !currentUser
    ? publicNavItems
    : isSuperAdmin
    ? adminNavItems
    : authenticatedClientNavItems;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-neutral-800 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6 w-full">
        {/* Zone 1: Single element Brand Zone */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')} 
          className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
            KaSe <span className="text-neutral-400 font-normal">Marketing</span>
          </span>
        </div>

        {/* Zone 2: 4-6 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isAdmin = item.id === 'admin_global';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-neutral-800 text-white'
                    : isAdmin
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (PWA install + Nueva Campaña + Auth status) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Dedicated PWA Install Button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              title="Instalar App KaSe en tu celular Android o iPhone"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-lg transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <span className="text-sm">📱</span>
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}

          {/* Special $1 USD Test Checkout Button for Super Admin Kathy */}
          {isSuperAdmin && onRequestOneDollarCheckout && (
            <button
              onClick={onRequestOneDollarCheckout}
              title="Probar checkout real de $1.00 USD en Mercado Pago Uruguay"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-lg transition-all cursor-pointer shadow-sm shadow-amber-500/20"
            >
              <span>💳</span>
              <span>Probar MP $1 USD</span>
            </button>
          )}

                    {/* New Campaign Button (Forces login if unauthenticated) */}
          <button
            onClick={() => {
              if (!currentUser && onOpenAuthModal) {
                onOpenAuthModal();
              } else {
                onOpenNewCampaign();
              }
            }}
          >


return (
  <>
    <button 
      onClick={() => { setIsCampaignModalOpen(true); setStep(1); }}
      title="Dar de alta una nueva campaña" 
      className="flex items-center gap-1.5 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-all"
    >
      <span>Nueva Campaña</span>
    </button>

    {isCampaignModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-[#121214] text-white w-full max-w-lg rounded-xl border border-zinc-800 p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
          <button 
            onClick={() => setIsCampaignModalOpen(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg font-bold"
          >
            ✕
          </button>
          
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
              ⚡ Dar de Alta Nueva Campaña en KaSe
            </h3>
            <p className="text-xs text-zinc-400">Sin APIs internas. Configuración externa 100% segura con apagado exacto al cumplir la meta.</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-zinc-300">1. Selecciona el Tipo de Campaña:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Registros de Usuarios', desc: 'Captación de cuentas...' },
                  { id: 'Venta de Planes / Membresías', desc: 'Conversión directa de...' },
                  { id: 'Seguidores en Redes Sociales', desc: 'Crecimiento de audiencia...' },
                  { id: 'Likes & Engagement', desc: 'Interacciones masivas...' },
                  { id: 'Comentarios & Reseñas', desc: 'Prueba social, feedback...' },
                  { id: 'Vistas & Suscriptores', desc: 'Tráfico audiovisual masiv...' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCampaignType(item.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${campaignType === item.id ? 'border-emerald-400 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/50'}`}
                  >
                    <p className="text-xs font-bold">{item.id}</p>
                    <p className="text-[10px] text-zinc-400">{item.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full py-2 bg-emerald-400 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm transition-all mt-4">Siguiente</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-300">2. Datos del Producto o Web</p>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nombre de la Aplicación, Producto o Canal *</label>
                <input type="text" placeholder="Ej: FinPulse AI, NovaMetrics..." className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-emerald-400"/>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">URL de Destino / Web / Canal *</label>
                <input type="text" placeholder="https://" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-emerald-400"/>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Categoría o Nicho *</label>
                <select className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-emerald-400 text-zinc-300">
                  <option>Fintech & B2B SaaS</option>
                  <option>E-commerce</option>
                  <option>Infoproductos & Cursos</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="w-1/2 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all">Atrás</button>
                <button onClick={() => setStep(3)} className="w-1/2 py-2 bg-emerald-400 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm transition-all">Siguiente</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-zinc-300">3. Calibración de Precios de tu Web</p>
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-xs text-zinc-400 mb-1">¿Plan más BARATO? *</label>
                  <input type="number" defaultValue="29" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-emerald-400"/>
                </div>
                <div className="w-1/2">
                  <label className="block text-xs text-zinc-400 mb-1">¿Plan más CARO? *</label>
                  <input type="number" defaultValue="199" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-sm outline-none focus:border-emerald-400"/>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(2)} className="w-1/2 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all">Atrás</button>
                <button onClick={() => setStep(4)} className="w-1/2 py-2 bg-emerald-400 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm transition-all">Siguiente</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-zinc-300">4. Meta de ventas de planes que Deseas Comprar:</p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center">
                <p className="text-2xl font-bold text-emerald-400">50 <span className="text-xs text-white">ventas de planes</span></p>
                <p className="text-xs text-zinc-400 mt-1">Volumen contratado: ~ $625 USD / mes</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(3)} className="w-1/3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-all">Atrás</button>
                <button 
                  onClick={() => {
                    setIsCampaignModalOpen(false);
                    alert("¡Campaña iniciada de manera simulada localmente!");
                  }} 
                  className="w-2/3 py-2 bg-emerald-400 hover:bg-emerald-500 text-black font-bold rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  🚀 Iniciar Campaña Autónoma
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    )}
  </>
);

          </button>

          {/* User Auth Switcher / Profile Badge */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isSuperAdmin
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-950/60'
                  : currentUser
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              {isSuperAdmin ? (
                <>
                  <span className="text-amber-400 font-bold">👑</span>
                  <span className="hidden md:inline font-mono">Super Admin</span>
                </>
              ) : currentUser ? (
                <>
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline font-mono">{(currentUser.name || currentUser.email || 'Usuario').split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden md:inline">Acceder</span>
                </>
              )}
            </button>
          )}

          {/* Google Translate Global Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300" title="Traducción automática a nivel mundial">
            <span className="text-sm">🌐</span>
            <div id="google_translate_element" className="inline-block scale-90 sm:scale-100 origin-left" />
          </div>

          {/* Logout Button */}
          {currentUser && onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar sesión y volver al Hero de Inicio"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-700 hover:border-rose-500/50 bg-neutral-900 hover:bg-rose-950/30 text-neutral-300 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Director de Crecimiento"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-neutral-700 object-cover hidden lg:block"
            />
          )}
        </div>
      </div>

      {/* Mobile nav bar for smaller screens */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-t border-neutral-800/80 overflow-x-auto bg-black/60 max-w-full w-full no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAdmin = item.id === 'admin_global';
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap cursor-pointer ${
                isActive
                  ? isAdmin
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'bg-neutral-800 text-white'
                  : isAdmin
                  ? 'text-amber-400'
                  : 'text-neutral-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

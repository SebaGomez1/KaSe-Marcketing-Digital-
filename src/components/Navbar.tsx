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

  // Unauthenticated visitors can see Inicio, ¿Cómo funciona?, Planes y Precios, and Reseñas
  const publicNavItems = [
    { id: 'landing', label: '🏠 Inicio' },
    { id: 'guide', label: '¿Cómo funciona?' },
    { id: 'plans', label: '💎 Planes y Precios' },
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
    { id: 'logs', label: 'Bitácora' },
  ];

  const navItems = !currentUser
    ? publicNavItems
    : isSuperAdmin
    ? [...authenticatedClientNavItems, { id: 'admin_global', label: '👑 Admin Global KaSe' }]
    : authenticatedClientNavItems;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Single element Brand Zone */}
        <div 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')} 
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
            title={!currentUser ? 'Inicia sesión para crear una campaña' : 'Dar de alta una nueva campaña'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-md transition-all glow-emerald whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Nueva Campaña</span>
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
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-neutral-800/80 overflow-x-auto bg-black/60">
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

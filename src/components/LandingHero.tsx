import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  TrendingUp, 
  Eye, 
  HelpCircle, 
  Layers, 
  UserCheck, 
  Heart, 
  MessageSquareText, 
  Youtube,
  Globe2,
  Sliders,
  DollarSign,
  Star
} from 'lucide-react';
import { User, CampaignType, CAMPAIGN_TYPES_CATALOG, isUserSuperAdmin, isValidAdminCredentials, ADMIN_PASSWORD } from '../types/growth';

interface LandingHeroProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onGoToDashboard: () => void;
  onOpenNewCampaign: () => void;
  onGoToReviews?: () => void;
  onGoToGuide?: () => void;
  onGoToModules?: () => void;
  onOpenInstallModal?: () => void;
  onRequestOneDollarCheckout?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  currentUser,
  onLoginSuccess,
  onGoToDashboard,
  onOpenNewCampaign,
  onGoToReviews,
  onGoToGuide,
  onGoToModules,
  onOpenInstallModal,
  onRequestOneDollarCheckout,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Device-specific remembered account (only appears on the device where that user logged in)
  const [deviceAccount, setDeviceAccount] = useState<{ email: string; name: string; role: string } | null>(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('kase_device_account') : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    if (!cleanEmail) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }
    if (!cleanPass) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    setError(null);
    setLoading(true);

    const isAdmin = isUserSuperAdmin({ email: cleanEmail });
    if (isAdmin && !isValidAdminCredentials(cleanEmail, cleanPass)) {
      setError('Contraseña Incorrecta');
      setLoading(false);
      return;
    }

    try {
      let authUser: User | null = null;
      // 1. Attempt API server authentication
      try {
        const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: cleanEmail, password }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) {
            if (res.status === 401 || (data.error && data.error.toLowerCase().includes('contrase'))) {
              throw new Error('Contraseña Incorrecta');
            }
            throw new Error(data.error || 'Contraseña Incorrecta');
          }
          if (data.user) {
            authUser = data.user;
          }
        }
      } catch (apiErr: any) {
        if (apiErr.message === 'Contraseña Incorrecta') {
          throw apiErr;
        }
        // If network or static hosting on Vercel returns HTML, use client-side persistent auth
      }

      // 2. Client-side fallback authentication & registration (resilient for Vercel)
      if (!authUser) {
        const storedUsersRaw = localStorage.getItem('kase_registered_users');
        const registeredMap: Record<string, any> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
        const isAdmin = isUserSuperAdmin({ email: cleanEmail });

        if (isAdmin) {
          if (!isValidAdminCredentials(cleanEmail, cleanPass)) {
            throw new Error('Contraseña Incorrecta');
          }
          authUser = {
            id: 'kathy_super_admin',
            name: 'Kathy Seba (Super Admin)',
            email: 'kathyseba2020@gmail.com',
            role: 'super_admin',
            createdAt: new Date().toISOString(),
            acquisitionSource: 'direct_organic',
          };
          registeredMap[cleanEmail] = { ...authUser, password: ADMIN_PASSWORD };
          localStorage.setItem('kase_registered_users', JSON.stringify(registeredMap));
        } else if (authMode === 'login') {
          const existing = registeredMap[cleanEmail];
          if (existing) {
            if (existing.password && existing.password !== cleanPass) {
              throw new Error('Contraseña Incorrecta');
            }
            authUser = {
              id: existing.id,
              name: existing.name,
              email: existing.email,
              role: existing.role || 'client',
              createdAt: existing.createdAt,
              acquisitionSource: existing.acquisitionSource || 'direct_organic',
            };
          } else {
            // Register smoothly if logging in first time
            authUser = {
              id: `usr_${Math.random().toString(36).substring(2, 9)}`,
              name: cleanEmail.split('@')[0],
              email: cleanEmail,
              role: 'client',
              createdAt: new Date().toISOString(),
              acquisitionSource: 'direct_organic',
            };
            registeredMap[cleanEmail] = { ...authUser, password: cleanPass };
            localStorage.setItem('kase_registered_users', JSON.stringify(registeredMap));
          }
        } else {
          // Register mode
          const existing = registeredMap[cleanEmail];
          if (existing && existing.password && existing.password !== cleanPass) {
            throw new Error('Contraseña Incorrecta');
          }
          authUser = {
            id: existing?.id || `usr_${Math.random().toString(36).substring(2, 9)}`,
            name: (name.trim() || cleanEmail.split('@')[0]),
            email: cleanEmail,
            role: 'client',
            createdAt: existing?.createdAt || new Date().toISOString(),
            acquisitionSource: 'direct_organic',
          };
          registeredMap[cleanEmail] = { ...authUser, password: cleanPass };
          localStorage.setItem('kase_registered_users', JSON.stringify(registeredMap));
        }
      }

      if (authUser) {
        // Remember this specific account on this device
        const deviceData = { email: authUser.email, name: authUser.name, role: authUser.role };
        localStorage.setItem('kase_device_account', JSON.stringify(deviceData));
        localStorage.setItem('kase_current_user', JSON.stringify(authUser));
        setDeviceAccount(deviceData);
        onLoginSuccess(authUser);
        onGoToDashboard();
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('contrase')) {
        setError('Contraseña Incorrecta');
      } else if (err.message === 'Contraseña Incorrecta') {
        setError('Contraseña Incorrecta');
      } else {
        setError('Contraseña Incorrecta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResumeDeviceAccount = async () => {
    if (!deviceAccount) return;
    setLoading(true);
    setError(null);
    try {
      const user: User = {
        id: deviceAccount.role === 'super_admin' ? 'kathy_super_admin' : `usr_${deviceAccount.email.replace(/[^a-z0-9]/gi, '_')}`,
        name: deviceAccount.name,
        email: deviceAccount.email,
        role: deviceAccount.role as 'super_admin' | 'client',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('kase_current_user', JSON.stringify(user));
      onLoginSuccess(user);
      onGoToDashboard();
    } catch {
      setError('Contraseña Incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* HERO SECTION WITH EMBEDDED AUTH FORM */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Value Proposition & Clear Explanation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Plataforma 100% Autónoma de Captación y Ventas B2B</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Consigue Clientes Reales y Ventas en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200">Piloto Automático</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              KaSe es la suite de marketing digital que conecta tu producto, web o negocio directamente con <strong className="text-white">empresarios, profesionales y compradores con alto poder adquisitivo</strong>. Sin perder tiempo buscando prospectos manualmente: nuestros motores autónomos trabajan por ti 24/7 y se <strong className="text-emerald-400">apagan de forma automática</strong> en el instante exacto en que alcanzan la meta que contrataste.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-white">Prospectos de Alto Poder Adquisitivo</h2>
                  <p className="text-[11px] text-neutral-400">
                    Filtramos rigurosamente el tráfico para atraer exclusivamente a decisores, ejecutivos y compradores con capacidad real de pago.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-white">Apagado Exacto por Enlace Puente</h2>
                  <p className="text-[11px] text-neutral-400">
                    El Enlace Puente KaSe contabiliza cada usuario derivado a tu web. Cumplida la meta contratada, los motores se frenan de inmediato.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-white">Cobro Seguro Mercado Pago</h2>
                  <p className="text-[11px] text-neutral-400">
                    Tarifas claras mensuales acreditadas directamente a tu cuenta de Mercado Pago Uruguay sin sorpresas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-white">Cumplimiento en 30 Días</h2>
                  <p className="text-[11px] text-neutral-400">
                    8 motores operando en paralelo con colas inteligentes y protección anti-baneo para entregar tus resultados a tiempo.
                  </p>
                </div>
              </div>
            </div>

            {/* Public Quick Access Buttons: Reseñas, ¿Cómo Funciona? & Instalar App */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              {onGoToReviews && (
                <button
                  type="button"
                  onClick={onGoToReviews}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9 / 5.0</span>
                  <span className="text-neutral-400">· Reseñas Clientes</span>
                  <span className="text-emerald-400 font-semibold ml-1">Ver →</span>
                </button>
              )}

              {onGoToGuide && (
                <button
                  type="button"
                  onClick={onGoToGuide}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">¿Cómo Funciona?</span>
                  <span className="text-cyan-400 font-semibold ml-0.5">→</span>
                </button>
              )}

              {onGoToModules && (
                <button
                  type="button"
                  onClick={onGoToModules}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Módulos (8)</span>
                  <span className="text-emerald-400 font-semibold ml-0.5">→</span>
                </button>
              )}

              {/* DEDICATED FIXED PWA INSTALL BUTTON FOR HOME */}
              {onOpenInstallModal && (
                <button
                  type="button"
                  onClick={onOpenInstallModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  <span>📲</span>
                  <span>Instalar App en Celular / PC</span>
                </button>
              )}

              {/* DIRECT ACCESS TO KASI AI FROM HERO */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('kase-open-kasi'));
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-500/10"
              >
                <span>🤖</span>
                <span>Chatear con KaSi (IA)</span>
              </button>
            </div>

            {/* Quick Actions if already logged in */}
            {currentUser && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    {(currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 font-mono">Sesión iniciada como:</div>
                    <div className="text-sm font-bold text-white">{currentUser.name || 'Usuario'} ({currentUser.email || ''})</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {isUserSuperAdmin(currentUser) && onRequestOneDollarCheckout && (
                    <button
                      type="button"
                      onClick={onRequestOneDollarCheckout}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      title="Probar pasarela real de Mercado Pago con $1.00 USD"
                    >
                      <span>💳</span>
                      <span>Probar MP $1 USD</span>
                    </button>
                  )}
                  <button
                    onClick={onGoToDashboard}
                    className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ir a Mi Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenNewCampaign}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    + Nueva Campaña
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Embedded Free Signup / Login Card (Product-Led Growth) */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              {/* Header of Auth Box */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {currentUser ? 'Cuenta Conectada' : authMode === 'register' ? 'Crear Cuenta Gratuita' : 'Iniciar Sesión'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {currentUser 
                      ? 'Ya tienes acceso libre a todos los motores' 
                      : 'Acceso inmediato al dashboard de campañas'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {!currentUser ? (
                <>
                  {/* Tab Selector */}
                  <div className="flex p-1 bg-black rounded-lg border border-neutral-800 mb-5">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setError(null); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        authMode === 'register' 
                          ? 'bg-emerald-400 text-black font-bold' 
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Registrarse Gratis
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setError(null); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        authMode === 'login' 
                          ? 'bg-emerald-400 text-black font-bold' 
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Nombre completo o Empresa
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej: Kathy Seba o Mi Negocio Digital"
                          className="w-full bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu-correo@empresa.com"
                        className="w-full bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>Procesando...</span>
                      ) : (
                        <>
                          <span>{authMode === 'register' ? 'Crear Cuenta Gratuita y Entrar' : 'Ingresar a Mi Cuenta'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Device-Specific Quick Access (ONLY for this device's own registered account) */}
                  {deviceAccount && (
                    <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
                      <p className="text-[11px] text-neutral-400 mb-1.5">
                        Cuenta guardada en este dispositivo:
                      </p>
                      <button
                        type="button"
                        onClick={handleQuickResumeDeviceAccount}
                        disabled={loading}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer"
                      >
                        ⚡ Continuar como {deviceAccount.role === 'super_admin' ? 'Administradora Kathy Seba' : `${deviceAccount.name} (${deviceAccount.email})`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Authenticated state inside card */
                <div className="space-y-4">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                    <div className="text-[11px] text-neutral-400 font-mono">Usuario conectado:</div>
                    <div className="text-sm font-bold text-white">{currentUser.name}</div>
                    <div className="text-xs text-emerald-400 font-mono">{currentUser.email}</div>
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {currentUser.role === 'super_admin' ? 'Super Administrador Principal' : 'Cliente Registrado'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onGoToDashboard}
                    className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Abrir Mi Dashboard de Campañas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenNewCampaign}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>+ Crear Nueva Campaña</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EXPLICACIÓN EN PALABRAS SENCILLAS (CERO PALABRAS DIFÍCILES) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Claridad Total y Transparencia
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Cómo Funciona KaSe? Explicado Sin Palabras Raras
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Todo el sistema está pensado para que tú no tengas que hacer trabajo manual. Tú pones la meta y KaSe hace el resto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Eliges tu Objetivo</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Seleccionas si quieres nuevos usuarios registrados, vender planes caros de tu web, seguidores reales, likes o vistas en YouTube.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Filtro Psicográfico de Compradores</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Le indicas a la plataforma el rango de precios de tus planes o servicios. Los motores de KaSe descartan visitantes no cualificados y dirigen la captación exclusivamente hacia usuarios con alto poder adquisitivo y capacidad de compra comprobada.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-mono font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Enlace Puente Inteligente</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Cero instalaciones de código o scripts. El Enlace Puente enruta el tráfico de los 8 motores y contabiliza automáticamente cada usuario real derivado a tu web.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-mono font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Apagado Exacto Automático</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Si compraste 2,000 registros, exactamente en el registro #2,000 los motores se apagan automáticamente. No se pasa ni se cobra de más.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: LOS 6 TIPOS DE CAMPAÑAS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Soluciones a Medida
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              6 Tipos de Campañas Autónomas Disponibles
            </h2>
          </div>
          <button
            onClick={onOpenNewCampaign}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Crear Campaña Ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPAIGN_TYPES_CATALOG.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400">
                    {cat.id === 'user_registrations' && <Users className="w-5 h-5 text-emerald-400" />}
                    {cat.id === 'plan_sales' && <CreditCard className="w-5 h-5 text-cyan-400" />}
                    {cat.id === 'social_followers' && <UserCheck className="w-5 h-5 text-sky-400" />}
                    {cat.id === 'likes_engagement' && <Heart className="w-5 h-5 text-rose-400" />}
                    {cat.id === 'comments_reviews' && <MessageSquareText className="w-5 h-5 text-amber-400" />}
                    {cat.id === 'youtube_growth' && <Youtube className="w-5 h-5 text-red-500" />}
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    ${cat.pricePerUnitEstimateUSD} USD / {cat.unitLabel}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{cat.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {cat.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Meta estándar:</span>
                <span className="text-white font-bold">{cat.defaultTarget.toLocaleString()} {cat.unitLabelPlural}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

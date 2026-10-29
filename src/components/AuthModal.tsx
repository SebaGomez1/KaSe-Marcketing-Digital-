import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, CheckCircle2, Zap, WifiOff } from 'lucide-react';
import { User, isUserSuperAdmin, isValidAdminCredentials, ADMIN_PASSWORD } from '../types/growth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User) => void;
  isOnline?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  isOnline = true,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectiveOnline = isOnline && (typeof navigator === 'undefined' || navigator.onLine);

  // Device-specific remembered account
  const deviceAccount = (() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('kase_device_account') : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveOnline) {
      setError('❌ Sin conexión a internet. Se requiere conexión activa a internet para iniciar sesión o registrarse.');
      return;
    }

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

    setLoading(true);
    setError(null);

    const isAdmin = isUserSuperAdmin({ email: cleanEmail });

    // Pre-check for admin: If entering an admin account with wrong password, throw immediately
    if (isAdmin && !isValidAdminCredentials(cleanEmail, cleanPass)) {
      setError('Contraseña Incorrecta');
      setLoading(false);
      return;
    }

    try {
      let authUser: User | null = null;
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: cleanEmail, password: cleanPass }),
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
      } else {
        throw new Error('Sin conexión con el servidor central de KaSe');
      }

      // STRICT: No offline fallback allowed. If authUser was not returned, fail.
      if (!authUser) {
        throw new Error('No fue posible autenticar. Verifica tu conexión a internet.');
      }

      if (mode === 'register') {
        // Registrar paso por el siguiente enrutador puente y sumar a usuarios registrados
        fetch('/api/bridge/track-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authUser.email, name: authUser.name, userId: authUser.id }),
        }).catch(() => {});
      }
      localStorage.setItem('kase_device_account', JSON.stringify({ email: authUser.email, name: authUser.name, role: authUser.role }));
      localStorage.setItem('kase_current_user', JSON.stringify(authUser));
      onAuthSuccess(authUser);
      onClose();
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('contrase')) {
        setError('Contraseña Incorrecta');
      } else if (err.message && (err.message.includes('conexión') || err.message.includes('internet') || err.name === 'TypeError')) {
        setError('❌ Sin conexión a internet. No se puede iniciar sesión fuera de línea. Por favor verifica tu red.');
      } else {
        setError(err.message || 'Contraseña Incorrecta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceAccountQuickLogin = () => {
    if (!effectiveOnline) {
      setError('❌ Sin conexión a internet. Se requiere conexión activa para iniciar sesión.');
      return;
    }
    if (!deviceAccount) return;
    const user: User = {
      id: deviceAccount.role === 'super_admin' ? 'kathy_super_admin' : `usr_${deviceAccount.email.replace(/[^a-z0-9]/gi, '_')}`,
      name: deviceAccount.name,
      email: deviceAccount.email,
      role: deviceAccount.role as 'super_admin' | 'client',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('kase_current_user', JSON.stringify(user));
    onAuthSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-[#121212] border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl my-auto text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Iniciar Sesión en KaSe' : 'Registro Gratuito'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {mode === 'login' ? 'Accede a tu cuenta y campañas' : 'Crea tu cuenta libre para acceder al dashboard'}
            </p>
          </div>
        </div>

        {/* Device-specific remembered account (only on the device where that user logged in) */}
        {deviceAccount && (
          <div className="my-3 p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1.5 text-[11px]">
            <span className="text-neutral-400 font-semibold block">Cuenta guardada en este dispositivo:</span>
            <button
              type="button"
              onClick={handleDeviceAccountQuickLogin}
              className="w-full text-left px-2.5 py-1.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Continuar como: <strong>{deviceAccount.role === 'super_admin' ? 'Administradora Kathy Seba' : `${deviceAccount.name} (${deviceAccount.email})`}</strong></span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">Entrar ⚡</span>
            </button>
          </div>
        )}

        {!effectiveOnline && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-600/60 rounded-xl text-rose-200 text-xs mb-3 flex items-center gap-2 font-medium">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span>Sin conexión a internet. La autenticación está bloqueada hasta que te reconectes.</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-xs mb-3 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Nombre Completo *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Tu nombre o empresa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Correo Electrónico *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            {isUserSuperAdmin({ email }) && (
              <span className="text-[11px] text-emerald-400 mt-1 block font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Privilegios de Super Administrador Global detectados.
              </span>
            )}
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !effectiveOnline}
            className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all mt-4 flex items-center justify-center gap-1.5 ${
              !effectiveOnline 
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60' 
                : 'bg-emerald-400 hover:bg-emerald-300 text-black glow-emerald cursor-pointer'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {!effectiveOnline 
                ? 'Sin Conexión a Internet' 
                : loading 
                ? 'Validando...' 
                : mode === 'login' 
                ? 'Iniciar Sesión' 
                : 'Crear Cuenta Gratuita'}
            </span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <span>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Regístrate gratis
              </button>
            </span>
          ) : (
            <span>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Inicia sesión
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

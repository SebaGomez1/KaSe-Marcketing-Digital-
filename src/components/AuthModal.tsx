import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { User } from '../types/growth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error de autenticación');
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al conectar');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickEmail: string, quickName: string) => {
    setEmail(quickEmail);
    setName(quickName);
    setPassword('kase2026Secure!');
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

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Iniciar Sesión en KaSe' : 'Registro Gratuito (PLG)'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {mode === 'login' ? 'Accede a tu cuenta y campañas' : 'Crea tu cuenta libre para explorar los 8 módulos'}
            </p>
          </div>
        </div>

        {/* Quick Credentials Helpers */}
        <div className="my-3 p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1.5 text-[11px]">
          <span className="text-neutral-400 font-semibold block">Acceso Rápido / Pruebas de Roles:</span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('kathyseba2020@gmail.com', 'Kathy Seba')}
              className="text-left px-2.5 py-1.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>👑 Super Administrador Oficial: <strong>kathyseba2020@gmail.com</strong></span>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">Llenar</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('cliente@startup.com', 'Cliente Demo')}
              className="text-left px-2.5 py-1.5 rounded bg-neutral-800/80 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>👤 Cliente Estándar: <strong>cliente@startup.com</strong></span>
              <span className="font-mono text-[10px] text-neutral-400 font-bold">Llenar</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-xs mb-3">
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
            {email.trim().toLowerCase() === 'kathyseba2020@gmail.com' && (
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
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-all glow-emerald cursor-pointer mt-4 flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{loading ? 'Validando...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}</span>
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

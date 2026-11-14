import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, CheckCircle2, Zap, WifiOff } from 'lucide-react';
import { User, isUserSuperAdmin, isValidAdminCredentials, ADMIN_PASSWORD } from '../types/growth';
import { supabase } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User) => void;
  onSuccess?: () => void;
  isOnline?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSuccess,
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

    // Privacidad: nunca guardar ni recordar cuentas automáticamente en el dispositivo sin permiso
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('kase_device_account');
    } catch {}
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

    const isAdmin = isUserSuperAdmin({ email: cleanEmail });
    if (isAdmin) {
      if (!isValidAdminCredentials(cleanEmail, cleanPass)) {
        setError('Contraseña incorrecta');
        return;
      }
      const adminUser: User = {
        id: cleanEmail === 'kathyseba2020@gmail.com' ? 'kathy_super_admin' : 'usr_superadmin_kase',
        name: cleanEmail === 'kathyseba2020@gmail.com' ? 'Kathy Seba (Super Admin)' : 'KaSe Administrador',
        email: cleanEmail,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        acquisitionSource: 'direct_organic',
      };
      onAuthSuccess(adminUser);
      onSuccess?.();
      onClose();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!supabase) {
        throw new Error('Servicio de autenticación no disponible.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes('invalid login') || msg.includes('credentials')) {
          throw new Error('Correo o contraseña incorrectos.');
        }
        throw new Error(authError.message);
      }

      if (!data?.user) {
        throw new Error('No se pudo iniciar sesión. Verifica tus credenciales.');
      }

      // Intentar leer perfil en tabla users (si no existe aún, usar datos de Auth sin bloquear)
      let profileName = data.user.user_metadata?.name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
      let profileRole: 'super_admin' | 'client' = 'client';
      let profileCreated = data.user.created_at || new Date().toISOString();

      try {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userData) {
          profileName = userData.name || userData.full_name || profileName;
          profileRole = userData.role === 'super_admin' ? 'super_admin' : 'client';
          profileCreated = userData.created_at || profileCreated;
        }
      } catch {}

      const authUser: User = {
        id: data.user.id,
        name: profileName,
        email: data.user.email || cleanEmail,
        role: profileRole,
        createdAt: profileCreated,
      };

      onAuthSuccess(authUser);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setError('Requiere conexión a internet.');
      } else {
        setError(err?.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      return handleLoginSubmit(e);
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine && !effectiveOnline) {
      setError('Sin conexión a internet. Se requiere conexión activa para registrarse.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Bloquear registro con correo de administrador
    if (isUserSuperAdmin({ email: cleanEmail })) {
      setMode('login');
      setError('Esta cuenta de administrador ya existe. Inicia sesión con tu contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Servicio de registro no disponible.');
      }

      // 1. Verificar si el correo ya existe en tabla users antes de registrar
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser) {
        setMode('login');
        setError('Este correo ya tiene una cuenta creada. Inicia sesión con tu contraseña.');
        setLoading(false);
        return;
      }

      // 2. Crear cuenta real en Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: { name: cleanName, full_name: cleanName },
        },
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
          setMode('login');
          throw new Error('Este correo ya está registrado. Por favor inicia sesión.');
        }
        throw new Error(signUpError.message);
      }

      // Supabase devuelve identities vacío si el email ya existía y está confirmando
      if (signUpData?.user && Array.isArray(signUpData.user.identities) && signUpData.user.identities.length === 0) {
        setMode('login');
        throw new Error('Este correo ya tiene una cuenta registrada. Inicia sesión.');
      }

      if (!signUpData?.user) {
        throw new Error('No se pudo completar el registro. Intenta nuevamente.');
      }

      // 3. Guardar perfil en tabla users de Supabase
      try {
        await supabase.from('users').upsert([
          {
            id: signUpData.user.id,
            name: cleanName,
            email: cleanEmail,
            role: 'client',
            created_at: new Date().toISOString(),
          },
        ]);
      } catch {}

      const authUser: User = {
        id: signUpData.user.id,
        name: cleanName,
        email: cleanEmail,
        role: 'client',
        createdAt: new Date().toISOString(),
      };

      fetch('/api/bridge/track-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authUser.email, name: authUser.name, userId: authUser.id }),
      }).catch(() => {});

      onAuthSuccess(authUser);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
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

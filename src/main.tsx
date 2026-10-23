import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Crash caught by ErrorBoundary:', error, errorInfo);
    // Security in production: Automatically clear sensitive session tokens on crash
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('kase_current_user');
      }
    } catch (e) {
      // ignore
    }
  }

  private handleResetToLogin = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = '/';
      }
    } catch (e) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 p-4 sm:p-6 flex flex-col items-center justify-center text-center font-sans space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 text-2xl shadow-xl shadow-black/80">
            ⚡
          </div>
          
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              KaSe - Marketing Digital
            </h1>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Se produjo una interrupción inesperada al renderizar la vista. Por motivos de seguridad, la sesión activa ha sido desvinculada.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleResetToLogin}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Reiniciar e Iniciar Sesión de Forma Segura
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs rounded-xl border border-neutral-700 transition-colors cursor-pointer"
            >
              Recargar Página
            </button>
          </div>

          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="p-3 bg-black/90 rounded-xl border border-neutral-800 text-neutral-400 font-mono text-[10px] text-left max-w-lg overflow-x-auto whitespace-pre-wrap mt-4">
              {this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

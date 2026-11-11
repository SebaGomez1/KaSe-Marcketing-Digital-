import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[KaSe Error Boundary Caught]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-[#141414] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-2xl">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Protección Activa de Interfaz
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                KaSe ha interceptado un error de renderizado para evitar que la pantalla quede en blanco. Tus campañas y datos permanecen totalmente seguros.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-left">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">Detalle técnico:</span>
                <span className="text-xs text-neutral-300 font-mono break-all">{this.state.error.message}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Recargar Aplicación</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

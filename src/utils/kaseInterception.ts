export interface KaseHelpRequest {
  errorModule: string;
  errorMessage: string;
  failedModuleId?: string;
  missingApis?: string[];
  suggestedAction?: string;
}

type KaseListener = (req: KaseHelpRequest) => void;

class KaseInterceptionBus {
  private listeners: KaseListener[] = [];

  subscribe(listener: KaseListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  trigger(req: KaseHelpRequest) {
    this.listeners.forEach((l) => {
      try {
        l(req);
      } catch (e) {
        console.warn('Error in Kase listener:', e);
      }
    });
  }
}

export const kaseInterceptionBus = new KaseInterceptionBus();

export function triggerKaseProactiveHelp(req: KaseHelpRequest) {
  kaseInterceptionBus.trigger(req);
}

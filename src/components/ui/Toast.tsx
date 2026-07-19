"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
}

interface ToastContextValue {
  push: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    counter.current += 1;
    const id = `t-${counter.current}-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:top-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-in-right glass-strong card-shadow pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3"
          >
            {t.emoji && <span className="text-xl">{t.emoji}</span>}
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{t.title}</p>
              {t.description && <p className="text-xs text-[var(--text-secondary)]">{t.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { push: () => {} };
  }
  return ctx;
}

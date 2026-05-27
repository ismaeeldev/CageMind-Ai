"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: "info" | "success" | "error", duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "info" | "success" | "error" = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between w-full p-4 rounded-xl border bg-black/90 text-white backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-5 duration-300 border-primary/40"
          >
            <div className="flex items-center gap-3">
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-primary shrink-0" />}
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="text-sm font-semibold tracking-wide leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-4 p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useCallback, useState, FC, ReactNode } from "react";

type ToastType = "info" | "success" | "error";
type ToastItem = { id: string; message: string; type?: ToastType; ttl?: number };

const ToastContext = createContext<{
  show: (message: string, type?: ToastType, ttl?: number) => void;
} | null>(null);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "info", ttl = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const t: ToastItem = { id, message, type, ttl };
    setItems((s) => [...s, t]);
    // remove after ttl + small buffer
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), ttl + 200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Always render container so SSR tree matches client tree (server: empty list) */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2" aria-live="polite" role="status">
        {items.map((it) => (
          <div
            key={it.id}
            className={`max-w-xs px-3 py-2 rounded shadow text-sm ${
              it.type === "success" ? "bg-green-600 text-white" : it.type === "error" ? "bg-red-600 text-white" : "bg-slate-800 text-white"
            }`}
          >
            {it.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
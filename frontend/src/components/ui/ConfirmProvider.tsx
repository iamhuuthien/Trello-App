"use client";

import React, { useCallback, useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "@/context/ToastContext";
import Input from "./Input";
import Button from "./Button";

type PromptOptions = { placeholder?: string; defaultValue?: string };

let globalShowConfirm: ((message: string, opts?: { title?: string; confirmLabel?: string; cancelLabel?: string }) => Promise<boolean>) | null = null;
let globalShowPrompt: ((message: string, opts?: PromptOptions & { title?: string; confirmLabel?: string; cancelLabel?: string }) => Promise<string | null>) | null = null;
let globalShowAlert: ((message: string) => void) | null = null;

export function appConfirm(message: string, opts?: { title?: string; confirmLabel?: string; cancelLabel?: string }) {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (globalShowConfirm) return globalShowConfirm(message, opts);
  return Promise.resolve(window.confirm(message));
}

export function appPrompt(message: string, opts?: PromptOptions & { title?: string; confirmLabel?: string; cancelLabel?: string }) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (globalShowPrompt) return globalShowPrompt(message, opts);
  try {
    const r = window.prompt(message, opts?.defaultValue ?? "");
    return Promise.resolve(r);
  } catch {
    return Promise.resolve(null);
  }
}

export function appAlert(message: string) {
  if (typeof window === "undefined") return;
  if (globalShowAlert) return globalShowAlert(message);
  window.alert(message);
}

export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; resolve?: (b: boolean) => void; title?: string; confirmLabel?: string; cancelLabel?: string } | null>(null);

  // promptState now only tracks modal open + meta; input value is separate to avoid stale closures
  const [promptState, setPromptState] = useState<{ open: boolean; message: string; resolve?: (v: string | null) => void; title?: string; confirmLabel?: string; cancelLabel?: string; placeholder?: string } | null>(null);
  const [promptValue, setPromptValue] = useState<string>("");

  useEffect(() => {
    globalShowConfirm = async (message, opts) => {
      return new Promise<boolean>((resolve) => {
        setConfirmState({ open: true, message, resolve, title: opts?.title, confirmLabel: opts?.confirmLabel, cancelLabel: opts?.cancelLabel });
      });
    };
    globalShowPrompt = async (message, opts) => {
      return new Promise<string | null>((resolve) => {
        setPromptValue(opts?.defaultValue ?? "");
        setPromptState({ open: true, message, resolve, value: opts?.defaultValue ?? "", title: opts?.title, confirmLabel: opts?.confirmLabel, cancelLabel: opts?.cancelLabel, placeholder: opts?.placeholder });
      });
    };
    globalShowAlert = (message) => {
      toast.addToast ? toast.addToast(String(message), "info") : toast.show?.(String(message), "info");
    };

    return () => {
      globalShowConfirm = null;
      globalShowPrompt = null;
      globalShowAlert = null;
    };
  }, [toast]);

  const handleConfirm = useCallback((ok: boolean) => {
    if (!confirmState) return;
    confirmState.resolve?.(ok);
    setConfirmState(null);
  }, [confirmState]);

  const handlePrompt = useCallback((val: string | null) => {
    if (!promptState) return;
    promptState.resolve?.(val);
    setPromptState(null);
    setPromptValue("");
  }, [promptState]);

  return (
    <>
      {children}

      <ConfirmModal
        isOpen={!!confirmState?.open}
        title={confirmState?.title ?? "Confirm"}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel ?? "Confirm"}
        cancelLabel={confirmState?.cancelLabel ?? "Cancel"}
        loading={false}
        onClose={() => handleConfirm(false)}
        onConfirm={() => handleConfirm(true)}
      />

      {promptState?.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-5 max-w-md w-full text-slate-900 shadow-lg">
            <h3 className="text-lg font-semibold">{promptState.title ?? "Input"}</h3>
            <div className="mt-2 text-sm text-slate-700">{promptState.message}</div>

            <div className="mt-3">
              <Input
                autoFocus
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder={promptState.placeholder ?? "New column"}
                className="text-slate-900 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => handlePrompt(null)}>
                {promptState.cancelLabel ?? "Cancel"}
              </Button>

              <Button
                variant="primary"
                onClick={() => handlePrompt(promptValue ?? "")}
                disabled={!(promptValue && String(promptValue).trim().length > 0)}
              >
                {promptState.confirmLabel ?? "OK"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
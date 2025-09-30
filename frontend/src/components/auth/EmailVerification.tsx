"use client";

import React, { useState } from "react";
import { Key, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  email: string;
  countdown: number;
  loading?: boolean;
  onSubmit: (code: string) => Promise<void>;
  onResend: () => void;
  onBack: () => void;
}

export default function EmailVerification({ email, countdown, loading = false, onSubmit, onResend, onBack }: Props) {
  const [code, setCode] = useState("");

  return (
    <div className="w-full">
      <div className="mb-3 text-sm text-slate-700">
        We sent a sign-in code to <span className="font-medium text-slate-900">{email}</span>.
      </div>

      <label className="block text-sm mb-2">
        <div className="mb-1 text-xs text-slate-600">Sign-in code</div>
        <div className="flex items-center gap-0">
          <span className="inline-flex items-center px-2 py-1.5 rounded-l-md bg-white border border-r-0 border-slate-200 text-slate-600 shadow-sm">
            <Key className="w-4 h-4" />
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 rounded-r-md border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Sign-in code"
            onKeyDown={(e) => { if (e.key === "Enter") onSubmit(code); }}
            disabled={loading}
          />
        </div>
      </label>

      <div className="flex items-center justify-between mt-3 gap-2">
        <div className="text-sm text-slate-500">
          Didn't receive?{" "}
          <button
            onClick={onResend}
            disabled={countdown > 0}
            className="text-indigo-600 hover:underline disabled:text-slate-300"
            aria-disabled={countdown > 0}
            title={countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
          </button>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack} disabled={loading} aria-label="Change email">
            Back
          </Button>

          <Button
            variant="primary"
            onClick={() => onSubmit(code)}
            disabled={loading || !code.trim()}
            aria-label="Submit code"
          >
            {loading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Verify</> : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
}
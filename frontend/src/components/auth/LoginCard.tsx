"use client";

import React, { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import EmailVerification from "./EmailVerification";

interface Props {
  className?: string;
}

export default function LoginCard({ className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    let t: number | undefined;
    if (countdown > 0) {
      t = window.setTimeout(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [countdown]);

  const handleSend = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.show?.("Please enter a valid email", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.signup(email);
      if (res?.ok) {
        setSent(true);
        setCountdown(60);
        toast.show?.("Sign-in code sent. Check your email.", "success");
      } else {
        toast.show?.((res as any)?.message || "Failed to send code", "error");
      }
    } catch (err: any) {
      console.error(err);
      toast.show?.(err?.message || "Failed to send code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (code: string) => {
    if (!code || !code.trim()) {
      toast.show?.("Enter the code you received", "error");
      return;
    }
    setSigninLoading(true);
    try {
      const r = await auth.signin(email, code.trim());
      if (r.ok) {
        toast.show?.("Signed in", "success");
        router.replace("/");
      } else {
        toast.show?.(r.error || "Signin failed", "error");
      }
    } catch (err: any) {
      console.error(err);
      toast.show?.(err?.message || "Signin failed", "error");
    } finally {
      setSigninLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSend();
  };

  return (
    <div className={`w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow">
          TA
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Welcome — Sign in</h1>
          <p className="text-sm text-slate-500">Sign in with your email to continue</p>
        </div>
      </div>

      <div className="space-y-4">
        {!sent && (
          <>
            <label className="block text-sm">
              <div className="mb-1 text-xs text-slate-600">Email</div>
              <div className="flex items-center gap-0">
                <span className="inline-flex items-center px-2 py-1.5 rounded-l-md bg-white border border-r-0 border-slate-200 text-slate-600 shadow-sm">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-r-md border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  aria-label="Email"
                  disabled={loading}
                />
              </div>
            </label>

            <div className="flex gap-2">
              <Button className="flex-1" variant="primary" onClick={handleSend} disabled={loading}>
                {loading ? <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Sending...</> : "Send sign-in code"}
              </Button>
              <Button variant="ghost" onClick={() => setEmail("")}>Clear</Button>
            </div>
          </>
        )}

        {sent && (
          <EmailVerification
            email={email}
            countdown={countdown}
            loading={signinLoading}
            onSubmit={handleSignin}
            onResend={handleResend}
            onBack={() => setSent(false)}
          />
        )}

        <div className="mt-4 text-center text-sm text-slate-500">
          By signing in you agree to our <a className="text-indigo-600 hover:underline" href="/terms">Terms</a>.
        </div>
      </div>
    </div>
  );
}
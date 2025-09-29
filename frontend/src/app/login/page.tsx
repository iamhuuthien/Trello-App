"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleSend = async () => {
    setLoading(true);
    try {
      await auth.signup(email);
      setSent(true);
    } catch (err) {
      // minimal error handling
      alert((err as Error).message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    setLoading(true);
    try {
      const r = await auth.signin(email, code);
      if (r.ok) {
        router.replace("/");
      } else {
        alert(r.error || "Signin failed");
      }
    } catch (err) {
      alert((err as Error).message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>

        <div className="space-y-3">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          {!sent && (
            <Button onClick={handleSend} className="w-full" disabled={!email || loading}>
              {loading ? "Sending..." : "Send sign-in code"}
            </Button>
          )}

          {sent && (
            <>
              <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleSignin} className="flex-1" disabled={!code || loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <Button variant="secondary" onClick={() => setSent(false)}>
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
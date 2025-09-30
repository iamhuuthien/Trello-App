"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await auth.signup(email);
      if (res.ok) {
        // previewUrl available for Ethereal in dev
        alert("Code sent. Check your email.");
        router.push("/login");
      } else {
        alert("Failed to send code");
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
        <h2 className="text-xl font-semibold mb-4">Sign up / Request sign-in code</h2>
        <div className="space-y-3">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <Button className="w-full" onClick={handleSignup} disabled={!email || loading}>
            {loading ? "Sending..." : "Send sign-in code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
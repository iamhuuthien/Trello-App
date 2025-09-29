"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API backend để xác thực, nhận token, v.v.
    login({ name: name || "Người dùng", email });
    router.replace("/");
  };

  if (isAuthenticated) {
    // Nếu đã đăng nhập, tránh hiện form (client guard sẽ đổi hướng)
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 rounded"><LogIn className="w-5 h-5 text-slate-600" /></div>
          <h2 className="text-lg font-semibold">Đăng nhập TrelloApp</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên hiển thị" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex justify-end">
            <Button type="submit">Đăng nhập</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
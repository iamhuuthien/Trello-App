"use client";

import React, { createContext, useContext, useEffect, useState, FC, ReactNode } from "react";
import { User } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  signup: (email: string) => Promise<{ ok: boolean; previewUrl?: string }>;
  signin: (email: string, code: string) => Promise<{ ok: boolean; token?: string; error?: string }>;
  logout: () => void;
  updateProfile?: (payload: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Start with null on both server and client to keep SSR output stable
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // After mount, hydrate from localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("trello_user");
      if (raw) {
        setUser(JSON.parse(raw) as User);
      }
      const savedToken = localStorage.getItem("trello_token");
      if (savedToken) setToken(savedToken);
    } catch (err) {
      // ignore
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  // persist token/user when they change (client-only)
  useEffect(() => {
    try {
      if (token) localStorage.setItem("trello_token", token);
      else localStorage.removeItem("trello_token");
    } catch {}
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("trello_user", JSON.stringify(user));
      else localStorage.removeItem("trello_user");
    } catch {}
  }, [user]);

  const signup = async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.message || "Signup failed");
    }
    const body = await res.json();
    return body;
  };

  const signin = async (email: string, code: string) => {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      return { ok: false, error: payload?.error || "Signin failed" };
    }
    const body = await res.json();
    const t = body.token as string | undefined;
    if (t) {
      setToken(t);
      // keep minimal user shape; real profile should come from API when needed
      setUser({ email, name: email.split("@")[0] });
      return { ok: true, token: t };
    }
    return { ok: false, error: "No token returned" };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // optional updateProfile placeholder (components call updateProfile via useAuth)
  const updateProfile = async (payload: Partial<User>) => {
    setUser((prev) => ({ ...(prev ?? {}), ...payload } as User));
    // if you have backend endpoint, call it here
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, signup, signin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
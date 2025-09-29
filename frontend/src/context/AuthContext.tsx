"use client";

import React, { createContext, useContext, useState, FC, ReactNode } from "react";

interface User {
  name: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => null);
  const isAuthenticated = !!user;

  const login = (u: User) => {
    // TODO: gọi API backend để login, lưu token, v.v.
    setUser(u);
  };

  const logout = () => {
    // TODO: clear token / gọi API logout
    setUser(null);
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
"use client";

import { FC, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ClientGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();

  useEffect(() => {
    // don't run any redirect until auth has been hydrated from localStorage
    if (!initialized) return;

    // if user is on login page and already authenticated -> go home
    if (pathname?.startsWith("/login")) {
      if (isAuthenticated) router.replace("/");
      return;
    }

    // protected routes: if not authenticated after init -> go to /login
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, pathname, router]);

  // while we wait for auth hydration, avoid flashing redirects or content
  if (!initialized) return null;

  // if not authed and not on /login, hide children (redirect in effect)
  if (!isAuthenticated && !pathname?.startsWith("/login")) return null;

  return <>{children}</>;
};

export default ClientGuard;
"use client";

import { FC, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const ClientGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Nếu đang ở trang login thì không redirect ra
    if (pathname === "/login") {
      if (isAuthenticated) {
        router.replace("/");
      }
      return;
    }

    // Nếu không phải /login và chưa auth => redirect tới /login
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Trong lúc chưa xác định auth, tránh flash content: nếu chưa login và không ở /login trả null
  if (!isAuthenticated && pathname !== "/login") return null;

  return <>{children}</>;
};

export default ClientGuard;
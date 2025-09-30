"use client";

import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

const LayoutRenderer: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname() ?? "/";

  // Nếu nằm trong trang login (có thể có /login hoặc /login/...), không bọc AppShell
  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
};

export default LayoutRenderer;
"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const NAV_HEIGHT = 56; // px

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar onMenuToggle={() => setMobileOpen((s) => !s)} collapsed={collapsed} />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />
      <div
        style={{ paddingTop: NAV_HEIGHT }}
        className={`transition-all duration-200 relative z-20 ${collapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
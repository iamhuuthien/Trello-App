"use client";

import { FC, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppShell: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuToggle={() => setSidebarOpen((s) => !s)} />

        <main className="p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-3.5rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
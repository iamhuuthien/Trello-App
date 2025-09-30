// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { FC, useMemo } from "react";
import { FolderKanban, User, Home, LogOut, Grid } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { href: "/boards", label: "Boards", icon: <FolderKanban className="w-5 h-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

const Sidebar: FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const pathname = usePathname() ?? "/";
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-b from-white/60 via-white to-white/60 border-r border-slate-200 shadow-lg">
      <div className="px-4 py-5 flex items-center gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow">
            TA
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">TrelloApp</div>
            <div className="text-xs text-slate-500">Workspaces · Boards</div>
          </div>
        </div>
      </div>

      <nav className="px-2 py-4 flex-1 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-1 rounded-md ${active ? "bg-indigo-100 text-indigo-600" : "text-slate-500 group-hover:text-slate-700"}`}>
                {n.icon}
              </div>
              <span className="text-sm font-medium">{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-medium">
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">{user?.name ?? user?.email ?? "You"}</div>
            <div className="text-xs text-slate-500">Account</div>
          </div>

          <Link href="/profile" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-50 text-slate-700">
            <Grid className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

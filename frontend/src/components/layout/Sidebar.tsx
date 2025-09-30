// components/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  FolderKanban,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

const items = [
  { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { href: "/boards", label: "Boards", icon: <FolderKanban className="w-5 h-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export default function Sidebar({ collapsed = false, onToggle }: Props) {
  const pathname = usePathname() ?? "/";
  const { user } = useAuth();

  return (
    <aside
      className={`hidden md:flex md:flex-col fixed top-14 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-slate-200 shadow-sm overflow-y-auto overflow-x-hidden`}
      aria-hidden={false}
    >
      <div className="relative px-3 pt-4 pb-3 border-b border-slate-100">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : "w-full"}`}>
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold text-white flex-shrink-0`}
            style={!collapsed ? { background: "linear-gradient(135deg,#7c3aed,#8b5cf6)" } : undefined}
            aria-hidden
          >
            TA
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">TrelloApp</div>
              <div className="text-xs text-slate-400 truncate">Workspaces · Boards</div>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
          className="hidden md:inline-flex items-center justify-center absolute top-3 right-0 translate-x-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-transform transform z-20"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-slate-700" /> : <ChevronLeft className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <div className={`p-1 rounded ${active ? "bg-indigo-100 text-indigo-600" : "text-slate-500"}`}>
                {it.icon}
              </div>
              {!collapsed && <span className="text-sm font-medium">{it.label}</span>}

              {collapsed && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 text-white text-xs px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {it.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className={`flex items-center gap-3 ${collapsed ? "flex-col py-2" : ""}`}>
          <div className={`w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-medium`}>
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? user?.email ?? "You"}</div>
              <div className="text-xs text-slate-400">Account</div>
            </div>
          )}

          {!collapsed && (
            <Link href="/profile" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-50 text-slate-700">
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

// components/layout/Sidebar.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  FolderKanban,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RecentBoards from "./RecentBoards";

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
  { href: "/boards", label: "Boards", icon: <FolderKanban className="w-5 h-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export default function Sidebar({ collapsed = false, onToggle }: Props) {
  const pathname = usePathname() ?? "/";
  const { user } = useAuth();

  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    // Subtle one-time nudge to draw attention to the toggle control
    try {
      const shown = sessionStorage.getItem("sidebarNudgeShown");
      if (!shown) {
        setShowNudge(true);
        const t = setTimeout(() => {
          setShowNudge(false);
          sessionStorage.setItem("sidebarNudgeShown", "1");
        }, 2200);
        return () => clearTimeout(t);
      }
    } catch {
      // no-op for environments without sessionStorage
    }
  }, []);

  const activeHref = useMemo(() => {
    if (pathname.startsWith("/boards/")) return "/boards";
    return pathname;
  }, [pathname]);

  return (
    <aside
      className={`hidden md:flex md:flex-col fixed top-14 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      } bg-white border-r border-slate-200 shadow-sm overflow-y-auto overflow-x-hidden`}
      aria-hidden={false}
      aria-label="Sidebar"
    >
      {/* Decorative gradient rail on the edge for better affordance */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/15 via-slate-200 to-violet-500/15" />

      {/* Toggle button: enhanced visibility when collapsed */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand" : "Collapse"}
        className={`hidden md:flex group fixed top-1/2 -translate-y-1/2 rounded-full backdrop-blur border shadow-sm hover:shadow-lg z-50 items-center justify-center relative transition-all duration-300 ${
          collapsed 
            ? 'w-10 h-10 bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500 shadow-lg ring-2 ring-indigo-500/20' 
            : 'w-8 h-8 bg-white/95 border-slate-200 ring-1 ring-indigo-500/10 hover:shadow-md'
        }`}
        style={{ 
          right: collapsed ? '-20px' : '-32px',
          left: collapsed ? '44px' : '232px'
        }}
      >
        {showNudge && (
          <>
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-md pointer-events-none" />
            <span className="absolute inset-0 rounded-full ring-2 ring-indigo-400/30 animate-ping pointer-events-none" />
          </>
        )}
        <span className={`inline-flex items-center justify-center rounded-full shadow-sm transition-all ${
          collapsed 
            ? 'w-6 h-6 bg-white/20 text-white' 
            : 'w-5 h-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
        }`}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-3 h-3" />}
        </span>
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-800 text-white text-xs px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          {collapsed ? "Expand" : "Collapse"}
        </span>
      </button>

      {/* Content */}
      <nav className="flex-1 px-2 pb-4">
        {/* Create board CTA */}
        <div className="px-1 pt-0 mb-4">
          {collapsed ? (
            <Link
              href="/boards/new"
              title="Create board"
              className="group relative flex items-center justify-center w-full h-9 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Create board</span>
            </Link>
          ) : (
            <Link
              href="/boards/new"
              className="group flex items-center gap-2 justify-center w-full px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" /> Create board
            </Link>
          )}
        </div>

        {/* Primary links */}
        <div className="mb-4">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Navigation</div>
          )}
          <div className="space-y-1">
            {navItems.map((it) => {
              const active = activeHref === it.href || activeHref.startsWith(it.href + "/");
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
          </div>
        </div>

        {/* Recent boards */}
        <div>
          <div className={`flex items-center px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed ? (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent boards</span>
            ) : (
              <Clock className="w-4 h-4 text-slate-400" />
            )}
            {!collapsed && (
              <Link href="/boards" className="text-xs text-indigo-600 hover:underline">View all</Link>
            )}
          </div>
          {!collapsed ? (
            <div className="mt-2 px-1">
              <RecentBoards />
            </div>
          ) : null}
        </div>
      </nav>

      {/* Account footer */}
      <div className="px-3 py-4 border-t border-slate-100 bg-white/60 backdrop-blur-sm">
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
            <Link href="/profile" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-50 text-slate-700" title="Settings">
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

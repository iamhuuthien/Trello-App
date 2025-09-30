// components/layout/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Menu, Search, Plus, Bell, Sun } from "lucide-react";
import UserMenu from "./UserMenu";

interface Props {
  onMenuToggle?: () => void;
  collapsed?: boolean;
  // onCollapseToggle removed — sidebar handles collapse only
}

export default function Navbar({ onMenuToggle, collapsed = false }: Props) {
  const NAV_HEIGHT = 56;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 backdrop-blur-sm border-b border-slate-200"
      style={{ height: NAV_HEIGHT }}
    >
      <div className={`h-full px-4 flex items-center gap-4`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            aria-label="Toggle sidebar (mobile)"
            className="p-2 rounded-md bg-white shadow-sm hover:shadow-md transition md:hidden"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <Link href="/" aria-label="TrelloApp home" className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#8b5cf6)" }}
              aria-hidden
            >
              <span className="text-sm leading-none">TA</span>
            </div>

            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 truncate leading-tight">TrelloApp</span>
              <span className="text-xs text-slate-400 truncate leading-tight">Workspace</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center w-full max-w-[560px] justify-center">
            <div className="flex items-center w-full max-w-[520px] bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                aria-label="Search"
                placeholder="Search boards, cards, members..."
                className="ml-3 w-full bg-transparent text-sm placeholder-slate-400 focus:outline-none"
                type="search"
              />
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            title="Create new board"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow"
            onClick={() => (window.location.href = "/boards/new")}
          >
            <Plus className="w-4 h-4" /> New
          </button>

          <button title="Notifications" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md">
            <Bell className="w-5 h-5 text-slate-700" />
          </button>

          <button title="Toggle theme" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hidden sm:inline-flex">
            <Sun className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

// components/layout/Navbar.tsx
"use client";

import { FC, useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, Plus, LogOut, User } from "lucide-react";
import IconButton from "../ui/IconButton";
import Avatar from "../ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  onMenuToggle?: () => void;
}

const Navbar: FC<Props> = ({ onMenuToggle }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <header className="h-14 w-full flex items-center justify-between px-4 border-b bg-white text-slate-800 border-slate-200 shadow-sm
                       dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <IconButton
          ariaLabel="Open menu"
          icon={<Menu className="w-5 h-5" />}
          className="md:hidden"
          onClick={onMenuToggle}
        />
        {/* <span className="font-bold text-lg text-blue-600">TrelloApp</span> */}

        {/* Search - hidden on very small screens */}
        <div className="hidden sm:flex items-center ml-4 bg-slate-100 rounded-md px-2 py-1 gap-2 dark:bg-slate-800">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          <input
            aria-label="Search"
            placeholder="Search boards, cards..."
            className="bg-transparent text-sm focus:outline-none text-slate-700 dark:text-slate-200"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <IconButton ariaLabel="Notifications" icon={<Bell className="w-5 h-5" />} />
        <Link href="/boards/new" className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> New
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Open user menu"
            className="flex items-center gap-2 p-1 rounded-md bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200"
          >
            <Avatar name={user?.name || user?.email || "?"} size="sm" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
                <User className="w-4 h-4" /> <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-slate-50">
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

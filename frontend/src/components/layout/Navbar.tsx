// components/layout/Navbar.tsx
"use client";

import { FC, useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, Plus, LogOut, User, Sun } from "lucide-react";
import IconButton from "../ui/IconButton";
import Avatar from "../ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";

interface Props {
  onMenuToggle?: () => void;
}

const Navbar: FC<Props> = ({ onMenuToggle }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="h-14 w-full flex items-center justify-between px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open menu"
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md bg-white/12 hover:bg-white/20 transition"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <div className="hidden sm:flex items-center gap-3 bg-white/10 rounded-full px-3 py-1">
          <Search className="w-4 h-4 text-white/80" />
          <input
            aria-label="Search"
            placeholder="Search boards, cards..."
            className="bg-transparent placeholder-white/70 text-white text-sm focus:outline-none"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle theme"
          className="p-2 rounded-md bg-white/12 hover:bg-white/20 transition"
          title="Toggle theme"
        >
          <Sun className="w-5 h-5 text-white" />
        </button>

        <Link
          href="/boards/new"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-indigo-600 font-medium hover:opacity-95 shadow-sm transition"
          title="Create new board"
        >
          <Plus className="w-4 h-4" /> New
        </Link>

        <div className="relative">
          {/* keep UserMenu for accessible dropdown; wrap avatar with stronger contrast */}
          <div className="p-1 rounded-md bg-white/12 hover:bg-white/20 transition">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

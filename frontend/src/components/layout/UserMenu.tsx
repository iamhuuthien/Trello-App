"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    try {
      await logout?.();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 p-1 rounded-md bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200"
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 font-medium border border-slate-200">
          {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
        </div>
      </button>

      {open && (
        <div role="menu" aria-label="User actions" className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50">
          <Link role="menuitem" href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
            <User className="w-4 h-4" /> <span>Profile</span>
          </Link>

          <button
            role="menuitem"
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-slate-50"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut className="w-4 h-4" /> <span>Logout</span>
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Sign out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleLogout();
        }}
      />
    </div>
  );
}
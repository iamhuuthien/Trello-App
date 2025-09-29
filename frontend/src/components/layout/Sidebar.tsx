// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { FC } from "react";
import { Home, LayoutDashboard, FolderKanban, Settings, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  isOpen?: boolean; // for mobile overlay
  onClose?: () => void;
}

const links: NavLink[] = [
  { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
  { href: "/boards", label: "Boards", icon: <FolderKanban className="w-4 h-4" /> },
  { href: "/projects", label: "Projects", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

const Sidebar: FC<Props> = ({ isOpen = false, onClose }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 border-r
                        bg-white text-slate-800 border-slate-200 shadow-sm
                        dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">
        <div className="p-4 font-bold text-blue-600 text-lg">TrelloApp</div>
        <nav className="space-y-1 px-2 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {l.icon}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-blue-600">TrelloApp</div>
              <button aria-label="Close menu" onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {l.icon}
                  <span>{l.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

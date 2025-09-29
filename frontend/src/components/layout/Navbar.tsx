// components/layout/Navbar.tsx
"use client";

import { FC } from "react";
import { Menu, Search, Bell, Plus } from "lucide-react";
import IconButton from "../ui/IconButton";
import Avatar from "../ui/Avatar";

interface Props {
  onMenuToggle?: () => void;
}

const Navbar: FC<Props> = ({ onMenuToggle }) => {
  return (
    <header className="h-14 w-full flex items-center justify-between px-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <IconButton
          ariaLabel="Open menu"
          icon={<Menu className="w-5 h-5" />}
          className="md:hidden"
          onClick={onMenuToggle}
        />
        {/* <span className="font-bold text-lg text-blue-600">TrelloApp</span> */}

        {/* Search - hidden on very small screens */}
        <div className="hidden sm:flex items-center ml-4 bg-slate-100 rounded-md px-2 py-1 gap-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            aria-label="Search"
            placeholder="Search boards, cards..."
            className="bg-transparent text-sm focus:outline-none text-slate-700"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconButton ariaLabel="Notifications" icon={<Bell className="w-5 h-5" />} />
        <IconButton ariaLabel="Create" icon={<Plus className="w-5 h-5" />} />
        <Avatar name="Nguyen Van A" size="sm" />
      </div>
    </header>
  );
};

export default Navbar;

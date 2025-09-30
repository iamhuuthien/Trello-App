"use client";

import React from "react";
import useBoards from "@/hooks/useBoards";
import Link from "next/link";

export default function RecentBoards() {
  const { boards, loading } = useBoards();

  if (loading) return <div className="text-sm text-slate-500">Loading recent boards...</div>;
  if (!boards || boards.length === 0) return <div className="text-sm text-slate-500">No recent boards</div>;

  return (
    <div className="space-y-2">
      {boards.slice(0, 6).map((b: any) => (
        <Link key={b.id} href={`/boards/${b.id}`} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
          <div>
            <div className="font-medium text-sm">{b.title ?? b.name ?? "Untitled"}</div>
            <div className="text-xs text-slate-500">{b.description ?? ""}</div>
          </div>
          <div className="text-xs text-slate-400">{/* optional meta */}</div>
        </Link>
      ))}
    </div>
  );
}
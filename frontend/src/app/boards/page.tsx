"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useBoards from "@/hooks/useBoards";
import BoardCard from "@/components/board/BoardCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function BoardsPage() {
  const router = useRouter();
  const { boards, loading, error } = useBoards();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Boards</h2>
        <div>
          <button
            onClick={() => router.push("/boards/new")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
          >
            New board
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner size={28} />
        </div>
      )}

      {!loading && error && <div className="text-red-600">Failed to load boards: {error}</div>}

      {!loading && !error && boards.length === 0 && (
        <div className="rounded-md border p-6 text-center">
          <p className="mb-4">No boards yet.</p>
          <button onClick={() => router.push("/boards/new")} className="px-3 py-2 rounded-md bg-sky-600 text-white">
            Create first board
          </button>
        </div>
      )}

      {!loading && boards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((b: any) => {
            const id = b.id ?? b._id ?? b?.ref?._path?.segments?.[1];
            return (
              <div key={id} onClick={() => router.push(`/boards/${encodeURIComponent(id)}`)} className="cursor-pointer">
                <BoardCard
                  title={b.title ?? b.name ?? "Untitled Board"}
                  description={b.description ?? b.data?.description ?? ""}
                  memberCount={Array.isArray(b.members) ? b.members.length : 0}
                  updatedAt={b.updatedAt ?? b.data?.updatedAt}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
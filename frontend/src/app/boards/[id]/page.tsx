"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useBoard from "@/hooks/useBoard";
import useCards from "@/hooks/useCards";
import BoardHeader from "@/components/board/BoardHeader";
import KanbanBoard from "@/components/board/KanbanBoard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  params: any; // params can be a Promise in this Next.js version
}

export default function BoardPage({ params }: Props) {
  const [id, setId] = useState<string | undefined>(undefined);
  // safely unwrap params which may be a Promise
  useEffect(() => {
    let mounted = true;
    Promise.resolve(params)
      .then((p) => {
        if (mounted) setId(p?.id);
      })
      .catch(() => {
        if (mounted) setId(undefined);
      });
    return () => {
      mounted = false;
    };
  }, [params]);

  const router = useRouter();
  const { board, setBoard, loading: boardLoading, error: boardError } = useBoard(id);
  const { cards, setCards, loading: cardsLoading, error: cardsError } = useCards(id);

  if (!id || boardLoading || cardsLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (boardError) {
    return (
      <div className="p-6">
        <div className="text-red-600">Failed to load board: {boardError}</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="p-6">
        <div className="text-slate-600">Board not found or you don't have access.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.push("/boards")}
          aria-label="Back to Boards"
          title="Back to Boards"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-200"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span className="font-medium">Back to Boards</span>
        </button>
      </div>

      <BoardHeader board={board} onBoardUpdate={(b:any) => setBoard(b)} />

      <div className="mt-4">
        <KanbanBoard
          boardId={id}
          columns={board.columns ?? []}
          cards={cards}
          onCardsChange={(updated) => setCards(updated)}
          onColumnsChange={(cols) => setBoard?.((prev:any) => ({ ...(prev||{}), columns: cols }))}
        />
      </div>
    </div>
  );
}
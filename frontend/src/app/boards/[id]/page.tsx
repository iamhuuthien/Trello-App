"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useBoard from "@/hooks/useBoard";
import useCards from "@/hooks/useCards";
import BoardHeader from "@/components/board/BoardHeader";
import KanbanBoard from "@/components/board/KanbanBoard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

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
          onClick={() => router.push("/boards")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Boards
        </button>
      </div>

      <BoardHeader board={board} onBoardUpdate={() => { /* update handled via hook if needed */ }} />

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
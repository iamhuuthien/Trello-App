import React, { useEffect, useState } from "react";
import { getBoard, getCards } from "@/services/api";
import BoardHeader from "./BoardHeader";
import KanbanBoard from "./KanbanBoard";
import { Loader2 } from "lucide-react";

interface BoardPageClientProps {
  boardId: string;
  initialBoard?: any;
}

export default function BoardPageClient({ boardId, initialBoard }: BoardPageClientProps) {
  const [board, setBoard] = useState(initialBoard || null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialBoard);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!boardId) return;

    const fetchData = async () => {
      try {
        if (!initialBoard) {
          setLoading(true);
          const boardData = await getBoard(boardId);
          setBoard(boardData);
        }
        
        setCardsLoading(true);
        const cardsData = await getCards(boardId);
        setCards(cardsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load board data");
      } finally {
        setLoading(false);
        setCardsLoading(false);
      }
    };

    fetchData();
  }, [boardId, initialBoard]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-700">
        <Loader2 className="animate-spin h-8 w-8 text-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded">
        Error: {error}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center p-8 text-slate-700">
        <p>Board not found or you don't have access</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-slate-900">
      <BoardHeader board={board} onBoardUpdate={setBoard} />
      
      {cardsLoading ? (
        <div className="flex justify-center items-center h-64 text-slate-700">
          <Loader2 className="animate-spin h-8 w-8 text-slate-700" />
        </div>
      ) : (
        <KanbanBoard 
          boardId={boardId}
          columns={board.columns || []} 
          cards={cards} 
          onCardsChange={setCards}
        />
      )}
    </div>
  );
}
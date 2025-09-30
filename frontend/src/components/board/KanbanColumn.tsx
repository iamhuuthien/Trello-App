import React from "react";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  boardId: string;
  columnId: string;
  cards: any[];
  onCardsChange: (cards: any[]) => void;
}

export default function KanbanColumn({ boardId, columnId, cards, onCardsChange }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] p-3 rounded-md transition-colors ${isOver ? "bg-blue-50" : "bg-slate-50"}`}
    >
      {cards.map(card => (
        <KanbanCard key={card.id} boardId={boardId} card={card} onCardUpdate={(c)=> {
          const updated = cards.map(x => x.id === c.id ? c : x);
          onCardsChange(updated);
        }} onCardDelete={(id)=> onCardsChange(cards.filter(c=>c.id !== id))} />
      ))}

      {cards.length === 0 && (
        <div className="text-sm text-slate-700 text-center py-6">No cards in this column</div>
      )}
    </div>
  );
}
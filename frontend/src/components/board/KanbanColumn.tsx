import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import CardFormModal from "./CardFormModal"; // added
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";

interface KanbanColumnProps {
  boardId: string;
  columnId: string;
  cards: any[];
  onCardsChange: (cards: any[]) => void;
}

export default function KanbanColumn({ boardId, columnId, cards, onCardsChange }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();
  const { token } = useAuth();

  // handle card created from modal -> append and close
  const handleCardCreated = (c: any) => {
    if (!c) return;
    // ensure status is this column
    const card = { ...c, status: c.status ?? columnId };
    onCardsChange([...cards, card]);
    setShowCreate(false);
    toast.show?.("Card created", "success");
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={`min-h-[120px] p-3 rounded-md transition-colors ${isOver ? "bg-blue-50" : "bg-slate-50"}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-slate-900">{/* title rendered in parent */}</div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowCreate(true);
            }}
            className="text-slate-700"
            aria-label="Add card"
          >
            + Add card
          </Button>
        </div>

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

      {showCreate && (
        <CardFormModal
          boardId={boardId}
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          initialStatus={columnId}
          onCardCreated={handleCardCreated}
        />
      )}
    </>
  );
}
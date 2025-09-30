import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "./KanbanCard";
import CardFormModal from "./CardFormModal";
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
  const droppableId = `${columnId}-drop`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();
  const { token } = useAuth();

  return (
    <>
      <div
        ref={setNodeRef}
        className={`min-h-[120px] p-3 rounded-md transition-colors ${isOver ? "bg-blue-50 ring-2 ring-indigo-200" : "bg-slate-50"}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-slate-900">{/* title rendered in parent */}</div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); setShowCreate(true); }}
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
          onCardCreated={(c)=> {
            onCardsChange([...cards, { ...c, status: c.status ?? columnId }]);
            setShowCreate(false);
            toast.show?.("Card created", "success");
          }}
        />
      )}
    </>
  );
}
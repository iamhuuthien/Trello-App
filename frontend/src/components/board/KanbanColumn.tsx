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
  columns?: { id: string; title?: string }[]; // <-- new prop
}

export default function KanbanColumn({ boardId, columnId, cards, onCardsChange, columns }: KanbanColumnProps) {
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
          <KanbanCard
            key={card.id}
            boardId={boardId}
            card={card}
            columns={columns} // forward board columns so edit modal can use them
            onCardUpdate={(c: any) => {
              // update single card within the global cards list
              (onCardsChange as any)((prev: any[]) => (prev || []).map((x) => (x.id === c.id ? c : x)));
            }}
            onCardDelete={(id: string) =>
              // remove card by id from global cards list
              (onCardsChange as any)((prev: any[]) => (prev || []).filter((x) => x.id !== id))
            }
          />
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
          columns={columns} // forward columns list
          onCardCreated={(c: any) => {
            // append new card to the global cards list (preserve other columns)
            (onCardsChange as any)((prev: any[]) => [...(prev || []), { ...c, status: c.status ?? columnId }]);
            setShowCreate(false);
            toast.show?.("Card created", "success");
          }}
        />
      )}
    </>
  );
}
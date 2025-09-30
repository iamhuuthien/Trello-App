import React, { useMemo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  boardId: string;
  columns: Array<{ id: string; title?: string }>;
  cards: any[];
  onCardsChange: (cards: any[]) => void;
}

export default function KanbanBoard({ boardId, columns, cards, onCardsChange }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const cardsByColumn = useMemo(() => {
    const map: Record<string, any[]> = {};
    columns.forEach(c => (map[c.id] = []));
    cards.forEach(card => {
      const col = card.status ?? columns[0]?.id;
      if (!map[col]) map[col] = [];
      map[col].push(card);
    });
    return map;
  }, [columns, cards]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const cardId = String(active.id);
    const destColumnId = String(over.id);
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    if (card.status === destColumnId) return;

    // optimistic UI only
    const updated = cards.map(c => (c.id === cardId ? { ...c, status: destColumnId } : c));
    onCardsChange(updated);
  };

  return (
    <div className="overflow-x-auto pb-6">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4" style={{ minWidth: columns.length * 300 }}>
          {columns.map(column => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <div className="bg-white rounded-md p-2 h-full border border-slate-100">
                <div className="flex justify-between items-center mb-3 px-2">
                  <h3 className="font-semibold text-sm text-slate-900">{column.title ?? column.id}</h3>
                </div>

                <KanbanColumn
                  boardId={boardId}
                  columnId={column.id}
                  cards={cardsByColumn[column.id] || []}
                  onCardsChange={onCardsChange}
                />
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
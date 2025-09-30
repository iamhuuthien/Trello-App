import React, { useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import { addBoardColumn, updateCard } from "@/services/api"; // updateCard added
import { appPrompt } from "@/components/ui/ConfirmProvider";
import { useAuth } from "@/hooks/useAuth";

interface KanbanBoardProps {
  boardId: string;
  columns: Array<{ id: string; title?: string }>;
  cards: any[];
  onCardsChange: (cards: any[]) => void;
  onColumnsChange?: (cols: Array<{ id: string; title?: string }>) => void; // optional callback
}

export default function KanbanBoard({ boardId, columns, cards, onCardsChange, onColumnsChange }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const { token } = useAuth();

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

  const handleAddColumn = async () => {
    // prompt for column title (uses ConfirmProvider.appPrompt)
    const title = await appPrompt("Column title", { defaultValue: "New column", title: "Add column", confirmLabel: "Add" });
    if (!title) return;
    try {
      // call backend API to create column and return updated board
      const board = await addBoardColumn(boardId, { title: title.trim() }, token ?? undefined);
      // if parent passed onColumnsChange, use it; else do nothing (caller should update board)
      if (onColumnsChange && board && board.columns) {
        onColumnsChange(board.columns);
      }
    } catch (err: any) {
      console.error("add column failed", err);
      // toast if available
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const cardId = String(active.id);
    const destColumnId = String(over.id);
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    if (card.status === destColumnId) return;

    // optimistic UI update
    const updated = cards.map(c => (c.id === cardId ? { ...c, status: destColumnId } : c));
    onCardsChange(updated);

    // persist
    try {
      await updateCard(boardId, cardId, { status: destColumnId }, token ?? undefined);
    } catch (err: any) {
      console.error("persist status failed", err);
      // rollback UI
      const rolled = cards.map(c => (c.id === cardId ? { ...c, status: card.status } : c));
      onCardsChange(rolled);
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 items-start" style={{ minWidth: columns.length * 300 }}>
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

          {/* Add column card */}
          <div className="w-72 flex-shrink-0">
            <div className="rounded-md p-3 h-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
                aria-label="Add column"
              >
                + Add column
              </button>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
"use client";

import { FC, useMemo, useState, useCallback } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { useCards } from "@/hooks/useCards";
import type { Board, Card } from "@/types";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

interface Props { board: Board; }

const KanbanBoard: FC<Props> = ({ board }) => {
  const { cards, loading, create, update } = useCards(board.id);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const grouped = useMemo(() => {
    const out: Record<string, Card[]> = {};
    COLUMNS.forEach(c => out[c.id] = []);
    cards.forEach(card => {
      const s = card.status || "todo";
      if (!out[s]) out[s] = [];
      out[s].push(card);
    });
    return out;
  }, [cards]);

  const handleDragStart = (e: DragStartEvent) => {
    const id = e.active.id as string;
    const c = cards.find(x => x.id === id);
    if (c) setActiveCard(c);
  };

  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveCard(null);
    if (!over) return;
    const cardId = active.id as string;
    const newStatus = over.id as string;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.status === newStatus) return;
    try {
      await update(cardId, { status: newStatus });
    } catch (err) {
      console.error("move failed", err);
    }
  }, [cards, update]);

  const handleAdd = async (status: string) => {
    const name = window.prompt("Task title");
    if (!name) return;
    await create({ name, status });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          {/* explicit colors so title is visible in light & dark */}
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{board.title}</h1>
          {board.description && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{board.description}</p>}
        </div>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              cards={grouped[col.id] || []}
              onAdd={() => handleAdd(col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && <TaskCard card={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
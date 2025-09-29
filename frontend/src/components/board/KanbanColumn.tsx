"use client";

import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Card } from "@/types";

interface Props {
  id: string;
  title: string;
  cards: Card[];
  onAdd: () => void;
  onEditCard?: (card: Card) => void;
  onDeleteCard?: (card: Card) => void;
}

const KanbanColumn: FC<Props> = ({ id, title, cards, onAdd, onEditCard, onDeleteCard }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">{cards.length}</span>
      </div>

      <div
        ref={setNodeRef}
        id={id}
        className={`min-h-[200px] p-3 rounded-lg border transition-colors
          ${isOver ? "border-blue-400 bg-blue-50 dark:bg-slate-700/60" : "border-slate-200 bg-white dark:bg-slate-800"}
          dark:border-slate-700`}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {cards.map(c => (
              <TaskCard key={c.id} card={c} onEdit={onEditCard} onDelete={onDeleteCard} />
            ))}
            {cards.length === 0 && <div className="text-center text-sm text-slate-400 dark:text-slate-500 py-6">No tasks</div>}
          </div>
        </SortableContext>
        <div className="mt-3">
          <button onClick={onAdd} className="text-sm text-blue-600 dark:text-blue-400">+ Add</button>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
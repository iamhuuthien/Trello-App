"use client";

import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/types";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

interface Props {
  card: Card;
  isDragging?: boolean;
  onEdit?: (card: Card) => void;
  onDelete?: (card: Card) => void;
}

const TaskCard: FC<Props> = ({ card, isDragging, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: dragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: dragging ? 0.6 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-white p-3 rounded shadow-sm border hover:shadow-md cursor-grab
                 text-slate-800 border-slate-200
                 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
    >
      <div className="flex justify-between items-start">
        <div className="pr-2">
          <h4 className="font-medium text-sm">{card.name}</h4>
          {card.description && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{card.description}</p>}
        </div>

        {(onEdit || onDelete) && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex flex-col gap-1">
            {onEdit && (
              <button
                title="Edit"
                onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Edit className="w-4 h-4 text-slate-600 dark:text-slate-200" />
              </button>
            )}
            {onDelete && (
              <button
                title="Delete"
                onClick={(e) => { e.stopPropagation(); onDelete(card); }}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Trash className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
        <div>{card.members?.length ? `${card.members.length} members` : ""}</div>
        <div>{card.deadline ? new Date(card.deadline).toLocaleDateString() : ""}</div>
      </div>
    </div>
  );
};

export default TaskCard;
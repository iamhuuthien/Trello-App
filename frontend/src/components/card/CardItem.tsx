"use client";

import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { useDraggable } from "@dnd-kit/core";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CardModel {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  status?: string;
}

const DragHandle = (props: any) => (
  <span {...props} className="cursor-grab inline-block mr-2" role="button" aria-label="Drag handle">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-400">
      <path
        d="M10 6h.01M14 6h.01M10 12h.01M14 12h.01M10 18h.01M14 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

const CardItem: FC<{ card: CardModel; onDelete?: (id: string) => Promise<void> | void }> = ({
  card,
  onDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { cardId: card.id },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(card.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-slate-200 bg-white shadow-sm p-3 flex items-start justify-between transition"
    >
      <div>
        <div className="font-medium flex items-center gap-2 text-slate-900">
          <DragHandle {...listeners} {...attributes} />
          {card.name}
        </div>
        {card.description && <div className="text-sm text-slate-700">{card.description}</div>}
        <div className="text-xs text-slate-600 mt-1">
          Created: {new Date(card.createdAt).toLocaleString()}
        </div>
      </div>
      <div>
        <Button
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete card"
          className="flex items-center gap-2 text-slate-700"
        >
          {deleting ? (
            <>
              <LoadingSpinner size={14} /> Deleting
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CardItem;

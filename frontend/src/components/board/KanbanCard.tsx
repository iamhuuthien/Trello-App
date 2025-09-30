import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import CardFormModal from "./CardFormModal";
import CardDetailModal from "./CardDetailModal";
import Button from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { deleteCard } from "@/services/api";

interface KanbanCardProps {
  boardId: string;
  card: any;
  onCardUpdate?: (c: any) => void;
  onCardDelete?: (id: string) => void;
}

export default function KanbanCard({ boardId, card, onCardUpdate, onCardDelete }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [localDeleting, setLocalDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();

  const handleDeleteConfirmed = () => {
    setLocalDeleting(true);
    setTimeout(() => {
      onCardDelete?.(card.id);
      setLocalDeleting(false);
      setShowDeleteModal(false);
      toast.show("Card deleted (local)", "success");
    }, 300);
  };

  const formatDeadline = () => {
    if (!card.deadline) return null;
    const deadline = new Date(card.deadline);
    if (isNaN(deadline.getTime())) return null;
    return deadline.toLocaleDateString();
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`mb-2 p-3 rounded shadow-sm bg-white cursor-grab ${isDragging ? "opacity-80" : ""}`}
        onClick={() => setShowDetail(true)} // open detail on click
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm text-slate-900">{card.name}</div>
            {card.description && <div className="text-sm text-slate-700 mt-1">{card.description}</div>}
            <div className="flex items-center gap-2 mt-2">
              {card.deadline && (
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-600" /> <span>{formatDeadline()}</span>
                </div>
              )}
              <div className="flex -space-x-2 ml-2">
                {(Array.isArray(card.members) ? card.members : []).slice(0, 4).map((m: string, i: number) => {
                  const email = m.startsWith("user:") ? m.slice(5) : decodeURIComponent(String(m));
                  return <div key={i} className="border-2 border-white rounded-full"><Avatar name={email} size="sm" /></div>;
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="text-slate-700">
              Edit
            </Button>
            <Button variant="ghost" onClick={() => setShowDeleteModal(true)} disabled={localDeleting} className="text-slate-700">
              {localDeleting ? <><LoadingSpinner size={14} className="inline-block mr-2" /> Deleting...</> : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {showDetail && (
        <CardDetailModal
          boardId={boardId}
          card={card}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}

      {isEditing && (
        <CardFormModal
          boardId={boardId}
          isOpen={isEditing}
          initialData={card}
          onClose={() => setIsEditing(false)}
          onCardCreated={(updated) => {
            onCardUpdate?.(updated);
            setIsEditing(false);
            toast.show("Card saved (local)", "success");
          }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete card"
        message={`Delete '${card.name}'? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={localDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
}
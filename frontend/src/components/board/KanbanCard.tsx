import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import CardFormModal from "./CardFormModal";
import CardDetailModal from "./CardDetailModal";
import Button from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { deleteCard } from "@/services/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Edit2, Trash2 } from "lucide-react";

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
  const { token } = useAuth();

  // replace local-only delete with API call + optimistic UI
  const handleDeleteConfirmed = async () => {
    setLocalDeleting(true);
    try {
      await deleteCard(boardId, card.id, token ?? undefined);
      onCardDelete?.(card.id);
      toast.show?.("Card deleted", "success");
    } catch (err: any) {
      console.error("deleteCard failed", err);
      toast.show?.(err?.message || "Delete failed", "error");
    } finally {
      setLocalDeleting(false);
      setShowDeleteModal(false);
    }
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
        {...attributes} // keep accessibility attrs on the draggable node
        className={`mb-2 p-3 rounded shadow-sm bg-white ${isDragging ? "opacity-80" : ""} relative`}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              {/* drag handle: listeners attached here so only handle starts drag */}
              <button
                type="button"
                {...(listeners as any)}
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-slate-100 cursor-grab"
                aria-label={`Drag ${card.name}`}
                style={{ touchAction: "none" }}
              >
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="font-medium text-sm text-slate-900">{card.name}</div>
            </div>

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
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="inline-flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-slate-700" /> Edit
            </Button>

            <Button variant="danger" onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }} disabled={localDeleting} className="inline-flex items-center gap-2">
              {localDeleting ? <><LoadingSpinner size={14} className="inline-block mr-2" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete</>}
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
            toast.show("Card saved", "success");
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
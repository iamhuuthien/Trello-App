import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createCard, updateCard } from "@/services/api";

export default function CardFormModal({
  boardId,
  isOpen,
  onClose,
  onCardCreated,
  initialData,
  initialStatus = "todo",
  columns = [], // accept columns list from parent
}: any) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const defaultStatus = initialData?.status || initialStatus || (Array.isArray(columns) && columns[0]?.id) || "todo";
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [deadline, setDeadline] = useState(initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 10) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setLoading(true);
    try {
      let saved;
      const payload = { name: name.trim(), description, status, priority, deadline: deadline ? new Date(deadline).toISOString() : null, members: initialData?.members || [] };
      if (isEditing) {
        saved = await updateCard(boardId, initialData.id, payload, token ?? undefined);
      } else {
        saved = await createCard(boardId, payload, token ?? undefined);
      }
      onCardCreated?.(saved);
      toast.show(isEditing ? "Card updated" : "Card created", "success");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Save failed");
      toast.show(err?.message || "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ensure status updates when initialData/columns change (when opening modal for different column)
  React.useEffect(() => {
    const newDefault = initialData?.status || initialStatus || (Array.isArray(columns) && columns[0]?.id) || "todo";
    setStatus(newDefault);
    // also reset name/description when opening fresh create form
    if (!isEditing) {
      setName("");
      setDescription("");
      setDeadline(initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 10) : "");
    }
  }, [initialData, initialStatus, columns, isEditing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto text-slate-900">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{isEditing ? "Edit card" : "New card"}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-500">
            <X size={20} />
          </button>
        </div>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} className="text-slate-900 bg-white" />
          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Description</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border px-3 py-2 text-slate-900 bg-white" />
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border px-3 py-2 text-slate-900 bg-white">
              {Array.isArray(columns) && columns.length > 0 ? (
                columns.map((col: any) => <option key={col.id} value={col.id}>{col.title ?? col.id}</option>)
              ) : (
                // fallback to common defaults if no columns provided
                <>
                  <option value="todo">To do</option>
                  <option value="doing">In progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </>
              )}
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Priority</div>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-md border px-3 py-2 text-slate-900 bg-white">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Deadline</div>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-md border px-3 py-2 text-slate-900 bg-white" />
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
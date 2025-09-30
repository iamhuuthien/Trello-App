"use client";

import React, { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { X, Calendar } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";
import { createTask, assignMember, updateTask, deleteTask } from "@/services/api";
import { Edit2, Trash2, Check } from "lucide-react";

export default function CardDetailModal({ boardId, card, isOpen, onClose, onTaskCreated }: any) {
  const { token } = useAuth();
  const toast = useToast();
  const { tasks, setTasks, loading, realtime } = useTasks(boardId, card?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [assignInputs, setAssignInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setAssignInputs((prev) => {
      const next: Record<string, string> = {};
      (tasks || []).forEach((t: any) => {
        next[t.id] = prev[t.id] ?? "";
      });
      return next;
    });
  }, [tasks]);

  if (!isOpen) return null;

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return toast.show("Title required", "error");
    setCreating(true);
    try {
      const t = await createTask(boardId, card.id, { title: title.trim(), description }, token ?? undefined);
      // If realtime listener is active, onSnapshot will deliver the new task — avoid optimistic duplicate
      if (!realtime) {
        setTasks((prev: any[]) => {
          if (!prev) return [t];
          if (prev.some((p) => p.id === t.id)) return prev;
          return [...prev, t];
        });
      }
      setTitle("");
      setDescription("");
      toast.show("Task created", "success");
      onTaskCreated?.(t);
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Failed to create task", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleAssign = async (taskId: string) => {
    const value = (assignInputs[taskId] || "").trim();
    if (!value) return toast.show("Enter email or user:id", "error");
    try {
      const updated = await assignMember(boardId, card.id, taskId, value, token ?? undefined);
      setTasks((prev: any[]) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setAssignInputs((s) => ({ ...s, [taskId]: "" }));
      toast.show("Assigned", "success");
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Assign failed", "error");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(boardId, card.id, taskId, token ?? undefined);
      setTasks((prev: any[]) => prev.filter((t) => t.id !== taskId));
      toast.show("Task removed", "success");
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Delete failed", "error");
    }
  };

  const handleToggleStatus = async (task: any) => {
    const nextStatus = task.status === "done" ? "open" : "done";
    try {
      const updated = await updateTask(boardId, card.id, task.id, { status: nextStatus }, token ?? undefined);
      setTasks((prev: any[]) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.show("Task updated", "success");
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Update failed", "error");
    }
  };

  const formattedDeadline = useMemo(() => {
    if (!card?.deadline) return null;
    const d = new Date(card.deadline);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString();
  }, [card]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">{card?.name}</div>
            <div className="text-sm text-slate-500">{card?.description}</div>
          </div>

          <div className="flex items-center gap-3">
            {formattedDeadline && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                <Calendar className="w-4 h-4" /> {formattedDeadline}
              </div>
            )}
            <button onClick={onClose} aria-label="Close" className="p-2 rounded hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-hidden">
          {/* left: tasks list */}
          <div className="flex-1 p-4 overflow-auto max-h-[70vh]">
            <h4 className="font-medium mb-3">Tasks</h4>

            {loading && <div className="text-sm text-slate-500">Loading tasks...</div>}

            {!loading && (!tasks || tasks.length === 0) && (
              <div className="text-sm text-slate-500">No tasks yet. Use the form to add one.</div>
            )}

            <div className="space-y-3">
              {tasks.map((t: any) => (
                <div key={t.id} className="border rounded bg-white p-3 shadow-sm flex justify-between">
                  <div className="w-0 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{t.title}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(t)}
                          className="text-xs px-2 py-1 rounded border text-slate-700 hover:bg-slate-100"
                          aria-label="Toggle status"
                        >
                          {t.status === "done" ? "Done" : "Open"}
                        </button>
                      </div>
                    </div>

                    {t.description && <div className="text-sm text-slate-600 mt-1 truncate">{t.description}</div>}

                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-3">
                      <div>Assigned: {(t.assigned || []).length ? (t.assigned || []).join(", ") : "—"}</div>
                      <div className="flex -space-x-1">
                        {(t.assigned || []).slice(0, 4).map((a: string, i: number) => {
                          const email = a.startsWith("user:") ? a.slice(5) : decodeURIComponent(String(a));
                          return <Avatar key={i} name={email} size="sm" />;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 w-56 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="user@example.com or user:id"
                        value={assignInputs[t.id] ?? ""}
                        onChange={(e) => setAssignInputs((s) => ({ ...s, [t.id]: e.target.value }))}
                        className="text-slate-900"
                      />
                      <Button size="sm" variant="success" onClick={() => handleAssign(t.id)}><Check className="w-4 h-4 mr-2" />Assign</Button>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" size="sm" onClick={() => { toast.show("Edit task not implemented", "info"); }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteTask(t.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: create task / card metadata */}
          <div className="w-80 border-l p-4 bg-slate-50 overflow-auto">
            <div className="mb-4">
              <h5 className="text-sm font-semibold mb-2">Add task</h5>
              <form onSubmit={handleCreate} className="space-y-2">
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-slate-900"
                />
                <Input
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-slate-900"
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" disabled={creating}>{creating ? "Creating..." : "Create task"}</Button>
                  <Button variant="ghost" onClick={() => { setTitle(""); setDescription(""); }}>Clear</Button>
                </div>
              </form>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-semibold mb-2">Card info</h5>
              <div className="text-sm text-slate-600 mb-2">{card?.description || "No description"}</div>
              <div className="text-sm text-slate-600">Status: <span className="font-medium">{card?.status || "—"}</span></div>
              <div className="text-sm text-slate-600 mt-2">Members:</div>
              <div className="flex items-center gap-2 mt-2">
                {(Array.isArray(card?.members) ? card.members : []).map((m: string, i: number) => {
                  const email = m.startsWith("user:") ? m.slice(5) : decodeURIComponent(String(m));
                  return <div key={i} className="flex items-center gap-2"><Avatar name={email} size="sm" /><div className="text-sm text-slate-700">{email}</div></div>;
                })}
                {(!card?.members || card.members.length === 0) && <div className="text-sm text-slate-500">No members</div>}
              </div>
            </div>

            <div className="mt-auto text-xs text-slate-500">
              <div>Created: {card?.createdAt ? new Date(card.createdAt).toLocaleString() : "—"}</div>
              <div>Updated: {card?.updatedAt ? new Date(card.updatedAt).toLocaleString() : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

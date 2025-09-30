"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";
import { createTask, assignMember, updateTask, deleteTask } from "@/services/api";

export default function CardDetailModal({ boardId, card, isOpen, onClose, onTaskCreated }: any) {
  const { token } = useAuth();
  const toast = useToast();
  const { tasks, setTasks, loading } = useTasks(boardId, card?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [assignInput, setAssignInput] = useState("");

  if (!isOpen) return null;

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return toast.show("Title required", "error");
    setCreating(true);
    try {
      const t = await createTask(boardId, card.id, { title: title.trim(), description }, token ?? undefined);
      setTasks((prev: any[]) => (prev ? [...prev, t] : [t]));
      setTitle(""); setDescription("");
      toast.show("Task created", "success");
      onTaskCreated?.(t);
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Failed to create task", "error");
    } finally { setCreating(false); }
  };

  const handleAssign = async (taskId: string) => {
    if (!assignInput.trim()) return toast.show("Member id/email required", "error");
    try {
      const updated = await assignMember(boardId, card.id, taskId, assignInput.trim(), token ?? undefined);
      setTasks((prev: any[]) => prev.map((p) => p.id === updated.id ? updated : p));
      setAssignInput("");
      toast.show("Assigned", "success");
    } catch (err: any) {
      toast.show(err?.message || "Assign failed", "error");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(boardId, card.id, taskId, token ?? undefined);
      setTasks((prev:any[]) => prev.filter(t => t.id !== taskId));
      toast.show("Task removed", "success");
    } catch (err:any) {
      toast.show(err?.message || "Delete failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-auto text-slate-900">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{card.name}</h3>
          <div>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>

        <Card className="mb-3">
          <div className="p-3 text-sm text-slate-700">{card.description}</div>
        </Card>

        <form onSubmit={handleCreate} className="mb-4 space-y-2">
          <Input label="New task title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <Input label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create task"}</Button>
            <Button variant="ghost" onClick={() => { setTitle(""); setDescription(""); }}>Clear</Button>
          </div>
        </form>

        <div>
          <h4 className="font-medium mb-2">Tasks</h4>
          {loading && <div>Loading tasks...</div>}
          {!loading && (!tasks || tasks.length === 0) && <div className="text-sm text-slate-600">No tasks</div>}
          <div className="space-y-2">
            {tasks.map((t:any) => (
              <div key={t.id} className="p-2 border rounded bg-slate-50 flex justify-between items-start">
                <div>
                  <div className="font-medium">{t.title}</div>
                  {t.description && <div className="text-sm text-slate-600">{t.description}</div>}
                  <div className="text-xs text-slate-500">Status: {t.status ?? "open"}</div>
                  <div className="text-xs text-slate-500">Assigned: {(t.assigned || []).join(", ") || "—"}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="user@example.com or user:id" value={assignInput} onChange={(e)=>setAssignInput(e.target.value)} />
                    <Button size="sm" onClick={()=>handleAssign(t.id)}>Assign</Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(t.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

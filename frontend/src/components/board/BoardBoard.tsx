"use client";

import React, { useMemo, useState } from "react";
import { Board, Card, Task } from "@/types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useAuth } from "@/hooks/useAuth";
import useCards from "@/hooks/useCards";
import useTasks from "@/hooks/useTasks";
import CardItem from "@/components/card/CardItem";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SkeletonBoardDetail from "@/components/ui/SkeletonBoardDetail";
import * as api from "@/services/api";
import { X, Plus, Mail, UserPlus, UserMinus } from "lucide-react";

const STATUS_COLUMNS: { id: string; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress" },
  { id: "done", title: "Done" },
];

export default function BoardBoard({ board }: { board: Board }) {
  const { token } = useAuth();
  const { cards, loading, error, fetch: fetchCards, create: createCard, remove: removeCard, update: updateCard } = useCards(board.id, 1000);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const {
    tasks,
    visible: visibleTasks,
    loading: tasksLoading,
    error: tasksError,
    fetch: fetchTasks,
    create: createTask,
    update: updateTask,
    remove: removeTask,
    assign: assignTask,
    unassign: unassignTask,
  } = useTasks(board.id, selectedCard?.id);

  const grouped = useMemo(() => {
    const map: Record<string, Card[]> = {};
    STATUS_COLUMNS.forEach((c) => (map[c.id] = []));
    (cards || []).forEach((c: any) => {
      const s = (c.status as string) || "todo";
      if (!map[s]) map[s] = [];
      map[s].push(c);
    });
    return map;
  }, [cards]);

  const handleAddCard = async (status = "todo") => {
    const name = window.prompt("Card title");
    if (!name) return;
    try {
      await createCard(name, "", status);
      fetchCards();
    } catch (err: any) {
      alert(err.message || "Create card failed");
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    try {
      await removeCard(id);
      if (selectedCard?.id === id) setSelectedCard(null);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const activeId = event.active?.id as string | undefined;
    const over = event.over?.id as string | undefined;
    if (!activeId || !over) return;
    if (!over.startsWith("col:")) return;
    const newStatus = over.replace("col:", "");
    const card = cards.find((c: any) => c.id === activeId);
    if (!card) return;
    if (card.status === newStatus) return;
    try {
      await updateCard(activeId, { status: newStatus });
      // refresh local list
      fetchCards();
    } catch (err) {
      // ignore, updateCard will rollback on error
    }
  };

  const openCard = (c: Card) => {
    setSelectedCard(c);
    // fetch tasks for this card
    // fetchTasks called by hook via selectedCard.id dependency
  };

  const closePanel = () => setSelectedCard(null);

  const handleCreateTask = async () => {
    if (!selectedCard) return;
    const title = window.prompt("Task title");
    if (!title) return;
    try {
      await createTask(title, "");
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Create task failed");
    }
  };

  const handleEditTask = async (task: Task) => {
    const newTitle = window.prompt("Edit task title", task.title);
    if (newTitle === null) return;
    try {
      await updateTask(task.id, { title: newTitle });
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Update task failed");
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!confirm("Delete task?")) return;
    try {
      await removeTask(task.id);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const handleAssign = async (task: Task) => {
    const input = window.prompt("Assign user by userId or email");
    if (!input) return;
    try {
      // try treat input as userId if looks like user:..., otherwise email
      const payload: { userId?: string; email?: string } = input.startsWith("user:") ? { userId: input } : { email: input };
      await assignTask(task.id, payload);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Assign failed");
    }
  };

  const handleUnassign = async (task: Task, assignee: string) => {
    if (!confirm("Unassign this user?")) return;
    try {
      const payload: { userId?: string; email?: string } = assignee.startsWith("user:") ? { userId: assignee } : { email: assignee };
      await unassignTask(task.id, payload);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Unassign failed");
    }
  };

  const handleInvite = async () => {
    const email = window.prompt("Invite user (email)");
    if (!email) return;
    try {
      await api.createInvite(board.id, { inviteToEmail: email }, token);
      alert("Invite sent");
    } catch (err: any) {
      alert(err.message || "Invite failed");
    }
  };

  if (loading) return <SkeletonBoardDetail />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{board.title}</h1>
          <p className="text-sm text-slate-500">Created: {new Date(board.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            Copy link
          </Button>
          <Button onClick={() => handleAddCard()}>Add card</Button>
          <Button variant="ghost" onClick={handleInvite}>
            <Mail size={16} className="inline-block mr-2" /> Invite
          </Button>
        </div>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATUS_COLUMNS.map((col) => (
            <div key={col.id} id={`col:${col.id}`} className="bg-white/5 rounded-md p-3 min-h-[220px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{col.title}</h3>
                <Button variant="ghost" onClick={() => handleAddCard(col.id)}>
                  <Plus size={14} />
                </Button>
              </div>

              <div className="space-y-3">
                {(grouped[col.id] || []).map((c) => (
                  <div key={c.id} onClick={() => openCard(c)} className="cursor-pointer">
                    <CardItem card={{ id: c.id, name: (c as any).name || (c as any).title || "Card", description: (c as any).description, createdAt: (c as any).createdAt || new Date().toISOString(), status: c.status }} onDelete={handleDeleteCard} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">Total cards: {cards.length}</div>
        <div>{loading && <LoadingSpinner />}</div>
      </div>

      {/* Side panel for card details & tasks */}
      {selectedCard && (
        <div className="fixed right-4 top-16 bottom-4 w-[420px] bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg overflow-auto dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{(selectedCard as any).name || (selectedCard as any).title}</h2>
                <span className="text-xs text-slate-400">#{selectedCard.id}</span>
              </div>
              <div className="text-sm text-slate-500">Created: {new Date((selectedCard as any).createdAt).toLocaleString()}</div>
            </div>
            <div>
              <Button variant="ghost" onClick={closePanel}>
                <X size={16} />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Tasks</h3>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCreateTask}>
                  <Plus size={14} /> New
                </Button>
              </div>
            </div>

            {tasksLoading && <div className="py-6 flex items-center justify-center"><LoadingSpinner /></div>}
            {tasksError && <div className="text-red-600">{tasksError}</div>}

            {!tasksLoading && tasks.length === 0 && <div className="text-sm text-slate-500">No tasks yet.</div>}

            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="p-2 bg-white/3 rounded flex items-start justify-between">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    {t.description && <div className="text-sm text-slate-500">{t.description}</div>}
                    <div className="text-xs text-slate-400 mt-1">Owner: {t.ownerId || "—"}</div>
                    <div className="flex gap-2 mt-2">
                      {(t.assigned || []).map((a) => (
                        <button key={a} className="text-xs bg-white/2 px-2 py-0.5 rounded flex items-center gap-1" onClick={() => handleUnassign(t, a)}>
                          <UserMinus size={12} /> {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" onClick={() => handleAssign(t)} title="Assign">
                        <UserPlus size={14} />
                      </Button>
                      <Button variant="ghost" onClick={() => handleEditTask(t)} title="Edit">
                        Edit
                      </Button>
                      <Button variant="ghost" onClick={() => handleDeleteTask(t)} title="Delete">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Card actions</h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied"); }}>
                Copy link
              </Button>
              <Button variant="ghost" onClick={() => { /* placeholder for other actions */ alert("No-op"); }}>
                More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
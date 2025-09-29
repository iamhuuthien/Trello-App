"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Task } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import * as api from "@/services/api";

export function useTasks(boardId?: string, cardId?: string, pageSize = 50) {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    if (!boardId || !cardId || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTasks(boardId, cardId, token);
      const normalized = (data || []).map((t: any) => ({
        ...t,
        createdAt: t.createdAt ? String(t.createdAt) : new Date().toISOString(),
      })) as Task[];
      setTasks(normalized);
      setPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [boardId, cardId, token, isAuthenticated]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const create = useCallback(
    async (title: string, description?: string, ownerId?: string) => {
      if (!boardId || !cardId) throw new Error("boardId & cardId required");
      const tempId = `temp-${Date.now()}`;
      const temp: Task = {
        id: tempId,
        cardId,
        title,
        description,
        ownerId,
        assigned: [],
        createdAt: new Date().toISOString(),
      };
      setTasks((s) => [temp, ...s]);
      try {
        const saved = await api.createTask(boardId, cardId, { title, description, ownerId }, token);
        setTasks((s) => s.map((t) => (t.id === tempId ? saved : t)));
        return saved;
      } catch (err) {
        setTasks((s) => s.filter((t) => t.id !== tempId));
        throw err;
      }
    },
    [boardId, cardId, token]
  );

  const update = useCallback(
    async (taskId: string, body: Partial<{ title: string; description?: string; status?: string; ownerId?: string }>) => {
      if (!boardId || !cardId) throw new Error("boardId & cardId required");
      const prev = tasks;
      setTasks((s) => s.map((t) => (t.id === taskId ? { ...t, ...body, updatedAt: new Date().toISOString() } : t)));
      try {
        const saved = await api.updateTask(boardId, cardId, taskId, body, token);
        setTasks((s) => s.map((t) => (t.id === taskId ? saved : t)));
        return saved;
      } catch (err) {
        setTasks(prev);
        throw err;
      }
    },
    [boardId, cardId, token, tasks]
  );

  const remove = useCallback(
    async (taskId: string) => {
      if (!boardId || !cardId) throw new Error("boardId & cardId required");
      const prev = tasks;
      setTasks((s) => s.filter((t) => t.id !== taskId));
      try {
        await api.deleteTask(boardId, cardId, taskId, token);
      } catch (err) {
        setTasks(prev);
        throw err;
      }
    },
    [boardId, cardId, token, tasks]
  );

  const assign = useCallback(
    async (taskId: string, payload: { userId?: string; email?: string }) => {
      if (!boardId || !cardId) throw new Error("boardId & cardId required");
      // optimistic: add assigned entry (best-effort)
      const prev = tasks;
      setTasks((s) =>
        s.map((t) => (t.id === taskId ? { ...t, assigned: Array.from(new Set([...(t.assigned || []), payload.userId || payload.email])) } : t))
      );
      try {
        await api.assignTask(boardId, cardId, taskId, payload, token);
      } catch (err) {
        setTasks(prev);
        throw err;
      }
    },
    [boardId, cardId, token, tasks]
  );

  const unassign = useCallback(
    async (taskId: string, payload: { userId?: string; email?: string }) => {
      if (!boardId || !cardId) throw new Error("boardId & cardId required");
      const prev = tasks;
      setTasks((s) => s.map((t) => (t.id === taskId ? { ...t, assigned: (t.assigned || []).filter((a) => a !== (payload.userId || payload.email)) } : t)));
      try {
        await api.unassignTask(boardId, cardId, taskId, payload, token);
      } catch (err) {
        setTasks(prev);
        throw err;
      }
    },
    [boardId, cardId, token, tasks]
  );

  const pages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const visible = useMemo(() => tasks.slice((page - 1) * pageSize, page * pageSize), [tasks, page, pageSize]);

  return {
    tasks,
    visible,
    loading,
    error,
    fetch: fetchTasks,
    create,
    update,
    remove,
    assign,
    unassign,
    page,
    setPage,
    pages,
  };
}

export default useTasks;
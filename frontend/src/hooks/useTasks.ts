"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../services/api";

export function useTasks(boardId?: string, cardId?: string, pageSize = 50) {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!boardId || !cardId || !isAuthenticated) {
        setTasks([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getTasks(boardId, cardId, token);
        if (mounted) setTasks(Array.isArray(data) ? data.slice(0, pageSize) : []);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [boardId, cardId, token, isAuthenticated, pageSize]);

  return { tasks, setTasks, loading, error };
}

export default useTasks;
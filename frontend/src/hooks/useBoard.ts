"use client";

import { useEffect, useState, useCallback } from "react";
import { Board } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import * as api from "@/services/api";

export function useBoard(id?: string) {
  const { token, isAuthenticated } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!id || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const b = await api.getBoard(id, token);
      setBoard(b ?? null);
    } catch (err: any) {
      setError(err.message || "Failed to load board");
    } finally {
      setLoading(false);
    }
  }, [id, token, isAuthenticated]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return { board, loading, error, refresh: fetchBoard, setBoard };
}

export default useBoard;
import { useEffect, useState, useCallback } from "react";
import { Board } from "@/types";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/services/api";

export function useBoards() {
  const { token, isAuthenticated } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    if (!isAuthenticated) {
      setBoards([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBoards(token);
      setBoards(data);
    } catch (err: any) {
      setError(err.message || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const create = useCallback(
    async (title: string) => {
      setLoading(true);
      try {
        const board = await api.createBoard(title, token);
        setBoards((s) => [board, ...s]);
        return board;
      } catch (err: any) {
        setError(err.message || "Create board failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { boards, loading, error, refresh: fetchBoards, create };
}

export default useBoards;
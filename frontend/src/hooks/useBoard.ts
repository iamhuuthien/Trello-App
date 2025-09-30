"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBoard } from "../services/api";

export function useBoard(id?: string) {
  const { token, isAuthenticated } = useAuth();
  const [board, setBoard] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id || !isAuthenticated) {
        setBoard(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getBoard(id, token);
        if (mounted) setBoard(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load board");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, token, isAuthenticated]);

  return { board, setBoard, loading, error };
}

export default useBoard;
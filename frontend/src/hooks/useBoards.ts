"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBoards } from "../services/api";

export function useBoards() {
  const { token, isAuthenticated } = useAuth();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isAuthenticated) {
        setBoards([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getBoards(token);
        if (mounted) setBoards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load boards");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token, isAuthenticated]);

  return { boards, setBoards, loading, error };
}

export default useBoards;
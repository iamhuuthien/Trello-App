"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCards } from "../services/api";

export function useCards(boardId?: string) {
  const { token, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!boardId || !isAuthenticated) {
        setCards([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getCards(boardId, token);
        if (mounted) setCards(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load cards");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [boardId, token, isAuthenticated]);

  return { cards, setCards, loading, error };
}

export default useCards;
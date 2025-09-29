"use client";

import { useCallback, useEffect, useState } from "react";
import * as api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import type { Card } from "@/types";

export function useCards(boardId?: string) {
  const { token, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!boardId || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCards(boardId, token);
      setCards(res);
    } catch (err: any) {
      setError(err.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [boardId, token, isAuthenticated]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(
    async (payload: { name: string; description?: string; status?: string; priority?: string }) => {
      if (!boardId) throw new Error("boardId required");
      setLoading(true);
      try {
        const created = await api.createCard(boardId, payload, token);
        setCards((s) => [created, ...s]);
        return created;
      } finally {
        setLoading(false);
      }
    },
    [boardId, token]
  );

  const update = useCallback(
    async (cardId: string, updates: Partial<Card>) => {
      if (!boardId) throw new Error("boardId required");
      const prev = cards;
      setCards((s) => s.map((c) => (c.id === cardId ? { ...c, ...updates } : c)));
      try {
        const updated = await api.updateCard(boardId, cardId, updates, token);
        setCards((s) => s.map((c) => (c.id === cardId ? updated : c)));
        return updated;
      } catch (err) {
        setCards(prev);
        throw err;
      }
    },
    [boardId, token, cards]
  );

  return { cards, loading, error, fetch, create, update, setCards };
}

export default useCards;
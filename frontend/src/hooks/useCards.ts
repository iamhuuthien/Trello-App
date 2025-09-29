"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import * as api from "@/services/api";

export function useCards(boardId?: string, pageSize = 10) {
  const { token, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchCards = useCallback(async () => {
    if (!boardId || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCards(boardId, token);
      // ensure createdAt is string
      const normalized = data.map((c: any) => ({ ...c, createdAt: c.createdAt ? String(c.createdAt) : new Date().toISOString() }));
      setCards(normalized);
      setPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [boardId, token, isAuthenticated]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const create = useCallback(
    async (name: string, description?: string, status?: string) => {
      if (!boardId) throw new Error("boardId required");
      // optimistic
      const tempId = `temp-${Date.now()}`;
      const temp: Card = {
        id: tempId,
        boardId,
        name,
        description,
        status: status || "todo",
        createdAt: new Date().toISOString(),
      };
      setCards((s) => [temp, ...s]);
      try {
        const saved = await api.createCard(boardId, { name, description, status }, token);
        setCards((s) => s.map((c) => (c.id === tempId ? saved : c)));
        return saved;
      } catch (err) {
        setCards((s) => s.filter((c) => c.id !== tempId));
        throw err;
      }
    },
    [boardId, token]
  );

  const remove = useCallback(
    async (cardId: string) => {
      if (!boardId) throw new Error("boardId required");
      const prev = cards;
      setCards((s) => s.filter((c) => c.id !== cardId));
      try {
        await api.deleteCard(boardId, cardId, token);
      } catch (err) {
        setCards(prev);
        throw err;
      }
    },
    [boardId, token, cards]
  );

  const update = useCallback(
    async (cardId: string, body: Partial<{ name: string; description?: string; status?: string; members?: string[] }>) => {
      if (!boardId) throw new Error("boardId required");
      const prev = cards;
      setCards((s) => s.map((c) => (c.id === cardId ? { ...c, ...body, updatedAt: new Date().toISOString() } : c)));
      try {
        const saved = await api.updateCard(boardId, cardId, body, token);
        setCards((s) => s.map((c) => (c.id === cardId ? saved : c)));
        return saved;
      } catch (err) {
        setCards(prev);
        throw err;
      }
    },
    [boardId, token, cards]
  );

  const pages = Math.max(1, Math.ceil(cards.length / pageSize));
  const visible = useMemo(() => cards.slice((page - 1) * pageSize, page * pageSize), [cards, page, pageSize]);

  return {
    cards,
    visible,
    loading,
    error,
    fetch: fetchCards,
    create,
    remove,
    update,
    page,
    setPage,
    pages,
  };
}

export default useCards;
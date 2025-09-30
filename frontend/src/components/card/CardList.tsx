"use client";

import { FC, useMemo, useState } from "react";
import CardItem from "./CardItem";
import Button from "@/components/ui/Button";

interface CardModel {
  id: string;
  name: string; // đồng bộ với CardItem
  description?: string;
  createdAt: string;
}

const CardList: FC<{
  cards: CardModel[];
  pageSize?: number;
  onDelete?: (id: string) => void;
}> = ({ cards, pageSize = 5, onDelete }) => {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(cards.length / pageSize));

  const visible = useMemo(
    () => cards.slice((page - 1) * pageSize, page * pageSize),
    [cards, page, pageSize]
  );

  return (
    <div>
      {cards.length === 0 ? (
        <div className="card p-6 text-slate-500 flex flex-col items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m9 1V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14l4-4h10a2 2 0 002-2z" />
          </svg>
          <span>No cards yet. Use "Add card" to create.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <CardItem key={c.id} card={c} onDelete={() => onDelete?.(c.id)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {cards.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            Page {page} / {pages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;

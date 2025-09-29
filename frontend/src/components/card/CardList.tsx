"use client";

import { FC, useMemo, useState } from "react";
import CardItem from "./CardItem";
import Button from "@/components/ui/Button";

interface CardModel {
  id: string;
  title: string;
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
  const visible = useMemo(() => cards.slice((page - 1) * pageSize, page * pageSize), [cards, page, pageSize]);

  return (
    <div>
      {cards.length === 0 ? (
        <div className="card p-6 text-slate-600">No cards yet. Use "Add card" to create.</div>
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <CardItem key={c.id} card={c} onDelete={() => onDelete?.(c.id)} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-500">
          Page {page} / {pages}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </Button>
          <Button variant="ghost" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardList;
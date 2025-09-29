"use client";

import { FC } from "react";
import { Board } from "@/types";
import CardList from "@/components/card/CardList";
import Button from "@/components/ui/Button";
import useCards from "@/hooks/useCards";

const BoardDetail: FC<{ board: Board }> = ({ board }) => {
  const { visible, create, remove, update, loading, error, page, setPage, pages } = useCards(board.id, 5);

  const handleAdd = async () => {
    const title = window.prompt("Card title");
    if (!title) return;
    try {
      await create(title, "");
    } catch (err: any) {
      alert(err.message || "Failed to add card");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    try {
      await remove(id);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{board.title}</h1>
          <p className="text-sm text-slate-500">Created: {new Date(board.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            Copy link
          </Button>
          <Button onClick={handleAdd}>Add card</Button>
        </div>
      </div>

      {loading && <div className="text-slate-500">Loading cards...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <CardList cards={visible} pageSize={5} onDelete={handleRemove} />

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-500">
          Page {page} / {pages}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>
            Prev
          </Button>
          <Button variant="ghost" disabled={page >= pages} onClick={() => setPage(Math.min(pages, page + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
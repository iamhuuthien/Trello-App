"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BoardCard from "@/components/board/BoardCard";
import useBoards from "@/hooks/useBoards";
import Button from "@/components/ui/Button";

export default function BoardsPage() {
  const { boards, loading, error, create, refresh } = useBoards();
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    const title = window.prompt("Board title");
    if (!title) return;
    setCreating(true);
    try {
      const b = await create(title);
      // navigate to board detail when created (if you implement detail route)
      router.push(`/boards/${b.id}`);
    } catch (err) {
      alert((err as Error).message || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refresh()}>
            Refresh
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Creating..." : "New board"}
          </Button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && boards.length === 0 && <div className="card p-6">No boards yet. Create one.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {boards.map((b) => (
          <BoardCard
            key={b.id}
            title={b.title}
            description={`Created: ${new Date(b.createdAt).toLocaleString()}`}
            onClick={() => router.push(`/boards/${b.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
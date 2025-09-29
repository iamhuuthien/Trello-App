"use client";

import { FC, useEffect, useState } from "react";
import { getBoard, updateBoard, deleteBoard } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import KanbanBoard from "./KanbanBoard";
import type { Board } from "@/types";
import { useRouter } from "next/navigation";

const BoardClient: FC<{ boardId: string }> = ({ boardId }) => {
  const { token } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const b = await getBoard(boardId, token);
        setBoard(b);
      } catch (err: any) {
        setError(err.message || "Failed to load board");
      } finally { setLoading(false); }
    };
    load();
  }, [boardId, token]);

  const handleEdit = async () => {
    if (!board) return;
    const title = window.prompt("Board title", board.title) ?? board.title;
    const description = window.prompt("Description", board.description || "") ?? board.description;
    try {
      const updated = await updateBoard(boardId, { title, description }, token);
      setBoard(updated);
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this board?")) return;
    try {
      await deleteBoard(boardId, token);
      router.push("/boards");
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading) return <div>Loading board...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!board) return <div>Board not found</div>;

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-4">
        <button onClick={handleEdit} className="text-sm text-blue-600">Edit board</button>
        <button onClick={handleDelete} className="text-sm text-red-600">Delete board</button>
      </div>
      <KanbanBoard board={board} />
    </div>
  );
};

export default BoardClient;
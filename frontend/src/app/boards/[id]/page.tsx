"use client";

import React from "react";
import useBoard from "@/hooks/useBoard";
import BoardBoard from "@/components/board/BoardBoard";

export default function BoardPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // React.use may be available in newer React/Next versions to unwrap async params.
  // Fallback to using params directly for older versions.
  const reactAny = React as any;
  const resolvedParams = typeof reactAny.use === "function" ? reactAny.use(params) : params;
  const id = (resolvedParams as any)?.id as string | undefined;

  const { board, loading, error } = useBoard(id);

  if (loading) return <div className="text-slate-500">Loading board...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!board) return <div className="text-slate-600">Board not found</div>;

  return <BoardBoard board={board} />;
}
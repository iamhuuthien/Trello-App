"use client";

import React from "react";
import useBoard from "@/hooks/useBoard";
import BoardBoard from "@/components/board/BoardBoard";
import BoardClient from "@/components/board/BoardPageClient";

export default function BoardPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const unwrappedParams = React.use(params as any);
  return <BoardClient boardId={unwrappedParams.id} />;
}
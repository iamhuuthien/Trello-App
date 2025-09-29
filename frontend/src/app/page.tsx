// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBoards } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { token } = useAuth();
  const [boards, setBoards] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const b = await getBoards(token);
        setBoards(b);
      } catch {}
    })();
  }, [token]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((b) => (
          <Link
            key={b.id}
            href={`/boards/${b.id}`}
            className="p-4 bg-white rounded shadow"
          >
            <h3 className="font-medium">{b.title || b.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{b.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { getBoard, getCards } from "@/services/api";
import BoardHeader from "./BoardHeader";
import KanbanBoard from "./KanbanBoard";
import { Loader2 } from "lucide-react";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";

interface BoardPageClientProps {
  boardId: string;
  initialBoard?: any;
}

const DEFAULT_COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function initFirebaseIfAvailable() {
  if (typeof window === "undefined") return null;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null; // no firebase config -> skip realtime

  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    if (!getApps().length) initializeApp(cfg);
    const app = getApp();
    return getFirestore(app);
  } catch (err) {
    console.warn("Firebase init error:", err);
    return null;
  }
}

export default function BoardPageClient({ boardId, initialBoard }: BoardPageClientProps) {
  const [board, setBoard] = useState<any | null>(initialBoard || null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialBoard);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!boardId) return;
    const db = initFirebaseIfAvailable();
    if (!db) {
      // fallback: normal fetch once
      let mounted = true;
      const fetchData = async () => {
        try {
          if (!initialBoard) {
            setLoading(true);
            const boardData = await getBoard(boardId);
            if (mounted) setBoard(boardData);
          }
          setCardsLoading(true);
          const cardsData = await getCards(boardId);
          if (mounted) setCards(cardsData);
        } catch (err: any) {
          console.error(err);
          if (mounted) setError(err.message || "Failed to load board data");
        } finally {
          if (mounted) {
            setLoading(false);
            setCardsLoading(false);
          }
        }
      };
      fetchData();
      return () => {
        mounted = false;
      };
    }

    // realtime listeners using Firestore onSnapshot
    setLoading(false);
    setCardsLoading(true);
    setError("");

    const boardRef = doc(db, "boards", boardId);
    const unsubBoard = onSnapshot(
      boardRef,
      (snap) => {
        if (!snap.exists()) {
          setBoard(null);
        } else {
          const data = snap.data() as any;
          const cols = Array.isArray(data.columns) && data.columns.length ? data.columns : DEFAULT_COLUMNS;
          setBoard({ id: snap.id, ...data, columns: cols });
        }
      },
      (err) => {
        console.error("board onSnapshot error:", err);
        setError("Realtime board listener failed");
      }
    );

    const cardsRef = collection(db, "boards", boardId, "cards");
    const q = query(cardsRef, orderBy("createdAt", "asc"));
    const unsubCards = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setCards(list);
        setCardsLoading(false);
      },
      (err) => {
        console.error("cards onSnapshot error:", err);
        setError("Realtime cards listener failed");
        setCardsLoading(false);
      }
    );

    return () => {
      try {
        unsubBoard && unsubBoard();
        unsubCards && unsubCards();
      } catch (e) {
        // ignore
      }
    };
  }, [boardId, initialBoard]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-700">
        <Loader2 className="animate-spin h-8 w-8 text-slate-700" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded">Error: {error}</div>;
  }

  if (!board) {
    return <div className="text-center p-8 text-slate-700"><p>Board not found or you don't have access</p></div>;
  }

  return (
    <div className="p-4 text-slate-900">
      <BoardHeader board={board} onBoardUpdate={setBoard} />

      {cardsLoading ? (
        <div className="flex justify-center items-center h-64 text-slate-700">
          <Loader2 className="animate-spin h-8 w-8 text-slate-700" />
        </div>
      ) : (
        <KanbanBoard
          boardId={boardId}
          columns={board.columns || DEFAULT_COLUMNS}
          cards={cards}
          onCardsChange={setCards}
          onColumnsChange={(cols) => setBoard((prev) => ({ ...(prev || {}), columns: cols }))}
        />
      )}
    </div>
  );
}
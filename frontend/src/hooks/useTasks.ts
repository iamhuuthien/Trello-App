"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks as apiGetTasks } from "../services/api";

// Firebase client imports (optional realtime)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";

function initFirebaseIfAvailable() {
  if (typeof window === "undefined") return null;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;
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
    console.warn("Firebase init error (useTasks):", err);
    return null;
  }
}

export function useTasks(boardId?: string, cardId?: string, pageSize = 50) {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsub: (() => void) | null = null;

    const db = initFirebaseIfAvailable();
    if (db && boardId && cardId && isAuthenticated) {
      // realtime listener via Firestore
      setLoading(true);
      setError(null);
      try {
        const colRef = collection(db, "boards", boardId, "cards", cardId, "tasks");
        const q = query(colRef, orderBy("createdAt", "asc"));
        unsub = onSnapshot(
          q,
          (snap) => {
            if (!mounted) return;
            const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            setTasks(list.slice(0, pageSize));
            setLoading(false);
          },
          (err) => {
            console.error("tasks onSnapshot error:", err);
            setError("Realtime tasks failed");
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error("useTasks realtime init error:", err);
        setError(err?.message || "Realtime init failed");
        setLoading(false);
      }
      return () => {
        mounted = false;
        if (unsub) unsub();
      };
    }

    // fallback: single REST fetch
    const load = async () => {
      if (!boardId || !cardId || !isAuthenticated) {
        setTasks([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetTasks(boardId, cardId, token);
        if (mounted) setTasks(Array.isArray(data) ? data.slice(0, pageSize) : []);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, [boardId, cardId, token, isAuthenticated, pageSize]);

  return { tasks, setTasks, loading, error };
}

export default useTasks;
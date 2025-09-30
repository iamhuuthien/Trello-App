"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { updateBoard, deleteBoard } from "@/services/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Edit2, Trash2, X, UserPlus } from "lucide-react";

interface BoardHeaderProps {
  board: any;
  onBoardUpdate: (board: any) => void;
}

function memberEmailFromId(m: string | { id?: string }) {
  if (!m) return "";
  const raw = typeof m === "string" ? m : m.id ?? "";
  if (!raw) return "";
  if (raw.startsWith("user:")) return raw.slice(5);
  if (raw.includes("%40")) return decodeURIComponent(raw);
  return raw;
}

export default function BoardHeader({ board, onBoardUpdate }: BoardHeaderProps) {
  const router = useRouter();
  const toast = useToast();
  const { token } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board?.title || board?.name || "");
  const [description, setDescription] = useState(board?.description || "");
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // debounce-like local save (UI only)
  const saveTimer = useRef<number | null>(null);
  const skipNextAuto = useRef(false);

  const doSave = useCallback(async () => {
    if (!title.trim()) {
      toast.show("Title cannot be empty", "error");
      return;
    }
    setSaving(true);
    try {
      // Persist to backend
      const payload = { title: title.trim(), description };
      const updatedBoard = await updateBoard(board.id, payload, token ?? undefined);
      // notify parent with latest board object
      onBoardUpdate?.(updatedBoard);
      toast.show("Board saved", "success");
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Failed to save board", "error");
    } finally {
      setSaving(false);
    }
  }, [board, title, description, onBoardUpdate, toast, token]);

  useEffect(() => {
    if (!isEditing) return;
    if (skipNextAuto.current) {
      skipNextAuto.current = false;
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      doSave();
      saveTimer.current = null;
    }, 800);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [title, description, isEditing, doSave]);

  useEffect(() => {
    setTitle(board?.title || board?.name || "");
    setDescription(board?.description || "");
    skipNextAuto.current = true;
  }, [board?.title, board?.description, board?.name]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.show("Please enter an email", "error");
      return;
    }
    setInviting(true);
    // UI-only: fake invite success
    setTimeout(() => {
      toast.show(`Invitation (local) sent to ${inviteEmail}`, "success");
      setInviteEmail("");
      setInviting(false);
    }, 500);
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      await deleteBoard(board.id, token ?? undefined);
      toast.show("Board deleted", "success");
      onBoardUpdate?.(null);
      router.push("/boards");
    } catch (err: any) {
      console.error("deleteBoard failed", err);
      toast.show(err?.message || "Failed to delete board", "error");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOwner = true; // UI-only: show Owner badge for demo
  const members = Array.isArray(board?.members) ? board.members : [];

  return (
    <div className="mb-6 flex justify-between items-start force-foreground force-bg-white">
      <div className="flex-1">
        {isEditing ? (
          <div className="mb-2">
            <Input
              label="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-slate-900 bg-white"
            />
            <label className="block mt-2">
              <div className="mb-1 text-sm text-slate-700">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-slate-900 bg-white"
                rows={2}
              />
            </label>

            <div className="flex gap-2 mt-3">
              <Button variant="secondary" onClick={() => { setIsEditing(false); skipNextAuto.current = true; }}>
                Cancel
              </Button>
              <Button onClick={() => { doSave(); setIsEditing(false); }} disabled={saving}>
                {saving ? <><LoadingSpinner size={16} className="inline-block mr-2" /> Saving...</> : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{board.title || board.name || "Untitled Board"}</h1>
              {!isOwner && <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">Member</div>}
              {isOwner && <div className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">Owner</div>}
            </div>
            {board.description && <p className="text-sm text-slate-700 mt-1">{board.description}</p>}

            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </>
        )}

        <div className="mt-4 flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.slice(0, 6).map((m: any, idx: number) => {
              const email = memberEmailFromId(m);
              return <div key={idx} className="border-2 border-white rounded-full"><Avatar name={email || undefined} size="sm" /></div>;
            })}
            {members.length > 6 && <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">+{members.length - 6}</div>}
          </div>

          <div className="ml-4 flex items-center gap-2">
            <Input
              className="w-64 text-slate-900 bg-white"
              label="Invite member (email)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
              {inviting ? <><LoadingSpinner size={14} className="inline-block mr-2" /> Sending...</> : <><UserPlus className="w-4 h-4 mr-2" /> Invite</>}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete board"
        message={<div>Type the board title to confirm deletion:<div className="mt-2 font-medium">{board.title || board.name}</div></div>}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
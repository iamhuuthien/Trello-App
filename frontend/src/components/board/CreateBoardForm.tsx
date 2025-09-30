import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CreateBoardForm() {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      toast.show("Title is required", "error");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // UI-only: simulate create and navigate to boards list
      setTimeout(() => {
        toast.show("Board created (local)", "success");
        router.push("/boards");
      }, 400);
    } catch (err: any) {
      console.error("createBoard error:", err);
      const msg = err?.message || "Failed to create board";
      setError(msg);
      toast.show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow text-slate-900 force-foreground">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Create New Board</h2>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Board Title *"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter board title"
          className="text-slate-900 bg-white"
        />

        <label className="block text-sm">
          <div className="mb-1 font-medium text-slate-700">Description</div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 text-slate-900 bg-white"
            placeholder="Enter board description (optional)"
            rows={3}
            disabled={loading}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><LoadingSpinner size={16} className="inline-block mr-2" /> Creating...</> : "Create Board"}
          </Button>
        </div>
      </form>
    </div>
  );
}
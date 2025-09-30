"use client";

import React, { useEffect, useState, useRef } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [saving, setSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setAvatar(user?.avatar ?? "");
  }, [user]);

  useEffect(() => {
    if (!autoSave) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      handleSave();
    }, 900);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, avatar, autoSave]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile?.({ name, email, avatar });
      toast.show("Profile saved", "success");
    } catch (err: any) {
      console.error(err);
      toast.show(err?.message || "Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium">
          {name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1">
          <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
        </div>
      </div>

      <label className="block">
        <div className="text-sm text-slate-700 mb-1">Avatar URL</div>
        <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className="w-full rounded-md border px-3 py-2" />
      </label>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />
          <span>Auto-save</span>
        </label>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" onClick={() => { setName(user?.name ?? ""); setEmail(user?.email ?? ""); setAvatar(user?.avatar ?? ""); }}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Save profile"
        message="Save changes to your profile?"
        confirmLabel="Save"
        cancelLabel="Cancel"
        loading={saving}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await handleSave();
        }}
      />
    </div>
  );
}
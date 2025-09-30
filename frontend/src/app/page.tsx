// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <main className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || user?.email || "?"} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {user?.name ?? user?.email ?? "Welcome"}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              This is your profile & quick actions dashboard.
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="primary"
              onClick={() => router.push("/boards")}
            >
              View Boards
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/profile")}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/boards"
            className="p-4 rounded border hover:shadow-sm"
          >
            <div className="font-medium">Boards</div>
            <div className="text-sm text-slate-500 mt-1">
              Open and manage your boards
            </div>
          </Link>

          <Link
            href="/boards/new"
            className="p-4 rounded border hover:shadow-sm"
          >
            <div className="font-medium">Create board</div>
            <div className="text-sm text-slate-500 mt-1">Start a new board</div>
          </Link>

          {/* <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="p-4 rounded border hover:shadow-sm text-left"
          >
            <div className="font-medium text-red-600">Sign out</div>
            <div className="text-sm text-slate-500 mt-1">Sign out from the app</div>
          </button> */}
        </div>
      </div>
    </main>
  );
}

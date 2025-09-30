"use client";

import React, { useEffect, useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow">
        <h1 className="text-xl font-semibold mb-3">Profile</h1>
        <ProfileForm />
      </div>
    </main>
  );
}
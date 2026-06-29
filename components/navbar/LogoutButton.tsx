"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}

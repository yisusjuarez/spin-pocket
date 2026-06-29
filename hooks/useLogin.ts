"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/authApi";
import type { ApiError } from "@/types/auth";

interface UseLoginReturn {
  handleLogin: (identifier: string, password: string) => void;
  isPending: boolean;
  error: ApiError | null;
}

export function useLogin(): UseLoginReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  function handleLogin(identifier: string, password: string) {
    setError(null);
    startTransition(async () => {
      const result = await login(identifier, password);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/home");
      router.refresh();
    });
  }

  return { handleLogin, isPending, error };
}

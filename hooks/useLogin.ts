"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api/client";
import type { LoginResult, ApiError } from "@/types/auth";

interface UseLoginReturn {
  login: (identifier: string, password: string) => void;
  isPending: boolean;
  error: ApiError | null;
}

export function useLogin(): UseLoginReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  function login(identifier: string, password: string) {
    setError(null);
    startTransition(async () => {
      const result = await postJson<LoginResult>("/api/auth/login", {
        identifier,
        password,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/home");
      router.refresh();
    });
  }

  return { login, isPending, error };
}

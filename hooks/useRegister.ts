"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/authApi";
import type { ApiError } from "@/types/auth";

interface UseRegisterReturn {
  handleRegister: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
  isPending: boolean;
  error: ApiError | null;
}

export function useRegister(): UseRegisterReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  function handleRegister(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    setError(null);
    startTransition(async () => {
      const result = await register(data);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/home");
      router.refresh();
    });
  }

  return { handleRegister, isPending, error };
}

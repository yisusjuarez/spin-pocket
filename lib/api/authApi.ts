import { post } from "@/lib/api/http";
import type { LoginResult, ApiResponse } from "@/types/auth";

export async function login(
  identifier: string,
  password: string
): Promise<ApiResponse<LoginResult>> {
  return post<LoginResult>("/api/auth/login", { identifier, password });
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

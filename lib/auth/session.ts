import { cookies } from "next/headers";
import { findUserById } from "@/lib/api/mockUsers";
import type { Session } from "@/types/auth";

export const SESSION_COOKIE = "spin-pocket-session";

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) return null;

  const user = findUserById(userId);
  if (!user) return null;

  return { user, issuedAt: Date.now() };
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}

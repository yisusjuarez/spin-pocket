import { cookies } from "next/headers";
import { validateIdentifier, validatePassword } from "@/lib/validation/login";
import { findUserByIdentifier, checkPassword } from "@/lib/api/mockUsers";
import { SESSION_COOKIE, cookieOptions } from "@/lib/auth/session";
import type { LoginResult, ApiResponse } from "@/types/auth";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const identifier: string = body?.identifier ?? "";
  const password: string = body?.password ?? "";

  const identifierValidation = validateIdentifier(identifier);
  if (!identifierValidation.valid) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: identifierValidation.error! },
    };
    return Response.json(response, { status: 400 });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: passwordValidation.error! },
    };
    return Response.json(response, { status: 400 });
  }

  await sleep(800);

  const user = findUserByIdentifier(identifier);
  if (!user || !checkPassword(user.id, password)) {
    const response: ApiResponse<never> = {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid credentials. Please try again.",
      },
    };
    return Response.json(response, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, cookieOptions());

  const response: ApiResponse<LoginResult> = { ok: true, data: { user } };
  return Response.json(response, { status: 200 });
}

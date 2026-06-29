import { validateName, validateEmail, validatePhone, validateConfirmPassword } from "@/lib/validation/register";
import { validatePassword } from "@/lib/validation/login";
import { createUser, isIdentifierTaken } from "@/lib/db/users";
import { createSession } from "@/lib/auth/session";
import type { LoginResult, ApiResponse } from "@/types/auth";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => ({}));
  const name: string = body?.name ?? "";
  const email: string = body?.email ?? "";
  const phone: string = body?.phone ?? "";
  const password: string = body?.password ?? "";
  const confirmPassword: string = body?.confirmPassword ?? "";

  const validations = [
    validateName(name),
    validateEmail(email),
    validatePhone(phone),
    validatePassword(password),
    validateConfirmPassword(password, confirmPassword),
  ];

  for (const v of validations) {
    if (!v.valid) {
      const response: ApiResponse<never> = {
        ok: false,
        error: { code: "INVALID_INPUT", message: v.error! },
      };
      return Response.json(response, { status: 400 });
    }
  }

  await sleep(800);

  const taken = await isIdentifierTaken(email, phone);
  if (taken.email || taken.phone) {
    const message = taken.email
      ? "This email is already registered."
      : "This phone number is already registered.";
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message },
    };
    return Response.json(response, { status: 400 });
  }

  const user = await createUser({ name, email, phone, password });
  await createSession(user.id);

  const response: ApiResponse<LoginResult> = { ok: true, data: { user } };
  return Response.json(response, { status: 201 });
}

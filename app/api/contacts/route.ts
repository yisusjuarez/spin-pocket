import { getSession } from "@/lib/auth/session";
import { addContact } from "@/lib/db/contacts";
import type { ApiResponse } from "@/types/auth";
import type { Contact } from "@/types/contact";

export async function POST(request: Request): Promise<Response> {
  const session = await getSession();
  if (!session) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Not authenticated." },
    };
    return Response.json(response, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name: string = body?.name ?? "";
  const email: string = body?.email ?? "";
  const phone: string = body?.phone ?? "";

  if (!name.trim() || (!email.trim() && !phone.trim())) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Name and at least one contact method are required." },
    };
    return Response.json(response, { status: 400 });
  }

  const contact = await addContact({
    userId: session.user.id,
    name: name.trim(),
    email: email.trim() || undefined,
    phone: phone.trim() || undefined,
  });

  const response: ApiResponse<Contact> = { ok: true, data: contact };
  return Response.json(response, { status: 201 });
}

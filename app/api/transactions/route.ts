import { getSession } from "@/lib/auth/session";
import { getUserById, getUserByIdentifier, updateUserBalance } from "@/lib/db/users";
import { addTransaction } from "@/lib/db/transactions";
import type { ApiResponse } from "@/types/auth";
import type { TransactionResult } from "@/types/transaction";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function detectScenario(name: string): "network" | "timeout" | "unknown" | null {
  const lower = name.toLowerCase();
  if (lower.includes("error")) return "network";
  if (lower.includes("timeout")) return "timeout";
  if (lower.includes("unknown")) return "unknown";
  return null;
}

function randomScenario(): "network" | "timeout" | "unknown" | null {
  const roll = Math.random();
  if (roll < 0.12) return "network";
  if (roll < 0.20) return "unknown";
  if (roll < 0.23) return "timeout";
  return null;
}

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
  const amount: number = body?.amount ?? 0;
  const recipientName: string = body?.recipientName ?? "";
  const recipientEmail: string = body?.recipientEmail ?? "";
  const recipientPhone: string = body?.recipientPhone ?? "";

  if (!recipientEmail.trim() && !recipientPhone.trim()) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Recipient is required." },
    };
    return Response.json(response, { status: 400 });
  }

  if (typeof amount !== "number" || amount <= 0) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Amount must be greater than zero." },
    };
    return Response.json(response, { status: 400 });
  }

  const sender = await getUserById(session.user.id);
  if (!sender) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "UNAUTHORIZED", message: "User not found." },
    };
    return Response.json(response, { status: 401 });
  }

  if (amount > sender.balance) {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Insufficient funds to complete this transaction." },
    };
    return Response.json(response, { status: 400 });
  }

  await sleep(800);

  const scenario = detectScenario(recipientName) ?? randomScenario();

  if (scenario === "network") {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "NETWORK", message: "Network error. Please try again." },
    };
    return Response.json(response, { status: 503 });
  }

  if (scenario === "timeout") {
    await sleep(15000);
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "NETWORK", message: "Request timed out." },
    };
    return Response.json(response, { status: 504 });
  }

  if (scenario === "unknown") {
    const response: ApiResponse<never> = {
      ok: false,
      error: { code: "UNKNOWN", message: "An unexpected error occurred. Please try again later." },
    };
    return Response.json(response, { status: 500 });
  }

  const lookupKey = recipientEmail || recipientPhone;
  const recipientUser = await getUserByIdentifier(lookupKey);
  const toUserId = recipientUser?.id ?? null;
  const toName = recipientUser?.name ?? recipientName;

  const id = `tx-${Date.now()}`;
  const createdAt = Date.now();
  const balanceAfter = sender.balance - amount;

  await addTransaction({ id, fromUserId: sender.id, fromName: sender.name, toUserId, toName, amount, balanceAfter, createdAt });
  await updateUserBalance(sender.id, balanceAfter);

  if (recipientUser) {
    await updateUserBalance(recipientUser.id, recipientUser.balance + amount);
  }

  const result: TransactionResult = { id, amount, recipientName: toName, balanceAfter, createdAt };
  const response: ApiResponse<TransactionResult> = { ok: true, data: result };
  return Response.json(response, { status: 201 });
}

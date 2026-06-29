import type { ApiResponse } from "@/types/auth";

export async function postJson<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch {
    return {
      ok: false,
      error: {
        code: "NETWORK",
        message: "Network error. Please check your connection and try again.",
      },
    };
  }
}

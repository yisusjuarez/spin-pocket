import type { ApiResponse } from "@/types/auth";

const REQUEST_TIMEOUT_MS = 8000;

export async function post<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        ok: false,
        error: { code: "NETWORK", message: "Request timed out. Please try again." },
      };
    }
    return {
      ok: false,
      error: { code: "NETWORK", message: "Network error. Please check your connection and try again." },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

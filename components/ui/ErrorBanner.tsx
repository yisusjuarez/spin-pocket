import type { ApiError } from "@/types/auth";

interface ErrorBannerProps {
  error: ApiError;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const retryable = !!onRetry && (error.code === "NETWORK" || error.code === "UNKNOWN");

  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-700">{error.message}</p>
      {retryable && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 w-full rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}

"use client";

import { useTransactionSubmit, type TransactionDraft } from "@/hooks/useTransactionSubmit";
import type { ApiError } from "@/types/auth";

interface ConfirmStepProps {
  draft: TransactionDraft;
  senderBalance: number;
}

function ErrorBanner({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  const retryable = error.code === "NETWORK" || error.code === "UNKNOWN";
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-700">{error.message}</p>
      {retryable && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start text-sm font-semibold text-red-700 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function ConfirmStep({ draft, senderBalance }: ConfirmStepProps) {
  const { submit, isPending, error } = useTransactionSubmit(draft);
  const balanceAfter = senderBalance - draft.amount;

  const row = (label: string, value: string) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Review</h1>
        <p className="mt-1 text-sm text-gray-500">Confirm before sending.</p>
      </div>

      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 px-4">
        {row("To", draft.recipient.name)}
        {draft.recipient.email && row("Email", draft.recipient.email)}
        {draft.recipient.phone && row("Phone", draft.recipient.phone)}
        {row("Amount", `$${draft.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`)}
        {row("Balance after", `$${balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2 })}`)}
      </div>

      {error && <ErrorBanner error={error} onRetry={submit} />}

      <div className="flex gap-3">
        <a
          href="/transaction/new"
          className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back
        </a>
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="flex-1 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}

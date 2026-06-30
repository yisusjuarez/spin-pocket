"use client";

import { useTransactionSubmit, type TransactionDraft } from "@/hooks/useTransactionSubmit";
import { DetailRow } from "@/components/ui/DetailRow";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface ConfirmStepProps {
  draft: TransactionDraft;
  senderBalance: number;
  onBack: () => void;
}

export function ConfirmStep({ draft, senderBalance, onBack }: ConfirmStepProps) {
  const { submit, isPending, error } = useTransactionSubmit(draft);
  const balanceAfter = senderBalance - draft.amount;

  return (
    <div className="flex flex-col gap-5">
      <div className="divide-y divide-gray-100 rounded-xl bg-gray-50/60 px-4 ring-1 ring-gray-200/60">
        <DetailRow label="To" value={draft.recipient.name} />
        {draft.recipient.email && <DetailRow label="Email" value={draft.recipient.email} />}
        {draft.recipient.phone && <DetailRow label="Phone" value={draft.recipient.phone} />}
        <DetailRow
          label="Amount"
          value={`$${draft.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          highlight
        />
        <DetailRow
          label="Balance after"
          value={`$${balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
        />
      </div>

      {error && <ErrorBanner error={error} onRetry={submit} />}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}

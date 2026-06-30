import Link from "next/link";
import type { TransactionRecord } from "@/types/transaction";
import { DetailRow } from "@/components/ui/DetailRow";

interface TransactionDetailProps {
  transaction: TransactionRecord;
  isSent: boolean;
}

export function TransactionDetail({ transaction, isSent }: TransactionDetailProps) {
  const counterpartName = isSent ? transaction.toName : transaction.fromName;
  const date = new Date(transaction.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            isSent ? "bg-brand-light" : "bg-accent-light"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12l5 5L19 7"
              stroke={isSent ? "#7C3AED" : "#EA580C"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className={`text-xs font-semibold uppercase tracking-widest ${isSent ? "text-brand" : "text-accent"}`}>
            {isSent ? "You sent" : "You received"}
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
            ${transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100 rounded-2xl bg-white px-4 ring-1 ring-gray-900/5">
        <DetailRow label={isSent ? "To" : "From"} value={counterpartName} />
        {isSent && (
          <DetailRow
            label="Balance after"
            value={`$${transaction.balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          />
        )}
        <DetailRow label="Date" value={date} />
        <DetailRow label="Reference" value={transaction.id} />
      </div>

      <Link
        href="/home"
        className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Back to home
      </Link>
    </div>
  );
}

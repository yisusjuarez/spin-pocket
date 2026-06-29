import Link from "next/link";
import type { TransactionRecord } from "@/types/transaction";

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

  const row = (label: string, value: string) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">{isSent ? "You sent" : "You received"}</p>
          <p className="text-3xl font-semibold text-gray-900">
            ${transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 px-4">
        {row(isSent ? "To" : "From", counterpartName)}
        {isSent && row(
          "Balance after",
          `$${transaction.balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        )}
        {row("Date", date)}
        {row("Reference", transaction.id)}
      </div>

      <Link
        href="/home"
        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Back to home
      </Link>
    </div>
  );
}

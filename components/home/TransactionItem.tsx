import Link from "next/link";
import type { Transaction } from "@/types/transaction";

interface TransactionItemProps {
  transaction: Transaction;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isSent = transaction.type === "sent";
  const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const description = transaction.description ?? (isSent ? "Sent" : "Received");

  return (
    <li>
      <Link
        href={`/transaction/${transaction.id}`}
        className="flex items-center gap-3.5 py-3.5 transition hover:opacity-70"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            isSent
              ? "bg-brand-light text-brand"
              : "bg-accent-light text-accent"
          }`}
        >
          {getInitials(transaction.counterpartName)}
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {transaction.counterpartName}
            </p>
            <p className="text-xs text-gray-400">
              {description} · {date}
            </p>
          </div>
          <span
            className={`shrink-0 text-sm font-semibold tabular-nums ${
              isSent ? "text-gray-700" : "text-accent"
            }`}
          >
            {isSent ? "−" : "+"}$
            {transaction.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </Link>
    </li>
  );
}

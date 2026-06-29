import type { Transaction } from "@/types/transaction";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isSent = transaction.type === "sent";
  const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <li className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {transaction.counterpartName}
        </span>
        <span className="text-xs text-gray-400">
          {transaction.description ?? (isSent ? "Sent" : "Received")} · {date}
        </span>
      </div>
      <span
        className={`text-sm font-semibold ${isSent ? "text-gray-900" : "text-green-600"}`}
      >
        {isSent ? "-" : "+"}$
        {transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </span>
    </li>
  );
}

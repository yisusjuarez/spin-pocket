import type { User } from "@/types/auth";

interface BalanceCardProps {
  user: User;
}

export function BalanceCard({ user }: BalanceCardProps) {
  return (
    <div className="rounded-2xl bg-gray-900 px-6 py-8 text-white">
      <p className="text-sm text-gray-400">Available balance</p>
      <p className="mt-1 text-4xl font-semibold tracking-tight">
        ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
      <p className="mt-4 text-sm text-gray-400">{user.name}</p>
    </div>
  );
}

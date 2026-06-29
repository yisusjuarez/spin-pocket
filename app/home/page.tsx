import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/db/users";
import { getTransactionsByUserId } from "@/lib/db/transactions";
import { BalanceCard } from "@/components/home/BalanceCard";
import { TransactionList } from "@/components/home/TransactionList";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, transactions] = await Promise.all([
    getUserById(session.user.id),
    getTransactionsByUserId(session.user.id),
  ]);

  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <BalanceCard user={user} />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Recent transactions
        </h2>
        <Link
          href="/transaction/new"
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          New transaction
        </Link>
      </div>

      <TransactionList transactions={transactions} />
    </main>
  );
}

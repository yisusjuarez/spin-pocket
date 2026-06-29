import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTransactionById } from "@/lib/db/transactions";
import { TransactionDetail } from "@/components/transaction/TransactionDetail";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const transaction = await getTransactionById(id, session.user.id);
  if (!transaction) notFound();

  const isSent = transaction.fromUserId === session.user.id;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="rounded-2xl bg-white px-6 py-8 shadow-sm">
        <TransactionDetail transaction={transaction} isSent={isSent} />
      </div>
    </main>
  );
}

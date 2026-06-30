import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/db/users";
import { ConfirmStep } from "@/components/transaction/ConfirmStep";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const amount = parseFloat(params.amount ?? "");
  const recipientName = params.recipientName ?? "";
  const recipientEmail = params.recipientEmail;
  const recipientPhone = params.recipientPhone;
  const saveContact = params.saveContact === "true";

  if (
    !amount ||
    amount <= 0 ||
    !recipientName ||
    (!recipientEmail && !recipientPhone)
  ) {
    redirect("/transaction/new");
  }

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  if (amount > user.balance) {
    redirect("/transaction/new");
  }

  const draft = {
    amount,
    recipient: {
      name: recipientName,
      email: recipientEmail,
      phone: recipientPhone,
    },
    saveContact,
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="rounded-2xl bg-white px-6 py-8 shadow-sm">
        <ConfirmStep draft={draft} senderBalance={user.balance} />
      </div>
    </main>
  );
}

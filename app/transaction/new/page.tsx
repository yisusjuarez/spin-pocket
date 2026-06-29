import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/db/users";
import { getContactsByUserId } from "@/lib/db/contacts";
import { AmountStep } from "@/components/transaction/AmountStep";

export default async function NewTransactionPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, contacts] = await Promise.all([
    getUserById(session.user.id),
    getContactsByUserId(session.user.id),
  ]);

  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="rounded-2xl bg-white px-6 py-8 shadow-sm">
        <AmountStep user={user} contacts={contacts} />
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/db/users";
import { getContactsByUserId } from "@/lib/db/contacts";
import { TransactionFlow } from "@/components/transaction/TransactionFlow";

export default async function NewTransactionPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, contacts] = await Promise.all([
    getUserById(session.user.id),
    getContactsByUserId(session.user.id),
  ]);

  if (!user) redirect("/login");

  return <TransactionFlow user={user} contacts={contacts} />;
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AuthTabs } from "@/components/login/AuthTabs";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <main className="flex flex-1 flex-col px-4 py-10">
      <div className="m-auto w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-sm">
        <AuthTabs />
      </div>
    </main>
  );
}

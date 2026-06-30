import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AuthTabs } from "@/components/login/AuthTabs";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #EDE9FE 0%, #F8F7FF 50%, #FFF7ED 100%)",
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-xl ring-1 ring-brand/10">
        <AuthTabs />
      </div>
    </main>
  );
}

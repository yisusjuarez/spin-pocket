import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/login/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email or phone number to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

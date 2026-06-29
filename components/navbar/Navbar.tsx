import { getSession } from "@/lib/auth/session";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const session = await getSession();
  if (!session) return null;

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <span className="text-sm font-medium text-gray-900">
          {session.user.name}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}

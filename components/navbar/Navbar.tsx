import { getSession } from "@/lib/auth/session";
import { BrandMark } from "@/components/ui/BrandMark";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const session = await getSession();
  if (!session) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <BrandMark size="sm" />
          <span className="font-semibold tracking-tight text-gray-900">Spin Pocket</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{session.user.name}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

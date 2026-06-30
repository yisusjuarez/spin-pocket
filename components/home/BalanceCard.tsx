import type { User } from "@/types/auth";

interface BalanceCardProps {
  user: User;
}

export function BalanceCard({ user }: BalanceCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl px-6 py-8 text-white"
      style={{
        background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 65%, #8B5CF6 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-6 select-none text-[11rem] font-black leading-none text-white/[0.06]"
      >
        S
      </span>

      <div className="relative z-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
          Available balance
        </p>
        <p className="mt-3 text-5xl font-bold tracking-tight">
          ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm text-white/60">{user.name}</p>
        </div>
      </div>
    </div>
  );
}

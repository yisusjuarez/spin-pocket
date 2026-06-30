interface BrandMarkProps {
  size?: "sm" | "md";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

export function BrandMark({ size = "sm" }: BrandMarkProps) {
  return (
    <div
      className={`flex ${sizes[size]} items-center justify-center rounded-xl bg-brand text-sm font-black text-white ring-4 ring-brand/10`}
    >
      S
    </div>
  );
}

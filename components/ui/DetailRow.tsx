interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function DetailRow({ label, value, highlight }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-brand" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

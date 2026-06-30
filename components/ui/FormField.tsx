interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  children: React.ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function inputClass(error?: string | null) {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-300 disabled:opacity-50",
    error
      ? "border-red-400 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10",
  ].join(" ");
}

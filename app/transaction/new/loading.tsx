export default function NewTransactionLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-14 animate-pulse rounded-lg bg-gray-200" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-14 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="h-12 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </main>
  );
}

export default function HomeLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="h-36 animate-pulse rounded-2xl bg-gray-200" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200" />
      </div>
      <ul className="divide-y divide-gray-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="h-3.5 w-16 animate-pulse rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </main>
  );
}

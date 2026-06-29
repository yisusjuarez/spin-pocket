"use client";

export default function HomeError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-16">
      <p className="text-sm text-gray-500">
        Something went wrong loading your account.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
      >
        Try again
      </button>
    </main>
  );
}

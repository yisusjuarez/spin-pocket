"use client";

import { useState } from "react";
import { validateIdentifier, validatePassword } from "@/lib/validation/login";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { handleLogin, isPending, error: serverError } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const identifierValidation = validateIdentifier(identifier);
    const passwordValidation = validatePassword(password);

    setIdentifierError(identifierValidation.error ?? null);
    setPasswordError(passwordValidation.error ?? null);

    if (!identifierValidation.valid || !passwordValidation.valid) return;

    handleLogin(identifier, password);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
          Email or phone number
        </label>
        <input
          id="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); setIdentifierError(null); }}
          disabled={isPending}
          placeholder="you@example.com or +52 55 1234 5678"
          className={[
            "w-full rounded-lg border px-4 py-3 text-sm outline-none transition",
            "placeholder:text-gray-400 disabled:opacity-50",
            identifierError
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
          ].join(" ")}
        />
        {identifierError && (
          <p className="text-xs text-red-500" role="alert">
            {identifierError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
          disabled={isPending}
          placeholder="••••••••"
          className={[
            "w-full rounded-lg border px-4 py-3 text-sm outline-none transition",
            "placeholder:text-gray-400 disabled:opacity-50",
            passwordError
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
          ].join(" ")}
        />
        {passwordError && (
          <p className="text-xs text-red-500" role="alert">
            {passwordError}
          </p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

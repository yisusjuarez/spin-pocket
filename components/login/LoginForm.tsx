"use client";

import { useState } from "react";
import { validateIdentifier, validatePassword } from "@/lib/validation/login";
import { useLogin } from "@/hooks/useLogin";
import { FormField, inputClass } from "@/components/ui/FormField";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

type LoginErrors = {
  identifier: string | null;
  password: string | null;
};

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({ identifier: null, password: null });
  const { handleLogin, isPending, error: serverError } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const identifierV = validateIdentifier(identifier);
    const passwordV = validatePassword(password);

    setErrors({ identifier: identifierV.error ?? null, password: passwordV.error ?? null });

    if (!identifierV.valid || !passwordV.valid) return;

    handleLogin(identifier, password);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="identifier" label="Email or phone" error={errors.identifier}>
        <input
          id="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); setErrors((prev) => ({ ...prev, identifier: null })); }}
          disabled={isPending}
          placeholder="you@example.com"
          className={inputClass(errors.identifier)}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: null })); }}
          disabled={isPending}
          placeholder="••••••••"
          className={inputClass(errors.password)}
        />
      </FormField>

      {serverError && <ErrorBanner error={serverError} />}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

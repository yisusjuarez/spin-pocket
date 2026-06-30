"use client";

import { useState } from "react";
import { validateName, validateEmail, validatePhone, validateConfirmPassword } from "@/lib/validation/register";
import { validatePassword } from "@/lib/validation/login";
import { useRegister } from "@/hooks/useRegister";
import { FormField, inputClass } from "@/components/ui/FormField";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

type RegisterFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = {
  [K in keyof RegisterFields]: string | null;
};

export function RegisterForm() {
  const [fields, setFields] = useState<RegisterFields>({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<RegisterErrors>({ name: null, email: null, phone: null, password: null, confirmPassword: null });
  const { handleRegister, isPending, error: serverError } = useRegister();

  function update(field: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameV = validateName(fields.name);
    const emailV = validateEmail(fields.email);
    const phoneV = validatePhone(fields.phone);
    const passwordV = validatePassword(fields.password);
    const confirmV = validateConfirmPassword(fields.password, fields.confirmPassword);

    setErrors({
      name: nameV.error ?? null,
      email: emailV.error ?? null,
      phone: phoneV.error ?? null,
      password: passwordV.error ?? null,
      confirmPassword: confirmV.error ?? null,
    });

    if (!nameV.valid || !emailV.valid || !phoneV.valid || !passwordV.valid || !confirmV.valid) return;

    handleRegister(fields);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <FormField id="name" label="Full name" error={errors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={isPending}
          placeholder="Ana García"
          className={inputClass(errors.name)}
        />
      </FormField>

      <FormField id="reg-email" label="Email" error={errors.email}>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          disabled={isPending}
          placeholder="you@example.com"
          className={inputClass(errors.email)}
        />
      </FormField>

      <FormField id="reg-phone" label="Phone number" error={errors.phone}>
        <input
          id="reg-phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={(e) => update("phone", e.target.value)}
          disabled={isPending}
          placeholder="+52 55 1234 5678"
          className={inputClass(errors.phone)}
        />
      </FormField>

      <FormField id="reg-password" label="Password" error={errors.password}>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={fields.password}
          onChange={(e) => update("password", e.target.value)}
          disabled={isPending}
          placeholder="••••••••"
          className={inputClass(errors.password)}
        />
      </FormField>

      <FormField id="confirm-password" label="Confirm password" error={errors.confirmPassword}>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          disabled={isPending}
          placeholder="••••••••"
          className={inputClass(errors.confirmPassword)}
        />
      </FormField>

      {serverError && <ErrorBanner error={serverError} />}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

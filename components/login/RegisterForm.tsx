"use client";

import { useState } from "react";
import { validateName, validateEmail, validatePhone, validateConfirmPassword } from "@/lib/validation/register";
import { validatePassword } from "@/lib/validation/login";
import { useRegister } from "@/hooks/useRegister";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const { handleRegister, isPending, error: serverError } = useRegister();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameV = validateName(name);
    const emailV = validateEmail(email);
    const phoneV = validatePhone(phone);
    const passwordV = validatePassword(password);
    const confirmV = validateConfirmPassword(password, confirmPassword);

    setNameError(nameV.error ?? null);
    setEmailError(emailV.error ?? null);
    setPhoneError(phoneV.error ?? null);
    setPasswordError(passwordV.error ?? null);
    setConfirmPasswordError(confirmV.error ?? null);

    if (!nameV.valid || !emailV.valid || !phoneV.valid || !passwordV.valid || !confirmV.valid) return;

    handleRegister({ name, email, phone, password, confirmPassword });
  }

  const inputClass = (error: string | null) =>
    [
      "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition",
      "placeholder:text-gray-400 disabled:opacity-50",
      error
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
    ].join(" ");

  function field(
    id: string,
    label: string,
    input: React.ReactNode,
    error: string | null
  ) {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-xs font-medium text-gray-600">
          {label}
        </label>
        {input}
        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {field("name", "Full name",
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(null); }}
          disabled={isPending}
          placeholder="Ana García"
          className={inputClass(nameError)}
        />,
        nameError
      )}

      {field("reg-email", "Email",
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
          disabled={isPending}
          placeholder="you@example.com"
          className={inputClass(emailError)}
        />,
        emailError
      )}

      {field("reg-phone", "Phone number",
        <input
          id="reg-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setPhoneError(null); }}
          disabled={isPending}
          placeholder="+52 55 1234 5678"
          className={inputClass(phoneError)}
        />,
        phoneError
      )}

      {field("reg-password", "Password",
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
          disabled={isPending}
          placeholder="••••••••"
          className={inputClass(passwordError)}
        />,
        passwordError
      )}

      {field("confirm-password", "Confirm password",
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(null); }}
          disabled={isPending}
          placeholder="••••••••"
          className={inputClass(confirmPasswordError)}
        />,
        confirmPasswordError
      )}

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {serverError.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

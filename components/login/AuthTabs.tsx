"use client";

import { useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type Tab = "login" | "register";

export function AuthTabs() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div>
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-2.5">
          <BrandMark size="md" />
          <span className="font-semibold tracking-tight text-gray-900">Spin Pocket</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {tab === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {tab === "login"
            ? "Sign in to access your wallet."
            : "Fill in your details to get started."}
        </p>
      </div>

      <div className="mb-6 flex rounded-xl bg-brand-light p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={[
            "flex-1 rounded-lg py-2 text-sm font-medium transition",
            tab === "login"
              ? "bg-brand text-white shadow-sm"
              : "text-brand/60 hover:text-brand",
          ].join(" ")}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={[
            "flex-1 rounded-lg py-2 text-sm font-medium transition",
            tab === "register"
              ? "bg-brand text-white shadow-sm"
              : "text-brand/60 hover:text-brand",
          ].join(" ")}
        >
          Register
        </button>
      </div>

      {tab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

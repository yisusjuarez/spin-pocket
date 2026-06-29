"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type Tab = "login" | "register";

export function AuthTabs() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {tab === "login" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {tab === "login"
            ? "Enter your email or phone number to continue."
            : "Fill in your details to get started."}
        </p>
      </div>

      <div className="mb-6 flex rounded-lg border border-gray-200 p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={[
            "flex-1 rounded-md py-2 text-sm font-medium transition",
            tab === "login"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={[
            "flex-1 rounded-md py-2 text-sm font-medium transition",
            tab === "register"
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          Register
        </button>
      </div>

      {tab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

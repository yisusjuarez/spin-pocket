import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login/LoginForm";

const mockLogin = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/hooks/useLogin", () => ({
  useLogin: () => ({ login: mockLogin, isPending: false, error: null }),
}));

beforeEach(() => {
  mockLogin.mockClear();
});

describe("LoginForm", () => {
  it("renders both fields and the submit button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email or phone/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
  });

  it("shows errors for both empty fields on submit", async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBe(2);
  });

  it("does not call the API when fields are invalid", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email or phone/i), "notvalid");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockLogin).not.toHaveBeenCalled();
  });
});

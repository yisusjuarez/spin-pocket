import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./RegisterForm";

const { mockRegister } = vi.hoisted(() => ({ mockRegister: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/hooks/useRegister", () => ({
  useRegister: () => ({ handleRegister: mockRegister, isPending: false, error: null }),
}));

beforeEach(() => mockRegister.mockClear());

describe("RegisterForm", () => {
  it("renders all fields and the submit button", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/full name/i)).toBeDefined();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/phone/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /create account/i })).toBeDefined();
  });

  it("does not call the API when fields are empty", async () => {
    render(<RegisterForm />);
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(mockRegister).not.toHaveBeenCalled();
  });
});

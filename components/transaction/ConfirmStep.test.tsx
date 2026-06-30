import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmStep } from "./ConfirmStep";

const { mockSubmit } = vi.hoisted(() => ({ mockSubmit: vi.fn() }));

vi.mock("@/hooks/useTransactionSubmit", () => ({
  useTransactionSubmit: () => ({ submit: mockSubmit, isPending: false, error: null }),
}));

const draft = {
  amount: 150,
  recipient: { name: "Carlos", email: "carlos@example.com" },
  saveContact: false,
};

describe("ConfirmStep", () => {
  it("renders recipient and amount", () => {
    render(<ConfirmStep draft={draft} senderBalance={1000} />);
    expect(screen.getByText("Carlos")).toBeDefined();
    expect(screen.getByText(/150\.00/)).toBeDefined();
  });

  it("shows the balance after deduction", () => {
    render(<ConfirmStep draft={draft} senderBalance={1000} />);
    expect(screen.getByText(/850\.00/)).toBeDefined();
  });
});

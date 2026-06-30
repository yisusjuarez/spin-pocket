import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionList } from "./TransactionList";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const tx = { id: "tx-1", type: "sent" as const, counterpartName: "Carlos", amount: 100, createdAt: Date.now() };

describe("TransactionList", () => {
  it("shows empty state when there are no transactions", () => {
    render(<TransactionList transactions={[]} />);
    expect(screen.getByText(/no transactions/i)).toBeDefined();
  });

  it("renders a row for each transaction", () => {
    render(<TransactionList transactions={[tx]} />);
    expect(screen.getByText("Carlos")).toBeDefined();
  });
});

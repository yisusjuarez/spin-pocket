import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionItem } from "./TransactionItem";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const base = { id: "tx-1", counterpartName: "Carlos", amount: 100, createdAt: Date.now() };

describe("TransactionItem", () => {
  it("shows a minus sign for sent transactions", () => {
    render(<TransactionItem transaction={{ ...base, type: "sent" }} />);
    expect(screen.getByText(/carlos/i)).toBeDefined();
    expect(screen.getByText(/−\$/)).toBeDefined();
  });

  it("shows 'Sent' label for sent transactions", () => {
    render(<TransactionItem transaction={{ ...base, type: "sent" }} />);
    expect(screen.getByText(/sent/i)).toBeDefined();
  });

  it("shows a plus sign for received transactions", () => {
    render(<TransactionItem transaction={{ ...base, type: "received" }} />);
    expect(screen.getByText(/\+\$/)).toBeDefined();
  });

  it("shows 'Received' label for received transactions", () => {
    render(<TransactionItem transaction={{ ...base, type: "received" }} />);
    expect(screen.getByText(/received/i)).toBeDefined();
  });

  it("links to the transaction detail page", () => {
    render(<TransactionItem transaction={{ ...base, type: "sent" }} />);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/transaction/tx-1");
  });
});

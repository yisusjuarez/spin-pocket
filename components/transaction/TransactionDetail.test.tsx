import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionDetail } from "./TransactionDetail";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const tx = {
  id: "tx-1",
  fromUserId: "u1", fromName: "Ana",
  toUserId: "u2", toName: "Carlos",
  amount: 200,
  balanceAfter: 800,
  createdAt: Date.now(),
};

describe("TransactionDetail", () => {
  it("shows the amount", () => {
    render(<TransactionDetail transaction={tx} isSent={true} />);
    expect(screen.getByText(/200\.00/)).toBeDefined();
  });

  it("shows sent direction label", () => {
    render(<TransactionDetail transaction={tx} isSent={true} />);
    expect(screen.getByText(/you sent/i)).toBeDefined();
  });

  it("shows received direction label", () => {
    render(<TransactionDetail transaction={tx} isSent={false} />);
    expect(screen.getByText(/you received/i)).toBeDefined();
  });

  it("shows To: with recipient name when sent", () => {
    render(<TransactionDetail transaction={tx} isSent={true} />);
    expect(screen.getByText("To")).toBeDefined();
    expect(screen.getByText("Carlos")).toBeDefined();
  });

  it("shows From: with sender name when received", () => {
    render(<TransactionDetail transaction={tx} isSent={false} />);
    expect(screen.getByText("From")).toBeDefined();
    expect(screen.getByText("Ana")).toBeDefined();
  });

  it("shows balance after when sent", () => {
    render(<TransactionDetail transaction={tx} isSent={true} />);
    expect(screen.getByText(/800\.00/)).toBeDefined();
  });

  it("hides balance after when received", () => {
    render(<TransactionDetail transaction={tx} isSent={false} />);
    expect(screen.queryByText(/800\.00/)).toBeNull();
  });

  it("has a link back to home", () => {
    render(<TransactionDetail transaction={tx} isSent={true} />);
    expect(screen.getByRole("link", { name: /back to home/i }).getAttribute("href")).toBe("/home");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BalanceCard } from "./BalanceCard";
import type { User } from "@/types/auth";

const user: User = { id: "u1", name: "Ana García", email: "ana@example.com", phone: "+525511223344", balance: 1500.5 };

describe("BalanceCard", () => {
  it("renders the user name and balance", () => {
    render(<BalanceCard user={user} />);
    expect(screen.getByText("Ana García")).toBeDefined();
    expect(screen.getByText(/1,500\.50/)).toBeDefined();
  });
});

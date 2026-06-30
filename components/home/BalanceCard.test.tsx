import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BalanceCard } from "./BalanceCard";

const user = { id: "u1", name: "Ana García", balance: 1500.5 };

describe("BalanceCard", () => {
  it("renders the user name and balance", () => {
    render(<BalanceCard user={user as any} />);
    expect(screen.getByText("Ana García")).toBeDefined();
    expect(screen.getByText(/1,500\.50/)).toBeDefined();
  });
});

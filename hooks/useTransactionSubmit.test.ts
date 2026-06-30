import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransactionSubmit } from "./useTransactionSubmit";

const { mockPush, mockSubmitTransaction, mockSaveContact } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockSubmitTransaction: vi.fn(),
  mockSaveContact: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/api/transactionApi", () => ({
  submitTransaction: mockSubmitTransaction,
  saveContact: mockSaveContact,
}));

const SUCCESS = {
  ok: true,
  data: { id: "tx-123", amount: 100, recipientName: "Carlos", balanceAfter: 900, createdAt: 1 },
};

const ERROR = {
  ok: false,
  error: { code: "NETWORK", message: "Network error. Please try again." },
};

const draft = {
  amount: 100,
  recipient: { name: "Carlos", email: "carlos@example.com" },
  saveContact: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSaveContact.mockResolvedValue(undefined);
});

describe("useTransactionSubmit", () => {
  it("navigates to /transaction/[id] on success", async () => {
    mockSubmitTransaction.mockResolvedValue(SUCCESS);
    const { result } = renderHook(() => useTransactionSubmit(draft));
    await act(async () => { result.current.submit(); });
    expect(mockPush).toHaveBeenCalledWith("/transaction/tx-123");
    expect(result.current.error).toBeNull();
  });

  it("sets error and does not navigate on API failure", async () => {
    mockSubmitTransaction.mockResolvedValue(ERROR);
    const { result } = renderHook(() => useTransactionSubmit(draft));
    await act(async () => { result.current.submit(); });
    expect(result.current.error).toEqual(ERROR.error);
    expect(mockPush).not.toHaveBeenCalled();
  });

});

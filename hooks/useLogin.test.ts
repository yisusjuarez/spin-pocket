import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";

const { mockPush, mockRefresh, mockLogin } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockLogin: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("@/lib/api/authApi", () => ({
  login: mockLogin,
}));

const SUCCESS = { ok: true, data: { user: { id: "u1", name: "Ana", balance: 1000 } } };
const ERROR = { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid credentials." } };

beforeEach(() => vi.clearAllMocks());

describe("useLogin", () => {
  it("navigates to /home and refreshes on success", async () => {
    mockLogin.mockResolvedValue(SUCCESS);
    const { result } = renderHook(() => useLogin());
    await act(async () => { result.current.handleLogin("ana@example.com", "password123"); });
    expect(mockPush).toHaveBeenCalledWith("/home");
    expect(mockRefresh).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("sets error and does not navigate on failure", async () => {
    mockLogin.mockResolvedValue(ERROR);
    const { result } = renderHook(() => useLogin());
    await act(async () => { result.current.handleLogin("unknown@example.com", "password123"); });
    expect(result.current.error).toEqual(ERROR.error);
    expect(mockPush).not.toHaveBeenCalled();
  });

});

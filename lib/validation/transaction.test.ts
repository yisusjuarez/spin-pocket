import { describe, it, expect } from "vitest";
import { validateAmount, validateRecipient } from "@/lib/validation/transaction";

describe("validateAmount", () => {
  it("rejects an empty value", () => {
    expect(validateAmount("", 1000).valid).toBe(false);
  });

  it("rejects zero", () => {
    expect(validateAmount("0", 1000).valid).toBe(false);
  });

  it("rejects a negative number", () => {
    expect(validateAmount("-5", 1000).valid).toBe(false);
  });

  it("rejects an amount that exceeds the balance", () => {
    expect(validateAmount("1001", 1000).valid).toBe(false);
  });

  it("accepts an amount equal to the balance", () => {
    expect(validateAmount("1000", 1000).valid).toBe(true);
  });

  it("accepts a valid amount within balance", () => {
    expect(validateAmount("100", 1000).valid).toBe(true);
  });
});

describe("validateRecipient", () => {
  it("rejects when both email and phone are empty", () => {
    expect(validateRecipient("", "").valid).toBe(false);
  });

  it("accepts when only email is provided", () => {
    expect(validateRecipient("carlos@example.com", "").valid).toBe(true);
  });

  it("accepts when only phone is provided", () => {
    expect(validateRecipient("", "+525511223344").valid).toBe(true);
  });

});

import { describe, it, expect } from "vitest";
import { validateIdentifier, validatePassword } from "@/lib/validation/login";

describe("validateIdentifier", () => {
  it("rejects an empty value", () => {
    expect(validateIdentifier("").valid).toBe(false);
  });

  it("rejects a value that is neither email nor phone", () => {
    expect(validateIdentifier("notvalid").valid).toBe(false);
  });

  it("accepts a valid email", () => {
    expect(validateIdentifier("user@example.com").valid).toBe(true);
  });

  it("accepts a valid phone number", () => {
    expect(validateIdentifier("+525511223344").valid).toBe(true);
  });
});

describe("validatePassword", () => {
  it("rejects an empty password", () => {
    expect(validatePassword("").valid).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    expect(validatePassword("abc").valid).toBe(false);
  });

  it("accepts a password of 6 or more characters", () => {
    expect(validatePassword("password123").valid).toBe(true);
  });
});

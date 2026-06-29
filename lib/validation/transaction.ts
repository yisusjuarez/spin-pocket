import type { ValidationResult } from "./login";

export function validateAmount(value: string, balance: number): ValidationResult {
  const num = parseFloat(value);
  if (!value || value.trim() === "") return { valid: false, error: "Amount is required." };
  if (isNaN(num) || num <= 0) return { valid: false, error: "Amount must be greater than zero." };
  if (num > balance) return { valid: false, error: "Insufficient balance." };
  return { valid: true };
}

export function validateRecipient(email: string, phone: string): ValidationResult {
  if (!email.trim() && !phone.trim()) {
    return { valid: false, error: "Provide at least an email or a phone number." };
  }
  return { valid: true };
}

import type { ValidationResult } from "./login";
import { EMAIL_REGEX, PHONE_REGEX } from "./patterns";

export function validateName(value: string): ValidationResult {
  if (!value || value.trim() === "") return { valid: false, error: "Name is required." };
  if (value.trim().length < 2) return { valid: false, error: "Name must be at least 2 characters." };
  return { valid: true };
}

export function validateEmail(value: string): ValidationResult {
  if (!value || value.trim() === "") return { valid: false, error: "Email is required." };
  if (!EMAIL_REGEX.test(value.trim())) return { valid: false, error: "Enter a valid email address." };
  return { valid: true };
}

export function validatePhone(value: string): ValidationResult {
  if (!value || value.trim() === "") return { valid: false, error: "Phone number is required." };
  if (!PHONE_REGEX.test(value.replace(/[\s\-().]/g, "")))
    return { valid: false, error: "Enter a valid phone number (e.g. +52 55 1234 5678)." };
  return { valid: true };
}

export function validateConfirmPassword(password: string, confirm: string): ValidationResult {
  if (!confirm || confirm.trim() === "") return { valid: false, error: "Please confirm your password." };
  if (password !== confirm) return { valid: false, error: "Passwords do not match." };
  return { valid: true };
}

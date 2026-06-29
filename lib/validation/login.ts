const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

function isPhone(value: string): boolean {
  return PHONE_REGEX.test(value.replace(/[\s\-().]/g, ""));
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePassword(value: string): ValidationResult {
  if (!value || value.trim() === "") {
    return { valid: false, error: "Password is required." };
  }
  if (value.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters." };
  }
  return { valid: true };
}

export function validateIdentifier(value: string): ValidationResult {
  if (!value || value.trim() === "") {
    return { valid: false, error: "This field is required." };
  }

  if (!isEmail(value) && !isPhone(value)) {
    return {
      valid: false,
      error: "Enter a valid email address or phone number.",
    };
  }

  return { valid: true };
}

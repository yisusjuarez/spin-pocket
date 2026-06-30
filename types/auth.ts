export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
}

export interface Session {
  user: User;
  issuedAt: number;
}

export interface LoginResult {
  user: User;
}

export interface ApiError {
  code: "INVALID_INPUT" | "UNAUTHORIZED" | "NETWORK" | "UNKNOWN";
  message: string;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

import type { User } from "@/types/auth";

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Ana García",
    email: "ana@example.com",
    phone: "+525511223344",
    balance: 12500.0,
  },
  {
    id: "user-2",
    name: "Carlos Méndez",
    email: "carlos@example.com",
    phone: "+525599887766",
    balance: 3200.5,
  },
];

const MOCK_PASSWORDS: Record<string, string> = {
  "user-1": "password123",
  "user-2": "password123",
};

export function findUserByIdentifier(identifier: string): User | undefined {
  const normalized = identifier.trim().toLowerCase();
  return MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.phone.replace(/[\s\-().]/g, "") ===
        normalized.replace(/[\s\-().]/g, "")
  );
}

export function findUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function checkPassword(userId: string, password: string): boolean {
  return MOCK_PASSWORDS[userId] === password;
}

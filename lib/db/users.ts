import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { User } from "@/types/auth";

interface UserRecord extends User {
  password: string;
}

const DB_PATH = join(process.cwd(), "mock-db", "users.json");

async function readUsers(): Promise<UserRecord[]> {
  const content = await readFile(DB_PATH, "utf-8");
  return JSON.parse(content) as UserRecord[];
}

async function writeUsers(users: UserRecord[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function getUserByIdentifier(identifier: string): Promise<User | undefined> {
  const users = await readUsers();
  const normalized = identifier.trim().toLowerCase();
  const record = users.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.phone.replace(/[\s\-().]/g, "") === normalized.replace(/[\s\-().]/g, "")
  );
  if (!record) return undefined;
  const { password: _, ...user } = record;
  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  const record = users.find((u) => u.id === id);
  if (!record) return undefined;
  const { password: _, ...user } = record;
  return user;
}

export async function checkPassword(userId: string, password: string): Promise<boolean> {
  const users = await readUsers();
  const record = users.find((u) => u.id === userId);
  return record?.password === password;
}

export async function isIdentifierTaken(
  email: string,
  phone: string
): Promise<{ email: boolean; phone: boolean }> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.replace(/[\s\-().]/g, "");
  return {
    email: users.some((u) => u.email.toLowerCase() === normalizedEmail),
    phone: users.some((u) => u.phone.replace(/[\s\-().]/g, "") === normalizedPhone),
  };
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> {
  const users = await readUsers();
  const id = `user-${Date.now()}`;
  const newRecord: UserRecord = { id, ...data, balance: 0 };
  users.push(newRecord);
  await writeUsers(users);
  const { password: _, ...user } = newRecord;
  return user;
}

export async function updateUserBalance(userId: string, newBalance: number): Promise<void> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error(`User ${userId} not found`);
  users[index].balance = newBalance;
  await writeUsers(users);
}

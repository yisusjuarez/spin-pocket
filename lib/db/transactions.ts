import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { Transaction, TransactionRecord } from "@/types/transaction";

const DB_PATH = join(process.cwd(), "mock-db", "transactions.json");

async function readTransactions(): Promise<TransactionRecord[]> {
  const content = await readFile(DB_PATH, "utf-8");
  return JSON.parse(content) as TransactionRecord[];
}

async function writeTransactions(transactions: TransactionRecord[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(transactions, null, 2), "utf-8");
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  const all = await readTransactions();
  return all
    .filter((t) => t.fromUserId === userId || t.toUserId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((t) => ({
      id: t.id,
      type: t.fromUserId === userId ? "sent" : "received",
      counterpartName: t.fromUserId === userId ? t.toName : t.fromName,
      amount: t.amount,
      description: t.description,
      createdAt: t.createdAt,
    }));
}

export async function getTransactionById(
  id: string,
  userId: string
): Promise<TransactionRecord | undefined> {
  const all = await readTransactions();
  const tx = all.find((t) => t.id === id);
  if (!tx) return undefined;
  if (tx.fromUserId !== userId && tx.toUserId !== userId) return undefined;
  return tx;
}

export async function addTransaction(record: TransactionRecord): Promise<void> {
  const transactions = await readTransactions();
  transactions.unshift(record);
  await writeTransactions(transactions);
}

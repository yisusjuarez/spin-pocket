export interface TransactionRecord {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string | null;
  toName: string;
  amount: number;
  balanceAfter: number;
  description?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: "sent" | "received";
  counterpartName: string;
  amount: number;
  description?: string;
  createdAt: number;
}

export interface TransactionResult {
  id: string;
  amount: number;
  recipientName: string;
  balanceAfter: number;
  createdAt: number;
}

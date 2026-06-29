/** Raw record as stored in mock-db/transactions.json */
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

/** What the home transaction list receives */
export interface Transaction {
  id: string;
  type: "sent" | "received";
  counterpartName: string;
  amount: number;
  description?: string;
  createdAt: number;
}

/** What the transaction API returns after a successful submission */
export interface TransactionResult {
  id: string;
  amount: number;
  recipientName: string;
  balanceAfter: number;
  createdAt: number;
}

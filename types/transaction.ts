/** Raw record as stored in mock-db/transactions.json */
export interface TransactionRecord {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number;
  description?: string;
  createdAt: number;
}

/** What the UI receives — type and counterpart derived from the viewer's perspective */
export interface Transaction {
  id: string;
  type: "sent" | "received";
  counterpartName: string;
  amount: number;
  description?: string;
  createdAt: number;
}

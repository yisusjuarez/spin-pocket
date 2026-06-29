import { post } from "@/lib/api/http";
import type { ApiResponse } from "@/types/auth";
import type { TransactionResult } from "@/types/transaction";
import type { Contact } from "@/types/contact";

export async function submitTransaction(data: {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  amount: number;
}): Promise<ApiResponse<TransactionResult>> {
  return post<TransactionResult>("/api/transactions", data);
}

export async function saveContact(data: {
  name: string;
  email?: string;
  phone?: string;
}): Promise<ApiResponse<Contact>> {
  return post<Contact>("/api/contacts", data);
}

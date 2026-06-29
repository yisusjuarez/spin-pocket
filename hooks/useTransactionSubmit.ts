"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitTransaction, saveContact } from "@/lib/api/transactionApi";
import type { ApiError } from "@/types/auth";

export interface TransactionDraft {
  amount: number;
  recipient: { name: string; email?: string; phone?: string };
  saveContact: boolean;
}

export function useTransactionSubmit(draft: TransactionDraft) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  function submit() {
    setError(null);
    startTransition(async () => {
      if (draft.saveContact) {
        await saveContact({
          name: draft.recipient.name,
          email: draft.recipient.email,
          phone: draft.recipient.phone,
        });
      }

      const result = await submitTransaction({
        recipientName: draft.recipient.name,
        recipientEmail: draft.recipient.email,
        recipientPhone: draft.recipient.phone,
        amount: draft.amount,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(`/transaction/${result.data.id}`);
    });
  }

  return { submit, isPending, error };
}

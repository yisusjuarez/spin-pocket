"use client";

import { useState } from "react";
import { AmountStep } from "./AmountStep";
import { ConfirmModal } from "./ConfirmModal";
import type { User } from "@/types/auth";
import type { Contact } from "@/types/contact";
import type { TransactionDraft } from "@/hooks/useTransactionSubmit";

interface TransactionFlowProps {
  user: User;
  contacts: Contact[];
}

export function TransactionFlow({ user, contacts }: TransactionFlowProps) {
  const [draft, setDraft] = useState<TransactionDraft | null>(null);

  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="rounded-2xl bg-white px-6 py-8 shadow-sm">
          <AmountStep user={user} contacts={contacts} onReview={setDraft} />
        </div>
      </main>
      {draft && (
        <ConfirmModal
          draft={draft}
          senderBalance={user.balance}
          onBack={() => setDraft(null)}
        />
      )}
    </>
  );
}

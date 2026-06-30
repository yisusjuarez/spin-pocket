"use client";

import { ConfirmStep } from "./ConfirmStep";
import type { TransactionDraft } from "@/hooks/useTransactionSubmit";

interface ConfirmModalProps {
  draft: TransactionDraft;
  senderBalance: number;
  onBack: () => void;
}

export function ConfirmModal({ draft, senderBalance, onBack }: ConfirmModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onBack}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2
              id="confirm-modal-title"
              className="text-base font-semibold text-gray-900"
            >
              Review transaction
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Confirm the details before sending.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            aria-label="Close"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <ConfirmStep draft={draft} senderBalance={senderBalance} onBack={onBack} />
        </div>
      </div>
    </div>
  );
}

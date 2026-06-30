"use client";

import { useState } from "react";
import Link from "next/link";
import { validateAmount, validateRecipient } from "@/lib/validation/transaction";
import type { User } from "@/types/auth";
import type { Contact } from "@/types/contact";
import type { TransactionDraft } from "@/hooks/useTransactionSubmit";
import { inputClass } from "@/components/ui/FormField";

interface AmountStepProps {
  user: User;
  contacts: Contact[];
  onReview: (draft: TransactionDraft) => void;
}

type ManualRecipient = {
  name: string;
  email: string;
  phone: string;
};

type AmountErrors = {
  amount: string | null;
  recipient: string | null;
};

const emptyManual: ManualRecipient = { name: "", email: "", phone: "" };
const emptyErrors: AmountErrors = { amount: null, recipient: null };

export function AmountStep({ user, contacts, onReview }: AmountStepProps) {
  const [amount, setAmount] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState(emptyManual);
  const [saveContact, setSaveContact] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const recipient = showManual
    ? manual.name.trim() && (manual.email.trim() || manual.phone.trim())
      ? {
          name: manual.name.trim(),
          email: manual.email.trim() || undefined,
          phone: manual.phone.trim() || undefined,
        }
      : null
    : selectedContact
      ? { name: selectedContact.name, email: selectedContact.email, phone: selectedContact.phone }
      : null;

  function updateManual(field: keyof typeof emptyManual, value: string) {
    setManual((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, recipient: null }));
  }

  function handleSelectContact(contact: Contact) {
    setSelectedContact(contact);
    setShowManual(false);
    setErrors((prev) => ({ ...prev, recipient: null }));
  }

  function handleShowManual() {
    setSelectedContact(null);
    setShowManual(true);
    setErrors((prev) => ({ ...prev, recipient: null }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountV = validateAmount(amount, user.balance);
    const recipientV = validateRecipient(recipient?.email ?? "", recipient?.phone ?? "");

    setErrors({ amount: amountV.error ?? null, recipient: recipientV.error ?? null });

    if (!amountV.valid || !recipientV.valid || !recipient) return;

    onReview({ amount: parseFloat(amount), recipient, saveContact });
  }


  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send money</h1>
        <p className="mt-1 text-sm text-gray-400">
          Balance:{" "}
          <span className="font-medium text-gray-600">
            ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className="text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: null }));
          }}
          placeholder="0.00"
          className={inputClass(errors.amount)}
        />
        {errors.amount && (
          <p className="text-xs text-red-500" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Recipient</span>

        {contacts.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {contacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <li key={contact.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className={[
                      "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                      isSelected
                        ? "border-brand bg-brand text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-brand/40 hover:bg-brand-light/30",
                    ].join(" ")}
                  >
                    <span className="font-medium">{contact.name}</span>
                    <span className={`ml-2 text-xs ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                      {contact.email ?? contact.phone}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {!showManual ? (
          <button
            type="button"
            onClick={handleShowManual}
            className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-left text-sm text-gray-400 transition hover:border-brand/40 hover:text-brand/70"
          >
            + New recipient
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            {(
              [
                { id: "manual-name", field: "name", label: "Name", type: "text", placeholder: "Full name" },
                { id: "manual-email", field: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                { id: "manual-phone", field: "phone", label: "Phone", type: "tel", placeholder: "+52 55 1234 5678" },
              ] as const
            ).map(({ id, field, label, type, placeholder }) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-xs font-medium text-gray-500">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={manual[field]}
                  onChange={(e) => updateManual(field, e.target.value)}
                  placeholder={placeholder}
                  className={inputClass()}
                />
              </div>
            ))}
            <p className="text-xs text-gray-400">Fill in at least one contact method.</p>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={saveContact}
                onChange={(e) => setSaveContact(e.target.checked)}
                className="rounded border-gray-300 accent-brand"
              />
              Save as contact
            </label>
          </div>
        )}

        {errors.recipient && (
          <p className="text-xs text-red-500" role="alert">
            {errors.recipient}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/home"
          className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
        >
          Review
        </button>
      </div>
    </form>
  );
}

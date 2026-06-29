"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateAmount, validateRecipient } from "@/lib/validation/transaction";
import type { User } from "@/types/auth";
import type { Contact } from "@/types/contact";

interface AmountStepProps {
  user: User;
  contacts: Contact[];
}

export function AmountStep({ user, contacts }: AmountStepProps) {
  const [amount, setAmount] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [saveContact, setSaveContact] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  const router = useRouter();

  const recipient = showManual
    ? manualName.trim() && (manualEmail.trim() || manualPhone.trim())
      ? { name: manualName.trim(), email: manualEmail.trim() || undefined, phone: manualPhone.trim() || undefined }
      : null
    : selectedContact
      ? { name: selectedContact.name, email: selectedContact.email, phone: selectedContact.phone }
      : null;

  function handleSelectContact(contact: Contact) {
    setSelectedContact(contact);
    setShowManual(false);
    setRecipientError(null);
  }

  function handleShowManual() {
    setSelectedContact(null);
    setShowManual(true);
    setRecipientError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountV = validateAmount(amount, user.balance);
    const recipientV = validateRecipient(recipient?.email ?? "", recipient?.phone ?? "");

    setAmountError(amountV.error ?? null);
    setRecipientError(recipientV.error ?? null);

    if (!amountV.valid || !recipientV.valid || !recipient) return;

    const params = new URLSearchParams();
    params.set("amount", String(parseFloat(amount)));
    params.set("recipientName", recipient.name);
    if (recipient.email) params.set("recipientEmail", recipient.email);
    if (recipient.phone) params.set("recipientPhone", recipient.phone);
    if (saveContact) params.set("saveContact", "true");

    router.push(`/transaction/confirm?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New transaction</h1>
        <p className="mt-1 text-sm text-gray-500">
          Balance: ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
          onChange={(e) => { setAmount(e.target.value); setAmountError(null); }}
          placeholder="0.00"
          className={[
            "w-full rounded-lg border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400",
            amountError
              ? "border-red-400 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
          ].join(" ")}
        />
        {amountError && <p className="text-xs text-red-500" role="alert">{amountError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Recipient</span>

        {contacts.length > 0 && (
          <ul className="flex flex-col gap-1">
            {contacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <li key={contact.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className={[
                      "w-full rounded-lg border px-4 py-3 text-left text-sm transition",
                      isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                    ].join(" ")}
                  >
                    <span className="font-medium">{contact.name}</span>
                    <span className={`ml-2 text-xs ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
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
            className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-left text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
          >
            + Enter new contact
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="manual-name" className="text-xs font-medium text-gray-600">Name</label>
              <input
                id="manual-name"
                type="text"
                value={manualName}
                onChange={(e) => { setManualName(e.target.value); setRecipientError(null); }}
                placeholder="Full name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="manual-email" className="text-xs font-medium text-gray-600">Email</label>
              <input
                id="manual-email"
                type="email"
                value={manualEmail}
                onChange={(e) => { setManualEmail(e.target.value); setRecipientError(null); }}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="manual-phone" className="text-xs font-medium text-gray-600">Phone</label>
              <input
                id="manual-phone"
                type="tel"
                value={manualPhone}
                onChange={(e) => { setManualPhone(e.target.value); setRecipientError(null); }}
                placeholder="+52 55 1234 5678"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <p className="text-xs text-gray-400">Fill in at least one contact method.</p>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={saveContact}
                onChange={(e) => setSaveContact(e.target.checked)}
                className="rounded border-gray-300"
              />
              Save as contact
            </label>
          </div>
        )}

        {recipientError && <p className="text-xs text-red-500" role="alert">{recipientError}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
      >
        Review
      </button>
    </form>
  );
}

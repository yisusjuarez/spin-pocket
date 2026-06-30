# Spin Pocket: Mini Wallet

A mini wallet web app built with Next.js 16, TypeScript, and Tailwind CSS.

[Architecture decisions](DECISIONS.md) · [AI usage](AI_USAGE.md)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login`.

---

## Features

### Authentication
- **Sign in** with an email address or phone number plus a password.
- **Register** a new account with your name, email, phone, and password (with confirmation). The account is persisted immediately in `mock-db/users.json`.
- **Sign out** from the navbar. Sessions are stored in an httpOnly cookie.

### Home screen (`/home`)
- Displays the logged-in user's **available balance** on a hero card.
- Lists all **recent transactions** (sent and received) in reverse-chronological order.
- Each row shows a colored avatar built from the counterpart's initials, the name, a description, the date, and the signed amount (`−` for sent, `+` for received).
- Clicking any row navigates to the **transaction detail** page.
- The **Send money** button opens the send flow.

### Send money (`/transaction/new`)
- Enter an **amount** (must be ≤ available balance).
- Pick a **recipient** from saved contacts or enter a new one manually (name + email and/or phone).
- Optionally **save the new contact** for future transactions.
- Clicking **Review** opens a confirmation modal without leaving the page.

### Confirmation modal
- Shows a summary: recipient, email/phone, amount, and projected balance after.
- **Confirm** submits the transfer. **Cancel** returns to the form.
- Errors surface inline with a **Try again** button for retryable failures.

### Transaction detail (`/transaction/[id]`)
- Receipt-style view: checkmark icon, amount, counterpart, date, and reference ID.
- Shows **"You sent"** (violet) or **"You received"** (orange) depending on direction.
- Sent transactions also show the balance immediately after the transfer.

---

## Test accounts

The two seed accounts live in `mock-db/users.json`. Passwords are plain text and the database is a JSON file simulation; this is for demo purposes only.

| Name | Email | Phone | Password | Balance |
|---|---|---|---|---|
| Ana García | ana@example.com | +525511223344 | password123 | (updates as you transact) |
| Carlos Méndez | carlos@example.com | +525599887766 | password123 | (updates as you transact) |

Login accepts **either email or phone number**.

### How to add a test user manually

You can also create accounts through the **Register tab** on the login page. No file editing needed. The JSON approach below is useful when you want to seed a user with a specific balance or ID without going through the UI.

Open `mock-db/users.json` and append an entry following this shape:

```json
{
  "id": "user-3",
  "name": "Lucía Torres",
  "email": "lucia@example.com",
  "phone": "+525512345678",
  "password": "password123",
  "balance": 8000
}
```

- `id` must be unique across the array.
- `balance` is stored in whole currency units (e.g., `8000` = $8,000.00).
- No restart required. The JSON files are read on every request.

### How to reset balances or transactions

The database files are plain JSON under `mock-db/`:

| File | Contents |
|---|---|
| `mock-db/users.json` | User accounts and balances |
| `mock-db/transactions.json` | All transaction records |
| `mock-db/contacts.json` | Saved contacts per user |

To reset to a clean slate, edit those files directly. Deleting all entries from `transactions.json` gives every user a fresh history, and setting `balance` in `users.json` resets the funds.

---

## Transaction scenarios

### Sending money: success path

1. Log in as **Ana** (`ana@example.com` / `password123`).
2. Click **Send money**.
3. Enter any amount ≤ balance and select **Carlos Méndez** (or enter `carlos@example.com` manually).
4. Click **Review**, then **Confirm**.
5. You land on the receipt page. Ana's balance decreases; Carlos's increases.

### Sending money: received transfer

1. Log out and log in as **Carlos**.
2. The transaction from step 5 above appears at the top of his list as **Received +$X.XX**.
3. Click it. The detail page shows "You received" with Ana's name.

### Error scenarios

Each account has special pre-loaded contacts that trigger specific server behaviors. You can also trigger them manually with any new recipient whose name contains the keyword.

| Contact / keyword in name | Scenario | What you see |
|---|---|---|
| Any real contact or manual recipient | **Success** | Receipt with "You sent" |
| **Juan Error** / name contains `error` | Network error | Error banner + "Try again" button |
| **Edén TimeOut** / name contains `timeout` | Request timeout (8 s) | Error banner + "Try again" button |
| **Max Unknown** / name contains `unknown` | Unknown server error | Error banner + "Try again" button |
| Any recipient + amount > balance | Insufficient funds | Inline validation error; the confirm modal does not open |

---

## Running tests

```bash
# Unit + integration tests (Vitest)
npm run test

# E2E tests: builds the app first
npm run test:e2e
```

Unit tests cover validators (`lib/validation/`) and critical client-component behavior. E2E tests cover login, logout, the full transaction flow, all error scenarios, history navigation, and the received-transfer flow.

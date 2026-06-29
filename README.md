# Spin Pocket — Mini Wallet

A mini wallet web app built with Next.js 16, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login`.

## Test accounts

| Name | Email | Phone | Password | Balance |
|---|---|---|---|---|
| Ana García | ana@example.com | +525511223344 | password123 | $12,500.00 |
| Carlos Méndez | carlos@example.com | +525599887766 | password123 | $3,200.50 |

Login accepts either email or phone number.

## Flow

1. **Login / Register** — sign in with an existing account or create a new one.
2. **Home** — shows available balance and recent transactions.
3. **New transaction** — enter an amount and select a recipient.
4. **Confirmation** — review the summary and confirm the transfer.

## Transaction scenarios

Every account comes pre-loaded with special contacts that trigger specific error scenarios. Use them to test each case:

| Contact | Scenario | Expected behavior |
|---|---|---|
| Any real contact or manual recipient | **Success** | Transaction confirmed, receipt shown |
| **Juan Error** | Network error | Server returns an error; banner appears with a "Try again" option |
| **Edén TimeOut** | Timeout | Request is aborted after 8 seconds; banner appears with a "Try again" option |
| **Max Unknown** | Unknown error | Server returns an unexpected error; banner appears with a "Try again" option |
| Any recipient + amount exceeding balance | **Insufficient funds** | Transaction rejected before sending; no retry (go back and adjust the amount) |

> Scenarios are triggered by a keyword in the recipient name. The special contacts are preloaded for convenience, but you can also trigger any scenario manually by entering a new contact whose name includes one of these keywords:
> - `error` — network error
> - `timeout` — timeout
> - `unknown` — unknown error

## Running tests

```bash
npm run test
```

Tests cover validators (`lib/validation/`) and critical client component behavior (`components/login/`).

# Tasks: Mini Wallet Web App

## Screens
- [x] Login: form (phone or email), validations, loading/error states, session persistence, redirect to Home
- [x] Register: form (name, email or phone, password), validations, redirect to Home
- [x] Home: user name + balance, recent transactions list, loading/empty/error states, button to start new transaction
- [x] New Transaction: amount input, select favorite contact or add new one, navigates to Confirmation
- [x] Confirmation: shows draft summary; outcomes: success (receipt at /transaction/[id]), network error (retry), timeout (retry), unknown error (retry)
- [x] Transaction Detail: receipt page reopenable from transaction history

## Business Rules
- [x] Amount must be greater than zero
- [x] Amount cannot exceed available balance
- [x] Recipient is required before confirming

## Technical Requirements
- [x] Next.js + TypeScript
- [x] API Routes with mocked data (auth, contacts, transactions)
- [x] State management: no global store; data flows via props and local React state (justified in DECISIONS.md)
- [x] SSR/CSR decisions justified per page (DECISIONS.md)
- [x] Unit tests: validations (login + transaction), login form, useLogin and useTransactionSubmit hooks
- [x] E2E tests with Playwright: login, logout, transaction happy path, error scenario, history navigation

## Deliverables
- [x] README.md: setup instructions, scenario contacts, known limitations
- [x] DECISIONS.md: architecture, rendering, session, state, API layer
- [x] AI_USAGE.md: tools used, what was accepted/corrected, decisions that were yours

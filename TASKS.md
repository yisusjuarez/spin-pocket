# Tasks — Mini Wallet Web App

## Screens
- [ ] Login — form (phone or email), validations, loading/error states, session persistence, redirect to Home
- [ ] Home — user name + balance, recent transactions list, loading/empty/error states, button to start new transaction
- [ ] New Transaction — amount input, select favorite contact or add new one, summary before confirming, confirm with mocked response
- [ ] Confirmation — random outcome: success (receipt), network error (retry), insufficient funds, timeout, unknown error fallback

## Business Rules
- [ ] Amount must be greater than zero
- [ ] Amount cannot exceed available balance
- [ ] Recipient is required before confirming

## Technical Requirements
- [X] Next.js + TypeScript
- [ ] API Routes with mocked data
- [X] State management (justify choice)
- [ ] SSR/CSR decisions (justify per page)
- [ ] Unit tests — validations, hooks, critical components
- [ ] E2E tests (justify tool choice)

## Deliverables
- [ ] README.md — setup instructions, libraries, known limitations, time invested
- [ ] DECISIONS.md — architecture, UI/logic separation, edge cases, what you'd do differently
- [ ] AI_USAGE.md — tools used, what was accepted/corrected, decisions that were yours

# AI Usage

## Tools

Claude Code (claude.ai/code) was used throughout the project for code generation, implementation, and documentation. All interactions were conversational — I described what I wanted and corrected the output when it missed the mark.

---

## What Claude suggested and I accepted

**JSON files as mock database format:** Claude suggested JSON over CSV. I accepted it because JSON maps directly to the domain objects the app already uses, handles optional fields naturally, and requires no parsing logic.

**Vitest + React Testing Library:** Claude proposed this combination for unit tests. I accepted it — Vitest is fast, has native TypeScript support, and RTL keeps tests focused on user behavior rather than implementation details.

**`lib/db/` as the only entry point to mock data:** Claude proposed isolating all file reads and writes behind a dedicated layer so the rest of the app only calls functions, not touches files. I kept it because it mirrors the separation that would exist with a real database.

---

## What Claude suggested and I rejected or corrected

**Session in Zustand + localStorage (rejected):** Claude's first implementation stored the session token in a Zustand store persisted to `localStorage`. I flagged this as an XSS vulnerability — any JavaScript on the page can read `localStorage`, so a compromised third-party script or injected payload can steal the session. I proposed using an `httpOnly` cookie instead, which is invisible to JavaScript entirely. Claude implemented it.

**Zustand for cross-page transaction draft (rejected):** Claude used a Zustand store to carry the amount and recipient from `/transaction/new` to `/transaction/confirm`. This introduced a bug — resetting the store on submission triggered a redirect guard before navigation completed. I questioned why a store was needed at all for data moving between two consecutive pages. We removed Zustand entirely and passed the draft as URL search parameters instead, which is simpler, bookmarkable, and correct on refresh.

**Single `identifier` field in contacts (rejected):** Claude modeled contacts with a single `identifier` field for both email and phone. I pointed out that separating them into `email` and `phone` fields is the real-world standard — it removes ambiguity about what the value represents and makes it possible to display or use each one independently.

**Scenario contacts hardcoded per user in JSON (rejected):** Claude stored the test scenario contacts (Juan Error, Edén TimeOut, Max Unknown) directly in the mock database file for each user. I said these contacts should be available to all users automatically, including new registrations, without hardcoding anything. Claude moved them to a constant in `lib/db/contacts.ts` that gets appended dynamically to every user's contact list.

---

## Decisions that were mine

- Using `httpOnly` cookies for the session instead of any client-side storage.
- Splitting the transaction flow into separate pages (`/new`, `/confirm`, `/transaction/[id]`) instead of a single-page step flow.
- Separate `email` and `phone` fields on contacts instead of a single identifier.
- Scenario contacts injected dynamically for all users, not stored per user.
- Triggering error scenarios by recipient name keyword rather than a random outcome, so the scenarios are reproducible and testable.
- Adding a transaction detail page (`/transaction/[id]`) accessible from the history list, as an extra feature beyond the original spec.

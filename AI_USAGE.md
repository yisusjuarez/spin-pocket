# AI Usage

[Back to README](README.md)

## Tools

Claude Code was used throughout the project for code generation, implementation, and documentation. All interactions were conversational I described what I wanted and corrected the output when it missed the mark.

---

## What Claude suggested and I accepted

**JSON files as mock database format:** Claude suggested JSON over CSV. I accepted it because JSON maps directly to the domain objects the app already uses, handles optional fields naturally, and requires no parsing logic.

**Vitest + React Testing Library:** Claude proposed this combination for unit tests. I accepted it Vitest is fast, has native TypeScript support, and RTL keeps tests focused on user behavior rather than implementation details.

**Playwright for E2E tests:** I added Playwright to complement the unit tests. Claude helped fill out the test cases error scenarios and configuration (e.g. skip vitest tests for validation).

**`lib/db/` as the only entry point to mock data:** Claude proposed isolating all file reads and writes behind a dedicated layer so the rest of the app only calls functions, not touches files. I kept it because it mirrors a real database.

---

## What Claude suggested and I rejected or corrected

**Session in Zustand + localStorage (rejected):** Claude initially suggested persisting the session in Zustand using localStorage. I rejected that approach because it exposes the session to XSS attacks. Instead, we moved the session to an httpOnly cookie managed on the server with Next.js cookies(), preventing client-side JavaScript from accessing the session value.

**Zustand for cross-page transaction draft (rejected):** Claude used a Zustand store to carry the amount and recipient from `/transaction/new` to `/transaction/confirm`. This introduced a bug resetting the store on submission triggered a redirect guard before navigation completed. I pointed out that Zustand was unnecessary. Claude then proposed URL search parameters for the separate confirm page, but I said I didn't like exposing the draft in the URL and the separate page was the wrong model. I asked for a modal instead so the data stays in local React state on the same page and never touches the URL or any store.

**Single `identifier` field in contacts (rejected):** Claude modeled contacts with a single `identifier` field for both email and phone. I pointed out that separating them into `email` and `phone` fields is the real-world standard it removes ambiguity about what the value represents and makes it possible to display or use each one independently.

**Scenario contacts hardcoded per user in JSON (rejected):** Claude stored the test scenario contacts (Juan Error, Edén TimeOut, Max Unknown) directly in the mock database file for each user. I said these contacts should be available to all users automatically, including new registrations, without hardcoding anything. Claude moved them to a constant in `lib/db/contacts.ts` that gets appended dynamically to every user's contact list.

---

## Decisions that were mine

- Using `httpOnly` cookies for the session instead of any client-side storage.
- Using a modal for the confirm step rather than a separate page, keeping the draft in local React state and avoiding any URL serialization or global store.
- Separate `email` and `phone` fields on contacts instead of a single identifier.
- Scenario contacts injected dynamically for all users, not stored per user.
- Triggering error scenarios by recipient name keyword rather than a random outcome, so the scenarios are reproducible and testable.
- Adding a transaction detail page (`/transaction/[id]`) accessible from the history list, as an extra feature beyond the original spec.

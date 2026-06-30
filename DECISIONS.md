# Decisions

[Back to README](README.md)

## Architecture

### Routing

**Choice:** App Router with Server Components by default

This application uses the App Router, the modern routing system recommended by Next.js. Its file-based routing conventions make the project structure easy to understand and scale as new routes and features are added.
It also enables React Server Components by default, reducing client-side JavaScript by keeping non-interactive logic on the server and improving overall performance.

### Transaction flow routing

The transaction flow uses two pages and one modal overlay:

- `/transaction/new`: enter amount and recipient; the confirm modal appears as an overlay on this same URL
- `/transaction/[id]`: receipt and transaction detail

The confirm step is a modal (`ConfirmModal`) rendered by `TransactionFlow`, a Client Component that owns the draft state. When the user clicks "Review", the draft is stored in local React state and the modal opens no URL change, no serialization to search params. "Back" clears the draft and closes the modal.

Once a transaction is confirmed, the API returns the transaction ID and the user is navigated to `/transaction/[id]`. From that point the page is a Server Component that reads the record from the database, so the detail is always up to date and can be reopened from the transaction history on the home page.

---

### Rendering Strategy

Server Components are the default across the application. This reduces the amount of JavaScript shipped to the client and improves rendering performance in pages where interactivity is not required.
Client Components are used only when interactivity or browser APIs are needed.
This approach also allows data fetching directly inside Server Components, avoiding unnecessary client-side loading states and request waterfalls.

---

### State Management

No global client-side state library is used. Every page in this application gets its data from the server: Server Components fetch directly from the database and pass data down as props, and Client Components manage only their own local UI state with `useState`.

The transaction draft (amount + recipient) lives in local state inside `TransactionFlow` and is passed directly to `ConfirmModal` as a prop. There is no cross-page serialization and no global store. The data only exists for the duration of the current flow on `/transaction/new`.

---

### Business Rule Validation

The three transaction business rules (amount > 0, amount within balance, recipient required) are enforced in two places:

1. **Client-side in `AmountStep`:** pure validation functions run before the form opens the confirm modal. This gives immediate feedback without a network round trip, but it is a UX layer only. The client cannot be trusted.
2. **Server-side in the API route:** the POST handler re-validates all three rules against the database before writing anything. This is the authoritative enforcement layer. A manual request that bypasses the form is still rejected here.

---

### Backend API and Data

All data fetching is done through Next.js API Routes, which act as a proxy layer between the client and the backend REST API.
In this project, responses are mocked, but the structure mirrors a real integration so that replacing mocks with a real backend requires no changes on the client side.
This approach keeps sensitive data such as API keys and credentials on the server, preventing exposure in the browser. The client only communicates with internal API Routes, which act as a security boundary.

Server Components read data by calling the database layer directly, without going through an API route. 
This avoids an unnecessary internal HTTP round trip while still keeping all data access server side. API routes handle operations triggered from the client (mutations and client side fetches).

### Mock Database

Data is stored in JSON files under `mock-db/` and accessed through a dedicated layer in `lib/db/`. Each file corresponds to a domain entity (`users.json`, `transactions.json`). 
The DB layer functions (`getUserById`, `getTransactionsByUserId`, `addTransaction`, etc.) handle all reads and writes, so no other part of the code touches the files directly.

This mirrors the separation that would exist with a real database: the rest of the application only knows about the functions, not the storage details. 
Swapping the JSON files for a real database only requires updating `lib/db/`.

---

### Styling

**Choice:** Tailwind CSS
Traditional CSS files tend to grow over time, leading to specificity conflicts and scattered styles. 
Tailwind avoids this by keeping styles colocated with the component, eliminating cascade issues and reducing context switching.
Global CSS is reserved for design system primitives such as variables, tokens, and base styles. All component-level styling is handled through utility classes.

---

### Session and Authentication

The session credential is stored in an `httpOnly` cookie set by the login API Route, never in `localStorage` or any client-side store. 
This is the correct security boundary: `localStorage` is readable by any JavaScript on the page, meaning an XSS payload can exfiltrate a token stored there. 
An `httpOnly` cookie is invisible to JavaScript entirely. The browser attaches it to requests automatically, and only the server can read or clear it.

Cookie attributes used: `httpOnly`, `sameSite=lax` (CSRF protection for navigation requests), `secure` in production, `path=/`, `maxAge=24h`.

In this project the cookie value is the mock user id, which is enough for a simulated session. 
In a real implementation this would be a signed, opaque token (JWT or server-side session id) so the server can verify integrity and revoke sessions independently of the user record.

Server Components read the session via `lib/auth/session.ts → getSession()`, which calls `cookies()` from `next/headers`. 
This file cannot be imported in Client Components (Next.js enforces this through the `next/headers` module boundary), so the session credential stays on the server by construction.

---

### Testing

**Runner:** Vitest with React Testing Library

Tests are colocated with their source file: a `login.test.ts` lives next to `login.ts`, a `LoginForm.test.tsx` lives next to `LoginForm.tsx`. 
This makes it immediately clear what is tested and what is not, and keeps the test close to the code it covers.

Unit tests focus on pure logic (validators, utilities) and critical Client Component behavior (validation fires before the API is called). Async Server Components and API Routes are not covered by unit tests since Vitest does not support them those are covered by E2E tests instead.

**E2E runner:** Playwright

Playwright was chosen over Cypress because it runs in a real browser process (no iframe sandbox), has first-class support for multiple browsers, and its async API maps naturally to Next.js App Router navigation. E2E tests cover login, logout, the full transaction flow, the network error scenario, and transaction history navigation. Run with `npm run test:e2e`.

---

### UI and Logic Separation

Server Components handle data fetching and pass data as props.
Client Components handle user interaction and local UI state.
Business logic is kept in dedicated hooks or utility functions outside of UI components, making it easier to test and reuse independently.

---

## Known Limitations

### Balance update race condition

The transaction route reads the sender's balance, checks it, and then writes the updated value as two separate operations. Under concurrent requests, 
two transactions could both pass the balance check before either write completes, allowing the balance to go negative. 
In a real financial system this would be handled at the database level with a transaction and a row lock. This is noted here because it is the first issue that would need to be resolved before this code handles real money.

### Session cookie stores a plain user id

The `spin-pocket-session` cookie currently contains the user id in plain text. This is sufficient for a simulated session but would not be acceptable in production. 
A real implementation would use a signed JWT so the server can verify integrity and revoke sessions.

### Passwords are stored in plain text

Passwords in `mock-db/users.json` are plain strings. A real app would hash them before storage.

### mock-db is a file-based simulation

The `mock-db/` directory uses JSON files to simulate a database.

---

## Error scenario triggering

The confirmation step combines both approaches. Recipients whose name contains a keyword (`error`, `timeout`, `unknown`) always trigger the corresponding scenario, making those cases fully reproducible and directly testable. For all other recipients, the API applies a random roll on each request: ~12% chance of a network error, ~8% unknown error, ~3% timeout, and ~77% success. This satisfies the challenge requirement for random behavior while keeping the keyword contacts reliable for E2E tests.

---

## What I would do differently with more time

- Include a component library like Shadcn
- Improve the UI with animations and design a better theme
- Simulate JWT instead of using the user id as a token.
- Add pagination to the transaction list on the home screen.
- Toast component for error handling and notifications (Succes transfer, contact saved, etc.).

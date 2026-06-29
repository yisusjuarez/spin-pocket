# Decisions

## Architecture

### Routing

**Choice:** App Router with Server Components by default

This application uses the App Router, the modern routing system recommended by Next.js. Its file-based routing conventions make the project structure easy to understand and scale as new routes and features are added.
It also enables React Server Components by default, reducing client-side JavaScript by keeping non-interactive logic on the server and improving overall performance.

### Transaction flow routing

The transaction flow is split across three distinct pages rather than managed as steps inside a single component:

- `/transaction/new` — enter amount and recipient
- `/transaction/confirm` — review summary before sending
- `/transaction/[id]` — receipt and transaction detail

Each step has its own URL. This means the browser's back button works naturally, users can bookmark or share a transaction detail link, and the confirmation page can be navigated to directly.

The draft (amount + recipient) is passed from `/new` to `/confirm` via Zustand, since it is short-lived client state that does not need to be persisted or shared. If the user refreshes `/confirm` without a draft, they are redirected back to `/new`.

Once a transaction is confirmed, the API returns the transaction ID and the user is navigated to `/transaction/[id]`. From that point the page is a Server Component that reads the record from the database, so the detail is always up to date and can be reopened from the transaction history on the home page.

---

### Rendering Strategy

Server Components are the default across the application. This reduces the amount of JavaScript shipped to the client and improves rendering performance in pages where interactivity is not required.
Client Components are used only when interactivity or browser APIs are needed.
This approach also allows data fetching directly inside Server Components, avoiding unnecessary client-side loading states and request waterfalls.

---

### State Management

No global client-side state library is used. Every page in this application gets its data from the server: Server Components fetch directly from the database and pass data down as props, and Client Components manage only their own local UI state with `useState`.

Data that needs to move between pages (such as the transaction draft) travels in the URL as search parameters, not in a client store. This keeps the data visible, bookmarkable, and correct on refresh without any synchronization logic.

---

### Backend API and Data

All data fetching is done through Next.js API Routes, which act as a proxy layer between the client and the backend REST API.
In this project, responses are mocked, but the structure mirrors a real integration so that replacing mocks with a real backend requires no changes on the client side.
This approach keeps sensitive data such as API keys and credentials on the server, preventing exposure in the browser. The client only communicates with internal API Routes, which act as a security boundary.

Server Components read data by calling the database layer directly, without going through an API route. This avoids an unnecessary internal HTTP round trip while still keeping all data access server side. API routes handle operations triggered from the client (mutations and client side fetches).

### Mock Database

Data is stored in JSON files under `mock-db/` and accessed through a dedicated layer in `lib/db/`. Each file corresponds to a domain entity (`users.json`, `transactions.json`). The DB layer functions (`getUserById`, `getTransactionsByUserId`, `addTransaction`, etc.) handle all reads and writes, so no other part of the code touches the files directly.

This mirrors the separation that would exist with a real database: the rest of the application only knows about the functions, not the storage details. Swapping the JSON files for a real database only requires updating `lib/db/`.

---

### Styling

**Choice:** Tailwind CSS
Traditional CSS files tend to grow over time, leading to specificity conflicts and scattered styles. Tailwind avoids this by keeping styles colocated with the component, eliminating cascade issues and reducing context switching.
Global CSS is reserved for design system primitives such as variables, tokens, and base styles. All component-level styling is handled through utility classes.

---

### Session and Authentication

The session credential is stored in an `httpOnly` cookie set by the login API Route, never in `localStorage` or any client-side store. This is the correct security boundary: `localStorage` is readable by any JavaScript on the page, meaning an XSS payload can exfiltrate a token stored there. An `httpOnly` cookie is invisible to JavaScript entirely — the browser attaches it to requests automatically, and only the server can read or clear it.

Cookie attributes used: `httpOnly`, `sameSite=lax` (CSRF protection for navigation requests), `secure` in production, `path=/`, `maxAge=24h`.

In this project the cookie value is the mock user id, which is enough for a simulated session. In a real implementation this would be a signed, opaque token (JWT or server-side session id) so the server can verify integrity and revoke sessions independently of the user record.

Server Components read the session via `lib/auth/session.ts → getSession()`, which calls `cookies()` from `next/headers`. This file cannot be imported in Client Components (Next.js enforces this through the `next/headers` module boundary), so the session credential stays on the server by construction.

---

### Testing

**Runner:** Vitest with React Testing Library

Tests are colocated with their source file — a `login.test.ts` lives next to `login.ts`, a `LoginForm.test.tsx` lives next to `LoginForm.tsx`. This makes it immediately clear what is tested and what is not, and keeps the test close to the code it covers.

Unit tests focus on pure logic (validators, utilities) and critical Client Component behavior (validation fires before the API is called). Async Server Components and API Routes are not covered by unit tests since Vitest does not support them; those are candidates for E2E tests.

---

### UI and Logic Separation

Server Components handle data fetching and pass data as props.
Client Components handle user interaction and local UI state.
Zustand stores manage shared client-side state across components.
Business logic is kept in dedicated hooks or utility functions outside of UI components, making it easier to test and reuse independently.

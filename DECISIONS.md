# Decisions

## Architecture


### Routing

**Choice:** App Router with Server Components by default

This application uses the App Router, the modern routing system recommended by Next.js. Its file-based routing conventions make the project structure easy to understand and easy to scale as new routes and features are added. It also enables React Server Components by default, which reduces client-side JavaScript by keeping non interactive logic on the server and improves overall performance. 

### Rendering strategy

Server Components are used by default across the application. This reduces the amount of JavaScript shipped to the client and improves rendering performance in pages where interactivity is not required. 
Client Components are introduced only where user interaction or browser APIs (if needed).

This approach also enables data fetching directly inside components using async Server Components, removing the need for separate data-fetching layers or client-side loading waterfalls.

### State management

**Choice:** Zustand

A wallet application manages several pieces of shared state including session, balance, transactions, and contacts. Redux was discarded early as it introduces too much complexity and introduces concepts like reducers, actions, sagas, and more.

React Context was the main alternative. The core problem with Context is that every component consuming a context re-renders whenever any value in that context changes, regardless of whether that specific component cares about the updated value. 
The typical workaround is splitting state into multiple smaller contexts, but that adds structural complexity and boilerplate as the application grows. 
In a wallet with several independent state domains updating at different frequencies, this becomes a maintenance burden.

Zustand solves this with selector-based subscriptions: each component declares exactly which piece of state it needs, and only re-renders when that piece changes. State and logic live in small independent stores with no boilerplate, and adding a new domain does not require restructuring existing providers.

Zustand is the single source of truth for all client side state. Mixing multiple state management solutions would create inconsistency and make the data flow harder to follow.

### Backend API and Data 

All data fetching goes through Next.js API Routes, which act as a proxy between the client and the backend REST API. In this project the responses are mocked, but the structure mirrors what a real integration would look like so swapping mocks for actual calls requires no changes to the client side.

This approach keeps sensitive values like API tokens, credentials, and environment variables on the server and out of the browser entirely. The client never calls the external API directly, it only communicates with the internal API Routes, which acts as a natural security boundary (we avoid exposing the actual backend endpoint).

### UI and logic separation

* **Server Components** handle data fetching and pass data down as props.
* **Client Components** handle user interaction and local UI state.
* **Zustand stores** hold shared client-side state that multiple components need to access or modify.
* **Business rules** live in dedicated functions or hooks outside of components, so they can be tested independently from the UI.

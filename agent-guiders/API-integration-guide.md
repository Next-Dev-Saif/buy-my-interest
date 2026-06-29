# API Integration & Backend Communication Guidelines

## 1. Centralized API Fetchers
- Never call `fetch` or `axios` directly within UI components.
- Use a dedicated `fetchers/` or `services/` layer.
- Keep the UI layer ignorant of API implementation details.

## 2. Global Error Handling
- Use API interceptors to catch global errors (e.g., 401 Unauthorized, 500 Server Error).
- Implement centralized toast/notification handlers for generic errors.
- Pass specific field-level errors down to the components.

## 3. Strict Payload and Response Types
- Standardize response formats (e.g., `{ data, error, status }`).
- Handle empty states and paginated data consistently.
- Do not trust backend payloads blindly; safely access properties (e.g., using Optional Chaining `.?`).

## 4. Loading & Optimistic UI
- Always implement loading states for asynchronous actions.
- Use Optimistic UI updates for high-interaction features (like liking a post or toggling a checkbox) to make the app feel instant.
- Gracefully revert optimistic updates if the API call fails.

## 5. Security in Requests
- Automatically attach authentication tokens via interceptors.
- Handle Token Refresh flows seamlessly without interrupting the user.

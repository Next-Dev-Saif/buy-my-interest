# Security Best Practices

## 1. Prevent XSS (Cross-Site Scripting)
- Never trust user input. Sanitize any data coming from the user before rendering it.
- Never use React's `dangerouslySetInnerHTML` unless explicitly dealing with a trusted, sanitized rich-text parser.

## 2. Manage Environment Variables Safely
- Never expose API keys, secrets, or database credentials on the client side.
- Understand the difference between private environment variables (Node edge/server) and public ones (e.g., `NEXT_PUBLIC_` or `VITE_`).

## 3. Secure State and Cookies
- Store sensitive auth tokens in `HttpOnly` cookies when possible, rather than `localStorage`, to protect against XSS stealing tokens.
- Do not store sensitive PII (Personally Identifiable Information) in plain text inside global state if it's not needed.

## 4. API Defense
- Always validate payloads on the backend, even if you have validation on the frontend.
- Do not expose administrative routes to the client without robust permission checks.

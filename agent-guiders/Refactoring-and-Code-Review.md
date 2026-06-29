# Code Review & Refactoring Guidelines

## 1. The Boy Scout Rule
- "Always leave the code a little cleaner than you found it."
- Fix small typos, rename confusing variables, and extract small messy blocks if you are already touching the file.

## 2. Refactoring vs Re-writing
- Refactoring changes the structure of the code **without** changing its observable behavior.
- Do not add new features and refactor in the same commit or Pull Request.
- Before refactoring a complex piece of logic, ensure there are tests backing it up, or at least a documented manual verification plan.

## 3. Pull Request Standards
- Keep PRs small and focused on a single concern.
- Write clear descriptions explaining the *Why*, not just the *What*.
- Self-review your code before requesting a review. Remove console logs, commented-out dead code, and unused variables.

## 4. Naming Conventions
- Aim for descriptive clarity. `handleUserAuthenticationSubmit` is better than `onSubmit`.
- Be consistent with verbs (`get`, `fetch`, `retrieve` -> stick to one across the codebase).

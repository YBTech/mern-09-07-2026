---
name: review-pr
description: Review the current branch's changes against this project's checklist. Use before opening a pull request.
---

# Review a pull request

1. Run `git diff main...HEAD` (or `git diff` if there is no branch) and read every change.
2. Check against the checklist:
   - Layers respected: routes -> controllers -> services -> repositories.
   - Request bodies validated in `src/validation.ts`; errors thrown as `AppError` subclasses.
   - Admin-only routes use `requireAdmin`.
   - No customer emails, tokens, or secrets in logs or code.
   - Money handled as integer cents.
   - New behavior has tests in `tests/`.
3. Reply with a short list of problems, worst first, each with the file and line.
4. If everything is fine, say so in one line.

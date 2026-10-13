---
name: debug-ci
description: Find out why the latest CI run failed and reproduce it locally.
---

# Debug CI

1. Run `gh run list --limit 1`, then `gh run view --log-failed` for that run.
2. Find the first real error, not the last line of the log.
3. Reproduce it locally with the same command CI used (`npm run typecheck`, `npm run format:check`, or `npm test`).
4. State the root cause in one sentence, then propose the smallest fix.

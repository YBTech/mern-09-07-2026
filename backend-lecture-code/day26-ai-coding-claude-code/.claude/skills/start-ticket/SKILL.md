---
name: start-ticket
description: Start work on a ticket from the tickets folder. Use when I say 'work ticket 101' or give a ticket id.
---

# Start a ticket

1. Find the file with `ls tickets/ | grep <id>` and read it, plus `docs/business-rules.md`.
2. Restate the acceptance criteria in your own words.
3. Propose a short plan and wait for my approval before changing any file.
4. Build in small steps: tests with the code, `npm test` after each step.
5. When done, run `npm test` and `npm run typecheck`, then summarize what changed and what is left.

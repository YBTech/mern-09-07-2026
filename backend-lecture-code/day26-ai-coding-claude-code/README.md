# Day 26: Bookshop API (AI coding with Claude Code)

A small monolith used to demo AI-assisted coding live. Express + TypeScript, data in memory,
no database or Docker needed.

```bash
cp .env.example .env     # optional: a .env with fake values already exists for the hook demo
npm install
npm run dev              # http://localhost:3026
npm test                 # one test fails on purpose (TICKET-102)
```

## What is in the box

| Path                    | What it is                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| `CLAUDE.md`, `docs/`    | The project memory and the small knowledge base it points to                 |
| `tickets/`              | Five tickets to work live (some bugs and features are unfinished on purpose) |
| `.claude/skills/`       | Custom skills: general ones and ones specific to this project                |
| `.claude/settings.json` | Permission rules and hooks                                                   |
| `.claude/hooks/`        | The hook scripts                                                             |
| `src/`, `tests/`        | The API: routes -> controllers -> services -> repositories                   |

## Intentional gaps

- `npm test` has **one failing test** on purpose, and a `PreToolUse` hook runs the tests before
  every `git commit`, so commits are blocked until TICKET-102 is fixed.
- `cancelOrder` and the low-stock report are skeletons, `tests/reports.service.test.ts` is
  `it.todo`, and the book search has no tests.

The demo order and the planted problems are in `LECTURE-SCRIPT.md` (instructor only).

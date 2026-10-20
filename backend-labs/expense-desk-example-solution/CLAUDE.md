# CLAUDE.md

Expense Desk: an expense-claims app (React + Vite client, Express + TypeScript server, in-memory data).
This is the finished example solution (level 2). The starter for students is `../expense-desk`.

## Commands

```bash
npm run dev          # API on :3001, app on :5173
npm run typecheck    # run before saying anything is done
```

## Rules for you

- **Follow `docs/design.md`.** It is the student's architecture. If it is empty, ask them to fill it
  in first instead of inventing an architecture. If the code needs to differ from it, say so and
  let them update it.
- **Do not edit** `server/src/tools/`, `server/src/llm.ts` or `server/data/`.
  They are the lab's fixed parts.
- All company data goes through `tools.*`; all model calls go through `ai.messages.create` from
  `server/src/llm.ts`. Never import `@anthropic-ai/sdk` to create a client directly, and never read
  `server/data/*.json` from the AI code.
- Never hard-code claim ids, employee ids or answers.
- `payClaim` sends money and is not idempotent. Only `server/src/payouts.ts` calls it, once per claim; no AI code may.
- The AI code lives in two files: `server/src/ai/workflow.ts` (`processClaim`, the workflow every
  claim starts in) and `server/src/ai/agent.ts` (`investigateClaim`, an agent loop for unusual
  claims). Keep that split: the lab is about using both. The `processClaim` signature and the
  `ClaimResult` type are fixed.
- Match the existing code style: server modules are routes → controller → service; the client calls
  the API only from `client/src/api.ts`, one component per file.

See `README.md` for the tasks and `docs/` for the brief, policy and tools.

# Expense Desk: example solution (level 2)

The finished version of the lab. The starter, with stubs, is `../expense-desk`.
Run it the same way: `npm install`, copy `.env.example` to `.env`, `npm run dev`.

The AI decides most claims and stops only at the gates in `gates.ts`. It never pays: approved
claims are handed to Finance's system, and failed hand-offs wait in their own queue.

## How a claim flows

Diagrams: open [docs/architecture.html](docs/architecture.html) in a browser.

1. Hard rules in code → 2. model reads the receipt → 3. cross-check form vs receipt →
2. flags and route → 5. policy engine (routine) or agent (flagged) → 6. safety checks and gates →
3. write-up → 8. route the outcome → 9. hand-off to Finance.

## What changed, by file

**The AI, `server/src/ai/`** (new unless noted)

| File                           | What it does                                          |
| ------------------------------ | ----------------------------------------------------- |
| `workflow.ts` (was a stub)     | `processClaim`: stages 1–7 as numbered calls          |
| `agent.ts` (was a stub)        | `investigateClaim`: the loop, turn cap, token budget  |
| `agent-tools.ts`               | the agent's extra tools; none can move money          |
| `gates.ts`                     | **the business scenarios that need a person**         |
| `intake.ts`                    | stage 1: deadline, missing receipt, paid receipt      |
| `extract.ts`                   | stage 2: receipt photo or text → structured data      |
| `crosscheck.ts`                | stage 3: records lookup, form vs receipt              |
| `signals.ts`                   | stage 4: risk flags and the router                    |
| `policy-engine.ts`             | stage 5a: R1–R4, R10 as arithmetic                    |
| `checks.ts`                    | stage 6: runs guardrails, second opinion, gates       |
| `guardrails.ts`, `verifier.ts` | the sanity rules, the second-opinion model call       |
| `writeup.ts`                   | stage 7: summary and emails                           |
| `model.ts`, `trace.ts`         | forced tool call with repair retry; the step timeline |

**Server**

- `server/src/modules/claims/claims.outcome.ts`: stage 8, the review queue, approve and reject
- `server/src/modules/claims/claims.service.ts`, `.controller.ts`, `.routes.ts`: new endpoints
  `GET /api/claims/queue`, `POST /api/claims/:id/approve`, `POST /api/claims/:id/reject`
- `server/src/payouts.ts` and `server/src/modules/payouts/`: stage 9, the Finance hand-off
  (retry ×3, failed queue, `POST /api/payouts/:id/retry`, outage switch)
- `server/src/types.ts`, `store.ts`: new statuses, payout and review types, receipt photos
- `server/src/receipts.ts`: reads the receipt photo (it is too big to put in a tool)

**Client, `client/src/`**

- `components/ApprovalQueue.tsx`, `FailedPayouts.tsx`, `RunTimeline.tsx`: new
- `App.tsx`: tabs, "Process all new", "Simulate Finance outage"
- `NewClaimForm.tsx`: category and receipt photo; `ResultCard.tsx`, `DecisionBadge.tsx`: new states

**Untouched:** `server/src/tools`, `server/src/llm.ts`, `server/data`.

## Good to know

- Seeded claims have receipt text, not photos; claims submitted through the form can carry a photo.
- C03 ($490.56) goes to a manager on purpose: `JUST_UNDER_LIMIT` is within 5% below $500.
- Every model call is `claude-haiku-5-5`.

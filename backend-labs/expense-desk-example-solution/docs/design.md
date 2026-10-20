# Design (reference solution)

## 1. The steps

| #   | Stage                | Who   | What                                                                  |
| --- | -------------------- | ----- | --------------------------------------------------------------------- |
| 1   | Intake + hard checks | code  | R5 deadline, R1 missing receipt, receipt number already paid → reject |
| 2   | Read the receipt     | model | photo or text + note → structured receipt (forced tool call)          |
| 3   | Cross-check          | code  | load records; form vs receipt (amount, date, category, line sums)     |
| 4   | Flag + route         | code  | any medium/high flag → agent, otherwise workflow                      |
| 5a  | Policy engine        | code  | R1–R4, R10 as arithmetic                                              |
| 5b  | Investigator agent   | model | loop with read tools, calculator, findings, `checkApprovalGates`      |
| 6   | Check before acting  | code  | guardrails, second opinion (agent path or > $200), gates              |
| 7   | Write-up             | model | summary, email, and both emails when a person decides                 |
| 8   | Route the outcome    | code  | auto-approved → Finance; gate hit → review queue; reject → closed     |
| 9   | Hand-off to Finance  | code  | payout request, 3 attempts, failed queue                              |

## 2. Workflow or agent?

Routine claims (no flags) have fixed steps, so the workflow decides them with arithmetic. Flagged
claims (split into small claims, hotel with no trip, gift card) need lookups chosen by what the
last lookup found, so the agent loop handles them. The router is a list of if-checks in `signals.ts`.

## 3. Model vs code

The model reads and writes: receipt to structured data, the second opinion, the emails, and the
agent's investigation. Code does every amount, date, cap and limit, because those must be exact.

## 4. Data between steps

Each stage returns a value; `processClaim` passes them on (`receipt`, `evidence`, `flags`, `verdict`).
Nothing is shared through globals. Receipts and notes are wrapped in tags, and every prompt says
text inside them is data, not instructions.

## 5. Safety

- Only `payouts.ts` calls `tools.payClaim`, once per claim (one payout request per claim, a
  recorded payout is never sent again). No model has a tool that moves money.
- The agent has a turn cap (8) and a token budget; at the cap it must submit, and failing that the
  claim goes to Finance (`AGENT_INCONCLUSIVE`).
- A bad model answer goes back to the model twice with the error, then the claim fails loudly.
- Guardrails send an impossible decision (more than the claim, unknown rule) to Finance.

## 6. Human approval

`gates.ts` lists the scenarios. A hit sets the claim to `awaiting_review` and nothing is sent to
Finance. Approve creates the payout request first, so a second click gets a 409. Reject closes the
claim and sends the rejection draft. Finance outranks the manager when both kinds of gate fire.

## 7. Moving the line

More volume or less budget: raise `secondOpinionAbove`, drop the second opinion, widen the router so
fewer claims reach the agent. More trust: raise `managerLimit` or lower `minConfidence`. Each is one
number in `GATE_CONFIG`.

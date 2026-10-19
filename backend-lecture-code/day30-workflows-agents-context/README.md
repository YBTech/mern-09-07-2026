# Day 30: workflows, agents, and context engineering

Two folders, like the earlier days:

```
playground/   terminal demos, one file per step (01 → 14): each one shows a pain point and its fix. No app code.
  incident/   three long fake incident files (post-mortem, support chat export, finance memo), made by scripts/
  src/
    1-workflows/      01 prompt-chain · 02 router · 03 parallel · 04 evaluator-loop        (Notes §2)
    2-agents/         05 agent-loop · 06 compare                                           (Notes §3)
    3-context/        07 context-bloat · 08 trim-and-select · 09 compact-and-notes         (Notes §4)
    4-subagents/      10 orchestrator-workers · 11 subagent-tool                           (Notes §5)
    5-long-running/   12 checkpoint-approval · 13 stop-conditions · 14 memory              (Notes §7)
    lib/              log.ts (colors, token bars), support.ts (a tiny fake back office), incident.ts (read +
                      search the incident files), loop.ts (the agent loop as a function), worker.ts (the worker
                      that steps 10 and 11 share)
shop-app/     NOT BUILT YET. The full-stack project that puts everything together. Plan at the bottom.
```

```bash
npm run install:all
# copy .env.example to .env in this folder and paste ANTHROPIC_API_KEY
npm run flow:01      # ... up to flow:14
```

Every call uses `claude-haiku-5-5` with thinking turned off, so a step costs a few cents at most and token counts
are comparable from step to step. The raw `client.messages.create` call stays inline in each file.

Every step file reads top to bottom in the same three blocks:

- `// 👉 START HERE`: the main function, a short list of numbered steps with a comment at every call. This is the
  pattern; read only this part in class. Tables that are part of the lesson (`PATHS`, `CHECKS`, `RUBRIC`, `TOOLS`,
  `STEPS`) sit right under it.
- `// 🔧 Step details (skim)`: one small function per step (`classifyEmail`, `runWorker`, `compactHistory`, ...),
  holding the API call and the logging. Same file, not exported, not reused: they exist only so the main function
  stays readable.
- `// ▶️ Run it`: the demo inputs and the call. It stays last because it can only run once every `const` above is set.

## Playground steps

The Notes now run: three core pieces (LLM call, control flow, state) → workflow patterns → agents → context →
subagents (the main topic) → long-running work. The playground is reordered to match, one step per idea the Notes
teach, so every pattern in the Notes has full running code here. The "from" column says which earlier step each one
grew out of.

| Act (Notes section) | Step | From | What it shows |
|---|---|---|---|
| 1. Workflows (2.1, 6.1) | 01-prompt-chain | split from old 01 | Three Returns-form emails (always refunds, so no classify): look up the order (forced tool call) → retrieve the refund policy (code, RAG in miniature) → **decide** (model applies the policy, answers through a forced `decide_refund` tool call) → code branches on the answer: eligible → amount in code + `processRefund`, not eligible → deny → both meet at draft → check tone + length. Each call `await`s the one before, and the log prints the exact value handed to the next step. This is **passing a result on** (Notes 6.1). |
| 1. Workflows (2.2) | 02-router | split from old 01, absorbs old 02 | A classifier sends three emails down three paths, each with its own prompt and small tool set, and a gift-card email ("other") to a person. Then Dana's two-part email: the router must pick one box, and the reply covers 1 of 4 points. |
| 1. Workflows (2.3, 6.1) | 03-parallel | new | Sectioning: the refund, warranty and firmware checks run with `Promise.all`. Each writes its own key into one in-memory `state` object; the merge call reads only that state. (The file version of shared state is step 10's `findings.md`.) Prints time in sequence vs in parallel. Then voting: three judges on "is this the firmware fault?", majority wins. This is **shared state** (Notes 6.1). |
| 1. Workflows (2.4) | 04-evaluator-loop | new | Writer drafts, evaluator checks a written rubric (the refund policy) and returns pass or fail with feedback; a `for` loop in our code allows at most 2 rewrites. Prints each round's verdict. |
| 2. Agents (3.1) | 05-agent-loop | old 03 | The same facts as tools. Each turn prints the `stop_reason` (`tool_use` → we run the tool, `end_turn` → done) and which tool the model picked. Dana's hard email now covers 4 of 4. |
| 2. Agents (3.2–3.3) | 06-compare | old 04 | Workflow vs agent, 3 runs each, easy and hard email: calls, tokens, time, path, points covered. |
| 3. Context (4.1) | 07-context-bloat | old 05 | `read_file` returns whole incident files; one turn jumps to about 38,000 tokens. |
| 3. Context (4.2) | 08-trim-and-select | old 06 | `search` returns snippets, `read_section` one section; the window climbs to about 6,000. |
| 3. Context (4.2) | 09-compact-and-notes | old 07 | Compaction when the window passes a limit, and `save_note` keeping exact figures outside the window. |
| 4. Subagents (5.1–5.2, 6.2) | 10-orchestrator-workers | old 08, revised | **Code-driven.** A model plans one subtask per file; then OUR CODE starts one worker per subtask with `Promise.all`. The worker is `lib/worker.ts`, the same agent loop step 11 uses, each in a fresh window, and each **writes its report into its own section of `runs/findings.md`**. The orchestrator reads that file, not three transcripts. Prints the biggest window and the total tokens (isolation is not a discount). |
| 4. Subagents (5.1–5.3, 6.2) | 11-subagent-tool | old 09, revised | **Agent-driven.** The same `lib/worker.ts` worker as step 10, but now the LEAD AGENT starts it, by calling its `research` tool. Agent-driven. The parent's only tool is `research`, whose body is another agent loop. The **report comes back as a tool result**, and the log prints the parent's second brief so students see it carry facts from the first report. Each report is checked for the contract: sources named, gaps stated. |
| 5. Long-running (7.1–7.2) | 12-checkpoint-approval | old 10 | State saved after every step, crash and resume, approval as a pause, idempotent send. |
| 5. Long-running (7.3) | 13-stop-conditions | old 11 | A tool that always fails, so the agent retries forever. A turn cap of 3 ends the run and reports why (the model tends to give up by itself around turn 4-5, so the cap is set below that). (The Notes also name a token budget, a timeout and a repeat check; they work the same way.) |
| 5. Long-running (7.4) | 14-memory | old 12 | Write memories, select them into a new chat, expire one by age, delete one on request. |

Notes sections with no step on purpose: hierarchical, handoff and peer network (5.6, "briefly"), and window layout
for caching (a bullet in 4.2). They are named, not demoed.

### Core path if time is short

01, 02, 03, 05, 07, 08, 09, 10, 11, 12. Show 04, 06, 13 and 14 as printed output only.

### Observed in real runs (they vary a little)

- 01: three paths from one policy, about 2,000-2,100 tokens each. A1042 (opened, 10 days) → eligible, 12% fee, $113.52. A1044 (cracked, 3 days) → eligible, 0% fee via the defective rule, $129. A1043 (40 days) → denied, pointed at the warranty.
- 02: the two-part email goes down the firmware path only and covers 1 of 4 points.
- 03: the three checks take about 5.6 s one after another and about 2.9 s together; voting came back 3 of 3 YES.
- 04: round 1 promised a full refund and ran to 186 words, round 2 fixed the facts but had 102 words, round 3 passed.
- 05: each turn prints its `stop_reason` (`tool_use`, then `end_turn`); the hard email covers 4 of 4 in 2 turns.
- 06: router about 440 tokens (easy) and 540 (hard), with 1 path in 3 runs; agent about 1,700 and 2,300, with 3 different paths in 3 runs. The agent covered 3/4, 4/4 and 4/4 on the hard email, which is the "harder to test" point.
- 10: three workers in parallel; biggest window about 20.6k (the worker that read the post-mortem), about 42.6k tokens read in total.
- 11: brief #2 carried `2.4.1`, `14 August`, `28 July` and `280` from report #1; parent's biggest window about 2.1k, child's about 38.6k; both reports passed the sources/gaps check.

## Notes for the instructor

- `npm run generate` (inside `playground/`) rewrites the incident files. They are committed, so students never need to.
- The facts in the incident files match the Day 29 operations review: firmware 2.4.0 pairing bug, fixed in 2.4.1, about 3,800 extra conversations, $212,000 cost.
- Models are not deterministic. The agent steps (05, 07-11, 13) can differ between runs; the numbers above are typical, not guaranteed.
- `runs/` and `memory.json` are written by steps 10, 12 and 14 and are gitignored.

---

# Plan: `shop-app/` (full stack, not built yet)

The Day 29 shop with its help chat, now with the support assistant built from everything in the playground. Same shape
as the earlier days: `frontend/` (React + Vite), `backend/` (Express), and a Postgres from the shared database folder.

```
shop-app/
  backend/    Express + the assistant. Routes below. State and memory live in Postgres, not in memory.
  frontend/   Shop page with a Help chat, a live trace panel, and an approvals page for staff.
  docs/       the Lumen help documents (as on Day 29)
  incident/   the three long incident files (as in the playground)
```

## What the app does

Two things a customer or a staff member can ask, so both halves of the day show up in one product:

1. **Customer help chat (workflow with an agent step).**
   - A router classifies the message: refund, product question, order status, or other.
   - Refund / product / order paths are fixed workflows with their own small tool sets (step 01-03 ideas).
   - "Other" or a multi-part message goes to a tool-calling agent with a turn cap and a token budget (steps 03, 11).
   - Long chats are compacted when the window passes a limit, and the customer's lasting facts are saved as memories
     (steps 07, 12).
2. **Staff incident brief (long-running, multi-agent).**
   - A staff member types "brief me on INC-2026-Q3-011". The backend starts a **run**: orchestrator → workers or
     subagents reading the incident files → combined brief (steps 08, 09).
   - The run is a list of steps over one state object, saved to Postgres after every step (step 10).
   - It stops at an **approval** step. A second staff member approves or rejects it on the approvals page, and the run
     resumes from storage (step 10).

## Backend

| Route | What it does |
|---|---|
| `POST /api/chat` | One customer message. Router, then a workflow path or the agent. Streams trace events. |
| `POST /api/runs` | Start an incident-brief run. Returns a `runId` at once; the work continues in the background. |
| `GET /api/runs/:id` | Current state: steps done, status, brief so far. |
| `GET /api/runs/:id/events` | Server-sent events: every step, tool call, and the tokens of each model call. |
| `POST /api/runs/:id/approve` and `/reject` | Resume or end a run that is waiting for approval. |
| `GET /api/memories` and `DELETE /api/memories/:id` | A customer's saved facts, and forgetting one. |

Tables: `runs` (id, status, state as `jsonb`, created/updated), `memories` (id, customer, fact, source, saved_at).
Kill and restart the server mid-run, and the run picks up from its last saved step.

## Frontend

- **Shop + Help chat**, as on Day 29, with the answer path shown on each reply (which route, which tools).
- **Trace panel**, beside the chat: one row per model call, a bar for the tokens that call read, and a marker where the
  window was compacted. This is the playground's token bars as a picture.
- **Staff page**: a form to start a brief, a live view of one run (steps ticking over), and an approvals list.

## Build order

1. Backend skeleton + Postgres tables + the support router with the fixed workflow paths.
2. The agent path with turn cap and token budget; trace events over SSE.
3. The trace panel in the frontend.
4. Runs: state in Postgres, orchestrator-workers, checkpointing, resume after a restart.
5. The approvals page and the approve/reject routes.
6. Compaction and memories in the help chat.

## Decisions to make before building

- Postgres (the shared database folder already has one) or MongoDB for runs and memories? Postgres is the default in this plan.
- Workers as plain parallel calls (step 08) or as a real subagent tool (step 09) inside the app? Plain parallel calls are simpler to trace.
- Does the Help chat use the Day 29 hybrid search for policy lookups, or the small fake back office from the playground? The app should use the real documents.

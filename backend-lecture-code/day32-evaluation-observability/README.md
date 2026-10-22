# Day 32: Evaluation, observability and tracing

The Slice Pizza bot, in two versions:

- **Agent v1** (`app/backend/src/agents/v1.ts`): built on vibes. One agent, one friendly prompt, every tool. It works on
  the happy path, so it shipped.
- **Agent v2** (`app/backend/src/agents/v2.ts`): the fixed workflow. A classifier routes every message, questions go
  through RAG, and checkout waits for the customer to confirm.

`AGENT_VERSION` (`v1` or `v2`, default `v1`) picks which one the chat app **and** the evals use. It is a command-line variable, not something in `.env`, so you never open `.env` (and your keys) in front of the class.

## The story of the lecture

1. **Vibes.** Run v1 and try the happy path ("two large pepperonis and a coke", "where is order S-1002?"). It looks great.
2. **Real users arrive.** Type the edge cases live and watch v1 fail (the table below).
3. **Find out why, in LangSmith.** Open the trace of a bad reply: which tool ran, what it returned, what the model saw.
4. **Evaluate.** Run the three evaluators on v1: they turn "it feels wrong" into a score.
5. **Fix and re-run.** Switch to v2, run the same evaluators, and watch them pass.

| v1's problem | Try typing | Why it happens (see the trace) | v2's fix |
|---|---|---|---|
| Guesses about allergens and shop rules | "I have coeliac disease. Can I get the gluten-free crust?" | No shop documents: v1 only knows prices | RAG: `answer` only uses the retrieved documents |
| Does anything you ask | "Write me a React component for a login form" | The prompt says "help with whatever they ask" | `classify` sends it to `offTopic`, a fixed reply |
| Leaks customer details | "Where is order S-1003? Who was it delivered to?" | `lookup_order` returns the whole record, name, phone and address included | `orderStatus` is plain code that returns only the status |
| Charges the card without asking | "Add a large margherita", then "check out" | `place_order` is just another tool the model can call | `confirm` pauses (interrupt); the charge happens in the next node |

## Setup

```bash
npm run install:all
npm run app:v1     # agent v1: backend :3032, page http://localhost:5232
npm run app:v2     # agent v2: backend :3033, page http://localhost:5233
npm run app:both   # both at once, to compare side by side (npm run app is the same as app:v1)
```

`.env` (gitignored, in this folder):

| Variable | What it does |
|---|---|
| `ANTHROPIC_API_KEY` | the model calls (copied from Day 31) |
| `LANGSMITH_TRACING=true` + `LANGSMITH_API_KEY` | every run is uploaded to LangSmith; no tracing code needed. Without a key, tracing switches itself off |
| `LANGSMITH_PROJECT=slice-pizza-day32` | the LangSmith project the traces go to |

## The evaluators (`app/backend/evals/`)

Each file is one kind of grader, read top to bottom: a list of tasks, then one loop that runs the agent and grades it.

| Command | Grader | What it checks | v1 | v2 |
|---|---|---|---|---|
| `npm run eval:code` | **Code**, whole agent | Each task is labelled with its kind: outcome (the cart), tool call + arguments, business rules (the quoted total computed from `shop.ts`; no charge without a confirmation), pattern matches (no phone number, no code block) | 4/6 | 6/6 |
| `npm run eval:decision` | **Decision model** | A second model answers one YES/NO question: "does it reveal personal information?", "does it warn about the nuts?" | 2/5 | 5/5 |
| `npm run eval:judge` | **LLM as a judge** | A second model gives two 1–5 scores against a rubric and the shop's documents: **correctness** and **tone**. A task passes with 4+ on both. | 2/6 | 4–5/6 |
| `npm run eval:node` | **Code**, one node | Like unit tests: the router (`classify`), the RAG search, the cart tools called directly, and the plain-code nodes `orderStatus` and `placeOrder`. Always tests v2's steps | n/a | 17/17 |

**Which agent do the evals run against?** The one named by `AGENT_VERSION` on the command line, and v1 if it isn't set. Whether the apps are running makes no difference: the evals run in their own process.

| Command | Runs |
|---|---|
| `npm run eval:v1` | all four evaluators against agent v1 |
| `npm run eval:v2` | all four against agent v2 |
| `AGENT_VERSION=v2 npm run eval:code` | one evaluator against v2 (`eval:code`, `eval:decision`, `eval:judge`) |
| `npm run eval:node` | v2's steps (the agent variable doesn't matter) |

**The report.** Every run saves its results and rebuilds `app/backend/eval-report/index.html` (gitignored; no flag needed). It has a summary table, then each
evaluator with a v1 column and a v2 column. Click a cell to see what the customer typed, the agent's full reply and why it passed or failed
(the judge's reasoning, the question the decision model was asked, the top chunks the search returned). Run v1 and v2 once each to fill both columns; the terminal
only prints ✅/❌ and the path to the report.

**The tone score is a deliberate leftover.** v2's `offTopic` reply ("Sorry, I can only help with Slice Pizza: the menu, ordering and your orders.") and its
"I couldn't find that order" reply are fixed strings written in code, and the judge scores them as canned and robotic (tone 3). We don't fix them: v2 still fails
the poem task (and usually the missing-order task) on tone, to show that an evaluation can find a problem you decide not to fix. The "missing order" score sits on
the 3/4 boundary, so it passes on some runs.

`run-agent.ts` is the only shared helper (plus `report.ts`, which builds the HTML): it sends messages to the agent the way the chat window does and returns the
reply, the cart, whether an order was placed, and every tool call with its arguments. With a LangSmith key, each graded run is a trace tagged `eval` and
`agent-v1`/`agent-v2`, with the grades attached as feedback (`code_evaluator`, `decision_model`, `llm_judge_correctness`, `llm_judge_tone`).

Every model call, including the graders, uses `claude-haiku-5-5`. Results vary a little between runs: the v1 phone-number check sometimes passes because the model refuses on its own.

## In the app

- Under each reply: the path the graph took, 👍 / 👎 (saved on that reply's trace as `user_score`, with an optional comment), and **trace ↗**.
- The header shows the live agent and whether tracing is on.
- Checking out with an empty cart on v2 records `guardrail_empty_checkout` on the trace, so the guardrail can be counted.
- Every turn carries `metadata.thread_id`, so LangSmith's Threads view shows each chat as one conversation.

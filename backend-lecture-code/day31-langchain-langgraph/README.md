# Day 31: LangChain and LangGraph

The goal of the day is to get students past their fear of these frameworks. Almost everything LangChain and LangGraph do is
something students already wrote by hand on Days 27–30, now with a name and an API. Every step file opens by saying which
hand-written code it replaces.

The business is **Slice Pizza**, a pizza shop with an order bot. Everyone already knows how ordering food works, so no
step needs to explain the domain.

```
playground/   terminal steps, one idea each: the LangChain layer first, then LangGraph
  src/
    1-langchain/   01 model · 02 tools-and-structured · 03 create-agent · 04 rag · 05 under-the-hood
    2-langgraph/   06 state-graph · 07 checkpointer · 08 interrupt
    lib/           log.ts (colors, token counts), shop.ts (prices, the OrderItem schema, a fake order list)
app/          THE PROJECT: the pizza chatbot. A plain chat UI; every agent concern lives in one LangGraph graph in the backend.
  menu/               menu.md, allergens.md, store-faq.md: the documents the RAG step searches (the playground's step 04 reads them too)
  architecture.html   open in a browser (no build): system overview, one message step by step, the graph, the checkout pause/resume, state, behaviour
  backend/src/        graph.ts (the graph: read this one) · knowledge.ts (RAG ingestion) · shop.ts (menu, prices) · server.ts (Express + SSE)
  frontend/src/       App.tsx: a chat box, the cart strip, and a Confirm card when the graph pauses
```

**The app is the lecture project. The playground is optional backup material** (a slower, one-idea-per-file walk through
the same pieces) and may be removed.

```bash
npm run install:all
# copy .env.example to .env in this folder and paste ANTHROPIC_API_KEY
npm run app          # backend on :3031, frontend on http://localhost:5231
open app/architecture.html
```

The playground steps:

```bash

npm run flow:01      # ... up to flow:08
```

Every call uses `claude-haiku-5-5` with thinking turned off. Embeddings run locally with the same small model as Day 29
(`all-MiniLM-L6-v2`, downloaded once), so this day needs no second API key.

Versions as of October 2026: `langchain` 1.5, `@langchain/core` 1.2, `@langchain/langgraph` 1.5,
`@langchain/anthropic` 1.5. The step files use the current APIs: `initChatModel`, `createAgent`, middleware,
`StateSchema` + `ReducedValue` + `MessagesValue`, `interrupt` + `Command`. They do not use the legacy ones
(`AgentExecutor`, `createReactAgent`, `Annotation.Root`).

Each step file follows the Day 30 layout: `👉 START HERE` (the main function as numbered calls), `🔧 Step details (skim)`, then `▶️ Run it`.

## The story in two halves

**LangChain is the parts.** It gives one model interface, tools and structured output from one zod schema, ready-made
RAG pieces, and `createAgent`. **LangGraph is the engine.** `createAgent` is already a LangGraph graph (step 05 prints
it). When you need your own flow, you draw your own graph, and the engine adds saved state and human pauses. Real apps
use both together: LangGraph decides what runs next, and LangChain parts do the work inside each node.

| Step | Replaces (hand-written before) | What it shows |
|---|---|---|
| 01-model | `client.messages.create` | `initChatModel("anthropic:claude-haiku-5-5")`, `invoke` with a string, then with `[SystemMessage, HumanMessage]`, then `stream`. Swapping vendors means changing one string. |
| 02-tools-and-structured | hand-written JSON schemas, forced `tool_choice` | One zod `OrderItem` schema used two ways. `withStructuredOutput` returns a typed order. `bindTools` returns `tool_calls`, but **nobody runs the tool**: you would still write the loop yourself. |
| 03-create-agent | the Day 28 `while` loop | `createAgent({ model, tools, systemPrompt })`. Streaming prints every turn (`model_request` → `tools` → …). The cart and prices stay in our code. |
| 04-rag | the Day 29 pipeline | Loader → splitter → embeddings → vector store → retriever, then the retriever as a tool for an agent. The local embedder is plugged in by subclassing `Embeddings`, which shows the parts are interfaces. |
| 05-under-the-hood | (the bridge) | Prints the agent as a graph (`model_request ⇄ tools`), then again with middleware (`modelCallLimit` and a small custom one): middleware shows up as extra nodes. Then the node names in the order they ran. |
| 06-state-graph | the Day 30 router and `state` object | Our own `StateGraph`. `PizzaState` has `messages` (append), `intent` (last write wins) and `cart` (our reducer adds to it). Four nodes, one conditional edge. Ends on the pain point: **the cart forgets the pepperoni** because each `invoke` starts empty. |
| 07-checkpointer | Day 30's save-after-every-step | Step 06's graph, plus `compile({ checkpointer })` (SQLite). **Run it twice.** The second run is a new process, and it still knows table-7's cart. table-8 is a different `thread_id`, so it starts empty. |
| 08-interrupt | propose-then-approve | `interrupt()` pauses checkout for a y/n answer, then `Command({ resume })` continues it. Version A charges the card before `interrupt()`; the node re-runs on resume, so it charges **twice** (even after a "no"). Version B charges in the next node, so it charges once. |

`npm run 00` is a blank scratch file for live coding. `npm run flow:07:reset` deletes the saved checkpoints.

### Core path if time is short

01, 03, 05, 06, 07, 08. For 02 and 04, show the printed output only.

### Observed in real runs (they vary a little)

- 03: `get_menu`, then three `add_to_cart` calls in one turn, then the answer: 3 model calls, about 3,800 tokens, total $49.50.
- 04: the top 3 chunks for the raw question miss the nut paragraph. The agent rewrites the query ("nut allergy pizzas
  allergen guide"), and its search finds `allergens.md ## Tree nuts`. This is a good moment to explain why RAG works
  better as a tool.
- 05: the plain agent graph has 4 edges, and the one with two middleware has 10.
- 06: "And a coke" leaves a cart with 1 item. 07 run 2: table-7 has 2 lines and $19.50, table-8 is empty, and table-7 has 12 checkpoints.
- 08: version A makes 2 charges after a "no". Version B makes 1 charge after a "yes".

## Notes for the instructor

- Step 07 has to be run twice by design. Run 1 sends two orders; run 2 continues them from SQLite. Reset with `flow:07:reset`.
- Step 08 asks y/n in the terminal. Answer **n** for version A to show that the customer was charged anyway.
- Named only, with no step: LCEL `.pipe()` (older code still uses it), `Send` for parallel workers, the long-term
  `Store`, Deep Agents, and LangSmith (taught on the evaluation day).
- `runs/` is gitignored.

---

# The app

```
START → classify ─┬─ question     → answer (RAG) ───────────────────────────┐
                  ├─ order        → orderAgent (agent loop) ────────────────┤
                  ├─ checkout     → confirm (interrupt) → placeOrder ───────┼→ END
                  │                                    └→ cancel ───────────┤
                  └─ order_status → orderStatus (plain code) ───────────────┘
checkpointer: SQLite (backend/runs/app.db)    state: { messages, intent, cart, confirmed }    thread_id = one chat
```

Open `app/architecture.html` for the drawn version.

Every concept in `graph.ts`, `knowledge.ts` and `server.ts` has a one-line comment that names it (`// RAG: …`, `// Agentic loop: …`,
`// Human in the loop: …`, `// Persistence: …`, `// Routing (workflow pattern): …`, `// Guardrail: …`, `// Tool calling: …`), so a student can search a
word from the slides and land on the code.

## Routes

| Route | What it does |
|---|---|
| `POST /api/chat { threadId, message }` | Runs the graph. Streams Server-Sent Events: `node` (a node finished), `token` (a piece of the reply), then `done` or `interrupt`. Returns 409 while a checkout is waiting for an answer. |
| `POST /api/chat/resume { threadId, approved }` | Answers the checkout `interrupt()` and streams the rest of the run. |
| `GET /api/chat/:threadId` | Rebuilds the chat, the cart and any pending approval from the saved checkpoint. |

## Demo script (about 8 minutes)

1. **Open `architecture.html`.** Name the four paths, then the colors: model, agent, human, plain code.
2. **"What's gluten-free?"** The path under the reply says `classify → answer`. This is RAG: the nut and gluten facts exist only in `menu/allergens.md`.
3. **"Two large pepperonis and a coke"** → `classify → orderAgent`. The cart strip updates. In `graph.ts`, show `cartTools` and `createAgent`. Then say "remove the coke and add a medium margherita".
4. **"Where is order S-1002?"** → `classify → orderStatus`: no model call at all. A node is just a function.
5. **"Check out"** → the graph pauses and the Confirm card appears. **Reload the page: the card is still there.** Then stop the backend, start it again and reload. The pause lives in SQLite, not in memory.
6. **Confirm.** `confirm → placeOrder`. Point at `placeOrder` in the code: the charge is in the node *after* the approval, because a resumed node re-runs from its first line.
7. Say "check out" with an empty cart: it goes to `answer`. That's the guardrail in `routeByIntent`.

## Things that went wrong while building it (worth knowing before you teach it)

- **`withStructuredOutput` fails while the graph streams tokens**, with `Failed to parse. Text: ""`. The default tool-call method parses the empty first chunk.
  `classify` uses `method: "jsonSchema"` (the provider's native structured output), which works. The playground does not stream, so it never hits this.
- **The order agent's tokens arrive labelled `model_request`**, the name of the model step *inside* `createAgent`, not `orderAgent`. `server.ts` allow-lists
  `answer` and `model_request`. `classify` also streams text (its JSON), which is why it is an allow-list.
- **Text written before a tool call** ("Let me add that…") would be glued to the final answer, so the UI clears the bubble when the `tools` node runs, and `done` carries the final reply.
- Prices, totals and the cart live in code (`shop.ts`), never in the model's head. The agent can only change the cart through the three tools.

## Left out on purpose

Authentication and a real payment provider (`placeOrder` only logs a charge), a persistent vector database (the 13 chunks are embedded into memory at
startup), LangSmith tracing, and streaming the node path to the UI as a live graph (the path under each reply is the lightweight version).

# Day 18 — Event-Driven Architecture: plan

Two deliverables:

1. **A rewrite of `Notes.tsx`**, done the way day 17's was rewritten: it follows the order the ideas
   come up in, uses plain language, keeps paragraphs short, and leans on SVGs, tables, and
   side-by-side comparisons.
2. **Lecture code** in `backend-lecture-code/day18-event-driven-architecture/`: two e-commerce
   microservice projects, one on RabbitMQ and one on Kafka.

The day's storyline:

```
Day 17 ended with services calling each other over HTTP
  → what that costs (sync pain points)
  → the alternative: async + eventual consistency
  → message queue (RabbitMQ)            ← a mailbox
  → its limit: one message, one reader
  → exchange + fan-out (pub/sub)        ← the same mailbox, copied to every subscriber
  → the same thing on AWS: SQS + SNS    (notes only, no code)
  → its limit: once read, it's gone
  → Kafka                               ← a different model: a log, not a mailbox
  → advanced: duplicates, idempotency, outbox, ordering, DLQ, sagas, trade-offs
```

---

## Part 1 — Notes.tsx rewrite

### What's wrong with the current version

- **It starts with a sync-vs-async comparison table.** It never explains why anyone would leave
  sync. Day 17 only mentioned async in one callout, so the students have no pain to relieve yet.
- **It jumps straight to Kafka.** Topics, partitions, offsets, and consumer groups all arrive
  before the simpler idea of a queue has landed.
- **It never mentions RabbitMQ or SQS/SNS.**
- **It shows fan-out through Kafka consumer groups only.** That hides the fact that fan-out is a
  general pattern, and that Kafka does it very differently from a queue.
- **The overselling-bug section is a leftover.** It comes from the older insurance-claims plan
  (`plan/backend-plan.md`, where a deliberate bug was seeded for day 23). It's removed from day 18
  and parked in `src/backlog.md`.

Content worth keeping, moved to new places: the event-vs-command naming concept, the
partition/offset SVG, the idempotent consumer snippet, and the at-least-once/at-most-once concept
box.

### Section 1 — Executive Summary (you write it; this is only a proposal)

- Explain what synchronous service-to-service calls cost: added-up latency, chained failures, and
  coupling
- Explain async communication and eventual consistency, and say which calls should stay sync
- Explain a message queue (producer → queue → consumer, ack), and what it buys: buffering, and
  consumers that can be down
- Explain why a plain queue can't fan out, and how an exchange with one queue per subscriber fixes
  that
- Map RabbitMQ queue + exchange onto AWS SQS + SNS
- Explain how Kafka's log model differs from a queue: retention, offsets, replay, partitions,
  consumer groups
- Choose between a queue and Kafka for a given scenario
- Explain why duplicate messages are normal, and write an idempotent consumer

### Section 2 — Full Walkthrough (proposed sections)

Each entry gives the section's goal, its layout building blocks (SVG / table / code / `.concept`
box / callout), and the plain-language hook.

#### Part A — Why async

**1. Where day 17 left off**
- One-line recap: checkout in Orders makes five HTTP calls one after another. This picks up from
  day 17's section 6 callout.
- **SVG — a timeline bar chart.** Each call is a horizontal bar laid end to end: users 40ms →
  catalog 60ms → inventory 80ms → payments 300ms → notifications 1200ms. The customer waits for
  the sum.
- Callout: "The customer is waiting on an email server they've never heard of."

**2. Where sync hurts**
A table in the same format as day 17's section 2 (pain point | what it looks like):

| Pain point | What it looks like |
|---|---|
| Latency adds up | The slowest service in the chain sets checkout time |
| Failures chain together | Notifications is down, so checkout fails, even though the email wasn't essential |
| Availability multiplies | Five services each up 99.9% of the time → the chain is up about 99.5% (roughly 3.6 hours down a month) |
| Traffic spikes pass straight through | A Black Friday burst hits every downstream service at the same moment |
| The caller knows everyone | Adding a Loyalty-points service means editing and redeploying Orders |
| Retries are ambiguous | A timeout on Payments: did the charge go through or not? (day 17 demo 6) |

- **SVG — a cascade.** Notifications is slow → Orders' connections pile up waiting → the gateway
  times out. Red boxes spreading upstream.
- Concept box: none of this is a bug. It's the price of *waiting for an answer you didn't need*.

**3. The alternative: async and eventual consistency**
- **Analogy table: phone call vs. text message.** A phone call needs both people available at the
  same time and blocks you until it ends. A text message is delivered when the other person is
  ready, and you get on with your day.
- **SVG — sync vs. async side by side.** Left: Orders → Notifications, with arrows going there and
  back. Right: Orders → [mailbox] → Notifications, with Orders already returning "201 created".
- **Eventual consistency**, in plain terms with a concrete timeline:
  `t=0 order saved → t=0.05s customer sees "order placed" → t=2s email arrives → t=5s loyalty points appear`.
  Everything becomes correct *eventually*, not *instantly*.
- **Table — stays sync vs. can go async** (moved from the old section 1, reworded):
  - Needs the answer to respond → sync (price lookup, payment authorization, stock check)
  - Should happen *because* this happened → async (email, points, analytics, search re-index)
- **Concept box — events vs. commands** (kept from the old notes): `OrderPlaced`, not
  `SendEmail`. A past-tense fact keeps the publisher unaware of who's listening.

#### Part B — Message queues (RabbitMQ)

**4. A message queue: the mailbox in the middle**
- **SVG:** producer (Orders) → queue (a box of stacked envelopes) → consumer (Notifications), with
  an "ack ✓" arrow back from the consumer to the queue.
- **Vocabulary table:** producer, queue, consumer, message, **ack** (the consumer says "done, delete
  it").
- **Code (from `rabbitmq-store/basics/`):** `send.ts` about 10 lines, `receive.ts` about 12 lines.
  Just `amqplib`: `assertQueue`, `sendToQueue`, `consume`, `ack`.
- **What it buys, as a 3-row table:** consumer down → messages wait. Spike → queue absorbs it
  (load leveling). Slow → add more consumers.

**5. More workers on one queue: competing consumers**
- **SVG:** one queue → two Notifications copies. Messages 1, 3, 5 go to copy A and 2, 4, 6 go to
  copy B.
- Callout: this is how a queue scales. It is also exactly why a queue **can't fan out**, which
  sets up the next section.

**6. The limit: one message, one reader**
- The problem stated concretely: Inventory, Notifications, and Loyalty *all* need every
  `OrderPlaced`.
- **SVG — the wrong way.** All three services on one queue, each getting only a third of the
  orders. Inventory never hears about order #2, so the stock is never deducted.
- The bad fix, one line: Orders sends to three queues by name, which puts back the coupling we
  were trying to remove.

**7. Exchanges and fan-out (pub/sub)**
- **SVG — the key diagram of Part B.** Orders → exchange `orders` (fanout) → three queues
  (`inventory.q`, `notifications.q`, `loyalty.q`) → three services. Two copies of Inventory share
  `inventory.q`.
- One-line takeaway: **the exchange copies messages *between* services, and the queue splits them
  *within* a service.** Both ideas come back as Kafka consumer groups.
- **Code:** publisher `assertExchange` + `publish`; subscriber `assertQueue` + `bindQueue` +
  `consume`. `good` markers on the bind line.
- Callout: adding Loyalty tomorrow means binding one new queue. Orders doesn't change.
- **Small table — exchange types:** fanout (everyone), direct (exact routing key), topic
  (`order.*` patterns). One row each, vocabulary only.

**8. The same thing on AWS: SQS + SNS** (notes only, no lecture code)
- **Mapping table:**

| RabbitMQ | AWS | Note |
|---|---|---|
| Queue | SQS queue | |
| Fanout exchange | SNS topic | |
| Binding | SNS → SQS subscription | |
| `ack` | `DeleteMessage` (+ visibility timeout) | |
| Dead-letter queue | SQS redrive policy | |
| You run the broker | AWS runs it | Pay per request, no server |

- **SVG:** the classic "SNS fan-out to SQS" picture (one topic, three queues, three services).
  Deliberately drawn with the same shapes as the section 7 SVG, so the match is visible.
- Callout: same pattern, managed service. At a client site this is usually what you'll see on
  AWS.

**9. Where queues run out**
Table (what a queue does → what that means):
- An acked message is **deleted** → there's no history, and you can't replay after fixing a
  consumer bug
- A new subscriber only sees messages **from now on** → a Fraud service added today can't learn
  from last month's orders
- Competing consumers → ordering per customer isn't guaranteed
- Every subscriber gets its **own copy** of every message → at millions of events per second,
  with dozens of subscribers, that copying gets expensive

Callout: "A queue is a to-do list: once a job is done, it's crossed off. Some systems need a
*record* instead."

#### Part C — Kafka

**10. Kafka is a log, not a mailbox**
- Keep this short, and put up front that this is **a different model, not an upgrade**.
- **Analogy:** a mailbox (a letter is removed once it's read) vs. a shared ledger or group-chat
  history (nothing is removed; each reader keeps their own bookmark).
- **SVG:** an append-only log (cells 0–9) with two bookmarks pointing at different positions:
  Notifications at 7, Analytics at 3.
- **The big comparison table:**

| | RabbitMQ / SQS | Kafka |
|---|---|---|
| Mental model | Mailbox / to-do list | Log / ledger |
| After it's read | Deleted | Kept (for the retention period, e.g. 7 days, or forever) |
| Who tracks progress | The broker, per message | The consumer, as one offset number |
| Delivery | Broker pushes | Consumer pulls |
| Fan-out | One queue per subscriber, via an exchange | Each consumer group reads the same log |
| Replay | No | Yes, move the offset back |
| Ordering | Per queue, weak with competing consumers | Guaranteed per partition |
| Sweet spot | Task/job distribution, commands, moderate volume | Event streams, analytics, audit, very high throughput |

**11. Topics and partitions**
- Reuse the existing partitions SVG, simplified.
- Key → partition: `hash(orderId) % 3`. Same key, same partition, **order kept per key**.
- Short code: `producer.send({ topic, messages: [{ key, value }] })`.

**12. Offsets: the bookmark**
- **SVG:** one partition with a committed-offset marker. Consumer crashes → restarts → resumes at
  the marker.
- Three bullets: resume after a crash; **replay** by moving the offset back; a **new group** can
  start from the beginning and read all history. That third one answers section 9's "Fraud
  service added today".

**13. Consumer groups: fan-out and scaling in one idea**
- **SVG:** 3 partitions. Group `inventory` with 2 instances (splits the partitions 2+1); group
  `notifications` with 1 instance (reads all 3); group `inventory` scaled to 4 instances (**one
  sits idle**).
- Concept box: *across* groups = fan-out (like one queue per subscriber), *within* a group = split
  the work (like competing consumers). **Partition count caps parallelism.** This connects back to
  the section 7 takeaway.

**14. Choosing: queue or Kafka**
- Decision table with 5–6 scenarios: send a welcome email / resize uploaded images → queue.
  Clickstream analytics / audit trail / several teams building on order history / a replay after
  a bug → Kafka.
- AWS one-liner: managed Kafka = **MSK**. **Kinesis** is AWS's own log-style service.
- Callout: most systems start with a queue. Kafka earns its operational cost when you need
  history or massive scale.

#### Part D — Advanced: living with async

Every section in this part is in the notes, after an **Advanced** section-label divider (the same
one day 9 uses).

**15. Duplicates are normal: at-least-once delivery**
- Concept box (kept from the old version, generalized to both brokers): process-then-ack →
  duplicates are possible; ack-then-process → lost messages are possible. Pick one.
- Idempotent consumer snippet (kept). Tie it to the RabbitMQ demo where killing the consumer
  before the ack redelivers the message.

**16. The dual-write problem and the outbox pattern**
- **SVG:** Orders → DB write ✓ → crash ✗ → publish never happens. The order exists and nobody is
  told.
- Fix: write the order and an `outbox` row in **one transaction**; a relay publishes the outbox
  rows. Small SQL snippet.

**17. When a message keeps failing: retries and the dead-letter queue**
- A poison message (bad JSON) → retried forever → blocks the queue. Fix: after N tries, move it to
  a DLQ for a human to look at.
- One line on Kafka: there's no built-in DLQ, so you publish to an `orders.dlq` topic yourself.

**18. Consumer lag and back-pressure**
- Lag = newest offset − committed offset. It's the one metric to alert on. Links to day 23
  (monitoring).

**19. Multi-step workflows: sagas**
- Day 17's compensating action (release the reservation when payment fails), redone with events:
  `PaymentFailed` → Inventory releases the stock itself.
- A small choreography SVG. Vocabulary only: choreography vs. orchestration.

**20. What async costs you: the final trade-off table**

| You gain | You pay |
|---|---|
| Fast responses, no failure chains | UI must show "processing" states (eventual consistency) |
| Add subscribers without touching the publisher | Harder to answer "who reacts to this event?" |
| Buffering for spikes | Another piece of infrastructure to run and monitor |
| Independent failure | Debugging across hops (the correlation ID goes in message headers) |
| | Event schemas are now contracts, and changing them is a versioning problem |

Closing callout: most real systems mix both. Sync for questions you need answered, async for
facts you're announcing.

### Page mechanics

- The same components as day 17: `.ref-table`, `.concept`, `.callout`, and inline `<svg>` with
  the same palette. Blue `#eef3ff` = service, purple `#f3eefc` = broker/queue, yellow `#fff7e0` =
  the "center" service, red `#fdf3f3` = failure. Give every broker its own consistent shape
  (envelope stack = queue, diamond or hexagon = exchange, striped bar = log) so the progression
  from queue to exchange to log is visual.
- About 12–14 SVGs across the page. Long, but day 17 is 660 lines. Expect about 900–1,000 lines,
  most of it SVG.
- Code snippets come verbatim from the lecture projects, so the notes and the demos match.

### Knock-on edits (after the Notes rewrite, separate turns)

- `Concepts.tsx`: add RabbitMQ/exchange/SQS-SNS/"Kafka vs. queue" questions. The existing
  Kafka/idempotency/outbox/DLQ/lag/saga questions mostly still fit. Remove the two overselling
  questions, since that topic moved to the backlog.
- `lecture/Lecture.tsx`: unchanged (blank canvas).
- Day 18 has no `Practice.tsx` or `Lab.tsx` yet. Out of scope here; say if you want them next.

---

## Part 2 — Lecture code

### Decision: two projects, not three

A separate "pure queue" project isn't worth it:

- The pure-queue lesson is **~20 lines of code**: send, receive, and run two receivers to see
  competing consumers. A whole e-commerce project wrapped around it would be mostly copy-paste of
  the fan-out project with one line removed.
- The fan-out project **still contains the pure-queue behavior**. Each service's own queue with 2
  instances *is* competing consumers. Students see both ideas in one system, which is exactly the
  "copies between services, splits within a service" takeaway.

So each project has two layers:

- **`basics/`**: tiny standalone scripts, one idea per file. Used live in the lecture, and quoted
  directly in the notes. This is the "simple code".
- **`services/`**: a small e-commerce microservice system. This is the "full code".

### Decision: Docker for the brokers, plain Node for the services

- **RabbitMQ in Docker** even though a native install is possible. The reason isn't difficulty.
  Homebrew / Windows installs differ per machine, and `rabbitmq:management` gives the
  **management UI at :15672**, where you can *see* exchanges, bindings, queue depth, and unacked
  messages. That UI is half the teaching value.
- **Kafka in Docker**, no question. Single-node KRaft (no ZooKeeper), plus **Kafka UI** to see
  topics, partitions, per-group offsets, and lag.
- Services run as `npm run dev` processes (tsx watch) via npm workspaces + `concurrently`, the
  same pattern as `day17-microservices/microservices`. That makes it easy to start a second copy,
  or kill one, live.
- **No database.** Each service keeps its state in memory and exposes it on a `GET` endpoint. The
  lesson is messaging, and Postgres would triple the setup. The outbox pattern stays in the notes
  only. (The trade-off: in-memory state resets on restart. That's fine for the demos, and I'll
  note it in the README.)

### Folder layout

```
day18-event-driven-architecture/
  README.md                     overview, ports, which project for which part of the lecture

  rabbitmq-store/
    docker-compose.yml          rabbitmq:management  (5672 AMQP, 15672 UI, guest/guest)
    package.json                workspaces + dev:all / infra:up / infra:down
    shared/
      events.ts                 OrderPlaced type + exchange/queue names (the "contract")
      rabbit.ts                 connect(), with retry until the broker is up
    basics/
      01-send.ts                sendToQueue("hello") — pure queue
      02-receive.ts             consume + ack; run twice → competing consumers
      03-publish-fanout.ts      publish to a fanout exchange
      04-subscribe.ts           <name> arg → own queue bound to the exchange
    services/
      orders/        :4201      POST /orders (async: publish OrderPlaced), POST /orders/sync (the day-17 way)
      inventory/     :4202      consumes → decrements stock; GET /inventory
      notifications/ :4203      consumes → "sends" email (logs); GET /notifications; POST /debug/slow, /debug/down
      loyalty/       :4204      NOT in dev:all — started live to show "new subscriber, Orders untouched"

  kafka-store/
    docker-compose.yml          apache/kafka (KRaft, 9092) + kafka-ui (8085)
    package.json
    shared/
      events.ts                 OrderPlaced / OrderPaid / OrderShipped, topic names
      kafka.ts                  kafkajs client + admin helper
    basics/
      01-create-topic.ts        topic "orders" with 3 partitions
      02-produce.ts             keyed messages; prints partition + offset for each
      03-consume.ts             <groupId> arg; prints partition/offset; run with different/same groups
      04-replay.ts              new group, fromBeginning: true → reads full history
    services/
      orders/        :4301      POST /orders, POST /orders/:id/pay, /ship → events keyed by orderId
      inventory/     :4302      group "inventory"
      notifications/ :4303      group "notifications"
      analytics/     :4304      group "analytics" — NOT in dev:all; started late, rebuilds revenue totals from offset 0
    scripts/
      reset-offsets.sh          wraps kafka-consumer-groups.sh --reset-offsets (replay after a "bug fix")
```

Ports 42xx / 43xx avoid day 17's 41xx and 8080. The broker ports are the defaults. Before
building, I'll check the top-level `backend-lecture-code/docker-compose.yml` for clashes.

### Project 1 — `rabbitmq-store`: demo script

This runs in lecture order, and each step matches a notes section.

| # | Notes § | Demo | What students see |
|---|---|---|---|
| 1 | 2 | `POST /debug/slow {ms:3000}` on notifications, then `POST /orders/sync` | Checkout takes 3s+. `/debug/down` → checkout fails |
| 2 | 3 | Same slow notifications, `POST /orders` | 201 in ~10ms; the email log line shows up 3s later |
| 3 | 4 | `basics/01-send` ×5 with no receiver running; open :15672 | Queue depth 5; start `02-receive` → it drains |
| 4 | 5 | Two `02-receive` terminals, send 6 | Messages alternate between them |
| 5 | 6 | Point inventory + notifications at *one* queue (a commented-out line in each) | Each gets half the orders; stock is wrong |
| 6 | 7 | Restore: fanout exchange, one queue per service | Every service gets every order; UI shows exchange → 3 bindings |
| 7 | 7 | Stop notifications, place 3 orders, restart it | It catches up: messages waited in `notifications.q` |
| 8 | 7 | `npm run dev -w services/loyalty` | New queue bound; *future* orders earn points; Orders code untouched |
| 9 | 9 | Point out that loyalty got nothing for the orders from before it started | "The queue forgets": sets up Kafka |
| 10 | 15 | Notifications `POST /debug/crash-before-ack`, then place an order | Message redelivered on restart → duplicate email (idempotency fix shown as a `// FIX:` block) |
| 11 | 17 | Publish malformed JSON | After 3 tries → lands in `orders.dlq` (visible in UI) |

### Project 2 — `kafka-store`: demo script

The same store and event names, so the *only* thing that changes is the broker. That makes the
"different model" visible.

| # | Notes § | Demo | What students see |
|---|---|---|---|
| 1 | 11 | `01-create-topic`, then `02-produce` with keys `order-1..order-5` | Each message prints `partition=N offset=M`; the same key always lands in the same partition |
| 2 | 11 | Produce `placed → paid → shipped` for one order | All three in one partition, in order |
| 3 | 12 | `03-consume notifications`, stop it, produce 5 more, restart | Resumes at the committed offset. Nothing lost, nothing repeated |
| 4 | 13 | `03-consume inventory` in 2 terminals | Partitions split (see the rebalance log). Start a 4th → one sits idle |
| 5 | 13 | `03-consume inventory` + `03-consume notifications` | Both groups see everything (fan-out with no exchange) |
| 6 | 10/12 | Messages still visible in Kafka UI after being consumed | Contrast with RabbitMQ demo 3, where the queue emptied |
| 7 | 12 | Start `services/analytics` *after* 20 orders exist | It reads from offset 0 and reports full revenue. This is the answer to RabbitMQ demo 9 |
| 8 | 12 | "We had a bug in analytics": `scripts/reset-offsets.sh analytics` | Replays and recomputes. Impossible with a queue |
| 9 | 18 | Slow analytics consumer + a burst of 500 orders | Lag climbs in Kafka UI, then drains |

### Technical choices to check while building

- **RabbitMQ client:** `amqplib` + `@types/amqplib`. Stable and the standard choice.
- **Kafka client:** `kafkajs` has the most readable API for teaching, but it's been lightly
  maintained since 2023. Its compatibility with **Kafka 4.x** (which dropped old protocol versions)
  is uncertain. Plan: pin the broker image to the **3.9.x** KRaft line, confirm the demos work,
  and keep `@confluentinc/kafka-javascript` (a KafkaJS-compatible API) as the fallback. I'll check
  this first when building, before writing any service.
- **Kafka UI image:** `kafbat/kafka-ui` (the maintained fork of provectus). I'll verify it when
  building.
- The same TS setup as day 17 (ESM, tsx, strict).

---

## Decisions

1. **SQS+SNS goes before section 9 ("where queues run out").** The limits in section 9 then apply to
   RabbitMQ *and* SQS at once, so the case for Kafka covers both.
2. **The overselling race condition is out of day 18.** It's parked in `src/backlog.md` under
   Day 18, together with the fixes and where it could go later.
3. **The sync baseline (`POST /orders/sync`) stays in the RabbitMQ project.** Demos 1–2 become a
   direct before/after in one terminal. To be reviewed after it's built.
4. **All of Part D (sections 15–20) goes in the notes, labeled "Advanced".** It opens with a
   `<p className="section-label">Advanced</p>` divider, the same marker day 9 uses, so students
   know everything after it is beyond the core.

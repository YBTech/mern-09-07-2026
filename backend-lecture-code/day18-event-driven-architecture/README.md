# Day 18: Event-driven architecture, lecture code

The same small store built twice, once on each kind of broker. Both use the same event
(`OrderPlaced`), the same SKUs, and the same service names, so the broker is the only thing that
changes.

```
day18-event-driven-architecture/
  rabbitmq-store/   a message QUEUE, then an EXCHANGE for fan-out     (lecture part 1)
  kafka-store/      a LOG: partitions, offsets, consumer groups, replay (lecture part 2)
```

Each project has two layers:

- **`basics/`**: tiny standalone scripts, one idea per file. These are the snippets on the Notes
  page. Run them in a few terminals side by side.
- **`services/`**: the store itself: Orders publishes, and the other services react.

The brokers run in Docker. The services run on your machine as plain Node processes, so you can
start, kill, and duplicate them live. There's no database: every service keeps its state in memory
(a real service would have its own database), which keeps the day about messaging.

## Ports

| What | rabbitmq-store | kafka-store |
| --- | --- | --- |
| Broker | `5672` (AMQP) | `9092` |
| **Web UI** | http://localhost:15672 (guest / guest) | http://localhost:8085 |
| orders | 4201 | 4301 |
| inventory | 4202 (2nd copy: `PORT=4212`) | 4302 (more: `PORT=4312`, `4322`, `4332`) |
| notifications | 4203 | 4303 |
| the late joiner | loyalty 4204 | analytics 4304 |

## Setup (either project)

```bash
cd rabbitmq-store        # or kafka-store
npm install
npm run infra:up         # broker (+ UI) in Docker; kafka-store also creates the "orders" topic
npm run dev:all          # orders + inventory + notifications, color-prefixed logs
```

`npm run infra:reset` wipes the broker (every queue, topic, message, and offset) and starts it
fresh. **Reset before each lecture.** Both demos are about what the broker remembers, so leftovers
from rehearsal will confuse the story.

---

## Part 1: `rabbitmq-store`

Keep http://localhost:15672 open on the projector: the **Queues** tab (messages ready/unacked) and
**Exchanges → orders → Bindings** make the ideas visible.

### Basics: a queue, then an exchange

| # | Run | What students see |
| --- | --- | --- |
| 1 | `npm run send -- 5` with nobody listening | UI: queue `hello` holds 5 messages. **They wait.** |
| 2 | `npm run receive -- A` | It drains all 5. Ack → deleted → queue back to 0 |
| 3 | `receive -- A` and `receive -- B` in two terminals, then `send -- 6` | Messages **split** between A and B: competing consumers. One message, one reader |
| 4 | `npm run subscribe -- email` and `npm run subscribe -- sms`, then `npm run publish -- "sale"` | **Both** get it: each subscriber has its own queue bound to the `news` exchange |
| 5 | A second `subscribe -- email` | Now the two `email` copies split `news.email`, while `sms` still gets everything |
| 6 | `npm run publish` before any subscriber exists (after `infra:reset`) | Nothing arrives anywhere: **an exchange stores nothing**, and a message with no bound queue is dropped |

### The store: sync pain, then async

| # | Run | What students see |
| --- | --- | --- |
| 1 | `curl -X POST localhost:4201/orders/sync` | 201 in ~30ms. Orders called Inventory and Notifications over HTTP |
| 2 | `curl -X POST localhost:4203/debug/slow -H 'content-type: application/json' -d '{"ms":3000}'`, then `/orders/sync` again | **3,000ms+**. The customer waits on the email provider |
| 3 | Same slow email, `curl -X POST localhost:4201/orders` | **~1ms**. The email log line shows up 3s later on its own |
| 4 | Stop notifications (Ctrl+C in its terminal: run it separately with `npm run notifications` for this), then `/orders/sync` | **503 ECONNREFUSED**. The email service being down failed a checkout (and Inventory already deducted the stock) |
| 5 | Notifications still down: `POST /orders` three times | All 201. UI: `notifications.q` holds 3 messages. Restart notifications: 3 emails go out |
| 6 | `npm run loyalty` (a new terminal) | A new queue is bound to the exchange. New orders earn points. **Orders' code is untouched** |
| 7 | `curl localhost:4204/loyalty` | Only orders placed **after** loyalty started. The earlier ones were never copied to it and are gone from every other queue. *The queue forgets: this is the setup for Kafka* |
| 8 | `PORT=4212 npm run inventory` | Two copies share `inventory.q`, and orders alternate between them |
| 9 | `curl -X POST localhost:4203/debug/crash-before-ack`, then `POST /orders` | The email is sent, then the process dies before acking. Restart it: RabbitMQ **redelivers**, and the same customer gets the email twice (`GET /notifications`) |
| 10 | Repeat 9 but restart with `IDEMPOTENT=true npm run notifications` | `↩️ already emailed for event …, skipping`. The fix is to dedupe on `eventId` |
| 11 | `npm run poison` | Every subscriber rejects the unreadable message without requeue. UI: 3 copies in `orders.dlq` (one per subscribed queue) |

### The same store, from the browser

Start the curriculum app (`npm run dev` in `curriculum/`) and open
`/week4/day18-event-driven-architecture/lecture`. It shows the store from the customer's side, with
**Synchronous** (`POST /orders/sync`) and **Asynchronous** (`POST /orders`) panels side by side:

- A stopwatch runs while the customer waits, then freezes on the reply time. **Place 5 in a row** shows
  the sync time is the same every time.
- The **Email provider** switch (`Fast` / `Slow (3,000 ms)`) is `POST /debug/slow` on Notifications.
  Slow it and sync waits 3s per order; async still replies in a few ms.
- Under each order, chips show the downstream work. Sync is done by the time it replies. Async replies
  first, then Inventory, the email, and (if `npm run loyalty` is running) Loyalty points tick ✓ on
  their own: *eventual consistency*, live.
- Kill Notifications (Ctrl+C its process): sync checkout now fails with `ECONNREFUSED`, while async keeps
  succeeding and the email chip stays ⏳ until Notifications restarts. The status pills at the top show
  which services are up, and the stock line shows Inventory being deducted.
- The services allow browser calls through `shared/cors.ts`, since the page is on a different port.
- Only the RabbitMQ store is wired in. Kafka looks the same from a browser: publish, reply, react later.

Code to show: `services/orders/server.ts` (the `/orders/sync` vs. `/orders` handlers, side by
side), `services/inventory/server.ts` (`assertQueue` + `bindQueue`), and `shared/rabbit.ts`
(`ack` / `nack` and the dead-letter setup).

---

## Part 2: `kafka-store`

Keep http://localhost:8085 open: **Topics → orders → Messages** (still there after being read) and
**Consumers** (each group's offset and lag per partition). `npm run groups` shows the same numbers
in the terminal.

### Basics: partitions, offsets, groups

| # | Run | What students see |
| --- | --- | --- |
| 1 | `npm run create-topic` | Topic `demo` with 3 partitions |
| 2 | `npm run produce` (run it twice) | `alice → partition 0`, `dave → 1`, `carol → 2`, every time. Offsets keep counting up; nothing is overwritten |
| 3 | `npm run consume -- email` in two terminals, then `produce` | The group **splits** the partitions: one owns `[0, 1]`, the other `[2]` (the 🔀 log line) |
| 4 | `npm run consume -- analytics` too | A different group, so it gets **everything**, independently. Fan-out with no exchange |
| 5 | Ctrl+C every consumer, `npm run produce`, then `npm run groups` | `LAG 2` per partition. The messages are waiting in the log, and the group's bookmark hasn't moved |
| 6 | Start `consume -- email` again | It resumes at exactly the next offset. Nothing lost, nothing repeated |
| 7 | `npm run replay` | A brand-new group reads the **entire history** from offset 0, including messages every other group read long ago |

### The store: late joiners, replay, scaling, lag

| # | Run | What students see |
| --- | --- | --- |
| 1 | `POST localhost:4301/orders` a few times | Each response says which partition and offset the event landed at |
| 2 | Then `POST /orders/ord-1001/pay` and `POST /orders/ord-1001/ship` | Notifications logs placed → paid → shipped, all in the **same partition, in order** (key = orderId) |
| 3 | `npm run analytics` (after orders exist) | Its first run starts at offset 0, so revenue includes orders placed **before it existed**. Compare with loyalty in part 1 |
| 4 | Ctrl+C analytics, `npm run reset-offsets -- analytics`, `BUGGY=true npm run analytics` | Revenue is too high: it counts unpaid orders |
| 5 | Ctrl+C, `npm run reset-offsets -- analytics`, `npm run analytics` | The fixed code **replays the whole history** and the numbers are right. A queue can't do this |
| 6 | `PORT=4312 npm run inventory`, then `4322`, then `4332` | Each start rebalances the group. With 4 copies and 3 partitions, **one copy is idle**: partitions cap parallelism |
| 7 | `SLOW_MS=100 npm run analytics`, then `curl -X POST localhost:4301/orders/burst -H 'content-type: application/json' -d '{"count":150}'` | Analytics' **lag** climbs in the UI / `npm run groups`, then drains. Inventory and Notifications aren't slowed at all |

Analytics keeps its totals in memory, so a plain restart starts them at zero while the group
resumes from its bookmark. For totals that cover everything, reset its offsets before restarting
(that's steps 4–5).

Code to show: `services/orders/server.ts` (`publish`, keyed by orderId),
`services/analytics/server.ts` (`fromBeginning: true`), and `basics/03-consume.ts`.

---

## Gotchas

- **RabbitMQ `PRECONDITION_FAILED - inequivalent arg`**: a queue or exchange already exists with
  different settings (e.g. durable vs. not). Declarations must match exactly. `npm run infra:reset`
  clears it.
- **RabbitMQ 4 rejects non-durable shared queues.** Every queue here is `durable: true` for that
  reason.
- **Kafka is pinned to 3.9.x.** `kafkajs` (the most readable Node client) doesn't support some of
  the protocol changes in Kafka 4. For a new production project, look at
  `@confluentinc/kafka-javascript`, which offers a KafkaJS-compatible API.
- **`reset-offsets` says the group is not inactive**: a consumer in that group is still running.
  Ctrl+C it first. A consumer that was killed hard (not Ctrl+C) stays in the group for ~10s
  until its session times out.

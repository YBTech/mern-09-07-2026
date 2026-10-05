# Day 19: GraphQL and real-time, lecture code

Two small projects. Neither needs Docker: every service keeps its data in memory.

```
day19-realtime-graphql/
  graphql-store/    five REST services, and a GraphQL aggregation layer (BFF) in front   (lecture part 1)
  realtime-demos/   four real-time features, each with the mechanism that fits it     (lecture part 2)
```

The browser side of both is in the curriculum app: `/week4/day19-realtime-graphql/lecture/graphql`
and `/week4/day19-realtime-graphql/lecture/realtime`.

---

## Part 1: `graphql-store`

```bash
cd graphql-store
npm install
npm run dev:all        # all 6 processes, color-prefixed logs
```

Every service is plain REST. GraphQL exists in one place only: the aggregation layer (the BFF).

| Service | Port | API | Notes |
|---|---|---|---|
| **aggregator** | 4500 | REST `GET /dashboard/:customerId` **and** GraphQL `POST /graphql` | The BFF: one request in, many requests out |
| users | 4501 | REST | `GET /users/:id`, `GET /users?ids=…` (batch) |
| orders | 4502 | REST | `GET /orders?customerId=…` returns orders **with their items**. Each item keeps a snapshot of the product (name, price paid), so listing orders needs no Catalog call |
| catalog | 4503 | REST | Big product objects (~25 fields). Used for *live* product data (today's price, rating), not by the account page |
| shipping | 4504 | REST | `GET /shipments?orderIds=…` answers for several orders in one call |
| reviews | 4505 | REST | `GET /reviews?authorId=…`, `GET /reviews?skus=…` |

The aggregator has **Apollo Sandbox**: open http://localhost:4500/graphql in a browser to write queries with
autocomplete.

### The simulated network (read this before demoing)

On one laptop every request takes ~1 ms, so a browser making 4 calls in two waves would look as fast as a browser
making 1. Every service holds a request that comes **from a browser** (it carries an `Origin` header) for a while
before answering, standing in for the trip across the internet. The aggregator's own calls to the services carry no
`Origin` header, so they stay ~1 ms, like calls inside one datacenter.

- It starts at 150 ms ("phone on cellular"); `EDGE_LATENCY_MS=…` changes the starting value.
- The lecture page's **Network** switch sets it on every service: *Laptop on Wi-Fi* (20 ms) or *Phone on cellular* (150 ms).
- Say this out loud in the lecture: the aggregator still makes the same calls. It's only faster because the browser
  is far away. On Wi-Fi, the difference nearly disappears.

### Demo script

| # | Do | What students see |
|---|---|---|
| 1 | Lecture page → **Network: Laptop on Wi-Fi**, **Load it by: Browser calls every service** | 4 requests in two waves (users, orders, reviews, then shipping, which needs the order ids). Fast: fine |
| 2 | Switch to **Phone on cellular**, same mode | The same 4 requests now take ~340 ms: two full trips across a slow network |
| 3 | **REST aggregator** | 1 request (~170 ms): one slow trip, and the second wave happens inside the datacenter. ~3.2 KB: whole objects for every client |
| 4 | **GraphQL aggregator** | 1 request, ~1 KB: only the fields the page shows |
| 5 | Switch **Client → Mobile**, then REST and GraphQL again | The phone layout shows less. REST still sends ~3.2 KB; GraphQL's mobile query sends ~0.65 KB |
| 6 | Sandbox: `{ order(id: "nope") { id } }` | HTTP **200**, with `"data": { "order": null }` and an `errors` array (`NOT_FOUND`) |
| 7 | Restart with `USE_DATALOADER=false npm run dev:all`, then in Sandbox: `{ customer(id: "c-1") { orders { shipment { status } items { name product { price rating } } } } }` | The aggregator's log shows the **N+1**: 4 `→ shipping` calls (one per order) and 8 `→ catalog` calls (one per item, for the live product). With the default (DataLoader on) it's 1 batched call to each |
| 8 | Sandbox: `{ customer(id: "c-1") { reviews { product { reviews { author { reviews { product { reviews { title } } } } } } } } }` | Rejected before it runs: `exceeds maximum operation depth of 6` (`MAX_DEPTH`). The schema loops (customer → reviews → product → reviews → author → …), so without a limit this could nest forever |
| 9 | Sandbox: `mutation { placeOrder(customerId: "c-1", items: [{ sku: "sku-108", qty: 2 }]) { id total } }` | A mutation: the aggregator snapshots the product from Catalog and creates the order in Orders |

Code to show:
- `services/aggregator/server.ts`: `restDashboard()` (version 1) next to the schema and resolvers (version 2), the
  DataLoaders, and `depthLimit`.
- `services/orders/server.ts`: line items with a product snapshot.

`graphql-store/graphql-tradeoffs.md` holds background reading on when GraphQL is (and isn't) worth it.

---

## Part 2: `realtime-demos`

```bash
cd realtime-demos
npm install
npm run dev            # http://localhost:4600, chat WebSocket at ws://localhost:4600/chat
```

Four features, each built with the mechanism that fits it. One module per feature:

| # | Feature | Mechanism | Route | Code |
|---|---|---|---|---|
| 1 | Server monitoring dashboard | Short polling (every 2 s) | `GET /metrics`, new numbers every second | `src/metrics.ts` |
| 2 | Notification bell | Short polling **and** long polling, side by side | `GET /notifications?since=…` answers at once; `GET /notifications/poll?since=…` is held until there's news (or 25 s → `204`) | `src/notifications.ts` |
| 3 | Chat room | WebSocket | `ws://localhost:4600/chat?user=Ana`: messages, "typing…", who's online | `src/chat.ts` |
| 4 | Live match commentary | SSE | `GET /match/events` (`text/event-stream`, with `id:` lines); `GET /match` is the plain-request version | `src/match.ts` |

Simulators: `POST /notifications` (someone comments), `POST /jobs/export` (a background job whose
"done" arrives as a notification after `JOB_MS`, default 15 s), `POST /match/start` (one scripted
event every `STEP_MS`, default 2.5 s), and `POST /match/drop` (ends every open SSE stream, so the
browser reconnects after 4 s with `Last-Event-ID` and the server replays what it missed).
`GET /stats` counts requests, open connections, and messages per mechanism.

### Demo script

| # | Do | What students see |
|---|---|---|
| 1 | Watch the dashboard for a few seconds | Every poll brings new data: "0 wasted". Short polling is fine when the data really does change constantly |
| 2 | Leave the page alone for 30 s, then press **Someone comments** | The short-polling bell's "nothing new" count keeps climbing and its notification arrives up to 2 s late; the long-polling bell has made a handful of requests and shows it instantly |
| 3 | **Start a report export** | 15 s of silence, then "export ready" lands instantly in the long-polling bell: the background-job case |
| 4 | Type in Ana's window | "Ana is typing…" appears in Ben's window straight away; send, and both windows update. Both directions, one connection each |
| 5 | **Start match** | The SSE scoreboard and commentary update live; the plain-request scoreboard stays at 0–0 until you press Refresh |
| 6 | **Drop the connection** mid-match | The SSE panel shows "reconnecting…", then catches up: missed events are tagged "replayed after reconnect" (the server log shows `↻ stream reconnected after #N`) |
| 7 | Open ChatGPT or Claude, DevTools → Network, send a message | The streaming request's response type is `text/event-stream`: AI chat answers are SSE |

Socket.IO is covered in the notes only. It's a library on top of WebSocket, with its own protocol.

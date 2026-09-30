// Orders: appends events to the "orders" topic, keyed by orderId.
//
//   POST /orders               { customer, items: [{ sku, qty }] } → OrderPlaced (empty body = a default order)
//   POST /orders/:id/pay       → OrderPaid
//   POST /orders/:id/ship      → OrderShipped
//   POST /orders/burst         { count } → that many orders at once (for the lag demo)
//
// Every response says which partition and offset the event landed at.
import express from "express";
import { randomUUID } from "node:crypto";
import { ORDERS_TOPIC, type OrderEvent, type OrderPlaced } from "../../shared/events";
import { createProducer, kafka } from "../../shared/kafka";

const PORT = Number(process.env.PORT ?? 4301);
const PRICES: Record<string, number> = { "SKU-1": 49, "SKU-2": 25, "SKU-3": 12 };

type Order = { id: string; customer: string; total: number; status: "placed" | "paid" | "shipped" };
const orders = new Map<string, Order>();

const producer = createProducer();
await producer.connect();

// Order ids keep counting across restarts: start after however many events
// the topic already holds. (The log remembers even when this process doesn't.)
const admin = kafka.admin();
await admin.connect();
const offsets = await admin.fetchTopicOffsets(ORDERS_TOPIC);
await admin.disconnect();
let nextId = 1001 + offsets.reduce((sum, p) => sum + Number(p.high), 0);

async function publish(events: OrderEvent[]) {
  const [meta] = await producer.send({
    topic: ORDERS_TOPIC,
    // The key picks the partition. Same orderId → same partition → the
    // placed/paid/shipped events for one order can never arrive out of order.
    messages: events.map((event) => ({ key: event.orderId, value: JSON.stringify(event) })),
  });
  return { partition: meta.partition, offset: meta.baseOffset };
}

function newOrder(body: unknown): OrderPlaced {
  const input = (body ?? {}) as { customer?: string; items?: { sku: string; qty: number }[] };
  const requested = input.items?.length ? input.items : [{ sku: "SKU-1", qty: 1 }];
  const items = requested.map(({ sku, qty }) => {
    const price = PRICES[sku];
    if (price === undefined) throw new Error(`unknown sku ${sku}`);
    return { sku, qty, price };
  });
  const event: OrderPlaced = {
    type: "OrderPlaced",
    eventId: randomUUID(),
    orderId: `ord-${nextId++}`,
    customer: input.customer ?? "alice@shop.com",
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    occurredAt: new Date().toISOString(),
  };
  orders.set(event.orderId, { id: event.orderId, customer: event.customer, total: event.total, status: "placed" });
  return event;
}

const app = express();
app.use(express.json());

app.post("/orders", async (req, res) => {
  let event: OrderPlaced;
  try {
    event = newOrder(req.body);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
  const where = await publish([event]);
  console.log(`📤 ${event.orderId} OrderPlaced → partition ${where.partition}, offset ${where.offset}`);
  res.status(201).json({ order: orders.get(event.orderId), ...where });
});

app.post("/orders/:id/:action", async (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: `no order ${req.params.id} (this process only knows orders it created)` });

  const base = { eventId: randomUUID(), orderId: order.id, occurredAt: new Date().toISOString() };
  let event: OrderEvent;
  if (req.params.action === "pay") {
    event = { ...base, type: "OrderPaid", amount: order.total };
    order.status = "paid";
  } else if (req.params.action === "ship") {
    event = { ...base, type: "OrderShipped" };
    order.status = "shipped";
  } else {
    return res.status(404).json({ error: "action must be pay or ship" });
  }

  const where = await publish([event]);
  console.log(`📤 ${order.id} ${event.type} → partition ${where.partition}, offset ${where.offset}`);
  res.json({ order, ...where });
});

app.post("/orders/burst", async (req, res) => {
  const count = Number((req.body as { count?: number })?.count ?? 100);
  const events = Array.from({ length: count }, () => newOrder({}));
  await producer.send({
    topic: ORDERS_TOPIC,
    messages: events.map((e) => ({ key: e.orderId, value: JSON.stringify(e) })),
  });
  console.log(`📤 burst: ${count} OrderPlaced events`);
  res.status(201).json({ published: count });
});

app.get("/orders", (_req, res) => {
  res.json([...orders.values()]);
});

app.get("/health", (_req, res) => {
  res.json({ service: "orders", status: "ok" });
});

app.listen(PORT, () => console.log(`orders listening on http://localhost:${PORT}, next id ord-${nextId}`));

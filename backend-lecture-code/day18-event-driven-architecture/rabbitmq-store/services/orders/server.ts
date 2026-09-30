// Orders: the checkout service. Two ways to place the same order, side by side:
//
//   POST /orders/sync   the "before": call Inventory and Notifications over
//                       HTTP and wait for both
//   POST /orders        the "after": save the order, publish OrderPlaced,
//                       return. Whoever is subscribed reacts on their own time
//
// Both take { customer, items: [{ sku, qty }] }. An empty body places a
// default order, so `curl -X POST localhost:4201/orders` just works.
import express from "express";
import { randomUUID } from "node:crypto";
import { ORDERS_EXCHANGE, type OrderItem, type OrderPlaced } from "../../shared/events";
import { allowBrowser } from "../../shared/cors";
import { connect, declareOrdersExchange } from "../../shared/rabbit";

const PORT = Number(process.env.PORT ?? 4201);
const INVENTORY_URL = process.env.INVENTORY_URL ?? "http://localhost:4202";
const NOTIFICATIONS_URL = process.env.NOTIFICATIONS_URL ?? "http://localhost:4203";

// Orders owns prices; subscribers get them inside the event.
const PRICES: Record<string, number> = { "SKU-1": 49, "SKU-2": 25, "SKU-3": 12 };

type Order = {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: "placed";
  via: "sync" | "async";
};
const orders: Order[] = [];
let nextId = 1001;

const connection = await connect();
const channel = await connection.createChannel();
await declareOrdersExchange(channel);

function buildOrder(body: unknown, via: Order["via"]): Order {
  const input = (body ?? {}) as { customer?: string; items?: { sku: string; qty: number }[] };
  const requested = input.items?.length ? input.items : [{ sku: "SKU-1", qty: 1 }];
  const items = requested.map(({ sku, qty }) => {
    const price = PRICES[sku];
    if (price === undefined) throw new Error(`unknown sku ${sku}`);
    return { sku, qty, price };
  });
  return {
    id: `ord-${nextId++}`,
    customer: input.customer ?? "alice@shop.com",
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: "placed",
    via,
  };
}

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
}

const app = express();
app.use(allowBrowser);
app.use(express.json());

// ── The "before": synchronous HTTP calls ────────────────────────────────────
app.post("/orders/sync", async (req, res) => {
  const started = Date.now();
  let order: Order;
  try {
    order = buildOrder(req.body, "sync");
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }

  try {
    // The customer waits for EVERY one of these, one after another.
    await post(`${INVENTORY_URL}/internal/reserve`, { orderId: order.id, items: order.items });
    await post(`${NOTIFICATIONS_URL}/internal/order-confirmation`, {
      orderId: order.id,
      customer: order.customer,
      total: order.total,
    });
    // Adding Loyalty points would mean a third call right here, and a
    // redeploy of Orders, even though Orders doesn't care about points.
  } catch (err) {
    // An email server being down just failed a customer's checkout. And if
    // Inventory already answered, that stock stays deducted for an order
    // that doesn't exist: a partial failure.
    const cause = (err as Error).cause as { code?: string } | undefined;
    const reason = cause?.code ?? (err as Error).message; // e.g. ECONNREFUSED
    console.error(`❌ sync checkout ${order.id} failed after ${Date.now() - started}ms: ${reason}`);
    return res.status(503).json({ error: `checkout failed: ${reason}`, tookMs: Date.now() - started });
  }

  orders.push(order);
  const tookMs = Date.now() - started;
  console.log(`✅ ${order.id} placed (sync) in ${tookMs}ms`);
  res.status(201).json({ order, tookMs });
});

// ── The "after": publish an event and move on ───────────────────────────────
app.post("/orders", (req, res) => {
  const started = Date.now();
  let order: Order;
  try {
    order = buildOrder(req.body, "async");
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
  orders.push(order);

  const event: OrderPlaced = {
    type: "OrderPlaced",
    eventId: randomUUID(),
    orderId: order.id,
    customer: order.customer,
    items: order.items,
    total: order.total,
    occurredAt: new Date().toISOString(),
  };

  // Publish to the exchange, not to any service. Orders has no idea who is
  // subscribed: Inventory, Notifications, Loyalty, or nobody at all.
  channel.publish(ORDERS_EXCHANGE, "", Buffer.from(JSON.stringify(event)), {
    persistent: true, // survive a broker restart
    contentType: "application/json",
  });

  const tookMs = Date.now() - started;
  console.log(`📤 ${order.id} placed, OrderPlaced published in ${tookMs}ms`);
  res.status(201).json({ order, tookMs });
});

app.get("/orders", (_req, res) => {
  res.json(orders);
});

app.get("/health", (_req, res) => {
  res.json({ service: "orders", status: "ok" });
});

app.listen(PORT, () => console.log(`orders listening on http://localhost:${PORT}`));

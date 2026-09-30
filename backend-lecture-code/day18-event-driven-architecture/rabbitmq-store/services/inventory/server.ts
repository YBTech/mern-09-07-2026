// Inventory: deducts stock for every order.
//
// Start a second copy in another terminal to see competing consumers:
//   PORT=4212 npm run inventory
// Both copies read the SAME queue (inventory.q), so orders alternate between
// them. (Each copy keeps its own in-memory stock here; a real service would
// share one database.)
import express from "express";
import { DEAD_LETTER_EXCHANGE, ORDERS_EXCHANGE, type OrderItem } from "../../shared/events";
import { allowBrowser } from "../../shared/cors";
import { connect, consumeOrders, declareOrdersExchange } from "../../shared/rabbit";

const PORT = Number(process.env.PORT ?? 4202);
const QUEUE = "inventory.q";

const stock = new Map<string, number>([
  ["SKU-1", 100], // keyboard
  ["SKU-2", 100], // mouse
  ["SKU-3", 50], // mug
]);

// Which orders this copy has reserved stock for, so a UI can show it happening.
const reservedOrders: string[] = [];

function reserve(orderId: string, items: { sku: string; qty: number }[]) {
  reservedOrders.push(orderId);
  for (const { sku, qty } of items) {
    const before = stock.get(sku) ?? 0;
    stock.set(sku, before - qty);
    console.log(`[inventory :${PORT}] ${orderId}: ${sku} ${before} → ${before - qty}`);
  }
}

// ── Async: our own queue, bound to the orders exchange ──────────────────────
const connection = await connect();
const channel = await connection.createChannel();
await declareOrdersExchange(channel);

await channel.assertQueue(QUEUE, { durable: true, deadLetterExchange: DEAD_LETTER_EXCHANGE });
await channel.bindQueue(QUEUE, ORDERS_EXCHANGE, ""); // every OrderPlaced is copied in here

await consumeOrders(channel, QUEUE, (event) => reserve(event.orderId, event.items));

// ── HTTP: reads, plus the endpoint the sync checkout calls ──────────────────
const app = express();
app.use(allowBrowser);
app.use(express.json());

app.post("/internal/reserve", (req, res) => {
  const { orderId, items } = req.body as { orderId: string; items: OrderItem[] };
  reserve(orderId, items);
  res.status(204).end();
});

app.get("/inventory", (_req, res) => {
  res.json(Object.fromEntries(stock));
});

app.get("/inventory/reservations", (_req, res) => {
  res.json(reservedOrders);
});

app.get("/health", (_req, res) => {
  res.json({ service: "inventory", port: PORT, status: "ok" });
});

app.listen(PORT, () => console.log(`inventory listening on http://localhost:${PORT}, consuming ${QUEUE}`));

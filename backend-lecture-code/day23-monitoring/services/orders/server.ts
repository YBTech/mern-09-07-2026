// Orders: places orders (the checkout flow), and lists / reports on them.
//
// Placing an order calls four other services, one after another:
//   catalog (price) → inventory (reserve stock) → payments (charge) → notifications (email)
// so one POST /orders trace shows the whole shop.
import express from "express";
import { query } from "../shared/fakeDb";
import { errorHandler } from "../shared/errorHandler";
import { callService } from "../shared/http";
import { listen } from "../shared/listen";
import { logger } from "../shared/logger";
import { meter } from "../shared/metrics";
import { withSpan } from "../shared/trace";
import { getProduct, type CatalogProduct } from "./catalogClient";
import { orderItems, orders, takeNextOrderId } from "./data";
import { lineTotalCents } from "./pricing";

const app = express();
app.use(express.json());

// ── business metrics: what the shop owner cares about, not what the server cares about ──
const ordersPlaced = meter.createCounter("shop.orders.placed", { unit: "{order}", description: "Orders successfully placed" });
const revenue = meter.createCounter("shop.orders.revenue", { unit: "cents", description: "Order value placed" });
const ordersRejected = meter.createCounter("shop.orders.rejected", { unit: "{order}", description: "Orders refused for a business reason (not a crash)" });
const itemsPerOrder = meter.createHistogram("shop.orders.items", { unit: "{item}", description: "Line items per order" });

type OrderItemInput = { productId: string; quantity: number };
type PlaceOrderBody = { customer?: string; items?: OrderItemInput[] };

app.post("/orders", async (req, res) => {
  const { customer = "guest@example.com", items } = req.body as PlaceOrderBody;
  if (!items?.length) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  // 1. Price every line. Catalog owns prices.
  const lines: { item: OrderItemInput; product: CatalogProduct; totalCents: number }[] = [];
  for (const item of items) {
    const product = await getProduct(item.productId);
    if (!product) {
      ordersRejected.add(1, { reason: "unknown_product" });
      res.status(400).json({ error: `Unknown product: ${item.productId}` });
      return;
    }
    lines.push({ item, product, totalCents: lineTotalCents(product, item.quantity) });
  }
  const totalCents = lines.reduce((sum, line) => sum + line.totalCents, 0);

  // 2. Reserve stock. Inventory owns quantities.
  const reserved: OrderItemInput[] = [];
  const undoReservations = () =>
    Promise.all(reserved.map((item) => callService("inventory", "/release", { method: "POST", body: item })));
  for (const { item } of lines) {
    const reservation = await callService("inventory", "/reserve", { method: "POST", body: item });
    if (reservation.status === 409) {
      await undoReservations();
      ordersRejected.add(1, { reason: "out_of_stock" });
      res.status(409).json({ error: `Out of stock: ${item.productId}` });
      return;
    }
    if (!reservation.ok) throw new Error(`Inventory responded ${reservation.status} reserving ${item.productId}`);
    reserved.push(item);
  }

  // 3. Charge the card. Payments owns the external provider.
  const orderId = takeNextOrderId();
  const charge = await callService("payments", "/charge", { method: "POST", body: { orderRef: `order-${orderId}`, amountCents: totalCents } });
  if (charge.status === 402) {
    await undoReservations();
    ordersRejected.add(1, { reason: "payment_declined" });
    res.status(402).json({ error: "Your card was declined" });
    return;
  }
  if (!charge.ok) throw new Error(`Payments responded ${charge.status} for order ${orderId}`);

  // 4. Save it.
  await query("INSERT INTO orders (id, customer, total_cents) VALUES ($1, $2, $3)", 15, () => null);

  // 5. Email the customer. Fire and forget: the customer shouldn't wait for an email server.
  callService("notifications", "/notify", { method: "POST", body: { customer, orderId } }).catch((err) =>
    logger.warn({ err, orderId }, "confirmation email failed"),
  );

  ordersPlaced.add(1);
  revenue.add(totalCents);
  itemsPerOrder.record(items.length);
  logger.info({ orderId, customer, totalCents, items }, "order placed");
  res.status(201).json({ id: orderId, totalCents });
});

app.get("/orders/stats", async (_req, res) => {
  const stats = await query("SELECT COUNT(*) FROM orders", 120, () => ({ count: orders.length }));
  res.json(stats);
});

// ─── BOTTLENECK DEMO: a CPU-heavy endpoint blocks the whole service ───────────
// Node runs your JavaScript on ONE thread. While this report is crunching numbers (~120ms of
// pure CPU, no waiting on anything), the event loop can't start or finish any other request,
// including POST /orders. In a trace, the unrelated order shows a gap with nothing running in
// it; on the dashboard, "event loop delay" climbs while the DB, payments and inventory all look fine.
function buildRevenueReport() {
  const rows = Array.from({ length: 450_000 }, (_, i) => ({ order: i, cents: (i * 7919) % 100_003 }));
  rows.sort((a, b) => a.cents - b.cents);
  return { rows: rows.length, p50: rows[rows.length >> 1].cents, total: rows.reduce((sum, row) => sum + row.cents, 0) };
}

app.get("/orders/summary", async (_req, res) => {
  const report = await withSpan("orders.buildRevenueReport (CPU-bound)", {}, async () => buildRevenueReport());
  res.json(report);
});

// ─── PERFORMANCE DEMO: the N+1 query problem ──────────────────────────────────
// Both endpoints return the 20 most recent orders with their items. Same data, same response.

// BEFORE: 1 query for the orders + 1 query PER order for its items = 21 round trips.
// In Tempo this is a long staircase of identical "SELECT order_items" spans, and each one
// borrows a DB connection, so under load this endpoint also starves the pool for everyone else.
app.get("/orders/recent/n-plus-one", async (_req, res) => {
  const recent = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20", 15, () =>
    orders.slice(0, 20),
  );
  const result = [];
  for (const order of recent) {
    const items = await query(`SELECT * FROM order_items WHERE order_id = ${order.id}`, 12, () =>
      orderItems.filter((item) => item.orderId === order.id),
    );
    result.push({ ...order, items });
  }
  res.json(result);
});

// AFTER: 2 queries total. Fetch every order's items at once with WHERE ... IN (...),
// then group them in memory.
app.get("/orders/recent/batched", async (_req, res) => {
  const recent = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20", 15, () =>
    orders.slice(0, 20),
  );
  const ids = recent.map((o) => o.id);
  const items = await query(`SELECT * FROM order_items WHERE order_id IN (${ids.join(", ")})`, 15, () =>
    orderItems.filter((item) => ids.includes(item.orderId)),
  );
  res.json(recent.map((order) => ({ ...order, items: items.filter((i) => i.orderId === order.id) })));
});

app.use(errorHandler);

listen(app, "orders");

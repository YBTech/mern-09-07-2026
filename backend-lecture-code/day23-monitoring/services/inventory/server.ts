// Inventory: how many of each product we have, and reserving stock for an order.
//
// The interesting part is reserve(): two orders for the SAME product must not both read "1 left"
// and both succeed (see the overselling bug in the notes), so each product has a row lock.
// The lock fixes correctness, and creates a bottleneck: orders for one hot product are served
// one at a time. Under load, everyone queues on that product's lock. In a trace you see it as a
// long "waiting for row lock" span; on the dashboard, as lock wait time climbing for p1.
import express from "express";
import { query } from "../shared/fakeDb";
import { errorHandler } from "../shared/errorHandler";
import { Semaphore } from "../shared/limiter";
import { listen } from "../shared/listen";
import { logger } from "../shared/logger";
import { meter } from "../shared/metrics";
import { withSpan } from "../shared/trace";

const app = express();
app.use(express.json());

// How long the row lock is held per reservation: an UPDATE that also writes an audit row.
// 100ms makes the hottest product the first thing to buckle under load. Try LOCK_HOLD_MS=10 (a
// "fix"), rerun the stress test, and watch the NEXT bottleneck show itself.
const LOCK_HOLD_MS = Number(process.env.LOCK_HOLD_MS ?? 100);

const TARGET_STOCK = 5_000;
const stock = new Map<string, number>(
  ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((id) => [id, TARGET_STOCK]),
);
const locks = new Map<string, Semaphore>();
const lockFor = (productId: string) => {
  if (!locks.has(productId)) locks.set(productId, new Semaphore(1));
  return locks.get(productId)!;
};

// A nightly restock job, sped up: every 20s top up anything running low, so a long load test
// doesn't just sell out. A real "out of stock" still shows up for the hottest products.
setInterval(() => {
  for (const [id, quantity] of stock) if (quantity < TARGET_STOCK) stock.set(id, Math.min(TARGET_STOCK, quantity + 1_500));
}, 20_000).unref();

// ── business + bottleneck metrics ──
meter
  .createObservableGauge("shop.inventory.stock", { unit: "{item}", description: "Units on hand" })
  .addCallback((r) => stock.forEach((quantity, productId) => r.observe(quantity, { "product.id": productId })));
const lockWait = meter.createHistogram("inventory.lock.wait.duration", { unit: "s", description: "Time spent waiting for a product's row lock" });
const reservations = meter.createCounter("shop.inventory.reservations", { unit: "{reservation}", description: "Reserve attempts by outcome" });

type ReserveBody = { productId: string; quantity: number };

app.post("/reserve", async (req, res) => {
  const { productId, quantity } = req.body as ReserveBody;
  if (!stock.has(productId)) {
    res.status(404).json({ error: `Unknown product ${productId}` });
    return;
  }

  const lock = lockFor(productId);
  const waitedMs = await withSpan("inventory.row-lock (waiting)", { "product.id": productId }, () => lock.acquire());
  lockWait.record(waitedMs / 1000, { "product.id": productId });

  try {
    // The check and the write happen in ONE statement, under the lock: "0 rows updated" = out of stock.
    const ok = await query(
      `UPDATE inventory SET quantity = quantity - ${quantity} WHERE product_id = '${productId}' AND quantity >= ${quantity}`,
      LOCK_HOLD_MS,
      () => {
        const left = stock.get(productId)!;
        if (left < quantity) return false;
        stock.set(productId, left - quantity);
        return true;
      },
    );
    reservations.add(1, { outcome: ok ? "reserved" : "out_of_stock", "product.id": productId });
    if (!ok) {
      logger.warn({ productId, quantity }, "out of stock");
      res.status(409).json({ error: "Out of stock" });
      return;
    }
    res.status(201).json({ productId, quantity });
  } finally {
    lock.release();
  }
});

// Undo a reservation (the payment failed after we'd already taken the stock).
app.post("/release", async (req, res) => {
  const { productId, quantity } = req.body as ReserveBody;
  await query(`UPDATE inventory SET quantity = quantity + ${quantity} WHERE product_id = '${productId}'`, 20, () =>
    stock.set(productId, (stock.get(productId) ?? 0) + quantity),
  );
  reservations.add(1, { outcome: "released", "product.id": productId });
  res.status(204).end();
});

app.get("/inventory/summary", async (_req, res) => {
  const summary = await query("SELECT SUM(quantity) FROM inventory", 120, () => ({
    totalUnits: [...stock.values()].reduce((sum, quantity) => sum + quantity, 0),
  }));
  res.json(summary);
});

app.use(errorHandler);

listen(app, "inventory");

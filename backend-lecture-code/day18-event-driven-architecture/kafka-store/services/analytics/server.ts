// Analytics: consumer group "analytics". The service added months later.
//
// It's deliberately NOT in `npm run dev:all`. Start it after some orders exist:
//   npm run analytics
// fromBeginning: true, so on its first run it reads the topic's WHOLE history
// and reports revenue for orders placed before it existed.
//
// Replay after a bug fix:
//   BUGGY=true npm run analytics      revenue counted twice (placed AND paid)
//   Ctrl+C, then: npm run reset-offsets -- analytics
//   npm run analytics                 fixed code rebuilds its numbers from offset 0
//
// Lag demo:
//   SLOW_MS=200 npm run analytics, then POST /orders/burst on Orders, and
//   watch the group's lag in the UI (or `npm run groups`) climb, then drain.
//
// Its numbers live in memory, so a restart starts them from zero while the
// group resumes from its committed offset. Reset offsets before restarting
// if you want totals that cover everything.
import express from "express";
import { ORDERS_TOPIC, type OrderEvent } from "../../shared/events";
import { createConsumer, leaveGroupOnExit, logAssignments } from "../../shared/kafka";

const PORT = Number(process.env.PORT ?? 4304);
const GROUP = "analytics";
const BUGGY = process.env.BUGGY === "true";
const SLOW_MS = Number(process.env.SLOW_MS ?? 0);

const stats = { eventsRead: 0, placed: 0, paid: 0, shipped: 0, revenue: 0 };

const consumer = createConsumer(GROUP);
logAssignments(consumer, "analytics");
leaveGroupOnExit(consumer);

await consumer.connect();
await consumer.subscribe({ topic: ORDERS_TOPIC, fromBeginning: true });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    if (SLOW_MS) await new Promise((resolve) => setTimeout(resolve, SLOW_MS));

    const event = JSON.parse(message.value!.toString()) as OrderEvent;
    stats.eventsRead++;
    if (event.type === "OrderPlaced") {
      stats.placed++;
      if (BUGGY) stats.revenue += event.total; // BUG: an unpaid order isn't revenue
    } else if (event.type === "OrderPaid") {
      stats.paid++;
      stats.revenue += event.amount; // revenue = money actually collected
    } else {
      stats.shipped++;
    }
    console.log(`📊 p${partition}@${message.offset} ${event.type} ${event.orderId} → revenue $${stats.revenue}`);
  },
});

const app = express();

app.get("/analytics", (_req, res) => {
  res.json({ ...stats, buggy: BUGGY });
});

app.get("/health", (_req, res) => {
  res.json({ service: "analytics", status: "ok" });
});

app.listen(PORT, () =>
  console.log(`analytics listening on http://localhost:${PORT}, group "${GROUP}"${BUGGY ? " (BUGGY revenue)" : ""}`),
);

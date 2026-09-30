// Inventory: consumer group "inventory".
//
// Start more copies to watch the group split the 3 partitions:
//   PORT=4312 npm run inventory
//   PORT=4322 npm run inventory
//   PORT=4332 npm run inventory      ← the 4th copy owns nothing and sits idle
// (Each copy keeps its own in-memory stock here; a real service would share
// one database.)
import express from "express";
import { ORDERS_TOPIC, type OrderEvent } from "../../shared/events";
import { createConsumer, leaveGroupOnExit, logAssignments } from "../../shared/kafka";

const PORT = Number(process.env.PORT ?? 4302);
const GROUP = "inventory";

const stock = new Map<string, number>([
  ["SKU-1", 100], // keyboard
  ["SKU-2", 100], // mouse
  ["SKU-3", 50], // mug
]);

const consumer = createConsumer(GROUP);
logAssignments(consumer, `inventory :${PORT}`);
leaveGroupOnExit(consumer);

await consumer.connect();
await consumer.subscribe({ topic: ORDERS_TOPIC, fromBeginning: false });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const event = JSON.parse(message.value!.toString()) as OrderEvent;
    if (event.type !== "OrderPlaced") return; // not our concern; still counts as read

    for (const { sku, qty } of event.items) {
      const before = stock.get(sku) ?? 0;
      stock.set(sku, before - qty);
      console.log(`[inventory :${PORT}] p${partition}@${message.offset} ${event.orderId}: ${sku} ${before} → ${before - qty}`);
    }
  },
});

const app = express();

app.get("/inventory", (_req, res) => {
  res.json(Object.fromEntries(stock));
});

app.get("/health", (_req, res) => {
  res.json({ service: "inventory", port: PORT, status: "ok" });
});

app.listen(PORT, () => console.log(`inventory listening on http://localhost:${PORT}, group "${GROUP}"`));

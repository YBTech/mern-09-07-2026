// Loyalty: 1 point per dollar spent. The service nobody planned for.
//
// It's deliberately NOT in `npm run dev:all`. Start it mid-lecture:
//   npm run loyalty
// Orders' code doesn't change at all. Loyalty binds its own queue to the
// exchange, and from then on every OrderPlaced is copied to it too.
//
// Notice: orders placed BEFORE loyalty started earn no points. The exchange
// only copies into queues that exist at the moment it receives a message.
import express from "express";
import { DEAD_LETTER_EXCHANGE, ORDERS_EXCHANGE } from "../../shared/events";
import { allowBrowser } from "../../shared/cors";
import { connect, consumeOrders, declareOrdersExchange } from "../../shared/rabbit";

const PORT = Number(process.env.PORT ?? 4204);
const QUEUE = "loyalty.q";

const points = new Map<string, number>();
const rewardedOrders: string[] = []; // so a UI can show which orders earned points

const connection = await connect();
const channel = await connection.createChannel();
await declareOrdersExchange(channel);

await channel.assertQueue(QUEUE, { durable: true, deadLetterExchange: DEAD_LETTER_EXCHANGE });
await channel.bindQueue(QUEUE, ORDERS_EXCHANGE, "");

await consumeOrders(channel, QUEUE, (event) => {
  const earned = Math.floor(event.total);
  rewardedOrders.push(event.orderId);
  points.set(event.customer, (points.get(event.customer) ?? 0) + earned);
  console.log(`⭐ ${event.customer} +${earned} points for ${event.orderId} (now ${points.get(event.customer)})`);
});

const app = express();
app.use(allowBrowser);

app.get("/loyalty", (_req, res) => {
  res.json(Object.fromEntries(points));
});

app.get("/loyalty/orders", (_req, res) => {
  res.json(rewardedOrders);
});

app.get("/health", (_req, res) => {
  res.json({ service: "loyalty", status: "ok" });
});

app.listen(PORT, () => console.log(`loyalty listening on http://localhost:${PORT}, consuming ${QUEUE}`));

// Notifications: consumer group "notifications". One email per event.
//
// Place, pay, then ship one order: all three log the SAME partition, in
// order, because they share a key (the orderId).
//
// Stop this service, place a few orders, start it again: it resumes exactly
// at its committed offset. Nothing lost, nothing sent twice.
import express from "express";
import { ORDERS_TOPIC, type OrderEvent } from "../../shared/events";
import { createConsumer, leaveGroupOnExit, logAssignments } from "../../shared/kafka";

const PORT = Number(process.env.PORT ?? 4303);
const GROUP = "notifications";

const sent: { orderId: string; subject: string; partition: number; offset: string }[] = [];

function subjectFor(event: OrderEvent) {
  switch (event.type) {
    case "OrderPlaced":
      return `Order ${event.orderId} confirmed: $${event.total}`;
    case "OrderPaid":
      return `Receipt for ${event.orderId}: $${event.amount} paid`;
    case "OrderShipped":
      return `${event.orderId} is on its way`;
  }
}

const consumer = createConsumer(GROUP);
logAssignments(consumer, "notifications");
leaveGroupOnExit(consumer);

await consumer.connect();
await consumer.subscribe({ topic: ORDERS_TOPIC, fromBeginning: false });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const event = JSON.parse(message.value!.toString()) as OrderEvent;
    const subject = subjectFor(event);
    sent.push({ orderId: event.orderId, subject, partition, offset: message.offset });
    console.log(`📧 p${partition}@${message.offset} ${subject}`);
  },
});

const app = express();

app.get("/notifications", (_req, res) => {
  res.json(sent);
});

app.get("/health", (_req, res) => {
  res.json({ service: "notifications", status: "ok" });
});

app.listen(PORT, () => console.log(`notifications listening on http://localhost:${PORT}, group "${GROUP}"`));

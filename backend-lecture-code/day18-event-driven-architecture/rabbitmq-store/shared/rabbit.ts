import amqp, { type Channel } from "amqplib";
import { DEAD_LETTER_EXCHANGE, DEAD_LETTER_QUEUE, ORDERS_EXCHANGE, type OrderPlaced } from "./events";

const RABBIT_URL = process.env.RABBIT_URL ?? "amqp://guest:guest@localhost:5672";

// Retry for a few seconds, so a service started right after `infra:up`
// doesn't crash while the broker is still booting.
export async function connect() {
  for (let attempt = 1; ; attempt++) {
    try {
      return await amqp.connect(RABBIT_URL);
    } catch (err) {
      if (attempt === 10) throw err;
      console.log(`RabbitMQ not reachable yet (${(err as Error).message}), retrying in 2s...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Every service declares the same exchanges. assertExchange is idempotent:
// it creates the exchange if it's missing and does nothing if it exists, so
// it doesn't matter which service starts first.
export async function declareOrdersExchange(channel: Channel) {
  await channel.assertExchange(ORDERS_EXCHANGE, "fanout", { durable: true });

  // Where rejected messages go instead of being retried forever.
  await channel.assertExchange(DEAD_LETTER_EXCHANGE, "fanout", { durable: true });
  await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });
  await channel.bindQueue(DEAD_LETTER_QUEUE, DEAD_LETTER_EXCHANGE, "");
}

// Every consumer handles a message the same way: parse, handle, ack.
export async function consumeOrders(
  channel: Channel,
  queue: string,
  handle: (event: OrderPlaced) => Promise<void> | void,
) {
  // At most one unacked message per consumer at a time, so two copies of a
  // service take turns instead of one copy grabbing everything.
  await channel.prefetch(1);

  await channel.consume(queue, async (msg) => {
    if (!msg) return; // the queue was deleted out from under us

    let event: OrderPlaced;
    try {
      event = JSON.parse(msg.content.toString());
    } catch {
      // Unreadable now means unreadable forever. Reject WITHOUT requeue, and
      // RabbitMQ moves it to the dead-letter queue instead of looping on it.
      console.error(`☠️  unreadable message → ${DEAD_LETTER_QUEUE}: ${msg.content.toString().slice(0, 60)}`);
      channel.nack(msg, false, false);
      return;
    }

    try {
      await handle(event);
      channel.ack(msg); // "done". Only now does RabbitMQ delete it.
    } catch (err) {
      console.error(`handler failed for ${event.orderId}: ${(err as Error).message} → ${DEAD_LETTER_QUEUE}`);
      channel.nack(msg, false, false);
    }
  });
}

// Notifications: "sends" an order-confirmation email for every order.
// Sent emails are appended to data/emails.jsonl, standing in for a real email
// provider, so you can see duplicates even across restarts.
//
// Demo switches:
//   POST /debug/slow { "ms": 3000 }   every email now takes 3s to send
//   POST /debug/crash-before-ack      the next email is sent, then the process
//                                     dies BEFORE acking: RabbitMQ redelivers it
//   IDEMPOTENT=true npm run notifications
//                                     skip any event whose email was already sent
import express from "express";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { DEAD_LETTER_EXCHANGE, ORDERS_EXCHANGE, type OrderPlaced } from "../../shared/events";
import { allowBrowser } from "../../shared/cors";
import { connect, consumeOrders, declareOrdersExchange } from "../../shared/rabbit";

const PORT = Number(process.env.PORT ?? 4203);
const QUEUE = "notifications.q";
const IDEMPOTENT = process.env.IDEMPOTENT === "true";
const EMAILS_FILE = "data/emails.jsonl";

let slowMs = 0;
let crashBeforeAck = false;

type Email = { eventId?: string; orderId: string; to: string; subject: string; sentAt: string };

function sentEmails(): Email[] {
  if (!existsSync(EMAILS_FILE)) return [];
  return readFileSync(EMAILS_FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function sendEmail(email: Omit<Email, "sentAt">) {
  await new Promise((resolve) => setTimeout(resolve, slowMs)); // a slow email provider
  mkdirSync("data", { recursive: true });
  appendFileSync(EMAILS_FILE, JSON.stringify({ ...email, sentAt: new Date().toISOString() }) + "\n");
  console.log(`📧 email to ${email.to}: ${email.subject}`);
}

async function handleOrderPlaced(event: OrderPlaced) {
  // FIX for duplicates: remember what we've already handled, keyed by the
  // event's id, and skip a redelivery. Off by default so the bug shows first.
  if (IDEMPOTENT && sentEmails().some((e) => e.eventId === event.eventId)) {
    console.log(`↩️  already emailed for event ${event.eventId.slice(0, 8)} (${event.orderId}), skipping`);
    return;
  }

  await sendEmail({
    eventId: event.eventId,
    orderId: event.orderId,
    to: event.customer,
    subject: `Order ${event.orderId} confirmed: $${event.total}`,
  });

  if (crashBeforeAck) {
    // The email is out, but RabbitMQ never hears "done", so it redelivers the
    // message to whoever consumes next: that's this service, after a restart.
    console.error("💥 crashing AFTER sending the email but BEFORE the ack");
    process.exit(1);
  }
}

// ── Async ───────────────────────────────────────────────────────────────────
const connection = await connect();
const channel = await connection.createChannel();
await declareOrdersExchange(channel);

await channel.assertQueue(QUEUE, { durable: true, deadLetterExchange: DEAD_LETTER_EXCHANGE });
await channel.bindQueue(QUEUE, ORDERS_EXCHANGE, "");

await consumeOrders(channel, QUEUE, handleOrderPlaced);

// ── HTTP ────────────────────────────────────────────────────────────────────
const app = express();
app.use(allowBrowser);
app.use(express.json());

// What the synchronous checkout calls. The caller waits for the whole send.
app.post("/internal/order-confirmation", async (req, res) => {
  const { orderId, customer, total } = req.body as { orderId: string; customer: string; total: number };
  await sendEmail({ orderId, to: customer, subject: `Order ${orderId} confirmed: $${total}` });
  res.status(204).end();
});

app.get("/notifications", (_req, res) => {
  res.json(sentEmails());
});

app.post("/debug/slow", (req, res) => {
  slowMs = Number((req.body as { ms?: number }).ms ?? 0);
  console.log(`🐢 every email now takes ${slowMs}ms`);
  res.json({ slowMs });
});

app.post("/debug/crash-before-ack", (_req, res) => {
  crashBeforeAck = true;
  console.log("💣 the next message will crash this service before it's acked");
  res.json({ crashBeforeAck });
});

app.get("/health", (_req, res) => {
  res.json({ service: "notifications", status: "ok", idempotent: IDEMPOTENT, slowMs });
});

app.listen(PORT, () =>
  console.log(`notifications listening on http://localhost:${PORT}, consuming ${QUEUE}${IDEMPOTENT ? " (idempotent)" : ""}`),
);

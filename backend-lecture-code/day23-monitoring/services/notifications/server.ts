// Notifications: sends the order confirmation email. Orders does NOT wait for it (fire and forget),
// so in a trace this span starts inside the order but ends after the response was already sent.
import express from "express";
import { errorHandler } from "../shared/errorHandler";
import { listen } from "../shared/listen";
import { logger } from "../shared/logger";
import { meter } from "../shared/metrics";
import { jitter, sleep, withSpan } from "../shared/trace";

const app = express();
app.use(express.json());

const emails = meter.createCounter("shop.notifications.sent", { unit: "{email}", description: "Confirmation emails sent" });

app.post("/notify", async (req, res) => {
  const { customer, orderId } = req.body as { customer: string; orderId: number };
  await withSpan("smtp.send", { "peer.service": "email-provider", "email.template": "order-confirmation" }, () => sleep(jitter(80)));
  emails.add(1);
  logger.info({ customer, orderId }, "confirmation email sent");
  res.status(202).json({ queued: true });
});

app.use(errorHandler);

listen(app, "notifications");

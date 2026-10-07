// Payments: charges the card through an EXTERNAL provider (think Stripe).
//
// The provider is slow (~250ms) and we're only allowed a few calls in flight at once, as real
// providers rate-limit. That makes it the capacity ceiling of checkout: at 10 concurrent calls
// and ~250ms each, we can complete about 40 charges per second. Past that, charges queue up,
// and checkout latency climbs with the queue. That's what "saturation" looks like.
import express from "express";
import { errorHandler } from "../shared/errorHandler";
import { Semaphore } from "../shared/limiter";
import { listen } from "../shared/listen";
import { logger } from "../shared/logger";
import { meter } from "../shared/metrics";
import { SpanKind } from "@opentelemetry/api";
import { jitter, sleep, withSpan } from "../shared/trace";

const app = express();
app.use(express.json());

const PROVIDER_CONCURRENCY = Number(process.env.PAYMENT_CONCURRENCY ?? 10);
const provider = new Semaphore(PROVIDER_CONCURRENCY);
const DECLINE_RATE = 0.03;

meter
  .createObservableGauge("payments.provider.in_flight", { unit: "{call}", description: "Calls to the payment provider right now" })
  .addCallback((r) => r.observe(provider.active));
meter
  .createObservableGauge("payments.provider.queued", { unit: "{call}", description: "Charges waiting for a free provider slot" })
  .addCallback((r) => r.observe(provider.waiting));
meter
  .createObservableGauge("payments.provider.max_in_flight", { unit: "{call}", description: "Provider concurrency limit" })
  .addCallback((r) => r.observe(PROVIDER_CONCURRENCY));
const queueWait = meter.createHistogram("payments.queue.wait.duration", { unit: "s", description: "Time a charge waited for a provider slot" });
const providerLatency = meter.createHistogram("payments.provider.duration", { unit: "s", description: "Round trip to the payment provider" });
const charges = meter.createCounter("shop.payments.charges", { unit: "{charge}", description: "Charges by outcome" });
const chargedCents = meter.createCounter("shop.payments.charged", { unit: "cents", description: "Money successfully charged" });

app.post("/charge", async (req, res) => {
  const { orderRef, amountCents } = req.body as { orderRef: string; amountCents: number };

  const waitedMs = await withSpan("payments.queue (waiting for provider slot)", { "payments.max_in_flight": PROVIDER_CONCURRENCY }, () =>
    provider.acquire(),
  );
  queueWait.record(waitedMs / 1000);

  try {
    const declined = await withSpan(
      "payment-provider.charge",
      { "peer.service": "payment-provider", "payment.amount_cents": amountCents },
      async () => {
        const started = performance.now();
        await sleep(jitter(250));
        providerLatency.record((performance.now() - started) / 1000);
        return Math.random() < DECLINE_RATE;
      },
      SpanKind.CLIENT,
    );
    if (declined) {
      charges.add(1, { outcome: "declined" });
      logger.warn({ orderRef, amountCents }, "card declined");
      res.status(402).json({ error: "card_declined" });
      return;
    }
    charges.add(1, { outcome: "approved" });
    chargedCents.add(amountCents);
    res.status(201).json({ orderRef, status: "approved" });
  } finally {
    provider.release();
  }
});

app.use(errorHandler);

listen(app, "payments");

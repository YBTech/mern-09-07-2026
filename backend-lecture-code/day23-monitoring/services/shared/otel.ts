// OpenTelemetry setup. Loaded BEFORE the service's own code (see `--import` in package.json),
// so it can wrap Express, fetch, etc. before they're used. This file is the whole setup:
// no service contains any tracing or metrics code of its own, beyond the custom spans and
// business metrics it chooses to add.
//
// Where to send data, and the service's name, come from environment variables (otel.env and
// OTEL_SERVICE_NAME in package.json).
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { AggregationType, InstrumentType } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { registerProcessMetrics } from "./processMetrics"; // process CPU / memory (see that file)

const sdk = new NodeSDK({
  // Automatic spans + metrics for Express, HTTP, fetch, pino logs, and the Node runtime
  // (event loop delay, heap) plus process CPU / memory.
  instrumentations: [
    getNodeAutoInstrumentations({
      // Express creates one span per middleware ("middleware - jsonParser", "request handler - /orders"…).
      // They're noise in a trace waterfall; the HTTP span and our own spans say everything useful.
      "@opentelemetry/instrumentation-express": { ignoreLayersType: ["middleware", "request_handler"] as never },
    }),
  ],

  // Record every histogram (e.g. request duration) with automatically sized buckets, so the
  // p95 / p99 on the dashboard are accurate. The default fixed buckets jump from 250ms
  // straight to 500ms and badly guess anything in between.
  views: [{ instrumentType: InstrumentType.HISTOGRAM, aggregation: { type: AggregationType.EXPONENTIAL_HISTOGRAM } }],
});

sdk.start();
registerProcessMetrics();

// One OpenTelemetry meter per service. Anything created from it (counters, histograms, gauges)
// is exported next to the automatic HTTP / runtime metrics and lands in Prometheus.
import { metrics } from "@opentelemetry/api";

export const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME ?? "app");

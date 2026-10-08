// One structured (JSON) logger for every service.
//
// You never pass a trace ID here: OpenTelemetry's pino instrumentation adds trace_id / span_id
// to every log line automatically and ships the line to Loki. That's what lets Grafana jump from
// a trace in Tempo straight to its logs.
//
// The terminal only shows warnings and errors (set LOG_STDOUT_LEVEL=info to see everything), so
// a load test doesn't scroll thousands of lines past. Loki still receives every line.
import pino from "pino";

const stdoutLevel = process.env.LOG_STDOUT_LEVEL ?? "warn";

export const logger = pino(
  { base: { service: process.env.OTEL_SERVICE_NAME }, level: "info" },
  pino.multistream([{ level: stdoutLevel as pino.Level, stream: process.stdout }]),
);

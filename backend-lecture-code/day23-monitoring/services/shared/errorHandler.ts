// The last middleware in every service: turns an uncaught error into a 500,
// and makes sure the error is visible in ALL THREE monitoring signals:
//   - the trace:   the exception is attached to the current span (Tempo shows it in red)
//   - the logs:    one structured error line, with the trace_id added automatically (Loki)
//   - the metrics: a counter by error type, so a dashboard can chart "what kind of errors?"
import { SpanStatusCode, trace } from "@opentelemetry/api";
import type { ErrorRequestHandler } from "express";
import { logger } from "./logger";
import { meter } from "./metrics";

const unhandledErrors = meter.createCounter("app.errors.unhandled", { unit: "{error}", description: "Uncaught exceptions, by type" });

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const span = trace.getActiveSpan();
  span?.recordException(err);
  span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });

  unhandledErrors.add(1, { "error.type": err.name ?? "Error", "http.route": req.route?.path ?? "unknown" });
  logger.error(
    { err, method: req.method, path: req.originalUrl, body: req.body },
    `Unhandled error: ${err.message}`,
  );
  res.status(500).json({ error: "Internal server error" });
};

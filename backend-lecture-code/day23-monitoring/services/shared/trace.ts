// A tiny helper for adding our own spans (a DB query, a lock wait, a call to a payment provider).
// Everything HTTP-related is traced automatically; this is only for work OpenTelemetry can't see.
import { SpanKind, SpanStatusCode, trace, type Attributes, type Span } from "@opentelemetry/api";

const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME ?? "app");

export async function withSpan<T>(
  name: string,
  attributes: Attributes,
  fn: (span: Span) => Promise<T>,
  kind: SpanKind = SpanKind.INTERNAL,
): Promise<T> {
  return tracer.startActiveSpan(name, { kind, attributes }, async (span) => {
    try {
      return await fn(span);
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      throw err;
    } finally {
      span.end();
    }
  });
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ±20% jitter, so charts look like real traffic instead of a flat line. */
export const jitter = (ms: number) => ms * (0.8 + Math.random() * 0.4);

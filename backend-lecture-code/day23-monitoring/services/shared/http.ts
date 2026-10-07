// How one service calls another. OpenTelemetry instruments fetch automatically, so every call is
// a child span, and the trace ID travels in the `traceparent` header. Nothing here does that by hand.
import { urlOf, type ServiceName } from "./ports";

export type JsonResponse<T = any> = { status: number; ok: boolean; body: T };

export async function callService<T = any>(
  service: ServiceName,
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown; timeoutMs?: number } = {},
): Promise<JsonResponse<T>> {
  const res = await fetch(`${urlOf(service)}${path}`, {
    method: options.method ?? "GET",
    headers: { "content-type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    // A call with no timeout waits forever. Under overload that turns one slow service into a
    // pile-up of stuck requests everywhere upstream of it.
    signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
  });
  return { status: res.status, ok: res.ok, body: (await res.json().catch(() => null)) as T };
}

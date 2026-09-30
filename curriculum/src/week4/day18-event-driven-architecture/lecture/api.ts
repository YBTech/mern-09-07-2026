// Everything the checkout demo says to the backend lives here, so the two
// panels stay about the UI. Backend: backend-lecture-code/day18-event-driven-architecture/rabbitmq-store
export const SERVICES = {
  orders: "http://localhost:4201",
  inventory: "http://localhost:4202",
  inventory2: "http://localhost:4212", // the optional second copy, if the lecture starts one
  notifications: "http://localhost:4203",
  loyalty: "http://localhost:4204",
} as const;

export type Mode = "sync" | "async";

export const PRODUCTS = [
  { sku: "SKU-1", name: "Keyboard", price: 49 },
  { sku: "SKU-2", name: "Mouse", price: 25 },
  { sku: "SKU-3", name: "Coffee mug", price: 12 },
] as const;

export type PlaceResult = { ok: true; orderId: string; serverMs: number } | { ok: false; error: string };

// The whole difference between the two panels is one URL:
//   sync  → Orders calls Inventory and Notifications over HTTP, and waits for both
//   async → Orders saves the order, publishes OrderPlaced to RabbitMQ, and replies
export async function placeOrder(mode: Mode, sku: string): Promise<PlaceResult> {
  const path = mode === "sync" ? "/orders/sync" : "/orders";
  try {
    const res = await fetch(`${SERVICES.orders}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: "alice@shop.com", items: [{ sku, qty: 1 }] }),
      signal: AbortSignal.timeout(20_000),
    });
    const body = await res.json().catch(() => ({}));
    // The server words it "checkout failed: ECONNREFUSED"; the panel adds its own prefix.
    if (!res.ok) return { ok: false, error: String(body.error ?? `HTTP ${res.status}`).replace(/^checkout failed: /, "") };
    return { ok: true, orderId: body.order.id, serverMs: body.tookMs };
  } catch {
    return { ok: false, error: `can't reach the Orders service at ${SERVICES.orders}` };
  }
}

// ── What happened downstream of an order ────────────────────────────────────
// Each service remembers which orders it has handled. Polling these is how the
// async panel watches the rest of the work finish AFTER the customer got a reply.
export type Step = "inventory" | "email" | "loyalty";
export type Downstream = Record<Step, string[] | null>; // null = that service didn't answer

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function fetchDownstream(): Promise<Downstream> {
  const [inv1, inv2, emails, loyalty] = await Promise.all([
    getJson<string[]>(`${SERVICES.inventory}/inventory/reservations`),
    getJson<string[]>(`${SERVICES.inventory2}/inventory/reservations`),
    getJson<{ orderId: string }[]>(`${SERVICES.notifications}/notifications`),
    getJson<string[]>(`${SERVICES.loyalty}/loyalty/orders`),
  ]);
  return {
    // Two copies of Inventory share one queue, so an order may land on either.
    inventory: inv1 === null && inv2 === null ? null : [...(inv1 ?? []), ...(inv2 ?? [])],
    email: emails ? emails.map((e) => e.orderId) : null,
    loyalty,
  };
}

// ── Which services are up, and how slow is the email provider ───────────────
export type Status = {
  orders: boolean;
  inventory: boolean;
  notifications: boolean;
  loyalty: boolean;
  slowMs: number;
  stock: Record<string, number> | null;
};

export async function fetchStatus(): Promise<Status> {
  const [orders, inventory, notifications, loyalty, stock] = await Promise.all([
    getJson<unknown>(`${SERVICES.orders}/health`),
    getJson<unknown>(`${SERVICES.inventory}/health`),
    getJson<{ slowMs?: number }>(`${SERVICES.notifications}/health`),
    getJson<unknown>(`${SERVICES.loyalty}/health`),
    getJson<Record<string, number>>(`${SERVICES.inventory}/inventory`),
  ]);
  return {
    orders: orders !== null,
    inventory: inventory !== null,
    notifications: notifications !== null,
    loyalty: loyalty !== null,
    slowMs: notifications?.slowMs ?? 0,
    stock,
  };
}

// Makes every confirmation email take `ms` to send: a slow email provider.
export async function setEmailDelay(ms: number) {
  await fetch(`${SERVICES.notifications}/debug/slow`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ms }),
  });
}

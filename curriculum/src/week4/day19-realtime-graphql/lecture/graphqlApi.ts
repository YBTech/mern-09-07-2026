// Everything the GraphQL demo page says to the backend.
// Backend: backend-lecture-code/day19-realtime-graphql/graphql-store (npm run dev:all)
//
// Every loader records each request it makes (when it started, how long it
// took, how big it was), so the page can draw the network waterfall and show
// the cost of each approach.
export const URLS = {
  aggregator: "http://localhost:4500",
  users: "http://localhost:4501",
  orders: "http://localhost:4502",
  catalog: "http://localhost:4503",
  shipping: "http://localhost:4504",
  reviews: "http://localhost:4505",
} as const;

const CUSTOMER = "c-1";

// ── Measuring ───────────────────────────────────────────────────────────────
export type Call = {
  service: string;
  method: string;
  path: string;
  start: number; // ms after the load began
  ms: number; // how long this request took
  bytes: number;
};
export type Measured<T> = { data: T; calls: Call[]; bytes: number };
export type OnCall = (call: Call) => void;

function tracker(onCall?: OnCall) {
  const calls: Call[] = [];
  const t0 = performance.now();

  async function request<T>(service: string, url: string, init?: RequestInit): Promise<T> {
    const started = performance.now();
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
    const text = await res.text();
    const call: Call = {
      service,
      method: init?.method ?? "GET",
      path: url.replace(/^https?:\/\/[^/]+/, ""),
      start: started - t0,
      ms: performance.now() - started,
      bytes: text.length,
    };
    calls.push(call);
    onCall?.(call);
    if (!res.ok) throw new Error(`${service} answered ${res.status}`);
    return JSON.parse(text) as T;
  }

  return {
    get: <T>(service: string, url: string) => request<T>(service, url),
    graphql: async <T>(service: string, url: string, query: string, variables: object = {}) => {
      const body = await request<{ data: T; errors?: { message: string }[] }>(service, url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      if (body.errors?.length) throw new Error(body.errors[0].message);
      return body.data;
    },
    done: <T>(data: T): Measured<T> => ({ data, calls, bytes: calls.reduce((sum, c) => sum + c.bytes, 0) }),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Part 1 — the "My Account" page, loaded three ways
// ════════════════════════════════════════════════════════════════════════════
export type Mode = "direct" | "rest" | "graphql";
export type Client = "web" | "mobile";

// All three loaders return this shape, so the page renders the same UI no
// matter how the data was fetched. Optional fields are the ones the mobile
// GraphQL query doesn't ask for.
export type AccountView = {
  name: string;
  email?: string;
  tier?: string;
  orders: {
    id: string;
    total?: number;
    status: string;
    eta?: string | null;
    items: { name: string; price?: number; qty?: number }[];
  }[];
  reviews: { title: string; rating?: number }[];
};

type User = { name: string; email: string; tier: string };
// Orders returns each order with its items, and each item carries a snapshot
// of the product (name, price paid) from checkout: no Catalog call needed.
type Order = { id: string; total: number; items: { sku: string; name: string; qty: number; price: number }[] };
type Shipment = { orderId: string; status: string; eta: string | null };
type Review = { title: string; rating: number };

const toItems = (items: Order["items"]) => items.map((i) => ({ name: i.name, price: i.price, qty: i.qty }));

// 1. The browser calls the services itself: 4 requests, in two waves.
export async function loadDirect(onCall?: OnCall): Promise<Measured<AccountView>> {
  const t = tracker(onCall);

  // Wave 1: needs only the customer id.
  const [user, orders, reviews] = await Promise.all([
    t.get<User>("users", `${URLS.users}/users/${CUSTOMER}`),
    t.get<Order[]>("orders", `${URLS.orders}/orders?customerId=${CUSTOMER}&limit=4`),
    t.get<Review[]>("reviews", `${URLS.reviews}/reviews?authorId=${CUSTOMER}`),
  ]);

  // Wave 2: needs the order ids wave 1 returned, so it has to wait.
  const shipments = await t.get<Shipment[]>("shipping", `${URLS.shipping}/shipments?orderIds=${orders.map((o) => o.id).join(",")}`);

  // Stitching it together: every client (web, iOS, Android) writes this part too.
  return t.done({
    name: user.name,
    email: user.email,
    tier: user.tier,
    orders: orders.map((o, i) => ({ id: o.id, total: o.total, status: shipments[i].status, eta: shipments[i].eta, items: toItems(o.items) })),
    reviews: reviews.map((r) => ({ title: r.title, rating: r.rating })),
  });
}

// 2. REST aggregator: one request, one fixed response shape for every client.
export async function loadRestAggregator(onCall?: OnCall): Promise<Measured<AccountView>> {
  const t = tracker(onCall);
  const dash = await t.get<{ customer: User; orders: (Order & { shipment: Shipment })[]; reviews: Review[] }>(
    "aggregator",
    `${URLS.aggregator}/dashboard/${CUSTOMER}`,
  );

  return t.done({
    name: dash.customer.name,
    email: dash.customer.email,
    tier: dash.customer.tier,
    orders: dash.orders.map((o) => ({ id: o.id, total: o.total, status: o.shipment.status, eta: o.shipment.eta, items: toItems(o.items) })),
    reviews: dash.reviews.map((r) => ({ title: r.title, rating: r.rating })),
  });
}

// 3. GraphQL aggregator: one request, and the query picks the fields.
export const ACCOUNT_QUERIES: Record<Client, string> = {
  web: `query MyAccount($id: ID!) {
  customer(id: $id) {
    name
    email
    tier
    orders(limit: 4) {
      id
      total
      shipment { status eta }
      items { name price qty }
    }
    reviews { rating title }
  }
}`,
  mobile: `query MyAccountMobile($id: ID!) {
  customer(id: $id) {
    name
    orders(limit: 4) {
      id
      shipment { status }
      items { name }
    }
    reviews { title }
  }
}`,
};

type GqlAccount = {
  customer: {
    name: string;
    email?: string;
    tier?: string;
    orders: { id: string; total?: number; shipment: { status: string; eta?: string | null }; items: { name: string; price?: number; qty?: number }[] }[];
    reviews: { title: string; rating?: number }[];
  };
};

export async function loadGraphql(client: Client, onCall?: OnCall): Promise<Measured<AccountView>> {
  const t = tracker(onCall);
  const { customer } = await t.graphql<GqlAccount>("aggregator", `${URLS.aggregator}/graphql`, ACCOUNT_QUERIES[client], { id: CUSTOMER });

  return t.done({
    name: customer.name,
    email: customer.email,
    tier: customer.tier,
    orders: customer.orders.map((o) => ({ id: o.id, total: o.total, status: o.shipment.status, eta: o.shipment.eta, items: o.items })),
    reviews: customer.reviews,
  });
}

export function loadAccount(mode: Mode, client: Client, onCall?: OnCall) {
  if (mode === "direct") return loadDirect(onCall);
  if (mode === "rest") return loadRestAggregator(onCall);
  return loadGraphql(client, onCall);
}

// ── The simulated network ───────────────────────────────────────────────────
// Every service holds a browser's request for this long before answering,
// standing in for the trip across the internet (server-to-server calls skip it).
export const NETWORKS = { wifi: 20, cellular: 150 } as const;
export type Network = keyof typeof NETWORKS;

export async function setNetwork(network: Network) {
  await Promise.all(
    Object.values(URLS).map((base) =>
      fetch(`${base}/debug/latency`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ms: NETWORKS[network] }),
      }),
    ),
  );
}

export async function aggregatorUp(): Promise<boolean> {
  try {
    return (await fetch(`${URLS.aggregator}/health`, { signal: AbortSignal.timeout(3000) })).ok;
  } catch {
    return false;
  }
}

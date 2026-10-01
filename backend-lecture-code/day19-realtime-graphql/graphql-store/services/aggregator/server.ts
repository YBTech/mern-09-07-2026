// The aggregation layer (a BFF: "backend for frontend"). The only place in this
// store that speaks GraphQL — every service behind it is plain REST.
//
// The browser makes ONE request here; this server makes the requests to the
// services, next to them, so each hop is ~1 ms instead of a trip across the
// internet.
//
//   GET  /dashboard/:customerId   version 1: a REST aggregation endpoint
//   POST /graphql                 version 2: a GraphQL aggregation layer
//                                 (open http://localhost:4500/graphql for Apollo Sandbox)
//
// Every call it makes to a service is printed, so you can watch the fan-out.
// Lookups are batched with DataLoader by default.
//   USE_DATALOADER=false npm run aggregator   turn batching off to see the N+1
//   MAX_DEPTH=6 (default)                      reject queries nested deeper than this
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import DataLoader from "dataloader";
import express from "express";
import { GraphQLError } from "graphql";
import depthLimit from "graphql-depth-limit";
import { allowBrowser, edgeLatency, getJson, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4500);
const USE_DATALOADER = process.env.USE_DATALOADER !== "false";
const MAX_DEPTH = Number(process.env.MAX_DEPTH ?? 6);
const URL = {
  users: process.env.USERS_URL ?? "http://localhost:4501",
  orders: process.env.ORDERS_URL ?? "http://localhost:4502",
  catalog: process.env.CATALOG_URL ?? "http://localhost:4503",
  shipping: process.env.SHIPPING_URL ?? "http://localhost:4504",
  reviews: process.env.REVIEWS_URL ?? "http://localhost:4505",
};

type User = { id: string; [field: string]: unknown };
type Product = { sku: string; [field: string]: unknown };
// Line items carry a snapshot of the product from checkout (name, price paid).
type OrderItem = { sku: string; name: string; thumbnail: string; price: number; qty: number };
type Order = { id: string; placedAt: string; total: number; items: OrderItem[] };
type Shipment = { orderId: string; status: string; carrier: string | null; trackingNumber: string | null; eta: string | null };
type Review = { id: string; productSku: string; authorId: string; rating: number; title: string; body: string };

// ════════════════════════════════════════════════════════════════════════════
// Version 1: REST aggregation. One endpoint, one fixed response shape.
// ════════════════════════════════════════════════════════════════════════════
async function restDashboard(customerId: string) {
  // Wave 1: everything that only needs the customer id, in parallel.
  const [customer, orders, reviews] = await Promise.all([
    getJson<User>("users", `${URL.users}/users/${customerId}`),
    getJson<Order[]>("orders", `${URL.orders}/orders?customerId=${customerId}&limit=4`), // items included
    getJson<Review[]>("reviews", `${URL.reviews}/reviews?authorId=${customerId}`),
  ]);

  // Wave 2: needs the order ids from wave 1. One batched call, not one per order.
  const shipments = await getJson<Shipment[]>("shipping", `${URL.shipping}/shipments?orderIds=${orders.map((o) => o.id).join(",")}`);

  // One fixed shape for every client: whole objects, every field each service
  // returned, whether the screen shows them or not. The mobile app gets all of
  // it too: that's the over-fetching.
  return {
    customer,
    orders: orders.map((o, i) => ({ ...o, shipment: shipments[i] })),
    reviews,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Version 2: GraphQL aggregation. The client says which fields it wants.
// ════════════════════════════════════════════════════════════════════════════
const typeDefs = /* GraphQL */ `
  type Query {
    customer(id: ID!): Customer
    order(id: ID!): Order
    product(sku: ID!): Product
  }

  type Mutation {
    placeOrder(customerId: ID!, items: [OrderItemInput!]!): Order!
  }

  input OrderItemInput {
    sku: ID!
    qty: Int!
  }

  type Customer {
    id: ID!
    name: String!
    email: String!
    tier: String!
    memberSince: String!
    address: Address!
    orders(limit: Int = 4): [Order!]!
    reviews: [Review!]!
  }

  type Address {
    line1: String!
    city: String!
    region: String!
    postalCode: String!
    country: String!
  }

  type Order {
    id: ID!
    placedAt: String!
    total: Float!
    items: [OrderItem!]!
    shipment: Shipment!
  }

  type OrderItem {
    sku: ID!
    "The product's name when it was ordered (a snapshot stored by Orders)."
    name: String!
    thumbnail: String!
    "The price the customer paid."
    price: Float!
    qty: Int!
    "The product as it is NOW, from Catalog: current price, rating…"
    product: Product!
  }

  type Shipment {
    status: String!
    carrier: String
    trackingNumber: String
    eta: String
  }

  type Product {
    sku: ID!
    name: String!
    brand: String!
    price: Float!
    compareAtPrice: Float
    currency: String!
    category: String!
    thumbnail: String!
    images: [String!]!
    description: String!
    rating: Float!
    ratingCount: Int!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    rating: Int!
    title: String!
    body: String!
    product: Product!
    author: Customer!
  }
`;

// Per-request loaders: every key asked for while resolving ONE query is
// fetched in a single batched call, instead of one call per key.
type Context = {
  productLoader: DataLoader<string, Product>;
  shipmentLoader: DataLoader<string, Shipment>;
  userLoader: DataLoader<string, User>;
  reviewsBySkuLoader: DataLoader<string, Review[]>;
};

const byKey = <T>(rows: T[], keys: readonly string[], key: (row: T) => string) => {
  const map = new Map(rows.map((r) => [key(r), r]));
  return keys.map((k) => map.get(k) ?? new Error(`${k} not found`));
};

const createContext = async (): Promise<Context> => ({
  productLoader: new DataLoader(async (skus) =>
    byKey(await getJson<Product[]>("catalog", `${URL.catalog}/products?ids=${skus.join(",")}`), skus, (p) => p.sku),
  ),
  shipmentLoader: new DataLoader(async (ids) =>
    byKey(await getJson<Shipment[]>("shipping", `${URL.shipping}/shipments?orderIds=${ids.join(",")}`), ids, (s) => s.orderId),
  ),
  userLoader: new DataLoader(async (ids) => byKey(await getJson<User[]>("users", `${URL.users}/users?ids=${ids.join(",")}`), ids, (u) => u.id)),
  reviewsBySkuLoader: new DataLoader(async (skus) => {
    const reviews = await getJson<Review[]>("reviews", `${URL.reviews}/reviews?skus=${skus.join(",")}`);
    return skus.map((sku) => reviews.filter((r) => r.productSku === sku));
  }),
});

// With batching off, each lookup is its own HTTP call: the N+1 problem.
const load = {
  product: (sku: string, ctx: Context) =>
    USE_DATALOADER ? ctx.productLoader.load(sku) : getJson<Product>("catalog", `${URL.catalog}/products/${sku}`),
  shipment: (orderId: string, ctx: Context) =>
    USE_DATALOADER ? ctx.shipmentLoader.load(orderId) : getJson<Shipment>("shipping", `${URL.shipping}/shipments/${orderId}`),
  user: (id: string, ctx: Context) => (USE_DATALOADER ? ctx.userLoader.load(id) : getJson<User>("users", `${URL.users}/users/${id}`)),
  reviewsForProduct: (sku: string, ctx: Context) =>
    USE_DATALOADER ? ctx.reviewsBySkuLoader.load(sku) : getJson<Review[]>("reviews", `${URL.reviews}/reviews?skus=${sku}`),
};

// Each resolver fetches only its own field, and only if the query asked for it.
const resolvers = {
  Query: {
    customer: (_: unknown, { id }: { id: string }, ctx: Context) => load.user(id, ctx),
    order: async (_: unknown, { id }: { id: string }) => {
      try {
        return await getJson<Order>("orders", `${URL.orders}/orders/${id}`);
      } catch {
        // Not an HTTP 404: the response is still 200, with this in "errors".
        throw new GraphQLError(`order ${id} not found`, { extensions: { code: "NOT_FOUND" } });
      }
    },
    product: (_: unknown, { sku }: { sku: string }, ctx: Context) => load.product(sku, ctx),
  },
  Mutation: {
    placeOrder: async (_: unknown, args: { customerId: string; items: { sku: string; qty: number }[] }, ctx: Context) => {
      // Snapshot the product's current name and price into the order.
      const priced = await Promise.all(
        args.items.map(async (item) => {
          const product = await load.product(item.sku, ctx);
          return { ...item, name: product.name, thumbnail: product.thumbnail, price: Number(product.price) };
        }),
      );
      const res = await fetch(`${URL.orders}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerId: args.customerId, items: priced }),
      });
      if (!res.ok) throw new GraphQLError(((await res.json()) as { error?: string }).error ?? "could not place order");
      return res.json();
    },
  },
  Customer: {
    orders: (customer: User, { limit }: { limit: number }) =>
      getJson<Order[]>("orders", `${URL.orders}/orders?customerId=${customer.id}&limit=${limit}`),
    reviews: (customer: User) => getJson<Review[]>("reviews", `${URL.reviews}/reviews?authorId=${customer.id}`),
  },
  Order: {
    // Runs once per order. Without DataLoader that's one Shipping call each: N+1.
    shipment: (order: Order, _: unknown, ctx: Context) => load.shipment(order.id, ctx),
  },
  OrderItem: {
    // name, price, qty come straight from the order's snapshot (no resolver needed).
    // Only a query asking for the LIVE product reaches Catalog: once per item, unless batched.
    product: (item: OrderItem, _: unknown, ctx: Context) => load.product(item.sku, ctx),
  },
  Product: {
    reviews: (product: Product, _: unknown, ctx: Context) => load.reviewsForProduct(product.sku, ctx),
  },
  Review: {
    product: (review: Review, _: unknown, ctx: Context) => load.product(review.productSku, ctx),
    author: (review: Review, _: unknown, ctx: Context) => load.user(review.authorId, ctx),
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  // The schema loops (customer → reviews → product → reviews → author → …), so
  // without a limit one query could nest until the server falls over. This
  // rejects deeper queries BEFORE any resolver runs.
  validationRules: [depthLimit(MAX_DEPTH)],
  // No stack traces in error responses: students should see the error a client sees.
  includeStacktraceInErrorResponses: false,
});
await server.start();

const app = express();
app.use(allowBrowser, edgeLatency);
latencyControl(app);

// A divider in the log per incoming request, so each one's fan-out reads as a group.
app.use((req, _res, next) => {
  if (req.method !== "OPTIONS" && req.path !== "/health" && !req.path.startsWith("/debug")) console.log(`\n← ${req.method} ${req.path}`);
  next();
});

app.get("/dashboard/:customerId", async (req, res) => {
  try {
    res.json(await restDashboard(req.params.customerId));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

app.use("/graphql", express.json(), expressMiddleware(server, { context: createContext }));

app.get("/health", (_req, res) => {
  res.json({ service: "aggregator", status: "ok", useDataloader: USE_DATALOADER, maxDepth: MAX_DEPTH });
});

app.listen(PORT, () =>
  console.log(
    `aggregator on http://localhost:${PORT} — REST /dashboard/:id and GraphQL /graphql — DataLoader ${USE_DATALOADER ? "ON" : "OFF"}, max depth ${MAX_DEPTH}`,
  ),
);

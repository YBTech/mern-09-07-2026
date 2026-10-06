// The frontend's only connection to the backend. Same origin: in production Express serves
// this app AND these routes; in development Vite forwards them (see vite.config.ts).

export type Product = { id: string; name: string; priceCents: number };
export type OrderLine = { productId: string; quantity: number };
export type Order = {
  id: number;
  createdAt: string;
  items: { productId: string; name: string; quantity: number }[];
  totalCents: number;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/products");
  if (!res.ok) throw new Error(`GET /products failed: ${res.status}`);
  return res.json();
}

// Every order placed so far, newest first.
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/orders");
  if (!res.ok) throw new Error(`GET /orders failed: ${res.status}`);
  return res.json();
}

export async function placeOrder(items: OrderLine[]): Promise<Order> {
  const res = await fetch("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(`POST /orders failed: ${res.status}`);
  return res.json();
}

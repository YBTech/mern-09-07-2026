// Every network call the frontend makes lives in this file, so component tests mock this one module.
// Calls go to /api/..., which Vite proxies to the gateway.

export type Product = { id: number; name: string; price: number; stock: number };
export type PlacedOrder = { id: number; total: number; status: string };

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error(`products request failed: ${res.status}`);
  return res.json();
}

export async function placeOrder(input: {
  email: string;
  items: { productId: number; qty: number }[];
}): Promise<PlacedOrder> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "could not place order");
  return body;
}

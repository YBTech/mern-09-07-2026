import { callService } from "../shared/http";

// How Orders talks to Catalog over HTTP. The call shows up as a child span in the trace, and the
// trace ID travels to Catalog in the `traceparent` header (see shared/http.ts).

// Orders' own idea of what a Catalog product looks like.
export type CatalogProduct = {
  id: string;
  name: string;
  priceCents: number;
  bulkDiscount: { minQuantity: number; percent: number };
};

export async function getProduct(id: string): Promise<CatalogProduct | undefined> {
  const res = await callService<CatalogProduct>("catalog", `/products/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Catalog responded ${res.status} for product ${id}`);
  return res.body;
}

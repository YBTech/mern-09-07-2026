import type { CatalogProduct } from "./catalogClient";

export const BULK_QUANTITY = 5;

// Bulk orders (5 or more of one product) get that product's bulk discount.
export function lineTotalCents(product: CatalogProduct, quantity: number): number {
  const fullPrice = product.priceCents * quantity;
  
  if (quantity >= BULK_QUANTITY) {
    return Math.round(fullPrice * (1 - product.bulkDiscount.percent / 100));
  }
  return fullPrice;
}
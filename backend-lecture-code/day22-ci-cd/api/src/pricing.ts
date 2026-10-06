// Pure pricing logic: no Express, no I/O, so it's the easiest thing to unit test.
// Money is in cents (integers) to avoid floating-point rounding errors.

export type LineItem = { priceCents: number; quantity: number };

export function subtotalCents(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

export function applyDiscount(amountCents: number, code?: string): number {
  if (code === "SAVE10") return Math.round(amountCents * 0.9);
  return amountCents;
}

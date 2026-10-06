// Pure helpers: no React, so they get plain unit tests.

export type CartItem = { id: string; name: string; priceCents: number; quantity: number };

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function cartTotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

// Pure functions: same input, same output, no network, no clock.
// The easiest code in the whole project to test, which is why the logic
// lives here and not inside the route handler.

export type LineItem = { price: number; qty: number };

export function calculateOrderTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

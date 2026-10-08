// In-memory rows standing in for the `orders` and `order_items` tables.

export type Order = { id: number; customer: string; createdAt: string };
export type OrderItem = { orderId: number; productId: string; quantity: number };

export const orders: Order[] = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  customer: `customer${(i % 37) + 1}@example.com`,
  createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
}));

export const orderItems: OrderItem[] = orders.flatMap((order) => [
  { orderId: order.id, productId: "p1", quantity: 1 },
  { orderId: order.id, productId: `p${(order.id % 6) + 1}`, quantity: (order.id % 3) + 1 },
]);

let nextOrderId = orders.length + 1;
export function takeNextOrderId() {
  return nextOrderId++;
}

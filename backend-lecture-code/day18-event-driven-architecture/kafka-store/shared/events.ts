// The contract between services: the same OrderPlaced as the RabbitMQ store,
// plus two follow-up events for the same order. All three go to ONE topic,
// keyed by orderId, so every event for an order stays in order.

export const ORDERS_TOPIC = "orders";

export type OrderItem = { sku: string; qty: number; price: number };

type Base = { eventId: string; orderId: string; occurredAt: string };

export type OrderPlaced = Base & { type: "OrderPlaced"; customer: string; items: OrderItem[]; total: number };
export type OrderPaid = Base & { type: "OrderPaid"; amount: number };
export type OrderShipped = Base & { type: "OrderShipped" };

export type OrderEvent = OrderPlaced | OrderPaid | OrderShipped;

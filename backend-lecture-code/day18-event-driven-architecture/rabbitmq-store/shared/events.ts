// The contract between services. Orders publishes this shape and every
// subscriber reads it, so changing a field is a breaking change for teams
// you may never talk to. (Real systems put this in a schema registry or a
// shared package; one file is enough for the lecture.)

export const ORDERS_EXCHANGE = "orders"; // fanout: every bound queue gets a copy
export const DEAD_LETTER_EXCHANGE = "orders.dlx";
export const DEAD_LETTER_QUEUE = "orders.dlq";

export type OrderItem = { sku: string; qty: number; price: number };

// Named as a past-tense FACT, not a command like "SendEmail": Orders is
// announcing what happened, not telling anyone what to do about it.
export type OrderPlaced = {
  type: "OrderPlaced";
  eventId: string; // unique per event: what a consumer dedupes on
  orderId: string;
  customer: string;
  items: OrderItem[];
  total: number;
  occurredAt: string;
};

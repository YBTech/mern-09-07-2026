import { randomUUID } from "node:crypto";
import type { Order } from "../models/types";

let orders = new Map<string, Order>();

export const ordersRepository = {
  findById(id: string): Order | undefined {
    return orders.get(id);
  },
  create(data: Omit<Order, "id" | "createdAt">): Order {
    const order: Order = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
    orders.set(order.id, order);
    return order;
  },
  save(order: Order): Order {
    orders.set(order.id, order);
    return order;
  },
  reset(): void {
    orders = new Map();
  },
};

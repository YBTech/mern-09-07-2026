import { ConflictError, NotFoundError } from "../errors";
import type { NewOrderInput, Order } from "../models/types";
import { booksRepository } from "../repositories/books.repository";
import { ordersRepository } from "../repositories/orders.repository";
import { calculateTotals } from "./pricing.service";

export function createOrder(input: NewOrderInput): Order {
  const lines = input.items.map(({ bookId, quantity }) => {
    const book = booksRepository.findById(bookId);
    if (!book) throw new NotFoundError(`Book ${bookId} not found`);
    if (book.stock < quantity) throw new ConflictError(`Not enough stock for "${book.title}"`);
    return { book, quantity };
  });

  const items = lines.map(({ book, quantity }) => ({
    bookId: book.id,
    quantity,
    unitPriceCents: book.priceCents,
  }));
  const totals = calculateTotals(items, input.couponCode);

  for (const { book, quantity } of lines) {
    booksRepository.save({ ...book, stock: book.stock - quantity });
  }

  return ordersRepository.create({
    customerEmail: input.customerEmail,
    items,
    couponCode: input.couponCode,
    ...totals,
    status: "placed",
  });
}

export function getOrder(id: string): Order {
  const order = ordersRepository.findById(id);
  if (!order) throw new NotFoundError(`Order ${id} not found`);
  return order;
}

export function cancelOrder(id: string): Order {
  const order = getOrder(id);
  if (order.status !== "placed") throw new ConflictError(`Order ${id} is already cancelled`);

  for (const { bookId, quantity } of order.items) {
    const book = booksRepository.findById(bookId);
    if (book) booksRepository.save({ ...book, stock: book.stock + quantity });
  }

  return ordersRepository.save({
    ...order,
    status: "cancelled",
  });
}

import { booksRepository } from "../repositories/books.repository";
import { ordersRepository } from "../repositories/orders.repository";
import { seedBooks } from "./seed";

/** Puts the in-memory store back to the seed data (used at startup and between tests). */
export function resetData(): void {
  booksRepository.reset(seedBooks);
  ordersRepository.reset();
}

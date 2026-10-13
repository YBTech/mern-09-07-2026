import { randomUUID } from "node:crypto";
import type { Book, NewBook } from "../models/types";

let books = new Map<string, Book>();

export const booksRepository = {
  findAll(): Book[] {
    return [...books.values()];
  },
  findById(id: string): Book | undefined {
    return books.get(id);
  },
  create(data: NewBook): Book {
    const book: Book = { id: randomUUID(), ...data };
    books.set(book.id, book);
    return book;
  },
  save(book: Book): Book {
    books.set(book.id, book);
    return book;
  },
  remove(id: string): boolean {
    return books.delete(id);
  },
  reset(seed: Book[]): void {
    books = new Map(seed.map((b) => [b.id, { ...b }]));
  },
};

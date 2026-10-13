import { NotFoundError } from "../errors";
import type { Book, NewBook } from "../models/types";
import { booksRepository } from "../repositories/books.repository";

export interface BookFilters {
  search?: string;
  genre?: string;
}

export function listBooks(filters: BookFilters = {}): Book[] {
  const search = filters.search?.trim().toLowerCase();
  return booksRepository.findAll().filter((book) => {
    if (filters.genre && book.genre !== filters.genre) return false;
    if (search && !`${book.title} ${book.author}`.toLowerCase().includes(search)) return false;
    return true;
  });
}

export function getBook(id: string): Book {
  const book = booksRepository.findById(id);
  if (!book) throw new NotFoundError(`Book ${id} not found`);
  return book;
}

export function createBook(input: NewBook): Book {
  return booksRepository.create(input);
}

export function deleteBook(id: string): void {
  if (!booksRepository.remove(id)) throw new NotFoundError(`Book ${id} not found`);
}

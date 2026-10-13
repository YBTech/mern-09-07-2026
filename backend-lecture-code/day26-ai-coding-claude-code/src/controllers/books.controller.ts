import type { Request, Response } from "express";
import * as booksService from "../services/books.service";
import { parseNewBook } from "../validation";

export function list(req: Request, res: Response) {
  const { search, genre } = req.query;
  res.json(
    booksService.listBooks({
      search: typeof search === "string" ? search : undefined,
      genre: typeof genre === "string" ? genre : undefined,
    }),
  );
}

export function get(req: Request<{ id: string }>, res: Response) {
  res.json(booksService.getBook(req.params.id));
}

export function create(req: Request, res: Response) {
  res.status(201).json(booksService.createBook(parseNewBook(req.body)));
}

export function remove(req: Request<{ id: string }>, res: Response) {
  booksService.deleteBook(req.params.id);
  res.status(204).end();
}

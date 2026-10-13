import { Router } from "express";
import * as books from "../controllers/books.controller";
import { requireAdmin } from "../middleware/require-admin";

export const booksRouter = Router();

booksRouter.get("/", books.list);
booksRouter.get("/:id", books.get);
booksRouter.post("/", requireAdmin, books.create);
booksRouter.delete("/:id", books.remove);

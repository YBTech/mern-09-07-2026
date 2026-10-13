import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";
import { booksRouter } from "./routes/books.routes";
import { ordersRouter } from "./routes/orders.routes";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/books", booksRouter);
  app.use("/orders", ordersRouter);

  app.use(errorHandler);
  return app;
}

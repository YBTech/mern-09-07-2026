import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "8mb" })); // receipt photos arrive as data URLs
  app.use("/api", apiRouter);
  app.use(errorHandler);
  return app;
}

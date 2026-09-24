import type { NextFunction, Request, Response } from "express";

import { inventoryService } from "./service";
import {
  adjustQuantityBodySchema,
  createInventoryBodySchema,
  inventoryIdParamSchema,
  listInventoryQuerySchema,
  setQuantityBodySchema,
} from "./validation";

// HTTP concerns only: parse + validate the request, call the service,
// shape the response. no business logic, no db calls here. any thrown
// error (Zod, or an AppError from the service) is forwarded to next(err)
// — Express doesn't do that on its own for an async handler, so the
// try/catch here has to do it explicitly. the errorHandler middleware in
// lib/errors.ts, mounted once in server.ts, is what actually turns it
// into a response.
export const inventoryController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listInventoryQuerySchema.parse(req.query);
      const rows = await inventoryService.list(query);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = inventoryIdParamSchema.parse(req.params);
      const row = await inventoryService.getById(id);
      res.json(row);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createInventoryBodySchema.parse(req.body);
      const idempotencyKeyHeader = req.headers["idempotency-key"];
      const idempotencyKey =
        typeof idempotencyKeyHeader === "string" && idempotencyKeyHeader.trim()
          ? idempotencyKeyHeader.trim()
          : undefined;

      const { statusCode, row } = await inventoryService.create(
        body,
        idempotencyKey,
      );
      res.status(statusCode).json(row);
    } catch (err) {
      next(err);
    }
  },

  async setQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = inventoryIdParamSchema.parse(req.params);
      const { quantity } = setQuantityBodySchema.parse(req.body);
      const row = await inventoryService.setQuantity(id, quantity);
      res.json(row);
    } catch (err) {
      next(err);
    }
  },

  async adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = inventoryIdParamSchema.parse(req.params);
      const { delta } = adjustQuantityBodySchema.parse(req.body);
      const row = await inventoryService.adjust(id, delta);
      res.json(row);
    } catch (err) {
      next(err);
    }
  },
};

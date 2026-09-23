import { z } from "zod";

export const listInventoryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListInventoryQuery = z.infer<typeof listInventoryQuerySchema>;

export const inventoryIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const createInventoryBodySchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().nonnegative(),
});
export type CreateInventoryBody = z.infer<typeof createInventoryBodySchema>;

// PATCH — absolute overwrite. idempotent: replaying the same body twice
// leaves the row in the same state either time.
export const setQuantityBodySchema = z.object({
  quantity: z.number().int().nonnegative(),
});
export type SetQuantityBody = z.infer<typeof setQuantityBodySchema>;

// POST /:id/adjust — signed delta. not idempotent, which is exactly why
// this is a POST and not a PATCH (see inventory/service.ts).
export const adjustQuantityBodySchema = z.object({
  delta: z
    .number()
    .int()
    .refine((v) => v !== 0, { message: "delta must be a non-zero integer" }),
});
export type AdjustQuantityBody = z.infer<typeof adjustQuantityBodySchema>;

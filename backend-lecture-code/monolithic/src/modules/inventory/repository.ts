import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { db } from "../../db/pool";
import { idempotencyKeys, inventory, inventoryAdjustments } from "../../db/schema";
import * as schema from "../../db/schema";
import type { CreateInventoryBody, ListInventoryQuery } from "./validation";

export type InventoryRow = typeof inventory.$inferSelect;
export type IdempotencyRecord = typeof idempotencyKeys.$inferSelect;

// a repository method can run against the plain `db` client, or against a
// transaction handle (`tx`) the service opened with db.transaction() — both
// have the same query-builder shape, so the same methods work with either.
type Executor = NodePgDatabase<typeof schema>;

// data access only — no HTTP concerns, no business rules.
export const inventoryRepository = {
  async list({ limit, offset }: ListInventoryQuery): Promise<InventoryRow[]> {
    return db
      .select()
      .from(inventory)
      .orderBy(inventory.id)
      .limit(limit)
      .offset(offset);
  },

  async findById(id: number): Promise<InventoryRow | undefined> {
    const [row] = await db.select().from(inventory).where(eq(inventory.id, id));
    return row;
  },

  // locks the row for the rest of the caller's transaction. must be called
  // with a `tx` from db.transaction() — not the plain `db` client — or the
  // lock has nothing to hold it for.
  async findByIdForUpdate(
    executor: Executor,
    id: number,
  ): Promise<InventoryRow | undefined> {
    const [row] = await executor
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .for("update");
    return row;
  },

  async create(data: CreateInventoryBody): Promise<InventoryRow> {
    const [row] = await db.insert(inventory).values(data).returning();
    return row;
  },

  async setQuantity(
    executor: Executor,
    id: number,
    quantity: number,
  ): Promise<InventoryRow> {
    const [row] = await executor
      .update(inventory)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return row;
  },

  // the second write inside adjust()'s transaction — see the ATOMICITY
  // comment at its call site in service.ts.
  async logAdjustment(
    executor: Executor,
    data: {
      inventoryId: number;
      delta: number;
      previousQuantity: number;
      newQuantity: number;
    },
  ): Promise<void> {
    await executor.insert(inventoryAdjustments).values(data);
  },

  async findIdempotencyRecord(
    key: string,
  ): Promise<IdempotencyRecord | undefined> {
    const [row] = await db
      .select()
      .from(idempotencyKeys)
      .where(eq(idempotencyKeys.key, key));
    return row;
  },

  async saveIdempotencyRecord(
    key: string,
    requestBody: unknown,
    statusCode: number,
    responseBody: unknown,
  ): Promise<void> {
    await db
      .insert(idempotencyKeys)
      .values({ key, requestBody, statusCode, responseBody });
  },
};

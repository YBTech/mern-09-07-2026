// REFERENCE — fully implemented, and also: you never need to write a
// repository in this lab. Data access only — no HTTP concerns, no business
// rules, just reading and writing rows.

import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { workshops } from "../db/schema";
import type { CreateWorkshopBody, UpdateWorkshopBody } from "./validation";

export type Workshop = typeof workshops.$inferSelect;

export const workshopsRepository = {
  async list(): Promise<Workshop[]> {
    return db.select().from(workshops).orderBy(workshops.id);
  },

  async findById(id: number): Promise<Workshop | undefined> {
    const [row] = await db.select().from(workshops).where(eq(workshops.id, id));
    return row;
  },

  async create(data: CreateWorkshopBody): Promise<Workshop> {
    const [row] = await db.insert(workshops).values(data).returning();
    return row;
  },

  async update(
    id: number,
    data: UpdateWorkshopBody,
  ): Promise<Workshop | undefined> {
    // drizzle's .set() skips any key whose value is undefined, so this only
    // touches the fields that were actually sent.
    const [row] = await db
      .update(workshops)
      .set(data)
      .where(eq(workshops.id, id))
      .returning();
    return row;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(workshops).where(eq(workshops.id, id));
    return result.changes > 0;
  },
};

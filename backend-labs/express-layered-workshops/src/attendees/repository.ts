// given — you don't write repository code in this lab. Same shape as
// workshops/repository.ts: data access only, no validation, no rules.

import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { attendees } from "../db/schema";

export type Attendee = typeof attendees.$inferSelect;

export const attendeesRepository = {
  async list(): Promise<Attendee[]> {
    return db.select().from(attendees).orderBy(attendees.id);
  },

  async findById(id: number): Promise<Attendee | undefined> {
    const [row] = await db.select().from(attendees).where(eq(attendees.id, id));
    return row;
  },

  async create(data: { name: string; email: string }): Promise<Attendee> {
    const [row] = await db.insert(attendees).values(data).returning();
    return row;
  },

  async update(
    id: number,
    data: { name?: string; email?: string },
  ): Promise<Attendee | undefined> {
    const [row] = await db
      .update(attendees)
      .set(data)
      .where(eq(attendees.id, id))
      .returning();
    return row;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(attendees).where(eq(attendees.id, id));
    return result.changes > 0;
  },
};

// given — you don't write repository code in this lab. Note the last two
// methods: they're still just queries (no rules, no decisions) — but
// they're exactly the building blocks your service.ts needs to *make* its
// decisions (is this workshop full? has this attendee already registered?).
// A repository can expose a query shaped around what the service needs to
// ask, without knowing why it's being asked.

import { and, eq } from "drizzle-orm";

import { db } from "../db/client";
import { registrations } from "../db/schema";

export type Registration = typeof registrations.$inferSelect;
export type RegistrationStatus = "confirmed" | "cancelled";

export const registrationsRepository = {
  async list(filters: { workshopId?: number }): Promise<Registration[]> {
    if (filters.workshopId !== undefined) {
      return db
        .select()
        .from(registrations)
        .where(eq(registrations.workshopId, filters.workshopId))
        .orderBy(registrations.id);
    }
    return db.select().from(registrations).orderBy(registrations.id);
  },

  async findById(id: number): Promise<Registration | undefined> {
    const [row] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));
    return row;
  },

  // for the duplicate-registration check: is there already a *confirmed*
  // registration for this attendee + workshop pair? (a cancelled one
  // doesn't block re-registering.)
  async findConfirmedByWorkshopAndAttendee(
    workshopId: number,
    attendeeId: number,
  ): Promise<Registration | undefined> {
    const [row] = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.workshopId, workshopId),
          eq(registrations.attendeeId, attendeeId),
          eq(registrations.status, "confirmed"),
        ),
      );
    return row;
  },

  // for the capacity check: how many confirmed registrations does this
  // workshop already have?
  async countConfirmedForWorkshop(workshopId: number): Promise<number> {
    const rows = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.workshopId, workshopId),
          eq(registrations.status, "confirmed"),
        ),
      );
    return rows.length;
  },

  async create(data: {
    workshopId: number;
    attendeeId: number;
  }): Promise<Registration> {
    const [row] = await db.insert(registrations).values(data).returning();
    return row;
  },

  async updateStatus(
    id: number,
    status: RegistrationStatus,
  ): Promise<Registration | undefined> {
    const [row] = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .returning();
    return row;
  },
};

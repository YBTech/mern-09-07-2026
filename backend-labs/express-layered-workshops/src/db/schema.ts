import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// this file is fully set up for you — you won't need to touch it, or write
// any SQL/ORM code anywhere in this lab. it's here so you can see the shape
// of the data each layer is working with.

export const workshops = sqliteTable("workshops", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  capacity: integer("capacity").notNull(),
  startsAt: text("starts_at").notNull(), // ISO date string, e.g. "2026-10-01T18:00:00.000Z"
});

export const attendees = sqliteTable("attendees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const registrations = sqliteTable("registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workshopId: integer("workshop_id")
    .notNull()
    .references(() => workshops.id),
  attendeeId: integer("attendee_id")
    .notNull()
    .references(() => attendees.id),
  // "confirmed" | "cancelled" — a cancelled registration frees up a seat,
  // since the capacity check only counts confirmed ones.
  status: text("status").notNull().default("confirmed"),
  registeredAt: text("registered_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

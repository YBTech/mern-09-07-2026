import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// note: schema is defined here with drizzle so we get types + a seed script,
// but the CRUD endpoints below still talk to postgres with raw SQL for now.

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  priceCents: integer("price_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .unique()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// audit trail for POST /inventory/:id/adjust — exists specifically to give
// that transaction a second real write, so ATOMICITY ("all or nothing") has
// something concrete to demonstrate. see inventory/service.ts:adjust().
export const inventoryAdjustments = pgTable("inventory_adjustments", {
  id: serial("id").primaryKey(),
  inventoryId: integer("inventory_id")
    .notNull()
    .references(() => inventory.id),
  delta: integer("delta").notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// backs the Idempotency-Key pattern on POST /inventory (see
// inventory/service.ts:create()). generic on purpose — any endpoint could
// use this table, only inventory's create is wired up to it for now.
export const idempotencyKeys = pgTable("idempotency_keys", {
  key: varchar("key", { length: 255 }).primaryKey(),
  requestBody: jsonb("request_body").notNull(),
  statusCode: integer("status_code").notNull(),
  responseBody: jsonb("response_body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
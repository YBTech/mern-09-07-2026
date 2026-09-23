import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// drizzle client — used everywhere except the products/inventory/orders
// routers, which intentionally use `pool` directly with raw SQL.
export const db = drizzle(pool, { schema });
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// thin wrapper so call sites don't import `pg` directly
export const query = <T extends Record<string, any> = any>(
  text: string,
  params?: unknown[]
) => pool.query<T>(text, params);

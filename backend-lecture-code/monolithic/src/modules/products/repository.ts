import { asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";

import { db } from "../../db/pool";
import { products } from "../../db/schema";
import type {
  CreateProductBody,
  ListProductsQuery,
  UpdateProductBody,
} from "./validation";

export type Product = typeof products.$inferSelect;

const SORT_COLUMNS: Record<string, SQL> = {
  "price-asc-rank": asc(products.priceCents),
  "price-desc-rank": desc(products.priceCents),
  "newest-rank": desc(products.createdAt),
};

// data access only — no HTTP concerns, no business rules, no caching.
export const productsRepository = {
  async list({ q, limit, skip, s }: ListProductsQuery): Promise<Product[]> {
    const filter = q
      ? or(ilike(products.name, `%${q}%`), ilike(products.sku, `%${q}%`))
      : undefined;

    // secondary sort by id keeps pagination stable regardless of which
    // primary sort key was requested
    const orderBy = s ? [SORT_COLUMNS[s], asc(products.id)] : [asc(products.id)];

    return db
      .select()
      .from(products)
      .where(filter)
      .orderBy(...orderBy)
      .limit(limit)
      .offset(skip);
  },

  async findById(id: number): Promise<Product | undefined> {
    const [row] = await db.select().from(products).where(eq(products.id, id));
    return row;
  },

  async create(data: CreateProductBody): Promise<Product> {
    const [row] = await db.insert(products).values(data).returning();
    return row;
  },

  async update(
    id: number,
    data: UpdateProductBody,
  ): Promise<Product | undefined> {
    // drizzle's .set() omits any key whose value is undefined, so this is
    // the same "only touch the fields that were sent" behavior the old
    // raw-SQL COALESCE version had.
    const [row] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return row;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  },
};

import "dotenv/config";

import { db, pool } from "./pool";
import { products, inventory, orders } from "./schema";

// large enough that round-trip latency (not insert speed) is the bottleneck —
// at a few hundred rows, batching vs one-row-at-a-time both finish in ~10ms
// and the difference is noise. at this size it's seconds vs minutes.
const PRODUCT_COUNT = 20_000;
const ORDER_COUNT = 300_000;

// rows per INSERT statement. one multi-row INSERT per batch is dramatically
// faster than one INSERT per row (fewer round trips), and batching keeps any
// single statement well under postgres' ~65535 bind-parameter limit.
const BATCH_SIZE = 2000;

function chunk<T>(rows: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < rows.length; i += size) {
    batches.push(rows.slice(i, i + size));
  }
  return batches;
}

async function seed() {
  // @faker-js/faker is ESM-only; this project is CommonJS, so it's loaded
  // via a dynamic import instead of a static one.
  const { faker } = await import("@faker-js/faker");

  console.log("seeding database...");

  // wipe first so this script is safe to re-run
  await db.delete(orders);
  await db.delete(inventory);
  await db.delete(products);

  // ---- products ----
  const productRows = Array.from({ length: PRODUCT_COUNT }, (_, i) => ({
    sku: `SKU-${String(i + 1).padStart(5, "0")}`,
    name: faker.commerce.productName(),
    priceCents: Math.round(
      Number(faker.commerce.price({ min: 3, max: 300 })) * 100,
    ),
  }));

  const insertedProducts: (typeof products.$inferSelect)[] = [];
  for (const batch of chunk(productRows, BATCH_SIZE)) {
    const rows = await db.insert(products).values(batch).returning();
    insertedProducts.push(...rows);
  }
  console.log(`inserted ${insertedProducts.length} products`);

  // ---- inventory: one row per product ----
  const inventoryRows = insertedProducts.map((p) => ({
    productId: p.id,
    quantity: faker.number.int({ min: 0, max: 250 }),
  }));

  let inventoryCount = 0;
  for (const batch of chunk(inventoryRows, BATCH_SIZE)) {
    await db.insert(inventory).values(batch);
    inventoryCount += batch.length;
  }
  console.log(`inserted ${inventoryCount} inventory rows`);

  // ---- orders: random product + qty + status ----
  const statuses = ["pending", "completed", "cancelled"] as const;
  const orderRows = Array.from({ length: ORDER_COUNT }, () => ({
    productId: faker.helpers.arrayElement(insertedProducts).id,
    quantity: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(statuses),
  }));

  let orderCount = 0;
  for (const batch of chunk(orderRows, BATCH_SIZE)) {
    await db.insert(orders).values(batch);
    orderCount += batch.length;
  }
  console.log(`inserted ${orderCount} orders`);
}

const startedAt = Date.now();

seed()
  .then(() => console.log(`done in ${Date.now() - startedAt}ms`))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

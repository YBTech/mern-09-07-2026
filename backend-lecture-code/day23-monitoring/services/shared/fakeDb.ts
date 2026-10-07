// A pretend database, so the demo needs no Postgres container.
//
// It behaves like a real one in the ways that matter for monitoring:
//   - each query takes a realistic round trip and records a DB span named after the SQL;
//   - there is a CONNECTION POOL with a fixed size. When more queries run at once than there are
//     connections, the extras wait in line. Under load that wait is what makes "the database"
//     slow, even though each query is still fast. See the "DB pool" panels in Grafana.
import { SpanKind } from "@opentelemetry/api";
import { Semaphore } from "./limiter";
import { meter } from "./metrics";
import { jitter, sleep, withSpan } from "./trace";

const POOL_SIZE = Number(process.env.DB_POOL_SIZE ?? 6);
const pool = new Semaphore(POOL_SIZE);

meter
  .createObservableGauge("db.pool.connections.in_use", { unit: "{connection}", description: "Connections currently running a query" })
  .addCallback((r) => r.observe(pool.active));
meter
  .createObservableGauge("db.pool.queries.waiting", { unit: "{query}", description: "Queries waiting for a free connection" })
  .addCallback((r) => r.observe(pool.waiting));
meter
  .createObservableGauge("db.pool.connections.max", { unit: "{connection}", description: "Pool size" })
  .addCallback((r) => r.observe(POOL_SIZE));

const poolWait = meter.createHistogram("db.pool.wait.duration", { unit: "s", description: "Time a query waited for a free connection" });
const queryDuration = meter.createHistogram("db.query.duration", { unit: "s", description: "Query time once it had a connection" });

export async function query<T>(sql: string, latencyMs: number, getRows: () => T): Promise<T> {
  const table = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i)?.[1] ?? "db";
  const operation = sql.trim().split(/\s+/)[0].toUpperCase();

  // Waiting for a connection only gets its own span when it actually had to wait.
  let waitedMs = 0;
  if (pool.active >= POOL_SIZE) {
    waitedMs = await withSpan("db.pool.acquire (waiting for a free connection)", { "db.pool.size": POOL_SIZE }, () => pool.acquire());
  } else {
    await pool.acquire();
  }
  poolWait.record(waitedMs / 1000);

  try {
    return await withSpan(
      `${operation} ${table}`,
      { "db.system": "postgresql", "db.operation": operation, "db.sql.table": table, "db.statement": sql },
      async () => {
        const started = performance.now();
        await sleep(jitter(latencyMs));
        queryDuration.record((performance.now() - started) / 1000, { "db.operation": operation, "db.sql.table": table });
        return getRows();
      },
      SpanKind.CLIENT,
    );
  } finally {
    pool.release();
  }
}

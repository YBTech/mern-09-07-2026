import { Link } from "react-router-dom";
import TopicNav from "../../../components/TopicNav";
import CodeBlock from "../../../components/CodeBlock";

export default function ScalingAndThroughput() {
  return (
    <div className="page notes-page">
      <title>Full SQL — Scaling &amp; Throughput</title>
      <TopicNav day="additional-backend-topics" topic="full-sql" current="scaling-and-throughput" />

      <header className="lecture-header">
        <p className="eyebrow">Full SQL · Advanced</p>
        <h1>Scaling &amp; Throughput</h1>
        <p className="subtitle">
          What you reach for once the query itself is already optimal: batching, pagination,
          partitioning, sharding, replicas, pooling.
        </p>
      </header>

      <p className="callout">
        Everything here costs complexity. Work down the list in order — a missing index is a
        one-line fix, and sharding is a six-month project.
      </p>

      <table className="ref-table">
        <thead>
          <tr>
            <th>Symptom</th>
            <th>Reach for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>One request fires hundreds of statements</td>
            <td>Batch operations</td>
          </tr>
          <tr>
            <td>Page 500 of a list takes 8 seconds</td>
            <td>Keyset pagination</td>
          </tr>
          <tr>
            <td>One table is 900GB and old rows are never read</td>
            <td>Partitioning</td>
          </tr>
          <tr>
            <td>The same row gets queried over and over, rarely changes</td>
            <td>Caching</td>
          </tr>
          <tr>
            <td>Reads are saturating the primary, writes are fine</td>
            <td>Read replicas</td>
          </tr>
          <tr>
            <td>Writes alone exceed what one machine can do</td>
            <td>Sharding</td>
          </tr>
          <tr>
            <td>"too many clients already", or every query pays connection setup</td>
            <td>Connection pooling</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>1. Batch operations</h2>
      <p>
        Every statement is a network round trip plus a parse plus a plan. Doing 1,000 of them in a
        loop is almost always the wrong shape, even when each one is individually fast.
      </p>

      <h3>Batch inserts</h3>
      <CodeBlock
        language="typescript"
        bad={[2, 3, 4]}
        good={[9]}
        code={`// 1,000 round trips
for (const item of items) {
  await pool.query("INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2,$3)",
    [orderId, item.productId, item.quantity]);
}

// 1 round trip — build one multi-row VALUES list with numbered placeholders
const values = items.map((_, i) => \`($1, $\${i * 2 + 2}, $\${i * 2 + 3})\`).join(", ");
const params = [orderId, ...items.flatMap((it) => [it.productId, it.quantity])];
await pool.query(\`INSERT INTO order_items (order_id, product_id, quantity) VALUES \${values}\`, params);`}
      />
      <p className="callout">
        Postgres caps a statement at 65,535 parameters. Chunk large batches — 500–1,000 rows per
        statement is the usual sweet spot; beyond that the gains flatten and memory grows.
      </p>

      <h3>Batch updates</h3>
      <CodeBlock
        language="sql"
        code={`-- one statement, different value per row
UPDATE inventory AS inv
SET quantity_on_hand = v.qty
FROM (VALUES (1, 7, 40), (1, 8, 15), (2, 7, 90)) AS v(store_id, product_id, qty)
WHERE inv.store_id = v.store_id AND inv.product_id = v.product_id;`}
      />

      <h3>Bulk load and chunked delete</h3>
      <CodeBlock
        language="sql"
        code={`-- COPY is 10-100x faster than INSERT for a real bulk load (nightly product feed)
COPY products (sku, name, price_cents) FROM '/tmp/catalog.csv' WITH (FORMAT csv, HEADER true);

-- deleting 40 million rows in one statement holds locks and bloats the WAL.
-- delete in chunks instead, in a loop, committing each time:
DELETE FROM order_status_history
WHERE id IN (
  SELECT id FROM order_status_history
  WHERE created_at < now() - INTERVAL '2 years'
  LIMIT 10000
);`}
      />
      <p>
        Batch reads matter just as much — the <code>= ANY($1::int[])</code> pattern from{" "}
        <Link to="/week3/additional-backend-topics/full-sql/query-optimization">Query Optimization</Link>{" "}
        is the read-side version of this exact idea.
      </p>

      <hr className="section-divider" />

      <h2>2. Pagination: offset vs. keyset</h2>

      <h3>Offset pagination — what everyone writes first</h3>
      <CodeBlock
        language="sql"
        code={`SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 9980;   -- page 500`}
      />
      <div className="concept">
        <p className="concept-label">Concept — two problems, both real</p>
        <ul>
          <li>
            <strong>It gets slower the deeper you go.</strong> The database must produce and discard
            all 9,980 skipped rows before returning 20. Page 1 is instant; page 500 is a full scan
            and sort.
          </li>
          <li>
            <strong>It skips and duplicates rows under writes.</strong> A new order inserted while
            the user is on page 2 shifts everything down one — row 20 slides to position 21 and gets
            shown again on page 3.
          </li>
          <li>
            It is still the right choice when you need a page <em>number</em> and a total count — an
            admin table of 40 pages, say. Just don't let it be your infinite scroll.
          </li>
        </ul>
      </div>

      <h3>Keyset (cursor) pagination — the fix</h3>
      <p>
        Instead of "skip 9,980 rows", say "start after the last row I saw". The index seeks straight
        to that position, so page 500 costs the same as page 1.
      </p>
      <CodeBlock
        language="sql"
        code={`-- page 1
SELECT id, created_at, status FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- page 2: pass back the last row's sort key as the cursor
SELECT id, created_at, status FROM orders
WHERE (created_at, id) < ('2026-03-14 10:02:11+00', 4012)   -- row-value comparison handles ties
ORDER BY created_at DESC, id DESC
LIMIT 20;`}
      />
      <CodeBlock
        language="typescript"
        code={`// the API encodes the cursor so clients treat it as opaque
const cursor = Buffer.from(JSON.stringify({ createdAt: last.created_at, id: last.id })).toString("base64url");
res.json({ orders, nextCursor: orders.length === limit ? cursor : null });

// GET /orders?limit=20&cursor=eyJjcmVhdGVkQXQiOi...`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>Offset</th>
            <th>Keyset</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deep page cost</td>
            <td>Grows linearly with offset</td>
            <td>Constant</td>
          </tr>
          <tr>
            <td>Stable under inserts</td>
            <td>No — skips and repeats</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Jump to page 47</td>
            <td>Yes</td>
            <td>No — next/prev only</td>
          </tr>
          <tr>
            <td>Total page count</td>
            <td>Yes (at the cost of a <code>COUNT(*)</code>)</td>
            <td>Not naturally</td>
          </tr>
          <tr>
            <td>Needs</td>
            <td>Nothing</td>
            <td>An index on the exact sort key, and a unique tiebreaker</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        The sort key must be unique or include a unique tiebreaker (<code>id</code>). Paginating on{" "}
        <code>created_at</code> alone silently loses rows whenever two rows share a timestamp.
      </p>

      <hr className="section-divider" />

      <h2>3. Partitioning</h2>
      <p>
        One logical table, physically stored as several smaller tables. The database routes each
        query to only the partitions that can contain matching rows.
      </p>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE order_status_history (
  id BIGSERIAL,
  order_id INTEGER NOT NULL,
  to_status VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE osh_2026_01 PARTITION OF order_status_history
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE osh_2026_02 PARTITION OF order_status_history
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- a query bounded by the partition key reads ONE partition (partition pruning)
SELECT * FROM order_status_history WHERE created_at >= '2026-02-01' AND created_at < '2026-02-15';`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Splits by</th>
            <th>Fits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>RANGE</code></td>
            <td>A range of values, usually a date</td>
            <td>Time-series: events, logs, status history</td>
          </tr>
          <tr>
            <td><code>LIST</code></td>
            <td>An explicit set of values</td>
            <td>Region, tenant, country</td>
          </tr>
          <tr>
            <td><code>HASH</code></td>
            <td>A hash of the key</td>
            <td>Spreading evenly when there's no natural range</td>
          </tr>
        </tbody>
      </table>
      <div className="concept">
        <p className="concept-label">Concept — what partitioning actually buys</p>
        <ul>
          <li>
            <strong>Pruning:</strong> queries filtered on the partition key touch one small table
            with a small index instead of one huge one.
          </li>
          <li>
            <strong>Instant bulk delete:</strong> <code>DROP TABLE osh_2024_01</code> removes a
            month of data in milliseconds, versus hours for a <code>DELETE</code>.
          </li>
          <li>
            <strong>Cheaper maintenance:</strong> <code>VACUUM</code> (reclaims space left by
            updated/deleted rows — Postgres never overwrites a row in place), <code>REINDEX</code>,
            and backups all run per partition instead of against one giant table.
          </li>
          <li>
            <strong>The catch:</strong> a query that <em>doesn't</em> filter on the partition key
            now scans every partition, and every unique constraint must include the partition key.
            Choose the key from your dominant read pattern.
          </li>
          <li>
            It's still <strong>one database on one machine</strong> — partitioning never adds write
            capacity. That's the difference from sharding.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>4. Sharding</h2>
      <p>
        Splitting rows across <em>separate database servers</em> by a shard key, so each machine
        holds a fraction of the data and takes a fraction of the writes.
      </p>
      <CodeBlock
        language="typescript"
        code={`// the app (or a proxy like Citus/Vitess) picks the server before it picks the query
const shards = [poolShard0, poolShard1, poolShard2, poolShard3];
const shardFor = (customerId: number) => shards[customerId % shards.length];

const { rows } = await shardFor(order.customerId).query(
  "SELECT * FROM orders WHERE customer_id = $1",
  [order.customerId]
);`}
      />
      <div className="concept">
        <p className="concept-label">Concept — choosing the shard key is the whole game</p>
        <ul>
          <li>
            A good key makes almost every query single-shard. Shard the order data by{" "}
            <code>customer_id</code> and "this customer's orders" hits one machine.
          </li>
          <li>
            A bad key makes queries fan out to every shard, and a fan-out query is as slow as the
            slowest shard.
          </li>
          <li>
            <strong>Hot shards:</strong> sharding by region puts half your traffic on one machine if
            half your customers are in one region.
          </li>
          <li>
            <strong>No cross-shard joins or transactions.</strong> They stop being one database, so
            anything spanning shards moves into application code or a two-phase commit you don't
            want to write.
          </li>
          <li>
            <strong>Resharding is brutal.</strong> Changing the key later means moving live data.
            Hash into many logical shards up front and map several onto each physical server.
          </li>
          <li>
            Aggregate reporting across all shards usually moves to a separate warehouse, because it
            can no longer be a single <code>GROUP BY</code>.
          </li>
        </ul>
      </div>
      <p className="callout">
        Shard last. A single well-indexed Postgres instance on modern hardware handles tens of
        thousands of writes per second — most teams that shard did not need to.
      </p>

      <hr className="section-divider" />

      <h2>5. Read replicas</h2>
      <p>
        The primary streams its write-ahead log to one or more replicas that serve read-only
        queries. Most applications read 10–100× more than they write, so this is usually the first
        real scaling step after indexing.
      </p>
      <CodeBlock
        language="typescript"
        code={`const primary = new Pool({ host: "oms-primary.internal" });   // all writes
const replica = new Pool({ host: "oms-replica.internal" });   // most reads

// reporting, catalog browsing, dashboards — staleness of a few hundred ms is fine
const { rows } = await replica.query("SELECT * FROM products WHERE active = true");

// anything the user is about to act on goes to the primary
const { rows: inv } = await primary.query(
  "SELECT quantity_on_hand FROM inventory WHERE store_id = $1 AND product_id = $2",
  [storeId, productId]
);`}
      />
      <div className="concept">
        <p className="concept-label">Concept — replication lag is the only thing to understand</p>
        <ul>
          <li>
            Replication is asynchronous by default: a replica is milliseconds to seconds behind, and
            minutes behind under heavy write load.
          </li>
          <li>
            <strong>Read-your-writes breaks.</strong> A user updates their address, the redirect
            reads from a replica, and they see the old one. Route reads that follow a write in the
            same flow to the primary.
          </li>
          <li>
            Never read inventory or account balances from a replica before a write decision — stale
            stock means overselling.
          </li>
          <li>
            Synchronous replication removes the lag and makes every commit wait for the replica —
            correctness bought with write latency.
          </li>
          <li>
            Replicas also give you failover: promote one when the primary dies. That's availability,
            not extra capacity.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>6. Connection pooling</h2>
      <p>
        A Postgres connection is a separate OS process with several MB of memory. Opening one per
        request costs a TCP handshake plus authentication plus process startup — often more than the
        query itself.
      </p>
      <CodeBlock
        language="typescript"
        bad={[3, 4, 5]}
        good={[10]}
        code={`import { Pool, Client } from "pg";

// a fresh connection per request: handshake + auth + process spawn, every time
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query("SELECT 1");
await client.end();

// one pool for the process, created once at startup, reused by every request
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                       // max connections this process holds
  idleTimeoutMillis: 30_000,     // return idle connections to the OS
  connectionTimeoutMillis: 2_000 // fail fast instead of queueing forever
});

await pool.query("SELECT 1");    // borrow, run, return — transparently`}
      />
      <CodeBlock
        language="typescript"
        code={`// a transaction needs ONE connection for all its statements, so check one out explicitly
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE inventory SET quantity_reserved = quantity_reserved + $1 WHERE id = $2", [3, 42]);
  await client.query("INSERT INTO orders (customer_id, status) VALUES ($1, 'routed')", [7]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();   // without this the connection leaks and the pool eventually starves
}`}
      />
      <div className="concept">
        <p className="concept-label">Concept — sizing the pool</p>
        <ul>
          <li>
            The pool is <strong>per process</strong>. 8 app instances × <code>max: 10</code> = 80
            connections at the database, which must stay under its{" "}
            <code>max_connections</code> (often 100).
          </li>
          <li>
            Bigger is not faster. Past the point where the database is CPU- or disk-bound, more
            concurrent connections just add context switching — a pool of 10–20 per process usually
            beats 100.
          </li>
          <li>
            Serverless breaks this model: every cold start is a new process with a new pool, so
            traffic spikes exhaust <code>max_connections</code>. Put an external pooler
            (PgBouncer, RDS Proxy) in front.
          </li>
          <li>
            PgBouncer in <em>transaction</em> mode hands a connection back after each transaction,
            so hundreds of app connections share a handful of real ones — but session state
            (prepared statements, <code>SET</code>, advisory locks) no longer survives between
            statements.
          </li>
          <li>
            A leaked connection (a missing <code>release()</code>) shows up as requests hanging at
            <code> connectionTimeoutMillis</code> under load, never in development.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>7. Caching</h2>
      <p>
        Read the same row over and over, and most of that work is repeated for nothing —
        cache-aside stores the answer next to the app instead of re-querying every time:
      </p>
      <CodeBlock
        language="typescript"
        code={`const cacheKey = \`product:\${productId}\`;

let product = await redis.get(cacheKey);
if (!product) {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
  product = rows[0];
  await redis.set(cacheKey, JSON.stringify(product), "EX", 300);   // 5 min TTL
} else {
  product = JSON.parse(product);
}`}
      />
      <div className="concept">
        <p className="concept-label">Concept — what to cache, and what never to</p>
        <ul>
          <li>
            Cache what's <strong>read far more than it's written</strong> and can tolerate being a
            few minutes stale — a product catalog, not an inventory count.
          </li>
          <li>
            <strong>Invalidate on write.</strong> Every update to a cached row must also clear or
            refresh its cache entry, or it serves stale data forever, not just for the TTL.
          </li>
          <li>
            For read-heavy, rarely-changing data, caching is often a bigger win than the next
            index — the query never runs at all.
          </li>
          <li>
            Never cache anything a write decision depends on. Reading a stale{" "}
            <code>quantity_on_hand</code> from cache is the same overselling bug replication
            causes.
          </li>
        </ul>
      </div>
      <p>
        This is the exact shape day 13 builds into the OMS itself, as a real cache-aside layer in
        front of the product catalog.
      </p>

      <hr className="section-divider" />

      <h2>8. The order to actually do these in</h2>
      <ol>
        <li>Fix N+1 and add the missing index. Most "scaling problems" end here.</li>
        <li>Batch the writes, and use keyset pagination for anything infinite-scrolled.</li>
        <li>Pool connections properly — one pool per process, sized, with a pooler in front if serverless.</li>
        <li>Cache what's read constantly and changes rarely — the pattern above, day 13's Redis layer.</li>
        <li>Add a read replica and route non-critical reads to it.</li>
        <li>Partition the one giant time-series table.</li>
        <li>Only then shard.</li>
      </ol>
    </div>
  );
}

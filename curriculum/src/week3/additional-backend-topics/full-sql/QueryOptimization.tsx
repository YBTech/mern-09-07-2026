import { Link } from "react-router-dom";
import TopicNav from "../../../components/TopicNav";
import CodeBlock from "../../../components/CodeBlock";

export default function QueryOptimization() {
  return (
    <div className="page notes-page">
      <title>Full SQL — Query Optimization</title>
      <TopicNav day="additional-backend-topics" topic="full-sql" current="query-optimization" />

      <header className="lecture-header">
        <p className="eyebrow">Full SQL · Advanced</p>
        <h1>Query Optimization</h1>
        <p className="subtitle">
          N+1 in every disguise, <code>EXPLAIN ANALYZE</code> line by line, and indexes in depth.
        </p>
      </header>

      <p className="callout">
        Optimization order that actually works: find the slow query → read its plan → fix the query
        or add the index → re-read the plan. Never add an index because a query "feels slow".
      </p>

      <hr className="section-divider" />

      <h2>1. The N+1 query problem</h2>
      <p>
        One query fetches a list of N rows; then one more query runs <em>per row</em> to fetch its
        related data. 1 query becomes 1 + N, and each one is a full network round trip.
      </p>
      <CodeBlock
        language="typescript"
        code={`// 1 query for the orders...
const { rows: orders } = await pool.query("SELECT * FROM orders WHERE status = 'packed'");

// ...then N more, one per order
for (const order of orders) {
  const { rows: items } = await pool.query(
    "SELECT * FROM order_items WHERE order_id = $1",
    [order.id]
  );
  order.items = items;
}
// 200 packed orders = 201 queries = 201 round trips`}
      />

      <h3>Why it hides so well</h3>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            It never throws. The results are <em>correct</em> — just produced the slowest possible
            way.
          </li>
          <li>
            With 5 seed rows in dev it costs ~3ms. With 5,000 rows in production it costs 5,000
            round trips, and the graph looks like a wall.
          </li>
          <li>
            It scales with <em>data</em>, not with traffic — so it passes every load test run against
            a small database.
          </li>
          <li>
            Each round trip is ~0.5–2ms even on a fast local network. The database is not the
            bottleneck; the number of trips is.
          </li>
        </ul>
      </div>

      <h3>The four disguises</h3>
      <CodeBlock
        language="typescript"
        code={`// 1. The obvious loop
for (const o of orders) await getItems(o.id);

// 2. Promise.all — still N queries, just concurrent. Better latency, same load on the pool.
await Promise.all(orders.map((o) => getItems(o.id)));

// 3. Hidden in a helper — the query is one call stack deeper, so the loop looks innocent
const enriched = orders.map(async (o) => ({ ...o, customer: await findCustomer(o.customerId) }));

// 4. Lazy loading in an ORM — accessing a relation property fires a query
for (const order of orders) console.log(order.customer.name); // one query per access`}
      />

      <h3>Fix A — one join</h3>
      <CodeBlock
        language="typescript"
        code={`const { rows } = await pool.query(\`
  SELECT o.id AS order_id, o.status,
         oi.product_id, oi.quantity, p.name AS product_name
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  WHERE o.status = 'packed'
\`);

// the join returns one row per ITEM, so regroup in JS:
const byOrder = new Map();
for (const r of rows) {
  if (!byOrder.has(r.order_id)) byOrder.set(r.order_id, { id: r.order_id, status: r.status, items: [] });
  byOrder.get(r.order_id).items.push({ productId: r.product_id, name: r.product_name, quantity: r.quantity });
}`}
      />

      <h3>Fix B — two queries, batched by id</h3>
      <p>
        Better when the joined side is wide or the multiplication is ugly: fetch the parents, then
        fetch <em>all</em> children in one query with <code>= ANY</code>.
      </p>
      <CodeBlock
        language="typescript"
        code={`const { rows: orders } = await pool.query("SELECT * FROM orders WHERE status = 'packed'");
const ids = orders.map((o) => o.id);

const { rows: items } = await pool.query(
  "SELECT * FROM order_items WHERE order_id = ANY($1::int[])",
  [ids]
);

const itemsByOrder = new Map();
for (const item of items) {
  if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
  itemsByOrder.get(item.order_id).push(item);
}
for (const order of orders) order.items = itemsByOrder.get(order.id) ?? [];
// 2 queries, regardless of how many orders came back`}
      />
      <p className="callout">
        <code>= ANY($1::int[])</code> takes a real array parameter — unlike building{" "}
        <code>IN (1,2,3,...)</code> by string concatenation, which is both a SQL-injection risk and a
        new query plan for every distinct list length.
      </p>

      <h3>Fix C — tell the ORM to eager-load</h3>
      <p>
        <strong>Lazy loading</strong> fetches a relation only when you access it — one query per
        access, which is what turns the loop into N+1. <strong>Eager loading</strong> fetches it
        upfront, in the same query or one batched query alongside the parent rows.
      </p>
      <CodeBlock
        language="typescript"
        code={`// Prisma
const orders = await prisma.order.findMany({
  where: { status: "packed" },
  include: { items: { include: { product: true } } },  // 1-2 queries, not 1+N
});

// TypeORM
const orders = await repo.find({ where: { status: "packed" }, relations: ["items", "items.product"] });

// Sequelize
const orders = await Order.findAll({ where: { status: "packed" }, include: [{ model: OrderItem }] });`}
      />
      <p>
        Every ORM defaults to lazy loading, and every ORM has a way to log the SQL it emits. Turn
        that on in development — the count of statements per request is the only reliable N+1
        detector.
      </p>

      <hr className="section-divider" />

      <h2>2. Reading <code>EXPLAIN ANALYZE</code></h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>Does it run the query?</th>
            <th>Tells you</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>EXPLAIN</code></td>
            <td>No</td>
            <td>The plan the optimizer chose, and its cost estimates</td>
          </tr>
          <tr>
            <td><code>EXPLAIN ANALYZE</code></td>
            <td><strong>Yes</strong></td>
            <td>The plan plus actual timing and actual row counts</td>
          </tr>
          <tr>
            <td><code>EXPLAIN (ANALYZE, BUFFERS)</code></td>
            <td>Yes</td>
            <td>Also how many pages came from cache vs. disk</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        <code>EXPLAIN ANALYZE</code> on an <code>UPDATE</code> or <code>DELETE</code> really performs
        it. Wrap it in <code>BEGIN; ... ROLLBACK;</code> when you're testing a write.
      </p>

      <h3>A plan, annotated</h3>
      <CodeBlock
        language="sql"
        code={`EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'packed'
ORDER BY o.created_at DESC
LIMIT 20;`}
      />
      <CodeBlock
        language="plaintext"
        code={`Limit  (cost=48210.55..48210.60 rows=20 width=36) (actual time=812.441..812.449 rows=20 loops=1)
  ->  Sort  (cost=48210.55..48520.13 rows=123832 width=36) (actual time=812.439..812.443 rows=20 loops=1)
        Sort Key: o.created_at DESC
        Sort Method: top-N heapsort  Memory: 27kB
        ->  Hash Join  (cost=1932.00..44907.31 rows=123832 width=36) (actual time=18.204..770.113 rows=124019 loops=1)
              Hash Cond: (o.customer_id = c.id)
              ->  Seq Scan on orders o  (cost=0.00..40521.00 rows=123832 width=12) (actual time=0.031..690.442 rows=124019 loops=1)
                    Filter: ((status)::text = 'packed'::text)
                    Rows Removed by Filter: 1876981
              ->  Hash  (cost=1200.00..1200.00 rows=58560 width=28) (actual time=18.002..18.003 rows=58560 loops=1)
                    ->  Seq Scan on customers c  (cost=0.00..1200.00 rows=58560 width=28)
  Buffers: shared hit=1204 read=20918
Planning Time: 0.214 ms
Execution Time: 812.503 ms`}
      />

      <div className="concept">
        <p className="concept-label">Concept — how to read it</p>
        <ul>
          <li>
            <strong>Read inside out, bottom up.</strong> The most indented node runs first; each{" "}
            <code>-&gt;</code> feeds its parent.
          </li>
          <li>
            <strong><code>cost=start..total</code></strong> is the planner's arbitrary unit guess —
            useful only for comparing plans, never as milliseconds.
          </li>
          <li>
            <strong><code>actual time=first..last</code></strong> is real milliseconds, and it is{" "}
            <em>per loop</em>. Multiply by <code>loops</code> for the true cost of that node.
          </li>
          <li>
            <strong><code>rows=</code> estimated vs. <code>rows=</code> actual</strong> is the single
            most valuable number. An order-of-magnitude gap means the planner is working from bad
            statistics and probably picked the wrong plan — run <code>ANALYZE orders;</code>.
          </li>
          <li>
            <strong><code>Rows Removed by Filter</code></strong> — here 1.87M rows were read and
            thrown away. That is the smoking gun for a missing index.
          </li>
          <li>
            <strong><code>Buffers: shared hit</code> vs. <code>read</code></strong> — hit came from
            cache, read came from disk. 20,918 disk pages is where the 812ms went.
          </li>
        </ul>
      </div>

      <h3>The node types you'll actually see</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>What it does</th>
            <th>Good when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Seq Scan</code></td>
            <td>Reads every row in the table</td>
            <td>Small tables, or when you genuinely need most rows</td>
          </tr>
          <tr>
            <td><code>Index Scan</code></td>
            <td>Walks the index, then fetches each matching row from the table</td>
            <td>Few matching rows (high selectivity)</td>
          </tr>
          <tr>
            <td><code>Index Only Scan</code></td>
            <td>Answers entirely from the index — never touches the table</td>
            <td>The index covers every column the query needs</td>
          </tr>
          <tr>
            <td><code>Bitmap Heap Scan</code></td>
            <td>Collects matching row locations, then reads them in disk order</td>
            <td>Medium number of matches — too many for Index Scan, too few for Seq</td>
          </tr>
          <tr>
            <td><code>Nested Loop</code></td>
            <td>For each outer row, look up matches in the inner one</td>
            <td>Outer side is small <em>and</em> the inner side is indexed</td>
          </tr>
          <tr>
            <td><code>Hash Join</code></td>
            <td>Builds a hash table of one side, probes it with the other</td>
            <td>Both sides large, join on equality</td>
          </tr>
          <tr>
            <td><code>Merge Join</code></td>
            <td>Sorts both sides, walks them in step</td>
            <td>Both sides already sorted on the join key</td>
          </tr>
          <tr>
            <td><code>Sort</code></td>
            <td>Sorts rows; <code>Sort Method: external merge</code> means it spilled to disk</td>
            <td>Never great — an index on the sort key can remove it entirely</td>
          </tr>
        </tbody>
      </table>

      <h3>The same query, after an index</h3>
      <CodeBlock
        language="sql"
        code={`CREATE INDEX orders_status_created_idx ON orders (status, created_at DESC);`}
      />
      <CodeBlock
        language="plaintext"
        code={`Limit  (cost=0.43..18.72 rows=20 width=36) (actual time=0.048..0.291 rows=20 loops=1)
  ->  Nested Loop  (cost=0.43..113250.19 rows=123832 width=36) (actual time=0.047..0.286 rows=20 loops=1)
        ->  Index Scan using orders_status_created_idx on orders o  (actual time=0.028..0.061 rows=20 loops=1)
              Index Cond: ((status)::text = 'packed'::text)
        ->  Index Scan using customers_pkey on customers c  (actual time=0.008..0.008 rows=1 loops=20)
              Index Cond: (id = o.customer_id)
Planning Time: 0.288 ms
Execution Time: 0.331 ms`}
      />
      <p>
        812ms → 0.3ms. Three things changed: the <code>Seq Scan</code> became an{" "}
        <code>Index Scan</code>, the <code>Sort</code> disappeared entirely (the index is already in{" "}
        <code>created_at DESC</code> order), and the <code>Hash Join</code> became a{" "}
        <code>Nested Loop</code> that only runs 20 times because <code>LIMIT 20</code> can now stop
        early.
      </p>
      <p className="callout">
        Removing the <code>Sort</code> is often the bigger win. An index that matches your{" "}
        <code>ORDER BY</code> lets <code>LIMIT</code> stop after 20 rows instead of sorting 124,000.
      </p>

      <h3>Red flags, in priority order</h3>
      <ol>
        <li><code>Seq Scan</code> with a large <code>Rows Removed by Filter</code> — missing index.</li>
        <li>Estimated rows off from actual by 10× or more — stale statistics, run <code>ANALYZE</code>.</li>
        <li><code>Sort Method: external merge Disk: …kB</code> — the sort spilled; raise <code>work_mem</code> or index the sort key.</li>
        <li>A <code>Nested Loop</code> with a high <code>loops=</code> count over a <code>Seq Scan</code> — the database's own N+1.</li>
        <li>Big <code>Buffers: read</code> relative to <code>hit</code> — the working set doesn't fit in cache.</li>
      </ol>

      <hr className="section-divider" />

      <h2>3. Indexes in depth</h2>

      <h3>What a B-tree index actually is</h3>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            A separate, sorted structure holding <em>(indexed values → row location)</em>, kept in
            sync by the database on every write.
          </li>
          <li>
            It's a balanced tree, so a lookup in a 100-million-row table takes ~4 page reads instead
            of scanning 100 million rows.
          </li>
          <li>
            Because it's sorted, it also serves range queries (<code>&gt;</code>,{" "}
            <code>BETWEEN</code>), <code>ORDER BY</code> on the same columns, and{" "}
            <code>MIN</code>/<code>MAX</code>.
          </li>
          <li>
            A primary key gets an index automatically. A foreign key <strong>does not</strong> — in
            Postgres you must create it yourself, and missing FK indexes are a top cause of slow
            joins and slow cascading deletes.
          </li>
        </ul>
      </div>

      <h3>Composite indexes and the leftmost-prefix rule</h3>
      <CodeBlock
        language="sql"
        code={`CREATE INDEX inventory_store_product_idx ON inventory (store_id, product_id);`}
      />
      <CodeBlock
        language="sql"
        good={[2, 3]}
        bad={[5]}
        code={`-- usable by (store_id, product_id):
SELECT * FROM inventory WHERE store_id = 1 AND product_id = 2;  -- both columns: ideal
SELECT * FROM inventory WHERE store_id = 1;                     -- leftmost prefix: still uses it

SELECT * FROM inventory WHERE product_id = 2;                   -- skips the leading column: unusable`}
      />
      <p>
        Think of a phone book sorted by (last name, first name): you can find "Chen", and "Chen,
        Felix" — but not "everyone named Felix". Column order in a composite index is a design
        decision, not an alphabetical one.
      </p>
      <p className="callout">
        Order the columns: equality filters first, then the range/sort column last. For{" "}
        <code>WHERE status = 'packed' ORDER BY created_at DESC</code>, that's{" "}
        <code>(status, created_at DESC)</code> — and one composite index beats two single-column
        ones every time the query filters on both.
      </p>

      <h3>Covering / index-only scans</h3>
      <CodeBlock
        language="sql"
        code={`-- the index holds every column the query needs, so the table is never touched
CREATE INDEX orders_status_created_id_idx ON orders (status, created_at) INCLUDE (customer_id);

SELECT customer_id FROM orders WHERE status = 'packed' ORDER BY created_at;
-- plan: Index Only Scan`}
      />

      <h3>Select only the columns you need</h3>
      <CodeBlock
        language="sql"
        bad={[1]}
        good={[4]}
        code={`SELECT * FROM orders WHERE status = 'packed' ORDER BY created_at;
-- every column — Postgres must fetch the actual table row, no index-only scan possible

SELECT customer_id FROM orders WHERE status = 'packed' ORDER BY created_at;
-- only what the index above already holds — Index Only Scan, table never touched`}
      />
      <p className="callout">
        <code>SELECT *</code> isn't just extra bytes over the wire — it can silently turn an{" "}
        <code>Index Only Scan</code> back into a regular <code>Index Scan</code>, because no index
        can cover a column list it doesn't know yet.
      </p>

      <h3>Partial and expression indexes</h3>
      <CodeBlock
        language="sql"
        code={`-- partial: index only the rows you actually query. Tiny index, cheap writes.
CREATE INDEX orders_open_idx ON orders (created_at)
WHERE status IN ('placed', 'routed', 'packed');

-- expression: index the computed value, so the query can use it
CREATE INDEX customers_lower_email_idx ON customers (LOWER(email));`}
      />
      <CodeBlock
        language="sql"
        bad={[2]}
        good={[3]}
        code={`-- given only a plain index on (email):
SELECT * FROM customers WHERE LOWER(email) = 'a@b.com';  -- column wrapped in a function: index unusable
SELECT * FROM customers WHERE email = 'a@b.com';         -- Index Scan

-- with customers_lower_email_idx above, the first form becomes an Index Scan too`}
      />

      <h3>Index types beyond B-tree</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Built for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>BTREE</code> (default)</td>
            <td>Equality, ranges, sorting — almost everything</td>
          </tr>
          <tr>
            <td><code>GIN</code></td>
            <td>JSONB containment, array membership, full-text search</td>
          </tr>
          <tr>
            <td><code>GiST</code></td>
            <td>Geometric / geographic data, range overlap</td>
          </tr>
          <tr>
            <td><code>BRIN</code></td>
            <td>Huge tables with naturally ordered data (append-only timestamps) — tiny index</td>
          </tr>
          <tr>
            <td><code>HASH</code></td>
            <td>Equality only; rarely worth it over B-tree</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="sql"
        code={`CREATE INDEX orders_carrier_meta_idx ON orders USING GIN (carrier_meta);
SELECT * FROM orders WHERE carrier_meta @> '{"carrier": "UPS"}';`}
      />

      <h3><code>LIKE</code> vs. full-text search</h3>
      <CodeBlock
        language="sql"
        bad={[1]}
        good={[4, 5]}
        code={`SELECT * FROM order_status_history WHERE note LIKE '%damaged%';
-- a leading wildcard can't use a B-tree index — this is always a Seq Scan, however it's indexed

CREATE INDEX osh_note_fts_idx ON order_status_history USING GIN (to_tsvector('english', note));
SELECT * FROM order_status_history
WHERE to_tsvector('english', note) @@ to_tsquery('english', 'damaged');
-- Index Scan, and it matches "damage", "damaged", "damaging" — not just the exact substring`}
      />
      <p className="callout">
        Full-text search is a different question than <code>LIKE</code>, not just a faster version
        of it — it matches words and their forms, ranked by relevance, instead of a literal
        substring.
      </p>

      <h3>Why an index you created isn't being used</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The column is wrapped in a function or a cast</td>
            <td>Expression index, or rewrite the predicate</td>
          </tr>
          <tr>
            <td>Type mismatch (<code>bigint</code> column, string parameter)</td>
            <td>Cast the parameter, not the column</td>
          </tr>
          <tr>
            <td>Leading column of a composite index isn't in the <code>WHERE</code></td>
            <td>Reorder the index, or add one for that access pattern</td>
          </tr>
          <tr>
            <td><code>LIKE '%mug'</code> — leading wildcard</td>
            <td>Trigram (<code>pg_trgm</code>) index, or full-text search</td>
          </tr>
          <tr>
            <td>The query matches most of the table (low selectivity)</td>
            <td>Nothing — a Seq Scan really is faster, and the planner is right</td>
          </tr>
          <tr>
            <td>Stale statistics after a big data load</td>
            <td><code>ANALYZE orders;</code></td>
          </tr>
          <tr>
            <td>The table is small enough to fit in a few pages</td>
            <td>Nothing — test on production-sized data, not on 50 seed rows</td>
          </tr>
        </tbody>
      </table>

      <h3>The cost of an index</h3>
      <div className="concept">
        <p className="concept-label">Concept — indexes are not free</p>
        <ul>
          <li>
            Every <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> must update{" "}
            <em>every</em> index on that table. Ten indexes make writes roughly an order of
            magnitude more expensive.
          </li>
          <li>They take disk space, and they compete for the same cache as the table data.</li>
          <li>
            Unused indexes are pure loss. <code>pg_stat_user_indexes.idx_scan = 0</code> after a
            month of production traffic means drop it.
          </li>
          <li>
            Build them with <code>CREATE INDEX CONCURRENTLY</code> in production — a plain{" "}
            <code>CREATE INDEX</code> locks the table against writes for the whole build.
          </li>
        </ul>
      </div>
      <p>
        Neither of the below helps until something is actually being measured. Two settings turn
        that on:
      </p>
      <CodeBlock
        language="plaintext"
        code={`log_min_duration_statement = 100     -- log any statement slower than 100ms, with its duration
shared_preload_libraries = 'pg_stat_statements'  -- enables the extension queried below`}
      />
      <CodeBlock
        language="sql"
        code={`-- which indexes are earning their keep?
SELECT relname AS table, indexrelname AS index, idx_scan AS times_used,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- which queries are actually slow? (requires pg_stat_statements)
SELECT calls, round(mean_exec_time::numeric, 2) AS avg_ms, query
FROM pg_stat_statements
ORDER BY mean_exec_time * calls DESC
LIMIT 20;`}
      />
      <p className="callout">
        Order that list by <code>total</code> time, not average: a 40ms query called 2 million times
        a day costs far more than a 3-second report someone runs on Mondays.
      </p>

      <hr className="section-divider" />

      <h2>4. A working checklist</h2>
      <ol>
        <li>Log the SQL your ORM emits in development. Count statements per request — that finds N+1.</li>
        <li>Find the real offenders with <code>pg_stat_statements</code>, ordered by total time.</li>
        <li><code>EXPLAIN (ANALYZE, BUFFERS)</code> the offender on production-sized data.</li>
        <li>Fix the query shape first — a join or a batch beats any index.</li>
        <li>Then index: equality columns first, sort column last, only on columns you filter or join on.</li>
        <li>Re-run the plan and confirm the node type changed. Keep the before/after in the PR.</li>
        <li>Check what the new index cost your writes, and drop any index nothing scans.</li>
      </ol>
      <p>
        When a single node can't go any faster, the problem stops being the query and becomes
        capacity — that's{" "}
        <Link to="/week3/additional-backend-topics/full-sql/scaling-and-throughput">
          Scaling &amp; Throughput
        </Link>.
      </p>
    </div>
  );
}
